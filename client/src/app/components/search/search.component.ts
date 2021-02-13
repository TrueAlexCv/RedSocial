import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';
import {Follow} from '../../models/follow';
import {FollowService} from '../../services/follow.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [UserService, FollowService]
})

export class SearchComponent implements OnInit {
  public title: string;
  public status!: string;
  public url: string;
  public identity: any;
  public token: any;
  public users!: any;
  public span!: any;
  public total!: number;
  public page!: number;
  public pages!: number;
  public mostrar = false;
  public prev!: number;
  public next!: number;
  public myFollows!: any;
  public followCursor!: any;

  constructor(
    private userService: UserService,
    private followService: FollowService,
  ) {
    this.title = 'Busqueda';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
  }

  ngOnInit(): void {
    console.log('search.component ha sido cargado correctamente');
    this.getOnlyFollowing();
  }

  searchUser(page: any): void {
    this.page = page;
    const params = {
      word: this.span
    };
    this.userService.searchUsers(page, params).subscribe(
      response => {
        if (response.users) {
          this.users = response.users;
          this.total = response.total;
          this.pages = response.pages;
          this.status = 'success';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
    this.mostrar = true;
  }

  nextPage(): void {
    this.page += 1;
    this.searchUser(this.page);
  }

  prevPage(): void {
    this.page -= 1;
    this.searchUser(this.page);
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
