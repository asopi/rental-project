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

  public lend(nftContract: string, nftId: number, duration: number, countPrice: number) {
    this.walletService.account$.subscribe(async account => {
      const rentalNft = new this.walletService.web3.eth.Contract(abi as AbiItem[], nftContract);
      const ownerOf = await rentalNft.methods.ownerOf(nftId).call();
      if (ownerOf === account) {
        await rentalNft.methods.approve(environment.RENTAL_CONTRACT, nftId).send({ from: account });
        const approved = await rentalNft.methods.getApproved(nftId).call();
        if (approved === account) {
          await this.walletService.rentalContract.methods.lend(nftContract, nftId, duration, countPrice).send({ from: account });
        }
      }
    });
  }

  public rent() {

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
