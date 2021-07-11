import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './shared/service/auth-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserPendingComponent } from './components/user-pending/user-pending.component';
import { UserActiveComponent } from './components/user-active/user-active.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { KotaComponent } from './components/kota/kota.component';
import { FormAddKotaComponent } from './components/forms/form-add-kota/form-add-kota.component';
import { FormEditKotaComponent } from './components/forms/form-edit-kota/form-edit-kota.component';
import { FormConfirmationComponent } from './components/forms/form-confirmation/form-confirmation.component';
import { DetailUserComponent } from './components/detail-user/detail-user.component';
import { UpgradeDowngradeUserComponent } from './components/upgrade-downgrade-user/upgrade-downgrade-user.component';
import { FormEditUserComponent } from './components/forms/form-edit-user/form-edit-user.component';
import { FormUpdateStatusUserComponent } from './components/forms/form-update-status-user/form-update-status-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserPendingComponent,
    UserActiveComponent,
    HomeComponent,
    PageNotFoundComponent,
    KotaComponent,
    FormAddKotaComponent,
    FormEditKotaComponent,
    FormConfirmationComponent,
    DetailUserComponent,
    UpgradeDowngradeUserComponent,
    FormEditUserComponent,
    FormUpdateStatusUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
