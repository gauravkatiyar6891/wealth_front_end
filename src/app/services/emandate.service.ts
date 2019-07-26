import { Injectable } from '@angular/core';
import { Aadhar } from './../models/Aadhar';
import { RelianceKyc } from './../models/kyc';
import { BankDetails } from '../models/bank-details';
import { BasicDetails } from '../models/basic-details';
import { HttpHelperService } from './http-helper.service';
import { ApiRoutingService } from './api-routing.service';

@Injectable()
export class EmandateService {

  constructor(private httpHelper: HttpHelperService, private apiRoutingService: ApiRoutingService) { }

  verifyPanNumber(panNumber: string) {
    return this.httpHelper.post(this.apiRoutingService.getVerifyPanNumberUrl(), panNumber, false, true);
  }

  verifyAadhaarNumber(aadhar: Aadhar) {
    return this.httpHelper.post(this.apiRoutingService.getVerifyAadhaarNumberUrl(), aadhar, false, true);
  }

  storeBasicDetails(basicDetails: BasicDetails) {
    return this.httpHelper.post(this.apiRoutingService.getStoreBasicDetailsUrl(), basicDetails, false, true);
  }

  storeBankDetails(bankDetails: BankDetails) {
    return this.httpHelper.post(this.apiRoutingService.getStoreBankDetailsUrl(), bankDetails, false, true);
  }

  uploadSignature(signatureString: any) {
    return this.httpHelper.post(this.apiRoutingService.getUploadSignatureUrl(), signatureString, false, true);
  }

  storeKycDetails(basicDetails: BasicDetails) {
    return this.httpHelper.post(this.apiRoutingService.getStoreKycDetailsUrl(), basicDetails, false, true);
  }

  storeAddressProof(addressProof) {
    return this.httpHelper.post(this.apiRoutingService.getStoreAddressProofUrl(), addressProof, false, true);
  }

  verifyIfsc(ifscCode: string) {
    return this.httpHelper.post(this.apiRoutingService.getVerifyIfscUrl(ifscCode), {}, false, true);
  }

  getStateList() {
    return this.httpHelper.get(this.apiRoutingService.getStateListUrl(), null, false);
  }

  getCityByState(stateName: string) {
    return this.httpHelper.get(this.apiRoutingService.getCityByStateUrl(stateName), {}, true);
  }

  getOnboardingImageString(type: string) {
    return this.httpHelper.get(this.apiRoutingService.getOnboardingImageString(type), false, true);
  }

  updateBankinfo(changeInfo: any) {
    return this.httpHelper.post(this.apiRoutingService.getUpdateBankinfoUrl(), changeInfo, false, true);
  }

  uploadMandateForm(mandateFormRequest: any) {
    return this.httpHelper.post(this.apiRoutingService.getUploadMandateFormUrl(), mandateFormRequest, false, true);
  }

  verifyKycReliance(kycData: RelianceKyc) {
    return this.httpHelper.get(this.apiRoutingService.getverifyKycRelianceUrl(), kycData, false, null);
  }

}