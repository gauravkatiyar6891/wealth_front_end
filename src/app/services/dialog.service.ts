import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../messages/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from '../messages/confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  displayMessage(message: string, success: boolean, callback?) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: !success
      }
    }).afterClosed().subscribe(resp => {
      if (callback) callback(resp);
    });
  }

  confirmDialog(message: string, cancelButtonName: string, confirmButtonName: string, callback?) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: message,
        cancelButtonName: cancelButtonName,
        confirmButtonName: confirmButtonName
      }
    }).afterClosed().subscribe(resp => {
      if (callback) callback(resp);
    });
  }

}
