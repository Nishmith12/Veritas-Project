// scripts/deploy.js
async function main() {
  console.log("Deploying contracts...");

  // 1. Deploy the ReceiptNFT contract first
  const receiptNft = await hre.ethers.deployContract("ReceiptNFT");
  await receiptNft.waitForDeployment();
  console.log(`ReceiptNFT deployed to: ${receiptNft.target}`);

  // 2. Deploy the VeritasReviews contract, passing the address of the NFT contract
  const veritasReviews = await hre.ethers.deployContract("VeritasReviews", [
    receiptNft.target, // The constructor argument for VeritasReviews
  ]);
  await veritasReviews.waitForDeployment();
  console.log(`VeritasReviews deployed to: ${veritasReviews.target}`);

  console.log("Deployment complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});