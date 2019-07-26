import { HomeHelper } from '../home/home';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { GoalsService } from './../../services/goals.service';
import { GlobalUtility } from './../../shared/global-utility';
import { HomeGoalModel, AllGoals } from './../../models/LocalGoals';

@Component({
  selector: 'g4w-goal-planner',
  templateUrl: './goal-planner.component.html',
  styleUrls: ['./goal-planner.component.scss'],
  providers: [HomeHelper]
})
export class GoalPlannerComponent implements OnInit {

  @ViewChild("goalPlanner") goalPlannerTagRef: ElementRef;

  returnValueCalc: FormGroup;

  cityList: any[];

  goalsData: AllGoals;
  goalCost: number = 0;
  showGoals: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private homeHelper: HomeHelper,
    private formBuilder: FormBuilder,
    private sipService: GoalsService,
    private globalUtility: GlobalUtility,
  ) {
    this.returnValueCalc = this.formBuilder.group({
      residence: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      age: [20],
      income: [2],
      kids: [0]
    });
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment == 'goal-planner') this.goalPlannerTagRef.nativeElement.scrollIntoView();
      else this.globalUtility.scrollAnimateTo(0);
    });

    this.returnValueCalc.controls['kids'].disable();
    this.returnValueCalc.controls['maritalStatus'].valueChanges.subscribe((state) => {
      if (state == 1 || state == 3) this.returnValueCalc.controls['kids'].enable();
      else {
        this.returnValueCalc.controls['kids'].disable();
        this.returnValueCalc.controls['kids'].setValue(0);
      }
    });
    this.sipService.getCityList().subscribe(resp => {
      if (resp.status == 200) {
        this.cityList = resp.data;
        this.cityList.sort((a, b) => a.cityName.localeCompare(b.cityName));
      }
    });
  }

  fetchGoals() {
    if (this.returnValueCalc.invalid) return;
    this.globalUtility.displayLoader();
    // this.ga.sendEvent('Goal Calculator', 'Click', 'Goal Calculated on Home Page');
    let userGoalPlan: HomeGoalModel = this.homeHelper.getUserGoalPlanningData(this.returnValueCalc);
    this.sipService.calculateSip(userGoalPlan).subscribe((resp) => {
      if (resp.status == 200) {
        this.goalsData = this.homeHelper.getGoalsForLocalStorage(resp.data.goalList);
        this.goalCost = this.goalsData.goals.map(g => g.futureCost).reduce((a, b) => a + b, 0);
        this.globalUtility.setGoalToLocalStorage(this.goalsData);
        this.showGoals = true;
      }
      this.globalUtility.displayLoader(false);
    });
  }

  getGoalTermClass(duration: number): string {
    if (duration <= 3) return 'short-term';
    else if (duration > 3 && duration <= 7) return 'mid-term';
    else return 'long-term';
  }

  getGoalsLength() {
    return this.goalsData.goals.filter(g => g.currentCost != 0).length;
  }

}
