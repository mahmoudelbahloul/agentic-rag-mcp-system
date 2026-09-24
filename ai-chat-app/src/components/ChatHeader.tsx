export function ChatHeader() {
  return (
    <header className="flex items-center gap-4 bg-white/40 px-5 py-5 sm:px-7 dark:bg-white/5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-xl text-white shadow-lg shadow-blue-400/40">
        <i className="bi bi-chat-dots-fill" />
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">
          Jarvis Bot
        </h1>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
          Your friendly AI assistant
        </p>
      </div>
    </header>
  )
}
