import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {GLOBAL} from '../../services/global';
import {LikeService} from '../../services/like.service';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService, LikeService]
})

export class TimelineComponent implements OnInit {
  /* Basic: */
  public title: string;
  public url: string;
  public status!: string;

  /* Identity: */
  public identity: any;
  public token: any;

  /* Timeline: */
  public publications!: any;
  public pages!: number;
  public page: number;

  /* Likes: */
  public likes!: any;

  /* Special: */
  public publicationCursor: any = 0;
  public confirmar = false;
  public store!: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService
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
    this.getOnlyLikes();
  }

  getTimeline(page: number, more = false): void {
    this.publicationService.getTimeline(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.pages = response.pages;
          if (!more) {
            this.publications = response.publications;
            this.publications.forEach((publication: any) => {
              this.countLikes(publication._id).then((value) => {
                publication.stats = value;
              }).catch((err) => {
                console.log(err);
              });
            });
          } else {
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
    this.getTimeline(this.page, true);
  }

  refresh(): void {
    this.page = 1;
    this.getTimeline(this.page, false);
  }

  deletePublication(id: any): void {
    this.confirmar = false;
    this.publicationService.deletePublication(this.token, id).subscribe(
      response => {
        this.refresh();
      },
      error => {
        console.log(error as any);
      });
  }

  desplegarPanel(id: any): void {
    if (this.publicationCursor === 0) {
      this.publicationCursor = id;
    } else {
      this.publicationCursor = 0;
    }
    this.store = id;
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
