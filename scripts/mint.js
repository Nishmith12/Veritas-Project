// We need to get the contract addresses from our config file
const { RECEIPT_NFT_ADDRESS, VERITAS_REVIEWS_ADDRESS } = require('../frontend/src/config.js');

async function main() {
    // Get the test account that will be doing the minting (by default, Account #0)
    const [signer] = await hre.ethers.getSigners();

    // Get an instance of our deployed ReceiptNFT contract
    const receiptNft = await hre.ethers.getContractAt("ReceiptNFT", RECEIPT_NFT_ADDRESS, signer);

    console.log("====================================================");
    console.log("SCRIPT STARTED");
    console.log(`Using Signer Address: ${signer.address}`);
    console.log(`ReceiptNFT Contract Address: ${RECEIPT_NFT_ADDRESS}`);
    console.log(`VeritasReviews Contract Address: ${VERITAS_REVIEWS_ADDRESS}`);
    console.log("----------------------------------------------------");

    // Check balance BEFORE minting
    let balance = await receiptNft.balanceOf(signer.address);
    console.log(`Balance BEFORE minting: ${balance} NFTs.`);

    console.log("Attempting to mint a new Receipt NFT...");
    // Call the adminMint function to create a new NFT for our test account
    const tx = await receiptNft.adminMint(signer.address);
    await tx.wait(); // Wait for the transaction to be confirmed

    console.log("NFT mint transaction confirmed!");

    // Check balance AFTER minting to verify success
    balance = await receiptNft.balanceOf(signer.address);
    console.log(`Balance AFTER minting: ${balance} NFTs.`);
    console.log("====================================================");

    if (balance > 0) {
        console.log("SUCCESS: The account now owns a Receipt NFT. You can now test the DApp.");
    } else {
        console.log("ERROR: Minting failed. The account does not own a Receipt NFT.");
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
