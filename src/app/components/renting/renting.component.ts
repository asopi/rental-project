
import { Card } from './../../models/card.model';
import { Observable, map, from } from 'rxjs';
import { RentalService } from './../../services/rental.service';
import { Component, OnInit } from '@angular/core';
import { NFT } from './../../models/wallet.model';

@Component({
  selector: 'app-renting',
  templateUrl: './renting.component.html',
  styleUrls: ['./renting.component.scss']
})
export class RentingComponent implements OnInit {
  public nftCards$: Observable<Card[]> = from(this.rentalService.loadMyNft()).pipe(map(this.convertNftToCard));

  constructor(private readonly rentalService: RentalService) { }

  ngOnInit(): void {
    this.rentalService.loadMyNft();
  }

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
