import { Chart } from "billboard.js";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoalsService } from '../../services/goals.service';
import { GlobalUtility } from './../../shared/global-utility';
import { AllGoals, CustomizeGoal, ExistingInvestment } from './../../models/LocalGoals';
import { GoalsToServer, Goals, ExistingInvestmentForServer } from "./../../models/ServerGoals";
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';

declare var bb: any;

@Component({
  selector: 'app-view-goals',
  templateUrl: './view-goals.component.html',
  styleUrls: ['./view-goals.component.scss']
})
export class ViewGoalsComponent implements OnInit {

  goalData: AllGoals;
  chartControls: FormGroup;
  chart: Chart;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private goalService: GoalsService,
    private formBuilder: FormBuilder,
    private globalUtility: GlobalUtility,
  ) {
    this.chartControls = this.formBuilder.group({
      displayBy: [null],
      investmentBy: [null]
    });
    this.chartControls.controls['displayBy'].setValue('name');
    this.chartControls.controls['displayBy'].valueChanges.subscribe(value => {
      this.chart.load({
        columns: this.prepareGoalForChart(value, this.chartControls.controls['investmentBy'].value),
        unload: this.prepareGoalForChart(value == 'name' ? 'term' : 'name', this.chartControls.controls['investmentBy'].value).map(y => y[0]),
      });
    });
    this.chartControls.controls['investmentBy'].setValue('currentCost');
    this.chartControls.controls['investmentBy'].valueChanges.subscribe(value => {
      this.chart.load({
        columns: this.prepareGoalForChart(this.chartControls.controls['displayBy'].value, value)
      });
    });
  }

  ngOnInit() {
    this.globalUtility.displayLoader();
    this.globalUtility.getUserData().then(userData => {
      if (userData.userGoalExist && userData.goalSize > 0) this.getGoalsOrderDetail();
      else {
        this.globalUtility.displayLoader(false);
        this.openMessageDiaolog("You do not have any goals", false, true, true);
      }
    });
  }

  getGoalsOrderDetail() {
    this.goalService.getGoalsOrderDetail().subscribe(resp => {
      if (resp.status == '200') {
        this.goalData = this.converGoalDataFromServer(resp.data);
        this.chart = bb.generate({
          bindto: '#chart',
          data: {
            columns: this.prepareGoalForChart(this.chartControls.controls['displayBy'].value, this.chartControls.controls['investmentBy'].value),
            type: "pie"
          },
          tooltip: {
            format: {
              value: (value) => this.globalUtility.currencyInInr(value),
              name: (name) => name + ' - &#8377; '
            }
          }
        });
      }
      this.globalUtility.displayLoader(false);
    });
  }

  prepareGoalForChart(display, investment) {
    if (display == 'name') {
      let goalModel: any[] = [];
      this.goalData.goals.forEach(goal => {
        goalModel.push([goal.name, goal[investment]]);
      });
      return goalModel;
    } else {
      let goalModel: any[] = [
        ['Short Term', 0],
        ['Mid Term', 0],
        ['Long Term', 0]
      ];
      this.goalData.goals.forEach(goal => {
        if (goal.duration <= 3) goalModel[0][1] += goal[investment];
        else if (goal.duration > 3 && goal.duration <= 7) goalModel[1][1] += goal[investment];
        else goalModel[2][1] += goal[investment];
      });
      return goalModel;
    }
  }

  openMessageDiaolog(message, success = false, failure = false, callback = false) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    }).afterClosed().subscribe(() => {
      if (callback) this.router.navigate(['user/dashboard']);
    });
  }

  getGoalTerm(duration: number): string {
    if (duration <= 3) return 'short-term';
    else if (duration > 3 && duration <= 7) return 'mid-term';
    else return 'long-term';
  }

  getColorsForGoalTerm() {
    let goalColors = {
      'Short Term': 0,
      'Mid Term': 0,
      'Long Term': 0
    };
    return goalColors;
  }

  converGoalDataFromServer(goalServerData: GoalsToServer): AllGoals {
    let goalData: AllGoals;
    goalData = {
      lumpsumGoalEstimate: goalServerData.totalLumpsumSaving,
      monthlyGoalEstimate: goalServerData.totalMonthlySaving,
      netLumpSumEstimate: goalServerData.netLumpsumSaving,
      netMonthlySipEstimate: goalServerData.netMonthlySaving,
      goals: this.convertGoalsFromServer(goalServerData.goalDto),
      riskProfile: goalServerData.riskProfile
    }
    return goalData;
  }

  convertGoalsFromServer(goalServer: Goals[]): CustomizeGoal[] {
    let goals: CustomizeGoal[] = [];
    goalServer.forEach(g => {
      goals.push({
        id: g.goalId,
        name: g.goalName,
        currentCost: g.costOfGoal,
        duration: g.duration,
        futureCost: g.futureValue,
        lumpsum: g.lumPsumValue,
        monthlySip: g.pmtFutureValue,
        investmentFlag: g.investmentFlag,
        existingInvestment: this.convertExistingInvFromServer(g.assetClassDto)
      })
    })
    return goals;
  }

  convertExistingInvFromServer(exInvServer: ExistingInvestmentForServer[]): ExistingInvestment[] {
    let exInv: ExistingInvestment[] = [];
    exInvServer.forEach(e => {
      exInv.push({
        id: e.assetClassId,
        name: e.assetClass,
        currentValue: e.assetValue,
        futureValue: e.futureValue
      });
    });
    return exInv;
  }

  clearLocalGoals() {
    this.globalUtility.removeGoalFromLocalStorage();
  }

}