import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styleUrls: ['./redeem.component.scss']
})
export class RedeemComponent implements OnInit {

  redeemFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RedeemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RedeemDialogData
  ) {
    if (data.minRedeemAmount == 0) data.minRedeemAmount = 1;
    this.redeemFormGroup = this._formBuilder.group({
      amount: [data.minRedeemAmount, Validators.compose([
        Validators.required,
        Validators.max(data.totalAmount),
        Validators.min(data.minRedeemAmount)
      ])],
      fullAmountCheckBox: [false]
    });
    this.redeemFormGroup.controls['amount'].updateValueAndValidity();

    this.redeemFormGroup.controls['fullAmountCheckBox'].valueChanges.subscribe(flag => {
      if (flag) {
        this.redeemFormGroup.controls['amount'].clearValidators();
        this.redeemFormGroup.controls['amount'].disable();
        this.redeemFormGroup.controls['amount'].setValue(null);
      }
      else {
        this.redeemFormGroup.controls['amount'].setValidators(Validators.compose([
          Validators.required,
          Validators.max(data.totalAmount),
          Validators.min(data.minRedeemAmount)
        ]));
        this.redeemFormGroup.controls['amount'].setValue(data.minRedeemAmount);
        this.redeemFormGroup.controls['amount'].enable();
      }
      this.redeemFormGroup.controls['amount'].updateValueAndValidity();
    });
  }

  ngOnInit() { }

  redeemFormSubmit() {
    this.dialogRef.close(this.redeemFormGroup);
  }

}

export interface RedeemDialogData {
  schemeName: string,
  minRedeemAmount: number,
  totalAmount: number
}