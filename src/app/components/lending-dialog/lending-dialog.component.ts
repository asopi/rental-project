import { RentalService } from 'src/app/services/rental.service';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-lending-dialog',
  templateUrl: './lending-dialog.component.html',
  styleUrls: ['./lending-dialog.component.scss']
})
export class LendingDialogComponent implements OnDestroy {
  public lendingForm = new FormGroup({
    rentDuration: new FormControl('', [Validators.required]),
    pricePerLike: new FormControl('', [Validators.required]),
  });
  private approvalSubscription!: Subscription;

  get rentDuration() {
    return this.lendingForm.get('rentDuration');
  }

  get pricePerLike() {
    return this.lendingForm.get('pricePerLike');
  }

  public nftApproved = false;

  constructor(
    private readonly rentalService: RentalService,
    public dialogRef: MatDialogRef<LendingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.approvalSubscription = from(this.rentalService.isApproved(this.data.tokenAddress, this.data.tokenId)).subscribe(response => {
      this.nftApproved = response;
    });
  }

  ngOnDestroy(): void {
    this.approvalSubscription.unsubscribe();
  }

  onApprove(): void {
    this.rentalService.approveNft(this.data.tokenAddress, this.data.tokenId).then(response => {
      this.nftApproved = true;
    });
  }

  onCancle(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (
      this.data.tokenAddress != null &&
      this.data.tokenId != null &&
      this.rentDuration?.value != null &&
      this.pricePerLike?.value != null &&
      this.nftApproved
    ) {
      this.rentalService.lend(
        this.data.tokenAddress,
        this.data.tokenId,
        Number(this.rentDuration.value),
        Number(this.pricePerLike.value)
      );
    }
  }
}
