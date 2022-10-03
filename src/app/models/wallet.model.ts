export interface Wallet {
  address: string;
  balance: string;
}

export interface NFT {
  ownerAddress: string;
  tokenId?: string;
  name: string;
  description: string;
  image: string;
}
