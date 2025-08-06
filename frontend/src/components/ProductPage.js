import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

import { VERITAS_REVIEWS_ADDRESS } from '../config';
import VeritasReviewsABI from '../contracts/VeritasReviews.json';

const MOCK_PRODUCT_ID = 1;

function ProductPage() {
  const [reviews, setReviews] = useState([]);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await ethProvider.send("eth_requestAccounts", []);
        const signer = await ethProvider.getSigner();
        setProvider(ethProvider);
        setSigner(signer);
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchReviews = useCallback(async () => {
    if (!provider) return;
    try {
      const contract = new ethers.Contract(VERITAS_REVIEWS_ADDRESS, VeritasReviewsABI.abi, provider);
      const reviewDataFromChain = await contract.getReviewsForProduct(MOCK_PRODUCT_ID);
      
      const formattedReviews = await Promise.all(
        reviewDataFromChain.map(async (review) => {
          try {
            // --- UPDATED IPFS GATEWAY URL ---
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${review.reviewIpfsHash}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
            }
            const reviewText = await response.text();
            
            return {
              id: Number(review.id),
              reviewer: review.reviewer,
              reviewText: reviewText,
              timestamp: new Date(Number(review.timestamp) * 1000).toLocaleString(),
              reputationScore: Number(review.reputationScore),
              fakenessScore: Number(review.fakenessScore)
            };
          } catch (e) {
            console.error(`Could not fetch review for CID ${review.reviewIpfsHash}:`, e);
            return {
              id: Number(review.id),
              reviewer: review.reviewer,
              reviewText: "[Could not load review from IPFS]",
              timestamp: new Date(Number(review.timestamp) * 1000).toLocaleString(),
              reputationScore: Number(review.reputationScore),
              fakenessScore: Number(review.fakenessScore)
            };
          }
        })
      );
      
      setReviews(formattedReviews.sort((a, b) => b.id - a.id));

    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [provider]);

  useEffect(() => {
    if(window.ethereum) {
        const defaultProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(defaultProvider);
    }
  }, []);
  
  useEffect(() => {
    if(provider){
        fetchReviews();
    }
  }, [provider, fetchReviews]);

  return (
    <div>
      <div className="wallet-connector">
        {userAddress ? (
          <p>Connected: <strong>{`${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`}</strong></p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      <h2>The Book of Veritas</h2>
      <p>A conceptual product for our decentralized AI-powered review system.</p>
      <hr />
      <div className="review-form-container">
        <h3>Submit Your Review</h3>
        <ReviewForm productId={MOCK_PRODUCT_ID} onReviewSubmitted={fetchReviews} signer={signer} userAddress={userAddress} />
      </div>
      <hr />
      <h3>Reviews</h3>
      <ReviewList reviews={reviews} />
    </div>
  );
}

export default ProductPage;
