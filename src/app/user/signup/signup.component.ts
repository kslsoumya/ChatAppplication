import { Component, OnInit } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public email: any;
  public mobile: any;
  public password: any;
  public apiKey: any;


  constructor(private toastr: ToastrService, private appService: AppService, private _route: Router) { }

  ngOnInit() {

  }
  public goToSignIn = (): any => {

    this._route.navigate(['/']);
  }
  public signUpFunction = (): any => {
    if (!this.firstName) {
      this.toastr.warning('Please enter the FirstName');
    } else if (!this.lastName) {
      this.toastr.warning('Please enter the LastName');
    } else if (!this.email) {
      this.toastr.warning('Please enter the Email');
    } else if (!this.mobile) {
      this.toastr.warning('Please enter the Mobile');
    } else if (!this.password) {
      this.toastr.warning('Please enter the Password');
    } else if (!this.apiKey) {
      this.toastr.warning('Please enter the ApiKey');
    } else {
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        apiKey: this.apiKey

      };
      this.appService.signUpFunction(data).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('SignUp successful', 'success!!');
            setTimeout(() => {
              this.goToSignIn();
            }, 1000
            );
          } else {
            this.toastr.error(apiResponse.message);
          }
        },
        (err) => {
          this.toastr.error(err.errorMessage);
        });
    }
  }
}
