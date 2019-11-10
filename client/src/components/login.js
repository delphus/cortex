import React from "react";
import "antd/dist/antd.css";
import "./login.css";
import { Form, Icon, Input, Button, Checkbox, Card } from "antd";
import Torus from "@toruslabs/torus-embed";
import LogoGather from "./logoGather.js";
import Web3 from "web3";
import Fortmatic from "fortmatic";
import { DrizzleContext } from "../App";
import { withRouter } from "react-router";

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
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <LogoGather />
        <img
          style={{
            position: "absolute",
            zIndex: "5000",
            width: "150px",
            paddingLeft: "10px"
          }}
          src="../images/cortex.png"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "150px"
          }}
        >
          <Card title="Enter Cortex" bordered={false} style={{ width: 350 }}>
            <div style={{ width: "300px" }}>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  <Button
                    ghost
                    onClick={() => {
                      window.location = "/dashboard";
                    }}
                    style={{ borderColor: "#ffc145", color: "#ffc145" }}
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Continue with Metamask &nbsp;{" "}
                    <img
                      width="15px"
                      style={{ paddingBottom: "3.7px" }}
                      src="../../images/metamask.png"
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
                      const fm = new Fortmatic("pk_test_3BCE30A5FCFF1300", "ropsten");
                      const web3 = new Web3(fm.getProvider());
                      web3.currentProvider.enable();
                      
                      this.context.drizzle.web3.setProvider(web3.currentProvider);
                      this.context.readinessState.drizzleState.accounts = await web3.eth.getAccounts();
                      this.props.history.push("/profile")
                    }}
                  >
                    Connect via Fortmatic &nbsp;{" "}
                    <img
                      width="15px"
                      style={{ paddingBottom: "3.7px" }}
                      src="../../images/fortmatic.png"
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
                      await torus.login({
                        verifier: "google"
                      });
                      
                      this.context.drizzle.web3.setProvider(torus.provider);

                      this.props.history.push("/profile")
                    }}
                    type="primary"
                  >
                    Connect via Torus{" "}
                    <img
                      width="17px"
                      style={{ paddingBottom: "3.7px", paddingLeft: "2px" }}
                      src="../../images/torus.png"
                    />
                  </Button>
                  <Form.Item></Form.Item>
                  Need help? <a href="">Click here!</a>
                  {/* The above link is for a registration service and is thus temporary */}
                  <br />
                  Meet{" "}
                  <a
                    target="_blank"
                    href="https://scintillating.us/#our-team"
                    style={{ position: "middle" }}
                  >
                    the Team!
                  </a>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </>
    );
  }
}

export default withRouter(Form.create({ name: "normal_login" })(NormalLoginForm));
