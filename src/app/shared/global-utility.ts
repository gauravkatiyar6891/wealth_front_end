import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AllGoals } from '../models/LocalGoals';
import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { UserDetails } from '../models/UserDetails';
import { WINDOW, LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalUtility {

    readonly DEFAULT_RISK_PROFILE = 17;
    readonly ENC_KEY = "0D1L03N8SK";
    readonly LOCAL_STORAGE_KEY_NAME = "Application Data - Do not Modify";

    userData: UserDetails = null;
    userProfileImage: string = '../../../assets/fallback-images/profile.png';

    tokenTimer: any;
    tempUserId: any;
    showTokenExpiredMessage: boolean = false;
    TOKEN_EXPIRE_TIME: number = 60;      //In minutes
    tokenTimeToExpire: number;
    isUserLoggedIn: boolean = false;

    private noInternet = new Subject<any>();
    private loginDialog = new Subject<any>();
    private headerShadow = new Subject<any>();
    private profileHeader = new Subject<any>();
    private progressLoader = new Subject<any>();
    private sessionExpireDialog = new Subject<any>();
    private headerProfilePictureChange = new Subject<any>();

    private localStorageInstance: LocalStorageModel = {};
    forgetPasswordToken: string = null;

    $loginDialogCaller = this.loginDialog.asObservable();
    $headerShadowCaller = this.headerShadow.asObservable();
    $profileHeaderCaller = this.profileHeader.asObservable();
    $progressLoaderCaller = this.progressLoader.asObservable();
    $noInternetConnectivityCaller = this.noInternet.asObservable();
    $sessionExpireDialogCaller = this.sessionExpireDialog.asObservable();
    $headerProfilePictureChanger = this.headerProfilePictureChange.asObservable();

    constructor(
        private router: Router,
        @Inject(WINDOW) private window: Window,
        @Inject(PLATFORM_ID) private platform: Platform,
        @Inject(LOCAL_STORAGE) private localStorage: any
    ) {
        this.tokenTimeToExpire = 60 * this.TOKEN_EXPIRE_TIME;
        if (this.localStorage.getItem(this.LOCAL_STORAGE_KEY_NAME)) this.localStorageInstance = this.getDecryptedLocalStorageInstance();
        else this.localStorageInstance = this.initializeLocalStorageVariable();
        if (this.localStorageInstance.userId) this.tempUserId = this.localStorageInstance.userId;
    }

    scrollAnimateTo(target: number) {
        if (isPlatformBrowser(this.platform)) {
            let currentPos = this.window.scrollY;
            var interval;
            if (target - currentPos > 0) {
                interval = setInterval(() => {
                    this.window.scrollTo(0, currentPos);
                    currentPos += 30;
                    if (currentPos > target) clearInterval(interval);
                }, this.getTimerInterval(currentPos, target / 2, 1, 7));
            }
            else {
                interval = setInterval(() => {
                    this.window.scrollTo(0, currentPos);
                    currentPos -= 30;
                    if (currentPos < target) clearInterval(interval);
                }, this.getTimerInterval(currentPos, target / 2, 1, 7));
            }
        }
    }

    private initializeLocalStorageVariable(): LocalStorageModel {
        let localStorageInstance: LocalStorageModel = {
            token: null,
            userId: null,
            categoryId: null,
            secureTimeStamp: null
        }
        return localStorageInstance;
    }

    monitorTokenExpiry() {
        this.clearTokenTimer();
        this.tokenTimer = setInterval(() => {
            this.tokenTimeToExpire--;
            // console.log("Token TTL : ", this.tokenTimeToExpire);
            if (this.tokenTimeToExpire == 0) {
                this.clearTokenFromLocalStorage(true);
            }
        }, 1000);
    }

    clearTokenTimer() {
        this.tokenTimeToExpire = 60 * this.TOKEN_EXPIRE_TIME;
    }

    clearTokenFromLocalStorage(isSessionExpire = false) {
        clearInterval(this.tokenTimer);
        this.removeFromLocalStorage([LocalStorageDataModel.TOKEN, LocalStorageDataModel.USER_ID]);
        if (isSessionExpire) this.sessionExpireDialog.next();
        else {
            this.router.navigate(['/']);
            this.localStorage.removeItem(this.LOCAL_STORAGE_KEY_NAME);
            this.userData = null;
            this.initializeLocalStorageVariable();
        }
        this.profileHeader.next();
    }

    removeFromLocalStorage(data: LocalStorageDataModel[]) {
        for (const key of data) {
            this.localStorageInstance[key] = null;
        }
        this.setEncryptedLocalStorageInstance();
    }

    setDataOnLocalStorage(data: LocalStorageModel) {
        if (data.userId) if (this.tempUserId != data.userId) this.router.navigate(['']);
        if (data.userId) this.tempUserId = data.userId;
        for (const key in data) this.localStorageInstance[key] = data[key];
        this.setEncryptedLocalStorageInstance();
    }

    getDataFromLocalStorage(key: LocalStorageDataModel): string {
        return this.localStorageInstance[key];
    }

    private setEncryptedLocalStorageInstance() {
        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.localStorageInstance), this.ENC_KEY);
        this.localStorage.setItem(this.LOCAL_STORAGE_KEY_NAME, encrypted.toString());
    }

    private getDecryptedLocalStorageInstance(): LocalStorageModel {
        let localStorageInstance = this.localStorage.getItem(this.LOCAL_STORAGE_KEY_NAME);
        try {
            let decrypted = CryptoJS.AES.decrypt(localStorageInstance, this.ENC_KEY);
            let decryptedData: LocalStorageModel = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            let previousSecureTimeStamp = new Date(decryptedData.secureTimeStamp);
            let currentTimeStamp = new Date();
            if ((Number(currentTimeStamp) - Number(previousSecureTimeStamp)) > this.TOKEN_EXPIRE_TIME * 60 * 1000) {
                return this.initializeLocalStorageVariable();
            } else return decryptedData;
        } catch{
            this.localStorage.removeItem(this.LOCAL_STORAGE_KEY_NAME);
            this.window.location.reload();
        }
    }

    private getTimerInterval(num, inMax, outMin, outMax): number {
        let outputRange = outMax - outMin;
        let scaledNum = Math.trunc((((Math.abs(num - inMax)) / inMax) * outputRange) + outMin);
        return scaledNum;
    }

    openPaymentGateway(serviceResponse: string): boolean {
        let bodyIndex = serviceResponse.indexOf("<body>");
        let paymentHtmlResponseCode: boolean = serviceResponse.slice(bodyIndex, bodyIndex + 20).includes("100");
        if (paymentHtmlResponseCode) {
            let myWindow = this.window.open("", "_self");
            let paymentHtmlSourceCode = serviceResponse.slice(0, bodyIndex) + serviceResponse.slice(bodyIndex + 13);
            myWindow.document.write(paymentHtmlSourceCode);
            return true;
        }
        else return false;
    }

    openLoginDialog() {
        this.loginDialog.next();
    }

    changeHeaderProfilePicture() {
        this.headerProfilePictureChange.next();
    }

    showNoInternet() {
        this.noInternet.next();
    }

    headerShadowChange() {
        this.headerShadow.next();
    }

    displayLoader(state = true) {
        this.progressLoader.next(state);
    }

    currencyInInr(amount: number, roundOff = 0): string {
        let multiplier = Math.pow(10, roundOff);
        let num = (parseInt((amount / multiplier).toString()) * multiplier).toString();
        let lastThree = num.substring(num.length - 3);
        let otherNumbers = num.substring(0, num.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    }

    setGoalToLocalStorage(goals: AllGoals) {
        goals.goals.find(g => g.name == 'My 1st Crore ').currentCost = 10000000;
        this.localStorage.setItem("goals", JSON.stringify(goals));
    }

    getGoalFromLocalStorage(): AllGoals {
        let goals: AllGoals = JSON.parse(this.localStorage.getItem("goals"));
        if (!goals) return null;
        goals.goals.sort((x, y) => x.duration != 0 ? -1 : y.duration != 0 ? 1 : 0);
        let retGoal = goals.goals.find(g => g.name == 'Pension/Retirement Plan');
        goals.goals = goals.goals.filter(g => g.name != 'Pension/Retirement Plan');
        goals.goals.unshift(retGoal);
        return goals;
    }

    removeGoalFromLocalStorage() {
        this.localStorage.removeItem("goals");
    }

    getUserData(): Promise<UserDetails> {
        return new Promise((resolve, reject) => {
            if (this.userData) resolve(this.userData);
            else {
                let interval = setInterval(() => {
                    if (this.userData) {
                        clearInterval(interval);
                        resolve(this.userData);
                    }
                }, 100);
            }
        });
    }

    roundOff(num: number, percent: boolean = false, decimal = 2) {
        return Math.round(num * Math.pow(10, decimal + (percent ? 2 : 0))) / Math.pow(10, decimal);
    }

}

export interface LocalStorageModel {
    token?: string,
    userId?: string,
    categoryId?: string,
    secureTimeStamp?: string
}

export enum LocalStorageDataModel {
    TOKEN = "token",
    USER_ID = "userId",
    CATEGORY_ID = "categoryId",
    SECURE_TIME_STAMP = "secureTimeStamp"
}