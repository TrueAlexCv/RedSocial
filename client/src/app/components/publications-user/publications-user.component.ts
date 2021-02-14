import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {LikeService} from '../../services/like.service';

@Component({
  selector: 'publications-user',
  templateUrl: 'publications-user.component.html',
  styleUrls: ['./publications-user.component.css'],
  providers: [UserService, PublicationService, LikeService]
})

export class PublicationsUserComponent implements OnInit {
  /* Basic: */
  public title: string;
  public url: string;
  public status!: string;

  /* Identity: */
  public identity!: any;
  public token!: any;
  public userId!: any;

  /* Publications: */
  public publications!: any;
  public page!: number;
  public pages!: number;
  public total!: number;

  /* Special: */
  public publicationCursor: any = 0;
  public confirm = false;
  public storePublicationId!: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService
  ) {
    this.title = 'Publicaciones del usuario';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit(): void {
    console.log('likes-user.component ha sido cargado correctamente');
    this.loadUser();
  }

  loadUser(): void {
    this.route.params.subscribe(
      params => {
        const id: any = params.id;
        this.userId = params.id;
        this.getPublicationsUser(this.userId, 1);
      });
  }

  getPublicationsUser(id: any, page: number): void {
    this.publicationService.getPublicationsUser(this.token, id, page).subscribe(
      response => {
        if (response.publications) {
          this.pages = response.pages;
          if (page === 1) {
            this.page = 1;
            this.publications = response.publications;
          } else {
            this.page = page;
            const arrayA = this.publications;
            const arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
            setTimeout(() => {
              for (let i = 1; i <= 750; i++) {
                self.scroll(1, i);
              }
            }, 0);
          }
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

  viewMore(): void {
    this.page += 1;
    this.getPublicationsUser(this.userId, this.page);
  }

  refresh(): void {
    this.page = 1;
    this.getPublicationsUser(this.userId, this.page);
  }

  /* Opciones: */

  desplegarOpciones(id: any): void {
    if (this.publicationCursor === 0) {
      this.publicationCursor = id;
    } else {
      this.publicationCursor = 0;
    }
    this.storePublicationId = id;
  }

  deletePublication(id: any): void {
    this.confirm = false;
    this.publicationService.deletePublication(this.token, id).subscribe(
      response => {
        if (response.publication) {
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
}
