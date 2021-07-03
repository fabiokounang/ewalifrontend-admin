import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loader: boolean = false;
  loginForm: FormGroup;
  eye: string = 'visibility';
  type: string = 'password';
  constructor (private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onLogin () {
    this.loader = true;
    this.sharedService.connection('POST', 'master-login', this.loginForm.value).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.saveToLocalStorage(response.body.data);
          if (response.body.data.role == 1) this.router.navigate(['/admin']);
          if (response.body.data.role == 2) this.router.navigate(['/member']);
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack('Something went wrong', 'Dismiss');
    });
  }

  processError (errors) {
    if (errors.type === 'validation') {
      Object.keys(errors.msg).forEach((key) => {
        this.loginForm.get(key).setErrors({
          [key]: errors.msg[key]
        });
      });
    }

    if (errors.type === 'snack') this.sharedService.callSnack(errors.msg.default, 'Dismiss');    
  }

  onSetVisibility () {
    this.eye = this.eye === 'visibility_off' ? 'visibility' : 'visibility_off';
    this.type = this.eye === 'visibility_off' ? 'text' : 'password';
  }
}
