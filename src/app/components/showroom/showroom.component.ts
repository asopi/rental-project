import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Card } from 'src/app/models/card.model';
import { NFT } from 'src/app/models/wallet.model';

import { RentalService } from './../../services/rental.service';

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss']
})
export class ShowroomComponent {

  public nftCards$: Observable<Card[]> = this.rentalService
    .getNfts()
    .pipe(map(this.convertNftToCard));

  constructor(private readonly rentalService: RentalService) { }

  public convertNftToCard(nfts: NFT[]): Card[] {
    return nfts.map(nft => {
      return {
        identity: nft.contractAddress,
        title: nft.name,
        subtitle: nft.description,
        image: nft.image,
      };
    });
  }

  public likeClicked(event: Event): void {
    console.log("clicked", event);
  }
}
