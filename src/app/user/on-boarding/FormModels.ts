export enum MobileFormGroup {
    MOBILE_NO = "mobileNo",
    OTP = "otp"
}

export enum EmailFormGroup {
    EMAIL_ID = "email"
}

export enum PanFormGroup {
    PAN = "pan",
    PAN_NOT_VERIFIED_RADIO = "panNotVerifiedradio",
    AADHAR_NO = "aadharNo"
}

export enum UserDetailsFormGroup {
    NAME = "name",
    GENDER = "gender",
    DATE_OF_BIRTH = "dob",
    OCCUPATION = "occupation",
    MOTHERS_NAME = "mothersName",
    FATHERS_NAME = "fathersName",
    MARITAL_STATUS = "maritalStatus",
    ADDRESS_TYPE = "addressType",
    CITY = "city",
    STATE = "state",
    PINCODE = "pinCode",
    ADDRESS_LINE_1 = "addressLine1",
    ADDRESS_LINE_2 = "addressLine2",
    INCOME_SLAB = "incomeSlab",
    PEP = "pep"
}

export enum BankDetailsFormGroup {
    BANK_NAME = "bankName",
    MICR_CODE = "micrCode",
    IFSC_CODE = "ifscCode",
    BANK_BRANCH = "bankBranch",
    ADD_NOMINEE = "addNominee",
    BANK_ADDRESS = "bankAddress",
    ACCOUNT_TYPE = "accountType",
    NOMINEE_NAME = "nomineeName",
    ACCOUNT_NUMBER = "accountNumber",
    NOMINEE_RELATION = "nomineeRelation",
    CONFIRM_ACCOUNT_NUMBER = "accountNumberConfirm"
}

export enum UploadDocumentsFormGroup {
    PROFILE = "profile",
    PAN_CARD = "panCard",
    SIGNATURE = "signature",
    AADHAR_BACK = "aadharBack",
    AADHAR_FRONT = "aadharFront"
}

export interface Documents {
    profile: string,
    signature: string,
    panCard: string,
    aadharFront: string,
    aadharBack: string
}