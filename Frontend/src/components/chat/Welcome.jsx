import { suggestions } from '../../data/suggestions'
import Icon from '../ui/Icon'
import Orb from '../ui/Orb'

export default function Welcome({ state, onSend }) {
  return <div className="welcome"><div className="eyebrow"><span/> YOUR PERSONAL INTELLIGENCE</div><Orb state={state}/><h1>At your service<span>.</span></h1><p>Good to have you here. I’m ANTIONYX, your personal assistant.<br className="desktop-break"/> What would you like to work on?</p><div className="suggestions">{suggestions.map((suggestion, index) => <button key={suggestion} onClick={() => onSend(suggestion)}><span className="suggest-icon"><Icon name={index === 0 ? 'spark' : index === 1 ? 'clock' : 'chat'} size={16}/></span>{suggestion}<span className="suggest-arrow">↗</span></button>)}</div></div>
}
