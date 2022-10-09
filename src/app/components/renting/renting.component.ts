import { NftService } from './../../services/nft.service';

import { Observable, map } from 'rxjs';
import { Component } from '@angular/core';
import { NFT } from './../../models/wallet.model';

@Component({
  selector: 'app-renting',
  templateUrl: './renting.component.html',
  styleUrls: ['./renting.component.scss']
})
export class RentingComponent {
  public nfts$: Observable<NFT[]> = this.nftService.loadAccountNfts();

  constructor(private readonly nftService: NftService) { }

  public rentClicked(nft: NFT) {
    console.log("rent clicked", nft);
  }

}
