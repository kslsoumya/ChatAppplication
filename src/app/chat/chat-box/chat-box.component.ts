import { Component, OnInit, ViewChild } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from '../../shared/shared.module';
import { ChatMessage } from './chat';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit {
  @ViewChild('scrollMe')
  public authToken: any;
  public userInfo: any;
  public receiverName: any;
  public receiverId: any;
  public userList: any = [];
  public disconnectedSocket: boolean;

  public messageText: any;
  public scrollToTopChat = false;
  public messageList: any;
  public pageValue = 0;

  public previousChatLists: any = [];
  public loadingPreviousChat = false;


  constructor(private toastr: ToastrService, private appService: AppService, private _route: Router,
    private cookieService: CookieService, private socketService: SocketService) {
    this.receiverName = this.cookieService.get('receivername');
    console.log(this.receiverName);
    this.receiverId = this.cookieService.get('receiverId');
    console.log(this.receiverId);
  }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken');
    console.log(this.authToken);
    this.userInfo = this.appService.getUserInfo();
    console.log(this.userInfo);

    // this.receiverId = this.cookieService.get('receiverId');
    // this.receiverName = this.cookieService.get('receivername');
    console.log(this.receiverId + '--------' + this.receiverName);
    // if (this.receiverId !== null && this.receiverId !== undefined && this.receiverId !== '') {
    //   this.userSelectedTochat(this.receiverId, this.receiverName);
    // }
    this.checkStatus();

    this.verifyUserConfirmation();
    // this.getOnlineUsersList();

    this.getMessageFromUser();

  }
  public checkStatus = (): any => {
    if (this.cookieService.get('authToken') === undefined || this.cookieService.get('authToken') === '' ||
      this.cookieService.get('authToken') === null) {
      this._route.navigate(['/']);
      return false;
    } else {
      console.log(this.cookieService.get('authToken'));
      return true;
    }
  }
  public verifyUserConfirmation = (): any => {
    console.log('verifyUsercontent');
    this.socketService.verifyUser().subscribe(
      (data) => {
        console.log(data + 'In verify User');
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
        this.getOnlineUsersList();
      },
    error => {
      console.log(error);
    });
  }

  public getOnlineUsersList = (): any => {
    console.log('online usersList');

    this.socketService.onlineUserList().subscribe(
      (data) => {
        console.log(data);
        this.userList = [];
        // tslint:disable-next-line:forin
        for (const x in data) {
          const temp = { 'userId': x, 'name': data[x], 'unread': 0, 'chating': false };
          this.userList.push(temp);
        }
        console.log(this.userList);

      }
    );

  }

  public userSelectedTochat = (id, name) => {
    console.log('setting User active');
    this.userList.map(
      user => {
        if (user.userId === id) {
          user.chating = true;
        } else {
          user.chating = false;
        }
      });
    this.cookieService.set('receiverId', id);
    this.cookieService.set('receivername', name);
    this.receiverName = name;
    this.receiverId = id;
    this.messageList = [];
    this.pageValue = 0;
    const chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    };
    this.socketService.markChatAsSeen(chatDetails);

  }

  public sendMessageUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) {
      this.sendMessage();

    }
  }

  public sendMessage: any = () => {
    if (this.messageText) {
      const chatMessage: ChatMessage = {
        senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: this.cookieService.get('receivername'),
        receiverId: this.cookieService.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()
      };
      this.socketService.sendMessage(chatMessage);
      this.pushToChatWindow(chatMessage);
    } else {
      this.toastr.warning('Message cannot be empty');
    }

  }

  public pushToChatWindow: any = (data) => {
    this.messageText = '';
    this.messageList.push(data);
    this.scrollToTopChat = false;
  }
  public getMessageFromUser: any = () => {
    this.socketService.chatByUserId(this.userInfo.userId).subscribe(
      (data) => {
        const miscData = (this.receiverId === data.senderId) ? this.messageList.push(data) : '';
        this.toastr.success(`${data.senderName} says : ${data.message}`);
        this.scrollToTopChat = false;
      });

  }
  public loadPreviousChatFromUser: any = () => {
    const previousData = this.messageList.length > 0 ? this.messageList.slice() : [];
    this.socketService.getPreviousChat(this.userInfo.userId, this.receiverId, this.pageValue * 10).
      subscribe(apiResponse => {
        if (apiResponse.status === 200) {
          this.messageList = apiResponse.data.concat(previousData);
        } else {
          this.messageList = previousData;
          this.toastr.warning('No messages available');
        }
        this.loadingPreviousChat = false;
      }, err => {
        this.toastr.error('Some Error Occured');
      });

  }

  public logOut: any = () => {
    this.appService.logOutFunction()
      .subscribe(apiResponse => {
        if (apiResponse.status === 200) {
          this.cookieService.deleteAll();
          this.socketService.exitSocket();
          this._route.navigate(['/']);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
        (err) => {
          this.toastr.error('some error occured');
        });

  }

  public loadEarlierPageOfChats: any = () => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToTopChat = true;
    this.loadPreviousChatFromUser();

  }

  public showUserName: any = (name: string) => {
    this.toastr.success('you are chatting with' + name);

  }



}
