import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { UserDetails } from './../../models/UserDetails';
import { BankDetails } from './../../models/bank-details';
import { BasicDetails } from './../../models/basic-details';
import { UserDetailsFormGroup, BankDetailsFormGroup } from './FormModels';
import { FieldLengthValidators } from './../../shared/Validators/field-validators';
import { FormSelectModel, PAN_REGEX, NAME_REGEX } from './../../Data/onboarding';

@Injectable()
export class OnBoardingHelper {
    constructor(private _formBuilder: FormBuilder) {

    }

    getMobileFormStructure(): FormGroup {
        return this._formBuilder.group({
            mobileNo: [{ value: undefined, disabled: true }],
            otp: [{ value: null, disabled: false }, Validators.compose([
                FieldLengthValidators(4)
            ])]
        });
    }

    getEmailFormStructure(): FormGroup {
        return this._formBuilder.group({
            email: [null, Validators.compose([
                Validators.required,
                Validators.email
            ])]
        });
    }

    getPanFormStructure(): FormGroup {
        return this._formBuilder.group({
            pan: [null, Validators.compose([
                Validators.required,
                Validators.pattern(PAN_REGEX)
            ]),],
            panNotVerifiedradio: ['-1']
        });
    }

    getUserDetailFormStructure(): FormGroup {
        let form: FormGroup = this._formBuilder.group({
            name: [null, Validators.compose([
                Validators.required,
                Validators.pattern(NAME_REGEX)
            ])],
            dob: [{ value: null }, Validators.required],
            gender: [null, Validators.required],
            occupation: [null, Validators.required],
            mothersName: [null, Validators.compose([
                Validators.required,
                Validators.pattern(NAME_REGEX)
            ])],
            fathersName: [null, Validators.compose([
                Validators.required,
                Validators.pattern(NAME_REGEX)
            ])],
            maritalStatus: [null, Validators.required],
            addressType: [null, Validators.required],
            addressLine1: [null, Validators.compose([
                Validators.required,
                Validators.maxLength(40)
            ])],
            addressLine2: [null, Validators.compose([
                Validators.maxLength(40),
            ])],
            state: [null, Validators.required],
            city: [null, Validators.required],
            pinCode: [null, Validators.compose([
                Validators.required,
                FieldLengthValidators(6)
            ])],
            incomeSlab: [null, Validators.required],
            pep: ['N', Validators.required]
        });
        // form.controls['dob'].valueChanges.subscribe(value => {
        //     let monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        //     let date = new Date(value);
        //     let dateStr = date.getDate() + "-" + monthsName[date.getMonth()] + "-" + date.getFullYear();
        //     console.log(dateStr);
        //     form.controls['dob'].setValue(dateStr, { emitEvent: false });
        // });
        return form;
    }

    getBankDetailFormStructure(): FormGroup {
        let form: FormGroup = this._formBuilder.group({
            ifscCode: [null, { updateOn: 'blur' }, Validators.compose([
                Validators.required,
                Validators.pattern(new RegExp("^[^\s]{4}0\d{6}$"))
            ])],
            bankName: [{ value: null, disabled: true }, Validators.required],
            micrCode: [{ value: null, disabled: true }],
            bankBranch: [{ value: null, disabled: true }],
            bankAddress: [{ value: null, disabled: true }],
            accountType: [null, Validators.required],
            accountNumber: [null, Validators.required],
            accountNumberConfirm: [null, Validators.compose([
                Validators.required,
                this.confirmBankAccountValidator
            ])],
            addNominee: false,
            nomineeName: [null, Validators.compose([
                Validators.pattern(NAME_REGEX)
            ])],
            nomineeRelation: [null],
            /*
            address: [null, Validators.required],
            state: [null, Validators.required],
            city: [null, Validators.required],
            pinCode: [null, Validators.compose([
                Validators.required,
                FieldLengthValidators(6)
            ])]
            */
        });
        form.controls['addNominee'].valueChanges.subscribe(() => {
            if (!form.controls['addNominee'].value) {
                form.controls['nomineeName'].setValidators(Validators.required);
                form.controls['nomineeRelation'].setValidators(Validators.required);
            } else {
                form.controls['nomineeName'].clearValidators();
                form.controls['nomineeRelation'].clearValidators();
                form.controls['nomineeName'].setValue('');
                form.controls['nomineeRelation'].setValue('');
                form.controls['nomineeName'].updateValueAndValidity()
                form.controls['nomineeRelation'].updateValueAndValidity();
            }
        })
        return form;
    }

