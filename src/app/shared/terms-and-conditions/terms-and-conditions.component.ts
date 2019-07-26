import { GlobalUtility } from './../global-utility';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private globalUtility: GlobalUtility) { }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
  }

}
