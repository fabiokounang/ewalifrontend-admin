import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-form-edit-kota',
  templateUrl: './form-edit-kota.component.html',
  styleUrls: ['./form-edit-kota.component.css']
})
export class FormEditKotaComponent implements OnInit {
  kota: any = {};
  kotaForm: FormGroup;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.kota = this.data.kota;
    this.makeForm();
  }

  makeForm () {
    this.kotaForm = new FormGroup({
      kota_nama: new FormControl(this.kota.kota_nama, [Validators.required, Validators.maxLength(255)])      
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onEditKota () {
    this.loader = true;
    this.dialogRef.disableClose = true;
    if (this.kotaForm.valid) {
      this.kotaForm.disable();
      this.sharedService.connection('PUT', 'master-kota', this.kotaForm.value, '', this.kota.kota_id).subscribe((response: any) => {
        if (response.status == 200) {
          this.helperOnEditForm();
          if (response.body.status) {
            this.dialogRef.close(true);
            this.sharedService.callSnack('Sukses mengubah kota / chapter', 'Tutup');
          } else {
            let errors = response.body.error;
            this.processError(errors);
          }
        }
      }, (error) => {
        this.helperOnEditForm();
        this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
      })
    } else {
      this.helperOnEditForm();
      this.sharedService.callSnack('Input tidak valid', 'Tutup');
    }
  }

  helperOnEditForm () {
    this.kotaForm.enable();
    this.loader = false;
    this.dialogRef.disableClose = false;
  }

  processError (errors) {
    if (errors.type === 'validation') {
      Object.keys(errors.msg).forEach((key) => {
        this.kotaForm.get(key).setErrors({
          [key]: errors.msg[key]
        });
      });
    }

    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Tutup');    
  }
}
