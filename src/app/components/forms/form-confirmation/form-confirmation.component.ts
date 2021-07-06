import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form-confirmation',
  templateUrl: './form-confirmation.component.html',
  styleUrls: ['./form-confirmation.component.css']
})
export class FormConfirmationComponent implements OnInit {
  text: string = '';
  warning: string = '';

  constructor (@Inject(MAT_DIALOG_DATA) private data: any) {}

  ngOnInit() {
    this.text = this.data.text;
    this.warning = this.data.warning;
  }

}
