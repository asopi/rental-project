export interface Wallet {
  address: string;
  balance: string;
}

export interface NFT {
  tokenAddress: string;
  ownerAddress: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
}
