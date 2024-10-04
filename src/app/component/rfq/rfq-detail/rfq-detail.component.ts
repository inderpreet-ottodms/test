import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { appConstants } from '../../../core/config/constant';
import { IMessageHubModel } from '../../../core/models/globalMaster';
import { IRFQViewModel } from '../../../core/models/rfqModel';
import { AccountService } from '../../../core/services/account/account.service';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { RfqService } from './../../../core/services/rfq/rfq.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-rfq-detail',
  templateUrl: './rfq-detail.component.html',
  styleUrls: ['./rfq-detail.component.scss'],
  providers: [ConfirmationService]
})
export class RfqDetailComponent implements OnInit, OnDestroy {

  @ViewChild('ndaTab',{static:false}) ndaTab: ElementRef;
  @ViewChild('quotesTab',{static:false}) quotesTab: ElementRef;
  @ViewChild('msgTab',{static:false}) msgTab: ElementRef;
  @ViewChild('orderTab',{static:false}) orderTab: ElementRef;
  destroy$: Subject<boolean> = new Subject<boolean>();
  // Variable Declarations
  showPageDataLoding:boolean=false;
  isCloneModel: boolean;
  rfqId: any;
  isFromNotification: boolean;
  isRfqTabOpen: boolean;
  isRfqNdaTabOpen: boolean;
  isRfqDistributionTabOpen: boolean;
  isRfqQuotesTabOpen: boolean;
  isRfqMessageTabOpen: boolean;
  isRfqInvoiceTabOpen:boolean;
  isRfqOrderTabOpen:boolean;
  isRfqRevisionTabOpen: boolean;
  irfqViewModel: IRFQViewModel;

  isTransferRfq: boolean;
  isCompareTab: boolean;
  display: boolean;

