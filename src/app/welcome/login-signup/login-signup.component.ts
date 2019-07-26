import { LoginSignUp } from "./login-signup";
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ErrorResponse } from '../../Data/error-response';
import { FormGroup, AbstractControl } from "@angular/forms";
import { GlobalUtility } from './../../shared/global-utility';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
  providers: [LoginSignUp]
})
export class LoginSignupComponent implements OnInit {


  loginForm: FormGroup;
  registerForm: FormGroup;
  otpForm: FormGroup;
  newPasswordForm: FormGroup;

  showOtpForm: boolean = false;
  showNewPasswordForm: boolean = false;
  showForgetPasswordForm: boolean = false;
  showProgressSpinner: boolean = false;
  passwordResetSuccess: boolean = false;

  loginErrorMessage: string = "";
  registerErrorMessage: string = "";
  otpMessage: string = "";
  otpErrorMessage: string = "";
  resendOtpButtonEnableTimer: number = 15;
  otpTimer: any;

  randomImageNumber: number = 1;

  mobileNumber: number = null;
  emailId: string = null;
  password: string = null;

  constructor(
    private userService: UserService,
    private loginFormHelper: LoginSignUp,
    private globalUtility: GlobalUtility,
    private myAccountDialog: MatDialogRef<LoginSignupComponent>
  ) {
    this.randomImageNumber = Math.trunc((Math.random() * 10) % 4) + 1;

    this.loginForm = this.loginFormHelper.getLoginFormGroup();
    this.registerForm = this.loginFormHelper.getRegisterFormGroup();
    this.otpForm = this.loginFormHelper.getOTPFormGroup();
    this.newPasswordForm = this.loginFormHelper.getNewPasswordFormGroup();
  }

  ngOnInit() { }

  logIn() {
    this.loginErrorMessage = "";
    this.disableFields();
    this.userService.isUserExist(this.loginForm.controls['mobileNo'].value).subscribe(resp => {
      if (resp.data == true) {
        this.userService.login(this.loginFormHelper.getLoginModel(this.loginForm.controls['mobileNo'].value, this.loginForm.controls['password'].value)).subscribe((response) => {
          this.disableFields(false);
          this.closeDialog();
        }, error => {
          if (error.status == 401) this.loginErrorMessage = ErrorResponse.INVALID_CREDENTIAL;
          else if (error.status == 500) this.loginErrorMessage = ErrorResponse.INTERNAL_SERVER_ERROR;
          else if (error.status == 504) this.loginErrorMessage = ErrorResponse.INTERNAL_SERVER_ERROR;
          this.disableFields(false, 'password');
        });
      } else if (resp.data == false) {
        this.loginErrorMessage = ErrorResponse.USER_NOT_REGISTER_WITH_MOBILE;
        this.disableFields(false, 'mobileNo');
      }
    });
  }

  forgetPassword() {
    this.showForgetPasswordForm = true;
    this.loginErrorMessage = "";
    this.loginForm.controls['password'].disable();
  }

  goBackToLogin() {
    this.showForgetPasswordForm = false;
    this.loginErrorMessage = "";
    this.loginForm.controls['password'].enable();
  }

  forgetPasswordMobileNoVerify() {
    this.disableFields();
    this.mobileNumber = this.loginForm.controls['mobileNo'].value;
    this.userService.getForgetPasswordVerifyUser(this.mobileNumber).subscribe(response => {
      if (response.status === '503') {
        if (response.message == 'User Does Not Exist!') this.loginErrorMessage = "Mobile No. Not Registered";
        else this.loginErrorMessage = response.message;
      }
      if (response.status === '500') this.loginErrorMessage = ErrorResponse.INTERNAL_SERVER_ERROR;
      if (response.status === '200') {    //All Ok
        this.showOtpForm = true;
        this.otpMessage = "OTP Sent To Your Mobile";
        this.otpTimer = this.monitorResendOtpTimer();
      }
      this.disableFields(false);
    }, error => {
      this.disableFields(false);
      console.log(error);
      if (error.status === 403) this.loginErrorMessage = ErrorResponse.UNAUTHORIZED;
    });
  }

  forgetPasswordOtpVerify() {
    this.otpMessage = "";
    this.disableFields();
    this.userService.getForgetPasswordVerifyOtp(this.loginFormHelper.getOtpModel(this.mobileNumber, this.otpForm.controls['otp'].value)).subscribe(resp => {
      if (resp.data == ErrorResponse.INVALID_OTP || resp.message == ErrorResponse.OTP_EXPIRED) {
        this.otpErrorMessage = "Invalid OTP";
        this.otpForm.controls['otp'].setValue(null);
      } else {
        this.showOtpForm = false;
        this.showNewPasswordForm = true;
      }
      this.disableFields(false);
    }, error => {
      this.disableFields(false);
    });
  }

