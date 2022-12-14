import { DateUtil } from './../../utils/date.util';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { from, Subscription } from 'rxjs';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-lending-dialog',
  templateUrl: './lending-dialog.component.html',
  styleUrls: ['./lending-dialog.component.scss'],
})
export class LendingDialogComponent implements OnDestroy {
  public minDate = new Date();
  public lendingForm = new FormGroup({
    rentDate: new FormControl('', [Validators.required]),
    pricePerLike: new FormControl('', [Validators.required]),
  });
  public nftApproved = false;
  private approvalSubscription!: Subscription;

  get rentDate() {
    return this.lendingForm.get('rentDate');
  }

  get pricePerLike() {
    return this.lendingForm.get('pricePerLike');
  }

  constructor(
    private readonly rentalService: RentalService,
    public dialogRef: MatDialogRef<LendingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.approvalSubscription = from(
      this.rentalService.isNftApproved(
        this.data.tokenAddress,
        this.data.tokenId
      )
    ).subscribe((response) => {
      this.nftApproved = response;
    });
  }

  ngOnDestroy(): void {
    this.approvalSubscription.unsubscribe();
  }

  public onApprove(): void {
    this.rentalService
      .approveNft(this.data.tokenAddress, this.data.tokenId)
      .then(() => {
        this.nftApproved = true;
      });
  }

  public onSubmit(): void {
    if (
      this.data.tokenAddress != null &&
      this.data.tokenId != null &&
      this.rentDate?.value != null &&
      this.pricePerLike?.value != null &&
      this.nftApproved
    ) {
      this.rentalService
        .lend(
          this.data.tokenAddress,
          this.data.tokenId,
          DateUtil.getDays(
            this.minDate,
            new Date(Date.parse(this.rentDate.value))
          ),
          Number(this.pricePerLike.value)
        )
        .finally(() => this.dialogRef.close());
    }
  }
}
