import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-verifikasi',
  templateUrl: './verifikasi.component.html',
  styleUrls: ['./verifikasi.component.css']
})
export class VerifikasiComponent implements OnInit {
  state: boolean = false;
  token: string = '';
  text = 'Akun anda telah terverifikasi, Silahkan login untuk melanjutkan.';
  constructor(private sharedService: SharedService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (!this.route.snapshot.params || !this.route.snapshot.params['token']) this.router.navigate(['/404']);
    this.token = this.route.snapshot.params['token'];
    this.processVerifikasiEmail();
  }

  processVerifikasiEmail () {
    this.sharedService.connection('PUT', 'master-verifikasi', {}, '', this.token).subscribe((response: any) => {
      if (response.status == 200) {
        if (response.body.status) {
          this.state = true;
        } else {
          this.text = 'Gagal verifikasi (token expired / tidak valid)';
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.text = 'Gagal verifikasi (token expired / tidak valid)';
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  processError (errors) {
    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Tutup');    
  }
}
