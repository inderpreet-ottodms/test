import { Component, Input, OnInit } from "@angular/core";
import { RfqService } from "./../../../core/services/rfq/rfq.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ProfileService } from "./../../../core/services/profile/profile.service";
import { SupplierService } from "./../../../core/services/supplier/supplier.service";

@Component({
  selector: "app-supplier-quotes",
  templateUrl: "./supplier-quotes.component.html",
  styleUrls: ["./supplier-quotes.component.scss"],
})
export class SupplierQuotesComponent implements OnInit {
  @Input() RfqStatus: any;
  isOpenFilterDropdown = false;
  isOpenShortDropdown = false;
  supplierQuoteList: any;
  page: number = 1;
  pageSize: number = 24;
  totalItems: number = 0;
  totalPage: number = 0;
  pagesIndex: Array<number>;
  items: any;
  responseData: any;
  searchTerm: string = "";
  selectedFilter: string | null = null;
  filterOptions = [
    "Quoted",
    "Draft",
    "Won",
    "Lost",
    "Archived",
    "Viewed",
    "Not Viewed",
    "Declined",
  ];
  sortingOptions: string[] = [
    "Newest Quote",
    "Oldest Quote",
    "Newest RFQ",
    "Oldest RFQ",
    "Highest Price",
    "Lowest Price",
  ];
  selectedSortOption = "Newest Quote"; // Default selected option
  isDataLoaded = false;
  selectedRFQ: any;
  constructor(
    private _rfqService: RfqService,
    private _toastr: ToastrService,
    private router: Router,
    private profileService: ProfileService,
    private _supplierService: SupplierService
  ) {}
  ngOnInit() {
    this.getSupplierQuoteList();
  }

  //*** Toggles the visibility of the Choose filter dropdown menu.***
  toggleFilterDropdown() {
    this.isOpenFilterDropdown = !this.isOpenFilterDropdown;
    this.isOpenShortDropdown = false;
  }
  //*** Toggles the visibility of the Sort filter dropdown menu.***
  toggleShortDropdown() {
    this.isOpenShortDropdown = !this.isOpenShortDropdown;
    this.isOpenFilterDropdown = false;
  }
  //*** Clear Filter.***
  clearAll() {
    this.selectedFilter = "Choose Filters";
    this.items = this.supplierQuoteList;
  }
  get loggedId() {
    return parseInt(localStorage.getItem("LoggedId"));
  }
  get loggedCompanyId() {
    return parseInt(localStorage.getItem("loggedCompanyId"));
  }
  /**
   * @param  {} id
   * @param  {} isRfqLike
   * @param  {} isRfqDisLike
   * This function is used for open rfq detail drawer and also check  capabilities and Region is match or not.
   */
  openSidePanel(id, isRfqLike, isRfqDisLike, rfqStatusId, quoteData) {
    this.selectedRFQ = quoteData;
    // for go back button;
    if (rfqStatusId != 2) {
      if (this.RfqStatus == 4) {
        let loggedId = this.loggedId;
        this._rfqService.isRFQDetailAccessible(id, loggedId).subscribe(
          (res) => {
            if (res["isError"] === false) {
              let capability = res["data"].isCapabilitiesMatched;
              let region = res["data"].isRegionMatched;
              if (!capability && region) {
                this._toastr.warning(
                  "Please update your capabilities to see details",
                  "Warning!"
                );
              } else if (capability && !region) {
                this._toastr.warning(
                  "RFQ#" + id + " is not another region.",
                  "Warning!"
                );
              } else if (!capability && !region) {
                this._toastr.warning(
                  "Your capabilities and Region do not match with this RFQ!",
                  "Warning!"
                );
              } else {
                this.openSideDrawerData(id, isRfqLike, isRfqDisLike);
              }
            } else {
              this._rfqService.handleError(res["messages"]);
            }
          },
          (error) => {
            this._rfqService.handleError(error);
          }
        );
      } else {
        this.openSideDrawerData(id, isRfqLike, isRfqDisLike);
      }
    } else {
      this._toastr.warning(
        "We're sorry, the RFQ you are trying to view is in 'Draft' status. Please try again later.",
        "Warning!"
      );
    }
  }

