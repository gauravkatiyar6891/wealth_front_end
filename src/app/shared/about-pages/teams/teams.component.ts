import { Component, OnInit } from '@angular/core';
import { TeamMemberDescComponent } from './team-member-desc/team-member-desc.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDesc(id) {
    this.dialog.open(TeamMemberDescComponent, {
      panelClass: 'team-member-cont',
      data: { memberId: id }
    });
  }
}
