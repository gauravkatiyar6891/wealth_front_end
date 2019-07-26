import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutePreloadingService } from './services/route-preloading.service';


const routes: Routes = [
  {
    path: '',
    loadChildren: './welcome/welcome.module#WelcomeModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: RoutePreloadingService,
    onSameUrlNavigation: 'reload',
    // scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
