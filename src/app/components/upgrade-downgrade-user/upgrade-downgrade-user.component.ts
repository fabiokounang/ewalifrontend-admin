import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upgrade-downgrade-user',
  templateUrl: './upgrade-downgrade-user.component.html',
  styleUrls: ['./upgrade-downgrade-user.component.css']
})
export class UpgradeDowngradeUserComponent implements OnInit {
  roles: any = [
    { id: 1,name: 'admin' },
    { id: 2, name: 'ketua chapter' }
  ]
  selectedRole: any = null;
  constructor (private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
  }

  onSelectRole (event) {
    this.selectedRole = event.value;
  }

  onSubmit () {
    this.dialogRef.close(this.selectedRole);
  }

}
