import { NgModule } from '@angular/core';
import { MaterialModule } from './../material';
import { CommonModule } from '@angular/common';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogService } from '../services/dialog.service';

@NgModule({
  declarations: [MessageDialogComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [DialogService],
  entryComponents: [MessageDialogComponent, ConfirmDialogComponent]
})
export class MessagesModule { }
