import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {
  loader: boolean = false;
  filterForm: FormGroup;
  filterData: any[] = [];
  isReset: boolean = false;
  from: any = null;
  to: any = null;
  process_from: any = null;
  process_to: any = null;

  objectKeys = Object.keys;

  constructor (private dialog: MatDialogRef<any>, private sharedService: SharedService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.makeForm();
  }

  makeForm () {
    this.filterData = this.data.skeleton;
    this.filterForm = new FormGroup({});  
    Object.keys(this.filterData).forEach((key) => {
      let value = null;
      if (this.sharedService.getFilterData()) value = this.sharedService.getFilterData()[key];
      this.filterForm.addControl(key, new FormControl(value));
    });
  }

  onCloseDialog () {    
    this.dialog.close(this.isReset);
  }

  onFilterData () {
    let uri = [];
    Object.keys(this.filterForm.value).forEach((key) => {
      if (this.filterForm.value[key]) uri.push('filter_' + key + '=' + this.filterForm.value[key]);
    });
    this.sharedService.setFilterData(this.filterForm.value);
    console.log(uri);
    this.sharedService.onFilter.next(uri);
    this.dialog.close(true);
  }
}
