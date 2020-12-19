pragma solidity  >=  0.4.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "NFTcryptTools.sol";

/// @title NFTcrypt - non-transferable ERC721 with secret content
/// @author Martin Strobl
/// @notice The contract is a factory for (non-transferable) ERC721 NFC standard (Child contracts) with additional E2E secret handling functions
contract NFTcrypt {
  using EnumerableSet for EnumerableSet.AddressSet;


    /// mapping from deployer to deployed adresses
    mapping (address => EnumerableSet.AddressSet) private _deployedSet;
    /// mapping for a simple list of child contracts
    mapping (uint256 => address) public deployed;

    /// tracking the number fo deployed children
    uint256 public lastChildId = 0;

    /// @notice Deploy a Child ERC721 contract
    /// @dev The contract has to be payable despite no need for that
    /// @param name name of the ERC721 contract (e.g. Cryptokitties)
    /// @param abb Abbreviation of the contract name (e.g. CK)
    function createChild(string memory name, string memory abb) public payable {
        address issueContract = address((new Child).value(msg.value)(name, abb, msg.sender));
        _deployedSet[msg.sender].add(issueContract);
        deployed[lastChildId+1] = issueContract;
        lastChildId++;
    }

    /// @notice Return a list of deployed contracts
    /// @dev The at() approach may be suboptimal
    /// @param owner address of the owner whose contract we want to return
    /// @param id position of the contract in the list of owner's contracts
    /// @return address of a deployed Child contract
    function deployedAddress(address owner, uint256 id) public view returns (address) {
      return _deployedSet[owner].at(id);
    }

    /// @notice Return a deployed contracts by id
    /// @param id position of the contract in the list of deployed contracts
    /// @return address of a deployed Child contract
    function getDeployed(uint256 id) public view returns (address) {
      return deployed[id];
    }


}
/// @title ERC721 implementation of NFTcrypt ERC721 tokens with ncrypted secret
/// @author Martin Strobl
/// @notice contract handles issuance of NFTs, their setup, sale, and secret transmission
/// @notice transfers are disabled via
/// @dev view functions and mappings are inherited from NFTcryptTools.sol
contract Child is ERC721,Ownable,NFTcryptTools {
  /// @notice Sets up ERC721 naming and transfers contract ownership
  /// @param name name of the ERC721 contract (passed from factory)
  /// @param abb Abbreviation of the contract name (passed from factory)
  /// @param newOwner Address of the owner (passed from factory)
   constructor (string memory name, string memory abb, address newOwner) ERC721(name, abb) public payable {
        transferOwnership(newOwner);
   }
   /// @notice Log for new issuance of tokens to a batch
   /// @param numberOfNft Number of tokens issued
   event LogNewToB(uint256 numberOfNft, uint256 batchId);
   /// @notice Sets up ERC721 naming and transfers contract ownership
   event LogBatchURI(uint256 batchId, string _tokenURI);
   /// @notice Sets up ERC721 naming and transfers contract ownership
   event LogSold(uint256 tokenId, uint256 price, address buyer);

   /// @notice Mints new NFT tokens and adds to a batch
   /// @dev _batchSet keeps track of tokens in a batch
   /// @param number how many tokens to issue
   /// @param batch to which batch should the tokens be assigned
   function _issueNFT(uint256 number, uint256 batch) internal {
     uint256 i =1;
     while (i<= number) {
       maxIndex++;
       _mint(msg.sender,maxIndex);
       _batchSet[batch].add(maxIndex);
        i++;
     }
   }

   /// @notice Handles issance of tokens to a new batch or to and existing batch
   /// @dev could be split to 2 functions but this saves on the contract size, if higher batchId than the max batch (lastBatch), issued to a new batch with id lastBatch+1
   /// @param numberOfNft number of tokens to be issued
   /// @param batchId id of the batch I want the new tokens issue to
   function NewToBatch(uint256 numberOfNft, uint256 batchId) onlyOwner public  {
     if (lastBatch>=batchId) {
       _issueNFT(numberOfNft,batchId);
       batchMax[batchId] = batchMax[batchId] + numberOfNft;
       emit LogNewToB(numberOfNft,batchId);
     } else {
     _issueNFT(numberOfNft,lastBatch+1);
     lastBatch = lastBatch+1;
     batchMax[lastBatch] = numberOfNft;
     emit LogNewToB(numberOfNft,lastBatch);
   }

   }


   /// @notice Sets token URI (metadata) for the whole batch
   /// @param batchId the target batch
   /// @param _tokenURI the metadata to assign
   function setBatchTokenURI(uint256 batchId, string memory _tokenURI) onlyOwner public  {
    require(lastBatch>=batchId);
    uint256 _i = 0;
    while (_i<batchMax[batchId]) {
      _setTokenURI(_batchSet[batchId].at(_i), _tokenURI);
      _i++;
    }
    emit LogBatchURI( batchId, _tokenURI);
   }

   /// @notice Issues a new batch and assigns URI (metadata)
   /// @param numberOfNft number of tokens to issue
   /// @param _tokenURI the metadata to assign
   function newBatchWithURI(uint256 numberOfNft,string memory _tokenURI) onlyOwner public {
     NewToBatch(numberOfNft,lastBatch+1);
     setBatchTokenURI(lastBatch,_tokenURI);
   }

   /// @notice Sets token URI (metadata) for a token
   /// @param tokenId the target token
   /// @param _tokenURI the metadata to assign
   function setTokenURI(uint256 tokenId, string memory _tokenURI) public tokenExists(tokenId) onlyOwner {
     _setTokenURI(tokenId,_tokenURI);
   }

   /// @notice Saves encrypted secret (contract owner releases the secret encrypted with token holder's encr. key)
   /// @dev checks that token exist, operation by batch is not possible, only for sold tokens
   /// @param tokenId the token for secret assignment
   /// @param secret the encrypted message I want to assign as a secret
    function setEncSecret(uint256 tokenId, string memory secret) public tokenExists(tokenId) onlyOwner {
      require(ownerOf(tokenId)!=msg.sender);
     _encrSecret[tokenId] = secret;
   }

   /// @notice Saves hash of the decrypted secret for the whole batch
   /// @dev for client-side verification of the secret
   /// @param batchId target batch
   /// @param hashed the hash of unencrypted secret
    function setSecretHash(uint256 batchId, string memory hashed) public onlyOwner {
     _secretHash[batchId] = hashed;
   }

   /// @notice Sets the token price for a token and puts it up for sale
   /// @dev callable only by the owner of the contract and toke, i.e. a token can be sold only once
   /// @param tokenId target token
   /// @param price min sale price
   function setPrice(uint256 tokenId, uint256 price) public tokenExists(tokenId) onlyOwner {
     require(ownerOf(tokenId)==msg.sender);
     _setPrice(tokenId,price);
   }

   /// @notice Sets the token price for the whole batch and puts it up for sale
   /// @dev callable only by the owner of the contract and toke, i.e. a token can be sold only once
   /// @param batchId target batch
   /// @param price min sale price
   function setBatchPrice(uint256 batchId, uint256 price) onlyOwner public  {
    require(lastBatch>=batchId);
    uint256 _i = 0;
    while (_i<batchMax[batchId]) {
      setPrice(_batchSet[batchId].at(_i), price);
      _i++;
    }
   }

   /// @notice Buy a token
   /// @dev token has to be put up for sale and the amount must be more or equal than price
   /// @param tokenId target token
   function purchase(uint256 tokenId) public stopInEmergency tokenExists(tokenId) payable {
     require(forSale[tokenId]==true && msg.value>=origPrice[tokenId]);
     _transfer(owner(), msg.sender, tokenId);
     forSale[tokenId]=false;
     address payable seller = payable(owner());
     seller.transfer(msg.value);
     emit LogSold( tokenId,  msg.value, msg.sender);
   }


   /// @notice Pause selling
   /// @param change state you want to change to
   function togglePause(bool change) public onlyOwner {
          stopped = change;
   }

}
