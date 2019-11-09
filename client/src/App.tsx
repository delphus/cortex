import React, { useLayoutEffect, Suspense, lazy } from "react";
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps,
  BrowserRouter as Router
} from "react-router-dom";
import  { useState, useEffect } from 'react';
import NormalLoginForm from './components/login.js';

import{
  DASHBOARD,
  LOGIN
} from "./route"

const Dashboard = lazy(DASHBOARD);
const Login = lazy(LOGIN)



function App({ location, history, drizzle }: any) {


  const [drizzleReadinessState, setDrizzleReadinessState] = useState({drizzleState: null, loading: true})

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
      <>
        <Suspense
          // Show no fallback for the support widget since it's not crucial to
          // site functionality
          fallback={<></>}
        >
          <Router>
            <Switch>
              <Route path="/" exact component = {Login}/>
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </Router>
        </Suspense>
      </>
  
      


  );
}


export default App;
