import { Injectable } from '@angular/core';
import { OrderPayment } from './../models/order';
import { HttpHelperService } from './http-helper.service';
import { ApiRoutingService } from './api-routing.service';
import { AddToFolioRequest, RedeemReq } from './../models/portfolio';

@Injectable()
export class FundschemeService {

    constructor(private httpHelper: HttpHelperService, private apiRoutingService: ApiRoutingService) {
    }

    public getAllFundScheme(offset: number, withDividend = false) {
        return this.httpHelper.post(this.apiRoutingService.getAllFundSchemeUrl(withDividend ? 'WithDividend' : 'WithoutDividend', offset), null, false, false);
    }

    public getFundSchemeDetailsByKeyword(schemeKeyword: string) {
        return this.httpHelper.get(this.apiRoutingService.getFundSchemeDetailsByKeywordUrl(schemeKeyword), null, false);
    }

    public getAllSchemeType() {
        return this.httpHelper.get(this.apiRoutingService.getAllSchemeTypeUrl(), null, false);
    }

    public searchScheme(searchSchemeRequest: any) {
        return this.httpHelper.post(this.apiRoutingService.getSearchSchemeUrl(), searchSchemeRequest, false, false);
    }

    public addToCart(addToCart: any) {
        return this.httpHelper.post(this.apiRoutingService.addToCartUrl(), addToCart, false, true);
    }

    public modelportfolioAddToCartList(addToCart: any[]) {
        return this.httpHelper.post(this.apiRoutingService.addToCartListUrl(), addToCart, false, true);
    }

    public getCartOrder(type: string) {
        return this.httpHelper.get(this.apiRoutingService.getCartOrderUrl(type), false, true);
    }

    public getModelportfolioOrder(type: string) {
        return this.httpHelper.get(this.apiRoutingService.getModelportfolioOrderUrl(type), false, true);
    }

    public modelportfolioCancelAllOrder(orderId: any) {
        return this.httpHelper.post(this.apiRoutingService.getModelportfolioCancelOrderSipurl(), orderId, false, true);
    }

    public getCartOrderByOrder(orderId: string) {
        return this.httpHelper.get(this.apiRoutingService.getCartOrderByOrderUrl(orderId), false, true);
    }

    public getCartOrderByOrderList(bundleId) {
        return this.httpHelper.get(this.apiRoutingService.getCartOrderByOrderListUrl(bundleId), false, true);
    }

    public confirmOrder(orderId: string) {
        return this.httpHelper.post(this.apiRoutingService.confirmOrderUrl(orderId), {}, false, true);
    }

    public confirmOrderModelportfolio(orderId: string) {
        return this.httpHelper.post(this.apiRoutingService.confirmOrderModelportfolioUrl(), orderId, false, true);
    }

    public deleteOrder(orderId: string) {
        return this.httpHelper.post(this.apiRoutingService.deleteOrder(orderId), {}, false, true);
    }

    public deleteOrderModelportfolio(orderId: string) {
        return this.httpHelper.post(this.apiRoutingService.deleteOrderModelportfolioUrl(), orderId, false, true);
    }

    public getFundSchemeDetailBySchemeId(schemeId: string) {
        return this.httpHelper.get(this.apiRoutingService.getFundSchemeDetailBySchemeIdUrl(schemeId), null, true);
    }

    public cancelOrder(orderId: string) {
        return this.httpHelper.post(this.apiRoutingService.cancelOrderUrl(orderId), {}, false, true);
    }

    public makePayment(paymentOrders: OrderPayment[]) {
        return this.httpHelper.post(this.apiRoutingService.makePaymentUrl(), paymentOrders, false, true);
    }

    public makePaymentOfModelportfolio(orderIdsListModel: any[]) {
        return this.httpHelper.post(this.apiRoutingService.getModelportfolioPaymentUrl(), orderIdsListModel, false, true);
    }

    public getTransactionOrder(folioNumber: string, schmeCode: string) {
        return this.httpHelper.get(this.apiRoutingService.getTransactionOrderUrl(folioNumber, schmeCode), false, true);
    }

    public getPortfolio() {
        return this.httpHelper.get(this.apiRoutingService.getPortfolioUrl(), false, true);
    }

