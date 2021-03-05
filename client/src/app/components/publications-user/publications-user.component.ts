import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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

  /* Likes: */
  public likes!: any;

  /* Special: */
  public publicationCursor: any = 0;
  public confirm = false;
  public storePublicationId!: any;

  constructor(
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
    console.log('publications-user.component ha sido cargado correctamente');
    this.loadUser();
    this.getOnlyLikes();
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
            this.publications.forEach((publication: any) => {
              this.countLikes(publication._id).then((value) => {
                publication.stats = value;
              }).catch((err) => {
                console.log(err);
              });
            });
          } else {
            this.page = page;
            const arrayA = this.publications;
            const arrayB = response.publications;
            arrayB.forEach((publication: any) => {
              this.countLikes(publication._id).then((value) => {
                publication.stats = value;
              }).catch((err) => {
                console.log(err);
              });
            });
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

  async countLikes(publication: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.likeService.getCountLikesPublication(this.token, publication).subscribe(
        response => {
          if (response.numLikesPublication) {
            resolve(response.numLikesPublication);
          } else {
            resolve(0);
            this.status = 'error';
          }
        },
        error => {
          reject(error);
          this.status = 'error';
        });
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

  /* Likes: */

  getOnlyLikes(): void {
    this.likeService.getOnlyLikes(this.token).subscribe(
      response => {
        if (response.likes) {
          this.likes = response.likes;
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

  addLike(publication: any): void {
    const params = {
      publication: publication._id
    };
    this.likeService.addLike(this.token, params).subscribe(
      response => {
        if (response.like) {
          this.likes.push(publication._id);
          this.publications.forEach((publication2: any) => {
            if (publication2._id === publication._id) {
              publication2.stats += 1;
            }
          });
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

  deleteLike(publication: any): void {
    this.likeService.deleteLike(this.token, publication._id).subscribe(
      response => {
        if (response.like) {
          const eliminar = this.likes.indexOf(publication._id);
          this.likes.splice(eliminar, 1);
          this.publications.forEach((publication2: any) => {
            if (publication2._id === publication._id) {
              publication2.stats -= 1;
            }
          });
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
