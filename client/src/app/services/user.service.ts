import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Publication } from '../models/publication';

@Injectable();

export class UserService {
    public url: string;
    public identity;
    public token;
    public stats;
    
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }
    
    registerUser(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        
        return this._http.post(this.url + 'register', params, 
                {headers: headers});
    }
    
    loginUser(user: User, gettoken=null): Observable<any> {
        if(gettoken != null) {
            user = Object.assign(user, {gettoken});
        }
        
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        
        return this._http.post(this.url + 'login', params, {headers: headers});
    }
    
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        
        if(identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        
        return this.identity;
    }
    
    getToken() {
        let token = localStorage.getItem('token');
        
        if(token != 'undefined') {
            this.token = token
        } else {
            this.token = null;
        }
        
        return this.token;
    }
    
    getStats() {
        let stats = JSON.parse(localStorage.getItem('stats'));
        
        if(stats != 'undefined') {
            this.stats = stats;
        } else {
            this.stats = null;
        }
        
        return this.stats;
    }
}

