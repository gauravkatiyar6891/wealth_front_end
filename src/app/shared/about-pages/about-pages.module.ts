import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPagesComponent } from './about-pages.component';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatIconModule, MatDialogModule } from '@angular/material';
import { MatTabsModule } from "@angular/material/tabs";
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { TeamMemberDescComponent } from './teams/team-member-desc/team-member-desc.component';
import { TeamsComponent } from './teams/teams.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CareersComponent } from './careers/careers.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutPagesComponent,
        children: [
          {
            path: '',
            redirectTo: 'about-us'
          },
          {
            path: 'about-us',
            component: AboutUsComponent
          },
          {
            path: 'teams',
            component: TeamsComponent
          },
          {
            path: 'careers',
            component: CareersComponent
          },
          {
            path: 'customer-support',
            component: CustomerSupportComponent
          }
        ]
      }

    ])
  ],
  declarations: [AboutPagesComponent, TeamMemberDescComponent, CustomerSupportComponent,
    TeamsComponent,
    AboutUsComponent,
    CareersComponent,
  ],
  entryComponents: [TeamMemberDescComponent]
})
export class AboutPagesModule { }
