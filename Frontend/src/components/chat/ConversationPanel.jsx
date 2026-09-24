import MessageList from './MessageList'
import Welcome from './Welcome'

export default function ConversationPanel({ messages, busy, state, copiedMessage, onCopy, onSend, conversationRef }) {
  return <div ref={conversationRef} className={`conversation ${messages.length ? 'has-messages' : ''}`}>
    {messages.length === 0 ? <Welcome state={state} onSend={onSend}/> : <MessageList messages={messages} busy={busy} copiedMessage={copiedMessage} onCopy={onCopy}/>}
  </div>
}
