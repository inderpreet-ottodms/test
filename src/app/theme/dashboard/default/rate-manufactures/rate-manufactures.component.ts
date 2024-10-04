import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import { BuyerService } from '../../../../core/services/buyer/buyer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rate-manufactures',
  templateUrl: './rate-manufactures.component.html',
  styleUrls: ['./rate-manufactures.component.scss']
})
export class RateManufacturesComponent implements OnInit, OnDestroy {

  manufactureList: any = [];
  ratingSubscribe: any;
  loader: boolean = false;
  constructor(private _rfqService: RfqService, private _buyerService: BuyerService, private _toastr: ToastrService) {}

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  ngOnInit() {
    this.getRatingsList();
    this.ratingSubscribe = this._buyerService.getRatingEvent().subscribe(
      response =>{
        if(response === true){
          this.getRatingsList();
          this._buyerService.setRatingEvent(false);
        }
      }
    );
  }
  getRatingsList(){
    this.loader = true;
    this.manufactureList=[];
    this._buyerService.getRatingsList(this.loggedId).subscribe(
      response => {
        if(!response.isError){
          this.manufactureList = response.data;
        }
        this.loader = false;
      },
      error => {
        this.loader = false;
        this.manufactureList = [];
      }
    );
  }
  showRatingModel(manufactureDetails) {
    // debugger;
    this._rfqService.set(true, 'isModelShow');
    this._rfqService.set(manufactureDetails.rfqId, 'ratingRfq');
    this._rfqService.set(manufactureDetails.supplierId, 'isFormcotactId');
    this._rfqService.set(manufactureDetails.supplierCompany, 'ComapnyName');
    this._rfqService.set(manufactureDetails.supplier, 'manufacturerName');
    this._rfqService.set('https://s3.us-east-2.amazonaws.com/mfg.mp2020/logos/636941145361007045_S3_emotarKoala.png', 'contactPictureFile');
  }
  setStatus(manufactureDetails){
    let tempObj = {
      rfqId: manufactureDetails.rfqId,
      buyerId: manufactureDetails.buyerId,
      supplierId: manufactureDetails.supplierId,
    }
    this._buyerService.setNoThanksStatus(tempObj).subscribe(
      response => {
        if(!response.isError){
          this.getRatingsList();
        } else {
          this._toastr.error(response.messages, 'Error!');
        }
      }
    );
  }
  ngOnDestroy(){
    this.ratingSubscribe.unsubscribe();
  }
}
