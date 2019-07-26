import { zip, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalUtility } from '../../global-utility';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FundschemeService } from '../../../services/fundscheme.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'g4w-all-funds',
  templateUrl: './all-funds.component.html',
  styleUrls: ['./all-funds.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllFundsComponent implements OnInit {
  mutualFundFormGroup: FormGroup;

  schemeTypes: string[];
  private offset: number = 0;
  retrievingFunds: boolean = false;
  showModelPortfolio: boolean = true;
  retrievingFundsBySearch: boolean = false;
  schemesList = [];

  autoCompleteSchemes = [];
  autoCompleteSubscription: Subscription;

  queryParamSeach: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuider: FormBuilder,
    private globalUtility: GlobalUtility,
    private fundSchemeService: FundschemeService,
  ) {
    this.mutualFundFormGroup = this._formBuider.group({
      keywordMutualFund: [null],
      schemeType: ['Growth'],
      schemeCategory: [null]
    });
  }

  ngOnInit() {
    this.globalUtility.displayLoader();
    this.fundSchemeService.getAllSchemeType().subscribe(resp => {
      if (resp.status == '200') this.schemeTypes = resp.data;
    });
    this.route.queryParams.subscribe(params => {
      if (this.queryParamSeach) {
        this.queryParamSeach = false;
        if (params['type']) this.mutualFundFormGroup.controls['schemeType'].setValue(params['type']);
        if (params['category']) this.mutualFundFormGroup.controls['schemeCategory'].setValue(params['category']);
        if (params['keyword']) this.mutualFundFormGroup.controls['keywordMutualFund'].setValue(params['keyword']);
        this.fundSchemeService.searchScheme(this.getSearchParams(true, true)).subscribe(resp => {
          this.addListenersOnFilters();
          if (resp.status == '200') this.schemesList = resp.data;
          this.globalUtility.displayLoader(false);
        });
      }
    })
  }

  popKeyword(removeParam) {
    if (!removeParam) this.mutualFundFormGroup.controls['schemeCategory'].setValue(null);
    else {
      this.mutualFundFormGroup.controls['keywordMutualFund'].setValue(null);
      this.addSearchKeyParameter();
    }
  }

  nextSchemesList() {
    if (!this.retrievingFunds) {
      this.retrievingFunds = true;
      this.fundSchemeService.searchScheme(this.getSearchParams()).subscribe(resp => {
        if (resp.status == '200') {
          resp.data.forEach(scheme => this.schemesList.push(scheme));
          this.retrievingFunds = false;
        } else if (resp.status == '503') {
          this.retrievingFunds = false;
        }
      });
    }
  }

  addSearchKeyParameter() {
    this.retrievingFundsBySearch = true;
    if (this.autoCompleteSubscription) {
      this.autoCompleteSubscription.unsubscribe();
    }
    this.autoCompleteSchemes = [];
    this.fundSchemeService.searchScheme(this.getSearchParams(true)).subscribe(resp => {
      if (resp.status == '200') this.schemesList = resp.data;
      this.retrievingFundsBySearch = false;
      this.autoCompleteSchemes = [];
    });
  }

  private addListenersOnFilters() {
    this.mutualFundFormGroup.controls['schemeType'].valueChanges.subscribe(() => {
      this.retrievingFundsBySearch = true;
      this.fundSchemeService.searchScheme(this.getSearchParams(true)).subscribe(resp => {
        if (resp.status == '200') this.schemesList = resp.data;
        this.retrievingFundsBySearch = false;
      });
    });
    this.mutualFundFormGroup.controls['schemeCategory'].valueChanges.subscribe(() => {
      this.retrievingFundsBySearch = true;
      this.fundSchemeService.searchScheme(this.getSearchParams(true)).subscribe(resp => {
        if (resp.status == '200') this.schemesList = resp.data;
        this.retrievingFundsBySearch = false;
      });
    });
    this.mutualFundFormGroup.controls['keywordMutualFund'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(data => {
      if (data == '') this.autoCompleteSchemes = [];
      else this.autoCompleteSearch();
    });
  }

  autoCompleteNavigate(event: MatAutocompleteSelectedEvent) {
    this.router.navigate(['mutual-funds/scheme', event.option.value]);
  }

  autoCompleteSearch() {
    let searchParams: SchemeSearchParams = {
      offset: 0,
      schemeCategory: this.mutualFundFormGroup.controls['schemeCategory'].value,
      schemeName: this.mutualFundFormGroup.controls['keywordMutualFund'].value,
      schemeType: this.mutualFundFormGroup.controls['schemeType'].value
    }
    this.autoCompleteSubscription = this.fundSchemeService.searchScheme(searchParams).subscribe(resp => {
      if (resp.status == '200') this.autoCompleteSchemes = resp.data;
    })
  }

  getSearchParams(filterValueChange = false, queryParamCall = false): SchemeSearchParams {
    let searchParams: SchemeSearchParams = {
      offset: 0,
      schemeCategory: this.mutualFundFormGroup.controls['schemeCategory'].value,
      schemeName: this.mutualFundFormGroup.controls['keywordMutualFund'].value,
      schemeType: this.mutualFundFormGroup.controls['schemeType'].value
    }
    if (!queryParamCall) this.router.navigate(['mutual-funds/all'], {
      queryParams: {
        category: searchParams.schemeCategory,
        keyword: searchParams.schemeName,
        type: searchParams.schemeType
      }
    });
    if (filterValueChange) {
      searchParams.offset = 0;
      this.offset = 0;
    } else searchParams.offset = ++this.offset;
    return searchParams;
  }

}

export interface SchemeSearchParams {
  offset: number,
  schemeType: string,
  schemeName: string,
  schemeCategory: string,
}