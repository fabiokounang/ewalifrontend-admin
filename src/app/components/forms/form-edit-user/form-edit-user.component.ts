import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/service/shared.service';


@Component({
  selector: 'app-form-edit-user',
  templateUrl: './form-edit-user.component.html',
  styleUrls: ['./form-edit-user.component.css']
})
export class FormEditUserComponent implements OnInit {
  loader: boolean = false;
  userForm: FormGroup;
  user: any = null;
  kotas: any[] = [];
  golonganDarah: string[] = ['A', 'B', 'AB', 'O'];
  emoneys: string[] = ['flash', 'e-toll', 'breeze'];
  information_wali: string[] = ['facebook', 'instagram', 'youtube', 'browsing via search engine', 'media cetak', 'teman / kenalan', 'dealer', 'lain-lain'];

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.user = this.data.user;
    this.kotas = this.data.kotas;
    this.makeForm();
  }

  makeForm () {
    this.userForm = new FormGroup({
      kota_id: new FormControl(this.user.kota_id, [Validators.required]),
      nama_lengkap: new FormControl(this.user.user_nama, [Validators.required]),
      nama_panggilan: new FormControl(this.user.nama_panggilan, [Validators.required]),
      nomor_vin: new FormControl(this.user.user_vin, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      nomor_polisi: new FormControl(this.user.user_plat, [Validators.required]),
      nomor_id: new FormControl(this.user.nomor_id, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      tanggal_lahir: new FormControl(this.user.tanggal_lahir, [Validators.required]),
      alamat_ktp: new FormControl(this.user.alamat_ktp, [Validators.required]),
      alamat_domisili: new FormControl(this.user.alamat_domisili, [Validators.required]),
      kota_domisili: new FormControl(this.user.kota_domisili, [Validators.required]),
      provinsi_domisili: new FormControl(this.user.provinsi_domisili, [Validators.required]),
      pekerjaan: new FormControl(this.user.pekerjaan, [Validators.required]),
      nomor_telepon_current: new FormControl(this.user.nomor_telepon_current, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(10), Validators.maxLength(14)]),
      nomor_telepon_telegram: new FormControl(this.user.nomor_telepon_telegram, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(10), Validators.maxLength(14)]),
      nomor_telepon_whatsapp: new FormControl(this.user.nomor_telepon_whatsapp, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(10), Validators.maxLength(14)]),
      nomor_telepon_emergency: new FormControl(this.user.nomor_telepon_emergency, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(10), Validators.maxLength(14)]),
      golongan_darah: new FormControl(this.user.golongan_darah, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
      informasi_wali: new FormControl(this.user.informasi_wali, [Validators.required]),
      emoney: new FormControl(this.user.emoney, [Validators.required])
    });
  }

  onSelectEmoney (event) {
    this.userForm.patchValue({
      emoney: event.value
    });
  }

  onSelectInformationWali (event) {
    this.userForm.patchValue({
      information_wali: event.value
    });
  }

  onSelectKota (event) {
    this.userForm.patchValue({
      kota_id: event.value
    });
  }

  onSelectInformationGolonganDarah (event) {
    this.userForm.patchValue({
      golongan_darah: event.value
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onEditDataUser () {
    this.loader = true;
    this.dialogRef.disableClose = true;
    if (this.userForm.valid) {
      const objUser = {...this.userForm.value};
      this.userForm.disable();      
      this.sharedService.connection('PUT', 'master-user', objUser, '', this.user.user_id).subscribe((response: any) => {
        if (response.status == 200) {
          this.helperOnAddForm();
          if (response.body.status) {
            this.dialogRef.close(true);
            this.sharedService.callSnack('Sukses mengedit data user', 'Tutup');
          } else {
            let errors = response.body.error;
            this.processError(errors);
          }
        }
      }, (error) => {
        this.helperOnAddForm();
        this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
      });
    } else {
      this.helperOnAddForm();
      this.sharedService.callSnack('Input tidak valid', 'Tutup');
    }
  }

  helperOnAddForm () {
    this.userForm.enable();
    this.loader = false;
    this.dialogRef.disableClose = false;
  }

  processError (errors) {
    if (errors.type === 'validation') {
      Object.keys(errors.msg).forEach((key) => {
        this.userForm.get(key).setErrors({
          [key]: errors.msg[key]
        });
      });
    }

    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Tutup');    
  }

}
