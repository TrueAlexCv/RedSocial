import {
  Component, OnInit, DoCheck,
  ViewChild, ViewContainerRef, ComponentFactoryResolver
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Params,
  NavigationStart,
  NavigationEnd,
  Event,
  NavigationCancel, NavigationError,
} from '@angular/router';
import {UserService} from './services/user.service';
import {User} from './models/user';
import {GLOBAL} from './services/global';
import {makePublicationComponent} from './components/makePublication/makePublication.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public identity: any;
  public url: string;
  public cursor: any = 0;
  public do: boolean = false;
  public loading!: boolean;

  tabs = [{
    title: 'makePublication',
    component: makePublicationComponent
  }]

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.title = 'Página principal';
    this.url = GLOBAL.url;
    this._router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  ngOnInit() {
    console.log('app.component ha sido cargado correctamente');
    this.identity = this._userService.getIdentity();
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this.cursor = 0;
    this._router.navigate(['/']);
  }

  abrirAjustes(id: any) {
    if (this.cursor === 0) {
      this.cursor = id;
    } else {
      this.cursor = 0;
    }
  }

  public open: boolean = false;
  @ViewChild('ref', {read: ViewContainerRef}) ref: any;

  chargeComponent() {
    if (!this.open) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        this.tabs[0].component
      );
      this.ref = this.viewContainerRef.createComponent(factory);
      this.ref.changeDetectorRef.detectChanges();
      this.open = true;
    }
  }

  makeAndClose() {
    this.ref.instance.makePublication(this.ref.instance.make);
    this.do = true;
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.open = false;
    this.ref.destroy();
    this.ref.changeDetectorRef.detectChanges();
    if (this.do) {
      this.do = false;
      this._router.navigate(['/timeline']);
    }
  }

  checkRouterEvent(routerEvent: Event) {
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
