import { useContext } from "react";
import { DrizzleContext } from "../App";

export default function NuCypher() {
  const { drizzle } = useContext(DrizzleContext);
  console.log("NuCypher:", drizzle);

  return null;
}
