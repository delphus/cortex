import { useContext } from "react";
import { DrizzleContext } from "../App";

export default function NuCypher() {
  const context = useContext(DrizzleContext);
  console.log("NuCypher:", context);

  return null;
}