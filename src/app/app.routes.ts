import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { loginGuard } from './core/login.guard';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'login',
      component: LoginComponent ,
      canActivate:[loginGuard]
    },
    {
        path: 'user',
        loadComponent: () => import('./components/user/user.component').then((m) => m.UserComponent),
        canActivate: [AuthGuard],
    },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
];
