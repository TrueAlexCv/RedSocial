import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()

export class LikeService {
  public url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  addLike(token: any, like: any): Observable<any> {
    const params = JSON.stringify(like);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'add-like', params, { headers: headers });
  }

  deleteLike(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.delete(this.url + 'delete-like/' + id, { headers: headers });
  }

  getLikesUser(token: any, id: any, page: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'likes-user/' + id + '/' + page, { headers: headers });
  }

  getLikesPublication(token: any, id: any, page: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'likes-publication/' + id + '/' + page, { headers: headers });
  }

  getCountLikesUser(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'num-likes-user/' + id, { headers: headers });
  }

  getCountLikesPublication(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'num-likes-publication/' + id, { headers: headers });
  }

  getOnlyLikes(token: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'only-likes', { headers: headers });
  }
}
