import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { appConstants } from '../../../../../core/config/constant';
import { IContactViewModel } from '../../../../../core/models/accountModel';
import {
  ICategory,
  ICertificationViewModel,
  ICountryViewModel,
  IMaterial,
  IMaterialViewModel,
  IPostProdProcesses,
  IQuantityUnit,
  IRegionModel
} from '../../../../../core/models/globalMaster';
import { IPartLibraryModel, IRfqPartQuantityViewModel } from '../../../../../core/models/partModel';
import {
  DownloadAllFilesViewModel,
  IManufacturersViewModel,
  IPartsViewModel,
  IRFQViewModel,
  IRfqQuoteSupplierQuoteViewModel,
  ITerritoryClassificationModel,
  PdfModel
} from '../../../../../core/models/rfqModel';
import { IMyAccountViewModel } from '../../../../../core/models/supplierProfileModel';
import { MasterService } from '../../../../../core/services/master/master.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';

import * as moment from 'moment';
import { Subject } from "rxjs";
import {
  environment
} from '../../../../../../environments/environment';
import { BrowserStorageUtil } from '../../../../../shared/browser.storage.util';
import { ProductAnalyticService } from '../../../../../shared/product-analytic/product-analytic';


declare global {
  interface Window {
    rfqStripe: any;
    elements: any;
  }
}
declare var window;
@Component({
  selector: 'app-sup-rfq-detail',
  templateUrl: './sup-rfq-detail.component.html',
  styleUrls: ['./sup-rfq-detail.component.scss'],
  providers: [ConfirmationService]
})
export class SupRfqDetailComponent implements OnInit {
  @Output() changeTab = new EventEmitter();
  @Input() rfqId:any;
  @Input() rfqGuid:any;
  // variable declaration
  importanceOrder: string;
  preferredMfgLocText: string;
  whoPaysForShippingText: string;
  isLoader: boolean;
  ndaMessage: string;
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
  // rfqId: number;
  isDelete: boolean;
  msgs: string;
  CertificationselectedItems = [];
  shippingReviewData: any;
  isMasterFilled: number;
  defaultAwsPath = '';
  ITerritoryClassificationModelColl: ITerritoryClassificationModel[];
  iMyAccountViewModel: IMyAccountViewModel;
  isUpgradeBtn: boolean;
  isAccountUpgradereqSent1: boolean;
  // isPaidContract: string;
  accountUpgradeMessage: string;
  // variable declaration Ends
  iMaterialViewModelColl: IMaterialViewModel[];

  // Model Declarations
  irfqViewModel: IRFQViewModel;
  PdfModel: PdfModel;
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
  IRfqPartQuantityViewModel: IRfqPartQuantityViewModel[];
  activePart: number;
  defaultPath = 'assets/';
  isPartActive: boolean;
  hederPath: string;
  totalApi: number;
  iContactViewModel: IContactViewModel;
  isFileDownloaded: number;
  isFileDownloaded1: number;
  isFileDownloaded2: number;
  iRfqQuoteSupplierQuoteViewModel: IRfqQuoteSupplierQuoteViewModel;
  iCertificationViewModelColl: ICertificationViewModel[];
  isNDAaccepted: boolean;
  buyerYetToAccept : boolean;
  idRfq: number;
  icontactAdd = false;
  Downloadallfiles : DownloadAllFilesViewModel;
  temp: string[];
  preferredCommunicationArray: string[] = [];
  showUpgradeAccountModal: boolean;
  toShowContactModel:boolean=false;
  rfqPurposeModelList: any = [];
  is2ndLevelNda:boolean=false;
  accountTypeuser: string;
  actionForGrowthPackage: any;
  rfdIdToSet: any;
  isAllowRequoting: boolean;
  // Model Declarations Ends
  showNDA1Modal: boolean=false;
  showNDA2Modal: boolean=false;
  showNDA2ModalWarning: boolean=false;
  isFileDownloadable: boolean=false;
  isCustomNDA: boolean=false;
  showRfqPurchasePaymentModal?:boolean;
  rfqPrice?:number;
  stripeElementMounted?:boolean;
  growthRfqCount?:number;
  unlockRfqCountDefaultValue:number=1;
  rfqAccess?:boolean=null;
  formattedBuyerAddress:string=null;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  userDetailsLocation: string;
  responseData: any;
  isRFQForm2Enabled:boolean=false;
  changeColor: boolean = false ;
  hideAwardToMfg: boolean = false;
  constructor(private _rfqService: RfqService, private _masterService: MasterService,
    private _profileService: ProfileService, private _supplierService: SupplierService,
    private _toastr: ToastrService, private router: Router, private _Http: Http,
    private confirmationService: ConfirmationService,
    private productAnalyticService:ProductAnalyticService) {
      this.temp=[];
    this.isMasterFilled = 0;
    this.hederPath = this.defaultPath + 'company/avatar-manu-basic.svg';
    this.isLoader = true;
    this.totalApi = 0;
    this.isDelete = false;
    this.isNDAaccepted = false;
    this.ndaMessage = '';
    this.msgs = '';
    this.PdfModel = {
    htmlRFQdetails: '',
    pageURL: '',
    rfqId: ''
    };


    if (this._rfqService.get('isQuoteSubmitted') !== false) {
      this._rfqService.set(true, 'isQuoteSubmitted');
    }
  }

