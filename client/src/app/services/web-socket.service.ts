import {Injectable, EventEmitter, Output} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {environment} from 'src/environments/environment';

@Injectable()

export class WebSocketService extends Socket {

  @Output() outEven: EventEmitter<any> = new EventEmitter();

  constructor() {
    super({
      url: environment.serverSocket
    });
    this.ioSocket.on('message', (res: any) => this.outEven.emit(res));
  }

  emitEvent = (event = 'default', payload = {}) => {
    this.ioSocket.emit('default', {
      event,
      payload
    });
  }

}
