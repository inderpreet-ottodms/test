import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import * as moment from 'moment';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IRfqSupplierLikesViewModel,
  ISupplierRFQViewModel
} from '../../../../../core/models/rfqModel';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  RFQFilter
} from '../../../../rfq/_filter/rfq-filter/rfqFilterModel';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';

@Component({
  selector: 'app-my-rfq',
  templateUrl: './my-rfq.component.html',
  styleUrls: ['./my-rfq.component.scss'],
  providers: [RFQFilter]
})
export class MyRfqComponent implements OnInit {

  items: ISupplierRFQViewModel[];
  filteredItems: ISupplierRFQViewModel[];
  iRFQViewModelColl: ISupplierRFQViewModel[];
  iRfqSupplierLikesViewModel: IRfqSupplierLikesViewModel;
  isLoader: boolean = false;
  isRfqAvailable: boolean = false;
  totalRow: number;
  defaultAwsPath = '';
  showFeedbackModel: boolean = false;
  companyName: string ='';
  companyId: number = 0;
  accountType: string;
  rfdIdToSet: any;
  userDetailsLocation: string;

  constructor(public filter: RFQFilter, private _rfqService: RfqService, private _SupplierService: SupplierService, private _toastr: ToastrService, private router: Router, private _profileService: ProfileService) {}