    getStepControlFormStrucure(): FormGroup {
        return this._formBuilder.group({
            stepCheck: [false, Validators.requiredTrue]
        });
    }

    getFormControlValue(form: FormGroup, control: string) {
        return form.controls[control].value;
    }

    getProfileImageUploadString(profile) {
        return {
            "signatureString": profile, "fileName": "userImage"
        }
    }

    getSignatureImageUploadString(signature) {
        return {
            "signatureString": signature,
            "fileName": "signature",
            "fatca": true
        }
    }

    getPanCardImageUploadString(panCard) {
        return {
            "signatureString": panCard,
            "fileName": "pancard"
        }
    }

    getAddressImageUploadString(addressFront, addressBack) {
        return {
            "signatureString": addressFront,
            "backAdharCardString": addressBack,
            "fileName": "adharcard"
        }
    }

    confirmBankAccountValidator(control: AbstractControl) {
        if (control && control.value != undefined) {
            if (control.root.get('accountNumber') && control.root.get('accountNumber') != undefined) {
                if (control.root.get('accountNumber').value != control.value) {
                    return {
                        passwordMatch: true
                    }
                }
            }
        }
        return null;
    }

    getBase64Image(image) {
        return 'data:image/png;base64,' + btoa(image);
    }

    getUserBasicDetails(form: FormGroup): BasicDetails {
        let basicDetails = new BasicDetails();
        basicDetails.gender = this.getFormControlValue(form, UserDetailsFormGroup.GENDER);
        basicDetails.fullName = this.getFormControlValue(form, UserDetailsFormGroup.NAME);
        basicDetails.dob = this.getFormControlValue(form, UserDetailsFormGroup.DATE_OF_BIRTH);
        basicDetails.occupation = this.getFormControlValue(form, UserDetailsFormGroup.OCCUPATION);
        basicDetails.city = this.getFormControlValue(form, UserDetailsFormGroup.CITY);
        basicDetails.state = this.getFormControlValue(form, UserDetailsFormGroup.STATE);
        basicDetails.pinCode = this.getFormControlValue(form, UserDetailsFormGroup.PINCODE);
        basicDetails.addressLine1 = this.getFormControlValue(form, UserDetailsFormGroup.ADDRESS_LINE_1);
        basicDetails.addressLine2 = this.getFormControlValue(form, UserDetailsFormGroup.ADDRESS_LINE_2);
        basicDetails.addressType = this.getFormControlValue(form, UserDetailsFormGroup.ADDRESS_TYPE);
        basicDetails.incomeSlab = this.getFormControlValue(form, UserDetailsFormGroup.INCOME_SLAB);
        basicDetails.pep = this.getFormControlValue(form, UserDetailsFormGroup.PEP);
        return basicDetails;
    }

    getUserPersonalDetails(form: FormGroup): BasicDetails {
        let basicDetails = new BasicDetails();
        basicDetails.motherName = this.getFormControlValue(form, UserDetailsFormGroup.MOTHERS_NAME);
        basicDetails.fatherName = this.getFormControlValue(form, UserDetailsFormGroup.FATHERS_NAME);
        // let maritalStatus = this.getFormControlValue(form, UserDetailsFormGroup.MARITAL_STATUS) == true;
        basicDetails.maritalStatus = this.getFormControlValue(form, UserDetailsFormGroup.MARITAL_STATUS);
        return basicDetails;
    }

    getBankDetails(form: FormGroup): BankDetails {
        let bankDetails = new BankDetails();
        /*
        bankDetails.city = this.getFormControlValue(form, BankDetailsFormGroup.CITY);
        bankDetails.state = this.getFormControlValue(form, BankDetailsFormGroup.STATE);
        bankDetails.pinCode = this.getFormControlValue(form, BankDetailsFormGroup.PINCODE);
        bankDetails.address = this.getFormControlValue(form, BankDetailsFormGroup.ADDRESS);
        */
        bankDetails.micrCode = this.getFormControlValue(form, BankDetailsFormGroup.MICR_CODE);
        bankDetails.bankName = this.getFormControlValue(form, BankDetailsFormGroup.BANK_NAME);
        bankDetails.ifscCode = this.getFormControlValue(form, BankDetailsFormGroup.IFSC_CODE);
        bankDetails.bankBranch = this.getFormControlValue(form, BankDetailsFormGroup.BANK_BRANCH);
        bankDetails.bankAddress = this.getFormControlValue(form, BankDetailsFormGroup.BANK_ADDRESS);
        bankDetails.accountType = this.getFormControlValue(form, BankDetailsFormGroup.ACCOUNT_TYPE);
        bankDetails.nomineeName = this.getFormControlValue(form, BankDetailsFormGroup.NOMINEE_NAME);
        bankDetails.accountNumber = this.getFormControlValue(form, BankDetailsFormGroup.ACCOUNT_NUMBER);
        bankDetails.nomineeRelation = this.getFormControlValue(form, BankDetailsFormGroup.NOMINEE_RELATION);
        return bankDetails;
    }

