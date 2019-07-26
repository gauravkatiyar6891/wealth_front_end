import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Platform } from '@angular/cdk/platform';
import { Component, OnInit, Inject, PLATFORM_ID, EventEmitter, Output } from '@angular/core';

import { UserService } from './../../services/user.service';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { GlobalUtility, LocalStorageDataModel } from './../../shared/global-utility';

@Component({
  selector: 'g4w-mob-side-nav',
  templateUrl: './mob-side-nav.component.html',
  styleUrls: ['./mob-side-nav.component.scss']
})
export class MobSideNavComponent implements OnInit {

  @Output() sideBar = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private userService: UserService,
    private myAccountDialog: MatDialog,
    public globalUtility: GlobalUtility,
    @Inject(PLATFORM_ID) private platform: Platform,
  ) { }

  ngOnInit() {
  }

  openMyAccountDialog() {
    this.sideBar.emit(false);
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

  // toPlan() {
  //   this.sideBar.emit(false);
  //   this.globalUtility.scrollAnimateTo(1300);
  // }

}
