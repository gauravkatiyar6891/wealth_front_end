import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutePreloadingService implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      this.preloadedModules.push(route.path);
      return load();
    } else return of(null);
  }

  constructor() { }
}
