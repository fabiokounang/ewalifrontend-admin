import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  constructor (private sharedService: SharedService, private router: Router) {}
  
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const type = "application/json; charset=utf-8";
    const headers = new HttpHeaders({
      'Accept': 'text/html, application/json, text/plain, multipart/form-data, */*'
    });
    
    const copy = req.clone({
      withCredentials: true,
      headers: headers
    });
    
    return next.handle(copy).do((resp: any) => {
      if (resp.status == 200) {
        if (resp.body.status) {
          
        } else {
          // if (resp.body.error) {
          //   localStorage.removeItem('token');
          //   this.router.navigate(['/']);
          // }          
        }
      }
    });
  }
}