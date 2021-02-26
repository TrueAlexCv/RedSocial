import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Componentes:
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {ProfileComponent} from './components/profile/profile.component';
import {UsersComponent} from './components/users/users.component';
import {MakePublicationComponent} from './components/makePublication/makePublication.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {FollowingComponent} from './components/following/following.component';
import {FollowedComponent} from './components/followed/followed.component';
import {MessagesComponent} from './components/messages/messages.component';
import {SearchComponent} from './components/search/search.component';
import {PublicationsUserComponent} from './components/publications-user/publications-user.component';
import {LikesUserComponent} from './components/likes-user/likes-user.component';
import {PublicationComponent} from './components/publication/publication.component';

// Servicios:
import {UserGuard} from './services/user.guard';
import {EditUserGuard} from './services/edit-user.guard';
import {EditProfileGuard} from './services/edit-profile.guard';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'timeline', component: TimelineComponent, canActivate: [UserGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [UserGuard]},
  {path: 'users/:page', component: UsersComponent, canActivate: [UserGuard]},
  {path: 'makePublication', component: MakePublicationComponent, canActivate: [UserGuard]},
  {path: 'edit-profile', component: EditProfileComponent, canActivate: [UserGuard], canDeactivate: [EditProfileGuard]},
  {path: 'edit-user', component: EditUserComponent, canActivate: [UserGuard], canDeactivate: [EditUserGuard]},
  {path: 'following/:id/:page', component: FollowingComponent, canActivate: [UserGuard]},
  {path: 'followed/:id/:page', component: FollowedComponent, canActivate: [UserGuard]},
  {path: 'messages', component: MessagesComponent},
  {path: 'search', component: SearchComponent},
  {path: 'search/:page?', component: SearchComponent},
  {path: 'publications/:id/:page', component: PublicationsUserComponent},
  {path: 'likes/:id/:page', component: LikesUserComponent},
  {path: 'publication/:id', component: PublicationComponent},
  {path: '**', component: TimelineComponent, canActivate: [UserGuard]},
  {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
