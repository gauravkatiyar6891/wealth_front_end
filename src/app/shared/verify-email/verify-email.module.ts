import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([
      {
        path: '',
        component: VerifyEmailComponent
      }
    ])
  ],
  declarations: [VerifyEmailComponent]
})
export class VerifyEmailModule { }
