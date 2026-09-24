import { useEffect, useRef, useState } from 'react'
import AppErrorBoundary from './components/ui/AppErrorBoundary'
import Composer from './components/chat/Composer'
import ConversationPanel from './components/chat/ConversationPanel'
import RightRail from './components/layout/RightRail'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import { responseText } from './utils/responseText'

function App() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [state, setState] = useState('idle')
  const [theme, setTheme] = useState(() => localStorage.getItem('antionyx-theme') || 'dark')
  const [active, setActive] = useState('New conversation')
  const [copiedMessage, setCopiedMessage] = useState(null)
  const conversationRef = useRef(null)
  const inputRef = useRef(null)
  const requestRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    const conversation = conversationRef.current
    if (conversation) conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      requestRef.current?.abort()
    }
  }, [])

  useEffect(() => { localStorage.setItem('antionyx-theme', theme) }, [theme])

  async function sendMessage(text = draft) {
    const message = text.trim()
    if (!message || busy) return
    setDraft('')
    setActive(message.length > 27 ? `${message.slice(0, 27)}…` : message)
    const conversation = [...messages, { role: 'user', content: message }]
    setMessages(conversation)
    setBusy(true)
    setState('thinking')
    const controller = new AbortController()
    requestRef.current = controller
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }), signal: controller.signal,
      })
      const raw = await response.text()
      let data
      try { data = raw ? JSON.parse(raw) : '' } catch { data = raw }
      if (!response.ok) {
        const detail = typeof data === 'object' ? data?.error ?? data?.message : data
        throw new Error(detail ? String(detail) : `Request failed (${response.status})`)
      }
      if (!mountedRef.current) return
      setMessages([...conversation, { role: 'assistant', content: responseText(data) }])
      setState('responding')
      window.setTimeout(() => { if (mountedRef.current) setState('idle') }, 1800)
    } catch (error) {
      if (error.name !== 'AbortError' && mountedRef.current) {
        setMessages([...conversation, { role: 'assistant', content: `I couldn't reach my core just now. ${error.message}. Check that your assistant service is running at localhost:8080, then try again.`, error: true }])
        setState('idle')
      }
    } finally {
      if (mountedRef.current) setBusy(false)
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  async function copyMessage(index, content) {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessage(index)
      window.setTimeout(() => setCopiedMessage(current => current === index ? null : current), 1800)
    } catch {
      setCopiedMessage(null)
    }
  }

  function newChat() {
    setMessages([])
    setActive('New conversation')
    setState('idle')
    inputRef.current?.focus()
  }

  function addModuleMessage() {
    setMessages(current => [...current, { role: 'assistant', content: 'Your workspace is ready to grow. New tools and abilities can live here as you build them.' }])
  }

  return <AppErrorBoundary><main className={`app-shell theme-${theme}`}>
    <Sidebar onNewChat={newChat} onAddModule={addModuleMessage}/>
    <section className="main-panel">
      <TopBar active={active} theme={theme} onToggleTheme={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}/>
      <ConversationPanel messages={messages} busy={busy} state={state} copiedMessage={copiedMessage} onCopy={copyMessage} onSend={sendMessage} conversationRef={conversationRef}/>
      <Composer value={draft} onChange={setDraft} onSend={sendMessage} busy={busy} inputRef={inputRef}/>
      <footer className="main-footer"><span>BUILT AROUND YOU</span><span>MORE CAPABILITIES COMING INTO FOCUS <i>✳</i></span></footer>
    </section>
    <RightRail state={state}/>
  </main></AppErrorBoundary>
}

export default App
