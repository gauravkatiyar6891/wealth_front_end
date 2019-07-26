import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {
  goalFormGroup: FormGroup;
  showCustomGoalField: boolean = false;
  goals;
  constructor(@Inject(MAT_DIALOG_DATA) goals, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddGoalComponent>) {
    this.goalFormGroup = this.formBuilder.group({
      goal: [null, Validators.required],
      newGoal: [null],
      duration: [null, Validators.compose([
        Validators.required,
        Validators.min(1)
      ])],
      cost: [null, Validators.compose([
        Validators.required,
        Validators.min(1)
      ])]
    });
    this.goalFormGroup.controls['goal'].valueChanges.subscribe(goalIndex => {
      if (goalIndex == 99) {
        this.showCustomGoalField = true;
        this.goalFormGroup.controls['newGoal'].setValidators(Validators.required);
        this.goalFormGroup.controls['newGoal'].updateValueAndValidity();
        this.goalFormGroup.controls['duration'].setValue(null);
        this.goalFormGroup.controls['cost'].setValue(null);
      } else {
        this.showCustomGoalField = false;
        this.goalFormGroup.controls['newGoal'].setValidators(null);
        this.goalFormGroup.controls['newGoal'].updateValueAndValidity();
        this.goalFormGroup.controls['duration'].setValue(this.goals[goalIndex].duration);
        this.goalFormGroup.controls['cost'].setValue(this.goals[goalIndex].cost);
      }
    });
    this.goals = goals;
  }

  ngOnInit() {
  }

  submit() {
    let goalName = this.goalFormGroup.controls['goal'].value == 99 ? this.goalFormGroup.controls['newGoal'].value : this.goals[this.goalFormGroup.controls['goal'].value].name;
    let newGoal: NewGoal = {
      goalName: goalName,
      duration: this.goalFormGroup.controls['duration'].value,
      costOfGoal: this.goalFormGroup.controls['cost'].value
    }
    this.dialogRef.close(newGoal);
  }

}

export interface NewGoal {
  goalName: string,
  duration: number,
  costOfGoal: number
}