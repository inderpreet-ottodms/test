import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy, Output, EventEmitter
} from '@angular/core';
import {
  Router
} from '@angular/router';
import * as moment from 'moment';
import {
  RfqService
} from './../../../core/services/rfq/rfq.service';
import {
  IPartsViewModel,
  IRFQViewModel,
  IManufacturersViewModel,
  ITerritoryClassificationNames,
  ITerritoryClassificationModel
} from './../../../core/models/rfqModel';
import {
  IPartLibraryModel
} from './../../../core/models/partModel';
import {
  appConstants
} from './../../../core/config/constant';
import {
  ICategory,
  IPostProdProcesses,
  IMaterial,
  IQuantityUnit,
  ICountryViewModel,
  IRegionModel,
  ICertificationViewModel,
  IMaterialViewModel
} from './../../../core/models/globalMaster';
import {
  MasterService
} from './../../../core/services/master/master.service';
import {
  ProfileService
} from './../../../core/services/profile/profile.service';
import {
  IContactViewModel
} from './../../../core/models/accountModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-rfq-detail-sidepanel',
  templateUrl: './rfq-detail-sidepanel.component.html',
  styleUrls: ['./rfq-detail-sidepanel.component.scss']
})
export class RfqDetailSidepanelComponent implements OnInit ,OnDestroy{
  @ViewChild('ConfirmModel',{static:false}) ConfirmModel: TemplateRef < any > ;
  constructor(private _rfqService: RfqService, private _masterService: MasterService,private modalService: NgbModal,
    private _profileService: ProfileService, private router: Router, private _ProfileService: ProfileService, private _toastr: ToastrService) {}
    
