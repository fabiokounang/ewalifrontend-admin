import { Injectable } from "@angular/core";
import { HttpRequest, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import HttpList from './HttpList';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  private apiHttp: string = '';
  private systemErrorMsg = 'Sistem sedang mengalami gangguan, silahkan coba beberapa saat lagi';
  subHttp = HttpList;
  onUpdatedContact: Subject<any> = new Subject<any>();
  onFilter: Subject<any> = new Subject<any>();
  userRole: any = null;
  filterData: any = null;

  private status: any[] = [
    { id: 1, name: 'status.active' },
    { id: 2, name: 'status.not_active' }
  ]
  private tipes: any[] = [
    { id: 1, name: 'tipe.new' },
    { id: 2, name: 'tipe.followup'},
    { id: 3, name: 'tipe.db_toko'}
  ];

  private statusProsesContact: any[] = [
    { id: 1, name: 'status.active' },
    { id: 2, name: 'status.process' },
    { id: 3, name: 'status.updated' }
  ]

  private statusContact: any[] = [
    { id: 1, name: 'tidak terdaftar' }, 
    { id: 2, name: 'tidak aktif' }, 
    { id: 3, name: 'tidak diangkat' },
    { id: 4, name: 'tidak tertarik' },
    { id: 5, name: 'tertarik' },
    { id: 6, name: 'telepon ulang' }
  ];
  private skeletonRoleAdmin: any[] = [
    { id: 1, name: 'role.superadmin' },
    { id: 2, name: 'role.supervisor'},
    { id: 3, name: 'role.admin'}
  ]
  constructor (private httpClient: HttpClient, private snack: MatSnackBar, private meta: Meta) {
    this.apiHttp = this.meta.getTag('name=api').content;
  }
  
  connection(method: string, subHttp: string, data: any = {}, query: string = '', strData = '') {
    const req = new HttpRequest(method, this.apiHttp + this.subHttp[subHttp].endpoint + (strData ? '/' + strData : '') + '?' + query + '&time=' + new Date().getTime(), data);
    return this.httpClient.request(req);
  }

  saveToLocalStorage (data) {
    localStorage.setItem('user_role', data.user_role);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('user_email', data.user_email);
    if (data.user_nama) localStorage.setItem('user_nama', data.user_nama);
  }

  setFilterData (filterData) {
    this.filterData = filterData;
  }

  getFilterData () {
    return this.filterData;
  }

  removeFilterData () {
    this.filterData = null;
  }

  removeLocalStorage () {
    // localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_nama');
  }

  getLocalStorageUserId () {
    return localStorage.getItem('user_id');
  }

  getLocalStorageRole () {
    return localStorage.getItem('user_role');
  }
  
  getApiHttp () {
    return this.apiHttp;
  }

  getCookiesToken () {
    return 
  }

  async callSnack (text, action) {
    this.snack.open(text, action, {
      duration: 3000
    });
  }

  getSystemErrorMsg () {
    return this.systemErrorMsg;
  }
}