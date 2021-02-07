import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {GLOBAL} from '../../services/global';

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
  public publicationCursor: any = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService
  ) {
    this.title = 'Timeline';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
  }

  ngOnInit(): void {
    console.log('timeline.component ha sido cargado correctamente');
    this.getTimeline(this.page, false);
  }

  getTimeline(page: number, more = false): void {
    this.publicationService.getTimeline(this.token, page).subscribe(
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
          setTimeout(() => {
            for (let i = 1; i <= 750; i++) {
              self.scroll(1, i);
            }
          }, 0);
          if (page > this.pages) {
            this.router.navigate(['/timeline']);
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

  viewMore(): void {
    this.page += 1;
    this.getTimeline(this.page, true);
  }

  refresh(): void {
    this.page = 1;
    this.getTimeline(this.page, false);
  }

  deletePublication(id: any): void {
    if (confirm('¿Estás seguro de que quieres borrar el tweet?')) {
      this.publicationService.deletePublication(this.token, id).subscribe(
        response => {
          this.refresh();
        },
        error => {
          console.log(error as any);
        });
    }
  }

  desplegarPanel(id: any): void {
    if (this.publicationCursor === 0) {
      this.publicationCursor = id;
    } else {
      this.publicationCursor = 0;
    }
  }
}
