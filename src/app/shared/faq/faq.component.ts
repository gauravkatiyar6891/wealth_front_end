import { Component, OnInit } from '@angular/core';
import { FAQ } from "./../../Data/faq";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqs;

  constructor() {
    this.faqs = FAQ;
  }

  ngOnInit() {
  }

}
