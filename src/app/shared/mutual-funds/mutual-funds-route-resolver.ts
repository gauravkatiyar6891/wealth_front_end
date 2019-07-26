import { Observable, of } from 'rxjs';
import { Injectable } from "@angular/core";
import { Platform } from '@angular/cdk/platform';
import { FundschemeService } from './../../services/fundscheme.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()

export class MutualFundsRouteResolver implements Resolve<any>{
    constructor(
        private platform: Platform,
        private fundSchemeService: FundschemeService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        if (!this.platform.isBrowser) {
            return this.fundSchemeService.getRecommendedFundSchemes();
        }
        else return of();
    }
}