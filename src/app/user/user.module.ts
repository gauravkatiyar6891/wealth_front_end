import { NgModule } from '@angular/core';
import { ImageCropperModule } from "ngx-image-cropper";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from './../pipes/pipes.module';
import { SendOtpPipe } from './on-boarding/send-otp.pipe';

import { UserService } from '../services/user.service';
import { GoalsService } from '../services/goals.service';
import { DialogService } from '../services/dialog.service';
import { EmandateService } from '../services/emandate.service';
import { FundschemeService } from '../services/fundscheme.service';
import { LoginSignUp } from './../welcome/login-signup/login-signup';

import { MessagesModule } from './../messages/messages.module';
import { UserRoutingModule, UserRoutingComponents } from './user-routing.module';

import { MaterialModule } from './../material';
import { MandateComponent } from './mandate/mandate.component';
import { RedeemComponent } from './portfolio/redeem/redeem.component';
import { DocumentsComponent } from './on-boarding/documents/documents.component';
import { PanVerifyComponent } from './on-boarding/pan-verify/pan-verify.component';
import { AadharKycComponent } from './on-boarding/aadhar-kyc/aadhar-kyc.component';
import { GoalsDialogComponent } from './investment/goals-dialog/goals-dialog.component';
import { BankDetailsComponent } from './on-boarding/bank-details/bank-details.component';
import { MandateUploadComponent } from './mandate/mandate-upload/mandate-upload.component';
import { AddToFolioDialogComponent } from './portfolio/add-to-folio-dialog/add-to-folio-dialog.component';
import { UserBasicDetailsComponent } from './on-boarding/user-basic-details/user-basic-details.component';
import { MobileEmailVerifyComponent } from './on-boarding/mobile-email-verify/mobile-email-verify.component';

@NgModule({
  imports: [
    FormsModule,
    PipesModule,
    CommonModule,
    MaterialModule,
    MessagesModule,
    UserRoutingModule,
    ImageCropperModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe,
    LoginSignUp,
    UserService,
    GoalsService,
    DialogService,
    EmandateService,
    FundschemeService,
  ],
  declarations: [
    SendOtpPipe,
    RedeemComponent,
    MandateComponent,
    AadharKycComponent,
    DocumentsComponent,
    PanVerifyComponent,
    GoalsDialogComponent,
    BankDetailsComponent,
    UserRoutingComponents,
    MandateUploadComponent,
    UserBasicDetailsComponent,
    AddToFolioDialogComponent,
    MobileEmailVerifyComponent
  ],
  entryComponents: [
    RedeemComponent,
    AadharKycComponent,
    GoalsDialogComponent,
    MandateUploadComponent,
    AddToFolioDialogComponent,
  ]
})
export class UserModule { }
