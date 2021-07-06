import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/shared/service/shared.service';

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
  constructor (private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getAllUserPending();
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
      this.sharedService.callSnack('Sistem sedang mengalami gangguan, silahkan coba beberapa saat lagi', 'Tutup');
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
