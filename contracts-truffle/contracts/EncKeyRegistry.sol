pragma solidity >= 0.5.0 < 0.7.0;

contract EncKeyRegistry {
    mapping(address => string) public encKey;

    function setKey(string memory key) public {
        encKey[msg.sender] = key;
    }

    function getMyKey() public view returns (string memory) {
        return encKey[msg.sender];
    }
    function getKey(address _address) public view returns (string memory) {
        return encKey[_address];
    }
    function deleteKey() public  {
        delete encKey[msg.sender];
    }
}
