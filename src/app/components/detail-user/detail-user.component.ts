import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  user: any = null;
  objectKeys = Object.keys;
  kotas: any = [];
  note: string = '';
  kota: any = null;
  status = '';
  wantedKeys = ['user_nama', 'user_vin', 'user_plat', 'nomor_id', 'nama_panggilan', 'tanggal_lahir', 'alamat_ktp', 'alamat_domisili', 'kota_domisili', 'provinsi_domisili', 'pekerjaan', 'nomor_telepon_current', 'nomor_telepon_telegram', 'nomor_telepon_whatsapp', 'nomor_telepon_emergency', 'golongan_darah', 'informasi_wali', 'emoney'];

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.user = this.data.user;
    this.kotas = this.data.kota;
  }

  checkType (data) {
    return typeof(data);
  }

  onReview (event) {
    this.status = event.value;
    this.note = '';
    this.kota = null;
  }

  onSelectKota (kota) {
    this.kota = kota.value;
  }

  onSubmit () {
    this.dialogRef.close({
      status: this.status,
      note: this.note,
      kota: this.kota
    });
  }
}
