pragma solidity  >=  0.4.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTcrypt {

    event LogCreatedChild(address sender, string arg, string ticker, address created, address newOwner);

    function createChild(string memory name, string memory abb) public payable {
        address newOwner = msg.sender;
        address issueContract = address((new Child).value(msg.value)(name, abb, newOwner));
        emit LogCreatedChild(msg.sender, name, abb, issueContract, newOwner);
    }
}

contract Child is ERC721,Ownable {

   event LogCreatedBy(address creator, string name, string ticker);

   constructor (string memory name, string memory abb, address newOwner) ERC721(name, abb) public payable {
        transferOwnership(newOwner);

        emit LogCreatedBy(msg.sender, name, abb);
   }
}
