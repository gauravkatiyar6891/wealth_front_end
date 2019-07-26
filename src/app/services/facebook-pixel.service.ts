import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacebookPixelService {

  constructor(
    private platform: Platform
  ) { }

  sendPageView() {
    if (environment.production && this.platform.isBrowser) {
      (<any>window).fbq('track', 'PageView');
    }
  }
}
