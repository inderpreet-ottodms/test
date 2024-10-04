import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-publish-confirmation-page',
  templateUrl: './not-publish-confirmation-page.component.html',
  styleUrls: ['./not-publish-confirmation-page.component.scss']
})
export class NotPublishConfirmationPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  returnToDashboard() {
    this.router.navigate(['dashboard/supplier/ecommerce']);
  }
}
