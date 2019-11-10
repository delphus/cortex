import React, { useContext } from "react";
import { DrizzleContext } from "../App";
import ProfileCard from "./ProfileCard";
import ProofCreator from "./ProofCreator";
//@ts-ignore
import Identicon, { jsNumberForAddress } from "react-jazzicon";

/*the profile picture has been moved to the ProofCreator file instead
 and import Identicon, { jsNumberForAddress } from "react-jazzicon"; was used instead
*/

export default function Profile() {
  // const status = useContext(DrizzleContext);
  const { readinessState } = useContext(DrizzleContext);

  console.log(readinessState);

  return (
    <>
      <ProofCreator />
      <ProfileCard address={readinessState.drizzleState.accounts[0]} />
    </>
  );
}
