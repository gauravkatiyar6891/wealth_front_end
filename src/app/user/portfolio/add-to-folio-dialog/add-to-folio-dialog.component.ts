import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AddToFolioData, AddToFolioRequest } from './../../../models/portfolio';
import { MessageDialogComponent } from './../../../messages/message-dialog/message-dialog.component';

@Component({
  selector: 'add-to-folio-dialog',
  templateUrl: './add-to-folio-dialog.component.html',
  styleUrls: ['./add-to-folio-dialog.component.scss']
})
export class AddToFolioDialogComponent implements OnInit {

  orderForm: FormGroup;
  investmentType: string = 'SIP';

  constructor(
    private messageDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddToFolioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataIn: AddToFolioData
  ) {
    let nextSipDate = (new Date()).getDate();
    for (let d of dataIn.availSipDates) {
      if (nextSipDate - Number(d) < 0) {
        nextSipDate = Number(d);
        break;
      }
    }
    this.orderForm = this._formBuilder.group({
      amount: [dataIn.minSipAmount, Validators.compose([
        Validators.required,
        Validators.min(this.dataIn.minSipAmount)
      ])],
      sipDate: [this.dateSuffix(nextSipDate)],
      paymentType: ['Natch'],
      folioType: ['1', Validators.required]
    });
    this.orderForm.controls['folioType'].valueChanges.subscribe(this.setMinMaxValidators.bind(this));
  }

  ngOnInit() { }

  formSubmit() {
    let addtoFolioReq: AddToFolioRequest = {
      amount: this.orderForm.value.amount,
      investmentType: this.investmentType,
      folioNo: this.dataIn.folioNo,
      dayOfSip: this.orderForm.value.sipDate,
      goalId: null,
      goalName: null,
      paymentOptions: this.orderForm.value.paymentType,
      schemeCode: this.dataIn.schemeCode,
      transferInId: this.dataIn.transferInId
    }
    this.dialogRef.close({
      type: this.investmentType,
      addToFolioReq: addtoFolioReq
    });
  }

  setMinMaxValidators() {
    let folioType = this.orderForm.controls['folioType'].value;
    if (folioType == '0') {
      this.orderForm.controls['amount'].setValidators(Validators.compose([
        Validators.required,
        Validators.max(this.dataIn.maxSipAmount),
        Validators.min(this.investmentType == 'SIP' ? this.dataIn.minSipAmount : this.dataIn.minLumpSumAmount)
      ]));
    } else {
      this.orderForm.controls['amount'].setValidators(Validators.compose([
        Validators.required,
        Validators.max(this.dataIn.maxLumpsumAmount),
        Validators.min(this.investmentType == 'SIP' ? this.dataIn.minSipAmount : this.dataIn.minAdditionalAmount)
      ]));
    }
    this.orderForm.controls['amount'].updateValueAndValidity();
  }

  openMessageDialog(message, success, failure) {
    this.messageDialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    });
  }

  getMinAmountRequired() {
    if (this.investmentType == 'SIP') return this.dataIn.minSipAmount;
    else {
      if (this.orderForm.value.folioType == '1') return this.dataIn.minAdditionalAmount;
      else return this.dataIn.minLumpSumAmount;
    }
  }

  getMaxAmountRequired() {
    if (this.investmentType == 'SIP') return this.dataIn.maxSipAmount;
    else return this.dataIn.maxLumpsumAmount;
  }

  dateSuffix(date): string {
    if (date % 100 == 11 || date % 100 == 12 || date % 100 == 13) {
      return date + 'th';
    } if (date % 10 == 1) {
      return date + "st";
    } else if (date % 10 == 2) {
      return date + "nd";
    } else if (date % 10 == 3) {
      return date + "rd";
    } else {
      return date + "th";
    }
  }

}