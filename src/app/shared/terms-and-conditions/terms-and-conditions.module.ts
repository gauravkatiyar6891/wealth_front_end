import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TermsAndConditionsComponent
      }
    ])
  ],
  declarations: [TermsAndConditionsComponent],
  providers: []
})
export class TermsAndConditionsModule { }
