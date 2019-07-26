import { Component, OnInit } from '@angular/core';
import { BankDetails } from "../../models/bank-details";
import { GlobalUtility } from './../../shared/global-utility';
import { EmandateService } from "../../services/emandate.service";

@Component({
    selector: 'app-emandate',
    templateUrl: './emandate.component.html',
    styleUrls: ['./emandate.component.scss']
})
export class EmandateComponent implements OnInit {

    ifscCode: string = '';
    failureMessage: string = '';
    successMessage: string = '';

    bankDetail: BankDetails = new BankDetails();

    constructor(
        private emandateService: EmandateService,
        private globalUtility: GlobalUtility
    ) { }

    ngOnInit() {
        this.globalUtility.getUserData().then(userData => {
            this.bankDetail.bankName = userData.bankName;
            this.bankDetail.bankBranch = userData.bankBranch;
            this.bankDetail.ifscCode = userData.ifscCode;
            this.bankDetail.accountNumber = userData.accountNumber;
            this.bankDetail.bankAddress = userData.bankAddress;
            this.bankDetail.micrCode = userData.micrCode;
        });
    }

    changeIFSC() {
        if (this.ifscCode === '') {
            this.failureMessage = 'IFSC code can not blank.';
            this.globalUtility.scrollAnimateTo(0);
            setTimeout(function () {
                this.failureMessage = '';
            }.bind(this), 3000);
        } else {
            this.globalUtility.displayLoader();
            this.emandateService.verifyIfsc(this.ifscCode).subscribe((res) => {
                this.globalUtility.displayLoader(false);
                if (res.data.message == "success") {
                    this.globalUtility.scrollAnimateTo(0)
                    this.bankDetail.bankName = res.data.bankName;
                    this.bankDetail.bankBranch = res.data.bankBranch;
                    this.bankDetail.ifscCode = this.ifscCode;
                    this.bankDetail.accountNumber = res.data.accountNumber;
                    this.bankDetail.bankAddress = res.data.bankAddress;
                    this.bankDetail.micrCode = res.data.micrCode;
                } else {
                    this.failureMessage = 'Please enter correct ifsc code.';
                    setTimeout(function () {
                        this.failureMessage = '';
                    }.bind(this), 4000);
                }
            });
        }
    }

    changeInfo() {
        this.globalUtility.displayLoader();
        let changeInfo = {
            'ifscCode': this.bankDetail.ifscCode,
            'accountNumber': this.bankDetail.accountNumber,
            'bankName': this.bankDetail.bankName,
            'bankBranch': this.bankDetail.bankBranch,
            'micrCode': this.bankDetail.micrCode,
            'bankAddress': this.bankDetail.bankAddress
        };
        this.emandateService.updateBankinfo(changeInfo).subscribe((response) => {
            this.globalUtility.displayLoader(false);
            if (response.message === 'Success') {
                this.globalUtility.scrollAnimateTo(0);
                this.successMessage = 'Your new bank details submitted successfully.';
                setTimeout(() => {
                    this.successMessage = '';
                }, 4000);
            } else if (response.message == "Access denied") {
                //this.errorService.unauthorizedUserRequestError(response.message);
            } else {
                // if (response.data === 'FAILED: E-MANDATE NOT PERMITTED FOR THIS BANK') {
                // this.globalUtility.scrollAnimateTo(0);
                this.failureMessage = response.data;
                setTimeout(() => {
                    this.failureMessage = '';
                }, 4000);
                // }
            }
        });
    }

}