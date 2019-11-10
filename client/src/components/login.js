import React from "react";
import "antd/dist/antd.css";
import "./login.css";
import { Form, Icon, Input, Button, Checkbox, Card } from "antd";
import Torus from "@toruslabs/torus-embed";
import LogoGather from "./logoGather.js";
import Web3 from "web3";
import Fortmatic from "fortmatic";
import { ReactComponent as YourSvg } from "../images/interesting.svg";
import { DrizzleContext } from "../App";
import { withRouter } from "react-router-dom";

const TorusLogo = require("../images/torus.png");
const FortmaticLogo = require("../images/fortmatic.png");
const MetaMaskLogo = require("../images/metamask.png");
const DownArrow = require("../images/downarrow.jpg");
const CortexLogo = require("../images/cortex.png");

class NormalLoginForm extends React.Component {
  static contextType = DrizzleContext;

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    return (
      <>
        <LogoGather />
        <img
          style={{
            position: "absolute",
            zIndex: "5000",
            width: "150px",
            top: "0",
            left: "25px"
          }}
          src={CortexLogo}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Card
            title="Enter Cortex"
            bordered={false}
            style={{ width: 350, marginTop: "100px" }}
          >
            <div style={{ width: "300px" }}>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  <Button
                    ghost
                    onClick={() => {
                      window.location = "#/dashboard";
                    }}
                    style={{ borderColor: "#ffc145", color: "#ffc145" }}
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Continue with Metamask &nbsp;{" "}
                    <img
                      width="15px"
                      style={{ paddingBottom: "3.7px" }}
                      src={MetaMaskLogo}
                    />
                    {/*go to home page*/}
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    ghost
                    style={{ borderColor: "#c966ff", color: "#c966ff" }}
                    block
                    onClick={async () => {
                      const fm = new Fortmatic(
                        "pk_test_3BCE30A5FCFF1300",
                        "ropsten"
                      );
                      const web3 = new Web3(fm.getProvider());
                      web3.currentProvider.enable();

                      console.log(this.context);

                      this.context.drizzle.web3.setProvider(
                        web3.currentProvider
                      );
                      this.context.readinessState.drizzleState.accounts = await web3.eth.getAccounts();
                      this.props.history.push("/profile");
                    }}
                  >
                    Connect via Fortmatic &nbsp;{" "}
                    <img
                      width="15px"
                      style={{ paddingBottom: "3.7px" }}
                      src={FortmaticLogo}
                    />
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    ghost
                    block
                    onClick={async () => {
                      const torus = new Torus();
                      await torus.init();
                      await torus.login(); // await torus.ethereum.enable()
                      // const web3 = new Web3(torus.provider);
                      torus.login({
                        verifier: "google"
                      });
                      this.context.drizzle.web3.setProvider(torus.provider);

                      this.props.history.push("/profile");
                    }}
                    type="primary"
                  >
                    Connect via Torus{" "}
                    <img
                      width="17px"
                      style={{ paddingBottom: "3.7px", paddingLeft: "2px" }}
                      src={TorusLogo}
                    />
                  </Button>
                  <Form.Item></Form.Item>
                  Need help? <a href="">Click here!</a>
                  {/* The above link is for a registration service and is thus temporary */}
                </Form.Item>
              </Form>
            </div>
            <div style={{ textAlign: "center" }}>
              Learn More
              <br />
              <img width="10px" src={DownArrow} />
              <img width="10px" src={DownArrow} />
              <img width="10px" src={DownArrow} />
            </div>
          </Card>
        </div>

        <Card style={{ marginTop: "300px" }}>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <h1>What is Cortex?</h1>
            <br />
            <p>
              <YourSvg
                width="500px"
                style={{ alignSelf: "center", paddingLeft: "20%" }}
              />{" "}
              <br /> <br />
              With more and more people getting access to the internet, it has
              become increasingly important to preserve one's identity, whether
              it's for work, communication or anything else. <br /> <br />
              However, one of the few proof-based identity management platforms
              that exist called KeyBase, is completely centralized, and as such,
              has the power to remove or prohibit people from using its system.
              This can be damaging to people who may have information against
              authorities or for even smaller issues such as nationality and/or
              geographic location. <br /> <br />
            </p>
          </div>
        </Card>
      </>
    );
  }
}

export default withRouter(
  Form.create({ name: "normal_login" })(NormalLoginForm)
);
