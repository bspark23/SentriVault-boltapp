const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy ResumeVerifier
  console.log("\nDeploying ResumeVerifier...");
  const ResumeVerifier = await ethers.getContractFactory("ResumeVerifier");
  const resumeVerifier = await ResumeVerifier.deploy();
  await resumeVerifier.waitForDeployment();
  const resumeVerifierAddress = await resumeVerifier.getAddress();
  console.log("ResumeVerifier deployed to:", resumeVerifierAddress);
  
  // Deploy ScamDomainRegistry
  console.log("\nDeploying ScamDomainRegistry...");
  const ScamDomainRegistry = await ethers.getContractFactory("ScamDomainRegistry");
  const scamDomainRegistry = await ScamDomainRegistry.deploy();
  await scamDomainRegistry.waitForDeployment();
  const scamDomainRegistryAddress = await scamDomainRegistry.getAddress();
  console.log("ScamDomainRegistry deployed to:", scamDomainRegistryAddress);
  
  // Save deployment info
  const deployments = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      ResumeVerifier: {
        address: resumeVerifierAddress,
        deployer: deployer.address
      },
      ScamDomainRegistry: {
        address: scamDomainRegistryAddress,
        deployer: deployer.address
      }
    }
  };
  
  // Write to deployments file
  const deploymentsPath = path.join(__dirname, "../src/contracts/deployments.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  
  console.log("\n✅ Deployment completed!");
  console.log("📄 Deployment info saved to:", deploymentsPath);
  console.log("\n🔗 Verify contracts on Etherscan:");
  console.log(`ResumeVerifier: https://sepolia.etherscan.io/address/${resumeVerifierAddress}`);
  console.log(`ScamDomainRegistry: https://sepolia.etherscan.io/address/${scamDomainRegistryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });