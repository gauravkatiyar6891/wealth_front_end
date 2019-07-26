import { Component, OnInit } from '@angular/core';
import { GlobalUtility } from '../../global-utility';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private globalUtility: GlobalUtility) { }

  ngOnInit() {
    this.globalUtility.scrollAnimateTo(0);
  }

}
