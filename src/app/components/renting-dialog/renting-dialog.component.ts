import { RentalService } from 'src/app/services/rental.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-renting-dialog',
  templateUrl: './renting-dialog.component.html',
  styleUrls: ['./renting-dialog.component.scss']
})
export class RentingDialogComponent {
  public rentingForm = new FormGroup({
    rentDuration: new FormControl('', [Validators.required]),
    maxLikeCount: new FormControl('', [Validators.required]),
  });

  get rentDuration() {
    return this.rentingForm.get('rentDuration');
  }

  get maxLikeCount() {
    return this.rentingForm.get('maxLikeCount');
  }

  constructor(
    public rentalService: RentalService,
    public dialogRef: MatDialogRef<RentingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onCancle(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (
      this.data.nftContract != null &&
      this.data.nftId != null &&
      this.rentDuration?.value != null &&
      this.maxLikeCount?.value != null
    ) {
      this.rentalService.rent(
        this.data.nftContract,
        this.data.nftId,
        Number(this.rentDuration.value),
        Number(this.maxLikeCount.value),
      );
    }
  }
}
