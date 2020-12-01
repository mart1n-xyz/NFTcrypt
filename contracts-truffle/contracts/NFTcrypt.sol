pragma solidity  >=  0.4.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Child is ERC721 {
   string public a;

   event LogCreatedBy(address creator, string arg);

   constructor (string memory arg) ERC721("GameItem", "ITM") public payable {
       a = arg;
       emit LogCreatedBy(msg.sender, a);
   }
}

contract NFTcrypt {

    event LogCreatedChild(address sender, string arg, address created);

    function createChild(string memory arg) public payable {
        address issueContract = address((new Child).value(msg.value)(arg));
        emit LogCreatedChild(msg.sender, arg, issueContract);
    }
}
