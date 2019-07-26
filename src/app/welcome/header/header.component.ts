import { Router } from "@angular/router";
import { WINDOW } from '@ng-toolkit/universal';
import { Platform } from '@angular/cdk/platform';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';

import { UserEnquiry } from '../../models/UserEnquiry';
import { UserService } from '../../services/user.service';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { GlobalUtility, LocalStorageDataModel } from './../../shared/global-utility';

@Component({
  selector: 'g4w-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sideBar = new EventEmitter<boolean>();

  openSideBar: boolean = false;
  enquiryForm: FormGroup;
  isEnquiryFormOpen: boolean = false;
  addShadow: boolean = true;
  monitorScrollForHeaderShadow: boolean = true;
  dropDownMenu: boolean = false;
  showTokenExpiredMessage: boolean = false;

  showEnquirySubmission: boolean = false;
  enquiryMessage: string = "";

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private myAccountDialog: MatDialog,
    public globalUtility: GlobalUtility,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platform: Platform,
  ) {
    this.enquiryForm = this.getEnquiryFormModel();
  }

  ngOnInit() {
    if (!(this.router.url == '/' || this.router.url.startsWith('/#'))) this.monitorScrollForHeaderShadow = false;
    // if (isPlatformBrowser(this.platform)) {
    //   this.window.addEventListener("scroll", () => {
    //     if (this.monitorScrollForHeaderShadow) {
    //       if (this.window.scrollY > 75) this.addShadow = true;
    //       else this.addShadow = false;
    //     }
    //   });
    // }
    this.globalUtility.$loginDialogCaller.subscribe(() => {
      this.openMyAccountDialog();
    });
    this.globalUtility.$headerProfilePictureChanger.subscribe(() => {
      this.getProfilePicture();
    });
    this.globalUtility.$noInternetConnectivityCaller.subscribe(() => {
      this.snackBar.open("No Internet Connectivity", "", { duration: 3000 });
    });
    this.globalUtility.$headerShadowCaller.subscribe(() => {
      if (this.router.url != '/') this.monitorScrollForHeaderShadow = false;
      else this.monitorScrollForHeaderShadow = true;
    });
    this.globalUtility.$profileHeaderCaller.subscribe(() => {
      this.globalUtility.isUserLoggedIn = false;
    });
    if (this.platform.ANDROID) this.checkUserLogin(false);
    else this.checkUserLogin(true);
  }

  enquiryFormState(state: boolean) {
    this.isEnquiryFormOpen = state;
    if (!state) this.enquiryForm.reset();
  }

  enquiryFormSubmit() {
    this.showEnquirySubmission = true;
    this.enquiryMessage = "";
    this.userService.addEnquiry(this.getEnquiryModel()).subscribe(response => {
      this.showEnquirySubmission = false;
      if (response.status == 200) {
        this.enquiryMessage = "Message Sent. We will contact you shortly";
        this.enquiryForm.reset();
      } else {
        this.enquiryMessage = "Oops!. There's some Error";
      }
    });
  }

  private checkUserLogin(monitorToken: boolean = false) {
    this.globalUtility.displayLoader();
    if (this.globalUtility.getDataFromLocalStorage(LocalStorageDataModel.TOKEN)) {
      //goal add
      this.userService.getUserDetails().subscribe(resp => {
        if (resp.status == '200') {
          if (this.router.url == "/") this.router.navigate(['user/dashboard']);
          else this.globalUtility.displayLoader(false);
        }
      });
      this.getProfilePicture();
      this.globalUtility.isUserLoggedIn = true;
      if (monitorToken) this.globalUtility.monitorTokenExpiry();
    } else {
      this.globalUtility.isUserLoggedIn = false;
      this.globalUtility.displayLoader(false);
    }
  }

  getProfilePicture() {
    this.userService.getProfilePicture().subscribe(resp => { });
  }

  getEnquiryModel(): UserEnquiry {
    return {
      name: this.enquiryForm.controls['name'].value,
      query: this.enquiryForm.controls['message'].value,
      mobile: this.enquiryForm.controls['mobNo'].value
    };
  }

  getEnquiryFormModel(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
      ])],
      mobNo: [null, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ])],
      message: [
        null, Validators.compose([
          Validators.required
        ])]
    });
  }

  openMyAccountDialog() {
    this.myAccountDialog.open(LoginSignupComponent, {
      panelClass: 'my-account-cont',
      disableClose: true,
      autoFocus: true,
    }).afterClosed().subscribe(checkUserLogin => {
      if (checkUserLogin) {
        if (this.platform.ANDROID) this.checkUserLogin(false);
        else this.checkUserLogin(true);
      }
    });
  }

  logout() {
    this.globalUtility.clearTokenFromLocalStorage();
    this.globalUtility.userProfileImage = '../../../assets/fallback-images/profile.png';
    this.dropDownMenu = false;
  }

  gotoHome() {
    // if (this.router.url.startsWith("/#")) this.router.navigate(['']);
    if (this.router.url == "/") this.window.location.reload();
    else this.router.navigate(['']);
  }

  plan() {
    this.globalUtility.scrollAnimateTo(1470);
  }

}
