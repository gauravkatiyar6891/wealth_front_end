import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome.component';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from '../services/user-auth.guard';
import { RouteTitleService } from '../services/route-title.service';
import { RouteTitleMetaService } from '../services/route-title-meta.service';

const routes: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [RouteTitleMetaService],
    data: { index: 0 }
  },
  {
    path: 'about-pages',
    loadChildren: './../shared/about-pages/about-pages.module#AboutPagesModule',
    canActivate: [RouteTitleService],
    data: { title: 'About Us', preload: false },
  },
  {
    path: 'goal-planning',
    loadChildren: './../shared/customize-goal/customize-goal.module#CustomizeGoalModule',
    canActivate: [RouteTitleService],
    data: { title: 'Goal Planning', preload: false }
  },
  {
    path: 'mutual-funds',
    loadChildren: './../shared/mutual-funds/mutual-funds.module#MutualFundsModule',
    canActivate: [RouteTitleService],
    data: { title: 'Mutual Funds', preload: true }
  },
  // {
  //   path: "modelportfolio",
  //   loadChildren: '../shared/model-portfolio/model-portfolio.module#ModelPortfolioModule',
  //   canActivate: [RouteTitleService],
  //   data: { title: 'Model Portfolio', preload: true }
  // },
  {
    path: 'faq',
    loadChildren: './../shared/faq/faq.module#FaqModule',
    canActivate: [RouteTitleService],
    data: { title: 'Frequently Asked Questions', preload: false }
  },
  {
    path: 'privacy-policy',
    loadChildren: './../shared/privacy-policy/privacy-policy.module#PrivacyPolicyModule',
    canActivate: [RouteTitleService],
    data: { title: 'Privacy Policy', preload: false }
  },
  {
    path: 'terms-and-conditions',
    loadChildren: './../shared/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsModule',
    canActivate: [RouteTitleService],
    data: { title: 'Terms And Conditions', preload: false }
  },
  {
    path: 'blogs',
    loadChildren: '../shared/blogs/blogs.module#BlogsModule'
  },
  {
    path: 'user/verify-email',
    loadChildren: './../shared/verify-email/verify-email.module#VerifyEmailModule'
  },
  {
    path: 'user',
    loadChildren: './../user/user.module#UserModule',
    canLoad: [UserAuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

const parentRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    children: routes
  }
];

@NgModule({
  imports: [RouterModule.forChild(parentRoutes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
export const WelcomeRoutingComponents = [
  HomeComponent
];