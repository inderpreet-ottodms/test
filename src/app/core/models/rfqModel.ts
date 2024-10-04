import { Injectable } from "@angular/core";
export interface IFeedbackSaveViewModel {
  rfqQuoteSupplierquoteId: number;
  buyerFeedbackId: number;
  rfqId: number;
  fromCont: number;
  toCont: number;
}
export interface IFeedbackBuyerViewModel {
  id: number;
  value: string;
}
export interface IPartsViewModel {
  partId: number;
  partName: string;
  partNumber: string;
  partCommodityCode: string;
  partDescription: string;
  materialId: number;
  partQtyUnitId: number;
  // partCategoryId: number;
  statusId: number;
  companyId: number;
  contactId: number;
  currencyId: number;
  creationDate: string;
  modificationDate: string;
  rfqId: number;
  rfqPartQuantityList: IRfqPartQuantityViewModel[];
  deliveryDate: any;
  partsFiles: string[];
  rfqPartFile: string;
  errorMessage: string;
  result: boolean;
  primaryPartFile: string;
  postProductionProcessId: number;
  partQtyUnitName: string;
  categoryName: string;
  materialName: string;
  postProductionProcessName: string;
  moveToPartId: number;
  rfqPartId: number;
  isRfq1stquantityChanged: boolean;
  isRfq2ndquantityChanged: boolean;
  isRfq3rdquantityChanged: boolean;
  createNewPart: boolean;
  rfqPartTotalQuotedCount: number;
  modifiedBy: number;
  isUpdatedFromVision: boolean;
  partSizeUnitId: number;
  width: number;
  height: number;
  depth: number;
  length: number;
  diameter: number;
  volume: number;
  surface: number;
  customPartDescription: string;
  isValidDeliveryDate: boolean;
  isDefaultPartCategory: boolean;
  isDefaultPostProduction: boolean;
  isDefaultMaterial: boolean;
  isDefaultDeliveryDate: boolean;
  isExistingPart: boolean;
  parentPartCategoryId: number;
  childPartCategoryId ? : number;
  parentCategoryName ? : string;
  childCategoryName ? : string;
  isDefaultParentPartCategory ? : boolean;
  isDefaultChildPartCategory ? : boolean;
  quoteReferenceNumber ? : number;
  isChildCategorySelected ? : boolean;
  messageDesc ? : string;
  isChildSameAsParent ? : boolean;
  isPartWithOldCapability ? : boolean;
  isLargePart?:boolean;
  geometryId?:number;
  showPartSizingComponent?: boolean;
  showQuestionsOnPartDrawer?: boolean;
  rfqPartDrawerAnswerList?:any;
  rfqPartDrawerQuestionAnswerResponseList?: any;
  isPartCheckBoxEnabled?: boolean;
  isCommunityRfq?:boolean;
  willDoLater?:boolean
}

export interface IRfqPartQuantityViewModel {
  rfqPartQuantityId: number;
  rfqPartId: number;
  partQty: number;
  quantityLevel: number;
}

export interface IUploaadedFileName {
  oFileName: string;
  CompleteFileName: string;
}
export interface IUploaadedFileNameList {
  FileNameList: IUploaadedFileName[];
}

export interface IUploadedGenAttachFileNmList {
  GenAttachFileNmList: IUploaadedFileName[];
}
export interface IRfqBuyerStatus {
  rfqBuyerstatusId: number;
  rfqBuyerstatusLiKey: string;
  description: string;
  position: number;
}

