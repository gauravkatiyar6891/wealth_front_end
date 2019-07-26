import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  message: string = "";
  success: boolean = false;
  failure: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.message = data.message;
    this.success = data.success;
    this.failure = data.failure;
  }

  ngOnInit() {
  }

}
