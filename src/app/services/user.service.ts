import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { UserEnquiry } from '../models/UserEnquiry';
import { GlobalUtility } from '../shared/global-utility';
import { HttpHelperService } from './http-helper.service';
import { ApiRoutingService } from './api-routing.service';

@Injectable()
export class UserService {

  constructor(private httpHelper: HttpHelperService, private apiRoutingService: ApiRoutingService, private globalUtility: GlobalUtility) { }

  signupByMobile(user) {
    return this.httpHelper.post(this.apiRoutingService.getSignupByMobileUrl(), user, false, false);
  }

  verifyUser(model: any) {
    return this.httpHelper.post(this.apiRoutingService.getVerifyUserUrl(), model, false, false);
  }

  resendOtp(mobileNumber: number, email: string, type: string) {
    return this.httpHelper.post(this.apiRoutingService.getResendOtpUrl(mobileNumber, email, type), {}, false, false);
  }

  verifyEmail(email: any) {
    return this.httpHelper.post(this.apiRoutingService.getVerifyEmailUrl(), email, false, true);
  }

  login(user) {
    return this.httpHelper.postWithoutErrorCatch(this.apiRoutingService.getLoginUrl(), user, false, false);
  }

  getForgetPasswordVerifyUser(username: number) {
    return this.httpHelper.postWithoutErrorCatch(this.apiRoutingService.getForgetPasswordVerifyUserUrl(username), null, false, false);
  }

  getForgetPasswordVerifyOtp(model: any) {
    return this.httpHelper.postWithoutErrorCatch(this.apiRoutingService.getForgetPasswordVerifyOtpUrl(), model, false, false);
  }

  forgetPassword(model: any) {
    const forgetPasswordToken = this.globalUtility.forgetPasswordToken;
    if (forgetPasswordToken) return this.httpHelper.postWithoutErrorCatch(this.apiRoutingService.getForgetPasswordUrl(), model, false, false, new HttpHeaders({ 'FORGETPASSWORD_HEADER_NAME': forgetPasswordToken }));
  }

  emailUrlVerification(token: string) {
    return this.httpHelper.get(this.apiRoutingService.getEmaiVerificationUrl(token), {}, false);
  }

  getUserDetails(fullData = false) {
    return this.httpHelper.post(this.apiRoutingService.getUserDetailsUrl(fullData), {}, false, true).pipe(map(resp => {
      if (!fullData && resp.status == '200') this.globalUtility.userData = resp.data;
      return resp;
    }));
  }

  verifyMobile(mobile: string) {
    return this.httpHelper.post(this.apiRoutingService.getVerifyMobileUrl(mobile), {}, false, true);
  }

  getBlogList() {
    return this.httpHelper.get(this.apiRoutingService.getUserBlogList(), {}, false);
  }

  getAllBlogCategory() {
    return this.httpHelper.get(this.apiRoutingService.getUserBlogCategory(), {}, false);
  }

  getBlogByCategory(categoryId: any) {
    return this.httpHelper.post(this.apiRoutingService.getUserBlogByCategory(categoryId), {}, false, false);
  }

  getUserBlogById(blogId: any) {
    return this.httpHelper.get(this.apiRoutingService.getUserBlogById(blogId), false, false);
  }

  getUserRelatedBlog(id: any) {
    return this.httpHelper.post(this.apiRoutingService.getUserRelatedBlog(id), {}, false, false);
  }

  getLatestBlog() {
    return this.httpHelper.get(this.apiRoutingService.getLatestBlog(), false, true);
  }

  updateEkycStatus(karvyResponse: string) {
    return this.httpHelper.post(this.apiRoutingService.getUpdateEkycStatusUrl(karvyResponse), {}, false, true);
  }

  isUserExist(userName: string) {
    return this.httpHelper.get(this.apiRoutingService.getIsUserExistUrl(userName), false, false);
  }

  addToWatchlist(schemeCode: string) {
    return this.httpHelper.post(this.apiRoutingService.getAddToWatchlistUrl(schemeCode), {}, false, true);
  }

  getWatchlist() {
    return this.httpHelper.get(this.apiRoutingService.getWatchlistUrl(), false, true);
  }

  removeAndPurchaseFromWatchlist(operationType: string, schemeCode: string) {
    return this.httpHelper.get(this.apiRoutingService.getRemoveAndPurchaseFromWatchlistUrl(operationType, schemeCode), false, true);
  }

  changePassword(model: any) {
    return this.httpHelper.post(this.apiRoutingService.getChangePasswordUrl(), model, false, true);
  }

  addEnquiry(userEnquiry: UserEnquiry): any {
    return this.httpHelper.post(this.apiRoutingService.getAddEnquiryUrl(), userEnquiry, false, false);
  }

  getProfilePicture() {
    return this.httpHelper.get(this.apiRoutingService.getProfilePictureUrl(), false, true).pipe(map(resp => {
      if (resp.status == '200') this.globalUtility.userProfileImage = resp.data;
      return resp;
    }));
  }

  changeMaritalStatus(status) {
    return this.httpHelper.get(this.apiRoutingService.getChangeToMarriedUrl(status), false, true);
  }

  getDocumentImage(pictureUrl: string) {
    return this.httpHelper.get(pictureUrl, false, true);
  }

  getMandateForm(mandateFormType: string) {
    return this.httpHelper.post(this.apiRoutingService.getMandateForm(), mandateFormType, false, true);
  }

  checkEmailVerified() {
    return this.httpHelper.get(this.apiRoutingService.getCheckEmailVerifiedUrl(), null, true);
  }

}