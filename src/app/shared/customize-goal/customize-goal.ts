import { Finance } from "financejs";
import { Injectable } from "@angular/core";
import { NewGoal } from './add-goal/add-goal.component';
import { GoalsToServer, Goals, ExistingInvestmentForServer } from '../../models/ServerGoals';
import { AllGoals, CustomizeGoal, ExistingInvestment, AssetClass, PredefinedGoal } from '../../models/LocalGoals';

@Injectable()
export class CustomizeGoalHelper {

    financeCalc: Finance;
    readonly DEFAULT_RISK_PROFILE: string = 'HIGH_HIGH';
    readonly ROI: number = 15;
    readonly INFLATION: number = 5;
    readonly HIGH_RISK_PROFILE: number = 20;
    readonly POST_RETIRE_ROI: number = 8;
    readonly SURVIVAL_YEAR: number = 20;
    readonly RETIREMENT_AGE: number = 60;
    readonly RETIREMENT_GOAL = "Pension/Retirement Plan";
    readonly MY_1ST_CRORE = "My 1st Crore";
    //retirement age will be age to retire - current age with min of 5years

    constructor() {
        this.financeCalc = new Finance();
    }

    getFutureValue(cost: number, duration: number, roi = this.INFLATION): number {
        if (cost == 0 || duration == 0) return 0;
        if (duration <= 3) return cost;
        return this.financeCalc.FV(roi, cost, duration);
    }

    getMonthlySip(futureValue: number, duration: number): number {
        if (futureValue == 0 || duration == 0) return 0;
        duration *= 12;
        let rate = this.ROI / (100 * 12);
        return rate * futureValue / (Math.pow(1 + rate, duration) - 1);
    }

    getLumpSum(cost: number, duration: number, roi = this.ROI): number {
        if (cost == 0 || duration == 0) return 0;
        duration *= 12;
        let rate = roi / (100 * 12);
        return cost / Math.pow((1 + rate), duration);
    }

    getRetirementCorpus(cost: number, duration: number): number {
        if (cost == 0 || duration == 0) return 0;
        let fv = this.getFutureValue(cost, duration);
        let survivalYearInMonths = this.SURVIVAL_YEAR * 12;
        let rate = (((1 + this.POST_RETIRE_ROI / 100) / (1 + this.INFLATION / 100)) - 1) / 12;
        let corpus = (((1 - Math.pow(rate + 1, survivalYearInMonths)) / rate) * (-fv)) / Math.pow(rate + 1, survivalYearInMonths);
        return corpus;
    }

    getAssetClassModel(assets: Array<any>): AssetClass[] {
        let assetClass: AssetClass[] = [];
        assets.forEach(asset => {
            assetClass.push({
                id: asset.assetClassId,
                name: asset.assetClass,
                roi: asset.assetClassRoi
            });
        });
        return assetClass;
    }

    getNewGoalModel(goals: Array<any>): PredefinedGoal[] {
        let predefinedGoals: PredefinedGoal[] = [];
        goals.forEach(goal => {
            predefinedGoals.push({
                id: goal.goalId,
                name: goal.goalName,
                cost: goal.costOfGoal,
                duration: goal.duration
            });
        })
        return predefinedGoals;
    }

    addNewGoal(goalData: AllGoals, newGoal: NewGoal): AllGoals {
        goalData.goals.push({
            id: goalData.goals.length,
            name: newGoal.goalName,
            duration: newGoal.duration,
            currentCost: newGoal.costOfGoal,
            investmentFlag: false,
            futureCost: this.getFutureValue(newGoal.costOfGoal, newGoal.duration),
            monthlySip: this.getMonthlySip(this.getFutureValue(newGoal.costOfGoal, newGoal.duration), newGoal.duration),
            lumpsum: this.getLumpSum(this.getFutureValue(newGoal.costOfGoal, newGoal.duration), newGoal.duration),
            existingInvestment: new Array<ExistingInvestment>()
        });
        goalData = this.getEstimates(goalData);
        return goalData;
    }

    addExistingInvestmentToGoals(goalData: AllGoals, data, assetClass: AssetClass[]): AllGoals {
        let targetedGoal = goalData.goals.find(g => g.id == data.goalIndex);
        targetedGoal.existingInvestment.push({
            id: assetClass[data.investment - 1].id,
            name: assetClass[data.investment - 1].name,
            currentValue: data.currentValue,
            futureValue: this.getFutureValue(data.currentValue, targetedGoal.duration, assetClass[data.investment - 1].roi)
        });
        goalData = this.getEstimates(goalData);
        return goalData;
    }

