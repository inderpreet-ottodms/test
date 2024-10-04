import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IRFQViewModel, IRfqQuoteSupplierQuoteViewModel, ITerritoryClassificationModel, DownloadAllFilesViewModel
} from '../../../../../../core/models/rfqModel';
import { IPartLibraryModel } from '../../../../../../core/models/partModel';
import { appConstants } from '../../../../../../core/config/constant';
import { MasterService } from '../../../../../../core/services/master/master.service';
import { ProfileService } from '../../../../../../core/services/profile/profile.service';
import { IContactViewModel } from '../../../../../../core/models/accountModel';
import { RfqService } from '../../../../../../core/services/rfq/rfq.service';
import { SupplierService } from '../../../../../../core/services/supplier/supplier.service';
import { IManufacturerDashboardViewModel } from '../../../../../../core/models/supplierProfileModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier-rfq-detail-sidepanel',
  templateUrl: './rfq-detail-sidepanel.component.html',
  styleUrls: ['./rfq-detail-sidepanel.component.scss']
})
export class SupplierRfqDetailSidepanelComponent implements OnInit, OnDestroy, OnChanges {
  
  iProfileSetModel: IManufacturerDashboardViewModel;
  @Output() drawer_OnClose = new EventEmitter<boolean>();

  private _rfqId: number;
  actionForGrowthPackage: string;
  @Input()
  set rfqId(rfqId: number) {
    this._rfqId = rfqId;
  }
  get rfqId() {
    return this._rfqId;
  }
  private isRFQForm2Enabled=false;
  private rfqFormLatestVersion:number=2;
  isLoader: boolean;
  isNDAaccepted: boolean;
  iRfqQuoteSupplierQuoteViewModel: IRfqQuoteSupplierQuoteViewModel;
  Downloadallfiles: DownloadAllFilesViewModel;
  temp: string[];
  isSupplierDetailPage: boolean = false;
  irfqViewModel: IRFQViewModel;
  irfqViewModelLoaded: boolean = false;
  ITerritoryClassificationModelColl: ITerritoryClassificationModel[];
  importanceOrder: string;
  preferredMfgLocText: string;
  whoPaysForShippingText: string;
  shippingAddress: any = {
    companyName: '',
    streetAddress: '',
    deptAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };
  iReviewPartsViewModelColl: IPartLibraryModel[];
  prefNDATypeText: string;
  iContactViewModel2: IContactViewModel;
  isStandardNda: boolean = true;
  customNDAFile: string;
  shippingReviewData: any;
  isFileDownloaded: number;
  isFileDownloaded1: number;
  isFileDownloaded2: number;
  isRfqLike: boolean;
  isRfqDisLike: boolean;
  preferredCommunicationArray: string[] = [];
  accountType: string;
  // Variable declaration End

  constructor(private _rfqService: RfqService, private _masterService: MasterService, private _SupplierService: SupplierService, private _profileService: ProfileService, private router: Router, private _toastr: ToastrService) {
    this.isLoader = true;
    this.temp = [];
    this._rfqService.getCurrentOpenRfqId().subscribe(message => {
      if (this.rfqId !== message.text) {
        this.isLoader = true;
        this.rfqId = message.text;
        this.getRfqDetails();
        this.getPartsList();
      }
    });
    this.isRfqLike = false;
    this.isNDAaccepted = false;
    this.isRfqDisLike = false;
    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const changeRfqId: SimpleChange = changes.rfqId;
    if (changeRfqId.previousValue != undefined && (changeRfqId.previousValue != changeRfqId.currentValue)) {
      this.isLoader = true;
      this.ngOnInit();
    }
  }

