import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-form-add-kota',
  templateUrl: './form-add-kota.component.html',
  styleUrls: ['./form-add-kota.component.css']
})
export class FormAddKotaComponent implements OnInit {
  kotaForm: FormGroup;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.makeForm();

  }

  makeForm () {
    this.kotaForm = new FormGroup({
      kota_nama: new FormControl(null, [Validators.required, Validators.maxLength(255)])      
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddKota () {
    this.loader = true;
    this.dialogRef.disableClose = true;
    if (this.kotaForm.valid) {
      this.kotaForm.disable();
      this.sharedService.connection('POST', 'master-kota', this.kotaForm.value).subscribe((response: any) => {
        if (response.status == 200) {
          this.helperOnAddForm();
          if (response.body.status) {
            this.dialogRef.close(true);
            this.sharedService.callSnack('Sukses menambahkan kota / chapter', 'Tutup');
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
