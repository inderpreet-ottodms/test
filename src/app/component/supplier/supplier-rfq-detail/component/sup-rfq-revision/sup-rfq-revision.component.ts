import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  IRFQRevisionModel
} from '../../../../../core/models/rfqModel';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  IContactViewModel, IRFQViewModel
} from '../../../../../core/models/accountModel';
import * as moment from 'moment';
import {
  Router
} from '@angular/router';
import { IMyAccountViewModel } from '../../../../../core/models/supplierProfileModel';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sup-rfq-revision',
  templateUrl: './sup-rfq-revision.component.html',
  styleUrls: ['./sup-rfq-revision.component.scss']
})
export class SupRfqRevisionComponent implements OnInit {
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
  iMyAccountViewModel: IMyAccountViewModel;
  isUpgradeBtn: boolean;
  isAccountUpgradereqSent1: boolean;
  accountUpgradeMessage: string;
  isLoader: boolean;
  showUpgradeAccountModal: boolean;
  irfqViewModel: IRFQViewModel;
  rfqGuid: string;
  constructor(private _rfqService: RfqService, private _profileService: ProfileService, private router: Router,
    private _supplierService: SupplierService, private _toastr: ToastrService) {
    this.iRFQRevisionModelColl = [];
  }

  getTime(date ? : Date) {
    return !!date ? date.getTime() : 0;
  }


  // sortByDueDate(): void {
  //   this.iRFQRevisionModelCollNew.sort((a: IRFQRevisionModel, b: '') => {
  //     return this.getTime(a.dueDate) - this.getTime(b.dueDate);
  //   });
  // }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  getProfileDetails() {
    const data = this._rfqService.get('currentRfqConatctId');
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('currentiContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('currentiContactViewModel'));
      this.creatorContactImageUrl = this.iContactViewModel.contactPictureFile;
      this.creatorContactName = this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName;
    } else {
      this._profileService.getProfileDetails(data, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('currentiContactViewModel', JSON.stringify(this.iContactViewModel));
          this.creatorContactImageUrl = this.iContactViewModel.contactPictureFile;
          this.creatorContactName = this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName;
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }

  }
  ngOnInit() {
    this.rfqGuid = '';
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: '',
      membership: '',
      price: 0,
      paymentMethod: '',
      paymentFrequency: '',
      paymentAmount: 0,
      startDate: '0001-01-01T00:00:00',
      endDate: '0001-01-01T00:00:00',
      autoRenewal: false,
      errorMessage: '',
      result: false,
      pageName: 'supplier - sup-rfq-details',
      rfqId: 0,
      toAlternateEmailId:''
    };
    this.getRfqDetail();
    // this.rfqId = this.currentRfqId;
    // this._rfqService.GetRevesionData(this.rfqId).subscribe(
    //   (data: IRFQRevisionModel[]) => {
    //     if (data['result'] !== false) {
    //       this.iRFQRevisionModelCollNew = data['data'];
    //       this.iRFQRevisionModelColl = this.iRFQRevisionModelCollNew.sort((a, b) => b.revisionDate.localeCompare(a.revisionDate));
    //      // console.log(this.iRFQRevisionModelColl, 'this.iRFQRevisionModelColl')
    //       const date = JSON.parse(localStorage.getItem('Rfqdetails'));
    //       console.log(date, 'date')
    //       // if (!!date) {
    //       //   this.createdDate = moment.utc(date.rfqCreatedOn).toDate();
    //       //   this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
    //       // } else {
    //       //   this.createdDate = moment.utc(this.iRFQRevisionModelColl[0].revisionDate).toDate();
    //       //   this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
    //       // }

    //       if( this.irfqViewModel && this.irfqViewModel.rfqCreatedOn !== null &&
    //         this.irfqViewModel.rfqCreatedOn!=undefined  && this.irfqViewModel.rfqCreatedOn!='') {
    //         this.createdDate = moment.utc(this.irfqViewModel.rfqCreatedOn).toDate();
    //         this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
    //       } else {
    //         this.createdDate = moment.utc(this.iRFQRevisionModelColl[0].revisionDate).toDate();
    //         this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
    //       }


    //       // this.createdDate = this.iRFQRevisionModelColl[0].revisionDate;

    //       // this.creatorContactImageUrl = this.defaultAwsPath + this.iRFQRevisionModelColl[1].contactURL;
    //       setTimeout(() => {
    //         this.getProfileDetails();
    //       }, 3000);

    //     } else {
    //       const date = JSON.parse(localStorage.getItem('Rfqdetails'));
    //       if (!!date) {
    //         this.createdDate = moment.utc(date.rfqCreatedOn).toDate();
    //       }
    //     }
    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
    this.showUpgradeAccountModal = false;
  }
  getImageUrl(key) {
    const d = this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].contactURL;
    return this.defaultAwsPath + d;
  }

  setProperDate(key) {
    const d = this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].revisionDate;
    if (!!d) {
      const abc = new Date(d);
      const locale = 'en-us';
      const cusDate = abc.toLocaleString(locale, {
        month: 'long'
      }) + ' ' + abc.getDate() + ' , ' + abc.getFullYear();
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
    const d = this.iRFQRevisionModelColl.filter(m => m.versionNum === key)[0].contactName;
    return d;
  }


  setProperDate2(d) {
    if (!!d) {
      const abc = new Date(d);
      const locale = 'en-us';
      const cusDate = abc.toLocaleString(locale, {
        month: 'long'
      }) + ' ' + abc.getDate() + ' , ' + abc.getFullYear();
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
    return parseInt(localStorage.getItem('supplierRfqDetailId'));
  }
  /* This function is used to check supplier type premium or non-premium */
  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  /* This function is called when click on Upgrade Account button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
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

  getRfqDetail() {
    let supplierContactId = 0;
    // if (localStorage.getItem('Usertype') === 'Supplier') {
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
        } else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/supplier/ecommerce']);
          // } 
        } else {
          this.getRevisionData();
        }
      },error =>{
        this.getRevisionData();
      })
  }

  getRevisionData() {
    this._rfqService.GetRevesionData(this.rfqId).subscribe(
      (data: IRFQRevisionModel[]) => {
           if(data['result']) {
        this.iRFQRevisionModelCollNew = data['data']; 
        this.iRFQRevisionModelColl = this.iRFQRevisionModelCollNew.sort((a, b) => b.revisionDate.localeCompare(a.revisionDate));
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
  
}
