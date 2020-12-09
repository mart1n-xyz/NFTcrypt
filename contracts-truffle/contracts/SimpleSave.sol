pragma solidity >= 0.5.0 < 0.7.0;

import "@openzeppelin/contracts/utils/EnumerableSet.sol";

/// @title SimpleSave
/// @author Martin Strobl
/// @notice This contract stores encrypted secrets (by the NFRTcrypt ERC721 owner) for later retrieval and reencryption for buyers
contract SimpleSave {

  /// mapping from contract and batch to encryption key
  mapping (bytes32 => string) private encOwnSecret;

  /// @notice Saves user's encryption key to the registry
  /// @dev keccak256 generates a unique key for the combination of contract and batch id
  /// @param encSecret encryped secret
  /// @param contractAdd address of the contract
  /// @param batchId target batch
  function setEncSecret(string memory encSecret, address contractAdd, uint256 batchId) public {
      bytes32 identity = keccak256(abi.encode(contractAdd, batchId));
      encOwnSecret[identity] = encSecret;
  }

  /// @notice Retrieves the encrypted secret for a given batch and contract
  /// @param contractAdd target contract address
  /// @param batchId target batch
  /// @return encryption key as a string
  function getKey(address contractAdd, uint256 batchId) public view returns (string memory) {
      return encOwnSecret[keccak256(abi.encode(contractAdd, batchId))];
  }

}
