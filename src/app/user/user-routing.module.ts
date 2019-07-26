import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from '../services/user-auth.guard';

import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { EmandateComponent } from "./emandate/emandate.component";
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { ActiveSipComponent } from './active-sip/active-sip.component';
import { ViewGoalsComponent } from './view-goals/view-goals.component';
import { InvestmentComponent } from './investment/investment.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { ModelPortfolioInvestmentComponent } from './model-portfolio-investment/model-portfolio-investment.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Dashboard', preload: true }
  },
  {
    path: 'onboarding',
    component: OnBoardingComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Onboarding' }
  },
  {
    path: 'my-orders',
    component: OrdersComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'My Orders' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Profile' }
  },
  {
    path: 'confirm-order/:portolio/:investmentType/:bundleId',
    component: ConfirmOrderComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Confirm Order' }
  },
  {
    path: 'watchlist',
    component: WatchListComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'WatchList' }
  },
  {
    path: 'portfolios',
    component: PortfolioComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Portfolios' }
  },
  {
    path: 'transactions/:orderType/:folioNo/:schemeCode',
    component: TransactionComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Transactions' }
  },
  {
    path: 'transactions/:orderType/:orderId',
    component: TransactionComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Transactions' }
  },
  {
    path: 'investment/:keyword/:investmentType/:schemeId',
    component: InvestmentComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Investment' }
  },
  {
    path: 'create-portfolio/:portfolioName',
    component: ModelPortfolioInvestmentComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Model Portfolio' }
  },
  {
    path: 'emandate-process',
    component: EmandateComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'active-sip',
    component: ActiveSipComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Active SIP' }
  },
  {
    path: 'view-goals',
    component: ViewGoalsComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Goals' }
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [UserAuthGuard],
    data: { title: 'Cart' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

export const UserRoutingComponents = [
  CartComponent,
  OrdersComponent,
  ProfileComponent,
  EmandateComponent,
  WatchListComponent,
  DashboardComponent,
  PortfolioComponent,
  ActiveSipComponent,
  ViewGoalsComponent,
  OnBoardingComponent,
  InvestmentComponent,
  TransactionComponent,
  ConfirmOrderComponent,
  ModelPortfolioInvestmentComponent
];
