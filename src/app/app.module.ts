import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { LoginComponent } from './user/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    UserModule,
    ChatModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent, pathMatch: 'full' },
        { path: '**', component: LoginComponent },
        { path: '*', component: LoginComponent },
        { path: '', redirectTo: 'login', pathMatch: 'full' }



      ]
    )
  ],
  providers: [AppService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
