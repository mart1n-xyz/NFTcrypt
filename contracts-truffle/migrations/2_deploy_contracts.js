var EncKeyRegistry = artifacts.require("./EncKeyRegistry.sol");
var NFTcrypt = artifacts.require("./NFTcrypt.sol");

module.exports = function(deployer, network) {
    deployer.deploy(EncKeyRegistry);
		deployer.deploy(NFTcrypt);
};
