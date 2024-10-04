import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  IRFQViewModel,
  IPartsViewModel,
  IManufacturersViewModel,
  ITerritoryClassificationModel,
  ITerritoryClassificationNames
} from '../../../../../core/models/rfqModel';
import {
  ICategory,
  IPostProdProcesses,
  IMaterial,
  IQuantityUnit,
  ICountryViewModel,
  IRegionModel,
  ICertificationViewModel,
  IMaterialViewModel
} from '../../../../../core/models/globalMaster';
import {
  IPartLibraryModel
} from '../../../../../core/models/partModel';
import {
  IContactViewModel
} from '../../../../../core/models/accountModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  appConstants
} from '../../../../../core/config/constant';

import {
  ConfirmationService
} from 'primeng/api';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Router, ActivatedRoute
} from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-rfq-tab',
  templateUrl: './rfq-tab.component.html',
  styleUrls: ['./rfq-tab.component.scss'],
  providers: [ConfirmationService]
})
export class RfqTabComponent implements OnInit {

  // Variable Declarations
  @Input('rfqId') rfqId: number;
  private rfqFormLatestVersion:number=2;
  private isRFQForm2Enabled=false;
  importanceOrder: string;
  preferredMfgLocText: string;
  whoPaysForShippingText: string;
  CertificationselectedItems = [];
  shippingAddress: any = {
    companyName: '',
    streetAddress: '',
    deptAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };
  prefNDATypeText: string;
  isStandardNda = true;
  customNDAFile: string;
  shippingReviewData: any;
  cloneRfqName: string;
  isCloneModal: boolean;
  cloneRfqId: number;
  cloneContactId: number;
  isCencel: boolean;
  msgs: string;
  sidePanel: boolean;
  display: boolean;
  cloneDeliveryDate: string;
    maxDeliverDate: any;
  // Variable Declarations Ends

  // Model Declarations
  irfqViewModel: IRFQViewModel;
  iPartsViewModelColl: IPartsViewModel[];
  iCategoryColl: ICategory[];
  iPostProdProcessesColl: IPostProdProcesses[];
  iMaterialColl: IMaterial[];
  iMaterialViewModelColl: IMaterialViewModel[];
  iQuantityUnitColl: IQuantityUnit[];
  iCountryColl: ICountryViewModel[];
  iRegionModel: IRegionModel[];
  manufactureList: IManufacturersViewModel;
  iContactViewModel2: IContactViewModel;
  iReviewPartsViewModelColl: IPartLibraryModel[];
  iCertificationViewModelColl: ICertificationViewModel[];
  ITerritoryClassificationModelColl: ITerritoryClassificationModel[];
  loader: boolean;
  isFileDownloaded: number;
  iTerritoryClassificationNames: ITerritoryClassificationNames;
  rfqGuid: string;
  idRfq: string;
  minDate: Date;
  id:any;
  name:any;
  isCloneModel:boolean;
  isCloneMaxDelivary:any;
  preferredCommunicationArray: string[] = [];
  rfqPurposeModelList: any = [];
  // Model Declarations Ends
  constructor(private _rfqService: RfqService, private _masterService: MasterService, private _profileService: ProfileService,
    private _toastr: ToastrService, private confirmationService: ConfirmationService,
     private router: Router,private _router: ActivatedRoute) {
    this.isCencel = false;
    this.isCloneModel=false;
    this.cloneRfqId = 0;
    this.cloneContactId = 0;
    this.msgs = '';
    this.loader = true;
    this.rfqGuid = '';
    this.idRfq = '';
    this.iTerritoryClassificationNames = {
      territoryClassificationName2: '',
      territoryClassificationName3: '',
      territoryClassificationName4: '',
      territoryClassificationName5: '',
      territoryClassificationName6: '',
      territoryClassificationName7: ''
    };
    this.isCloneMaxDelivary='';
    this.getBuyerLocation();
  }

