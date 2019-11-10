import ServiceIds from "../data/ServiceIds";
import Proof from "../data/Proof";
import Web3 from "web3";

async function fetchProof({ svc, identifier }: Proof) {
  switch (svc) {
    case ServiceIds.HTTPS:
      return (await fetch(
        `https://cors-anywhere.herokuapp.com/https://${identifier}/.well-known/cortex.txt`
      ).then(r => r.text())).trim();
    case ServiceIds.REDDIT:
    case ServiceIds.ETHEREUM:
    case ServiceIds.EMAIL:
      throw new Error("Not yet implemented!");
  }
}

export default async function verifyProof(
  web3: Web3,
  proof: Proof,
  creator: string
) {
  let fetched: string;
  try {
    fetched = await fetchProof(proof);
  } catch (e) {
    console.error(e);
    return "Failed to fetch proof";
  }

  try {
    const address = await web3.eth.personal.ecRecover(
      proof.identifier,
      fetched
    );
    if (address.toLowerCase() === creator.toLowerCase()) {
      return "Verified";
    } else {
      return "Proof signed by incorrect person";
    }
  } catch (e) {
    return "Proof verification failed";
  }
}
