import { FormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { OnBoardingHelper } from '../on-boarding';
import { UserDetails } from './../../../models/UserDetails';
import { UserService } from './../../../services/user.service';
import { MobileFormGroup, EmailFormGroup } from '../FormModels';

@Component({
  selector: 'g4w-mobile-email-verify',
  templateUrl: './mobile-email-verify.component.html',
  styleUrls: ['./mobile-email-verify.component.scss']
})
export class MobileEmailVerifyComponent implements OnInit, OnChanges {

  @Input('userData') userData: UserDetails;
  @Output('firstStepMove') firstStepMove = new EventEmitter<boolean>();
  @Output('mobileVerified') mobileVerified = new EventEmitter<boolean>();
  @Output('emailVerified') emailVerified = new EventEmitter<boolean>();

  emailFormGroup: FormGroup;
  mobileFormGroup: FormGroup;

  resendOtpButtonEnableTimer: number = 15;
  invalidOtpMessage: boolean = false;
  otpSentMessage: boolean = false;
  sendingOtpMessage: boolean = false;
  otpTimer: any;
  sendOtpExecuted: boolean = false;
  verifyingMobileOTP: boolean = false;

  isVerificationEmailSent: boolean = false;
  sendingEmailVerification: boolean = false;
  checkingEmailVerify: boolean = false;
  isMobileNoVerified: boolean = false;
  isEmailIdVerified: boolean = false;

  emailVerifySubscription: Subscription;
  emailVerifyServiceCallSubscription: Subscription;

  constructor(
    private userService: UserService,
    private onBoardingHelper: OnBoardingHelper
  ) {
    this.emailFormGroup = this.onBoardingHelper.getEmailFormStructure();
    this.mobileFormGroup = this.onBoardingHelper.getMobileFormStructure();
  }

  ngOnInit() {
    this.mobileFormGroup.controls[MobileFormGroup.OTP].disable();
  }

  ngOnChanges() {
    if (this.userData) {
      this.emailFormGroup.controls[EmailFormGroup.EMAIL_ID].setValue(this.userData.email);
      this.isEmailIdVerified = this.userData.emailVerified;
      this.isMobileNoVerified = this.userData.mobileVerified;
      this.mobileFormGroup.controls[MobileFormGroup.MOBILE_NO].setValue(this.userData.mobile);
      if (this.userData.mobileVerified && this.userData.emailVerified) this.firstStepMove.emit(true);
    }
  }

  sendMobileVerifyOTP() {
    this.sendingOtpMessage = true;
    this.sendOtpExecuted = true;
    this.otpSentMessage = false;
    this.invalidOtpMessage = false;
    this.resendOtpButtonEnableTimer = 15;
    this.userService.verifyMobile(this.mobileFormGroup.controls[MobileFormGroup.MOBILE_NO].value).subscribe(resp => {
      if (resp.status == 200) {
        this.sendingOtpMessage = false;
        this.otpSentMessage = true;
        this.mobileFormGroup.controls[MobileFormGroup.OTP].enable();
        this.otpTimer = this.monitorResendOtpTimer();
      }
    });
  }

  emailIdVerify() {
    this.sendingEmailVerification = true;
    this.userService.verifyEmail({ email: this.onBoardingHelper.getFormControlValue(this.emailFormGroup, EmailFormGroup.EMAIL_ID) }).subscribe(res => {
      this.isVerificationEmailSent = true;
      this.emailFormGroup.controls['email'].disable();
      this.sendingEmailVerification = false;
      this.checkForEmailVerify();
    });
  }

  checkForEmailVerify() {
    this.checkingEmailVerify = true;
    this.emailVerifySubscription = interval(10000).subscribe(() => {
      if (this.emailVerifyServiceCallSubscription) this.emailVerifyServiceCallSubscription.unsubscribe();
      this.emailVerifyServiceCallSubscription = this.userService.checkEmailVerified().subscribe(resp => {
        if (resp.data) {
          this.checkingEmailVerify = false;
          this.emailVerified.emit(true);
          this.isEmailIdVerified = true;
          if (this.isMobileNoVerified) this.firstStepControlMover();
          this.emailVerifySubscription.unsubscribe();
        }
      });
    });
  }

  submitMobileVerfiyOTP() {
    this.verifyingMobileOTP = true;
    let model = {
      otp: this.onBoardingHelper.getFormControlValue(this.mobileFormGroup, MobileFormGroup.OTP),
      mobileNumber: this.onBoardingHelper.getFormControlValue(this.mobileFormGroup, MobileFormGroup.MOBILE_NO)
    }
    this.mobileFormGroup.controls[MobileFormGroup.OTP].disable();
    this.invalidOtpMessage = false;
    this.otpSentMessage = false;
    this.userService.verifyUser(model).subscribe(resp => {
      this.verifyingMobileOTP = false;
      if (resp.message == "Success") {
        this.mobileVerified.emit(true);
        this.isMobileNoVerified = true;
        if (this.isEmailIdVerified) this.firstStepControlMover();
        clearInterval(this.otpTimer);
      }
      else {
        this.mobileFormGroup.controls[MobileFormGroup.OTP].enable();
        this.invalidOtpMessage = true;
      }
    });
  }

  firstStepControlMover() {
    this.firstStepMove.emit(true);
  }

  monitorResendOtpTimer() {
    return setInterval(() => {
      this.resendOtpButtonEnableTimer--;
      if (this.resendOtpButtonEnableTimer == 0) clearInterval(this.otpTimer);
    }, 1000);
  }

}
