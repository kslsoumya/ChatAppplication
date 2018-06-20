import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharacterPipe } from '../shared/pipe/remove-special-character-pipe';
// import { ChatRouteGuardService } from '../chat-route-guard.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'chat', component: ChatBoxComponent }
    ]),
    SharedModule
  ],
  declarations: [ChatBoxComponent, RemoveSpecialCharacterPipe],
  providers: []
})
export class ChatModule { }
