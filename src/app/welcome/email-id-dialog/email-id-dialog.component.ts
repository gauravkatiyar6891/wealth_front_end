import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-email-id-dialog',
  templateUrl: './email-id-dialog.component.html',
  styleUrls: ['./email-id-dialog.component.scss']
})
export class EmailIdDialogComponent implements OnInit {

  emailId: FormControl;

  constructor(public dialogRef: MatDialogRef<EmailIdDialogComponent>) {
    this.emailId = new FormControl('', Validators.compose([
      Validators.required,
      Validators.email
    ]));
  }

  dismiss() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  submit() {
    if (this.emailId.valid) {
      this.dialogRef.close(this.emailId.value);
    }
  }

}