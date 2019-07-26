export interface GoalsToServer {
    roi: number,
    inflation: number,
    riskProfile: string,
    totalFutureValue: number,
    totalLumpsumSaving: number,
    netMonthlySaving: number,
    netLumpsumSaving: number,
    totalMonthlySaving: number,
    goalDto: Goals[],
}

export interface Goals {
    goalId: number,
    goalName: string,
    duration: number,
    costOfGoal: number,
    futureValue: number,
    lumPsumValue: number,
    pmtFutureValue: number,
    investmentFlag: boolean,
    assetClassDto: ExistingInvestmentForServer[]
}

export interface ExistingInvestmentForServer {
    assetValue: number,
    assetClass: string,
    futureValue: number,
    assetClassId: number,
}