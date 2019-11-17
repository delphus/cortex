import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "../App";
import { Table } from "antd";
import ServiceId from "../data/ServiceIds";
import verifyProof from "../util/verifyProof";
//@ts-ignore
import Identicon, { jsNumberForAddress } from "react-jazzicon";

export default function Profile({ address }: { address: string }) {
  const { drizzle, readinessState } = useContext(DrizzleContext);
  const [dataSource, setDataSource] = useState<
    { identifier: string; proof: string }[]
  >([{}] as any);

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
              p.push({
                identifier: "Attestation from " + identifier,
                proof: "Verified"
              });
            } catch (e) {
              p.push({
                identifier: "Attestation from " + identifier,
                proof: "Failed to verify EC"
              });
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
      <h1>
        <Identicon
          seed={jsNumberForAddress(readinessState.drizzleState.accounts[0])}
          diameter={32}
        />{" "}
        Profile of <code>{address}</code>
      </h1>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
