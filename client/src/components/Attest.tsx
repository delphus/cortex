import React, { useContext } from "react";
import { Form, Button, Input, Modal } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { DrizzleContext } from "../App";
import ServiceIds from "../data/ServiceIds";
import QRCode from "qrcode.react";

function SubmitAttestation({ form }: FormComponentProps) {
  const { drizzle, readinessState } = useContext(DrizzleContext);
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  return (
    <Form
      {...formItemLayout}
      onSubmit={e => {
        e.preventDefault();
        validateFieldsAndScroll(async (err, values) => {
          if (err) {
            console.error(err);
            return;
          }

          const sig = await drizzle.web3.eth.personal.sign(
            values.address,
            readinessState.drizzleState.accounts[0],
            ""
          );

          Modal.info({
            title: "Attestation Generated",
            content: (
              <>
                <p>
                  Please transfer the following data to the person you are
                  attesting for, so that they can upload it as an attestation:
                </p>

                <QRCode value={sig} />

                <p>
                  <code>{sig}</code>
                </p>
              </>
            )
          });
        });
      }}
    >
      <Form.Item label="Address to attest to">
        {getFieldDecorator("address", {
          rules: [
            {
              required: true,
              message: "Please input the address!"
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create({ name: "submit-attestation" })(SubmitAttestation);
