import { zip } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalUtility } from './../../shared/global-utility';
import { PaymentResponse } from './../../Data/payment-response';
import { FundschemeService } from '../../services/fundscheme.service';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  transactionList = [];
  viewTransaction: boolean = false;
  modelPortfolioSuccess: boolean = false;
  redeemptionDetail: RedeemptionDetail[];
  transactionStatusProcessing: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) { }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
    this.route.params.subscribe(params => {
      let orderType = params['orderType'];
      if (orderType == 'simpleSchemePaymentStatus' && params['orderId']) this.getPaymentStatus(params['orderId']);
      else if (orderType == 'modelportfolioPaymentStatus' && params['orderId']) this.getModelPortfolioPaymentStatus(params['orderId']);
      else if (orderType == 'transactionStatusCheck' && params['folioNo'] && params['schemeCode']) this.getTransaction(params['folioNo'], params['schemeCode']);
      else this.displayMessage("Invalid Order No.", false, '/user/my-orders');
    });
  }

  getPaymentStatus(orders: string) {
    let orderIds: string[] = orders.split('_');
    orderIds.forEach(o => {
      if (o != '') {
        zip(this.fundSchemeService.getOrderDetailsById(o), this.fundSchemeService.getPaymentStatus(o)).subscribe(resp => {
          if (resp[0].status == '200') {
            this.transactionList.push({
              bseOrderId: resp[0].data.bseOrderId,
              schemeName: resp[0].data.schemeName,
              investmentType: resp[0].data.type,
              amount: resp[0].data.amount,
              status: '',
            });
          }
          if (resp[1].message == 'Success') {
            if (resp[1].data.includes(PaymentResponse.AWAITING_FOR_RESPONSE_FROM_BILLDESK)) this.transactionList[this.transactionList.length - 1].status = 'Failed';
            else if (resp[1].data.includes(PaymentResponse.AWAITING_FOR_FUNDS_CONFIRMATION) || resp[1].data.includes(PaymentResponse.APPROVED)) this.transactionList[this.transactionList.length - 1].status = 'Success';
            this.transactionStatusProcessing = false;
          }
          this.viewTransaction = true;
        });
        // this.fundSchemeService.getPaymentStatus(o).subscribe(resp => {
        //   if (resp.message == 'Success') {
        //     if (resp.data.includes(PaymentResponse.AWAITING_FOR_RESPONSE_FROM_BILLDESK)) {
        //       this.displayMessage('Payment has not processed successfully', false, '/user/my-orders');
        //     } else if (resp.data.includes(PaymentResponse.AWAITING_FOR_FUNDS_CONFIRMATION) || resp.data.includes(PaymentResponse.APPROVED)) {
        //       this.displayMessage('Payment processed successfully', true, '/user/portfolios');
        //     } else this.displayMessage("Your Payment is under Process. We will notify you once it is processed.", false, '/user/my-orders');
        //     this.transactionStatusProcessing = false;
        //   }
        // });
      }
    });
  }

  getModelPortfolioPaymentStatus(bundleId) {
    this.fundSchemeService.getModelportfolioPaymentStatus(bundleId).subscribe(resp => {
      if (resp.message == 'Success') {
        this.transactionList = resp.data;
        let finalResponse = resp.data[0].finalResponse;
        if (finalResponse.includes(PaymentResponse.AWAITING_FOR_FUNDS_CONFIRMATION) || finalResponse.includes(PaymentResponse.APPROVED)) {
          this.modelPortfolioSuccess = true;
          this.viewTransaction = true;
        }
        else this.displayMessage('Payment has not processed successfully', false, '/user/my-orders');
        this.transactionStatusProcessing = false;
      }
    });
  }

  getTransaction(folioNumber, schemeCode) {
    this.fundSchemeService.getTransactionOrder(folioNumber, schemeCode).subscribe(resp => {
      this.transactionList = resp.data;
      this.fundSchemeService.getRedeemptionDetails(folioNumber, schemeCode).subscribe(resp => {
        this.viewTransaction = true;
        this.transactionStatusProcessing = false;
        this.redeemptionDetail = resp.data;
      });
      this.transactionStatusCheck();
    });
  }

  transactionStatusCheck() {
    for (let i = 0; i < this.transactionList.length; i++) {
      if (this.transactionList[i].status == 'C' || this.transactionList[i].status == 'AD' || this.transactionList[i].status == 'AP') this.transactionList[i].status = "Success";
      else if (this.transactionList[i].status == 'M') this.transactionList[i].status = "In progress";
      else if (this.transactionList[i].status == 'F' || this.transactionList[i].status == 'AF') this.transactionList[i].status = "Failed";
      else if (this.transactionList[i].status == 'OD') this.transactionList[i].status = "SIP Stopped";
      else if (this.transactionList[i].status == 'P') this.transactionList[i].status = "Canceled By User";
    }
  }

  displayMessage(message, success, redirectUrl?) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: !success
      }
    }).beforeClose().subscribe(() => {
      if (redirectUrl) this.router.navigate([redirectUrl]);
    });
  }

}

interface RedeemptionDetail {
  type: string,
  follioNo: string,
  schemeName: string,
  redumptionDate: string,
  redumptionStatus: string,
  redumptionAmount: number
}