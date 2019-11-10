import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import drizzle functions and contract artifact
// @ts-ignore
import { Drizzle } from "drizzle";

import nucypherRegistry from "./config/contract_registry.json";
// Convert NuCypher registry file into the Truffle format
const contracts = nucypherRegistry.map(c => ({
  contractName: c[0],
  abi: c[2],
  networks: {
    "5": {
      events: {},
      links: {},
      address: c[1]
    }
  }
}))

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts,
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
};

// setup drizzle
const drizzle = new Drizzle(options);

ReactDOM.render(<App drizzle={drizzle}/>, document.getElementById('root'));
