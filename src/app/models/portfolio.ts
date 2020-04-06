export interface PortfolioResp {
    type: string,
    goalId: number,
    status: string,
    sipDate: string,
    orderId: number,
    amcCode: string,
    follioNo: string,
    statedOn: string,
    sipRegNo: number,
    goalName: string,
    schemeCode: string,
    schemeName: string,
    currentNav: number,
    schemeType: string,
    allotedUnit: number,
    currentDate: string,
    totalAmount: number,
    isipAllowed: boolean,
    enachEnable: boolean,
    minSipAmount: number,
    sipMaxInstallmentAmount: number,
    maximumPurchaseAmount: number,
    sipAllowed: boolean,
    billerEnable: boolean,
    currentAmount: number,
    investedAmount: number,
    lumpsumAllowed: boolean,
    absoluteReturn?: number,
    minLumpsumAmount: number,
    availableSipDate: string[],
    minAdditionalAmount: number,
    isRedumptionAllowed: string,
    minimumRedumptionAmount: number,
}

export interface Portfolio {
    nav: number,
    amcCode: string,
    schemeCode: string,
    schemeName: string,
    schemeType: string,
    minSipAmount: number,
    transferInId: number,
    enachEnable: boolean,
    isipAllowed: boolean,
    currentAmount: number,
    maxSipAmount: number,
    maxLumpsumAmount: number,
    isSipAllowed: boolean,
    billerEnable: boolean,
    totalInvestment: number,
    minLumpsumAmount: number,
    folios: FolioPortfolio[],
    isLumpsumAllowed: boolean,
    availableSipDate: string[],
    minAdditionalAmount: number,
}

export interface FolioPortfolio {
    goalId: number,
    status: string,
    goalName: string,
    startedOn: string,
    folioNumber: string,
    allotedUnits: number,
    isTransferIn: boolean,
    currentAmount: number,
    investedAmount: number,
    absoluteReturn: number,
    availableAmount: number,
    isRedeemptionAllowed: boolean,
    minimumRedeemptionAmount: number
}

export interface AddToFolioRequest {
    folioNo: string,
    transferInId: number,
    schemeCode: string,
    investmentType: string,
    goalId: number,
    goalName: string,
    amount: number,
    dayOfSip: number,
    paymentOptions: string
}

export interface AddToFolioData {
    folioNo: string,
    minSipAmount: number,
    minLumpSumAmount: number,
    maxSipAmount: number,
    maxLumpsumAmount: number,
    isBillerEnable: boolean,
    isNachEnable: boolean,
    isSipAllowed: boolean,
    isLumpsumAllowed: boolean,
    isISipAllowed: boolean,
    availSipDates: string[],
    schemeCode: string,
    transferInId: number,
    minAdditionalAmount: number,
}

export interface RedeemReq {
    folioNo: string,
    amount: number,
    type: string,
    schemeCode: string,
    status: string
}