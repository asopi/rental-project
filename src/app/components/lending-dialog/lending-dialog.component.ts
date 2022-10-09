import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lending-dialog',
  templateUrl: './lending-dialog.component.html',
  styleUrls: ['./lending-dialog.component.scss']
})
export class LendingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LendingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onCancle(): void {
    this.dialogRef.close();
  }

}
