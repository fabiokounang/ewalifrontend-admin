import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upgrade-downgrade-user',
  templateUrl: './upgrade-downgrade-user.component.html',
  styleUrls: ['./upgrade-downgrade-user.component.css']
})
export class UpgradeDowngradeUserComponent implements OnInit {
  roles: any = [
    { id: 1,name: 'admin' },
    { id: 2, name: 'ketua chapter' },
    { id: 3, name: 'user' }
  ]
  selectedRole: any = null;
  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.roles = this.roles.map(role => {
      if (role.id != this.data.user_role) role.disable = true;
      return role;
    });
  }

  onSelectRole (event) {
    this.selectedRole = event.value;
  }

  onSubmit () {
    this.dialogRef.close(this.selectedRole);
  }

}
