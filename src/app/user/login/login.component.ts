import { Component, OnInit } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: any;
  public password: any;

  constructor(private toastr: ToastrService, private appService: AppService, private _route: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
  }

  public goToSignUp = (): any => {
    this._route.navigate(['/sign-up']);

  }
  public signInFunction = (): any => {
    if (!this.email) {
      this.toastr.warning('Enter Email');
    } else if (!this.password) {
      this.toastr.warning('Enter password');
    } else {
      const data = {
        email: this.email,
        password: this.password
      };
      this.appService.signInFunction(data).subscribe(
        (apiResponse) => {
          console.log(apiResponse);
          if (apiResponse.status === 200) {
            this._route.navigate(['/chat']);
            this.toastr.success('SignedIn Successfully', 'success!!');
            this.cookieService.set('authToken', apiResponse.data.authToken);
            this.cookieService.set('receiverId', apiResponse.data.userDetails.userId);
            this.cookieService.set('receivername', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
            this.appService.setUserInfo(apiResponse.data.userDetails);
          } else {
            this.toastr.error(apiResponse.message);
            console.log('some error');
          }
        },
        (err) => {
          this.toastr.error(err.errorMessage);
        }
      );
    }

  }

}
