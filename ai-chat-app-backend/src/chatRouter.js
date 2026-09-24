import express from 'express'
import GeminiProvider from './geminiProvider.js'
import OpenAIProvider from './OpenAIProvider.js'
import RagProvider from './rag.js'

const router = express.Router()
const rag = new RagProvider()

// ============================================================
// 🟢 القسم 1: إعداد الـ Providers المتاحة
// عشان تضيف provider جديد (زي Groq مثلاً)، الخطوات هنا:
//   1. اعمل import للكلاس الجديد فوق (زي GeminiProvider/OpenAIProvider)
//   2. ضيف حالة جديدة في createLLMProvider() تحت
// ============================================================

function createLLMProvider(modelName) {
  if (modelName === 'gemini') {
    return new GeminiProvider(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL)
  }

  if (modelName === 'openai') {
    return new OpenAIProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL)
  }

  // 👉 لإضافة provider جديد، ضيف حالة زي دي:
  // if (modelName === 'groq') {
  //   return new GroqProvider(process.env.GROQ_API_KEY, process.env.GROQ_MODEL)
  // }

  throw new Error(`Unsupported model provider: ${modelName}`)
}

// ============================================================
// 🟡 القسم 2: التعامل مع اختلافات الـ embedding بين الـ Providers
// بعض الـ providers (زي Gemini) بتحتاج "taskType"، والبعض (زي OpenAI) لأ.
// لو الـ provider الجديد محتاج معاملة خاصة زي كده، ضيفها هنا بس.
// ============================================================

async function generateQueryEmbedding(llmProvider, message) {
  if (llmProvider instanceof GeminiProvider) {
    return llmProvider.generateEmbedding(message, 'RETRIEVAL_QUERY')
  }

  // 👉 provider جديد محتاج معاملة خاصة؟ ضيف شرط زي:
  // if (llmProvider instanceof GroqProvider) {
  //   return llmProvider.generateEmbedding(message, { someSpecialOption: true })
  // }

  return llmProvider.generateEmbedding(message)
}

async function generateFaqEmbeddings(llmProvider, faqData) {
  const answers = faqData.map((item) => item.answer)

  if (llmProvider instanceof GeminiProvider) {
    return llmProvider.generateEmbedding(answers, 'RETRIEVAL_DOCUMENT')
  }

  return llmProvider.generateEmbedding(answers)
}

// ============================================================
// 🔵 القسم 3: الـ Route نفسه — من غير أي كود خاص بـ provider معين
// ده الجزء اللي المفروض متلمسوش أبدًا لما تضيف provider جديد
// ============================================================

router.post('/chat', async (req, res) => {
  const { message, model } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const modelName = model || 'gemini'

  console.log(`Received message: ${message} (provider: ${modelName})`)

  try {
    const llmProvider = createLLMProvider(modelName)

    // 1. تحويل سؤال اليوزر لـ vector
    const queryEmbedding = await generateQueryEmbedding(llmProvider, message)
    const queryVector = queryEmbedding[0]

    // 2. جلب بيانات الـ FAQ وتحويلها لـ vectors
    const faqData = rag.fetchDocumentData('faqs.json')
    const faqEmbeddings = await generateFaqEmbeddings(llmProvider, faqData)

    const faqVectors = faqData.map((faq, index) => ({
      ...faq,
      vector: faqEmbeddings[index],
    }))

    // 3. تجهيز الـ prompt وتوليد الرد النهائي
    const prompt = rag.prepareRagPrompt(message, queryVector, faqVectors)
    const response = await llmProvider.generateResponse(prompt)

    console.log(`Generated response: ${response}`)

    res.json({ reply: response })
  } catch (error) {
    console.error('Error generating response:', error)
    res.status(500).json({ error: 'Failed to get a response from the AI.' })
  }
})

export default router