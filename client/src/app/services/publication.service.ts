import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/htpp';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Publication } from '../models/publication';

@Injectable()

export class PublicationService {
    public url: string;
    
    constructor(
    private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }
    
    makePublication(token, publication): Observable<any> {
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.post(this.url + 'publication', params, 
        {headers:headers});
    }
    
    deletePublication(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.delete(this.url + 'publication/' + id, 
        {headers:headers});
    }
    
    getPublication(token, id) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.get(this.url + 'publication/' + id, 
        {headers:headers});
    }
    
    getPublicationsUser(token, userId = null, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'applicaiton/json')
        .set('Authorization', token);
        
        if(userId != null) {
            return this._http.get(this.url + 'publications/' + userId + '/' + 
            page, {headers:headers});
        } else {
            return this._http.get(this.url + 'publications/' + page, 
            {headers:headers});
        }
    }
    
    getTimeline(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.get(this.url + 'timeline/' + page, {headers:headers});
    }
}