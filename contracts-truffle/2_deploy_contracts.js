var EncKeyRegistry = artifacts.require("./EncKeyRegistry.sol");
var NFTcrypt = artifacts.require("./NFTcrypt.sol");

module.exports = function(deployer) {
	deployer.deploy(EncKeyRegistry);
  deployer.deploy(NFTcrypt);
};
