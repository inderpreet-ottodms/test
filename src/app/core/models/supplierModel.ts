import {
  IAddressModel
} from './accountModel';

export interface ISupplierDetailsViewModel {
  manufactureName: string;
  netPramoterScore: number;
  city: string;
  state: string;
  country: string;
  capabilities: string[];
  certificates: string[];
  isPremium: boolean;
  logoURL: string;
  profilePicture: string;
  companyId: number;
  contactId: number;
  contactIdEncrypt: string;
  isFollowing: boolean;
  isBlackListed: boolean;
  noOfStars: number;
  isSpotLightTurnOn: boolean;
}

export interface ISupplierFilterViewModel {
  countryFilterList: string[];
  manufacturerFilterList: string[];
  certificateFilterList: string[];
  isFollowing: boolean;
  contactId: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
}

export interface IManufacturerContactsViewModel {
  contactId: number;
  followContactId: number;
  contactIdEncrypt: string;
  companyId: number;
  companyName: string;
  npsScore: number;
  logoOfCompany: string;
  address: IAddressModel;
  webUrl: string;
  telephoneNo: string;
  certificateIds: number[];
  industryBranchIds: number[];
  processesIds: number[];
  bookTypeName: string;
  isBuyer: boolean;
  bookId: number;
  errorMessage: string;
  result: boolean;
  email: string;
}

export interface IManufacturerContactListViewModel {
  contactId:number;
  isbuyer:boolean;
  isBlacklisted:boolean;
  isLikedManufacturers:boolean;
  maxPageSize: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  filterBy: string;
    
}



export interface IMagicLeadsViewModel {
  buyerContactId: number;
  buyerCompanyId: number;
  buyerCompany: string;
  companyphone: string;
  companyWeb: string;
  encryptedContactId: string;
  noOfStars: number;
  streetAddress: string;
  deptAddress: string;
  postalCode: string;
  city: string;
  address5: string;
  countryId: number;
  regionName: string;
  countryName: string;
  companyLogo: string;
  isFollowing: boolean;
}

export interface SupllierViewProfileViewModel {
  contactId: number;
  addressId: number;
  contactIdEncrypt: string;
  companyId: number;
  companyName: string;
  streetAddress: string;
  deptAddress: string;
  postalCode: string;
  webUrl: string;
  telePhone: string;
  city: string;
  state: string;
  country: string;
  netPramoterScore: number;
  capabilities: string[];
  certificates: string[];
  isPremium: boolean;
  companyLogo: string;
  profileViewedDate: Date;
  isFollowing: boolean;
}


export interface IMQSViewModel {
  qmsContactId: number;
  supplierId: number;
  company: string;
  companynameWithSuppliername:string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  stateId: number;
  country: string;
  countryId: number;
  zipCode: string;
  isActive: boolean;
  createdDate: string;
  mqsContactIdEncrypt: string;
  stateName:string;
  countryName:string;
}



export interface IMQSFilterViewModel {
  supplierCompanyId : number;
  countryId: number;
  stateId: number;
  maxPageSize: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  filterBy: string;

}

export class ContactSalesActivityViewModel{
  supplierId: number;
  activityId: number;
  value: string;
  comment: string;
  scheduleDateTime: Date;
  emailComment: string;
  errorMessage: string;
  result: boolean;
}

export class TrackBasicSupplierLandsOnRFQDetailViewModel {
  contactId:number=0;
  rfqId:number=0;
}

export class BuyerCompanyFeedbackViewModel{
  fromCompanyId: number = 0;
  fromContactId: number = 0;
  toCompanyId: number = 0
  feedbackIds: number[] = [];
  feedbackDate: Date = null;
}

export class LikeUnlikeManufacturerRequestModel {
  buyerContactId: number ;
  supplierCompanyId: number;
  buyerEmail: string ;
  supplierEmail: string;
  isLike: boolean;
  buyerIpAddress: string
}