  forgetPasswordOtpResend() {
    this.otpMessage = "Sending OTP...";
    this.otpErrorMessage = "";
    this.resendOtpButtonEnableTimer = 15;
    this.userService.resendOtp(this.mobileNumber, "", "forgot").subscribe((res) => {
      if (res.message == "Success") {
        this.otpMessage = "OTP Sent!";
        this.otpTimer = this.monitorResendOtpTimer();
      } else {
        this.otpMessage = "";
        this.otpErrorMessage = "Error Sending OTP";
      }
    });
  }

  setNewPassword() {
    this.disableFields();
    this.password = this.newPasswordForm.controls['password'].value;
    this.userService.forgetPassword(this.loginFormHelper.getNewPasswordModel(this.mobileNumber, this.password)).subscribe(response => {
      if (response.message === 'Success') {
        this.passwordResetSuccess = true;
        this.globalUtility.forgetPasswordToken = null;
        this.userService.login(this.loginFormHelper.getLoginModel(this.mobileNumber, this.password)).subscribe(resp => {
          this.disableFields(false);
          this.closeDialog();
        }, err => console.log("Error : ", err));
      }
    }, error => {
      console.log(error);
      this.disableFields(false);
    });
  }

  register() {
    this.disableFields();
    let regFormModel = this.loginFormHelper.getRegisterFormModel(this.registerForm);
    this.emailId = regFormModel.email;
    this.mobileNumber = regFormModel.mobileNumber;
    this.password = regFormModel.password;
    this.userService.signupByMobile(regFormModel).subscribe((res) => {
      if (res.message == "Success") {
        this.showOtpForm = true;
        this.otpTimer = this.monitorResendOtpTimer();
      }
      this.registerErrorMessage = this.loginFormHelper.registerResponseHandler(res);
      this.disableFields(false);
    });
  }

  registerUserOtpVerify() {
    this.disableFields();
    this.otpErrorMessage = "";
    this.userService.verifyUser(this.loginFormHelper.getOtpModel(this.mobileNumber, this.otpForm.controls['otp'].value)).subscribe((res) => {
      if (res.data == "Mobile number verified successfully.") {
        this.otpErrorMessage = "";
        this.otpMessage = "OTP Successfully Verified. Please wait while we redirect you...";
        this.userService.login(this.loginFormHelper.getLoginModel(this.mobileNumber, this.password, false)).subscribe(resp => {
          this.closeDialog();
          this.disableFields(false);
        }, error => {
          this.disableFields(false);
        });
      } else {
        this.otpMessage = "";
        this.otpForm.controls['otp'].setValue(null);
        //Highlight OTP Field When Invalid OTP occurs
        this.otpErrorMessage = "Invalid OTP";
        this.disableFields(false);
      }
    });
  }

  registerUserOtpResend() {
    this.otpMessage = "Sending OTP...";
    this.otpErrorMessage = "";
    this.resendOtpButtonEnableTimer = 15;
    this.userService.resendOtp(this.mobileNumber, this.emailId, "register").subscribe((res) => {
      if (res.message == "Success") {
        this.otpMessage = "OTP Sent!";
        this.otpTimer = this.monitorResendOtpTimer();
      } else {
        this.otpMessage = "";
        this.otpErrorMessage = 'Error Sending OTP';
      }
    });
  }

  uniqueMobileNoValidator(control: AbstractControl) {
    return new Promise((resolve, reject) => {
      this.userService.isUserExist(control.value).subscribe((response) => {
        if (response.data) resolve({ 'alreadyExist': true });
        else resolve(null);
      }, err => reject(null))
    });
  }

  monitorResendOtpTimer() {
    return setInterval(() => {
      this.resendOtpButtonEnableTimer--;
      if (this.resendOtpButtonEnableTimer == 0) clearInterval(this.otpTimer);
    }, 1000);
  }

  private disableFields(state: boolean = true, fieldToFocus?: string) {
    if (state) {
      this.loginForm.disable();
      this.registerForm.disable();
      this.otpForm.disable();
      this.newPasswordForm.disable();
    } else {
      this.loginForm.enable();
      this.registerForm.enable();
      this.otpForm.enable();
      this.newPasswordForm.enable();
      if (fieldToFocus) this.loginForm.controls[fieldToFocus].markAsTouched();
    }
    this.showProgressSpinner = state;
  }

  closeDialog(checkLogin = true) {
    this.myAccountDialog.close(checkLogin);
  }

}