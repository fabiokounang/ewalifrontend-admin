import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loader: boolean = false;
  token: string = '';
  eyePassword: string = 'visibility';
  eyeConfirmationPassword: string = 'visibility';
  typePassword: string = 'password';
  typeConfirmationPassword: string = 'password';
  constructor (private sharedService: SharedService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (!this.route.snapshot.params || !this.route.snapshot.params['token']) this.router.navigate(['/404']);
    this.token = this.route.snapshot.params['token'];
    this.makeForm();
  }

  makeForm () {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmation_password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSetVisibility (key, type) {
    this[key] = this[key] === 'visibility_off' ? 'visibility' : 'visibility_off';
    this[type] = this[key] === 'visibility_off' ? 'text' : 'password';
  }

  onResetPassword () {
    this.loader = true;
    this.sharedService.connection('POST', 'master-reset-password', this.resetPasswordForm.value, '', this.token).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.saveToLocalStorage(response.body.data);
          this.sharedService.callSnack('Berhasil reset password, silahkan coba login kembali', 'Tutup');
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
        this.resetPasswordForm.get(key).setErrors({
          [key]: errors.msg[key]
        });
      });
    }

    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Tutup');    
  }

}
