import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { Router } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../__Services/api-service/api.service";
import { IRequestDemoLinkModel } from "../../../core/models/profileModel";
import {  
  IPartsViewModel,  IRfqBuyerStatus,  ISupplierRFQViewModel,  ITempNPSDataModel,  
  ITempUploadedFiles,  ITerritoryClassificationModel,  IUploaadedFileName,  
  IUploaadedFileNameList,  SupplierDashListModel,  TrackBuyerActivityOnDashboardViewModel,
} from "../../../core/models/rfqModel";
import { MasterService } from "../../../core/services/master/master.service";
import { RfqService } from "../../../core/services/rfq/rfq.service";
import { SupplierService } from "../../../core/services/supplier/supplier.service";
import { ProductAnalyticService } from "../../../../app/shared/product-analytic/product-analytic";
import { BrowserStorageUtil } from "../../../../app/shared/browser.storage.util";
declare var InstigateBuyerDashboardSurvey: Function;

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: [
    "./default.component.scss",
    "../../../../assets/icon/icofont/css/icofont.scss",
  ],
  providers: [ApiService, ProductAnalyticService],
  encapsulation: ViewEncapsulation.None,
  animations: [
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
export class DefaultComponent implements OnInit, AfterViewInit {
  uploader: FileUploader = new FileUploader({
    url: "",
    isHTML5: true,
  });
  trackBuyerActivityOnDashboardViewModel: TrackBuyerActivityOnDashboardViewModel;
  public seoCard1Data: any;
  public seoCard2Data: any;
  public seoCard1Option: any;
  public seoCard2Option: any;
  @ViewChild("seoCard1Chart", { static: false }) seoCard1Chart: ElementRef;
  @ViewChild("seoCard2Chart", { static: false }) seoCard2Chart: ElementRef;
  public seoCard1Tag: CanvasRenderingContext2D;
  public seoCard2Tag: CanvasRenderingContext2D;
  userType: string;
  iRFQViewModel: ISupplierRFQViewModel;
  public feedbackData: any;
  public feedbackOption: any;
  public loggedUserName: string;
  isNewUser: boolean;
  isCountLoaded: boolean;
  options: any = {
    position: ["bottom", "top"],
    timeOut: 10000,
  };

  isLikedRFq: boolean;
  isSpecialInvites: boolean;
  isQuotedRfq: boolean;
  isFollowedBuyers: boolean;
  isCapabilitiesFilled: string;
  isCompanyProfileFilled: string;
  isShowdashboard: boolean;
  isLoader: boolean;
  isCreateRfqLoader: boolean = false;
  enableMeterFields = [false, false, false, false, false, false, false];
  iTempNPSDataModel: ITempNPSDataModel;
  avgNoOfStars: number;
  total1StarRatingPer: number;
  total2StarRatingPer: number;
  total3StarRatingPer: number;
  total4StarRatingPer: number;
  total5StarRatingPer: number;
  totalReviews: number;
  iRequestDemoLinkModel: IRequestDemoLinkModel = {} as IRequestDemoLinkModel;
  hasBaseDropZoneOver = false;
  ITempUploadedFiles: ITempUploadedFiles;
  ITempUploadedFilesColl: ITempUploadedFiles[];
  partUplodcount = 0;
  totalUpPartProcessed: number;
  iPartsViewModel: IPartsViewModel;
  iPartUploadedFileName: IUploaadedFileName;
  iPartUploadedFileNameList: IUploaadedFileNameList;
  iUploaadedFileName: IUploaadedFileName;
  iRfqBuyerStatus: IRfqBuyerStatus;
  addPartRfqId: any = 0;
  isPartUploadApiCall: boolean;
  accountVerifyMessage = false;
  SupplierDashListModel: SupplierDashListModel;
  newMessageCount: number = 0;
  newNotifications: number = 0;
  showOrder: any;
  fromGetStartedFlow: string;
  awardNotificationtimer: any;
  constructor(
    private router: Router,
    private _rfqService: RfqService,
    private _toastr: ToastrService,
    private _SupplierService: SupplierService,
    private _masterService: MasterService,
    private _Http: Http,
    public rest: ApiService,
    private productAnalyticService: ProductAnalyticService
  ) {
    console.log("check constructor")
    this.totalUpPartProcessed = 0;
    this.isPartUploadApiCall = false;
    this._rfqService.set(false, "showSidePanel");
    this.loggedUserName = localStorage.getItem("User2");
    this.isCountLoaded = true;
    // debugger;

    this.isLikedRFq = false;
    this.isSpecialInvites = true;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
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
  }

  ngOnInit() {
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_LAND_ON_DASHBOARD, {
      user_status: 'Logged in',
      page_type: 'Dashboard',
      page_url: environment.AppUrl + "#/dashboard/buyer/default"
    });
    this._rfqService.getOrderManagementDetails(this.loggedId).subscribe(
      (result) => {
        if (result.isOrderManagementTileViewed === true) {
          this.showOrder = false;
        } else {
          this.showOrder = true;
        }
      },
      (error) => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
    this.awardNotificationtimer = setInterval(() => {
      if (localStorage.getItem('AwardDatePassedNotification') !== new Date().toLocaleDateString("en-US").toString()) {
        this.SendAwardDatePassedNotification();
      }
    }, 60000);
    this.ITempUploadedFilesColl = [];
    this.iniITempUploadedFiles();
    this.uploadPartImages();
    this.initRfqBuyerStatus();
    const isNew = localStorage.getItem("isNewUser");
    this.isNewUser = false;
    this.getRatingStar();
    this.getCountsOfRfqs();
    this.getBuyerLocation();
    this.getEmailVerificationStatus();
    this.getRfqList();
  }

  getRfqList() {
    this.isLoader = true;
    this._rfqService.getSupplierRfqCount(this.SupplierDashListModel).subscribe(
      (result) => {
        this.isLoader = false;
        this.newMessageCount = result.newMessages;
        this.newNotifications = result.newNotifications;
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
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  SendAwardDatePassedNotification() {
    let conatctId = this.loggedId;
    if (conatctId !== null && conatctId !== undefined) {
      this._rfqService.SendAwardDatePassedNotification(conatctId).subscribe(
        result => {
          if (result.result == true) {
            localStorage.setItem('AwardDatePassedNotification', new Date().toLocaleDateString("en-US").toString());
          } else {
            localStorage.setItem('AwardDatePassedNotification', "");
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }

  getEmailVerificationStatus() {
    this.userType = localStorage.getItem("Usertype");
    this._masterService
      .getEmailVerificationStatus(this.loggedId)
      .subscribe((response) => {
        if (!response.isError) {
          this.accountVerifyMessage = !response.data;
          localStorage.setItem("isEmailVerify", "" + response.data);
        }
      });
  }

  ngAfterViewInit() {
    this.userType = localStorage.getItem("Usertype");
    if (this.userType === "Supplier") {
      this.router.navigate(["dashboard/supplier/ecommerce"]);
    } else if (this.userType === "Buyer") {
      this.router.navigate(["dashboard/buyer/default"]);
    }
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem("LoggedId"));
  }
  navigateToview() {
    this._SupplierService.set(true, "dashboard");
    this.router.navigateByUrl("/profile/buyerprofile");
  }

  navigateToRfq() {
    this.trackBuyerActivityOnDashboardViewModel =
      new TrackBuyerActivityOnDashboardViewModel();
    this.trackBuyerActivityOnDashboardViewModel.contactId = this.loggedId;
    this.trackBuyerActivityOnDashboardViewModel.activityId = 1;
    this._SupplierService
      .buyerActivityOnDashboard(this.trackBuyerActivityOnDashboardViewModel)
      .subscribe((res) => { });
    this.router.navigateByUrl("/rfq/editrfq");
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
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem("loggedCompanyId"));
  }
  getCountsOfRfqs() {
    const data = this.loggedCompanyId;
    if (!Number.isNaN(this.loggedCompanyId)) {
      this._rfqService
        .GetBuyerRFQCount(this.loggedId, this.loggedCompanyId)
        .subscribe(
          (result) => {
            this.iRFQViewModel = result;
            this.triggerPendo(this.iRFQViewModel, "Dashboard")
            this.isCountLoaded = false;
          },
          (error) => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
    }
  }

  getPercentageClass(percentCount: number) {
    const myStyles = {
      width: "" + percentCount + "%",
    };
    return myStyles;
  }
  isSideMenuVisible() {
    return this._rfqService.get("isSideMenuVisible");
  }

  openLikedRFq() {
    this.isLikedRFq = true;
    this.isSpecialInvites = false;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
  }
  openSpecialInvites() {
    this.isLikedRFq = false;
    this.isSpecialInvites = true;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = false;
  }
  openQuotedRfq() {
    this.isLikedRFq = false;
    this.isSpecialInvites = false;
    this.isQuotedRfq = true;
    this.isFollowedBuyers = false;
  }
  openFollowedBuyers() {
    this.isLikedRFq = false;
    this.isSpecialInvites = false;
    this.isQuotedRfq = false;
    this.isFollowedBuyers = true;
  }

  isSidePanel() {
    return this._rfqService.get("showSidePanel");
  }
  isSupplierProfileDrawer() {
    return this._rfqService.get("supplierProfileDrawer");
  }
  isMessageDrawer() {
    return this._rfqService.get("messageRfq");
  }
  isMessageRfqPanel() {
    return this._rfqService.get("messageRfq");
  }
  isMessageThreadPanel() {
    return this._rfqService.get("messageThreadDrawer");
  }
  getMessageIdForThread() {
    return this._rfqService.get("messageThreadId");
  }
  isTransferRfqPanel() {
    return this._rfqService.get("transferRfq");
  }
  isRfqDetailDrawer() {
    return this._rfqService.get("rfqDetailDrawer");
  }
  isPartsLibraryDrawer() {
    return this._rfqService.get("partLibraryDrawer");
  }
  getCurrentRfqId() {
    return this._rfqService.get("rfqId");
  }
  getBuyerLocation() {
    const count = this._rfqService.get("ITerritoryClassificationModelColl");
    if (count !== undefined) {
    } else {
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          this._rfqService.set(data2, "ITerritoryClassificationModelColl");
        },
        (error) => () => {
          this._rfqService.handleError(error);
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
  openPartLibraryDrawer() {
    event.stopPropagation();
    this._rfqService.set(false, "supplierProfileDrawer");
    this._rfqService.set(false, "messageThreadDrawer");
    this._rfqService.set(false, "messageRfq");
    this._rfqService.set(true, "showSidePanel");
    this._rfqService.set(true, "partLibraryDrawer");
  }
  isModelShow() {
    return this._rfqService.get("isModelShow");
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initPartViewModel() {
    this.iPartsViewModel = {
      depth: 0,
      diameter: 0,
      height: 0,
      customPartDescription: "",
      isUpdatedFromVision: false,
      length: 0,
      partSizeUnitId: 0,
      surface: 0,
      volume: 0,
      width: 0,
      partId: 0,
      partName: "",
      partNumber: "",
      rfqPartId: 0,
      modifiedBy: this.loggedId,
      partCommodityCode: "",
      partDescription: "",
      materialId: 0,
      partQtyUnitId: 0,
      // partCategoryId: 0,
      statusId: 0,
      companyId: 0,
      contactId: 0,
      currencyId: 0,
      creationDate: "",
      modificationDate: "",
      rfqId: 0,
      rfqPartQuantityList: [],
      deliveryDate: null,
      partsFiles: [],
      rfqPartFile: "",
      errorMessage: "",
      result: true,
      primaryPartFile: "",
      postProductionProcessId: 0,
      moveToPartId: 0,
      categoryName: "",
      materialName: "",
      partQtyUnitName: "",
      postProductionProcessName: "",
      isRfq1stquantityChanged: false,
      isRfq2ndquantityChanged: false,
      isRfq3rdquantityChanged: false,
      createNewPart: false,
      rfqPartTotalQuotedCount: 0,
      isValidDeliveryDate: null,
      isDefaultPartCategory: false,
      isDefaultPostProduction: false,
      isDefaultMaterial: false,
      isDefaultDeliveryDate: false,
      isExistingPart: null,
      parentPartCategoryId: 0,
      childPartCategoryId: 0,
      isChildCategorySelected: false,
      isChildSameAsParent: false,
    };
  }

  initRfqBuyerStatus() {
    this.iRfqBuyerStatus = {
      description: "",
      position: 0,
      rfqBuyerstatusId: 0,
      rfqBuyerstatusLiKey: "",
    };
  }

  iniITempUploadedFiles() {
    this.ITempUploadedFiles = {
      fileName: "",
      isProcessed: false,
    };
  }

  resetFileNameModel() {
    this.iUploaadedFileName = {
      oFileName: "",
      CompleteFileName: "",
    };
  }
  showPageDataLoding: string = 'hide';
  uploadPartImages() {
    this.uploader.onAfterAddingAll = (fileItem) => {
      this.showPageDataLoding = 'show';
      this._rfqService.addFileRedirectToRfqPage(fileItem).subscribe(
        result => {
          this.showPageDataLoding = 'hide';
          if (result.continueOld) {
            this.onClickofAddNewPart();
            this.uploadPartDetailsFiles1(fileItem);
          } else {
            if (!result.isFailed) {
              this.router.navigateByUrl("rfq/buyer?rfqId=" + result.rfqId);
            }
          }
        });
    };
  }

  fileNameArr: any[] = [];
  gfileItem: any[] = [];
  uploadPartDetailsFiles1(fileItem) {
    this.gfileItem = fileItem;
    const files = fileItem;
    for (const entry of fileItem) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe((res) => {
          const result = JSON.parse(res["_body"]);          
          const fName = result["fileName"];
          entry.isUploaded = true;
          const fileNameArray = fName.split("_S3_");
          this.fileNameArr.push({
            ofileName: fileNameArray[1],
            completeFileName: fName,
          });
          if (this.fileNameArr.length == fileItem.length) {
            this.isCreateRfqLoader = true;
            this.isPartUploadApiCall = false;
            setTimeout(() => {
              this.getRfqParts();
            }, 1000);
          }
        });
      }
    }
  }

  uploadAllPartFiles(fileItem) {
    const file = fileItem._file;
    this.upload(file).subscribe(
      (res) => {
        const result = JSON.parse(res["_body"]);
        if (result.result) {
          const fNmae = result["fileName"];
          this.initPartViewModel();
          this.iniITempUploadedFiles();
          this.ITempUploadedFiles.fileName = fNmae;
          this.ITempUploadedFiles.isProcessed = false;
          this.ITempUploadedFilesColl.push(this.ITempUploadedFiles);
          this.partUplodcount = this.partUplodcount + 1;
          localStorage.setItem("isNewUser", "false");
          if (this.uploader.queue.length === this.partUplodcount) {
            this.addFirstPartUploaded();
          } else {
          }
          this.resetFileNameModel();
        } else {
          this.handleError(result.errorMessage);
          this.isCreateRfqLoader = false;
        }
      },
      (error) => {
        this.handleError(error);
        this.isCreateRfqLoader = false;
      },
      () => { }
    );
  }
  addPartUploaded() {
    if (this.totalUpPartProcessed !== this.ITempUploadedFilesColl.length) {
      this.ITempUploadedFilesColl.forEach((element) => {
        if (!this.isPartUploadApiCall && !element.isProcessed) {
          this.addUpPart(element.fileName);
          element.isProcessed = true;
          this.totalUpPartProcessed = this.totalUpPartProcessed + 1;
        }
      });
    } else {
      this.isCreateRfqLoader = false;
      this.totalUpPartProcessed = 0;
      this.ITempUploadedFilesColl = [];
      this.iniITempUploadedFiles();
    }
  }


  //NEW CHANGES FOR M2-4352 ticket
  onClickofAddNewPart() {
    this.addFirstPartUploaded();

  }
  addFirstPartUploaded() {
    this.addUpPart("New Part");
    this.totalUpPartProcessed = 1;
  }
  updatePartDetailsInfo: IPartsViewModel;
  rfqPartId: number = 0;
  getRfqParts() {
    this._rfqService.getRfqParts(this.iPartsViewModel.rfqId).subscribe(
      (result: any) => {
        this.updatePartDetailsInfo = result[0];
        this.rfqPartId = result[0].rfqPartId;
        this.iPartsViewModel.rfqPartId = result[0].rfqPartId;
        this.addUpPart1();

      },
      (error) => {
        this.handleError(error);
      },
      () => { }
    );
  }
  addUpPart1() {
    if (this.fileNameArr.length == this.gfileItem.length) {
      this.isCreateRfqLoader = false;
      this.isPartUploadApiCall = false;
      let partsFiles: any[] = [];
      this.fileNameArr.forEach((element: any) => {
        partsFiles.push(element.completeFileName);
      });
      this.iPartsViewModel.partsFiles = partsFiles;
      if (this.iPartsViewModel.partsFiles.length != 0) {
        this._rfqService.addPart(this.iPartsViewModel).subscribe(
          (result2) => {
            this.fileNameArr = [];
            this.addPartRfqId = result2.rfqId;
            this.isPartUploadApiCall = false;
            this.iPartsViewModel = result2;
            this.iPartsViewModel.partId = result2.partId;
            this.iPartsViewModel.rfqId = result2.rfqId;
            localStorage.setItem("isNewUser", "false");
            this.isCreateRfqLoader = false;
            localStorage.setItem("EditRfqName", result2.rfqId.toString());
            localStorage.setItem("EditRfqId", result2.rfqId.toString());
            this.router.navigateByUrl("/rfq/editrfq");
          },
          (error) => {
            this.isCreateRfqLoader = false;
            this.handleError(error);
          },
          () => { }
        );
      }
    }
  }

  addUpPart(fNmae) {
    this.initPartViewModel();
    
    if (!this.isPartUploadApiCall) {
      this.isPartUploadApiCall = true;
      this.iPartsViewModel.rfqPartFile = "New Part";
      this.iPartsViewModel.primaryPartFile = "New Part";
      this.iPartsViewModel.contactId = parseInt(
        localStorage.getItem("LoggedId")
      );
      this.iPartsViewModel.companyId = this.loggedCompanyId;
      this.iPartsViewModel.rfqId = 0;
      let partsFiles: any[] = [];
      this.fileNameArr.forEach((element: any) => {
        partsFiles.push(element.completeFileName);
      });
      this.iPartsViewModel.partsFiles = [];
      if (this.iPartsViewModel.partsFiles.length == 0) {
        this._rfqService.addPart(this.iPartsViewModel).subscribe(
          (result2) => {
            this.addPartRfqId = result2.rfqId;
            this.isPartUploadApiCall = false;
            this.iPartsViewModel = result2;
            localStorage.setItem("isNewUser", "false");
            this.iPartsViewModel.rfqPartId = result2.rfqPartId;
            this.iPartsViewModel.rfqId = this.addPartRfqId;
          },
          (error) => {
            this.isCreateRfqLoader = false;
            this.handleError(error);
          },
          () => { }
        );
      }
    }
  }

  upload(fileToUpload: any) {
    this.fromGetStartedFlow = "true";
    localStorage.setItem("fromGetStartedFlow", this.fromGetStartedFlow);
    const input = new FormData();
    input.append("file", fileToUpload);
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + "/Upload/UploadFileNDA";
    return this._Http.post(url, input, {
      headers: headers,
    });
  }
  createAuthorizationHeader(headers: Headers) {
    headers.append("Authorization", "bearer " + BrowserStorageUtil.getToken());
  }
  handleError(error) {
    if (error.status === 0) {
      this._toastr.warning("Please check connection", "Warning!");
    } else if (error.status === 400) {
      this._toastr.warning(JSON.stringify(error.error), "Warning!");
    } else if (error.status === 401) {
      this._toastr.warning(
        "Your session is expired. Please login again to continue.",
        "Warning!"
      );
    }
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
  isPartFileSelectedinFlowOrNot: boolean = true;
  setManfacValue() {
    localStorage.setItem(
      "isPartFileSelectedinFlowOrNot",
      this.isPartFileSelectedinFlowOrNot.toString()
    );
    this._rfqService.redirectToNewBuyer("rfq/editrfq");
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_RFQ_FORM_START, {
      date: new Date,
      rfq_count: localStorage.getItem('submitRfqCount'),
      qualified_buyer: localStorage.getItem('isEmailVerify'),
    });
    this.triggerPendo(this.iRFQViewModel, "Step1")
  }

  navigateStep1() {
    this.triggerPendo(this.iRFQViewModel, "Step1")
    this._rfqService.redirectToNewBuyer("rfq/editrfq");
  }
  closeOrderPopup() {
    this.showOrder = false;
    this._rfqService.saveOrderManagement(this.loggedId).subscribe(
      (result) => {
        console.log("result----------->", result);
      },
      (error) => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  // ******* Triger Pendo******
  triggerPendo(data, step) {
    const visitor = {
      event: step,
      noOfRfqCreated: data.myRFQCount,
      draftRFQCreated: data.draftRFQCreatedCount,
      releasedRFQMp: data.rfqToReleaseCount,
      RFQToBeAwarded: data.rfqToAwardCount,
      NDAToApprove: data.ndaToApproveCount
    }
  }
}


function e(h, g, i) {
  if (i == null) {
    i = "rgba(0,0,0,0)";
  }
  return {
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        label: "",
        borderColor: h,
        borderWidth: 2,
        hitRadius: 0,
        pointHoverRadius: 0,
        pointRadius: 3,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 12,
        pointBackgroundColor: "#fff",
        pointBorderColor: h,
        pointHoverBackgroundColor: h,
        pointHoverBorderColor: "#000",
        fill: true,
        backgroundColor: i,
        data: g,
      },
    ],
  };
}

function f() {
  return {
    title: {
      display: !1,
    },
    tooltips: {
      enabled: true,
      intersect: !1,
      mode: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10,
    },
    legend: {
      display: !1,
      labels: {
        usePointStyle: !1,
      },
    },
    responsive: !0,
    maintainAspectRatio: !0,
    hover: {
      mode: "index",
    },
    scales: {
      xAxes: [
        {
          display: !1,
          gridLines: !1,
          scaleLabel: {
            display: !0,
            labelString: "Month",
          },
        },
      ],
      yAxes: [
        {
          display: !1,
          gridLines: !1,
          scaleLabel: {
            display: !0,
            labelString: "Value",
          },
          ticks: {
            beginAtZero: !0,
          },
        },
      ],
    },
    elements: {
      point: {
        radius: 4,
        borderWidth: 12,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  };
}