  openSideDrawerData(id, isRfqLike, isRfqDisLike) {
    const data = this.supplierQuoteList.find((m) => m.rfqId === id);
    localStorage.setItem("suppCurrentRfqName", data.rfqName);
    this._rfqService.set(data.isRfqLike, "isRfqLike");
    this._rfqService.set(id, "currentSupRfqDetailId");
    this._rfqService.set(data.isRfqDisLike, "isRfqDisLike");
    localStorage.setItem("suppCurrentRfqStatusId", "3");
    this._rfqService.set(false, "isBuyerMiniProfile");
    this._rfqService.set(id, "rfqId");
    this._rfqService.set(true, "showSidePanel");
    this._rfqService.set(true, "rfqDetailDrawer");
    this._rfqService.setCurrentOpenRfqId(id);
    this._rfqService.set(isRfqLike, "isRfqLike");
    this._rfqService.set(isRfqDisLike, "isRfqDisLike");
  }
  showBuyerProfile(id, rfqId, quoteList) {
    this.selectedRFQ = quoteList;
    localStorage.removeItem("supplierRfqGuid");
    const data = this.supplierQuoteList.find((m) => m.rfqId === rfqId);
    localStorage.setItem("CurrentRfqType", "3");
    localStorage.setItem("suppCurrentRfqName", data.rfqName);
    this._rfqService.set(data.isRfqLike, "isRfqLike");
    localStorage.setItem("suppCurrentRfqStatusId", "3");
    this._rfqService.set(false, "messageRfq");
    this._rfqService.set(true, "showSidePanel");
    this._rfqService.set(false, "rfqDetailDrawer");
    this._rfqService.set(false, "isBuyerMessage");
    this._rfqService.set(true, "isBuyerMiniProfile");
    this._rfqService.set(id, "buyerProfileId");
    this._rfqService.setisBuyerNameClicked("true");
    this._rfqService.set(rfqId, "rfqId");
  }

  /**
   * this all function return true and false based on result it hind the page using angular service
   */
  isMessageRfqPanel() {
    return this._rfqService.get("isBuyerMessage");
  }
  isSidePanel() {
    return this._rfqService.get("showSidePanel");
  }
  getCurrentRfqId() {
    return this._rfqService.get("rfqId");
  }
  isRfqDrawer() {
    return this._rfqService.get("rfqDetailDrawer");
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get("isBuyerCommpleteProfile");
  }
  isBuyerMiniProfile() {
    return this._rfqService.get("isBuyerMiniProfile");
  }
  // *** Pagination logic ***
  updatePagedItems(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.items = this.responseData.slice(start, end);

    let totalPage = Math.floor(this.totalItems / this.pageSize);
    if (this.totalItems % this.pageSize > 0) {
      totalPage = totalPage + 1;
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
    this.pagesIndex = Array.from(
      { length: ending - starting + 1 },
      (_, i) => i + starting
    );
  }
  onPageChange(page: number): void {
    this.page = page;
    this.updatePagedItems();
  }

  //***Getter to return filtered records based on search term
  filteredRecords() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (this.items) {
      this.items = this.items.filter(
        (rfq) =>
          rfq.rfqName.toLowerCase().includes(searchTermLower) ||
          rfq.rfqId.toString().includes(searchTermLower) ||
          rfq.buyerCompanyName.toLowerCase().includes(searchTermLower) ||
          rfq.buyerContactName.toLowerCase().includes(searchTermLower) ||
          rfq.process.toLowerCase().includes(searchTermLower)
      );
    }
  }

  //*** Handler for ngModelChange or input event
  onSearchChange(value: string): void {
    this.items = this.supplierQuoteList;
    this.searchTerm = value;
    this.filteredRecords();
  }
  //*** Choose filter logic ***
  applyStatusFilter(status: string) {
    this.items = this.supplierQuoteList;
    this.selectedFilter = status;
    // this.searchTerm = this.selectedFilter;
    this.isOpenFilterDropdown = false;
    this.statusFilteredRecords();
  }
  //***Apply Sorting logic***
  applySort(option: string) {
    this.selectedSortOption = option;
    this.isOpenShortDropdown = false; // Close dropdown after selecting an option
    //  logic to sort the records based on the selected option
    if (option === "Newest Quote") {
      this.items.sort(
        (a, b) =>
          new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()
      );
    } else if (option === "Oldest Quote") {
      this.items.sort(
        (a, b) =>
          new Date(a.quoteDate).getTime() - new Date(b.quoteDate).getTime()
      );
    } else if (option === "Newest RFQ") {
      this.items.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    } else if (option === "Oldest RFQ") {
      this.items.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    } else if (option === "Highest Price") {
      this.items.sort((a, b) => this.getTotalPrice(b) - this.getTotalPrice(a));
    } else if (option === "Lowest Price") {
      this.items.sort((a, b) => this.getTotalPrice(a) - this.getTotalPrice(b));
    }

    console.log("Sorted records:", this.items);
  }
  //***Redirect to quote***
  editQuote(rfqId) {
    const encryptedRfqID = this.profileService.encrypt(rfqId);
    this.router.navigate(["/supplier/supplierRfqDetails"], {
      queryParams: { rfqId: encryptedRfqID },
    });
  }
  //*** Get supplier quote data ***
  getSupplierQuoteList() {
    this._supplierService.SupplierQuotedRFQ().subscribe(
      (result) => {
        if (result.data) {
          this.supplierQuoteList = result.data;
          this.responseData = this.supplierQuoteList;
          this.totalItems = this.supplierQuoteList.length;
          this.isDataLoaded = true;
          this.onPageChange(1);
        }
      },
      (error) => {
        this.isDataLoaded = false;
        console.log("err", error);
      },
      () => {}
    );
  }
  //*** Close dropdown on click outside ***
  hideFilterBySection() {
    this.isOpenFilterDropdown = false;
    this.isOpenShortDropdown = false;
  }

