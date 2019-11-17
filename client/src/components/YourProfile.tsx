import React, { useContext } from "react";
import { DrizzleContext } from "../App";
import Profile from "./Profile";
import ProofCreator from "./ProofCreator";

export default function YourProfile() {
  const { readinessState } = useContext(DrizzleContext);
  const address = readinessState.drizzleState.accounts[0];

  return (
    <>
      <Profile address={address} />

      <ProofCreator />
    </>
  );
}
