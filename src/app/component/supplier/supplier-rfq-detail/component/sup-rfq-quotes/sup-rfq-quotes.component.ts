import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input
} from '@angular/core';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  IPartLibraryModel
} from '../../../../../core/models/partModel';
import {
  IRFQViewModel,
  IPartsViewModel,
  IManufacturersViewModel,
  IRfqQuoteSupplierQuoteViewModel,
  DownloadAllFilesViewModel,
  IRfqQuoteFilesViewModel,
  IRfqQuoteItemsViewModel,
  ILocalQuotedPart,
  IDeleteQuoteModel,
  ILocalPartQuantity,
  IUploaadedFileName
} from '../../../../../core/models/rfqModel';
import {
  ICategory,
  IPostProdProcesses,
  IMaterial,
  IQuantityUnit,
  ICountryViewModel,
  IRegionModel
} from '../../../../../core/models/globalMaster';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  IContactViewModel,
  IRfqBuyerStatus
} from '../../../../../core/models/accountModel';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Router
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ConfirmationService
} from 'primeng/api';
import * as moment from 'moment';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  environment
} from '../../../../../../environments/environment';
import {
  Http,
  Headers
} from '@angular/http';

import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
const URL = '';
import { uploadFileNDA } from '../../../../../../constants/url-constant';
import { ProductAnalyticService } from '../../../../../../app/shared/product-analytic/product-analytic';
@Component({
  selector: 'app-sup-rfq-quotes',
  templateUrl: './sup-rfq-quotes.component.html',
  styleUrls: ['./sup-rfq-quotes.component.scss'],
  providers: [ConfirmationService]
})
export class SupRfqQuotesComponent implements OnInit, AfterViewInit {
  @Input() rfqId: any;
  showPageDataLoding:boolean=false
  attachmentUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  attachFilesUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'partfiles'
  });
  // variable declaration
  isQuoteModal: boolean;
  importanceOrder: string;
  preferredMfgLocText: string;
  whoPaysForShippingText: string;
  isShippingAvailable: boolean;
  settingPreferenceForm: FormGroup;
  ispreferredMfgLocTextAvailable: boolean;
  isRateFilled: boolean;
  isPartQuoted: boolean;
  isAwardDateError: boolean = false ;
  expDate: any;
  isPartQuotedAvailable: boolean;
  isWarningModel: boolean;
  shippingAddress: any = {
    companyName: '',
    streetAddress: '',
    deptAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };
  // prefNDATypeText: string;
  // isStandardNda = true;
  // customNDAFile: string;

  shippingReviewData: any;
  isMasterFilled: number;
  isDelete: boolean;
  msgs: string;
  defaultAwsPath = '';
  // variable declaration Ends
  // Model Declarations
  irfqViewModel: IRFQViewModel;
  iPartsViewModelColl: IPartsViewModel[];
  iCategoryColl: ICategory[];
  iPostProdProcessesColl: IPostProdProcesses[];
  iMaterialColl: IMaterial[];
  iQuantityUnitColl: IQuantityUnit[];
  iCountryColl: ICountryViewModel[];
  iRegionModel: IRegionModel[];
  manufactureList: IManufacturersViewModel;
  iContactViewModel2: IContactViewModel;
  iReviewPartsViewModelColl: IPartLibraryModel[];
  iReviewPartsViewModel: IPartLibraryModel;
  activePart: number;
  isPartActive: boolean;
  hederPath: string;
  iContactViewModel: IContactViewModel;
  iRfqQuoteSupplierQuoteViewModel: IRfqQuoteSupplierQuoteViewModel;
  iRFQViewModel: IRFQViewModel;
  iRfqBuyerStatus: IRfqBuyerStatus;
  iRfqQuoteFilesViewModel: IRfqQuoteFilesViewModel[];
  iRfqQuoteItemsViewModel: IRfqQuoteItemsViewModel[];
  iAttachUploadedFileName: IUploaadedFileName;
  iAttachUploadedFileNames: string[];
  @ViewChild('messageAttachment',{static:false}) messageAttachment;
  dispalyIndividualGrps: boolean;
  isSidePanel: boolean;
  minDate: Date;
  isbuttonClicked: boolean;
  isFileDownloaded: number;
  isFileDownloaded1: number;
  isNDAaccepted: boolean;
  isQuoteSubmitted: boolean;
  IDeleteQuoteModel: IDeleteQuoteModel;

  attachmentFileName: string;
  quoteMessage: string;
  ILocalQuotedPart: ILocalQuotedPart;
  ILocalPartQuantityColl: ILocalPartQuantity[];
  ILocalPartQuantity: ILocalPartQuantity;
  ILocalQuotedPartColl: ILocalQuotedPart[];
  Downloadallfiles: DownloadAllFilesViewModel;
  temp: string[];
  isWarningMsg: any;
  paymentList: any[];

  isSubmitted: boolean = false;
  accountType: string;
  actionForGrowthPackage: any;
  isAllowRequoting: boolean;
  requoteDate: boolean;
  invalidDate: boolean = false;
  showNDA1Modal: boolean=false;
  showNDA2Modal: boolean=false;
  showNDA2ModalWarning: boolean=false;
  isFileDownloadable: boolean=false;
  isCustomNDA: boolean=false;
  rfqAccess: boolean=null;
  formattedBuyerAddress:string=null;
  constructor(private _rfqService: RfqService, private _profileService: ProfileService, private _fb: FormBuilder,
    private _toastr: ToastrService, private router: Router, private _SupplierService: SupplierService, private _qmsService: QmsService, private productAnalyticService:ProductAnalyticService,
    // tslint:disable-next-line: deprecation
    private confirmationService: ConfirmationService, private _Http: Http) {
    this.dispalyIndividualGrps = true;
    this.isSidePanel = false;
    this.quoteMessage = '';
    this.attachmentFileName = '';
    this.isQuoteModal = false;
    this.ILocalPartQuantityColl = [];
    this.ILocalQuotedPartColl = [];
    this.isMasterFilled = 0;
    this.isbuttonClicked = true;
    this.isPartQuotedAvailable = false;
    this.iAttachUploadedFileNames = [];
    this.ILocalQuotedPartColl = [];
    
    // this.rfqId = this.currentRfqId;

    // this.isShippingAvailable = false;
    this.ispreferredMfgLocTextAvailable = false;
    this.isRateFilled = false;
    localStorage.setItem('rateFilled', 'false');
    this.isDelete = false;
    this.msgs = '';
    this.iReviewPartsViewModelColl = [];
    this.isNDAaccepted = true;
    this.isWarningModel = false;
    // this.ILocalQuotedPartColl = JSON.parse(localStorage.getItem('ILocalQuotedPartColl'));
    this.uploadAttachment();
    this.uploadAttachFile();

    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    }

    this.temp = [];
  }
  initIDeleteQuoteModel() {
    this.IDeleteQuoteModel = {
      contactId: 0,
      rfqId: 0,
      rfqPartId: 0
    };
  }
  initILocalQuotedPart() {
    this.ILocalQuotedPart = {
      partName: '',
      partNumber: '',
      rfqPartId: 0,
      quantityList: [],
      IRfqQuoteItemsViewModel: []
    };
  }
  initILocalPartQuantity() {
    this.ILocalPartQuantity = {
      miscellaneous: 0,
      perUnit: 0,
      quantity: 0,
      shipping: 0,
      tooling: 0
    };
  }
  checkQuantityValidation() {
    return (localStorage.getItem('rateFilled') === 'true');
  }

  uploadAttachment() {
    this.attachmentUploader.onAfterAddingFile = (fileItem) => {
      this.uploadGenAttachementFile(fileItem);
    };
  }

  uploadGenAttachementFile(fileItem: any) {
    const files = this.attachmentUploader.queue;
    const file = fileItem._file;
    this.upload(file).subscribe(res => {
      const resultData = JSON.parse(res['_body']);
      this.attachmentFileName = resultData['fileName'];
    });
  }

  uploadAttachFile() {

    this.attachFilesUploader.onAfterAddingFile = (fileItem) => {
      this.upload(fileItem);
    };
  }
  removeSavedAttachFile(filename, index: any) {
    if (this.iAttachUploadedFileNames) {
      this.iAttachUploadedFileNames.splice(index, 1);
    }
    this._rfqService.removeQuoteAttachment(filename, this.loggedId, this.rfqId).subscribe(
      (data) => {
        if (data['result'] === true) {
          // this.getRfqParts('');
          this._toastr.success(data.errorMessage, 'success!');
        } else {
          this._toastr.success('Quote attachment file removed successfully', 'success!');
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  onFileSelect($event) {
    this.uploadAttachFiles();
    $event.srcElement.value = '';

  }

  uploadAttachFiles() {
    // this.iAttachUploadedFileNames=[];
    const files = this.attachFilesUploader.queue;
    if ((this.attachFilesUploader.queue.length + this.iAttachUploadedFileNames.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!', 'Warning!');
      this.attachFilesUploader.queue = [];
      return;
    }

    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        // ++this.isAttachmentsLoading;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          this.iAttachUploadedFileName.oFileName = fileNameArray[1];
          this.iAttachUploadedFileName.CompleteFileName = fName;

          this.iAttachUploadedFileNames.push(
            this.iAttachUploadedFileName.CompleteFileName
          );
        });
      }
    }
    this.attachFilesUploader.queue = [];
  }
  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }
  // tslint:disable-next-line: deprecation
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }

  setProperDate(d: Date) {
    if (!!d) {
      const abc = new Date(d);
      return new Date(Date.UTC(abc.getFullYear(), abc.getMonth(), abc.getDate()));
    }
  }
  cancelModal() {
    this.isQuoteModal = false;
  }
  removeQuotes(RfqPartId) {
    this.initIDeleteQuoteModel();
    this.IDeleteQuoteModel.rfqId = this.rfqId;
    this.IDeleteQuoteModel.contactId = this.loggedId;
    this.IDeleteQuoteModel.rfqPartId = RfqPartId;
    this._rfqService.RemoveRfqPartQuote(this.IDeleteQuoteModel).subscribe(
      result => {
        if (result['result'] === true) {
          this._toastr.success('Your quote has been removed successfully"', 'Success!');
          this.getOriginalPartsList();
          this.GetSupplierRFQQuoteDetailsOriginal();
          if (this.ILocalQuotedPartColl.length === 0) {
            this.isQuoteModal = false;
          }
        } else {
          this._toastr.error(result['errorMessage'], 'Error!');
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
  }
  ngOnInit() {
    this.accountType= localStorage.getItem('AccountType');
    this.checkRfqStatus();
    this.initModels();
    this.getPaymentTeams();
    this.createPreferenceForm();
    this.initIDeleteQuoteModel();
    this.initILocalQuotedPart();
    this.initILocalPartQuantity();
    this.isFileDownloaded = 0;
    this.isFileDownloaded1 = 0;
    this.getRfqDetails();
    this.getPartsList();
    this.getShippingAddress();
  }
  ngAfterViewInit() {

  }
  initModels() {
    this.iAttachUploadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iRfqBuyerStatus = {
      description: '',
      position: 0,
      rfqBuyerstatusId: 0,
      rfqBuyerstatusLiKey: ''
    };
    this.irfqViewModel = {
      rfqId: 0,
      isAllPartDetailsFilled: null,
      rfqName: '',
      certificateList: [],
      payment_term_id: null,
      contactIdEncrypt: '',
      is_Default_payment_term_id: false,
      certificateIdList: [],
      rfqDescription: '',
      contactId: 0,
      rfqStatus: '',
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
      rfqBuyerStatus: this.iRfqBuyerStatus,
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
      modifiedBy: 0,
      SpecialinviteList: [],
      companyId: 0,
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
      prefRfqCommunicationMethod: 117,
      isStripeSupplier: false,
      isAllowQuoting: false,
      isAwardingEnabled: false
    };
    this.iRfqQuoteFilesViewModel = null;
    this.iRfqQuoteItemsViewModel = null;
    this.iRfqQuoteSupplierQuoteViewModel = {
      rfqQuoteSupplierQuoteId: 0,
      rfqId: this.rfqId,
      isQuoteSubmitted: false,
      attachmentFileName: [],
      messageDesc: '',
      disableSubmitQuote: false,
      contactId: this.loggedId,
      paymentTerms: '',
      isPaytermAccepted: false,
      supplierPayForShipping: false,
      isPartsMadeInUs: false,
      quoteReferenceNumber: '',
      quoteDate: null,
      quoteExpiryDate: null,
      rfqDetails: this.irfqViewModel,
      rfqQuoteFileList: this.iRfqQuoteFilesViewModel,
      mpRfqQuoteItemList: this.iRfqQuoteItemsViewModel,
      errorMessage: '',
      result: true,
      ndaStatus: '',
    };
  }

  createPreferenceForm() {
    let selectedPayment = (this.iRfqQuoteSupplierQuoteViewModel['paymentTerms'] != null && this.iRfqQuoteSupplierQuoteViewModel['paymentTerms'] != undefined && this.iRfqQuoteSupplierQuoteViewModel['paymentTerms'] != '') ? this.iRfqQuoteSupplierQuoteViewModel['paymentTerms'] : 0;
    this.settingPreferenceForm = this._fb.group({
      isPaytermAccepted: [this.iRfqQuoteSupplierQuoteViewModel['isPaytermAccepted']],
      isPartsMadeInUs: [this.iRfqQuoteSupplierQuoteViewModel['isPartsMadeInUs']],
      supplierPayForShipping: [this.iRfqQuoteSupplierQuoteViewModel['supplierPayForShipping']],
      quoteReferenceNumber: [this.iRfqQuoteSupplierQuoteViewModel['quoteReferenceNumber'], Validators.required],
      quoteExpiryDate: [this.iRfqQuoteSupplierQuoteViewModel['quoteExpiryDate']],
      quoteDate: [this.iRfqQuoteSupplierQuoteViewModel['quoteDate']],
      paymentTerm: [selectedPayment],
      quoteMessage: [this.iRfqQuoteSupplierQuoteViewModel['messageDesc']], 
    });

  
  }
  isMrakForQuoting() {
    return this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote;
  }
  showWarning() {
    this._toastr.warning('Rfq Quote Has been submitted already', 'Warning');
  }
  hideShowSubmitRfq() {
    let quotedPartCount = 0;
    if(this.isAllowRequoting){
      return false;
    }
    else{

      const isPartialQuotingAllowed = this._rfqService.get('isPartialQuotingAllowed');
      quotedPartCount = this.iReviewPartsViewModelColl.filter(m => m.isQuoteItemAdded).length;
      if (this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote) {
        const totalPart = this.iReviewPartsViewModelColl.length;
        if (isPartialQuotingAllowed && totalPart === quotedPartCount) {
          return true;
        }
        if (!isPartialQuotingAllowed) {
          if (totalPart !== quotedPartCount) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return false;
      }

    }

  }
hasRfqAccess(){
  if(this.accountType == 'Gold' || this.accountType == 'Platinum'){
    if(this.isPremium() && this.irfqViewModel.isStripeSupplier && this.irfqViewModel.isAllowQuoting){
      return true;
    }
    return false;
  }
  if(this.accountType == 'Starter' || this.accountType == 'Growth Package' || this.accountType == 'Basic'){
    if(this.irfqViewModel.rfqAccess == true){
      return true;
    }
  }
  return false;
}
checkEXpDate(data){
let currDate = new Date;
  // this.quotesNeed = this.settingPreferenceForm.value.quoteExpiryDate;


data.setHours(0, 0, 0, 0)

currDate.setHours(0, 0, 0, 0)

this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = data;
localStorage.setItem('expiryDate',this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate);

  if(data >= currDate){
    this.requoteDate = true;
    this.invalidDate = false;
  }
  else{
    this.requoteDate = false;
    this.invalidDate = true;
    
  }
  
}
  checkIfAllPartQuoted() {
    const totalPart = this.iReviewPartsViewModelColl.length;
    const quotedPartCount = this.iReviewPartsViewModelColl.filter(m => m.isQuoteItemAdded).length;
    if (totalPart !== quotedPartCount) {
      return false;
    } else {
      return true;
    }
  }
  checkValidation() {
    let supplierPayForShipping = false;
    // const isPartsMadeInUs = this.settingPreferenceForm.value.isPartsMadeInUs;
    if (this.irfqViewModel.whoPaysForShipping === 13) {
      supplierPayForShipping = this.settingPreferenceForm.value.supplierPayForShipping;
    } else {
      supplierPayForShipping = true;
    }
    let isQuotingValid = false;
    let quotedPartCount = 0;
    const isPartialQuotingAllowed = this._rfqService.get('isPartialQuotingAllowed');
    quotedPartCount = this.iReviewPartsViewModelColl.filter(m => m.isQuoteItemAdded).length;

    if (isPartialQuotingAllowed && quotedPartCount !== 0) {
      isQuotingValid = true;
    }
    if (!isPartialQuotingAllowed) {
      const totalPart = this.iReviewPartsViewModelColl.length;
      if (totalPart !== quotedPartCount) {
        isQuotingValid = false;
      } else {
        isQuotingValid = true;
      }
    }
    if (this.irfqViewModel.whoPaysForShipping === 13) {
      if (supplierPayForShipping && isQuotingValid) {
        return false;
      } else {
        return true;
      }
    } else {
      if (isQuotingValid) {
        return false;
      } else {
        return true;
      }
    }
  }
  isQuoted() {
    this.isRateFilled = this._rfqService.get('quoteAmountFilled');
    if (this.isRateFilled) {
      this._rfqService.set(false, 'quoteAmountFilled');
      this.getOriginalPartsList();
    }
  }
  getQuantityByLeval(partid, leval) {
    const part = this.iReviewPartsViewModelColl.find(m => m.partId === partid);
    const quantity = part.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    if (quantity != undefined && quantity != null) {
      return quantity.partQty;
    }

  }

  getUnitQty(partId, level, i){
    const partData = this.iReviewPartsViewModelColl[i];
    const partQuantityDetails = partData.rfqPartQuantityList.find(m => m.quantityLevel === level);
    if (partQuantityDetails !== undefined) {
      const data = {
        'unit': this.iReviewPartsViewModelColl[i].partQtyUnitName, 
        'qty': partQuantityDetails.partQty,
      };
      return data;
    }
  }

  getQuantityPrice(partId, leval, i) {
    // const partData = this.iReviewPartsViewModelColl.find(m => m.partId === partId);
    const partData = this.iReviewPartsViewModelColl[i];
    const partQuantitydetails = partData.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    if (partQuantitydetails !== undefined) {
      if (partQuantitydetails.qtyPrice === 0) {
        const data = {
          'value': partQuantitydetails.partQty +' '+this.iReviewPartsViewModelColl[i].partQtyUnitName,
          'isQuoted': false,
          'isAva': true,
          'isAwarded': partQuantitydetails.isAwarded
        };
        return data;
      } else {
        const data = {
          'value': partQuantitydetails.qtyPrice.toFixed(4),
          'isQuoted': true,
          'isAva': true,
          'isAwarded': partQuantitydetails.isAwarded
        };
        return data;
      }
    } else {
      const data = {
        'value': '--',
        'isQuoted': false,
        'isAva': false,
        'isAwarded': false
      };
      return data;
    }
  }
  allQuoteWarning() {
    this._toastr.warning('Please quote all parts', 'Warning.!');

  }
  openQuoteModel() {

    if (this.irfqViewModel.whoPaysForShipping === 13 && this.settingPreferenceForm.value.supplierPayForShipping != true) {
      this._toastr.warning('Please check the "Shipping Terms" checkbox to enable the "Submit Quote" button.', 'Warning.!');
    } else if (!this.isPremium()) {
      // this._toastr.warning('This user is Non-Premium', 'Warning.!');
    } else if (this.irfqViewModel.rfqStatusId == 5 && this.isAllowRequoting && !this.isAwardDateError) {

      this.isQuoteModal = true;
    }
    else if(this.irfqViewModel.rfqStatusId == 5 && this.isAllowRequoting == false && this.isAwardDateError){
       this._toastr.warning('You can not submit this RFQ as it is in Closed status', 'Warning.!');
    }
    else if(!this.isAwardDateError) {
      let companyid = this.loggedCompanyId;
      let loggedInId = this.loggedId;
      this._rfqService.checkIsQuotingRestricted(companyid, this.rfqId, loggedInId).subscribe(res => {
        let isQuotingRestricted = res['data'];
        if (this.isPremium() && this.isNDAaccepted && !isQuotingRestricted) {
          if (this.ILocalQuotedPartColl.length === 0) {
            this._toastr.warning('No quotes added yet', 'Warning.!');
          } else {
            this.isQuoteModal = true;
          }
        } else {
          this.isWarningModel = false;
          this.isWarningMsg = res['messages'][0];
        }
      });
    }

  }
  SetSupplierRFQQuoteDetails() {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.iRfqQuoteSupplierQuoteViewModel.messageDesc = this.settingPreferenceForm.value.quoteMessage;//this.quoteMessage;
      this.iRfqQuoteSupplierQuoteViewModel.attachmentFileName = this.iAttachUploadedFileNames;
      this.iRfqQuoteSupplierQuoteViewModel.rfqId = this.rfqId;
      this.iRfqQuoteSupplierQuoteViewModel.contactId = this.loggedId;
      this.iRfqQuoteSupplierQuoteViewModel.isQuoteSubmitted = true;
      this.iRfqQuoteSupplierQuoteViewModel.isPartsMadeInUs = true;
      this.iRfqQuoteSupplierQuoteViewModel.isPaytermAccepted = true;
      this.iRfqQuoteSupplierQuoteViewModel.supplierPayForShipping = this.settingPreferenceForm.value.supplierPayForShipping;
      this.iRfqQuoteSupplierQuoteViewModel.quoteDate = new Date();
      this.iRfqQuoteSupplierQuoteViewModel.quoteReferenceNumber = this.settingPreferenceForm.value.quoteReferenceNumber;
      this.iRfqQuoteSupplierQuoteViewModel.paymentTerms = (this.settingPreferenceForm.value.paymentTerm != 0) ? this.settingPreferenceForm.value.paymentTerm : '';
      if (!this.settingPreferenceForm.value.quoteExpiryDate) {
        this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = null;
      } 
      else {
        this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = this.settingPreferenceForm.value.quoteExpiryDate;
        // tslint:disable-next-line:max-line-length
        this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = moment.utc(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate).format('YYYY-MM-DD HH:mm:ss');
      }
      this.expDate = this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate;
      this.isAwardDateError = false;
      let currDate = new Date;
      currDate.setHours(0, 0, 0, 0)
      this.expDate= new Date(this.expDate);
      this.expDate.setHours(0, 0, 0, 0)
      if(this.expDate >= currDate){
      this._SupplierService.SetSupplierRFQQuoteDetails(this.iRfqQuoteSupplierQuoteViewModel).subscribe(
        result => {
          if (result['result'] === true) {
            this.GetSupplierRFQQuoteDetailsOriginal();
            this.isQuoteModal = false;
            //  this.iRfqQuoteSupplierQuoteViewModel = result;
            this._toastr.success('Your quote has been submitted successfully"', 'Success!');
            this.isAllowRequoting = false;
            this.isbuttonClicked = false;
            //  this.GetSupplierRFQQuoteDetails();
            // Track Mixpanel Quote Submitted Event
            this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_SUPPLIER_SUBMIT_QUOTE, {
              rfqId:this.rfqId,
            });
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
          this.isSubmitted = false;
        },
        error => {
          this.isSubmitted = false;
          this.handleError(error);
        },
        () => {}
      );
    }else{
      this._toastr.warning('Please Enter Valid Date!', 'Warning!');
      this.expDate = null;
    }
    }
  }
  GetSupplierRFQQuoteDetailsOriginal() {

//commented code is removed as there is no need to set the iRfqQuoteSupplierQuoteViewModel

    const isFromProgress = this._rfqService.get('rfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === 13) {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._SupplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {
        this.iRfqQuoteSupplierQuoteViewModel = result;
        this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel, 'GetSupplierRFQQuoteDetailsData');
        this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote, 'isQuoteSubmitted');
        this.isQuoteSubmitted = this._rfqService.get('isQuoteSubmitted');
        this._SupplierService.set(this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId, 'currentrfqQuoteSupplierQuoteId');
        // if (!this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate) {
          // this.minDate = new Date();
          // this.minDate.setDate(this.minDate.getDate());
        // } else {
        //   this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = moment.utc(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate).toDate();
        //   // this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate =
        //   //   this.setProperDate(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate);
        //   this.iRfqQuoteSupplierQuoteViewModel.quoteDate = this.setProperDate(this.iRfqQuoteSupplierQuoteViewModel.quoteDate);
        //   // this.iRfqQuoteSupplierQuoteViewModel.quoteDate = null;
        // }
        // this.expDate = this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate;
        this.isAwardDateError = false;
        if (this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId === 0) {
          this._rfqService.set(false, 'isMarkForQuoting');
        } else {
          this._rfqService.set(true, 'isMarkForQuoting');
        }
        this.isNDAaccepted = true;



// if( this.iRfqQuoteSupplierQuoteViewModel.quoteReferenceNumber == "" ||  this.iRfqQuoteSupplierQuoteViewModel.quoteReferenceNumber == null){
//   let refNo = (this.settingPreferenceForm.value.quoteReferenceNumber != '') ? this.settingPreferenceForm.value.quoteReferenceNumber : '';
//   this._rfqService.set(refNo, 'quoteReferenceNumber');
// }
        // this.createPreferenceForm();
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
  }
  GetSupplierRFQQuoteDetails() {
    const GetSupplierRFQQuoteDetailsData = this._rfqService.get('GetSupplierRFQQuoteDetailsData');
    if (!!GetSupplierRFQQuoteDetailsData) {
      this.iRfqQuoteSupplierQuoteViewModel = this._rfqService.get('GetSupplierRFQQuoteDetailsData');
      this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote, 'isQuoteSubmitted');
      this.isQuoteSubmitted = this._rfqService.get('isQuoteSubmitted');
      this._SupplierService.set(this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId, 'currentrfqQuoteSupplierQuoteId');
      if (!this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate) {
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate());
      } else {
        this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = moment.utc(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate).toDate();
        this.iRfqQuoteSupplierQuoteViewModel.quoteDate = this.setProperDate(this.iRfqQuoteSupplierQuoteViewModel.quoteDate);
      }
      this.expDate = this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate;
      this.isAwardDateError = false;
      if (this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId === 0) {
        this._rfqService.set(false, 'isMarkForQuoting');
      } else {
        this._rfqService.set(true, 'isMarkForQuoting');
      }
      this.isNDAaccepted = true;
      if (this.isPremium() && this.irfqViewModel.rfqStatusId !== 6) {
        if (!this._rfqService.get('warningShown')) {
          this._rfqService.set(true, 'warningShown');
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
            this.isNDAaccepted = true;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === null && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._toastr.warning('Please accept Nda!!', 'Warning!');
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._toastr.warning('Buyer has not accepted NDA yet!', 'Warning!');
            // tslint:disable-next-line:quotemark
            this._rfqService.set("(Buyer has not accepted NDA yet!)", 'ndaMessage', );
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Declined' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._toastr.warning('NDA for this rfq has been decliend by buyer!!', 'Warning!');
            // tslint:disable-next-line:quotemark
            this._rfqService.set("(NDA for this rfq has been decliend by buyer!!)", 'ndaMessage', );
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
              // tslint:disable-next-line:quotemark
              this._toastr.warning("This RFQ NDA requires buyer's approval!", 'Warning!');
              // tslint:disable-next-line:quotemark
              this._rfqService.set("(This RFQ NDA requires buyer's approval!)", 'ndaMessage', );
          }
        } else {

          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
            this.isNDAaccepted = true;
          }
          if (!this.iRfqQuoteSupplierQuoteViewModel.ndaStatus && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'DECLINED' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
          }
        }
      }
      this.createPreferenceForm();
    } else {
      const isFromProgress = this._rfqService.get('rfqType');
      let IsRfqResubmitted = false;
      if (isFromProgress === 13) {
        IsRfqResubmitted = true;
      } else {
        IsRfqResubmitted = false;
      }
      this._SupplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
        result => {

          this.iRfqQuoteSupplierQuoteViewModel = result;
          this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel, 'GetSupplierRFQQuoteDetailsData');
          this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote, 'isQuoteSubmitted');
          this.isQuoteSubmitted = this._rfqService.get('isQuoteSubmitted');
          this._SupplierService.set(this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId, 'currentrfqQuoteSupplierQuoteId');
        if(this.isAllowRequoting == true){
          this.minDate = new Date();
        } else if(this.isAllowRequoting == false || !this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate){
          
          this.minDate = moment(this.irfqViewModel.quotesNeededBy).add(1, 'days').toDate();
          
        }
        if(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate !== null){
    
          this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = moment.utc(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate).toDate();
        }
        this.expDate = this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate;          
          this.iRfqQuoteSupplierQuoteViewModel.quoteDate = this.setProperDate(this.iRfqQuoteSupplierQuoteViewModel.quoteDate);
         
          this.isAwardDateError = false;
          if (this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId === 0) {
            this._rfqService.set(false, 'isMarkForQuoting');
          } else {
            this._rfqService.set(true, 'isMarkForQuoting');
          }
          this.isNDAaccepted = true;
          if (this.isPremium() && this.irfqViewModel.rfqStatusId !== 6) {
            if (!this._rfqService.get('warningShown')) {
              this._rfqService.set(true, 'warningShown');
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
                this.isNDAaccepted = true;
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === null && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
                this._toastr.warning('Please accept Nda!!', 'Warning!');
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed' && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
                // tslint:disable-next-line:quotemark
                this._toastr.warning("This RFQ NDA requires buyer's approval!", 'Warning!');
                // tslint:disable-next-line:quotemark
                this._rfqService.set("(This RFQ NDA requires buyer's approval!)", 'ndaMessage', );
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Declined' && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
                this._toastr.warning('NDA for this rfq has been decliend by buyer!!', 'Warning!');
                // tslint:disable-next-line:quotemark
                this._rfqService.set("(NDA for this rfq has been decliend by buyer!!)", 'ndaMessage', );
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '' && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
                this._toastr.warning('Buyer has not accepted NDA yet!', 'Warning!');
                // tslint:disable-next-line:quotemark
                this._rfqService.set("(Buyer has not accepted NDA yet!)", 'ndaMessage', );
              }
            } else {

              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
                this.isNDAaccepted = true;
              }
              if (!this.iRfqQuoteSupplierQuoteViewModel.ndaStatus && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed' && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'DECLINED' && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
              }
              if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '' && this.irfqViewModel.prefNdaType === 2) {
                this.isNDAaccepted = false;
              }
            }
          }
          this.createPreferenceForm();

        },
        error => {
          this.handleError(error);
        },
        () => {}
      );
    }
  }
  GetSupplierRFQQuoteDetailsFromQuote() {
    const isFromProgress = localStorage.getItem('CurrentRfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === '13') {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._SupplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {
        this.iRfqQuoteSupplierQuoteViewModel = result;
        this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel, 'GetSupplierRFQQuoteDetailsData');
        this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote, 'isQuoteSubmitted');
        this._SupplierService.set(this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId, 'currentrfqQuoteSupplierQuoteId');

        if(this.isAllowRequoting == true){
          this.minDate = new Date();
          

        } else if(this.isAllowRequoting == false || !this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate){
          
          this.minDate = moment(this.irfqViewModel.quotesNeededBy).add(1, 'days').toDate();

        }
        if(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate !== null){
    
          this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate = moment.utc(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate).toDate();
        }
        this.expDate = this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate;
        this.isAwardDateError = false;
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );

  }
  isMarkForQuoting() {
    return this._rfqService.get('isMarkForQuoting');
  }

  closeWarningPopUp() {
    this.isWarningModel = false;
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  openQuotesTab(id, partId, i, rfqPartStatusId) {
    if(this.accountType === "Starter" || this.accountType === "Growth Package" || this.accountType === "Platinum" || this.accountType === "Gold" ){
      if (this.showNDA2ModalWarning) {
        this._toastr.warning("We are waiting on the Buyer to approve you so you can view the RFQ. Thanks for your patience!", 'Warning!');
  
      } 
      else if((this.actionForGrowthPackage == 'Unlock Rfq Button' || this.irfqViewModel.rfqAccess == null) && this.accountType == 'Growth Package'){
        this._rfqService.set(false, 'showSidePanel');
      }
      else {
        this.showHideRFQPartDetails(partId, i, false);
        if(this.actionForGrowthPackage == 'No Action' || this.actionForGrowthPackage == null || this.irfqViewModel.rfqAccess === true){
          if (rfqPartStatusId == null) {
            let companyid = this.loggedCompanyId;
            let loggedInId = this.loggedId;
            this._rfqService.checkIsQuotingRestricted(companyid, this.rfqId, loggedInId).subscribe(res => {
              let isQuotingRestricted = res['data'];
              if (this.hasRfqAccess() || (this.isPremium() && this.isNDAaccepted && !isQuotingRestricted && this.iReviewPartsViewModelColl[i].isAllowPartQuoting)) {
                this._rfqService.set(this.expDate,'quoteValidUntilDate')
                const data = this.iReviewPartsViewModelColl.find(m => m.rfqPartId === id);
                this._rfqService.set(data.rfqPartQuantityList.length, 'partCount');
                this._rfqService.setisQuoteNowClicked(data.partId.toString());
                this._rfqService.set(data.partId, 'currentQuotePartId');
                this._rfqService.set(data.partName, 'quotePartName');
                this._rfqService.set(data.rfqPartId, 'rfqPartId');
                this._rfqService.set(data.partNumber, 'quotePartNumber');
                this._rfqService.set(data.rfqPartQuantityList, 'quantityData');
                this._rfqService.set(data.rfqPartQuantityList.length, 'partCount');
                this._rfqService.set(true, 'showSidePanel');
                this._rfqService.set(id, 'quotePartId');
                // removed this trigger as it was triggering getcontactbyid api call
                // this._rfqService.setisBuyerNameClicked('true');
                this._rfqService.set(true, 'quoteRfq');
                this._rfqService.set(false, 'messageDrawer');
                this._rfqService.set(false, 'messageThreadDrawer');
                this._rfqService.set(true, 'isPartialQuote');
                let payTerm = (this.settingPreferenceForm.value.paymentTerm != 0) ? this.settingPreferenceForm.value.paymentTerm : '';
                this._rfqService.set(payTerm, 'paymentTerms');
                let refNo = (this.settingPreferenceForm.value.quoteReferenceNumber != '') ? this.settingPreferenceForm.value.quoteReferenceNumber : '';
                this._rfqService.set(refNo, 'quoteReferenceNumber');
                this._rfqService.set(false, 'isBuyerMiniProfile');
                this._rfqService.set(false, 'transferRfq');
                this._rfqService.set(false, 'messageThreadDrawer');
                this._rfqService.set(i, 'partIndex');
              } else {
                if(res['messages'][0].length != 0){
                  this.isWarningModel = true;
                  this.isWarningMsg = res['messages'][0];
                }
              }
    
    
            }, error => {
              this.handleError(error);
            })
    
    
          }
        }  
      }

    }


  }
  isOpen(partId) {
    if (this._rfqService.get('currentQuotePartId') === partId) {
      return true;
    } else {
      return false;
    }
  }

  show2ndNDAWarning() {
    if (this.showNDA2ModalWarning){
      this._toastr.warning("We are waiting on the Buyer to approve you so you can view the RFQ. Thanks for your patience!", 'Warning!');

    }
  }
  markforQuoting(isMarkFor) {
    if (this.showNDA2ModalWarning) {
      this._toastr.warning("We are waiting on the Buyer to approve you so you can view the RFQ. Thanks for your patience!", 'Warning!');

    } else {
      this._SupplierService.SetRFQQuoteSupplierStatus(this.rfqId, this.loggedId, isMarkFor, false).subscribe(
        result => {
          if (result['result'] === true) {
            //  this.iRfqQuoteSupplierQuoteViewModel = result;
            this._toastr.success(result['errorMessage'], 'Success!');
            this.irfqViewModel.isMarkForQuoting = isMarkFor;
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this.handleError(error);
        },
        () => {}
      );
    }
  }
  deleteRfq() {
    this.isDelete = true;
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this RFQ, all data will be permanently removed. Would you like to delete this RFQ?',
      header: 'Delete RFQ',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._SupplierService.SetRFQQuoteSupplierStatus(this.rfqId, this.loggedId, false, true).subscribe(
          result => {
            if (result['result'] === true) {
              //  this.iRfqQuoteSupplierQuoteViewModel = result;
              this._toastr.success(result['errorMessage'], 'Success!');
              this.router.navigate(['/supplier/supplierMyRfq']);
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
          },
          error => {
            this.handleError(error);
          },
          () => {}
        );
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }
  getShippingAddress() {
    this.shippingAddress = this._SupplierService.get('shippingAddress');
    if (this.shippingAddress !== undefined) {
      this.isShippingAvailable = true;
    }
    this.preferredMfgLocText = this._SupplierService.get('preferredMfgLocText');
    if (this.preferredMfgLocText === '') {
      this.ispreferredMfgLocTextAvailable = true;
    }
    this.setAddressFormat(this.shippingAddress);

  }
  // APi function calls
  getRfqDetails() {
    let supplierContactId = 0;
    
    supplierContactId = this.loggedId;
    this.showPageDataLoding=true;
    this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, '').subscribe(
      result => {
      this.showPageDataLoding=false;
        if (result.result === true) {
          this.rfqAccess = result.rfqAccess;
          this.irfqViewModel = result;
          this.isAllowRequoting = result.isAllowRequoting;
          if(this.isAllowRequoting == true){
            this.minDate = new Date();
          } else if(this.isAllowRequoting == false){
           
            this.minDate = moment(this.irfqViewModel.quotesNeededBy).add(1, 'days').toDate();
          }
          this.actionForGrowthPackage = result.actionForGrowthPackage
          localStorage.setItem('isAllowQuoting',this.irfqViewModel.isAllowQuoting.toString());
          this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
          this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();

          this._rfqService.set(this.irfqViewModel.contactIdEncrypt, 'currentRfqConatctId');
          if (!this.irfqViewModel.payment_term_id || this.irfqViewModel.payment_term_id.toString() === '') {
            this.irfqViewModel.payment_term_id = 2;
          }
          this._rfqService.set(this.irfqViewModel.isPartialQuotingAllowed, 'isPartialQuotingAllowed');
          if (this.irfqViewModel.rfqStatusId === 6) {
            this._rfqService.set(true, 'isRfqAwarded');
          } else {
            this._rfqService.set(false, 'isRfqAwarded');
          }
          if (this.irfqViewModel.rfqStatusId !== 2 && this.irfqViewModel.rfqStatusId !== 11 && this.irfqViewModel.rfqStatusId !== 13) {
            this.GetSupplierRFQQuoteDetails();
          }
          // this.GetSupplierRFQQuoteDetails();
          this.getProfileDetails();
        } else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/supplier/ecommerce']);
          // } 
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
    // }
  }
  getRfqDetailsForQuote() {
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
          this.rfqAccess = result.rfqAccess;
          this.irfqViewModel = result;
          this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
          this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
          // this.quotesNeed = this.irfqViewModel.quotesNeededBy;
          this._rfqService.set(this.irfqViewModel.contactIdEncrypt, 'currentRfqConatctId');
          if (!this.irfqViewModel.payment_term_id || this.irfqViewModel.payment_term_id.toString() === '') {
            this.irfqViewModel.payment_term_id = 2;
          }
          this._rfqService.set(this.irfqViewModel.isPartialQuotingAllowed, 'isPartialQuotingAllowed');
          if (this.irfqViewModel.rfqStatusId === 6) {
            this._rfqService.set(true, 'isRfqAwarded');
          } else {
            this._rfqService.set(false, 'isRfqAwarded');
          }
          localStorage.setItem('Rfqdetails', JSON.stringify(this.irfqViewModel));

          if (this.irfqViewModel.rfqStatusId !== 2 && this.irfqViewModel.rfqStatusId !== 11 && this.irfqViewModel.rfqStatusId !== 13) {
            this.GetSupplierRFQQuoteDetailsFromQuote();
          }
        
          // this.getAddress();
          this.getProfileDetails();
        } else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/supplier/ecommerce']);
          // } 
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
    // }
  }


  showHideRFQPartDetails(id, i, checkBy = true) {
    ;

    if (checkBy) {
      this.activePart = id;
      for (let index = 0; this.iReviewPartsViewModelColl.length > index; index++) {
        if (index !== i) {
          this.iReviewPartsViewModelColl[index].result = false;
        }
      }
      this.iReviewPartsViewModelColl[i].result = !this.iReviewPartsViewModelColl[i].result;
      this.isPartActive = !this.isPartActive;
    } else {
      const data2 = this.iReviewPartsViewModelColl.find(m => m.result == true);
      if (data2 !== undefined) {
        data2.result = false;
      }
      this.activePart = id;
      // const data = this.iReviewPartsViewModelColl.find(m => m.partId === id);
      this.iReviewPartsViewModelColl[i].result = true;
    }

  }
  getProfileDetails() {
    // tslint:disable-next-line:max-line-length
    if (this.irfqViewModel.contactIdEncrypt !== null && this.irfqViewModel.contactIdEncrypt !== undefined && this.irfqViewModel.contactIdEncrypt !== '') {
      this._profileService.getProfileDetails(this.irfqViewModel.contactIdEncrypt, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('currentiContactViewModel', JSON.stringify(this.iContactViewModel));
          this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
        },
        error => {
          this.handleError(error);
        },
        () => {}
      );
    }
    // }
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }



  // APi function calls Ends


  // Extra Functions
  getOriginalPartName(fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        return filenNameArray[0];
      }
      return filenNameArray[1];
    }
  }

  openTransferDrawer() {
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'showSidePanel');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'transferRfq');
      window.scrollTo(0, 0);
    }, 100);
  }
  getPartsList() {
    this.ILocalQuotedPartColl = [];
    this.iReviewPartsViewModelColl = [];
    const isFromProgress = this._rfqService.get('rfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === 13) {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._rfqService.getReviewRfqParts(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {
        let data = JSON.stringify(result);
        this.iReviewPartsViewModelColl = JSON.parse(data);
        if(this.iReviewPartsViewModelColl != null && this.iReviewPartsViewModelColl != undefined){
          this.quoteMessage = this.iReviewPartsViewModelColl[0].messageDesc;
        } else{
          this.quoteMessage=null;
        }
       
        if(this.iReviewPartsViewModelColl[0].attachmentFileName.length && this.iReviewPartsViewModelColl[0].attachmentFileName != undefined && this.iReviewPartsViewModelColl[0].attachmentFileName != null && this.iReviewPartsViewModelColl[0].attachmentFileName){
          this.iAttachUploadedFileNames = this.iReviewPartsViewModelColl[0].attachmentFileName;
        }
        this.iReviewPartsViewModelColl.forEach(part => {
          part.deliveryDate = moment.utc(part.deliveryDate).toDate();
        });
        this._rfqService.set(this.iReviewPartsViewModelColl, 'partList');
        if (this.ILocalQuotedPartColl.length != 0) {
          this.ILocalQuotedPartColl = [];
        }
        this.iReviewPartsViewModelColl.forEach(part => {
          if (part.isQuoteItemAdded) {
            this.ILocalQuotedPart.rfqPartId = part.rfqPartId;
            this.ILocalQuotedPart.partName = part.partName;
            this.ILocalQuotedPart.partNumber = part.partNumber;
            part.rfqPartQuantityList.forEach(quantity => {
              this.ILocalPartQuantity.quantity = quantity.partQty;
              this.ILocalPartQuantity.perUnit = quantity.qtyPrice;
              this.ILocalQuotedPart.quantityList.push(this.ILocalPartQuantity);
              this.initILocalPartQuantity();
            });
            this.ILocalQuotedPartColl.push(this.ILocalQuotedPart);
            this.initILocalQuotedPart();
          }
        });
        if (this.ILocalQuotedPartColl.length === 0) {
          this.isQuoteModal = false;
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
    // }
  }

  getOriginalPartsList() {
    this.ILocalQuotedPartColl = [];
    this.iReviewPartsViewModelColl = [];
    const isFromProgress = this._rfqService.get('rfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === 13) {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._rfqService.getReviewRfqParts(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {
        let data = JSON.stringify(result);
        this.iReviewPartsViewModelColl = JSON.parse(data);
        this.iReviewPartsViewModelColl.forEach(part => {
          part.deliveryDate = moment.utc(part.deliveryDate).toDate();
        });

        this._rfqService.set(this.iReviewPartsViewModelColl, 'partList');
        if (this.ILocalQuotedPartColl.length != 0) {
          this.ILocalQuotedPartColl = [];
        }
        this.iReviewPartsViewModelColl.forEach(part => {
          if (part.isQuoteItemAdded) {
            this.ILocalQuotedPart.rfqPartId = part.rfqPartId;
            this.ILocalQuotedPart.partName = part.partName;
            this.ILocalQuotedPart.partNumber = part.partNumber;
            part.rfqPartQuantityList.forEach(quantity => {
              this.ILocalPartQuantity.quantity = quantity.partQty;
              this.ILocalPartQuantity.perUnit = quantity.qtyPrice;
              this.ILocalQuotedPart.quantityList.push(this.ILocalPartQuantity);
              this.initILocalPartQuantity();
            });
            this.ILocalQuotedPartColl.push(this.ILocalQuotedPart);
            this.initILocalQuotedPart();
          }
        });
        if (this.ILocalQuotedPartColl.length === 0) {
          this.isQuoteModal = false;
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
  }


  downloadS3File(fileName: string, isDownload: boolean) {
    if(this.isFileDownloadable ){
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
    }else if(this.showNDA2ModalWarning){
      this.show2ndNDAWarning()
    }
  }

  getOriginalFineName() {

  }

  editRfq(id, Name) {
    localStorage.setItem('fromMyRfqRfqId', id);
    localStorage.setItem('fromMyRfqRfqName', Name);
    this._rfqService.set(id, 'editRfqId');
    this._rfqService.set(Name, 'editRfqName');
    this.router.navigate(['/rfq/editrfq']);
  }


  openSidePanel() {
    this.rfqId = this._rfqService.get('rfqId');
    this._rfqService.set(this.irfqViewModel.rfqId, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'isPartialQuote');
  }
  isSidePanelOpen() {
    return this._rfqService.get('showSidePanel');
  }
  reloadPageOnContactdrawerClose() {
    if (this._SupplierService.get('editpartialquotingDataSaved')) {
      this._SupplierService.set(false, 'editpartialquotingDataSaved');
      this.getRfqDetailsForQuote();
      this.getPartsList();
    }
  }
  downloadAllFiles(fileCompArray: string[], partfile, partId, rfqId, isFileDownloaded) {
    if(this.isFileDownloadable){
      if (isFileDownloaded === 'isFileDownloaded') {
        ++this.isFileDownloaded;
      }
      if (isFileDownloaded === 'isFileDownloaded1') {
        ++this.isFileDownloaded1;
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
        // this.downloadS3File(partfile, isDownload);
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
              // alert('Your device does not support files downloading. Please try again in desktop browser.');
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
  
        } else {
          if (isFileDownloaded === 'isFileDownloaded') {
            --this.isFileDownloaded;
          }
  
          if (isFileDownloaded === 'isFileDownloaded1') {
            --this.isFileDownloaded1;
          }
  
        }
      }, error => {
        if (isFileDownloaded === 'isFileDownloaded') {
          --this.isFileDownloaded;
        }
  
        if (isFileDownloaded === 'isFileDownloaded1') {
          --this.isFileDownloaded1;
        }
  
      })
    }
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
  handleError(error) {
    if (error.status === 0) {
      this._toastr.error('Please check internet connection', 'Error!');
    } else if (error.status === 400) {
      this._toastr.error(JSON.stringify(error.error), 'Error!');
    }
  }


  setAddressFormat( mailingAddressData ) {
    const iContactViewModel = JSON.parse(localStorage.getItem("iContactViewModel"));
    if(((this.irfqViewModel.actionForGrowthPackage == 'Upgrade to Quote'|| this.irfqViewModel.actionForGrowthPackage =="Unlock Rfq Button") && iContactViewModel.accountType =='Growth Package')||iContactViewModel.accountType =='Starter'|| iContactViewModel.accountType == "Basic" || (this.isPremium() && this.irfqViewModel?.isStripeSupplier && !this.irfqViewModel?.isAllowQuoting && iContactViewModel.accountType !='Growth Package'))
{
  let tempAdd: string;
  tempAdd = '';
  if ( this.checkEmpty( mailingAddressData?.state )) {
    tempAdd +=  mailingAddressData?.state + ', ';
  }
  if ( this.checkEmpty( mailingAddressData?.country ) ) {
    tempAdd += '<br />' + mailingAddressData?.country;
  }
} else {
  let tempAdd: string;
  tempAdd = '';
  
  if ( this.checkEmpty(mailingAddressData?.siteLabel) ) {
    tempAdd += mailingAddressData?.siteLabel + ', ';
    tempAdd += '<br />';
  } 
  if ( this.checkEmpty(mailingAddressData?.companyName) ) {
    tempAdd += mailingAddressData?.companyName + ', ';
    tempAdd += '<br />';
  }
  if ( this.checkEmpty(mailingAddressData?.streetAddress) ) {
    tempAdd += mailingAddressData?.streetAddress + ', ';
    
  } else {
    this.formattedBuyerAddress = 'N/A';
    return;
  }
  if ( this.checkEmpty(mailingAddressData?.deptAddress) ) {
    tempAdd += mailingAddressData?.deptAddress + ', ';
   
  }
  // tslint:disable-next-line:max-line-length
  if ( this.checkEmpty( mailingAddressData?.city ) && this.checkEmpty( mailingAddressData?.state ) && this.checkEmpty( mailingAddressData?.postalCode )) {
    tempAdd += '<br />';
  }
  if ( this.checkEmpty( mailingAddressData?.city )) {
    tempAdd +=  mailingAddressData?.city + ', ';
  }
  if ( this.checkEmpty( mailingAddressData?.state )) {
    tempAdd +=  mailingAddressData?.state + ', ';
  }
  if ( this.checkEmpty( mailingAddressData?.postalCode )) {
    tempAdd +=  mailingAddressData?.postalCode;
  }
  if ( this.checkEmpty( mailingAddressData?.country ) ) {
    tempAdd += '<br />' + mailingAddressData?.country;
  }
  if ( this.checkEmpty(tempAdd) ){
    this.formattedBuyerAddress = tempAdd;
  } else {
    this.formattedBuyerAddress = 'N/A';
    return;
  }
} 
  }

  // getAddressFormat(mailingAddressData) {
  //   let tempAdd: string;
  //   tempAdd = '';
  //   if (this.checkEmpty(mailingAddressData.streetAddress)) {
  //     tempAdd += mailingAddressData.streetAddress + ', ';
  //   } else {
  //     return 'N/A';
  //   }
  //   if (this.checkEmpty(mailingAddressData.deptAddress)) {
  //     tempAdd += mailingAddressData.deptAddress + ', ';
  //   }
  //   // tslint:disable-next-line:max-line-length
  //   if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
  //     tempAdd += '<br />';
  //   }
  //   if (this.checkEmpty(mailingAddressData.city)) {
  //     tempAdd += mailingAddressData.city + ', ';
  //   }
  //   if (this.checkEmpty(mailingAddressData.state)) {
  //     tempAdd += mailingAddressData.state + ', ';
  //   }
  //   if (this.checkEmpty(mailingAddressData.postalCode)) {
  //     tempAdd += mailingAddressData.postalCode;
  //   }
  //   if (this.checkEmpty(mailingAddressData.country)) {
  //     tempAdd += '<br />' + mailingAddressData.country;
  //   }
  //   if (this.checkEmpty(tempAdd)) {
  //     return tempAdd;
  //   } else {
  //     return 'N/A';
  //   }
  // }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      if (val.trim() === '') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  getPaymentTeams() {
    this._SupplierService.getPaymentTerms().subscribe(
      response => {
        if (!response.isError) {
          this.paymentList = response.data;
        }
      }
    );
  }
  submitQuote() {
      if(this.isAllowRequoting == false){
// removed this.expDate === null
      if (this.expDate === undefined || this.invalidDate) {
        this.isAwardDateError = true;
        this.requoteDate = false;
      } else {
        this.isAwardDateError = false;
        this.requoteDate = true;
      }
    }
    let currDate = new Date;
    currDate.setHours(0, 0, 0, 0)
    this.expDate= new Date(this.expDate);
    this.expDate.setHours(0, 0, 0, 0)  
    if(this.expDate >= currDate){
      this.isSubmitted = false;
    }else{
      this._toastr.warning('Please Enter Valid Date!', 'Warning!');
      this.expDate = null;
    }
  
    if(this.isAllowRequoting && (this.expDate >= currDate) ){
      this.isAwardDateError = false;
      this.requoteDate = true;
      // this.newVar = false;

    }else if(this.isAllowRequoting && (this.expDate < currDate)){
      this.isAwardDateError = true;
      this.requoteDate = false;
    }
   
  }

  isStl(fileName) {
    return  fileName.toLowerCase().indexOf('.stl') > -1 ||  fileName.toLowerCase().indexOf('.stp') > -1 ||  fileName.toLowerCase().indexOf('.step') > -1 ||  fileName.toLowerCase().indexOf('.sldprt') > -1 ||  fileName.toLowerCase().indexOf('.igs') > -1 ||  fileName.toLowerCase().indexOf('.iges') > -1 ||  fileName.toLowerCase().indexOf('.ipt') > -1 ||  fileName.toLowerCase().indexOf('. x_t') > -1;
  }
  isXlsxFile(fileName) {
   
    return  fileName.toLowerCase().indexOf('.xlsx') > -1 ||  fileName.toLowerCase().indexOf('.png') > -1 ||  fileName.toLowerCase().indexOf('.jpg') > -1 ||  fileName.toLowerCase().indexOf('.pdf') > -1 ||  fileName.toLowerCase().indexOf('.tif') > -1 ||  fileName.toLowerCase().indexOf('.bmp') > -1 ||  fileName.toLowerCase().indexOf('.dxf') > -1 ||  fileName.toLowerCase().indexOf('.dwg') > -1;
  }
   // *** This function will check the rfq nda status ***
   checkRfqStatus(){
    this._rfqService
        .getRfqNdaStatus(this.rfqId,this.loggedId)
        .subscribe(
          (result) => {
            if(result){
              this.showNDA1Modal = result.showNDA1Modal;
              this.showNDA2Modal = result.showNDA2Modal;
              this.showNDA2ModalWarning = result.showNDA2ModalWarning;
              this.isFileDownloadable = result.isFileDownloadable;
              this.isCustomNDA = result.isCustomNDA;
            }
          },
          (error) => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
  }
}
