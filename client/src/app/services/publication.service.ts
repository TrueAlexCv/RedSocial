import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()

export class PublicationService {
  public url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  makePublication(token: any, publication: any): Observable<any> {
    const params = JSON.stringify(publication);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'publication', params,
      { headers });
  }

  deletePublication(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.delete(this.url + 'publication/' + id,
      { headers });
  }

  getPublication(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'publication/' + id,
      { headers });
  }

  getPublicationsUser(token: any, userId: any = null, page = 1)
    : Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    if (userId != null) {
      return this.http.get(this.url + 'publications/' + userId + '/' +
        page, { headers });
    } else {
      return this.http.get(this.url + 'publications/' + page,
        { headers });
    }
  }

  getTimeline(token: any, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'timeline/' + page, { headers });
  }

  getImage(image: any): Observable<any> {
    return this.http.get(this.url + 'publication-image/' + image);
  }
}
