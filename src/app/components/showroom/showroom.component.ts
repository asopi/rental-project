import { Component, ViewEncapsulation } from '@angular/core';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { NFT } from 'src/app/models/wallet.model';
import { RentalService } from 'src/app/services/rental.service';
import SwiperCore, { EffectCoverflow, Navigation, Pagination } from 'swiper';

import { Order } from './../../models/order.model';
import { NftService } from './../../services/nft.service';

SwiperCore.use([EffectCoverflow, Pagination, Navigation]);

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowroomComponent {
  public orders$: Observable<Order[]> = this.nftService
    .loadContractNfts()
    .pipe(switchMap((next) => this.displayNFT(next)));

  constructor(
    private readonly nftService: NftService,
    private readonly rentalService: RentalService
  ) {}

  public likeClicked(nft: NFT): void {
    this.rentalService.like(nft.tokenAddress, nft.tokenId);
  }

  public displayNFT(orders: NFT[]): Observable<Order[]> {
    const observables = orders.map((order) =>
      from(this.rentalService.getOrder(order))
    );
    return forkJoin(observables).pipe(
      map((orders) => orders.filter((order) => order.state === 'RENTED')),
      map((orders) =>
        orders.filter((order) => {
          const orderIds = orders.map(
            (order) =>
              `${order.nft.tokenAddress.toLocaleLowerCase()}:${
                order.nft.tokenId
              }`
          );
          return orderIds.includes(
            `${order.nft.tokenAddress.toLocaleLowerCase()}:${order.nft.tokenId}`
          );
        })
      ),
      map((orders) => orders.map((order) => order))
    );
  }
}
