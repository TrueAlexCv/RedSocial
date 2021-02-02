import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';

// Rutas:
import {appRoutingProviders, routing} from './app.routing';
import {HttpClientModule} from '@angular/common/http';

// Formularios:
import {FormsModule} from '@angular/forms';

// Componentes:
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {ProfileComponent} from './components/profile/profile.component';
import {UsersComponent} from './components/users/users.component';
import {makePublicationComponent} from './components/makePublication/makePublication.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {FollowingComponent} from './components/following/following.component';
import {FollowedComponent} from './components/followed/followed.component';
import {MessagesComponent} from './components/messages/messages.component';
import {SearchComponent} from "./components/search/search.component";

// Servicios:
import {UserService} from './services/user.service';
import {UserGuard} from './services/user.guard';

// Pipes:
import {SearchPipe} from './pipes/search/search.pipe';

// SocketIO:
import {SocketIoModule} from 'ngx-socket-io';
import {CookieService} from 'ngx-cookie-service';
import {WebSocketService} from './services/web-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    TimelineComponent,
    ProfileComponent,
    UsersComponent,
    makePublicationComponent,
    EditProfileComponent,
    EditUserComponent,
    FollowingComponent,
    FollowedComponent,
    MessagesComponent,
    SearchPipe,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    HttpClientModule,
    FormsModule,
    SocketIoModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UserGuard,
    WebSocketService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
