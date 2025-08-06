# Project Veritas: A Decentralized AI-Powered Review System

> A proof-of-concept DApp designed to combat fake online reviews by integrating the trust of blockchain with the intelligence of AI. This project demonstrates a complete end-to-end system, from on-chain smart contracts to a polished user interface.

---

## 🚀 Key Features

* **Proof of Purchase:** Utilizes ERC-721 NFTs to ensure only verified buyers can post reviews.
* **Immutable & Transparent:** All submitted reviews are stored on-chain, making them permanent and censorship-resistant.
* **AI-Powered Reputation Scoring:** Analyzes a user's wallet history via the Alchemy API to generate a reputation score, mitigating Sybil attacks from bot farms.
* **AI Content Analysis:** A rule-based NLP model analyzes review text to calculate a "Fakeness Score," flagging potential spam before it hits the blockchain.
* **Decentralized Storage:** Review text is stored on the IPFS network via Pinata, with only the content hash (CID) stored on-chain for maximum efficiency.
* **Modern UI/UX:** A responsive and interactive frontend built with React, featuring a premium dark theme and glassmorphism effects.

---

## 🏛️ System Architecture

The project follows a modern DApp architecture, separating on-chain logic, backend intelligence, and frontend presentation.

```
+-------------------------------------------------------------------------+
|                                                                         |
|                           USER (in Browser)                             |
|                                                                         |
+-------------------------------------------------------------------------+
      |                                      ^
      | 1. Connects Wallet                   | 6. Displays Reviews
      | 2. Writes Review                     |
      v                                      |
+-------------------------------------------------------------------------+
|                                                                         |
|                       FRONTEND (React DApp)                             |
|                                                                         |
+-------------------------------------------------------------------------+
      |                 |                      |                      ^
      | 3. Get AI       | 4. Upload Text       | 5. Submit Tx         | 5a. Get Review CIDs
      |    Scores       |    to IPFS           |    (with Scores      |
      v                 v                      v                      |
+-----------------+  +----------------+  +---------------------------------+
|                 |  |                |  |                                 |
|   AI BACKEND    |  |  IPFS (Pinata) |  |   BLOCKCHAIN (Hardhat Local)    |
|   (Python/Flask)|  |                |  |                                 |
|                 |  |                |  | +-----------------------------+ |
+-----------------+  +----------------+  | |  VeritasReviews Smart Ktrt  | |
                                         | +-----------------------------+ |
                                         | |   ReceiptNFT Smart Ktrt     | |
                                         | +-----------------------------+ |
                                         +---------------------------------+

```

---

## 🛠️ Tech Stack

| Category                | Technology                               | Purpose                                                 |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------- |
| **Blockchain** | Solidity, Hardhat, Ethers.js, MetaMask   | The on-chain logic, deployment, and wallet interaction. |
| **AI Backend** | Python, Flask, Alchemy API               | Exposes API endpoints for AI-powered analysis.          |
| **Decentralized Storage** | IPFS, Pinata Cloud                       | For efficient and decentralized storage of review text. |
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

# Create a .env file in the /frontend directory
# In frontend/.env, add your Pinata keys:
# REACT_APP_PINATA_API_KEY=YOUR_PINATA_API_KEY
# REACT_APP_PINATA_SECRET_API_KEY=YOUR_PINATA_SECRET
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
5.  **Use the App:** Open `http://localhost:3000` in your browser, connect your wallet, and submit a review!

---

## 🔮 Future Work

This project serves as a strong foundation. Future improvements could include:

* **Advanced NLP Model:** Replacing the rule-based fakeness score with a fine-tuned deep learning model (like BERT or a transformer) trained on a large dataset of online reviews for much higher accuracy.
* **Gasless Transactions:** Implementing meta-transactions to allow users to submit reviews without needing to own ETH, improving the user experience.
* **Enhanced Reputation Metrics:** Expanding the reputation model to include more on-chain data points, such as interactions with other DeFi protocols, NFT ownership history, and governance participation.
* **Tokenomics:** Introducing a native token (`$VRT`) to reward high-reputation reviewers and create a self-sustaining ecosystem where users can stake tokens to challenge and verify reviews.
