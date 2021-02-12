import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {PublicationService} from '../../services/publication.service';
import {Follow} from '../../models/follow';
import {FollowService} from '../../services/follow.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService, PublicationService]
})

export class ProfileComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
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
  public publicationCursor!: any;
  public follows!: any;
  public followCursor!: any;
  public confirmar = false;
  public store!: any;

  constructor(
    private userService: UserService,
    private followService: FollowService,
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title = 'Perfil';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.publicationCursor = 0;
  }

  ngOnInit(): void {
    console.log('profile.component ha sido cargado correctamente');
    this.loadUser();
    this.getOnlyFollowing();
  }

  loadUser(): void {
    this.route.params.subscribe(params => {
      const id: any = params.id;
      this.getUser(id);
      this.getCounters(id);
      this.getPublicationsUser(id, 1, false);
    });
  }

  getUser(id: any): void {
    this.userService.getUser(id).subscribe(
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

  getCounters(id: any): void {
    this.userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(error as any);
      });
  }

  getPublicationsUser(id: any, page: number, adding = false): void {
    this.publicationService.getPublicationsUser(this.token, id, page).subscribe(
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
          if (page !== 1) {
            setTimeout(() => {
              for (let i = 1; i <= 750; i++) {
                self.scroll(1, i);
              }
            }, 0);
          }
          if (page > 1 && page > this.pages) {
            this.router.navigate(['/profile', this.user._id]);
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

  viewMore(): void {
    this.page += 1;
    this.getPublicationsUser(this.user._id, this.page, true);
  }

  refresh(): void {
    this.page = 1;
    this.getPublicationsUser(this.user._id, this.page, false);
  }

  desplegarPanel(id: any): void {
    if (this.publicationCursor === 0) {
      this.publicationCursor = id;
    } else {
      this.publicationCursor = 0;
    }
    this.store = id;
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
