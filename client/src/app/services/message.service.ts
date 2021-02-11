import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GLOBAL} from './global';

@Injectable()

export class MessageService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addMessage(token: any, message: any): Observable<any> {
    const params = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'add-message', params, {headers: headers});
  }

  getMessages(token: any, userId: any): Observable<any> {
    const params = JSON.stringify(userId);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'get-messages', params, {headers: headers});
  }

  getEmittedMessages(token: any, userId: any): Observable<any> {
    const params = JSON.stringify(userId);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'get-emitted-messages', params, {headers: headers});
  }

  getReceivedMessages(token: any, userId: any): Observable<any> {
    const params = JSON.stringify(userId);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'get-received-messages', params, {headers: headers});
  }

  setViewedMessages(token: any, message: any): Observable<any> {
    const params = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'set-viewed-messages', params, {headers: headers});
  }

  deleteMessage(token: any, message: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.delete(this.url + 'delete-message/' + message, {headers:headers});
  }
}
