import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modeSide: any = 'side';
  open: boolean = true;
  userId: any = null;
  role: any = null;
  constructor (private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.userId = this.sharedService.getLocalStorageUserId();
    this.role = this.sharedService.getLocalStorageRole();
    this.onResize();
  }

  onToggle (sidenav) {
    if (window.innerWidth <= 992) {
      sidenav.toggle();
    }
  }

  onToggleButton (sidenav) {
    sidenav.toggle();
  }

  onLogout (sidenav) {
    sidenav.close();
    this.sharedService.removeLocalStorage();
    this.router.navigate(['login']);
  }

  onResize() {
    this.modeSide = window.innerWidth <= 992 ? 'over' : 'side';
    this.open = window.innerWidth <= 992 ? false : true;
  }
}
