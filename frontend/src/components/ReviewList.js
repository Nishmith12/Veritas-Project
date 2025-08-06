// ====================================================================
// FILE: frontend/src/components/ReviewList.js
// ====================================================================
// We now display the AI scores that are stored on-chain with each review.

import React from 'react';

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet. Be the first!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <p><strong>Reviewer:</strong> {review.reviewer}</p>
          <p>{review.reviewIpfsHash}</p>
          <small>Posted on: {review.timestamp}</small>
          {/* --- NEW UI --- */}
          <div className="review-scores">
            <small>Reputation Score: {review.reputationScore}</small> | 
            <small> Fakeness Score: {review.fakenessScore}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
