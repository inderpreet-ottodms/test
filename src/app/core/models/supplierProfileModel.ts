import { SupplierTypeViewModel } from './globalMaster';
import { I3dTourViewModel } from './accountModel';
import { Injectable } from "@angular/core";

export interface ISupplierProfileModel {
  contactId: number;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  languageId: number;
  languageName: string;
  phoneNumber: string;
  designation: string;
  showDeltailedRating: boolean;
  showRfqAwardStat: boolean;
}

export interface IAboutUsViewModel {
  companyId: number;
  contactId: number;
  name: string;
  description: string;
  dunsNumber: string;
  employeeCountRangeId: number;
  equipments: IEquipmentViewModel[];
  specialFiles: ISpecialFilesViewModel[];
  createdDate: Date;
  cageCode: string;
  companyType: string;
  languages: ILanguageViewModel[];
  errorMessage: string;
  result: boolean;
  supplierType: SupplierTypeViewModel;
  employeeCountRange: string;
  isBlackListed: boolean;
  isFollowing: boolean;
  companyURL: string;
  manufacturingLocation: string;
  isBuyer: boolean;
  _3dTourUrl: string;
  _3dTourUrlList: I3dTourViewModel[];
  communityCompanyProfileUrl?:string;
  profileDetailUrl?:string;
}

export interface IAboutUsViewModel2 {
  companyId: number;
  contactId: number;
  name: string;
  description: string;
  dunsNumber: string;
  employeeCountRangeId: number;
  equipments: IEquipmentViewModel[];
  specialFiles: ISpecialFilesViewModel[];
  createdDate: Date;
  cageCode: string;
  companyType: string;
  languages: ILanguageViewModel[];
  errorMessage: string;
  result: boolean;
  supplierType: SupplierTypeViewModel;
  employeeCountRange: string;
  isBlackListed: boolean;
  isFollowing: boolean;
  capabilities: ICustomProcessCapabilities[];
  npSscore: number;
  address: IComapnyAddressModel;
  telephoneNo: string;
  webUrl: string;
  contactPictureFile: string;
  linkedIn: string;
  facebook: string;
  tweeter: string;
  logoOfCompany: string;
  _3dTourUrl: string;
  _3dTourUrlList: I3dTourViewModel[];
}

export interface IComapnyAddressModel {
  addressId: number;
  countryId: number;
  stateId: number;
  state: string;
  country: string;
  streetAddress: string;
  deptAddress: string;
  postalCode: string;
  city: string;
  address5: string;
  showInProfile: boolean;
  showOnlyStateCity: boolean;
  isActive: boolean;
  addressType: number;
  errorMessage: string;
  result: boolean;
  // companyShippingSiteViewModelList: ICompanyShippingSiteViewModel [];
}
export interface ICustomProcessCapabilities {
  parentDisciplineId: number;
  parentDisciplineName: string;
  childDisciplineId: number;
  childDisciplineName: string;
}

export interface IEquipmentViewModel {
  equipmentId: number;
  equipmentText: string;
  tagSourceId: boolean;
  createDate: Date;
  updateDate: Date;
  statusId: number;
  isDeleted: boolean;
  isFile? :boolean;

}

export interface IProcessesViewModel {
  parentDisciplineId: number;
  parentDisciplineName: string;
  childDisciplineId: number;
  childDisciplineName: string;
  companyId: number;
  partCategoryId: number [];
  contactId?:number;
  errorMessage: string;
  result: boolean;
}

export interface ISpecialFilesViewModel {
  fileId: number;
  fileName: string;
  contId: number;
  compId: number;
  isDeleted: boolean;
  filetypeId: number;
  creationDate: string;
  importedLocation: string;
  parentFileId: number;
  legacyFileId: number;
  fileTitle: string;
  fileCaption: string;
  s3FileName: string;
}
export interface ICertificationViewModel {
  companyId: number;
  certificateTypeId: number;
  certificateId: number;
  description: string;
  certificateCode: string;
  creationDate: Date;
  fileName: string;
}
export interface IFocusOverViewModel {
  industryFocusList: IndustryFocusList[];
  tolerance: string;
}
export interface IndustryFocusList {
  industryFocus: string;
  industryFocusId: number;
}
export interface IFocusOverViewModelEdit {
  industryFocusId: number[];
  industryFocus: string[];
  materialId: number[];
  tolerance: string;
  companyId: number;
  toleranceId: number;
  errorMessage: string;
  result: boolean;
}

export interface ILanguageViewModel {
  languageId: number;
  languageName: string;
  languageAbr:	string;
  charset:	string;
  localeCode:	string;
  hide:	boolean;
  translated:	boolean;
  errorMessage:	string;
  result:	boolean;
}

export interface IToleranceViewModel {
  id: number;
  sysKey: string;
  value:	string;
  description:	string;
  parent:	string;
  active:	boolean;
  sortOrder:	boolean;
  actualIdFromSourceDb:	string;
}

export interface IcompanyCertificateViewModel {
  companyCertificatesId: number;
  companyId: number;
  certificatesId:	number;
  startDate:	Date;
  endDate:	Date;
  fileId:	number;
  fileName:	string;
  recordOriginId:	number;
  statusId:	number;
  creationDate:	Date;
  creationContactId:	number;
  modifiedDate:	Date;
  renewDate:	Date;
  renewReminderDate:	Date;
  refNumber:	number;
  reviewed:	boolean;
  reviewedDate:	Date;
  reviewedContactId:	number;
  renewReminderSentDate:	Date;
  auditor:	string;
  statusBuyerFlag:	number;
  statusBuyerModifiedBy:	number;
  modifiedStatusBuyerDate:	Date;
  errorMessage:	string;
  result:	boolean;
}

export interface IMyAccountViewModel {
  companyId: number;
  contactId: number;
  istrail: boolean;
  accountType: string;
  membership: string;
  price: number;
  paymentMethod: string;
  paymentFrequency: string;
  paymentAmount: number;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  errorMessage: string;
  result: boolean;
  pageName: string;
  rfqId: number;
  toAlternateEmailId: string;
}

export interface IManufacturerDashboardViewModel {
  isCompanyDescription: boolean;
  isCompanyLogo: boolean;
  isCompanyBanner: boolean;
  isCompanyCapabilities: boolean;
  isVisitMyRFQ: boolean;
  // isSubmitQuote: boolean;
  contactId: number;
  isCompanyAddress: boolean;
  isPublishProfile: boolean;
}
export class SubscriptionInvoices{
  invoiceDate: string = "";
  invoiceAmount: number = 0;
  stripeInvoiceId: string = "";
  invoiceId:number = 0;
}
export class BillingInfoViewModel{
  activeSubscriptionPlan:string = "";
  supplierCompany: string = "";
  supplierAddress:string = "";
  supplierContactNo: string = "";
  supplierCardBrand: string = "";
  supplierCardLast4Digit: string = "";
  nextBillingDate: string = "";
  subscriptionInvoicesList: SubscriptionInvoices [] = [];
}

@Injectable()
export class SubscriptionCapability {
  parentDisciplineId: number;
  parentDisciplineName:string;
}
