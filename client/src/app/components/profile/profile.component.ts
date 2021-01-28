import {Component, OnInit} from '@angular/core';
import {Route, ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {GLOBAL} from "../../services/global";
import {PublicationService} from "../../services/publication.service";
import {Publication} from "../../models/publication";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, PublicationService]
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
  public page: number;
  public pages!: number;
  public total!: number;
  public itemsPerPage!: number;
  public status!: string;

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.title = 'Perfil';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = 1;
  }

  ngOnInit() {
    console.log('profile.component ha sido cargado correctamente');
    this.loadUser();
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
          this.total = response.total;
          this.itemsPerPage = response.itemsPerPage;
          if (!adding) {
            this.publications = response.publications;
          } else {
            const arrayA = this.publications;
            const arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
          }
          if (page > this.pages) {
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
}
