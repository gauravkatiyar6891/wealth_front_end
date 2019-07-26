export interface OrderDetails {
    schemeId: number,
    schemeCode: string,
    userId: string,
    amount: number,
    schemeName: string,
    dayOfSip: string,
    investmentType: string,
    orderId: number,
    status: string,
    creationDate: string,
    type: string,
    minimumSipAmount: number,
    amcCode: string,
    goalName: string,
    goalId: number,
    orderDate: string,
    modelPortfolioCategory: string,
    orderCategory: string,
    mPBundleId: number,
    paymentAmount: string,
    finalResponse: string,
    sipDateList: string,
    sipDate: string,
    paymentOptions: string,
    bseOrderId: string,
    mandateId: string,
    lumpsumOrderId: string,
    sipRegnId: string,
    folioNo: string,
    transferInId: number
}

export interface OrderPayment {
    orderId: string,
    orderAmount: number,
    paymentAmount: number
}