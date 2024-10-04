import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import * as jspdf from "jspdf";
import { ConfirmationService } from "primeng/api";
import { RfqService } from "../../../core/services/rfq/rfq.service";
import { SupplierService } from "../../../core/services/supplier/supplier.service";
import { AccountService } from "../../../core/services/account/account.service";
import { ProfileService } from "../../../core/services/profile/profile.service";
import { IManufacturerDashboardViewModel } from "../../../core/models/supplierProfileModel";
import { IPartLibraryModel } from "../../../core/models/partModel";
import { Location } from '@angular/common';
import {
  IRFQViewModel,
  ISupplierNdaAcceptedViewModel,
  IGetCustomNDAFilesModel,
  IRfqSupplierLikesViewModel,
  PdfModel,
  DownloadAllFilesViewModel,
} from "../../../core/models/rfqModel";
import { IMessageHubModel } from "../../../core/models/globalMaster";
import { appConstants } from "../../../core/config/constant";
import { TrackBasicSupplierLandsOnRFQDetailViewModel } from "../../../core/models/supplierModel";
declare let html2canvas: any;
import { Subject } from "rxjs";
import { SupRfqDetailComponent } from "./component/sup-rfq-detail/sup-rfq-detail.component";
import { ProductAnalyticService } from "../../../../app/shared/product-analytic/product-analytic";


@Component({
  selector: "app-supplier-rfq-detail",
  templateUrl: "./supplier-rfq-detail.component.html",
  styleUrls: ["./supplier-rfq-detail.component.scss"],
  providers: [ConfirmationService],
})
export class SupplierRfqDetailComponent implements OnInit, OnDestroy {
  @ViewChild("quotesTab", { static: false }) quotesTab: ElementRef;
  @ViewChild(SupRfqDetailComponent) supRfqDetailComponent;
  iRfqSupplierLikesViewModel: IRfqSupplierLikesViewModel;
  currentRfqId: number;
  rfqId: any;
  isRfqTabOpen: boolean;
  isRfqNdaTabOpen: boolean;
  isRfqQuotesTabOpen: boolean;
  isRfqAwardTabOpen: boolean;
  isRfqMessageTabOpen: boolean;
  isRfqShopIQTabOpen: boolean;
  isRfqRevisionTabOpen: boolean;
  irfqViewModel: IRFQViewModel;
  isPartAwarded: boolean;
  isTransferRfq: boolean;
  display: boolean;
  showShopIQ: boolean;
  PdfModel: PdfModel;
  isPdfAPi: boolean;
  cloneRfqName: string;
  isCloneModal: boolean;
  cloneRfqId: number;
  cloneContactId: number;
  isCencel2: boolean;
  isDelete: boolean;
  msgs: string;
  currentRfqName: string;
  currentRfqStatusId: string;
  currentRfqDate: string;
  iSupplierNdaAcceptedViewModel: ISupplierNdaAcceptedViewModel;
  iGetCustomNDAFilesModel: IGetCustomNDAFilesModel;
  ndaAcceptedLevel1: boolean;
  ndaAcceptedLevel2: boolean;
  ndaCustomeAcceptedLevel: boolean;
  ndaLevel: number;
  ndaFileName: string;
  ndaContent: string;
  isndaContent: boolean;
  isRfqLike: boolean;
  isRfqDislike: boolean;
  isNDAFile: boolean;
  isNDAbutton: boolean;
  rfqStatusString: string="";
  idRfq: string;
  applicationRole: string[];
  userRole: string;
  rfqGuid: string;
  Downloadallfiles: DownloadAllFilesViewModel;
  temp: string[];
  iProfileSetModel: IManufacturerDashboardViewModel;
  iReviewPartsViewModelColl: IPartLibraryModel[];
  // tslint:disable-next-line: quotemark
  pageName = "My RFQs";
  isQoute = false;
  associateRfqId: number;
  showUpgradeAccountModal: boolean;
  isRfqQuotePdf: boolean;
  isDetailPage: boolean;
  showLoader: boolean;
  isRfqQuoted: boolean;

  rfqSubscribe: Subscription;
  trackBasicSupplierLandsOnRFQDetailViewModel: TrackBasicSupplierLandsOnRFQDetailViewModel;

  isSubmitted: boolean = false;
  actionForGrowthPackage: any;
  accountTypeUser: string;
  subscriptionCapability = [];
  isCapabilityExist: boolean = false;
  deCryptRFQIDUrl: any;
  apiRFqid: IGetCustomNDAFilesModel;
  isRfqOrderTabOpen: boolean = false;
  withOrderManagement: boolean;
  invoiceCreated?:boolean = false;
  awarded:boolean;
  isQuoteSubmitted: boolean = false;
  rfqEncryptedId: any;
  isSupplierIdMatched: boolean;
  isFileTabOpen: boolean;
  paidUser: boolean;
  IsFileProcessedByReshape: boolean = false;
  RfqPreferdNdaType: number;
  RfqNdaStatus: string;

