// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GovernanceDAO
 * @dev Decentralized governance for ecuAi platform
 * Token holders can create and vote on proposals
 */
contract GovernanceDAO is Ownable {
    IERC20 public governanceToken;
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool passed;
        ProposalType proposalType;
        address targetAddress;
        uint256 targetValue;
    }
    
    enum ProposalType {
        FeatureAsset,
        RemoveAsset,
        UpdateFee,
        AddModerator,
        RemoveModerator
    }
    
    // Voting record
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public voteChoice; // true = for, false = against
    
    // Proposals
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCounter;
    
    // Governance parameters
    uint256 public votingPeriod = 7 days;
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens to propose
    uint256 public quorumPercentage = 10; // 10% of total supply
    
    // Moderators
    mapping(address => bool) public moderators;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        ProposalType proposalType
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event ModeratorAdded(address indexed moderator);
    event ModeratorRemoved(address indexed moderator);

    constructor(address _governanceToken) Ownable(msg.sender) {
        governanceToken = IERC20(_governanceToken);
        moderators[msg.sender] = true;
    }

    /**
     * @dev Create a new proposal
     * @param _title Proposal title
     * @param _description Proposal description
     * @param _proposalType Type of proposal
     * @param _targetAddress Target address (if applicable)
     * @param _targetValue Target value (if applicable)
     */
    function createProposal(
        string memory _title,
        string memory _description,
        ProposalType _proposalType,
        address _targetAddress,
        uint256 _targetValue
    ) public returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to propose"
        );
        
        proposalCounter++;
        
        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            proposer: msg.sender,
            title: _title,
            description: _description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + votingPeriod,
            executed: false,
            passed: false,
            proposalType: _proposalType,
            targetAddress: _targetAddress,
            targetValue: _targetValue
        });
        
        emit ProposalCreated(proposalCounter, msg.sender, _title, _proposalType);
        
        return proposalCounter;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param _proposalId Proposal ID
     * @param _support True for yes, false for no
     */
    function castVote(uint256 _proposalId, bool _support) public {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        hasVoted[_proposalId][msg.sender] = true;
        voteChoice[_proposalId][msg.sender] = _support;
        
        if (_support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, weight);
    }

    /**
     * @dev Execute a proposal after voting period
     * @param _proposalId Proposal ID
     */
    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Already executed");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 totalSupply = governanceToken.totalSupply();
        uint256 quorum = (totalSupply * quorumPercentage) / 100;
        
        // Check if quorum is met and proposal passed
        if (totalVotes >= quorum && proposal.forVotes > proposal.againstVotes) {
            proposal.passed = true;
            _executeProposalAction(proposal);
        }
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId, proposal.passed);
    }

    /**
     * @dev Internal function to execute proposal action
     * @param proposal Proposal to execute
     */
    function _executeProposalAction(Proposal memory proposal) internal {
        if (proposal.proposalType == ProposalType.AddModerator) {
            moderators[proposal.targetAddress] = true;
            emit ModeratorAdded(proposal.targetAddress);
        } else if (proposal.proposalType == ProposalType.RemoveModerator) {
            moderators[proposal.targetAddress] = false;
            emit ModeratorRemoved(proposal.targetAddress);
        }
        // Additional proposal types can be implemented here
    }

    /**
     * @dev Get proposal details
     * @param _proposalId Proposal ID
     */
    function getProposal(uint256 _proposalId) 
        public 
        view 
        returns (Proposal memory) 
    {
        return proposals[_proposalId];
    }

    /**
     * @dev Check if address has voted on proposal
     * @param _proposalId Proposal ID
     * @param _voter Voter address
     */
    function getVote(uint256 _proposalId, address _voter) 
        public 
        view 
        returns (bool voted, bool support) 
    {
        voted = hasVoted[_proposalId][_voter];
        support = voteChoice[_proposalId][_voter];
    }

    /**
     * @dev Update voting period (owner only)
     * @param _newPeriod New voting period in seconds
     */
    function updateVotingPeriod(uint256 _newPeriod) public onlyOwner {
        require(_newPeriod >= 1 days && _newPeriod <= 30 days, "Invalid period");
        votingPeriod = _newPeriod;
    }

    /**
     * @dev Update proposal threshold (owner only)
     * @param _newThreshold New threshold in token units
     */
    function updateProposalThreshold(uint256 _newThreshold) public onlyOwner {
        proposalThreshold = _newThreshold;
    }

    /**
     * @dev Update quorum percentage (owner only)
     * @param _newQuorum New quorum percentage
     */
    function updateQuorumPercentage(uint256 _newQuorum) public onlyOwner {
        require(_newQuorum > 0 && _newQuorum <= 100, "Invalid quorum");
        quorumPercentage = _newQuorum;
    }

    /**
     * @dev Check if address is moderator
     * @param _address Address to check
     */
    function isModerator(address _address) public view returns (bool) {
        return moderators[_address];
    }
}