    setBankDetailsByIFSCCode(form: FormGroup, bankName: string, micrCode: string, bankBranch: string, bankAddress: string): FormGroup {
        form.controls[BankDetailsFormGroup.BANK_NAME].setValue(bankName);
        form.controls[BankDetailsFormGroup.MICR_CODE].setValue(micrCode);
        form.controls[BankDetailsFormGroup.BANK_BRANCH].setValue(bankBranch);
        form.controls[BankDetailsFormGroup.BANK_ADDRESS].setValue(bankAddress);
        return form;
    }

    setUserDetailsByGetUserDetails(userDetails: UserDetails, form: FormGroup): FormGroup {
        form.controls[UserDetailsFormGroup.GENDER].setValue(userDetails.gender);
        form.controls[UserDetailsFormGroup.NAME].setValue(userDetails.pancardName);
        form.controls[UserDetailsFormGroup.DATE_OF_BIRTH].setValue(userDetails.dob);
        form.controls[UserDetailsFormGroup.OCCUPATION].setValue(userDetails.occupation);
        form.controls[UserDetailsFormGroup.MOTHERS_NAME].setValue(userDetails.motherName);
        form.controls[UserDetailsFormGroup.FATHERS_NAME].setValue(userDetails.fatherName);
        form.controls[UserDetailsFormGroup.MARITAL_STATUS].setValue(userDetails.maritalStatus);
        form.controls[UserDetailsFormGroup.INCOME_SLAB].setValue(userDetails.addressProof.incomeSlab);
        if (userDetails.addressProof) {
            form.controls[UserDetailsFormGroup.ADDRESS_TYPE].setValue(userDetails.addressProof.addressType);
            form.controls[UserDetailsFormGroup.CITY].setValue(userDetails.addressProof.city);
            form.controls[UserDetailsFormGroup.STATE].setValue(userDetails.addressProof.state);
            form.controls[UserDetailsFormGroup.ADDRESS_LINE_1].setValue(userDetails.addressProof.addressLine1);
            form.controls[UserDetailsFormGroup.ADDRESS_LINE_2].setValue(userDetails.addressProof.addressLine2);
            form.controls[UserDetailsFormGroup.PINCODE].setValue(userDetails.addressProof.pincode);
            form.controls[UserDetailsFormGroup.PEP].setValue(userDetails.addressProof.pep);
            form.controls[UserDetailsFormGroup.INCOME_SLAB].setValue(userDetails.addressProof.incomeSlab);
        }
        return form;
    }

    setBankDetailsByGetUserDetails(userDetails: UserDetails, form: FormGroup): FormGroup {
        form.controls[BankDetailsFormGroup.BANK_NAME].setValue(userDetails.bankName);
        form.controls[BankDetailsFormGroup.MICR_CODE].setValue(userDetails.micrCode);
        form.controls[BankDetailsFormGroup.IFSC_CODE].setValue(userDetails.ifscCode);
        form.controls[BankDetailsFormGroup.BANK_BRANCH].setValue(userDetails.bankBranch);
        form.controls[BankDetailsFormGroup.NOMINEE_NAME].setValue(userDetails.nomineeName);
        form.controls[BankDetailsFormGroup.ACCOUNT_TYPE].setValue(userDetails.accountType);
        form.controls[BankDetailsFormGroup.BANK_ADDRESS].setValue(userDetails.bankAddress);
        form.controls[BankDetailsFormGroup.ACCOUNT_NUMBER].setValue(userDetails.accountNumber);
        form.controls[BankDetailsFormGroup.NOMINEE_RELATION].setValue(userDetails.nomineeRelation);
        form.controls[BankDetailsFormGroup.CONFIRM_ACCOUNT_NUMBER].setValue(userDetails.accountNumber);
        /*
        if (resp.data.addressProof) {
            form.controls[BankDetailsFormGroup.CITY].setValue(resp.data.addressProof.city);
            form.controls[BankDetailsFormGroup.STATE].setValue(resp.data.addressProof.state);
            form.controls[BankDetailsFormGroup.ADDRESS].setValue(resp.data.addressProof.address);
            form.controls[BankDetailsFormGroup.PINCODE].setValue(resp.data.addressProof.pincode);
        }*/
        return form;
    }

}