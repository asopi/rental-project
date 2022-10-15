import { WalletService } from './../../services/wallet.service';
import { RentalService } from 'src/app/services/rental.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from, forkJoin, switchMap, map } from 'rxjs';
import { NFT } from 'src/app/models/wallet.model';

import { LendingDialogComponent } from '../lending-dialog/lending-dialog.component';
import { NftService } from './../../services/nft.service';

@Component({
  selector: 'app-lending',
  templateUrl: './lending.component.html',
  styleUrls: ['./lending.component.scss'],
})
export class LendingComponent {
  public nfts$: Observable<NFT[]> = this.nftService.loadAccountNfts();
  public lendedNfts$: Observable<NFT[]> = this.nftService
    .loadContractNfts()
    .pipe(switchMap((next) => this.displayMyLendedNFT(next)));

  constructor(
    private readonly nftService: NftService,
    private readonly dialogService: MatDialog,
    private readonly rentalService: RentalService,
    private readonly walletService: WalletService
  ) {}

  public lendClicked(nft: NFT): void {
    this.openLendingDialog(nft);
  }

  public stopLendClicked(nft: NFT): void {
    this.rentalService.stopLend(nft.tokenAddress, nft.tokenId);
  }

  public claimFunds(nft: NFT): void {
    this.rentalService.claimFunds(nft.tokenAddress, nft.tokenId);
  }

  private openLendingDialog(nft: NFT): void {
    const dialogRef = this.dialogService.open(LendingDialogComponent, {
      width: '800px',
      data: nft,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('afterClose');
    });
  }

  private displayMyLendedNFT(nfts: NFT[]): Observable<NFT[]> {
    const observables = nfts.map((nft) =>
      from(this.rentalService.getOrder(nft.tokenAddress, nft.tokenId))
    );
    return forkJoin(observables).pipe(
      map((orders) =>
        orders.filter((order) => order.lender === this.walletService.account)
      ),
      map((orders) =>
        nfts.filter((nft) => {
          const orderIds = orders.map(
            (order) => `${order.nftAddress.toLocaleLowerCase()}:${order.nftId}`
          );
          return orderIds.includes(
            `${nft.tokenAddress.toLocaleLowerCase()}:${nft.tokenId}`
          );
        })
      )
    );
  }
}
