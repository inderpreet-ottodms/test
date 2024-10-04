import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {
  userType: string;
  constructor( private router: Router) {
    this.userType = localStorage.getItem('Usertype');
    if (this.userType === 'Supplier') {
      this.router.navigate(['dashboard/supplier/ecommerce']);
    } else if (this.userType === 'Buyer') {
      this.router.navigate(['dashboard/buyer/default']);
    } else if (this.userType === null) {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
    }
   }

  ngOnInit() {

  }

}
