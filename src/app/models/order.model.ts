export interface Order {
  nftAddress: string;
  nftId: number;
  lender: string;
  renter: string;
  duration: number;
  countPrice: number;
  count: number;
  maxCount: number;
  rentedAt: number;
  type?: string;
  state?: string;
}
