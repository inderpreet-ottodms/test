import { Injectable } from "@angular/core";
export interface IQmsQuotesViewModel {
  qmsQuoteId: number;
  quoteId: number;
  qmsQuoteName: string;
  qmsContactId: string;
  isActive: boolean;
  statusId: number;
  createdBy: number;
  createdDate: string;
  isNotified: boolean;
  quoteRefNo: string;
  paymentTermId: any;
  paymentTerms: string;
  estimatedDeliveryDate: any;
  shippingMethodId: any;
  shippingMethod: string;
  quoteValidUntil: any;
  notes: string;
  result: boolean;
  errorMessage: string;
  customer: string;
  contactName: string;
  qMSContactIdEncrypt: string;
  email: string;
  phone: string;
  isAllPartDetailsFilled: boolean;
  probability: number;
  emailStatusId: number;
  qmsQuoteIdEncrypt:string;
  whoPaysForShipping:number;
  qmsQuoteLeadTimeAddList:QmsQuoteLeadTimeAdd[];
  qmsCustomerContactId:number;
}

export class QmsQuoteLeadTimeAdd {
    leadTimeId: number= 0;
    leadTimeValue:number= 0;
    leadTimeRange: string='';
    leadTimeName:string='';
  }
export interface IReviewQuoteBasicInfoViewModel {
  customer: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;

}
export interface IQMSQuoteReceiptPDFViewModel {
  htmlQuoteReport: string;
  QuoteId: string;
  toEmailId: string;
  errorMessage: string;
  result: boolean;
}

export interface IQmsPartQuantityList {
  partName: string;
  partNo: number;
  partqty: number;
  qtylevel: number;
  qmsQuotePartQuantityFeeType: IqmsQuotePartQuantityFeeType[]
  qmsSpecialFeesListViewModel:QmsSpecialFeesList[];
  perunitprice: number;
  shippingamount: number;
  toolingamount: number;
  miscellaneousamount: number;
  process: string;
  postProduction: string;
  material: string;
  isAccepted: boolean;
  qmsQuotePartId: number;
  partQtyUnit: string;
  qtylevelSum: number;
  QmsPartStatusId: number;
  subSpecialTotal: number;
  toShow:boolean;
}

export interface IQmsQuotePartsViewModel {
  qmsQuotePartId: number;
  qmsQuoteId: number;
  partName: string;
  partNo: string;
  partQtyUnitId: number;
  partCategoryId: number;
  postProductionId: number;
  materialId: number;
  description: string;
  statusId: number;
  isActive: boolean;
  createdDate: Date;
  modifiedDate: Date;
  qmsQuotePartFile: string;
  quotePartsFiles: string[];
  contactId: number;
  CompanyId: number;
  qmsQuotePartQuantityList: IQmsQuotePartQuantitiesViewModel[];
  qmsSpecialFeesList:QmsSpecialFeesList[];
  result: boolean;
  errorMessage: string;
  PrimaryPartFile: string;
  is1StQuotePartquantityChanged: boolean;
  is2ndQuotePartquantityChanged: boolean;
  is3rdQuotePartquantityChanged: boolean;
  is4thQuotePartquantityChanged: boolean;
  is5thQuotePartquantityChanged: boolean;
  partCategoryName: string;
  postProductionName: string;
  materialName: string;
  isDefaultPartCategory: boolean;
  isDefaultPostProduction : boolean;
  isDefaultMaterial : boolean;
  qmsQuotePartCertificateList: any[]
}

export interface IQmsPartListModel {
  qmsQuotePartId: number;
  qmsPartName: string;
  qmsPartNo: string;
  qmsQuoteId: number;
  qmsQuoteFileName: string;
  qmsPartAttachments: string[];
  createdDate: Date;
  isPartDetailsFilled: boolean;
}

export class QmsSpecialFeesList {
      feeTypeId: number;
      value: number;
      feeType: string;
      qmsQuotePartId:number;

}


