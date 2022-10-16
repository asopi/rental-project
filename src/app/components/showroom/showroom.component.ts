import { Component, ViewEncapsulation } from '@angular/core';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { NFT } from 'src/app/models/wallet.model';
import { RentalService } from 'src/app/services/rental.service';
import { environment } from 'src/environments/environment';
import SwiperCore, { EffectCoverflow, Navigation, Pagination } from 'swiper';

import { NftService } from './../../services/nft.service';
import { WalletService } from './../../services/wallet.service';

SwiperCore.use([EffectCoverflow, Pagination, Navigation]);

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowroomComponent {
  public nfts$: Observable<NFT[]> = this.nftService
    .loadContractNfts()
    .pipe(switchMap((next) => this.displayNFT(next)));

  constructor(
    private readonly nftService: NftService,
    private readonly rentalService: RentalService,
    private readonly walletService: WalletService
  ) {}

  public likeClicked(nft: NFT): void {
    this.rentalService.like(nft.tokenAddress, nft.tokenId);
  }

  public displayNFT(orders: NFT[]): Observable<NFT[]> {
    const observables = orders.map((order) =>
      from(this.rentalService.getOrder(order))
    );
    return forkJoin(observables).pipe(
      map((orders) =>
        orders.filter((order) => order.renter !== environment.NULL_ADDRESS)
      ),
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
      map((orders) => orders.map((order) => order.nft))
    );
  }
}
