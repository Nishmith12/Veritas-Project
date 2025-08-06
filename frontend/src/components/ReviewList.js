import React from 'react';

function ReviewList({ reviews }) {
  // This message will show if there are no reviews yet.
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet. Be the first!</p>;
  }

  return (
    <div className="review-list">
      {/* We map over the reviews array and create a card for each one */}
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <p><strong>Reviewer:</strong> {review.reviewer}</p>
          <p>{review.reviewIpfsHash}</p>
          
          {/* This is the line that has been changed.
            It now directly displays the pre-formatted timestamp string 
            it receives from the parent ProductPage component.
          */}
          <small>Posted on: {review.timestamp}</small>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;