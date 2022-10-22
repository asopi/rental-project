import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NFT } from 'src/app/models/wallet.model';

import { LendingDialogComponent } from '../lending-dialog/lending-dialog.component';
import { NftService } from './../../services/nft.service';

@Component({
  selector: 'app-lending',
  templateUrl: './lending.component.html',
  styleUrls: ['./lending.component.scss'],
})
export class LendingComponent {
  public nfts$: Observable<NFT[]> = this.nftService.loadAccountNfts();

  constructor(
    private readonly nftService: NftService,
    private readonly dialogService: MatDialog
  ) {}

  public lendClicked(nft: NFT): void {
    this.openLendingDialog(nft);
  }

  private openLendingDialog(nft: NFT): void {
    this.dialogService.open(LendingDialogComponent, {
      width: '800px',
      data: nft,
    });
  }
}
