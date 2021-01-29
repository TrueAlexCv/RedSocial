import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, Route} from '@angular/router';
import {Follow} from '../../models/follow';
import {FollowService} from '../../services/follow.service';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';

@Component({
  selector: 'following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
  providers: [UserService, FollowService]
})

export class FollowingComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
  public identity: any;
  public token: any;
  public userId!: any;
  public total!: number;
  public page: number;
  public pages!: number;
  public prev!: number;
  public next!: number;
  public follows!: any;

  constructor(
    private _userService: UserService,
    private _followService: FollowService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = 'Following';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = 1;
  }

  ngOnInit() {
    console.log('following.component ha sido cargado correctamente');
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe( params => {
        this.userId = params['id'];
        this.page = params['page'];
        if(!this.page) {
          this.page = 1;
          this.next = 2;
        } else {
          this.prev = this.page - 1;
          this.next = this.page + 1;

          if(this.prev <= 0) {
            this.prev = 1;
          }
        }
        this.getFollowingUsers(this.userId,this.page);
    });
  }

  getFollowingUsers(id: any, page: any) {
    this._followService.getFollowingUsers(this.token, id, page).subscribe(
      response => {
        if (response.follows) {
          this.follows = response.follows;
          this.total = response.total;
          this.pages = response.pages;
          if(page > this.pages) {
            this._router.navigate(['/profile',id]);
          }
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