  // Variable declaration
  @Input('rfqId') rfqId: number;
  private isRFQForm2Enabled=false;
  private rfqFormLatestVersion:number=2;
  iCertificationViewModelColl: ICertificationViewModel[];
  irfqViewModel: IRFQViewModel;
  iPartsViewModelColl: IPartsViewModel[];
  iCategoryColl: ICategory[];
  iPostProdProcessesColl: IPostProdProcesses[];
  iMaterialColl: IMaterial[];
  iMaterialViewModelColl: IMaterialViewModel[];
  iQuantityUnitColl: IQuantityUnit[];
  iCountryColl: ICountryViewModel[];
  iRegionModel: IRegionModel[];
  CertificationselectedItems = [];
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
  manufactureList: IManufacturersViewModel;
  iContactViewModel2: IContactViewModel;
  iTerritoryClassificationNames: ITerritoryClassificationNames;
  isStandardNda = true;
  customNDAFile: string;
  shippingReviewData: any;
  isFileDownloaded: number;
  isdisable: boolean;
  preferredCommunicationArray: string[] = [];
  rfqPurposeModelList: any = [];
  id: any;
  name: any;
  modelRef: any;
  isLoader =true;
  @Output() drawer_OnClose = new EventEmitter<boolean>();  // Variable declaration End
  ngOnInit() {
    
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      this.isRFQForm2Enabled=rfqForm2Enabled;
    });
    this.preferredCommunicationArray[117] = 'Call';
    this.preferredCommunicationArray[118] = 'Message';
    this.preferredCommunicationArray[119] = 'Email';
    this.preferredCommunicationArray[120] = 'Call or Email';
    this.isdisable = false;
    this.isFileDownloaded = 0;
    this.rfqId = this._rfqService.get('rfqId');
    this.initRfqModel();
    this.getRFQPurposeList();
    this.fillDropDown();
    this.getRfqDetails();
    // this.getBuyerLocation();
    this.ITerritoryClassificationModelColl = [];
    this.iTerritoryClassificationNames = {
      territoryClassificationName2: '',
      territoryClassificationName3: '',
      territoryClassificationName4: '',
      territoryClassificationName5: '',
      territoryClassificationName6: '',
      territoryClassificationName7: ''
    };;

  }
  initRfqModel() {
    this.irfqViewModel = {
      rfqId: 0,
      rfqName: '',
      payment_term_id: null,
      contactIdEncrypt: '',
      rfqDescription: '',
      certificateIdList: [],
      certificateList: [],
      rfqStatus: '',
      contactId: 0,
      rfqCreatedOn: '',
      rfqStatusId: 0,
      isSpecialCertificationsByManufacturer: false,
      isSpecialInstructionToManufacturer: false,
      specialInstructionToManufacturer: '',
      importancePrice: 1,
      importanceSpeed: 2,
      importanceQuality: 3,
      quotesNeededBy: null,
      awardDate: null,
      preferredManufacturingLocation: 0,
      isPartialQuotingAllowed: false,
      whoPaysForShipping: 1,
      shipTo: 0,
      isRegisterSupplierQuoteTheRfq: true,
      prefNdaType: 0,
      postProductionProcessId: 0,
      errorMessage: '',
      result: false,
      rfqBuyerStatus: null,
      userType: 0,
      isDefaultPrefferedManufacturingLocation: false,
      rfqGeneralAttachmentsList: [],
      certificationsByManufacturer: '',
      isDefaultNDAdetails: false,
      ndaContent: '',
      ndaTypekey: '',
      preferredMfgLocationIds: [],
      partCount: 0,
      isProfileNDA: false,
      isDefaultWhoPaysForShipping: false,
      rfqThumbnail: '',
      isActive: false,
      isUpdatedFromVision: false,
      isAllPartDetailsFilled: false,
      modifiedBy: 0,
      is_Default_payment_term_id: false,
      SpecialinviteList: [],
      companyId: null,
      ndaFile: '',
      ndaFileId: 0,
      isRfqLike: false,
      isRfqDisLike: false,
      isOnlyDateChanged: false,
      isAwarded: false,
      isShopIQAvailable: false,
      maxDeliveryDate: null,
      deliveryDate: null,
      isDefaultPrefRfqCommunicationMethod: false,
      prefRfqCommunicationMethod: null,
      isStripeSupplier: false,
      isAllowQuoting: false,
      isAwardingEnabled: false,
      rfqPurpose: null,
    };
  }
  getRFQPurposeList() {
    this._rfqService.getRFQPurposeList().subscribe(
      response => {
        if (!response.isError) {
          this.rfqPurposeModelList = response.data;
        }
      }
    );
  }
  closePartDrawer() {
    // this._rfqService.set(0, 'rfqId');
    this._rfqService.set(false, 'showSidePanel');
    this.drawer_OnClose.emit(true);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes) {
    this.getRfqDetails();
  }

  getCertificateList() {
    this._masterService.getCertificate(null).subscribe(
      result => {
        this.iCertificationViewModelColl = result['data'];
        this.CertificationselectedItems = [];
        if (this.irfqViewModel.certificateIdList.length !== 0) {
          this.irfqViewModel.certificateIdList.forEach(element => {
            if (this.iCertificationViewModelColl !== undefined) {
              const data = this.iCertificationViewModelColl.find(i => i.certificateId === element);
              const dta = {
                'certificateId': data.certificateId,
                'certificateTypeId': data.certificateTypeId,
                'description': data.description,
                'certificateCode': data.certificateCode
              };
              this.CertificationselectedItems.push(dta);
            } else {
              this.CertificationselectedItems = [];
            }
          });
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getQuantityByLeval(partid, leval) {
    const part = this.iReviewPartsViewModelColl.find(m => m.partId === partid);
    const quantity = part.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    if (quantity != undefined && quantity != null) {
      return quantity.partQty;
    }
  }
  // APi function calls
  getRfqDetails() {
    this.rfqId = this._rfqService.get('rfqId');
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
          this.irfqViewModel.awardDate = (this.irfqViewModel.awardDate != null && this.irfqViewModel.awardDate != undefined && this.irfqViewModel.awardDate != '') ? moment.utc(this.irfqViewModel.awardDate).toDate() : null;
          this.irfqViewModel.quotesNeededBy = (this.irfqViewModel.quotesNeededBy != null && this.irfqViewModel.quotesNeededBy != undefined && this.irfqViewModel.quotesNeededBy != '') ? moment.utc(this.irfqViewModel.quotesNeededBy).toDate() : null;
          this.irfqViewModel.deliveryDate = (this.irfqViewModel.deliveryDate != null && this.irfqViewModel.deliveryDate != undefined && this.irfqViewModel.deliveryDate != '') ? moment.utc(this.irfqViewModel.deliveryDate).toDate() : null;
          this.isLoader=false;
          // if (this.irfqViewModel.rfqStatusId == 1) {
          //   this.isdisable = true;
          // } else {
          //   this.isdisable = false;
          // }
          this.formatDataRFQData();
          this.getBuyerLocation();
          //  this.getRfqParts();
        } else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/buyer/default']);
          // } 
        }
      },
      error => {
        this.isLoader=false;
        this._rfqService.handleError(error);
      },
      () => {}
    );
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
  getRfqParts() {
    this._rfqService.getRfqParts(this.rfqId).subscribe(
      result => {
        this.iPartsViewModelColl = result;
        // console.log(this.iPartsViewModelColl);
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  // APi function calls Ends

  // Extra Utility Function

  getRfqPercentage() {
    const RfqName = this.irfqViewModel.rfqName;
    const PartsAdded = this.iPartsViewModelColl.length;
    const RfqDetails = this.irfqViewModel.shipTo;
    const isReview = this.irfqViewModel.isDefaultNDAdetails;
    let totalPersentage = 0;
    if (RfqName !== '') {
      totalPersentage = totalPersentage + 25;
    }
    if (PartsAdded !== 0) {
      totalPersentage = totalPersentage + 25;
    }
    if (RfqDetails !== 0) {
      totalPersentage = totalPersentage + 25;
    }
    if (isReview) {
      totalPersentage = totalPersentage + 25;
    }
    return totalPersentage;

  }

  getOriginalPartName(fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        return filenNameArray[0];
      }
      return filenNameArray[1];
    }
  }

  formatDataRFQData() {
    this.importanceOrder = this.getSortedOrderOfImportance();
    this.preferredMfgLocText = this.getPreferredMfgLoc();

    this.whoPaysForShippingText = this.keyByValue(this.irfqViewModel.whoPaysForShipping, appConstants.paysForShippingCode);
    this.prefNDATypeText = this.keyByValue(this.irfqViewModel.ndaTypekey, appConstants.NDAType);
    this.getPartsList();
    this.getAddress();
    this.getManufacturesByRfq();
    this.getSavedCustomeNdaFiles();
  }


  getSortedOrderOfImportance() {
    if (this.irfqViewModel) {
      const obj = {
        Speed: this.irfqViewModel.importanceSpeed,
        Price: this.irfqViewModel.importancePrice,
        Quality: this.irfqViewModel.importanceQuality,
      };
      return (Object.keys(obj).sort(function (a, b) {
        return obj[a] - obj[b];
      })).join(', ');
    }
  }
  getPreferredMfgLoc() {
    if (this.irfqViewModel) {
      const obj = [];
      (this.irfqViewModel.preferredMfgLocationIds).forEach(element => {
        if (!!element && (element !== '') && (element !== '0')) {
          const locationNumber = Number(element);
          if (this.ITerritoryClassificationModelColl.length !== 0) {
            const data = this.ITerritoryClassificationModelColl.find(m => m.territoryClassificationId === locationNumber)
              .territoryClassificationName;
            obj.push(data);
          } else {
            this.getBuyerLocation();
          }
        }
      });
      return obj.join(', ');
    }
  }

  keyByValue(value, arr) {
    const kArray = Object.keys(arr); // Creating array of keys
    const vArray = Object.values(arr); // Creating array of values
    const vIndex = vArray.indexOf(value); // Finding value index
    return kArray[vIndex]; // Returning key by value index
  }

  getPartsList() {
    this._rfqService.getReviewRfqParts(this.irfqViewModel.rfqId, 0, false).subscribe(
      result => {
        this.iReviewPartsViewModelColl = result;
        if (this.iReviewPartsViewModelColl) {
          this.iReviewPartsViewModelColl.forEach(part => {
            part.deliveryDate = moment.utc(part.deliveryDate).toDate().toString();
          });
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  showHideRFQPartDetails(event, id, index) {
    event.stopPropagation();
    this.iReviewPartsViewModelColl[index].result = !this.iReviewPartsViewModelColl[index].result;
  }

  fillDropDown() {}

  getManufacturesByRfq() {
    this._rfqService.getManufacturesByRfq(this.irfqViewModel.rfqId).subscribe(
      result => {
        this.manufactureList = result;
        if (this.manufactureList.individualList.length) {
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
        } else {
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = true;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  getAddress() {
    // tslint:disable-next-line:radix
    const id = this.loggedId;
    this._profileService.getAddress(id).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        localStorage.setItem('addressModel', JSON.stringify(this.iContactViewModel2));
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

  downloadS3File(fileName: string, isDownload: boolean) {
    ++this.isFileDownloaded;
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      --this.isFileDownloaded;
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
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

  getOriginalFineName() {}
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
      () => {}
    );
  }

  downloadAllFiles(fileCompArray: string[], isDownload: boolean, partFile) {
    fileCompArray.forEach(element => {
      this.downloadS3File(element, isDownload);
    });
    if (partFile !== '') {
      this.downloadS3File(partFile, isDownload);
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
          this.getPreferredMfgLoc();
        },
        error => () => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }

  getAddressFormat(mailingAddressData) {
    let tempAdd: string;
    tempAdd = '';
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += '<br />';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state)) {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country)) {
      tempAdd += '<br />' + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      return true;
    } else {
      return false;
    }
  }
  detailRfq(id) {
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }
  getRfqPurposeName() {
    if (this.irfqViewModel.rfqPurpose != undefined && this.irfqViewModel.rfqPurpose != null) {
      let temp = this.rfqPurposeModelList.filter((x) => x.id == this.irfqViewModel.rfqPurpose);
      if (temp.length) {
        return temp[0].value;
      } else {
        return 'N/A';
      }
    } else {
      return 'N/A';
    }
  }

  redirectToEditRfq() {
    let rfqToEdit:any=this.irfqViewModel;
    const encryptedRfqID = this._ProfileService.encrypt(rfqToEdit.rfqId);
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      if (rfqForm2Enabled && rfqToEdit.rfqFormVersion === 2) {
        this.router.navigate(["/rfq/buyer"], { queryParams: { rfqId: encryptedRfqID }}); 
      }else{
        localStorage.setItem('EditRfqId', rfqToEdit.rfqId);
      localStorage.setItem('EditRfqName', rfqToEdit.rfqName);
      this._rfqService.set(rfqToEdit.rfqId, 'editRfqId');
      this._rfqService.set(rfqToEdit.rfqName, 'editRfqName');
        this.router.navigate(['/rfq/editrfq'], { queryParams: { rfqId: encryptedRfqID }}); 
      }
    });
  }

  setRfqDetail(id, Name) {
    this.id = id;
    this.name = Name;
    this.openModel();

  }
  openModel(){
      this.modelRef = this.modalService.open(this.ConfirmModel, {
        backdrop: 'static',
        keyboard:false
      });

  }
  closeModel(){
    this.modelRef.close();
  }
  ngOnDestroy() {
    if(this.modelRef !== undefined && this.modelRef !== null && this.modelRef !== '' ){
      this.modelRef.close();
    }
  }

}
