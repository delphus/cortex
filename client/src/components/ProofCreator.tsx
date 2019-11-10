import React, { useContext, useState } from "react";
import { DrizzleContext } from "../App";
import { Steps, Button, Input, Select, message } from "antd";
import styled from "styled-components";
import ServiceIds from "../data/ServiceIds";
import verifyProof from "../util/verifyProof";

const StepsContent = styled.div`
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
`;

export default function ProofCreator() {
  const { drizzle, readinessState } = useContext(DrizzleContext);
  const [svc, setSvc] = useState<ServiceIds>(undefined!);
  const [identifier, setIdentifier] = useState<string>(undefined!);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Select identity",
      content: (
        <>
          <p>Select an identity to prove:</p>

          <Select onChange={setSvc}>
            <Select.Option value={0}>Website (HTTPS)</Select.Option>
          </Select>

          <p>
            <Input
              onChange={e => setIdentifier(e.target.value)}
              value={identifier}
              placeholder={
                ({ [ServiceIds.HTTPS]: "Domain" } as any)[svc] as any
              }
            />
          </p>

          <p>
            <Button
              type="primary"
              disabled={svc === undefined || identifier === undefined}
              onClick={() => setCurrent(1)}
            >
              Next
            </Button>
          </p>
        </>
      )
    },
    {
      title: "Sign with Ethereum",
      content: (
        <>
          <p>
            Sign a message with your Ethereum account to demonstrate control of
            this identity.
          </p>

          <p>
            <Button
              type="danger"
              onClick={async () => {
                const signature = await drizzle.web3.eth.personal.sign(
                  identifier,
                  readinessState.drizzleState.accounts[0],
                  ""
                );
                setSignature(signature);
                setCurrent(2);
              }}
            >
              Sign
            </Button>
          </p>
        </>
      )
    },
    {
      title: "Upload signature",
      content: (
        <>
          <p>
            Upload the following text to{" "}
            <code>{identifier}/.well-known/cortex.txt</code>:
          </p>

          <pre>
            <code>{signature}</code>
          </pre>

          <p>
            <Button
              onClick={async () => {
                message.info("Verifying...");

                const result = await verifyProof(
                  drizzle.web3,
                  { identifier, svc },
                  readinessState.drizzleState.accounts[0]
                );

                message.info(result);

                if (result === "Verified") {
                  setCurrent(3);
                }
              }}
            >
              Verify
            </Button>
          </p>
        </>
      )
    },
    {
      title: "Verified!",
      content: "Last-content"
    }
  ];

  return (
    <>
      <Steps current={current}>
        {steps.map(item => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <StepsContent>{steps[current].content}</StepsContent>
    </>
  );
}
