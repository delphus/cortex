import React, { Suspense, lazy } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import { useState, useEffect } from "react";

import { DASHBOARD, LOGIN } from "./route";

const Dashboard = lazy(DASHBOARD);
const Login = lazy(LOGIN);

export const DrizzleContext = React.createContext<{
  drizzle: any;
  readinessState: { loading: boolean; drizzleState: any };
}>({ drizzle: null, readinessState: null! });

function App({ drizzle }: any) {
  const [drizzleReadinessState, setDrizzleReadinessState] = useState({
    drizzleState: null,
    loading: true
  });

  useEffect(() => {
    const unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        setDrizzleReadinessState({
          drizzleState: drizzleState,
          loading: false
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [drizzle.store, drizzleReadinessState]);

  return drizzleReadinessState.loading ? (
    <>Loading Drizzle...</>
  ) : (
    <DrizzleContext.Provider
      value={{ drizzle, readinessState: drizzleReadinessState }}
    >
      <Suspense
        // Show no fallback for the support widget 
        fallback={<></>}
      >
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </Suspense>
    </DrizzleContext.Provider>
  );
}

export default App;
