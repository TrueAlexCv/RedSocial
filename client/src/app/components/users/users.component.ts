import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { Follow } from '../../models/follow';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})

export class UsersComponent implements OnInit {
  /* Basic: */
  public title: string;
  public url: string;
  public status!: string;

  /* Identity: */
  public identity: any;
  public token: any;

  /* Users: */
  public users!: any;
  public page: number;
  public pages!: number;
  public next!: number;
  public prev!: number;

  /* Seguimiento: */
  public follows!: any;

  /* Special: */
  public followCursor!: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService,
  ) {
    this.title = 'Usuarios';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
  }

  ngOnInit(): void {
    console.log('users.component ha sido cargado correctamente');
    this.actualPage();
    this.getOnlyFollowing();
  }

  actualPage(): void {
    this.route.params.subscribe(params => {
      let page = +params.page;
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

  getUsers(page: any): void {
    this.userService.getUsers(page).subscribe(
      response => {
        if (response.users) {
          this.users = response.users;
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

  /* Seguimiento de usuarios: */

  getOnlyFollowing(): void {
    this.followService.getOnlyFollowing(this.token).subscribe(
      response => {
        if (response.following) {
          this.follows = response.following;
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
          this.follows.push(response.follow.followed);
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

  mouseEnter(id: any): void {
    this.followCursor = id;
  }

  mouseLeave(): void {
    this.followCursor = 0;
  }
}
