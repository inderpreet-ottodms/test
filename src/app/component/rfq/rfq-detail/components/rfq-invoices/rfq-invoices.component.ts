import { Component, OnInit, Input } from "@angular/core";
import { RfqService } from "./../../../../../core/services/rfq/rfq.service";
import { IRFQRevisionModel } from "../../../../../core/models/rfqModel";
import { retry } from "rxjs/operators";
import { ProfileService } from "../../../../../core/services/profile/profile.service";
import {
  IContactViewModel,
  IRFQViewModel,
} from "../../../../../core/models/accountModel";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-rfq-invoices",
  templateUrl: "./rfq-invoices.component.html",
  styleUrls: ["./rfq-invoices.component.scss"],
})
export class RfqInvoicesComponent implements OnInit {
  activeStatusFilterBtn: string;
  searchFilterValue: string;
  loadData:any; 
  showAction: boolean = false;
  invoiceData: any;

  constructor(private _rfqService: RfqService,private _toastr: ToastrService) {
    this.activeStatusFilterBtn = "All Invoices";
  }

  // public invoiceData = {
  //   data: [
  //     {
  //       uuid: "98d266f1-32eb-4da8-96e9-26fbeb97a562",
  //       invoice_number: "BEDBDDA7-00012",
  //       created_at: "2023-03-31T20:26:16.000000Z",
  //       updated_at: "2023-03-31T20:26:18.000000Z",
  //       status: "outstanding",
  //       due_date: "04/27/2023 10:28:25",
  //       supplier_name: "Test terri",
  //       lines: [
  //         {
  //           id: "il_1MroWaGdzaB833rfo9AFDvtI",
  //           object: "line_item",
  //           amount: 1578000,
  //           amount_excluding_tax: 1578000,
  //           currency: "usd",
  //           description: "xyz",
  //           discount_amounts: [],
  //           discountable: true,
  //           discounts: [],
  //           invoice_item: "ii_1MroWaGdzaB833rf0GpUGmuD",
  //           livemode: false,
  //           metadata: {
  //             order_line_item_uuid: "98b39004-38b6-4263-bfff-2395e92c7fbf",
  //           },
  //           period: {
  //             end: 1680294376,
  //             start: 1680294376,
  //           },

  //           plan: null,
  //           price: {
  //             id: "price_1MroWbGdzaB833rfTXCmqUIe",
  //             object: "price",
  //             active: false,
  //             billing_scheme: "per_unit",
  //             created: 1680294377,
  //             currency: "usd",
  //             custom_unit_amount: null,
  //             livemode: false,
  //             lookup_key: null,
  //             metadata: [],
  //             nickname: null,
  //             product: "prod_Nd4fTCRqcWdRhD",
  //             recurring: null,
  //             tax_behavior: "unspecified",
  //             tiers_mode: null,
  //             transform_quantity: null,
  //             type: "one_time",
  //             unit_amount: 78900,
  //             unit_amount_decimal: "78900",
  //           },

  //           proration: false,
  //           proration_details: {
  //             credited_items: null,
  //           },
  //           quantity: 20,
  //           subscription: null,
  //           tax_amounts: [],
  //           tax_rates: [],
  //           type: "invoiceitem",
  //           unit_amount_excluding_tax: "78900",
  //         },
  //       ],

  //       ship_to: {
  //         address: {
  //           city: "new york",

  //           country: "United States",

  //           line1: "abc villa 45",

  //           line2: "ray raod",

  //           postal_code: "45678912",

  //           state: "Delaware",
  //         },

  //         name: "Gauri Buyer",

  //         phone: null,
  //       },

  //       bill_to: {
  //         city: "Mexico",

  //         country: "United States",

  //         line1: "ray road",

  //         line2: "ray road",

  //         postal_code: "45733823",

  //         state: "Missouri",
  //       },

  //       hosted_invoice_url:
  //         "https://invoice.stripe.com/i/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel?s=ap",

