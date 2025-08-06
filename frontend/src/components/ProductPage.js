// src/components/ProductPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

// Import the contract address and ABI
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
    // We can fetch reviews even without a connected wallet, so we use the provider
    if (!provider) return;
    try {
      const contract = new ethers.Contract(VERITAS_REVIEWS_ADDRESS, VeritasReviewsABI.abi, provider);
      const reviewData = await contract.getReviewsForProduct(MOCK_PRODUCT_ID);

      // The contract returns an array of struct-like objects, we need to format them
      const formattedReviews = reviewData.map(review => ({
        id: Number(review.id),
        reviewer: review.reviewer,
        reviewIpfsHash: review.reviewIpfsHash,
        timestamp: new Date(Number(review.timestamp) * 1000).toLocaleString()
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [provider]);

  useEffect(() => {
    // Create a default provider to fetch reviews on page load
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
      <p>This is a conceptual product for our review system.</p>
      <hr />
      <h3>Submit Your Review</h3>
      {/* We pass the signer down to the form for submitting transactions */}
      <ReviewForm productId={MOCK_PRODUCT_ID} onReviewSubmitted={fetchReviews} signer={signer} />
      <hr />
      <h3>Reviews</h3>
      <ReviewList reviews={reviews} />
    </div>
  );
}

export default ProductPage;