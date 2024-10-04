import { Component, OnInit, Input } from '@angular/core';
import { RfqService } from './../../../../../core/services/rfq/rfq.service';
import { IRFQRevisionModel } from '../../../../../core/models/rfqModel';
import { retry } from 'rxjs/operators';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { IContactViewModel, IRFQViewModel } from '../../../../../core/models/accountModel';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rfq-revisions',
  templateUrl: './rfq-revisions.component.html',
  styleUrls: ['./rfq-revisions.component.scss']
})
export class RfqRevisionsComponent implements OnInit {

  // Variable Declarations
  @Input('rfqId') rfqId: number;
  iRFQRevisionModelCollNew: IRFQRevisionModel[];
  iRFQRevisionModelColl: IRFQRevisionModel[];
  iRFQRevisionModel: IRFQRevisionModel;
  createdDate: any;
  contactName: string;
  creatorContactName: string;
  creatorContactImageUrl: string;
  defaultAwsPath = '';
  iContactViewModel: IContactViewModel;
  irfqViewModel: IRFQViewModel;
  rfqGuid: string;
  filedNameAws: boolean;
  // Variable Declarations Ends
  constructor(private _rfqService: RfqService, private _profileService: ProfileService, private _toastr: ToastrService, private router: Router) {
    this.iRFQRevisionModelColl = [];
  }

  getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }


  // sortByDueDate(): void {
  //   this.iRFQRevisionModelCollNew.sort((a: IRFQRevisionModel, b: '') => {
  //     return this.getTime(a.dueDate) - this.getTime(b.dueDate);
  //   });
  // }
  ngOnInit() {
    this.rfqGuid = '';
    this.getProfileDetails();
    this.getRfqDetail();
    // this.rfqId = this.currentRfqId;

  }

  getRevisionData() {
    this._rfqService.GetRevesionData(this.rfqId).subscribe(
      (data: IRFQRevisionModel[]) => {
           if(data['result']) {
        this.iRFQRevisionModelCollNew = data['data'];
        this.iRFQRevisionModelColl = this.iRFQRevisionModelCollNew.sort((a, b) => b.revisionDate.localeCompare(a.revisionDate));
          console.log(this.iRFQRevisionModelColl,"this.iRFQRevisionModelColl");
                if(this.iRFQRevisionModelColl[0].fieldName= "PO Part status updated - \"AwS1\""){
                  this.filedNameAws = true
                  
                }            
        // const date = JSON.parse(localStorage.getItem('Rfqdetails'));
        if( this.irfqViewModel && this.irfqViewModel.rfqCreatedOn !== null &&
          this.irfqViewModel.rfqCreatedOn!=undefined  && this.irfqViewModel.rfqCreatedOn!='') {
          this.createdDate = moment.utc(this.irfqViewModel.rfqCreatedOn).toDate();
          this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
        } else {
          this.createdDate = moment.utc(this.iRFQRevisionModelColl[0].revisionDate).toDate();
          this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
        }
      } else {
        // const date = JSON.parse(localStorage.getItem('Rfqdetails'));
        if( this.irfqViewModel && this.irfqViewModel.rfqCreatedOn !== null &&
           this.irfqViewModel.rfqCreatedOn!=undefined && this.irfqViewModel.rfqCreatedOn!='') {
          this.createdDate = moment.utc(this.irfqViewModel.rfqCreatedOn).toDate();
        }
      }
       // this.creatorContactName = this.iContactViewModel.firstName;

        // data['data']; // this.iRFQRevisionModelCollNew.groupBy(this.iRFQRevisionModel);
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }

  getRfqDetail() {
    let supplierContactId = 0;
    // if (localStorage.getItem('Usertype') === 'Buyer') {
    //   supplierContactId = 0;
    // } else {
    //   supplierContactId = this.loggedId;
    // }
    supplierContactId = this.loggedId;
    this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, this.rfqGuid).subscribe(
      result => {
        if (result.result === true) {
          this.irfqViewModel = result;
          this.getRevisionData();
        }else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/buyer/default']);
          // } ;
        }
      },error =>{
        this.getRevisionData();
      })
  }
  getProfileDetails() {
    // const userInfo = JSON.parse(localStorage.getItem('iContactViewModel'));
    // if(userInfo !== null) {
    //   this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    //   this.creatorContactName = this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName;
    // } else {
    const id = this.loggedEncryptId;

    this._profileService.getProfileDetails(id,this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        this.creatorContactName = this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
    // }
  }
  getImageUrl (key) {
    const d =  this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].contactURL;
   return this.defaultAwsPath + d;
  }

  setProperDate(key) {
   const d =  this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].revisionDate;
    if (d !== null) {
      const  abc = new Date(d);
      const locale = 'en-us';
      const cusDate = abc.toLocaleString(locale, { month: 'long' }) + ' ' + abc.getDate() + ' , ' + abc.getFullYear();
      return cusDate;
    }
  }

  
  setProperTimekey(key) {
    const rDate =  this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].revisionDate;
    const d = moment.utc(rDate).toDate();
    if (d !== null) {
      const  abc = new Date(d);
      const locale = 'en-us';
      const cusDate =  abc.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' })
      return cusDate;
    }
  }

  getContactName(key) {
    const d =  this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].contactName;
      return d;
   }


  setProperDate2(d) {
     if (d !== null) {
       const  abc = new Date(d);
       const locale = 'en-us';
       const cusDate = abc.toLocaleString(locale, { month: 'long' }) + ' ' + abc.getDate() + ' , ' + abc.getFullYear();
       return cusDate;
     }
   }

  setProperDate3(date) {
    const d = moment.utc(date).toDate();
      if (d !== null) {
        const  abc = new Date(d);
        const locale = 'en-us';
        const cusDate =  abc.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' })
        return cusDate;
      } 
    }

// tslint:disable-next-line:member-ordering

  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }


  getDate(val){
  if (val !== undefined && val !== null && val !== '') {
    if(moment(val).isValid()) {
      return moment(moment.utc(val).toDate()).format('MM-DD-YYYY');
    } else {
      return val;
    }
  } else {
    return '';
  }
}
}
