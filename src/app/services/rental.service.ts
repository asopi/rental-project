import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { AbiItem } from 'web3-utils';
import { abi } from '../../../artifacts/contracts/RentalNFT.sol/RentalNFT.json';
import { WalletService } from './wallet.service';



@Injectable({
  providedIn: 'root'
})
export class RentalService {
  constructor(private readonly walletService: WalletService) { }

  public async approveNft(nftContract: string, nftId: number) {
    const contract = new this.walletService.web3.eth.Contract(abi as AbiItem[], nftContract);
    await contract.methods.approve(environment.RENTAL_CONTRACT, nftId).send({ from: this.walletService.account });
  }

  public async isApproved(nftContract: string, nftId: number): Promise<boolean> {
    const contract = new this.walletService.web3.eth.Contract(abi as AbiItem[], nftContract);
    const approvedAddress = await contract.methods.getApproved(nftId).call();
    return approvedAddress === environment.RENTAL_CONTRACT;
  }

  public async lend(nftContract: string, nftId: number, duration: number, countPrice: number) {
    const contract = new this.walletService.web3.eth.Contract(abi as AbiItem[], nftContract);
    const ownerOf = await contract.methods.ownerOf(nftId).call();
    if (ownerOf === this.walletService.account) {
      await this.walletService.rentalContract.methods.lend(nftContract, nftId, duration, countPrice).send({ from: this.walletService.account });
    }
  }

  public rent(nftContract: string, nftId: number, duration: number, maxCount: number) {

  }

  public stopLend() {

  }

  public stopRent() {

  }

  public claimFunds() {

  }

  public claimRefunds() {

  }
}
