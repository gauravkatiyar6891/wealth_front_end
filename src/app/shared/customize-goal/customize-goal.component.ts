import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomizeGoalHelper } from './customize-goal';
import { UserDetails } from './../../models/UserDetails';
import { MatDialog, MatSnackBar } from '@angular/material';
import { GoalsService } from '../../services/goals.service';
import { UserService } from './../../services/user.service';
import { AddGoalComponent, NewGoal } from './add-goal/add-goal.component';
import { GlobalUtility, LocalStorageDataModel } from './../global-utility';
import { RiskProfileComponent } from './risk-profile/risk-profile.component';
import { AllGoals, PredefinedGoal, AssetClass } from '../../models/LocalGoals';
import { AddExistingInvestmentComponent } from './add-existing-investment/add-existing-investment.component';

@Component({
  selector: 'app-customize-goal',
  templateUrl: './customize-goal.component.html',
  styleUrls: ['./customize-goal.component.scss'],
  providers: [CustomizeGoalHelper]
})
export class CustomizeGoalComponent implements OnInit {

  goalData: AllGoals;
  goalDataFromServer: AllGoals;
  goalsStatus: number = GoalStatuses.NOT_DEFINED;

  predefinedGoals: PredefinedGoal[] = new Array<PredefinedGoal>();
  assetClass: AssetClass[] = new Array<AssetClass>();
  recommendedFunds: RecommendedFunds[] = new Array<RecommendedFunds>();

