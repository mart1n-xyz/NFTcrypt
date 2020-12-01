var EncKeyRegistry = artifacts.require("./EncKeyRegistry.sol");

module.exports = function(deployer) {
	deployer.deploy(EncKeyRegistry);
};
