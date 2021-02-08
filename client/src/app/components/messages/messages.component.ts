import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '../../services/web-socket.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {
  public title = 'socket-front-client';
  public user: any;
  public msg!: any;
  public input_message!: any;
  public messages = ['Hola'];

  constructor(protected webSocketService: WebSocketService) {
    webSocketService.outEven.subscribe((res: any) => {
      this.messages.push(res.msg);
    });
  }

  ngOnInit(): void {
    console.log('messages.component ha sido cargado correctamente');
  }

  sendData(event: any): void {
    this.webSocketService.emitEvent(event,
      {
        message: this.input_message
      });
    this.input_message = null;
  }
}