export interface IRFQViewModel {
  poReshapeOrderId?: any;
  rfqguid?: string;
  rfqId: number;
  rfqName: string;
  rfqDescription: string;
  contactId: number;
  contactIdEncrypt: string;
  rfqCreatedOn: string;
  rfqStatusId: number;
  isSpecialCertificationsByManufacturer: boolean;
  isSpecialInstructionToManufacturer: boolean;
  specialInstructionToManufacturer: string;
  importancePrice: number;
  importanceSpeed: number;
  importanceQuality: number;
  quotesNeededBy: any;
  awardDate: any;
  preferredManufacturingLocation: number;
  isPartialQuotingAllowed: boolean;
  whoPaysForShipping: number;
  isDefaultWhoPaysForShipping: boolean;
  shipTo: number;
  isRegisterSupplierQuoteTheRfq: boolean;
  prefNdaType: number;
  postProductionProcessId: number;
  preferredMfgLocationIds: string[];
  userType: number;
  rfqBuyerStatus: IRfqBuyerStatus;
  certificationsByManufacturer: string;
  errorMessage: string;
  result: boolean;
  isDefaultPrefferedManufacturingLocation: boolean;
  ndaTypekey: string;
  ndaContent: string;
  isDefaultNDAdetails: boolean;
  rfqGeneralAttachmentsList: string[];
  partCount: number;
  isProfileNDA: boolean;
  rfqThumbnail: string;
  certificateIdList: number[];
  certificateList: CertificateList[];
  isActive: boolean;
  isUpdatedFromVision: boolean;
  rfqStatus: string;
  isAllPartDetailsFilled: boolean;
  modifiedBy: number;
  payment_term_id: number;
  is_Default_payment_term_id: boolean;
  SpecialinviteList: SpecialInvitedModel[];
  ndaFile: string;
  ndaFileId: number;
  companyId: number;
  isRfqLike: boolean;
  isRfqDisLike: boolean;
  isAwarded: boolean;
  isOnlyDateChanged: boolean;
  isShopIQAvailable: boolean;
  maxDeliveryDate: any;
  isDefaultPrefRfqCommunicationMethod: boolean;
  prefRfqCommunicationMethod: number;
  isStripeSupplier: boolean;
  isAllowQuoting: boolean;
  isAllowRequoting ?: boolean;
  isAwardingEnabled: boolean;
  rfqPurpose ? : any;
  rfqPurposeAnswer ? : any;
  isEditEnable?:any;
  isCommunityRfq?:boolean;
  isMarkForQuoting?:boolean;
  deliveryDate?:any;
  actionForGrowthPackage?:string;
  isRfqWithMissingInfo?: boolean;
  withOrderManagement?:boolean;
  poStatus?:string;
  isInvoiceCreated?:boolean;
  rfqAwardedTo?: number;
  isReshapeFileProcessed?:boolean;
  rfqPrice?:number;
  rfqAccess?:boolean;
  showHistoryTab?:boolean;

}
export interface IUpdateRFQViewModel {
  rfqId: number;
  rfqName: string;
  rfqDescription: string;
  contactId: number;
  contactIdEncrypt: string;
  rfqCreatedOn: string;
  rfqStatusId: number;
  isSpecialCertificationsByManufacturer: boolean;
  isSpecialInstructionToManufacturer: boolean;
  specialInstructionToManufacturer: string;
  importancePrice: number;
  importanceSpeed: number;
  importanceQuality: number;
  quotesNeededBy: any;
  awardDate: any;
  preferredManufacturingLocation: number;
  isPartialQuotingAllowed: boolean;
  whoPaysForShipping: number;
  isDefaultWhoPaysForShipping: boolean;
  shipTo: number;
  isRegisterSupplierQuoteTheRfq: boolean;
  prefNdaType: number;
  postProductionProcessId: number;
  preferredMfgLocationIds: string[];
  userType: number;
  rfqBuyerStatus: IRfqBuyerStatus;
  certificationsByManufacturer: string;
  errorMessage: string;
  result: boolean;
  isDefaultPrefferedManufacturingLocation: boolean;
  ndaTypekey: string;
  ndaContent: string;
  isDefaultNDAdetails: boolean;
  rfqGeneralAttachmentsList: string[];
  partCount: number;
  isProfileNDA: boolean;
  rfqThumbnail: string;
  certificateIdList: number[];
  certificateList: CertificateList[];
  isActive: boolean;
  isUpdatedFromVision: boolean;
  rfqStatus: string;
  isAllPartDetailsFilled: boolean;
  modifiedBy: number;
  payment_term_id: number;
  is_Default_payment_term_id: boolean;
  SpecialinviteList: SpecialInvitedModel[];
  ndaFile: string;
  ndaFileId: number;
  companyId: number;
  isRfqLike: boolean;
  isRfqDisLike: boolean;
  isAwarded: boolean;
  isOnlyDateChanged: boolean;
  isShopIQAvailable: boolean;
  maxDeliveryDate: any;
  isDefaultPrefRfqCommunicationMethod: boolean;
  prefRfqCommunicationMethod: number;
  isStripeSupplier: boolean;
  isAllowQuoting: boolean;
  isAwardingEnabled: boolean;
  rfqPurpose ? : any;
  rfqPurposeAnswer ? : any;
  isEditEnable?:any;
  isCommunityRfq?:boolean;
  isMarkForQuoting?:boolean;
}
export interface CertificateList {
  id: number;
  certificateCode: string;
}

export interface SpecialInvitedModel {
  type: string;
  inviteId: Number;
}
export interface SpecialInvitedNameModel {
  type: string;
  inviteId: Number;
  name: string;
  isDelete: boolean;
}

export interface ICustomProcessViewModel {
  parentDisciplineId: number;
  parentDisciplineName: string;
  childDisciplineId: number;
  childDisciplineName: string;
  level: number;
  companyId: number;
  partCategoryId: number;
  errorMessage: string;
  result: boolean;
  showPartSizingComponent?: boolean;
  showQuestionsOnPartDrawer?: boolean;
}

