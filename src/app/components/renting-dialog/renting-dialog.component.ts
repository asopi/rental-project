
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-renting-dialog',
  templateUrl: './renting-dialog.component.html',
  styleUrls: ['./renting-dialog.component.scss']
})
export class RentingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RentingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onCancle(): void {
    this.dialogRef.close();
  }
}
