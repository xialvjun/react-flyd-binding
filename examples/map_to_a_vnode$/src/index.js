import {h} from 'react-flyd-binding'
import flyd from 'flyd'
import {Component} from 'react'
import {render} from 'react-dom'

let num = flyd.stream(0)

setInterval(()=>{
  num(num()+1)
}, 1000)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div>
        {this.state.show ? (
          <div>
            {num.map(n => <span>{n}</span>)}
          </div>
        ) : null}
        <button onClick={e=>this.setState({show: !this.state.show})}>toggle</button>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
