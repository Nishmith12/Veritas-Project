// ====================================================================
// FILE: contracts/VeritasReviews.sol
// ====================================================================
// We are adding the AI scores directly to the review struct.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ReceiptNFT.sol";

contract VeritasReviews {

    struct Review {
        uint id;
        address reviewer;
        string reviewIpfsHash;
        uint timestamp;
        // --- NEW FIELDS ---
        uint reputationScore;
        uint fakenessScore;
    }

    ReceiptNFT private _receiptNft;
    mapping(uint => Review[]) public reviewsByProductId;
    uint private _reviewCounter;

    constructor(address receiptNftAddress) {
        _receiptNft = ReceiptNFT(receiptNftAddress);
    }

    // --- UPDATED FUNCTION ---
    // We now accept the scores as arguments to store them on-chain.
    function addReview(
        uint productId,
        string memory reviewIpfsHash,
        uint reputationScore,
        uint fakenessScore
    ) public {
        require(_receiptNft.balanceOf(msg.sender) > 0, "Veritas: Must own a receipt NFT to post a review.");

        // A simple on-chain check: if the fakeness score is too high, reject the review.
        require(fakenessScore < 75, "Veritas: Review flagged as potential spam.");

        _reviewCounter++;
        reviewsByProductId[productId].push(
            Review({
                id: _reviewCounter,
                reviewer: msg.sender,
                reviewIpfsHash: reviewIpfsHash,
                timestamp: block.timestamp,
                reputationScore: reputationScore,
                fakenessScore: fakenessScore
            })
        );
    }

    function getReviewsForProduct(uint productId) public view returns (Review[] memory) {
        return reviewsByProductId[productId];
    }
}
