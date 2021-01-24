import { Injectable } frmo '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()

export class FollowService {
    public url: string;
    
    constructor(
    private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }
    
    followUser(token, follow): Observable<any> {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.post(this.url + 'follow' , params, {headers:headers});
    }
    
    unfollowUser(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.delete(this.url + 'unfollow/' + id, 
        {headers:headers});
    }
    
    getFollowingUsers(token, userId=null, page=1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        if(userId != null) {
            return this._http.get(this.url + 'following/' + 
            userId + '/' + page, {headers:headers});
        } else {
            return this._http.get(this.url + 'following/' + page, 
            {headers:headers});
        }
    }
    
    getFollowedUsers(token, userId = null, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        if(userId != null) {
            return this._http.get(this.url + 'followed/' + 
            userId + '/' + page, {headers:headers});
        } else {
            return this._http.get(this.url + 'followed/' + page, 
            {headers:headers});
        }
    }
    
    getOnlyFollowing(token): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);
        
        return this._http.get(this.url + 'only-following/' + true, 
        {headers:headers});
    }
}
