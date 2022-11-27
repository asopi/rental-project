import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { Injectable } from '@angular/core';
import { AbiItem } from 'web3-utils';

import { abi as nftAbi } from '../../../artifacts/contracts/RentalNFT.sol/RentalNFT.json';
import { abi as tokenAbi } from '../../../artifacts/contracts/RentalToken.sol/RentalToken.json';
import { Order } from '../models/order.model';
import { environment } from './../../environments/environment';
import { NFT } from './../models/wallet.model';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  constructor(
    private readonly walletService: WalletService,
    private readonly loadingService: LoadingService,
    private readonly router: Router
  ) {}

  /**
   * Approves the Rental Contract to transfer a specific NFT.
   *
   * @param nftContract Contains the contract account of the NFT collection
   * @param nftId Contains the token id of the NFT to be approved
   */
  public async approveNft(nftContract: string, nftId: number): Promise<void> {
    const contract = new this.walletService.web3.eth.Contract(
      nftAbi as AbiItem[],
      nftContract
    );
    this.loadingService.setLoading(true);
    await contract.methods
      .approve(environment.RENTAL_CONTRACT, nftId)
      .send({ from: this.walletService.account })
      .finally(() => this.loadingService.setLoading(false));
  }

  /**
   * Checks if the Rental Contract is approved to transfer a specific NFT.
   *
   * @param nftContract Contains the contract account of the NFT collection
   * @param nftId Contains the token id of the NFT to be approved
   * @returns State if the Rental Contract is approved
   */
  public async isNftApproved(
    nftContract: string,
    nftId: number
  ): Promise<boolean> {
    const contract = new this.walletService.web3.eth.Contract(
      nftAbi as AbiItem[],
      nftContract
    );
    const approvedAddress = await contract.methods.getApproved(nftId).call();
    return approvedAddress === environment.RENTAL_CONTRACT;
  }

  /**
   * Approves the Rental Contract to transfer a specific amount of Rental Tokens.
   *
   * @param amount Contains the amount for which the Rental Contract should be approved
   */
  public async approveToken(amount: number): Promise<void> {
    const contract = new this.walletService.web3.eth.Contract(
      tokenAbi as AbiItem[],
      environment.RENTAL_TOKEN
    );
    this.loadingService.setLoading(true);
    await contract.methods
      .approve(environment.RENTAL_CONTRACT, this.toContractPrice(amount))
      .send({ from: this.walletService.account })
      .finally(() => this.loadingService.setLoading(false));
  }

  /**
   * Checks if the Rental Contract is approved to transfer a specific amount of Rental Tokens.
   *
   * @param amount Contains the the Rental Token amount
   * @returns State if the Rental Contract is approved
   */
  public async isTokenApproved(amount: number): Promise<boolean> {
    const contract = new this.walletService.web3.eth.Contract(
      tokenAbi as AbiItem[],
      environment.RENTAL_TOKEN
    );
    const allowance = await contract.methods
      .allowance(this.walletService.account, environment.RENTAL_CONTRACT)
      .call();
    return allowance >= Number(this.toContractPrice(amount));
  }

  /**
   * Calls the lend funtion of the Rental Contract.
   *
   * @param nftContract Contains the contract account of the NFT collection
   * @param nftId Contains the token id of the NFT to be lent
   * @param duration Contains the max. rent doration in days
   * @param countPrice Contains the price per count, used to set the price for a "like"
   */
  public async lend(
    nftContract: string,
    nftId: number,
    duration: number,
    countPrice: number
  ): Promise<void> {
    const contract = new this.walletService.web3.eth.Contract(
      nftAbi as AbiItem[],
      nftContract
    );
    const ownerOf = await contract.methods.ownerOf(nftId).call();
    if (ownerOf === this.walletService.account) {
      this.loadingService.setLoading(true);
      await this.walletService.rentalContract.methods
        .lend(nftContract, nftId, duration, this.toContractPrice(countPrice))
        .send({ from: this.walletService.account })
        .finally(() => {
          this.loadingService.setLoading(false);
          this.router.navigateByUrl('/dashboard');
        });
    }
  }

  /**
   * Calls the rent funtion of the Rental Contract.
   *
   * @param nftContract Contains the contract account of the NFT collection
   * @param nftId Contains the token id of the NFT to be rented
   * @param duration Contains the rent doration in days
   * @param maxCount Contains the count limit, used to set the the limit for max. affordable likes
   */
  public async rent(
    nftContract: string,
    nftId: number,
    duration: number,
    maxCount: number
  ): Promise<void> {
    this.loadingService.setLoading(true);
    await this.walletService.rentalContract.methods
      .rent(nftContract, nftId, duration, maxCount)
      .send({ from: this.walletService.account })
      .on('error', (error: any) => console.error(error))
      .finally(() => {
        this.loadingService.setLoading(false);
        this.router.navigateByUrl('/dashboard');
      });
  }

  /**
   * Calls the stop lend funtion of the Rental Contract.
   *
   * @param order Contains the order to be stopped
   */
  public async stopLend(order: Order): Promise<void> {
    this.loadingService.setLoading(true);
    await this.walletService.rentalContract.methods
      .stopLend(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally(() => {
        this.loadingService.setLoading(false);
        window.location.reload();
      });
  }

  /**
   * Calls the stop rent funtion of the Rental Contract.
   *
   * @param order Contains the order to be stopped
   */
  public async stopRent(order: Order): Promise<void> {
    this.loadingService.setLoading(true);
    await this.walletService.rentalContract.methods
      .stopRent(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally(() => {
        this.loadingService.setLoading(false);
        window.location.reload();
      });
  }

  /**
   * Calls the claim fund funtion of the Rental Contract.
   *
   * @param order Contains the order for which the funds should be claimed
   */
  public async claimFund(order: Order): Promise<void> {
    this.loadingService.setLoading(true);
    await this.walletService.rentalContract.methods
      .claimFund(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally(() => {
        this.loadingService.setLoading(false);
        window.location.reload();
      });
  }

  /**
   * Calls the claim refund funtion of the Rental Contract.
   *
   * @param order Contains the order for which the refunds should be claimed
   */
  public async claimRefund(order: Order): Promise<void> {
    this.loadingService.setLoading(true);
    await this.walletService.rentalContract.methods
      .claimRefund(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally(() => {
        this.loadingService.setLoading(false);
        window.location.reload();
      });
  }

  /**
   * Calls the like function of the Rental Contract from the perspective of an implementer user.
   * The implementer user is programatically set just for demonstration purposes
   *
   * @param tokenAddress Contains the contract account of the NFT collection
   * @param tokenId Contains the token id of the NFT to be liked
   * @returns like
   */
  public async like(tokenAddress: string, tokenId: number): Promise<void> {
    let tx = {
      from: environment.IMPLEMENTER_ACCOUNT,
      to: environment.RENTAL_CONTRACT,
      gasPrice: await this.walletService.web3.eth.getGasPrice(),
      gas: await this.walletService.rentalContract.methods
        .increaseCount(tokenAddress, tokenId)
        .estimateGas({ from: environment.IMPLEMENTER_ACCOUNT }),
      data: await this.walletService.rentalContract.methods
        .increaseCount(tokenAddress, tokenId)
        .encodeABI(),
    };
    this.loadingService.setLoading(true);
    let signedTx: any =
      await this.walletService.web3.eth.accounts.signTransaction(
        tx,
        environment.IMPLEMENTER_PRIVATE_KEY
      );

    await this.walletService.web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .finally(() => this.loadingService.setLoading(false));
  }

  /**
   * Returns the order associated with an NFT.
   *
   * @param nft Contains the NFT Object
   * @returns Order
   */
  public async getOrder(nft: NFT): Promise<Order> {
    const orderCall = await this.walletService.rentalContract.methods
      .getOrder(nft.tokenAddress, nft.tokenId)
      .call({ from: this.walletService.account });
    const order = {
      nft: nft,
      lender: orderCall[2],
      renter: orderCall[3],
      duration: Number(orderCall[4]),
      countPrice: this.toRNT(orderCall[5]),
      count: Number(orderCall[6]),
      maxCount: Number(orderCall[7]),
      rentedAt: Number(orderCall[8]) * 1000,
      expiresAt: 0,
      renterClaimed: orderCall[9],
      lenderClaimed: orderCall[10],
    };
    return {
      ...order,
      type: this.getOrderType(order),
      state: this.getOrderState(order),
      currentPrice: order.count * order.countPrice,
      maxPrice: order.maxCount * order.countPrice,
      expiresAt: this.getExpiresAt(order.rentedAt, order.duration),
    };
  }

  /**
   * Returns the Rental Token balance for a specific account.
   *
   * @param account Contains account address
   * @returns Balance of the account
   */
  public async getBalance(account: string): Promise<number> {
    const contract = new this.walletService.web3.eth.Contract(
      tokenAbi as AbiItem[],
      environment.RENTAL_TOKEN
    );
    const result = await contract.methods.balanceOf(account).call();
    const convertedResult = this.walletService.web3.utils.fromWei(result);
    return parseFloat(convertedResult);
  }

  /**
   * Returns the order type for an specific order.
   *
   * @param order Contains order object
   * @returns Order type which can be LEND, RENT or UNKNOWN
   */
  private getOrderType(order: Order): string {
    if (order.lender === this.walletService.account) {
      return 'LEND';
    } else if (order.renter === this.walletService.account) {
      return 'RENT';
    } else {
      return 'UNKNOWN';
    }
  }

  /**
   * Calculates the expiration date.
   *
   * @param rentedAt Contains the date on which an order was created
   * @param duration Contains the duration set for an order
   * @returns Expiration date in milliseconds
   */
  private getExpiresAt(rentedAt: number, duration: number): number {
    return rentedAt === 0 ? 0 : rentedAt + duration * 24 * 60 * 60 * 1000;
  }

  /**
   * Returns the order state.
   *
   * @param order Contains the order object
   * @returns Order state which can be OPEN, RENTED, CLAIMED, CLOSED or UNKNOWN
   */
  private getOrderState(order: Order): string {
    if (order.renter === environment.NULL_ADDRESS) {
      return 'OPEN';
    } else if (
      order.renter !== environment.NULL_ADDRESS &&
      order.duration > 0 &&
      order.expiresAt <= order.rentedAt &&
      order.lender !== order.renter
    ) {
      return 'RENTED';
    } else if (
      (order.lender === this.walletService.account && order.lenderClaimed) ||
      (order.renter === this.walletService.account && order.renterClaimed)
    ) {
      return 'CLAIMED';
    } else if (
      order.duration === 0 ||
      order.expiresAt > order.rentedAt ||
      order.lender === order.renter
    ) {
      return 'CLOSED';
    } else {
      return 'UNKNOWN';
    }
  }

  /**
   * Transforms an amount to be complient with the decimal number format of the Rental Token.
   *
   * @param amount Contains the amount to be transformed
   * @returns Transformed amount
   */
  private toContractPrice(amount: number): string {
    return `${amount * 10 ** 18}`;
  }

  /**
   * Transforms an Rental Token amount to be complient with the decimal number format of the frontend.
   *
   * @param amount Contains the amount to be transformed
   * @returns Transformed amount
   */
  private toRNT(amount: number): number {
    return amount / 10 ** 18;
  }
}
