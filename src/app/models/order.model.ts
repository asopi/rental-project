export interface Order {
  nftAddress: string;
  nftId: string;
  lender: string;
  renter: string;
  duration: number;
  countPrice: number;
  count: number;
  maxCount: number;
  rentedAt: number;
}
