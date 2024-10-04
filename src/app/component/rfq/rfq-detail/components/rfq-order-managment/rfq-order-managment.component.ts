import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { RfqDetailComponent } from "../../rfq-detail.component";
import { RfqService } from "./../../../../../core/services/rfq/rfq.service";
import { Headers, Http } from "@angular/http";
import { Router } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../../environments/environment";
import { IAddressModel } from "../../../../../core/models/accountModel";
import {
  ICountryViewModel,
  IRegionModel,
} from "../../../../../core/models/globalMaster";
import {
  IBuyerQuotesList,
  IBuyerQuotesViewModel,
  IPartsViewModel,
  IUploaadedFileName,
  IUploaadedFileNameList,
} from "../../../../../core/models/rfqModel";
import { MasterService } from "./../../../../../core/services/master/master.service";

import * as moment from "moment";
import { SupplierService } from "./../../../../../core/services/supplier/supplier.service";
import { ProductAnalyticService } from '../../../../../../app/shared/product-analytic/product-analytic';
import { BrowserStorageUtil } from "../../../../../../app/shared/browser.storage.util";

declare var window;
const URL = "";
@Component({
  selector: "app-rfq-order-managment",
  templateUrl: "./rfq-order-managment.component.html",
  styleUrls: ["./rfq-order-managment.component.scss"],
  providers: [ConfirmationService],
})

export class RfqOrderManagmentComponent implements OnInit {
  // Variable Declarations
  @Input("rfqId") rfqId: number;

  @ViewChild("closebutton", { read: ElementRef }) closebutton;
  @Output() closeModelEventHandler = new EventEmitter<any>();

