import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {GLOBAL} from "../../services/global";
import {Follow} from "../../models/follow";
import {FollowService} from "../../services/follow.service";

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})

export class UsersComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
  public identity: any;
  public token: any;
  public users!: any;
  public total!: number;
  public page: number;
  public pages!: number;
  public next!: number;
  public prev!: number;
  public follows!: any;
  public followCursor!: any;

  constructor(
    private _userService: UserService,
    private _followService: FollowService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = 'Usuarios';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
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

      if (!page) {
        page = 1;
        this.next = 2;
      } else {
        this.next = page + 1;
        this.prev = page - 1;

        if (this.prev <= 0) {
          this.prev = 1;
        }
      }
      this.getUsers(page);
    });
  }

  getUsers(page: any) {
    this._userService.getUsers(page).subscribe(
      response => {
        if (response.users) {
          this.users = response.users;
          this.total = response.total;
          this.pages = response.pages;
          this.follows = response.users_following;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  followUser(id: any) {
    const follow = new Follow('',this.identity._id,id);
    this._followService.followUser(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.follows.push(response.follow);
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  unfollowUser(id: any) {
    this._followService.unfollowUser(this.token, id).subscribe(
      response => {
        const eliminar = this.follows.indexOf(id);
        if (eliminar !== -1) {
          this.follows.splice(eliminar, 1);
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  mouseEnter(id: any) {
    this.followCursor = id;
  }

  mouseLeave(id: any) {
    this.followCursor = 0;
  }

}
