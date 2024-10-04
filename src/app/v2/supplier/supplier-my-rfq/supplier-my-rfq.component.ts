import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from "@angular/core";
import { ISupplierRFQViewModel } from "../../../core/models/rfqModel";
import { RfqService } from "../../../core/services/rfq/rfq.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ProfileService } from "../../../core/services/profile/profile.service";
import { ProductAnalyticService } from "../../../../app/shared/product-analytic/product-analytic";
import { SupplierRfqFilterComponent } from "./filter/supplier-rfq-filter.component";
import { SupplierV2Service } from "../service/supplier.v2.service";
import { AppUtil } from "../../../../app/app.util";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-supplier-my-rfq",
  templateUrl: "./supplier-my-rfq.component.html",
  styleUrls: ["./supplier-my-rfq.component.scss"],
  providers: [],
})
export class SupplierMyRfqComponent implements OnInit, OnDestroy {
  @ViewChild('supplierRfqFilterRef') supplierRfqFilterRef: SupplierRfqFilterComponent;
  @ViewChild('showHideRfqConfirmationModel', { static: false }) showHideRfqConfirmationModel: TemplateRef<any>;
  showHideRfqConfirmationModelReference: any = "";
  showBuyerCommpleteProfile=false;
  isSupplierAccountPremiumType = false;
  rfdIdToSet: any;
  items: ISupplierRFQViewModel[] = [];
  showRfqDetailSidepanel = false;
  showBuyerMiniProfile=false;
  selectedRFQ: any = {};
  showSidePanel = false;
  cacheConfirmModel = false;
  page: number = 1;
  pageSize: number = 24;
  totalItems: number = 0;
  totalPage: number = 0

  isLoader: boolean = false;
  isRfqAvailable: boolean;

  pagesIndex: Array<number>;
  defaultAwsPath = "";

