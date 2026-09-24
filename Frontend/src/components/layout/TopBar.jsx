import Icon from '../ui/Icon'

export default function TopBar({ active, theme, onToggleTheme }) {
  return <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div><div className="top-actions"><button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15}/><span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span></button><div className="secure"><span/> PRIVATE SESSION</div><button className="avatar mini" aria-label="Profile">S</button></div></header>
}
