import { Component, OnInit, DoCheck } from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd,
  Event, NavigationCancel, NavigationError
} from '@angular/router';
import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { PublicationService } from './services/publication.service';
import { MakePublicationComponent } from './components/makePublication/makePublication.component';
import { UploadService } from './services/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, PublicationService, MakePublicationComponent, UploadService]
})

export class AppComponent implements OnInit, DoCheck {
  /* Basic: */
  public title: string;
  public url: string;
  public status!: string;

  /* Identity: */
  public identity: any;

  /* Special: */
  public cursor: any = 0;
  public open = false;
  public loading!: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    protected publicationService: PublicationService,
    protected makePublication: MakePublicationComponent
  ) {
    this.title = 'Página principal';
    this.url = GLOBAL.url;
    this.router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  ngOnInit(): void {
    console.log('app.component ha sido cargado correctamente');
    this.identity = this.userService.getIdentity();
  }

  ngDoCheck(): void {
    this.identity = this.userService.getIdentity();
  }

  logout(): void {
    localStorage.clear();
    this.identity = null;
    this.cursor = 0;
    this.router.navigate(['/']);
  }

  openSettings(id: any): void {
    if (this.cursor === 0) {
      this.cursor = id;
    } else {
      this.cursor = 0;
    }
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  /* makePublication: */

  makeAndClose(make: boolean): void {
    this.open = false;
  }

  /* Loading: */

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }
}
