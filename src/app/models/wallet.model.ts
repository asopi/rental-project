export interface Wallet {
  address: string;
  balance: string;
}

export interface NFT {
  contractAddress?: string;
  ownerAddress: string;
  tokenId?: string;
  name: string;
  description: string;
  image: string;
}
