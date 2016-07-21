import React from 'react'
import { isStream, on } from 'flyd'

export default function reactive(tag='') {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props)
      this.displayName = `ReactiveClass-${typeof tag==='string' ? tag : (tag.displayName || tag.name || '')}`;
      this.state = {}
    }

    componentWillMount() {
      this.subscribe(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps)
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    addPropListener(name, prop$) {
      on((value) => {
        // don't re-render if value is the same.
        if (value === this.state[name]) {
          return
        }
        this.setState({ [name]: value })
      }, prop$)
      // return these prop$ rather than above on$ because we usually create streams in jsx. Just end those on$ will left out those prop$s which will lead to a memory leak.
      // And since prop$ is the parent of on$, just end prop$ is enough.
      // And since we will end prop$, user shouldn't use outter streams directly on jsx. Just a stream.map(v => v) is enough.
      return prop$
    }

    subscribe(props) {
      if (this.subscriptions) {
        this.unsubscribe()
      }

      this.subscriptions = []

      Object.keys(props).forEach(key => {
        const value = props[key]
        if (isStream(value)) {
          const subscription = this.addPropListener(key, value)
          this.subscriptions.push(subscription)
        }
      })
    }

    unsubscribe() {
      this.subscriptions.forEach(subscription => subscription.end(true))
      this.subscriptions = null
      this.state = {}
    }

    render() {
      const finalProps = {...this.props, ...this.state}
      if (tag) {
        return React.createElement(tag, finalProps)
      }
      const {children, ...props} = finalProps
      return React.cloneElement(children, props)
    }
  }

  return ReactiveClass
}
