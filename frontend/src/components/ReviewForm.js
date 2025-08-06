import React, { useState } from 'react';
import { ethers } from 'ethers';

import { VERITAS_REVIEWS_ADDRESS } from '../config';
import VeritasReviewsABI from '../contracts/VeritasReviews.json';

function ReviewForm({ productId, onReviewSubmitted, signer, userAddress }) {
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiScores, setAiScores] = useState(null);

  const handleTextChange = async (text) => {
      setReviewText(text);
      if (text.length > 10) {
          setAiScores(null);
          setTimeout(() => {
              if (text === document.querySelector('textarea').value) {
                  fetchAiScores(text);
              }
          }, 1000);
      }
  };

  const fetchAiScores = async (text) => {
      if (!userAddress) return;
      try {
          const repResponse = await fetch(`http://127.0.0.1:5000/get_reputation_score/${userAddress}`);
          const repData = await repResponse.json();

          const fakeResponse = await fetch('http://127.0.0.1:5000/analyze_review', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reviewText: text })
          });
          const fakeData = await fakeResponse.json();

          setAiScores({
              reputation: repData.score,
              fakeness: fakeData.fakenessScore
          });

      } catch (error) {
          console.error("Failed to fetch AI scores:", error);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!reviewText.trim() || !aiScores) {
      alert('Please write a review and wait for AI analysis.');
      return;
    }
    if (aiScores.fakeness >= 75) {
        alert(`Review blocked: Fakeness score (${aiScores.fakeness}) is too high.`);
        return;
    }

    const reviewIpfsHash = reviewText;
    
    setIsSubmitting(true);

    // ====================================================================
    // VVVV  NEW DEBUGGING LOGS  VVVV
    // ====================================================================
    console.log("--- DEBUGGING REPORT ---");
    console.log("Timestamp:", new Date().toISOString());
    console.log("User Address (from parent):", userAddress);
    console.log("Signer Address (from ethers):", await signer.getAddress());
    console.log("Review Contract Address (from config.js):", VERITAS_REVIEWS_ADDRESS);
    console.log("--- AI SCORES ---");
    console.log("Reputation Score:", aiScores.reputation);
    console.log("Fakeness Score:", aiScores.fakeness);
    console.log("--- TRANSACTION DATA ---");
    console.log("Product ID:", productId);
    console.log("Review Text (as hash):", reviewIpfsHash);
    console.log("--------------------------");
    // ====================================================================

    try {
      const contract = new ethers.Contract(VERITAS_REVIEWS_ADDRESS, VeritasReviewsABI.abi, signer);
      
      console.log("Attempting to send transaction...");
      const tx = await contract.addReview(productId, reviewIpfsHash, Math.round(aiScores.reputation), aiScores.fakeness);
      
      console.log("Transaction sent, waiting for confirmation...");
      await tx.wait();

      alert('Review submitted to the blockchain!');
      onReviewSubmitted();
      setReviewText('');
      setAiScores(null);

    } catch (error) {
      console.error("BLOCKCHAIN TRANSACTION FAILED:", error);
      alert("An error occurred. Does your review meet the quality standards?");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <textarea
            value={reviewText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Write your honest review here..."
            rows="4"
            cols="50"
        />
        <br />
        <button type="submit" disabled={isSubmitting || !aiScores}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
        </form>
        {aiScores && (
            <div className="ai-scores">
                <p><strong>AI Analysis:</strong></p>
                <p>Reviewer Reputation Score: {aiScores.reputation}</p>
                <p>Review Fakeness Score: {aiScores.fakeness} / 100</p>
            </div>
        )}
    </div>
  );
}

export default ReviewForm;
