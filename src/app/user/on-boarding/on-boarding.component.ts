import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { UserDetails } from './../../models/UserDetails';
import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from './../../../environments/environment';

import { OnBoardingHelper } from './on-boarding';
import { UserService } from '../../services/user.service';
import { GlobalUtility } from './../../shared/global-utility';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss'],
  providers: [OnBoardingHelper]
})
export class OnBoardingComponent implements OnInit {

  userData: UserDetails;
  @ViewChild('stepper') onBoardingStepper: MatStepper;

  needAddressProof: boolean = false;

  private showProgressSpinner: boolean = false;

  onBoardingCompletedMessage: boolean = false;

  public gettingUserDetailsOnPageLoad: boolean = true;

  public isipAllowedStatus: boolean = true;
  private firstStepControlFormGroup: FormGroup;
  private secondStepControlFormGroup: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private globalUtility: GlobalUtility,
    private onBoardingHelper: OnBoardingHelper
  ) {
    this.firstStepControlFormGroup = this.onBoardingHelper.getStepControlFormStrucure();
    this.secondStepControlFormGroup = this.onBoardingHelper.getStepControlFormStrucure();
  }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
    this.getUserDetails();
    // this.onBoardingStepper.selectionChange.subscribe(() => {
    //   this.uploadDocumentErrorMessage = "";
    // });
  }

  getUserDetails() {
    this.userService.getUserDetails(true).subscribe(resp => {
      if (resp.data.message == "success") {
        this.userData = resp.data;
        this.gettingUserDetailsOnPageLoad = false;
        if (environment.production && resp.data.userOverallStatus && resp.data.panVerified) this.router.navigate(['user/dashboard']);
      }
    });
  }


  validateFirstStepControlFormGroup() {
    this.firstStepControlFormGroup.controls['stepCheck'].setValue(true);
  }

  validateSecondStepControlFormGroup() {
    this.secondStepControlFormGroup.controls['stepCheck'].setValue(true);
  }

  gotoNextStep(fromPan = false) {
    if (fromPan) {
      this.secondStepControlMover();
    } else this.onBoardingStepper.next();
  }

  gotoStep3() {
    this.onBoardingStepper.selectedIndex = 2;
    this.globalUtility.scrollAnimateTo(0);
  }

  firstStepControlMover() {
    this.validateFirstStepControlFormGroup();
    this.onBoardingStepper.next();
  }

  secondStepControlMover() {
    this.validateSecondStepControlFormGroup();
    this.onBoardingStepper.next();
  }

  setDocumentRequest() {
    this.needAddressProof = true;
    this.secondStepControlMover();
  }

  onBoardingSuccessMessage() {
    console.log('Success');
    this.onBoardingCompletedMessage = true;
  }

}


// stop loader on upload documents when error response is received
//show error Message

//{"status":"200","message":"Success","totalRecords":null,"data":"FAILED: E-MANDATE NOT PERMITTED FOR THIS BANK"}