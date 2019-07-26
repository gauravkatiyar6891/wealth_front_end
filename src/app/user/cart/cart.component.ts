import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalUtility } from './../../shared/global-utility';
import { DialogService } from './../../services/dialog.service';
import { OrderDetails, OrderPayment } from './../../models/order';
import { FundschemeService } from './../../services/fundscheme.service';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  ordersList: OrderDetails[] = null;

  displayedColumns: string[] = ['bseOrderId', 'schemeName', 'amount', 'type', 'status', 'action'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) {
    // this.dataSource = new MatTableDataSource(this.userData);
    // this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.globalUtility.displayLoader();
    zip(this.fundSchemeService.getCartOrder('SIP'), this.fundSchemeService.getCartOrder("LUMPSUM")).subscribe(resp => {
      this.ordersList = [];
      if (resp[0].status == '200') this.concatOrders(resp[0].data);
      if (resp[1].status == '200') this.concatOrders(resp[1].data);
      this.globalUtility.displayLoader(false);
      this.ordersList.forEach(o => { if (o.investmentType == 'LUMPSUM') o.bseOrderId = o.lumpsumOrderId });
      // this.ordersList[0].status = 'W';
      this.dataSource = new MatTableDataSource(this.ordersList);
      this.dataSource.sort = this.sort;
      // console.log(this.ordersList);
    });
  }

  concatOrders(data: any[]) {
    data.forEach(d => this.ordersList.push(d));
  }

  placeAllOrders() {
    let cartOrders = this.ordersList.filter(o => o.status == 'P');
    cartOrders.forEach(c => c.status = 'W');
    let modelOrders: any[] = [];
    cartOrders.forEach(c => modelOrders.push({ orderId: c.orderId }));
    this.fundSchemeService.confirmOrderModelportfolio(JSON.stringify(modelOrders)).subscribe(resp => {
      resp.data.forEach(o => {
        let searchOrder = this.ordersList.find(or => or.orderId == o.orderId);
        if (!o.status.includes('FAILED')) {
          searchOrder.status = 'M';
          searchOrder.bseOrderId = o.bseOrderId;
        }
        else searchOrder.status = 'P';
      });
    });
  }

  placeOrderIndividually(order: OrderDetails): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      order.status = 'W';
      this.fundSchemeService.confirmOrder(order.orderId.toString()).subscribe(resp => {
        if (resp.message == 'Success') order.status = 'M';
        else order.status = 'P';
        resolve(true);
      });
    });
  }

  getPayAllButtonStatus(): boolean {
    return this.ordersList.filter(o => o.status == 'M').length == this.ordersList.length;
  }

  payAllOrders() {
    this.globalUtility.displayLoader();
    let paymentOrders: OrderPayment[] = [];
    this.ordersList.filter(o => o.status == 'M').forEach(o => paymentOrders.push({ orderId: o.orderId.toString(), orderAmount: o.amount, paymentAmount: o.amount }));
    paymentOrders[0].paymentAmount = paymentOrders.reduce((a, b) => a + b.orderAmount, 0);
    this.fundSchemeService.makePayment(paymentOrders).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == "Success") {
        if (!this.globalUtility.openPaymentGateway(resp.data)) {
          if (resp.data.includes("101")) {
            if (resp.data.includes('INVALID ORDER NUMBER')) {
              this.dialogService.displayMessage("We are trying to retrieve order no from BSE StarMF, Please try after some time.", false);
            } else this.dialogService.displayMessage(resp.data.slice(4), false);
          } else this.dialogService.displayMessage(resp.data, false);
        }
      } else {
        this.dialogService.displayMessage(resp.data, false);
      }
    });
  }

  payIndividualOrder(order: OrderDetails) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.makePayment([{ orderId: order.orderId.toString(), orderAmount: order.amount, paymentAmount: order.amount }]).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == "Success") {
        if (!this.globalUtility.openPaymentGateway(resp.data)) {
          if (resp.data.includes("101")) {
            if (resp.data.includes('INVALID ORDER NUMBER')) {
              this.dialogService.displayMessage("We are trying to retrieve order no from BSE StarMF, Please try after some time.", false);
            } else this.dialogService.displayMessage(resp.data.slice(4), false);
          } else this.dialogService.displayMessage(resp.data, false);
        }
      } else {
        this.dialogService.displayMessage(resp.data, false);
      }
    })
  }

  displayConfirmCancelDialog(i: number, cancel: boolean) {
    this.dialogService.confirmDialog('Are you sure want to cancel the order ?', 'No', 'Cancel Order', resp => {
      if (resp) {
        if (cancel) this.cancelOrder(i);
        else this.deleteOrder(i);
      }
    });
  }

  cancelOrder(i: number) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.cancelOrder(this.ordersList[i].orderId.toString()).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == "Success") {
        this.dialogService.displayMessage('Order Canceled Successfully', true);
        this.ordersList.splice(i, 1);
      } else this.dialogService.displayMessage('Error Occured while deleting order', false);
    });
  }

  deleteOrder(i: number) {
    this.globalUtility.displayLoader();
    this.fundSchemeService.deleteOrder(this.ordersList[i].orderId.toString()).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.data == 'success') {
        this.dialogService.displayMessage('Order Canceled Successfully', true);
        this.ordersList.splice(i, 1);
      } else this.dialogService.displayMessage('Error Occured while deleting order', false);
    });
  }

  getOrderStatusString(status: string): string {
    switch (status) {
      case 'M':
        return 'Confirm';
        break;
      case 'P':
        return 'Pending';
        break;
      case 'W':
        return 'Working'
        break;
    }
  }

  // openMessageDiaolog(message, gotoInv: boolean = true, success = false, failure = false) {
  //   this.dialog.open(MessageDialogComponent, {
  //     data: {
  //       message: message,
  //       success: success,
  //       failure: failure
  //     }
  //   }).afterClosed().subscribe(() => {
  //     if (gotoInv) {
  //       this.router.navigate(['mutual-funds']);
  //     }
  //   })
  // }

}