    getEstimates(goalData: AllGoals): AllGoals {
        goalData.netLumpSumEstimate = 0;
        goalData.netMonthlySipEstimate = 0;
        goalData.goals.forEach(goal => {
            if (goal.name == this.RETIREMENT_GOAL) {
                goal.futureCost = this.getFutureValue(goal.currentCost, goal.duration);
                goal.monthlySip = this.getMonthlySip(this.getRetirementCorpus(goal.currentCost, goal.duration), goal.duration);
                goal.lumpsum = this.getLumpSum(this.getRetirementCorpus(goal.currentCost, goal.duration), goal.duration);
            } else {
                goal.futureCost = goal.name.startsWith(this.MY_1ST_CRORE) ? goal.currentCost : this.getFutureValue(goal.currentCost, goal.duration);
                goal.monthlySip = this.getMonthlySip(goal.futureCost, goal.duration);
                goal.lumpsum = this.getLumpSum(goal.futureCost, goal.duration);
            }
        });
        goalData.monthlyGoalEstimate = goalData.goals.map(g => g.monthlySip).reduce((a, b) => a + b, 0);
        goalData.lumpsumGoalEstimate = goalData.goals.map(g => g.lumpsum).reduce((a, b) => a + b, 0);
        let futureValueDifference: number[] = [];
        goalData.goals.forEach(g => {
            let exInvestmentFutureValueTotal: number = g.existingInvestment.map(e => e.futureValue).reduce((a, b) => a + b, 0);
            if (g.name != this.RETIREMENT_GOAL) futureValueDifference.push((g.futureCost - exInvestmentFutureValueTotal) < 0 ? 0 : (g.futureCost - exInvestmentFutureValueTotal));
            else futureValueDifference.push((this.getRetirementCorpus(g.currentCost, g.duration) - exInvestmentFutureValueTotal) < 0 ? 0 : (this.getRetirementCorpus(g.currentCost, g.duration) - exInvestmentFutureValueTotal));
        });
        futureValueDifference.forEach((f, i) => {
            goalData.netMonthlySipEstimate += this.getMonthlySip(f, goalData.goals[i].duration);
            goalData.netLumpSumEstimate += this.getLumpSum(f, goalData.goals[i].duration);
        });
        return goalData;
    }


    getGoalsDataForServer(goalData: AllGoals, userRisk?: number): GoalsToServer {
        let goalsToServer: GoalsToServer;
        goalData.goals = goalData.goals.filter(g => g.currentCost != 0);
        goalsToServer = {
            roi: this.ROI,
            inflation: this.INFLATION,
            totalFutureValue: goalData.goals.map(g => g.futureCost).reduce((a, b) => a + b, 0),
            netMonthlySaving: goalData.netMonthlySipEstimate,
            netLumpsumSaving: goalData.netLumpSumEstimate,
            riskProfile: goalData.riskProfile,
            totalMonthlySaving: goalData.monthlyGoalEstimate,
            totalLumpsumSaving: goalData.lumpsumGoalEstimate,
            goalDto: this.getGoalsForServer(goalData.goals)
        }
        return goalsToServer;
    }

    private getGoalsForServer(goals: CustomizeGoal[]): Goals[] {
        let goalServer: Goals[] = [];
        goals.forEach(g => {
            goalServer.push({
                goalName: g.name,
                costOfGoal: g.currentCost,
                futureValue: g.futureCost,
                duration: g.duration,
                lumPsumValue: g.lumpsum,
                pmtFutureValue: g.monthlySip,
                goalId: g.id,
                investmentFlag: g.investmentFlag,
                assetClassDto: this.getExistingInvestmentForServer(g.existingInvestment)
            });
        });
        return goalServer;
    }

    private getExistingInvestmentForServer(exInv: ExistingInvestment[]): ExistingInvestmentForServer[] {
        let exInvForServer: ExistingInvestmentForServer[] = [];
        exInv.forEach(e => {
            exInvForServer.push({
                assetClassId: e.id,
                assetClass: e.name,
                assetValue: e.currentValue,
                futureValue: e.futureValue
            });
        })
        return exInvForServer;
    }

    converGoalDataFromServer(goalServerData: GoalsToServer): AllGoals {
        let goalData: AllGoals;
        goalData = {
            lumpsumGoalEstimate: goalServerData.totalLumpsumSaving,
            monthlyGoalEstimate: goalServerData.totalMonthlySaving,
            netLumpSumEstimate: goalServerData.netLumpsumSaving,
            netMonthlySipEstimate: goalServerData.netMonthlySaving,
            goals: this.convertGoalsFromServer(goalServerData.goalDto),
            riskProfile: this.DEFAULT_RISK_PROFILE
        }
        return goalData;
    }

    private convertGoalsFromServer(goalServer: Goals[]): CustomizeGoal[] {
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
        });
        if (goals.map(g => g.name).indexOf(this.RETIREMENT_GOAL) != -1) goals.sort((x, y) => x.name == this.RETIREMENT_GOAL ? -1 : y.name == this.RETIREMENT_GOAL ? 1 : 0);
        return goals;
    }

    private convertExistingInvFromServer(exInvServer: ExistingInvestmentForServer[]): ExistingInvestment[] {
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
}
