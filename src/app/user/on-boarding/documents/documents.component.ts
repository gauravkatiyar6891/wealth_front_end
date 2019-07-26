import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { Documents } from './../FormModels';
import { OnBoardingHelper } from '../on-boarding';
import { UserDetails } from './../../../models/UserDetails';
import { UserService } from './../../../services/user.service';
import { GlobalUtility } from './../../../shared/global-utility';
import { DialogService } from './../../../services/dialog.service';
import { EmandateService } from './../../../services/emandate.service';

@Component({
  selector: 'g4w-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnChanges {

  showProgressSpinner: boolean = false;

  @Input('userData') userData: UserDetails;
  @Input('needAddressProof') needAddressProof: boolean;
  @Output('onBoardingCompleted') onBoardingCompleted = new EventEmitter<boolean>();

  fallbackProfileImage: string = '../../../assets/fallback-images/profile.png';
  fallbackSignatureImage: string = '../../../assets/fallback-images/signature.png';
  fallbackPanImage: string = '../../../assets/fallback-images/pan.jpg';

  uploadDocumentErrorMessage: string = "";

  imageChangedEvent: any;
  croppedImage: any;
  imageType: string = '';

  uploadImageFormData: Documents = {
    profile: '',
    signature: '',
    panCard: '',
    aadharFront: '',
    aadharBack: ''
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private globalUtility: GlobalUtility,
    private dialogService: DialogService,
    private eMandateService: EmandateService,
    private onBoardingHelper: OnBoardingHelper
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.userData) {
      if (this.userData.userImageExist) {
        this.eMandateService.getOnboardingImageString("userImage").subscribe((resp) => {
          this.uploadImageFormData.profile = resp.data;
        })
      }
      if (this.userData.signatureImageExist) {
        this.eMandateService.getOnboardingImageString("signature").subscribe((resp) => {
          this.uploadImageFormData.signature = resp.data;
        })
      }
      if (this.userData.pancardImageExist) {
        this.eMandateService.getOnboardingImageString("pancard").subscribe((resp) => {
          this.uploadImageFormData.panCard = resp.data;
        })
      }
      if (this.userData.adharcardImageExist) {
        this.eMandateService.getOnboardingImageString('adharcardfront').subscribe((resp) => {
          this.uploadImageFormData.aadharFront = resp.data;
        });
        this.eMandateService.getOnboardingImageString('adharcardback').subscribe((resp) => {
          this.uploadImageFormData.aadharBack = resp.data;
        });
      }
    }
  }

  uploadDocuments() {
    this.showProgressSpinner = true;
    // this.onBoardingStepper.selectionChange.subscribe(() => this.onBoardingStepper.selectedIndex = 5);
    this.eMandateService.uploadSignature(this.onBoardingHelper.getProfileImageUploadString(this.uploadImageFormData.profile)).subscribe((resp) => {
      if (resp.data == "success") {
        if (this.needAddressProof) {
          this.eMandateService.uploadSignature(this.onBoardingHelper.getPanCardImageUploadString(this.uploadImageFormData.panCard)).subscribe((resp) => {
            if (resp.data == 'success') {
              this.eMandateService.uploadSignature(this.onBoardingHelper.getAddressImageUploadString(this.uploadImageFormData.aadharFront, this.uploadImageFormData.aadharBack)).subscribe((resp) => {
                this.uploadSignature();
              });
            } else this.snackBar.open("Unable to upload PAN Card. Please try later.", "", { duration: 3000 });
          });
        } else this.uploadSignature();
      } else this.snackBar.open("Unable to upload Profile Photo. Please try later.", "", { duration: 3000 });
    });
  }

  uploadSignature() {
    this.eMandateService.uploadSignature(this.onBoardingHelper.getSignatureImageUploadString(this.uploadImageFormData.signature)).subscribe((resp) => {
      if (resp.data == "success") {
        this.showProgressSpinner = false;
        this.onBoardingCompleted.emit(true);
        this.globalUtility.changeHeaderProfilePicture();
        this.userService.getUserDetails().subscribe(resp);    //for updating user details locally
        setTimeout(() => {
          this.router.navigate(['user/dashboard']);
        }, 3000);
      } else {
        this.showProgressSpinner = false;
        this.uploadDocumentErrorMessage = resp.data;
      }
    });
  }

  openImageCropper(event, imageType) {
    this.imageChangedEvent = event;
    this.imageType = imageType;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    this.imageChangedEvent = null;
    this.dialogService.displayMessage('Invalid Image or Extension', false);
  }

  submitImage() {
    this.uploadImageFormData[this.imageType] = this.croppedImage;
    this.imageChangedEvent = null;
  }

}
