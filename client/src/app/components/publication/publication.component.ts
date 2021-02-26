import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from 'src/app/services/like.service';
import { FollowService } from 'src/app/services/follow.service';
import { Follow } from '../../models/follow';

@Component({
  selector: 'publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
  providers: [UserService, FollowService, PublicationService, LikeService]
})

export class PublicationComponent implements OnInit {
  /* Basics: */
  public title: string;
  public url: string;
  public status!: string;

  /* Identity: */
  public identity!: any;
  public token!: any;

  /* Publication: */
  public publicationId!: any;
  public publication!: any;

  /* Likes: */
  public likes!: any;
  public users!: any;
  public page!: number;
  public pages!: number;
  public total!: number;

  /* Seguimiento: */
  public follows!: any;

  /* Special: */
  public publicationCursor: any = 0;
  public confirmar = false;
  public store!: any;
  public openUsers = false;
  public followCursor: any = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService,
    private publicationService: PublicationService,
    private likeService: LikeService
  ) {
    this.title = 'Publication';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit(): void {
    console.log('publication.component ha sido cargado correctamente');
    this.getPublication();
    this.getOnlyLikes();
    this.getOnlyFollowing();
  }

  getPublication(): void {
    this.route.params.subscribe(params => {
      this.publicationId = params.id;
    });
    this.publicationService.getPublication(this.token, this.publicationId).subscribe(
      response => {
        if (response.publication) {
          this.publication = response.publication;
          this.countLikes(this.publication._id).then((value) => {
            this.publication.stats = value;
          }).catch((err) => {
            console.log(err);
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

  desplegarPanel(id: any): void {
    if (this.publicationCursor === 0) {
      this.publicationCursor = id;
    } else {
      this.publicationCursor = 0;
    }
    this.store = id;
  }

  deletePublication(id: any): void {
    this.confirmar = false;
    this.publicationService.deletePublication(this.token, id).subscribe(
      response => {
        this.router.navigate(['/timeline']);
      },
      error => {
        console.log(error as any);
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
          this.publication.stats += 1;
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
          this.publication.stats -= 1;
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

  getLikesPublication(page: number): void {
    this.likeService.getLikesPublication(this.token, this.publicationId, page).subscribe(
      response => {
        if (response.likes) {
          this.pages = response.pages;
          if (page === 1) {
            this.page = 1;
            this.users = response.likes;
          } else {
            this.users = response.likes;
          }
        }
        this.status = 'success';
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  nextPage(): void {
    this.page += 1;
    this.getLikesPublication(this.page);
  }

  prevPage(): void {
    this.page -= 1;
    this.getLikesPublication(this.page);
  }

  /* Seguimiento. */

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
