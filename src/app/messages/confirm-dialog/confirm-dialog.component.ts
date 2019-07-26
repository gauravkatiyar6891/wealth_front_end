import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  dialogData: ConfirmDialogData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData, private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    this.dialogData = data;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  continue() {
    this.dialogRef.close(true);
  }

  ngOnInit() {
  }

}

export interface ConfirmDialogData {
  message: string,
  cancelButtonName: string,
  confirmButtonName: string
}