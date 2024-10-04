import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IRFQShopIQViewModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-sup-rfq-shopiq',
  templateUrl: './sup-rfq-shopiq.component.html',
  styleUrls: ['./sup-rfq-shopiq.component.scss']
})
export class SupRfqShopiqComponent implements OnInit {

  iRFQShopIQViewModelColl: IRFQShopIQViewModel[];
  isLoader: boolean;
  @Input('rfqId') rfqId: number;
  showShopIQ: any;
  constructor(private _supplierService:SupplierService,private _rfqService: RfqService, private _toastr: ToastrService) {
    this.iRFQShopIQViewModelColl = [];
    this.isLoader = false;
    // this.rfqId = 0;
    // this.rfqId = parseInt(localStorage.getItem('supplierRfqDetailId'));
  }

  ngOnInit() {
    // this.rfqId = this._rfqService.get('rfqId');
    // if(!this.rfqId) {
    //   this.rfqId = parseInt(localStorage.getItem('supplierRfqDetailId'));
    // }
    this.getShopIQList();
    this.getSupplierPackageInfo();
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  getShopIQList() {
    this.isLoader = true;
    this._rfqService.GetrfqShopIQInfo(this.rfqId, this.loggedId).subscribe(
    // this._rfqService.GetrfqShopIQInfo(1148700, this.loggedId).subscribe(
      result => {
        this.isLoader = false;
        if (result.result) {
          if(!!result.data && (result.data.length !== 0) ) {
            this.iRFQShopIQViewModelColl = result.data;
          }
        } else {
          this._toastr.error(result['errorMessage'], 'Error!');
        }
      },
      error => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  getSupplierPackageInfo() {
    const contactId = this.loggedId;
    const companyId = this.loggedCompanyId;
    this._supplierService.getTileAvailability(contactId, companyId).subscribe(
      (result) => {
        if (result) {
          this.showShopIQ = result[0].showShopIQ;
        }
      },
      (error) => {
        console.log("err", error);
      },
      () => { }

    );
  }

}
