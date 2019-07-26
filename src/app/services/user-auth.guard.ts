import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, Event, NavigationEnd } from '@angular/router';
import { FacebookPixelService } from './facebook-pixel.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { GlobalUtility, LocalStorageDataModel } from './../shared/global-utility';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate, CanLoad {
  snapshot: ActivatedRouteSnapshot;

  constructor(
    private title: Title,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private globalUtility: GlobalUtility,
    private fbPixel: FacebookPixelService
  ) { }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    if (this.globalUtility.getDataFromLocalStorage(LocalStorageDataModel.TOKEN)) return true;
    else {
      this.router.navigate(['/']);
      return false;
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationEnd) {
        this.globalUtility.scrollAnimateTo(0);
        this.ga.setPageView();
        this.fbPixel.sendPageView();
      }
    })
    this.title.setTitle((next.data.title ? next.data.title : 'Go4Wealth') + " - Go4Wealth");
    if (this.globalUtility.getDataFromLocalStorage(LocalStorageDataModel.TOKEN)) return true;
    else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
