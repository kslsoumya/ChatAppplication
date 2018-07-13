import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpParams, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import * as io from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public baseUrl = 'https://chatapi.edwisor.com';
  private socket;

  constructor(public _http: HttpClient, private cookieService: CookieService) {
    this.socket = io(this.baseUrl);
  }


  // Events to be listened----


  public verifyUser = () => {
    // console.log('verifyUser');
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        console.log(data);
        observer.next(data);
      });

    });

  }


  public onlineUserList = (): any => {
    console.log('inside onlineUserList');
    const subscription =  Observable.create((observer) => {
        this.socket.on('online-user-list', (usersList) => {
          console.log(usersList);
          observer.next(usersList);
        });
    });
    console.log(subscription);
    return subscription;
  }

  public disConnect = (): any => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();

      });
    });
  }

  public chatByUserId = (userId): any => {
    return Observable.create((observer) => {
      this.socket.on('userId', (data) => {
        observer.next(data);
      });
    });
  }


  // events to be emitted---------
  public setUser: any = (authToken) => {
    // console.log('inside setuser');
    this.socket.emit('set-user', authToken);
  }

  public sendMessage = (chatMessage): any => {
    this.socket.emit('chat-msg', chatMessage);

  }

  public markChatAsSeen: any = (chatDetails) => {
    this.socket.emit('mark-chat-as-seen', chatDetails.userId, chatDetails.senderId);

  }


  public getPreviousChat = (senderId, receiverId, skip): Observable<any> => {
    return this._http.get(`${this.baseUrl}/api/v1/chat/get/for/user?senderId =${senderId}&
    receiverId=${receiverId}&skip=${skip}&authToken=${this.cookieService.get('authToken')}`);
    // .do(data => console.log('Data Received'))
    // .catchError(this.handleError);
  }


  public getUnSeenChats: any = () => {
    return this._http.get(`${this.baseUrl}/api/v1/chat/unseen/user/list`);

  }
  public exitSocket: any = () => {
    this.socket.disconnect();
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
