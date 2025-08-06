// src/components/ReviewList.js
import React from 'react';

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p>No reviews yet. Be the first!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <p><strong>Reviewer:</strong> {review.reviewer_address}</p>
          <p>{review.review_text}</p>
          <small>Posted on: {new Date(review.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;