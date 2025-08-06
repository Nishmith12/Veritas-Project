// src/components/ProductPage.js
import React, { useState, useEffect, useCallback } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const MOCK_PRODUCT_ID = 1; // We'll hardcode the product ID for now

function ProductPage() {
  const [reviews, setReviews] = useState([]);

  // Function to fetch reviews from the backend
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/reviews/${MOCK_PRODUCT_ID}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, []);

  // useEffect hook to fetch reviews when the component first loads
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <h2>The Book of Veritas</h2>
      <p>This is a conceptual product for our review system.</p>
      <hr />
      <h3>Submit Your Review</h3>
      <ReviewForm productId={MOCK_PRODUCT_ID} onReviewSubmitted={fetchReviews} />
      <hr />
      <h3>Reviews</h3>
      <ReviewList reviews={reviews} />
    </div>
  );
}

export default ProductPage;