export class SupplierChildProcessViewModel {
  supplierCompanyId: number = 0;
  isRfqSearchType: boolean = true;
  parentCategoryIdList: any = [];
}
export class BuyerChildProcessViewModel {
  parentCategoryIdList: any = [];
}

export interface ICustomProcessViewModelTemp {
  parentDisciplineId: number;
  parentDisciplineName: string;
  childDisciplineId: number;
  childDisciplineName: string;
}
export interface ICustomSelectionProcessViewModel {
  sparentDisciplineId: number;
  sparentDisciplineName: string;
  schildDisciplineId: number;
  schildDisciplineName: string;
  sisSelected: boolean;
}
export interface ICustomSelectionPostProcessViewModel {
  sparentPostProductionProcessId: number;
  sparentPostProductionProcessName: string;
  schildPostProductionProcessId: number;
  schildPostProductionProcessName: string;
  sisSelected: boolean;
}
export interface ICustomSelectionMaterialViewModel {
  sparentMaterialId: number;
  schildMaterialId: number;
  sparentMaterialName: string;
  schildMaterialName: string;
  sisSelected: boolean;
}
export interface ICustomProcessViewModelForCapa {
  parentDisciplineId: number;
  parentDisciplineName: string;
  childDisciplineId: number;
  childDisciplineName: string;
  isSelected: boolean;
}
export interface ISupplierGroupViewModel {
  bookId: number;
  bkType: number;
  bkName: string;
  contId: number;
  parentBookId: number;
  statusId: number;
}
export interface ITerritoryClassificationModel {
  territoryClassificationId: number;
  territoryClassificationName: string;
  territoryClassificationCode: string;
  territoryClassificationDispName: string;
}
export interface ITerritoryClassificationNames {
  territoryClassificationName2: string;
  territoryClassificationName3: string;
  territoryClassificationName4: string;
  territoryClassificationName5: string;
  territoryClassificationName6: string;
  territoryClassificationName7: string;
}

export interface IIndividualList {
  dunsNumber: string;
  companyId: number;
  employeeCountRangeId: number;
  name: string;
  description: string;
  errorMessage: string;
  isActive: boolean;
  companylogo: string;
  services: string;
}

export interface IManufactureGroupList {
  rfqSupplierId: number;
  rfqId: number;
  companyId: number;
  supplierGroupId: number;
  companyName: string;
  booksName: string;
}

export interface IManufacturersViewModel {
  bookId: number;
  bkType: number;
  bkName: string;
  contId: number;
  parentBookId: number;
  statusId: number;
  rfqId: number;
  errorMessage: string;
  result: boolean;
  companyId: number;
  individualList: IManufactureGroupList[];
  groupList: IManufactureGroupList[];
}
export interface IMessagesViewModel {
  messageId: number;
  rfqId: number;
  messageTypeId: number;
  messageStatusId: number;
  messageTypeValue: string;
  messageHierarchy: number;
  messageSubject: string;
  messageDescr: string;
  messageDate: Date;
  fromCont: number;
  fromContactIdEncrypt: string;
  toContactIdEncrypt: string;
  toCont: number;
  messageRead: boolean;
  messageSent: boolean;
  readDate: Date;
  originalMessageSubject: string;
  messageStatusIdRecipient: number;
  messageStatusIdAuthor: number;
  expirationDate: Date;
  trash: boolean;
  trashDate: Date;
  fromTrash: boolean;
  fromTrashDate: Date;
  errorMessage: string;
  result: boolean;
  isSelected: boolean;
  toContactIds: number[];
  messageStatus: string;
  supplierProfileUrl: string;
  buyerProfileUrl: string;
  sendEmail: boolean;
  messageFileNames: string[];
  fromContName: string;
  toContName: string;
  isNDAToApproveAll: boolean;
  toRFQIds: number[];
  companyId: number;
  companyName: string;
  companyUrl: string;
  companylogo: string;
  toContactCompanyUrl: string;
  toContactCompanylogo: string;
  toCompanyName: string;
  pageName: string;
  nDAApproveContactsRFQsLists: NDAApproveContactsRFQsList[];
  isNdaRequired ? : boolean;
  isNdaAccepted ? : boolean;
  quoteReferenceNumber ? : string;
  isMessageThread ? : boolean;
  leadId?: number;
  toCompanyId:number;
  isNotification : boolean;
}
export interface NDAApproveContactsRFQsList {
  rfqId: number;
  contactId: number;
}
export interface IMessageViewModel {
  subject: string;
  message: any;
}
export interface IRfqNDAViewModel {
  rfqId: number;
  rfqName: string;
  contactId: number;
  contactIdEncrypt: string;
  companyName: string;
  telephone: string;
  salesOffice: string;
  contactName: string;
  messageStatusIdAuthor: string;
  messageStatusToken: string;
  selected: boolean;
  ndaAcceptedDate: string;
  npsScore: number;
  rfqStatusId: number;
}
export interface IRFQRevisionModel {

