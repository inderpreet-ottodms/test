import { Component, OnInit, Output, TemplateRef, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IManufacturerDashboardViewModel } from '../../../core/models/supplierProfileModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';


@Component({
  selector: 'app-publish-decision-model',
  templateUrl: './publish-decision-model.component.html',
  styleUrls: ['./publish-decision-model.component.scss']
})
export class PublishDecisionModelComponent implements OnInit {

  @ViewChild('publishModal',{ static: true }) publishModal: TemplateRef < any > ;
  @Output() openNoPublishEvent = new EventEmitter<boolean>();
  tempModel: any;
  iProfileSetModel: IManufacturerDashboardViewModel;

  constructor(private modalService: NgbModal, private router: Router, private supplierService: SupplierService, private _toastr: ToastrService) { }

  ngOnInit() {
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      isPublishProfile: null,
      isCompanyAddress: null,
      contactId: this.loggedId
    };
    this.openSynModal(true);
  }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  openSynModal(evt) {
      this.tempModel = this.modalService.open(this.publishModal, {
        backdrop: 'static',
      });
  }

  openNoPublishModel(opt){
    this.openNoPublishEvent.emit(opt);
  }

  redirect(){
    let obj ={
      supplierCompanyId: this.loggedCompanyId,
      publishProfileStatusId: 232,
      createdBy: this.loggedId,
      createdOn: '',
      supplierContactId: this.loggedId,
    }
    this.supplierService.setSupplierPublishProfileStatus(obj).subscribe(
      response =>{
        if(!response.isError){
          this.setProfileStatus();
          this._toastr.success('Your profile has been sent for review.', 'Congratulations!');
          // this.router.navigate(['publishProfile/confirmation']);
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
            this.router.navigate(['dashboard/supplier/ecommerce']);
        });
        }else{
          this._toastr.error(response.messages, 'Error!');
        }
      },
      error=>{
        this._toastr.warning('Something went wrong', 'Warning!');
      }
    );

  }

  setProfileStatus() {
    this.iProfileSetModel.isPublishProfile = true;
    this.supplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          // console.log(result);
        }
      }
    );
  }

}
