import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {GLOBAL} from "../../services/global";

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService]
})

export class EditUserComponent implements OnInit {
  public title: string;
  public status!: string;
  public url: string;
  public identity: any;
  public token: any;
  public passwords: any = {
    newpassword: null,
    actualpassword: null
  };

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.title = 'Editar usuario';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit(): void {
    console.log('edit-user.component ha sido cargado correctamente');
  }

  updateUser(form: any): void {
    this.userService.updateUser(this.identity).subscribe(
      response => {
        if (response.user) {
          if (this.passwords.newpassword !== null && this.passwords.actualpassword !== null) {
            this.updatePassword();
          }
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this.router.navigate(['/profile', this.identity._id]);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  updatePassword(): void {
    this.userService.updatePassword(this.passwords).subscribe(
      response => {
        if (response.user) {
          this.status = 'success';
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  /* Cambios: */
  get isDirty(): boolean {
    const inicial: any = {
      newpassword: null,
      actualpassword: null
    };
    return JSON.stringify(inicial) !== JSON.stringify(this.passwords);
  }

}
