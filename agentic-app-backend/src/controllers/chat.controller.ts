import type { Request, Response, NextFunction } from 'express'
import Gemini from '../services/gemini.service.ts'

class ChatController {
  static async generateResponse(req: Request, res: Response, next: NextFunction) {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    try {
      const response = await Gemini.generateResponse(message)

      res.json({ reply: response })
    } catch (error: any) {
      console.error('Error generating response:', error)
      res.status(500).json({ error: 'Failed to get a response from the AI.' })
    }
  }
}

export default ChatController
