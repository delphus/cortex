import React, { Suspense, lazy } from "react";
import { Switch, Route, HashRouter as Router, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { DASHBOARD, LOGIN } from "./route";
import Web3 from "web3";
import Profile from "./components/Profile";
import { Layout, Typography, Menu, Icon } from "antd";
import "antd/dist/antd.css";
import SubmitAttestation from "./components/SubmitAttestation";
import Attest from "./components/Attest";

const Dashboard = lazy(DASHBOARD);
const Login = lazy(LOGIN);

export const DrizzleContext = React.createContext<{
  drizzle: {
    web3: Web3;
    [x: string]: any;
  };
  readinessState: { loading: boolean; drizzleState: any };
}>({ drizzle: null!, readinessState: null! });

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
    <></>
  ) : (
    <DrizzleContext.Provider
      value={{ drizzle, readinessState: drizzleReadinessState }}
    >
      <Suspense
        // Show no fallback for the support widget
        fallback={<></>}
      >
        <Router>
          <Layout>
            <Layout.Header
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Typography.Title style={{ color: "white", paddingTop: "5px" }}>
                {/* this color got overrided by the Link*/}
                <Link to="/dashboard">
                  Cortex
                </Link>
              </Typography.Title>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ lineHeight: "64px" }}
              >
                <Menu.Item>
                  <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/submit-attestation">Submit Attestation</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/attest">Attest</Link>
                </Menu.Item>
              </Menu>
            </Layout.Header>
            <Layout.Content
              style={{ padding: "16px", maxWidth: "1080px", margin: "0 auto" }}
            >
              <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/profile" component={Profile} />
                <Route
                  path="/submit-attestation"
                  component={SubmitAttestation}
                />
                <Route path="/attest" component={Attest} />
              </Switch>
            </Layout.Content>
          </Layout>
        </Router>
      </Suspense>
    </DrizzleContext.Provider>
  );
}

export default App;
