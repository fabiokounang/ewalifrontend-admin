import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HomeComponent } from './components/home/home.component';
import { KotaComponent } from './components/kota/kota.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
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
    path: 'forget-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
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
        },
        {
          path: 'change-password',
          component: ChangePasswordComponent
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