  ngOnInit() {
    this._profileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      this.isRFQForm2Enabled=rfqForm2Enabled;
    });
    this.accountTypeuser = localStorage.getItem('AccountType');
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
    this.checkAccountType()
    this.checkRfqStatus();
    this.iReviewPartsViewModel = {
      partId: 0,
      partName: '',
      partNumber: '',
      partCommodityCode: '',
      partDescription: '',
      materialId: 0,
      partQtyUnitId: 0,
      partCategoryId: 0,
      statusId: 0,
      companyId: 0,
      contactId: 0,
      currencyId:0,
      creationDate: '',
      modificationDate: '',
      rfqId: 0,
      postProductionProcessId: 0,
      rfqPartQuantityList: this.IRfqPartQuantityViewModel,
      deliveryDate: '',
      partsFiles: [],
      rfqPartFile: '',
      errorMessage: '',
      result: true,
      primaryPartFile: '',
      partQtyUnitName: '',
      categoryName: '',
      materialName: '',
      postProductionProcessName: '',
      rfqPartId: 0,
      isActive: true,
      isArchived: true,
      isAwarded: true,
      isQuoted: true,
      isQuoteInProgress: true,
      isQuoteItemAdded: true,
      rfqPartTotalQuotedCount: 0,
      customPartDescription: '',
      attachmentFileName:[],
      messageDesc: '',
      isAllowPartQuoting:false
    }
        this.iRfqQuoteSupplierQuoteViewModel = {
          rfqQuoteSupplierQuoteId: 0,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          attachmentFileName: [],
          messageDesc: '',
          disableSubmitQuote: false,
          isQuoteSubmitted: false,
          paymentTerms: '',
          isPaytermAccepted: false,
          supplierPayForShipping: false,
          isPartsMadeInUs: false,
          quoteReferenceNumber: '',
          quoteDate: new Date,
          quoteExpiryDate: new Date,
          rfqDetails: null,
          rfqQuoteFileList: null,
          mpRfqQuoteItemList: null,
          errorMessage: '',
          result: true,
          ndaStatus: '',
        };
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

        this.Downloadallfiles = {
          filename: [],
          rfQ_Id: 0,
          part_id: 0

        }
    this.preferredCommunicationArray[117] = 'Call';
    this.preferredCommunicationArray[118] = 'Message';
    this.preferredCommunicationArray[119] = 'Email';
    this.preferredCommunicationArray[120] = 'Call or Email';
    this.isFileDownloaded = 0;
    this.isFileDownloaded1= 0;
    this.isFileDownloaded2= 0;
    this.showUpgradeAccountModal = false;
    this.stripeElementMounted = false;
    this.showRfqPurchasePaymentModal = false;
    this.getBuyerLocation();
    this.getRfqDetails();
    this.checkRfqCounts();
  }
  setShowRfqPurchasePaymentModal(payload){
    this.showRfqPurchasePaymentModal = payload;
    this.pushRfqDataForMixpanel(this.productAnalyticService.MPE_ALC_PURCHASE_NOW_BUTTON);
  }
  mountStripePaymentElement(){
    //Post to backend, get new payment intent clientSecret
    let input = { rfq_id : this.rfqId, supplier_id : parseInt(localStorage.getItem('loggedCompanyId')),SupplierContactId:this.loggedId,payor_email:localStorage.getItem('User2')};
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    let self = this;
    const url = environment.APIEndPoint + 'RFQ/GetRfqPaymentIntent';
    let call = this._Http.post(url, input, {
      headers: headers
    }).subscribe( (response) => {
      //use clientSecret to mount stripe element
      let output = JSON.parse(response['_body']);
      const clientSecret = output.data.client_secret;
      (window as any).rfqStripe = Stripe(environment.stripePk);
      const appearance = { /* appearance */ };
      const options = {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
        }
      };
      (window as any).elements = window.rfqStripe.elements({ clientSecret, appearance });
      const paymentElement = elements.create('payment', options);
      paymentElement.mount('#payment-element');
      self.stripeElementMounted = true;
    });

  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }
  async submitRfqPayment(e) {
    e.preventDefault();
    // setLoading(true);
    let elements = window.elements;
    window.rfqStripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: localStorage.getItem('User2'),
      },
      redirect: 'if_required'
    }).then( response => {
      let amount = response.paymentIntent.amount / 100;
      let input = {
        rfq_id : this.rfqId,
        supplier_id : parseInt(localStorage.getItem('loggedCompanyId')),
        amount : amount.toFixed(2),
        payment_intent_id: response.paymentIntent.id,
      };
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      let self = this;
      const url = environment.APIEndPoint + 'RFQ/ConfirmRfqPayment';
      let call = this._Http.post(url, input, { headers: headers })
        .subscribe( (response) => {
          
          this.pushRfqDataForMixpanel(this.productAnalyticService.MPE_ALC_PURCHASE_SUCCESS);
          self.getRfqDetails();
          let target = document.getElementById('unlockRfqModal');
          target.click();
          let target1 = document.getElementById('showThankYouModal');
          target1.click();
        });
    });
  }
  showMeViewModel(){
    console.log(this.irfqViewModel)
  }
  hasRfqAccess(){
    if(this.accountTypeuser == 'Gold' || this.accountTypeuser == 'Platinum'){
      if(this.isPremium() && this.irfqViewModel.isStripeSupplier && this.irfqViewModel.isAllowQuoting){
        return true;
      }
      return false;
    }
    if(this.accountTypeuser == 'Starter' || this.accountTypeuser == 'Growth Package' || this.accountTypeuser == 'Basic'){
      if(this.irfqViewModel.rfqAccess == true){
        return true;
      }
    }
    return false;
  }
  hasGrowthUnlocks(){
    if(this.accountTypeuser == 'Growth Package' && this.growthRfqCount > 0){
      return true;
    }
    return false;
  }
  canPurchaseRfqAccess(){
    //Disclude APAC / Gold / Platinum
    if(this.userDetailsLocation == 'Asia' || this.accountTypeuser == 'Gold' || this.accountTypeuser == 'Platinum' || this.accountTypeuser == 'Basic'){
      return false;
    }
    //If starter or growth and 0 growth unlocks
    if(this.accountTypeuser == 'Starter' || this.accountTypeuser == 'Growth Package'){
      if(this.irfqViewModel.rfqPrice == null){
        return false;
      }
      if(this.irfqViewModel.prefNdaType == 2){
        return false;
      }
      if(this.irfqViewModel.rfqAccess == true){
        return false;
      }
      //has price and 1st level nda
      return true;
    }
    //Default false
    return false;
  }
  showUpgradeOffer(){
    //Default false
    let responseValue = false;
    if(this.accountTypeuser == 'Gold' || this.accountTypeuser == 'Platinum'){
      if(this.isPremium() && this.irfqViewModel.isStripeSupplier && !this.irfqViewModel.isAllowQuoting){
        return true;
      }
    }

    if(this.userDetailsLocation == 'Asia'){
      return false;
    }

    if(this.accountTypeuser == 'Basic'){
      responseValue = true;
    }

    if(this.accountTypeuser == 'Starter' || this.accountTypeuser == 'Growth Package'){

      if(this.irfqViewModel.rfqPrice == null){
        responseValue = true;
      }
      if(this.irfqViewModel.prefNdaType == 2){
        responseValue = true;
      }
      if(this.irfqViewModel.rfqAccess == true){
        responseValue = false;
      }
    }

    return responseValue;
  }
  showApacUpgrade(){
    if(!this.isPremium() && this.userDetailsLocation =='Asia'){
      return true;
    }
    //Default false
    return false;
  }
  reloadAfterPurchase(){
    window.location.reload();
  }
  showBuyerProfile(id) {
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'rfqDetailDrawer');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMiniProfile');
      this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'nameOfBuyer');
      this._rfqService.set(this.rfqId, 'selectContactRFQId');
      this._rfqService.set(this.rfqId, 'accountRFQId');
      this._rfqService.set(this.iContactViewModel.contactIdEncrypt, 'buyerProfileId');
    }, 100);
  }
  openTransferDrawer() {
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'showSidePanel');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'transferRfq');
      window.scrollTo(0, 0);
    }, 100);
  }


  getNdaMesssage () {
    this._rfqService.get('ndaMessage');
  }
  checkRfqCounts() {
    this._supplierService.getTileAvailability(this.loggedId, this.loggedCompanyId).subscribe(
      (result) => {
        if (result && result.length>0) {
          result=result[0];
          this.growthRfqCount = result.unlockRfqCount;
          this.unlockRfqCountDefaultValue=result.unlockRfqCountDefaultValue
        }
      }
    );
  }
  GetSupplierRFQQuoteDetails() {
    const isFromProgress =  localStorage.getItem('CurrentRfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === '13') {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._supplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {

        this.iRfqQuoteSupplierQuoteViewModel = result;
       
        this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel, 'GetSupplierRFQQuoteDetailsData');
        this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel.disableSubmitQuote, 'isQuoteSubmitted');
        if (this.isPremium() && this.irfqViewModel.rfqStatusId !== 6)  {
        if (!this._rfqService.get('warningShown')) {
             this._rfqService.set(true, 'warningShown');
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
            this.isNDAaccepted = true;
            this._rfqService.set(true, 'isNDAaccepted');
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === null && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
            this._toastr.warning('Please accept Nda!!', 'Warning!');
            this._rfqService.set("(This RFQ NDA requires buyer's approval!)", 'ndaMessage', );
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed' && this.irfqViewModel.prefNdaType === 2 && this.accountTypeuser === "Growth Package") {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
            this.isNda()
            this.buyerYetToAccept = true;
            this._rfqService.set('Buyer has not accepted NDA yet!', 'ndaMessage', );

          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'DECLINED' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
            this.ndaMessage = "This RFQ NDA requires buyer's approval!";
            this._rfqService.set("(NDA for this rfq has been decliend by buyer!!)", 'ndaMessage', );
            this._toastr.warning('NDA for this rfq has been decliend by buyer!!', 'Warning!');
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
             this._toastr.warning("This RFQ NDA requires buyer's approval!", 'Warning!');
             this._rfqService.set("(This RFQ NDA requires buyer's approval!)", 'ndaMessage', );         
          }
        } else {
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'ACCEPTED') {
            this.isNDAaccepted = true;
            this._rfqService.set(true, 'isNDAaccepted');
          }
          if (!this.iRfqQuoteSupplierQuoteViewModel.ndaStatus && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'Viewed' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === 'DECLINED' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
          }
          if (this.iRfqQuoteSupplierQuoteViewModel.ndaStatus === '' && this.irfqViewModel.prefNdaType === 2) {
            this.isNDAaccepted = false;
            this._rfqService.set(false, 'isNDAaccepted');
          }
        }
      } else {
        if(this.irfqViewModel.rfqStatusId === 6) {
          this._rfqService.set(true, 'isNDAaccepted');
        }

      }
      });
  }


  show2ndNDAWarning() {
    if(this.showNDA2ModalWarning){
      this._toastr.warning("We are waiting on the Buyer to approve you so you can view the RFQ. Thanks for your patience!", 'Warning!');
    }
  }

  markforQuoting(isMarkFor) {
      this._supplierService.SetRFQQuoteSupplierStatus(this.rfqId, this.loggedId, isMarkFor, false).subscribe(
        result => {
          if (result['result'] === true) {
            this._toastr.success(result['errorMessage'], 'Success!');
            this.irfqViewModel.isMarkForQuoting=isMarkFor;
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );

  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  deleteRfq() {
    this.isDelete = true;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this RFQ, all data will be permanently removed. Would you like to delete this RFQ?',
      header: 'Delete RFQ',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._supplierService.SetRFQQuoteSupplierStatus(this.rfqId, this.loggedId, false, true).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], 'Success!');
              this.router.navigate(['/supplier/supplierMyRfq']);
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      },
      reject: () => {
      }
    });
  }

  ngOnDestroy() {
    this._rfqService.set(false, 'showSidePanel');
    localStorage.removeItem('Rfqdetails');
    this._rfqService.set(null, 'partList');
    this._rfqService.set(null, 'getManufacturesByRfqData');
    this._rfqService.set(null, 'GetSupplierRFQQuoteDetailsData');
  }
  getRfqDetails() {
      let supplierContactId = 0;
      supplierContactId = this.loggedId;
      if ( this.rfqGuid !== undefined && this.rfqGuid !== null && this.rfqGuid !== '') {
        this._rfqService.getRFQExtraDetails(0, supplierContactId, this.rfqGuid).subscribe(
          result => {
            if (result.result === true) {
              this.rfqPrice = result.rfqPrice;
              this.rfqAccess = result.rfqAccess;
              this.isAllowRequoting = result.isAllowRequoting;
              result.preferredMfgLocationIds = this.locationIdsIntToString(result.preferredMfgLocationIds);
              this.irfqViewModel = result;
              this.checknotAwardedJob(this.irfqViewModel);           
              this.actionForGrowthPackage = result.actionForGrowthPackage
              this.rfqId = this.irfqViewModel.rfqId;
              localStorage.setItem('suppCurrentRfqName', this.irfqViewModel.rfqName);
              localStorage.setItem('suppCurrentRfqDate', this.irfqViewModel.rfqCreatedOn);
              this._rfqService.set(this.irfqViewModel.contactIdEncrypt, 'currentRfqConatctId');
              this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
              this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
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
              this.isLoader = false;
              this.getPartsList();
              this.formatDataRFQData();
              this.getAddress();
              this.getProfileDetails();
              if(this.irfqViewModel.rfqStatusId !== 2 && this.irfqViewModel.rfqStatusId !== 11 && this.irfqViewModel.rfqStatusId !== 13) {
                this.GetSupplierRFQQuoteDetails();
              }

              this.totalApi = this.totalApi + 1;
              if (this.totalApi === 5) {
                this.isLoader = false;
              }
            } else if(result.errorMessage === 'InValidBuyer.') {
              this.isLoader = false;
              this._toastr.warning('Please login with valid buyer', 'Warning!');
              this.router.navigate(['dashboard/supplier/ecommerce']);
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
      if (this.rfqId !== 0 && !isNaN(this.rfqId) && this.rfqId !== undefined) {
        this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, '').subscribe(
          result => {
            if (result.result === true) {
              this.rfqPrice = result.rfqPrice;
              this.rfqAccess = result.rfqAccess;
              this.isAllowRequoting = result.isAllowRequoting;
              result.preferredMfgLocationIds = this.locationIdsIntToString(result.preferredMfgLocationIds);
              this.irfqViewModel = result;
              this.checknotAwardedJob(this.irfqViewModel);
              this.actionForGrowthPackage = result.actionForGrowthPackage
              localStorage.setItem('suppCurrentRfqName', this.irfqViewModel.rfqName);
              localStorage.setItem('suppCurrentRfqDate', this.irfqViewModel.rfqCreatedOn);
              this._rfqService.set(this.irfqViewModel.contactIdEncrypt, 'currentRfqConatctId');
              this._rfqService.setisCurrentRfqLoaded('true');
              this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
              this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
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
              this.isLoader = false;
              this.getPartsList();
              this.formatDataRFQData();
              this.getAddress();
              this.getProfileDetails();
              this.GetSupplierRFQQuoteDetails();
              this.totalApi = this.totalApi + 1;
              if (this.totalApi === 5) {
                this.isLoader = false;
              }
            } else if(result.errorMessage === 'InValidBuyer.') {
              this.isLoader = false;
                this._toastr.warning('Please login with valid buyer', 'Warning!');
                this.router.navigate(['dashboard/supplier/ecommerce']);
            } else {
              this.isLoader = false;
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );

      }

      // }
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
  showHideRFQPartDetails(event,id,i) {
    event.stopPropagation();
    this.activePart = id;
    this.iReviewPartsViewModelColl[i].result = !this.iReviewPartsViewModelColl[i].result;
    this.isPartActive = !this.isPartActive;
  }
  getProfileDetails() {
      this._profileService.getProfileDetails(this.irfqViewModel.contactIdEncrypt,this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          this.icontactAdd = true;
          localStorage.setItem('currentiContactViewModel', JSON.stringify(this.iContactViewModel));
          if (!!this.iContactViewModel.contactPictureFile && this.iContactViewModel.contactPictureFile !== '') {
            this.hederPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
          } else {
            this.hederPath = '';
          }
          this.totalApi = this.totalApi + 1;
          if (this.totalApi === 5) {
            this.isLoader = false;
          }
        },
        error => {
          this._rfqService.handleError(error);
         },
        () => { }
      );
  }
  isMarkForQuoting() {
    return this._rfqService.get('isMarkForQuoting');
  }
  getRfqParts() {
    this._rfqService.getRfqParts(this.rfqId).subscribe(
      result => {
        this.iPartsViewModelColl = result;
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
    if (quantity !== undefined && quantity != null) {
      return quantity.partQty;
    } else {
      return '--';
    }

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
      () => { }
    );
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

  formatDataRFQData() {
    this.importanceOrder = this.getSortedOrderOfImportance();
    this.preferredMfgLocText = this.getPreferredMfgLoc();
    this._supplierService.set(this.preferredMfgLocText, 'preferredMfgLocText');
    this.whoPaysForShippingText = this.keyByValue(this.irfqViewModel.whoPaysForShipping, appConstants.paysForShippingCode);
    this.prefNDATypeText = this.keyByValue(this.irfqViewModel.ndaTypekey, appConstants.NDAType);

    if (this.isMasterFilled === 3) {
      this.getPartsList();
    }

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

  keyByValue(value, arr) {
    const kArray = Object.keys(arr);        // Creating array of keys
    const vArray = Object.values(arr);      // Creating array of values
    const vIndex = vArray.indexOf(value);         // Finding value index
    return kArray[vIndex];                      // Returning key by value index
  }
  isMrakForQuoting() {
    return this._rfqService.get('isQuoteSubmitted');
  }
  getQuantityPrice(partId, leval,i) {
    const partData = this.iReviewPartsViewModelColl[i];
    const partQuantitydetails = partData.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    if (partQuantitydetails !== undefined) {
      if (partQuantitydetails.qtyPrice === 0) {
        if (partQuantitydetails.isAwarded) {
          const data = {'value': partQuantitydetails.partQty +' '+this.iReviewPartsViewModelColl[i].partQtyUnitName, 'isQuoted': false, 'isAva': true, 'isAwarded': partQuantitydetails.isAwarded};
          return data;
        } else {
          const data = {'value': partQuantitydetails.partQty+' '+this.iReviewPartsViewModelColl[i].partQtyUnitName, 'isQuoted': false, 'isAva': true, 'isAwarded': partQuantitydetails.isAwarded};
          return data;
        }
      } else {
        const data = {'value': partQuantitydetails.qtyPrice.toFixed(4),
         'isQuoted': true, 'isAva': true, 'isAwarded': partQuantitydetails.isAwarded};
        return data;
      }
    } else {
      const data = {'value': '--', 'isQuoted': false, 'isAva': false, 'isAwarded': false};
      return data;
    }
  }
  openQuoteTab() {
    this._rfqService.set(true, 'isFromFakeButton');
  }
  getPartsList() {
      const isFromProgress = this._rfqService.get('rfqType');
      let IsRfqResubmitted = false;
      if (isFromProgress === 13) {
        IsRfqResubmitted = true;
      } else {
        IsRfqResubmitted = false;
      }
      if(this.rfqId != undefined && this.rfqId != null ){
    this._rfqService.getReviewRfqParts(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {
        this.iReviewPartsViewModelColl = result;
        this.iReviewPartsViewModelColl.forEach(part => {
          part.deliveryDate =  moment.utc( part.deliveryDate).toDate();
        });
        this._rfqService.set(this.iReviewPartsViewModelColl, 'partList');
        this.totalApi = this.totalApi + 1;
        if (this.totalApi === 5) {
          this.isLoader = false;
        }
        this.isLoader = false;
      },
      error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
      },
      () => { }
    );
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

  getPdf() {
    return  this._rfqService.get('isPdf');
  }
  fillDropDown() {
    this._masterService.getCategory().subscribe(
      (data: ICategory[]) => {
        this.iCategoryColl = data;
        this.isMasterFilled = this.isMasterFilled + 1;
        if (this.isMasterFilled === 3) {
          this.getPartsList();
        }

      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._rfqService.getParentMaterial().subscribe(
      result => {
        this.iMaterialViewModelColl = result['data'];
        this.isMasterFilled = this.isMasterFilled + 1;
        if (this.isMasterFilled === 3) {
          this.getPartsList();
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._masterService.getPostProdProcesses().subscribe(
      (data: IPostProdProcesses[]) => {
        this.iPostProdProcessesColl = data;
        this.isMasterFilled = this.isMasterFilled + 1;
        if (this.isMasterFilled === 3) {
          this.getPartsList();
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._masterService.getQuantityUnit().subscribe(
      (data: IQuantityUnit[]) => {
        this.iQuantityUnitColl = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._masterService.getState('0').subscribe(
      (data2: IRegionModel[]) => {
        this.iRegionModel = data2['stateData'];

      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._masterService.getCountry().subscribe(
      (data2: ICountryViewModel[]) => {
        this.iCountryColl = data2;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  reloadPageOnContactdrawerClose() {
    if (this._supplierService.get('editpartialquotingDataSavedforDetail')) {
      this._supplierService.set(false, 'editpartialquotingDataSavedforDetail');
      this.getRfqDetails();
      this.getPartsList();
    }
  }
  getManufacturesByRfq() {
    if (this.irfqViewModel.isRegisterSupplierQuoteTheRfq === false) {
      const getManufacturesByRfqData = this._rfqService.get('getManufacturesByRfqData');
      if (!!getManufacturesByRfqData) {
        this.manufactureList = this._rfqService.get('getManufacturesByRfqData');
      } else {
        this._rfqService.getManufacturesByRfq(this.irfqViewModel.rfqId).subscribe(
          result => {
            this.manufactureList = result;
            this._rfqService.set(this.manufactureList, 'getManufacturesByRfqData');
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
    }
  }

  GenerateRFQdetailsPDF() {

    const data = document.getElementById('contentToConvert').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlRFQdetails = newdata;
    this.PdfModel.rfqId = this.rfqId.toString();
    this._rfqService.GenerateRFQdetailsPDF(this.PdfModel).subscribe(
      result => {
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  downloadFile(x: any) {
    var newBlob = new Blob([x], {type: 'application/pdf'});
    var downloadURL = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.click();
  }

  getAddress() {
    const id = this.loggedId;
      this._profileService.getAddress(this.irfqViewModel.contactId).subscribe(
        (data: IContactViewModel) => {
          this.totalApi = this.totalApi + 1;
          if (this.totalApi === 5) {
            this.isLoader = false;
          }
          this.iContactViewModel2 = data;
          localStorage.setItem('CurrentRfqAddress', JSON.stringify(this.iContactViewModel2));
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
                this._supplierService.set(this.shippingAddress, 'shippingAddress');
              }
            }
          }
          this.setAddressFormat(this.shippingAddress);
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
  }

  downloadS3File(fileName: string, isDownload: boolean) {
    if (this.isFileDownloadable  ){
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
    this._rfqService.set(true, 'transferRfq');
  }
  isSidePanelOpen() {
    return this._rfqService.get('showSidePanel');
  }
  downloadAllFiles(fileCompArray: string[], partfile , partId,rfqId,isFileDownloaded) {

    if(this.isFileDownloadable){
      if(isFileDownloaded === 'isFileDownloaded') {
        ++this.isFileDownloaded;
      }
      if(isFileDownloaded === 'isFileDownloaded1') {
        ++this.isFileDownloaded1;
      }
      if(isFileDownloaded === 'isFileDownloaded2') {
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
     this.Downloadallfiles.rfQ_Id= rfqId;
  
      this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response=>{
        if (response.result === true) {
          const resData = response.data;
          const filelink = resData.privateFileFileName;
          if (filelink) {
            if (/(iP)/g.test(navigator.userAgent)) {
              window.open(filelink, '_blank');
            }
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
          if(isFileDownloaded === 'isFileDownloaded') {
            --this.isFileDownloaded;
          }
  
          if(isFileDownloaded === 'isFileDownloaded1') {
            --this.isFileDownloaded1;
          }
  
            if(isFileDownloaded === 'isFileDownloaded2') {
            --this.isFileDownloaded2;
          }
         } else {
          if(isFileDownloaded === 'isFileDownloaded') {
            --this.isFileDownloaded;
          }
  
          if(isFileDownloaded === 'isFileDownloaded1') {
            --this.isFileDownloaded1;
          }
  
            if(isFileDownloaded === 'isFileDownloaded2') {
            --this.isFileDownloaded2;
          }
        }
      }, error =>{
        if(isFileDownloaded === 'isFileDownloaded') {
          --this.isFileDownloaded;
        }
  
        if(isFileDownloaded === 'isFileDownloaded1') {
          --this.isFileDownloaded1;
        }
  
          if(isFileDownloaded === 'isFileDownloaded2') {
          --this.isFileDownloaded2;
        }
      })
    }
  }


  gotoQuotetab() {
    if(this.showNDA2ModalWarning){
      this._toastr.warning("We are waiting on the Buyer to approve you so you can view the RFQ. Thanks for your patience!", 'Warning!');

    } else {
      this.changeTab.emit();
    }

  }
  // Extra Utility Function Ends
  // Extra Functions Ends
  isPremium() {
    let IsPremiumEncrypt= localStorage.getItem('IsPremium');
   let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
   if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false' ) {
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

  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  setAddressFormat( mailingAddressData ) {
    const iContactViewModel = JSON.parse(localStorage.getItem("iContactViewModel"));

    if(!this.hasRfqAccess())
    {
      let tempAdd: string;
      tempAdd = '';
      if ( this.checkEmpty( mailingAddressData?.state )) {
        tempAdd +=  mailingAddressData?.state + ', ';
      }
      if ( this.checkEmpty( mailingAddressData?.country ) ) {
        tempAdd += '<br />' + mailingAddressData?.country;
      }
      this.formattedBuyerAddress = tempAdd;
      return;
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
        
      } 

      if ( this.checkEmpty(mailingAddressData?.deptAddress) ) {
        tempAdd += mailingAddressData?.deptAddress + ', ';
       
      }
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
  checkEmpty( val ) {
    if ( val !== null && val !== undefined && val !== '') {
      if (val.trim() === '') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  /* This function is called when click on Upgrade Account button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
  }

  contactSale() {
    this.toShowContactModel=true;
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  utcDate (date) {
    return moment.utc(date).toDate();
   }
   checkForDay(closing_date){
    const currentDate = moment();
    const closeDate = moment.utc(closing_date).local();
    const duration = moment.duration(closeDate.diff(currentDate));
    const minutes = duration.asMinutes();
    if (minutes <= 1440 && minutes > 0) {
      return true;
    } 
      return false;
    
  }

  getRfqPurposeName(){
    let temp = this.rfqPurposeModelList.filter( (x) => x.id == this.irfqViewModel.rfqPurpose );
    if(temp.length){
      return temp[0].value;
    } else {
      return 'N/a';
    }
  }
  setRfdId(rfdId) {
    this.rfdIdToSet = rfdId;
    this.checkAccountType()
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

    // Call Mixpanel RFQ Unlocked Event
    this.pushRfqDataForMixpanel(this.productAnalyticService.MPE_SUPPLIER_RFQ_UNLOCKED);

    this._supplierService.GrowthPackageUnlockRFQsInfo(data).subscribe(
      result => {
        this.checkRfqStatus();
        const encryptedRfqID = this._profileService.encrypt(this.rfdIdToSet);
         this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }}); 
    });  
      }
    );  
  }

  goBackbutton() {
    this.router.navigate(['/supplier/supplierMyRfq']);
  }
  closePopUp(){
    this.buyerYetToAccept = false;
  }
  isStl(fileName) {
    return  fileName.toLowerCase().indexOf('.stl') > -1 ||  fileName.toLowerCase().indexOf('.stp') > -1 ||  fileName.toLowerCase().indexOf('.step') > -1 ||  fileName.toLowerCase().indexOf('.sldprt') > -1 ||  fileName.toLowerCase().indexOf('.igs') > -1 ||  fileName.toLowerCase().indexOf('.iges') > -1 ||  fileName.toLowerCase().indexOf('.ipt') > -1 ||  fileName.toLowerCase().indexOf('. x_t') > -1;
  }
  isXlsxFile(fileName) {
   
    return  fileName.toLowerCase().indexOf('.xlsx') > -1 ||  fileName.toLowerCase().indexOf('.png') > -1 ||  fileName.toLowerCase().indexOf('.jpg') > -1 ||  fileName.toLowerCase().indexOf('.pdf') > -1 ||  fileName.toLowerCase().indexOf('.tif') > -1 ||  fileName.toLowerCase().indexOf('.bmp') > -1 ||  fileName.toLowerCase().indexOf('.dxf') > -1 ||  fileName.toLowerCase().indexOf('.dwg') > -1;
  }
  isNda() {
    this.isNDAaccepted = this._rfqService.get("isNDAaccepted");
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
  setRecommnededForYouBanner(){
    localStorage.setItem("isStarterPackage", null);
    localStorage.setItem("isGrowthPackage", null);
    localStorage.setItem("isPremiumClicked", null);
  }
  checkAccountType(){
        this._rfqService
        .getGrowthPackage(this.loggedCompanyId, this.accountTypeuser)
        .subscribe(
          (result) => {
            this.responseData = result;
            localStorage.setItem(
              "AccountType",
              this.responseData.newAccountType
            );
            if(this.responseData.newAccountType === appConstants.AccountType.Basic){
              localStorage.setItem("IsGrowthPackageUser", "False");
              localStorage.setItem(
                            "IsPremium",
                            this._profileService.encrypt(JSON.stringify(false)).toString()
                          );
                          this._toastr.warning(
                          "You have a basic account. Please upgrade to be able to unlock and quote RFQs.",
                          "Warning!"
                        );
            }
          },
          (error) => {
            this._rfqService.handleError(error);
          },

          () => { }

        );
  }

  trackMixpanelRfqUnlockLead(){
    this.pushRfqDataForMixpanel(this.productAnalyticService.MPE_ALC_Unlock_Button);
  }
   pushRfqDataForMixpanel(eventName){
    this.productAnalyticService.mixpanelTracking(eventName,{
      date: new Date(),
       rfq_id: this.rfqId,
       validated_buyer: BrowserStorageUtil.isValidatedBuyer()
     });
   }

   checknotAwardedJob(data){
    if(data.rfqBuyerStatus.rfqBuyerstatusId ===  appConstants.RfqBuyerStatus.Offline || data.rfqBuyerStatus.rfqBuyerstatusId===  appConstants.RfqBuyerStatus.AnotherMFG || data.rfqBuyerStatus.rfqBuyerstatusId===  appConstants.RfqBuyerStatus.AnotherNonMFG ){
       this.changeColor = true; 
       this.hideAwardToMfg = true;
     }else if(data.rfqBuyerStatus.rfqBuyerstatusId === appConstants.RfqBuyerStatus.Awarded){
      if(data.rfqAwardedTo === this.loggedId){
        this.changeColor = false;
        this.hideAwardToMfg = false;
      }else{
        this.changeColor = false;
        this.hideAwardToMfg = true;
      }
    }else{
      this.changeColor = false;
      this.hideAwardToMfg = false;
    }
  }
}
