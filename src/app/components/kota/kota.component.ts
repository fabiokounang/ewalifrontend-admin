import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/shared/service/shared.service';
import { FormAddKotaComponent } from '../forms/form-add-kota/form-add-kota.component';
import { FormConfirmationComponent } from '../forms/form-confirmation/form-confirmation.component';
import { FormEditKotaComponent } from '../forms/form-edit-kota/form-edit-kota.component';

@Component({
  selector: 'app-kota',
  templateUrl: './kota.component.html',
  styleUrls: ['./kota.component.css']
})
export class KotaComponent implements OnInit {

  loader = false;
  tableQueryData: any = {
    page: 1,
    limit: 10,
    sort_attr: 'kota_created_at',
    sort: 2,
    max: 0,
    totalAll: 0,
    filter: []
  }
  displayedColumns: any[] = ['kota_created_at', 'kota_nama', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  isFilter: boolean = false;
  searchText: string = '';
  constructor (private sharedService: SharedService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllKotaChapter();
  }

  getAllKotaChapter () {
    this.loader = true;
    this.sharedService.connection('GET', 'master-kota', {}, this.populateData()).subscribe((response: any) => {
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

  populateData () {
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
    this.getAllKotaChapter();
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
    this.getAllKotaChapter();
  }

  onPageChange (event) {
    this.tableQueryData.page = event.pageIndex + 1;
    this.tableQueryData.limit = event.pageSize ? event.pageSize : this.tableQueryData.limit;
    this.getAllKotaChapter();
  }

  onSearch () {
    this.tableQueryData.search = this.searchText;    
    this.getAllKotaChapter();
  }

  onDetectEmpty () {
    if (!this.searchText) {
      this.resetData();
      this.getAllKotaChapter();
    }
  }

  onOpenAddDialog () {
    const dialog = this.dialog.open(FormAddKotaComponent);
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllKotaChapter();
      }
    });
  }

  onOpenEditDialog (kota) {
    const dialog = this.dialog.open(FormEditKotaComponent, {
      data: {
        kota: kota
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllKotaChapter();
      }
    });
  }

  onConfirmation (data) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      width: '300px',
      data: {
        text: 'Apakah anda yakin akan menghapus kota / chapter ini ?',
        warning: 'Semua user yang diassign ke kota ini akan diunassign'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteKota(data);
    });
  }

  deleteKota (data) {
    this.sharedService.connection('DELETE', 'master-kota', {}, '', data.kota_id).subscribe((response: any) => {
      if (response.status == 200) {
        if (response.body.status) {
          this.getAllKotaChapter();
          this.sharedService.callSnack('Kota berhasil dihapus', 'Tutup');
        } else {
          this.sharedService.callSnack('', 'Tutup');
        }
      }
    }, (error) => {
      this.sharedService.callSnack('', 'Tutup');
    });
  }

  resetData () {
    this.tableQueryData.page = 1;
    this.tableQueryData.limit = 10;
    this.tableQueryData.total = 0;
    this.tableQueryData.search = '';
    this.tableQueryData.sort_attr = 'kota_created_at';
    this.tableQueryData.sort = '-1';
    this.tableQueryData.filter = [];
  }

}
