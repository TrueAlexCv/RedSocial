import{Component,OnInit} from "@angular/core";
import { Router, ActivatedRoute, Params} from "@angular/router";
import{UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {GLOBAL} from "../../services/global";

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})

export class UsersComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
  public users!: any;
  public total!: number;
  public page: number;
  public pages!: number;
  public next!: number;
  public prev!: number;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = 'Usuarios';
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit() {
    console.log('users.component ha sido cargado correctamente');
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

      if(!page) {
        page = 1;
        this.next = 2;
      } else {
        this.next = page + 1;
        this.prev = page - 1;

        if(this.prev <= 0) {
          this.prev = 1;
        }
      }
      this.getUsers(page);
    });
  }

  getUsers(page: any) {
    this._userService.getUsers(page).subscribe(
      response => {
        if(response.users) {
            this.users = response.users;
            this.total = response.total;
            this.pages = response.pages;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }
}
