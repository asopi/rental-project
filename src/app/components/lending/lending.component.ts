import { NftService } from './../../services/nft.service';
import { Observable, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NFT } from 'src/app/models/wallet.model';
import { LendingDialogComponent } from '../lending-dialog/lending-dialog.component';
import { RentingDialogComponent } from '../renting-dialog/renting-dialog.component';

@Component({
  selector: 'app-lending',
  templateUrl: './lending.component.html',
  styleUrls: ['./lending.component.scss']
})
export class LendingComponent implements OnInit {
  public nfts$: Observable<NFT[]> = this.nftService.loadAccountNfts();

  constructor(private readonly nftService: NftService, private readonly dialogService: MatDialog) { }

  ngOnInit(): void {

  }

  openRentingDialog(): void {
    const dialogRef = this.dialogService.open(RentingDialogComponent, {
      width: '800px',
      data: { name: "name", image: 'https://ipfs.io/ipfs/QmVDeVyDnCmXCFQTbgbc5TW8VGjMtfCVDg7bUhwRhjADNr', description: "klfjaölasfj askajsdöas jajfkldasj fkldjas öfdjas", identity: "sasdasd" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("after dialog close", result);
    });
  }

  public lendClicked(nft: NFT): void {
    this.openLendingDialog(nft);
  }

  private openLendingDialog(nft: NFT): void {
    const dialogRef = this.dialogService.open(LendingDialogComponent, {
      width: '800px',
      data: nft,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("afterClose");
    });
  }
}