  ngOnInit() {
    this.accountType = localStorage.getItem('AccountType');
    // console.log("Inside My Rfq componentthis.accountType@@@@@@@@@@",this.accountType)
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
    this.getRfqList();
  }
  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }
  utcDate(date) {
    return moment.utc(date).toDate();
  }
  checkForDay(closing_date) {
    const currentDate = moment();
    const closeDate = moment.utc(closing_date).local();
    const duration = moment.duration(closeDate.diff(currentDate));
    const minutes = duration.asMinutes();
    if (minutes <= 1440 && minutes > 0) {
      return true;
    } else {
      return false;
    }
  }
  getQuantityToolTip(rfq) {
    let toolTip = ' Qty 1 - ' + rfq.qty1;
    if (rfq.qty2 !== null) {
      toolTip += ' Qty 2 - ' + rfq.qty2;
    }
    if (rfq.qty3 !== null) {
      toolTip += ' Qty 3 - ' + rfq.qty3;
    }
    return toolTip;
  }
  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
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
  getRfqList() {
    this.items = [];
    this.isLoader = true;
    this.isRfqAvailable = false;

    this.filter.supplierCompanyId = this.loggedCompanyId;
    this.filter.contactId = this.loggedId;
    this.filter.rfqType = 1;
    this.filter.pageNumber = 1;
    this.filter.pageSize = 10;
    this.filter.certificateIdList = [];
    this._rfqService.GetSavedSearchedMyRfqList(this.filter).subscribe(
      result => {

        // console.log("List Result------>@@@@@@@@@@@",result)
        if (result['isError'] === false) {
          this.iRFQViewModelColl = result['data'];
          this.totalRow = result['totalRecords'];
          this.items = result['data'];
          if (this.iRFQViewModelColl.length !== 0) {
            this.isLoader = false;
            this.isRfqAvailable = false;
          } else {
            this.items = this.iRFQViewModelColl;
            this.isLoader = false;
            this.isRfqAvailable = true;
            this.items = [];
          }
          // this._rfqService.set(this.totalRow, 'totalRFQCount');
        } else {
          this.isLoader = false;
          this.isRfqAvailable = true;
          this.items = [];
          this._rfqService.set(0, 'totalRFQCount');
        }
      },
      error => {
        this.isLoader = false;
        this.isRfqAvailable = true;
        this.items = [];
        // this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  initiRfqSupplierLikesViewModel() {
    this.iRfqSupplierLikesViewModel = {
      rfqSupplierLikesId: 0,
      rfqId: 0,
      contactId: 0,
      companyId: 0,
      isRfqLike: false,
      isRfqDisLike: null,
      likeDate: null,
      errorMessage: '',
      result: false,
    };
  }

  likeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = true;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            data = data + 1;
            this._rfqService.set(data, 'likedRfqCount');
            this.initiRfqSupplierLikesViewModel();
            const rfqdata = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            rfqdata.isRfqLike = true;
            rfqdata.isRfqDisLike = false;
            currentRfq.result = false;
            this._toastr.success('Rfq has been marked as Liked', 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }

  removelikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = isDislike;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            data = data - 1;
            this._rfqService.set(data, 'likedRfqCount');
            const rfqdata = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            rfqdata.isRfqLike = false;
            rfqdata.isRfqDisLike = isDislike;
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }

  removeDisLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    const currentIndex = this.iRFQViewModelColl.findIndex(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.isRfqLike = isLike;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            const data = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            data.isRfqDisLike = false;
            data.isRfqLike = isLike;
            this.iRFQViewModelColl.splice(currentIndex, 1);
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }

  disLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    const currentIndex = this.iRFQViewModelColl.findIndex(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = true;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;

      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            if (isLike && !isDislike) {
              let data = this._rfqService.get('likedRfqCount');
              if (data !== 0) {
                data = data - 1;
                this._rfqService.set(data, 'likedRfqCount');
                const rfqData = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
                rfqData.isRfqDisLike = true;
                rfqData.isRfqLike = false;
              }
            } else {
              const rfqData = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
              rfqData.isRfqDisLike = true;
              rfqData.isRfqLike = isLike;
            }

            this.iRFQViewModelColl.splice(currentIndex, 1);
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }

  openSidePanel(id, isRfqLike, isRfqDisLike) {
    localStorage.removeItem('supplierRfqGuid');
    const data = this.items.find(m => m.rfqId === id);
    localStorage.setItem('CurrentRfqType', '3');
    localStorage.setItem('suppCurrentRfqName', data.rfqName);
    this._rfqService.set(data.isRfqLike, 'isRfqLike');
    this._rfqService.set(data.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('suppCurrentRfqStatusId', '3');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(id, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'rfqDetailDrawer');
    this._rfqService.setCurrentOpenRfqId(id);
    this._rfqService.set(isRfqLike, 'isRfqLike');
    this._rfqService.set(isRfqDisLike, 'isRfqDisLike');
    this._rfqService.set(false, 'isBuyerMessage');
    setTimeout(() => {
      const elmnt = document.getElementById(id);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 1000);


  }
  goToRfqDdetails(id) {
    const data = this.items.find(m => m.rfqId === id);
    localStorage.setItem('suppCurrentRfqName', data.rfqName);
    this._rfqService.set(data.isRfqLike, 'isRfqLike');
    this._rfqService.set(id, 'currentSupRfqDetailId');
    this._rfqService.set(data.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('isRFQDataBack', JSON.stringify(this.filter));
    localStorage.setItem('suppCurrentRfqStatusId', '3');
    // console.log(id, 'RFQ ID')
    const encryptedRfqID = this._profileService.encrypt(id);
    // console.log(encryptedRfqID, 'encryptedRfqID')
    this.router.navigate(['/supplier/supplierRfqDetails'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }

  showBuyerProfile(id, rfqId) {
    localStorage.removeItem('supplierRfqGuid');
    const data = this.items.find(m => m.rfqId === rfqId);
    localStorage.setItem('CurrentRfqType', '3');
    localStorage.setItem('suppCurrentRfqName', data.rfqName);
    this._rfqService.set(data.isRfqLike, 'isRfqLike');
    this._rfqService.set(data.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('suppCurrentRfqStatusId', '3');
    localStorage.setItem('isRFQDataBack', JSON.stringify(this.filter));
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(rfqId, 'rfqId');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMiniProfile');
      this._rfqService.set(id, 'buyerProfileId');
      this._rfqService.setisBuyerNameClicked('true');;

    }, 100);
    setTimeout(() => {
      const elmnt = document.getElementById(rfqId);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 1000);
  }
  setRfdId(rfdId) {
    this.rfdIdToSet = rfdId;
  }
  goRfqDetailsPage() { 
    if(this.rfdIdToSet === undefined){
      this.rfdIdToSet = localStorage.getItem('rfqid');
    } 
    const data = {
      "companyId": this.loggedCompanyId,
      "rfqId": parseInt(this.rfdIdToSet),
      "unlockBy": this.loggedId
    }
    this._SupplierService.GrowthPackageUnlockRFQsInfo(data).subscribe(
      result => {
        // console.log('result--->', result);
        // console.log(this.rfdIdToSet,"rfqIdToSet");
        const encryptedRfqID = this._profileService.encrypt(this.rfdIdToSet);
        this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }}); 
      }
    );  
  }
  goBackbutton() {
    this.router.navigate(['/supplier/supplierMyRfq']);
  }
  setRecommnededForYouBanner(){
    localStorage.setItem("isStarterPackage", null);
    localStorage.setItem("isGrowthPackage", null);
    localStorage.setItem("isPremiumClicked", null);
  }
}
