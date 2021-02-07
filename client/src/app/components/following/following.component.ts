import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
  public myFollows!: any;
  public followCursor!: any;

  constructor(
    private userService: UserService,
    private followService: FollowService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.title = 'Following';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
  }

  ngOnInit(): void {
    console.log('following.component ha sido cargado correctamente');
    this.actualPage();
    this.getOnlyFollowing();
  }

  actualPage(): void {
    this.route.params.subscribe(params => {
      this.userId = params.id;
      this.page = +params['page'];
      if (!this.page) {
        this.page = 1;
        this.next = 2;
      } else {
        this.prev = this.page - 1;
        this.next = this.page + 1;
        if (this.prev <= 0) {
          this.prev = 1;
        }
      }
      this.getFollowingUsers(this.userId, this.page);
    });
  }

  getFollowingUsers(id: any, page: any): void {
    this.followService.getFollowingUsers(this.token, id, page).subscribe(
      response => {
        if (response.follows) {
          this.follows = response.follows;
          this.total = response.total;
          this.pages = response.pages;
          if (page > this.pages) {
            this.router.navigate(['/profile', id]);
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

  /* Seguimiento de usuarios: */

  getOnlyFollowing(): void {
    this.followService.getOnlyFollowing(this.token).subscribe(
      response => {
        if (response.following) {
          this.myFollows = response.following;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  followUser(id: any): void {
    const follow = new Follow('', this.identity._id, id);
    this.followService.followUser(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.myFollows.push(response.follow.followed);
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  unfollowUser(id: any): void {
    this.followService.unfollowUser(this.token, id).subscribe(
      response => {
        const eliminar = this.myFollows.indexOf(id);
        if (eliminar !== -1) {
          this.myFollows.splice(eliminar, 1);
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  mouseEnter(id: any): void {
    this.followCursor = id;
  }

  mouseLeave(id: any): void {
    this.followCursor = 0;
  }
}
