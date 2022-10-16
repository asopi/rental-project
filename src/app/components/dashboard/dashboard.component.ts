import { Order } from './../../models/order.model';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { RentalService } from 'src/app/services/rental.service';

import { NftService } from './../../services/nft.service';
import { WalletService } from './../../services/wallet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public account = this.walletService.account;
  public orders$: Observable<any> = this.nftService.loadContractNfts().pipe(
    switchMap((nfts) => {
      const observables = nfts.map((nft) =>
        from(this.rentalService.getOrder(nft.tokenAddress, nft.tokenId))
      );
      return forkJoin(observables).pipe(
        map((orders) =>
          orders.filter(
            (order) =>
              order.renter === this.walletService.account ||
              order.lender === this.walletService.account ||
              (order.lender === this.walletService.account &&
                order.renter === environment.NULL_ADDRESS)
          )
        ),
        map((next) => new MatTableDataSource(next))
      );
    })
  );

  constructor(
    private readonly rentalService: RentalService,
    private readonly walletService: WalletService,
    private readonly nftService: NftService
  ) {}

  ngOnInit(): void {}

  public stopLendClicked(order: Order): void {
    this.rentalService.stopLend(order.nftAddress, order.nftId);
  }

  public stopRentClicked(order: Order): void {
    this.rentalService.stopRent(order.nftAddress, order.nftId);
  }

  public claimFundClicked(order: Order): void {
    this.rentalService.claimFund(order.nftAddress, order.nftId);
  }

  public claimRefundClicked(order: Order): void {
    this.rentalService.claimRefund(order.nftAddress, order.nftId);
  }
}
