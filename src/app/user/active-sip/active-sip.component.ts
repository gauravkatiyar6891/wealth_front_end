import { Component, OnInit } from '@angular/core';
import { GlobalUtility } from './../../shared/global-utility';
import { DialogService } from './../../services/dialog.service';
import { FundschemeService } from './../../services/fundscheme.service';

@Component({
  selector: 'app-active-sip',
  templateUrl: './active-sip.component.html',
  styleUrls: ['./active-sip.component.scss']
})
export class ActiveSipComponent implements OnInit {

  activeSipList: ActiveSip[];

  constructor(
    private globalUtility: GlobalUtility,
    private dialogService: DialogService,
    private fundSchemeService: FundschemeService
  ) { }

  ngOnInit() {
    this.globalUtility.displayLoader();
    this.fundSchemeService.getSipOrdersList().subscribe(resp => {
      if (resp.status == '200') this.activeSipList = this.getActiveSipListFromResponse(resp.data);
      this.globalUtility.displayLoader(false);
    });
  }

  getActiveSipListFromResponse(data: Array<any>): ActiveSip[] {
    let activeSip: ActiveSip[] = [];
    data.forEach(sip => {
      activeSip.push({
        orderId: sip.orderId,
        bseOrderId: sip.bseOrderId,
        sipRegnId: sip.sipRegnId,
        status: sip.status,
        schemeName: sip.schemeName,
        dayOfSip: sip.dayOfSip,
        amount: sip.amount,
        sipDate: sip.sipDate
      });
    });
    return activeSip;
  }

  cancelActiveSip(orderId) {
    this.dialogService.confirmDialog('Are you sure want to cancel the SIP?', 'No', 'Proceed', resp => {
      if (resp) {
        this.globalUtility.displayLoader();
        this.fundSchemeService.cancelOrder(orderId).subscribe(resp => {
          this.globalUtility.displayLoader(false);
          if (resp.message == "Success") {
            this.dialogService.displayMessage(resp.data, true);
            this.activeSipList.splice(this.activeSipList.findIndex(g => g.orderId == orderId), 1);
          }
          else this.dialogService.displayMessage(resp.data, false);
        });
      }
    });
    // this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     message: 'Are you sure want to cancel the SIP?',
    //     cancelButtonName: 'No',
    //     confirmButtonName: 'Proceed'
    //   }
    // }).afterClosed().subscribe(resp => {
    //   if (resp) {
    //     this.globalUtility.displayLoader();
    //     this.fundSchemeService.cancelOrder(orderId).subscribe(resp => {
    //       this.globalUtility.displayLoader(false);
    //       if (resp.message == "Success") {
    //         this.globalUtility.displayMessage(resp.data, true);
    //         this.activeSipList.splice(this.activeSipList.findIndex(g => g.orderId == orderId), 1);
    //       }
    //       else this.globalUtility.displayMessage(resp.data, false);
    //     });
    //   }
    // });
  }

}

export interface ActiveSip {
  orderId: number,
  bseOrderId: number,
  sipRegnId: number,
  status: string,
  schemeName: string,
  dayOfSip: string,
  amount: number
  sipDate: string
}