    public getAwaitingPaymentRecord() {
        return this.httpHelper.get(this.apiRoutingService.getAwaitingPaymentRecordUrl(), false, true);
    }

    public getSchemeDetailBySchemeCode(toSchemeCode: string) {
        return this.httpHelper.get(this.apiRoutingService.getSchemeDetailBySchemeCodeUrl(toSchemeCode), false, true);
    }

    public redeemOrder(redeemReq: RedeemReq) {
        return this.httpHelper.post(this.apiRoutingService.redeemOrderUrl(), redeemReq, false, true);
    }

    public switchOrder(orderId: string, schemeCode: string) {
        return this.httpHelper.post(this.apiRoutingService.switchOrderUrl(orderId, schemeCode), {}, false, true);
    }

    public getPaymentStatus(orderId: any) {
        return this.httpHelper.post(this.apiRoutingService.getPaymentStatus(orderId), {}, false, true);
    }

    public getModelportfolioPaymentStatus(bundleId: any) {
        return this.httpHelper.post(this.apiRoutingService.getModelportfolioPaymentStatusUrl(), bundleId, false, true);
    }

    public getUserAssignedGoals() {
        return this.httpHelper.get(this.apiRoutingService.getUserAssignedGoals(), false, true);
    }

    public getModelportfolioList() {
        return this.httpHelper.get(this.apiRoutingService.getModelportfolioListUrl(), null, false);
    }

    public getModelportfolioDetail(categoryKeyword: string) {
        return this.httpHelper.get(this.apiRoutingService.getModelportfolioDetailUrl(categoryKeyword), null, false);
    }

    public getModelportfolioDetailSecured(categoryKeyword: string) {
        return this.httpHelper.get(this.apiRoutingService.getModelportfolioDetailSecuredUrl(categoryKeyword), null, true);
    }

    public getModelportfolioSipDetails(mpBundleId: number) {
        return this.httpHelper.post(this.apiRoutingService.getModelportfolioSipDetailsUrl(), mpBundleId, false, true);
    }

    public updateSipDate(sipDate: any, orderId: any) {
        return this.httpHelper.post(this.apiRoutingService.getUpdateSipDateUrl(), { 'dayOfSip': sipDate, 'orderId': orderId }, false, true);
    }

    public getRecommendedFundSchemes() {
        return this.httpHelper.get(this.apiRoutingService.getRecommendedFundSchemesUrl(), null, false);
    }

    public getRedeemptionDetails(folioNo: string, schemeCode: string) {
        return this.httpHelper.get(this.apiRoutingService.getRedeemptionDetails(folioNo, schemeCode), null, true);
    }

    public getSipOrdersList() {
        return this.httpHelper.get(this.apiRoutingService.getSipOrdersListUrl(), null, true);
    }

    public updateGoalToInvestment(action: string, goalId: number, follioNo: string, schemeCode: string, goalName: string, oldGoalId: number) {
        let bodyParams = { action: action, goalId: goalId, follioNo: follioNo, schemeCode: schemeCode, goalName: goalName, oldGoalId: oldGoalId }
        return this.httpHelper.post(this.apiRoutingService.updateGoalToInvestmentUrl(), bodyParams, false, true);
    }

    public placeTransferInOrder(transferIn: any) {
        return this.httpHelper.post(this.apiRoutingService.getPlaceTransferInOrderUrl(), transferIn, false, true);
    }

    public getTransferInRecords() {
        return this.httpHelper.get(this.apiRoutingService.getTransferInRecordsUrl(), null, true);
    }

    public addToFolioAsLumpsum(order: AddToFolioRequest) {
        return this.httpHelper.post(this.apiRoutingService.getAddToFolioAsLumpsumUrl(), order, false, true);
    }

    public addToFolioAsSip(order: AddToFolioRequest) {
        return this.httpHelper.post(this.apiRoutingService.getAddToFolioAsSipUrl(), order, false, true);
    }

    public getFolioListForAmc(amcCode: string) {
        return this.httpHelper.get(this.apiRoutingService.getFolioListForAmc(amcCode), null, true);
    }

    public getOrderDetailsById(orderId: string) {
        return this.httpHelper.get(this.apiRoutingService.getOrderDetailsById(orderId), null, true);
    }

}