  //       invoice_pdf:
  //         "https://pay.stripe.com/invoice/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel/pdf?s=ap",
  //     },
  //     {
  //       uuid: "98d266f1-32eb-4da8-96e9-26fbeb97a562",
  //       invoice_number: "BEDBDDA7-0001",
  //       created_at: "2023-03-31T20:26:16.000000Z",
  //       updated_at: "2023-03-31T20:26:18.000000Z",
  //       status: "open",
  //       due_date: "04/27/2023 10:28:25",
  //       supplier_name: "central terri",
  //       lines: [
  //         {
  //           id: "il_1MroWaGdzaB833rfo9AFDvtI",
  //           object: "line_item",
  //           amount: 1578000,
  //           amount_excluding_tax: 1578000,
  //           currency: "usd",
  //           description: "xyz",
  //           discount_amounts: [],
  //           discountable: true,
  //           discounts: [],
  //           invoice_item: "ii_1MroWaGdzaB833rf0GpUGmuD",
  //           livemode: false,
  //           metadata: {
  //             order_line_item_uuid: "98b39004-38b6-4263-bfff-2395e92c7fbf",
  //           },
  //           period: {
  //             end: 1680294376,
  //             start: 1680294376,
  //           },

  //           plan: null,
  //           price: {
  //             id: "price_1MroWbGdzaB833rfTXCmqUIe",
  //             object: "price",
  //             active: false,
  //             billing_scheme: "per_unit",
  //             created: 1680294377,
  //             currency: "usd",
  //             custom_unit_amount: null,
  //             livemode: false,
  //             lookup_key: null,
  //             metadata: [],
  //             nickname: null,
  //             product: "prod_Nd4fTCRqcWdRhD",
  //             recurring: null,
  //             tax_behavior: "unspecified",
  //             tiers_mode: null,
  //             transform_quantity: null,
  //             type: "one_time",
  //             unit_amount: 78900,
  //             unit_amount_decimal: "78900",
  //           },

  //           proration: false,
  //           proration_details: {
  //             credited_items: null,
  //           },
  //           quantity: 20,
  //           subscription: null,
  //           tax_amounts: [],
  //           tax_rates: [],
  //           type: "invoiceitem",
  //           unit_amount_excluding_tax: "78900",
  //         },
  //       ],

  //       ship_to: {
  //         address: {
  //           city: "new york",

  //           country: "United States",

  //           line1: "abc villa 45",

  //           line2: "ray raod",

  //           postal_code: "45678912",

  //           state: "Delaware",
  //         },

  //         name: "Gauri Buyer",

  //         phone: null,
  //       },

  //       bill_to: {
  //         city: "Mexico",

  //         country: "United States",

  //         line1: "ray road",

  //         line2: "ray road",

  //         postal_code: "45733823",

  //         state: "Missouri",
  //       },

  //       hosted_invoice_url:
  //         "https://invoice.stripe.com/i/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel?s=ap",

  //       invoice_pdf:
  //         "https://pay.stripe.com/invoice/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel/pdf?s=ap",
  //     },
  //     {
  //       uuid: "98d266f1-32eb-4da8-96e9-26fbeb97a562",
  //       invoice_number: "BEDBDDA7-0001",
  //       created_at: "2023-03-31T20:26:16.000000Z",
  //       updated_at: "2023-03-31T20:26:18.000000Z",
  //       status: "Post Due",
  //       due_date: "04/27/2023 10:28:25",
  //       supplier_name: "central terri",
  //       lines: [
  //         {
  //           id: "il_1MroWaGdzaB833rfo9AFDvtI",
  //           object: "line_item",
  //           amount: 1578000,
  //           amount_excluding_tax: 1578000,
  //           currency: "usd",
  //           description: "xyz",
  //           discount_amounts: [],
  //           discountable: true,
  //           discounts: [],
  //           invoice_item: "ii_1MroWaGdzaB833rf0GpUGmuD",
  //           livemode: false,
  //           metadata: {
  //             order_line_item_uuid: "98b39004-38b6-4263-bfff-2395e92c7fbf",
  //           },
  //           period: {
  //             end: 1680294376,
  //             start: 1680294376,
  //           },