export interface IQmsQuotePartQuantitiesViewModel {
  qmsQuotePartQtyId: number;
  qmsQuotePartId: number;
  partQty: number;
  qtyLevel: number;
  qmsQuotePartQuantityFeeTypeList: IqmsQuotePartQuantityFeeType[];
  perUnitPrice: any;
  isDeleted: boolean;
  modifiedDate: Date;
  partQtyUnitId: number;
}
export interface IqmsQuotePartQuantityFeeType {
  qmsQuotePartQtyFeeTypeId: number;
  qmsQuotePartQtyId: number;
  feeTypeId: number;
  value: number;
  feeType: string;
}

export interface IsystemParametersViewModel {
  id: number;
  sysKey: string;
  value: string;
  description: string;
  parent: number;
  active: boolean;
  sortOrder: number;
  actualIdFromSourceDb: number;
  qmsPaymentTermId: number;
  qmsShippingMethodId: number;
  qmsPaymentTerms: string;
}

export class leadTimeList{
  qmsLeadTimeId: number=0;
  qmsLeadTime: string='';
  isDefault: boolean=false;
  isRemovable: boolean=false;
}
export interface IQMSQuoteListFilterViewModel {
  qmsSupplierId: number;
  qmsType: number;
  maxPageSize: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  filterCompany: number;
  filterStatus: number;
  filterProbability: number;
  filterQuoter :number;
  more_records: boolean;
  filterBy: string;

}


export interface IQMSQuoteListViewModel {
  quoteId: number;
  qmsQuoteId: number;
  quoteName: string;
  quoteExpired: string;
  companyName: string;
  contactName: string;
  process: string;
  quoteStatus: string;
  probability: string;
  quoteDowloaded: boolean;
  quoteSentToSelf: boolean;
  quoteSentToCustome: boolean;
  customerEmail: string;
  supplier:string;
}


export interface IQMSStatus {
  description: string;
  isActive: boolean;
  position: number;
  qmsStatusId: number;
  status: string;
  sysKey: string;
}
export class QMSEmailStatus {
  qmsEmailStatusId:number=0;
  qmsEmailStatus:string='';
}
export class QMSProbabilityStatus {
  qmsProbabilityId:number=0;
  qmsProbability:string=''
}

export interface IQmsQuoteGAViewModel {
  loggedInId: number;
  qmsQuoteId: number;
  qmsGeneralAttachmentsList: string[];
  result: boolean;
  srrorMessage: string;
}

export interface IFeetypeList {
  qmsQuotePartId: number;
  qmsQuoteId: number;
  qmsDynamicFeeTypeId: number;
  supplierCompanyId: number;
  qmsFeeTypeId: number;
  feeType: string;
  isDefault: boolean;
  isSelected: boolean;
}

@Injectable()
export class QmsEmailMessagesFilterViewModel {
  qmsQuoteId: number = 0;
  pageSize: number = 24;
  pageNumber: number = 1;
  searchText: string = '';
  totalRecords: number = 0;
  isOrderByDesc: boolean = true;
  orderBy: string = '';
  more_records: boolean = true;
  filterBy: string = '';
  isRead: boolean = null;
}

@Injectable()
export class qMSEmailMessagesViewModel {
  qmsEmailMessageId: number = 0;
  qmsQuoteId: number = 0;
  emailSubject: string = '';
  emailBody: string = '';
  emailDate: Date = null;
  fromCont: number = 0;
  fromContName: string = '';
  toCont: number = 0;
  toContName: string = '';
  toEmail: string = '';
  emailSent: boolean = true;
  emailRead: boolean = false;
  isTrash: boolean = true;
  isSelected: boolean = false;
  qmsEmailMessageFilesList: qmsEmailMessageFilesViewModel[];
  result: boolean = true;
  errorMessage: string = '';
  contactEncryptId: string = '';
}

export class qmsEmailMessageFilesViewModel {
  mpQmsEmailMessagesFileId: number = 0;
  qmsEmailMessageId: number = 0;
  fileId: number = 0;
  fileName: string = '';
}
export class QmsQuotePartInvoice {
  qmsQuotePartId: number;
  qmsQuoteInvoicePartId:number;
  partName: string;
  partNumber: number;
  isChecked: boolean = false;
  totalAmount: number;
  form:any;
  isFormValid:boolean=false;
  uniqueId: number;
  partDetails:any;
  isPartOfInvoice:boolean;
}


