import { Component, useEffect, useRef, useState } from 'react'

const suggestions = ['Give me a quick briefing', 'Help me plan today', 'What can you do?']

function responseText(data) {
  if (typeof data === 'string') return data
  if (data == null) return 'I received an empty response. Please try again.'
  const value = data.reply ?? data.response ?? data.answer ?? data.message ?? data.content ?? data.result
  if (typeof value === 'string') return value
  if (value != null) return JSON.stringify(value, null, 2)
  return JSON.stringify(data, null, 2)
}

class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="fatal-screen"><div className="fatal-mark">!</div><h1>ANTIONYX needs a moment.</h1><p>The interface hit an unexpected error. Reload the assistant to start a fresh session.</p><button onClick={() => window.location.reload()}>Reload assistant</button></main>
    return this.props.children
  }
}

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    moon: <><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Orb({ state }) {
  return <div className={`orb-wrap ${state}`} aria-label={`ANTIONYX ${state}`}><div className="orb-halo"/><div className="orb"><div className="orb-core"/><div className="orb-ring ring-a"/><div className="orb-ring ring-b"/><div className="orb-sheen"/></div><div className="orb-signal signal-a"/><div className="orb-signal signal-b"/></div>
}

function App() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [state, setState] = useState('idle')
  const [theme, setTheme] = useState(() => localStorage.getItem('antionyx-theme') || 'dark')
  const [active, setActive] = useState('New conversation')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const requestRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      requestRef.current?.abort()
    }
  }, [])

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
        body: JSON.stringify({ message }),
        signal: controller.signal,
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
      window.setTimeout(() => {
        if (mountedRef.current) setState('idle')
      }, 1800)
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

  function newChat() { setMessages([]); setActive('New conversation'); setState('idle'); inputRef.current?.focus() }
  useEffect(() => { localStorage.setItem('antionyx-theme', theme) }, [theme])

  return <AppErrorBoundary><main className={`app-shell theme-${theme}`}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><span/><span/><span/></div><div><strong>ANTIONYX</strong><small>PERSONAL INTELLIGENCE</small></div></div>
      <button className="new-chat" onClick={newChat}><Icon name="plus" size={17}/> New conversation <span>⌘ K</span></button>
      <div className="side-label">YOUR SPACE</div>
      <button className="nav-item selected"><Icon name="chat"/> <span>Assistant</span><i/></button>
      <button className="nav-item muted" onClick={newChat}><Icon name="clock"/> <span>Conversation history</span></button>
      <div className="side-label modules-label">IN DEVELOPMENT</div>
      <div className="module-card"><div className="module-icon"><Icon name="grid"/></div><div><b>Your next idea</b><small>A space for what comes next.</small></div><span className="soon">SOON</span></div>
      <button className="add-module" onClick={() => setMessages([...messages, { role: 'assistant', content: 'Your workspace is ready to grow. New tools and abilities can live here as you build them.' }])}><Icon name="plus" size={15}/> Make this yours</button>
      <div className="sidebar-bottom"><div className="profile"><div className="avatar">S</div><div><b>My assistant</b><small>Private workspace</small></div><span className="dots">···</span></div><div className="system-status"><span/> All systems nominal <span className="version">v 1.0</span></div></div>
    </aside>
    <section className="main-panel">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div><div className="top-actions"><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15}/><span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span></button><div className="secure"><span/> PRIVATE SESSION</div><button className="avatar mini">S</button></div></header>
      <div className={`conversation ${messages.length ? 'has-messages' : ''}`}>
        {messages.length === 0 ? <div className="welcome"><div className="eyebrow"><span/> YOUR PERSONAL INTELLIGENCE</div><Orb state={state}/><h1>At your service<span>.</span></h1><p>Good to have you here. I’m ANTIONYX, your personal assistant.<br className="desktop-break"/> What would you like to work on?</p><div className="suggestions">{suggestions.map((s, i) => <button key={s} onClick={() => sendMessage(s)}><span className="suggest-icon"><Icon name={i === 0 ? 'spark' : i === 1 ? 'clock' : 'chat'} size={16}/></span>{s}<span className="suggest-arrow">↗</span></button>)}</div></div> : <div className="message-list">{messages.map((m, i) => <div className={`message-row ${m.role}`} key={i}>{m.role === 'assistant' && <div className="message-avatar"><div className="tiny-orb"/></div>}<div className={`message-bubble ${m.error ? 'error' : ''}`}>{m.content}</div>{m.role === 'user' && <div className="avatar message-user">S</div>}</div>)}{busy && <div className="message-row assistant"><div className="message-avatar"><div className="tiny-orb active-orb"/></div><div className="thinking"><span/><span/><span/><small>Thinking through it</small></div></div>}<div ref={bottomRef}/></div>}
      </div>
      <div className="composer-area"><div className="composer"><textarea ref={inputRef} rows="1" placeholder="Ask me anything, or tell me what you need…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} /><div className="composer-tools"><div className="input-hint"><Icon name="spark" size={14}/><span>Personal intelligence, at your fingertips</span></div><div className="tool-buttons"><button className="icon-button" title="Voice input" onClick={() => inputRef.current?.focus()}><Icon name="mic" size={17}/></button><button className="send-button" aria-label="Send message" disabled={!draft.trim() || busy} onClick={() => sendMessage()}><Icon name="send" size={16}/></button></div></div></div><div className="composer-foot"><span>ANTIONYX can make mistakes. Use your judgment.</span><span><kbd>↵</kbd> send <kbd>⇧ ↵</kbd> new line</span></div></div>
      <footer className="main-footer"><span>BUILT AROUND YOU</span><span>MORE CAPABILITIES COMING INTO FOCUS <i>✳</i></span></footer>
    </section>
    <aside className="right-rail"><div className="rail-top"><div className="eyebrow"><span/> LIVE SYSTEM</div><div className="status-card"><div className="status-head"><span className="status-light"/><b>{state === 'thinking' ? 'Processing request' : state === 'responding' ? 'Response delivered' : 'Standing by'}</b><span className="live-pill">LIVE</span></div><Orb state={state}/><div className="status-caption">{state === 'thinking' ? 'Connecting the dots…' : state === 'responding' ? 'Here when you need me.' : 'Ready when you are.'}</div><div className="status-divider"/><div className="telemetry"><span>CORE STATUS</span><b><i/> OPTIMAL</b></div><div className="telemetry"><span>CONNECTION</span><b>ENCRYPTED <i className="lock-dot">◆</i></b></div><div className="telemetry"><span>RESPONSE MODE</span><b>PERSONAL</b></div></div>
      <div className="clock-card"><div className="card-heading">LOCAL TIME <span>✳</span></div><div className="time-readout">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}<small> NPT</small></div><div className="date-readout">{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div></div>
      </div><div className="rail-bottom"><div className="next-card"><div className="card-heading">A NOTE FOR THE FUTURE <span>↗</span></div><p>This space is yours to shape.</p><small>Tools, memory, automations —<br/> we’ll make room for what matters.</small><div className="progress-line"><span/></div><div className="progress-label">YOUR ASSISTANT, STILL BECOMING</div></div><div className="rail-foot">DESIGNED FOR ONE <span>·</span> YOURS</div></div></aside>
  </main></AppErrorBoundary>
}

export default App
