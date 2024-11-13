// SPDX-License-Identifier: HAU
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Mapping to store candidates for different positions
    mapping(string => Candidate[]) public candidates;
    
    // Mapping to track if a user has voted for a specific position
    mapping(address => mapping(string => bool)) public voters;
    address public owner;
    uint256 public constant voteFee = 0.1 ether;

    event VoteCasted(address indexed voter, string position, uint256 candidateIndex);
    event TransferToOwner(address indexed owner, uint256 amount);

    // Constructor to initialize candidates for each position
    constructor(string[] memory presidentNames, string[] memory vicePresidentNames, string[] memory secretaryNames) {
        owner = msg.sender;
        addCandidates("President", presidentNames);
        addCandidates("Vice President", vicePresidentNames);
        addCandidates("Secretary", secretaryNames);
    }

    // Internal function to add candidates for a specific position
    function addCandidates(string memory position, string[] memory names) internal {
        for (uint256 i = 0; i < names.length; i++) {
            candidates[position].push(Candidate(names[i], 0));
        }
    }

    // Voting function
    function vote(uint256 candidateIndex, string memory position) public payable {
        require(!voters[msg.sender][position], "You have already voted for this position.");

        voters[msg.sender][position] = true;
        candidates[position][candidateIndex].voteCount += 1;

        // Transfer the fee to the owner
        payable(owner).transfer(msg.value);
        emit VoteCasted(msg.sender, position, candidateIndex);
        emit TransferToOwner(owner, msg.value);
    }

    // Function to get the candidate count for a specific position
    function getCandidateCountForPosition(string memory position) public view returns (uint256) {
        return candidates[position].length;
    }

    function getCandidates(string memory position) public view returns (Candidate[] memory) {
        require(candidates[position].length > 0, "No candidates for this position");
        return candidates[position];
    }

    // Function to get a candidate for a specific position
    function getCandidateForPosition(string memory position, uint256 index) public view returns (Candidate memory) {
        require(index < candidates[position].length, "Invalid candidate index.");
        return candidates[position][index];
    }
}