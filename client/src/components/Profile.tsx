import React, { useContext } from "react";
import { DrizzleContext } from "../App";
import ProfileCard from "./ProfileCard";

export default function Profile() {
  const status = useContext(DrizzleContext);

  console.log(status);

  return <ProfileCard address={status.readinessState.drizzleState.accounts[0]} />;
}
