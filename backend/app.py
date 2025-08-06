from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
# This enables Cross-Origin Resource Sharing, allowing your frontend to talk to this backend
CORS(app)

DATABASE_URL = 'veritas.db'

def get_db_connection():
    """Creates a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row # This allows us to access columns by name
    return conn

@app.route('/reviews/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    """Fetches all reviews for a specific product ID."""
    conn = get_db_connection()
    reviews = conn.execute('SELECT * FROM reviews WHERE product_id = ? ORDER BY timestamp DESC', (product_id,)).fetchall()
    conn.close()
    # Convert the list of Row objects to a list of dictionaries
    return jsonify([dict(ix) for ix in reviews])

@app.route('/submit_review', methods=['POST'])
def submit_review():
    """Submits a new review."""
    data = request.get_json()
    product_id = data.get('productId')
    # For now, we'll just use a placeholder for the reviewer's address
    reviewer_address = data.get('reviewerAddress', '0xPlaceholderUserAddress')
    review_text = data.get('reviewText')

    if not product_id or not review_text:
        return jsonify({'error': 'Missing data'}), 400

    conn = get_db_connection()
    conn.execute('INSERT INTO reviews (product_id, reviewer_address, review_text) VALUES (?, ?, ?)',
                 (product_id, reviewer_address, review_text))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Review submitted successfully!'}), 201

if __name__ == '__main__':
    # The app will run on http://127.0.0.1:5000
    app.run(debug=True, port=5000)