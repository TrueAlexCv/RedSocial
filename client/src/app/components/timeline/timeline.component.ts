import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {Publication} from '../../models/publication';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})

export class TimelineComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
  public identity: any;
  public token: any;
  public publications!: any;
  public page: number;
  public pages!: number;
  public total!: number;
  public itemsPerPage!: number;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Timeline';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = 1;
  }

  ngOnInit() {
    console.log('timeline.component ha sido cargado correctamente');

    this.getTimeline(this.page, false);
  }

  getTimeline(page: number, more = false) {
    this._publicationService.getTimeline(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.itemsPerPage;
          if (!more) {
            this.publications = response.publications;
          } else {
            const arrayA = this.publications;
            const arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
          }
          if (page > this.pages) {
            this._router.navigate(['/timeline']);
          }
        } else {
          this.status = 'error';
        }
      }, error => {
        console.log(error as any);
        if (error != null) {
          this.status = 'error';
        }
      });
  }

  viewMore() {
    this.page += 1;
    this.getTimeline(this.page, true);
  }

  refresh() {
    this.page = 1;
    this.getTimeline(this.page, false);
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

  public followCursor2: any = 0;
  desplegarPanel(id: any) {
    if(this.followCursor2 === 0) {
      this.followCursor2 = id;
    } else {
      this.followCursor2 = 0;
    }
  }

}
