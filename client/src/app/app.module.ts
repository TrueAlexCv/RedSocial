import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Rutas:
import { appRoutingProviders, routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';

// Formularios:
import { FormsModule }   from '@angular/forms';

// Componentes:
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent} from "./components/profile/profile.component";
import { UsersComponent } from "./components/users/users.component";
import { makePublicationComponent } from "./components/makePublication/makePublication.component";
import { EditProfileComponent } from "./components/edit-profile/edit-profile.component";
import { EditUserComponent } from "./components/edit-user/edit-user.component";

// Servicios:
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';

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
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
