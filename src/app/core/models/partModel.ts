

   export interface IPartLibraryModel {
    partId: number;
    partName: string;
    partNumber: string;
    partCommodityCode: string;
    partDescription: string;
    materialId: number;
    partQtyUnitId: number;
    partCategoryId: number;
    statusId: number;
    companyId: number;
    contactId: number;
    currencyId: number;
    creationDate: string;
    modificationDate: string;
    rfqId: number;
    postProductionProcessId: number;
    rfqPartQuantityList: IRfqPartQuantityViewModel[];
    deliveryDate: any;
    partsFiles: string[];
    rfqPartFile: string;
    errorMessage: string;
    result: boolean;
    primaryPartFile: string;
    partQtyUnitName: string;
    categoryName: string;
    materialName: string;
    postProductionProcessName: string;
    rfqPartId: number;
    isActive: boolean;
    isArchived: boolean;
    isAwarded: boolean;
    isQuoted: boolean;
    isQuoteInProgress: boolean;
    isQuoteItemAdded: boolean;
    rfqPartTotalQuotedCount: number;
    customPartDescription: string;
    attachmentFileName: string[];
    messageDesc: string;
    isAllowPartQuoting?:boolean;
    parentPartCategoryId? : number;
    childPartCategoryId? :number;
    parentCategoryName? : string;
    childCategoryName? : string;
    isChildCategorySelected?: boolean;
    isPartWithOldCapability?:boolean;
    rfqPartStatusId?: number;
    unit?: number;
    price?: number;
    unitType?: string;
    isChildSameAsParent?:boolean;
    supplierPaymentTerms?: string;
  }

  export interface IRfqPartQuantityViewModel {
    isQuoteItemAdded: boolean;
    rfqPartQuantityId:  number;
    rfqPartId:  number;
    partQty:  number;
    quantityLevel:  number;
    qtyPrice: number;
    isAwarded: boolean;
    perUnitPrice: number;
    toolingAmount: number;
    miscellaneousAmount: number;
    shippingAmount: number;
}

export interface IPartLibraryModelDetails {
  PartLibraryModel: IPartLibraryModel;
  ShowDetials: boolean;
  isMouseOver: boolean;
}

export interface IPartFilterViewModel {
  contactId: number;
  partType: string;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
}
