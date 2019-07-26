import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GlobalUtility } from './../../shared/global-utility';
import { environment } from './../../../environments/environment';
import { FundschemeService } from '../../services/fundscheme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  blogs = [];
  recommendedSchemesList = [];
  accountActivationStatus = 0;
  showActivationStatus: boolean = true;
  articleImageUrl = environment.BASE_API_URL + '/admin/getImageById/';

  constructor(
    private router: Router,
    private userService: UserService,
    public globalUtility: GlobalUtility,
    private fundSchemeSerivce: FundschemeService,
  ) {
  }

  ngOnInit() {
    this.globalUtility.displayLoader();
    this.fundSchemeSerivce.getRecommendedFundSchemes().subscribe(resp => {
      this.recommendedSchemesList = resp.data.slice(0, 4);
      this.globalUtility.displayLoader(false);
    });
    // zip(this.fundSchemeSerivce.getRecommendedFundSchemes(), this.userService.getLatestBlog()).subscribe(resp => {
    //   if (resp[0].status == '200') this.recommendedSchemesList = resp[0].data.slice(0, 4);
    //   if (resp[1].status == '200') this.blogs = resp[1].data;
    //   this.globalUtility.displayLoader(false);
    // });
    this.checkAccountActivation();
  }

  checkAccountActivation() {
    this.globalUtility.getUserData().then(userData => {
      if (userData.userOverallStatus == 0) this.accountActivationStatus = 1;    //do onboarding
      else if (userData.userOverallStatus == 1) {
        if (userData.panVerified) {
          if (userData.orderStatus == "false") this.accountActivationStatus = 2;//show onboarding process completed message
        } else this.accountActivationStatus = 3;//show in working status;
      }
    });
  }

  gotoBlog(id) {
    this.router.navigate(['blogdetail/blog'], { queryParams: { blogId: id } });
  }

}