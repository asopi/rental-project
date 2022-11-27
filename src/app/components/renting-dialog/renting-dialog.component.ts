import { DateUtil } from './../../utils/date.util';
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
  public minDate = new Date();
  public maxDate = new Date();
  public rentingForm = new FormGroup({
    rentDate: new FormControl('', [Validators.required]),
    maxLikeCount: new FormControl('', [Validators.required]),
  });

  public tokenApproved = false;
  public order!: Order;
  public maxRentPrice = 0;
  public maxCount = 0;
  private approvalSubscription!: Subscription;
  private orderSubscription!: Subscription;
  private maxLikeCountSubscription!: Subscription;

  get rentDate() {
    return this.rentingForm.get('rentDate');
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
      this.rentalService.getOrder(this.data)
    ).subscribe((response) => {
      this.order = response;
      this.maxDate.setDate(this.maxDate.getDate() + this.order.duration);
    });
    if (this.maxLikeCount != null) {
      this.maxLikeCountSubscription = this.maxLikeCount.valueChanges.subscribe(
        (value) => {
          this.maxCount = Number(value);
          this.maxRentPrice = this.maxCount * this.order.countPrice;
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

  public onApprove(): void {
    this.rentalService.approveToken(this.maxRentPrice).then(() => {
      this.tokenApproved = true;
    });
  }

  public onSubmit(): void {
    if (
      this.data.tokenAddress != null &&
      this.data.tokenId != null &&
      this.rentDate?.value != null &&
      this.maxLikeCount?.value != null &&
      this.tokenApproved
    ) {
      this.rentalService
        .rent(
          this.data.tokenAddress,
          this.data.tokenId,
          DateUtil.getDays(
            this.minDate,
            new Date(Date.parse(this.rentDate.value))
          ),
          Number(this.maxLikeCount.value)
        )
        .finally(() => this.dialogRef.close());
    }
  }
}
