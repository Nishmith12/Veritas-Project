// src/components/ReviewForm.js
import React, { useState } from 'react';
import { ethers } from 'ethers';

// Import the contract address and ABI
import { VERITAS_REVIEWS_ADDRESS } from '../config';
import VeritasReviewsABI from '../contracts/VeritasReviews.json';


function ReviewForm({ productId, onReviewSubmitted, signer }) {
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!reviewText.trim()) {
      alert('Review cannot be empty!');
      return;
    }

    // In a real app, you would upload the reviewText to IPFS and get a hash.
    // For our MVP, we will use the text itself as a placeholder for the hash.
    const reviewIpfsHash = reviewText;

    setIsSubmitting(true);
    try {
      const contract = new ethers.Contract(VERITAS_REVIEWS_ADDRESS, VeritasReviewsABI.abi, signer);

      console.log("Submitting review to the blockchain...");
      // This line initiates the transaction and opens MetaMask
      const tx = await contract.addReview(productId, reviewIpfsHash);

      console.log("Waiting for transaction to be mined...");
      // This line waits for the transaction to be confirmed on the blockchain
      await tx.wait();

      alert('Review submitted to the blockchain!');
      onReviewSubmitted(); // This tells the parent to refetch reviews
      setReviewText('');

    } catch (error) {
      console.error("Blockchain transaction failed:", error);
      alert("An error occurred. Do you own a Receipt NFT?");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your honest review here..."
        rows="4"
        cols="50"
      />
      <br />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;