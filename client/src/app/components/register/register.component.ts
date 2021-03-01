import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})

export class RegisterComponent implements OnInit {
  public title: string;
  public status!: string;
  public user: User;
  public aceptado: boolean;
  public identity!:any;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.title = 'Registrarse:';
    this.user = new User('', '', '', '', '', '', '', '', 'ROLE_USER');
    this.aceptado = false;
    this.identity = this.userService.getIdentity();
  }

  ngOnInit(): void {
    console.log('register.component ha sido cargado correctamente');
    if(this.identity != null) {
      this.router.navigate(['timeline']);
    }
  }

  onSubmit(form: any): void {
    this.userService.registerUser(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          this.status = 'success';
          form.reset();
          this.router.navigate(['/']);
        } else {
          this.status = 'error';
        }
      }, error => {
        console.log(error as any);
      });
  }
}
