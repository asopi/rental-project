import { RentalService } from 'src/app/services/rental.service';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lending-dialog',
  templateUrl: './lending-dialog.component.html',
  styleUrls: ['./lending-dialog.component.scss']
})
export class LendingDialogComponent {
  public lendingForm = new FormGroup({
    rentDuration: new FormControl('', [Validators.required]),
    pricePerLike: new FormControl('', [Validators.required]),
  });

  get rentDuration() {
    return this.lendingForm.get('rentDuration');
  }

  get pricePerLike() {
    return this.lendingForm.get('pricePerLike');
  }

  constructor(
    private readonly rentalService: RentalService,
    public dialogRef: MatDialogRef<LendingDialogComponent>,
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
      this.pricePerLike?.value != null
    ) {
      this.rentalService.lend(
        this.data.nftContract,
        this.data.nftId,
        Number(this.rentDuration.value),
        Number(this.pricePerLike.value)
      );
    }
  }
}
