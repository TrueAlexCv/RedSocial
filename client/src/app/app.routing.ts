import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes:
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

// Servicios:
import { UserGuard } from './services/user.guard';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);