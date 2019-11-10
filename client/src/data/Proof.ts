import ServiceIds from "./ServiceIds";

type Proof = {
  svc: ServiceIds;
  identifier: string;
  meta?: string;
};
export default Proof;