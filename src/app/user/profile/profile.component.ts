import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { GlobalUtility } from './../../shared/global-utility';
import { environment } from './../../../environments/environment';
import { EmandateService } from '../../services/emandate.service';
import { LoginSignUp } from './../../welcome/login-signup/login-signup';
import { MessageDialogComponent } from './../../messages/message-dialog/message-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [LoginSignUp],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  resetPasswordForm: FormGroup;
  passwordChangeSuccess: boolean = false;
  passwordChangeFailure: boolean = false;
  imageExtensionError: boolean = false;
  imageSizeError: boolean = false;
  form: FormGroup;
  message: string = '';
  userId: number = 0;
  maritalStatusChangeText: string = '';

  signatureImage: string;
  userImage: string;
  pancardImage: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  showUserImage: boolean = false;
  showAadhaarImage: boolean = false;
  showPanImage: boolean = false;
  showSignatureImage: boolean = false;
  useParam: string = '';

  files: FileList;
  filestring: string;
  userImageFilestring: string;

  profilePicture: string;
  userSignaturePicture: string;
  aadhaarFrontPicture: string = '';
  aadhaarBackPicture: string = '';
  userPanPicture: string = '';
  private baseUrl = environment.BASE_API_URL;

  mandateStatus: any;
  userOverallStatus: any;
  mandateNumber: any;
  mandateForm: any = '';
  errorMessage: string = '';
  successMessage: string = '';
  fileName: string = '';
  fileSize: any;

  docSuccessMessage: string = '';
  docErrorMessage: string = '';
  addressProofFrontImageName: string = '';
  addressProofBackImageName: string = '';
  mandateFormType: any = '';
  uploadMandateStatus: any;

  openImageChanger: boolean = false;

  imageChangedEvent: any;
  croppedImage: any;

  constructor(
    private snackBar: MatSnackBar,
    private messageDialog: MatDialog,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private loginFormHelper: LoginSignUp,
    public globalUtility: GlobalUtility,
    private eMandateService: EmandateService
  ) {
    this.resetPasswordForm = this._formBuilder.group({
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(7)
      ])],
      cnfPassword: [null, Validators.compose([
        Validators.required,
        this.confirmPasswordValidator
      ])]
    });
  }

  ngOnInit() {
    this.getDocument();
  }

  changePassword() {
    this.globalUtility.displayLoader();
    this.passwordChangeFailure = false;
    this.passwordChangeSuccess = false;
    this.userService.changePassword({ newPassword: this.loginFormHelper.encryptPassword(this.resetPasswordForm.controls['password'].value) }).subscribe(response => {
      if (response.status == 200) this.passwordChangeSuccess = true;
      else this.passwordChangeFailure = true;
      this.globalUtility.displayLoader(false);
    });
  }

  maritalStatusDisplayText() {
    if (this.globalUtility.userData.maritalStatus == 'Single') this.maritalStatusChangeText = 'Married';
    else if (this.globalUtility.userData.maritalStatus == 'Married') this.maritalStatusChangeText = 'Single';
  }

  changeMaritalStatus(maritalStatus) {
    this.globalUtility.displayLoader();
    this.userService.changeMaritalStatus(maritalStatus).subscribe(resp => {
      if (resp.message == 'Success') {
        this.globalUtility.userData.maritalStatus = resp.data;
        this.maritalStatusDisplayText();
      }
      this.globalUtility.displayLoader(false);
    });
  }

  openImageCropper(event) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    this.imageChangedEvent = null;
    this.openMessageDiaolog('Invalid Image or Extension', false, true);
  }

  uploadImage() {
    this.globalUtility.displayLoader();
    this.eMandateService.uploadSignature({ signatureString: this.croppedImage, fileName: 'userImage' }).subscribe(resp => {
      if (resp.status == '200') {
        this.globalUtility.userProfileImage = this.croppedImage;
        this.userService.getProfilePicture();
      } else this.snackBar.open("Failed to Change Profile Picture", "", {
        duration: 3000
      });
      this.imageChangedEvent = null;
      this.globalUtility.displayLoader(false);
    });
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

  getDocument() {
    this.globalUtility.getUserData().then(userData => {
      if (userData.signatureImageExist) {
        this.signatureImage = "";
        this.showSignatureImage = true;
        this.getUserSignatureImage();
      } else {
        this.showSignatureImage = false;
        this.signatureImage = "disabled";
      } if (userData.adharcardImageExist) {
        this.aadharBackImage = "";
        this.showAadhaarImage = true;
        this.getAadharBackImage();
      } else {
        this.aadharBackImage = "disabled";
        this.showAadhaarImage = false;
      } if (userData.adharcardImageExist) {
        this.aadharFrontImage = "";
        this.showAadhaarImage = true;
        this.getAadharFrontImage();
      } else {
        this.aadharFrontImage = "disabled";
        this.showAadhaarImage = false;
      } if (userData.pancardImageExist) {
        this.pancardImage = "";
        this.showPanImage = true;
        this.getPancardImage();
      } else {
        this.pancardImage = "disabled";
        this.showPanImage = false;
      } if (userData.userImageExist) {
        this.userImage = "";
        this.showUserImage = true;
      } else {
        this.userImage = "disabled";
        this.showUserImage = false;
      }
    });
  }

  getAadharFrontImage() {
    var aadhaarFrontImageUrl = this.baseUrl + '/e-mandate/getImages/adharcardfront';
    this.userService.getDocumentImage(aadhaarFrontImageUrl).subscribe((response) => {
      this.aadhaarFrontPicture = response.data;
    });
  }

  getAadharBackImage() {
    var aadhaarBackImageUrl = this.baseUrl + '/e-mandate/getImages/adharcardback';
    this.userService.getDocumentImage(aadhaarBackImageUrl).subscribe((response) => {
      this.aadhaarBackPicture = response.data;
    });
  }

  getUserImage() {
    var profilePictureUrl = this.baseUrl + '/e-mandate/getImages/userImage';
    this.userService.getDocumentImage(profilePictureUrl).subscribe((response) => {
      this.profilePicture = response.data;
    });
  }

  getUserSignatureImage() {
    var signatureUrl = this.baseUrl + '/e-mandate/getImages/signature';
    this.userService.getDocumentImage(signatureUrl).subscribe((response) => {
      this.userSignaturePicture = response.data;
    });
  }

  getPancardImage() {
    var userPanUrl = this.baseUrl + '/e-mandate/getImages/' + 'pancard';
    this.userService.getDocumentImage(userPanUrl).subscribe((response) => {
      this.userPanPicture = response.data;
    });
  }

  getUserImageFiles(event, type) {
    this.files = event.target.files;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      if (type == 'adharcardFront') {
        this.userImageFilestring = event.target.result;
        this.addressProofFrontImageName = this.files[0].name;
      }
      else if (type == 'adharcardBack') {
        this.aadhaarBackPicture = event.target.result;
        this.addressProofBackImageName = this.files[0].name;
      } else {
        this.userImageFilestring = event.target.result;
        this.saveProfileImageFile(type);
      }
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  saveProfileImageFile(type: string) {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.userImageFilestring.split("/").length > 10) {
      this.globalUtility.displayLoader();
      this.eMandateService.uploadSignature({ "signatureString": this.userImageFilestring, "fileName": type, "backAdharCardString": this.aadhaarBackPicture }).subscribe((res) => {
        this.globalUtility.displayLoader(false);
        this.globalUtility.scrollAnimateTo(0);
        if (res.data == "success") {
          this.docSuccessMessage = 'File uploaded successfully';
          setTimeout(() => {
            this.docSuccessMessage = '';
          }, 3000);
        } else {
          this.docErrorMessage = 'Unable to upload. Please try later.';
          setTimeout(() => {
            this.docErrorMessage = '';
          }, 3000);
        }
      });
    }
  }

  saveAddressProofImage() {
    this.saveProfileImageFile('adharcard');
  }

  openMessageDiaolog(message, success = false, failure = false) {
    this.messageDialog.open(MessageDialogComponent, {
      data: {
        message: message,
        success: success,
        failure: failure
      }
    });
  }

  getUserData() {
    return this.globalUtility.userData;
  }

}

interface UserData {
  name: string,
  email: string,
  mobile: string,
  city: string,
  maritalStatus: string,
  panCardExist: boolean,
  signatureExist: boolean,
  addressProofExist: boolean,
  imageUrl: string
  dob: string,
  panNumber: string,
  bankName: string,
  ifscCode: string,
  bankBranch: string,
  accountNumber: string,
  uccClientCode: string,
  xsipId: string,
  xsipStatus: string,
  isipId: string,
  isipStatus: string,
  userOverallStatus: string,
  panVerified: string
}