pragma solidity ^0.5.0;

contract Cortex {
  mapping (address => mapping (uint => string)) private proofs;
  // IPFS hash
  mapping (address => mapping (uint => bytes)) private proofMeta;
  // *Potential* reverse proofs - require manual validation
  mapping (uint => mapping (string => address[])) private proofsReverseIndex;

  function setProof(uint _svcId, string calldata _identifier, bytes calldata _meta) external {
    proofs[msg.sender][_svcId] = _identifier;
    proofsReverseIndex[_svcId][_identifier].push(msg.sender);
    proofMeta[msg.sender][_svcId] = _meta;
  }

  function getProofFromSvc(uint _svcId, string calldata _identifier) external view
    returns (address[] memory potentialUsers)
  {
    return proofsReverseIndex[_svcId][_identifier];
  }

  function getProofFromUser(address _user, uint _svcId) external view
    returns (string memory identifier, bytes memory meta)
  {
    identifier = proofs[_user][_svcId];
    meta = proofMeta[_user][_svcId];
  }
}