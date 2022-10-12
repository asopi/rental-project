import { BehaviorSubject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { AbiItem } from 'web3-utils';
import { abi as nftAbi } from '../../../artifacts/contracts/RentalNFT.sol/RentalNFT.json';
import { abi as tokenAbi } from '../../../artifacts/contracts/RentalToken.sol/RentalToken.json';
import { WalletService } from './wallet.service';
import { Order } from '../models/order.model';

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

  public async stopLend(nftContract: string, nftId: number): Promise<void> {
    await this.walletService.rentalContract.methods
      .stopLend(nftContract, nftId)
      .call({ from: this.walletService.account });
  }

  public async stopRent(nftContract: string, nftId: number): Promise<void> {
    await this.walletService.rentalContract.methods
      .stopRent(nftContract, nftId)
      .call({ from: this.walletService.account });
  }

  public async claimFunds(nftContract: string, nftId: number): Promise<void> {
    await this.walletService.rentalContract.methods
      .claimFunds(nftContract, nftId)
      .call({ from: this.walletService.account });
  }

  public async claimRefunds(nftContract: string, nftId: number): Promise<void> {
    await this.walletService.rentalContract.methods
      .claimRefunds(nftContract, nftId)
      .call({ from: this.walletService.account });
  }

  public async getOrder(nftContract: string, nftId: number): Promise<Order> {
    const order = await this.walletService.rentalContract.methods
      .getOrder(nftContract, nftId)
      .call({ from: this.walletService.account });
    return {
      nftAddress: order[0],
      nftId: order[1],
      lender: order[2],
      renter: order[3],
      duration: order[4],
      countPrice: order[5],
      count: order[6],
      maxCount: order[7],
      rentedAt: order[8],
    };
  }
}
