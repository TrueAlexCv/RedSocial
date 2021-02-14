import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {FollowService} from '../../services/follow.service';
import {LikeService} from '../../services/like.service';
import {Follow} from '../../models/follow';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService, PublicationService, LikeService]
})

export class ProfileComponent implements OnInit {
  /* Basic: */
  public title: string;
  public url: string;
  public status!: string;

  /* Identity: */
  public identity: any;
  public token: any;

  /* User: */
  public user!: any;
  public followed!: boolean;
  public stats!: any;

  /* Seguimiento: */
  public follows!: any;
  public followCursor!: any;

  /* Special: */
  public showLikes = false;

  constructor(
    private userService: UserService,
    private followService: FollowService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title = 'Perfil';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
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
    });
  }

  getUser(id: any): void {
    this.userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
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
