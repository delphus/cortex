import React, { useContext } from "react";
import { DrizzleContext } from "../App";

export default function Profile() {
  const { drizzle } = useContext(DrizzleContext);

  console.log(drizzle);

  return null;
}