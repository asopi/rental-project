import { Component, OnInit } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Card } from 'src/app/models/card.model';
import { NFT } from 'src/app/models/wallet.model';

import { NftService } from './../../services/nft.service';

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss']
})
export class ShowroomComponent {

  public nftCards$: Observable<Card[]> = this.nftService.loadContractNfts()
    .pipe(map(this.convertNftToCard));

  constructor(private readonly nftService: NftService) { }

  public convertNftToCard(nfts: NFT[]): Card[] {
    return nfts.map(nft => {
      return {
        identity: nft.ownerAddress,
        title: `${nft.name} #${nft.tokenId} `,
        subtitle: nft.description,
        image: nft.image,
      };
    });
  }

  public likeClicked(event: Event): void {
    console.log("clicked", event);
  }
}
