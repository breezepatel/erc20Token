
const ERC20 = artifacts.require("Cryptos");
const CrowdSale = artifacts.require("CrowdSale");

module.exports = async function (deployer) {
  var tokenPrice = 1000000;

  deployer.deploy(CrowdSale,ERC20.address,tokenPrice);

};
