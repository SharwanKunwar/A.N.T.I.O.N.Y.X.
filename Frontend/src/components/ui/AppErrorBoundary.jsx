import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="fatal-screen"><div className="fatal-mark">!</div><h1>ANTIONYX needs a moment.</h1><p>The interface hit an unexpected error. Reload the assistant to start a fresh session.</p><button onClick={() => window.location.reload()}>Reload assistant</button></main>
    return this.props.children
  }
}
