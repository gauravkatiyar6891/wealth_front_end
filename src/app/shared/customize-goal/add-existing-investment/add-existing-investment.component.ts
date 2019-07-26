import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomizeGoal, AssetClass } from '../../../models/LocalGoals';

@Component({
  selector: 'app-add-existing-investment',
  templateUrl: './add-existing-investment.component.html',
  styleUrls: ['./add-existing-investment.component.scss']
})
export class AddExistingInvestmentComponent implements OnInit {

  existingInvestmentFormGroup: FormGroup;
  goals: CustomizeGoal[];
  existingInvestment: AssetClass[];

  constructor(@Inject(MAT_DIALOG_DATA) data, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddExistingInvestmentComponent>) {
    this.existingInvestmentFormGroup = this.formBuilder.group({
      investment: [null, Validators.required],
      associateGoal: [null, Validators.required],
      currentValue: [null, Validators.compose([
        Validators.required,
        Validators.min(1)
      ])]
    });
    this.existingInvestment = data.assetClass;
    this.goals = data.goals;
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close({
      investment: this.existingInvestment[this.existingInvestmentFormGroup.controls['investment'].value].id,
      goalIndex: this.existingInvestmentFormGroup.controls['associateGoal'].value,
      currentValue: this.existingInvestmentFormGroup.controls['currentValue'].value
    });
  }

}
