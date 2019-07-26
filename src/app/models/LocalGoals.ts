export interface AllGoals {
    goals: CustomizeGoal[],
    monthlyGoalEstimate: number,
    lumpsumGoalEstimate: number,
    netMonthlySipEstimate: number,
    netLumpSumEstimate: number,
    riskProfile: string
}

export interface CustomizeGoal {
    id: number,
    name: string,
    lumpsum: number,
    duration: number,
    futureCost: number,
    monthlySip: number,
    currentCost: number,
    investmentFlag: boolean,
    existingInvestment: ExistingInvestment[]
}

export interface ExistingInvestment {
    id: number,
    name: string,
    futureValue: number,
    currentValue: number
}

export interface AssetClass {
    id: number,
    name: string,
    roi: number
}

export interface PredefinedGoal {
    id: number,
    name: string,
    cost: number,
    duration: string,
}

export interface HomeGoalModel {
    kids: number,
    incomeVal: number,
    currentAge: number,
    incomeSlabCode: string,
    maritalStatusId: number,
    currResidenceLocationId: number,
}