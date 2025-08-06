// src/components/ReviewForm.js
import React, { useState } from 'react';

function ReviewForm({ productId, onReviewSubmitted }) {
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert('Review cannot be empty!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/submit_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          reviewText: reviewText,
          // We'll add the real user address in Phase 2
          reviewerAddress: '0xAnonymous'
        }),
      });

      if (response.ok) {
        setReviewText('');
        alert('Review submitted successfully!');
        onReviewSubmitted(); // This tells the parent to refetch reviews
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting your review.');
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
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;