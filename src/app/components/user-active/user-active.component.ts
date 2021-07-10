import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/shared/service/shared.service';
import { FormConfirmationComponent } from '../forms/form-confirmation/form-confirmation.component';
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
  displayedColumns: any[] = ['user_created_at', 'user_email', 'user_nama', 'kota', 'user_role', 'user_status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  isFilter: boolean = false;
  searchText: string = '';
  userData: any = null;
  constructor (private sharedService: SharedService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fillData();
    this.getAllUserPending();
  }

  fillData () {
    this.userData = {
      user_id: this.sharedService.getLocalStorageUserId()
    }
  }

  getAllUserPending () {
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

  blockUser (user) {
    this.sharedService.connection('GET', 'master-user-pending', {}, this.populateGetBody()).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.tableQueryData.page = response.body.data.page;
          this.tableQueryData.limit = response.body.data.limit;
          this.tableQueryData.max = response.body.data.max;
          this.tableQueryData.totalAll = response.body.data.total;
          this.dataSource = new MatTableDataSource(response.body.data.values);
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
    this.getAllUserPending();
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
    this.getAllUserPending();
  }

  onPageChange (event) {
    this.tableQueryData.page = event.pageIndex + 1;
    this.tableQueryData.limit = event.pageSize ? event.pageSize : this.tableQueryData.limit;
    this.getAllUserPending();
  }

  onSearch () {
    this.tableQueryData.search = this.searchText;    
    this.getAllUserPending();
  }

  onDetectEmpty () {
    if (!this.searchText) {
      this.resetData();
      this.getAllUserPending();
    }
  }

  onOpenFilterDialog () {
    // const dialog = this.dialog.open(FormFilterComponent, {
    //   width: '500px',
    //   data: {
    //     skeleton: {
    //       status: this.sharedService.getSkeletonAdminUser()
    //     }
    //   }
    // });

    // dialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.getAllUserPending();
    //   }
    // })
  }

  onOpenUpgradeDialog (element) {
    const dialog = this.dialog.open(UpgradeDowngradeUserComponent);
    dialog.afterClosed().subscribe((result) => {
      this.upgradeDowngradeUser(result, element.user_id);
    });
  }

  upgradeDowngradeUser (role, userId) {
    this.loader = true;
    this.sharedService.connection('PUT', 'master-upgrade-downgrade-user', { user_role: role }, '', userId).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.body.status) {
          this.sharedService.callSnack('Sukses upgrade user user', 'Tutup');
          this.getAllUserPending();
        } else {
          this.processError(response.body.error);
        }
      }
    }, (error) => {
      this.loader = false;
      this.sharedService.callSnack(this.sharedService.getSystemErrorMsg(), 'Tutup');
    });
  }

  onConfirmation (data) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      width: '300px',
      data: {
        text: 'Apakah anda yakin akan block user ini ?',
        warning: ''
      }
    });
    dialog.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) this.blockUser(data);
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
