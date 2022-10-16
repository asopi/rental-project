import { NFT } from './wallet.model';
export interface Order {
  nft: NFT;
  lender: string;
  renter: string;
  duration: number;
  countPrice: number;
  count: number;
  maxCount: number;
  rentedAt: number;
  type?: string;
  state?: string;
  currentPrice?: number;
  maxPrice?: number;
  expiresAt: number;
}
