import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GlobalUtility } from './../../shared/global-utility';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit {

  isWatchListEmpty: boolean = false;
  showWatchListLoader: boolean = true;
  watchList = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private globalUtility: GlobalUtility
  ) { }

  ngOnInit() {
    this.getWatchList();
  }

  getWatchList() {
    this.userService.getWatchlist().subscribe(resp => {
      if (resp.data) this.watchList = resp.data;
      if (!this.watchList) this.isWatchListEmpty = true;
      this.showWatchListLoader = false;
    });
  }

  removeFromWatchList(schemeCode, index) {
    this.globalUtility.displayLoader();
    this.userService.removeAndPurchaseFromWatchlist('remove', schemeCode).subscribe(resp => {
      if (resp.status == '200') this.watchList.splice(index, 1);
      this.globalUtility.displayLoader(false);
    });
  }

  purchaseFromWatchList(schemeKeyword, schemeId) {
    if (this.globalUtility.userData.status == 0) this.router.navigate(['user/onboarding']);
    else if (this.globalUtility.userData.status == 1) this.router.navigate(['user/investment', schemeKeyword, 'lumpsum', schemeId]);
  }

}
