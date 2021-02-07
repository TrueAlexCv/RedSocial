import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GLOBAL} from './global';
import {User} from '../models/user';

@Injectable()

export class UserService {
  public url: string;
  public identity: any;
  public token: any;
  public stats: any;

  constructor(public http: HttpClient) {
    this.url = GLOBAL.url;
  }

  registerUser(user: User): Observable<any> {
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.url + 'register', params,
      {headers});
  }

  loginUser(user: User, gettoken = false): Observable<any> {
    if (gettoken) {
      user = Object.assign(user, {gettoken});
    }

    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.url + 'login', params, {headers});
  }

  getIdentity(): any {
    const identity = JSON.parse(localStorage.getItem('identity')!);

    if (identity != 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken(): any {
    const token = localStorage.getItem('token');

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

  getStats(): any {
    const stats = JSON.parse(localStorage.getItem('stats')!);

    if (stats !== 'undefined') {
      this.stats = stats;
    } else {
      this.stats = null;
    }

    return this.stats;
  }

  getUser(id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.get(this.url + 'user/' + id, {headers});
  }

  getUsers(page = null): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    if (page != null) {
      return this.http.get(this.url + 'users/' + page,
        {headers});
    } else {
      return this.http.get(this.url + 'users/', {headers});
    }
  }

  getCounters(userId: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/josn')
      .set('Authorization', this.getToken());

    if (userId != null) {
      return this.http.get(this.url + 'counters/' + userId,
        {headers});
    } else {
      return this.http.get(this.url + 'counters/', {headers});
    }
  }

  updateUser(user: User): Observable<any> {
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.put(this.url + 'update-user/' + user._id, params,
      {headers});
  }

  updateProfile(user: User): Observable<any> {
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.post(this.url + 'update-profile/' + user._id, params,
      {headers});
  }

  updatePassword(passwords: any): Observable<any> {
    const params = JSON.stringify(passwords);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.post(this.url + 'change-password', params, {headers});
  }

  searchUsers(page = null, search: any): Observable<any> {
    const params = JSON.stringify(search);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.post(this.url + 'search-users/' + page, params, {headers});
  }

}
