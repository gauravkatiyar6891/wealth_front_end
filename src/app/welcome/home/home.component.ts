import { GraphHelper } from './graph-helper';
import { Platform } from '@angular/cdk/platform';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import Glide from '@glidejs/glide';
import { HomeHelper } from "./home";
import { Finance } from "financejs";
import { GoalsService } from '../../services/goals.service';
import { GlobalUtility } from '../../shared/global-utility';
import { GoogleAnalyticsService } from './../../services/google-analytics.service';

@Component({
  selector: 'g4w-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [HomeHelper, GraphHelper]
})

export class HomeComponent implements OnInit {

  @ViewChild("money_target") moneyTargetTagRef: ElementRef;


  moneyTarget: FormGroup;
  moneyCalculate: FormGroup;

  showMoneyTarget: boolean = false;
  showMoneyCalculate: boolean = false;

  moneyTargetAmountInvested: number = 0;
  moneyTargetWealthCreated: number = 0;

  moneyCalculateSip: number = 0;
  moneyCalculateLumpsum: number = 0;

  constructor(
    private router: Router,
    private platform: Platform,
    private route: ActivatedRoute,
    private homeHelper: HomeHelper,
    public graphHelper: GraphHelper,
    private sipService: GoalsService,
    private formBuilder: FormBuilder,
    private ga: GoogleAnalyticsService,
    private globalUtility: GlobalUtility,
  ) {
    this.moneyTarget = this.homeHelper.getSecondGoalPart1CalculatorFormGroup();
    this.moneyCalculate = this.homeHelper.getSecondGoalPart2CalculatorFormGroup();
  }

  ngOnInit() {
    // this.globalUtility.scrollAnimateTo(0);
    this.route.fragment.subscribe(fragment => {
      if (fragment == 'moneyTarget') this.moneyTargetTagRef.nativeElement.scrollIntoView();
      else this.globalUtility.scrollAnimateTo(0);
    });
    if (this.platform.isBrowser) {

      new Glide('.fund-partners .glide', {
        type: 'slider',
        startAt: 0,
        perView: 4,
        bound: true,
        autoplay: 2000,
        rewindDuration: 2000,
        breakpoints: {
          576: {
            perView: 3
          },
          380: {
            perView: 2
          }
        },
        hoverpause: true,
        animationDuration: 200
      }).mount();
      new Glide('.one-stop-solution-cont .glide', {
        type: 'slider',
        startAt: 0,
        perView: 2,
        gap: 100,
        bound: true,
        autoplay: 2000,
        hoverpause: true,
        animationDuration: 1000,
        breakpoints: {
          576: {
            perView: 1,
            gap: 20,
          }
        }
      }).mount();
      setTimeout(() => {
        new Glide('.goal-calc-cont .side-image .glide', {
          type: 'slider',
          startAt: 0,
          perView: 1,
          autoplay: 2000,
          hoverpause: true,
          animationDuration: 700
        }).mount();
      }, 1000);
    }
  }

  gotoAdvanceSip() {
    // this.ga.sendEvent('Goal Calculator', 'Click', 'Customize Goal Clicked on Home Page');
    this.router.navigate(['goal-planning']);
  }

  investNow() {
    // this.ga.sendEvent('Customize Goal', 'Customize Goal Clicked');
    this.router.navigate(['mutual-funds']);
  }

  moneyTargetSubmit() {
    if (this.moneyTarget.controls['invType'].value == 0) {
      this.moneyTargetAmountInvested = this.moneyTarget.controls['amount'].value;
      this.moneyTargetWealthCreated = this.getFutureValue(
        this.moneyTarget.controls['amount'].value,
        this.moneyTarget.controls['duration'].value,
        this.moneyTarget.controls['roi'].value
      );
    } else {
      this.moneyTargetAmountInvested = this.moneyTarget.controls['amount'].value * this.moneyTarget.controls['duration'].value * 12;
      this.moneyTargetWealthCreated = this.getCostFromMonthlySip(
        this.moneyTarget.controls['amount'].value,
        this.moneyTarget.controls['duration'].value,
        this.moneyTarget.controls['roi'].value
      );
    }
  }

  moneyCalculateSubmit() {
    this.moneyCalculateSip = this.getMonthlySip(
      this.moneyCalculate.controls['amount'].value,
      this.moneyCalculate.controls['duration'].value,
      this.moneyCalculate.controls['roi'].value
    );
    this.moneyCalculateLumpsum = this.getLumpSum(
      this.moneyCalculate.controls['amount'].value,
      this.moneyCalculate.controls['duration'].value,
      this.moneyCalculate.controls['roi'].value
    );
  }

  plan() {
    this.globalUtility.scrollAnimateTo(1570);
  }

  getMonthlySip(futureValue: number, duration: number, roi: number): number {
    duration *= 12;
    let rate = roi / (100 * 12);
    return rate * futureValue / (Math.pow(1 + rate, duration) - 1);
  }

  getLumpSum(cost: number, duration: number, roi): number {
    duration *= 12;
    let rate = roi / (100 * 12);
    return cost / Math.pow((1 + rate), duration);
  }

  getCostFromMonthlySip(cost: number, duration: number, roi: number): number {
    duration *= 12;
    let rate = roi / (100 * 12);
    return (cost * (Math.pow(1 + rate, duration) - 1)) / rate;
  }

  getFutureValue(cost: number, duration: number, roi: number): number {
    duration = duration * 12;
    roi = roi / 12;
    return (new Finance()).FV(roi, cost, duration);
  }

}