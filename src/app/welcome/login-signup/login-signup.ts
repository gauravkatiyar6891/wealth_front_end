import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ErrorResponse } from '../../Data/error-response';
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";

@Injectable()

export class LoginSignUp {

    constructor(private formBuilder: FormBuilder) { }

    getLoginFormGroup(): FormGroup {
        return this.formBuilder.group({
            mobileNo: [null, Validators.compose([
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10)
            ])],
            password: [null, Validators.compose([
                Validators.required,
                Validators.minLength(7)
            ])]
        });
    }

    getRegisterFormGroup(): FormGroup {
        return this.formBuilder.group({
            firstName: [null, Validators.compose([
                Validators.required,
                Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
            ])],
            lastName: ['', Validators.compose([
                Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
            ])],
            email: [null, Validators.compose([
                Validators.required,
                Validators.email
            ])],
            mobNo: [null, Validators.compose([
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
            ])],
            password: [null, Validators.compose([
                Validators.required,
                Validators.minLength(7),
            ])],
            tnC: [false, Validators.requiredTrue]
        });
    }

    getOTPFormGroup(): FormGroup {
        return this.formBuilder.group({
            otp: [null, Validators.compose([
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(4),
                Validators.pattern("^[0-9]*$")
            ])]
        });
    }

    getNewPasswordFormGroup(): FormGroup {
        return this.formBuilder.group({
            password: [null, Validators.compose([
                Validators.required,
                Validators.minLength(7),
            ])],
            cnfPassword: [null, Validators.compose([
                Validators.required,
                this.confirmPasswordValidator
            ])],
        })
    }

    encryptPassword(password): string {
        let key = CryptoJS.enc.Utf8.parse('7061737323313233');
        let iv = CryptoJS.enc.Utf8.parse('7061737323313233');
        let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    }

    getLoginModel(mobileNo: number, password: string, encrypt = true) {
        return {
            username: mobileNo,
            password: encrypt ? this.encryptPassword(password) : password
        }
    }

    getOtpModel(mobileNumber: number, otp: number) {
        return {
            mobileNumber: mobileNumber,
            otp: otp
        }
    }

    getNewPasswordModel(mobileNumber: number, password: string) {
        return {
            password: this.encryptPassword(password),
            mobileNumber: mobileNumber
        }
    }

    getRegisterFormModel(registerForm: FormGroup) {
        return {
            firstName: registerForm.controls['firstName'].value,
            lastName: registerForm.controls['lastName'].value,
            email: registerForm.controls['email'].value,
            mobileNumber: registerForm.controls['mobNo'].value,
            password: this.encryptPassword(registerForm.controls['password'].value),
            registerType: 'MOBILE'
        }
    }

    // populateUserModel(form: FormGroup) {
    //     let user = new User();
    //     user.firstName = form.controls['firstName'].value;
    //     user.lastName = form.controls['lastName'].value;
    //     user.email = form.controls['email'].value;
    //     user.mobileNumber = form.controls['mobNo'].value;
    //     user.password = this.encryptPassword(form.controls['password'].value);
    //     user.registerType = "MOBILE";
    //     return user;
    // }

    registerResponseHandler(response): string {
        if (response.status === '500') {
            if (response.message === 'Mobile number already registered and please verify your mobile number') return "Mobile no. already registered, Please try again with new mobile number";
            if (response.message === 'Mobile number or email already registered.') return "Mobile no already registered";      //new email id but old mob no
            if (response.message === 'Email Id Already Registerd') return "Email id already registered";        //New Mobile No but old Id
            if (response.message === 'Email Id already exist and please verify your account') return "Email id already registred, verify your e-mail id"
            if (response.message === "Failure") {
                return ErrorResponse.INTERNAL_SERVER_ERROR;
            }
            return response.message;
        } else {
            return "Unknown Error Occured";
        }
    }

    confirmPasswordValidator(control: AbstractControl) {
        if (control && control.value != undefined) {
            if (control.root.get('password') && control.root.get('password') != undefined) {
                if (control.root.get('password').value != control.value) {
                    return {
                        passwordMatch: true
                    }
                }
            }
        }
        return null;
    }

}
