import {
  Component, OnInit, DoCheck,
  ViewChild, ViewContainerRef, ComponentFactoryResolver
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
  Event,
  NavigationCancel, NavigationError,
} from '@angular/router';
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';
import {MakePublicationComponent} from './components/makePublication/makePublication.component';

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
  public do = false;
  public open = false;
  public loading!: boolean;

  tabs = [{
    title: 'makePublication',
    component: MakePublicationComponent
  }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
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

  abrirAjustes(id: any): void {
    if (this.cursor === 0) {
      this.cursor = id;
    } else {
      this.cursor = 0;
    }
  }

  @ViewChild('ref', {read: ViewContainerRef}) ref: any;

  chargeComponent(): void {
    if (!this.open) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        this.tabs[0].component
      );
      this.ref = this.viewContainerRef.createComponent(factory);
      this.ref.changeDetectorRef.detectChanges();
      this.open = true;
    }
  }

  makeAndClose(): void {
    this.ref.instance.makePublication(this.ref.instance.make);
    this.do = true;
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.open = false;
    this.ref.destroy();
    this.ref.changeDetectorRef.detectChanges();
    if (this.do) {
      this.do = false;
      this.router.navigate(['/timeline']);
    }
  }

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
