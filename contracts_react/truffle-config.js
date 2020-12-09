const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

networks:{
  development: {
  host: "localhost",     // Localhost (default: none)
  port: 8545,            // Standard Ethereum port (default: none)
  network_id: "*",
  gas: 60721975,      // Any network (default: none)
  gasPrice: 25000000000
},
},


  plugins: ["truffle-contract-size"],

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.6.2",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
       //settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        }
}
}
}
