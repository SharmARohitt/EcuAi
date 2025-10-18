import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Starting ecuAi contract deployment...\n');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());
  console.log('');

  // Deploy ECU Token
  console.log('📝 Deploying ECU Token...');
  const ECUToken = await ethers.getContractFactory('ECUToken');
  const ecuToken = await ECUToken.deploy();
  await ecuToken.waitForDeployment();
  const ecuTokenAddress = await ecuToken.getAddress();
  console.log('✅ ECU Token deployed to:', ecuTokenAddress);
  console.log('');

  // Deploy AI Asset Registry
  console.log('📝 Deploying AI Asset Registry...');
  const AIAssetRegistry = await ethers.getContractFactory('AIAssetRegistry');
  const assetRegistry = await AIAssetRegistry.deploy();
  await assetRegistry.waitForDeployment();
  const assetRegistryAddress = await assetRegistry.getAddress();
  console.log('✅ AI Asset Registry deployed to:', assetRegistryAddress);
  console.log('');

  // Deploy Royalty Escrow
  console.log('📝 Deploying Royalty Escrow...');
  const RoyaltyEscrow = await ethers.getContractFactory('RoyaltyEscrow');
  const royaltyEscrow = await RoyaltyEscrow.deploy(assetRegistryAddress);
  await royaltyEscrow.waitForDeployment();
  const royaltyEscrowAddress = await royaltyEscrow.getAddress();
  console.log('✅ Royalty Escrow deployed to:', royaltyEscrowAddress);
  console.log('');

  // Deploy Governance DAO
  console.log('📝 Deploying Governance DAO...');
  const GovernanceDAO = await ethers.getContractFactory('GovernanceDAO');
  const governanceDAO = await GovernanceDAO.deploy(ecuTokenAddress);
  await governanceDAO.waitForDeployment();
  const governanceDAOAddress = await governanceDAO.getAddress();
  console.log('✅ Governance DAO deployed to:', governanceDAOAddress);
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════');
  console.log('🎉 Deployment Complete!');
  console.log('═══════════════════════════════════════════════════');
  console.log('ECU Token:           ', ecuTokenAddress);
  console.log('AI Asset Registry:   ', assetRegistryAddress);
  console.log('Royalty Escrow:      ', royaltyEscrowAddress);
  console.log('Governance DAO:      ', governanceDAOAddress);
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Save these addresses to your .env file:');
  console.log(`CONTRACT_ADDRESS=${assetRegistryAddress}`);
  console.log(`ECU_TOKEN_ADDRESS=${ecuTokenAddress}`);
  console.log(`ESCROW_ADDRESS=${royaltyEscrowAddress}`);
  console.log(`DAO_ADDRESS=${governanceDAOAddress}`);
  console.log('');
  console.log('🔍 Verify contracts on Etherscan:');
  console.log(`npx hardhat verify --network <network> ${ecuTokenAddress}`);
  console.log(`npx hardhat verify --network <network> ${assetRegistryAddress}`);
  console.log(`npx hardhat verify --network <network> ${royaltyEscrowAddress} ${assetRegistryAddress}`);
  console.log(`npx hardhat verify --network <network> ${governanceDAOAddress} ${ecuTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
