import { useEffect, useRef } from 'react'
import type { Message } from '../types/chat'
import '../styles/scrollbar.css'

interface ChatMessagesProps {
  messages: Message[]
  loading: boolean
}

export function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollTo({ top: messagesEndRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const isEmpty = messages.length === 0

  return (
    <div
      ref={messagesEndRef}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-7"
    >
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-3xl text-white shadow-xl shadow-blue-400/40">
            <i className="bi bi-stars" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl dark:text-slate-100">
            How can I help you today?
          </h2>
          <p className="mt-3 max-w-sm text-sm text-slate-500 sm:text-base dark:text-slate-400">
            Ask me anything — ideas, explanations, or a quick chat. I'm here whenever you're ready.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user'
                ? 'flex justify-end'
                : 'flex justify-start'
            }
          >
            <div
              className={
                message.role === 'user'
                  ? 'max-w-[80%] rounded-3xl bg-gradient-to-br from-teal-400/90 to-blue-500/90 px-5 py-3 text-sm leading-relaxed text-white shadow-md shadow-blue-400/30 sm:text-base'
                  : 'max-w-[80%] rounded-3xl bg-white/80 px-5 py-3 text-sm leading-relaxed text-slate-700 shadow-md shadow-slate-300/40 sm:text-base whitespace-pre-wrap dark:bg-slate-800/80 dark:text-slate-100 dark:shadow-black/30'
              }
            >
              {message.text}
            </div>
          </div>
        ))
      )}

      {loading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-3 rounded-3xl bg-white/80 px-5 py-3 text-sm text-slate-500 shadow-md shadow-slate-300/40 dark:bg-slate-800/80 dark:text-slate-400 dark:shadow-black/30">
            <span className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s] dark:bg-slate-500" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s] dark:bg-slate-500" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
            </span>
            Jarvis Bot is typing...
          </div>
        </div>
      )}
    </div>
  )
}
