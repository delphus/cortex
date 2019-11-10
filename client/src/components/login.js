
import React from 'react';
import 'antd/dist/antd.css';
import './login.css';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Torus from "@toruslabs/torus-embed";
// import Web3 from "web3";

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"150px"}}>
  <div style={{width:"300px"}}>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <br></br>
          Or <a href="https://delph.us/">register now!</a>
          {/* The above link is for a registration service and is thus temporary */}
          <a className="login-form-forgot" href="https://delph.us/">
            {/* The above link is for a password retrieval service and is thus temporary */}
            Forgot password
          </a>
          <Button onClick={() => { window.location = '/Dashboard' }} type="primary" htmlType="submit" className="login-form-button">
            Log in
          {/*go to home page*/}
          </Button>
          <Button size="lg" block
            onClick={async () => {
              const torus = new Torus();
              await torus.init();
              await torus.login(); // await torus.ethereum.enable()
              // const web3 = new Web3(torus.provider); 
                torus.login({
                  verifier: 'google'
              })
            }}>
            Connect via Torus
          </Button>
        </Form.Item>
      </Form>
      </div>
</div>
    );
  }
}

export default Form.create({ name: 'normal_login' })(NormalLoginForm);