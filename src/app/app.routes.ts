import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { loginGuard } from './core/login.guard';
import { AuthGuard } from './core/auth.guard';
import { TestComponent } from './components/test/test.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'test', component: TestComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'user',
    loadComponent: () => import('./components/user/user.component').then((m) => m.UserComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'social',
    loadComponent: () => import('./components/social/social.component').then((m) => m.SocialComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'myGroup/:id',
        loadComponent: () => import('./components/social-comp/my-group/my-group.component').then((m) => m.MyGroupComponent),
      },
      {
        path: 'allGroups',
        loadComponent: () => import('./components/social-comp/all-groups/all-groups.component').then((m) => m.AllGroupsComponent),
      },
      {
        path: '',
        redirectTo: 'allGroups',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];
