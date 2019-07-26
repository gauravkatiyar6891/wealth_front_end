import { Component, OnInit } from '@angular/core';
import { GlobalUtility } from '../../global-utility';
import { Router, ActivatedRoute } from '@angular/router';
import { FundschemeService } from '../../../services/fundscheme.service';

@Component({
  selector: 'app-model-portfolio-details',
  templateUrl: './model-portfolio-details.component.html',
  styleUrls: ['./model-portfolio-details.component.scss']
})
export class ModelPortfolioDetailsComponent implements OnInit {

  portfolioCategoryName: string = '';
  portfolioKeyword: string = ''
  modelportfolioDetailList: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.portfolioKeyword = params['portfolioName'];
      if (this.portfolioKeyword) this.getModelportfolioDetail();
      else this.router.navigate(['mutual-funds']);
    });
  }

  getModelportfolioDetail() {
    this.globalUtility.displayLoader();
    this.fundSchemeService.getModelportfolioDetail(this.portfolioKeyword).subscribe(resp => {
      this.globalUtility.displayLoader(false);
      if (resp.status == '200') [this.modelportfolioDetailList, this.portfolioCategoryName] = [resp.data, resp.data[0].portfolioCategoryName];
    });
  }

  investNow() {
    if (this.globalUtility.userData) {
      if (this.globalUtility.userData.status == 0) this.router.navigate(["user/onboarding"]);
      else if (this.globalUtility.userData.status == 1) this.router.navigate(["user/create-portfolio", this.portfolioKeyword]);
    } else this.globalUtility.openLoginDialog();
  }

}
