pragma solidity  >=  0.4.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";


contract NFTcrypt is Ownable {
  using EnumerableSet for EnumerableSet.AddressSet;

  address public registry;
  function setRegistry(address reg) public onlyOwner {
     registry = reg;
  }

    event LogCreatedChild(address sender, string arg, string ticker, address created, address newOwner);
    mapping (address => EnumerableSet.AddressSet) private _deployedSet;



    function createChild(string memory name, string memory abb) public payable {
        address newOwner = msg.sender;
        address issueContract = address((new Child).value(msg.value)(name, abb, newOwner, registry));
        emit LogCreatedChild(msg.sender, name, abb, issueContract, newOwner);
        _deployedSet[msg.sender].add(issueContract);
    }
    function deployedAddress(address owner, uint256 id) public view returns (address) {
      return _deployedSet[owner].at(id);
    }
}

contract Child is ERC721,Ownable {

   event LogCreatedBy(address creator, string name, string ticker);
   event LogEncKeyRead(address target, bytes key, bool status);

   address public encKeyReg;

   constructor (string memory name, string memory abb, address newOwner, address registry) ERC721(name, abb) public payable {
        transferOwnership(newOwner);
        encKeyReg = registry;
        emit LogCreatedBy(msg.sender, name, abb);
   }

   uint256 maxIndex = 0;
   uint256 lastBatch = 0;

   mapping (uint256 => uint256) public batchReg;
   mapping (uint256 => EnumerableSet.UintSet) _batchSet;
   mapping (uint256 => uint256) public batchMax;
   mapping (uint256 => string) public encrSecret;
   mapping (uint256 => string) public secretHash;

   function _issueNFT(uint256 number, uint256 batch) internal {
     uint256 i =1;
     while (i<= number) {
       maxIndex++;
       _safeMint(msg.sender,maxIndex);
       batchReg[maxIndex]=batch;
       _batchSet[batch].add(maxIndex);
        i++;
     }
   }

   function createNewBatch(uint256 numberOfNft) onlyOwner public  {
     uint256 batchId = lastBatch+1;
     _issueNFT(numberOfNft,batchId);
     lastBatch = batchId;
     batchMax[batchId] = numberOfNft;
   }

   function batchExists(uint256 batchId) public view returns (bool) {
     if (lastBatch>=batchId) {
       return true;
     } else {
       return false;
     }
   }

   function addToBatch(uint256 numberOfNft, uint256 batchId) onlyOwner public  {
     require(batchExists(batchId), "ERC721: operator query for nonexistent batch");
     _issueNFT(numberOfNft,batchId);
     batchMax[batchId] = batchMax[batchId] + numberOfNft;
   }

   function batchSize(uint256 batchId) public view returns (uint256)  {
     require(batchExists(batchId), "ERC721: operator query for nonexistent batch");
     uint256 size = batchMax[batchId];
     return size;
   }

   function setBatchTokenURI(uint256 batchId, string memory _tokenURI) onlyOwner public  {
    uint256 size = batchSize(batchId);
    uint256 _i = 0;
    while (_i<size) {
      _setTokenURI(_batchSet[batchId].at(_i), _tokenURI);
      _i++;
    }
   }

   function getBatch(uint256 tokenId) public view returns (uint256) {
     return batchReg[tokenId];

   }

   function keyReg() public view returns (address) {
     return encKeyReg;

   }

/**

   function readEncKey(address _var) public returns (bytes memory) {
     bool status;
     bytes memory result;
     address _reg = keyReg();
     (status,result) = _reg.delegatecall(abi.encodePacked(bytes4(keccak256("getKey(address)")), _var));
     emit LogEncKeyRead( _var ,  result, status);
     return result;

    }

**/


}
