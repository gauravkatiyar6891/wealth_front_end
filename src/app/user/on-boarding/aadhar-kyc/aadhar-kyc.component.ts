import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aadhar-kyc',
  templateUrl: './aadhar-kyc.component.html',
  styleUrls: ['./aadhar-kyc.component.scss']
})
export class AadharKycComponent implements OnInit {

  aadharFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<AadharKycComponent>,
  ) {
    this.aadharFormGroup = this.fb.group({
      aadharNo: [null, Validators.compose([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ])],
      mobileNo: [this.data, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ])]
    });
  }

  ngOnInit() {
  }

  aadharFormSubmit() {
    if (this.aadharFormGroup.valid) this.dialogRef.close(this.aadharFormGroup.value);
  }

  dismiss() {
    this.dialogRef.close();
  }

}
