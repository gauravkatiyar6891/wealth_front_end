import { MatDialog } from '@angular/material';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { PanFormGroup } from './../FormModels';
import { Aadhar } from './../../../models/Aadhar';
import { OnBoardingHelper } from '../on-boarding';
import { UserDetails } from './../../../models/UserDetails';
import { UserService } from './../../../services/user.service';
import { GlobalUtility } from './../../../shared/global-utility';
import { DialogService } from './../../../services/dialog.service';
import { EmandateService } from './../../../services/emandate.service';
import { AadharKycComponent } from '../aadhar-kyc/aadhar-kyc.component';

@Component({
  selector: 'g4w-pan-verify',
  templateUrl: './pan-verify.component.html',
  styleUrls: ['./pan-verify.component.scss']
})
export class PanVerifyComponent implements OnInit, OnChanges {

  @Input('userData') userData: UserDetails;
  @Output('panNo') panNo = new EventEmitter<string>();
  @Output('nameFromPan') nameFromPan = new EventEmitter<string>();
  @Output('panVerified') panVerified = new EventEmitter<boolean>();
  @Output('documentsReq') documentsReq = new EventEmitter<boolean>();
  @Output('secondStepMove') secondStepMove = new EventEmitter<boolean>();

  panFormGroup: FormGroup;

  showProgressSpinner: boolean = false;
  panErrorMessage: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userService: UserService,
    private globalUtility: GlobalUtility,
    private dialogService: DialogService,
    private eMandateService: EmandateService,
    private onBoardingHelper: OnBoardingHelper
  ) {
    this.panFormGroup = this.onBoardingHelper.getPanFormStructure();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['Response'] && params['Response'] != '') {
        this.updateeKYCStatus(params['Response']);
        this.router.navigate(['/user/onboarding']);
        if (params['Response'] == 'Success') this.dialogService.displayMessage('eKYC has been successfully completed', true, () => {
          this.secondStepMove.emit(true);
        });
        else if (params['Response'] == 'Failure') this.dialogService.displayMessage('Failed to verify eKYC', false);
      }
    });
  }

  ngOnChanges() {
    if (this.userData) {
      if (this.userData.panNumber) {
        this.panFormGroup.controls[PanFormGroup.PAN].setValue(this.userData.panNumber);
        if (this.userData.panVerified) this.secondStepMove.emit(true);
        else this.setPanValidator();
      }
    }
  }

  aadharDialogRespHandler(resp) {
    if (resp) {
      this.globalUtility.displayLoader();
      this.verifyAadhar(resp.aadharNo, resp.mobileNo);
      this.eMandateService.verifyKycReliance({
        aadharNo: resp.aadharNo,
        email: this.userData.email,
        invName: this.userData.fullName,
        mobileNo: resp.mobileNo,
        panNo: this.panFormGroup.controls[PanFormGroup.PAN].value
      }).subscribe(resp => {
        this.globalUtility.displayLoader(false);
        location.href = resp.RequiredUrl;
      })
    }
  }

  panButtonSubmit() {
    switch (this.panFormGroup.controls[PanFormGroup.PAN_NOT_VERIFIED_RADIO].value) {
      case '-1':
        this.panCardVerify();
        break;
      case '0':
        this.dialog.open(AadharKycComponent, {
          panelClass: 'add-to-folio-cont',
          data: this.userData.mobile
        }).afterClosed().subscribe(this.aadharDialogRespHandler.bind(this));
        break;
      case '1':
        this.documentsReq.emit(true);
        break;
    }
  }

  panCardVerify() {
    this.showProgressSpinner = true;
    this.panErrorMessage = '';
    this.eMandateService.verifyPanNumber(this.onBoardingHelper.getFormControlValue(this.panFormGroup, PanFormGroup.PAN)).subscribe(res => {
      this.showProgressSpinner = false;
      if (res.data == "verified") {
        this.updateeKYCStatus("Success");
        this.panVerified.emit(true);
        this.panNo.emit(this.onBoardingHelper.getFormControlValue(this.panFormGroup, PanFormGroup.PAN));
        this.verifyAadhar(this.userData.addressProof.addressProofNo, this.userData.addressProof.mobileWithAadhaar);
        this.secondStepMove.emit(true);
      } else if (res.data == "not-verified") {
        this.panNo.emit(this.onBoardingHelper.getFormControlValue(this.panFormGroup, PanFormGroup.PAN));
        this.verifyAadhar(this.userData.addressProof.addressProofNo, this.userData.addressProof.mobileWithAadhaar);
        this.panErrorMessage = 'Kyc for Mutual Fund Investment is not registered for this PAN card. If this PAN is correct, please confirm and provide address proof in subsequent steps or else, please provide correct PAN.';
        this.panVerified.emit(false);
      } else if (res.data == '' && res.message == 'Partial Success') {
        this.panNo.emit(this.onBoardingHelper.getFormControlValue(this.panFormGroup, PanFormGroup.PAN));
        this.verifyAadhar(this.userData.addressProof.addressProofNo, this.userData.addressProof.mobileWithAadhaar);
        this.panErrorMessage = 'It seems that our PAN verification API is not working. Please try after sometime or you can manually proceed with onboarding process.';
        this.panVerified.emit(false);
      }
      else this.panErrorMessage = res.data;
    });
  }

  setPanValidator(radio: boolean = true) {
    if (radio) {
      this.panFormGroup.controls[PanFormGroup.PAN_NOT_VERIFIED_RADIO].setValue(null);
      this.panFormGroup.controls[PanFormGroup.PAN_NOT_VERIFIED_RADIO].setValidators(Validators.required);
      this.panFormGroup.controls[PanFormGroup.PAN_NOT_VERIFIED_RADIO].updateValueAndValidity();
    }
    else {
      this.panFormGroup.controls[PanFormGroup.PAN_NOT_VERIFIED_RADIO].clearValidators();
      this.panFormGroup.controls[PanFormGroup.PAN_NOT_VERIFIED_RADIO].updateValueAndValidity();
    }
  }

  updateeKYCStatus(karvyResponse: string) {
    this.userService.updateEkycStatus(karvyResponse).subscribe();
  }

  verifyAadhar(aadharNo: string, mobileWithAadhaar: string) {
    let aadhar: Aadhar = {
      addressProofName: "adharcard",
      addressProofNo: aadharNo,
      mobileWithAadhaar: mobileWithAadhaar
    }
    this.eMandateService.verifyAadhaarNumber(aadhar).subscribe();
  }

}
