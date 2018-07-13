import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public baseUrl = 'https://chatapi.edwisor.com/api/v1';

  constructor(public _http: HttpClient , public cookieService: CookieService) { }

  public signUpFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('apiKey', data.apiKey);
    return (this._http.post(`${this.baseUrl}/users/signup`, params));



  }

  public signInFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return (this._http.post(`${this.baseUrl}/users/login`, params));
  }

  public logOutFunction(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authToken'));
    return (this._http.post(`${this.baseUrl}/users/logout`, params));
  }

  public setUserInfo(data): any {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  public getUserInfo(): any {
    return  JSON.parse(localStorage.getItem('userInfo'));
  }


  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } // end condition *if
    console.error(errorMessage);
    return Observable.throw(errorMessage);

  }
}
