import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "../App";
import ProfileCard from "./ProfileCard";
import ProofCreator from "./ProofCreator";
//@ts-ignore
import Identicon, { jsNumberForAddress } from "react-jazzicon";
import {Table} from "antd"
import ServiceId from "../data/ServiceIds";
import Proof from "../data/Proof";

/*the profile picture has been moved to the ProofCreator file instead
 and import Identicon, { jsNumberForAddress } from "react-jazzicon"; was used instead
*/

export default function Profile() {
  // const status = useContext(DrizzleContext);
  const { drizzle, readinessState } = useContext(DrizzleContext);
  const [proofs, setProofs] = useState<Proof[]>([]);

  console.log("ready:" + readinessState);


  let address = readinessState.drizzleState.accounts[0]
  //TODO hook this up with the backend
  
  const dataSource: {identifier:string, status:string, proof:string}[] = [];

  useEffect(() => {
    (async () => {
      const Cortex = drizzle.contracts.Cortex;
      console.log(Cortex);
      const svcs = [ServiceId.HTTPS, ServiceId.EMAIL, ServiceId.REDDIT];
      for (const svc of svcs) {
        const { identifier } = await Cortex.methods
          .getProofFromUser(address, svc)
          .call();
        // if (identifier !== "") {
          dataSource.push({ identifier :identifier, status:"yes" , proof: proofs.toString() });
        // }
        console.log("data source: " + dataSource)
      }
     
    })();
  }, [address, drizzle]);


  const columns = [
    {
      title: 'Identifier',
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Proof',
      dataIndex: 'proof',
      key: 'proof',
    },
  ]


  return (
    <>
      <ProfileCard address={address}></ProfileCard>
      <Table dataSource={dataSource} columns={columns} />

      <ProofCreator />
      <ProfileCard address={readinessState.drizzleState.accounts[0]} />
    </>
  );
}