  //*** Function to calculate the sum of qty1, qty2, and qty3 for a specific record.***
  calculateSumsForRecord(partsInformation) {
    let totalQty1 = 0;
    let totalQty2 = 0;
    let totalQty3 = 0;

    // Loop through partsInformation of the current record and sum the quantities
    partsInformation.forEach((part) => {
      totalQty1 += part.qty1;
      totalQty2 += part.qty2;
      totalQty3 += part.qty3;
    });

    return {
      totalQty1,
      totalQty2,
      totalQty3,
    };
  }
  //***Get the sums for a specific record and convert them to comma-separated format.***
  getSumsCommaSeparatedForRecord(partsInformation) {
    const sums = this.calculateSumsForRecord(partsInformation);
    const parts = [];

    // Check each sum and add it to the array if it's greater than zero or not null
    if (sums.totalQty1) {
      parts.push(sums.totalQty1);
    }
    if (sums.totalQty2) {
      parts.push(sums.totalQty2);
    }
    if (sums.totalQty3) {
      parts.push(sums.totalQty3);
    }

    // Join the array values with a comma separator and return the result
    return parts.join(", ");
    // return `${sums.totalQty1}, ${sums.totalQty2}, ${sums.totalQty3}`;
  }
  //*** choose filter logic.***
  statusFilteredRecords() {
    switch (this.selectedFilter) {
      case "Quoted":
        this.items = this.items.filter(
          (item) => item.isQuoteSubmitted && !item.isWon
        );
        break;
      case "Draft":
        this.items = this.items.filter((item) => item.isDraft);
        break;
      case "Won":
        this.items = this.items.filter(
          (item) => item.isQuoteSubmitted && item.isWon
        );
        break;
      case "Lost":
        this.items = this.items.filter((item) => item.isLost);
        break;
      case "Archived":
        this.items = this.items.filter((item) => item.isArchived);
        break;
      case "Viewed":
        this.items = this.items.filter((item) => item.isBuyerViewed);
        break;
      case "Not Viewed":
        this.items = this.items.filter((item) => item.isBuyerNotViewed);
        break;
      case "Declined":
        this.items = this.items.filter((item) => item.isDeclined);
        break;
      default:
        this.items = [...this.items]; // show all if no filter is selected
        break;
    }
  }
  //*** Helper function to calculate the total price for each RFQ.***
  getTotalPrice(item: any): number {
    if (item.partsInformation && item.partsInformation.length) {
      return item.partsInformation.reduce((sum: number, part: any) => {
        const partTotal =
          (part.unitPriceQty1 || 0) +
          (part.unitPriceQty2 || 0) +
          (part.unitPriceQty3 || 0);
        return sum + partTotal;
      }, 0);
    }
    return 0; // Return 0 if no partsInformation or no valid unit prices
  }

  appMiniBuyerReceiver(data) {
    if (data.drawerClose) {
      this._rfqService.set(false, "showSidePanel");
      this._rfqService.set(false, "isBuyerMiniProfile");
    }
  }

  rfqDetailSidepanelDataHandler(data) {
    this._rfqService.set(false, "showSidePanel");
    this.selectedRFQ = {};
  }
  getCompanyInitialsForLogo(rfq) {
    if(rfq.buyerCompanyName){
      return rfq.buyerCompanyName.substring(0, 1).toUpperCase();
    }
  }
  imageLoadOnError(rfqId) {
    // console.log("rfqId----imageLoadOnError---->",rfqId)
    document.getElementById("buyerImageRfqId" + rfqId).style.display = 'none';
    document.getElementById("buyerImageInitialsRfqId" + rfqId).style.display = 'block';
  }

}
