import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { GlobalUtility } from '../..//shared/global-utility';
import { EmandateService } from '../../services/emandate.service';
import { MandateUploadComponent } from './mandate-upload/mandate-upload.component';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';

@Component({
  selector: 'app-mandate',
  templateUrl: './mandate.component.html',
  styleUrls: ['./mandate.component.scss']
})
export class MandateComponent implements OnInit {

  showCompleteMandateWarning: boolean = false;
  showMandateFailedWarning: boolean = false;
  showMandateType: boolean = false;

  constructor(
    private dialog: MatDialog,
    private globalUtility: GlobalUtility,
    private eMandateService: EmandateService
  ) { }

  ngOnInit() {
    this.globalUtility.getUserData().then(userData => {
      if (userData.isipStatus != 'APPROVED') {
        if (userData.userOverallStatus == 1 && userData.mandateStatus == '100' && userData.xsipId != null && userData.uploadMandateStatus == null) this.showCompleteMandateWarning = true;
        else if (userData.uploadMandateStatus == 'Failed') this.showMandateFailedWarning = true;
        else if (userData.uploadMandateStatus != null) this.showMandateType = true;
      }
    });
  }

  openMandateDialog() {
    this.dialog.open(MandateUploadComponent, {
      data: {
        showMandateType: this.showMandateType,
        mandateImageName: this.globalUtility.userData.userName
      }
    }).afterClosed().subscribe(resp => {
      if (resp) this.uploadMandate(resp);
    });
  }

  uploadMandate(uploadModel) {
    this.eMandateService.uploadMandateForm(JSON.stringify(uploadModel)).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.message == 'Success') {
        if (resp.data.includes('File Uploaded Successfully')) {
          this.openMessageDiaolog("Mandate Form Successfully Uploaded", true);
          this.showCompleteMandateWarning = false;
        }
        else this.openMessageDiaolog(resp.data, false, true);
      } else if (resp.message.includes('Given Format Is Not Supported.')) this.openMessageDiaolog("File Format Not Supported", false, true);
      else this.openMessageDiaolog("Failed to Upload Mandate Form", false, true);
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

}
