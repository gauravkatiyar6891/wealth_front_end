import { Observable, zip } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';

import { GlobalUtility } from './../../shared/global-utility';
import { FundschemeService } from '../../services/fundscheme.service';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './../../messages/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  sipOrders = [];
  lumpSumOrders = [];
  modelPortfolioSipOrders = [];
  modelPortfolioLumpsumOrders = [];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) { }

  ngOnInit() {
    this.globalUtility.displayLoader();
    zip(
      this.fundSchemeService.getCartOrder("SIP"),
      this.fundSchemeService.getCartOrder("LUMPSUM"),
      this.fundSchemeService.getModelportfolioOrder("SIP"),
      this.fundSchemeService.getModelportfolioOrder("LUMPSUM")
    ).subscribe(resp => {
      this.sipOrders = resp[0].data;
      this.lumpSumOrders = resp[1].data;
      this.getModelPortfolioSipOrders(resp[2]);
      this.getModelPortfolioLumpsumOrders(resp[3]);
      this.globalUtility.displayLoader(false);
    });
  }

  makePaymentModelPortfolio(index, isSip = true) {
    this.globalUtility.displayLoader();
    let paymentModel = this.getModelPortfolioPaymentModel(index, isSip);
    this.fundSchemeService.makePaymentOfModelportfolio(paymentModel).subscribe(resp => {
      this.processPayment(resp, JSON.stringify(paymentModel));
    });
  }

  confirmOrderModelPortfolio(index, isSip = true) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.confirmOrderModelportfolio(this.getModelPortfolioAllOrdersModel(index, isSip)).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == "Success") {
        if (resp.data === 'FAILED: START DATE CANNOT BE LESSER OR EQUAL THAN CURRENT DATE AFTER MARKET HOURS') this.openMessageDiaolog(resp.data, false, true);
        else {
          this.openMessageDiaolog("Order Successfully Placed.", true);
          this.changeModelPortfolioOrderStatusAfterConfirm(resp.data, index, isSip);
        }
      } else this.openMessageDiaolog(resp.data, false, true);
    });
  }

  deleteAllOrderModelPortfolio(index, isSip = true) {
    this.openConfirmDialog(`Are you sure to Delete all ${isSip ? 'SIP' : 'Lumpsum'}'s in this Portfolio?`, resp => {
      if (resp) {
        this.globalUtility.displayLoader();
        let deleteModelPortfolioRequests: Observable<any>[] = [];
        if (isSip) this.modelPortfolioSipOrders[index].forEach(mp => deleteModelPortfolioRequests.push(this.fundSchemeService.deleteOrder(mp.orderId)));
        else this.modelPortfolioLumpsumOrders[index].forEach(mp => deleteModelPortfolioRequests.push(this.fundSchemeService.deleteOrder(mp.orderId)));
        zip(...deleteModelPortfolioRequests).subscribe(resp => {
          if (isSip) {
            resp.forEach((indResp, i) => {
              if (indResp.data == "success") this.modelPortfolioSipOrders[index][i] = null;
            });
            this.modelPortfolioSipOrders[index] = this.modelPortfolioSipOrders[index].filter(x => x != null);
            if (this.modelPortfolioSipOrders[index].length == 0) {
              this.modelPortfolioSipOrders.splice(index, 1);
              this.openMessageDiaolog("Portfolio Successfully Deleted", true, false);
            }
            else this.openMessageDiaolog("Failed to Delete One or More Orders.", false, true);
          } else {
            resp.forEach((indResp, i) => {
              if (indResp.data == "success") this.modelPortfolioLumpsumOrders[index][i] = null
            });
            this.modelPortfolioLumpsumOrders[index] = this.modelPortfolioLumpsumOrders[index].filter(x => x != null);
            if (this.modelPortfolioLumpsumOrders[index].length == 0) {
              this.modelPortfolioLumpsumOrders.splice(index, 1);
              this.openMessageDiaolog("Portfolio Successfully Deleted", true, false);
            }
            else this.openMessageDiaolog("Failed to Delete One or More Orders.", false, true);
          }
          this.globalUtility.displayLoader(false);
        });
      }
    });
  }

  showConfirmCancelAllModelPortfolio(index, isSip = true) {
    this.openConfirmDialog(`Are you sure to Cancel all ${isSip ? 'SIP' : 'Lumpsum'}'s in this Portfolio?`, resp => {
      if (resp) {
        this.globalUtility.displayLoader();
        this.fundSchemeService.modelportfolioCancelAllOrder(this.getModelPortfolioAllOrdersModel(index, isSip)).subscribe(resp => {
          if (isSip) {
            resp.data.forEach(order => {
              if (order.finalResponse == "Success") this.modelPortfolioSipOrders[index] = this.modelPortfolioSipOrders[index].filter(x => x.orderId != order.orderId);
            });
            if (this.modelPortfolioSipOrders[index].length == 0) {
              this.modelPortfolioSipOrders.splice(index, 1);
              this.openMessageDiaolog("All Orders in the Portfolio have been Canceled", true);
            } else this.openMessageDiaolog(this.getModelPortfolioCancellationErrorMsg(this.modelPortfolioSipOrders[index], resp.data), false, true);
          } else {
            resp.data.forEach(order => {
              if (order.finalResponse == "Success") this.modelPortfolioLumpsumOrders[index] = this.modelPortfolioLumpsumOrders[index].filter(x => x.orderId != order.orderId);
            });
            if (this.modelPortfolioLumpsumOrders[index].length == 0) {
              this.modelPortfolioLumpsumOrders.splice(index, 1);
              this.openMessageDiaolog("All Orders in the Portfolio have been Canceled", true);
            } else this.openMessageDiaolog(this.getModelPortfolioCancellationErrorMsg(this.modelPortfolioLumpsumOrders[index], resp.data), false, true);
          }
          this.globalUtility.displayLoader(false);
        });
      }
    });
  }

  showConfirmCancel(orderId, index, isSip = true, isModelPortfolio = false, j?: number) {
    this.openConfirmDialog(`Are you sure to Cancel the ${isSip ? 'SIP' : 'Lumpsum'}?`, resp => {
      if (resp) {
        this.globalUtility.displayLoader();
        this.fundSchemeService.cancelOrder(orderId).subscribe(resp => {
          if (resp.message == "Success") {
            if (isModelPortfolio) {
              if (isSip) {
                this.modelPortfolioSipOrders[index].splice(j, 1);
                if (this.modelPortfolioSipOrders[index].length == 0) this.modelPortfolioSipOrders.splice(index, 1);
              } else {
                this.modelPortfolioLumpsumOrders[index].splice(j, 1);
                if (this.modelPortfolioLumpsumOrders[index].length == 0) this.modelPortfolioLumpsumOrders.splice(index, 1);
              }
            } else {
              if (isSip) this.sipOrders.splice(index, 1);
              else this.lumpSumOrders.splice(index, 1);
            }
            this.openMessageDiaolog(resp.data, true);
          } else this.openMessageDiaolog(resp.data, false, true);
          this.globalUtility.displayLoader(false);
        });
      }
    });
  }

  deleteOrder(orderId, index, isSip = true, isModelPortfolio = false, j?: number) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.deleteOrder(orderId).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.data == 'success') {
        this.openMessageDiaolog("Order Deleted Successfully", true);
        if (isModelPortfolio) {
          if (isSip) {
            this.modelPortfolioSipOrders[index].splice(j, 1);
            if (this.modelPortfolioSipOrders[index].length == 0) this.modelPortfolioSipOrders.splice(index, 1);
          } else {
            this.modelPortfolioLumpsumOrders[index].splice(j, 1);
            if (this.modelPortfolioLumpsumOrders[index].length == 0) this.modelPortfolioLumpsumOrders.splice(index, 1);
          }
        } else {
          if (isSip) this.sipOrders.splice(index, 1);
          else this.lumpSumOrders.splice(index, 1);
        }
      } else this.openMessageDiaolog("Error Occured while deleting Order", false, true);
    })
  }

  confirmOrder(orderId, index, isSip = true) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.confirmOrder(orderId).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == 'Success') {
        this.openMessageDiaolog(resp.data, true);
        if (isSip) this.sipOrders[index].status = "M";
        else this.lumpSumOrders[index].status = "M";
      } else this.openMessageDiaolog(resp.data, false, true);
    });
  }

  makePayment(orderId, amount) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.makePayment([{ orderId: orderId, orderAmount: amount, paymentAmount: amount }]).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      this.processPayment(resp, orderId);
    });
  }

  getSipCartOrder() {
    this.fundSchemeService.getCartOrder("SIP").subscribe(resp => {
      this.sipOrders = resp.data;
    });
  }

  getLumpsumCartOrder() {
    this.fundSchemeService.getCartOrder("LUMPSUM").subscribe(resp => {
      this.lumpSumOrders = resp.data;
    });
  }

  getModelPortfolioSipOrders(resp) {
    let mpBundleIds: number[] = [];
    resp.data.forEach(mp => {
      mpBundleIds.push(mp.mPBundleId);
    });
    let modelPortfolioResponses: Observable<any>[] = [];
    mpBundleIds.forEach(mp => {
      modelPortfolioResponses.push(this.fundSchemeService.getModelportfolioSipDetails(mp));
    });
    zip(...modelPortfolioResponses).subscribe(resp => {
      resp.forEach(indResponse => {
        this.modelPortfolioSipOrders.push(indResponse.data);
      });
    });
  }

  getModelPortfolioLumpsumOrders(resp) {
    let mpBundleIds: number[] = [];
    resp.data.forEach(mp => {
      mpBundleIds.push(mp.mPBundleId);
    });
    let modelPortfolioResponses: Observable<any>[] = [];
    mpBundleIds.forEach(mp => {
      modelPortfolioResponses.push(this.fundSchemeService.getModelportfolioSipDetails(mp));
    });
    zip(...modelPortfolioResponses).subscribe(resp => {
      resp.forEach(indResponse => {
        this.modelPortfolioLumpsumOrders.push(indResponse.data);
      });
    });
  }

  openMessageDiaolog(message, success = false, failure = false) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    });
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

  processPayment(resp, orderId) {
    if (resp.message == "Success") {
      if (!this.globalUtility.openPaymentGateway(resp.data)) {
        if (resp.data.includes("101")) {
          if (resp.data.includes('INVALID ORDER NUMBER')) {
            this.openMessageDiaolog("We are trying to retrieve order no from BSE StarMF, Please try after some time.", false, true);
          } else this.openMessageDiaolog(resp.data.slice(4), false, true);
        } else this.openMessageDiaolog(resp.data, false, true);
      }
    } else this.openMessageDiaolog(resp.data, false, true);
  }

  getModelPortfolioAllOrdersModel(index: number, isSip: boolean) {
    let model: any[] = [];
    if (isSip) this.modelPortfolioSipOrders[index].forEach(mp => {
      model.push({ 'orderId': mp.orderId });
    });
    else this.modelPortfolioLumpsumOrders[index].forEach(mp => {
      model.push({ 'orderId': mp.orderId });
    });
    return JSON.stringify(model);
  }

  getModelPortfolioPaymentModel(index: number, isSip: boolean) {
    let model: any[] = [];
    if (isSip) this.modelPortfolioSipOrders[index].forEach(mp => {
      model.push({
        'orderId': mp.orderId,
        'paymentAmount': mp.amount,
      });
    });
    else this.modelPortfolioLumpsumOrders[index].forEach(mp => {
      model.push({
        'orderId': mp.orderId,
        'paymentAmount': mp.amount,
      });
    });
    return model;
  }

  changeModelPortfolioOrderStatusAfterConfirm(resp, index: number, isSip: boolean) {
    if (isSip) this.modelPortfolioSipOrders[index].forEach(mp => {
      mp.status = 'M';
    });
    else this.modelPortfolioLumpsumOrders[index].forEach(mp => {
      mp.status = 'M';
    });
  }

  getModelPortfolioCancellationErrorMsg(orders, response): string {
    let errorString = ``;
    response = response.filter(x => x.finalResponse != "Success")
    response.forEach(resp => {
      errorString += `${orders.find(x => x.orderId == resp.orderId).schemeName} - ${resp.status} \n`;
    });
    return errorString;
  }

}
