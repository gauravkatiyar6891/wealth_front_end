import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { OnBoardingHelper } from '../on-boarding';
import { UserDetailsFormGroup } from './../FormModels';
import { UserDetails } from './../../../models/UserDetails';
import { EmandateService } from './../../../services/emandate.service';
import { FormSelectModel, OCCUPATION_LIST, ADDRESS_TYPE_LIST, INCOME_SLAB_LIST, PEP_LIST } from './../../../Data/onboarding';

@Component({
  selector: 'g4w-user-basic-details',
  templateUrl: './user-basic-details.component.html',
  styleUrls: ['./user-basic-details.component.scss']
})
export class UserBasicDetailsComponent implements OnInit, OnChanges {

  @Input('userData') userData: UserDetails;
  @Output('nextStep') nextStep = new EventEmitter<boolean>();

  userDetailsFormGroup: FormGroup;

  occupationList: FormSelectModel[];
  addressTypeList: FormSelectModel[];
  incomeSlabList: FormSelectModel[];
  pepList: FormSelectModel[];

  stateList: { stateName: string }[];
  cityList: { cityName: string }[];

  showProgressSpinner: boolean = false;

  kycDetailsSubmitted: boolean = false;
  basicDetailsSubmitted: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private eMandateService: EmandateService,
    private onBoardingHelper: OnBoardingHelper
  ) {
    this.userDetailsFormGroup = this.onBoardingHelper.getUserDetailFormStructure();
    this.occupationList = OCCUPATION_LIST;
    this.addressTypeList = ADDRESS_TYPE_LIST;
    this.incomeSlabList = INCOME_SLAB_LIST;
    this.pepList = PEP_LIST;
  }

  ngOnInit() {
    this.eMandateService.getStateList().subscribe(resp => {
      if (resp.status == 200) {
        this.stateList = resp.data;
        this.stateList.sort((a, b) => a.stateName.localeCompare(b.stateName));
      }
    });
    this.addAddressStateEventHandler();
  }

  ngOnChanges() {
    if (this.userData) this.userDetailsFormGroup = this.onBoardingHelper.setUserDetailsByGetUserDetails(this.userData, this.userDetailsFormGroup);
  }

  userDetailsFormSubmit() {
    if (this.userDetailsFormGroup.dirty) this.userDetailsSubmit();
    else this.nextStep.emit(true);
  }

  userDetailsSubmit() {
    this.kycDetailsSubmitted = false;
    this.basicDetailsSubmitted = false;
    this.showProgressSpinner = true;
    this.eMandateService.storeBasicDetails(this.onBoardingHelper.getUserBasicDetails(this.userDetailsFormGroup)).subscribe(res => {
      this.showProgressSpinner = false;
      if (res.data == "success") {
        if (this.kycDetailsSubmitted) {
          this.showProgressSpinner = false;
          this.nextStep.emit(true);
        }
        this.basicDetailsSubmitted = true;
      } else {
        this.snackBar.open(res.data, "", {
          duration: 5000
        });
      }
    });
    this.eMandateService.storeKycDetails(this.onBoardingHelper.getUserPersonalDetails(this.userDetailsFormGroup)).subscribe(res => {
      if (res.data == "success") {
        if (this.basicDetailsSubmitted) {
          this.showProgressSpinner = false;
          this.nextStep.emit(true);
        }
        this.kycDetailsSubmitted = true;
      }
    });
  }

  addAddressStateEventHandler() {
    this.userDetailsFormGroup.controls[UserDetailsFormGroup.STATE].valueChanges.subscribe(() => {
      this.eMandateService.getCityByState(this.userDetailsFormGroup.controls[UserDetailsFormGroup.STATE].value).subscribe(resp => {
        if (resp.status == 200) {
          this.cityList = resp.data;
          this.cityList.sort((a, b) => a.cityName.localeCompare(b.cityName));
        }
      });
    });
  }

}
