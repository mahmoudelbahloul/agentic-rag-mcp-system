import { useChat } from './hooks/useChat'
import { ChatHeader } from './components/ChatHeader'
import { ChatMessages } from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'

function App() {
  const { messages, loading, error, sendMessage } = useChat()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-indigo-100 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-black transition-colors">
      <div className="flex h-screen w-full flex-col overflow-hidden bg-white/60 backdrop-blur-xl dark:bg-slate-900/50">
        <ChatHeader />
        <ChatMessages messages={messages} loading={loading} />
        <ChatInput sendMessage={sendMessage} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default App
