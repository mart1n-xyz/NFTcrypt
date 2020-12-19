## Design pattern decisions

### Factory
Rather than going with a single contract, I decided to implement a factory where user deploys his own NFTcrypt implementation. The obvious benefit is the control over the entire contract that the user has. From a security perspective, making the individual contracts _Ownable_ simplifies to a large degree access and rights control that would have to be implemented had this been one central contract. An unpleasant drawback is the advanced querying that has to take place across separate contracts to extract data for the web interface (e.g. marketplace). Hence, the cost comes in the form of slow UI but does not harm functionality. 

### Batches
NFTcrypts are produced in batches. These are tokens with identical content which share the same metadata (i.e. IPFS link), and other properties (e.g. saved secret hash). This indexing helps to lower gas costs and optimize storage. Additionally, it helps in tracking how many tokens (with the same properties) are available to purchase.

### Compatibility with ERC721
NFTcrypt tokens are an implementation of ERC721 (via OpenZeppelin contracts) which is a standard for NFTs nowadays. Therefore, users can benefit from the number of tooling taht is available for this standard. 

### Metadata (URI) on IPFS
The choice to incorporate IPFS for storing metadata (token URI) is adopteed as it is a common practice for various NFT platforms. The data is uploaded as JSON using Pinata API and a link is saved in the contract. This helps to save on gas and allows to store larger data. 

### Revealed secret (i.e. encrypted for buyer) stored on IPFS
Same logic as above applies here. 

### Saving separate
Since the SimpleSave contract is very basic, this functionality is delegated to a separate contract so that the contract can be upgraded in the future. 

### Save commitment
The app requires the seller's secret to be saved during the minting process. This is to ensure a commitment to the secret before a token is put to sale. Otherwise, the seller could alter the secret before revealing which is actually feasible, only the interface does not allow for it. However, in such a case, the seller would also need to alter the saved hash to circumvent verification issues.  

### Register separate
The encryption key register is a separate contract. This is to make it independent of NFTcrypt so that it can be used by other contracts and won't be affected by any changes of the NFTcrypt implementation. 

### Hash for verification
Using the hash of the secret (saved in the contract by the seller) helps verify the authenticity of the secret. This can potentially be highly relevant if transfers are enabled in the future. 

### Transfers disabled
The current version does not support transfers (other than seller -> initial buyer). This is because transfers introduce the need to reencrypt the secret by the sender. This can create a security risk as the sender can alter the secret. Though receiver may verify it using the hash, it is only after the transfer is made and cannot be revoked. A possible solution would be using NuCypher's proxy reencryption. 





