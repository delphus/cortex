export async function encrypt(message: string) {
  const res = await fetch("/reqEnc", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      noteHash: "",
      from: "0x0",
      to: "0x0",
      label: "admin"
    })
  });

  return await res.text();
}

/**
 * Grants bob #x to the admin policy.
 */
export async function grant(bobIndex: number) {
  await fetch("/grant", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bobIndex,
      policyName: "admin"
    })
  });
}

/**
 * Retrieves the decrypted message given a bobIndex to theoretically fetch from and the encrypted message.
 * @param bobIndex
 * @param encryptedMessage
 */
export async function retrieve(bobIndex: number, encryptedMessage: string) {
  const res = await fetch("/retrieve", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bobIndex,
      policyName: "admin",
      encViewKey: encryptedMessage
    })
  });

  return (await res.json())[0];
}
