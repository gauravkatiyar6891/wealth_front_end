export interface UserDetails {
    userId: number,
    userName: string,
    email: string,
    mobile: string,
    message: string,
    panNumber: string,
    fullName: string,
    pancardName: string,
    dob: string,
    gender: string,
    bankName: string,
    ifscCode: string,
    bankAddress: string,
    bankBranch: string,
    nomineeName: string,
    nomineeRelation: string,
    accountType: string,
    accountNumber: string,
    micrCode: string,
    startDate: string,
    endDate: string,
    motherName: string,
    fatherName: string,
    maritalStatus: string,
    registerType: string,
    occupation: string,
    status: number,
    userOverallStatus: number,
    orderStatus: string,
    xsipId: string,
    xsipStatus: string,
    isipId: string,
    isipStatus: string,
    uccClientCode: string,
    mandateStatus: string,
    uploadMandateStatus: string,
    goalSize: number,
    emailVerified: boolean,
    mobileVerified: boolean,
    panVerified: boolean,
    ifscCodeVerified: boolean,
    userGoalExist: boolean,
    signatureImageExist: boolean,
    userImageExist: boolean,
    pancardImageExist: boolean,
    adharcardImageExist: boolean,
    panExist: boolean,
    addressProof: UserAddressProof | null
}

export interface UserAddressProof {
    addressProofName: string,
    addressProofNo: string,
    address: string,
    pincode: string,
    city: string,
    state: string,
    mobileWithAadhaar: string,
    verified: string,
    addressType: string,
    incomeSlab: string,
    pep: string,
    addressLine1: string,
    addressLine2: string,
    userGoalExist: boolean,
    aadhaarVerified: boolean
}