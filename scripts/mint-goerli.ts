import * as fs from 'fs';
import { config as dotenv } from 'dotenv';
import { resolve } from "path";
dotenv({ path: resolve(__dirname, "./../.env") });

const RentalNft = JSON.parse(fs.readFileSync('./artifacts/contracts/RentalNFT.sol/RentalNFT.json', 'utf-8'));
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

async function main() {
  console.log("Minting NFT...");
  const tokenId = await mint(`https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1`);
  console.log(`Contract Address: ${process.env.GOERLI_TEST_NFT} Token Counter: ${tokenId}`);
}

async function mint(ipfsUrl: string) {
  const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.GOERLI_TEST_NFT, RentalNft.abi, signer);
  const transaction = await contract.mint(ipfsUrl);
  await transaction.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
