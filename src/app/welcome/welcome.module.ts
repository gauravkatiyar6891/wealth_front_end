import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "../material";
import { PipesModule } from './../pipes/pipes.module';
import { ClickOutsideModule } from 'ng4-click-outside';
import { WelcomeRoutingModule, WelcomeRoutingComponents } from './welcome-routing.module';

import { HomeHelper } from './home/home';
import { GoalsService } from '../services/goals.service';
import { GlobalUtility } from "../shared/global-utility";
import { UserService } from '../services/user.service';
import { HttpHelperService } from './../services/http-helper.service';
import { RouteTitleService } from './../services/route-title.service';
import { ApiRoutingService } from './../services/api-routing.service';
import { RouteTitleMetaService } from '../services/route-title-meta.service';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeComponent, SessionOutDialog } from './welcome.component';
import { MobSideNavComponent } from './mob-side-nav/mob-side-nav.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { EmailIdDialogComponent } from './email-id-dialog/email-id-dialog.component';
import { ComparisonGraphComponent } from './comparison-graph/comparison-graph.component';
import { GoalPlannerComponent } from './goal-planner/goal-planner.component';


@NgModule({
  imports: [
    PipesModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    HttpClientModule,
    ClickOutsideModule,
    ReactiveFormsModule,
    WelcomeRoutingModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SessionOutDialog,
    WelcomeComponent,
    LoginSignupComponent,
    EmailIdDialogComponent,
    WelcomeRoutingComponents,
    MobSideNavComponent,
    ComparisonGraphComponent,
    GoalPlannerComponent,
  ],
  providers: [
    HomeHelper,
    GoalsService,
    GlobalUtility,
    UserService,
    HttpHelperService,
    ApiRoutingService,
    RouteTitleService,
    RouteTitleMetaService
  ],
  entryComponents: [
    SessionOutDialog,
    LoginSignupComponent,
    EmailIdDialogComponent,
  ]
})
export class WelcomeModule { }