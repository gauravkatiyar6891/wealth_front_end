import { MatDialog } from '@angular/material';
import { GlobalUtility } from './../shared/global-utility';
import { Component, ViewEncapsulation } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, NavigationError } from "@angular/router";

@Component({
    selector: 'welcome-root',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class WelcomeComponent {

    showRouterChangeLoader: boolean = true;
    sideBarState: boolean = false;

    constructor(
        private router: Router,
        private sessionOutDialog: MatDialog,
        private globalUtility: GlobalUtility
    ) {
        this.router.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationStart) this.showRouterChangeLoader = true;
            else if (routerEvent instanceof NavigationEnd) {
                this.showRouterChangeLoader = false;
                this.globalUtility.headerShadowChange();
            }
            else if (routerEvent instanceof NavigationError) {
                this.showRouterChangeLoader = false;
                alert('Error Loading Requested Page');
                this.router.navigate(['']);
            }
        });

        this.globalUtility.$sessionExpireDialogCaller.subscribe(() => {
            this.openSessionExpireDialog();
        });
        this.globalUtility.$progressLoaderCaller.subscribe(state => {
            this.showRouterChangeLoader = state;
        });
    }


    openSessionExpireDialog() {
        this.sessionOutDialog.open(SessionOutDialog, {
            panelClass: 'session-expire-cont'
        });
    }

}

@Component({
    template: `<h1 mat-dialog-title color="primary">Session Expired</h1>
             <h4>Login again to renew your session.</h4>
             <p>Click outside the box to dismiss it.</p> `,
})
export class SessionOutDialog {
}