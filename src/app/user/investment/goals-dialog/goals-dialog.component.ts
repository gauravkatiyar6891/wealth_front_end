import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-goals-dialog',
  templateUrl: './goals-dialog.component.html',
  styleUrls: ['./goals-dialog.component.scss']
})
export class GoalsDialogComponent implements OnInit {
  goalFormGroup: FormGroup;
  goals: Goal[];

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<GoalsDialogComponent>
  ) {
    this.goalFormGroup = this._formBuilder.group({
      goal: [null, Validators.required]
    });
    this.goals = data.goals;
  }

  ngOnInit() { }

  goalSubmit() {
    this.dialogRef.close(this.goals.find(g => g.goalId == this.goalFormGroup.controls['goal'].value));
  }

}

export interface Goal {
  goalId: number,
  goalName: string
}