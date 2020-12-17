var SimpleSave = artifacts.require("./SimpleSave.sol");
var EncKeyRegistry = artifacts.require("./EncKeyRegistry.sol");
var NFTcrypt = artifacts.require("./NFTcrypt.sol");


module.exports = function(deployer) {
	deployer.deploy(SimpleSave);
	deployer.deploy(EncKeyRegistry);
  deployer.deploy(NFTcrypt);

};
