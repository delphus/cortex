import React, { useContext, useState } from "react";
import { DrizzleContext } from "../App";
import { Steps } from "antd";
import styled from "styled-components";

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
  const { drizzle } = useContext(DrizzleContext);
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Sign message to validate your identity",
      content: "First-content"
    },
    {
      title: "Upload message to web",
      content: "Second-content"
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
