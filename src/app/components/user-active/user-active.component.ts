import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { SharedService } from 'src/app/shared/service/shared.service';
import { FormConfirmationComponent } from '../forms/form-confirmation/form-confirmation.component';
import { FormEditUserComponent } from '../forms/form-edit-user/form-edit-user.component';
import { FormUpdateStatusUserComponent } from '../forms/form-update-status-user/form-update-status-user.component';
import { UpgradeDowngradeUserComponent } from '../upgrade-downgrade-user/upgrade-downgrade-user.component';

@Component({
  selector: 'app-user-active',
  templateUrl: './user-active.component.html',
  styleUrls: ['./user-active.component.css']
})
export class UserActiveComponent implements OnInit {
  loader = false;
  tableQueryData: any = {
    page: 1,
    limit: 10,
    sort_attr: 'user_last_update',
    sort: 2,
    max: 0,
    totalAll: 0,
    filter: []
  }
  displayedColumns: any[] = ['user_created_at', 'user_email', 'user_nama', 'kota', 'user_role', 'user_activate', 'user_status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  isFilter: boolean = false;
  searchText: string = '';
  userData: any = null;
  kotas: any[] = [];
  subscription: Subscription;
  constructor (private sharedService: SharedService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fillData();
    this.getAllUserNotPending();
    this.listenSubscription();
  }

  fillData () {
    this.userData = {
      role: this.sharedService.getLocalStorageRole(),
      user_id: this.sharedService.getLocalStorageUserId()
    }
  }

  listenSubscription () {
    this.subscription = this.sharedService.onFilter.subscribe((uri) => {
      this.tableQueryData.filter = uri;
      this.isFilter = true;
      this.getAllUserNotPending();
    });
  }

  getAllUserNotPending () {
    this.loader = true;
    this.sharedService.connection('GET', 'master-user-active', {}, this.populateGetBody()).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.tableQueryData.page = response.body.data.page;
          this.tableQueryData.limit = response.body.data.limit;
          this.tableQueryData.max = response.body.data.max;
          this.tableQueryData.totalAll = response.body.data.total;
          this.dataSource = new MatTableDataSource(response.body.data.values);
          this.kotas = response.body.data.kota;
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  populateGetBody () {
    let query = []; // membuat variabel query dengan type array of object untuk menampung semua body

    query.push({ // query push page/1
      'key': 'page',
      'value': this.tableQueryData.page
    });

    query.push({ // query push limit/1
      'key': 'limit',
      'value': this.tableQueryData.limit
    });

    if (this.tableQueryData.search) {
      query.push({
        'key': 'search',
        'value': this.tableQueryData.search
      })
    }

    query.push({ // query push page/1
      'key': 'sort_attr',
      'value': this.tableQueryData.sort_attr
    });

    query.push({ // query push page/1
      'key': 'sort',
      'value': this.tableQueryData.sort
    });

    if (this.tableQueryData.filter.length > 0) {
      this.tableQueryData.filter.forEach((val) => {
        val = val.split('=');
        query.push({
          'key': val[0],
          'value': val[1]
        })
      })
    }
    return query.map(data => data.key + '=' + data.value).join('&'); 
  }

  processError (errors) {
    if (errors.type === 'message') this.sharedService.callSnack(errors.msg.default, 'Tutup');    
  }

  updateStatusUser (user, status) {
    this.sharedService.connection('PUT', 'master-user-status', { user_status: status }, '', user.user_id).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.callSnack('Sukses mengupdate status user', 'Tutup');
          this.getAllUserNotPending();
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  onResetFilter () {
    this.tableQueryData.filter = [];
    this.getAllUserNotPending();
    this.sharedService.removeFilterData();
    this.isFilter = false;
  }

  sortData(event) {
    let sort = (event.direction == 'asc' || event.direction == '') ? '1' : '-1';
    let column = event.active;
    if (sort && column) {
      this.tableQueryData.sort_attr = column;
      this.tableQueryData.sort = sort;
    }
    this.getAllUserNotPending();
  }

  onPageChange (event) {
    this.tableQueryData.page = event.pageIndex + 1;
    this.tableQueryData.limit = event.pageSize ? event.pageSize : this.tableQueryData.limit;
    this.getAllUserNotPending();
  }

  onSearch () {
    this.tableQueryData.search = this.searchText;    
    this.getAllUserNotPending();
  }

  onDetectEmpty () {
    if (!this.searchText) {
      this.resetData();
      this.getAllUserNotPending();
    }
  }

  onOpenFilterDialog () {
    const dialog = this.dialog.open(FilterComponent, {
      width: '500px',
      data: {
        skeleton: {
          kota_id: this.kotas.map(val => {
            return {
              id: val.kota_id,
              name: val.kota_nama
            }
          })
        }
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUserNotPending();
      }
    })
  }

  onOpenEditDialog (data) {
    let user = {
      ...data,
      ...data.user_detail
    }
    delete user.user_detail;
    const dialog = this.dialog.open(FormEditUserComponent, {
      width: '500px',
      height: '600px',
      data: {
        user: user,
        kotas: this.kotas
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllUserNotPending();
    })
  }

  onOpenUpgradeDialog (user) {
    const dialog = this.dialog.open(UpgradeDowngradeUserComponent, {
      data: user
    });
    dialog.afterClosed().subscribe((result) => {
      this.upgradeDowngradeUser(result, user.user_id);
    });
  }

  upgradeDowngradeUser (role, userId) {
    this.loader = true;
    this.sharedService.connection('PUT', 'master-upgrade-downgrade-user', { user_role: role }, '', userId).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.callSnack('Sukses mengupdate user', 'Tutup');
          this.getAllUserNotPending();
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  onOpenUpdateStatusUser (user) {
    const dialog = this.dialog.open(FormUpdateStatusUserComponent, {
      data: user
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.updateStatusUser(user, result);
    });
  }

  onActivateUser (user) {
    this.loader = true;
    this.sharedService.connection('PUT', 'master-activate-user', {}, '', user.user_id).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.callSnack('Sukses verifikasi user secara manual', 'Tutup');
          this.getAllUserNotPending();
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  resetData () {
    this.tableQueryData.page = 1;
    this.tableQueryData.limit = 10;
    this.tableQueryData.total = 0;
    this.tableQueryData.search = '';
    this.tableQueryData.sort_attr = 'user_last_update';
    this.tableQueryData.sort = '-1';
    this.tableQueryData.filter = [];
  }
}