  showNDAModal: boolean=false;
  showNDA2ModalWarning: boolean=false;
  isFileDownloadable: boolean=false;
  isCustomNDA: boolean=false;
  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  userDetailsLocation: string;
  showHistoryTab:boolean = true;
  historyTabStatus: boolean;
  showRfqDetailFileTab: any;
  constructor(
    private _rfqService: RfqService,
    private _toastr: ToastrService,
    private _supplierService: SupplierService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activeRoute: ActivatedRoute,
    private _accountService: AccountService,
    private _profileService: ProfileService,
    private location: Location,
    private productAnalyticService:ProductAnalyticService
  ) {
    this.temp = [];
    this.isNDAbutton = false;
    this.isCencel2 = false;
    this.cloneRfqId = 0;
    this.cloneContactId = 0;
    this.msgs = "";
    this.isDelete = false;
    this.showShopIQ = false;
    this.isndaContent = false;
    this.isRfqTabOpen = true;
    this.isPartAwarded = false;
    this.isRfqNdaTabOpen = false;
    this.isPdfAPi = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqAwardTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqShopIQTabOpen = false;
    this.isNDAFile = false;
    this._rfqService.set(false, "isFromFakeButton");
    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0,
    };
    this.iSupplierNdaAcceptedViewModel = {
      rfqSupplierNdaAccepted: 0,
      rfqId: 0,
      contactId: 0,
      isPreferedNdaTypeAccepted: true,
      preferedNdaTypeAcceptedDate: null,
      isNdaVerbiageAccepted: true,
      ndaVerbiageAcceptedDate: null,
      result: true,
      errorMessage: "",
    };
    this.PdfModel = {
      htmlRFQdetails: "",
      pageURL: "",
      rfqId: "",
    };
    this._rfqService.set(false, "isPdf");
    this._rfqService.set("", "ndaMessage");
    this._rfqService.set(false, "isFromNotification");
    this._rfqService.set(false, "showSidePanel");
    this.rfqGuid = "";
  }
  navigateBack() {
    let isManufSelectType = localStorage.getItem("isManufSelectType");
    let backToPreviousPage = localStorage.getItem("urlToRedirect");
    // debugger
    localStorage.removeItem("pageName1");
    if (this.rfqGuid) {
      localStorage.setItem("isBack", "false");
      this.router.navigate(["/supplier/supplierMyRfq"]);
    } else {
      const isnotificationPage = localStorage.getItem("isNotificationPage");
      if (isnotificationPage === "true") {
        localStorage.setItem("isNotificationPage", "false");
        localStorage.setItem("isBack", "false");
        window.history.back();
      } else if (localStorage.getItem("isDashboard") === "true") {
        localStorage.setItem("isNotificationPage", "false");
        localStorage.setItem("isDashboard", "false");
        localStorage.setItem("isBack", "false");
        window.history.back();
      } else if (
        backToPreviousPage != null &&
        backToPreviousPage.includes("/supplier/supplierRfqDetails") &&
        isManufSelectType == "true"
      ) {
        localStorage.setItem("isManufSelectType", "false");
        localStorage.setItem("isNotificationPage", "false");
        localStorage.setItem("isDashboard", "false");
        localStorage.setItem("isBack", "false");
        this.router.navigate(["/supplier/supplierMyRfq"]);
      } else {
        localStorage.setItem("isNotificationPage", "false");
        localStorage.setItem("isBack", "true");
        window.history.back();
      }
    }
  }
  getNdaMesssage() {
    return this._rfqService.get("ndaMessage");
  }
  ngOnInit() {
    this.accountTypeUser = localStorage.getItem("AccountType");
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
   
    if(this.accountTypeUser === "Gold" || this.accountTypeUser === "Platinum" || this.accountTypeUser == "Growth Package") {
      this.paidUser = true;
    }
    this.associateRfqId = 0;
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      contactId: this.loggedId,
      isPublishProfile: null,
      isCompanyAddress: null,
    };
    this.irfqViewModel = {
      rfqId: 0,
      isAllPartDetailsFilled: null,
      rfqName: "",
      certificateList: [],
      payment_term_id: null,
      contactIdEncrypt: "",
      is_Default_payment_term_id: false,
      certificateIdList: [],
      rfqDescription: "",
      contactId: 0,
      rfqStatus: "",
      rfqCreatedOn: "",
      rfqStatusId: 0,
      isSpecialCertificationsByManufacturer: false,
      isSpecialInstructionToManufacturer: false,
      specialInstructionToManufacturer: "",
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
      errorMessage: "",
      result: false,
      rfqBuyerStatus: null,
      userType: 0,
      isDefaultPrefferedManufacturingLocation: false,
      rfqGeneralAttachmentsList: [],
      certificationsByManufacturer: "",
      isDefaultNDAdetails: false,
      ndaContent: "",
      ndaTypekey: "",
      preferredMfgLocationIds: [],
      partCount: 0,
      isProfileNDA: false,
      isDefaultWhoPaysForShipping: false,
      rfqThumbnail: "",
      isActive: false,
      isUpdatedFromVision: false,
      modifiedBy: 0,
      SpecialinviteList: [],
      companyId: 0,
      ndaFile: "",
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
      isAwardingEnabled: false,
      isCommunityRfq: false,
    };
    let isFromMail = "";

    if (localStorage.getItem("pageName1")) {
      this.pageName = localStorage.getItem("pageName1");
    } else {
      this.pageName = "RFQs";
    }
    this.activeRoute.queryParams.subscribe((params) => {
      isFromMail = params["id"];
      const tempRfq = params["rfqId"];
      const deCryptRFQID = tempRfq.replace(/ /g, "+");
      if (deCryptRFQID !== undefined && deCryptRFQID !== null) {
        this.deCryptRFQIDUrl = deCryptRFQID;
        this.rfqId = this._profileService.decrypt(deCryptRFQID);
      }
      if (params["history"] != undefined) {
        this.onRevisions();
      }
      if (params["message"] != undefined) {
        this.onMessages();
      }
      if (params["quotes"] != undefined) {
        this.onQuotes();
      } 
    });
    if (isFromMail !== undefined && isFromMail !== "") {
      // tslint:disable-next-line:radix
      this.idRfq = isFromMail;
      // localStorage.setItem('supplierRfqDetailId', this.idRfq.toString());
      this.currentRfqId = 0;
      this.rfqGuid = this.idRfq;
      localStorage.removeItem("suppCurrentRfqName");
      localStorage.removeItem("suppCurrentRfqStatusId");
      // localStorage.setItem('supplierRfqGuid', '' + this.rfqGuid);
    } else {
      this.currentRfqId = this.rfqId;
      if (this.currentRfqId == undefined || this.currentRfqId == null) {
        this.router.navigate(["dashboard/supplier/ecommerce"]);
        return false;
      }
    }
    this.applicationRole = JSON.parse(localStorage.getItem("applicableRoles"));
    this.userRole = localStorage.getItem("Usertype");
    if (this.applicationRole.includes("Seller") && this.userRole === "Buyer") {
      this.switchToSupplier(localStorage.getItem("userId"), "Seller");
      // setTimeout(this.checkForSwitch, 1000);
    } else if (
      this.applicationRole.includes("Seller") &&
      (this.userRole === "Seller" || this.userRole === "Supplier")
    ) {
      this.checkForSwitch();
    } else if (!this.applicationRole.includes("Seller")) {
      this._toastr.warning("Please login with valid manufacture.", "Warning!");
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(["auth/login/simple"]);
      }, 500);
    }
    if (
      localStorage.getItem("isMyRfqPage") !== undefined &&
      localStorage.getItem("isMyRfqPage") !== null
    ) {
      localStorage.removeItem("isMyRfqPage");
      this.setProfileStatus();
    }
    this.showUpgradeAccountModal = false;
    this.isRfqQuotePdf = false;
    this.isDetailPage = false;
    this.showLoader = false;
    this.isRfqQuoted = false;
    this.checkIsSubmitted()
    this.getSupplierPackageInfo();

    // Add mixpanel here for RFQ Details Page Event.
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_SUPPLIER_RFQ_DETAILS_PAGE,{
      rfqId: this.rfqId 
    });
  }
  setProfileStatus() {
    this.iProfileSetModel.isVisitMyRFQ = true;
    this._supplierService
      .setProfileDashBoard(this.iProfileSetModel)
      .subscribe((result) => {
        if (result) {
          console.log(result);
        }
      });
  }
  checkForSwitch() {
    this._rfqService.set(false, "isBuyerCommpleteProfile");
    this.currentRfqName = localStorage.getItem("suppCurrentRfqName");
    this.currentRfqStatusId = localStorage.getItem("suppCurrentRfqStatusId");
    this.getRfqDetails();
    this.isRfqLike = this._rfqService.get("isRfqLike");
    this.isRfqDislike = this._rfqService.get("isRfqDisLike");
    this._rfqService.set(false, "showSidePanel");
    // tslint:disable-next-line:radix
    const idFromLocal = this.rfqId;
    if (!isNaN(idFromLocal)) {
      // tslint:disable-next-line:radix
      this.currentRfqId = this.rfqId;
    } else {
      this.currentRfqId = this.rfqId;
    }

    if (localStorage.getItem("ndaTab") === "true") {
      // this.onNDAs();
      localStorage.removeItem("ndaTab");
    } else if (localStorage.getItem("quotesTab") === "true") {
      this.onQuotes();
      localStorage.removeItem("quotesTab");
    } else if (localStorage.getItem("msgTab") === "true") {
      this.onMessages();
      localStorage.removeItem("msgTab");
      let msgNoti: IMessageHubModel;
      // msgNoti = this._rfqService.get('msgTabMessageDrawer');
      msgNoti = JSON.parse(localStorage.getItem("msgTabMessageDrawer"));
      let contactId = 0;
      if (msgNoti.fromId === this.loggedId) {
        contactId = msgNoti.toId;
      } else {
        contactId = msgNoti.fromId;
      }

      this._rfqService.set(false, "showSidePanel");
      this._rfqService.set(false, "messageDrawer");
      this._rfqService.set(msgNoti.userName, "nameOfBuyer");
      this._rfqService.set(contactId, "selectContactIdsForMEessage");
      this._rfqService.set(msgNoti.rfqId, "selectContactRFQId");
      this._rfqService.set(false, "messageThreadDrawer");
      this._rfqService.set(false, "isPartialQuote");
      this._rfqService.set(false, "isBuyerMiniProfile");
      this._rfqService.set(false, "transferRfq");
      this._rfqService.set(false, "quoteRfq");
    }
    // if(this.isQoute) {
    //   this.onQuotes();
    // }
  }

  isFromFakeButton() {
    const isClicked = this._rfqService.get("isFromFakeButton");
    if (isClicked) {
      this._rfqService.set(false, "isFromFakeButton");
      const el: HTMLElement = this.quotesTab.nativeElement as HTMLElement;
      el.click();
    }
  }

  isReqFromNotification() {
    const isNoti = this._rfqService.get("isFromNotification");
    if (isNoti) {
      this._rfqService.set(false, "isFromNotification");
      window.location.reload();
    }
  }

  // utility functions
  onRfq() {
    this.isRfqTabOpen = true;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqAwardTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqShopIQTabOpen = false;
    this.isFileTabOpen = false;   
    this.clearServiceVariable();
    this.replaceStateWithTabName("rfq=RFQ");
  }
  onQuotes() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = true;
    this.isRfqOrderTabOpen = false;
    this.isRfqAwardTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqShopIQTabOpen = false;
    this.isFileTabOpen = false;   
    this.clearServiceVariable();
    this.replaceStateWithTabName("quotes=Quotes");
  }
  replaceStateWithTabName(otherParam) {
    this.location.replaceState('/rfq/rfqdetail?rfqId=' + encodeURIComponent(this.deCryptRFQIDUrl)+"&"+otherParam);
  }
  onMessages() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqAwardTabOpen = false;
    this.isRfqMessageTabOpen = true;
    this.isRfqRevisionTabOpen = false;
    this.isRfqShopIQTabOpen = false;
    this.isFileTabOpen = false;
    this.clearServiceVariable();
    this.replaceStateWithTabName("message=Message");
  }
  onRevisions() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqAwardTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqRevisionTabOpen = true;
    this.isRfqShopIQTabOpen = false;
    this.isFileTabOpen = false;   
    this.clearServiceVariable();
    this.replaceStateWithTabName("history=History");
  }
  onShopIQ() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqAwardTabOpen = false;
    this.isRfqMessageTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqShopIQTabOpen = true;
    this.isFileTabOpen = false;   
    this.clearServiceVariable();
    this.replaceStateWithTabName("shopIQ=ShopIQ");
  }

  onFiles(){   
    const supplierContactId = this.loggedId;
   if( this.isFileDownloadable && (this.accountTypeUser === "Gold" || this.accountTypeUser === "Platinum" || this.accountTypeUser === "Growth Package" || this.accountTypeUser === "Starter")){
     this._rfqService.reshapeModalViewer(supplierContactId,this.currentRfqId).subscribe((result: any) => {
        let openReshapeURL = "https://" + result;
        window.open(openReshapeURL, "_self");
      });
    }
  }

  onOrder() { 
    if(this.awarded && this.isSupplierIdMatched) {
      var reqData = {
        rfqId: this.currentRfqId,
        supplierContactId: this.loggedId
      };
      this._rfqService.setReshapeLogin(reqData).subscribe((result: any) => {
        let openReshapeURL = "https://" + result;
        window.open(openReshapeURL, "_self");
      });
    } else {
          this.isRfqTabOpen = false;
          this.isRfqNdaTabOpen = false;
          this.isRfqQuotesTabOpen = false;
          this.isRfqOrderTabOpen = true;
          this.isRfqAwardTabOpen = false;
          this.isRfqMessageTabOpen = false;
          this.isRfqRevisionTabOpen = false;
          this.isRfqShopIQTabOpen = false;  
          this.awarded = false;
          this.isFileTabOpen = false;   
          this.replaceStateWithTabName("order=Order");
    } 
  }

  onInvoices() {     
      this._rfqService.RedirectToReshapeRFQsInvoices(this.loggedId, this.currentRfqId).subscribe((result: any) => {
        let openReshapeURL = "https://" + result;
        window.open(openReshapeURL, "_self");
      });  
  }

  onAward() {
    this.isRfqTabOpen = false;
    this.isRfqNdaTabOpen = false;
    this.isRfqQuotesTabOpen = false;
    this.isRfqOrderTabOpen = false;
    this.isRfqAwardTabOpen = true;
    this.isRfqMessageTabOpen = false;
    this.isRfqRevisionTabOpen = false;
    this.isRfqShopIQTabOpen = false;
    this.isFileTabOpen = false;   
    this.clearServiceVariable();
  }

  clearServiceVariable() {
    this._rfqService.set(false, "showSidePanel");
    this._rfqService.set(false, "transferRfq");
    this._rfqService.set(false, "messageRfq");
    this._rfqService.set(false, "messageThreadDrawer");
    this._rfqService.set(false, "isBuyerMiniProfile");
    this._rfqService.set(false, "isBuyerMessage");
  }
  isSidePanel() {
    return this._rfqService.get("showSidePanel");
  }
  isTransferRfqPanel() {
    return this._rfqService.get("transferRfq");
  }
  isMessageThreadPanel() {
    return this._rfqService.get("messageThreadDrawer");
  }
  isBuyerMiniProfile() {
    return this._rfqService.get("isBuyerMiniProfile");
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get("isBuyerCommpleteProfile");
  }
  isBuyerMessage() {
    return this._rfqService.get("isBuyerMessage");
  }
  isMessagePanel() {
    return this._rfqService.get("messageDrawer");
  }
  isQuotesPanel() {
    return this._rfqService.get("isPartialQuote");
  }
  getMessageIdForThread() {
    return this._rfqService.get("messageThreadId");
  }
  getCurrentRfqId() {
    return this._rfqService.get("rfqId");
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem("LoggedId"));
  }

  // utility functions

  ndaInformation() {
    this._rfqService.ndaAcceptedValues(this.currentRfqId).subscribe(
      (result) => {
        this.iGetCustomNDAFilesModel = result;
        if (
          !!this.iGetCustomNDAFilesModel.fileId &&
          this.iGetCustomNDAFilesModel.fileId !== 0
        ) {
          this.irfqViewModel.rfqStatusId !== 6
            ? (this.ndaCustomeAcceptedLevel = true)
            : (this.ndaCustomeAcceptedLevel = false);
          this.ndaFileName = this.iGetCustomNDAFilesModel.ndaFile;
          this.ndaContent = this.iGetCustomNDAFilesModel.ndaContent;
        } else if (this.iGetCustomNDAFilesModel.ndaLevel === 2) {
          this.irfqViewModel.rfqStatusId !== 6
            ? (this.ndaAcceptedLevel2 = true)
            : (this.ndaAcceptedLevel2 = false);
          this.ndaContent = this.iGetCustomNDAFilesModel.ndaContent;
        } else if (this.iGetCustomNDAFilesModel.ndaLevel === 2) {
          this.irfqViewModel.rfqStatusId !== 6
            ? (this.ndaAcceptedLevel2 = true)
            : (this.ndaAcceptedLevel2 = false);
          this.ndaContent = this.iGetCustomNDAFilesModel.ndaContent;
        } else if (this.iGetCustomNDAFilesModel.ndaLevel === 1) {
          this.irfqViewModel.rfqStatusId !== 6
            ? (this.ndaAcceptedLevel1 = true)
            : (this.ndaAcceptedLevel1 = false);
          this.ndaContent = this.iGetCustomNDAFilesModel.ndaContent;
        } else {
        }
      },
      (error) => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  ndaRejected() {
    if (
      this.rfqGuid != undefined &&
      this.rfqGuid != null &&
      this.rfqGuid != ""
    ) {
      this.router.navigate(["/supplier/supplierMyRfq"]);
      this.ndaAcceptedLevel2 = false;
      this.ndaAcceptedLevel1 = false;
      this.ndaCustomeAcceptedLevel = false;
    } else {
      localStorage.setItem("isBack", "true");
      window.history.back();
      this.ndaAcceptedLevel2 = false;
      this.ndaAcceptedLevel1 = false;
      this.ndaCustomeAcceptedLevel = false;
    }
  }
  ndaAccepted() {
    if (
      this.currentRfqId !== null &&
      this.currentRfqId !== 0 &&
      this.currentRfqId !== undefined &&
      !isNaN(this.currentRfqId)
    ) {
      this._rfqService
        .ndaAcceptedorNot(this.currentRfqId, this.loggedId)
        .subscribe(
          (result) => {
            if (result["result"] === false) {
              this.ndaInformation();
            }
          },
          (error) => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
    } else {
      this.getRfqDetails();
    }
  }
  isNda() {
    // console.log(this._rfqService.get('isNDAaccepted'));
    return this._rfqService.get("isNDAaccepted");
  }

  loadRfqDeatailsWithNda(result) {
    this.actionForGrowthPackage = result.actionForGrowthPackage;
    this.rfqId = result.rfqId;
    //this.getPartsList();
    this.irfqViewModel.isCommunityRfq =
      result.isCommunityRfq != undefined && result.isCommunityRfq != undefined
        ? result.isCommunityRfq
        : false;
    this.showShopIQ = !this.irfqViewModel.isShopIQAvailable
      ? false
      : this.irfqViewModel.isShopIQAvailable;
    this.isPartAwarded = result.isAwarded;
    this.currentRfqId = this.irfqViewModel.rfqId;
    this._rfqService.set(
      this.irfqViewModel.contactIdEncrypt,
      "currentRfqConatctId"
    );
    // localStorage.setItem('supplierRfqDetailId', '' + this.irfqViewModel.rfqId);
    if (this.irfqViewModel.rfqStatusId === 6) {
      this._rfqService.set(true, "isRfqAwarded");
    } else {
      this._rfqService.set(false, "isRfqAwarded");
    }
    this.isRfqLike = this.irfqViewModel.isRfqLike;
    this.isRfqDislike = this.irfqViewModel.isRfqDisLike;
    this._rfqService.set(this.irfqViewModel.isRfqLike, "isRfqLike");
    this._rfqService.set(this.irfqViewModel.isRfqDisLike, "isRfqDisLike");
    //  console.log(this.irfqViewModel);
    this.currentRfqName = this.irfqViewModel.rfqName;
    if (this.irfqViewModel.ndaTypekey === "RFX_SECURITYTYPE_TOTALY_SECURE") {
      this.rfqStatusString = "1st Level NDA Agreement";
    } else if (
      this.irfqViewModel.ndaTypekey ===
      "RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR"
    ) {
      this.rfqStatusString = "2nd Level NDA Agreement";
    } else {
      this.rfqStatusString = "Custom ";
    }
    this.currentRfqId = this.irfqViewModel.rfqId;
    this.currentRfqStatusId = this.irfqViewModel.rfqStatusId.toString();
    this.currentRfqDate = this.irfqViewModel.rfqCreatedOn;
    this.irfqViewModel.awardDate = moment
      .utc(this.irfqViewModel.awardDate)
      .toDate();
    this.irfqViewModel.quotesNeededBy = moment
      .utc(this.irfqViewModel.quotesNeededBy)
      .toDate();
    // localStorage.setItem('Rfqdetails', JSON.stringify(this.irfqViewModel));
    this.ndaLevel = this.irfqViewModel.prefNdaType;
    if (this.accountTypeUser === "Basic") {
      this.rfqId = result.rfqId;
      this.trackBasicSupplierLandsOnRFQDetail();
    }else{
      this.ndaAccepted();
    }
    localStorage.setItem(
      "IsAllowQuoting",
      this.irfqViewModel.isAllowQuoting.toString()
    );
  }

  getRfqDetails() {
    let supplierContactId = 0;
    supplierContactId = this.loggedId;
    if (
      (this.currentRfqId == undefined || this.currentRfqId == null) &&
      this.rfqGuid != undefined &&
      this.rfqGuid != null
    ) {
      this.currentRfqId = 0;
    }

    if (
      (this.currentRfqId != undefined && this.currentRfqId !== null) ||
      (this.rfqGuid != null && this.rfqGuid != undefined)
    ) {
      this.showLoader=true;
      this._rfqService
        .getRFQExtraDetails(this.currentRfqId, supplierContactId, this.rfqGuid)
        .subscribe(
          (result) => {
            this.showLoader=false;
            if (result.result === true) {
              // *** This function will check the rfq nda status ***
              this.checkRfqStatus()
              this.historyTabStatus = result.showHistoryTab;
              this.irfqViewModel = result;
              this.checkHistoryTabStatus();
              this.RfqPreferdNdaType = result.prefNdaType;
              this.currentRfqId =result.rfqId
              this.currentRfqDate = result.rfqCreatedOn;
              this.currentRfqStatusId = JSON.stringify(result.rfqStatusId);
              this.IsFileProcessedByReshape = result.isReshapeFileProcessed;
              
              if(this.IsFileProcessedByReshape === null){
                this.IsFileProcessedByReshape = false;
              }
              this.deCryptRFQIDUrl = this._profileService.encrypt(
                this.irfqViewModel.rfqId
              );
              this.withOrderManagement = result.withOrderManagement;
              this.invoiceCreated = result.isInvoiceCreated;
              if(result.rfqStatusId === 6){
                 this.awarded = true;
                }
              this.getPartsList(result);
              this.isSupplierIdMatched = parseInt(localStorage.getItem("LoggedId")) === this.irfqViewModel.rfqAwardedTo;  
              this.ndaLevel = this.irfqViewModel.prefNdaType;
              if (this.isPremium() && this.accountTypeUser !== "Growth Package" && this.ndaLevel) {
                if(this.accountTypeUser === "Gold" || this.accountTypeUser === "Platinum")
                this.ndaAccepted();
              }

            } else if (result.errorMessage === "InValidBuyer.") {
              // if(this._rfqService.isInValidBuyerWarningShown === false) {
              this._toastr.warning("Please login with valid buyer", "Warning!");
              this.router.navigate(["dashboard/supplier/ecommerce"]);
              // }
            } else if (result.isActive == false) {
              this._toastr.warning(result.errorMessage, "Warning!");
              this.router.navigate(["dashboard/supplier/ecommerce"]);
            }
          },
          (error) => {
            this.showLoader=false;
            this._rfqService.handleError(error);
          },
          () => {this.showLoader=false;}
        );
    }
  }

  onClickNda() {
    this.isndaContent = !this.isndaContent;
    this.isNDAFile = true;
  }
  goBack() {
    this._rfqService.set(false, "isBuyerCommpleteProfile");
    this._rfqService.set(0, "buyerCurrentProfileCompanyId");
    this._rfqService.set(0, "buyerCurrentProfileContactId");
    this._rfqService.set(false, "showSidePanel");
    this._rfqService.set(false, "rfqDetailDrawer");
    this._rfqService.set(false, "isBuyerMiniProfile");
    localStorage.removeItem("pageName1");
  }
  ndaAccepet() {
    if (this.isNDAFile === false) {
      this._toastr.warning("Please go through NDA document", "Warning!");
    } else {
      if (!this.isNDAbutton) {
        this.isNDAbutton = true;
        const currentDate = new Date();
        this.iSupplierNdaAcceptedViewModel.contactId = this.loggedId;
        this.iSupplierNdaAcceptedViewModel.rfqId = this.currentRfqId;
        this.iSupplierNdaAcceptedViewModel.isPreferedNdaTypeAccepted = true;
        this.iSupplierNdaAcceptedViewModel.preferedNdaTypeAcceptedDate =
          currentDate;
        this._supplierService
          .ndaAccepted(this.iSupplierNdaAcceptedViewModel)
          .subscribe(
            (result) => {
              if (result["result"] === true) {          
              this.supRfqDetailComponent.checkRfqStatus();
                this.showNDAModal=false;
                this.ndaAcceptedLevel1 = false;
                this.ndaAcceptedLevel2 = false;
                this.ndaCustomeAcceptedLevel = false;
                this.isCustomNDA = false;
                this._toastr.success(result["errorMessage"], "Success!");
                this.isNDAbutton = false;
              } else {
                this._toastr.error(result["errorMessage"], "Error!");
              }
            },
            (error) => {
              this._rfqService.handleError(error);
            },
            () => {}
          );
      }
    }
  }

  downloadS3File(fileName: string, isDownload: boolean) {
  this.showLoader=true;
    this._rfqService.getS3FileDownload(fileName).subscribe((response) => {
      this.showLoader=false;
      if (
        response.result &&
        response.result.result &&
        response.result.result === true
      ) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, "_blank");
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement("a");
          link.href = filelink;
          link.setAttribute("target", "_blank");

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(
              filelink.lastIndexOf("/") + 1,
              filelink.length
            );
            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            link.dispatchEvent(e);
          }
        }
        this.isNDAFile = true;
      }
    });
   
  }

  deleteRfq() {
    this.isDelete = true;
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message:
        "Are you sure you want to delete this RFQ, all data will be permanently removed. Would you like to delete this RFQ?",
      header: "Delete RFQ",
      icon: null,
      accept: () => {
        this.msgs = "true";
        this._supplierService
          .SetRFQQuoteSupplierStatus(
            this.currentRfqId,
            this.loggedId,
            false,
            true
          )
          .subscribe(
            (result) => {
              if (result["result"] === true) {
                //  this.iRfqQuoteSupplierQuoteViewModel = result;
                this._toastr.success(result["errorMessage"], "Success!");
                this.router.navigate(["/supplier/supplierMyRfq"]);
              } else {
                this._toastr.error(result["errorMessage"], "Error!");
              }
            },
            (error) => {
              this._rfqService.handleError(error);
            },
            () => {}
          );
      },
      reject: () => {
        // this.msgs = 'false';
      },
    });
  }
  likeRfq() {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.initiRfqSupplierLikesViewModel();
      const currentDate = new Date();
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = this.currentRfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = true;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._supplierService
        .rfqLikeOrDislike(this.iRfqSupplierLikesViewModel)
        .subscribe(
          (result) => {
            this.iRfqSupplierLikesViewModel = result["data"];
            if (result["result"] === true) {
              let data = this._rfqService.get("likedRfqCount");
              data = data + 1;
              this._rfqService.set(data, "likedRfqCount");
              this.isRfqLike = true;
              this.isRfqDislike = false;
              // this.getCountsOfRfqs();
              this.initiRfqSupplierLikesViewModel();
              this._toastr.success("Rfq has been marked as liked", "Success!");
            } else {
              this._toastr.error(result["errorMessage"], "Error!");
            }
            this.isSubmitted = false;
          },
          (error) => {
            this.isSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
    }
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem("loggedCompanyId"));
  }
  removelikeRfq() {
    if (!this.isSubmitted) {
      this.isSubmitted = true;

      this.initiRfqSupplierLikesViewModel();
      const currentDate = new Date();
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = this.currentRfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._supplierService
        .rfqLikeOrDislike(this.iRfqSupplierLikesViewModel)
        .subscribe(
          (result) => {
            this.iRfqSupplierLikesViewModel = result["data"];
            if (result["result"] === true) {
              let data = this._rfqService.get("likedRfqCount");
              data = data - 1;
              this._rfqService.set(data, "likedRfqCount");
              // this.getCountsOfRfqs();
              this.initiRfqSupplierLikesViewModel();
              this.isRfqLike = false;
              this.isRfqDislike = false;
              this._toastr.success(result["errorMessage"], "Success!");
            } else {
              this._toastr.error(result["errorMessage"], "Error!");
            }
            this.isSubmitted = false;
          },
          (error) => {
            this.isSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
    }
  }

  removeDisLikeRfq() {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.initiRfqSupplierLikesViewModel();
      const currentDate = new Date();
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = this.currentRfqId;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._supplierService
        .rfqLikeOrDislike(this.iRfqSupplierLikesViewModel)
        .subscribe(
          (result) => {
            this.iRfqSupplierLikesViewModel = result["data"];
            if (result["result"] === true) {
              this.initiRfqSupplierLikesViewModel();
              this.isRfqLike = false;
              this.isRfqDislike = false;
              this._toastr.success(result["errorMessage"], "Success!");
            } else {
              this._toastr.error(result["errorMessage"], "Error!");
            }
            this.isSubmitted = false;
          },
          (error) => {
            this.isSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
    }
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
      errorMessage: "",
      result: false,
    };
  }
  disLikeRfq() {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.initiRfqSupplierLikesViewModel();
      const currentDate = new Date();
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = this.currentRfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = true;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;

      this._supplierService
        .rfqLikeOrDislike(this.iRfqSupplierLikesViewModel)
        .subscribe(
          (result) => {
            this.iRfqSupplierLikesViewModel = result["data"];
            if (result["result"] === true) {
              this.initiRfqSupplierLikesViewModel();
              this.isRfqLike = false;
              this.isRfqDislike = true;
              this._toastr.success(result["errorMessage"], "Success!");
            } else {
              this._toastr.error(result["errorMessage"], "Error!");
            }
            this.isSubmitted = false;
          },
          (error) => {
            this.isSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
    }
  }
  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem("IsPremium");
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== "true" && IsPremiumDecrypt !== "false") {
      localStorage.clear();
      this.router.navigate(["auth/login/simple"]);
      return;
    }
    if (IsPremiumDecrypt === "true") {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this._rfqService.set(false, "showSidePanel");
    localStorage.removeItem("Rfqdetails");
    this._rfqService.set(null, "partList");
    this._rfqService.set(null, "getManufacturesByRfqData");
    this._rfqService.set(null, "GetSupplierRFQQuoteDetailsData");
    this._rfqService.set(false, "warningShown");
    this._rfqService.set(null, "ndaMessage");
    // this.rfqSubscribe.unsubscribe();
  }
  handleError(error) {
    if (error.status === 0) {
      this._toastr.error("Please check internet connection", "Error!");
    } else if (error.status === 400) {
      this._toastr.error(JSON.stringify(error.error), "Error!");
    }
  }

  switchToSupplier(userId, Role) {
    let isLoginFromVision;
    if (sessionStorage.getItem("isLoginFromVision") == "true") {
      isLoginFromVision = true;
    } else {
      isLoginFromVision = false;
    }
    this._accountService
      .swicthContact(userId, Role, isLoginFromVision)
      .subscribe(
        (data) => {
          if (
            data.isGoldPlatinumViaStripe != null &&
            data.isGoldPlatinumViaStripe != undefined &&
            data.isGoldPlatinumViaStripe != ""
          ) {
            localStorage.setItem("isStripUser", data.isGoldPlatinumViaStripe);
          } else {
            localStorage.setItem("isStripUser", "false");
          }
          if (
            data.isLiveQuoteBetaTried != undefined &&
            data.isLiveQuoteBetaTried != null &&
            data.isLiveQuoteBetaTried != ""
          ) {
            localStorage.setItem(
              "isQMSTrailModelShown",
              data.isLiveQuoteBetaTried
            );
          } else {
            localStorage.setItem("isQMSTrailModelShown", "false");
          }
          localStorage.setItem("User2", data.user.userName);
          localStorage.removeItem("manufacturingLocation");
          localStorage.setItem(
            "manufacturingLocation",
            data.manufacturingLocation
          );
          if (
            !!data.contactViewModel.contactPictureFile &&
            data.contactViewModel.contactPictureFile !== ""
          ) {
            if (
              localStorage.getItem("userHeaderLogo") !==
              data.contactViewModel.contactPictureFile
            ) {
              localStorage.setItem(
                "userHeaderLogo",
                data.contactViewModel.contactPictureFile
              );
            }
          }
          localStorage.setItem(
            "LoggedId",
            data.contactViewModel.contactId.toString()
          );
          localStorage.setItem(
            "applicableRoles",
            JSON.stringify(data.currentUserRole)
          );
          localStorage.setItem(
            "loggedCompanyId",
            data.contactViewModel.companyId.toString()
          );
          localStorage.setItem(
            "LoggedIdEncript",
            data["contactIdEncrypt"].toString()
          );
          // localStorage.setItem('IsPremium', JSON.stringify(data.contactViewModel.isPremium));
          if (data.contactViewModel.isRFQCreated === true) {
            localStorage.setItem("isNewUser", "false");
          } else {
            localStorage.setItem("isNewUser", "true");
          }
          localStorage.removeItem("Usertype");
          localStorage.setItem("Usertype", "Supplier");
          // localStorage.setItem('IsPremium', JSON.stringify(data.contactViewModel.isPremium));
          let IsPrimiumEncrypt = this._profileService.encrypt(
            JSON.stringify(data.contactViewModel.isPremium)
          );
          localStorage.setItem("IsPremium", IsPrimiumEncrypt.toString());
          localStorage.setItem("AccountType", data.accountType);
          localStorage.setItem(
            "isMqsEnabled",
            JSON.stringify(data.isMqsEnabled)
          );
          localStorage.setItem(
            "applicableRoles",
            JSON.stringify(data.currentUserRole)
          );
          localStorage.setItem(
            "isCapabilitiesFilled",
            data.contactViewModel.isCapabilitiesFilled.toString()
          );
          localStorage.setItem(
            "isCompanyProfileFilled",
            data.contactViewModel.isCompanyProfileFilled.toString()
          );
          // this.isLoginResonse = false;
          // this.router.navigateByUrl( this.returnUrl );
          appConstants.settingDefault.decimalValueDefault =
            data.defaultNoOfDecimalPlaces;
          this._accountService.sendMessage("Supplier");
          this.checkForSwitch();
        },
        (error) => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
  }
  callPdf() {
    if((this.isRfqQuotesTabOpen && this.isRfqQuoted) || this.isRfqAwardTabOpen){
      this.callRfqQuotePdf();
    }else{
      this._rfqService.set(true, "isPdf");
      if (!this.isPdfAPi) {
        this.isPdfAPi = true;
        setTimeout(() => {
          this.GenerateRFQdetailsPDF();
        }, 1000);
      }
    }
  }
  callRfqQuotePdf() {
    this.showLoader = true;
    this.isRfqQuotePdf = true;
  }
  isPdfDownload() {
    this.isRfqQuotePdf = false;
    this.showLoader = false;
  }
  public captureScreen() {
    this._rfqService.set(true, "isPdf");
    const data = document.getElementById("contentToConvert");
    html2canvas(data).then((canvas) => {
      const pageHeight = 295;
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      const contentDataURL = canvas.toDataURL("image/png");
      const pdf = new jspdf("p", "mm", "a4", true);
      pdf.addImage(
        contentDataURL,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST"
      );
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      }
      pdf.save("rfq.pdf");
      this._rfqService.set(false, "isPdf");
    });
  }
  GenerateRFQdetailsPDF() {
    const data = document.getElementById("contentToConvert").innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlRFQdetails = newdata;
    this.PdfModel.rfqId = this.currentRfqId.toString();
    this._rfqService.GenerateRFQdetailsPDF(this.PdfModel).subscribe(
      (result) => {
        this.isPdfAPi = false;
        if (result["result"] === true) {
          window.open(result["privateFileFileName"], "_blank");
        }
        this._rfqService.set(false, "isPdf");
      },
      (error) => {
        this.isPdfAPi = false;
        //  this.downloadFile(error.error.text);
        this._rfqService.handleError(error);
        this._rfqService.set(false, "isPdf");
      },
      () => {}
    );
  }
  downloadPdf(fileName: string) {
    this._rfqService.getS3FileDownload(fileName).subscribe((response) => {
      if (
        response.result &&
        response.result.result &&
        response.result.result === true
      ) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, "_blank");
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement("a");
          link.href = filelink;
          link.setAttribute("target", "_blank");

          if (link.download !== undefined) {
            fileName = filelink.substring(
              filelink.lastIndexOf("/") + 1,
              filelink.length
            );
            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }

  downloadAllFiles() {
    if (!this.isSubmitted) {
      this.isSubmitted = true;

      this.isPdfAPi = true;
      this.Downloadallfiles = {
        filename: [],
        rfQ_Id: 0,
        part_id: 0,
      };

      this.Downloadallfiles.filename = [];
      this.Downloadallfiles.part_id = 0;
      this.Downloadallfiles.rfQ_Id = this.currentRfqId;

      this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(
        (response) => {
          // console.log('data' , privateFileFileName);
          if (response.result === true) {
            const resData = response.data;
            const filelink = resData.privateFileFileName;
            if (filelink) {
              if (/(iP)/g.test(navigator.userAgent)) {
                // alert('Your device does not support files downloading. Please try again in desktop browser.');
                window.open(filelink, "_blank");
              }
              // If in Chrome or Safari - download via virtual link click
              const link = document.createElement("a");
              link.href = filelink;

              link.setAttribute("target", "_blank");
              // Dispatching click event.
              if (document.createEvent) {
                const e = document.createEvent("MouseEvents");
                e.initEvent("click", true, true);
                link.dispatchEvent(e);
              }
            }
            this.isPdfAPi = false;
          } else {
            this.isPdfAPi = false;
          }
          this.isSubmitted = false;
        },
        (error) => {
          this.isPdfAPi = false;
          this.isSubmitted = false;
        }
      );
    }
  }
  isModelShow() {
    return this._rfqService.get("isModelShow");
  }
  /* This function is used to  check flag for associate message drawer */
  isAssociateMessageDrawer() {
    this.associateRfqId = this.rfqId;
    return this._rfqService.get("associateMessageDrawer");
  }
  checkAccountUpgradeReqSent() {
    const tempFlag = this._rfqService.get("UpgradeReqFlag");
    if (tempFlag === true) {
      this.showUpgradeAccountModal = true;
      this.isDetailPage = false;
    }
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
    this._rfqService.set(false, "UpgradeReqFlag");
  }
  /* This function is called when click on Upgrade to quote button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
    this.isDetailPage = true;
  }
  /* this function is used to get the part list */
  getPartsList(data) {
    if (this.rfqId == undefined) {
      this.rfqId = data.rfqId;
    }
    const isFromProgress = this._rfqService.get("rfqType");
    let IsRfqResubmitted = false;
    if (isFromProgress === 13) {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    if (this.rfqId != undefined && this.rfqId != null) {
      this._rfqService
        .getReviewRfqParts(this.rfqId, this.loggedId, IsRfqResubmitted)
        .subscribe(
          (result) => {
            this.iReviewPartsViewModelColl = result;
            if (this.irfqViewModel.isPartialQuotingAllowed) {
              this.iReviewPartsViewModelColl.forEach((x) => {
                if (x.isQuoteItemAdded) {
                  this.isRfqQuoted = true;
                }
              });
            } else {
              const index = this.iReviewPartsViewModelColl.findIndex(
                (x) => x.isQuoteItemAdded === false
              );
              if (index === -1) {
                this.isRfqQuoted = true;
              }
            }
            this.loadRfqDeatailsWithNda(data);
            this._supplierService
              .getSuppliersSubscriptionProcesses(this.loggedCompanyId)
              .subscribe(
                (response) => {
                  if (response.result) {
                    let capability = false;
                    this.subscriptionCapability = response.data;
                    this.subscriptionCapability.forEach((obj) => {
                      this.iReviewPartsViewModelColl.forEach((obj1) => {
                        if (
                          obj.parentDisciplineId === obj1.partCategoryId
                        ) {
                          capability = true;
                        }
                      });
                    });
                    if (capability) {
                      this.isCapabilityExist = true;
                    } else {
                      this.isCapabilityExist = false;
                    }

                  } else {
                    this.subscriptionCapability = [];
                  }
                },
                (error) => {
                  this.subscriptionCapability = [];
                }
              );
          },
          (error) => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
    }
  }

  trackBasicSupplierLandsOnRFQDetail() {
    this.trackBasicSupplierLandsOnRFQDetailViewModel =
      new TrackBasicSupplierLandsOnRFQDetailViewModel();
    this.trackBasicSupplierLandsOnRFQDetailViewModel.contactId = this.loggedId;
    this.trackBasicSupplierLandsOnRFQDetailViewModel.rfqId = this.rfqId;
    this._supplierService
      .trackBasicSupplierLandsOnRFQDetail(
        this.trackBasicSupplierLandsOnRFQDetailViewModel
      )
      .subscribe(
        (res) => {},
        (error) => {}
      );
  }

  isRfqDrawer() {
    return this._rfqService.get("rfqDetailDrawer");
  }
  checkIsSubmitted(){
    this._supplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, false).subscribe(
      result => {
        this.isQuoteSubmitted = result.isQuoteSubmitted;
        this.RfqNdaStatus = result.ndaStatus;
    })
  }
 // *** This function will check the rfq nda status ***
  checkRfqStatus(){
    this.showLoader=true;
    this._rfqService
        .getRfqNdaStatus(this.currentRfqId,this.loggedId)
        .subscribe(
          (responseData) => {
            this.showLoader=false;
            if(responseData){
              if(responseData.showNDA1Modal || responseData.showNDA2Modal || responseData.isCustomNDA){
                this.showNDAModal=true;
              }
              this.showNDA2ModalWarning = responseData.showNDA2ModalWarning;
              this.isFileDownloadable = responseData.isFileDownloadable;
              this.isCustomNDA = responseData.isCustomNDA;
            }
          },
          (error) => {
            this.showLoader=false;
            this._rfqService.handleError(error);
          },
          () => {           
             this.showLoader=false;
            }
        );
  }
  setRecommnededForYouBanner(){
    localStorage.setItem("isStarterPackage", null);
    localStorage.setItem("isGrowthPackage", null);
    localStorage.setItem("isPremiumClicked", null);
  }

  checkHistoryTabStatus(){
      if(this.accountTypeUser === appConstants.AccountType.Starter || this.accountTypeUser === appConstants.AccountType.GrowthPackage ){
       this.showHistoryTab = this.historyTabStatus;
      }else{
        this.showHistoryTab = true;
      }
   }
   getSupplierPackageInfo() {
    const contactId = this.loggedId;
    const companyId = this.loggedCompanyId;
    this._supplierService.getTileAvailability(contactId, companyId).subscribe(
      (result) => {
        if (result) {
          this.showRfqDetailFileTab = result[0].showRfqDetailFileTab;
        }
      }
    );
  }
 
}
