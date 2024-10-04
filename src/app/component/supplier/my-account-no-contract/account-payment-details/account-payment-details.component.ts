import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from '../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-account-payment-details',
  templateUrl: './account-payment-details.component.html',
  styleUrls: ['./account-payment-details.component.scss']
})
export class AccountPaymentDetailsComponent implements OnInit, OnDestroy {
  //billingInfoViewModel: any = "";
  modalReference: any;
 // subscriptionId: string;
  @ViewChild('content',{static:false}) updateCardModal: TemplateRef < any > ;
  constructor(private _SupplierService: SupplierService, private _toastr: ToastrService, private modalService: NgbModal, private activeRoute: ActivatedRoute, private router: Router) {}
  isLoader: boolean;
  showUpdateBtn: boolean;
  ngOnInit() {
    //this.subscriptionId = null;
    this.showUpdateBtn = false;
    this.activeRoute.queryParams.subscribe(params => {
 
    });
  }

  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }

 openModal() {
    this.modalReference = this.modalService.open(this.updateCardModal, {
      backdrop: 'static'
    });
  }
  closeErrorCSVModel(event) {
    this.isLoader = true;
    this.modalReference.close();
  }

  getBillingAddress(address) {
    return address.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  ngOnDestroy() {
    if (this.modalReference != null && this.modalReference != undefined) {
      this.modalReference.close();
    }
  }

}