  rfqId: number;
  contactId: number;
  versionId: number;
  versionNum: number;
  contactName: string;
  contactURL: string;
  revisionDate: string;
  status: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
}
export interface SupplierDashListModel {
  contactId: number;
  companyId: number;
  rfqType: number;
  processIdList: number[];
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
}
export interface ISupplierRFQViewModel {
  isReviewed: boolean;
  rfqId: number;
  rfqName: string;
  quotesNeededBy: any;
  isRfqWithMissingInfo?: boolean;
  partQty: number;
  partQtyUnit: string;
  partsMaterialName: string;
  partCategoryName: string;
  postProductionProcessName: string;
  specialInstructions: string;
  buyerContactId: number;
  buyerCompanyId: number;
  isRfqLike: boolean;
  isRfqDisLike: boolean;
  npsScore: number;
  rfqThumbnail: string;
  state: string;
  country: string;
  contactIdEncrypt: string;
  companyLogoPath: string;
  companyName: string;
  result: boolean;
  releaseDate: string;
  qty1: number;
  qty2: number;
  qty3: number;
  rfqPartCount: number;
  noOfQuotes: number;
  isSubscriptionSupplier: boolean;
  isAllowQuoting: boolean;
  noOfStars ? : any;
  rfqToAwardCount ? : any;
  ndaToApproveCount ? : any;
  isViewed?:boolean;
  rfqStatusId?: number;
  isMfgCommunityRfq?:boolean;
}
export interface IMarkSupplierRFQViewModel {
  rfqId: number;
  contactId: number;
  contactIdEncrypt: string;
  specialInstructions: string;
  rfqThumbnail: string;
  companyName: string;
  companyLogoPath: string;
  rfqName: string;
  ndaToApproveCount: number;
  rfqStatusId: number;
  buyerContactId: number;
  rfqStatus: string;
  rfqCreatedOn: string;
  quotesNeededBy: string;
  awardDate: string;
  partsPrimaryFileName: string;
  partName: string;
  partQty: number;
  partQtyUnit: string;
  partsMaterialName: string;
  partCategoryName: string;
  postProductionProcessName: string;
  buyerName: string;
  rfqType: string;
  errorMessage: string;
  result: boolean;
  allRfqCount: number;
  likedRfqCount: number;
  specialInviteRfqCount: number;
  quotesRfqCount: number;
  awardedRfqCount: number;
  followedBuyersRfqCount: number;
  awardDeclinedCount: number;
  ndaBuyerDeclined: number;
  ndaRequireResign: number;
  isRfqLike: boolean;
  isRfqDisLike: boolean;
  npsScore: number;
  awardRfqPendingAcceptenceCount: number;
  declineQuotesCount: number;
  specialInvitedRfqUnreadCount: number;
  ndaToSignSupplierDeclinedCount: number;
  ndaToSignRequireResignCount: number;
  quotesInProgressRfqCount: number;
  newMessages: number;
  newNotifications: number;
  reQuoteRfq: number;
  profileViewCount: number;
  markForQuotingCount: number;
  newQuotesCount: number;
  country: string;
  state: string;
  city: string;
  unviewedMagicLeadsCount: number;
  manufacturingLocationId: number;
  manufacturingLocation: string;
  deliveryDate: any;
  isEditEnable?:any;
  isMfgCommunityRfq?:boolean;
}

export interface ITempNPSDataModel {
  nps: number;
  promoter: number;
  passives: number;
  detractors: number;
  promotersCount: number;
  passivesCount: number;
  petractorsCount: number;
  totalResponses: number;
  result: boolean;
}

export interface IRfqSupplierLikesViewModel {
  rfqSupplierLikesId: number;
  rfqId: number;
  contactId: number;
  isRfqDisLike: boolean;
  companyId: number;
  isRfqLike: boolean;
  likeDate: Date;
  errorMessage: string;
  result: boolean;
}

