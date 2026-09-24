# ai-chat-app-backend

Express backend for the chat app, using Retrieval-Augmented Generation (RAG). For each `POST /api/chat` it embeds the user's question and the FAQ answers in `data/faqs.json`, ranks them by cosine similarity, and sends the top two matches to the LLM as context. Gemini is the default provider, and OpenAI can be selected per request with `"model": "openai"`.

## Run

```bash
npm install
cp .env.example .env   # set GEMINI_API_KEY and GEMINI_MODEL
npm run dev            # http://localhost:3000
```

## Structure

```
server.js              # Express app, mounts /api
src/chatRouter.js      # POST /api/chat, provider selection, RAG flow
src/geminiProvider.js  # Gemini generation + embeddings
src/OpenAIProvider.js  # OpenAI generation + embeddings
src/rag.js             # Knowledge-base loading, cosine ranking, prompt building
data/faqs.json         # FAQ knowledge base used for retrieval
```
