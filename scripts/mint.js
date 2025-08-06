// We need to get the contract address from our config file
const { RECEIPT_NFT_ADDRESS } = require('../frontend/src/config.js');

async function main() {
    // Get the test account that will be doing the minting (by default, Account #0)
    const [signer] = await hre.ethers.getSigners();

    // Get an instance of our deployed ReceiptNFT contract
    const receiptNft = await hre.ethers.getContractAt("ReceiptNFT", RECEIPT_NFT_ADDRESS, signer);

    console.log(`Minting a new Receipt NFT to the address: ${signer.address}`);

    // Call the adminMint function to create a new NFT for our test account
    const tx = await receiptNft.adminMint(signer.address);
    await tx.wait(); // Wait for the transaction to be confirmed

    console.log("NFT minted successfully!");

    // Optional: Check the NFT balance of the account to confirm
    const balance = await receiptNft.balanceOf(signer.address);
    console.log(`Address ${signer.address} now has a balance of ${balance} NFTs.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});