import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NFT } from 'src/app/models/wallet.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input()
  public nft!: NFT;

  @Input()
  public button!: string;

  @Output()
  public buttonClick: EventEmitter<NFT> = new EventEmitter<NFT>();

  constructor() { }
}
