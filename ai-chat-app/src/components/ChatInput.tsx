import { useState } from 'react'

interface ChatInputProps {
  sendMessage: (text: string) => void
  loading: boolean
  error: string | null
}

export function ChatInput({ sendMessage, loading, error }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(input)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-7 sm:py-6">
      {error && (
        <div className="mb-3 w-fit rounded-full bg-red-100/80 px-4 py-2 text-sm text-red-600 shadow-sm shadow-red-300/40 dark:bg-red-950/40 dark:text-red-300 dark:shadow-black/20">
          {error}
        </div>
      )}
      <fieldset
        disabled={loading}
        className="flex min-w-0 items-center gap-3 disabled:opacity-60"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          aria-label="Message"
          className="min-w-0 flex-1 rounded-full bg-white/70 px-5 py-3 text-sm text-slate-700 shadow-md shadow-slate-300/40 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 sm:text-base dark:bg-slate-800/70 dark:text-slate-100 dark:shadow-black/30 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-lg text-white shadow-lg shadow-blue-400/40 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <i className="bi bi-send-fill" />
        </button>
      </fieldset>
    </form>
  )
}
