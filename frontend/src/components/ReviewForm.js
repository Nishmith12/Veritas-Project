import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';

import { VERITAS_REVIEWS_ADDRESS } from '../config';
import VeritasReviewsABI from '../contracts/VeritasReviews.json';

const web3storageToken = process.env.REACT_APP_WEB3STORAGE_TOKEN;
const storageClient = new Web3Storage({ token: web3storageToken });

function ReviewForm({ productId, onReviewSubmitted, signer, userAddress }) {
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiScores, setAiScores] = useState(null);

  const handleTextChange = async (text) => {
    setReviewText(text);
    setAiScores(null);

    // Simple debounce to avoid calling API on every keystroke
    if (text.length > 10) {
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

    setIsSubmitting(true);
    try {
      // 1. Upload review text to IPFS
      const file = new File([reviewText], 'review.txt', { type: 'text/plain' });
      const cid = await storageClient.put([file]);

      // 2. Send the transaction to the blockchain
      const contract = new ethers.Contract(VERITAS_REVIEWS_ADDRESS, VeritasReviewsABI.abi, signer);
      const tx = await contract.addReview(productId, cid, Math.round(aiScores.reputation), aiScores.fakeness);
      await tx.wait();

      alert('Review submitted to the blockchain!');
      onReviewSubmitted();
      setReviewText('');
      setAiScores(null);

    } catch (error) {
      // Keep console.error for important production debugging
      console.error("Blockchain transaction failed:", error);
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
          rows="5"
        />
        <button type="submit" disabled={isSubmitting || !aiScores}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      {aiScores && (
        <div className="ai-scores">
          <p><strong>AI Analysis Ready</strong></p>
          <p>✓ Reviewer Reputation Score: {aiScores.reputation}</p>
          <p>✓ Review Fakeness Score: {aiScores.fakeness} / 100</p>
        </div>
      )}
    </div>
  );
}

export default ReviewForm;
