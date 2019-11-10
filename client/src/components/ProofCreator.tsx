import React, { useContext, useState } from "react";
import { DrizzleContext } from "../App";
import { Steps, Button, Input, Select, message, Result, Popover, Icon} from "antd";
import styled from "styled-components";
import ServiceIds from "../data/ServiceIds";
import verifyProof from "../util/verifyProof";
//@ts-ignore
import Identicon, { jsNumberForAddress } from "react-jazzicon";
//@ts-ignore
import CopyToClipboard from "react-copy-to-clipboard";

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
          <Identicon
            seed={jsNumberForAddress(readinessState.drizzleState.accounts[0])}
            diameter={32}
          />

        
        {/* TODO
        try and fix this so the address also displays with the avatar
        <Popover content="Copy address to clipboard">
        <CopyToClipboard text={readinessState.drizzleState.accounts[0]}>
          <Button
            type="primary"
            shape="circle"
            onClick={(e: any) => {
              // tHiS is the only thing that can run on this click event
              // (stops navigation if this is wrapped in an <a> tag)
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Icon type="copy" />
          </Button>
        </CopyToClipboard>
      </Popover> */}

          <p>Select an identity to prove:</p>

          <Select onChange={setSvc} style={{ width: "200px" }}>
            <Select.Option value={0}>Website (HTTPS)</Select.Option>
          </Select>

          <br />
          <br />

          <p>
            <Input
              style={{ width: "200px" }}
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
                  await drizzle.contracts.Cortex.methods.setProof(
                    svc,
                    identifier,
                    drizzle.web3.utils.asciiToHex("")
                  ).send();
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
      content: (
        <Result
          status="success"
          title="Successfully verified identity!"
          // TODO change on multiple types of identities
          subTitle="You've successfully linked your Ethereum account with your web identity."
          extra={[
            <Button type="primary" href="/profile">
              Go to Profile
            </Button>
          ]}
        />
      )
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
