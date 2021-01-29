import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    public title: string;
    public status: string;
    public user: User;
    public url: string;
    public identity: any;
    public token: any;

    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router
        ) {
        this.title = "Iniciar Sesión";
        this.url = GLOBAL.url;
        this.status = '';
        this.user = new User("","","","","","","","","ROLE_USER");
    }

    ngOnInit() {
        console.log("login.component ha sido cargado correctamente");
    }

    onSubmit(form: any) {
        this._userService.loginUser(this.user).subscribe(
        response => {
            this.identity = response.user;
            if(!this.identity || !this.identity._id) {
                this.status = 'error';
            } else {
                localStorage.setItem('identity', JSON.stringify(this.identity));
                this.getToken();
            }
        },
        error => {
            console.log(<any>error);
            if(error != null) {
                this.status = 'error';
            }
        });
    }

    getToken() {
        this._userService.loginUser(this.user, true).subscribe(
        response => {
            this.token = JSON.stringify(response.token);
            if(this.token.length < 0) {
                this,status = 'error'
            } else {
                localStorage.setItem('token', this.token);
                this.getCounters();
            }
        },
        error => {
            console.log(<any>error);
            if(error != null) {
                this.status = 'error';
            }
        });
    }

    getCounters() {
        this._userService.getCounters(this.user).subscribe(
        response => {
            localStorage.setItem('stats', JSON.stringify(response));
            this.status = 'success';
            this._router.navigate(['/timeline']);
        },
        error => {
            console.log(<any>error);
        });
    }
}
