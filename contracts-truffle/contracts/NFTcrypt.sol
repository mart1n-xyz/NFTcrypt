pragma solidity  >=  0.4.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "NFTcryptTools.sol";

contract NFTcrypt {
  using EnumerableSet for EnumerableSet.AddressSet;

  /*
  address public registry;
  function setRegistry(address reg) public onlyOwner {
     registry = reg;
  }*/
    //event LogCreatedChild(address sender, string arg, string ticker, address created, address newOwner);
    mapping (address => EnumerableSet.AddressSet) private _deployedSet;
    function createChild(string memory name, string memory abb) public payable {
        //address newOwner = ;
        address issueContract = address((new Child).value(msg.value)(name, abb, msg.sender));
        //emit LogCreatedChild(msg.sender, name, abb, issueContract, msg.sender);
        _deployedSet[msg.sender].add(issueContract);
    }
    function deployedAddress(address owner, uint256 id) public view returns (address) {
      return _deployedSet[owner].at(id);
    }
}

contract Child is ERC721,Ownable,NFTcryptTools {

   //event LogCreatedBy(address creator, string name, string ticker);
   // address public encKeyReg;
   //string public ownerName;

   constructor (string memory name, string memory abb, address newOwner) ERC721(name, abb) public payable {
        transferOwnership(newOwner);
        //encKeyReg = registry;
        //ownerName = ownerNm;
        //emit LogCreatedBy(msg.sender, name, abb);
   }



   //mapping (uint256 => uint256) public batchReg;
   //mapping (uint256 => EnumerableSet.UintSet) _batchSet;
   //mapping (uint256 => uint256) public batchMax;

   event LogNewOwner(string ownNme);
   event LogNewToB(uint256 numberOfNft, uint256 batchId);
   event LogBatchURI(uint256 batchId, string _tokenURI);
   event LogSold(uint256 tokenId, uint256 price, address buyer);
   event LogWithdrawal(uint256 value,address receiver);
/*
   function setOwnerName(string memory ownNme) public onlyOwner {
     ownerName=ownNme;
     emit LogNewOwner(ownNme);
   }*/
   function _issueNFT(uint256 number, uint256 batch) internal {
     uint256 i =1;
     while (i<= number) {
       maxIndex++;
       _mint(msg.sender,maxIndex);
       //batchReg[maxIndex]=batch;
       _batchSet[batch].add(maxIndex);
        i++;
     }
   }




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



   function setBatchTokenURI(uint256 batchId, string memory _tokenURI) onlyOwner public  {
    require(lastBatch>=batchId, "no b");
    uint256 _i = 0;
    while (_i<batchMax[batchId]) {
      _setTokenURI(_batchSet[batchId].at(_i), _tokenURI);
      _i++;
    }
    emit LogBatchURI( batchId, _tokenURI);
   }

   function newBatchWithURI(uint256 numberOfNft,string memory _tokenURI) onlyOwner public {
     NewToBatch(numberOfNft,lastBatch+1);
     setBatchTokenURI(lastBatch,_tokenURI);
   }

   function setTokenURI(uint256 tokenId, string memory _tokenURI) public tokenExists(tokenId) onlyOwner {
     _setTokenURI(tokenId,_tokenURI);
   }





    function setEncSecret(uint256 tokenId, string memory secret) public tokenExists(tokenId) onlyOwner {
     _encrSecret[tokenId] = secret;
   }
    function setSecretHash(uint256 batchId, string memory hashed) public onlyOwner {
     _secretHash[batchId] = hashed;
   }

/**
    function buyer(uint256 tokenId) public view returns(address) {
     return purchased[tokenId];
   }
   **/


   function setPrice(uint256 tokenId, uint256 price) public tokenExists(tokenId) onlyOwner {
     require(ownerOf(tokenId)==msg.sender);
     _setPrice(tokenId,price);
   }

   function setBatchPrice(uint256 batchId, uint256 price) onlyOwner public  {
    require(lastBatch>=batchId, "no b");
    uint256 _i = 0;
    while (_i<batchMax[batchId]) {
      setPrice(_batchSet[batchId].at(_i), price);
      _i++;
    }
   }

   function purchase(uint256 tokenId) public tokenExists(tokenId) payable {
     require(forSale[tokenId]==true && msg.value>=origPrice[tokenId],'er');
     //purchased[tokenId]=msg.sender;
     _transfer(owner(), msg.sender, tokenId);
     forSale[tokenId]=false;
     emit LogSold( tokenId,  msg.value, msg.sender);
     //_boughtTokens[msg.sender].add(tokenId);
   }
   function withdraw() onlyOwner public {
        uint256 value = address(this).balance;
        msg.sender.transfer(value);
        emit LogWithdrawal(value,msg.sender);
    }


/**
TO DO:

batch by id
edit to match style good practices
batchmax na length



function setBatchHash(uint256 batchId, string memory _hashed) public onlyOwner {
  BatchApply(batchId,  _hashed, bytes4(keccak256("setSecretHash(uint256,string)")));
}

**/


}
