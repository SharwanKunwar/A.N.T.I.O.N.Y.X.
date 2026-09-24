import Icon from '../ui/Icon'

export default function Sidebar({ onNewChat, onAddModule }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><span/><span/><span/></div><div><strong>ANTIONYX</strong><small>PERSONAL INTELLIGENCE</small></div></div>
    <button className="new-chat" onClick={onNewChat}><Icon name="plus" size={17}/> New conversation <span>⌘ K</span></button>
    <div className="side-label">YOUR SPACE</div>
    <button className="nav-item selected"><Icon name="chat"/> <span>Assistant</span><i/></button>
    <button className="nav-item muted" onClick={onNewChat}><Icon name="clock"/> <span>Conversation history</span></button>
    <div className="side-label modules-label">IN DEVELOPMENT</div>
    <div className="module-card"><div className="module-icon"><Icon name="grid"/></div><div><b>Your next idea</b><small>A space for what comes next.</small></div><span className="soon">SOON</span></div>
    <button className="add-module" onClick={onAddModule}><Icon name="plus" size={15}/> Make this yours</button>
    <div className="sidebar-bottom"><div className="profile"><div className="avatar">S</div><div><b>My assistant</b><small>Private workspace</small></div><span className="dots">···</span></div><div className="system-status"><span/> All systems nominal <span className="version">v 1.0</span></div></div>
  </aside>
}
