import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Platform } from '@angular/cdk/platform';
import { catchError, map } from 'rxjs/operators';
import { GlobalUtility, LocalStorageDataModel } from './../shared/global-utility';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable()
export class HttpHelperService {

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private snackBar: MatSnackBar,
    private globalUtility: GlobalUtility
  ) { }

  get(url: string, query: Object, requiresAuth = false, header?: HttpHeaders): Observable<any> {
    let headers = this.addCustomHeaders(false, requiresAuth, header);
    let searchParams = this.addSearchParams(query);
    return this.http.get(url, { headers, observe: 'response', params: searchParams, withCredentials: true })
      .pipe(
        map(res => this.checkAuthHeader(res)),
        catchError(this.handleError.bind(this))
      );
  }

  post(url: string, body: any, isUrlEncoded = false, requiresAuth = false, header?: HttpHeaders): Observable<any> {
    // if(isUrlEncoded){
    // }    Temporary skipped as no method in the application requires UrlEncoded to be true
    let headers = this.addCustomHeaders(isUrlEncoded, requiresAuth, header);
    return this.http.post(url, body, { headers, observe: 'response', withCredentials: true })
      .pipe(
        map(res => this.checkAuthHeader(res)),
        catchError(this.handleError.bind(this))
      );
  }

  postWithoutErrorCatch(url: string, body: any, isUrlEncoded = false, requiresAuth = false, header?: HttpHeaders): Observable<any> {
    // if(isUrlEncoded){
    // }    Temporary skipped as no method in the application requires UrlEncoded to be true
    let headers = this.addCustomHeaders(isUrlEncoded, requiresAuth, header);
    return this.http.post(url, body, { headers, observe: 'response', withCredentials: true })
      .pipe(
        map(res => this.checkAuthHeader(res))
      );
  }

  put(url: string, body: any, isUrlEncoded = false, requiresAuth = false, header?: HttpHeaders): Observable<any> {
    //Url Encoded has been skipped
    let headers = this.addCustomHeaders(isUrlEncoded, requiresAuth, header);
    return this.http.put(url, body, { headers, observe: 'response', withCredentials: true })
      .pipe(
        map(res => this.checkAuthHeader(res)),
        catchError(this.handleError.bind(this))
      );
  }

  delete(url: string, query: Object, isUrlEncoded = false, requiresAuth = false, header?: HttpHeaders): Observable<any> {
    let headers = this.addCustomHeaders(false, requiresAuth, header);
    let searchParams = this.addSearchParams(query);
    return this.http.delete(url, { headers, observe: 'response', params: searchParams, withCredentials: true })
      .pipe(
        map(res => this.checkAuthHeader(res)),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 504 || error.status == 0) this.globalUtility.showNoInternet();
    if (error.error) {
      if (error.status == 500 && error.error.message == 'Token expired') this.globalUtility.clearTokenFromLocalStorage();
      else if (error.error) this.snackBar.open("Network Error Occured", "", { duration: 5000 });
      // else this.snackBar.open("Empty Response From Server", "", { duration: 5000 });
      console.error(error.error);
    }
    this.globalUtility.displayLoader(false);
    return of();
    // return throwError(error.error);
  }

  private checkAuthHeader(response: HttpResponse<any>) {
    if (response.headers) {
      let authorizationHeader = response.headers.get('Authorization') || response.headers.get('authorization');
      if (authorizationHeader) {
        this.globalUtility.clearTokenTimer();
        this.globalUtility.setDataOnLocalStorage({ token: authorizationHeader, secureTimeStamp: (new Date()).toString() });
      }
      if (response.headers.get('id')) this.globalUtility.setDataOnLocalStorage({ userId: response.headers.get('id') });
      let forgotPasswordToken = response.headers.get('FORGETPASSWORD_HEADER_NAME') || response.headers.get('forgetpassword_header_name');
      if (forgotPasswordToken) this.globalUtility.forgetPasswordToken = forgotPasswordToken;
    }
    return response.body;
  }

  private addCustomHeaders(isUrlEncoded = false, requiresAuth = false, customHeaders?: HttpHeaders): HttpHeaders {
    let headers: HttpHeaders;
    if (isUrlEncoded) {
      headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
    }
    if (requiresAuth) headers = headers.append('Authorization', this.globalUtility.getDataFromLocalStorage(LocalStorageDataModel.TOKEN));
    if (customHeaders) customHeaders.keys().forEach(key => headers = headers.append(key, customHeaders.get(key)));
    if (this.platform.ANDROID) headers = headers.append('Platform', 'Android');
    else headers = headers.append('Platform', 'Browser');
    return headers;
  }

  private addSearchParams(customParam: Object) {
    let search: HttpParams = new HttpParams();
    for (const key in customParam) search = search.append(key, customParam[key]);
    return search;
  }
}
