import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements OnInit {
  @ViewChild('stepper') private riskStepper: MatStepper;
  questions: Questions[];
  questionFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<RiskProfileComponent>) {

    this.questionFormGroup = this.formBuilder.group({
      qno1: [null, Validators.required],
      qno2: [null, Validators.required],
      qno3: [null, Validators.required],
      qno4: [null, Validators.required],
      qno5: [null, Validators.required],
      qno6: [null, Validators.required]
    })
    this.questions = Questions;
  }

  ngOnInit() {
  }

  submit() {
    let sum = 0;
    this.questions.forEach(element => {
      sum += this.questionFormGroup.controls[element.formControl].value + 1;
    });
    this.dialogRef.close(sum);
  }

}

export const Questions: Questions[] = [
  {
    quest: "What is the first thought to cross your mind, when you invest your money?",
    options: [
      "I should not lose my money",
      "This should not turn out to be a bad investment",
      "This should turn out to be a good investment",
      "I know this is a good decision"
    ],
    formControl: 'qno1'
  },
  {
    quest: "What do you normally associate with the word 'risk' ?",
    options: [
      "Danger",
      "Uncertainty",
      "Opportunity",
      "Thrill"
    ],
    formControl: 'qno2'
  },
  {
    quest: "Would you prefer to run your own business or be a salaried employee ?",
    options: [
      "Being a salaried employee",
      "Being a salaried employee while running a part-time business",
      "Running a partnership business",
      "Running my own business"
    ],
    formControl: 'qno3'
  },
  {
    quest: "To what extent would you expose your investments to risk, to earn higher returns?",
    options: [
      "None at all",
      "About 20%",
      "About 40%",
      "More than 50%"
    ],
    formControl: 'qno4'
  },
  {
    quest: "How would you feel if the performance of your recent investments are below expectations?",
    options: [
      "Very Upset",
      "Somewhat upset, but hope that it will improve in the future",
      "Uneasy but willing to take it in my stride",
      "Not upset because I know that all investments carry risk"
    ],
    formControl: 'qno5'
  },
  {
    quest: "Would you invest in a company that underperformed in the past and caused you losses?",
    options: [
      "Definitely Not",
      "May be, but am not very sure",
      "Perhaps I will",
      "Definitely yes"
    ],
    formControl: 'qno6'
  }
];

export interface Questions {
  quest: string,
  options: string[],
  formControl: string
}