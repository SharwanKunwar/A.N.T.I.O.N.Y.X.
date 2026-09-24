export default function Orb({ state }) {
  return <div className={`orb-wrap ${state}`} aria-label={`ANTIONYX ${state}`}><div className="orb-halo"/><div className="orb"><div className="orb-core"/><div className="orb-ring ring-a"/><div className="orb-ring ring-b"/><div className="orb-sheen"/></div><div className="orb-signal signal-a"/><div className="orb-signal signal-b"/></div>
}
