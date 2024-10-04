import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BuyerMyQuotesRequestViewModel } from "./../../../core/models/rfqModel";
import { RfqService } from "./../../../core/services/rfq/rfq.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-my-orders",
  templateUrl: "./my-orders.component.html",
  styleUrls: ["./my-orders.component.scss"],
})
export class MyOrdersComponent implements OnInit {
  inputLength = 24;
  searchFilterValue: string;
  iBuyerQuotesViewModel: BuyerMyQuotesRequestViewModel;
  allLocationFilterValue: string;
  allStatusFilterValue: any;
  currentIndex = 1;
  pages = 3;
  pageStart = 1;
  isLoader: boolean;
  pageSize = 24;
  pageNumber = 0;
  pagesIndex: Array<number>;
  resultData: any[];
  orderListArray: any[];
  companyUsersArray: any[];
  filteredCompanyName: any[];
  supName: any[];
  contName: any[];
  statusId: any;
  searchText: string;
  contactIds: any[];
  contactFilterValue: any;
  companyFilterValue: any;
  companyIds: any;
  companyContactIds: any;
  companyUsersFilterValue: any;
  encryptedContId: any;
  localLoggedId: number;
  encryptedContactId: any;
  rfqId: any;
  poOrderJson: any;
  newPart: any;
  firstQuantity: any;
  quantityUnit: any;
  manufactProcess: any;
  manufactTechnique: any;
  material: any;
  postProdProc: any;
  partSpecific: any;
  partInfoManufact: any;
  selectedDivIndex: any;
  selectedPartDivIndex: any = 0;
  isExpand: boolean;
  showDetails: string = "View Details";
  hideDetails: string = "Hide Details";
  poDatilsJsonParts: any[];
  partsAvail: any;
  uniqueObjectArray: any[];
  uniquesupplierArray: any[];
  uniqueContactArray: any[];
  AllCompanyContacts: string;
  reshapeUniqueId: string;
  SupplierId: any;
  poFile: any;
  noFiles: boolean;
  userType: string;
  supplierSide: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(private _rfqService: RfqService, private _toastr: ToastrService) {
    (this.allStatusFilterValue = null),
      (this.contactFilterValue = null),
      (this.companyFilterValue = null);
      (this.companyUsersFilterValue = null);
  }
  ngOnInit() {
    this.companyUsersFilterValue = this.LoggedId;
    this.getBuyerOrderList();
    this.getCompanyUsersList();
    this.encryptedContId = localStorage.getItem("LoggedIdEncript");
    this.userType = localStorage.getItem("Usertype");

    if(this.userType ==="Buyer"){
      this.supplierSide = false;
    }else if(this.userType === "Supplier" ){
      this.supplierSide = true;
    }

  }

