import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Publication } from '../models/publication';

@Injectable();

export class UserService {
    public url: string;
    
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }
}

