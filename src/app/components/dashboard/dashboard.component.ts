import { Order } from './../../models/order.model';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, Observable, switchMap, tap, from } from 'rxjs';
import { RentalService } from 'src/app/services/rental.service';

import { NftService } from './../../services/nft.service';
import { WalletService } from './../../services/wallet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public account = this.walletService.account;
  public balance$: Observable<number> = from(
    this.rentalService.getBalance(this.account)
  );
  public rentedNfts = 0;
  public rentableNfts = 0;
  public lendedNfts = 0;
  public openLendes = 0;
  public lendableNfts$ = this.nftService
    .loadAccountNfts()
    .pipe(map((nfts) => nfts.length));
  public orders$: Observable<any> = this.nftService.loadContractNfts().pipe(
    switchMap((nfts) => {
      const observables = nfts.map((nft) =>
        from(this.rentalService.getOrder(nft))
      );
      return forkJoin(observables).pipe(
        tap((orders) => this.setDashboardItems(orders)),
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

  public stopLendClicked(order: Order): void {
    this.rentalService.stopLend(order);
  }

  public stopRentClicked(order: Order): void {
    this.rentalService.stopRent(order);
  }

  public claimFundClicked(order: Order): void {
    this.rentalService.claimFund(order);
  }

  public claimRefundClicked(order: Order): void {
    this.rentalService.claimRefund(order);
  }

  private setDashboardItems(orders: Order[]): void {
    this.rentedNfts = orders.filter(
      (order) => order.renter === this.account
    ).length;
    this.rentableNfts = orders.filter(
      (order) =>
        order.renter === environment.NULL_ADDRESS &&
        order.lender !== this.walletService.account
    ).length;
    this.lendedNfts = orders.filter(
      (order) =>
        order.lender === this.account &&
        order.renter !== environment.NULL_ADDRESS
    ).length;
    this.openLendes = orders.filter(
      (order) =>
        order.lender === this.account &&
        order.renter === environment.NULL_ADDRESS
    ).length;
  }
}