  filterAll() {
    this.statusId = this.allStatusFilterValue;
    this.searchText = this.searchFilterValue;
    this.contactIds = this.contactFilterValue;
    this.companyIds = this.companyFilterValue;
    this.companyContactIds = this.companyUsersFilterValue;
    this.currentIndex = 1;
    this.pages = 4;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.isLoader = true;
    this.getBuyerFilterOrderList();
  }
  get LoggedId() {
    return parseInt(localStorage.getItem("LoggedId"));
  }
  get LoggedCompanyId() {
    return parseInt(localStorage.getItem("loggedCompanyId"));
  }
  getBuyerOrderList() {
    var reqData = {
      contactId: this.LoggedId,
      status: this.statusId,
      companyIds: this.companyIds,
      contactIds: this.contactIds,
      searchText: this.searchText,
      pageNumber: 1,
      pageSize: this.pageSize,
    };
    this._rfqService.getOrdersList(reqData)
    .pipe(takeUntil(this.destroy$)).pipe(
      takeUntil(this.destroy$)).
      subscribe((responseData: any) => {
    if(responseData.result){
        this.orderListArray = responseData.data;
        if(this.orderListArray.length>0){
          this.rfqId = this.orderListArray[0].rfqId;
          this.firstExpand();
        }

        this.uniqueObjectArray = [
          ...new Map(
            this.orderListArray.map((item) => [item.contactName, item])
          ).values(),
        ];
        this.uniquesupplierArray = [
          ...new Map(
            this.orderListArray.map((item) => [item.supplierCompanyName, item])
          ).values(),
        ];
    }
    });   
  }
  getCompanyUsersList() {
    this._rfqService.getCompanyUsers(this.LoggedId).pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.companyUsersArray = result.data;
      this.uniqueContactArray = [
        ...new Map(
          this.companyUsersArray.map((data) => [data.fullName, data])
        ).values(),
      ];
    });
  }

  getBuyerFilterOrderList() {
    var reqData = {
      contactId: this.LoggedId,
      status: this.statusId,
      companyIds: this.companyIds,
      contactIds: this.contactIds,
      companyContactIds: this.companyContactIds,
      searchText: this.searchText,
      pageNumber: 1,
      pageSize: this.pageSize,
    };
    this._rfqService.getOrdersList(reqData).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      this.orderListArray = result.data;
    });
  }

  downloadPoFile(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
      }
    });
  }

  firstExpand(){
    this.rfqId = this.orderListArray[0].rfqId
    this.hideDetails = "Hide Details";
    this.isExpand = false;
    this.selectedDivIndex = 0;
    this.poDetails(this.rfqId);
  }

  onExpand(index) {
    if (this.selectedDivIndex !== index) {
      this.showDetails = "View Details";
      this.selectedDivIndex = index;
      this.rfqId = this.orderListArray[this.selectedDivIndex].rfqId;
      this.isExpand = true;
      this.poDetails(this.rfqId);
    } else {
      this.hideDetails = "Hide Details";
      this.isExpand = false;
      this.selectedDivIndex = null;
    }
    this.selectedPartDivIndex = 0;
  }

  onExpandParts(index) {
    if (this.selectedPartDivIndex !== index) {
      this.selectedPartDivIndex = index;
    } else {
      this.selectedPartDivIndex = null;
    }
  }

  poDetails(rfqId) {
    this._rfqService.getPoDetails(rfqId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.poOrderJson = data;
      this.reshapeUniqueId = this.poOrderJson.reshape_order_id;
      this.SupplierId = this.poOrderJson.supplier_id;
      if (this.poOrderJson.parts) {
        this.partsAvail = this.poOrderJson.parts;
      }
    });
  }
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = "";
    }
    this.filterAll();
  }

  searchByKey(event) {
    if (event.keyCode === 13) {
      this.filterAll();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.filterAll();
    }
  }
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= this.pageStart + this.pages) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iBuyerQuotesViewModel.pageNumber = this.currentIndex;
    this.getBuyerOrderList();
  }
  setPage(index: number) {
    this.currentIndex = index;
    this.iBuyerQuotesViewModel.pageNumber = this.currentIndex;
    this.getBuyerOrderList();
  }
  isSidePanel() {
    return this._rfqService.get("showSidePanel");
  }
  isMessageDrawer() {
    return this._rfqService.get("messageRfq");
  }
  isBuyerProfileDrawer() {
    return this._rfqService.get("isBuyerMiniProfile");
  }

  openMessageDrawer(event, contactId, messageRFQId, fromContName, index) {
    if (localStorage.getItem("isEmailVerify") == "false") {
      this._toastr.warning("Please verify your email.", "Warning");
    } else {
      event.stopPropagation();
      this._rfqService.set(messageRFQId + "_" + index, "rfqId");
      this._rfqService.set(true, "showSidePanel");
      this._rfqService.set(true, "messageRfq");
      this._rfqService.set(false, "supplierProfileDrawer");
      this._rfqService.set(false, "rfqDetailDrawer");
      this._rfqService.set(contactId, "selectContactIdsForMEessage");
      this._rfqService.set(messageRFQId, "selectContactRFQId");
      this._rfqService.set(fromContName, "nameOfBuyer");
    }
  }

  currentContact() {
    return this._rfqService.get("tilefocusId");
  }
  openBuyerDrawer(contactId, folId) {
    this._rfqService.set(false, "showSidePanel");
    this._rfqService.set(false, "rfqDetailDrawer");
    this._rfqService.set(true, "isBuyerMiniProfile");
    this._rfqService.set(contactId, "buyerProfileId");
    this._rfqService.set(false, "isBuyerMessage");
    this._rfqService.set(folId, "tilefocusId");
    this._rfqService.set(true, "messageRfq");
    setTimeout(() => {
      this._rfqService.set(true, "showSidePanel");
      this._rfqService.set(true, "isBuyerMiniProfile");
      this._rfqService.set(true, "messageRfq");
      const elmnt = document.getElementById(folId);
      elmnt.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "nearest",
      });
    }, 1000);
  }

  openViewAllSidePanel(rfqPartId) {
    this._rfqService.set(false, "iscontact");
    this._rfqService.set(false, "messageRfq");
    this._rfqService.set(true, "showSidePanel");
    this._rfqService.set(true, "rfqViewAllDrawer");
    this._rfqService.set(rfqPartId, "rfqPartId");
    this._rfqService.set(this.reshapeUniqueId, "reshapeUniqueId");
    this._rfqService.set(this.SupplierId, "SupplierId");
  }
  isMyOrder() {
    return this._rfqService.get("rfqViewAllDrawer");
  }

  isSupplierProfileDrawer() {
    return this._rfqService.get("supplierProfileDrawer");
  }

  openProfileSideDrawer(
    contactId,
    folId,
    contactName,
    companyName,
    rfqId,
    index
  ) {
    if (this.userType !== "Buyer") {
      this._rfqService.set(false, "showSidePanel");
      this._rfqService.set(false, "rfqDetailDrawer");
      this._rfqService.set(true, "isBuyerMiniProfile");
      this._rfqService.set(contactId, "buyerProfileId");
      this._rfqService.set(false, "isBuyerMessage");
      this._rfqService.set(folId, "tilefocusId");
      this._rfqService.set(true, "messageRfq");
      setTimeout(() => {
        this._rfqService.set(true, "showSidePanel");
        this._rfqService.set(true, "isBuyerMiniProfile");
        this._rfqService.set(true, "messageRfq");
        const elmnt = document.getElementById(folId);
        elmnt.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "nearest",
        });
      }, 1000);
    } else {
      this._rfqService.set(false, "messageRfq");
      this._rfqService.set(false, "rfqDetailDrawer");
      this._rfqService.set(rfqId + "_" + index, "rfqId");
      setTimeout(() => {
        this._rfqService.set(true, "showSidePanel");
        this._rfqService.set(true, "supplierProfileDrawer");
        this._rfqService.set(contactId, "quoteContactId");
        this._rfqService.set(contactName, "quoteContactName");
        this._rfqService.set(companyName, "quoteCompanyName");
      }, 500);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
