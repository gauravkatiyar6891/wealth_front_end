import { Observable } from 'rxjs';
import { MetaData } from './../Data/meta';
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FacebookPixelService } from './facebook-pixel.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd, Event, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteTitleMetaService implements CanActivate {


  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private fbPixel: FacebookPixelService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.title.setTitle(MetaData[next.data.index].title + " | Go4Wealth");
    MetaData[next.data.index].tags.forEach(tag => this.meta.updateTag(tag));
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationEnd) {
        this.ga.setPageView();
        this.fbPixel.sendPageView();
      }
    })
    return true;
  }
}
