import { Observable, zip } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalUtility } from './../../shared/global-utility';
import { FundschemeService } from '../../services/fundscheme.service';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './../../messages/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {

  investmentType: string = 'SIP';
  showConfirmAndPay: boolean = true;
  isModelPortfolio: boolean = false;
  order: CartOrder = {
    schemeName: '',
    amount: 0,
    dayOfSip: '',
    orderId: 0,
    status: ''
  };
  ordersList: CartOrder[] = [];
  modelPortfolioCategory: string = '';
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let orderId = params['bundleId'];
      let invType = params['investmentType'];
      if (invType == 'sip') this.investmentType = "SIP";
      else this.investmentType = "LUMPSUM";
      if (params['portolio'] != '') {
        if (params['portolio'] == 'modelportfolio') {
          this.isModelPortfolio = true;
          this.getModelPortfolioOrderDetails(orderId);
        }
        else this.getOrderDetails(orderId);
      } else this.router.navigate(['mutual-funds']);
    });
  }

  getModelPortfolioOrderDetails(bundleId) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.getCartOrderByOrderList(bundleId).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      resp.data.forEach(order => {
        this.ordersList.push({
          schemeName: order.schemeName,
          amount: order.amount,
          dayOfSip: order.dayOfSip,
          orderId: order.orderId,
          status: order.status
        });
        this.ordersList.forEach(order => {
          if (order.status == 'M') this.showConfirmAndPay = false;
        })
        this.modelPortfolioCategory = order.modelPortfolioCategory;
      });
    });
  }

  getOrderDetails(orderId) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.getCartOrderByOrder(orderId).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == 'Success') {
        this.order = {
          orderId: resp.data.orderId,
          amount: resp.data.amount,
          status: resp.data.status,
          schemeName: resp.data.schemeName,
          dayOfSip: resp.data.dayOfSip
        };
      }
    });
  }

  deleteAllOrder() {
    this.openConfirmDialog(`Are you sure to Delete all ${this.investmentType.charAt(0) == '0' ? 'SIP' : 'Lumpsum'}'s in this Portfolio?`, resp => {
      if (resp) {
        this.globalUtility.displayLoader();
        let deleteModelPortfolioRequests: Observable<any>[] = [];
        this.ordersList.forEach(mp => deleteModelPortfolioRequests.push(this.fundSchemeService.deleteOrder(mp.orderId.toString())));
        zip(...deleteModelPortfolioRequests).subscribe(resp => {
          resp.forEach((indResp, i) => {
            if (indResp.data == "success") this.ordersList[i] = null;
          });
          this.ordersList = this.ordersList.filter(x => x != null);
          if (this.ordersList.length == 0) {
            this.openMessageDiaolog("Portfolio Successfully Deleted", true, true);
          }
          else this.openMessageDiaolog("Failed to Delete One or More Orders.", false, true);
          this.globalUtility.displayLoader(false);
        });
      }
    });
  }

  deleteOrder(orderId, i?: number) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.deleteOrder(orderId).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.data == "success") {
        if (i != undefined) {
          this.ordersList.splice(i, 1);
          if (this.ordersList.length == 0) this.openMessageDiaolog("Order Deleted Successfully", true, true, false);
          else this.openMessageDiaolog("Order Deleted Successfully", false, true, false);
        } else this.openMessageDiaolog("Order Deleted Successfully", true, true);
      } else {
        this.openMessageDiaolog("Error Deleting Order", false, false, true);
      }
    });
  }

  payMpNow() {
    this.globalUtility.displayLoader();
    let model: any[] = [];
    this.ordersList.filter(y => y.status == 'M').forEach(order => model.push({ orderId: order.orderId }));
    this.fundSchemeService.makePaymentOfModelportfolio(this.getModelPortfolioConfirmModel()).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == "Success") {
        if (!this.globalUtility.openPaymentGateway(resp.data)) {
          if (resp.data.includes("101")) {
            if (resp.data.includes('INVALID ORDER NUMBER')) {
              this.openMessageDiaolog("We are trying to retrieve order no from BSE StarMF, Please try after some time.", false, false, true);
            } else this.openMessageDiaolog(resp.data.slice(4), false, false, true);
          } else this.openMessageDiaolog(resp.data, false, false, true);
        }
      } else this.openMessageDiaolog(resp.data, false, false, true);
    });
  }

  payNow(order) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.makePayment([{ orderId: order.orderId, orderAmount: order.amount, paymentAmount: order.amount }]).subscribe(resp => {
      // this.fundSchemeService.makePayment(order.orderId, order.amount).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == "Success") {
        if (!this.globalUtility.openPaymentGateway(resp.data)) {
          if (resp.data.includes("101")) {
            if (resp.data.includes('INVALID ORDER NUMBER')) {
              this.openMessageDiaolog("We are trying to retrieve order no from BSE StarMF, Please try after some time.", false, false, true);
            } else this.openMessageDiaolog(resp.data.slice(4), false, false, true);
          } else this.openMessageDiaolog(resp.data, false, false, true);
        }
      } else {
        this.openMessageDiaolog(resp.data, false, false, true);
      }
    });
  }

  confirmMpOrder() {
    this.globalUtility.displayLoader();
    this.fundSchemeService.confirmOrderModelportfolio(JSON.stringify(this.getModelPortfolioConfirmModel())).subscribe(resp => {
      if (resp.message == "Success") {
        // this.openMessageDiaolog("Order Successfully Placed. Now You Can Pay", false, true);
        this.ordersList.forEach(order => order.status = 'C');
        this.payMpNow();
      }
      else {
        this.globalUtility.displayLoader(false);
        this.openMessageDiaolog(resp.data, false, false, true);
      }
    });
  }

  confirmOrder(order) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.confirmOrder(order.orderId).subscribe(resp => {
      if (resp.message == 'Success') {
        // this.openMessageDiaolog(resp.data, false, true);
        this.order.status = 'C';
        this.payNow(order);
      } else {
        this.globalUtility.displayLoader(false);
        this.openMessageDiaolog(resp.data, false, false, true);
      }
    });
  }

  getModelPortfolioConfirmModel() {
    let model: any[] = [];
    this.ordersList.forEach(order => {
      model.push({
        orderId: order.orderId,
        paymentAmount: order.amount
      });
    });
    return model;
  }

  openMessageDiaolog(message, gotoInv: boolean = true, success = false, failure = false) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    }).afterClosed().subscribe(() => {
      if (gotoInv) {
        this.router.navigate(['mutual-funds']);
      }
    })
  }

  openConfirmDialog(message, callback) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: message,
        cancelButtonName: 'Cancel',
        confirmButtonName: 'Continue'
      }
    }).beforeClose().subscribe(callback);
  }

}

interface CartOrder {
  status: string,
  amount: number,
  orderId: number,
  dayOfSip?: string,
  schemeName: string,
}
