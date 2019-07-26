import { Platform } from '@angular/cdk/platform';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import Glide from '@glidejs/glide';
import { GlobalUtility } from '../../global-utility';
import { Component, OnInit, HostListener } from '@angular/core';
import { FundschemeService } from '../../../services/fundscheme.service';
import { ModelPortfolio, ModelPortfolioData } from '../../../Data/ModelPortfolioData';

@Component({
  selector: 'app-fund-overview',
  templateUrl: './fund-overview.component.html',
  styleUrls: ['./fund-overview.component.scss']
})
export class FundOverviewComponent implements OnInit {

  recommendedSchemesList = [];
  isScreenWidthMobile: boolean = false;
  modelPortfolios: ModelPortfolio[] = ModelPortfolioData;

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService
  ) {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (this.platform.isBrowser) {
      if (window.innerWidth < 576) this.isScreenWidthMobile = true;
      else this.isScreenWidthMobile = false;
    }
  }

  ngOnInit() {
    // if (!this.platform.isBrowser) {
    //   this.route.data.subscribe(resp => {
    //     if (resp.scheme.status == '200') this.setRecoSchemeList(resp.scheme.data);
    //   });
    // } else {
    //   this.globalUtility.scrollAnimateTo(0);
    //   this.globalUtility.displayLoader();
    //   zip(this.fundSchemeService.getModelportfolioList(), this.fundSchemeService.getRecommendedFundSchemes()).subscribe(resp => {
    //     if (resp[0].status == '200') this.setMinAmountPortfolio(resp[0].data);
    //     if (resp[1].status == '200') this.setRecoSchemeList(resp[1].data);
    //     this.globalUtility.displayLoader(false);
    //   });
    // }
    this.globalUtility.scrollAnimateTo(0);
    this.globalUtility.displayLoader();
    this.fundSchemeService.getRecommendedFundSchemes().subscribe(resp => {
      this.setRecoSchemeList(resp.data);
      this.globalUtility.displayLoader(false);
    });
    // zip(this.fundSchemeService.getModelportfolioList(), this.fundSchemeService.getRecommendedFundSchemes()).subscribe(resp => {
    //   if (resp[0].status == '200') this.setMinAmountPortfolio(resp[0].data);
    //   if (resp[1].status == '200') this.setRecoSchemeList(resp[1].data);
    //   this.globalUtility.displayLoader(false);
    // });
  }

  setMinAmountPortfolio(data: any[]) {
    data.forEach((model, index) => {
      this.modelPortfolios[index].minSipAmount = Number(model.portfolioCategoryMinSipAmount);
      this.modelPortfolios[index].minLumpSumAmount = Number(model.portfolioCategoryMinLumpsumAmount);
    });
    if (this.isScreenWidthMobile) {
      new Glide('.mutual-fund-list-mob-mod .glide', {
        type: 'slider',
        swipeThreshold: 80,
        dragThreshold: 80,
        startAt: 0,
        perView: 1
      }).mount();
    }
  }

  setRecoSchemeList(data) {
    this.recommendedSchemesList = data;
    setTimeout(() => {
      if (this.isScreenWidthMobile) {
        new Glide('.mutual-fund-list-mob-sch .glide', {
          type: 'slider',
          swipeThreshold: 80,
          dragThreshold: 80,
          startAt: 0,
          perView: 1
        }).mount();
      }
    }, 1000);
  }

}
