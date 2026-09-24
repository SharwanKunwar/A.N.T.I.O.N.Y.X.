import Orb from '../ui/Orb'

export default function RightRail({ state }) {
  const status = state === 'thinking' ? 'Processing request' : state === 'responding' ? 'Response delivered' : 'Standing by'
  const caption = state === 'thinking' ? 'Connecting the dots…' : state === 'responding' ? 'Here when you need me.' : 'Ready when you are.'
  return <aside className="right-rail"><div className="rail-top"><div className="eyebrow"><span/> LIVE SYSTEM</div><div className="status-card"><div className="status-head"><span className="status-light"/><b>{status}</b><span className="live-pill">LIVE</span></div><Orb state={state}/><div className="status-caption">{caption}</div><div className="status-divider"/><div className="telemetry"><span>CORE STATUS</span><b><i/> OPTIMAL</b></div><div className="telemetry"><span>CONNECTION</span><b>ENCRYPTED <i className="lock-dot">◆</i></b></div><div className="telemetry"><span>RESPONSE MODE</span><b>PERSONAL</b></div></div>
    <div className="clock-card"><div className="card-heading">LOCAL TIME <span>✳</span></div><div className="time-readout">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}<small> NPT</small></div><div className="date-readout">{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div></div>
  </div><div className="rail-bottom"><div className="next-card"><div className="card-heading">A NOTE FOR THE FUTURE <span>↗</span></div><p>This space is yours to shape.</p><small>Tools, memory, automations —<br/> we’ll make room for what matters.</small><div className="progress-line"><span/></div><div className="progress-label">YOUR ASSISTANT, STILL BECOMING</div></div><div className="rail-foot">DESIGNED FOR ONE <span>·</span> YOURS</div></div></aside>
}
