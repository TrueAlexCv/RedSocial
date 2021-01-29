import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Componentes:
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {ProfileComponent} from "./components/profile/profile.component";
import {UsersComponent} from "./components/users/users.component";
import {makePublicationComponent} from "./components/makePublication/makePublication.component";
import {EditProfileComponent} from "./components/edit-profile/edit-profile.component";
import {EditUserComponent} from "./components/edit-user/edit-user.component";

// Servicios:
import {UserGuard} from './services/user.guard';

import {User} from "./models/user";
import {FollowingComponent} from "./components/following/following.component";
import {FollowedComponent} from "./components/followed/followed.component";


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'timeline', component: TimelineComponent, canActivate: [UserGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [UserGuard]},
  {path: 'users/:page', component: UsersComponent, canActivate: [UserGuard]},
  {path: 'makePublication', component: makePublicationComponent, canActivate: [UserGuard]},
  {path: 'edit-profile', component: EditProfileComponent, canActivate: [UserGuard]},
  {path: 'edit-user', component: EditUserComponent, canActivate: [UserGuard]},
  {path: 'following/:id/:page', component: FollowingComponent, canActivate: [UserGuard]},
  {path: 'followed/:id/:page', component: FollowedComponent, canActivate: [UserGuard]}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
