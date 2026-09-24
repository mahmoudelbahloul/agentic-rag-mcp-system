import { useCallback, useEffect, useRef, useState } from 'react'
import type { Message } from '../types/chat'
import { sendMessageToLLM } from '../api/chat.api'

/**
 * Central chat state: message history, loading + error flags.
 * All mutations go through here so the view stays dumb.
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mirror the latest loading value so sendMessage can stay referentially
  // stable ([] deps) while still guarding against concurrent sends.
  const loadingRef = useRef(loading)
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loadingRef.current) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setError(null)
    setLoading(true)

    const run = async () => {
      try {
        const response = await sendMessageToLLM(trimmed)
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'bot',
          text: response.reply,
        }
        setMessages((prev) => [...prev, botMessage])
      } catch (err) {
        if (err instanceof Error) setError(err.message)
        else setError('Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return { messages, loading, error, sendMessage }
}
