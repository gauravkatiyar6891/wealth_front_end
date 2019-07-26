import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(
    private router: Router,
    private platform: Platform
  ) { }

  setPageView() {
    if (environment.production && this.platform.isBrowser) {
      (<any>window).gtag('config', 'UA-131173425-1', {
        'page_path': this.router.url
      });
    }
  }

  sendEvent(category: string, event: string, label: string) {
    (<any>window).ga('send', 'event', {
      eventCategory: category,
      eventAction: event,
      eventLabel: label
    });
  }
}