  //           plan: null,
  //           price: {
  //             id: "price_1MroWbGdzaB833rfTXCmqUIe",
  //             object: "price",
  //             active: false,
  //             billing_scheme: "per_unit",
  //             created: 1680294377,
  //             currency: "usd",
  //             custom_unit_amount: null,
  //             livemode: false,
  //             lookup_key: null,
  //             metadata: [],
  //             nickname: null,
  //             product: "prod_Nd4fTCRqcWdRhD",
  //             recurring: null,
  //             tax_behavior: "unspecified",
  //             tiers_mode: null,
  //             transform_quantity: null,
  //             type: "one_time",
  //             unit_amount: 78900,
  //             unit_amount_decimal: "78900",
  //           },

  //           proration: false,
  //           proration_details: {
  //             credited_items: null,
  //           },
  //           quantity: 20,
  //           subscription: null,
  //           tax_amounts: [],
  //           tax_rates: [],
  //           type: "invoiceitem",
  //           unit_amount_excluding_tax: "78900",
  //         },
  //       ],

  //       ship_to: {
  //         address: {
  //           city: "new york",

  //           country: "United States",

  //           line1: "abc villa 45",

  //           line2: "ray raod",

  //           postal_code: "45678912",

  //           state: "Delaware",
  //         },

  //         name: "Gauri Buyer",

  //         phone: null,
  //       },

  //       bill_to: {
  //         city: "Mexico",

  //         country: "United States",

  //         line1: "ray road",

  //         line2: "ray road",

  //         postal_code: "45733823",

  //         state: "Missouri",
  //       },

  //       hosted_invoice_url:
  //         "https://invoice.stripe.com/i/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel?s=ap",

  //       invoice_pdf:
  //         "https://pay.stripe.com/invoice/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel/pdf?s=ap",
  //     },
  //     {
  //       uuid: "98d266f1-32eb-4da8-96e9-26fbeb97a562",
  //       invoice_number: "BEDBDDA7-0001",
  //       created_at: "2023-03-31T20:26:16.000000Z",
  //       updated_at: "2023-03-31T20:26:18.000000Z",
  //       status: "Paid",
  //       due_date: "04/27/2023 10:28:25",
  //       supplier_name: "central terri",
  //       lines: [
  //         {
  //           id: "il_1MroWaGdzaB833rfo9AFDvtI",
  //           object: "line_item",
  //           amount: 1578000,
  //           amount_excluding_tax: 1578000,
  //           currency: "usd",
  //           description: "xyz",
  //           discount_amounts: [],
  //           discountable: true,
  //           discounts: [],
  //           invoice_item: "ii_1MroWaGdzaB833rf0GpUGmuD",
  //           livemode: false,
  //           metadata: {
  //             order_line_item_uuid: "98b39004-38b6-4263-bfff-2395e92c7fbf",
  //           },
  //           period: {
  //             end: 1680294376,
  //             start: 1680294376,
  //           },

  //           plan: null,
  //           price: {
  //             id: "price_1MroWbGdzaB833rfTXCmqUIe",
  //             object: "price",
  //             active: false,
  //             billing_scheme: "per_unit",
  //             created: 1680294377,
  //             currency: "usd",
  //             custom_unit_amount: null,
  //             livemode: false,
  //             lookup_key: null,
  //             metadata: [],
  //             nickname: null,
  //             product: "prod_Nd4fTCRqcWdRhD",
  //             recurring: null,
  //             tax_behavior: "unspecified",
  //             tiers_mode: null,
  //             transform_quantity: null,
  //             type: "one_time",
  //             unit_amount: 78900,
  //             unit_amount_decimal: "78900",
  //           },

