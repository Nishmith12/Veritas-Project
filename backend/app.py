import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get your Alchemy URL from the environment variable
ALCHEMY_URL = os.getenv("ALCHEMY_URL")

def get_wallet_age_and_tx_count(address):
    """Fetches the first transaction to estimate wallet age and total transactions."""
    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
                "fromBlock": "0x0",
                "fromAddress": address,
                "category": ["external", "internal", "erc20", "erc721", "erc1155"],
                "maxCount": "0x1",
                "order": "asc"
            }
        ]
    }
    headers = {"accept": "application/json", "content-type": "application/json"}
    
    first_tx_response = requests.post(ALCHEMY_URL, json=payload)
    first_tx_data = first_tx_response.json()

    wallet_age_days = 0
    # ====================================================================
    # VVVV  THIS IS THE UPDATED LOGIC  VVVV
    # ====================================================================
    # We now check if 'transfers' exists AND if the first transfer has 'metadata'
    if (first_tx_data.get('result') 
        and first_tx_data['result'].get('transfers') 
        and 'metadata' in first_tx_data['result']['transfers'][0]):
        
        first_tx_timestamp = int(first_tx_data['result']['transfers'][0]['metadata']['blockTimestamp'], 16)
        age_seconds = datetime.now().timestamp() - first_tx_timestamp
        wallet_age_days = age_seconds / (60 * 60 * 24)
    # ====================================================================

    payload["method"] = "eth_getTransactionCount"
    payload["params"] = [address, "latest"]
    tx_count_response = requests.post(ALCHEMY_URL, json=payload)
    tx_count_data = tx_count_response.json()
    
    tx_count = 0
    if tx_count_data.get('result'):
        tx_count = int(tx_count_data['result'], 16)
        
    return wallet_age_days, tx_count

@app.route('/get_reputation_score/<string:address>', methods=['GET'])
def get_reputation_score(address):
    """Calculates a simple reputation score for a wallet address."""
    if not ALCHEMY_URL:
        return jsonify({"error": "Alchemy URL not configured"}), 500
            
    try:
        wallet_age_days, tx_count = get_wallet_age_and_tx_count(address)
        
        score = (wallet_age_days * 0.5) + (tx_count * 1.0)
        
        return jsonify({
            "address": address,
            "score": round(score, 2),
            "details": {
                "wallet_age_days": round(wallet_age_days, 2),
                "transaction_count": tx_count
            }
        })
    except Exception as e:
        # Improved error logging for us to see in the terminal
        print(f"An error occurred: {e}") 
        return jsonify({"error": "Could not process the request for this address."}), 500
    
# VVVV  ADD THIS NEW FUNCTION AND ENDPOINT  VVVV

def analyze_review_text(text):
    """
    A very simple NLP model to detect fake reviews.
    In a real project, this would be a trained machine learning model.
    For our MVP, we will use a simple rule-based system.
    """
    score = 0

    # Rule 1: Very short reviews are suspicious
    if len(text) < 20:
        score += 30

    # Rule 2: Reviews with excessive exclamation points or all caps are suspicious
    if text.count('!') > 3 or text.isupper():
        score += 25

    # Rule 3: Reviews with generic phrases are suspicious
    generic_phrases = ["good product", "highly recommend", "great value", "will buy again"]
    for phrase in generic_phrases:
        if phrase in text.lower():
            score += 15

    # The final score is capped at 100
    return min(score, 100)

@app.route('/analyze_review', methods=['POST'])
def analyze_review():
    """Analyzes the text of a review to give it a 'fakeness' score."""
    data = request.get_json()
    review_text = data.get('reviewText')

    if not review_text:
        return jsonify({"error": "reviewText is required"}), 400

    fakeness_score = analyze_review_text(review_text)

    return jsonify({
        "reviewText": review_text,
        "fakenessScore": fakeness_score
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)