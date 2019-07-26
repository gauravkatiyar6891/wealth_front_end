import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GlobalUtility } from './../../shared/global-utility';
import { FundschemeService } from '../../services/fundscheme.service';
import { GoalsDialogComponent, Goal } from './goals-dialog/goals-dialog.component';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './../../messages/confirm-dialog/confirm-dialog.component';
import { SchemeForInvestment, SchemeForInvestmentResp, ExistingFolioForInvestment } from './../../models/scheme';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent implements OnInit {

  readonly maxInvestmentAmountWithoutPan = 50000;
  schemeData: SchemeForInvestment;
  investmentFormGroup: FormGroup;
  exFolio: ExistingFolioForInvestment[] = [];

  fetchingGoals: boolean = true;
  goals: Goal[] = [];
  selectedGoal: Goal = { goalId: null, goalName: null };
  showWarningBox: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private goalsDialog: MatDialog,
    private messageDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) {
    this.investmentFormGroup = this._formBuilder.group({
      amount: [null, Validators.required],
      day: [null],
      tnC: [false],
      paymentType: [null],
      folio: ['0', Validators.required]
    });
    this.investmentFormGroup.controls['folio'].valueChanges.subscribe(this.setMinMaxAmountAndPaymentValidators.bind(this));
  }

  ngOnInit() {
    this.globalUtility.displayLoader();
    this.route.params.subscribe(routeParams => {
      if (routeParams['schemeId']) this.getSchemeDetails(routeParams['schemeId'], routeParams['investmentType']);
      this.getGoals();
    });
  }

  getSchemeDetails(schemeId, investmentType) {
    this.fundSchemeService.getFundSchemeDetailBySchemeId(schemeId).subscribe(resp => {
      if (resp.message == 'Success') {
        this.schemeData = this.getSchemeDataFromResp(resp.data, investmentType);
        this.investmentFormGroup.controls['day'].setValue(this.schemeData.nextSipDate);
        this.investmentTypeChange(this.schemeData.investmentType);
        this.fundSchemeService.getFolioListForAmc(this.schemeData.amcCode).subscribe(resp => {
          if (resp.status == '200') this.exFolio = resp.data.filter(f => f.follioNo != null);
        })
        this.globalUtility.displayLoader(false);
      }
    });
  }

  investmentTypeChange(type) {
    this.schemeData.investmentType = type;
    if (type == 'sip') {
      this.showWarningBox = true;
      this.investmentFormGroup.controls['day'].setValidators(Validators.required);
      this.investmentFormGroup.controls['amount'].setValue(this.schemeData.minSipAmount);
    } else {
      this.showWarningBox = false;
      this.investmentFormGroup.controls['day'].clearValidators();
      this.investmentFormGroup.controls['amount'].setValue(this.schemeData.minLumpSumAmount);
    }
    this.investmentFormGroup.controls['day'].updateValueAndValidity();
    this.setMinMaxAmountAndPaymentValidators();
  }

  setMinMaxAmountAndPaymentValidators(folioNo?) {
    if (this.schemeData.investmentType == 'sip') {
      this.investmentFormGroup.controls['amount'].setValidators(Validators.compose([
        Validators.min(this.schemeData.minSipAmount),
        Validators.max(this.schemeData.maxSipAmount),
        Validators.required
      ]));
      if (this.schemeData.showPaymentType) this.investmentFormGroup.controls['paymentType'].setValidators(Validators.required);
    } else {
      this.investmentFormGroup.controls['amount'].setValidators(Validators.compose([
        Validators.min(this.investmentFormGroup.controls['folio'].value != '0' ? this.schemeData.minAdditionalAmount : this.schemeData.minLumpSumAmount),
        Validators.max(this.schemeData.maxLumpsumAmount),
        Validators.required
      ]));
      this.investmentFormGroup.controls['paymentType'].clearValidators();
    }
    this.investmentFormGroup.controls['amount'].updateValueAndValidity();
    this.investmentFormGroup.controls['paymentType'].updateValueAndValidity();
    if (folioNo != 0) {
      let folio: ExistingFolioForInvestment = this.exFolio.find(f => f.follioNo = folioNo);
      if (folio && folio.goalId != 0) [this.selectedGoal.goalId, this.selectedGoal.goalName] = [folio.goalId, folio.goalName];
      else[this.selectedGoal.goalId, this.selectedGoal.goalName] = [null, null];
    } else[this.selectedGoal.goalId, this.selectedGoal.goalName] = [null, null];
  }

  openMessageDiaolog(message, success = false, failure = false) {
    this.messageDialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    });
  }

  openGoalsDialog() {
    this.goalsDialog.open(GoalsDialogComponent, {
      data: { goals: this.goals, displayNone: this.selectedGoal.goalId ? true : false }
    }).afterClosed().subscribe(goal => {
      if (goal != null) {
        if (goal.goalId == 0) [this.selectedGoal.goalId, this.selectedGoal.goalName] = [null, null];
        else[this.selectedGoal.goalId, this.selectedGoal.goalName] = [goal.goalId, this.goals.find(g => g.goalId == goal.goalId).goalName];
      }
    });
  }

  validateInvestment(placeOrder: boolean = true) {
    if (this.checkKycStatus()) this.checkSipDate(placeOrder);
  }

  investmentSubmit(placeOrder: boolean) {
    this.globalUtility.displayLoader();
    let investment: Investment = {
      amount: this.investmentFormGroup.controls['amount'].value,
      dayOfSip: this.schemeData.investmentType == 'sip' ? this.dateSuffix(this.investmentFormGroup.controls['day'].value) : '4th',
      investmentType: this.schemeData.investmentType == 'sip' ? 'SIP' : 'LUMPSUM',
      schemeCode: this.schemeData.schemeCode,
      paymentOptions: this.investmentFormGroup.controls['paymentType'].value,
      goalId: this.selectedGoal.goalId,
      goalName: this.selectedGoal.goalName,
      folioNo: this.investmentFormGroup.controls['folio'].value == '0' ? '' : this.investmentFormGroup.controls['folio'].value
    }
    this.fundSchemeService.addToCart(investment).subscribe(resp => {
      if (resp.data.status == "success") {
        if (placeOrder) this.fundSchemeService.confirmOrder(resp.data.orderId).subscribe(resp1 => {
          if (resp1.message == 'Success') this.router.navigate(['user/confirm-order', 'singlescheme', this.schemeData.investmentType, resp.data.orderId]);
          else {
            this.globalUtility.displayLoader(false);
            this.openMessageDiaolog(resp1.data, false, true);
          }
        });
        else {
          this.globalUtility.displayLoader(false);
          this.router.navigate(['/user/cart']);
        }
      }
      else {
        this.globalUtility.displayLoader(false);
        this.openMessageDiaolog(resp.data.status, false, true);
      }
    });
  }

  checkKycStatus(): boolean {
    if (!this.schemeData.kycStatus) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          message: 'You are not allowed to invest as you need to complete your c-kyc first',
          success: false,
          failure: true
        }
      });
      return false;
      let availablePurchaseAmount = this.maxInvestmentAmountWithoutPan - this.schemeData.userTotalInvestmentAmount;
      let purchaseAmount = this.investmentFormGroup.controls['amount'].value;
      if (this.schemeData.investmentType == 'sip') {
        purchaseAmount *= 12;
      }
      if (purchaseAmount > availablePurchaseAmount) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            message: 'You are exceeding your investment amount of Rs.50,000. In order to continue to investing, either complete your c-kyc or contact the system administrator',
            success: false,
            failure: true
          }
        });
        return false;
      } else return true;
    } else return true;
  }

  checkSipDate(placeOrder: boolean) {
    let currentDate = ((new Date()).getDate());
    let selectedDate = this.investmentFormGroup.controls['day'].value;
    if (selectedDate - currentDate <= 0 && this.schemeData.investmentType == 'sip') {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: `You have selected your sip date as ${this.dateSuffix(this.investmentFormGroup.controls['day'].value)} of every month.
          However this date been passed for current Month.
          Hence your first sip date will be ${this.dateSuffix(this.investmentFormGroup.controls['day'].value)} of next month.`,
          cancelButtonName: 'Cancel',
          confirmButtonName: 'Continue'
        }
      }).beforeClose().subscribe(resp => {
        if (resp) this.investmentSubmit(placeOrder);
      });
    } else {
      this.investmentSubmit(placeOrder);
    }
  }

  getGoals() {
    this.fundSchemeService.getUserAssignedGoals().subscribe(resp => {
      this.goals = resp.data;
      this.fetchingGoals = false;
    });
  }

  getSchemeDataFromResp(data: SchemeForInvestmentResp, investmentType: string): SchemeForInvestment {
    let scheme: SchemeForInvestment = {
      amcCode: data.amcCode,
      schemeId: data.schemeId,
      schemeCode: data.schemeCode,
      schemeName: data.schemeName,
      availableSipDates: data.sipAllowedDate.split(','),
      investmentType: investmentType,
      isISipAllowed: data.isIsipAllowed == 'true',
      isLumpsumAllowed: data.purchaseAllowed == 'Y',
      isSipAllowed: data.sipAllowed == 'Y',
      kycStatus: data.isOrderAllowed == 'true',
      maxLumpsumAmount: Number(data.maximumPurchaseAmount),
      maxSipAmount: Number(data.sipMaxInstallmentAmount),
      minLumpSumAmount: data.minimumPurchaseAmount,
      minSipAmount: Number(data.minSipAmount),
      minAdditionalAmount: data.minAdditionalAmount,
      showPaymentType: data.isEnachEnable == 'true' && data.isBillerEnable == 'true',
      sipMaxGap: Number(data.sipMaximumGap),
      userTotalInvestmentAmount: data.totalPurchageAmount,
      nextSipDate: this.getNextSipDate(data.sipAllowedDate.split(','))
    }
    return scheme;
  }

  getNextSipDate(availSipDate: string[]): string {
    let nextSipDate = ((new Date()).getDate());
    for (let availDate of availSipDate) {
      if (nextSipDate - Number(availDate) < 0) {
        nextSipDate = Number(availDate);
        return nextSipDate.toString();
      }
    }
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

}

export interface Investment {
  amount: number,
  goalId?: number,
  dayOfSip: string,
  goalName?: string,
  schemeCode: string,
  paymentOptions: string,
  investmentType: string,
  folioNo: string
}