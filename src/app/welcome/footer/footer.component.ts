import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'g4w-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  ARN_NO: string = "144511";    //Do not Modify
  CIN_NO: string = "U74999HR2018PTC073287";   //Do not Modify
  constructor(
    private platform: Platform
  ) {
    if (this.platform.isBrowser) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://seal.godaddy.com/getSeal?sealID=3OUWdkoa3qPFnTXeVxLpjgSQTivyYAnlB96Qe3T1sUu1zioNPYn4IG7px1I4';
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }

  ngOnInit() {
  }

}