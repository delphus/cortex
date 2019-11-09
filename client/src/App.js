import React, { useState, useEffect } from 'react';
import NormalLoginForm from './components/login.js';

const App = props => {
  const [drizzleReadinessState, setDrizzleReadinessState] = useState({drizzleState: null, loading: true})
  const { drizzle } = props

  useEffect( 
    () => {
      const unsubscribe = drizzle.store.subscribe( () => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState()
        // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {
          setDrizzleReadinessState({drizzleState: drizzleState, loading: false})
        }
      })
      return () => {
        unsubscribe()
      }
    }, [drizzle.store, drizzleReadinessState]
  )
  
  return (
    drizzleReadinessState.loading ? 
      <>Loading Drizzle...</>
      :
      <Fragment>
        <NormalLoginForm />
      </Fragment>
  )
}

export default App
