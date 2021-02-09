import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {WebSocketService} from '../../services/web-socket.service';
import {Message} from '../../models/message';
import {MessageService} from '../../services/message.service';
import {UserService} from '../../services/user.service';
import {FollowService} from '../../services/follow.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [UserService, FollowService, MessageService]
})

export class MessagesComponent implements OnInit {
  public title = 'socket-front-client';
  public url: string;
  public status!: string;
  public identity: any;
  public token: any;
  public user: any;
  public messages!: any;
  public message: any;
  public input!: any;
  public page: number;
  public pages!: number;
  public total!: number;
  public follows!: any;
  public pagesMsg!: number;
  public totalMsg!: number;
  public receiver!: any;
  /* WebSockets(incompleto): */
  public msg!: any;
  public messagesSocket = ['Websockets:'];
  public input_message!: any;

  constructor(
    protected webSocketService: WebSocketService,
    private userService: UserService,
    private followService: FollowService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
    this.message = new Message('', '', '', '', this.identity._id, '');
    /* WebSockets(incompleto): */
    webSocketService.outEven.subscribe((res: any) => {
      this.messagesSocket.push(res.msg);
    });
  }

  ngOnInit(): void {
    console.log('messages.component ha sido cargado correctamente');
    this.getFollowed(1);
  }

  getFollowed(page: number): void {
    this.followService.getFollowedUsers(this.token, this.identity._id, page).subscribe(
      response => {
        if (response.follows) {
          this.follows = response.follows;
          this.total = response.total;
          this.pages = response.pages;
          if (page > this.pages) {
            this.router.navigate(['/messages']);
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error as any);
      });
  }

  getMessages(userId: any): void {
    this.receiver = userId;
    this.messageService.getMessages(this.token, {receiver: userId}).subscribe(
      response => {
        if (response.messages) {
          this.messages = response.messages;
          this.totalMsg = response.total;
          this.pagesMsg = response.pages;
          this.status = 'success';
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error as any);
      }
    );
    this.setViewed(userId);
  }

  setViewed(userId: any): void {
    this.messageService.setViewedMessages(this.token, {emitter: userId}).subscribe(
      response => {
        this.status = 'success';
      },
      error => {
        this.status = 'error';
        console.log(error as any);
      });
  }

  addMessage(userId: any): void {
    this.message.text = this.input;
    this.message.receiver = userId;
    this.messageService.addMessage(this.token, this.message).subscribe(
      response => {
        this.message.emitter = this.identity;
        this.message.receiver = this.userService.getUser(userId);
        this.messages.push(this.message);
        this.input = '';
      },
      error => {
        this.status = 'error';
        console.log(error as any);
      });
  }

  /* WebSockets(incompleto): */
  sendData(event: any): void {
    this.webSocketService.emitEvent(event,
      {
        message: this.input_message
      });
    this.input_message = null;
  }
}
