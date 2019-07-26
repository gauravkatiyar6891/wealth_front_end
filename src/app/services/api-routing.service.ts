import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutingService {

  private baseUrl = environment.BASE_API_URL;

  constructor() { }

  getSignupByMobileUrl(): string {
    return this.baseUrl + '/secured/uma/signupByMobile';
  }

  getVerifyUserUrl(): string {
    return this.baseUrl + '/secured/uma/verify/otp/mobileNumber';
  }

  getResendOtpUrl(mobileNumber: number, email: string, type: string): string {
    return this.baseUrl + '/secured/uma/resendOtp?mobileNumber=' + mobileNumber + '&email=' + email + '&type=' + type;
  }

  getLoginUrl(): string {
    return this.baseUrl + '/login';
  }

  getVerifyEmailUrl(): string {
    return this.baseUrl + '/secured/uma/sendEmailVerificationUrl';
  }

  getForgetPasswordVerifyUserUrl(username: number): string {
    return this.baseUrl + `/secured/uma/forgetPassword/${username}`;
  }

  getForgetPasswordVerifyOtpUrl(): string {
    return this.baseUrl + '/secured/uma/forgetPassword/verify/otp';
  }

  getForgetPasswordUrl(): string {
    return this.baseUrl + '/secured/uma/resetPassword';
  }

  getCityListUrl(): string {
    return this.baseUrl + '/sip/api/getCityList';
  }

  getStateListUrl(): string {
    return this.baseUrl + '/sip/api/getStateList';
  }

  getProfilePictureUrl(): string {
    return this.baseUrl + '/e-mandate/getImages/userImage';
  }

  getMaritalUrl(): string {
    return this.baseUrl + '/sip/api/getMaritalList';
  }

  getSipcallUrl(): string {
    return this.baseUrl + '/sip/api/calculateSipV2';
  }

  getAssetClassListUrl(): string {
    return this.baseUrl + '/sip/advance/getAssetClassList';
  }

  getEmaiVerificationUrl(token: string): string {
    return this.baseUrl + '/secured/uma/verify-email?token=' + token;
  }

  getUserDetailsUrl(fullData: boolean): string {
    return this.baseUrl + `/secured/uma/getUser/${fullData ? 'fullData' : 'normal'}`;
  }

  getVerifyPanNumberUrl(): string {
    return this.baseUrl + '/e-mandate/verifyPanNumber';
  }

  getVerifyAadhaarNumberUrl(): string {
    return this.baseUrl + '/e-mandate/verifyAadhaarNumber';
  }

  getUrl(): string {
    return this.baseUrl + '/e-mandate/getUrl';
  }

  getStoreBasicDetailsUrl(): string {
    return this.baseUrl + '/e-mandate/storeBasicDetails';
  }

  getStoreBankDetailsUrl(): string {
    return this.baseUrl + '/e-mandate/storeBankDetails';
  }

  getUploadSignatureUrl(): string {
    return this.baseUrl + '/e-mandate/uploadSignature';
  }

  getAllFundSchemeUrl(schemeType: string, offset: number): string {
    return this.baseUrl + '/prs/fund-scheme/api/getAllScheme?schemeType=' + schemeType + '&offset=' + offset.toString();
  }

  getAllFundSchemeAuthUrl(offset: number): string {   //In Switch Scheme
    return this.baseUrl + '/prs/fund-scheme/api/getAllSchemeAuth/' + offset;
  }

  getAllTopFundSchemeUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/getAllTopScheme';
  }

  getStoreKycDetailsUrl(): string {
    return this.baseUrl + '/e-mandate/storeKycDetails';
  }

  getStoreAddressProofUrl(): string {
    return this.baseUrl + '/e-mandate/storeAddressProof';
  }

  getCheckEkycStatusUrl(): string {
    return this.baseUrl + '/prs/ekycStatus';
  }

  getVerifyMobileUrl(mobile: string): string {
    return this.baseUrl + '/secured/uma/verify-mobile?mobile=' + mobile;
  }

  getVerifyIfscUrl(ifsc: string): string {
    return this.baseUrl + '/e-mandate/verify-ifsc?ifsc=' + ifsc;
  }

  getFundSchemeDetailsByKeywordUrl(schemeKeyWord: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getSchemeDetailsByKeyword/' + schemeKeyWord;
  }

  getAllSchemeTypeUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/allSchemeType';
  }

  getSearchSchemeUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/searchScheme';
  }

  getSearchSchemeAuthUrl(): string {    //In Switch Scheme
    return this.baseUrl + '/prs/fund-scheme/api/searchSchemeAuth';
  }

  addToCartUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/addToCart';
  }

  addToCartListUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/addToCart';
  }

  getCartOrderUrl(type: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getCartOrder?type=' + type;
  }

  getModelportfolioOrderUrl(type: string): string {
    return this.baseUrl + '/prs/modelportfolio/api/getUserOrderByType?type=' + type;
  }

  getModelportfolioCancelOrderSipurl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/cancelOrder';
  }

  getModelportfolioCancelOrderLumpsumurl(): string {    //pending
    return this.baseUrl + '/prs/modelportfolio/api/cancelOrder';
  }

  getCartOrderByOrderUrl(orderId: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getCartOrderByOrder?orderId=' + orderId;
  }

  confirmOrderUrl(orderId: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/confirmOrder?orderId=' + orderId;
  }

  getCartOrderByOrderListUrl(bundleId): string {
    return this.baseUrl + '/prs/modelportfolio/api/getCartOrderByOrder/' + bundleId;
  }

  confirmOrderModelportfolioUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/confirmOrder';
  }

  deleteOrder(orderId: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/deleteOrder?orderId=' + orderId;
  }

  deleteOrderModelportfolioUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/deleteOrder';
  }

  getFundSchemeDetailBySchemeIdUrl(schemeId: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getSchemeDetailsById/' + schemeId;
  }


  getFundSchemeDetailBySchemeCodeUrls(schemeCode: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getSchemeDetailsByCode/' + schemeCode;
  }

  cancelOrderUrl(orderId: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/cancelOrder?orderId=' + orderId;
  }

  getLoggedUserUrl(): string {
    return this.baseUrl + '/secured/uma/loggedUserDetail';
  }

  makePaymentUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/payment';
  }

  getTransactionOrderUrl(folioNumber: string, schemeCode: string): string {
    return this.baseUrl + `/prs/fund-scheme/api/getTransactions/${schemeCode}?folioNo=${folioNumber}`;
  }

  getPortfolioUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/getPortfolio';
  }

  getAwaitingPaymentRecordUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/getAwaitingPaymentRecord';
  }

  getPortfolioDetailsUrl(orderId: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getPortFolioDetails/' + orderId;
  }

  getSchemeDetailBySchemeCodeUrl(toSchemeCode: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/getSchemeDetailBySchemeCode/' + toSchemeCode;
  }

  redeemOrderUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/redeem';
  }

  switchOrderUrl(orderId: string, schemeCode: string): string {
    return this.baseUrl + '/prs/fund-scheme/api/switch?orderId=' + orderId + '&schemeCode=' + schemeCode;
  }

  getUserBlogList(): string {
    return this.baseUrl + '/secured/uma/getUserBlogList';
  }

  getUserBlogCategory(): string {
    return this.baseUrl + '/secured/uma/getUserBlogCategory';
  }

  getUserBlogByCategory(categoryId: any): string {
    return this.baseUrl + '/secured/uma/getUserBlogByCategory/' + categoryId;
  }

  getUserBlogById(id): string {
    return this.baseUrl + '/secured/uma/getUserBlogById/' + id;
  }

  getUserRelatedBlog(id: number): string {
    return this.baseUrl + '/secured/uma/getUserRelatedBlog/' + id;
  }

  getLatestBlog(): string {
    return this.baseUrl + '/secured/uma/getLatestBlog';
  }

  getUpdateEkycStatusUrl(karvyResponse: string): string {
    return this.baseUrl + '/e-mandate/updateEkycStatus?karvyResponse=' + karvyResponse;
  }

  getIsUserExistUrl(userName: string): string {
    return this.baseUrl + '/secured/uma/isUserExist/' + userName;
  }

  getAddToWatchlistUrl(schemeCode: string): string {
    return this.baseUrl + '/prs/addToWatchlist/' + schemeCode;
  }

  getWatchlistUrl(): string {
    return this.baseUrl + '/prs/getWatchlist';
  }

  getRemoveAndPurchaseFromWatchlistUrl(operationType: string, schemeCode: string, ): string {
    return this.baseUrl + '/prs/removeAndPurchaseFromWatchlist?operationType=' + operationType + '&schemeCode=' + schemeCode;
  }

  getCityByStateUrl(stateName: string): string {
    return this.baseUrl + '/e-mandate/getCityByState/' + stateName;
  }

  getPaymentStatus(orderId: number): string {
    return this.baseUrl + '/prs/fund-scheme/api/getPaymentStatus/' + orderId;
  }

  getChangePasswordUrl(): string {
    return this.baseUrl + '/secured/uma/changePassword';
  }

  getUserRiskProfileUrl(riskSum: number) {
    return this.baseUrl + '/sip/advance/getUserRiskProfileV2/' + riskSum;
  }

  getGoalsOrderDetailUrl(): string {
    return this.baseUrl + '/sip/advance/getGoalOrderDetailV2';
  }

  getPredefinedGoalUrl(): string {
    return this.baseUrl + '/sip/advance/getPredefinedGoal';
  }

  getOnboardingImageString(type: string): string {
    return this.baseUrl + '/e-mandate/getImages/' + type;
  }

  getUserAssignedGoals(): string {
    return this.baseUrl + '/prs/fund-scheme/api/getUserGoals/';
  }

  updateGoalToInvestmentUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/userInvestmentGoal';
  }

  getMandateStatusUrl(): string {   //pending
    return this.baseUrl + '/prs/fund-scheme/api/getMandateStatus';
  }

  getEmandateAuthenticationUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/getEmandateAuthenticationUrl';
  }

  getUpdateBankinfoUrl(): string {
    return this.baseUrl + '/e-mandate/updateEmandate';
  }

  getAddEnquiryUrl(): string {
    return this.baseUrl + '/secured/uma/enquiry';
  }

  getModelportfolioListUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/getModelportfolioList';
  }

  getModelportfolioDetailUrl(categoryKeyword: string): string {
    return this.baseUrl + '/prs/modelportfolio/getModelportfolioDetailByCategory/' + categoryKeyword;
  }

  getModelportfolioDetailSecuredUrl(categoryKeyword: string): string {
    return this.baseUrl + '/prs/modelportfolio/getModelportfolioDetailByCategorySecured/' + categoryKeyword;
  }

  getModelportfolioPaymentStatusUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/getPaymentStatus';
  }

  getModelportfolioPaymentUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/payment';
  }

  getModelportfolioSipDetailsUrl(): string {
    return this.baseUrl + '/prs/modelportfolio/api/getUserOrderListByBundleId';
  }

  getUpdateSipDateUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/updateSipDate';
  }

  getChangeToMarriedUrl(maritalStatus): string {
    return this.baseUrl + '/secured/uma/changeMaritalStatus?maritalStatus=' + maritalStatus;
  }

  getMandateForm(): string {
    return this.baseUrl + '/e-mandate/downloadMandateFileImage';
  }

  getUploadMandateFormUrl(): string {
    return this.baseUrl + '/e-mandate/uploadMandateFileImage';
  }

  getRecommendedFundSchemesUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/api/getAllRecommendedScheme';
  }

  getRedeemptionDetails(folioNo: string, schemeCode: string): string {
    return this.baseUrl + `/prs/fund-scheme/getRedumptionDetail/${schemeCode}?folioNo=${folioNo}`;
  }

  getCreateGoalsUrl(): string {
    return this.baseUrl + '/sip/advance/createGoal';
  }

  getReplaceGoalsUrl(): string {
    return this.baseUrl + '/sip/advance/replaceGoal';
  }

  getSipOrdersListUrl(): string {
    return this.baseUrl + '/prs/fund-scheme/getSipOrderList';
  }

  getCheckEmailVerifiedUrl(): string {
    return this.baseUrl + '/secured/uma/checkIsEmailVerified';
  }

  getTransferInRecordsUrl(): string {
    return this.baseUrl + '/ticob/getTransferInRecords';
  }

  getPlaceTransferInOrderUrl(): string {
    return this.baseUrl + '/ticob/placeOrder';
  }

  getAddToFolioOrderUrl(): string {
    return this.baseUrl + '/ticob/addToCartTicob';
  }

  getAddToFolioAsLumpsumUrl(): string {
    return this.baseUrl + '/ticob/placeTicobLumpsumOrder';
  }

  getAddToFolioAsSipUrl(): string {
    return this.baseUrl + 'ticob/placeTicobSipOrder';
  }

  getFolioListForAmc(amcCode: string): string {
    return this.baseUrl + `/prs/fund-scheme/api/checkAmcForFolio/${amcCode}`;
  }

  getOrderDetailsById(orderId: string): string {
    return this.baseUrl + `/prs/fund-scheme/getOrderDetailsById/${orderId}`;
  }

  getRecentPostsUrl(): string {
    return '/node/blogs/getLatestBlogs';
  }

  getPostByIdUrl(postId: number): string {
    return `/node/blogs/getPostById/${postId}`;
  }

  getPostBySlugUrl(slug: string): string {
    return `/node/blogs/getPostBySlug/${slug}`;
  }

  getBase64ImageUrl(): string {
    return `/node/blogs/getBase64Image`;
  }

  getverifyKycRelianceUrl(): string {
    return '/node/kyc/relVerify';
  }

}