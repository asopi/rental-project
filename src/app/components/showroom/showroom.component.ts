import { Component, ViewEncapsulation } from '@angular/core';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { NFT } from 'src/app/models/wallet.model';
import { RentalService } from 'src/app/services/rental.service';
import SwiperCore, { EffectCoverflow, Navigation, Pagination } from 'swiper';

import { NftService } from './../../services/nft.service';

SwiperCore.use([EffectCoverflow, Pagination, Navigation]);

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowroomComponent {
  private NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

  public nfts$: Observable<NFT[]> = this.nftService.loadContractNfts().pipe(
    switchMap(next => this.displayNFT(next))
  );

  constructor(
    private readonly nftService: NftService,
    private readonly rentalService: RentalService
  ) { }

  public likeClicked(nft: NFT): void {
    console.log("clicked", nft);
  }

  public displayNFT(nfts: NFT[]): Observable<NFT[]> {
    const observables = nfts.map(nft =>
      from(this.rentalService.getOrder(nft.tokenAddress, nft.tokenId)));
    return forkJoin(observables).pipe(
      map(orders => orders.filter(order => order.renter === this.NULL_ADDRESS)),
      map(orders => nfts.filter(nft => {
        const orderIds = orders.map(order => `${order.nftAddress.toLocaleLowerCase()}:${order.nftId}`);
        return orderIds.includes(`${nft.tokenAddress.toLocaleLowerCase()}:${nft.tokenId}`);
      }))
    );
  }
}
