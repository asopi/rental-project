import { ethers } from 'hardhat';
import { config as dotenv } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
dotenv({ path: resolve(__dirname, './../.env') });

async function main() {
  const RentalToken = await ethers.getContractFactory('RentalToken');
  const rentalToken = await RentalToken.deploy();
  const rentalTokenDeployed = await rentalToken.deployed();
  console.log('RentalToken address: ' + rentalTokenDeployed.address);

  const RentalNft = await ethers.getContractFactory('RentalNFT');
  const rentalNft = await RentalNft.deploy();
  const rentalNftDeployed = await rentalNft.deployed();
  console.log('RentalNft address: ' + rentalNftDeployed.address);

  const RentalContract = await ethers.getContractFactory('RentalContract');
  const rentalContract = await RentalContract.deploy(
    process.env.IMPLEMENTER_ACCOUNT,
    rentalTokenDeployed.address
  );
  const rentalContractDeployed = await rentalContract.deployed();
  console.log('RentalContract: ' + rentalContractDeployed.address);

  syncWriteFile(
    './../.env.new',
    `
    IMPLEMENTER_ACCOUNT="${process.env.IMPLEMENTER_ACCOUNT}"
    IMPLEMENTER_PRIVATE_KEY="${process.env.IMPLEMENTER_PRIVATE_KEY}"
    ETHERSCAN_API_KEY="${process.env.ETHERSCAN_API_KEY}"
    ALCHEMY_RPC_URL="${process.env.ALCHEMY_RPC_URL}"
    RENTAL_TOKEN="${rentalTokenDeployed.address}"
    RENTAL_NFT="${rentalNftDeployed.address}"
    RENTAL_CONTRACT="${rentalContractDeployed.address}"`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function syncWriteFile(filename: string, data: any) {
  writeFileSync(join(__dirname, filename), data, {
    flag: 'w',
  });
  return readFileSync(join(__dirname, filename), 'utf-8');
}
