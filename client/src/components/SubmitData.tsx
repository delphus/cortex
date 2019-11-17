import React from "react";
import styled from "styled-components";

export default function SubmitData() {

  let adminLevel = "Administrator"; //CHANGE THIS LATER
  let userList: string[] = ["a", "b", "c"] //FIX THIS ALSO
  let previousData: string[] = ["hi", "greetings", "hello"] //do this

  const users = userList.map( (str) => <li>{str}</li>)
  const prevData = previousData.map( (str) => <li>{str}</li>)
   
  const Center = styled.div`
    text-align: center;
  `
 //fix this action
  const SubmitData = styled.form`
    action="/action_page.php";
    method = "post";
  `
  
  return (
    <>
      <Center>
        <h2>Submit Data</h2>
        <h2>Showing Data With Encryption Level: <b>{adminLevel}</b></h2>
      </Center>

      <h3>Other users with {adminLevel} access: </h3>
      <ul>{users}</ul>


      <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        
      <SubmitData>
        Add Data:
        <br/>
        <input type="text" name="data" size={100}/>
       

        <br/>
        <br/>
        <input type="submit" value="Submit" name="data"/>
      </SubmitData>

      <br/>
        <br/>
        <br/>
        <br/>

      <Center>
        <h3>Previously Submitted Data</h3>
      </Center>

      <ul>
        {prevData}
      </ul>

    
    </>

    
  );
}