  cloneRfqName: string;
  isCloneModal: boolean;
  cloneRfqId: number;
  cloneContactId: number;
  cloneDeliveryDate: string;
  isCencel2: boolean;
  msgs: string;
  rfqGuid: string;
  idRfq: string;
  isQoute: any = '';
  isDashQuote: any = false;
  applicationRole: string[];
  userRole: string;
  minDate: Date;
  id: any;
  name: any;
  maxDeliverDate: any;
  rfqImageId: number = null;
  isAwardPartModel: boolean = false;
  withOrderManagement: any;
  awardModalStep1: boolean;
  rfqBuyerstatusId: number;
  showOrder: boolean = true;
  deCryptRFQIDUrl: any;
  poStatus: string;
  invoiceSent:boolean = false;
  POReshapeOrderId: any;
  disableUpdateAward: boolean;
  // Variable Declarations Ends
  constructor(private _rfqService: RfqService, private router: Router, private _toastr: ToastrService,
    private confirmationService: ConfirmationService, private _router: ActivatedRoute,
    private _profileService: ProfileService, private _accountService: AccountService, private location: Location) {
    this.isCencel2 = false;
    this.cloneRfqId = 0;
    this.cloneContactId = 0;
    this.isCompareTab = true;
    this.isCloneModel = false;
    this.msgs = '';
    this.cloneDeliveryDate = '',
      this.isRfqTabOpen = true;
    this.isRfqNdaTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqOrderTabOpen= false;
    this.isRfqRevisionTabOpen = false;
    this._rfqService.set(false, 'isFromNotification');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'isCompare');
    this._rfqService.set(false, 'isCompareClosed');
    localStorage.removeItem('Rfqdetails');
    this.rfqGuid = '';
    this.idRfq = '';
  }

  ngOnInit() {
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
      isStripeSupplier:false,
      isAllowQuoting :false,
      isAwardingEnabled:false,
      poReshapeOrderId:''
      
    };
    this.isCloneOpen();
    this.configDatePicker();
    let isFromMail = '';
    let idRfq = '';
    this._router.queryParams.subscribe(params => {
      isFromMail = params['id'];
      const tempRfq = params["rfqId"];
      let deCryptRFQID = tempRfq.replace(/ /g, "+");
      this.deCryptRFQIDUrl = params['rfqId'];
      if(params['history'] != undefined){
        this.onRevisions()
      }
      else if(params['message'] != undefined){
        this.onMessages()
      }
      else if (params['Isqoutes']) {
        this.isQoute = params['Isqoutes'];
             this.onQuotes();
      }
      else if(params['quotes'] != undefined){
        this.onQuotes()
      }
      else if(params['order'] != undefined){
        this.onOrderTab()
      }
      else if(params['nda'] != undefined){
        this.onNDAs()
      }
      else if(params['distribution'] != undefined){
        this.onDistribution()
      }
      else if(params['rfq'] != undefined){
        this.onRfq()
      }
   
      if(deCryptRFQID !== undefined && deCryptRFQID !== null) {
        idRfq = this._profileService.decrypt(deCryptRFQID);
      }  
      let qt = params['qt'];
      if (qt != undefined && qt != null && qt != '') {
        let isQuoteDecrypt = JSON.parse(this._profileService.decrypt(params['qt']));
        this.isDashQuote = isQuoteDecrypt;
        this.onQuotes();
      }

      localStorage.removeItem('Rfqdetails');
      this._rfqService.set(false, 'rfqLoaded');
    });
    if (isFromMail !== undefined && isFromMail !== '') {
      this.idRfq = isFromMail;
      this.rfqId = 0;
      this.rfqGuid = this.idRfq;
      localStorage.removeItem('suppCurrentRfqName');
      localStorage.removeItem('suppCurrentRfqStatusId');
      localStorage.setItem('supplierRfqGuid', '' + this.rfqGuid);
    } else if (idRfq !== undefined && idRfq !== null && idRfq != '') {
      this.rfqId = idRfq;
    } else {
      this.router.navigate(['dashboard/buyer/default']);
      return false;
    }

    this.applicationRole = JSON.parse(localStorage.getItem('applicableRoles'));
    this.userRole = localStorage.getItem('Usertype');
    if (this.applicationRole.includes('Buyer') && (this.userRole ===appConstants.UserRole.Seller || this.userRole === appConstants.UserRole.Supplier)) {
      this.switchToBuyer(localStorage.getItem('userId'), 'Buyer');
    } else if (this.applicationRole.includes('Buyer') && (this.userRole === appConstants.UserRole.Buyer)) {
      this.checkForSwitch();
    } else if (!this.applicationRole.includes('Buyer')) {
      this._toastr.warning('Please login with valid Buyer.', 'Warning!');
      setTimeout(() => {
        this.router.navigate(['dashboard/supplier/ecommerce']);
      }, 500);
    }
  }
  isvalid() {
    if (this.cloneRfqName !== '' && this.cloneDeliveryDate !== '') {
      return false;
    } else {
      return true;
    }
  }
  configDatePicker() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }
  switchToBuyer(userId, Role) {
    let isLoginFromVision;
    if((sessionStorage.getItem('isLoginFromVision')) == 'true') {
      isLoginFromVision=true;
    } else {
      isLoginFromVision=false;
    }
    this._accountService.swicthContact(userId, Role,isLoginFromVision).pipe(takeUntil(this.destroy$)).subscribe(data => {
        if (data.isGoldPlatinumViaStripe != null && data.isGoldPlatinumViaStripe != undefined && data.isGoldPlatinumViaStripe != '') {
          localStorage.setItem('isStripUser', data.isGoldPlatinumViaStripe);
        } else {
          localStorage.setItem('isStripUser', 'false');
        }
        if (data.isLiveQuoteBetaTried != undefined && data.isLiveQuoteBetaTried != null && data.isLiveQuoteBetaTried != '') {
          localStorage.setItem('isQMSTrailModelShown', data.isLiveQuoteBetaTried);
        } else {
          localStorage.setItem('isQMSTrailModelShown', 'false');
        }
        localStorage.removeItem('manufacturingLocation');
        localStorage.setItem('manufacturingLocation', data.manufacturingLocation);
        localStorage.setItem('User2', data.user.userName);
        if (!!data.contactViewModel.contactPictureFile && (data.contactViewModel.contactPictureFile !== '')) {
          if (localStorage.getItem('userHeaderLogo') !== data.contactViewModel.contactPictureFile) {
            localStorage.setItem('userHeaderLogo', data.contactViewModel.contactPictureFile);
          }
        }
        localStorage.setItem('isMqsEnabled', 'false');
        localStorage.setItem('LoggedId', data.contactViewModel.contactId.toString());
        localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
        localStorage.setItem('loggedCompanyId', data.contactViewModel.companyId.toString());
        localStorage.setItem('LoggedIdEncript', data['contactIdEncrypt'].toString());
        if (data.contactViewModel.isRFQCreated === true) {
          localStorage.setItem('isNewUser', 'false');
        } else {
          localStorage.setItem('isNewUser', 'true');
        }
        localStorage.removeItem('AccountType');
        localStorage.removeItem('Usertype');
        localStorage.setItem('Usertype', 'Buyer');
        this._accountService.sendMessage('Buyer');
        this.checkForSwitch();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {});
  }
  checkForSwitch() {
    if (this.rfqId !== 0 && this.rfqId !== undefined) {
      this.getRfqDetails();
      const isFromMyRfq = this._rfqService.get('isfromMyRfq');
      if (isFromMyRfq) {
        this.onQuotes();
      }
      const isOnQuotesCall = (localStorage.getItem('quotesTab') === 'true');
      if (isOnQuotesCall) {
        this.onQuotes();
        localStorage.removeItem('quotesTab');
      }
    } else if (this.rfqGuid) {
      this.getRfqDetails();
    } else {
      this.router.navigate(['/rfq/myrfq']);
    }

    if (localStorage.getItem('ndaTab') === 'true') {
      this.onNDAs();
      localStorage.removeItem('ndaTab');
    } else if (localStorage.getItem('quotesTab') === 'true') {
      this.onQuotes();
      localStorage.removeItem('quotesTab');
    } else if (localStorage.getItem('msgTab') === 'true') {
      this.onMessages();
      localStorage.removeItem('msgTab');
      let msgNoti: IMessageHubModel;
      msgNoti = JSON.parse(localStorage.getItem('msgTabMessageDrawer'));
      let contactId = 0;
      if (msgNoti.fromId === this.loggedId) {
        contactId = msgNoti.toId;
      } else {
        contactId = msgNoti.fromId;
      }
      this._rfqService.set(false, 'showSidePanel');
      this._rfqService.set(false, 'messageRfq');
      this._rfqService.set(msgNoti.userName, 'nameOfBuyer');
      this._rfqService.set(contactId, 'selectContactIdsForMEessage');
      this._rfqService.set(msgNoti.rfqId, 'selectContactRFQId');
    }
  }
  isReqFromNotification() {
    const isNoti = this._rfqService.get('isFromNotification');
    if (isNoti) {
      this._rfqService.set(false, 'isFromNotification');
      window.location.reload();
    }
  }
  transferRfq() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'supplierProfileDrawer');
    setTimeout(() => {
      this.rfqId = this._rfqService.get('rfqId');
      this._rfqService.set(this.irfqViewModel.rfqId, 'rfqId');
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'transferRfq');
    }, 100);
  }
  onRfq() {
    this.isRfqTabOpen = true;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqOrderTabOpen= false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("rfq=RFQ");
  }
  compare() {
    this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');
    this._rfqService.set(true, 'isCompare');
  }
  isCompare() {
    return this._rfqService.get('isCompare');
  }
  onNDAs() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = true;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqOrderTabOpen= false;

    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("nda=NDA");
  }
  onQuotes() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = true;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen =false;
    this.isRfqOrderTabOpen= false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("quotes=Quotes");
  }
  replaceStateWithTabName(otherParam) {
    this.location.replaceState('/rfq/rfqdetail?rfqId=' + encodeURIComponent(this.deCryptRFQIDUrl)+"&"+otherParam);
  }
  onMessages() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = true;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqOrderTabOpen= false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("message=Message");
  }
  onOrderTab() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqOrderTabOpen= true;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("order=Order");
  }
  onInvoiceTab(){
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen = true;
    this.isRfqOrderTabOpen= false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = false;
    this.replaceStateWithTabName("history=History");
  }
  onRevisions() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqRevisionTabOpen = true;
    this.isRfqDistributionTabOpen = false;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("history=History");
  }
  onDistribution() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqInvoiceTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqDistributionTabOpen = true;
    this._rfqService.set(false, 'showSidePanel');
    this.replaceStateWithTabName("distribution=Distribution");
  }

  cloneRfq(RfqIdT, contactIdT) {
    this.cloneRfqName = '';
    this.cloneDeliveryDate = '';
    this.cloneRfqId = RfqIdT;
    this.isCloneModal = true;
    this.cloneContactId = contactIdT;

  }
  cancelClone() {
    this.isCloneModal = false;
  }

  editRfq(){
    this._profileService.getConfigCatData().subscribe(rfqForm2Enabled => {  
    const rfqToEdit:any=this.irfqViewModel;
    const encryptedRfqID = this._profileService.encrypt(rfqToEdit.rfqId);
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

  cancelRfq(id) {
    this.isCencel2 = true;
    this.confirmationService.confirm({
      message: "Are you sure you want to move this RFQ to Draft? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to move this to Draft?",
      header: 'Move to Draft',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', id, this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(
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
      }
    });
  }


  getRfqInfo() {
    if (this._rfqService.get('rfqLoaded')) {
      this._rfqService.set(false, 'rfqLoaded');
      this.getRfqDetails();
    }
  }

  setRfqDetail(id, Name) {
    ;
    this.id = id;
    this.name = Name;

  }
  
  getRfqDetails() {
    let supplierContactId = 0;
    supplierContactId = this.loggedId;
  this.showPageDataLoding=true;
    if((this.rfqId != undefined && this.rfqId !== null) || (this.rfqGuid != null && this.rfqGuid != undefined ) ){
    this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, this.rfqGuid).pipe(takeUntil(this.destroy$)).subscribe(
      result => {    
        this.showPageDataLoding=false; 
        // commented the code of M2-5558
        // if(result["isQuoteSubmitted"]){
        //   this.onQuotes();
        // }   
        localStorage.setItem('rfqBuyerDescription', result.rfqBuyerStatus.description);
        localStorage.setItem('rfqPurposeAnswer',result.rfqPurposeAnswer)
        if (result.result === true) {
          this.irfqViewModel = result;
          this.rfqImageId = result.rfqId;
          this.rfqId=result.rfqId;
          localStorage.setItem('RfqId', this.rfqId);
          localStorage.setItem('rfqGuid', result.rfqguid);
          this.withOrderManagement = result.withOrderManagement;
          this.rfqBuyerstatusId =result.rfqBuyerStatus.rfqBuyerstatusId;
          this.poStatus = result.poStatus;
          this.invoiceSent = result.isInvoiceCreated;
          this.POReshapeOrderId = result.poReshapeOrderId;
          if(this.POReshapeOrderId){
            localStorage.setItem('orderID',this.POReshapeOrderId.toString());
          }
          if(result.rfqBuyerStatus.description === "Deleted"){
                this.disableUpdateAward = true
          }
          if((this.withOrderManagement === true && this.rfqBuyerstatusId === 6)||((this.poStatus === "cancelled" || this.poStatus === "retracted")&& (this.rfqBuyerstatusId=== 3 || this.rfqBuyerstatusId=== 5 ))){
            this.showOrder = true;
          }else{
            this.showOrder = false;
          }
          if (this.isQoute === 'true' || this.isDashQuote == true) {
            let  isRedirectFromRegionalModel=sessionStorage.getItem('isRedirectFromRegionalModel');
            if(isRedirectFromRegionalModel == 'true' && (this.irfqViewModel.isAwardingEnabled == true)) {
             this.isAwardPartModel =true;
            }

          }
        } else if(result.errorMessage === 'InValidBuyer.') {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/buyer/default']);    
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
    }
  }



  // utility functions
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  isTransferRfqPanel() {
    return this._rfqService.get('transferRfq');
  }
  isMessageRfqPanel() {
    return this._rfqService.get('messageRfq');
  }
  
  iscontactsidepanel(){
    return this._rfqService.get('iscontact')
  }


  isMessageThreadPanel() {
    return this._rfqService.get('messageThreadDrawer');
  }
  getMessageIdForThread() {
    return this._rfqService.get('messageThreadId');
  }
  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  isSupplierProfileDrawer() {
    return this._rfqService.get('supplierProfileDrawer');
  }
  isrfqViewAllDrawer() {
    return this._rfqService.get('rfqViewAllDrawer');
  }
  isSupplierProfileView() {
    return this._rfqService.get('B-rfq-d-is-SupProfile');
  }
  goBackToRFQDetails() {
    this._rfqService.set(false, 'B-rfq-d-is-SupProfile');
  }
  checkForCompare() {
    const data = this._rfqService.get('isCompareClosed');
    if (data === true) {
      if (this.quotesTab !== undefined) {
        const el: HTMLElement = this.quotesTab.nativeElement as HTMLElement;
        el.click();
        this._rfqService.set(false, 'isCompareClosed');
        this.onQuotes();
      }
    }
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'showSidePanel');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  // utility functions
  isModelShow() {
    return this._rfqService.get('isModelShow');
  }
  cloneModel(id) {
    this.isCloneModel = true;
    this.cloneRfqId = id;
    this.maxDeliverDate = this._rfqService.get('maxDeliverDate');
  }

  isCloneOpen() {
    this._rfqService.getCloneClose().subscribe(res => {
      if (res['text'] === true) {
        this.isCloneModel = false;
        this._rfqService.setCloneClose(false);
      } else {
        this.isCloneModel = false;
      }

    })

  }
  awardPart() {
    if(this.irfqViewModel.rfqStatusId != 1 && this.irfqViewModel.rfqStatusId != 2 && !this.withOrderManagement){
      this.isAwardPartModel = true;
      this.awardModalStep1 = false;
    }
    else if(this.withOrderManagement){
      this.awardModalStep1 = true
    }
  }
  closeAwardModel() {
    sessionStorage.removeItem('isRedirectFromRegionalModel');
    this.isAwardPartModel = false;
    this.getRfqDetails();
  }

  closeAwardModelAward(isOpened) {
    this.isAwardPartModel = false;
    if(isOpened === true) {
      this.awardModalStep1 = false;
    } else {
      this.awardModalStep1 = true;
    }   
    }

    getPurchaseOrderDetail(){
      const RfQID = localStorage.getItem('RfqId');
      this._rfqService.getPurchaseOrderDetail(RfQID).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        if(data){
          localStorage.setItem('orderID', data.reshapeOrderId.toString());
        }
      });
      
    }

}
