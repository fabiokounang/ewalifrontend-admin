import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loader: boolean = false;
  typeOldPassword: string = 'password';
  typeNewPassword: string = 'password'
  typeConfirmPassword: string = 'password';

  eyeOldPassword: string = 'visibility';
  eyeNewPassword: string = 'visibility';
  eyeConfirmPassword: string = 'visibility';
  userId: string = '';
  userData: any = {};
  objectKeys = Object.keys;

  constructor (private sharedService: SharedService) {}

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm () {
    this.passwordForm = new FormGroup({
      old_password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      new_password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmation_password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onUpdateMyPassword () {
    this.loader = true;
    if (this.passwordForm.valid) {
      this.passwordForm.disable();
      this.sharedService.connection('PUT', 'master-change-password', this.passwordForm.value).subscribe((response: any) => {
        if (response.status == 200) {
          this.helperOnAddForm();
          if (response.body.status) {
            this.sharedService.callSnack('Sukses mengubah password', 'Tutup');
            this.passwordForm.reset();
          } else {
            let errors = response.body.error;
            this.processError(errors);
          }
        }
      }, (error) => {
        this.helperOnAddForm();
        this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
      })
    } else {
      this.helperOnAddForm();
      this.sharedService.callSnack('Input tidak valid', 'Tutup');
    }
  }

  helperOnAddForm () {
    this.passwordForm.enable();
    this.loader = false;
  }

  onTriggerEye (type, eye) {
    this[type] = this[type] === 'password' ? 'text' : 'password';
    this[eye] = this[type] == 'password' ? 'visibility' : 'visibility_off';
  }

  processError (errors) {
    if (errors.type === 'validation') {
      Object.keys(errors.msg).forEach((key) => {
        this.passwordForm.get(key).setErrors({
          [key]: errors.msg[key]
        });
      });
    }

    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Dismiss');    
  }

}
