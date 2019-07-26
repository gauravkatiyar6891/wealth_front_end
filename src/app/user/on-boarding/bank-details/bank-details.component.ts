import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { OnBoardingHelper } from '../on-boarding';
import { BankDetailsFormGroup } from './../FormModels';
import { UserDetails } from './../../../models/UserDetails';
import { UserService } from './../../../services/user.service';
import { EmandateService } from './../../../services/emandate.service';
import { FormSelectModel, BANK_ACCOUNT_TYPE, NOMINEE_RELATIONS } from './../../../Data/onboarding';

@Component({
  selector: 'g4w-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit, OnChanges {

  @Input('userData') userData: UserDetails;
  @Output('nextStep') nextStep = new EventEmitter<boolean>();
  @Output('isipAllowedStatus') isipAllowedStatus = new EventEmitter<boolean>();

  showProgressSpinner: boolean = false;
  checkingIfsc: boolean = false;

  bankDetailsFormGroup: FormGroup;

  bankAccountType: FormSelectModel[];
  nomineeRelations: FormSelectModel[];

  constructor(
    private userService: UserService,
    private eMandateService: EmandateService,
    private onBoardingHelper: OnBoardingHelper
  ) {
    this.bankDetailsFormGroup = this.onBoardingHelper.getBankDetailFormStructure();
    this.bankAccountType = BANK_ACCOUNT_TYPE;
    this.nomineeRelations = NOMINEE_RELATIONS;
  }

  ngOnInit() {
    this.addIFSCCodeEventHandler();
  }

  ngOnChanges() {
    if (this.userData) {
      this.bankDetailsFormGroup = this.onBoardingHelper.setBankDetailsByGetUserDetails(this.userData, this.bankDetailsFormGroup);
    }
  }

  bankDetailsFormSubmit() {
    if (this.bankDetailsFormGroup.dirty) this.bankDetailsSubmit();
    else this.nextStep.emit(true);
  }

  bankDetailsSubmit() {
    this.showProgressSpinner = true;
    this.eMandateService.storeBankDetails(this.onBoardingHelper.getBankDetails(this.bankDetailsFormGroup)).subscribe(res => {
      this.showProgressSpinner = false;
      if (res.data == "success") {
        this.nextStep.emit(true);
      } else {
        alert("Something Went Wrong");
      }
    });
  }

  addIFSCCodeEventHandler() {
    this.bankDetailsFormGroup.controls[BankDetailsFormGroup.IFSC_CODE].valueChanges.subscribe(() => {
      if (this.bankDetailsFormGroup.controls[BankDetailsFormGroup.IFSC_CODE].valid) {
        this.checkingIfsc = true;
        this.eMandateService.verifyIfsc(this.onBoardingHelper.getFormControlValue(this.bankDetailsFormGroup, BankDetailsFormGroup.IFSC_CODE)).subscribe(res => {
          if (res.data.message == "success") {
            this.bankDetailsFormGroup = this.onBoardingHelper.setBankDetailsByIFSCCode(
              this.bankDetailsFormGroup,
              res.data.bankName,
              res.data.micrCode,
              res.data.bankBranch,
              res.data.bankAddress,
            );
            this.isipAllowedStatus.emit(res.data.isipAllowedStatus == "true" ? true : false);
          }
          this.checkingIfsc = false;
        });
      }
    });
  }

}