  isEditPO: boolean = false;
  ReadMore: boolean = true;
  //hiding info box
  visible: boolean = false;
  //onclick toggling both
  purchaseOrderForm: FormGroup;
  // Purchase order varaibles
  poStatus: string;
  manuFacture: string;
  term: any;
  orderId: any;
  rfq: number;
  parts: any;
  quote: any;
  poFileUrl: string;
  isExpand: boolean = false;
  data: any;
  selectedDivIndex: any = 0;
  supplierName: string;
  encryptRfqid: any;
  retractAwardData: any;
  SupplierId: any;
  showDetails: string = "View Details";
  hideDetails: string = "Hide Details";
  // rows = [{noQuestion : 0}];
  rows: FormArray;
  isPoAttached: boolean = false;
  active = false;
  indexValue: any;
  states: any;
  responseDate: any;
  supplierEncryptId: any;
  contact: boolean;
  iBuyerQuotesViewModel: IBuyerQuotesViewModel;
  iFilteredRFQViewModelColl: IBuyerQuotesList[];
  project: boolean = true;
  custom: boolean;
  buyerCountryId: any;
  supplierCountryId: any;
  buyerShipCountryId: any;
  supplierStates: any;
  shipToStates: any;
  iRegionModelAll: any;
  iCountryColl: ICountryViewModel[];
  defaultCountry: ICountryViewModel;
  iCountryProfileColl: ICountryViewModel[];
  latestAddressId: number;
  shippingForm: FormGroup;
  iAddressModel: IAddressModel;
  isSidePanel: boolean;
  isPartClicked: boolean;
  shippingAddressData: any;
  addressList: boolean;
  addGenAttachementDiv: boolean;
  isPartsLibrarayClicked: boolean;
  dispalyIndividualGrps: boolean;
  isViewStandardNdaClicked: boolean;
  isNdaClicked: boolean;
  addShippingform: boolean;
  otherVal: boolean;
  modalReference: any;
  disableBtn: boolean = false;
  disableRetract: boolean = true;
  isAwardStep2: boolean = false;
  fileName: string;
  isFileDownloaded: number;
  selectedValue: any;
  selectedElement: { id: number; Name: string };
  hasBaseDropZoneOver = false;
  isAttachmentsLoading: number;
  iPartUploadedFileNameList: IUploaadedFileNameList;
  partFileAddedError: boolean = false;
  iPartsViewModel: IPartsViewModel;
  iPartUploadedFileName: IUploaadedFileName;
  purchaseOrderID: any;
  invalidDate: boolean;
  purchaseEmpty: boolean = false;
  maxDate: Date;
  minDate = new Date();
  isBackButtonClicked: boolean = false;
  partDetailUploader: FileUploader = new FileUploader({
    url: "",
    itemAlias: "partfiles",
  });
  uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true,
  });
  s3FileName: any;
  deliveryDate: boolean;
  newPurchaseOrder: boolean = false;
  poMfgUniqueId: any;
  shipAddressId: any;
  reshapeUniqueId: string;
  showGotIt: boolean;
  disableMsgManf: boolean;
  poReason: any;
  poReasonDate: any;
  bannerMsg: string;
  isNPSPupupShow: boolean = false;
  supCompanyName: any;
  supCompanyId: any;
  supFirstName: any;
  supLastName: any;
  supCompanyLogo: any;
  isAddratingDisabled: boolean;
  paymentList: any;
  totalPrice: any;
  poPartComplete: any;
  poOrderRecieved: any;
  constructor(
    private _rfqService: RfqService,
    private _router: ActivatedRoute,
    private _RfqDetailComponent: RfqDetailComponent,
    private _toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _masterService: MasterService,
    private _SupplierService: SupplierService,
    private _Http: Http,
    private productAnalyticService:ProductAnalyticService
  ) {
    this.iRegionModelAll = [];
    this.isFileDownloaded = 0;
    this.iPartUploadedFileName = {
      oFileName: "",
      CompleteFileName: "",
    };
    this.iPartUploadedFileNameList = {
      FileNameList: [],
    };
    this.uploader.queue.length = 0;
    this.uploadPartImages();
  }

  ngOnChanges() {
    // console.log(this.purchaseOrder, "this.purchaseOrder");
  }

  ngOnInit() {
    this._router.queryParams.subscribe((params) => {
      this.encryptRfqid = params["rfqId"];
      JSON.parse(this.encryptRfqid);
    });
    this.getPoDetail();
    this.getPaymentTerms();
    this._rfqService.contactModel.subscribe((dataValue) => {
      if (dataValue != null && dataValue.addresses) {
        if (dataValue.addressId) {
          this.shipAddressId = dataValue.addressId;
        }
        this.purchaseOrderForm.patchValue({
          shipToAddress1: dataValue.streetAddress,
          shipToAddress2: dataValue.deptAddress,
          shipToCity: dataValue.city,
          shipToState: dataValue.addresses.stateId,
          shipToZip: dataValue.postalCode,
          shipToCompany: dataValue.companyName,
        });
        this.getShipToState(dataValue.addresses.countryId);
      }
      // this.reloadFormData();
    });
    // this.getState()

    this.purchaseOrderForm = new FormGroup({
      // Buyer
      buyerCompany: new FormControl(""),
      buyerBillAddress1: new FormControl(""),
      buyerBillAddress2: new FormControl(""),
      buyerBillCity: new FormControl(""),
      buyerBillState: new FormControl(this.states),
      buyerBillZip: new FormControl(""),
      buyerFirstName: new FormControl(""),
      buyerLastName: new FormControl(""),
      // po
      poNumber: new FormControl(""),
      poDate: new FormControl(""),
      poDelivery_date: new FormControl(""),
      poTerm: new FormControl(""),
      // supplier
      supplierName: new FormControl(""),
      supplierCompany: new FormControl(""),
      supplierAddress1: new FormControl(""),
      supplierAddress2: new FormControl(""),
      supplierCity: new FormControl(""),
      supplierState: new FormControl(this.states),
      supplierZip: new FormControl(""),
      supplierPhone: new FormControl(""),
      supplierEmail: new FormControl(""),
      // shipTo

      shipToCompany: new FormControl(""),
      shipToAddress1: new FormControl(""),
      shipToAddress2: new FormControl(""),
      shipToCity: new FormControl(""),
      shipToState: new FormControl(""),
      shipToZip: new FormControl(""),
      shipToPhone: new FormControl(""),
      shipToEmail: new FormControl(""),
      shipToContactFirstName: new FormControl(""),
      shipToContactLastName: new FormControl(""),
      notes: new FormControl(""),
    });

    this.rows = this.fb.array([]);
    this.purchaseOrderForm.addControl("rows", this.rows);

    this.iBuyerQuotesViewModel = {
      rfqId: this.rfqId,
      contactId: parseInt(localStorage.getItem("LoggedId")),
      pageSize: 0,
      pageNumber: 0,
      searchText: "",
      isRfqResubmitted: false,
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: "",
      more_records: true,
    };

    this.purchaseOrderID = "PO-" + this.rfqId;
  }

  ngDoCheck() {
    if(this.purchaseOrderID === ""){
      this.purchaseEmpty = true;
    }else{
      this.purchaseEmpty = false;
      
    }
}

  // ********* Toggle Class Method  *********
  toggleClass() {
    this.active = !this.active;
  }
  // ********* Open Edit Purchase Order  *********
  openEditPo() {
     console.log("inside open edit po")
    this.isEditPO = true;
    // this.patchFormValue(this.data );
  }
  // ********* Redircet Back To Order Page  *********
  backToOrder() {
    this.isEditPO = false;
    // this.getPoDetail();
  }

  // ********* Redircet Back To Order PDF Page  *********
  backToOrderFromPDF() {
    this.isEditPO = false;
    this.isPoAttached = false;
    // this.getPoDetail();
  }
  // ********* See Purchase Order PDF Viewer  *********
  seePoAttached() {
    var fileName = this.fileName;
    var isDownload = true;
    // console.log("this.poFileUrl", this.poFileUrl);
    this.isPoAttached = true;

    ++this.isFileDownloaded;
    this._rfqService.getS3FileDownload(fileName).subscribe((response) => {
      --this.isFileDownloaded;
      if (
        response.result &&
        response.result.result &&
        response.result.result === true
      ) {
        const resData = response.result;
        const filelink = resData.fileName;

        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(filelink, "_blank");
          }
          const link = document.createElement("a");
          link.href = filelink;
          link.setAttribute("target", "_blank");

          if (link.download !== undefined && isDownload) {
            fileName = filelink.substring(
              filelink.lastIndexOf("/") + 1,
              filelink.length
            );

            link.download = fileName;
          }
          if (document.createEvent) {
            const e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }
  // ********* Get Purchase Order Data   *********
  getPoDetail() {
    
    this._rfqService.getPoDetails(this.rfqId).subscribe(
      (data) => {
        if (data) {
          localStorage.setItem("supplier_company_id",data.supplier_company_id);
          localStorage.setItem("supplier_company",data.supplier_company);
          this.data = data;
          if (this.data.po_file !== "" && this.data.po_file_url !== "") {
            this.newPurchaseOrder = true;
          } else {
            this.newPurchaseOrder = false;
          }
          this.poStatus = this.data.po_status;
          this.poReason = this.data.po_reason;
          this.poReasonDate = this.data.po_reason_date;
          this.bannerMsg = this.data.po_banner_message;

          this.supCompanyName = this.data.supplier_company;
          this.supCompanyId = this.data.supplier_id;
          this.supFirstName = this.data.supplier_first_name;
          this.supLastName = this.data.supplier_last_name;
          this.supCompanyLogo = this.data.supplier_company_logo;
          this.isAddratingDisabled = this.data.allow_rating;
          this.poReasonDate = moment.utc(this.poReasonDate).format('DD/MM/YYYY');
          this.totalPrice = this.data.rfq_part_quoted_quantity_total_price_all

          // this.poReasonDate = moment.utc(this.poReasonDate).format('YYYY-MM-DD HH:mm:ss');
          this.poPartComplete = this.data.po_part_complete;
          this.poOrderRecieved = this.data.po_order_received;

if(this.poStatus=== "cancelled" || this.poStatus=== "accepted" ){
  this.showGotIt = false;
}
else
this.showGotIt = true;

          if (this.poStatus === "accepted") {
            this.disableBtn = true;
            this.disableMsgManf = false;
          }
          else if(this.poStatus === "cancelled" || this.poStatus === "retracted"){
            this.disableBtn = true;
            this.disableMsgManf = true;
          }
          
          else {
            this.disableBtn = false;
            this.disableMsgManf = false;
          }
          this.manuFacture = this.data.supplier_company;
          this.term = this.data.po_term;
          this.rfq = this.data.rfq_id;
          this.quote = this.data.rfq_quote_id;
          this.parts = this.data.parts;
          this.orderId = this.data.po_number;
          this.poFileUrl = this.data.po_file_url;
          this.fileName = this.data.po_file;
          // this.poFileUrl ="https://s3.us-east-2.amazonaws.com/mfg.mp2020.uat.test/RFQFiles/638083341361193845_S3_MFG.pdf";
          // this.fileName = "638083341361193845_S3_MFG.pdf";
          this.supplierName = this.data.supplier_name;
          this.SupplierId = this.data.supplier_id;
          this.supplierEncryptId = this.data.supplier_encrypt_id;
          this.buyerCountryId = this.data.buyer_bill_country_id;
          this.supplierCountryId = this.data.supplier_country_id;
          this.buyerShipCountryId = this.data.buyer_ship_country_id;
          this.poMfgUniqueId = this.data.po_mfg_unique_id;
          // this.supplierEncryptId= "1ceXkhxJHoX_vJDe2fZlOw=="
          this.patchFormValue(data);
          this.getBuyerState(this.buyerCountryId);
          this.getSupplierState(this.supplierCountryId);
          this.getShipToState(this.buyerShipCountryId);
          this.reshapeUniqueId = this.data.reshape_order_id;          
        }
      },
      (error) => {
        this._rfqService.handleError(error);
      }
    );
  }
  // ********* Expand Details  *********
  onExpand(index) {
    if (this.selectedDivIndex !== index) {
      this.showDetails = "View Details";
      this.selectedDivIndex = index;
      this.isExpand = true;
    } else {
      this.hideDetails = "Hide Details";
      this.isExpand = false;
      // this.Hidedetails = !this.Hidedetails;
      this.selectedDivIndex = null;
    }
  }
  // ********* Open Drawer Redirect *********
  // openSidePanel() {
  //   this._rfqService.set(false, "messageRfq");
  //   this._rfqService.set(false, "rfqDetailDrawer");
  //   this._rfqService.set(this.rfq + "_" + 0, "rfqId");
  //   setTimeout(() => {
  //     this._rfqService.set(true, "showSidePanel");
  //     this._rfqService.set(true, "supplierProfileDrawer");
  //     this._rfqService.set(JSON.parse(this.encryptRfqid), "quoteContactId");
  //     this._rfqService.set(this.supplierName, "quoteContactName");
  //     this._rfqService.set(this.manuFacture, "quoteCompanyName");
  //   }, 500);
  // }

  openSidePanel() {
    this._rfqService.set(false,"rfqViewAllDrawer");
    this._rfqService.set(false,"iscontact");
    this._rfqService.set(false, "showSidePanel");
    this._rfqService.set(false, "supplierProfileDrawer");
    this._rfqService.set(0, "quoteContactId");
    this._rfqService.set(0, "quoteContactName");
    this._rfqService.set(false, "messageThreadDrawer");
    setTimeout(() => {
      this._rfqService.set(true, "showSidePanel");
      this._rfqService.set(true, "supplierProfileDrawer");
      this._rfqService.set(this.supplierEncryptId, "quoteContactId");
      this._rfqService.set(this.supplierName, "quoteContactName");
      this._rfqService.set(this.manuFacture, "quoteCompanyName");
    }, 300);
  }
  // ********* Open Message Drawer Redirect *********
  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    if (localStorage.getItem("isEmailVerify") == "false") {
      this._toastr.warning("Please verify your email.", "Warning");
    } else {
      event.stopPropagation();
      this._rfqService.set(false,"rfqViewAllDrawer");
      this._rfqService.set(false,"iscontact");
      this._rfqService.set(true, "showSidePanel");
      this._rfqService.set(true, "isBuyerMessage");
      this._rfqService.set(true, "messageRfq");
      this._rfqService.set(fromContName, "nameOfBuyer");
      this._rfqService.set(contactId, "selectContactIdsForMEessage");
      this._rfqService.set(messageRFQId, "selectContactRFQId");
      this._rfqService.set(false, "supplierProfileDrawer");
      this._rfqService.set(false, "messageThreadDrawer");
    }
  }
  openViewAllSidePanel(rfqPartId) {
        this._rfqService.set(false,"iscontact");
        this._rfqService.set(false, "messageRfq");
        this._rfqService.set(true, "showSidePanel");
        this._rfqService.set(true, "rfqViewAllDrawer");        
        this._rfqService.set(rfqPartId, "rfqPartId");
        this._rfqService.set(this.reshapeUniqueId, "reshapeUniqueId");
        this._rfqService.set(this.SupplierId, "SupplierId");


  }
  getBuyerQuotingList() {
    this._rfqService
      .GetBuyerQuotingList(this.iBuyerQuotesViewModel)
      .subscribe((result) => {
        this.iFilteredRFQViewModelColl = result["data"];
      });
  }

  // ********* On RFQ Redirect  *********
  onRfq() {
    this._RfqDetailComponent.onRfq();
  }
  // ********* On Quotes Redirect   *********
  onQuotes() {
    this._RfqDetailComponent.onQuotes();
  }
  // ********* Retract Award   *********
  retractAward() {
    this.retractAwardData = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      awardedQty: 0,
      rfqPartIdString: "",
      isAlreadyAwrded: false,
      contactId: this.SupplierId,
      isRfqResubmitted: false,
      contactIdList: [],
      rfqQuoteItemList: [],
      errorMessage: "",
      isAwardAccepted: false,
      isAwrded: false,
      miscellaneousAmount: 0,
      partId: 0,
      partName: "",
      partNumber: "",
      perUnitPrice: 0,
      quantityLevel: 0,
      result: false,
      rfqId: this.rfq,
      rfqPartId: 0,
      rfqPartQuantityId: 0,
      rfqQuoteItemsId: 0,
      rfqQuoteSupplierQuoteId: this.quote,
      shippingAmount: 0,
      toolingAmount: 0,
      awardedQtyUnit: "",
      isDeclineAll: false,
      buyerFeedbackId: "",
      estLeadTimeValueRange: null,
      estLeadTimeRange: null,
      estLeadTimeValue: null,
      poReason: this.poReason
    };
    this.data.parts.forEach((part) => {
      if (part.rfqQuoteItemsId !== 0) {
        // this.awardQuoteIds.push(part.rfqQuoteItemsId);
        let tempObj = {
          rfqQuoteItemsId: part.rfq_part_quoted_quantity_item_id,
          isAwarded: false,
          rfqPartId: part.rfq_part_id,
          isRfqStatus: false,
          rfqPartStatusId: 0,
          unit: null,
          price: null,
          awardedUnitTypeId: null,
        };
        this.retractAwardData.rfqQuoteItemList.push(tempObj);
      }
    });
    // this._rfqService
    //   .SetRFQQuoteStatus(this.retractAwardData)
    //   .subscribe((result) => {
    //     if (result["result"] === true) {
    //       this._rfqService
    //         .getRFQExtraDetails(this.rfqId, this.SupplierId, "")
    //         .subscribe((result) => {
    //         });
    //       this._toastr.success("Your award has been retracted", "Success!");
    //       this._rfqService.setRfqAwardEvent(true);
    //       this.getBuyerQuotingList();
    //       this._rfqService.set(true, "rfqLoaded");
    //       this.modalReference.close();
    //     } else {
    //       this.modalReference.close();
    //       this._toastr.error(result["errorMessage"], "Error!");
    //     }
    //   });

    this._rfqService.SetRFQQuoteStatus(this.retractAwardData).subscribe(
      (result) => {
        if (result["result"] === true) {
          this._toastr.success("Your award has been retracted", "Success!");
          this._rfqService.setRfqAwardEvent(true);
          this.getBuyerQuotingList();
          // this.isDeclineBtn = false;
          // this.expandQuotesAfterAward();
          // this._RfqQuotesComponent.expandQuotesAfterAward()
          //           this.LocalAwardedManufractureListColl = [];
          //           this.NPartArrayColl = [];
          this._rfqService.set(true, "rfqLoaded");
          this.modalReference.close();
        } else {
          this.modalReference.close();
          this._toastr.error(result["errorMessage"], "Error!");
        }
      },
      (error) => {
        this.modalReference.close();
        this._rfqService.handleError(error);
      },
      () => {}
    );

    this.router.navigate(["/rfq/rfqdetail"], {
      queryParams: {
        rfqId: this.encryptRfqid,
        quotes: "Quotes",
      },
    });
    this.purchaseOrder();
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_BUYER_RFQ_CANCELLED,{
      rfq_retracted: true,
      rfq_id:localStorage.getItem('RfqId'),
      rfq_count : localStorage.getItem('submitRfqCount'),
    });
  }
  // ********* Call Reshape API  *********
  purchaseOrder() {
    let data = {
      RFQId: this.rfq,
      SupplierContactId: this.SupplierId,
    };

    this._rfqService.UpdatePurchaseOrderForReshape(data).subscribe(
      (result) => {
        if (result["result"] === true) {
          this._toastr.success(result["message"], "Success!");
          this._rfqService.setRfqAwardEvent(true);
          this.closebutton.nativeElement.click();
        } else {
          this._toastr.error(result["message"], "Error!");
          this.closebutton.nativeElement.click();
        }
      },
      (error) => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  // ********* Add New Item Row  *********
  addNewRow() {
    this.rows.push(this.createItemFormGroup());
  }
  // ********* Create Items Object   *********
  createItemFormGroup(): FormGroup {
    return this.fb.group({
      number: null,
      name: null,
      description: null,
      qty: null,
    });
  }
  deleteIndex(index: any) {
    this.indexValue = index;
  }
  // ********* Remove New Item Row *********
  onRemoveRow() {
    this.rows.removeAt(this.indexValue);
  }
  // ********* Patching Form Value *********
  patchFormValue(data) {
    this.purchaseOrderForm.patchValue({
      buyerCompany: data.buyer_bill_company,
      buyerBillAddress1: data.buyer_bill_address1,
      buyerBillAddress2: data.buyer_bill_address2,
      buyerBillCity: data.buyer_bill_city,
      buyerBillState: data.buyer_bill_region_id,
      buyerBillZip: data.buyer_bill_zip,
      poNumber: data.po_number,
      poDate: new Date(data.po_date),
      poDelivery_date:
        data.po_delivery_date == ""
          ? data.po_delivery_date
          : new Date(data.po_delivery_date),
      poTerm: data.po_term,
      supplierName: data.supplier_name,
      supplierCompany: data.supplier_company,
      supplierAddress1: data.supplier_address1,
      supplierAddress2: data.supplier_address2,
      supplierCity: data.supplier_city,
      supplierState: data.supplier_region_id,
      supplierZip: data.supplier_zip,
      supplierPhone: data.supplier_phone,
      supplierEmail: data.supplier_email,
      shipToAddress1: data.buyer_ship_address1,
      shipToAddress2: data.buyer_ship_address2,
      shipToCity: data.buyer_ship_city,
      shipToState: data.buyer_ship_region_id,
      shipToZip: data.buyer_ship_zip,
      shipToCompany: data.buyer_bill_company,
      shipToPhone: data.buyer_bill_phone,
      shipToEmail: data.buyer_bill_email,
      shipToContactFirstName: data.buyer_first_name,
      shipToContactLastName: data.buyer_last_name,
      buyerFirstName: data.supplier_first_name,
      buyerLastName: data.supplier_last_name,
      notes:data.po_notes
    });
    this.parts.forEach((item) => this.rows.push(this.patchValueItems(item)));
    this._rfqService.setcompanyname(data.buyer_bill_company);
  }
  // ********* Set Rows Item Value *********
  patchValueItems(item): FormGroup {
    return this.fb.group({
      number: item.rfq_part_no,
      name: item.rfq_part_description,
      description: item.rfq_part_specification,
      qty: item.rfq_part_quoted_quantity,
      priceUnit: "$" + item.rfq_part_quoted_price_per_unit,
      priceLine: "$" + item.rfq_part_quoted_quantity_total_price,
    });
  }

  // ********* open contact modal *********
  closeGotit() {
    this.showGotIt = false; 
  }

  projectfun() {
    this.project = true;
    this.custom = false;
  }

  customfun() {
    this.custom = true;
    this.project = false;
  }

  // ********* Get Buyer State *********
  getBuyerState(countryId: any) {
    this._masterService.getState(countryId).subscribe(
      (data: any) => {
        this.states = data["stateData"];
      },
      (error) => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  // ********* Get Supplier State *********
  getSupplierState(countryId: any) {
    this._masterService.getState(countryId).subscribe(
      (data: any) => {
        this.supplierStates = data["stateData"];
      },
      (error) => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  // ********* Get Ship To State *********
  getShipToState(countryId: any) {
    this._masterService.getState(countryId).subscribe(
      (data: any) => {
        this.shipToStates = data["stateData"];
      },
      (error) => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getState() {
    // if (this.iRegionModelAll.length === 0) {
    this._masterService.getState("0").subscribe(
      (data2: IRegionModel[]) => {
        this.iRegionModelAll = data2["stateData"];
      },
      (error) => () => {
        this._toastr.error(error, "Error!");
      }
    );
    // }
  }

  getCountry() {
    // if (this.iCountryColl.length === 0) {
    this._masterService.getCountry().subscribe(
      (data2: ICountryViewModel[]) => {
        this.iCountryColl = data2;
        this.defaultCountry = this.iCountryColl.find(
          (m) => m.countryName === "USA"
        );
        this.iCountryProfileColl = data2;
      },
      (error) => () => {
        this._toastr.error(error, "Error!");
      }
    );
    // }
  }

  changeShippingAddress() {
    this.latestAddressId = 0;
    this.isSidePanel = true;
    this.addShippingform = true;
    this.isPartClicked = false;
    this.addressList = false;
    this.addGenAttachementDiv = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.isViewStandardNdaClicked = false;
    this.isNdaClicked = false;
    this.getState();
    this.getCountry();
  }

  nokeepAward() {
    this.selectedElement = undefined;
    this.otherVal = false;
  }

  selectedVal(event) {
    this.selectedValue = event;

    if (event == "Other") {
      this.otherVal = true;
      this.disableRetract = true;
      this.onValueChange(event);
    } else if (event == "undefined") {
      this.disableRetract = true;
      this.otherVal = false;
    } else {
      this.otherVal = false;
      this.disableRetract = false;
      this.poReason = event;
    }

  }
  onValueChange(event) {
    if (event.length > 0) {
      this.disableRetract = false;
      this.poReason = "Other - "+event;
    } else {
      this.disableRetract = true;
    }
  }

  opencontactpanel(event) {
    event.stopPropagation();
    this._rfqService.set(true, "showSidePanel");
    this._rfqService.set(false, "messageRfq");
    this._rfqService.set(true, "iscontact");
    this._rfqService.set(false, "supplierProfileDrawer");
    this._rfqService.set(false, "messageThreadDrawer");
  }

  // ********* Reload form data for patching value after changing or updating address *********
  reloadFormData() {
    this._rfqService.getPoDetails(this.rfqId).subscribe(
      (data) => {
        if (data) {
          this.purchaseOrderForm.patchValue({
            buyerCompany: data.buyer_bill_company,
            buyerBillAddress1: data.buyer_bill_address1,
            buyerBillAddress2: data.buyer_bill_address2,
            buyerBillCity: data.buyer_bill_city,
            buyerBillState: data.buyer_bill_region_id,
            buyerBillZip: data.buyer_bill_zip,
            poNumber: data.po_number,
            poDate: new Date(data.po_date),
            poDelivery_date:
              data.po_delivery_date == ""
                ? data.po_delivery_date
                : new Date(data.po_delivery_date),
            poTerm: data.po_term,
            supplierName: data.supplier_name,
            supplierCompany: data.supplier_company,
            supplierAddress1: data.supplier_address1,
            supplierAddress2: data.supplier_address2,
            supplierCity: data.supplier_city,
            supplierState: data.supplier_region_id,
            supplierZip: data.supplier_zip,
            supplierPhone: data.supplier_phone,
            supplierEmail: data.supplier_email,
            shipToAddress1: data.buyer_ship_address1,
            shipToAddress2: data.buyer_ship_address2,
            shipToCity: data.buyer_ship_city,
            shipToState: data.buyer_ship_region_id,
            shipToZip: data.buyer_ship_zip,
            shipToCompany: data.buyer_bill_company,
            shipToPhone: data.buyer_bill_phone,
            shipToEmail: data.buyer_bill_email,
            shipToContactFirstName: data.buyer_first_name,
            shipToContactLastName: data.buyer_last_name,
            buyerFirstName: data.supplier_first_name,
            buyerLastName: data.supplier_last_name,
            notes:data.po_notes
          });
          this.getBuyerState(data.buyer_bill_country_id);
          this.getSupplierState(data.supplier_country_id);
          this.getShipToState(data.buyer_ship_country_id);
          this.poStatus = data.po_status;
          if (this.poStatus === "accepted") {
            this.disableBtn = true;
            this.disableMsgManf = false;
          }          
          else if(this.poStatus === "cancelled" || this.poStatus === "retracted"){
            this.disableBtn = true;
            this.disableMsgManf = true;
          }
          else {
            this.disableBtn = false;
            this.disableMsgManf = false;
          }
        }
      },
      (error) => {
        this._rfqService.handleError(error);
      }
    );
  }

  // ******PO custom modal popup********
  openNewPO() {
    this.iPartUploadedFileNameList.FileNameList = [];
    this.purchaseOrderID = "PO-" + this.rfqId;
    this.responseDate = this.minDate;
    this.isAwardStep2 = true;
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append("Authorization", "bearer " + BrowserStorageUtil.getToken());
  }

  getOriginalFineName(fileName) {
    if (fileName !== null) {
      const filenNameArray = fileName.split("_S3_");
      return filenNameArray[1];
    } else {
      return "";
    }
  }

  onFileSelected($event: any) {
    this.uploadPartDetailsFiles();
    $event.srcElement.value = "";
  }

  upload(fileToUpload: any) {
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
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  uploadPartDetailsFiles() {
    const files = this.partDetailUploader.queue;
    
    if (
      this.iPartUploadedFileNameList.FileNameList.length === 0 &&
      files[0]._file.type === "application/pdf"
    ) {
      const file = files[0]._file;
      if (files[0].isUploaded === false) {
        ++this.isAttachmentsLoading;
        this.upload(file).subscribe((res) => {
          const result = JSON.parse(res["_body"]);
          const fName = result["fileName"];
          this.s3FileName = fName;
          // console.log("this.s3FileName", this.s3FileName);
          files[0].isUploaded = true;
          this.partFileAddedError = false;
          const fileNameArray = fName.split("_S3_");
          // console.log("fileNameArray", fileNameArray);
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.fileName = this.iPartUploadedFileName.oFileName;
          this.iPartUploadedFileName.CompleteFileName = fName;
          --this.isAttachmentsLoading;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          this.iPartUploadedFileName = {
            oFileName: "",
            CompleteFileName: "",
          };
          this.partDetailUploader.queue = [];
        });
      }

      if (this.deliveryDate === false) {
        this.iPartsViewModel.createNewPart = true;
      }
    } else {
      this.partDetailUploader.queue = [];
    }
  }

  uploadPartImages() {
    this.uploader.onAfterAddingAll = (fileItem) => {
      this.uploadPartDetailsFiles1(fileItem);
    };
  }

  uploadPartDetailsFiles1(fileItem) {
    const file = fileItem[0]._file;
    if (
      this.iPartUploadedFileNameList.FileNameList.length === 0 &&
      fileItem[0]._file.type === "application/pdf"
    ) {
      if (fileItem[0].isUploaded === false) {
        ++this.isAttachmentsLoading;
        this.upload(file).subscribe((res) => {
          const result = JSON.parse(res["_body"]);
          const fName = result["fileName"];
          fileItem[0].isUploaded = true;
          const fileNameArray = fName.split("_S3_");
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.iPartUploadedFileName.CompleteFileName = fName;
          --this.isAttachmentsLoading;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          this.iPartUploadedFileName = {
            oFileName: "",
            CompleteFileName: "",
          };
          this.partDetailUploader.queue = [];
        });
      }

      if (this.deliveryDate === false) {
        this.iPartsViewModel.createNewPart = true;
      }
    } else {
      this.partDetailUploader.queue = [];
    }
  }

  removeSavedPartDetailFile(partName, index: any) {
    if (this.iPartUploadedFileNameList.FileNameList) {
      this.iPartUploadedFileNameList.FileNameList.splice(index, 1);
    }
    let partNAme = partName.CompleteFileName
      ? partName.CompleteFileName
      : this.iPartsViewModel.rfqPartFile;
    this._rfqService
      .deletePartGeneralAttachment(partNAme, this.loggedId, 0, this.rfqId)
      .subscribe(
        (data: IPartsViewModel) => {
          console.log("File deleted....");
        },
        (error) => () => {
          console.error("Error: $error");
          this._toastr.error(error, "Error!");
        }
      );
  }
  get loggedId() {
    return parseInt(localStorage.getItem("LoggedId"));
  }

  cancelAward() {
    this.isAwardStep2 = false;
  }

  onIsAward1() {
    if (!this.isBackButtonClicked) {
      this.closeModelEventHandler.emit(true);
    } else {
      this.closeModelEventHandler.emit(false);
    }
  }

  // ******Send to Manufacturer********
  awardStepTwo() {
    const sendData = {
      poUniqueId: this.poMfgUniqueId,
      isFileExists: true,
      purchaseOrderNumber: this.purchaseOrderID,
      purchaseOrderDate: this.responseDate,
      fileName: this.s3FileName,
      
      
    };
   
    this._rfqService.editPurchaseOrder(sendData).subscribe(
      (result) => {
        if (result.result === true) {

          if(this.purchaseOrderID == ""){
            this.purchaseEmpty = true;
            this._toastr.warning("Please Select PO First", 'Warning.!');
          }
          else {
            this._toastr.success(result.message, "Success!");
            this.isAwardStep2 = false;
          }
        }
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }

  // ******Send Purchase Order********
  sendPurchaseOrder() {
    const sendData = {
      poUniqueId: this.poMfgUniqueId,
      isFileExists: false,
      purchaseOrderNumber: this.purchaseOrderForm.value.poNumber,
      purchaseOrderDate: this.purchaseOrderForm.value.poDate,
      deliveryDate: this.purchaseOrderForm.value.poDelivery_date,
      paymentTerm: this.purchaseOrderForm.value.poTerm,
      shipAddressId: this.shipAddressId,
      notes: this.purchaseOrderForm.value.notes
    };

    this._rfqService.editPurchaseOrder(sendData).subscribe(
      (result) => {
        if (result.result === true) {
          this._toastr.success(result.message, "Success!");
          this.backToOrder();
        } 
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }

  addReview() {
    this.isNPSPupupShow = true;
    this._rfqService.set(true, 'isModelShow');
    this._rfqService.set(this.supCompanyId, 'isFormcotactId');
    this._rfqService.set(this.supCompanyName, 'ComapnyName');
    this._rfqService.set(this.supFirstName + ' ' + this.supLastName, 'manufacturerName');
    this._rfqService.set(this.supCompanyLogo, 'contactPictureFile');
  }

  confirmParts(){
    var reqData = {
      "poId": this.poMfgUniqueId,
      "isOrderReceived": true  
  }
    this._rfqService.confirmPOPartsReceived(reqData).subscribe((result: any) => {
      this._toastr.success(result.data.message, 'Success!');
    });
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_BUYER_PARTS_RECIEVED,{
      date: this.minDate,
      supplier_id:localStorage.getItem('supplier_company_id'),
      supplier_name:localStorage.getItem('supplier_company'),
      rfq_id:localStorage.getItem('RfqId'),
    });
  }
  getPaymentTerms() {
    this._SupplierService.getPaymentTerms().subscribe(
      response => {
        if (!response.isError) {
          this.paymentList = response.data;
        }
      }
    );
  }
}
