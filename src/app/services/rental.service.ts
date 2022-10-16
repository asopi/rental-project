import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  public rentLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public lendLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private readonly walletService: WalletService) {}

  public async approveNft(nftContract: string, nftId: number) {
    const contract = new this.walletService.web3.eth.Contract(
      nftAbi as AbiItem[],
      nftContract
    );
    this.lendLoading$.next(true);
    await contract.methods
      .approve(environment.RENTAL_CONTRACT, nftId)
      .send({ from: this.walletService.account })
      .finally(() => this.lendLoading$.next(false));
  }

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

  public async approveToken(amount: number): Promise<void> {
    const contract = new this.walletService.web3.eth.Contract(
      tokenAbi as AbiItem[],
      environment.RENTAL_TOKEN
    );
    this.rentLoading$.next(true);
    await contract.methods
      .approve(environment.RENTAL_CONTRACT, amount)
      .send({ from: this.walletService.account })
      .finally(() => this.rentLoading$.next(false));
  }

  public async isTokenApproved(amount: number): Promise<boolean> {
    const contract = new this.walletService.web3.eth.Contract(
      tokenAbi as AbiItem[],
      environment.RENTAL_TOKEN
    );
    const allowance = await contract.methods
      .allowance(this.walletService.account, environment.RENTAL_CONTRACT)
      .call();
    return allowance >= amount;
  }

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
      this.lendLoading$.next(true);
      await this.walletService.rentalContract.methods
        .lend(nftContract, nftId, duration, countPrice)
        .send({ from: this.walletService.account })
        .finally(() => this.lendLoading$.next(false));
    }
  }

  public async rent(
    nftContract: string,
    nftId: number,
    duration: number,
    maxCount: number
  ): Promise<void> {
    this.rentLoading$.next(true);
    await this.walletService.rentalContract.methods
      .rent(nftContract, nftId, duration, maxCount)
      .send({ from: this.walletService.account })
      .finally(() => this.rentLoading$.next(false));
  }

  public async stopLend(order: Order): Promise<void> {
    await this.walletService.rentalContract.methods
      .stopLend(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally((next: any) => console.log('lend stopped', next));
  }

  public async stopRent(order: Order): Promise<void> {
    await this.walletService.rentalContract.methods
      .stopRent(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally((next: any) => {
        console.log('rent stopped', next);
      });
  }

  public async claimFund(order: Order): Promise<void> {
    await this.walletService.rentalContract.methods
      .claimFund(order.nft.tokenAddress, order.nft.tokenId)
      .call({ from: this.walletService.account })
      .finally(() => {
        console.log('claimFund done');
      });
  }

  public async claimRefund(order: Order): Promise<void> {
    await this.walletService.rentalContract.methods
      .claimRefund(order.nft.tokenAddress, order.nft.tokenId)
      .send({ from: this.walletService.account })
      .finally(() => {
        console.log('claimReFund done');
      });
  }

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

    let signedTx: any =
      await this.walletService.web3.eth.accounts.signTransaction(
        tx,
        environment.IMPLEMENTER_PRIVATE_KEY
      );

    await this.walletService.web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .then((next) => {
        console.log('done', next);
      });
  }

  public async getOrder(nft: NFT): Promise<Order> {
    const orderCall = await this.walletService.rentalContract.methods
      .getOrder(nft.tokenAddress, nft.tokenId)
      .call({ from: this.walletService.account });
    const order = {
      nft: nft,
      lender: orderCall[2],
      renter: orderCall[3],
      duration: Number(orderCall[4]),
      countPrice: Number(orderCall[5]),
      count: Number(orderCall[6]),
      maxCount: Number(orderCall[7]),
      rentedAt: Number(orderCall[8]) * 1000,
      expiresAt: 0,
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

  public async getBalance(account: string): Promise<number> {
    const contract = new this.walletService.web3.eth.Contract(
      tokenAbi as AbiItem[],
      environment.RENTAL_TOKEN
    );
    const result = await contract.methods.balanceOf(account).call();
    const convertedResult = this.walletService.web3.utils.fromWei(result);
    return parseFloat(convertedResult);
  }

  private getOrderType(order: Order): string {
    if (order.lender === this.walletService.account) {
      return 'LEND';
    } else if (order.renter === this.walletService.account) {
      return 'RENT';
    } else {
      return 'UNKNOWN';
    }
  }

  private getExpiresAt(rentedAt: number, duration: number): number {
    return rentedAt === 0 ? 0 : rentedAt + duration * 24 * 60 * 60 * 1000;
  }

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
      order.duration === 0 ||
      order.expiresAt > order.rentedAt ||
      order.lender === order.renter
    ) {
      return 'CLOSED';
    } else {
      console.log('order.duration', typeof order.duration);
      return 'UNKNOWN';
    }
  }
}
