import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { JwtTokenService } from "../../../../app/component/SSO/services/jwt-token.service";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../__Services/api-service/api.service";
import { SSOService } from "../../../component/SSO/services/sso.service";
import { ILeadStreamDashboardRollUpViewModel, IRequestDemoLinkModel } from "../../../core/models/profileModel";
import {
  IMarkSupplierRFQViewModel,
  ITempNPSDataModel,
  ITerritoryClassificationModel,
  SupplierDashListModel,
} from "../../../core/models/rfqModel";
import { IMyAccountViewModel } from "../../../core/models/supplierProfileModel";
import { MasterService } from "../../../core/services/master/master.service";
import { ProfileService } from "../../../core/services/profile/profile.service";
import { RfqService } from "../../../core/services/rfq/rfq.service";
import { SupplierService } from "../../../core/services/supplier/supplier.service";
import { ProductAnalyticService } from "../../../shared/product-analytic/product-analytic";
import { IpService } from "../../../../app/v2/shared/ip.service";

declare var window;
@Component({
  selector: "app-ecommerce",
  templateUrl: "./ecommerce.component.html",
  styleUrls: [
    "./ecommerce.component.scss",
    "../../../../assets/icon/icofont/css/icofont.scss",
  ],
  providers: [ApiService, SSOService, JwtTokenService],
})
export class EcommerceComponent implements OnInit, AfterViewInit {
  isMyRFq: boolean;
  isLikedRFq: boolean;
  isSpecialInvites: boolean;
  isQuotedRfq: boolean;
  isFollowedBuyers: boolean;
  userType: string;
  isCapabilitiesFilled: string;
  isCompanyProfileFilled: string;
  isShowdashboard: boolean;
  isLoader: boolean;
  iRequestDemoLinkModel: IRequestDemoLinkModel = {} as IRequestDemoLinkModel;
  iSupplierRFQViewModel: IMarkSupplierRFQViewModel;
  iTempNPSDataModel: ITempNPSDataModel;
  SupplierDashListModel: SupplierDashListModel;
  iLeadStreamDashboardRollUpViewModel: ILeadStreamDashboardRollUpViewModel;
  enableMeterFields = [false, false, false, false, false, false, false];
  avgNoOfStars: number;
  total1StarRatingPer: number;
  total2StarRatingPer: number;
  total3StarRatingPer: number;
  total4StarRatingPer: number;
  total5StarRatingPer: number;
  totalReviews: number;
  userDetailsLocation: any;
  region: string;
  profileCount: number = 0;
  messageCount: number = 0;
  internetCount: number = 0;
  websiteCount: number = 0;
  phoneCount: number = 0;
  emailCount: number = 0;
  specialInviteCount: number = 0;
  viewedQuoteCount: number = 0;
  readMessageCount: number = 0;
  allActivityCount: number = 0;
  buyerAwardRfqCount: number = 0;
  communityProfileCount: number = 0;
  communityPhoneCount: number = 0;
  communityEmailCount: number = 0;
  communityRfqCount: number = 0;
  communityWebSiteCount: number = 0;
  profileViewCount: number = 0;
  communityProfileLikeCount: number = 0;
  communityPhotosCount: number = 0;
  communityJobsCount: number = 0;
  viewed3DTourCount: number = 0;
  accountPastBillMessage: string;
  showCapability: boolean = false;
  isAccountUpgradereqSent2: boolean;
  iMyAccountViewModel: IMyAccountViewModel;
  isUpgradeBtn: boolean;
  accountUpgradeMessage: string;
  showUpgradeAccountModal: boolean;
  isQuoteRfq: boolean;
  toShowContactModel: boolean = false;
  isCustomer: boolean = false;
  public config: any;
  showNoPublishModel: boolean = false;
  showPublishModel: boolean = false;
  accountVerifyMessage = false;
  showProgressModel: boolean = null;
  // variables for tile show as per conditions
  accountType: string;
  showSilverUpgradeModal: boolean;
  isSilverModalUpgradeClicked: boolean = false;
  isBoostYourProfileImg: boolean = false;
  isCommunityImg: boolean = false;
  isGrowingYourBusinessImg: boolean = false;
  isReadyForMoreImg: boolean = false;
  newMessageCount: number = 0;
  newNotifications: number = 0;
  isEligibleForGrowthPackage: any;
  isRemainingTileShow: any;
  isUnlockRfqCount: number = 0;
  noOfDaysLeft: number = 0;
  remainingStatus: boolean = false;
  refreshCountShowStatus: boolean = false;
  showSuccessGrowthModal: boolean;
  rfdIdToSet: any;
  responseData: any;
  showOrder: boolean = false;
  starterPackage: boolean = false;
  isGrowthPackage: any;
  isStarterPackage: any;
  showMaterialTile: boolean = false;
  isStarterPackageTaken: any;
  generatedToken: string;
  isStarterFreeTrialTaken: any;
  landedOnPlanPage: any;

