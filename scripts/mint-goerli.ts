import * as fs from 'fs';
import { config as dotenv } from 'dotenv';
import { resolve } from 'path';
import { ethers } from 'hardhat';
dotenv({ path: resolve(__dirname, './../.env') });

const RentalNft = JSON.parse(
  fs.readFileSync('./artifacts/contracts/RentalNFT.sol/RentalNFT.json', 'utf-8')
);
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_RPC_URL
);

async function main() {
  const ipfsIdsForFirstMint = [
    'QmY6C1HaVPod6byAjigRA63nn45GR7XeTHvKgjfpfUzDiH',
    'Qme6LYFV5jsuaWacYNn8GmjYtiWdAtLXxDPJZngtxDEBvA',
    'QmU1TitNLFwUL7gdqezHfzvEzEjagzzGCfUPK73fu9MCFT',
    'QmRfG6vPTxs4rjWi4NjCKd3g1DtfQU8hbwHEpCxydvF9Z2',
    'QmavvSuD4M9YCh1M3yi58ifXPxKoCpSZqWrKs5vHRwJfkd',
  ];
  const ipfsIdsForSecondMint = [
    'QmQYCj6kZ95VFGU7HLoHpoDwxnYvMG3Bxya62cViPF1kGy',
    'QmZvNBkLzUCbhwAZKHyufdH1Tp1s43t8Joiz6cMTEvB8pW',
    'QmbhBrdAKQqnrxrd3fMxuRrxCUw49QgDWxYsKQQmBUt34X',
    'QmZaxuuyGAqpJnGwX3LZPBwFThVfsbJJzuf1Ee4npWk5ne',
    'QmSnMf6nLHsbxAGXobTHtcN5HXazHLPZu1PJmLTkqwgHSr',
  ];
  for (let ipfsId of ipfsIdsForFirstMint) {
    const ipfsUri = `https://ipfs.io/ipfs/${ipfsId}`;
    console.log('Start minting: ', ipfsId);
    const tokenId = await mint(ipfsUri, process.env.LENDER_PRIVATE_KEY);
    console.log(`End minting tokenId: ${tokenId}`);
  }

  for (let ipfsId of ipfsIdsForSecondMint) {
    console.log('Start minting: ', ipfsId);
    const tokenId = await mint(
      `https://ipfs.io/ipfs/${ipfsId}`,
      process.env.RENTER_PRIVATE_KEY
    );
    console.log(`End minting tokenId: ${tokenId}`);
  }
}

async function mint(ipfsUrl: string, account: string) {
  const signer = new ethers.Wallet(account, provider);
  const contract = new ethers.Contract(
    process.env.RENTAL_NFT,
    RentalNft.abi,
    signer
  );
  const transaction = await contract.mint(ipfsUrl);
  await transaction.wait();
}

async function sendNFT(
  fromKey: string,
  from: string,
  to: string,
  tokenId: number
) {
  const signer = new ethers.Wallet(fromKey, provider);
  const contract = new ethers.Contract(
    process.env.RENTAL_NFT,
    RentalNft.abi,
    signer
  );
  const transaction = await contract.transferFrom(from, to, tokenId);
  await transaction.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
