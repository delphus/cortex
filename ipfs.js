const Ipfs = require("ipfs-http-client");
const node = new Ipfs("ipfs.infura.io", 5001, { protocol: "https" });

(async () => {
  const results = await node.addFromFs("client/build", { recursive: true });
  console.log(results);
})();
