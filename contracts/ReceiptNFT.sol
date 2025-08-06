// SPDX-License-Identifier: MIT
// Specifies the open-source license

// Tells the compiler which Solidity version to use
pragma solidity ^0.8.24;

// Imports secure contract templates from OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Our contract inherits the functionalities of ERC721 (NFT standard) and Ownable (for security)
contract ReceiptNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // The constructor sets the NFT's name ("VeritasReceipt") and symbol ("VRT")
    constructor() ERC721("VeritasReceipt", "VRT") Ownable(msg.sender) {}

    // A special function that only the contract owner (you) can call.
    // This simulates a purchase by minting a new receipt NFT to a buyer's address.
    function adminMint(address buyer) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(buyer, tokenId);
    }
}