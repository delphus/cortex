const Cortex = artifacts.require("Cortex");

module.exports = function(deployer) {
  deployer.deploy(Cortex);
};