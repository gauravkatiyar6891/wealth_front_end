import { GlobalUtility } from './../global-utility';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private globalUtility: GlobalUtility) {
  }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
  }

}
