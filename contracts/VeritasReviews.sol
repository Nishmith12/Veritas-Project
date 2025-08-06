// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// We need to import the ReceiptNFT contract to use its functions
import "./ReceiptNFT.sol";

contract VeritasReviews {

    // A "struct" is a custom data type to organize our review data
    struct Review {
        uint id;
        address reviewer;
        string reviewIpfsHash; // We only store a hash pointing to the review text
        uint timestamp;
    }

    // A variable to hold a reference to our deployed ReceiptNFT contract
    ReceiptNFT private _receiptNft;

    // A mapping is like a hash table or dictionary.
    // It will store all reviews, organized by a product ID.
    mapping(uint => Review[]) public reviewsByProductId;
    uint private _reviewCounter;

    // The constructor runs only once when we deploy the contract.
    // We must provide the address of our already-deployed ReceiptNFT contract.
    constructor(address receiptNftAddress) {
        _receiptNft = ReceiptNFT(receiptNftAddress);
    }

    // This is the core function of our DApp
    function addReview(uint productId, string memory reviewIpfsHash) public {
        // This is the core decentralized logic of your project.
        // It checks if the user's wallet address has a balance of more than 0 Receipt NFTs.
        // If not, it stops execution and shows an error message.
        require(_receiptNft.balanceOf(msg.sender) > 0, "Veritas: Must own a receipt NFT to post a review.");

        _reviewCounter++;
        reviewsByProductId[productId].push(
            Review({
                id: _reviewCounter,
                reviewer: msg.sender,
                reviewIpfsHash: reviewIpfsHash,
                timestamp: block.timestamp
            })
        );
    }

    // ====================================================================
    // VVVV  ADD THE NEW FUNCTION RIGHT HERE  VVVV
    // ====================================================================
    function getReviewsForProduct(uint productId) public view returns (Review[] memory) {
        return reviewsByProductId[productId];
    }
    // ====================================================================

} // <-- This is the final closing brace of the contract.