  currentRisk: string = '';
  riskProfileMessage: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private goalService: GoalsService,
    private globalUtility: GlobalUtility,
    private customizeGoalHelper: CustomizeGoalHelper
  ) { }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
    this.globalUtility.displayLoader();
    let isUserLoggedIn: boolean = this.globalUtility.getDataFromLocalStorage(LocalStorageDataModel.TOKEN) ? true : false;
    let requestArray = [
      this.goalService.getPredefinedGoal(),
      this.goalService.getAssetClassList(),
      this.goalService.getUserRiskProfile(17)
    ];
    // if (isUserLoggedIn) requestArray.push(this.userService.getUserDetails());

    zip(...requestArray).subscribe(resp => {
      if (resp[0].status == '200') this.predefinedGoals = this.customizeGoalHelper.getNewGoalModel(resp[0].data);
      if (resp[1].status == '200') this.assetClass = this.customizeGoalHelper.getAssetClassModel(resp[1].data);
      if (resp[2].status == '200') {
        this.currentRisk = resp[2].data.riskProfile;
        this.riskProfileMessage = resp[2].data.riskProfileMsg;
        this.recommendedFunds = resp[2].data.suggestSchemeList.slice(0, 6);
      }
      if (isUserLoggedIn) {
        let userData: UserDetails = this.globalUtility.userData;


        if (userData && userData.userGoalExist) {

          if (userData.goalSize > 0) {
            this.goalService.getGoalsOrderDetail().subscribe(resp => {
              if (resp.status == '200') {
                if (this.globalUtility.getGoalFromLocalStorage()) {
                  this.goalDataFromServer = this.customizeGoalHelper.converGoalDataFromServer(resp.data);
                  this.goalData = this.globalUtility.getGoalFromLocalStorage();
                  this.goalsStatus = GoalStatuses.MERGE;
                } else {
                  this.goalData = this.customizeGoalHelper.converGoalDataFromServer(resp.data);
                  this.goalsStatus = GoalStatuses.REPLACE;
                }
                this.globalUtility.displayLoader(false);
              }
            });
          } else {
            if (this.globalUtility.getGoalFromLocalStorage()) {
              this.goalData = this.globalUtility.getGoalFromLocalStorage();
              this.goalsStatus = GoalStatuses.REPLACE;
            } else this.goalsStatus = GoalStatuses.NO_GOAL;
            this.globalUtility.displayLoader(false);
          }


        } else {
          this.goalData = this.globalUtility.getGoalFromLocalStorage();
          this.goalsStatus = GoalStatuses.CREATE;
          this.globalUtility.displayLoader(false);
        }



      } else if (this.globalUtility.getGoalFromLocalStorage()) {
        this.goalData = this.globalUtility.getGoalFromLocalStorage();
        if (this.goalData.goals.length == 0) this.goalsStatus = GoalStatuses.NO_GOAL;
        else this.goalsStatus = GoalStatuses.SAVE_LOCALLY;
        this.globalUtility.displayLoader(false);
      } else {
        this.goalsStatus = GoalStatuses.NO_GOAL;
        this.globalUtility.displayLoader(false);
      }
    });
  }

  reCalculateGoal(index) {
    if (!this.goalData.goals[index].duration) return;
    this.goalData = this.customizeGoalHelper.getEstimates(this.goalData);
  }

  openAddGoalDialog() {
    this.dialog.open(AddGoalComponent, {
      panelClass: 'add-goal-cont',
      data: this.predefinedGoals.filter(predefineGoal => this.goalData.goals.findIndex(goal => goal.name == predefineGoal.name) == -1)
    }).beforeClose().subscribe((data: NewGoal) => {
      if (data) this.goalData = this.customizeGoalHelper.addNewGoal(this.goalData, data);
    });
  }

  openAddExistingInvestment() {
    this.dialog.open(AddExistingInvestmentComponent, {
      panelClass: 'add-goal-cont',
      data: {
        assetClass: this.assetClass,
        goals: this.goalData.goals.filter(g => g.currentCost != 0)
      }
    }).beforeClose().subscribe(data => {
      if (data) this.goalData = this.customizeGoalHelper.addExistingInvestmentToGoals(this.goalData, data, this.assetClass);
    });
  }

  removeGoal(index) {
    if (this.goalData.goals[index].investmentFlag) {
      this.snackBar.open('Goals Associated with an Investment cannot be removed', '', { duration: 3000 });
    } else {
      this.goalData.goals.splice(index, 1);
      this.goalData = this.customizeGoalHelper.getEstimates(this.goalData);
    }
  }

  removeExistingInvestment(exInvIndex: number, goalIndex: number) {
    this.goalData.goals[goalIndex].existingInvestment.splice(exInvIndex, 1);
    this.goalData = this.customizeGoalHelper.getEstimates(this.goalData);
  }

  openRiskProfileDialog() {
    this.dialog.open(RiskProfileComponent, {
      panelClass: 'risk-profile-cont'
    }).beforeClose().subscribe(sum => {
      if (sum) {
        this.globalUtility.displayLoader();
        this.goalService.getUserRiskProfile(sum).subscribe(resp => {
          if (resp.status == '200') {
            // this.goalData.riskProfile = resp.data.riskProfile;
            this.currentRisk = resp.data.riskProfile;
            this.riskProfileMessage = resp.data.riskProfileMsg;
            this.recommendedFunds = resp.data.suggestSchemeList.slice(0, 6);
          }
          this.globalUtility.displayLoader(false);
        });
      }
    });
  }

  saveGoals() {
    this.globalUtility.displayLoader();
    switch (this.goalsStatus) {
      case GoalStatuses.CREATE: this.goalService.createGoals(this.customizeGoalHelper.getGoalsDataForServer(this.goalData)).subscribe(resp => {
        if (resp.status == '200') {
          this.snackBar.open("Goals Successfully Saved", "", { duration: 3000 });
          this.globalUtility.removeGoalFromLocalStorage();
          this.globalUtility.displayLoader(false);
        }
      });
        break;
      case GoalStatuses.REPLACE: this.goalService.replaceGoals(this.customizeGoalHelper.getGoalsDataForServer(this.goalData)).subscribe(resp => {
        if (resp.status == '200') {
          this.snackBar.open("Goals Successfully Saved", "", { duration: 3000 });
          this.globalUtility.removeGoalFromLocalStorage();
          this.globalUtility.displayLoader(false);
        }
      });
        break;
      case GoalStatuses.SAVE_LOCALLY: {
        this.globalUtility.setGoalToLocalStorage(this.goalData);
        this.snackBar.open("Goals Saved Locally", "", { duration: 3000 });
        this.globalUtility.displayLoader(false);
      }
        break;
      case GoalStatuses.MERGE: this.mergeGoals();
        break;
      default: {
        this.snackBar.open("Error Saving", "", { duration: 3000 });
        this.globalUtility.displayLoader(false);
      }
    }
  }

  mergeGoals() {
    this.globalUtility.displayLoader();
    let goalsWithNonZeroCurrentAmount = this.goalData.goals.filter(g => g.currentCost != 0);
    let localGoalsNameArray = goalsWithNonZeroCurrentAmount.map(g => g.name);
    this.goalDataFromServer = {
      goals: this.goalDataFromServer.goals.filter(g => (g.investmentFlag || localGoalsNameArray.indexOf(g.name) != -1)),
      lumpsumGoalEstimate: 0,
      monthlyGoalEstimate: 0,
      netLumpSumEstimate: 0,
      netMonthlySipEstimate: 0,
      riskProfile: this.goalDataFromServer.riskProfile
    }
    this.goalDataFromServer.goals.forEach(goal => {
      let searchIndex = localGoalsNameArray.indexOf(goal.name);
      if (searchIndex != -1) {
        goal.duration = goalsWithNonZeroCurrentAmount[searchIndex].duration;
        goal.currentCost = goalsWithNonZeroCurrentAmount[searchIndex].currentCost;
        goal.existingInvestment = goalsWithNonZeroCurrentAmount[searchIndex].existingInvestment;//need to change
      }
    });
    this.goalDataFromServer.goals = this.goalDataFromServer.goals.concat(goalsWithNonZeroCurrentAmount.filter(g => this.goalDataFromServer.goals.map(g => g.name).indexOf(g.name) == -1));
    this.goalDataFromServer = this.customizeGoalHelper.getEstimates(this.goalDataFromServer);
    this.goalService.replaceGoals(this.customizeGoalHelper.getGoalsDataForServer(this.goalDataFromServer)).subscribe(resp => {
      if (resp.status == '200') {
        this.snackBar.open("Goals Successfully Merged", "", { duration: 3000 });
        this.goalData = this.goalDataFromServer;
        this.goalsStatus = GoalStatuses.REPLACE;
        this.globalUtility.removeGoalFromLocalStorage();
        this.globalUtility.displayLoader(false);
      }
    });
  }

  displayExistingInvestmentLength(): boolean {
    // console.log([].concat.apply([], this.goalData.goals.map(g => g.existingInvestment)));
    return ([].concat.apply([], this.goalData.goals.map(g => g.existingInvestment))).length != 0;
  }

}

export interface RecommendedFunds {
  schemeId: number,
  schemeCode: string,
  schemeName: string,
  schemeType: string,
  schemeKeyword: string,
  schemeLaunchDate: string,
  minimumPurchaseAmount: number
}

export enum GoalStatuses {
  NOT_DEFINED = 0,
  CREATE = 1,
  REPLACE = 2,
  MERGE = 3,
  SAVE_LOCALLY = 4,
  NO_GOAL = 5
}