  isvalid() {
    if(this.cloneRfqName!== '' && this.cloneDeliveryDate !== '') {
      return false;
    } else {
      return true;
    } 
  }
  ngOnInit() {
    this._profileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      this.isRFQForm2Enabled=rfqForm2Enabled;
    });
    this.preferredCommunicationArray[117] = 'Call';
    this.preferredCommunicationArray[118] = 'Message';
    this.preferredCommunicationArray[119] = 'Email';
    this.preferredCommunicationArray[120] = 'Call or Email';
    this.getRFQPurposeList();
    this.isCloneOpen();
    this.configDatePicker();
    this.isFileDownloaded = 0;
    let isFromMail = '';
    this._router.queryParams.subscribe(params => {
      // console.log('param', params['id']);
      isFromMail = params['id'];
      localStorage.removeItem('Rfqdetails');
      this._rfqService.set(false, 'rfqLoaded');
    });
    if (isFromMail !== undefined && isFromMail !== '') {
      this.idRfq = isFromMail;
      // localStorage.setItem('supplierRfqDetailId', this.idRfq.toString());
      this.rfqId = 0;
      this.rfqGuid =  this.idRfq;
      localStorage.removeItem('suppCurrentRfqName');
      localStorage.removeItem('suppCurrentRfqStatusId');
      localStorage.setItem('supplierRfqGuid', '' + this.rfqGuid);
    } else {
      // this.rfqId = this.currentRfqId;
    }
    // this.fillDropDown();
    this.getRfqDetails();
    this.getBuyerLocation();
    // if(localStorage.getItem('Usertype') === 'Buyer') {
    //   this._rfqService.isInValidBuyerWarningShown = false;
    // } 
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
  configDatePicker() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    // this.awardMinDate = new Date();
    // this.awardMinDate.setDate(this.awardMinDate.getDate());
  }
  getCertificateList() {
    if (this.irfqViewModel.isSpecialCertificationsByManufacturer === true) {
      this._masterService.getCertificate(null).subscribe(
        result => {
          this.iCertificationViewModelColl = result['data'];
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
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes) {
   // this.getRfqDetails();
  }
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
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
    if((this.rfqId != undefined && this.rfqId !== null) || (this.rfqGuid != null && this.rfqGuid != undefined ) ){
      this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, this.rfqGuid).subscribe(
        result => {
          if (result.result === true) {
            result.preferredMfgLocationIds = this.locationIdsIntToString(result.preferredMfgLocationIds);
            this.irfqViewModel = result;
            this._rfqService.set(this.irfqViewModel.maxDeliveryDate,'maxDeliverDate');
            if( this.irfqViewModel.awardDate!==null) {
              this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
            }
            if( this.irfqViewModel.quotesNeededBy!==null) {
            this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
            }
            if( this.irfqViewModel.deliveryDate!==null) {
              this.irfqViewModel.deliveryDate = moment.utc(this.irfqViewModel.deliveryDate).toDate();
            }
            if (!this.irfqViewModel.payment_term_id || this.irfqViewModel.payment_term_id.toString() === '') {
              this.irfqViewModel.payment_term_id = 2;
            }
            this.loader = false;
            this._rfqService.set(this.irfqViewModel, 'currentRfqDetailModel');
            // localStorage.setItem('Rfqdetails', JSON.stringify(this.irfqViewModel));
            this._rfqService.set(true, 'rfqLoaded');
            this.getPartsList();
            this.formatDataRFQData();
            this.getCertificateList();
            this.getAddress();
          } else if(result.errorMessage === 'InValidBuyer.') {
            console.log('TESTING 2222')
            // if(this._rfqService.isInValidBuyerWarningShown === false) {
              // this._rfqService.isInValidBuyerWarningShown = true;
              // this._toastr.warning('Please login with valid buyer', 'Warning!');
              // this.router.navigate(['dashboard/buyer/default']);
            // } 
          }
        },
        error => {
          this._rfqService.handleError(error);
          this.router.navigateByUrl('/rfq/myrfq');
        },
        () => {}
      );
    }
  }
  cancelClone() {
    this.isCloneModal = false;
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
        this._rfqService.set(this.iPartsViewModelColl, 'iPartsViewModelColl');
        this.loader = false;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
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

  // submitClone() {
  //   this.cloneDeliveryDate = moment.utc(this.cloneDeliveryDate).format('YYYY-MM-DD HH:mm:ss');
  //   this._rfqService.cloneCurrentRFQ(this.cloneRfqName, this.cloneRfqId, this.cloneContactId,this.cloneDeliveryDate).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this.isCloneModal = false;
  //         this._toastr.success(result['errorMessage'], '');
  //       } else {
  //         this._toastr.error(result.errorMessage, 'Error!');
  //         // console.log(result.errorMessage);
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     }
  //   );
  // }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  cancelRfq(id) {
    this.isCencel = true;
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: "Are you sure you want to cancel this RFQ? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to cancel this RFQ?",
      header: 'Move to Draft',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', id, this.loggedId).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], '');
            }
          },
          error => {
            this._rfqService.handleError(error);
          }
        );
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }

  // APi function calls Ends


  // Extra Functions
  cloneRfq(RfqIdT, contactIdT) {
    this.cloneRfqName= '';
    this.cloneDeliveryDate = '';
    this.cloneRfqId = RfqIdT;
    this.isCloneModal = true;
    this.cloneContactId = contactIdT;
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
    // this.getPartsList();
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
  keyByValue(value, arr) {
    const kArray = Object.keys(arr); // Creating array of keys
    const vArray = Object.values(arr); // Creating array of values
    const vIndex = vArray.indexOf(value); // Finding value index
    return kArray[vIndex]; // Returning key by value index
  }
  getMaxdateFromPart() {
    const totPartLen = this.iReviewPartsViewModelColl.length;
    if (totPartLen > 0) {
      const tempPartsviewModelColl = JSON.stringify(this.iReviewPartsViewModelColl);
      const tempPartsviewModelColl1: IPartsViewModel[] = JSON.parse(tempPartsviewModelColl);
      tempPartsviewModelColl1.sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());

      this.maxDeliverDate = new Date(tempPartsviewModelColl1[0].deliveryDate);

    }
  }

  getPartsList() {
    if (this.irfqViewModel !== undefined && this.irfqViewModel.rfqId !== undefined) {
      this._rfqService.getReviewRfqParts(this.irfqViewModel.rfqId, 0, false).subscribe(
        result => {
          this.iReviewPartsViewModelColl = result;
          this.getMaxdateFromPart();
          this.iReviewPartsViewModelColl.forEach(part => {
             part.deliveryDate = moment.utc(part.deliveryDate).toDate();
            // part.deliveryDate = moment(part.deliveryDate).toDate();

          });

          this.loader = false;
        },
        error => {
          this._rfqService.handleError(error);
          this.loader = false;
        },
        () => {}
      );
    } else {
      this.loader = false;
    }

  }

  fillDropDown() {
    // this._masterService.getCategory().subscribe(
    //   (data: ICategory[]) => {
    //     this.iCategoryColl = data;
    //     this.getPartsList();
    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
    // this._rfqService.getParentMaterial().subscribe(
    //   result => {
    //     this.iMaterialViewModelColl = result['data'];
    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
    // this._masterService.getPostProdProcesses().subscribe(
    //   (data: IPostProdProcesses[]) => {
    //     this.iPostProdProcessesColl = data;
    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
    // this._masterService.getQuantityUnit().subscribe(
    //   (data: IQuantityUnit[]) => {
    //     this.iQuantityUnitColl = data;
    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
    // this._masterService.getState('0').subscribe(
    //   // tslint:disable-next-line:no-shadowed-variable
    //   (data2: IRegionModel[]) => {
    //     this.iRegionModel = data2['stateData'];

    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
    // this._masterService.getCountry().subscribe(
    //   // tslint:disable-next-line:no-shadowed-variable
    //   (data2: ICountryViewModel[]) => {
    //     this.iCountryColl =  data2;
    //   },
    //   error => () => {
    //     this._rfqService.handleError(error);
    //   }
    // );
  }

  getManufacturesByRfq() {
    if (this.irfqViewModel.isRegisterSupplierQuoteTheRfq === false) {
      this._rfqService.getManufacturesByRfq(this.rfqId).subscribe(
        result => {
          this.manufactureList = result;
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  getAddress() {
    const isLocalAddress = (localStorage.getItem('addressModel'));
    if (isLocalAddress !== null && isLocalAddress !== 'undefined') {
      this.iContactViewModel2 = JSON.parse(localStorage.getItem('addressModel'));
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
    } else {
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
            // if (fileName) {
            //   const filenNameArray = fileName.split('_S3_');
            //   if (filenNameArray.length === 1) {
            //     fileName = filenNameArray[0];
            //   } else {
            //     fileName = filenNameArray[1];
            //   }
            // }
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

  getOriginalFineName() {

  }

  redirectToEditRfq() {
    let rfqToEdit:any=this.irfqViewModel;
    const encryptedRfqID = this._profileService.encrypt(rfqToEdit.rfqId);
    if (this.isRFQForm2Enabled && rfqToEdit.rfqFormVersion === 2) {
      this.router.navigate(["/rfq/buyer"], { queryParams: { rfqId: encryptedRfqID }}); 
    }else{
      localStorage.setItem('EditRfqId', rfqToEdit.rfqId);
      localStorage.setItem('EditRfqName', rfqToEdit.rfqName);
      this._rfqService.set(rfqToEdit.rfqId, 'editRfqId');
      this._rfqService.set(rfqToEdit.rfqName, 'editRfqName');
        this.router.navigate(['/rfq/editrfq'], { queryParams: { rfqId: encryptedRfqID }}); 
      }
  }

  setRfqDetail(id, Name) {
    this.id = id;
    this.name = Name;

 }

  getQuantityByLeval(partid, leval) {
    const part = this.iReviewPartsViewModelColl.find(m => m.partId === partid);
    const quantity = part.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    if(quantity != undefined && quantity != null) {
      return quantity.partQty;
    } else {
      return '';
    }

  }

  openSidePanel() {
    this.rfqId = this._rfqService.get('rfqId');
    this._rfqService.set(this.irfqViewModel.rfqId, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'transferRfq');
  }
  isSidePanelOpen() {
    return this._rfqService.get('showSidePanel');
  }

  // Extra Utility Function Ends

  showHideRFQPartDetails(id, index) {
    // this.activePart = id;
    // const data = this.iReviewPartsViewModelColl.find(m => m.partId === id);
    // this.iReviewPartsViewModel = data;
    // data.result = !data.result;
    // this.isPartActive = !this.isPartActive;
    this.iReviewPartsViewModelColl[index].result = !this.iReviewPartsViewModelColl[index].result;
  }


  downloadAllFiles(fileCompArray: string[], isDownload: boolean, partfile) {
    fileCompArray.forEach(element => {
      this.downloadS3File(element, isDownload);
    });

    if (partfile !== '') {
      this.downloadS3File(partfile, isDownload);
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
        },
        error => () => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }

  // Extra Functions Ends
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

  cloneModel(id){
    // this.getMaxdateFromPart();
    this.isCloneModel=true;
    this.cloneRfqId=id;
  }

isCloneOpen() {
  this._rfqService.getCloneClose().subscribe(res=>{

    if(res['text']===true){
       this.isCloneModel=false;
       this._rfqService.setCloneClose(false);
    } else {
      this.isCloneModel=false;
     }
    //
  })

}
getRfqPurposeName(){
  let temp = this.rfqPurposeModelList.filter( (x) => x.id == this.irfqViewModel.rfqPurpose );
  if(temp.length){
    return temp[0].value;
  } else {
    return 'N/a';
  }

}
}
