import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../__Services/api-service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupplierRFQLikeModel } from '../SupplierRFQLikeModel';
import * as moment from 'moment';
import { ProfileService } from '../../../core/services/profile/profile.service';

@Component({
  selector: 'app-rfq-card',
  templateUrl: './rfq-card.component.html',
  styleUrls: ['./rfq-card.component.scss'],
  providers: [ApiService, SupplierRFQLikeModel]
})
export class RfqCardComponent implements OnInit {
  @Input() rfqID : any;
  @Output() selectedRFQ_OnChange = new EventEmitter<number>();


  constructor(public rest: ApiService,
              private router:Router,
              private route: ActivatedRoute,
              private _toastr: ToastrService,
              private supplierRFQLike: SupplierRFQLikeModel, private _ProfileService: ProfileService) {

                this.supplierRFQLike.CompanyId = parseInt(localStorage.getItem("loggedCompanyId"));
                this.supplierRFQLike.ContactId = parseInt(localStorage.getItem("LoggedId"));
                this.supplierRFQLike.RfqId = this.rfqID;
              }

  openRfqInfo : any;
  supplierId : number;

  ngOnInit() {

    this.supplierId = Number.parseInt(localStorage.getItem('LoggedId'));
    this.rest.get('OpenRFQInfo?id='+this.rfqID +"&supplierId=" + this.supplierId.toString())
    .subscribe(
      (response: { data: any, isError:boolean, message:any }) => {
        if(!response.isError){
          this.openRfqInfo = response.data;
          if(this.openRfqInfo.imageUrl===null || this.openRfqInfo.imageUrl==='')
          {
            this.openRfqInfo.imageUrl = 'assets/supplier/3-d-big.png';
          }
          // if(this.openRfqInfo.rfqName ==='Monday RFQ_Edit')
          // {
          //
          //   this.openRfqInfo.isCapabilitiesMatched = true;
          // }
        }
      });
  }

  errorMessage : string = null;
  openRFQSidePanel()
  {
    this.errorMessage = null;
    if(!this.openRfqInfo.isCapabilitiesMatched && !this.openRfqInfo.isRegionMatched)
    {
      // this.errorMessage = 'You can update your capabilities but RFQ#'
      //                     + this.rfqID + ' is not another region.'
      this.errorMessage = ' Your Capabilites and Region do not match with this RFQ!';
    } else if(!this.openRfqInfo.isCapabilitiesMatched)
    {
      this.errorMessage = 'Please update your capabilities to see details.';
    } else if(!this.openRfqInfo.isRegionMatched)
    {
      this.errorMessage = 'RFQ#' + this.rfqID + ' is not another region.' ;
    }
    if(this.errorMessage!=null)
    {
      this._toastr.warning(this.errorMessage , 'Warning!' );
      return;
    }
    //
    this.selectedRFQ_OnChange.emit( this.rfqID);
  }
  openRFQDetail()
  {
    this.errorMessage = null;
    if(!this.openRfqInfo.isCapabilitiesMatched && !this.openRfqInfo.isRegionMatched)
    {
      // this.errorMessage = 'You can update your capabilities but RFQ#'
      //                     + this.rfqID + ' is not another region.'
      this.errorMessage = ' Your Capabilites and Region do not  match with this RFQ!';
    } else if(!this.openRfqInfo.isCapabilitiesMatched)
    {
      this.errorMessage = 'Please update your capabilities to see details.';
    } else if(!this.openRfqInfo.isRegionMatched)
    {
      this.errorMessage = 'RFQ#' + this.rfqID + ' is not another region.' ;
    }
    if(this.errorMessage!=null)
    {
      this._toastr.warning(this.errorMessage , 'Warning!' );
      return;
    }
    // localStorage.setItem('supplierRfqDetailId', this.rfqID);
    const encryptedRfqID = this._ProfileService.encrypt(this.rfqID);
    this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }});
  }


  likeThisRFQ(event)
  {

    event.stopPropagation();
    this.supplierRFQLike.IsRfqLike = (this.openRfqInfo.isLike==null || !this.openRfqInfo.isLike) ? true : false;
    if((this.openRfqInfo.isLike==null || !this.openRfqInfo.isLike))
    {
      this.supplierRFQLike.IsRfqDisLike = !this.supplierRFQLike.IsRfqLike;
    }
    this.supplierRFQLike.LikeDate = new Date();
    this.supplierRFQLike.RfqId = this.rfqID;
    this.rest.post('RFQ/SetSupplierRFQLike', this.supplierRFQLike)
    .subscribe(
      (response: { result: any }) => {
        if(response.result)
        {
          this._toastr.success(this.supplierRFQLike.IsRfqLike
                              ? 'RFQ has been marked as like successfully'
                              : 'Your have removed your like successfully');
          this.ngOnInit();
        }
      });
  }
  dislikeThisRFQ(event)
  {

    event.stopPropagation();
    this.supplierRFQLike.IsRfqDisLike = (this.openRfqInfo.isLike || this.openRfqInfo.isLike==null) ? true : false;
    if((this.openRfqInfo.isLike || this.openRfqInfo.isLike==null) ){
      this.supplierRFQLike.IsRfqLike = !this.supplierRFQLike.IsRfqDisLike;
    }
    this.supplierRFQLike.LikeDate = new Date();
    this.supplierRFQLike.RfqId = this.rfqID;
    this.rest.post('RFQ/SetSupplierRFQLike', this.supplierRFQLike)
    .subscribe(
      (response: { result: any }) => {
        if(response.result)
        {
          this._toastr.success(this.supplierRFQLike.IsRfqDisLike
                              ? 'RFQ has been marked as dislike successfully'
                              : 'Your have removed your dislike successfully');
          this.ngOnInit();
        }
      });
  }
  goToRfqDdetails(id)
  {
    this.errorMessage = null;
    if(!this.openRfqInfo.isCapabilitiesMatched && !this.openRfqInfo.isRegionMatched)
    {
      // this.errorMessage = 'You can update your capabilities but RFQ#'
      //                     + this.rfqID + ' is not another region.'
      this.errorMessage = ' Your Capabilites and Region do not match with this RFQ!';
    } else if(!this.openRfqInfo.isCapabilitiesMatched)
    {
      this.errorMessage = 'Please update your capabilities to see details.';
    } else if(!this.openRfqInfo.isRegionMatched)
    {
      this.errorMessage = 'RFQ#' + this.rfqID + ' is not another region.' ;
    }
    if(this.errorMessage!=null)
    {
      this._toastr.warning(this.errorMessage , 'Warning!' );
      return;
    }

    localStorage.removeItem('supplierRfqGuid');
    // localStorage.setItem('supplierRfqDetailId', id);
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }});
  }

  utcDate(date) {
    return moment.utc(date).toDate();
  }
  checkForDay(closing_date){
    const currentDate = moment();
    const closeDate = moment.utc(closing_date).local();
    // console.log("closeDate",closeDate);
    // console.log("currentDate",currentDate);
    const duration = moment.duration(closeDate.diff(currentDate));
    const minutes = duration.asMinutes();
    if (minutes <= 1440 && minutes > 0) { 
      return true;
    } else {
      return false;
    }
  }
}
