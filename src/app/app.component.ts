import { WINDOW } from '@ng-toolkit/universal';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { Component, OnInit, Inject } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'go4wealth',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    @Inject(WINDOW) private window: Window
  ) { }


  public ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((evt) => {
        this.snackBar.open("Updating. Just A Minute...");
        this.swUpdate.activateUpdate().then(() => {
          setTimeout(() => {
            this.window.location.reload();
          }, 500);
        });
      });
      this.swUpdate.checkForUpdate().then(() => {
        // noop
        console.log("Checked For Update");
      }).catch((err) => {
        console.error('error when checking for update', err);
      });
    }
  }

}
