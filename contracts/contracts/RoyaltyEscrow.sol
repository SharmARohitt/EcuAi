// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./AIAssetRegistry.sol";

/**
 * @title RoyaltyEscrow
 * @dev Handles payments, escrow, and automatic royalty distribution
 */
contract RoyaltyEscrow is Ownable, ReentrancyGuard, Pausable {
    AIAssetRegistry public assetRegistry;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    uint256 public constant MAX_FEE = 1000; // 10% max
    
    // Escrow structure
    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        uint256 tokenId;
        bool completed;
        bool disputed;
        uint256 createdAt;
    }
    
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCounter;
    
    // Track earnings
    mapping(address => uint256) public pendingWithdrawals;
    uint256 public platformEarnings;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 tokenId
    );
    
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId);
    event RoyaltyDistributed(uint256 indexed tokenId, address indexed creator, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);

    constructor(address _assetRegistry) Ownable(msg.sender) {
        assetRegistry = AIAssetRegistry(_assetRegistry);
    }

    /**
     * @dev Purchase an asset with escrow
     * @param _tokenId Token ID to purchase
     */
    function purchaseAsset(uint256 _tokenId) 
        public 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        AIAssetRegistry.AssetMetadata memory asset = assetRegistry.getAssetMetadata(_tokenId);
        require(msg.value >= asset.price, "Insufficient payment");
        require(assetRegistry.ownerOf(_tokenId) != msg.sender, "Cannot buy own asset");
        
        address seller = assetRegistry.ownerOf(_tokenId);
        
        escrowCounter++;
        escrows[escrowCounter] = Escrow({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            tokenId: _tokenId,
            completed: false,
            disputed: false,
            createdAt: block.timestamp
        });
        
        emit EscrowCreated(escrowCounter, msg.sender, seller, msg.value, _tokenId);
        
        // Auto-complete escrow and distribute funds
        _completeEscrow(escrowCounter);
    }

    /**
     * @dev Complete escrow and distribute royalties
     * @param _escrowId Escrow ID
     */
    function _completeEscrow(uint256 _escrowId) internal {
        Escrow storage escrow = escrows[_escrowId];
        require(!escrow.completed, "Already completed");
        require(!escrow.disputed, "Escrow is disputed");
        
        AIAssetRegistry.AssetMetadata memory asset = assetRegistry.getAssetMetadata(escrow.tokenId);
        
        uint256 amount = escrow.amount;
        
        // Calculate platform fee
        uint256 platformCut = (amount * platformFee) / 10000;
        platformEarnings += platformCut;
        
        // Calculate royalty for original creator
        uint256 royaltyAmount = 0;
        if (asset.creator != escrow.seller) {
            royaltyAmount = ((amount - platformCut) * asset.royaltyPercentage) / 100;
            pendingWithdrawals[asset.creator] += royaltyAmount;
            emit RoyaltyDistributed(escrow.tokenId, asset.creator, royaltyAmount);
        }
        
        // Remaining amount goes to seller
        uint256 sellerAmount = amount - platformCut - royaltyAmount;
        pendingWithdrawals[escrow.seller] += sellerAmount;
        
        escrow.completed = true;
        
        // Transfer NFT to buyer
        assetRegistry.safeTransferFrom(escrow.seller, escrow.buyer, escrow.tokenId);
        
        emit EscrowCompleted(_escrowId);
    }

    /**
     * @dev Dispute an escrow (buyer only, within 24 hours)
     * @param _escrowId Escrow ID
     */
    function disputeEscrow(uint256 _escrowId) public {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.buyer, "Only buyer can dispute");
        require(!escrow.completed, "Already completed");
        require(!escrow.disputed, "Already disputed");
        require(block.timestamp < escrow.createdAt + 24 hours, "Dispute period expired");
        
        escrow.disputed = true;
        emit EscrowDisputed(_escrowId);
    }

    /**
     * @dev Resolve dispute (owner only)
     * @param _escrowId Escrow ID
     * @param _refundBuyer True to refund buyer, false to pay seller
     */
    function resolveDispute(uint256 _escrowId, bool _refundBuyer) 
        public 
        onlyOwner 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.disputed, "Not disputed");
        require(!escrow.completed, "Already completed");
        
        if (_refundBuyer) {
            pendingWithdrawals[escrow.buyer] += escrow.amount;
        } else {
            _completeEscrow(_escrowId);
        }
        
        escrow.completed = true;
    }

    /**
     * @dev Withdraw pending earnings
     */
    function withdraw() public nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @dev Withdraw platform earnings (owner only)
     */
    function withdrawPlatformEarnings() public onlyOwner nonReentrant {
        uint256 amount = platformEarnings;
        require(amount > 0, "No platform earnings");
        
        platformEarnings = 0;
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Update platform fee (owner only)
     * @param _newFee New fee in basis points
     */
    function updatePlatformFee(uint256 _newFee) public onlyOwner {
        require(_newFee <= MAX_FEE, "Fee too high");
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    /**
     * @dev Pause contract (owner only)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (owner only)
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Get escrow details
     * @param _escrowId Escrow ID
     */
    function getEscrow(uint256 _escrowId) public view returns (Escrow memory) {
        return escrows[_escrowId];
    }

    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {}
}
