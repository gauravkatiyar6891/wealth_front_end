import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { GlobalUtility } from './../shared/global-utility';
import { Router, Event, NavigationEnd } from '@angular/router';
import { FacebookPixelService } from './facebook-pixel.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// declare const fbq: any;

@Injectable()

export class RouteTitleService implements CanActivate {
  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private globalUtility: GlobalUtility,
    private fbPixel: FacebookPixelService,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.title.setTitle(next.data.title + " - Go4Wealth");
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationEnd) {
        // this.globalUtility.scrollAnimateTo(0);
        this.ga.setPageView();
        this.fbPixel.sendPageView();
      }
    })
    return true;
  }
}
