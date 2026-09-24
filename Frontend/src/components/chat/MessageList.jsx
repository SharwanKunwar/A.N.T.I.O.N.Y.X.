import Icon from '../ui/Icon'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MessageList({ messages, busy, copiedMessage, onCopy }) {
  return <div className="message-list">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
    {message.role === 'assistant' && <div className="message-avatar"><div className="tiny-orb"/></div>}
    <div className="message-content"><div className={`message-bubble ${message.error ? 'error' : ''} ${message.role === 'assistant' ? 'assistant-markdown' : ''}`}>{message.role === 'assistant' ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer"/> }}>{message.content}</ReactMarkdown> : message.content}</div><button className="copy-message" onClick={() => onCopy(index, message.content)} aria-label={copiedMessage === index ? 'Copied message' : 'Copy message'} title={copiedMessage === index ? 'Copied' : 'Copy message'}><Icon name="copy" size={14}/><span>{copiedMessage === index ? 'Copied' : 'Copy'}</span></button></div>
    {message.role === 'user' && <div className="avatar message-user">S</div>}
  </div>)}{busy && <div className="message-row assistant"><div className="message-avatar"><div className="tiny-orb active-orb"/></div><div className="thinking"><span/><span/><span/><small>Thinking through it</small></div></div>}<div data-chat-bottom/></div>
}
