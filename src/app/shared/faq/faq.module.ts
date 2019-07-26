import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq.component';
import { MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    RouterModule.forChild([
      {
        path: '',
        component: FaqComponent
      }
    ])
  ],
  declarations: [FaqComponent]
})
export class FaqModule { }
