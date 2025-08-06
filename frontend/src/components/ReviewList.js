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
          {/* This now displays the full text fetched from IPFS */}
          <p>{review.reviewText}</p>
          <small>Posted on: {review.timestamp}</small>
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
