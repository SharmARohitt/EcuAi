// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AIAssetRegistry
 * @dev NFT contract for AI models, datasets, and compute resources
 * Each token represents ownership of an AI asset with DKG provenance
 */
contract AIAssetRegistry is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Asset metadata structure
    struct AssetMetadata {
        string ipfsHash;
        string dkgKAID;
        address creator;
        uint256 price;
        uint256 royaltyPercentage;
        bool verified;
        uint256 createdAt;
    }

    // Mapping from token ID to asset metadata
    mapping(uint256 => AssetMetadata) public assets;
    
    // Mapping from IPFS hash to token ID (prevent duplicates)
    mapping(string => uint256) public ipfsHashToTokenId;
    
    // Mapping from DKG KAID to token ID
    mapping(string => uint256) public dkgKAIDToTokenId;

    // Events
    event AssetRegistered(
        uint256 indexed tokenId,
        address indexed creator,
        string ipfsHash,
        string dkgKAID,
        uint256 price
    );
    
    event AssetVerified(uint256 indexed tokenId);
    
    event AssetPriceUpdated(uint256 indexed tokenId, uint256 newPrice);

    constructor() ERC721("ecuAi Asset", "ECUAI") Ownable(msg.sender) {}

    /**
     * @dev Register a new AI asset
     * @param _ipfsHash IPFS hash of the asset
     * @param _dkgKAID OriginTrail DKG Knowledge Asset ID
     * @param _metadataURI Token metadata URI
     * @param _price Asset price in wei
     * @param _royaltyPercentage Royalty percentage (0-100)
     */
    function registerAsset(
        string memory _ipfsHash,
        string memory _dkgKAID,
        string memory _metadataURI,
        uint256 _price,
        uint256 _royaltyPercentage
    ) public returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(bytes(_dkgKAID).length > 0, "DKG KAID required");
        require(ipfsHashToTokenId[_ipfsHash] == 0, "Asset already registered");
        require(_royaltyPercentage <= 100, "Royalty must be <= 100");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _metadataURI);

        assets[newTokenId] = AssetMetadata({
            ipfsHash: _ipfsHash,
            dkgKAID: _dkgKAID,
            creator: msg.sender,
            price: _price,
            royaltyPercentage: _royaltyPercentage,
            verified: false,
            createdAt: block.timestamp
        });

        ipfsHashToTokenId[_ipfsHash] = newTokenId;
        dkgKAIDToTokenId[_dkgKAID] = newTokenId;

        emit AssetRegistered(newTokenId, msg.sender, _ipfsHash, _dkgKAID, _price);

        return newTokenId;
    }

    /**
     * @dev Verify an asset (only owner)
     * @param _tokenId Token ID to verify
     */
    function verifyAsset(uint256 _tokenId) public onlyOwner {
        require(_exists(_tokenId), "Token does not exist");
        assets[_tokenId].verified = true;
        emit AssetVerified(_tokenId);
    }

    /**
     * @dev Update asset price
     * @param _tokenId Token ID
     * @param _newPrice New price in wei
     */
    function updatePrice(uint256 _tokenId, uint256 _newPrice) public {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        
        assets[_tokenId].price = _newPrice;
        emit AssetPriceUpdated(_tokenId, _newPrice);
    }

    /**
     * @dev Get asset metadata
     * @param _tokenId Token ID
     */
    function getAssetMetadata(uint256 _tokenId) 
        public 
        view 
        returns (AssetMetadata memory) 
    {
        require(_exists(_tokenId), "Token does not exist");
        return assets[_tokenId];
    }

    /**
     * @dev Get total number of assets
     */
    function totalAssets() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Check if asset is verified
     * @param _tokenId Token ID
     */
    function isVerified(uint256 _tokenId) public view returns (bool) {
        require(_exists(_tokenId), "Token does not exist");
        return assets[_tokenId].verified;
    }

    /**
     * @dev Verify DKG provenance
     * @param _dkgKAID DKG Knowledge Asset ID
     */
    function verifyProvenance(string memory _dkgKAID) public view returns (bool) {
        uint256 tokenId = dkgKAIDToTokenId[_dkgKAID];
        if (tokenId == 0) return false;
        return assets[tokenId].verified;
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
