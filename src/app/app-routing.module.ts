import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { KotaComponent } from './components/kota/kota.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserActiveComponent } from './components/user-active/user-active.component';
import { UserPendingComponent } from './components/user-pending/user-pending.component';
import { GuardService } from './shared/service/guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [GuardService],
    children: [
        {
          path: 'user-pending',
          component: UserPendingComponent
        },
        {
          path: 'user-active',
          component: UserActiveComponent
        },
        {
          path: 'kota',
          component: KotaComponent
        }
      ]
  },
  {
    path: '**',
    redirectTo: '/404',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