export class QMSQuotePartQuantity {
  qmsQuotePartQtyId: number;
  qmsQuotePartId: number;
  partQty: number;
  partQtyUnitId: number;
  qtyLevel: number;
  partQtyUnit:string;
  isDisabled:boolean=false;
}
export class QMSQuoteInvoiceDetailsViewModel {
  qmsQuoteInvoiceId: number;
  qmsQuoteIdEncrypt: string;
  qmsCustomerId:number;
  invoiceId: number =null;
  invoiceName: string=null;
  referenceNo: string=null;
  currencyId: number;
  invoiceDate: string;
  paymentTermId: any='';
  createdBy: number;
  invoiceNo: number=null;
  purchaseOrderNumber:number=null;
  notes: string;
  companyName: string;
  billAddress: string;
  partInfo: PartInfo[];
}

export class QMSQuoteInvoiceDetailsListViewModel {
  qmsQuoteInvoiceId: 0;
  qmsQuotePartId: number;
  qmsQuoteInvoicePartDetailsList:QMSQuoteInvoicePartDetails[]=[];
}


export class QMSQuoteInvoicePartDetails {
  partQty: number;
  partQtyUnitId: number;
  partQtyUnit: string;
  qtyLevel: number;
  isChkOtherQty: boolean;
  feeTypeId: number;
  unitPrice: number;
}
export class InvoiceViewModel {
  supplierId: number;
  supplierCompanyId: number;
  invoiceId: number;
  customerId: number;
  invoiceNo: string;
  customer: string;
  quoteReferenceNo: string
  status: string;
  amountDue: number;
  qmsQuoteInvoiceId: number;
  qmsQuoteId: number;
  maxPageSize: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  qmsQuoteEncryptId: string;
  orderBy: string;
  more_records: boolean;
  quoteId:number;
  customerIdEncrypted :string;
  filterBy 	: number;
}

export class  QmsDetail {
qmsContactId: number;
qmsContactIdEncrypt: string;
qmsQuoteId: number;
qmsQuoteName: string;
}

export class QMSInvoicePDFViewModel {
  htmlInvoicePDF: string;
  invoiceId: string;
}



export class FreeTypeModel {
  qty: number;
  price: number;
  type: string;
}

export class PartInfo{
  partId: number;
  partName: string;
  partNo: string;
  qtyInfo: QtyInfo[];
}

export class QtyInfo{
 qty: string;
 level: number;
 feeTypeInfo: FreeTypeModel[];
 subTotal: number;
}
export class QMSActivityStatusModel{
  qmsQuoteId: number;
  qmsQuoteActivityid: number;
  supplierId: number;
 }

 export class QMSMailModel{
  qmsQuoteInvoicePDFHtml: string;
  qmsQuoteContactId: number;
  qmsQuoteInvoiceId: number;
  qmsQuoteInvoiceSubject: string;
  qmsQuoteInvoiceMessageBody: string;
  qmsQuoteSupplierEmailId: string;
  receiverName: string;
  supplierId: number;
  qmsQuoteId: number;
 }
 export class QMSInvoiceTrackActivityViewModel{
  qmsQuoteId : number;
  qmsQuoteInvoiceId : number;
  qmsQuoteActivityId : number;
  // activityDate : string;
  createdBy : number;
 }

export class Quoter {
  quoterContactId:number;
  quoterCompanyId: number;
  quoterName:string;
}


export class InvoicePartSave {
    invoiceId:number= 0;
    quoteId:number= 0;
    partId: number=0;
    isPartOfInvoice:boolean= true;
    partQuantities: InvoicePartQuantities[]=[];

}

export class InvoicePartQuantities {
      selectedQuantityId:number= 0;
      selectedUnitId:number=0;
      quantity:number=0;
      selectedQuantityLevel: number=0;
      fees:InvoiceQuantitesFees[]=[];


}

export class InvoiceQuantitesFees {
    selectedFeeTypeId:number= 0;
    amount:any= 0
}
