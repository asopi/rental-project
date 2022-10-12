import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { from, Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-renting-dialog',
  templateUrl: './renting-dialog.component.html',
  styleUrls: ['./renting-dialog.component.scss'],
})
export class RentingDialogComponent implements OnDestroy {
  public rentingForm = new FormGroup({
    rentDuration: new FormControl('', [Validators.required]),
    maxLikeCount: new FormControl('', [Validators.required]),
  });
  public rentLoading$ = this.rentalService.rentLoading$;
  public tokenApproved = false;
  public order!: Order;
  public maxRentPrice = 0;
  private approvalSubscription!: Subscription;
  private orderSubscription!: Subscription;
  private maxLikeCountSubscription!: Subscription;

  get rentDuration() {
    return this.rentingForm.get('rentDuration');
  }

  get maxLikeCount() {
    return this.rentingForm.get('maxLikeCount');
  }

  constructor(
    public rentalService: RentalService,
    public dialogRef: MatDialogRef<RentingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderSubscription = from(
      this.rentalService.getOrder(this.data.tokenAddress, this.data.tokenId)
    ).subscribe((response) => {
      this.order = response;
    });
    if (this.maxLikeCount != null) {
      this.maxLikeCountSubscription = this.maxLikeCount.valueChanges.subscribe(
        (value) => {
          this.maxRentPrice = Number(value) * this.order.countPrice;
          this.approvalSubscription = from(
            this.rentalService.isTokenApproved(this.maxRentPrice)
          ).subscribe((response) => {
            this.tokenApproved = response;
          });
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.orderSubscription?.unsubscribe;
    this.approvalSubscription?.unsubscribe();
    this.maxLikeCountSubscription?.unsubscribe();
  }

  public onCancle(): void {
    this.dialogRef.close();
  }

  public onApprove(): void {
    this.rentalService.approveToken(this.maxRentPrice).then(() => {
      this.tokenApproved = true;
    });
  }

  public onSubmit(): void {
    if (
      this.data.tokenAddress != null &&
      this.data.tokenId != null &&
      this.rentDuration?.value != null &&
      this.maxLikeCount?.value != null &&
      this.tokenApproved
    ) {
      this.rentalService.rent(
        this.data.tokenAddress,
        this.data.tokenId,
        Number(this.rentDuration.value),
        Number(this.maxLikeCount.value)
      );
    }
  }
}
