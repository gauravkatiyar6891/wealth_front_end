import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalUtility } from './../../shared/global-utility';
import { FundschemeService } from '../../services/fundscheme.service';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';

@Component({
  selector: 'app-model-portfolio-investment',
  templateUrl: './model-portfolio-investment.component.html',
  styleUrls: ['./model-portfolio-investment.component.scss']
})
export class ModelPortfolioInvestmentComponent implements OnInit {

  maxInvestmentAmountWithoutPan = 50000;
  userTotalInvestmentAmount: number = 0;

  modelportfolioDetailList: any[] = [];
  investmentType: string = 'sip';
  schemeKeyword: string = '';

  amountFields: number[] = [];
  dateFields: number[] = [];
  showPaymentType: boolean = false;
  isISipAllowed: boolean = true;
  paymentOptions: string = '';
  kycStatus: string = '';
  fieldError: any[] = [];


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.schemeKeyword = params['portfolioName'];
      this.getModelPortfolioDetail(params['portfolioName']);
    });
  }

  getModelPortfolioDetail(schemeKeyword) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.getModelportfolioDetailSecured(schemeKeyword).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == 'Success') {
        this.modelportfolioDetailList = resp.data;
        this.fillAmountInFields();
        this.schemeKeyword = resp.data[0].portfolioCategoryName;
        this.kycStatus = resp.data[0].isOrderAllowed;
        this.userTotalInvestmentAmount = resp.data[0].totalPurchageAmount;
        this.isISipAllowed = resp.data[0].isIsipAllowed == 'true' ? true : false;
        if (resp.data[0].isEnachEnable == 'true' && resp.data[0].isBillerEnable == 'true') this.showPaymentType = true;
      }
    });
  }

  deleteScheme(index) {
    this.modelportfolioDetailList.splice(index, 1);
    if (this.modelportfolioDetailList.length == 0) this.router.navigate(['modelportfolio']);
  }

  validateInvestment() {
    this.globalUtility.displayLoader();
    if (this.kycStatus == 'false') {
      let availablePurchaseAmount = this.maxInvestmentAmountWithoutPan - this.userTotalInvestmentAmount;
      let purchaseAmount = this.sumAllAmounts();
      if (this.investmentType == 'sip') {
        purchaseAmount *= 12;
      }
      if (purchaseAmount > availablePurchaseAmount) {
        this.globalUtility.displayLoader(false);
        this.dialog.open(MessageDialogComponent, {
          data: {
            message: 'You are exceeding your investment amount of Rs.50,000. In order to continue to investing, either complete your c-kyc or contact the system administrator',
            success: false,
            failure: true
          }
        });
      } else this.continueToPayment();
    } else this.continueToPayment();
  }

  continueToPayment() {
    this.validatePaymentAmounts();
    if (this.fieldError.filter(temp => temp).length != 0) {
      this.globalUtility.displayLoader(false);
      return;
    }
    let orderModel: any[] = [];
    this.modelportfolioDetailList.forEach((pf, index) => {
      orderModel.push(this.getCartOrderModel(
        this.amountFields[index],
        this.investmentType,
        pf.portfolioCategoryName,
        pf.schemeCode,
        pf.schemeId,
        this.investmentType == 'sip' ? this.dateSuffix(this.dateFields[index]) : '4th',
        this.paymentOptions
      ))
    });
    this.fundSchemeService.modelportfolioAddToCartList(orderModel).subscribe(resp => {
      if (resp.message == 'Success') {
        let bundleId = resp.data[0].mPBundleId;
        this.fundSchemeService.confirmOrderModelportfolio(JSON.stringify(this.getModelPortfolioConfirmModel(resp.data))).subscribe(resp => {
          if (resp.message == "Success") this.router.navigate(['user/confirm-order', 'modelportfolio', this.investmentType, bundleId]);
          else {
            this.globalUtility.displayLoader(false);
            this.openMessageDiaolog(resp.data, false, true);
          }
        });
      } else this.openMessageDiaolog("Failed to Place Order", false, true);
    });
  }

  validatePaymentAmounts() {
    this.fieldError = new Array<any>(this.modelportfolioDetailList.length);
    this.modelportfolioDetailList.forEach((pf, index) => {
      if (this.investmentType == 'sip') {
        if (pf.minSipAmount > this.amountFields[index]) this.fieldError[index] = true;
        else this.fieldError[index] = false;
      } else {
        if (pf.minimumPurchaseAmount > this.amountFields[index]) this.fieldError[index] = true;
        else this.fieldError[index] = false;
      }
    });
  }

  fillAmountInFields() {
    this.amountFields = [];
    if (this.investmentType == 'sip') this.modelportfolioDetailList.forEach(pf => {
      this.amountFields.push(pf.minSipAmount);
      this.dateFields.push(pf.sipDate);
    });
    else this.modelportfolioDetailList.forEach(pf => {
      this.amountFields.push(pf.minimumPurchaseAmount);
      this.dateFields.push(pf.sipDate);
    });
  }

  sumAllAmounts() {
    let total: number = 0;
    this.amountFields.forEach(amount => total += Number(amount));
    return total;
  }

  getCartOrderModel(amount, investmentType, modelPortfolioCategory, schemeCode, schemeId, dayOfSip, paymentOptions) {
    let orderModel = {
      amount: amount,
      dayOfSip: dayOfSip,
      schemeId: schemeId,
      schemeCode: schemeCode,
      investmentType: investmentType == 'sip' ? "SIP" : "LUMPSUM",
      paymentOptions: paymentOptions,
      modelPortfolioCategory: modelPortfolioCategory,
    }
    return orderModel;
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

  getModelPortfolioConfirmModel(data) {
    let model: any[] = [];
    data.forEach(order => {
      model.push({
        orderId: order.orderId,
        paymentAmount: order.amount
      });
    });
    return model;
  }

  openMessageDiaolog(message, success = false, failure = false) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    })
  }

}
