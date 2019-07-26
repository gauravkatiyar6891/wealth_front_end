import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FundschemeService } from '../../../services/fundscheme.service';
import { GlobalUtility, LocalStorageDataModel } from '../../global-utility';
import { ConfirmDialogComponent } from './../../../messages/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from './../../../messages/message-dialog/message-dialog.component';

@Component({
  selector: 'app-mutual-fund-details',
  templateUrl: './mutual-fund-details.component.html',
  styleUrls: ['./mutual-fund-details.component.scss']
})
export class MutualFundDetailsComponent implements OnInit {

  recommendedSchemesList = [];
  recentlyViewedSchemesList = [];
  schemeDetails: SchemeDetail;
  fetchingScheme: boolean = true;
  schemeKeyword: string;
  addWatchListSuccess: boolean = false;
  addWatchListFailure: boolean = false;
  addingtoWatchList: boolean = false;
  showSharingOptions: boolean = false;
  riskAvailable: boolean = true;
  twitterShareUrl: string = '';
  facebookShareUrl: string = '';
  whatsAppShareUrl: string = 'https://wa.me/?text=Hello%20World!';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageDialog: MatDialog,
    private userService: UserService,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService,
  ) {
  }

  ngOnInit() {
    this.globalUtility.displayLoader();
    this.route.params.subscribe(params => {
      this.schemeKeyword = params['schemeName'];
      if (!this.schemeKeyword) this.router.navigate(['mutual-funds']);
      else {
        this.getFundSchemeDetails();
        this.getRecommendedFunds();
        this.whatsAppShareUrl = `https://wa.me/?text=${encodeURI('Just have a look at this mutual fund scheme\n' + 'https://go4wealth.com' + this.router.url)}`;
      }
    });
  }

  getRecommendedFunds() {
    this.fundSchemeService.getAllFundScheme(0).subscribe(resp => {
      if (resp.status == '200') {
        this.recommendedSchemesList = resp.data;
        this.recommendedSchemesList = this.recommendedSchemesList.slice(0, 4);
      }
    });
  }

  getFundSchemeDetails() {
    this.addingtoWatchList = false;
    this.addWatchListFailure = false;
    this.addWatchListSuccess = false;
    this.fundSchemeService.getFundSchemeDetailsByKeyword(this.schemeKeyword).subscribe(resp => {
      if (resp.message == 'Success') {
        let planType = resp.data.schemeName.split('-');
        planType = planType[planType.length - 1];
        if (planType.split(' ').length > 3) {
          planType = planType.split(' ');
          planType = planType.slice(Math.max(planType.length - 3, 1))
          planType = planType.join(' ');
        }
        this.schemeDetails = {
          id: resp.data.schemeId,
          name: resp.data.schemeName,
          currentDate: resp.data.currentDate,
          currentNav: resp.data.currentNav,
          sipAllowed: resp.data.sipAllowed,
          lumpSumAllowed: resp.data.purchaseAllowed,
          schemeCode: resp.data.schemeCode,
          schemeType: resp.data.schemeType,
          minLumpSumAmount: resp.data.minimumPurchaseAmount,
          minSipAmount: parseInt(resp.data.minSipAmount),
          launchDate: resp.data.schemeLaunchDate,
          planType: planType,
          risk: 'moderately-low',
          oneYearReturn: resp.data.oneYearReturn ? resp.data.oneYearReturn + '%' : 'N/A',
          threeYearReturn: resp.data.threeYearReturn ? resp.data.threeYearReturn + '%' : 'N/A',
          fiveYearReturn: resp.data.fiveYearReturn ? resp.data.fiveYearReturn + '%' : 'N/A',
          benchmarkCode: resp.data.benchmarkCode,
          fundManager: resp.data.fundManager,
          investmentObjective: resp.data.investmentObjective,
          option: resp.data.option,
          schemeCategory: resp.data.schemeCategory,
          schemeSubCategory: resp.data.schemeSubCategory
        }
        if (resp.data.risk) {
          let risk = resp.data.risk;
          if (risk == "High Riskometer") this.schemeDetails.risk = 'high';
          else if (risk == "Moderately High Riskometer") this.schemeDetails.risk = 'moderately-high';
          else if (risk == "Moderate Riskometer") this.schemeDetails.risk = 'moderate';
          else if (risk == "Moderately Low Riskometer") this.schemeDetails.risk = 'moderately-low';
          else if (risk == "Low Riskometer") this.schemeDetails.risk = 'low';
        }
        else this.riskAvailable = false;
        this.recentlyViewedSchemesList = resp.data.schemeRecentViewDTOList;
        this.recentlyViewedSchemesList = this.recentlyViewedSchemesList.slice(0, 4);
        this.fetchingScheme = false;
        this.globalUtility.scrollAnimateTo(0);
      }
      else {
        this.router.navigate(['mutual-funds']);
        console.log("invalid scheme");
      }
      this.globalUtility.displayLoader(false);
    });
  }

  checkeMandateStatus(investmentType) {
    if (this.globalUtility.userData) {
      if (this.globalUtility.userData.status == 0) {
        this.messageDialog.open(ConfirmDialogComponent, {
          data: {
            message: 'In Order to invest, We need to complete some formalities, Shall We?',
            cancelButtonName: 'Not Now',
            confirmButtonName: 'Continue'
          }
        }).beforeClose().subscribe(resp => {
          if (resp) this.router.navigate(['user/onboarding']);
        });
      }
      else if (this.globalUtility.userData.status == 1) {
        if (!this.globalUtility.userData.panVerified) {
          this.messageDialog.open(MessageDialogComponent, {
            data: {
              message: 'We are getting your PAN ready for investment. Please wait for atleast 3 working days for the process to be completed. Your profile will show <b>verified</b> sign, once your KYC gets completed.',
              success: false,
              failure: true
            }
          });
        } else this.router.navigate(['user/investment', this.schemeKeyword, investmentType, this.schemeDetails.id]);
      }
    }
    else this.globalUtility.openLoginDialog();
  }

  invest(type) {
    this.checkeMandateStatus(type);
  }

  addToWatchList() {
    if (!this.addingtoWatchList)
      if (this.globalUtility.getDataFromLocalStorage(LocalStorageDataModel.TOKEN)) {
        this.addingtoWatchList = true;
        this.userService.addToWatchlist(this.schemeDetails.schemeCode).subscribe(resp => {
          this.addingtoWatchList = false;
          if (resp.status == '200') {
            this.addWatchListFailure = false;
            this.addWatchListSuccess = true;
          } else {
            this.addWatchListSuccess = false;
            this.addWatchListFailure = true;
          }
        })
      } else this.globalUtility.openLoginDialog();
  }

}

export interface SchemeDetail {
  id: string,
  name: string,
  risk: string,
  option: string,
  planType: string,
  currentNav: string,
  sipAllowed: string,
  launchDate: string,
  schemeCode: string,
  schemeType: string,
  fundManager: string,
  currentDate: string,
  minSipAmount: number,
  oneYearReturn: string,
  benchmarkCode: string,
  lumpSumAllowed: string,
  fiveYearReturn: string,
  schemeCategory: string,
  threeYearReturn: string,
  minLumpSumAmount: string,
  schemeSubCategory: string,
  investmentObjective: string,
}