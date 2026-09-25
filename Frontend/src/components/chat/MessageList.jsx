import Icon from '../ui/Icon'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ProcessingAnimation() {
  return <div className="processing-animation" role="img" aria-label="ANTIONYX is processing your message">
    <svg viewBox="0 0 220 140" aria-hidden="true">
      <defs>
        <radialGradient id="core-glow"><stop stopColor="#a5fff0"/><stop offset=".35" stopColor="#46dfc3"/><stop offset="1" stopColor="#168d99" stopOpacity="0"/></radialGradient>
        <linearGradient id="orbit-stroke" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#8bffe7"/><stop offset="1" stopColor="#428aff"/></linearGradient>
        <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse className="animation-orbit orbit-one" cx="110" cy="70" rx="57" ry="24" fill="none" stroke="url(#orbit-stroke)" strokeWidth="1.2"/>
      <ellipse className="animation-orbit orbit-two" cx="110" cy="70" rx="57" ry="24" fill="none" stroke="#48d9d0" strokeOpacity=".58" strokeWidth="1"/>
      <circle className="animation-core-glow" cx="110" cy="70" r="29" fill="url(#core-glow)"/>
      <path className="animation-spark" d="M110 46 C114 64 118 66 136 70 C118 74 114 76 110 94 C106 76 102 74 84 70 C102 66 106 64 110 46Z" fill="#bcfff3" filter="url(#soft-glow)"/>
      <circle className="animation-particle particle-one" cx="54" cy="69" r="2.5" fill="#93ffe9"/>
      <circle className="animation-particle particle-two" cx="166" cy="70" r="2" fill="#7abaff"/>
      <circle className="animation-particle particle-three" cx="110" cy="45" r="1.8" fill="#b8fff1"/>
    </svg>
  </div>
}

export default function MessageList({ messages, busy, copiedMessage, onCopy }) {
  return <div className="message-list">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
    {message.role === 'assistant' && <div className="message-avatar"><div className="tiny-orb"/></div>}
    <div className="message-content"><div className={`message-bubble ${message.error ? 'error' : ''} ${message.role === 'assistant' ? 'assistant-markdown' : ''}`}>{message.role === 'assistant' ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer"/> }}>{message.content}</ReactMarkdown> : message.content}</div><button className="copy-message" onClick={() => onCopy(index, message.content)} aria-label={copiedMessage === index ? 'Copied message' : 'Copy message'} title={copiedMessage === index ? 'Copied' : 'Copy message'}><Icon name="copy" size={14}/><span>{copiedMessage === index ? 'Copied' : 'Copy'}</span></button></div>
    {message.role === 'user' && <div className="avatar message-user">S</div>}
  </div>)}{busy && <div className="message-row assistant"><div className="message-avatar"><div className="tiny-orb active-orb"/></div><div className="thinking processing"><ProcessingAnimation/><span/><span/><span/><small>Thinking through it</small></div></div>}<div data-chat-bottom/></div>
}
