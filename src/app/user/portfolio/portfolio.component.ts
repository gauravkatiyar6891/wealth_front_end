import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PortfolioHelper } from './portfolio';
import { RedeemComponent } from './redeem/redeem.component';
import { GlobalUtility } from './../../shared/global-utility';
import { Investment } from '../investment/investment.component';
import { FundschemeService } from '../../services/fundscheme.service';
import { AddToFolioDialogComponent } from './add-to-folio-dialog/add-to-folio-dialog.component';
import { GoalsDialogComponent, Goal } from './../investment/goals-dialog/goals-dialog.component';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';
import { Portfolio, FolioPortfolio, RedeemReq, AddToFolioRequest } from './../../models/portfolio';

@Component({
  selector: 'g4w-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PortfolioHelper]
})

export class PortfolioComponent implements OnInit {

  portfolios: Portfolio[] = [];
  goals: Goal[] = [];
  fetchingPortfolio: boolean = true;
  awaitingPaymentStatus: any = [];
  totalCurrentInvestment: number = 0;
  totalInvestedAmount: number = 0;
  averageReturns: number = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private redeemDialog: MatDialog,
    private messageDialog: MatDialog,
    private globalUtility: GlobalUtility,
    private portfolioHelper: PortfolioHelper,
    private fundSchemeService: FundschemeService,
  ) {
  }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
    this.globalUtility.displayLoader();
    zip(this.fundSchemeService.getPortfolio(), this.fundSchemeService.getAwaitingPaymentRecord(), this.fundSchemeService.getUserAssignedGoals(), this.fundSchemeService.getTransferInRecords()).subscribe(resp => {
      if (resp[0].status == '200' && resp[3].status == '200') this.portfolios = this.portfolioHelper.getConvertedPortfolioData(resp[0].data, resp[3].data);
      if (resp[1].status == '200') this.awaitingPaymentStatus = resp[1].data;
      if (resp[2].status == '200') this.goals = resp[2].data;
      this.calculateReturns();
      this.portfolios.sort((a, b) => a.schemeName.localeCompare(b.schemeName));
      this.fetchingPortfolio = false;
      this.globalUtility.displayLoader(false);
    });
  }

  viewTransaction(folioNo, schemeCode) {
    this.router.navigate(['user/transactions', 'transactionStatusCheck', folioNo, schemeCode]);
  }

  openRedeemDialog(portfolio: Portfolio, folio: FolioPortfolio) {
    this.redeemDialog.open(RedeemComponent, {
      panelClass: 'redeem-folio-cont',
      autoFocus: true,
      data: {
        schemeName: portfolio.schemeName,
        minRedeemAmount: folio.minimumRedeemptionAmount,
        totalAmount: folio.availableAmount
      }
    }).afterClosed().subscribe((data: FormGroup) => {
      let redeemptionType: string = '';
      if (data) {
        if (data.controls['fullAmountCheckBox'].value || data.controls['amount'].value == folio.availableAmount) redeemptionType = 'FR';
        else redeemptionType = 'PR';
        this.redeem(folio.folioNumber, portfolio.schemeCode, redeemptionType == 'FR' ? folio.availableAmount : data.controls['amount'].value, redeemptionType, folio.isTransferIn);
      }
    });
  }

  openGoalsDialog(folioNo: string, schemeCode: string, oldGoalId: number) {
    this.dialog.open(GoalsDialogComponent, {
      data: { goals: this.goals }
    }).afterClosed().subscribe(goal => {
      if (goal != null) {
        this.globalUtility.displayLoader();
        this.assignGoalToFolioScheme(folioNo, schemeCode, goal.goalId, goal.goalName, oldGoalId);
      }
    })
  }

  assignGoalToFolioScheme(folioNo: string, schemeCode: string, goalId: number, goalName: string, oldGoalId: number) {
    // let oldGoalId: number = this.portfolios.find(p => p.schemeCode == schemeCode).folios.find(f => f.folioNumber == folioNo).goalId;
    this.fundSchemeService.updateGoalToInvestment('Modify', goalId, folioNo, schemeCode, goalName, oldGoalId).subscribe(resp => {
      if (resp.status == '200') {
        let goal = this.portfolios.find(p => p.schemeCode == schemeCode).folios.find(f => f.folioNumber == folioNo);
        goal.goalId = goalId;
        goal.goalName = goalName;
        this.globalUtility.displayLoader(false);
      }
    });
  }

  redeem(folioNo, schemeCode, amount, redeemptionType, isTransferIn) {
    this.globalUtility.displayLoader();
    let redeemReq: RedeemReq = {
      amount: amount,
      folioNo: folioNo,
      type: redeemptionType,
      schemeCode: schemeCode,
      status: isTransferIn ? 'N' : 'Y'
    }
    this.fundSchemeService.redeemOrder(redeemReq).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.data == 'success') this.openMessageDialog('Your Redeemption Request has been Accepted', true, folioNo, schemeCode);
      else this.openMessageDialog('Failed to place Redeem Request', false);
    });
  }

  openMessageDialog(message, success, folioNo?, schemeCode?) {
    this.messageDialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: !success
      }
    }).afterClosed().subscribe(() => {
      if (folioNo) this.viewTransaction(folioNo, schemeCode);
    });
  }

  calculateReturns() {
    this.portfolios.forEach(p => {
      p.totalInvestment = p.folios.map(f => f.investedAmount).reduce((a, b) => a + b, 0);
      p.currentAmount = p.folios.map(f => f.currentAmount).reduce((a, b) => a + b, 0);
    });
    this.totalInvestedAmount = this.portfolios.map(p => p.totalInvestment).reduce((a, b) => a + b, 0);
    this.totalCurrentInvestment = this.portfolios.map(p => p.currentAmount).reduce((a, b) => a + b, 0);
    this.averageReturns = this.globalUtility.roundOff(((this.totalCurrentInvestment / this.totalInvestedAmount) - 1), true);
  }

  openAddtoFolioDialog(portfolio: Portfolio, folio: FolioPortfolio) {
    this.dialog.open(AddToFolioDialogComponent, {
      data: this.portfolioHelper.getAddToFolioData(portfolio, folio),
      panelClass: 'add-to-folio-cont'
    }).afterClosed().subscribe(data => {
      if (data) {
        this.globalUtility.displayLoader();
        let addToFolio: AddToFolioRequest = data.addToFolioReq;
        if (addToFolio.transferInId) this.placeOrderFromTransferIn(data);
        else this.placeOldOrder(data.addToFolioReq);
      }
    });
  }

  private placeOrderFromTransferIn(data) {
    if (data.type == 'SIP') {
      this.fundSchemeService.addToFolioAsSip(data.addToFolioReq).subscribe(resp => {
        this.globalUtility.displayLoader(false);
        if (resp.status == '200') this.openMessageDialog(resp.data, true);
        else this.openMessageDialog(resp.data, false);
      });
    } else {
      this.fundSchemeService.addToFolioAsLumpsum(data.addToFolioReq).subscribe(resp => {
        this.globalUtility.displayLoader(false);
        if (resp.message == "Success") {
          if (!this.globalUtility.openPaymentGateway(resp.data)) {
            if (resp.data.includes("101")) {
              if (resp.data.includes('INVALID ORDER NUMBER')) {
                this.openMessageDialog("We are trying to retrieve order no from BSE StarMF, Please try after some time.", false, true);
              } else this.openMessageDialog(resp.data.slice(4), false, true);
            } else this.openMessageDialog(resp.data, false, true);
          }
        } else this.openMessageDialog(resp.data, false, true);
      });
    }
  }

  private placeOldOrder(data: AddToFolioRequest) {
    let investment: Investment = {
      amount: data.amount,
      goalId: data.goalId,
      dayOfSip: data.dayOfSip.toString(),
      goalName: data.goalName,
      schemeCode: data.schemeCode,
      paymentOptions: data.paymentOptions,
      investmentType: data.investmentType,
      folioNo: data.folioNo
    }
    this.fundSchemeService.addToCart(investment).subscribe(resp => {
      if (resp.data.status == "success") {
        this.fundSchemeService.confirmOrder(resp.data.orderId).subscribe(resp1 => {
          if (resp1.message == 'Success') this.router.navigate(['user/confirm-order', 'singlescheme', investment.investmentType, resp.data.orderId]);
          else {
            this.globalUtility.displayLoader(false);
            this.openMessageDialog(resp1.data, false);
          }
        });
      }
      else {
        this.globalUtility.displayLoader(false);
        this.openMessageDialog(resp.data.status, false);
      }
    });
  }

}