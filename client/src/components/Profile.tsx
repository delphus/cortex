import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "../App";
import ProfileCard from "./ProfileCard";
import ProofCreator from "./ProofCreator";
//@ts-ignore
import Identicon, { jsNumberForAddress } from "react-jazzicon";
import { Table } from "antd";
import ServiceId from "../data/ServiceIds";
import Proof from "../data/Proof";
import verifyProof from "../util/verifyProof";

/*the profile picture has been moved to the ProofCreator file instead
 and import Identicon, { jsNumberForAddress } from "react-jazzicon"; was used instead
*/

// const dataSource: {identifier:string, status:string, proof:string}[] = [];

export default function Profile() {
  // const status = useContext(DrizzleContext);
  const { drizzle, readinessState } = useContext(DrizzleContext);
  const [dataSource, setDataSource] = useState<
    { identifier: string; proof: string }[]
  >([{}] as any);

  let address = readinessState.drizzleState.accounts[0];
  //TODO hook this up with the backend

  useEffect(() => {
    (async () => {
      const Cortex = drizzle.contracts.Cortex;
      console.log(Cortex);
      const svcs = [
        ServiceId.HTTPS,
        ServiceId.EMAIL,
        ServiceId.REDDIT,
        ServiceId.ETHEREUM
      ];
      const p = [];
      for (const svc of svcs) {
        const res = await Cortex.methods.getProofFromUser(address, svc).call();
        console.log("Fetching " + svc + " => ", res);
        const { identifier, meta } = res;
        if (identifier !== "") {
          if (svc === ServiceId.ETHEREUM) {
            try {
              console.log(identifier, meta);
              drizzle.web3.eth.personal.ecRecover(address, meta!);
              p.push({ identifier: "Attestation from " + identifier, proof: "Verified" });
            } catch (e) {
              p.push({ identifier: "Attestation from " + identifier, proof: "Failed to verify EC" });
            }
          } else {
            const result = await verifyProof(
              drizzle.web3,
              { identifier, svc },
              readinessState.drizzleState.accounts[0]
            );
            p.push({ identifier: identifier, proof: result.toString() });
          }
        }
      }
      setDataSource(p);
    })();
  }, [address, drizzle]);

  const columns = [
    {
      title: "Identifier",
      dataIndex: "identifier",
      key: "identifier"
    },
    {
      title: "Proof",
      dataIndex: "proof",
      key: "proof"
    }
  ];

  console.log("length " + dataSource.length);
  return (
    <>
      <Table dataSource={dataSource} columns={columns} />

      <ProofCreator />
    </>
  );
}
