import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import drizzle functions and contract artifact
// @ts-ignore
import { Drizzle } from "drizzle";

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [require("./contracts/Cortex.json")],
  web3: {
    fallback: {
      type: "ws",
      url: "wss://ropsten.infura.io/ws/v3/b81c00acfa254c5dbefa77dd3a3b588e",
    },
  },
};

// setup drizzle
const drizzle = new Drizzle(options);

ReactDOM.render(<App drizzle={drizzle}/>, document.getElementById('root'));
