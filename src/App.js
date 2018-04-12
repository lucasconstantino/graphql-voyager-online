import React from 'react'
import fetch from 'isomorphic-fetch'
import { isUri } from 'valid-url'
import { Voyager } from 'graphql-voyager'
import styled, { injectGlobal } from 'styled-components'
import queryState from 'query-state'

const introspect = ({ endpoint, reset }) => async query => fetch(endpoint, {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operationName: 'InstrospectionQuery',
    query,
  }),
})
.catch(err => {
  window.alert('Introspection query failed. Check you network console.')
  reset()
  throw err
})
.then(res => res.json())
.then(res => {
  window.alert('Finished introspection! It my take a while to process your schema.')
  return res
})

const promptEndpoint = initial => {
  let endpoint

  do {
    if (endpoint) window.alert('Invalid endpoint!')
    endpoint = window.prompt('Set the new GraphQL endpoint:')
  } while (endpoint && !isUri(endpoint))

  return endpoint || initial
}

const StyledContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

const EndpointBar = styled.div`
  background: #eee;
  border-bottom: 1px solid #ccc;
  text-align: center;
  padding: 1rem;
`

const StyledButton = styled.button`
  margin-right: 0.5rem;
  font-size: 1.25rem;
`

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.qs = queryState({ endpoint: '' })
    this.state = this.qs.get()
  }

  componentDidMount () {
    this.qs.onChange(this.setState)
  }

  reset = () => this.qs.dispose()
  setEndpoint = endpoint => {
    this.qs.set({ endpoint })
    this.setState({ endpoint })
  }

  render () {
    const { endpoint } = this.state

    return (
      <StyledContainer>
        <EndpointBar>
          <StyledButton onClick={ () => this.setEndpoint(promptEndpoint(endpoint)) }>Define endpoint</StyledButton>
          <b>{ endpoint }</b>
        </EndpointBar>

        { endpoint && <Voyager introspection={ introspect({ endpoint, reset: this.reset }) } /> }
      </StyledContainer>
    )
  }
}

injectGlobal`
  @import url(//cdn.jsdelivr.net/npm/graphql-voyager/dist/voyager.css);

  body, html {
    margin: 0;
    padding: 0;
  }

  .graphql-voyager {
    position: relative;
  }
`
