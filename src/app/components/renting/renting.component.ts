import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { RentalService } from 'src/app/services/rental.service';
import { environment } from 'src/environments/environment';

import { RentingDialogComponent } from '../renting-dialog/renting-dialog.component';
import { NFT } from './../../models/wallet.model';
import { NftService } from './../../services/nft.service';

@Component({
  selector: 'app-renting',
  templateUrl: './renting.component.html',
  styleUrls: ['./renting.component.scss'],
})
export class RentingComponent {
  public nfts$: Observable<NFT[]> = this.nftService
    .loadContractNfts()
    .pipe(switchMap((next) => this.displayNFT(next)));

  constructor(
    private readonly nftService: NftService,
    private readonly dialogService: MatDialog,
    private readonly rentalService: RentalService
  ) {}

  public rentClicked(nft: NFT): void {
    this.openRentingDialog(nft);
  }

  private openRentingDialog(nft: NFT): void {
    const dialogRef = this.dialogService.open(RentingDialogComponent, {
      width: '800px',
      data: nft,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('afterClose');
    });
  }

  public displayNFT(nfts: NFT[]): Observable<NFT[]> {
    const observables = nfts.map((nft) =>
      from(this.rentalService.getOrder(nft))
    );
    return forkJoin(observables).pipe(
      map((orders) =>
        orders.filter((order) => order.renter === environment.NULL_ADDRESS)
      ),
      map((orders) =>
        nfts.filter((nft) => {
          const orderIds = orders.map(
            (order) =>
              `${order.nft.tokenAddress.toLocaleLowerCase()}:${
                order.nft.tokenId
              }`
          );
          return orderIds.includes(
            `${nft.tokenAddress.toLocaleLowerCase()}:${nft.tokenId}`
          );
        })
      )
    );
  }
}
