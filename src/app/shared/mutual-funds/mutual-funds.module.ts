import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../material';
import { PipesModule } from './../../pipes/pipes.module';
import { MessagesModule } from './../../messages/messages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllFundsComponent } from './all-funds/all-funds.component';
import { FundschemeService } from '../../services/fundscheme.service';
import { MutualFundsRouteResolver } from './mutual-funds-route-resolver';
import { FundOverviewComponent } from './fund-overview/fund-overview.component';
import { MutualFundDetailsComponent } from './mutual-fund-details/mutual-fund-details.component';
import { ModelPortfolioDetailsComponent } from './model-portfolio-details/model-portfolio-details.component';

@NgModule({
  declarations: [
    AllFundsComponent,
    FundOverviewComponent,
    MutualFundDetailsComponent,
    ModelPortfolioDetailsComponent,
  ],
  imports: [
    PipesModule,
    FormsModule,
    CommonModule,
    MessagesModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'topfunds',
        pathMatch: 'full'
      },
      {
        path: 'topfunds',
        component: FundOverviewComponent,
        // resolve: {
        //   scheme: MutualFundsRouteResolver
        // }
      },
      {
        path: 'all',
        component: AllFundsComponent
      },
      {
        path: 'scheme/:schemeName',
        component: MutualFundDetailsComponent
      },
      {
        path: 'portfolio/:portfolioName',
        component: ModelPortfolioDetailsComponent
      }
    ])
  ],
  providers: [
    FundschemeService,
    MutualFundsRouteResolver
  ]
})
export class MutualFundsModule { }
