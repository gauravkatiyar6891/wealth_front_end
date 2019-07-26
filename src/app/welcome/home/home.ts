import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AllGoals, CustomizeGoal, HomeGoalModel, ExistingInvestment } from './../../models/LocalGoals';

@Injectable()

export class HomeHelper {

    constructor(private formBuilder: FormBuilder) { }

    getUserGoalPlanningData(returnValueCalc: FormGroup) {
        let sip: HomeGoalModel = {
            currResidenceLocationId: returnValueCalc.controls['residence'].value,
            maritalStatusId: returnValueCalc.controls['maritalStatus'].value,
            currentAge: returnValueCalc.controls['age'].value,
            incomeVal: returnValueCalc.controls['income'].value,
            incomeSlabCode: this.getIncomeSlabCode(returnValueCalc.controls['income'].value),
            kids: returnValueCalc.controls['kids'].value,
        }
        return sip;
    }

    getGoalsForLocalStorage(goals: Array<any>): AllGoals {
        let localGoals: AllGoals;
        let goalsArray: CustomizeGoal[] = this.goalsArray(goals);
        localGoals = {
            goals: goalsArray,
            lumpsumGoalEstimate: goalsArray.map(g => g.lumpsum).reduce((a, b) => a + b, 0),
            monthlyGoalEstimate: goalsArray.map(g => g.monthlySip).reduce((a, b) => a + b, 0),
            netLumpSumEstimate: goalsArray.map(g => g.lumpsum).reduce((a, b) => a + b, 0),
            netMonthlySipEstimate: goalsArray.map(g => g.monthlySip).reduce((a, b) => a + b, 0),
            riskProfile: 'HIGH_HIGH'
        }
        return localGoals;
    }

    goalsArray(goals: Array<any>): CustomizeGoal[] {
        let goalsArr: CustomizeGoal[] = [];
        goals.forEach((goal, i) => {
            goalsArr.push({
                id: i,
                name: goal.goalName,
                investmentFlag: false,
                duration: goal.duration,
                lumpsum: goal.lumPsumValue,
                currentCost: goal.costOfGoal,
                futureCost: goal.futureValue,
                monthlySip: goal.pmtFutureValue,
                existingInvestment: new Array<ExistingInvestment>()
            });
        });
        [goalsArr[4].duration, goalsArr[4].currentCost, goalsArr[4].futureCost, goalsArr[4].monthlySip, goalsArr[4].lumpsum] = [0, 0, 0, 0, 0];
        [goalsArr[5].duration, goalsArr[5].currentCost, goalsArr[5].futureCost, goalsArr[5].monthlySip, goalsArr[5].lumpsum] = [0, 0, 0, 0, 0];
        return goalsArr;
    }

    getIncomeSlabCode(income: number) {
        if (income > 3 && income <= 5) return 'B';
        else if (income > 5 && income <= 10) return 'C';
        else if (income > 10 && income <= 20) return 'D';
        else if (income > 20 && income <= 50) return 'E';
        else if (income > 50) return 'F';
        else return 'A';
    }

    getSecondGoalPart1CalculatorFormGroup(): FormGroup {
        return this.formBuilder.group({
            amount: [null, Validators.compose([
                Validators.required,
                Validators.min(100),
                Validators.max(1000000000)
            ])],
            duration: [null, Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(70)
            ])],
            roi: [15.00, Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(50)
            ])],
            invType: ['1', Validators.required]
        });
    }

    getSecondGoalPart2CalculatorFormGroup(): FormGroup {
        return this.formBuilder.group({
            amount: [null, Validators.compose([
                Validators.required,
                Validators.min(100),
                Validators.max(1000000000)
            ])],
            duration: [null, Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(70)
            ])],
            roi: [15.00, Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(50)
            ])]
        });
    }
}