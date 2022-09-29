export interface Wallet {
  address: string;
  balance: string;
}

export interface NFT {
  contractAddress: string;
  tokenId: string;
  tokenUri: string;
  name: string;
  description: string;
  image: string;
}
