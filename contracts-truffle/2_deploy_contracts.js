var EncKeyRegistry = artifacts.require("./EncKeyRegistry.sol");
var NFTcrypt = artifacts.require("./NFTcrypt.sol");
var SimpleSave = artifacts.require("./SimpleSave.sol");

module.exports = function(deployer) {
	deployer.deploy(EncKeyRegistry);
  deployer.deploy(NFTcrypt);
  deployer.deploy(SimpleSave);
};