  //           proration: false,
  //           proration_details: {
  //             credited_items: null,
  //           },
  //           quantity: 20,
  //           subscription: null,
  //           tax_amounts: [],
  //           tax_rates: [],
  //           type: "invoiceitem",
  //           unit_amount_excluding_tax: "78900",
  //         },
  //       ],

  //       ship_to: {
  //         address: {
  //           city: "new york",

  //           country: "United States",

  //           line1: "abc villa 45",

  //           line2: "ray raod",

  //           postal_code: "45678912",

  //           state: "Delaware",
  //         },

  //         name: "Gauri Buyer",

  //         phone: null,
  //       },

  //       bill_to: {
  //         city: "Mexico",

  //         country: "United States",

  //         line1: "ray road",

  //         line2: "ray road",

  //         postal_code: "45733823",

  //         state: "Missouri",
  //       },

  //       hosted_invoice_url:
  //         "https://invoice.stripe.com/i/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel?s=ap",

  //       invoice_pdf:
  //         "https://pay.stripe.com/invoice/acct_1MrnCLGdzaB833rf/test_YWNjdF8xTXJuQ0xHZHphQjgzM3JmLF9OZDRmcVR5R21jSnZQZU9nTUlka0N6MktKdXNocGNBLDcxODI1OTI30200eO4buoel/pdf?s=ap",
  //     },
  //   ],
  //   message: 200,
  //   status: "success",
  // };

  ngOnInit() {
    this.getInvoiceData()
  }
  searchByKey(event) {
    // console.log(event, event.keyCode);
    if (event.keyCode === 13) {
      // this.filterAll();
    }
  }
  checkSearch(val) {
    if (!this.searchFilterValue) {
      this.loadData = this.invoiceData;
    }else{
      this.loadData = this.invoiceData.filter(i=> i.supplier_name === this.searchFilterValue || i.invoice_number === this.searchFilterValue)
    }
  }
  viewInvoice(url){
    console.log("url",url)
    window.open(url, '_blank');

  }
  allInvoice(){
    this.loadData = this.invoiceData; 
  }
  getOutStandingRecord(){
    this.loadData = this.invoiceData; 
    this.loadData = this.loadData.filter(i=> i.status === 'outstanding')
  }
  getPostDue(){
    this.loadData = this.invoiceData; 
    this.loadData = this.loadData.filter(i=> i.status === 'Post Due')
  }
  getPaid(){
    this.loadData = this.invoiceData; 
    this.loadData = this.loadData.filter(i=> i.status === 'Paid')
  }
  getInvoiceData(){
    const OrderId = localStorage.getItem('orderID');
    this._rfqService.getInvoiceDetail(OrderId).subscribe((data) => {
      console.log("invoice DAtaaaaaaaaa",data)
      this.invoiceData = data.data;
      this.loadData = this.invoiceData;

  
    });
  }

  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = "";
    }
    this.loadData = this.invoiceData;
  }

  downloadPdf(url){
    console.log("url",url)
    window.open(url, '_blank');
  }

  openMessageDrawer(supplier_id,fromContName, index) {
    if (localStorage.getItem("isEmailVerify") == "false") {
       this._toastr.warning("Please verify your email.", "Warning");
    } else {
      // event.stopPropagation();
      this._rfqService.set(localStorage.getItem("RfqId") + "_" + index, "rfqId");
      this._rfqService.set(true, "showSidePanel");
      this._rfqService.set(true, "messageRfq");
      this._rfqService.set(false, "supplierProfileDrawer");
      this._rfqService.set(false, "rfqDetailDrawer");
      this._rfqService.set(supplier_id, "selectContactIdsForMEessage");
      this._rfqService.set(localStorage.getItem("RfqId"), "selectContactRFQId");
      this._rfqService.set(fromContName, "nameOfBuyer");
    }
  }
  showActionPopUP(){
    console.log("inside")
    this.showAction = true;
  }
}
