import { Component, OnInit, DoCheck } from '@angular/core';
import { Router,  ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
@Component({
    selector: 'login',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    providers: [UserService]
})

export class RegisterComponent implements OnInit {
    public title: string; 
    public user: User;
    public status: string;
    public aceptado: any;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
        ) {
        this.title = "Register";
        this.status = "";
        this.user = new User("","","","","","","","","ROLE_USER");
    }
    
    ngOnInit() {
        console.log("register.component ha sido cargado correctamente");
    }
    
    onSubmit(form: any) {
        this._userService.registerUser(this.user).subscribe(
            response => {
                if(response.user && response.user._id) {
                    this.status = 'success';
                    form.reset();
                } else {
                    this.status = 'error';
                }
            }, error => {
            console.log(<any> error);
        });
    }
}
