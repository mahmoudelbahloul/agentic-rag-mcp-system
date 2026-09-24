import OpenAI from 'openai'

class OpenAIProvider {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey
    this.modelName = modelName

    if (!this.apiKey) {
      throw new Error('API key is required for OpenAIProvider')
    }
    if (!this.modelName) {
      throw new Error('Model name is required for OpenAIProvider')
    }

    this.openai = new OpenAI({ apiKey: this.apiKey })
  }

  async generateResponse(prompt) {
    try {
      const response = await this.openai.responses.create({
        model: this.modelName,
        input: prompt,
      })

      return response.outputText || 'No response generated.'
    } catch (error) {
      console.error('Error generating response from OpenAIProvider:', error)
      throw new Error(`Error generating response: ${error.message}`)
    }
  }

  async generateEmbedding(data) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: data,
        encoding_format: 'float',
      })

      return response.data.map((item) => item.embedding)
    } catch (error) {
      console.error('Error generating embedding from OpenAIProvider:', error)
      throw error
    }
  }
}

export default OpenAIProvider