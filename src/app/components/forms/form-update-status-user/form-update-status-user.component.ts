import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-form-update-status-user',
  templateUrl: './form-update-status-user.component.html',
  styleUrls: ['./form-update-status-user.component.css']
})
export class FormUpdateStatusUserComponent implements OnInit {
  statuses = [
    { id: '1', name: 'aktif', disable: false },
    { id: '2', name: 'suspend', disable: false },
    // { id: '3', name: 'pending', disable: false },
    { id: '4', name: 'block', disable: false }
  ];
  selectedStatus: any = null;
  loader: boolean = false;
  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.statuses = this.statuses.map(status => {
      if (status.id != this.data.user_status) status.disable = true;
      return status;
    });
  }

  onUpdateStatusUser () {
    this.dialogRef.close(this.selectedStatus);
  }

}
