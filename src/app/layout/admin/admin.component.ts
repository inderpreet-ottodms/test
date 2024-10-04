import {  AUTO_STYLE,  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as signalR from "@aspnet/signalr";
import { HubConnection } from "@aspnet/signalr";
import { NotificationsService } from "angular2-notifications";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { openFullscreen } from "../../../assets/javascript/demo";
import { environment } from "../../../environments/environment";
import { appConstants } from "../../core/config/constant";
import {
  IAccountModel,
  IAddressModel,
  ICompanyModel,
  ICompanyShippingSiteViewModel,
  IContactViewModel,
  ILanguageModel,
  ILoginAccountModel,
  ILoginNewUserModel,
  INewUserModel,
  IPostRegisterAccountModel,
  Iuser,
} from "../../core/models/accountModel";
import { ICountryViewModel, IMessageHubModel } from "../../core/models/globalMaster";
import { ISourcingAdvisorModel } from "../../core/models/profileModel";
import {
  IMarkSupplierRFQViewModel,
  IRatingResponseViewModel,
} from "../../core/models/rfqModel";
import { IMyAccountViewModel } from "../../core/models/supplierProfileModel";
import { AccountService } from "../../core/services/account/account.service";
import { MasterService } from "../../core/services/master/master.service";
import { AppMessageService } from "../../core/services/messages/message.service";
import { ProfileService } from "../../core/services/profile/profile.service";
import { RfqService } from "../../core/services/rfq/rfq.service";
import { SessionExpireService } from "../../core/services/session-expire/session-expire.service";
import { SupplierService } from "../../core/services/supplier/supplier.service";
import { CustomValidatorService } from "../../core/services/validator/custom-validator.service";
import { MenuItems } from "../../shared/menu-items/menu-items";
declare var window;

import { HttpClient } from "@angular/common/http";
import { AppUtil } from "../../../app/app.util";
import { JwtTokenService } from "../../../app/component/SSO/services/jwt-token.service";
import { BrowserStorageUtil } from "../../../app/shared/browser.storage.util";
import { IpService } from "../../../app/v2/shared/ip.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  providers: [JwtTokenService],
  animations: [
    trigger("notificationBottom", [
      state(
        "an-off, void",
        style({
          overflow: "hidden",
          height: "0px",
        })
      ),
      state(
        "an-animate",
        style({
          overflow: "hidden",
          height: AUTO_STYLE,
        })
      ),
      transition("an-off <=> an-animate", [animate("400ms ease-in-out")]),
    ]),
    trigger("slideInOut", [
      state(
        "in",
        style({
          width: "300px",
        })
      ),
      state(
        "out",
        style({
          width: "0",
        })
      ),
      transition("in => out", animate("400ms ease-in-out")),
      transition("out => in", animate("400ms ease-in-out")),
    ]),
    trigger("mobileHeaderNavRight", [
      state(
        "nav-off, void",
        style({
          overflow: "hidden",
          height: "0px",
        })
      ),
      state(
        "nav-on",
        style({
          height: AUTO_STYLE,
        })
      ),
      transition("nav-off <=> nav-on", [animate("400ms ease-in-out")]),
    ]),
    trigger("fadeInOutTranslate", [
      transition(":enter", [
        style({
          opacity: 0,
        }),
        animate(
          "400ms ease-in-out",
          style({
            opacity: 1,
          })
        ),
      ]),
      transition(":leave", [
        style({
          transform: "translate(0)",
        }),
        animate(
          "400ms ease-in-out",
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class AdminComponent implements OnInit, OnDestroy {
  rfqForm2Enabled: any = false;
  private _hubConnection: HubConnection;
  iMessageHubModelList: Array<IMessageHubModel> = [];
  iMessageHubModel: IMessageHubModel;
  iContactViewModel: IContactViewModel;
  iContactViewModel1: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  iNewUserModel: INewUserModel;
  iLoginNewUserModel: ILoginNewUserModel;
  registerSupplierForm: FormGroup;
  iuser: Iuser;
  labelFocus: string;
  header: string;
  showBell: boolean;
  showMessage: boolean;
  selectedItems = [];
  supplierLogoPath = "assets/company/avatar-manu-basic.svg";
  iCompanyShippingSiteViewModel: ICompanyShippingSiteViewModel;
  iAccountModel: IAccountModel;
  iLoginAccountModel: ILoginAccountModel;
  iPostModel: IPostRegisterAccountModel;
  countrysettings = {};
  timeOut = 5000;
  applicableRoles: string[];
  messageCount: number;
  notoficationCount: number;
  showProgressBar = false;
  pauseOnHover = true;
  lastOnBottom = true;
  isCountAvailable: boolean;
  clickToClose = true;
  isCountryMultiSelectTouched = false;
  errorOnCountryMultiSelect = false;
  maxLength = 0;
  maxStack = 8;
  userCreatedDateString = " ";
  preventDuplicates = false;
  preventLastDuplicates = false;
  theClass: string = "";
  rtl = false;
  animate = "fromRight";
  icons: string = "";
  subType = "success";
  Popuptitle = "";
  Popupmsg = "";
  isAdminUser: boolean;
  rolName: string;
  npsRatingPopupTitle = "";
  isNPSPupupShow = false;
  isAccountUpgradeReqSent = false;
  accountUpgradeMessage = "";
  ratingsPopupLogoPath = "";
  iContactViewModelNPSModel: IContactViewModel;
  iCompanyModelNPSModel: ICompanyModel;
  currentlogoPath: string;
  logoPathToShow: string;
  defaultAwsPath = "";
  radio1: number;
  fromContactOfMessage: number;
  toContactOfMessage: number;
  iRatingResponseViewModel: IRatingResponseViewModel;
  isCompanyIdPresent: boolean;
  toShowBillingMenu: boolean = false;
  showScheduleDemo: boolean = false;
  public options = {
    position: ["top", "right"],
    maxStack: this.maxStack,
    timeOut: this.timeOut,
    showProgressBar: this.showProgressBar,
    pauseOnHover: this.pauseOnHover,
    lastOnBottom: this.lastOnBottom,
    clickToClose: this.clickToClose,
    maxLength: this.maxLength,
    preventDuplicates: this.preventDuplicates,
    preventLastDuplicates: this.preventLastDuplicates,
    theClass: this.theClass,
    rtl: this.rtl,
    animate: this.animate,
    icons: this.icons,
    title: this.Popuptitle,
    msg: this.Popupmsg,
  };
  public navType: string;
  public themeLayout: string;
  public verticalPlacement: string;
  iSourcingAdvisorModel: ISourcingAdvisorModel;
  public verticalLayout: string;
  public pcodedDeviceType: string;
  public verticalNavType: string;
  public verticalEffect: string;
  public vnavigationView: string;
  public freamType: string;
  public sidebarImg: string;
  public sidebarImgType: string;
  public layoutType: string;

  public headerTheme: string;
  public pcodedHeaderPosition: string;

  public liveNotification: string;
  public liveNotificationClass: string;

  public profileNotification: string;
  public profileNotificationClass: string;

  public chatSlideInOut: string;
  public innerChatSlideInOut: string;

  public searchWidth: number;
  public searchWidthString: string;

  public navRight: string;
  public windowWidth: number;
  public chatTopPosition: string;

  public toggleOn: boolean;
  public navBarTheme: string;
  public activeItemTheme: string;
  public pcodedSidebarPosition: string;

  public menuTitleTheme: string;
  public dropDownIcon: string;
  public subItemIcon: string;
  iCountryColl: ICountryViewModel[];
  public configOpenRightBar: string;
  public displayBoxLayout: string;
  public isVerticalLayoutChecked: boolean;
  public isSidebarChecked: boolean;
  public isHeaderChecked: boolean;
  public headerFixedMargin: string;
  public sidebarFixedHeight: string;
  public itemBorderStyle: string;
  public subItemBorder: boolean;
  public itemBorder: boolean;
  public loggedUsername: string;
  public loggedUserRole: string;
  iRFQViewModelColl: IMarkSupplierRFQViewModel;
  public config: any;
  userType: string;
  buyerSupplier: boolean;
  SupplierBuyer: boolean;
  isSupplier: boolean;
  isPaidContract: string;
  iMyAccountViewModel: IMyAccountViewModel;
  isLoader: boolean;
  isUpgradeBtn: boolean;
  isAccountUpgradereqSent: boolean;
  accountUpgradereqMessage: string;
  isDownloadReceipt: boolean;
  isMQSEnable: string;
  disabled: boolean;
  modalSubscription: Subscription;
  year = new Date().getFullYear();
  toShowContactModel: boolean = false;
  disabledButton: boolean = false;
  isNotificationLoader: boolean = false;
  loading: boolean = false;
  toShowNewIcon = false;
  showSessionModel: boolean = false;
  subscribeRef: Subscription;
  timer: any;
  isCount: number = 0;
  isReadyForMoreImg: boolean = false;
  isEligibleForGrowthPackage: any;
  isQuoteRfq: boolean;
  showUpgradeAccountModal: boolean;
  remainingStatus: boolean = false;
  refreshCountShowStatus: boolean = false;
  showCommunityMenu = true;
  toShowCommunityMenu: boolean = false;
  userLocation: string = null;
  communityMenu = [];
  toShowLeftImg: boolean = false;
  ipAddress: string;
  communityMenuFull: any;
  newMessageCount: number = 0;
  newNotifications: number = 0;
  isVisionUser: any;
  willDoLaterCount: any;
  isGetSubmited: boolean = false;
  noOfDaysLeft: number = 0;
  isRemainingTileShow: boolean;
  accountType: string;
  generatedToken: any;
  unlockedRfq: any;
  showUnlockRfq: boolean;

  //showFollowedBuyerRfqsLeftMenu: boolean;
  showMfgContactRfqsLeftMenu: boolean;
  sidebarFixedNewHeight: string;

  constructor(
    private jwtTokenService: JwtTokenService,
    private _SupplierService: SupplierService,
    public menuItems: MenuItems,
    private router: Router,
    private _ProfileService: ProfileService,
    private _toastr: ToastrService,
    private _RfqService: RfqService,
    private servicePNotify: NotificationsService,
    private _messageService: AppMessageService,
    private _masterService: MasterService,
    private _fb: FormBuilder,
    private _accountService: AccountService,
    private _customValidatorsService: CustomValidatorService,
    private _supplierService: SupplierService,
    private _ngZone: NgZone,
    private _rfqService: RfqService,
    private _profileService: ProfileService,
    private sessionExpireService: SessionExpireService,
    private http: HttpClient,
    private ipService: IpService
  ) {
    this._RfqService.set(false, "isSideMenuVisible");
    this.iMessageHubModelList = [];
    this.initJobPostingModel();
    this.GetProfileDetails();
    this.getSubmittedRFQCount();
    this.navType = "st2";
    this.isCountAvailable = false;
    this.isCompanyIdPresent = false;
    this.disabled = false;
    this.labelFocus = "no";
    this.showBell = false;
    this.showMessage = false;
    this.themeLayout = "vertical";
    this.verticalPlacement = "left";
    this.verticalLayout = "wide";
    this.pcodedDeviceType = "desktop";
    this.verticalNavType = "expanded";
    this.verticalEffect = "shrink";
    this.vnavigationView = "view1";
    this.freamType = "theme1";
    this.sidebarImg = "false";
    this.sidebarImgType = "img1";
    this.layoutType = "light";
    this.messageCount = 0;
    this.notoficationCount = 0;
    this.headerTheme = "themelight5";
    this.pcodedHeaderPosition = "fixed";
    localStorage.setItem("NotifiClicked", "false");
    this.liveNotification = "an-off";
    this.profileNotification = "an-off";

    this.chatSlideInOut = "out";
    this.innerChatSlideInOut = "out";

    this.searchWidth = 0;

    this.navRight = "nav-on";

    this.windowWidth = window.innerWidth;
    this.setHeaderAttributes(this.windowWidth);
    this.showUpgradeAccountModal = false;

    this.toggleOn = true;
    this.navBarTheme = "themelight1";
    this.activeItemTheme = "theme10";
    this.pcodedSidebarPosition = "fixed";
    this.menuTitleTheme = "theme1";
    this.dropDownIcon = "style3";
    this.subItemIcon = "style7";
    this.displayBoxLayout = "d-none";
    this.isVerticalLayoutChecked = false;
    this.isSidebarChecked = true;
    this.isHeaderChecked = true;
    this.headerFixedMargin = "75px";
    this.isAdminUser = false;
    let IsPremiumEncrypt = localStorage.getItem("IsPremium");
    this.isPaidContract = this._profileService.decrypt(IsPremiumEncrypt);
    this.itemBorderStyle = "none";
    this.subItemBorder = true;
    this.itemBorder = true;
    this.buyerSupplier = false;
    this.SupplierBuyer = false;
    this.setMenuAttributes(this.windowWidth);
    this.setHeaderAttributes(this.windowWidth);
    this.loggedUsername = localStorage.getItem("User2");
    this.userType = localStorage.getItem("Usertype");
    this.isVisionUser = localStorage.getItem("isLoginFromVision");
    this._accountService.getMessage().subscribe((message) => {
      if (message) {
        this._ngZone.run(() => {
          this.userType = localStorage.getItem("Usertype");
          this.loggedUserRole = this.userType;
          this.applicableRoles = JSON.parse(
            localStorage.getItem("applicableRoles")
          );
          this._RfqService.set("", "CompanyName");
          this._RfqService.set(0, "companyId");
          let IsPremiumEncrypt = localStorage.getItem("IsPremium");
          this.isPaidContract = this._profileService.decrypt(IsPremiumEncrypt);
          this.logoPathToShow = "";
          this.applicableRole();
          this.GetProfileDetails();
          this.isAdmin();
        });
      }
    });
    this.applicableRoles = JSON.parse(localStorage.getItem("applicableRoles"));
    this.applicableRole();
    this.isAdmin();
    this.iRFQViewModelColl = {
      rfqId: 0,
      rfqName: "",
      contactIdEncrypt: "",
      awardRfqPendingAcceptenceCount: 0,
      buyerContactId: 0,
      declineQuotesCount: 0,
      ndaToApproveCount: 0,
      ndaToSignRequireResignCount: 0,
      ndaToSignSupplierDeclinedCount: 0,
      quotesInProgressRfqCount: 0,
      specialInvitedRfqUnreadCount: 0,
      contactId: 0,
      isRfqDisLike: false,
      rfqStatusId: 0,
      rfqStatus: "",
      rfqCreatedOn: "",
      quotesNeededBy: null,
      awardDate: "",
      partsPrimaryFileName: "",
      partName: "",
      partQty: 0,
      partQtyUnit: "",
      partsMaterialName: "",
      partCategoryName: "",
      postProductionProcessName: "",
      buyerName: "",
      errorMessage: "",
      result: false,
      allRfqCount: 0,
      likedRfqCount: 0,
      specialInviteRfqCount: 0,
      quotesRfqCount: 0,
      awardedRfqCount: 0,
      newMessages: 0,
      reQuoteRfq: 0,
      followedBuyersRfqCount: 0,
      awardDeclinedCount: 0,
      ndaBuyerDeclined: 0,
      ndaRequireResign: 0,
      rfqType: "",
      isRfqLike: false,
      npsScore: 0,
      rfqThumbnail: "",
      companyLogoPath: "",
      companyName: "",
      specialInstructions: "",
      profileViewCount: 0,
      markForQuotingCount: 0,
      newQuotesCount: 0,
      city: "",
      country: "",
      state: "",
      unviewedMagicLeadsCount: 0,
      manufacturingLocationId: 0,
      manufacturingLocation: "",
      deliveryDate: "",
      newNotifications: 0,
    };

    this.loggedUserRole = localStorage.getItem("Usertype");
    this.npsRatingPopupTitle = "";
    this.isNPSPupupShow = false;
    this.isAccountUpgradeReqSent = false;
    this.accountUpgradeMessage = "";
    this.radio1 = 0;
    this.isAccountUpgradereqSent = false;
    this.isDownloadReceipt = false;
    this.isLoader = false;
    this.isUpgradeBtn = false;
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
      pageName: "admin component",
      rfqId: 0,
      toAlternateEmailId: "",
    };
    this.menuHeadrsAsPerRole();
  }

  menuHeadrsAsPerRole() {
    if (this.isBuyerProfile() === "Buyer") {
      this.communityMenuFull = [
        {
          name: "For Buyers",
          isActive: false,
          page: "",
          redirectable: true,
          title: "mnu_community",
          toShow: true,
          child: [
            {
              name: "Request a Custom Part Quote",
              page: "",
              title: "mnu_RFQ_Marketplace",
              toShow: false,
              redirectToCreateRfq: true
            },
            {
              name: "Manufacturer Directory",
              isActive: false,
              page: "manufacturer-directory",
              redirectable: true,
              title: "mnu_find_a _manufacturer",
              toShow: false,
              isManufac: true,
              child: [
                {
                  name: "Search directory",
                  page: "",
                  title: "mnu_Search_directory",
                  toShow: false,
                  reDirectToSearchManufacturer: true,
                  reDirectToUsManufacturer: false,
                },
                {
                  name: "Asian Manufacturers",
                  page: "",
                  title: "mnu_Asian_Manufacturers",
                  toShow: false,
                  reDirectToAsianManufacturer: true,
                },
                {
                  name: "Canadian Manufacturers",
                  page: "",
                  title: "mnu_Canadian_Manufacturers",
                  toShow: false,
                  reDirectToCanadianManufacturer: true,
                },
                {
                  name: "European Manufacturers",
                  page: "",
                  title: "mnu_European_Manufacturers",
                  toShow: false,
                  reDirectToEuropeanManufacturer: true,
                },
                {
                  name: "Mexico / South America Manufacturers",
                  page: "",
                  title: "mnu_Mexico_South_Africa_Manufacturers",
                  toShow: false,
                  reDirectToMexicanOrSouthAfricanManufacturer: true,
                },
                {
                  name: "U.S Manufacturers",
                  page: "",
                  title: "mnu_US_Manufacturers",
                  toShow: false,
                  reDirectToSearchManufacturer: false,
                  reDirectToUsManufacturer: true,
                },
              ],
            },
            {
              name: "Help Center",
              page: "",
              title: "mnu_helpCenter_buyer",
              toShow: false,
              reDirectToManufacturingHelpCenterBuyer: true,
            },
          ],
        }
      ];
    } else {
      this.communityMenuFull = [
        {
          name: "For Manufacturers",
          isActive: false,
          page: "for-manufacturers",
          redirectable: true,
          title: "mnu_for _manufacturer",
          toShow: true,
          child: [
            {
              name: "Quote Custom Parts",
              page: "",
              title: "mnu_custom_parts",
              toShow: false,
              child: [
                {
                  name: "Quote Now",
                  page: "",
                  title: "mnu_quote_now",
                  toShow: false,
                  reDirectToMarketPlacePulse: false,
                  reDirectToLiveRFQ: false,
                },
                {
                  name: "Recently Sourced",
                  page: "",
                  title: "mnu_recently_sourced",
                  toShow: false,
                  reDirectToMarketPlacePulse: true,
                  reDirectToLiveRFQ: false,
                },
                {
                  name: "Expiring Soon",
                  page: "",
                  title: "mnu_expiring_soon",
                  toShow: false,
                  reDirectToMarketPlacePulse: false,
                  reDirectToLiveRFQ: true,
                },
              ],
            },
            {
              name: "Search Manufacturer Directory",
              page: "",
              title: "mnu_search_manufac_directory",
              toShow: false,
              reDirectToSearchManufacturer: true,
            },
            {
              name: "Post Manufacturing Job",
              page: "",
              title: "mnu_post_manufac_job",
              toShow: false,
              isPostJob: true,
            },
            {
              name: "Help Center",
              page: "",
              title: "mnu_helpCenter_manufac",
              toShow: false,
              reDirectToManufacturingHelpCenterManuf: true,
            },
            {
              name: "MFG Materials",
              page: "",
              title: "mnu_material_manuf",
              toShow: false,
              redirectToMaterials: true,
            },
          ],
        },

        {
          name: "Get Materials",
          isActive: false,
          page: "GetMaterials",
          redirectable: true,
          title: "mnu_for_manufacturer",
          toShow: false,
       
        },
      ];
    }
    this.checkUserLocation();
  }

  checkSupplierRegistrationForms() {
    const firstName = this.registerSupplierForm.value.sFirstName;
    const lastName = this.registerSupplierForm.value.sLastName;
    const phoneNo = this.registerSupplierForm.value.sPhoneNo;
    const sCompany = this.registerSupplierForm.value.sCompany;
    const sCountryId = this.registerSupplierForm.value.scontryId;
    const sPostalCode = this.registerSupplierForm.value.sPostalCode;
    if (
      sCompany.trim() === "" ||
      sCountryId === 0 ||
      sCountryId === undefined ||
      sCountryId === "0" ||
      sCountryId.trim() === "" ||
      sPostalCode.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      phoneNo.trim() === ""
    ) {
      return true;
    } else {
      return false;
    }
  }
  full() {
    openFullscreen();
  }
  startHubConnection() {
    let token = "";
    let tokenValue = "";
    this.iMessageHubModelList = [];
    token = BrowserStorageUtil.getToken();
    if (token !== "") {
      tokenValue = "?token=" + token;
    }
    const dataUrl = environment.HubEndPoint;
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(dataUrl + `/notify${tokenValue}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this._hubConnection.start().catch((err) => console.log(err.toString()));

    this._hubConnection.on("BroadcastNotification", (data: any) => {
      //this.iMessageHubModelList = data.slice(0, 10);

      this.iMessageHubModel = data;
      this.showBell = true;
      this.getNotification("");
      this.notoficationCount = this.notoficationCount + 1;
      this.options.title = this.iMessageHubModel.userName;
      this.options.msg = this.iMessageHubModel.messageSubject;
      this._toastr.info(this.options.msg, this.options.title, {
        enableHtml: true,
      });
    });

    this._hubConnection.on("BroadcastMessage", (data: any) => {
      this.iMessageHubModel = data;
      this.showMessage = true;
      this.getNotification("");
      this.messageCount = this.messageCount + 1;
      this.options.title = this.iMessageHubModel.userName;
      this.options.msg = this.iMessageHubModel.messageSubject;
      this._toastr.info(this.options.msg, this.options.title, {
        enableHtml: true,
      });
      const date = this.iMessageHubModel.messageDate;
    });
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    const Id = localStorage.getItem("loggedCompanyId");
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem("loggedCompanyId"));
    } else {
      return 0;
    }
  }
  checkOnOpen() {
    this.isCountryMultiSelectTouched = true;
    this.setFocus("sCountryId");
  }
  onStateSelect(item: any) {
    this.iContactViewModel1.address.countryId = item.countryId;
    this.errorOnCountryMultiSelect = false;
  }

  createForm() {
    if (
      this.iContactViewModel1.company != null &&
      this.iContactViewModel1.company !== undefined
    ) {
      this.registerSupplierForm = this._fb.group({
        sFirstName: ["", Validators.required],
        sLastName: ["", Validators.required],
        sPhoneNo: ["", Validators.required],
        sCompany: [this.iContactViewModel1["company"].name],
        scontryId: ["", Validators.required],
        sPostalCode: ["", Validators.required],
      });
    } else {
      this.registerSupplierForm = this._fb.group({
        sFirstName: ["", Validators.required],
        sLastName: ["", Validators.required],
        sPhoneNo: ["", Validators.required],
        sCompany: [""],
        scontryId: ["", Validators.required],
        sPostalCode: ["", Validators.required],
      });
    }
  }
  onRegister() {
    if (
      this.iContactViewModel1.companyId === null ||
      this.iContactViewModel1.companyId === 0
    ) {
      this._toastr.error(
        "Please update Company details first from Contact Information section",
        "Error!"
      );
    } else {
      this.disabled = true;
      this.loading = true;
      this.iContactViewModel1.address.countryId =
        this.registerSupplierForm.value.scontryId;
      this.iContactViewModel1.address.postalCode =
        this.registerSupplierForm.value.sPostalCode;
      this.iContactViewModel1.firstName =
        this.registerSupplierForm.value.sFirstName;
      this.iContactViewModel1.lastName =
        this.registerSupplierForm.value.sLastName;
      this.iContactViewModel1.phoneNo =
        this.registerSupplierForm.value.sPhoneNo;
      if (this.userType === "Supplier") {
        this.iContactViewModel1.isBuyer = true;
        this.rolName = "BuyerAdmin";
      } else {
        this.iContactViewModel1.isBuyer = false;
        this.rolName = "SellerAdmin";
      }
      this.iContactViewModel1.userIpAddress = this.ipAddress;
      this._accountService.addConvertConatct(this.iContactViewModel1).subscribe(
        (res) => {
          localStorage.setItem(
            "applicableRoles",
            JSON.stringify(res.currentUserRole)
          );
          let IsPrimiumEncrypt = this._ProfileService.encrypt(
            JSON.stringify(res.contactViewModel.isPremium)
          );
          localStorage.setItem("IsPremium", IsPrimiumEncrypt.toString());
          this._toastr.success("New User Register Successfully !!", "");
          this.switchAccount(this.rolName);
        },
        (error) => {
          this._toastr.warning(error.error.errorMessage, "Warning!");
          this.disabled = false;
          this.loading = false;
        }
      );
    }
  }

  switchAccount(Role: string) {
    // this.getSubmittedRFQCount();
    this.isGetSubmited = true;
    const userId = localStorage.getItem("userId");
    if (
      userId !== "null" &&
      userId !== null &&
      userId !== undefined &&
      userId !== "undefined"
    ) {
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
            this.loading = false;
            this._ProfileService.getProfileForLoginDetails(data['contactIdEncrypt'].toString()).subscribe(
              result2 => {
                this.iContactViewModel = result2;
                localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
              });
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
            localStorage.removeItem("manufacturingLocation");
            localStorage.setItem(
              "manufacturingLocation",
              data.manufacturingLocation
            );
            this.checkUserLocation();
            localStorage.setItem(
              "applicableRoles",
              JSON.stringify(data.currentUserRole)
            );
            localStorage.setItem(
              "LoggedId",
              data.contactViewModel.contactId.toString()
            );
            localStorage.setItem(
              "LoggedIdEncript",
              data["contactIdEncrypt"].toString()
            );
            localStorage.setItem(
              "loggedCompanyId",
              data.contactViewModel.companyId.toString()
            );
            localStorage.setItem("iContactViewModel", null);
            if (data.contactViewModel.isRFQCreated === true) {
              localStorage.setItem("isNewUser", "false");
            } else {
              localStorage.setItem("isNewUser", "true");
            }
            if (data.contactViewModel.isBuyer === true) {
              this.isSupplier = false;
              localStorage.removeItem("AccountType");
              localStorage.setItem("isMqsEnabled", "false");
              localStorage.setItem("Usertype", "Buyer");
              this._accountService.sendMessage("Buyer");
              this.isSupplier = false;
              this.disabled = false;
              this.getEmailVerificationStatus();
              this.getSubmittedRFQCount();
            } else {
              appConstants.settingDefault.decimalValueDefault =
                data.defaultNoOfDecimalPlaces;
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
              this.isSupplier = false;
              this.disabled = false;
              // this.router.navigate(['dashboard/supplier/ecommerce']);
              this.router
                .navigateByUrl("", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["dashboard/supplier/ecommerce"]);
                });
              localStorage.setItem("Usertype", "Supplier");
              let IsPrimiumEncrypt = this._ProfileService.encrypt(
                JSON.stringify(data.contactViewModel.isPremium)
              );
              localStorage.setItem("IsPremium", IsPrimiumEncrypt.toString());
              localStorage.setItem(
                "isMqsEnabled",
                JSON.stringify(data.isMqsEnabled)
              );
              localStorage.setItem("AccountType", data.accountType);
              this._profileService.setopenSwitchRfqCapabilityModel(true);
              this._accountService.sendMessage("Supplier");
            }
            this._rfqService.setRfqAwardEvent(true);
            this.menuHeadrsAsPerRole();
          },
          (error) => {
            this.loading = false;
          }
        );
    } else {
      this.loading = false;
      this._toastr.warning(
        "Your session is expired. Please login again to continue.",
        "Warning!"
      );
      localStorage.clear();
      this.router.navigateByUrl("/auth/login/simple");
    }
    sessionStorage.removeItem("lastSurveyQuestionID");
  }

  resetNPSModuleModel() {
    this.iContactViewModelNPSModel = {
      isLike: false,
      accountEmail: "",
      website: "",
      addressId: 0,
      isLoginFromVision: false,
      originalContactPictureFile: "",
      originalLogoOfCompany: "",
      contactIdEncrypt: "",
      comments: "",
      token: "",
      companyId: 0,
      contactFunction: "",
      contactId: 0,
      createdOn: "",
      emailId: "",
      errorMessage: "",
      facebook: "",
      firstName: "",
      incotermId: 0,
      industry: "",
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: true,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: "",
      linkedIn: "",
      modifiedOn: "",
      password: "",
      phoneNo: "",
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: "",
      tweeter: "",
      userId: "",
      contactPictureFile: "",
      logoOfCompany: "",
      language: null,
      address: null,
      company: this.iCompanyModelNPSModel,
      isVarified: false,
      expiration: null,
      currentPassword: "",
      newPassword: "",
      isRFQCreated: false,
      grantType: "",
      refreshToken: "",
      googleImageUrl: "",
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: "",
    };
    this.iCompanyModelNPSModel = {
      companyId: 0,
      description: "",
      _3dTourUrl: "",
      dunsNumber: "",
      employeeCountRangeId: 1,
      employeeCountRange: "",
      errorMessage: "",
      isActive: true,
      name: "",
      companylogo: "",
      services: "",
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: "",
      supplierTypeId: 0,
    };
    this.iRatingResponseViewModel = {
      responseId: 0,
      fromId: 0,
      toId: 0,
      parentId: 0,
      contactName: "",
      imageURL: "",
      createdDate: "2018-12-13T07:52:13.433Z",
      score: "",
      comment: "",
      isLegacyRating: false,
      messageId: 0,
      isNotNowClicked: false,
      errorMessage: "",
      result: false,
      rfqId: 0,
    };
  }
  initJobPostingModel() {
    this.resetNPSModuleModel();
    this.iAccountModel = {
      contact_id: "",
      email: "",
      pwd: "",
      confirmPwd: "",
    };
    this.iNewUserModel = {
      token: "",
      errorMessage: "",
      contactViewModel: this.iContactViewModel,
      result: false,
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      applicableRoles: [],
      accountType: "",
      isMqsEnabled: false,
      manufacturingLocation: null,
    };

    this.iLoginNewUserModel = {
      errorMessage: "",
      token: "",
      contactId: 0,
      contactIdEncrypt: "",
      user: this.iuser,
      result: false,
      isRFQCreated: false,
      isBuyer: false,
      isBuyerDashboard: null,
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      applicableRoles: [],
      isPremium: false,
      accountType: "",
      isMqsEnabled: false,
      manufacturingLocation: null,
    };

    this.iuser = {
      accessFailedCount: 0,
      concurrencyStamp: "",
      email: "",
      emailConfirmed: false,
      firstName: "",
      id: "",
      importedCont_id: 0,
      lastName: "",
      lockoutEnabled: false,
      lockoutEnd: "",
      normalizedEmail: "",
      normalizedUserName: "",
      passwordHash: "",
      phoneNumber: "",
      phoneNumberConfirmed: false,
      securityStamp: "",
      twoFactorEnabled: false,
      userName: "",
    };
    this.iLoginAccountModel = {
      Email: "",
      Password: "",
    };
    this.iPostModel = {
      email: "",
      pwd: "",
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: "",
      website: "",
      addressId: 0,
      comments: "",
      originalContactPictureFile: "",
      originalLogoOfCompany: "",
      contactIdEncrypt: "",
      isLoginFromVision: false,
      companyId: 0,
      contactFunction: "",
      contactId: 0,
      createdOn: "",
      emailId: "",
      errorMessage: "",
      facebook: "",
      firstName: "",
      incotermId: 0,
      industry: "",
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: true,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: "",
      linkedIn: "",
      modifiedOn: "",
      password: "",
      phoneNo: "",
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: "",
      tweeter: "",
      userId: "",
      contactPictureFile: "",
      logoOfCompany: "",
      token: "",
      language: null,
      address: null,
      company: null,
      isVarified: false,
      expiration: null,
      currentPassword: "",
      newPassword: "",
      isRFQCreated: false,
      grantType: "",
      refreshToken: "",
      googleImageUrl: "",
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: "",
    };

    this.iLanguageModel = {
      charset: "",
      languageAbr: "",
      languageId: 0,
      languageName: "",
      localeCode: "",
      translated: true,
    };

    this.iCompanyModel = {
      companyId: 0,
      description: "",
      _3dTourUrl: "",
      dunsNumber: "",
      employeeCountRangeId: 1,
      employeeCountRange: "",
      errorMessage: "",
      isActive: true,
      name: "",
      companylogo: "",
      services: "",
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: "",
      supplierTypeId: 0,
    };

    this.iAddressModel = {
      address5: "",
      addressId: 0,
      addressType: 1,
      city: "",
      countryId: 0,
      deptAddress: "",
      country: "",
      errorMessage: "",
      isActive: false,
      postalCode: "",
      showInProfile: true,
      showOnlyStateCity: true,
      state: "",
      stateId: 0,
      result: false,
      streetAddress: "",
      companyShippingSiteViewModelList: [this.iCompanyShippingSiteViewModel],
    };
    this.iContactViewModel1 = {
      isLike: false,
      accountEmail: "",
      website: "",
      isLoginFromVision: false,
      addressId: 0,
      originalContactPictureFile: "",
      originalLogoOfCompany: "",
      contactIdEncrypt: "",
      comments: "",
      companyId: 0,
      contactFunction: "",
      contactId: 0,
      createdOn: "",
      emailId: "",
      errorMessage: "",
      facebook: "",
      firstName: "",
      incotermId: 0,
      industry: "",
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: false,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: "",
      linkedIn: "",
      modifiedOn: "",
      password: "",
      phoneNo: "",
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: "",
      tweeter: "",
      userId: "",
      contactPictureFile: "",
      logoOfCompany: "",
      token: "",
      language: null,
      address: this.iAddressModel,
      company: this.iCompanyModel,
      isVarified: false,
      expiration: null,
      currentPassword: "",
      newPassword: "",
      isRFQCreated: false,
      grantType: "",
      refreshToken: "",
      googleImageUrl: "",
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      userIpAddress: "",
      instagram: "",
    };

    this.iCompanyShippingSiteViewModel = {
      addressId: 0,
      companyName: "",
      compId: 0,
      contId: 0,
      defaultSite: true,
      siteCreationDate: null,
      siteId: 0,
      siteLabel: "",
      addresses: this.iAddressModel,
    };
  }
  initIco() {
    this.iContactViewModel1 = {
      isLike: false,
      accountEmail: "",
      website: "",
      isLoginFromVision: false,
      addressId: 0,
      originalContactPictureFile: "",
      originalLogoOfCompany: "",
      contactIdEncrypt: "",
      comments: "",
      companyId: 0,
      contactFunction: "",
      contactId: 0,
      createdOn: "",
      emailId: "",
      errorMessage: "",
      facebook: "",
      firstName: "",
      incotermId: 0,
      industry: "",
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: false,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: "",
      linkedIn: "",
      modifiedOn: "",
      password: "",
      phoneNo: "",
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: "",
      tweeter: "",
      userId: "",
      contactPictureFile: "",
      logoOfCompany: "",
      token: "",
      language: null,
      address: this.iAddressModel,
      company: this.iCompanyModel,
      isVarified: false,
      expiration: null,
      currentPassword: "",
      newPassword: "",
      isRFQCreated: false,
      grantType: "",
      refreshToken: "",
      googleImageUrl: "",
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: "",
    };
  }

  isLoginFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.registerSupplierForm,
      field
    );
  }
  checkOnClose() {
    if (this.isCountryMultiSelectTouched) {
      if (this.iContactViewModel1.address.countryId === 0) {
        this.errorOnCountryMultiSelect = true;
      } else {
        this.errorOnCountryMultiSelect = false;
      }
    }
    if (this.labelFocus === "sCountryId") {
      this.setFocus("no");
    }
  }

  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  getCountry() {
    this._masterService.getCountry().subscribe(
      (data2: ICountryViewModel[]) => {
        this.iCountryColl = data2;
      },
      (error) => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  applicableRole() {
    if (this.applicableRoles) {
      for (let index = 0; index < this.applicableRoles.length; index++) {
        if (this.applicableRoles[index] === "Seller") {
          this.buyerSupplier = true;
        } else if (this.applicableRoles[index] === "Buyer") {
          this.SupplierBuyer = true;
        }
      }
    }
  }
  getNotification(messageId) {
    this._messageService.GetNotifications().subscribe(
      (data: any) => {
        if (data["result"]) {
          if (data.data !== null) {
            this.iMessageHubModelList = data.data.slice(0, 10);
            if (messageId !== "") {
              this._rfqService.set(false, "showSidePanel");
              localStorage.removeItem("Rfqdetails");
              this._rfqService.set(null, "partList");
              this._rfqService.set(null, "getManufacturesByRfqData");
              this._rfqService.set(null, "GetSupplierRFQQuoteDetailsData");
              this.detailRfq(messageId);
            }
          }
          this.isNotificationLoader = false;
        } else {
          this.isNotificationLoader = false;
        }
      },
      (error) => () => {
        this.isNotificationLoader = false;
        this._rfqService.handleError(error);
      }
    );
  }

  closeModel(event) {
    this.showSessionModel = event;
  }
  // isRFQCreated: boolean = false;
  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }

  ngOnInit() {
    this.getIpAddress();
    this.accountType = localStorage.getItem("AccountType");
    this.checkScheduleDemoStatus();
    if(this.userType == appConstants.UserRole.Supplier){
      this.communityMenuFull[0].child = this.communityMenuFull[0].child.filter((item) => item.name !== appConstants.ForManufacturers.POST_MANU);
    }
    if (this.userLocation != 'US' && this.userLocation != 'Canada') {
      const headerTab = this.communityMenuFull;
      headerTab.pop();
      this.communityMenuFull = headerTab;
    }
    if (this.userLocation === 'Asia' || this.userLocation === 'Europe') {
      const check = this.communityMenuFull[0].child;
      check.pop();
      this.accountType = localStorage.getItem("AccountType");
      this.communityMenuFull[0].child = check;
    }
    this.checkTileAvailability();

    if (this.isVisionUser !== "true") {
      this.showTermsAndConditionModal();
    }
    setInterval(() => {
      let isOpend = localStorage.getItem("abc");
      this.subscribeRef = this.sessionExpireService
        .sessionExpireAlert()
        .subscribe((res) => {
          if (res && isOpend != "true") {
            this.showSessionModel = false;
            setTimeout(() => {
              this.showSessionModel = true;
            }, 1000);
          }
        });
    }, 1000);
    this.getNewIconStatus();
    this.startHubConnection();
    this.setBackgroundPattern("pattern1");
    this.getNotification("");
    this.isAdmin();

    this.modalSubscription = this._profileService
      .getShowBilling()
      .subscribe((response) => {
        localStorage.removeItem("isSubscription");
        if (response) {
          this.toShowBillingMenu = true;
          this._profileService.setShowBilling(false);
        }
      });
    this.getBillingMenuInfo();
    this.getEmailVerificationStatus();
    this.checkUserLocation();
    setTimeout(() => {
      this.newMessageCount = JSON.parse(
        localStorage.getItem("newMessageCount")
      );
      this.newNotifications = JSON.parse(
        localStorage.getItem("newNotifications")
      );
    }, 3000);
  }

  showTermsAndConditionModal() {
    let email = localStorage.getItem("User2");
   if (
     AppUtil.isNotEmptyString(email) &&
     AppUtil.isNotEmptyString(this.loggedId )
    ) {
      this._rfqService.GetTermsAndConditions(email, this.loggedId).subscribe(
        (result) => {
          let isTermsModelShow=false;
          if (result.data.isAcceptance === null) {
            this._rfqService.set(true, "isTermsModelShow");
            isTermsModelShow=true;
          }
          this._rfqService.set(isTermsModelShow, "isTermsModelShow");
        },
        (error) => {
          this.isLoader = false;
          this._rfqService.handleError(error);
        },

        () => { }

      );
    }
  }

  isTermsModelShow() {
    return this._rfqService.get("isTermsModelShow");
  }

  getEmailVerificationStatus() {
    this.userType = localStorage.getItem("Usertype");
    if (this.userType === "Buyer") {
      if (this.loggedId !== null && this.loggedId !== undefined) {
        this._masterService
          .getEmailVerificationStatus(this.loggedId)
          .subscribe((response) => {
            if (!response.isError) {
              localStorage.setItem("isEmailVerify", "" + response.data);
            }
          });
      }
    }
  }
  getNewIconStatus() {
    this._supplierService
      .getNewIconStatus(this.loggedCompanyId)
      .subscribe((response) => {
        if (!response.isError && response.data) {
          this.toShowNewIcon = response.data;
        }
      });
  }
  setShowNewIcon(urlName) {
    if (this.toShowNewIcon == true && urlName === "Magic Lead List") {
      this._supplierService
        .setNewIconStatus(this.loggedCompanyId)
        .subscribe((response) => {
          if (!response.isError && response.data) {
            this.toShowNewIcon = false;
          }
        });
    }
  }
  getBillingMenuInfo() {
    this._supplierService
      .getSubscriptionPlanExists(this.loggedCompanyId)
      .subscribe((response) => {
        if (!response.isError && response.data) {
          this.toShowBillingMenu = response.data;
        }
      });
  }
  showSupplierBuyer() {
    this.selectedItems = [];
    this.getCountry();
    if (this.userType === "Supplier") {
      this.header = "Create Buyer Account";
    }
    if (this.userType === "Buyer") {
      this.header = "Create Manufacturer Account";
    }
    if (AppUtil.isEmptyString(this.iContactViewModel1.companyId) || this.iContactViewModel1.companyId === 0) {
      this._toastr.error(
        "Please update Company details first from Contact Information section",
        "Error!"
      );
    } else {
      this.getprofile();
      this.createForm();
      this.isSupplier = true;
    }
  }
  hideSupplier() {
    this.isSupplier = false;
  }

  getprofile() {
    if (
      (this.iContactViewModel1.companyId === 0 ||
        this.iContactViewModel1.companyId === null) &&
      (this.iContactViewModel1.company.name === "" ||
        this.iContactViewModel1.company.name === null)
    ) {
      if (this._RfqService.get("CompanyName")) {
        this.iContactViewModel1["company"].name =
          this._RfqService.get("CompanyName");
      }
      if (this._RfqService.get("companyId")) {
        this.iContactViewModel1.companyId = this._RfqService.get("companyId");
      }
    }
  }
  GetProfileDetails() {
    const id = this.loggedId;
    this.userCreatedDateString = "";
    const ContactModelFromLocal = JSON.parse(
      localStorage.getItem("iContactViewModel")
    );
    if (
      this.loggedEncryptId !== undefined &&
      this.loggedEncryptId !== null &&
      this.loggedEncryptId !== ""
    ) {
      this._ProfileService
        .getProfileForLoginDetails(this.loggedEncryptId)
        .subscribe((result) => {
          this.iContactViewModel1 = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel1));
          if (
            !!this.iContactViewModel1.contactPictureFile &&
            this.iContactViewModel1.contactPictureFile !== ""
          ) {
            if (
              localStorage.getItem("userHeaderLogo") !==
              this.iContactViewModel1.contactPictureFile
            ) {
              localStorage.setItem(
                "userHeaderLogo",
                this.iContactViewModel1.contactPictureFile
              );
            }
          }
          if (this.iContactViewModel1.contactPictureFile) {
            this.logoPathToShow = this.iContactViewModel1.contactPictureFile;
          }
          localStorage.setItem("userId", this.iContactViewModel1.userId);
          localStorage.setItem(
            "iContactViewModel",
            JSON.stringify(this.iContactViewModel1)
          );
          this.getSourcingAdvisor();
          this.createForm();
        });
    } else {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(["auth/login/simple"]);
    }
  }
  getCount(path) {
    let newpath = path;
    const isRfqCountExist = this._RfqService.get("rfqCount");

    if (isRfqCountExist !== undefined) {
      const rfqCounts = JSON.parse(this._RfqService.get("rfqCount"));

      if (path === "My Liked RFQs") {
        const data = this._RfqService.get("likedRfqCount");
        newpath = "My Liked RFQs" + "(" + data + ")";
      }
      if (path === "Special Invite RFQs") {
        newpath =
          "Special Invite RFQs" + "(" + rfqCounts.specialInviteRfqCount + ")";
      }
      if (path === "My Quotes") {
        const data = this._RfqService.get("quotesRfqCount");
        newpath = "My Quotes" + "(" + data + ")";
      }
      if (path === "My Awarded RFQs") {
        const data = this._RfqService.get("awardedRfqCount");
        newpath = "My Awarded RFQs" + "(" + data + ")";
      }
      if (path === "Followed Buyers RFQs") {
        newpath =
          "Followed Buyers RFQs" + "(" + rfqCounts.followedBuyersRfqCount + ")";
      }
      if (path === "My RFQs") {
        newpath = "My RFQs" + "(" + rfqCounts.allRfqCount + ")";
      }
      if (path === "Quotes In Progress") {
        newpath =
          "Quotes In Progress" + "(" + rfqCounts.quotesInProgressRfqCount + ")";
      }
      return newpath;
    } else {
      if (path === "My Liked RFQs") {
        newpath = "My Liked RFQs" + "(" + 0 + ")";
      }
      if (path === "Special Invite RFQs") {
        newpath = "Special Invite RFQs" + "(" + 0 + ")";
      }
      if (path === "My Quotes") {
        const data = this._RfqService.get("quotesRfqCount");
        newpath = "My Quotes" + "(" + 0 + ")";
      }
      if (path === "My Awarded RFQs") {
        const data = this._RfqService.get("awardedRfqCount");
        newpath = "My Awarded RFQs" + "(" + 0 + ")";
      }
      if (path === "Followed Buyers RFQs") {
        newpath = "Followed Buyers RFQs" + "(" + 0 + ")";
      }
      if (path === "My RFQs") {
        newpath = "My RFQs" + "(" + 0 + ")";
      }
      if (path === "Quotes In Progress") {
        newpath = "Quotes In Progress" + "(" + 0 + ")";
      }
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this._RfqService.set(0, "companyId");
    this._RfqService.set(null, "CompanyName");
    this._rfqService.set(false, "isBack");
    this.router.navigateByUrl('/auth/login/simple', { replaceUrl: true })
      .then(() => {
        window.location.reload();
      });
  }
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.setHeaderAttributes(this.windowWidth);

    let reSizeFlag = true;
    if (
      this.pcodedDeviceType === "tablet" &&
      this.windowWidth >= 768 &&
      this.windowWidth <= 1024
    ) {
      reSizeFlag = false;
    } else if (this.pcodedDeviceType === "mobile" && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    /* for check device */
    if (reSizeFlag) {
      this.setMenuAttributes(this.windowWidth);
    }
  }

  setHeaderAttributes(windowWidth) {
    if (windowWidth < 992) {
      this.navRight = "nav-off";
    } else {
      this.navRight = "nav-on";
    }
  }

  setMenuAttributes(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.pcodedDeviceType = "tablet";
      this.verticalNavType = "offcanvas";
      this.verticalEffect = "overlay";
      this.showCommunityMenu = false;
    } else if (windowWidth < 768) {
      this.pcodedDeviceType = "mobile";
      this.verticalNavType = "offcanvas";
      this.verticalEffect = "overlay";
      this.showCommunityMenu = false;
    } else {
      this.pcodedDeviceType = "desktop";
      this.verticalNavType = "expanded";
      this.verticalEffect = "shrink";
      this.showCommunityMenu = true;
    }
  }

  toggleHeaderNavRight() {
    this.navRight = this.navRight === "nav-on" ? "nav-off" : "nav-on";
    this.chatTopPosition = this.chatTopPosition === "nav-on" ? "112px" : "";
    if (this.navRight === "nav-off" && this.innerChatSlideInOut === "in") {
      this.toggleInnerChat();
    }
    if (this.navRight === "nav-off" && this.chatSlideInOut === "in") {
      this.toggleChat();
    }
  }

  toggleLiveNotification() {
    this.liveNotification =
      this.liveNotification === "an-off" ? "an-animate" : "an-off";
    this.liveNotificationClass =
      this.liveNotification === "an-animate" ? "active" : "";
    this.showBell = false;
    this.newNotifications = 0;
    localStorage.setItem(
      "newNotifications",
      JSON.stringify(this.newNotifications)
    );
    if (
      this.liveNotification === "an-animate" &&
      this.innerChatSlideInOut === "in"
    ) {
      this.toggleInnerChat();
    }
    if (
      this.liveNotification === "an-animate" &&
      this.chatSlideInOut === "in"
    ) {
      this.toggleChat();
    }
  }

  toggleLiveMessages() {
    this.showMessage = false;
    this.newMessageCount = 0;
    localStorage.setItem(
      "newMessageCount",
      JSON.stringify(this.newMessageCount)
    );
  }

  toggleProfileNotification() {
    this.profileNotification =
      this.profileNotification === "an-off" ? "an-animate" : "an-off";
    this.profileNotificationClass =
      this.profileNotification === "an-animate" ? "active" : "";

    if (
      this.profileNotification === "an-animate" &&
      this.innerChatSlideInOut === "in"
    ) {
      this.toggleInnerChat();
    }
    if (
      this.profileNotification === "an-animate" &&
      this.chatSlideInOut === "in"
    ) {
      this.toggleChat();
    }
  }

  notificationOutsideClick(ele: string) {
    if (ele === "live" && this.liveNotification === "an-animate") {
      this.toggleLiveNotification();
    } else if (ele === "profile" && this.profileNotification === "an-animate") {
      this.toggleProfileNotification();
    }
  }

  toggleChat() {
    this.chatSlideInOut = this.chatSlideInOut === "out" ? "in" : "out";
    if (this.innerChatSlideInOut === "in") {
      this.innerChatSlideInOut = "out";
    }
  }

  toggleInnerChat() {
    this.innerChatSlideInOut =
      this.innerChatSlideInOut === "out" ? "in" : "out";
  }

  searchOn() {
    document.querySelector("#main-search").classList.add("open");
    const searchInterval = setInterval(() => {
      if (this.searchWidth >= 200) {
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth + 15;
      this.searchWidthString = this.searchWidth + "px";
    }, 35);
  }

  searchOff() {
    const searchInterval = setInterval(() => {
      if (this.searchWidth <= 0) {
        document.querySelector("#main-search").classList.remove("open");
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth - 15;
      this.searchWidthString = this.searchWidth + "px";
    }, 35);
  }

  toggleOpened() {
    if (this.windowWidth < 992) {
      this.toggleOn =
        this.verticalNavType === "offcanvas" ? true : this.toggleOn;
      if (this.navRight === "nav-on") {
        this.toggleHeaderNavRight();
      }
    }
    
    this.verticalNavType = this.verticalNavType === "expanded" ? "offcanvas" : "expanded";
    if (this.verticalNavType === "offcanvas") {
      this._RfqService.set(true, "isSideMenuVisible");
    } else {
      this._RfqService.set(false, "isSideMenuVisible");
    }
  }

  onClickedOutsideSidebar(e: Event) {
    if (
      (this.windowWidth < 992 &&
        this.toggleOn &&
        this.verticalNavType !== "offcanvas") ||
      this.verticalEffect === "overlay"
    ) {
      this.toggleOn = true;
      // commented for responsive sidebar is not coming
      //  this.verticalNavType = 'offcanvas';
    }
  }

  toggleRightbar() {
    this.configOpenRightBar = this.configOpenRightBar === "open" ? "" : "open";
  }

  setNavBarTheme(theme: string) {
    if (theme === "themelight1") {
      this.navBarTheme = "themelight1";
      this.menuTitleTheme = "theme1";
      this.sidebarImg = "false";
    } else {
      this.menuTitleTheme = "theme6";
      this.navBarTheme = "theme1";
      this.sidebarImg = "false";
    }
  }

  setVerticalLayout() {
    this.isVerticalLayoutChecked = !this.isVerticalLayoutChecked;
    if (this.isVerticalLayoutChecked) {
      this.verticalLayout = "box";
      this.displayBoxLayout = "";
    } else {
      this.verticalLayout = "wide";
      this.displayBoxLayout = "d-none";
    }
  }

  setBackgroundPattern(pattern: string) {
    document.querySelector("body").setAttribute("themebg-pattern", pattern);
  }

  setSidebarPosition() {
    this.isSidebarChecked = !this.isSidebarChecked;
    this.pcodedSidebarPosition =
      this.isSidebarChecked === true ? "fixed" : "absolute";
    this.sidebarFixedHeight =
      this.isHeaderChecked === true
        ? "calc(100vh + 56px)"
        : "calc(100vh - 56px)";
  }

  setHeaderPosition() {
    this.isHeaderChecked = !this.isHeaderChecked;
    this.pcodedHeaderPosition =
      this.isHeaderChecked === true ? "fixed" : "relative";
    this.headerFixedMargin = this.isHeaderChecked === true ? "75px" : "";
  }
  isBuyerProfile() {
    const tempType = localStorage.getItem("Usertype");
    return tempType;
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem("LoggedId"));
  }
  get loggedEncryptId() {
    // tslint:disaabale-next-line:radix
    return localStorage.getItem("LoggedIdEncript");
  }
  getSourcingAdvisor() {
    let companyId;
    if (!this.loggedCompanyId) {
      companyId = 0;
    } else {
      companyId = this.loggedCompanyId;
    }
    this._ProfileService.GetCompanySourcingAdvisor(companyId).subscribe(
      (result) => {
        if (result.result) {
          localStorage.setItem("iSourcingAdvisorEmail", result.data.email);
          this.iSourcingAdvisorModel = result.data;
          if (
            this.iSourcingAdvisorModel.title == null ||
            this.iSourcingAdvisorModel.title == "" ||
            this.iSourcingAdvisorModel.title == undefined
          ) {
            this.iSourcingAdvisorModel.title = "Customer Support";
          }
          if (
            result.data.userPhone != null &&
            result.data.userPhone != undefined &&
            result.data.userPhone != ""
          ) {
            this.iSourcingAdvisorModel.userPhone =
              result.data.userPhone.replace(/^\++|\++$/g, "");
          }
        } else {
          this._toastr.error("Failed to get Sourcing Advisor", "Error!");
        }
      },
      (error) => {
        this._rfqService.handleError(error);
      },

      () => { }

    );
  }

  shortName(onignalText) {
    const count = 16;
    if (onignalText !== null) {
      if (onignalText.length > count) {
        return onignalText.slice(0, count - 3).concat("...");
      } else {
        return onignalText;
      }
    }
  }

  isAllowd() {
    return this.radio1 === 0;
  }

  GetProfileDetailsForNPSModel(notifyUserID) {
    this._ProfileService
      .getProfileDetails(notifyUserID, this.loggedId)
      .subscribe(
        (result) => {
          this.iContactViewModelNPSModel = result;
          this.isNPSPupupShow = true;
          this.ratingsPopupLogoPath = "assets/company/avatar-manu-basic.svg";
          if (
            !!this.iContactViewModelNPSModel.contactPictureFile &&
            this.iContactViewModelNPSModel.contactPictureFile !== ""
          ) {
            this.ratingsPopupLogoPath =
              this.defaultAwsPath +
              this.iContactViewModelNPSModel.contactPictureFile;
          }
          if (this.iContactViewModelNPSModel.isBuyer) {
            this.npsRatingPopupTitle = "Rate this Buyer";
          } else {
            this.npsRatingPopupTitle = "Rate this Manufacturer";
          }
        },
        (error) => {
          this._rfqService.handleError(error);
        },

        () => { }

      );
  }

  closeNPSPopup() {
    this.iRatingResponseViewModel.isNotNowClicked = true;
    this.iRatingResponseViewModel.score = "";
    this.iRatingResponseViewModel.fromId = this.fromContactOfMessage;
    this.iRatingResponseViewModel.toId = this.toContactOfMessage;
    this.submitResponse();
  }
  submitRating() {
    this.iRatingResponseViewModel.score = "" + this.radio1;
    this.iRatingResponseViewModel.isNotNowClicked = false;
    if (this.loggedId === this.fromContactOfMessage) {
      this.iRatingResponseViewModel.fromId = this.fromContactOfMessage;
      this.iRatingResponseViewModel.toId = this.toContactOfMessage;
    } else if (this.loggedId === this.toContactOfMessage) {
      this.iRatingResponseViewModel.fromId = this.toContactOfMessage;
      this.iRatingResponseViewModel.toId = this.fromContactOfMessage;
    }
    this.submitResponse();
  }

  submitResponse() {
    this._supplierService
      .AddNPSResponse(this.iRatingResponseViewModel)
      .subscribe(
        (result) => {
          if (result.result === true) {
            sessionStorage.setItem("isGlobalMsgRaiting", "true");
            if (this.iRatingResponseViewModel.score === "") {
              this.isNPSPupupShow = false;
              this.radio1 = 0;
              this.resetNPSModuleModel();
              this.getNotification("");
            } else {
              this._toastr.success(result.errorMessage, "Success!");
              this.isNPSPupupShow = false;
              this.radio1 = 0;
              this.resetNPSModuleModel();
              this.getNotification("");
            }
          } else {
            this._toastr.error(result.errorMessage, "Error!");
          }
        },
        (error) => {
          this._rfqService.handleError(error);
        },

        () => { }

      );
  }

  logoPathReload() {
    const tempPath = localStorage.getItem("userHeaderLogo");
    if (!!tempPath && tempPath.length) {
      if (this.currentlogoPath !== tempPath) {
        this.currentlogoPath = tempPath;
        this.logoPathToShow = this.defaultAwsPath + tempPath;
      }
    }

    if (!this.logoPathToShow || this.logoPathToShow === "") {
      this.logoPathToShow = "";
    }
  }
  checkAccountUpgradeReqSent() {
    const tempFlag = this._supplierService.get("accountUpgradeReqFlag");
    if (tempFlag === true) {
      this.isAccountUpgradeReqSent = true;
      this.accountUpgradeMessage = this._supplierService.get(
        "accountUpgradeReqMessage"
      );
      this._supplierService.set(false, "accountUpgradeReqFlag");
      this._supplierService.set("", "accountUpgradeReqMessage");
    }
  }
  closeAccountUpgradePopUp() {
    this.isAccountUpgradeReqSent = false;
    this.isAccountUpgradereqSent = false;
  }

  detailRfq(msgHubmodel: IMessageHubModel) {
    if (
      msgHubmodel.rfqId !== undefined &&
      msgHubmodel.rfqId !== null &&
      msgHubmodel.rfqId !== 0 &&
      msgHubmodel.messageTypeId !== 210 &&
      msgHubmodel.messageTypeId !== 211 &&
      msgHubmodel.messageTypeId !== 226
    ) {
      let currentDetailsId = localStorage.getItem("detailRfqId");
      if (this.userType === "Buyer") {
        currentDetailsId = localStorage.getItem("detailRfqId");
      } else {
        currentDetailsId = localStorage.getItem("supplierRfqDetailId");
      }
      const currentMessageType = localStorage.getItem("currentMessageType");
      if (
        currentMessageType !== msgHubmodel.messageType ||
        currentDetailsId !== msgHubmodel.rfqId.toString()
      ) {
        localStorage.setItem("currentMessageType", msgHubmodel.messageType);
        const encryptedRfqID = this._ProfileService.encrypt(msgHubmodel.rfqId);
        this._RfqService.set(true, "isFromNotification");
        switch (msgHubmodel.messageType) {
          case "RFQ_RELEASED_BY_ENGINEERING":
          case "RFQ_BUYER_INVITATION":
          case "RFQ_EDITED_RESUBMIT_QUOTE": {
            break;
          }
          case "rfqResponse":
          case "rfqFreeMessage":
          case "RFQ_LIKED_BY_SUPPLIER":
          case "RFQ_DISLIKED_BY_SUPPLIER":
          case "BUYER_FOLLOW_SUPPLIER":
          case "BUYER_VIEW_SUPPLIER_PROFILE":
          case "SUPPLIER_VIEW_BUYER_PROFILE": {
            localStorage.setItem("msgTab", "true");
            localStorage.setItem(
              "msgTabMessageDrawer",
              JSON.stringify(msgHubmodel)
            );
            break;
          }
          case "rfqConfirmationMessage":
          case "rfqNonConfirmationMessage": {
            localStorage.setItem("quotesTab", "true");
            break;
          }
          case "MESSAGE_TYPE_CONFIDENTIALITY_AGREEMENT": {
            localStorage.setItem("ndaTab", "true");
            break;
          }
          default: {
            break;
          }
        }
        if (
          !(
            msgHubmodel.messageType === "SUPPLIER_NPS_RATING" ||
            msgHubmodel.messageType === "BUYER_NPS_RATING"
          )
        ) {
          if (this.userType === "Buyer") {
            this.router.navigate(["/rfq/rfqdetail"], {
              queryParams: {
                rfqId: encryptedRfqID,
              },
            });
          } else {
            localStorage.setItem("isFromNotification", "yes");
            localStorage.setItem("isNotificationPage", "true");
            this.router.navigate(["/supplier/supplierRfqDetails"], {
              queryParams: {
                rfqId: "" + encryptedRfqID,
              },
            });
          }
        }
      }
    } else {
      // 156 === SUPPLIER_NPS_RATING
      // 157 === BUYER_NPS_RATING
      if (
        msgHubmodel.messageType === "SUPPLIER_NPS_RATING" ||
        msgHubmodel.messageType === "BUYER_NPS_RATING"
      ) {
        this.workOnNPSPopup(msgHubmodel);
      } else if (
        msgHubmodel.messageType === "rfqFreeMessage" ||
        (msgHubmodel.messageType === "QUOTED_MARKED_QUOTED_RFQ_EDITED" &&
          msgHubmodel.isNotification === false)
      ) {
        this.router.navigate(["/globalMessage"]);
      } else if (msgHubmodel.isNotification === true) {
        this.router.navigate(["/globalNotification"]);
      }
    }
  }

  markRead(messageId) {
    this._RfqService
      .changeMessageStatus(messageId.messageId)
      .subscribe((result) => {
        this.getNotification(messageId);
      });
  }
  isNPSPopupReqFromMessageTab() {
    if (this._RfqService.get("isNPSPopupReqFromMessageTab") === true) {
      this._RfqService.set(false, "isNPSPopupReqFromMessageTab");
      const tempNPSObj = this._RfqService.get("NPSPopupReqModelFromMessageTab");
      this.workOnNPSPopup(tempNPSObj);
    }
  }
  workOnNPSPopup(msgHubmodel) {
    this.resetNPSModuleModel();
    this.isNPSPupupShow = false;
    this.radio1 = 0;
    this.fromContactOfMessage = msgHubmodel.fromId;
    this.toContactOfMessage = msgHubmodel.toId;
    this.iRatingResponseViewModel.messageId = msgHubmodel.messageId;
    this.iRatingResponseViewModel.contactName =
      this.iContactViewModel1.firstName +
      " " +
      this.iContactViewModel1.lastName;
    if (this.loggedId === msgHubmodel.toId) {
      this.GetProfileDetailsForNPSModel(msgHubmodel.fromContactIdEncrypt);
    } else {
      this.GetProfileDetailsForNPSModel(msgHubmodel.toContactIdEncrypt);
    }
  }
  upgradeClick() {
    this.isUpgradeBtn = true;
    // this.setSupplierUpgraderequest();
  }
  openSaleModel() {
    this.toShowContactModel = true;
    this.showUpgradeAccountModal = false;
  }
  /* This function is called when click on Upgrade to quote button to open the modal */
  upgradeClickModel(isQuotingRfq) {
    this.isQuoteRfq = isQuotingRfq;
    this.showUpgradeAccountModal = true;
  }
  /* This function is used to close the Upgrade Account Modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  setSupplierUpgraderequest() {
    this.iMyAccountViewModel.contactId = this.loggedId;
    this.iMyAccountViewModel.companyId = this.loggedCompanyId;
    if (this.isUpgradeBtn) {
      this.iMyAccountViewModel.istrail = false;
    }
    this._supplierService
      .setSupplierUpgraderequest(this.iMyAccountViewModel)
      .subscribe(
        (result) => {
          this.isLoader = false;
          if (result["result"] === true) {
            if (this.isUpgradeBtn) {
              this.iMyAccountViewModel = result.data;
              this.isUpgradeBtn = false;
              this.accountUpgradereqMessage =
                this.iMyAccountViewModel.errorMessage;
              this.isAccountUpgradereqSent = true;
            }
          } else {
            this.accountUpgradereqMessage = result["errorMessage"];
            this.isAccountUpgradereqSent = true;
          }
        },
        (error) => {
          this.isLoader = false;
          this.accountUpgradereqMessage = "You are already a premium member";
          this.isAccountUpgradereqSent = true;
        },

        () => { }

      );
  }

  viewAll() {
    this._RfqService.set(false, "isBuyerCommpleteProfile");
    this._RfqService.set(false, "messageThreadDrawer");
    this._RfqService.set(false, "showSidePanel");
    this.router.navigateByUrl("/globalNotification");
  }
  isAdmin() {
    this.applicableRoles = JSON.parse(localStorage.getItem("applicableRoles"));
    if (this.applicableRoles) {
      for (let index = 0; index < this.applicableRoles.length; index++) {
        if (
          this.applicableRoles[index] === "Seller Admin" ||
          this.applicableRoles[index] === "Buyer Admin" ||
          this.applicableRoles[index] === "SellerAdmin" ||
          this.applicableRoles[index] === "BuyerAdmin"
        ) {
          this.isAdminUser = true;
          break;
        }
      }
    }
  }
  checkCompany() {
    if (
      this.loggedCompanyId !== 0 &&
      this.loggedCompanyId !== null &&
      this.loggedCompanyId !== undefined
    ) {
      this.router.navigate(["/profile/user-management/"]);
    } else {
      this._toastr.warning(
        "Please update Company details first from the Profile page",
        "Warning!"
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
  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != "") {
      // this.iProfileViewModel['phoneNo'] = number.replace(/-/g, '');
      this.registerSupplierForm.patchValue({
        sPhoneNo: number.replace(/-/g, ""),
      });
    }
  }
  ngOnDestroy() {
    if (this.subscribeRef != undefined) {
      this.subscribeRef.unsubscribe();
    }
    if (this.modalSubscription != undefined) {
      this.modalSubscription.unsubscribe();
    }

    localStorage.removeItem("isSubscription");
  }
  closeNotification(e, messageId) {
    this.liveNotification = "an-off";
    this.isNotificationLoader = true;
    this._messageService.CloseBroadcastNotification(messageId).subscribe(
      (res) => {
        if (res["isError"] == false) {
          this.isNotificationLoader = false;
          this.getNotification("");
        } else {
          this.isNotificationLoader = false;
        }
      },
      (error) => {
        this.isNotificationLoader = false;
      }
    );

    e.preventDefault();
  }

  deletedMsgReloadNotification() {
    if (sessionStorage.getItem("isGlbMsgDelete") == "true") {
      sessionStorage.removeItem("isGlbMsgDelete");
      this.getNotification("");
    }
  }

  community_redirect(redirect,page,title) {
    if(page==='GetMaterials'){
      let url="materialquoterequest"
      if (this.accountType == "Basic") {
        url="packages";
      }
      this.router.navigateByUrl(url);
      return;
    }
    if (redirect) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/source"], {
          queryParams: { page: "community/" },
        })
      );
      window.open("#" + url, "_blank");
    }
  }
  



  /*
   * Redirect from marketing to staging.
   */
 
 
  checkUserLocation() {
    const accountType = localStorage.getItem("AccountType");
    this.userLocation = localStorage.getItem("manufacturingLocation");
      if (
        this.userLocation === "US" ||
        this.userLocation === "Canada" ||
        this.userLocation === "USA & Canada" ||
        this.userLocation === "Mexico"
      ) {
        this.communityMenu = this.communityMenuFull.filter(
          (x) => x.toShow === true || x.toShow === false
        );
        this.toShowCommunityMenu = true;
       
        if (accountType != "Basic") {
          this.toShowLeftImg = true;
          this.sidebarFixedHeight =
            this.isBuyerProfile() === "Supplier" &&
              this.isPaidContract !== "true"
              ? "calc(100vh - 190px)"
              : this.isBuyerProfile() === "Buyer" ||
                (this.isBuyerProfile() === "Supplier" &&
                  this.isPaidContract === "true")

                ? "calc(100vh - 160px)"
                : "calc(100vh - 56px)";

        } else {
          this.toShowLeftImg = false;
          this.sidebarFixedHeight =
            this.isBuyerProfile() === "Supplier" &&
              this.isPaidContract !== "true"
              ? "calc(100vh - 190px)"
              : this.isBuyerProfile() === "Buyer" ||
                (this.isBuyerProfile() === "Supplier" &&
                  this.isPaidContract === "true")
                ? "calc(100vh - 195px)"
                : "calc(100vh - 56px)";
        }
      } else {
        this.communityMenu = this.communityMenuFull.filter(
        (x) => x.toShow === true && x.page !=="GetMaterials"
      );
        this.toShowCommunityMenu = false;
      this.toShowLeftImg = false;
      this.sidebarFixedHeight =
        this.isBuyerProfile() === "Supplier" && this.isPaidContract !== "true"
          ? "calc(100vh - 220px)"
          : this.isBuyerProfile() === "Buyer" ||
            (this.isBuyerProfile() === "Supplier" &&
              this.isPaidContract === "true")

            ? "calc(100vh - 195px)"
            : "calc(100vh - 56px)";
      }
  }

  utcDate(date) {
    return moment.utc(date).toDate();
  }

  reloadAdminCompforSupplier(event) {
    this.router.navigate(["/supplier/profile"]);
  }

  reloadAdminCompforBuyer(event) {
    // this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
    this.router.navigate(["/profile/buyerprofile"]);
    // });
  }
  reloadDashBoardCompforBuyer(event) {
    this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/dashboard/buyer/default/"]);
    });
  }

  submitRfqCount: number=0;
  //code written for M2-4416-sprint 7.4 -AJ-(24-05-2022)
  getSubmittedRFQCount() {
    let rfqId = parseInt(localStorage.getItem("firstRFQId"));
    let checkRFQid;
    if (isNaN(rfqId)) {
      checkRFQid = 0;
    } else {
      checkRFQid = rfqId;
    }
    this._ProfileService
      .GetSubmittedRFQCount(this.loggedId, checkRFQid)
      .subscribe(
        (result) => {
          if (result.result == true) {
            this.willDoLaterCount = result.data.willDoLaterCount;
            this.submitRfqCount = result.data.rfqCount;
            localStorage.setItem("willDoLater", result.data.willDoLaterCount);
            localStorage.setItem("submitRfqCount", result.data.rfqCount);
            if (this.isGetSubmited) {
              this.isreloadDashboardComp();
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  isreloadDashboardComp() {
    let willDoLaterPath = parseInt(localStorage.getItem("willDoLater"));
    let submitRfqCount = parseInt(localStorage.getItem("submitRfqCount"));

    if (willDoLaterPath === 0 && submitRfqCount === 0) {
      this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
        this.router.navigate(["getStarted"]);
      });
    } else if (willDoLaterPath === 0 && submitRfqCount >= 1) {
      this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
        this.router.navigate(["dashboard/buyer/default"]);
      });
    } else if (willDoLaterPath === 1 && submitRfqCount >= 1) {
      this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
        this.router.navigate(["dashboard/buyer/default"]);
      });
    } else if (willDoLaterPath === 1 && submitRfqCount === 0) {
      this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
        this.router.navigate(["dashboard/buyer/default"]);
      });
    }
  }


  checkTileAvailability() {
    const contactId = this.loggedId;
    const companyId = this.loggedCompanyId;
    //config cat is started

    this._profileService.getConfigCatData().subscribe(rfqForm2Enabled => {

      if (rfqForm2Enabled) {
        this.rfqForm2Enabled = rfqForm2Enabled;
        this.menuItems.getAll().filter(menu => {
          menu.main.forEach(moduleNameObj => {
            if (moduleNameObj.state === "rfq")
              moduleNameObj.children.forEach(child => {
                if (child.state === 'editrfq') {
                  child.state = "buyer";
                  return;
                }
              })
          })
        });
      }
    });
    //config cat is ended
    this._SupplierService.getTileAvailability(contactId, companyId).subscribe(
      (result) => {
        if(result.length>0){
        let firstResult=result[0];
        this.unlockedRfq = firstResult.totalUnlockRfqCount;
       // this.showFollowedBuyerRfqsLeftMenu = firstResult.showFollowedBuyerRfqsLeftMenu;
        this.showMfgContactRfqsLeftMenu = firstResult.showMfgContactRfqsLeftMenu;
        //this.hideFollowBuyer();
        this.hideMfgContact();
        if (this.unlockedRfq == 0 && this.userType == 'Supplier') {
          this.menuItems.getAll()[0].main[0].children=this.menuItems.getAll()[0].main[0].children.filter((elem)=>{
            return elem.state!=="myunlockedrfq";
        });
        }
        if(this.accountType == "Basic"){
          this.menuItems.getAll().forEach(menu=>{
            menu.main.forEach((item, index, submenu)=>{
              if(item.icon==='icon_getmaterial'){
                submenu[index]["state"]="packages";
              }      
            });
          });  
        }
        if (["US","Canada","USA & Canada","Mexico"].indexOf(this.userLocation) < 0 ){
          this.menuItems.getAll().forEach(menu=>{
            menu.main.forEach((item, index, submenu)=>{
              if(item.icon==='icon_getmaterial'){
                submenu.splice(index, 1);  
              }      
            });
          });
        }

        this.noOfDaysLeft = firstResult.noOfDaysLeft;
        this.isCount = firstResult.unlockRfqCount;
        localStorage.setItem(
          "GrowthnoOfDaysLeft",
          this.noOfDaysLeft.toString()
        );
        localStorage.setItem("UnlockRfqCount", this.isCount.toString());
        localStorage.setItem(
          "isStarterPackageTaken",
          firstResult.isStarterPackageTaken
        );
        localStorage.setItem(
          "isStarterFreeTrialTaken",
          firstResult.isStarterFreeTrialTaken
        );
        if (this.isCount > 0) {
          this.remainingStatus = true;
          this.refreshCountShowStatus = false;
        } else if (this.isCount === 0) {
          this.refreshCountShowStatus = true;
          this.remainingStatus = false;
        }
        if (
          firstResult.isEligibleForGrowthPackage === 1 &&
          firstResult.isGrowthPackageTaken !== 1
        ) {
          this.isEligibleForGrowthPackage = true;
          this.isRemainingTileShow = false;
          this.isReadyForMoreImg = false;
        } else {
          this.isEligibleForGrowthPackage = false;
          this.isRemainingTileShow = true;
        }
      }
      },
      (error) => {
        console.log("err", error);
      },

      () => { }

    );
  }

  mixPanelTracking(ev) {
    const submitModel = JSON.parse(localStorage.getItem("iContactViewModel"));
    var reqData = {
      "email": localStorage.getItem("User2"),
      "event": ev,
      "host": environment.AppUrl,
      "path": this.router.url,
      "ip": {ip: this.ipAddress},
      "browser": window.navigator.userAgent,
      "os": window.navigator.appVersion,
      "supplierName": submitModel.firstName + " " + submitModel.lastName,
    }
    this._rfqService.mixPanelStarter(reqData).subscribe((result: any) => {
      // console.log(result);
    });
  }

  redirectToCreateRfq(redirect, page) {
    if (redirect) {
      this._profileService.getConfigCatData().subscribe(rfqForm2Enabled => {
        let url = environment.AppUrl;
        if (rfqForm2Enabled) {
          url = url + "#/rfq/buyer";
        } else {
          url = url + "#/rfq/editrfq";
        }
        window.location.replace(url);
      });
    }
  }

  scheduleDemo() {
    if (this.loggedUserRole === appConstants.UserRole.Buyer) {
      window.open(environment.ScheduleDemoBuyerUrl)
    } else {
      window.open(environment.ScheduleDemoUrl)
    }
  }

  checkScheduleDemoStatus() {
    if (this.loggedUserRole === appConstants.UserRole.Buyer) {
      this.setScheduleDemoStatus()
    } else {
      if (this.accountType === appConstants.AccountType.Gold || this.accountType === appConstants.AccountType.Platinum) {
        this.showScheduleDemo = false;
        this.sidebarFixedNewHeight = "78%"
      } else {
        this.setScheduleDemoStatus()
      }
    }
  }

  setScheduleDemoStatus() {
    if (this.userLocation === 'US' || this.userLocation == 'Canada' || this.userLocation == 'Mexico / South America' || this.userLocation == 'Mexico') {
      this.showScheduleDemo = true;
    } else {
      this.showScheduleDemo = false;
      this.sidebarFixedNewHeight = "78%"
    }
  }

 /* commenitng method as Followed Buyers RFQs itself is removed from menue in OD-267  
 hideFollowBuyer() {
    if (this.userType === appConstants.UserRole.Supplier) {
      if (!this.showFollowedBuyerRfqsLeftMenu) {
        this.menuItems.getAll()[0].main[0].children.splice(-1);
      }
    }
  } */

  hideMfgContact() {
    if (this.userType === appConstants.UserRole.Supplier) {
      if (!this.showMfgContactRfqsLeftMenu) {
        this.menuItems.getAll()[3].main.shift()
      }
    }
  }
////////////////working till here
  openedMenu="";
  leftMenuParentClickHandler(item,outerIndex,mainIndex){
    
    if (item.icon === 'ti-email') {
      this.toggleLiveMessages();
    }
    if (item.icon === 'ti-bell') {
      this.toggleLiveNotification();
    }

   let sectionToOpen=outerIndex+'_'+mainIndex
    if(this.openedMenu==sectionToOpen){
      sectionToOpen="";
    }
   this.openedMenu=sectionToOpen;
    if(item.type === 'external' ){
      let target= item.target ? '_blank' : '_self'
      window.open(item.external, target).focus();
      return;
    }
    if(item.type === 'link' ){
       this.router.navigateByUrl(item.state);
       return;
    }
    
  }
  leftMenuChildClickHandler(item,subItem,outerIndex,mainIndex){
    this.openedMenu=outerIndex+'_'+mainIndex;
    if(item.type === 'sub' ){
      let kkk="/"+item.state+ (subItem.state?"/"+subItem.state:"");
      console.log(kkk)
      this.router.navigateByUrl(kkk);
    }
  }
  reloadDashBoardComp() {
    this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
      const url = (this.isBuyerProfile() === 'Supplier') 
                    ? "/dashboard/supplier/ecommerce/" 
                    : "/dashboard/buyer/default/";
      this.router.navigate([url]);
    });
  }

  childSubMenuClickHandler(childSubMenu){
    if (childSubMenu.reDirectToSearchManufacturer) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/source"], {
          queryParams: { page: "manufacturer-directory/" },
        })
      );
      window.open("#" + url, "_blank");
      return;
    }
    if (childSubMenu.reDirectToLiveRFQ) {
      window.open(environment.RedirectionToCommunityPages + "live-rfqs/");
      return;
    }
    if (childSubMenu.reDirectToMarketPlacePulse) {
      window.open(environment.RedirectionToCommunityPages + "/marketplace-pulse/rfqs/");
      return;
    }
    if (childSubMenu.isFindJob) {
      window.open(environment.RedirectionToCommunityPages + "/jobs/");
      return;
    }
    
    if (childSubMenu.reDirectToUsManufacturer) {
      window.open(environment.RedirectionToCommunityPages + "/manufacturer-directory/?search=&filter_location=united-states");
      return;
  }
    if (childSubMenu.reDirectToAsianManufacturer) {
      window.open(environment.RedirectionToCommunityPages +
        "/manufacturer-directory/?search=&ep_filter_manufacturing_location=asia");
        return;
    } 
    if (childSubMenu.reDirectToCanadianManufacturer) {
      window.open(environment.RedirectionToCommunityPages +"/manufacturer-directory/?search=&ep_filter_manufacturing_location=canada");
      return;
    }
    if (childSubMenu.reDirectToEuropeanManufacturer) {
      window.open(environment.RedirectionToCommunityPages +
        "/manufacturer-directory/?search=&ep_filter_manufacturing_location=europe");
        return;
    }
    if (childSubMenu.reDirectToMexicanOrSouthAfricanManufacturer) {
      window.open(environment.RedirectionToCommunityPages +
        "/manufacturer-directory/?search=&ep_filter_manufacturing_location=mexico-south-america"
      );
      return;
    }
  }
  sssssss(submenu){
    if (submenu.isPostJob) {
      window.open(environment.RedirectionToCommunityPages + "/jobs/post/");
      return;
    }
    if (submenu.isManufac) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/source"], {
          queryParams: { page: "manufacturer-directory/" },
        })
      );
      window.open("#" + url, "_blank");
      return;
    }
    if (submenu.reDirectToJoinToday) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/source"], {
          queryParams: { page: "community/" },
        })
      );
      window.open("#" + url, "_blank");
      return;
    }
    if (submenu.reDirectToManufacturingJob) {
      window.open(environment.RedirectionToCommunityPages + "/jobs/");
      return;
    }
    if (submenu.reDirectToClassifieds) {
      window.open(environment.RedirectionToCommunityPages + "/classifieds/");
      return;
    }
    if (submenu.reDirectToForums) {
      window.open(environment.RedirectionToCommunityPages + "/forums/");
      return;
    }
    if (submenu.reDirectToManufacturingHelpCenterBuyer) {
      const url = this.router.serializeUrl(
         this.router.createUrlTree(["/source"], {
           queryParams: {
             page: "/knowledge.mfg.com/getting-started-as-a-buyer",
           },
         })
       );
       window.open("#" + url, "_blank");
       return;
     }
     if (submenu.reDirectToManufacturingHelpCenterManuf) {
      const url = this.router.serializeUrl(
         this.router.createUrlTree(["/source"], {
           queryParams: {
             page: "/knowledge.mfg.com/getting-started-as-a-manufacturer",
           },
         })
       );
       window.open("#" + url, "_blank");
       return;
     }
    if (submenu.reDirectToBlog) {
      window.open(environment.RedirectionToCommunityPages + "/blog/");
      return;
    }
    if (submenu.rediretToStaging) {
      window.open(environment.RedirectionToCommunityPages + "about-us/");
      return;
    }
    this.childSubMenuClickHandler(submenu.redirectToCreateRfq);
    this.redirectToCreateRfq(submenu.redirectToCreateRfq, submenu.page);                 
  }

 
}
