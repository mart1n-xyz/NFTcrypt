# Security measures and attack-preventing patterns

## Ownable.sol + Factory as ownership management
Rather than relying on a single contract with complex rights management, I chose to employ a factory that deploys individual ERC721 compatible contracts that are Ownable and use the established _onlyOwner_ function modifier to manage access control. _Ownable.sol_ by OpenZeppelin contract is widely used and tested in production.  

## SafeMath for _uint256_
To prevent integer attacks, I implement _SafeMath.sol_ by OpenZeppelin. Again, a standard, established library.

## Pausability
The Child contract public non-view functions are pausable (via a function modifier) for the state of emergency.

## Kill SimpleSave
Given the basic nature of the contract, it can be killed by the owner (to prevent further use) once there is a transition to a more sophisticated one. 

## Avoiding reentrancy 
To avoid reentrancy on withdrawals, the contract does not store any ETH. All the proceeds from a sale are transfered to the seller as a part of the purchase transaction. 
























