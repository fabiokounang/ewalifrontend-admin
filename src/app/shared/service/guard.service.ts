import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root' // injectable untuk memakai service di dalam service
})

export class GuardService implements CanActivate, CanLoad, CanActivateChild { // service untuk guard routing
  constructor(private sharedService: SharedService, private router: Router) { } // inject api service dan router

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean { // method canActivate untuk check login di component parent
    return this.checkToken(route);
  }

  canActivateChild (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  canLoad (route: Route): Observable<boolean> | Promise<boolean> | boolean { // method canLoad
    return this.checkToken(route);
  }

  checkToken (route): Observable<boolean> | Promise<boolean> | boolean {
    let status = false;
    return this.sharedService.connection('GET', 'master-get-login').toPromise().then((response: any) => {
      if (response.status == 200) {
        if (response.body.status) {
          status = true;
          this.sharedService.saveToLocalStorage(response.body.data);
        }
      }
      if (!status) {
        this.router.navigate(['/']);
        this.sharedService.removeLocalStorage();   
      }
      return status;
    });
  }

}