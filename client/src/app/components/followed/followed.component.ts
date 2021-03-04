import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Follow} from '../../models/follow';
import {FollowService} from '../../services/follow.service';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';

@Component({
  selector: 'followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css'],
  providers: [UserService, FollowService]
})

export class FollowedComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
  public identity: any;
  public token: any;
  public userId!: any;
  public user!: any;
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
    this.title = 'Seguidores';
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
      this.getFollowedUsers(this.userId, this.page);
      this.getUser(this.userId);
    });
  }

  getFollowedUsers(id: any, page: any): void {
    this.followService.getFollowedUsers(this.token, id, page).subscribe(
      response => {
        if (response.follows) {
          this.follows = response.follows;
          console.log(this.follows);
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

  getUser(id: any): void {
    this.userService.getUser(id).subscribe(
      response => {
        if(response.user) {
          this.user = response.user;
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
