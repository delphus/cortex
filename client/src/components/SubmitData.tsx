import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as api from "../util/submit-api";
import { message } from "antd";

const Center = styled.div`
  text-align: center;
`;
//fix this action
const SubmitDataForm = styled.form`
  action = "/action_page.php";
  method = "post";
`;

export default function SubmitData() {
  let adminLevel = "Administrator"; // CHANGE THIS LATER
  let userList: string[] = ["Bob 1", "Bob 2", "Bob 3"]; // FIX THIS ALSO

  const [data, setData] = useState("");
  const [dec, setDec] = useState<string | null>(null);

  const users = userList.map(str => <li key={str}>{str}</li>);

  const ciphertext = localStorage.getItem("ciphertext");

  useEffect(() => {
    (async () => {
      const decrypted = await api.retrieve(
        0,
        localStorage.getItem("ciphertext")!
      );
      setDec(decrypted);
    })();
  }, [ciphertext]);

  return (
    <>
      <Center>
        <h2>Submit Data</h2>
        <h2>
          Showing Data With Encryption Level: <b>{adminLevel}</b>
        </h2>
      </Center>

      <h3>Other users with {adminLevel} access: </h3>
      <ul>{users}</ul>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <SubmitDataForm
        onSubmit={async e => {
          e.preventDefault();
          const ciphertext = await api.encrypt(data);
          localStorage.setItem("ciphertext", ciphertext);
          message.info(`Successfully NuCypherified text as ${ciphertext}`);
          setData("");
        }}
      >
        Add Data:
        <br />
        <input
          type="text"
          name="data"
          size={100}
          value={data}
          onChange={e => setData(e.target.value)}
        />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </SubmitDataForm>

      <br />
      <br />
      <br />
      <br />

      <Center>
        <h3>Previously Submitted Data</h3>
      </Center>

      {dec || localStorage.getItem("ciphertext")}
    </>
  );
}
