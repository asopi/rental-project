import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NFT } from 'src/app/models/wallet.model';

import { NftService } from './../../services/nft.service';

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss']
})
export class ShowroomComponent {

  public nfts$: Observable<NFT[]> = this.nftService.loadContractNfts();

  constructor(private readonly nftService: NftService) { }

  public likeClicked(card: NFT): void {
    console.log("clicked", card);
  }
}
