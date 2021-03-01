import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';

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
    private router: Router,
    private userService: UserService
  ) {
    this.title = 'Iniciar Sesión';
    this.url = GLOBAL.url;
    this.status = '';
    this.user = new User('', '', '', '', '', '', '', '', 'ROLE_USER');
    this.identity = this.userService.getIdentity();
  }

  ngOnInit(): void {
    console.log('login.component ha sido cargado correctamente');
    if(this.identity != null) {
      this.router.navigate(['timeline']);
    }
  }

  onSubmit(form: any): void {
    this.userService.loginUser(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this.getToken();
        }
      },
      error => {
        console.log(error as any);
        if (error != null) {
          this.status = 'error';
        }
      });
  }

  getToken(): void {
    this.userService.loginUser(this.user, true).subscribe(
      response => {
        this.token = JSON.stringify(response.token);
        if (this.token.length < 0) {
          this, status = 'error';
        } else {
          localStorage.setItem('token', this.token);
          this.getCounters();
        }
      },
      error => {
        console.log(error as any);
        if (error != null) {
          this.status = 'error';
        }
      });
  }

  getCounters(): void {
    this.userService.getCounters(this.user).subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        this.router.navigate(['/timeline']);
      },
      error => {
        console.log(error as any);
      });
  }
}
