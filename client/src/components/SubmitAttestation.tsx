import React, { useContext } from "react";
import { Form, Button, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { DrizzleContext } from "../App";
import ServiceIds from "../data/ServiceIds";

function SubmitAttestation({ form }: FormComponentProps) {
  const { drizzle } = useContext(DrizzleContext);
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {};

  return (
    <Form
      {...formItemLayout}
      onSubmit={e => {
        e.preventDefault();
        validateFields(async (err, values) => {
          if (err) {
            console.error(err);
            return;
          }

          await drizzle.contracts.Cortex.methods.setProof(
            ServiceIds.ETHEREUM,
            values.address,
            drizzle.web3.utils.asciiToHex(values.attestation)
          ).send();
        });
      }}
    >
      <Form.Item label="Address of attestor">
        {getFieldDecorator("address", {
          rules: [
            {
              required: true,
              message: "Please input the address!"
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Signed attestation">
        {getFieldDecorator("attestation", {
          rules: [
            {
              required: true,
              message: "Please input the attestation!"
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create({ name: "submit-attestation" })(SubmitAttestation);
