import { ethers } from "hardhat";

async function main() {
  const Rental = await ethers.getContractFactory("Rental");
  const rental = await Rental.deploy();

  await rental.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