  ngOnInit() {
    this._profileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      this.isRFQForm2Enabled=rfqForm2Enabled;
    });
    this.accountType = localStorage.getItem('AccountType');
    let url = this.router.url;
    this.isSupplierDetailPage = url.includes('/supplier/supplierRfqDetails');
    const elmnt = document.getElementById("rfqDrawer");
    elmnt.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest'
    });

    this.preferredCommunicationArray[117] = 'Call';
    this.preferredCommunicationArray[118] = 'Message';
    this.preferredCommunicationArray[119] = 'Email';
    this.preferredCommunicationArray[120] = 'Call or Email';
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      contactId: this.loggedId,
      isPublishProfile: null,
      isCompanyAddress: null
    };
    this.isFileDownloaded = 0;
    this.isFileDownloaded1 = 0;
    this.isFileDownloaded2 = 0;
    if (this.rfqId === 0) {
      this.rfqId = this._rfqService.get('rfqId');
    }
    // this.fillDropDown();
    this.isRfqLike = this._rfqService.get('isRfqLike');
    this.isRfqDisLike = this._rfqService.get('isRfqDisLike');
    this.getRfqDetails();
    this.getBuyerLocation();
    this.getPartsList();
    if (localStorage.getItem('isMyRfqPage') !== undefined && localStorage.getItem('isMyRfqPage') !== null) {
      this.setProfileStatus();
    }
  }

  setProfileStatus() {
    localStorage.removeItem('isMyRfqPage');
    this.iProfileSetModel.isVisitMyRFQ = true;
    this._SupplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }

  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this.drawer_OnClose.emit(true);
  }

  ngOnDestroy() {
    this.closePartDrawer();
  }

  // APi function calls
  getRfqDetails() {
    let supplierContactId = 0;
    // if (localStorage.getItem('Usertype') === 'Buyer') {
    //   supplierContactId = 0;
    // } else {
    //   supplierContactId = this.loggedId;
    // }
    supplierContactId = this.loggedId;
    this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, '').subscribe(
      result => {
        if (result.result === true) {
          result.preferredMfgLocationIds = this.locationIdsIntToString(result.preferredMfgLocationIds);
          
          this.irfqViewModel = result;
          this.irfqViewModelLoaded = true;
          this.actionForGrowthPackage  =result.actionForGrowthPackage;
          console.log("this.irfqViewModelthis.irfqViewModelthis.irfqViewModel",this.irfqViewModel)
          this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
          this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
          if (!this.irfqViewModel.payment_term_id || this.irfqViewModel.payment_term_id.toString() === '') {
            this.irfqViewModel.payment_term_id = 2;
          }

          this.formatDataRFQData();
          this.GetSupplierRFQQuoteDetails();
        } else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/buyer/default']);
          // } 
        } 
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  getQuantityByLeval(partid, leval) {
    const part = this.iReviewPartsViewModelColl.find(m => m.partId === partid);
    const quantity = part.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    if (quantity !== undefined) {
      return quantity.partQty;
    }

  }
  locationIdsIntToString(localColl) {
    const obj = [];
    (localColl).forEach(element => {
      if (!!element && (element !== 0)) {
        obj.push('' + element);
      }
    });
    return obj;
  }

  // APi function calls Ends

  // Extra Utility Function

  formatDataRFQData() {
    this.importanceOrder = this.getSortedOrderOfImportance();
    this.preferredMfgLocText = this.getPreferredMfgLoc();

    this.whoPaysForShippingText = this.keyByValue(this.irfqViewModel.whoPaysForShipping, appConstants.paysForShippingCode);
    this.prefNDATypeText = this.keyByValue(this.irfqViewModel.ndaTypekey, appConstants.NDAType);
    // this.getPartsList();
    this.getAddress();
    this.getSavedCustomeNdaFiles();
  }

  getSortedOrderOfImportance() {
    if (this.irfqViewModel) {
      const obj = {
        Speed: this.irfqViewModel.importanceSpeed,
        Price: this.irfqViewModel.importancePrice,
        Quality: this.irfqViewModel.importanceQuality,
      };
      return (Object.keys(obj).sort(function (a, b) { return obj[a] - obj[b]; })).join(', ');
    }
  }

  getPreferredMfgLoc() {
    if (this.irfqViewModel) {
      const obj = [];
      (this.irfqViewModel.preferredMfgLocationIds).forEach(element => {
        if (!!element && (element !== '') && (element !== '0')) {
          const locationNumber = Number(element);
          if (this.ITerritoryClassificationModelColl !== undefined) {
            const data = this.ITerritoryClassificationModelColl.find(m => m.territoryClassificationId === locationNumber)
              .territoryClassificationName;
            obj.push(data);
          }

        }
      });
      return obj.join(', ');
    }
  }

  getBuyerLocation() {
    const count = this._rfqService.get('ITerritoryClassificationModelColl');
    if (count !== undefined) {
      this.ITerritoryClassificationModelColl = this._rfqService.get('ITerritoryClassificationModelColl');
      this.preferredMfgLocText = this.getPreferredMfgLoc();
    } else {
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          this._rfqService.set(data2, 'ITerritoryClassificationModelColl');
          this.getBuyerLocation();
          this.preferredMfgLocText = this.getPreferredMfgLoc();
        },
        error => () => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }

  keyByValue(value, arr) {
    const kArray = Object.keys(arr);        // Creating array of keys
    const vArray = Object.values(arr);      // Creating array of values
    const vIndex = vArray.indexOf(value);         // Finding value index
    return kArray[vIndex];                      // Returning key by value index
  }

  getPartsList() {
    this._rfqService.getReviewRfqParts(this.rfqId, this.loggedId, false).subscribe(
      result => {
        this.iReviewPartsViewModelColl = result;
        this.iReviewPartsViewModelColl.forEach(part => {
          part.deliveryDate = moment.utc(part.deliveryDate).toDate();
          part.partDescription = part.partDescription + '<br>' + part.customPartDescription;
        });
        this.isLoader = false;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  getAddress() {
    this._profileService.getAddress(this.irfqViewModel.contactId).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        if (this.iContactViewModel2 && this.iContactViewModel2.address &&
          this.iContactViewModel2.address.companyShippingSiteViewModelList) {
          this.shippingReviewData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
          for (const entry of this.shippingReviewData) {
            if (entry.siteId === this.irfqViewModel.shipTo) {
              this.shippingAddress.siteLabel = entry.siteLabel;
              this.shippingAddress.companyName = entry.companyName;
              this.shippingAddress.streetAddress = entry.addresses.streetAddress;
              this.shippingAddress.deptAddress = entry.addresses.deptAddress;
              this.shippingAddress.city = entry.addresses.city;
              this.shippingAddress.postalCode = entry.addresses.postalCode;
              this.shippingAddress.state = entry.addresses.state;
              this.shippingAddress.country = entry.addresses.country;
            }
          }
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }


  GetSupplierRFQQuoteDetails() {
    this.isNDAaccepted = true;
    this._SupplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, false).subscribe(
      result => {
        this.iRfqQuoteSupplierQuoteViewModel = result;
        if (this.isPremium()) {
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
            this.isNDAaccepted = true;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === null) {
            this.isNDAaccepted = false;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed') {
            this.isNDAaccepted = false;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'DECLINED') {
            this.isNDAaccepted = false;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '') {
            this.isNDAaccepted = false;
          }
        }
      });
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    ++this.isFileDownloaded;
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      --this.isFileDownloaded;
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }

  // Extra Utility Function Ends

  getSavedCustomeNdaFiles() {
    this._rfqService.GetCustomNDAToRFQ(this.irfqViewModel.rfqId).subscribe(
      (res) => {
        if (res.result === true) {
          if (res.ndaFile && (res.ndaFile !== '' || res.ndaFile.length > 0)) {
            this.isStandardNda = false;
            this.customNDAFile = res.ndaFile;
          }
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  downloadAllFiles(fileCompArray: string[], partfile, partId, rfqId, isFileDownloaded) {
    if (isFileDownloaded === 'isFileDownloaded') {
      ++this.isFileDownloaded;
    }
    if (isFileDownloaded === 'isFileDownloaded1') {
      ++this.isFileDownloaded1;
    }
    if (isFileDownloaded === 'isFileDownloaded2') {
      ++this.isFileDownloaded2;
    }
    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    };
    this.temp = [];
    let data = JSON.stringify(fileCompArray);
    this.temp = JSON.parse(data);
    if (partfile !== '') {
      this.temp.push(partfile);
    }
    this.Downloadallfiles.filename = this.temp;
    this.Downloadallfiles.part_id = partId;
    this.Downloadallfiles.rfQ_Id = rfqId;

    this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response => {
      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;

          link.setAttribute('target', '_blank');
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }

        if (isFileDownloaded === 'isFileDownloaded') {
          --this.isFileDownloaded;
        }

        if (isFileDownloaded === 'isFileDownloaded1') {
          --this.isFileDownloaded1;
        }

        if (isFileDownloaded === 'isFileDownloaded2') {
          --this.isFileDownloaded2;
        }

      } else {
        if (isFileDownloaded === 'isFileDownloaded') {
          --this.isFileDownloaded;
        }

        if (isFileDownloaded === 'isFileDownloaded1') {
          --this.isFileDownloaded1;
        }

        if (isFileDownloaded === 'isFileDownloaded2') {
          --this.isFileDownloaded2;
        }

      }
    }, error => {
      if (isFileDownloaded === 'isFileDownloaded') {
        --this.isFileDownloaded;
      }

      if (isFileDownloaded === 'isFileDownloaded1') {
        --this.isFileDownloaded1;
      }

      if (isFileDownloaded === 'isFileDownloaded2') {
        --this.isFileDownloaded2;
      }

    })
  }

  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }
  }

  goToRfqDdetails(id) {
    localStorage.setItem('suppCurrentRfqName', this.irfqViewModel.rfqName);
    localStorage.setItem('suppCurrentRfqDate', this.irfqViewModel.rfqCreatedOn);
    this._rfqService.set(this.isRfqLike, 'isRfqLike');
    this._rfqService.set(this.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('suppCurrentRfqStatusId', '3');
    const encryptedRfqID = this._profileService.encrypt(id);
    this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID } });
  }

  showHideRFQPartDetails(event, id, index) {
    event.stopPropagation();
    this.iReviewPartsViewModelColl[index].result = !this.iReviewPartsViewModelColl[index].result;
  }
  setRfdId(setRfqId){
    localStorage.setItem('rfqid', setRfqId);
  }
  hasRfqAccess(){
    if(this.accountType == appConstants.AccountType.Gold || this.accountType == appConstants.AccountType.Platinum){
      if(this.isPremium() && this.irfqViewModel.isStripeSupplier && this.irfqViewModel.isAllowQuoting){
        return true;
      }
      return false;
    }
    if(this.accountType == appConstants.AccountType.Starter || this.accountType == appConstants.AccountType.GrowthPackage|| this.accountType == appConstants.AccountType.Basic){
      if(this.irfqViewModel.rfqAccess == true){
        return true;
      }
    }
    return false;
  }
}