export interface IRatingResponseViewModel {
  responseId: number;
  fromId: number;
  toId: number;
  parentId: number;
  contactName: string;
  imageURL: string;
  createdDate: string;
  score: string;
  comment: string;
  isLegacyRating: boolean;
  messageId: number;
  isNotNowClicked: boolean;
  errorMessage: string;
  result: boolean;
  rfqId: number;
}
export interface IRfqQuoteItemsViewModel {
  rfqQuoteItemsId: number;
  rfqQuoteSupplierQuoteId: number;
  rfqPartId: number;
  perUnitPrice: any;
  toolingAmount: number;
  miscellaneousAmount: number;
  shippingAmount: number;
  isAwrded: boolean;
  awardedQty: number;
  awardedDate: Date;
  isAwardAccepted: boolean;
  awardAcceptedDate: Date;
  rfqPartQuantityId: number;
  estLeadTimeValue: number;
  estLeadTimeRange: string;

}
export interface NPartArray {
  manName: string;
  manId: number;
  npsScore: number;
  noOfStars: number;
  partName: string;
  partNumber: string;
  rfqQuoteItemsId: number;
  isAward: boolean;
  rfqPartId: number;
  quantityList: LocalAwardedPartsQuantityList[];
  unit: string;
  price: number;
  isRfqStatus: boolean;
  awardedUnitTypeId?: number;
  supplierList?:any;
  rfqId?: any;
}
export interface LocalAwardedManufractureList {
  manName: string;
  manId: number;
  awardedPart: LocalAwardedParts[];
  isPartPresent: boolean;
  npsScore: number;
}
export interface LocalAwardedParts {
  rfqQuoteItemsId: number;
  rfqPartName: string;
  rfqPartNumber: string;
  isAward: boolean;
  rfqPartId: number;
  quantityList: LocalAwardedPartsQuantityList[];
}
export interface LocalAwardedPartsQuantityList {
  quantityDetails: string;
  rfqQuoteItemsId: number;
}
export interface IRfqQuoteSupplierQuoteViewModel {
  rfqQuoteSupplierQuoteId: number;
  rfqId: number;
  contactId: number;
  paymentTerms: string;
  isPaytermAccepted: boolean;
  supplierPayForShipping: boolean;
  isPartsMadeInUs: boolean;
  quoteReferenceNumber: string;
  quoteDate: any;
  quoteExpiryDate: any;
  rfqDetails: IRFQViewModel;
  rfqQuoteFileList: IRfqQuoteFilesViewModel[];
  mpRfqQuoteItemList: IRfqQuoteItemsViewModel[];
  errorMessage: string;
  disableSubmitQuote: boolean;
  result: boolean;
  isQuoteSubmitted: boolean;
  ndaStatus: string;
  messageDesc: string;
  attachmentFileName: string[];
}

export interface IRfqQuoteFilesViewModel {
  rfqQuoteFileId: number;
  rfqQuoteSupplierQuoteId: number;
  fileId: number;
  creationDate: Date;
  statusId: number;
  messageId: number;
}

export interface IRfqQuoteItemsViewModel {
  rfqQuoteItemsId: number;
  rfqQuoteSupplierQuoteId: number;
  rfqPartId: number;
  perUnitPrice: any;
  toolingAmount: number;
  miscellaneousAmount: number;
  shippingAmount: number;
  isAwrded: boolean;
  awardedQty: number;
  awardedDate: Date;
  isAwardAccepted: boolean;
  awardAcceptedDate: Date;
}
export interface ISupplierNdaAcceptedViewModel {
  rfqSupplierNdaAccepted: number;
  rfqId: number;
  contactId: number;
  isPreferedNdaTypeAccepted: boolean;
  preferedNdaTypeAcceptedDate: Date;
  isNdaVerbiageAccepted: boolean;
  ndaVerbiageAcceptedDate: Date;
  result: boolean;
  errorMessage: string;
}
export interface IGetCustomNDAFilesModel {
  contactId: number;
  ndaLevel: number;
  ndaFile: string;
  ndaContent: string;
  result: boolean;
  errorMessage: string;
  fileId: number;
  ndaId: number;
  companyId: number;
  rfqId: number;
  fileType: string;
  isDefaultNDAdetails: boolean;
}


export interface IBuyerQuotesList {
  rfqQuoteSupplierQuoteId: number;
  rfqName: string;
  rfqId: number;
  contactId: number;
  contactIdEncrypt: string;
  contactName: string;
  companyId: number;
  companyName: string;
  paymentTerms: string;
  isPaytermAccepted: boolean;
  supplierPayForShipping: boolean;
  isPartsMadeInUs: boolean;
  quoteReferenceNumber: string;
  quoteDate: any;
  quoteExpiryDate: string;
  rfqDetails: IRFQViewModel;
  qty1: number;
  qty2: number;
  qty3: number;
  isQuoteSubmitted: boolean;
  isReviewed: boolean;
  errorMessage: string;
  isSelected: boolean;
  result: boolean;
  npsScore: number;
  isAwrded: boolean;
  isMessageAdded: boolean;
  noOfStars: number;
  isRfqResubmitted: boolean;
  buyerFeedbackId ? : number;
  isDrawerOpen: boolean;
  rfqSupplierStatusId?:number;
  isViewed?:boolean;
}
export interface ITempUploadedFiles {
  fileName: string;
  isProcessed: boolean;
}
export interface IRFQPartQuantityQuoteContainer {
  index: number;
  iRFQPartQuantityQuoteColl: IRFQPartQuantityQuote[];
}
export interface IQuotePartList {
  partName: string;
  partNumber: string;
  partId: number;
  rfqPartId: number;
}
export interface ICustomRFQPartQuantityQuote {
  partName: string;
  partNumber: string;
  partId: string;
  partRfqId: string;
  partQuantityQuoteList: IRFQPartQuantityQuote[];
}



