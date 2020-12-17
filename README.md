# NFTcrypt v0.1
[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)


*This project has been submitted as my final project for Consensys Academy Bootcamp, class of Fall 2020.*

### Web interface
- [kanpai.finance](http://kanpai.finance/)

### Main features
- register your encryption key in a public registry
- mint ERC721 NFT with IPFS stored metadata and encrypted secret
- offer this NFT for sale / buy other NFTs
- reencrypt the secret with buyer's encryption key to reveal the secret
- browse your NFTs, view secrets, and verify their authenticity

## How to use

### Seller

### Buyer

## Contracts

### Encryption key registry

### NFTcrypt factory

### NFTcrypt child contract

### SimpleSave contract

### Contracts on Ropsten
- Encryption key registry: 0x9F86dea78c52D9B5D67164687c62A6e098EB637D
- NFTcrypt Factory: 0x0531D149d24cea6ed7D506ab13aeb6A7B6037eC7
- SimpleSave contract: 0x3AB6a9f399F963932645B41597c95e021a45d033


## Current applications
+ Sale of tickets, reservations, etc.
+ Sale of exclusive/limited content or access
+ Distribution of promo stuff (promo codes, freebies, access codes, etc.)
+ Decentralized access control and management 

## Potential applications
+ Pay-to-view collections of NFTs (secret becomes the key to decrypt other NFTs' secrets) 



## Current limitations and possible remedies
+ Transfers are disabled
    + Allowing transfers means introducing further reencryption by the sender. While this is feasible, it introduces the possibility that the secret may be tampered  by the sender. The authenticity of the content can be verified by the receiver; however, the original secret won't be recoverable if altered. 
    + Alternatively, a solution based on third party proxy reencryption possible (NuCypher style).  
+ Adding to an existing batch not possible
    + The contract is capable of this. The feature is yet to be built into the web interface. 
+ Minting a large batch may exceed the block limit (on Ropsten)
    + Could be prevented by additional "add to batch" transactions.
+ Slow loading times for the UI (particularly "Secret reveal", "Marketplace", and "Your collection")
    + Further optimization via Events and better indexing possible in the smart contracts.
+ Price cannot be zero
    + Free NFTs possible with better batch indexing in the smart contracts.
+ Image or video not admissible as secret
    + Solvable using third-party hosting and access control.
+ Registering encryption key necessary for Marketplace access
    + UI requirement, can be dropped.
+ Standard existing NFTs cannot have secret issued
    + It is technically feasible to have a secret issued but further transfers and trade would have to take place at NFTcrypt. 
+ UI is too basic and rather dull
    + Action flow can be improved, some transactions can be done at once, and marketplace can have filtering.





