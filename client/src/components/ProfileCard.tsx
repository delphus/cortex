import React, { useEffect, useContext, useState } from "react";
import { Avatar } from "antd";
import ServiceId from "../data/ServiceIds";
import { DrizzleContext } from "../App";
import Proof from "../data/Proof";
import verifyProof from "../util/verifyProof";

function ProofEntry({ proof }: { proof: Proof }) {
  const { drizzle, readinessState } = useContext(DrizzleContext);
  const userAddr = readinessState.drizzleState.accounts;
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      if (proof.svc === ServiceId.ETHEREUM) {
        try {
          drizzle.web3.eth.personal.ecRecover(userAddr, proof.meta!);
          setVerified(true);
          return;
        } catch (e) {
          setVerified(false);
          setErr("Unable to verify EC");
          return;
        }
      }
      const res = await verifyProof(
        drizzle.web3,
        proof,
        readinessState.drizzleState.accounts[0]
      );

      if (res === "Verified") {
        setVerified(true);
      } else {
        setVerified(false);
        setErr(res);
      }
    })();
  }, [proof, drizzle, userAddr]);

  return (
    <>
      {proof.identifier} {proof.svc} {verified && verified.toString()} {err}
    </>
  );
}

export default function ProfileCard({ address }: { address: string }) {
  const { drizzle } = useContext(DrizzleContext);
  const [proofs, setProofs] = useState<Proof[]>([]);
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
      let p: Proof[] = [];
      for (const svc of svcs) {
        const { meta, identifier } = await Cortex.methods
          .getProofFromUser(address, svc)
          .call();
        if (identifier !== "") {
          p.push({
            svc,
            identifier,
            meta: drizzle.web3.utils.hexToAscii(meta)
          });
        }
      }
      setProofs(p);
      console.log(p);
    })();
  }, [address, drizzle]);

  return (
    <>
      <Avatar>{address}</Avatar>
      {proofs.map(proof => (
        <ProofEntry proof={proof} key={proof.svc} />
      ))}
    </>
  );
}