export interface IRFQPartQuantityQuote {
  buyerFeedbackId: string;
  rfqQuoteItemsId: number;
  rfqQuoteSupplierQuoteId: number;
  rfqPartId: number;
  rfqPartIdString: string;
  perUnitPrice: number;
  toolingAmount: number;
  miscellaneousAmount: number;
  shippingAmount: number;
  rfqPartQuantityId: number;
  isAwrded: boolean;
  awardedQty: number;
  awardedDate: string;
  isAwardAccepted: boolean;
  awardAcceptedOrDeclineDate: string;
  partId: number;
  partName: string;
  partNumber: string;
  rfqId: number;
  quantityLevel: number;
  contactId: number;
  contactIdList: number[];
  rfqQuoteItemList?: any[];
  errorMessage: string;
  result: boolean;
  isAlreadyAwrded: boolean;
  awardedQtyUnit: string;
  isRfqResubmitted: boolean;
  isDeclineAll: boolean;
  estLeadTimeValueRange: any;
  estLeadTimeValue: number;
  estLeadTimeRange: string;
  rfqPartStatusId?:number;
  isContinueAwarding?:boolean;
}

export interface ISavedSearchViewModel {
  savedSearchId: number;
  contactId: number;
  searchFilterName: string;
  keyword: string;
  partCategoryIdList: number[];
  postProcessIdList: number[];
  materialIdList: number[];
  buyerLocationIdList: number[];
  buyerIndustryIdList: number[];
  countryIdList: number[];
  regionIdList: number[];
  proximityIdList: number[];
  geometryId: number;
  unitOfMeasureId: number;
  toleranceIdList: number[];
  widthMin: number;
  widthMax: number;
  heightMin: number;
  heightMax: number;
  depthMin: number;
  depthMax: number;
  lengthMin: number;
  lengthMax: number;
  diameterMin: number;
  diameterMax: number;
  isDailyNotification: boolean;
  createdOn: string;
  modifiedOn: string;
  result: boolean;
  errorMessage: string;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecord: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
}

export interface IsupplierRfqFilterViewModel {
  contactId: number;
  companyId: number;
  rfqType: number;
  processIdList: number[];
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  currentDate: string;
  selectedSupplierId ? : number;
}

export interface IRfqFilterListModel {
  quotesNeededBy: string;
  rfqCreatedOn: string;
  rfqId: number;
  rfqName: string;
  rfqStatus: string;
  rfqStatusId: number;
  rfqThumbnail: string;
  awardDate: any;
  partCount: number;
  awardedPartQtyList: string[];
  ManufacturingLocationId: number;
  manufacturingLocation: string;
  deliveryDate: any;
  rfqQuoteCount?: number;
  rfqReleaseDate?: string;
  isEditEnable ?:any;
  isMfgCommunityRfq?:boolean;
  isSelected?: boolean;
  rfqPercent?:number
}
export interface IBuyerFilteredRfqViewModel {
  contactId: number;
  companyId: number;
  rfqType: number;
  currentDate: string;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  territoryId ? : number;
  isArchived: boolean;
}
export interface IMessageListViewModel {
  rfqId: number;
  contactId: number;
  fromContactId: number;
  maxPageSize: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  IsMessageRead: boolean;
  isBuyer: boolean;
  isNotificationOrMessage:number;
  IsBuyerSupplierOrRfq:number;
  IsArchiveMessages: boolean; 
  IsSentMessages: boolean; 
}
export interface IBuyerQuotesViewModel {
  rfqId: number;
  contactId: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  isRfqResubmitted: boolean;
}

export class BuyerMyQuotesRequestViewModel {
  rfqId: number = 0;
  pageSize: number = 24;
  pageNumber: number = 1;
  searchText: string = '';
  totalRecords: number = 0;
  isOrderByDesc: boolean = true;
  orderBy: string = 'QuoteDate';
  more_records: boolean;
  isRfqResubmitted: boolean;
  buyerContactId: number;
  tabId: number = 1;
  statusId: number = 0;
  territoryId: number = 0;
  filterBy: string;
}
export class BuyerMyQuotesResponseViewModel {
  rfqId: number;
  rfqName: string;
  rfqStatusId: number;
  supplierId: number;
  supplier: string;
  supplierCompanyId: number;
  supplierTerritoryId: number;
  supplierTerritory: string;
  quoteDate: string;
  isReviewedByBuyer: boolean;
  quoteStatusId: number;
  supplierQuoteId: number;
  qty1: number;
  qty2: number;
  qty3: number;
  totalCount: number;
  rfqResubmittedByBuyer: boolean;
  quoteDeclined: number;
  supplierCompany: string;
  supplierIdEncrypt: string;
  isShow: boolean = false;
  buyerFeedbackId ? : number;
  noOfStars ? : number;
  isViewedByBuyer?:boolean=false;
  isSelected?:boolean=false;
  withOrderManagement?:boolean = false;
}
export interface ILocalQuotedPart {
  partName: string;
  partNumber: string;
  rfqPartId: number;
  quantityList: ILocalPartQuantity[];
  IRfqQuoteItemsViewModel: IRfqQuoteItemsViewModel[];
}