  showCapability: boolean;
  goBackFilter: any = "";
  accountType: string;
  growthRfqCount?: number;
  unlockRfqCountDefaultValue:number=1;
  filteredRfqResponseData: any;
  constructor(
    private rfqService: RfqService,
    private toastr: ToastrService,
    private router: Router,
    private supplierService: SupplierV2Service,
    private profileService: ProfileService,
    private productAnalyticService: ProductAnalyticService,
    private ngbModal: NgbModal,
  ) {
    this.isRfqAvailable = false;
    
    localStorage.setItem("suppCurrentRfqStatusId", "0");
    
    this.showSidePanel = false;
    this.selectedRFQ = {};
    this.rfqService.set(false, "isBuyerCommpleteProfile");
    this.rfqService.set(0, "rfqId");
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
      this.router.navigate(["/supplier/supplermyrfq"]);
    } else {
      localStorage.setItem("isNotificationPage", "false");
      localStorage.setItem("isBack", "true");
    }
    this.rfqService.set(false, "isBuyerCommpleteProfile");
    this.showBuyerCommpleteProfile=false;
    this.showSidePanel = false;
    this.selectedRFQ = {};
    this.rfqService.set(false, "rfqDetailDrawer");
    this.rfqService.set(false, "isBuyerMiniProfile");
  }

  openSidePanel(selectedRFQ) {
    this.selectedRFQ = selectedRFQ;
    this.showRfqDetailSidepanel = true;
    this.showSidePanel = true;
  }

  isMessageRfqPanel() {
    return this.rfqService.get("isBuyerMessage");
  }
  isRfqDrawer() {
    return this.rfqService.get("rfqDetailDrawer");
  }
  getCurrentRfqId() {
    return this.rfqService.get("rfqId");
  }
  showBuyerProfile(selectedRFQ) {
    this.selectedRFQ=selectedRFQ
    this.showBuyerMiniProfile = true;
    this.showSidePanel = true;
  }

  ngOnInit() {
    this.checkRfqCounts();
    this.accountType = localStorage.getItem("AccountType");
    this.isSupplierAccountPremiumType = ["Gold", "Platinum"].indexOf(this.accountType) > -1;
    localStorage.setItem("isMyRfqPage", "true");
    const isCapabilitySet = localStorage.getItem("isCapabilitiesFilled");
    const isCapabilitiesFlag = localStorage.getItem("isCapabilitySetToNotNow");
    if (
      (isCapabilitiesFlag == undefined || isCapabilitiesFlag == null) &&
      isCapabilitySet == "false"
    ) {
      this.showCapability = true;
    } else {
      this.showCapability = false;
    }
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_SUPPLIER_RFQ_MARKETPLACE, {});
  }
  checkRfqCounts() {
    this.supplierService.getSupplierPackageInfo(this.loggedId, this.loggedCompanyId).subscribe(
      (result) => {
        if (result && result.length>0) {
          result=result[0];
          this.growthRfqCount = result.unlockRfqCount;
          this.unlockRfqCountDefaultValue=result.unlockRfqCountDefaultValue
        }
      }
    );
  }

  getrfqRowFirstButtonText(rfq, clicked: boolean = false) {
    let url = "";
    let text = "";
    if ('Basic' === this.accountType) {
      url = "packages"
      text = "Upgrade to Quote";
    }
    if ('Starter' === this.accountType) {
      if (rfq.actionForGrowthPackage === "No Action" && rfq.rfqAccess) {
        url = "goToRfqDdetails";
        text = "Quote";
      } else {
        if (rfq.rfqPrice > 0) {
          url = "goToRfqDdetails"
          text = "Quote - $" + rfq.rfqPrice
        } else {
          url = "packages"
          text = "Upgrade to Quote";
        }
      }
    }
    if ('Growth Package' === this.accountType) {
      if (rfq.actionForGrowthPackage === "No Action" && rfq.rfqAccess) {
        url = "goToRfqDdetails";
        text = "Quote";
      } else {
        if (this.growthRfqCount > 0) {
          url = "#cacheConfirmModel"
          text = "Unlock";
        } else if (rfq.rfqPrice != null) {
          url = "goToRfqDdetails";
          text = "Quote " + ' - $' + rfq.rfqPrice;
        } else {
          url = "packages"
          text = "Upgrade to Quote";
        }
      }
    }
    if (this.isSupplierAccountPremiumType) {
      if (this.isPremium() && !rfq.isAllowQuoting) {
        url = "goToRfqDdetails";
        text = "Upgrade to Quote";
      } else {
        url = "goToRfqDdetails";
        text = "Quote";
      }
    }
    if (clicked) {
      if (url === "goToRfqDdetails") {
        this.goToRfqDdetails(rfq);
      }
      if (url.startsWith("packages")) {
        this.router.navigateByUrl(url);
      }
      if (url === "#cacheConfirmModel") {
        this.rfdIdToSet = rfq.rfqId;
        this.cacheConfirmModel = true;
      }
      return true;
    }
    return text;
  }
  rfqDetailSidepanelDataHandler(data) {
    this.showSidePanel = false;
    this.selectedRFQ = {};
  }

  goToRfqDdetails(data) {
    localStorage.setItem("suppCurrentRfqName", data.rfqName);
    this.rfqService.set(data.isRfqLike, "isRfqLike");
    this.rfqService.set(data.rfqId, "currentSupRfqDetailId");

    localStorage.setItem("suppCurrentRfqStatusId", "3");
    const encryptedRfqID = this.profileService.encrypt(data.rfqId);
    this.router.navigate(["/supplier/supplierRfqDetails"], {
      queryParams: { rfqId: encryptedRfqID },
    });
  }

  // API Call Function
  get loggedCompanyId() {
    return parseInt(localStorage.getItem("loggedCompanyId"));
  }
  get loggedId() {
    return parseInt(localStorage.getItem("LoggedId"));
  }
  utcDate(date) {
    return moment.utc(date).toDate();
  }

  filteredRFQAccepter(result: any) {
    this.filteredRfqResponseData = result;
    this.totalItems = result["data"].length;
      if(this.totalItems==0){
        this.showBuyerCommpleteProfile=false;
        this.showRfqDetailSidepanel=false;
        this.showSidePanel=false;
      }   
      this.onPageChange(1);
  }
  likeDislikeRfq(currentRfq) {
    let tosterMessage = "";
    if (currentRfq.isRfqLike) {
      tosterMessage = "RFQ has been unliked";
      currentRfq.isRfqLike = false;
    } else {
      tosterMessage = "RFQ has been liked";
      currentRfq.isRfqLike = true;
      currentRfq.isRfqDisLike = false;
    }
    this.updateLikeDisLikeRfq(currentRfq, tosterMessage);
  }
  hideUnhideRfq(currentRfq, isShowConfirmation = false) {
    if (isShowConfirmation && currentRfq.isRfqLike) {
      this.selectedRFQ = currentRfq;
      this.showHideRfqConfirmationModelReference = this.ngbModal.open(this.showHideRfqConfirmationModel,
        {}
      );
      return;
    }
    let tosterMessage = "";
    if (currentRfq.isRfqDisLike) {
      tosterMessage = "RFQ has been marked as un-hidden.";
      currentRfq.isRfqDisLike = false;
    } else {
      tosterMessage = "RFQ has been marked as hidden.";
      currentRfq.isRfqDisLike = true;
      currentRfq.isRfqLike = false;
    }
    this.updateLikeDisLikeRfq(currentRfq, tosterMessage);
  }
  closeHideRfqConfirmModel() {
    this.selectedRFQ = {};
    if (AppUtil.isNotEmptyString(this.showHideRfqConfirmationModelReference)) {
      this.showHideRfqConfirmationModelReference.close();
      this.showHideRfqConfirmationModelReference = null;
    }

  }
  updateLikeDisLikeRfq(currentRfq, tosterMessage) {
    const dataToUpdate = {
      rfqSupplierLikesId: 0,
      rfqId: currentRfq.rfqId,
      contactId: this.loggedId,
      companyId: this.loggedCompanyId,
      isRfqLike: currentRfq.isRfqLike,
      isRfqDisLike: currentRfq.isRfqDisLike,
      likeDate: new Date(),
      errorMessage: "",
      result: false,
    };
    this.isLoader = true;
    this.supplierService
      .rfqLikeOrDislike(dataToUpdate)
      .subscribe(
        (result) => {
          this.isLoader = false;
          this.closeHideRfqConfirmModel();
          if (result["result"] === true) {
            this.toastr.success(tosterMessage, "Success!");
          } else {
            this.toastr.error(result["errorMessage"], "Error!");
          }
          this.supplierRfqFilterRef.updateFilterData();
        },
        (error) => {
          this.isLoader = false;
          this.rfqService.handleError(error);
        },
        () => { this.isLoader = false; }
      );
  }

  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }
  // List Functions Ends
  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem("IsPremium");
    let IsPremiumDecrypt = this.profileService.decrypt(IsPremiumEncrypt);
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
    this.rfqService.set(0, "totalRFQCount");
    this.rfqService.set(false, 'isBuyerCommpleteProfile');
    
    this.showBuyerCommpleteProfile=false;
    this.showRfqDetailSidepanel=false;
    this.showSidePanel=false;
  }

  openedViewDetailRFQ() {
    return this.rfqService.get("rfqId");
  }
  isModelShow() {
    return this.rfqService.get("isModelShow");
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
    this.supplierService
      .setGrowthPackageUnlockRFQsInfo(data)
      .subscribe((result) => {
        this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_SUPPLIER_RFQ_UNLOCKED, {
          rfq_id: parseInt(this.rfdIdToSet)
        });
        const encryptedRfqID = this.profileService.encrypt(this.rfdIdToSet);
        this.router.navigate(["/supplier/supplierRfqDetails"], {
          queryParams: { rfqId: encryptedRfqID },
        });
      });
  }
  setRecommnededForYouBanner() {
    localStorage.setItem("isStarterPackage", null);
    localStorage.setItem("isGrowthPackage", null);
    localStorage.setItem("isPremiumClicked", null);
  }

  //////////////new method

  getCompanyInitialsForLogo(rfq) {
    return rfq.companyName.substring(0, 1).toUpperCase();
  }
  imageLoadOnError(rfqId) {
    document.getElementById("buyerImageRfqId" + rfqId).style.display = 'none';
    document.getElementById("buyerImageInitialsRfqId" + rfqId).style.display = 'block';
  }

  updatePagedItems(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.items = this.filteredRfqResponseData.data.slice(start, end);

    let totalPage = Math.floor(this.totalItems / this.pageSize);
    if (this.totalItems % this.pageSize > 0) {
      totalPage = totalPage + 1
    }
    this.totalPage = totalPage;
    let starting = 1 + Math.floor(this.page / 10) * 10,
      ending = Math.ceil(this.page / 10) * 10;
    if (ending > totalPage) {
      ending = totalPage;
    }
    if (this.page % 10 == 0) {
      return;
    }
    this.pagesIndex = Array.from({ length: ending - starting + 1 }, (_, i) => i + starting);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.updatePagedItems();
  }
  appMiniBuyerReceiver(data) {
    if (data.relodeRfqData) {
      this.supplierRfqFilterRef.updateFilterData(data)
    }
    if (data.drawerClose) {
      this.showRfqDetailSidepanel=false;
     this.showSidePanel=false;
     this.rfqService.set(false, 'isBuyerCommpleteProfile');
    }
    if (data.showBuyerCommpleteProfile) {
      this.showBuyerCommpleteProfile=true;
    }
  }
  
}