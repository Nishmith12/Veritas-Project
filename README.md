# Project Veritas: A Decentralized AI-Powered Review System

> A proof-of-concept DApp designed to combat fake online reviews by integrating the trust of blockchain with the intelligence of AI.

---

## 🚀 The Problem

Online review platforms are plagued by a fundamental lack of trust. Malicious actors can easily create fake accounts (a "Sybil attack") to post fraudulent reviews, either to artificially boost a product's rating or to damage a competitor. This erodes consumer confidence and makes it difficult to assess true product quality.

## ✨ The Solution: AI + Blockchain

Veritas tackles this problem by creating a synergistic system where the whole is greater than the sum of its parts.

#### 1. Blockchain for Trust & Provenance
* **Proof of Purchase:** Users must own a "Receipt NFT" to prove they have purchased a product before they are allowed to review it.
* **Immutability:** Once a review is submitted to the blockchain, it cannot be altered or deleted by anyone, ensuring transparency and censorship resistance.
* **On-Chain Reputation:** All interactions are tied to a user's wallet address, creating a permanent, auditable history.

#### 2. AI for Intelligence & Analysis
* **Reputation Scoring:** An AI model analyzes a user's on-chain wallet history (age, transaction count) to generate a "Reputation Score." This helps distinguish real, active users from newly created bot accounts.
* **Content Analysis:** A Natural Language Processing (NLP) model analyzes the review text itself to calculate a "Fakeness Score," flagging reviews that exhibit spam-like characteristics.
* **On-Chain Verification:** These AI-generated scores are stored on the blockchain alongside the review, providing a multi-faceted "trust score" for every piece of feedback.

---

## 🛠️ System Architecture & Tech Stack

The project consists of three main components that work in tandem:

| Component         | Technology                               | Purpose                                                 |
| ----------------- | ---------------------------------------- | ------------------------------------------------------- |
| **Smart Contracts**| Solidity, Hardhat, Ethers.js, MetaMask   | The on-chain backbone for NFTs and review storage.      |
| **AI Backend** | Python, Flask, Alchemy API               | Exposes API endpoints for AI-powered analysis.          |
| **Frontend DApp** | React.js, JavaScript, CSS                | The user interface for interacting with the system.     |
| **Package Mgmt** | Yarn / NPM                               | For managing project dependencies.                      |

---

## ⚙️ Setup and Installation

To run this project locally, follow these steps:

#### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd VeritasProject
```

#### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies (create requirements.txt first via 'pip freeze > requirements.txt')
pip install -r requirements.txt 

# Create a .env file and add your Alchemy API URL
# In backend/.env, add the line:
# ALCHEMY_URL=[https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY](https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY)
```

#### 3. Smart Contract & Frontend Setup
```bash
# Navigate back to the root directory
cd ..

# Install all Node.js dependencies
yarn install # or npm install
```

---

## ▶️ How to Run the Application

> You will need **three separate terminals** running simultaneously.

#### Terminal 1: Start the Local Blockchain
```bash
npx hardhat node
```

#### Terminal 2: Start the AI Backend Server
```bash
cd backend
source venv/bin/activate
python app.py
```

#### Terminal 3: Start the React Frontend
```bash
cd frontend
npm start
```

### Final Steps: Testing the DApp
1.  **Configure MetaMask:** Add the `Hardhat Local` network (RPC URL: `http://127.0.0.1:8545`, Chain ID: `31337`) and import a test account using the private key from the Hardhat node's output.
2.  **Deploy Contracts:** In a new terminal, run `npx hardhat run scripts/deploy.js --network localhost`.
3.  **Update Config:** Copy the deployed contract addresses into `frontend/src/config.js`.
4.  **Mint an NFT:** Run `npx hardhat run scripts/mint.js --network localhost` to give your test account permission to review.
5.  **Use the App:** Open `http://localhost:3000` in your browser, connect your wallet, and submit a review.

---

## 🔮 Future Work

This project serves as a strong foundation. Future improvements could include:

* **Advanced NLP Model:** Replacing the rule-based fakeness score with a fine-tuned deep learning model (like BERT or a transformer) for much higher accuracy.
* **IPFS Integration:** Storing the review text on the InterPlanetary File System (IPFS) to make the platform fully decentralized and even more robust.
* **UI/UX Polish:** Improving the user interface with better styling, loading indicators, and a more seamless user experience.
* **Tokenomics:** Introducing a native token to reward high-reputation reviewers and further incentivize honest participation.
