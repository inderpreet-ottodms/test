import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.scss']
})
export class ThankyouPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  returnToDashboard() {
    this.router.navigate(['dashboard/supplier/ecommerce']);
  }
}
