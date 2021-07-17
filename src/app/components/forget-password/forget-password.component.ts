import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  loader: boolean = false;
  
  constructor (private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm () {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  onForgetPassword () {
    this.loader = true;
    this.sharedService.connection('POST', 'master-forget-password', this.forgetPasswordForm.value).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.saveToLocalStorage(response.body.data);
          this.sharedService.callSnack('Silahkan cek email anda untuk reset password', 'Tutup');
          this.router.navigate(['/login']);       
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  processError (errors) {
    if (errors.type === 'validation') {
      Object.keys(errors.msg).forEach((key) => {
        this.forgetPasswordForm.get(key).setErrors({
          [key]: errors.msg[key]
        });
      });
    }

    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Tutup');    
  }
}
