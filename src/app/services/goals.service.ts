import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { GlobalUtility } from '../shared/global-utility';
import { ApiRoutingService } from './api-routing.service';
import { HttpHelperService } from './http-helper.service';
import { HomeGoalModel } from "../models/LocalGoals";
import { GoalsToServer } from '../models/ServerGoals';

@Injectable()
export class GoalsService {

  constructor(private httpHelper: HttpHelperService, private apiRoutingService: ApiRoutingService, private globalUtility: GlobalUtility) { }

  getCityList() {
    return this.httpHelper.get(this.apiRoutingService.getCityListUrl(), null, false);
  }

  getMaritalList() {
    return this.httpHelper.get(this.apiRoutingService.getMaritalUrl(), null, false);
  }

  calculateSip(sip: HomeGoalModel) {
    return this.httpHelper.post(this.apiRoutingService.getSipcallUrl(), sip, false, false);
  }

  getAssetClassList() {
    return this.httpHelper.get(this.apiRoutingService.getAssetClassListUrl(), null, false);
  }

  getUserRiskProfile(riskSum: number) {
    return this.httpHelper.get(this.apiRoutingService.getUserRiskProfileUrl(riskSum), null, false);
  }

  createGoals(goalData: GoalsToServer) {
    return this.httpHelper.post(this.apiRoutingService.getCreateGoalsUrl(), goalData, false, true).pipe(map(resp => {
      if (resp.status == '200') [this.globalUtility.userData.userGoalExist, this.globalUtility.userData.goalSize] = [true, goalData.goalDto.length];
      return resp;
    }));
  }

  replaceGoals(goalData: GoalsToServer) {
    return this.httpHelper.post(this.apiRoutingService.getReplaceGoalsUrl(), goalData, false, true).pipe(map(resp => {
      if (resp.status == '200') this.globalUtility.userData.goalSize = goalData.goalDto.length;
      return resp;
    }));
  }

  getGoalsOrderDetail() {
    return this.httpHelper.get(this.apiRoutingService.getGoalsOrderDetailUrl(), null, true);
  }

  getPredefinedGoal() {
    return this.httpHelper.get(this.apiRoutingService.getPredefinedGoalUrl(), null, false);
  }

}