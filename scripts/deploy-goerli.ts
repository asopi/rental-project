import { ethers } from "hardhat";
import { config as dotenv } from 'dotenv';
import { resolve } from "path";
dotenv({ path: resolve(__dirname, "./../.env") });

async function main() {
  const RentalToken = await ethers.getContractFactory("RentalToken");
  const rentalToken = await RentalToken.deploy();
  const rentalTokenDeployed = await rentalToken.deployed();
  console.log("RentalToken address: " + rentalTokenDeployed.address);

  const RentalNft = await ethers.getContractFactory("RentalNFT");
  const rentalNft = await RentalNft.deploy();
  const rentalNftDeployed = await rentalNft.deployed();
  console.log("RentalNft address: " + rentalNftDeployed.address);

  const RentalContract = await ethers.getContractFactory("RentalContract");
  const rentalContract = await RentalContract.deploy(
    process.env.GOERLI_TEST_ACCOUNT,
    process.env.GOERLI_TEST_TOKEN
  );
  const rentalContractDeployed = await rentalContract.deployed();
  console.log("RentalContract: " + JSON.stringify(rentalContractDeployed));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
