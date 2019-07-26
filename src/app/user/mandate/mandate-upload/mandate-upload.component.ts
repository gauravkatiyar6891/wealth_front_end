import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { GlobalUtility } from './../../../shared/global-utility';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mandate-upload',
  templateUrl: './mandate-upload.component.html',
  styleUrls: ['./mandate-upload.component.scss']
})
export class MandateUploadComponent implements OnInit {

  mandateFormType: string = '';
  showMandateType: boolean = false;
  fileSizeError: boolean = false;
  mandateFormData: string = '';

  mandateImageName: string = '';
  constructor(
    private globalUtility: GlobalUtility,
    private userService: UserService,
    public dialogRef: MatDialogRef<MandateUploadComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.showMandateType = this.data.showMandateType;
    this.mandateImageName = this.data.mandateImageName + ' Mandate Form.tiff';
  }

  ngOnInit() {
    if (!this.data.showMandateType) {
      this.mandateFormType = "Create";
      this.getMandateForm("Create");
    }
  }

  getMandateForm(mandateFormType) {
    this.mandateFormData = '';
    this.userService.getMandateForm(mandateFormType).subscribe(resp => {
      this.mandateFormData = resp.data;
    });
  }

  mandateUpload(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        let uploadModel = {
          fileName: file.name,
          imageType: file.type,
          signatureString: (<string>reader.result).split(',')[1]
        }
        let fileSize = file.size / 1024;
        if (fileSize > 1024) this.fileSizeError = true;
        else this.reduceFileSizeAndUpload(uploadModel, event);
      }
    }
  }

  reduceFileSizeAndUpload(uploadModel, event) {
    this.globalUtility.displayLoader();
    this.dialogRef.close(uploadModel);
  }

}
