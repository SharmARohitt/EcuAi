// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ECUToken
 * @dev ERC-20 utility and governance token for ecuAi platform
 */
contract ECUToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Token distribution
    uint256 public constant COMMUNITY_ALLOCATION = 400_000_000 * 10**18; // 40%
    uint256 public constant TEAM_ALLOCATION = 250_000_000 * 10**18;      // 25%
    uint256 public constant TREASURY_ALLOCATION = 200_000_000 * 10**18;  // 20%
    uint256 public constant LIQUIDITY_ALLOCATION = 150_000_000 * 10**18; // 15%
    
    // Vesting
    mapping(address => VestingSchedule) public vestingSchedules;
    
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        uint256 cliffDuration;
    }
    
    event TokensVested(address indexed beneficiary, uint256 amount);
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);

    constructor() ERC20("ecuAi Token", "ECU") Ownable(msg.sender) {
        // Mint initial supply to owner for distribution
        _mint(msg.sender, MAX_SUPPLY);
    }

    /**
     * @dev Create vesting schedule for team members
     * @param _beneficiary Address of beneficiary
     * @param _amount Total amount to vest
     * @param _duration Vesting duration in seconds
     * @param _cliffDuration Cliff duration in seconds
     */
    function createVestingSchedule(
        address _beneficiary,
        uint256 _amount,
        uint256 _duration,
        uint256 _cliffDuration
    ) public onlyOwner {
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_amount > 0, "Amount must be > 0");
        require(_duration > 0, "Duration must be > 0");
        require(vestingSchedules[_beneficiary].totalAmount == 0, "Schedule exists");
        
        vestingSchedules[_beneficiary] = VestingSchedule({
            totalAmount: _amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: _duration,
            cliffDuration: _cliffDuration
        });
        
        emit VestingScheduleCreated(_beneficiary, _amount, _duration);
    }

    /**
     * @dev Release vested tokens
     */
    function releaseVestedTokens() public {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAmount > 0, "No vesting schedule");
        
        uint256 vestedAmount = _calculateVestedAmount(msg.sender);
        uint256 releasableAmount = vestedAmount - schedule.releasedAmount;
        
        require(releasableAmount > 0, "No tokens to release");
        
        schedule.releasedAmount += releasableAmount;
        _transfer(owner(), msg.sender, releasableAmount);
        
        emit TokensVested(msg.sender, releasableAmount);
    }

    /**
     * @dev Calculate vested amount for beneficiary
     * @param _beneficiary Beneficiary address
     */
    function _calculateVestedAmount(address _beneficiary) 
        internal 
        view 
        returns (uint256) 
    {
        VestingSchedule memory schedule = vestingSchedules[_beneficiary];
        
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }
        
        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }
        
        uint256 timeVested = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeVested) / schedule.duration;
    }

    /**
     * @dev Get vested amount for beneficiary
     * @param _beneficiary Beneficiary address
     */
    function getVestedAmount(address _beneficiary) public view returns (uint256) {
        return _calculateVestedAmount(_beneficiary);
    }

    /**
     * @dev Get releasable amount for beneficiary
     * @param _beneficiary Beneficiary address
     */
    function getReleasableAmount(address _beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[_beneficiary];
        uint256 vestedAmount = _calculateVestedAmount(_beneficiary);
        return vestedAmount - schedule.releasedAmount;
    }

    /**
     * @dev Mint new tokens (only owner, respects max supply)
     * @param _to Recipient address
     * @param _amount Amount to mint
     */
    function mint(address _to, uint256 _amount) public onlyOwner {
        require(totalSupply() + _amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(_to, _amount);
    }
}
