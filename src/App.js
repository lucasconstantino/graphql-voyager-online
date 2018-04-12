import React from 'react'
import fetch from 'isomorphic-fetch'
import { isUri } from 'valid-url'
import { Voyager } from 'graphql-voyager'
import styled, { injectGlobal } from 'styled-components'
import { State } from 'react-powerplug'

const introspect = endpoint => async query => fetch(endpoint, {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operationName: 'InstrospectionQuery',
    query,
  }),
})
.catch(() => window.alert('Introspection query failed. Check you network console.'))
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

const App = () => (
  <State initial={ { endpoint: '' } }>
    {({ state, setState }) => (
      <StyledContainer>
        <EndpointBar>
          <StyledButton onClick={ () => setState({ endpoint: promptEndpoint(state.endpoint) }) }>Define endpoint</StyledButton>
          <b>{ state.endpoint }</b>
        </EndpointBar>

        { state.endpoint && <Voyager introspection={ introspect(state.endpoint) } /> }
      </StyledContainer>
    )}
  </State>
)

export default App

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
