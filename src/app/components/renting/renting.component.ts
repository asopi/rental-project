import { NftService } from './../../services/nft.service';

import { Card } from './../../models/card.model';
import { Observable, map } from 'rxjs';
import { Component } from '@angular/core';
import { NFT } from './../../models/wallet.model';

@Component({
  selector: 'app-renting',
  templateUrl: './renting.component.html',
  styleUrls: ['./renting.component.scss']
})
export class RentingComponent {
  public nftCards$: Observable<Card[]> = this.nftService.loadAccountNfts()
    .pipe(map(this.convertNftToCard));

  constructor(private readonly nftService: NftService) { }

  public convertNftToCard(nfts: NFT[]): Card[] {
    return nfts.map(nft => {
      return {
        identity: nft.ownerAddress,
        title: nft.name,
        subtitle: nft.description,
        image: nft.image,
      };
    });
  }

}