  ipAddress: string;
  browser: any;
  os: any;
  public href: string = "";
  isGrowthPackageTaken: any;
  showMaterialTileForBasic: boolean;
  newData: string;
  materialRef: string;
  showMagicLeadList: boolean;
  showShopIQ: boolean;
  unlockRfqCountDefaultValue: any;
  cancellationRequested: boolean = false;

  constructor(
    private router: Router,
    private _toastr: ToastrService,
    private jwtTokenService: JwtTokenService,
    private _rfqService: RfqService,
    private _SupplierService: SupplierService,
    private _masterService: MasterService,
    private _profileService: ProfileService,
    private _RfqService: RfqService,
    public rest: ApiService,
    private ssoService: SSOService,
    private productAnalyticService:ProductAnalyticService,
    private modalService: NgbModal,
    private http: HttpClient,
    private ipService: IpService
  ) {



    this._RfqService.set(false, "showSidePanel");
    this.userType = localStorage.getItem("Usertype");
    this.accountType = localStorage.getItem("AccountType");
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
    if (this.userType === "Supplier") {
      this.router.navigate(["dashboard/supplier/ecommerce"]);
    } else if (this.userType === "Buyer") {
      this.router.navigate(["dashboard/buyer/default"]);
    }
    this.isMyRFq = true;
    this.isLikedRFq = false;
    this.isSpecialInvites = false;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
    this.initModels();
    this.isCapabilitiesFilled = localStorage.getItem("isCapabilitiesFilled");
    this.isCompanyProfileFilled = localStorage.getItem(
      "isCompanyProfileFilled"
    );
  
    if (
      this.isCapabilitiesFilled === "true" &&
      this.isCompanyProfileFilled === "true"
    ) {
      this.isShowdashboard = true;
    } else {
      this.isShowdashboard = false;
    }
    this.checkTileAvailability()
    this.SupplierDashListModel = {
      companyId: this.loggedCompanyId,
      contactId: this.loggedId,
      isOrderByDesc: false,
      more_records: false,
      orderBy: "",
      pageNumber: 0,
      pageSize: 0,
      processIdList: [],
      rfqType: 0,
      searchText: "",
      totalRecords: 0,
    };
    this.showUpgradeAccountModal = false;
    this.showSilverUpgradeModal = false;
    this.checkTileAvailability()
  }
  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }

  openSaleModel() {
    this.toShowContactModel = true;
    this.showUpgradeAccountModal = false;
  }
  get loggedCompanyId() {
    return parseInt(localStorage.getItem("loggedCompanyId"));
  }

  validateCommunityUser() {
    this.router.navigate(["/source"]);
   
  }

  ngOnInit() {
    // **** Adding identity event ****
    this.trackMixpanelSupplierDashboard()
    this.browser = window.navigator.userAgent;
    this.os = window.navigator.appVersion
    this.href = this.router.url;
    this.getIpAddress();
    // Api Calling for checking the account type status
    this._RfqService
      .getGrowthPackage(this.loggedCompanyId, this.accountType)
      .subscribe(
        (result) => {
          this.responseData = result;
          if (this.responseData.newAccountType != localStorage.getItem("AccountType")) {
            if ( localStorage.getItem("AccountType")==="Starter" && this.responseData.newAccountType == 'Growth Package' && this.isGrowthPackageTaken == 1) {
              this.mixPanelTracking('growthUpgradeSuccess')

            } 
            
            else if ( localStorage.getItem("AccountType")==="Basic" && this.responseData.newAccountType == 'Growth Package' && this.isGrowthPackageTaken == 1) {
              this.mixPanelTracking('growthPurchaseSuccess')

            }
            else if (localStorage.getItem("AccountType")==="Basic" && this.responseData.newAccountType == 'Starter'&& this.isStarterFreeTrialTaken && this.isStarterPackageTaken) {
              this.mixPanelTracking('freeTrialSuccess')
          }
          }
          if (this.responseData.newAccountType != null) {
            localStorage.setItem(
              "AccountType",
              this.responseData.newAccountType
            );
            if(this.responseData.newAccountType == 'Basic'){
              localStorage.setItem(
                "IsPremium",
                this._profileService.encrypt(JSON.stringify(false)).toString()
              );
            }else{
              localStorage.setItem(
                "IsPremium",
                this._profileService.encrypt(JSON.stringify(true)).toString()
              );
            }
            if (this.responseData.newAccountType === "Growth Package") {
              localStorage.setItem("IsGrowthPackageUser", "True");
              if (this.userDetailsLocation === "US") {
                this.showMaterialTile = true;
                this.isReadyForMoreImg = false;
               }
            } else if (this.responseData.newAccountType === "Starter") {
              this.accountType = this.responseData.newAccountType;
              if (this.userDetailsLocation === "US") {
                this.showMaterialTile = true;
                this.isReadyForMoreImg = false;


              }
              this.starterPackage = false;
              this.isEligibleForGrowthPackage = false;
            } else {
              localStorage.setItem("IsGrowthPackageUser", "False");
              if (
                (this.responseData.newAccountType == "Gold" ||
                  this.responseData.newAccountType == "Platinum") &&
                this.userDetailsLocation === "US"
              ) {
                this.showMaterialTile = true;
                this.isReadyForMoreImg = false;
              } else {
                this.showMaterialTile = false;
              }
            }
            if (
              (this.responseData.existingAccountType == "Basic" ||
                this.responseData.existingAccountType == "Starter") &&
              this.responseData.newAccountType === "Growth Package"
            ) {
              this.showSuccessGrowthModal = true;
              this.startQuote()
            } else if (
              this.responseData.existingAccountType == "Basic" &&
              this.responseData.newAccountType === "Starter"
            ) {
              this.router
                .navigateByUrl("", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["dashboard/supplier/ecommerce"]);
                });
            }else if(this.responseData.newAccountType === "Basic" &&(this.responseData.existingAccountType == "Growth Package" ||this.responseData.existingAccountType == "Starter" || this.responseData.existingAccountType == "Gold" || this.responseData.existingAccountType == "Platinum")){
              this.router
                .navigateByUrl("", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["dashboard/supplier/ecommerce"]);
                });
            }
              else {
              this.showSuccessGrowthModal = false;
            }
          }
          this.productAnalyticService.initializPendo(this.productAnalyticService.ECOMMERCE);
          this.materialRef = sessionStorage.getItem('materialsReferer')
          if(this.materialRef){
            let materStr =  'materials.mfg.com'
            let containsMaterial =  this.materialRef.toLowerCase().includes(materStr.toLowerCase())         
              if(containsMaterial){
                this.redirectToMaterials();
              }
          }
        },
        (error) => {
          this._RfqService.handleError(error);
        },

        () => { }

      );
    this.showCapability = false;
    this.isAccountUpgradereqSent2 = false;
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: "",
      membership: "",
      price: 0,
      paymentMethod: "",
      paymentFrequency: "",
      paymentAmount: 0,
      startDate: "0001-01-01T00:00:00",
      endDate: "0001-01-01T00:00:00",
      autoRenewal: false,
      errorMessage: "",
      result: false,
      pageName: "Page Title",
      rfqId: 0,
      toAlternateEmailId: "",
    };
    this.accountPastBillMessage = null;
    this.isRequestedForUpgradeToSilver();
    this.getPublicProfileStatus();
    this.getRfqList();
    this.getRatingStar();
    this.getLeadStreamCounts();
    this.getAccountPastBillMessage();
    this.getEmailVerificationStatus();
   
    // M2-4999: M - Growth Package - Don't display the Order Management tile on the dashboard for Growth Package users - UI
    if (localStorage.getItem("IsGrowthPackageUser") !== "True") {
      this._rfqService.getOrderManagementDetails(this.loggedId).subscribe(
        (response) => {
          if (
            this.accountType == "Starter" ||
            this.accountType == "Growth Package"
          ) {
            this.showOrder = false;
          } else if (
            !response.isOrderManagementTileViewed &&
            this.accountType !== "Basic"
          ) {
            this.showOrder = true;
          }
        },
        (error) => {
          console.log("err", error);
        },

        () => { }

      );
    }
  }

  isRequestedForUpgradeToSilver() {
    const contactID = this.loggedId;
    this._RfqService.isRequestedForUpgradeToSilver(contactID).subscribe(
      (result) => {
        this.isSilverModalUpgradeClicked = result.data;
        setTimeout(() => {
          this.showTileBasedOncondition();
        }, 1000);
      },
      (error) => {
        this._RfqService.handleError(error);
      },

      () => { }

    );
  }

  showTileBasedOncondition() {
    if (this.accountType === "Basic" || this.accountType === "Growth Package") {
      if (
        this.isEligibleForGrowthPackage === true &&
        (this.userDetailsLocation === "Mexico" ||
          this.userDetailsLocation === "Europe" ||
          this.userDetailsLocation === "US" ||
          this.userDetailsLocation === "Canada" ||
          this.userDetailsLocation === "Asia")
      ) {
        this.isEligibleForGrowthPackage = true;
      } else if (this.isRemainingTileShow) {
        this.isReadyForMoreImg = false;
        this.isEligibleForGrowthPackage = false;
      } else {
        this.isReadyForMoreImg = true; 
        if(this.userDetailsLocation === "US"){
          this.showMaterialTile = true;
        } else {
          this.showMaterialTile = false;

        }
        this.isEligibleForGrowthPackage = false;
        
      }
    } else {
      if (
        this.userDetailsLocation === "Mexico" ||
        this.userDetailsLocation === "US" ||
        this.userDetailsLocation === "Canada" ||
        this.userDetailsLocation === "USA & Canada"
      ) {
        this.isEligibleForGrowthPackage = false;
        this.isCommunityImg = true;
      } else if (
        this.userDetailsLocation === "Asia" ||
        this.userDetailsLocation === "Europe"
      ) {
        this.isEligibleForGrowthPackage = false;
        this.isGrowingYourBusinessImg = false;
      }
    }
  }

  ngAfterViewInit() {
  }

  initModels() {
    this.iSupplierRFQViewModel = {
      rfqId: 0,
      contactId: 0,
      buyerContactId: 0,
      contactIdEncrypt: "",
      isRfqDisLike: false,
      ndaToApproveCount: 0,
      rfqName: "",
      rfqStatusId: 0,
      rfqStatus: "",
      rfqCreatedOn: "",
      quotesNeededBy: "",
      awardDate: "",
      partsPrimaryFileName: "",
      partName: "",
      partQty: 0,
      partQtyUnit: "",
      partsMaterialName: "",
      partCategoryName: "",
      postProductionProcessName: "",
      buyerName: "",
      rfqType: "",
      errorMessage: "",
      result: false,
      allRfqCount: 0,
      likedRfqCount: 0,
      specialInviteRfqCount: 0,
      quotesRfqCount: 0,
      awardedRfqCount: 0,
      followedBuyersRfqCount: 0,
      awardDeclinedCount: 0,
      ndaBuyerDeclined: 0,
      ndaRequireResign: 0,
      isRfqLike: false,
      npsScore: 0,
      rfqThumbnail: "",
      awardRfqPendingAcceptenceCount: 0,
      declineQuotesCount: 0,
      specialInvitedRfqUnreadCount: 0,
      ndaToSignSupplierDeclinedCount: 0,
      ndaToSignRequireResignCount: 0,
      newMessages: 0,
      reQuoteRfq: 0,
      quotesInProgressRfqCount: 0,
      companyLogoPath: "",
      companyName: "",
      specialInstructions: "",
      profileViewCount: 0,
      markForQuotingCount: 0,
      newQuotesCount: 0,
      country: "",
      state: "",
      city: "",
      unviewedMagicLeadsCount: 0,
      manufacturingLocationId: 0,
      manufacturingLocation: "",
      deliveryDate: "",
      newNotifications: 0,
    };
    this.iTempNPSDataModel = {
      nps: 0,
      promoter: 0,
      passives: 0,
      detractors: 0,
      promotersCount: 0,
      passivesCount: 0,
      petractorsCount: 0,
      totalResponses: 0,
      result: false,
    };
    this.iLeadStreamDashboardRollUpViewModel = {
      companyId: this.loggedCompanyId,
      uptoDays: 0,
      pageSize: 0,
      pageNumber: 0,
      searchText: "",
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: "",
      more_records: false,
      interactionType: 0,
      dateFrom: "",
      dateTo: "",
      filterBy: "",
    };
  }
  openMyRFq() {
    this.isMyRFq = true;
    this.isLikedRFq = false;
    this.isSpecialInvites = false;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
  }
  openLikedRFq() {
    this.isMyRFq = false;
    this.isLikedRFq = true;
    this.isSpecialInvites = false;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
  }
  openSpecialInvites() {
    this.isMyRFq = false;
    this.isLikedRFq = false;
    this.isSpecialInvites = true;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
  }
  openQuotedRfq() {
    this.isMyRFq = false;
    this.isLikedRFq = false;
    this.isSpecialInvites = false;
    this.isQuotedRfq = true;
    this.isFollowedBuyers = false;
  }
  openFollowedBuyers() {
    this.isMyRFq = false;
    this.isLikedRFq = false;
    this.isSpecialInvites = false;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = true;
  }
  navigateToview() {
    this._RfqService.set(true, "dashboard");
    this.router.navigateByUrl("/supplier/profile");
  }

  navigateToInprogressView() {
    this.router.navigateByUrl("/supplier/quotesinprogress");
  }

  navigateToAwardView() {
    this.router.navigateByUrl("/supplier/awardedRfq");
  }
  navigateToNewMessageView() {
    this.router.navigateByUrl("/globalMessage");
  }
  navigateToSpecialInvitesView() {
    this.router.navigateByUrl("/supplier/specialInviteRfq");
  }
  navigateToMagicLead() {
    this.router.navigateByUrl("/magiclead");
  }
  navigateToLeadStream(leadValue) {
    localStorage.setItem("leadValue", leadValue);
    this.router.navigateByUrl("/leadstream");
  }

  get loggedId() {
    return parseInt(localStorage.getItem("LoggedId"));
  }
  setCapbility() {
    this._RfqService.set(true, "isfromDashboad");
    this.router.navigate(["/supplier/profile"]);
  }
  remCapbility() {
    this._RfqService.set(false, "isfromDashboad");
    this.router.navigate(["/supplier/profile"]);
  }
  getRfqList() {
    this.isLoader = true;
    this._RfqService.getSupplierRfqCount(this.SupplierDashListModel).subscribe(
      (result) => {
        this.isLoader = false;
        this.iSupplierRFQViewModel = result;
        this.newMessageCount = this.iSupplierRFQViewModel.newMessages;
        this.newNotifications = this.iSupplierRFQViewModel.newNotifications;
        localStorage.setItem(
          "newMessageCount",
          JSON.stringify(this.newMessageCount)
        );
        localStorage.setItem(
          "newNotifications",
          JSON.stringify(this.newNotifications)
        );
      },
      (error) => {
        this.isLoader = false;
        this._RfqService.handleError(error);
      },

      () => { }

    );
  }

  getPercentageClass(percentCount: number) {
    const myStyles = {
      width: "" + percentCount + "%",
    };
    return myStyles;
  }
  getRatingStar() {
    this.isLoader = true;
    const contactID = this.loggedCompanyId;
    this._SupplierService.getRatingStar(contactID).subscribe(
      (result) => {
        this.isLoader = false;
        this.avgNoOfStars = result.data.avgNoOfStars
          ? result.data.avgNoOfStars
          : 0;
        this.total1StarRatingPer = result.data.total1StarRatingPer
          ? result.data.total1StarRatingPer
          : 0;
        this.total2StarRatingPer = result.data.total2StarRatingPer
          ? result.data.total2StarRatingPer
          : 0;
        this.total3StarRatingPer = result.data.total3StarRatingPer
          ? result.data.total3StarRatingPer
          : 0;
        this.total4StarRatingPer = result.data.total4StarRatingPer
          ? result.data.total4StarRatingPer
          : 0;
        this.total5StarRatingPer = result.data.total5StarRatingPer
          ? result.data.total5StarRatingPer
          : 0;
        this.totalReviews = result.data.totalReviews
          ? result.data.totalReviews
          : 0;
      },
      (error) => {
        this.isLoader = false;
      },

      () => { }

    );
  }
  getNPSRatings() {
    this.isLoader = true;
    const contactID = this.loggedId;
    this._SupplierService.getNPSRatings(contactID).subscribe(
      (result) => {
        this.isLoader = false;
        this.iTempNPSDataModel = result;
        if (this.iTempNPSDataModel.nps === null) {
          this.enableMeterFields = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ];
        } else {
          this.enableMeterFields[0] = !(this.iTempNPSDataModel.nps < -99);
          this.enableMeterFields[1] = !(this.iTempNPSDataModel.nps < -56);
          this.enableMeterFields[2] = !(this.iTempNPSDataModel.nps < -28);
          this.enableMeterFields[3] = !(this.iTempNPSDataModel.nps < 0);
          this.enableMeterFields[4] = !(this.iTempNPSDataModel.nps < 28);
          this.enableMeterFields[5] = !(this.iTempNPSDataModel.nps < 56);
          this.enableMeterFields[6] = !(this.iTempNPSDataModel.nps < 99);
        }
      },
      (error) => {
        this.isLoader = false;
        this._RfqService.handleError(error);
      },

      () => { }

    );
  }

  getBuyerLocation() {
    const count = this._RfqService.get("ITerritoryClassificationModelColl");
    if (count !== undefined) {
    } else {
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          this._RfqService.set(data2, "ITerritoryClassificationModelColl");
        },
        (error) => () => {
          this._RfqService.handleError(error);
        },

        () => { }

      );
    }
  }
  getBarClass(rate) {
    if (rate) {
      return "percentage percentage-" + Math.round(rate);
    } else {
      return "bar";
    }
  }
  getLeadStreamCounts() {
    this._masterService
      .getLeadStreamCount(this.iLeadStreamDashboardRollUpViewModel)
      .subscribe((data) => {
        if (data.result === true) {
          this.profileCount = data.data.profile;
          this.messageCount = data.data.message;
          this.internetCount = data.data.internet;
          this.websiteCount = data.data.website;
          this.phoneCount = data.data.phone;
          this.emailCount = data.data.email;
          this.specialInviteCount = data.data.specialInvite;
          this.viewedQuoteCount = data.data.viewedQuote;
          this.readMessageCount = data.data.readMessage;
          this.buyerAwardRfqCount = data.data.rfqAwarded;
          this.communityProfileCount = data.data.communityProfile;
          this.communityPhoneCount = data.data.communityPhone;
          this.communityEmailCount = data.data.communityEmail;
          this.communityRfqCount = data.data.communityDirectRfq;
          this.communityWebSiteCount = data.data.communityWebsite;
          this.profileViewCount = data.data.inAppProfileView;
          this.communityProfileLikeCount = data.data.communityLikeDislike;
          this.communityPhotosCount = data.data.communityPhotos;
          this.communityJobsCount = data.data.communityJobs;
          this.viewed3DTourCount = data.data.viewed3DTour;
          this.allActivityCount =
            this.profileCount +
            this.messageCount +
            this.internetCount +
            this.websiteCount +
            this.phoneCount +
            this.emailCount +
            this.specialInviteCount +
            this.viewedQuoteCount +
            this.readMessageCount +
            this.buyerAwardRfqCount +
            this.communityProfileCount +
            this.communityPhoneCount +
            this.communityEmailCount +
            this.communityRfqCount +
            this.communityWebSiteCount +
            this.profileViewCount +
            this.communityProfileLikeCount +
            this.communityPhotosCount +
            this.communityJobsCount +
            this.viewed3DTourCount;
        }
      });
  }
  getAccountPastBillMessage() {
    this._SupplierService
      .getPastBillStatus(this.loggedCompanyId)
      .subscribe((data) => {
        if (data.result) {
          this.accountPastBillMessage = data.data.message
            ? data.data.message
            : null;
        }
      });
  }

  closePastbillBanner() {
    let loggedCompanyId = this.loggedCompanyId;
    this._SupplierService
      .ClosePastDueBillBanner(loggedCompanyId)
      .subscribe((res) => {
        this.accountPastBillMessage = null;
      });
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
  getProfileModel() {
    if (this._RfqService.get("showCapabilityModel")) {
      this.showCapability = true;
    }
    if (this._RfqService.get("showCapabilityModel") == false) {
      this.showCapability = false;
    }
    if (this._RfqService.get("ismyrfqdataback")) {
      this.showCapability = false;
      this._RfqService.set(false, "ismyrfqdataback");
    }
    if (this._RfqService.get("isCustomer")) {
      this._RfqService.set(false, "isCustomer");
      this.isCustomer = true;
    }
    if (this._RfqService.get("showUpgradModel")) {
      this._RfqService.set(false, "showUpgradModel");
      this.upgradeClick(false); //imp
    }
  }
  /* This function is called when click on Upgrade to quote button to open the modal */
  upgradeClick(isQuotingRfq) {
    this.isQuoteRfq = isQuotingRfq;
    this.showUpgradeAccountModal = true;
  }
  /* This function is used to close the Upgrade Account Modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  navigateTo() {
    let isQmsActive = localStorage.getItem("isMqsEnabled");
    if (isQmsActive == "true") {
      this.router.navigate(["qms/createquotes"]);
    }
  }
  isMessageRfqPanel() {
    return this._RfqService.get("isBuyerMessage");
  }
  isRfqDrawer() {
    return this._RfqService.get("rfqDetailDrawer");
  }
  isSidePanel() {
    return this._RfqService.get("showSidePanel");
  }
  isBuyerCommpleteProfile() {
    return this._RfqService.get("isBuyerCommpleteProfile");
  }
  getCurrentRfqId() {
    return this._RfqService.get("rfqId");
  }
  isBuyerMiniProfile() {
    return this._RfqService.get("isBuyerMiniProfile");
  }
  goBack() {
    let isManufSelectType = localStorage.getItem("isManufSelectType");
    let backToPreviousPage = localStorage.getItem("urlToRedirect");
    localStorage.removeItem("pageName1");
    if (
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
    }
    this._RfqService.set(false, "isBuyerCommpleteProfile");
    this._RfqService.set(false, "showSidePanel");
    this._RfqService.set(false, "rfqDetailDrawer");
    this._RfqService.set(false, "isBuyerMiniProfile");
  }
  isModelShow() {
    return this._RfqService.get("isModelShow");
  }
  redirectToProduct() {
    window.open(
      "https://www.mfg.com/community/wp-content/uploads/MFG_MFGLinkedin_8.5x11.pdf",
      "_blank"
    );
  }

  showNoPublishModelChange(val) {
    if (val) {
      this.showNoPublishModel = true;
    } else {
      this.showNoPublishModel = false;
    }
    this.showPublishModel = false;
  }
  showPublishModelChange(val) {
    if (val) {
      this.showPublishModel = true;
    } else {
      this.showPublishModel = false;
    }
    this.showNoPublishModel = false;
  }
  requstDemo() {
    this.iRequestDemoLinkModel.supplierId =
      this.SupplierDashListModel.contactId;
    this.iRequestDemoLinkModel.activityId = 10;
    this.iRequestDemoLinkModel.value = localStorage.getItem("User2");
    this._masterService
      .requestDemoLink(this.iRequestDemoLinkModel)
      .subscribe((response) => {
        if (!response.isError) {
          this._toastr.success(
            "An email has been sent to the sales team and they will get back to you",
            "Success!"
          );
        } else {
          this._toastr.warning(
            "Something went wrong. Please try later",
            "Warning!"
          );
        }
      });
  }
  profileChange(evt) {
    if (evt) {
      this._SupplierService
        .getSupplierPublishProfileStatus(this.loggedCompanyId)
        .subscribe((response) => {
          if (!response.isError) {
            if (
              response.data.isProfileComplete &&
              !response.data.isProfileApprovedByVision &&
              !response.data.isSubmittedForPublish
            ) {
              this.showPublishModel = true;
            }
          }
        });
    }
  }
  closeOrderPopup() {
    this._rfqService.saveOrderManagement(this.loggedId).subscribe(
      (response) => {
        this.showOrder = false;
      },
      (error) => {
        console.log("err", error);
      },

      () => { }

    );
  }
  getPublicProfileStatus() {
    this._SupplierService
      .getSupplierPublishProfileStatus(this.loggedCompanyId)
      .subscribe((response) => {
        if (!response.isError) {
          if (response.data.isProfileApprovedByVision) {
            this.showProgressModel = true;
          } else {
            this.showProgressModel = false;
          }
        }
      });
  }
  getEmailVerificationStatus() {
    this.userType = localStorage.getItem("Usertype");
    if (this.userType === "Supplier") {
      this._masterService
        .getEmailVerificationStatus(this.loggedId)
        .subscribe((response) => {
          if (!response.isError) {
            this.accountVerifyMessage = !response.data;
          }
        });
    }
  }

  sendVerificationLink() {
    this._masterService
      .sendVerificationLink(this.loggedId)
      .subscribe((response) => {
        if (!response.isError) {
          this._toastr.success("Verification mail has been sent.", "Success!");
        } else {
          this._toastr.warning(
            "Something went wrong. Please try later",
            "Warning!"
          );
        }
      });
  }

  openUpgradeToSilverModel() {
    this.showSilverUpgradeModal = true;
  }
  /* This function is used to close the Upgrade Silver Modal */
  closeSilverModal(e) {
    this.showSilverUpgradeModal = false;
  }

  reloadAdminComp(event) {
    this.router.navigate(["/supplier/profile"]);
  }
  // Check the tile availability from the backend
  checkTileAvailability() {
    const contactId = this.loggedId;
    const companyId = this.loggedCompanyId;
    this._SupplierService.getTileAvailability(contactId, companyId).subscribe(
      (result) => {
        if (result) {
          this.isUnlockRfqCount = result[0].unlockRfqCount;
          this.unlockRfqCountDefaultValue = result[0].unlockRfqCountDefaultValue;
          this.noOfDaysLeft = result[0].noOfDaysLeft;
          this.isStarterPackageTaken = result[0].isStarterPackageTaken;
          this.isStarterFreeTrialTaken = result[0].isStarterFreeTrialTaken;
          this.isGrowthPackageTaken=result[0].isGrowthPackageTaken;
          this.showMagicLeadList = result[0].showMagicLeadList;
          this.cancellationRequested = result[0].cancellationRequested;
          
        


          localStorage.setItem(
            "isStarterPackageTaken",
            result[0].isStarterPackageTaken
          );
          localStorage.setItem(
            "isStarterFreeTrialTaken",
            result[0].isStarterFreeTrialTaken
          );
          if (
            result[0].isEligibleForGrowthPackage === 1 &&
            result[0].isGrowthPackageTaken === 0 &&
            this.isStarterPackageTaken === false
          ) {
            this.starterPackage = true;
          } else {
            this.starterPackage = false;
          }

          localStorage.setItem(
            "GrowthnoOfDaysLeft",
            this.noOfDaysLeft.toString()
          );
          localStorage.setItem(
            "UnlockRfqCount",
            this.isUnlockRfqCount.toString()
          );
          if (this.isUnlockRfqCount > 0) {
            this.remainingStatus = true;
            this.refreshCountShowStatus = false;
          } else if (this.isUnlockRfqCount === 0) {
            this.refreshCountShowStatus = true;
            this.remainingStatus = false;
          }
          if (
            result[0].isEligibleForGrowthPackage === 1 &&
            result[0].isGrowthPackageTaken !== 1 &&
            result[0].isStarterPackageTaken === false
          ) {
            this.isEligibleForGrowthPackage = true;
            localStorage.setItem("isEligible", this.isEligibleForGrowthPackage);
            this.isReadyForMoreImg = false;
          } else if (
            result[0].isEligibleForGrowthPackage === 1 &&
            result[0].isGrowthPackageTaken === 1
          ) {
            this.isEligibleForGrowthPackage = false;
            localStorage.setItem("isEligible", this.isEligibleForGrowthPackage);
            this.isRemainingTileShow = true;
          } else {
            this.isEligibleForGrowthPackage = false;
            localStorage.setItem("isEligible", this.isEligibleForGrowthPackage);
            this.isRemainingTileShow = false;
          }
        }
      },
      (error) => {
        console.log("err", error);
      },

      () => { }

    );
  }

  // This Function will close the modal
  closeGrowthSuccessModal() {
    this.showSuccessGrowthModal = false;
    localStorage.setItem("GrowthPackageMode", "");
    // AccountType
    this.updatePaymentPageStatus();
    this.checkTileAvailability();
  }

  // This function will redirect to the quote
  startQuote() {
    this.showSuccessGrowthModal = false;
    localStorage.setItem("GrowthPackageMode", "");
    localStorage.setItem("AccountType", "Growth Package");
    this.updatePaymentPageStatus();
  }
  // This function will update the api of payment success
  updatePaymentPageStatus() {
    const requestData = {
      companyId: this.loggedCompanyId,
      isSuccess: 1,
    };
    localStorage.setItem("AccountType", "Growth Package");
    //

    this._profileService
      .updatePaymentPage(requestData)
      .subscribe((response) => {
        if (response) {
          localStorage.setItem(
            "IsPremium",
            this._profileService.encrypt(JSON.stringify(true)).toString()
          );
          this.router
            .navigateByUrl("", { skipLocationChange: true })
            .then(() => {
              this.router.navigate(["/dashboard/supplier/ecommerce"]);
            });
        }
      });
  }
  goRfqDetailsPage() {
    if (this.rfdIdToSet === undefined) {
      this.rfdIdToSet = localStorage.getItem("rfqid");
    }
    const data = {
      companyId: this.loggedCompanyId,
      rfqId: parseInt(this.rfdIdToSet),
      unlockBy: this.loggedId,
    };
    this._SupplierService
      .GrowthPackageUnlockRFQsInfo(data)
      .subscribe((result) => {
        const encryptedRfqID = this._profileService.encrypt(this.rfdIdToSet);
        this.router.navigate(["/supplier/supplierRfqDetails"], {
          queryParams: { rfqId: encryptedRfqID },
        });
      });   
  }
  goBackbutton() {
    this.router.navigate(["/supplier/supplierMyRfq"]);
  }

  // ****** Active Starter package on click of starter ******
  starterPackageActive() {
    this.isStarterPackage = true;
    this.isGrowthPackage = false;
    localStorage.setItem("isStarterPackage", this.isStarterPackage);
    localStorage.setItem("isGrowthPackage", this.isGrowthPackage);
    localStorage.setItem("isPremiumClicked", "false");
    this.mixPanelTracking("starterTile")

  }
  // ****** Active Growth package on click of starter ******
  growthPackageActive() {
    this.isStarterPackage = false;
    this.isGrowthPackage = true;
    localStorage.setItem("isStarterPackage", this.isStarterPackage);
    localStorage.setItem("isGrowthPackage", this.isGrowthPackage);
    localStorage.setItem("isPremiumClicked", "false");
    this.mixPanelTracking("growthTile")

  }

  // ****** Up grade plane redirection ******
  upgradePlan() {
    this.showUpgradeAccountModal = true;
    if (this.accountType === "Growth Package") {
      this.showUpgradeAccountModal = true;
    }
    if (this.accountType === "Starter") {
      this.router.navigate(["/packages"]);
    }
  }

  redirectToMaterials() {
    this.mixPanelTracking('materialsTileClicked');
    this.router.navigateByUrl("/materialquoterequest")
  }

  


  subscribedMaterialRedirection(){
    let materialUrl = environment.RedirectToMaterialPage ;
    var reqData = {
      email: localStorage.getItem("User2"),
      jwtToken: this.generatedToken,
    };
    this._rfqService.savingJwtToken(reqData).subscribe((result: any) => {
      localStorage.removeItem('materialsReferer')
      window.location.href = materialUrl  +"?token=" + this.generatedToken +"&subscribed=1";
    });

    
  }

  //This f(x) is called to save the JWT token and then redirect to materials page
  redirectToMaterial() {
    let materialUrl = environment.RedirectToMaterialPage ;
    var reqData = {
      email: localStorage.getItem("User2"),
      jwtToken: this.generatedToken,
    };
    this._rfqService.savingJwtToken(reqData).subscribe((result: any) => {
      window.location.href = materialUrl + "?token=" + this.generatedToken;
    });
  }



  mixPanelTracking(ev) {
    const submitModel = JSON.parse(localStorage.getItem("iContactViewModel"));
    var reqData = {
      "email": localStorage.getItem("User2"),
      "event": ev,
      "host": environment.AppUrl,
      "path": this.href,
      "ip": this.ipAddress,
      "browser": this.browser,
      "os": this.os,
      "supplierName": submitModel.firstName + " " + submitModel.lastName,
    }
    this._rfqService.mixPanelStarter(reqData).subscribe((result: any) => {
      console.log(result);
    });
  }
  trackMixpanelSupplierDashboard(){
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_LAND_ON_DASHBOARD,{
    user_status: 'Logged in',
    page_type:'Dashboard',
    page_url: environment.AppUrl + "#/dashboard/supplier/ecommerce"
    });
  }
  isPremiumClicked(){
    localStorage.setItem("isPremiumClicked", "true");
    localStorage.setItem("isStarterPackage", "false");
    localStorage.setItem("isGrowthPackage", "false");
  }
  setRecommnededForYouBanner(){
    localStorage.setItem("isStarterPackage", null);
    localStorage.setItem("isGrowthPackage", null);
    localStorage.setItem("isPremiumClicked", null);
  }
}
