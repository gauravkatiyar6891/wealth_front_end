// import { GoalReport } from './goal-report';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './../../material';
import { PipesModule } from '../../pipes/pipes.module';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { CustomizeGoalComponent } from './customize-goal.component';
import { RiskProfileComponent } from './risk-profile/risk-profile.component';
import { AddExistingInvestmentComponent } from './add-existing-investment/add-existing-investment.component';

@NgModule({
  imports: [
    FormsModule,
    PipesModule,
    CommonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomizeGoalComponent,
      }
    ]),
    MaterialModule,
  ],
  declarations: [
    AddGoalComponent,
    RiskProfileComponent,
    CustomizeGoalComponent,
    AddExistingInvestmentComponent
  ],
  // providers: [GoalReport],
  entryComponents: [AddGoalComponent, AddExistingInvestmentComponent, RiskProfileComponent]
})
export class CustomizeGoalModule { }
