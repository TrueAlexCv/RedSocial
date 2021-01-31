import {Component, OnInit} from '@angular/core';
import {Route, ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {GLOBAL} from "../../services/global";
import {PublicationService} from "../../services/publication.service";
import {Publication} from "../../models/publication";
import {Follow} from "../../models/follow";
import {FollowService} from "../../services/follow.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService, PublicationService]
})

export class ProfileComponent implements OnInit {
  public title: string;
  public url: string;
  public identity: any;
  public token: any;
  public user!: User;
  public following!: boolean;
  public followed!: boolean;
  public stats!: any;
  public publications!: any;
  public page!: number;
  public pages!: number;
  public total!: number;
  public itemsPerPage!: number;
  public status!: string;
  public follows!: any;
  public followCursor!: any;
  public desplegar: boolean = false;

  constructor(
    private _userService: UserService,
    private _followService: FollowService,
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.title = 'Perfil';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log('profile.component ha sido cargado correctamente');
    this.loadUser();
    this.getOnlyFollowing();
  }

  loadUser() {
    this._route.params.subscribe(params => {
      let id: any = params['id'];
      this.getUser(id);
      this.getCounters(id);
      this.getPublicationsUser(id,1,false);
    });
  }

  getUser(id: any) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;

          if (response.following && response.following._id) {
            this.following = true;
          } else {
            this.following = false;
          }

          if (response.followed && response.followed._id) {
            this.followed = true;
          } else {
            this.followed = false;
          }
        }
      },
      error => {
        console.log(error as any);
      });
  }

  getCounters(id: any) {
    this._userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(error as any);
      });
  }

  getPublicationsUser(id: any, page: number, adding = false) {
    this._publicationService.getPublicationsUser(this.token, id, page).subscribe(
      response => {
        if (response.publications) {
          this.pages = response.pages;
          this.total = response.total_items;
          this.itemsPerPage = response.items_per_page;
          if (!adding) {
            this.page = 1;
            this.publications = response.publications;
          } else {
            const arrayA = this.publications;
            const arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
          }
          if (page > 1 && page > this.pages) {
            this._router.navigate(['/profile', this.user._id]);
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

  deletePublication(id: any) {
    this._publicationService.deletePublication(this.token, id).subscribe(
      response => {
        this.refresh();
      },
      error => {
        console.log(error as any);
      });
  }

  viewMore() {
    this.page += 1;
    this.getPublicationsUser(this.user._id, this.page, true);
  }

  refresh() {
    this.page = 1;
    this.getPublicationsUser(this.user._id, this.page, false);
  }

  getOnlyFollowing() {
    this._followService.getOnlyFollowing(this.token).subscribe(
      response => {
        if(response.following) {
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

  followUser(id: any) {
    const follow = new Follow('',this.identity._id,id);
    this._followService.followUser(this.token, follow).subscribe(
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

  public followCursor2: any = 0;
  desplegarPanel(id: any) {
    if(this.followCursor2 === 0) {
      this.followCursor2 = id;
    } else {
      this.followCursor2 = 0;
    }
  }
}
