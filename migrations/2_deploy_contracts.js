
const ERC20 = artifacts.require("Cryptos");
const CrowdSale = artifacts.require("CrowdSale");

module.exports = async function (deployer) {
  deployer.deploy(ERC20);
};
