import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private static instance: GeminiService;

  private readonly modelName: string;
  private readonly genAI: GoogleGenAI;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL;

    if (!apiKey) {
      throw new Error("API key is required for GeminiService");
    }

    if (!modelName) {
      throw new Error("Model name is required for GeminiService");
    }

    this.modelName = modelName;
    this.genAI = new GoogleGenAI({ apiKey });
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }

    return GeminiService.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
        // config: {
        //   systemInstruction: "You are a cat. Your name is Neko.",
        //   thinkingConfig: {
        //     thinkingBudget: 0, // Disables thinking
        //   },
        // },
      });

      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response from GeminiService:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateEmbedding(data: string | string[], taskType = 'RETRIEVAL_QUERY') {
    try {
      const response = await this.genAI.models.embedContent({
        model: 'text-embedding-004',
        contents: data,
        config: {
          taskType: taskType,
        },
      })

      return response.embeddings!.map((e) => e.values!)
    } catch (error: any) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }
}

const Gemini = GeminiService.getInstance();

export default Gemini;