export interface ILocalPartQuantity {
  quantity: number;
  perUnit: number;
  tooling: number;
  shipping: number;
  miscellaneous: number;
}
export interface IDeleteQuoteModel {
  rfqId: number;
  rfqPartId: number;
  contactId: number;
}
export interface IPartAwarded {
  partName: string;
  partNumber: number;
  awardedDate: string;
  awardedQty: number;
  awardedQtyUnit: string;
  totalPrice: number;
  isMessageAdded: boolean;
  messageDesc: string;
  buyerContactId: number;
  buyerContactName: string;
}
export interface IRFQShopIQViewModel {
  partName: string;
  categoryName: string;
  materialName: string;
  quantityListViewModel: QuantityListViewModel[];
}

export interface QuantityListViewModel{
  rfqShopiqId: number;
  isAwarded: boolean;
  quantity: string;
  avgMarketprice: number;
  awardedPrice: number;
  yourQuotePrice: number;
  lowPrice:number;
  highPrice:number;
}
export interface PdfModel {
  pageURL: string;
  htmlRFQdetails: string;
  rfqId: string;
}
export interface SubscriptionReceiptPdfViewModel {
  htmlSubscriptionReport: string;
  CompanyId: number;
}



export interface DistributionPostModel {
  rfqId: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  filterBy: string;
}
export interface DistributionViewModel {
  companyId: number;
  companyName: string;
  npsScore: number;
  manufacturingLocation: string;
  phoneNo: string;
  Status: string;
  contactId: number;
  contactIdEncrypt: string;
  companyUrl: string;
  isSelected: boolean;
  noOfChildContacts: boolean;
  communityCompanyProfileUrl?: string;
  profileDetailUrl: string;
}
export interface DownloadAllFilesViewModel {
  filename: string[];
  rfQ_Id: number;
  part_id: number;
}


@Injectable()
export class CloneRfqViewModel {
  rfqName: string;
  rfqId: number;
  contactId: number;
  deliveryDate: any;
  isEdit: boolean;
  manufacturingLocationId: number;
  isClonedWhileRfqCreation: boolean;
  quotesNeededBy: any;
  awardDate: any;
  quantityUnitId?:number;
}
export class CreateNewRFQMessagesViewModel {
  messageId: number = 0;
  messageSubject: string;
  messageDescription: string;
  fromContactId: number = 0;
  rfqIds: any = [];
  messageFileNames:string[] = [];
  contactIds: any = [];
}

export class RFQMessageAssociationViewModel {
  messageId: number = 0;
  rfqIds: any = []
}


export class DownloadQuotesToExcelViewModel {

  contactIdList: Array < number > = [];
  rfqId: number;
  quantityLevelList: Array < number > = [];
  isRfqResubmitted: boolean = false;
  supplierList: Array < string > = [];
  supplierCompanyList: Array < string > = [];
  supplierNoOfStarsList: Array < any > = [];
  perUnitPrice: number;
  toolingAmount: number;
  miscellaneousAmount: number;
  shippingAmount: number;
  contactId: number;
  rfqPartId: number;
  awardedQty: number;
  totalPrice: number;
  rfqName: string;
  rfqCreationDate: any;

}
export class TrackBuyerActivityOnDashboardViewModel {
  /// <summary>
  /// Gets or sets the contact ID.
  /// </summary>
  contactId: number;
  /// <summary>
  /// Gets or sets the activity ID.
  /// </summary>
  activityId: number;
}
export class ContinueAwardingPriceData {
  partQuantity: number;
  totalPrice: number;
}
export class RfqContinueAwardingViewModel {
  partName: string;
  partNumber: string;
  supplier: string;
  supplierRating: number;
  continueAwardingPriceDataList: ContinueAwardingPriceData[];
}



export class AwardingModuleViewModel {
  rfqId: number = 0;
  rfq: string = '';
  rfqClosedDate: string = '';
  rfqAwardDate: string = '';
  rfqThumbnail: string = '';
  rfqBuyerId: number = 0;
  noOfQuotes: any = 0;
  rfqAwardMessage: string = '';
  parentWithClonedRfqList: any = [];
}

