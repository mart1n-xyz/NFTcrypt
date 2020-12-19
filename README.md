# NFTcrypt v0.1
[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)


*This project has been submitted as my final project for Consensys Academy Bootcamp, class of Fall 2020.*

### Web interface
- [kanpai.finance](http://kanpai.finance/)

### Contracts on Ropsten
- Encryption key registry: 0x9F86dea78c52D9B5D67164687c62A6e098EB637D
- NFTcrypt Factory: 0x0531D149d24cea6ed7D506ab13aeb6A7B6037eC7
- SimpleSave contract: 0x3AB6a9f399F963932645B41597c95e021a45d033

### Main features
- register your encryption key in a public registry
- mint ERC721 NFT with IPFS stored metadata and encrypted secret
- offer this NFT for sale / buy other NFTs
- reencrypt the secret with buyer's encryption key to reveal the secret
- browse your NFTs, view secrets, and verify their authenticity

## How to use
### Publishing your encryption key
NFTcrypt relies on e2e public key encryption (with the functionality of Metamask). Therefore, whether you are a seller or buyer, first, you must publish your encryption key in NFTcrypt encryption key registry (EncKeyRegistry contract). That makes it accessible for the seller, so that s/he can use it for encryption of the secret for you. 
### Batches
NFTcrypt tokens are organized in batches. A batch is a set of tokens that share the same metadata/characteristics, including the same secret. Hence, apart from tokenID, they are identical. Therefore, all the seller actions (mint, sell) apply to the entire batch, while buyers buy an individual token. However, secret reveal is seller's action that apploes to individual token as it targets a particular buyer (and respective encryption key). 
### Seller
As a seller, you need to go through the following steps:
                
1. Deploy your NFTcrypt ERC721 contract (choose its name and symbol) from NFTcrypt factory. Further steps interact with the deployed NFTcrypt contract.
2. Mint NFTcrypt batch ('Mint' in the menu)
    + Choose one of your deployed NFTcrypt contracts for minting.
    + Enter token details (name, description, URL of an image), these are uploaded as JSON to IPFS via Pinata API (link to it is set as tokenURI/metadata in the next step).
    + Enter the desired number of tokens and mint them.
    + Set the secret. It will be encrypted using your encryption key and saved in the SimpleSave contract for later reveals (so that you do not need to remember it). 
    + Hash the secret. Your secret will be hashed and saved so that once buyers decrypt the secret, its authenticity can be verified. 
    + Congrats, you just minted your NFTs. 
3. Sell your NFTs ('Manage & Sell' in the menu)
    + Select one of your contracts
    + Select the NFT batch you want to put up for a sale.
    + Enter its price in ETH and submit the transaction
    + Your batch is listed in the marketplace. Now, wait till someone buys your token. 
4. ...wait a bit more...
5. Someone bought it! That means you have to reveal the secret. (The profit was sent to your address.)
   + Go to 'Manage & Sell' and click 'Check requests for secret reveal'
   + This page lists all the reencryption requests. The buyer cannot access the secret until you reveal the secret. 
   + Click decrypt the secret and submit the transaction to reveal it. (Encrypted secret is recoved from SimpleSave, decrypted by user, encrypted using buyer's key from EncKeyRegistry, and submitted to NFTcrypt contract)
                
### Buyer
Buying a NFTcrypt token is easy:

1. Navigate to 'Marketplace' which lists tokens for sale from all contracts evr deployed by NFTcrypt factory. 
2. Pick a NFT and buy it. 
3. You can find all the tokens you own in 'Your collection.'
4. Wait for the seller to reveal the secret. 
5. Once the secret is revealed, you can decrypt it and read the super secret confidential content. The interface also checks whether the content is authentic (by hashing the decrypted message and comparing with the has stored in the contract).

## Current applications
+ Sale of tickets, reservations, etc.
+ Sale of exclusive/limited content or access
+ Distribution of promo stuff (promo codes, freebies, access codes, etc.)
+ Decentralized access control and management 

## Potential applications
+ Pay-to-view collections of NFTs (secret becomes the key to decrypt other NFTs' secrets) 

## Technical details
### Directory structure
Basic structure and relevant folders/files:

+ `/nftcrypt-ui` Web interface directory
+ `/nftcrypt-truffle-project` Truffle project directory
    + `/contracts` Deployed contracts directory
      + `/NFTcrypt.sol`
      + `/EncKeyRegistry.sol`
      + `/SimpleSave.sol`
    + `/node-modules` npm packages including contracts for inheritance
      + `/NFTcryptTools.sol` 
    + `/test` 
      + `/NFTcrypt.js` file containing tests
+ `/deployed_addresses.txt` List of deployed contracts on Ropsten
### How to run locally
#### Truffle project
+ clone the repository
+ install Ganache (`npm install -g ganache-cli`) and Truffle (`npm install truffle -g`)
+ install dependencies using `npm install`
+ run your Ganache development server and adjust `truffle-config.js` for your local development server
+ in `/nftcrypt-truffle-project` run `truffle migrate` to deploy contracts
+ use `truffle console` to interact with deployed contracts
+ use `truffle test` to run tests

#### Web interface
+ in `/nftcrypt-ui` install dependencies with `yarn` or `npm install`
+ run a development serve using `yarn start`

### Contracts
#### Encryption key registry (EncKeyRegistry.sol)
EncKeyRegistry serves as a public save contract for encryption keys. It maps the address of user to his encryption key. See the EncKeyRegistry.sol for detailed description.

#### NFTcrypt factory (NFTcrypt.sol: NFTcrypt)
NFTcrypt factory is the centrepiece of NFTcrypt infrastructure. It deploys and tracks individual ERC721 contracts. See the NFTcrypt.sol (NFTcrypt contract) for detailed description.

#### NFTcrypt Child contract (NFTcrypt.sol: Child)
Child contract is the contract that a user deploys from the NFTcrypt factory. The user is the owner of this ERC721 contract. This contract inherits from a number of OpenZeppelin contracts as well as from NFTcryptTools contract. See the NFTcrypt.sol (Child contract) for detailed description.

#### NFTcryptTools contract (NFTcryptTools.sol)
This contract contains all the mappings and internal and view functions additional to ERC721 implementation. Internal functions are callable from Child contract with onlyOwner modifier. See the NFTcryptTools.sol for detailed description.

#### SimpleSave contract (SimpleSave.sol) - DO NOT USE IN PRODUCTION
SimpleSave is a simple save contract for the secret encrypted by the minter/seller. Secret is saved during the minting process and recovered during secret reveal. Currently, this contract runs a simple saving logic and saved data can be altered by a third party. A production release, requires way better access control. See the SimpleSave.sol for detailed description.




## Current limitations and possible remedies
+ Transfers are disabled
    + Allowing transfers means introducing further reencryption by the sender. While this is feasible, it introduces the possibility that the secret may be tampered  by the sender. The authenticity of the content can be verified by the receiver; however, the original secret won't be recoverable if altered. 
    + Alternatively, a solution based on third party proxy reencryption possible (NuCypher style).  
+ Adding to an existing batch not possible
    + The contract is capable of this. The feature is yet to be built into the web interface. Currently, it would break the query logic of the web interface.
+ Minting a large batch may exceed the block limit (on Ropsten)
    + Could be prevented by additional "add to batch" transactions.
+ Slow loading times for the UI (particularly "Secret reveal", "Marketplace", and "Your collection")
    + Further optimization via Events and better indexing possible in the smart contracts.
+ Price cannot be zero
    + Free NFTs would be possible with better batch indexing in the smart contracts. However, there could be misaligned incentives in case the cost of scret-reveal transaction are higher than the profit of the trade. 
+ Image or video not admissible as secret
    + Solvable using third-party hosting and access control.
+ Registering encryption key necessary for Marketplace access
    + UI requirement, can be dropped.
+ Standard existing NFTs cannot have secret issued
    + It is technically feasible to have a secret issued but further transfers and trade would have to take place at NFTcrypt. 
+ UI is too basic and rather dull
    + Action flow can be improved, some transactions can be done at once, and marketplace can have filtering.





