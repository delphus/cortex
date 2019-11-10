import React, { useEffect, useContext, useState } from "react";
import { Avatar } from "antd";
import ServiceId from "../data/ServiceIds";
import { DrizzleContext } from "../App";

type Proof = {
  svc: ServiceId;
  identifier: string;
};

async function fetchProof({ svc, identifier }: Proof) {
  switch (svc) {
    case ServiceId.HTTPS:
      return await fetch(`https://crossorigin.me/https://${identifier}`).then(
        r => r.text()
      );
    case ServiceId.REDDIT:
    case ServiceId.EMAIL:
      throw new Error("Not yet implemented!");
  }
}

function ProofEntry({ proof }: { proof: Proof }) {
  const { drizzle } = useContext(DrizzleContext);
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      let fetched: string;
      try {
        fetched = await fetchProof(proof);
      } catch (e) {
        console.error(e);
        setErr("Failed to fetch proof.");
        setVerified(false);
        return;
      }

      try {
        await drizzle.web3.eth.personal.ecRecover(proof.identifier, fetched);
        setVerified(true);
      } catch (e) {
        setVerified(false);
        setErr("Proof check failed.");
      }
    })();
  });

  return (
    <>
      {proof.identifier} {proof.svc} {verified} {err}
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
      const svcs = [ServiceId.HTTPS, ServiceId.EMAIL, ServiceId.REDDIT];
      let p: Proof[] = [];
      for (const svc of svcs) {
        const { identifier } = await Cortex.methods
          .getProofFromUser(address, svc)
          .call();
        if (identifier !== "") {
          p.push({ svc, identifier });
        }
      }
      setProofs(p);
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