export class RFQPurposeModel {
  id: number;
  sysKey: string;
  value: string;
  description: string;
  parent: any;
  active: boolean;
  sortOrder: number;
  actualIdFromSourceDb: any;
  parentNavigation: any;
  inverseParentNavigation: any;
  mpContacts: any;
  mpGatewaySubscriptionCustomers: any;
  mpRegisteredSupplier: any;
  mpRfq: any;
}

export class BuyerMyCompanyRFQRequestViewModel {
  contactId: number;
  companyId: number;
  rfqType: number;
  currentDate: string;
  selectedBuyerId: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  filterBy: string;
}



export class AwardingModelQuoteDetailsViewModel {
  partName: string = '';
  partNumber: number = 0;
  noOfStars: number = 0;
  rfqPartId: number = 0;
  manufacturerId: number = 0;
  isRfqStatus: boolean = false;
  unit: any = '';
  price: any = 0;
  awardedUnitTypeId:any=0;
  rfqQuoteItemList: RfqQuoteItemsViewModel[] = [];
  supplierList:any=[];

}


export class RfqQuoteItemsViewModel {
  awardedQty: number = 0;
  totalPrice: number = 0;
  rfqQuoteItemsId: number = 0;
  isAward: boolean = false;
}


export class AwardingModelQuoteDetailsRequestViewModel {
  rfqId: number = 0;
  rfqPartId: number = 0;
  contactIds: any = [];
  quantityLevel: number = 0;
  isRfqResubmitted: boolean = false;
}
export class BuyerRegionalAwardingRfqViewModel {
  rfqName: string = '';
  rfqId: number = 0;
  rfqPreferredLocation: string = ''
  process: string = '';
  quotesCount: number = 0;
}


export class AwardRequestModel {
  buyerFeedbackId: string;
  rfqQuoteItemsId: number;
  rfqQuoteSupplierQuoteId: number;
  rfqPartId: number;
  rfqPartIdString: string;
  perUnitPrice: number;
  toolingAmount: number;
  miscellaneousAmount: number;
  shippingAmount: number;
  rfqPartQuantityId: number;
  isAwrded: boolean;
  awardedQty: number;
  awardedDate: string;
  isAwardAccepted: boolean;
  awardAcceptedOrDeclineDate: string;
  partId: number;
  partName: string;
  partNumber: string;
  rfqId: number;
  quantityLevel: number;
  contactId: number;
  contactIdList: number[];
  rfqQuoteItemsIdList: number[];
  errorMessage: string;
  result: boolean;
  isAlreadyAwrded: boolean;
  awardedQtyUnit: string;
  isRfqResubmitted: boolean;
  isDeclineAll: boolean;
  estLeadTimeValueRange: any;
  estLeadTimeValue: number;
  estLeadTimeRange: string;
  rfqQuoteItemList: AwardPartQuatityRequestModel[] = [];
}

export class AwardPartQuatityRequestModel {
  isRfqStatus: boolean = false;
  rfqPartStatusId: number = 0;
  unit: string = '';
  price: number = 0;
  rfqQuoteItemsId: number = 0;
  rfqPartId: number = 0;
  awardedUnitTypeId:number=0;
}


export class OtherThanAwardedStatusTileDataViewModel {
  unit: number;
  price: number;
  rfqPartStatusId: number;
  rfqPartStatus: string;
  otherThanAwardedStatusTileExpansionDataList: OtherThanAwardedStatusTileExpansionViewModel[];
}

export class OtherThanAwardedStatusTileExpansionViewModel {
  partName: string;
  partNumber: string;
  unit: number;
  price: number;
  rfqPartStatus: string;
}

export class DistributionChildAccountsViewModel {
  rfqId: number;
  contactId: number;
  companyId: number;
}



export class MaterialsRequestViewModel {
    companyId: number=0;
    processIds: any=[]

}

export class PostProductionProcessRequestViewModel {
  processIds: any=[]
}



export class BuyerRfqSourcedInfoFilterRequest
{
  supplierCompanyId: number;
  supplierId: number;
  buyerId:number;
}

export class BuyerRfqSourcedInfoFilterResponse
{
  rfqId: number;
  rfqName: string;
  process: string;
  technique:string;
  maxQuantity: number;
}

export class MessageReadUnreadViewModel {
  messageIdList: any=[];
  isRead: boolean;
}

export class ArchiveUnArchiveMessagesViewModelList {
  archiveUnArchiveMessagesList: ArchiveUnArchiveMessagesViewModel[];
  isArchive: boolean;
}

export class ArchiveUnArchiveMessagesViewModel {
  parentMessageId: number;
  messageId: any=[];
  archiveBy: number;
}

