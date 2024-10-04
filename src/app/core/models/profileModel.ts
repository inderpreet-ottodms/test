export interface IProfileInfoModel {
  personalProfileInfoModel: IPersonalProfileInfoModel;
  companyProfileInfoModel: ICompanyProfileInfoModel;
  communicationTypeModel: ICommunicationTypeModel[];
  result: boolean;
  message: string;
}

export interface IPersonalProfileInfoModel {
  contactId: number;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  languageId: number;
  languageName: '';
  phoneNumber: string;
  designation: string;
  contactAddressModel: IContactAddressModel;
  showDeltailedRating: boolean;
  showRfqAwardStat: boolean;
}
export interface ISourcingAdvisorModel {
  rfqId: number;
  companyId: number;
  sourcingAdvisorId: number;
  userPhone: string;
  title: string;
  email: string;
  firstName: string;
  lastName: string;
  errorMessage: string;
  result: boolean;
}

export interface IContactAddressModel {
  addressId: number;
  countryId: number;
  countryName: string;
  regionId: number;
  regionName: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
}

export interface ICompanyProfileInfoModel {
  companyId: number;
  companyName: string;
  dunsNumber: string;
  industryTypeId: number;
  rangeId: number;
  description: string;
  linkedinProfile: string;
  twitterProfile: string;
  facebookProfile: string;
}

export interface ICommunicationTypeModel {
  contactTypeId: number;
  communicationValue: string;
}


export interface IProfileAddressModel {
  mailingAddressesModel: IMailingAddressesModel;
  shippingAddressesModel: IShippingAddressesModel;
  companyShippingSiteModel: ICompanyShippingSiteModel;
  addressType: number;
}

export interface IProfileAddressDataModel {
  mailingAddressesModel: IMailingAddressesModel[];
  shippingAddressesModel: IShippingAddressesModel[];
  companyShippingSiteModel: ICompanyShippingSiteModel[];
  adddressType: number;
  result: boolean;
  message: string;
}

export interface IMailingAddressesModel {
  contactId: number;
  addressId: number;
  streetAddress: string;
  deptAddress: string;
  city: string;
  state: string;
  postalCode: string;
  stateId: number;
}

export interface IShippingAddressesModel {
  contactId: number;
  companyId: number;
  addressId: number;
  companyName: string;
  streetAddress: string;
  deptAddress: string;
  city: string;
  state: string;
  postalCode: string;
  isDefaultSite: boolean;
  siteId: number;
  stateId: number;
}



export interface ICompanyShippingSiteModel {
  siteId: number;
  compId: number;
  contId: number;
  addressId: number;
  siteLabel: string;
  defaultSite: boolean;

}

export interface IInviteUserViewModel {
  fromContactId: number;
  companyId: number;
  fromUserEmail: string;
  message: string;
  toEmail: string;
  isBuyer: boolean;
  isSupplier: boolean;
  IsAdmin: boolean;
  firstName: string;
  lastName: string;
  errorMessage: string;
  result: boolean;
  encryptedToken: string;
}
export interface IviewedProfileViewModel {
  viewProfileId: number;
  contactId: number;
  companyIdProfile: number;
  profileViewedDate: Date;
  contactIdProfile: number;
  errorMessage: string;
  result: boolean;
}

export interface ILeadUserViewModel {
  leadInteractionType: any;
  contactId: number;
  companyId: number;
  ipAddress: string;
  leadId: number;
  firstName : string;
  lastName : string;
  email: string;
  phoneNo: string;
  emailSubject: string;
  emailMessage: string;
  companyName: string;
  messageFileNames?: string[];
  isNdaRequired?: boolean;
  errorMessage: string;
  result: boolean;
  isVisionUser?: boolean;
}
export interface IRequestDemoLinkModel {
  supplierId: number;
  activityId: number;
  value: string;
  phoneNumber: string;
}

export interface ILeadsStreamFilterViewModel {
  companyId: number;
  leadsStreamFilter: string;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  errorMessage: string;
  interactionType: number;
  fromDate:	string;
  toDate:	string;
  result: boolean;
}

export interface ILeadsStreamModel {
  leadId: number;
  leadInteractionType: string;
  contactId: number;
  contactIdEncrypted: string;
  companyId: number;
  ipAddress: string;
  buyerName: string;
  companyName: string;
  interactionDate: string;
  interaction: string;
  errorMessage: string;
  result: boolean;
}

export interface ILeadStreamDashboardRollUpViewModel {
  companyId: number;
  uptoDays: number;
  pageSize: number;
  pageNumber: number;
  searchText: string;
  totalRecords: number;
  isOrderByDesc: boolean;
  orderBy: string;
  more_records: boolean;
  filterBy: string;
  interactionType: number;
  dateFrom:	string;
  dateTo:	string;
}
export interface IBasicManufacturerViewModel {
  capabilityId: number;
  overallPercentage: number;
  accountSetUpSteps: IAccountSetUpSteps[];
  isCompanyDescription: boolean;
  isCompanyLogo: boolean;
  isCompanyBanner: boolean;
  isCompanyCapabilities: boolean;
  isVisitMyRFQ: boolean;
  contactId: number;
  isCompanyAddress: boolean;
  isPublishProfile:boolean;
  isProfileComplete?: boolean
}
export interface IAccountSetUpSteps {
  id: number;
  status: boolean;
  steps: string;
  showBtn: boolean;
  showEdit: boolean;
  disabledBtn: boolean;
  helpText: string;
}

export class ProfileModel {
  companyId: number;
  contactId: number;
  companyDescription: string;
  companyProfileLogoFilename: string;
  companyProfileLogoUrl: string;
  companyBackgroundImageFilename: string;
  companyBackgroundImageUrl: string;
  address: {
    countryId: number;
    stateId: number;
    state: string;
    country: string;
    streetAddress: string;
    deptAddress: string;
    postalCode: string;
    city: string;
    address5: string;
  }
  result: boolean;
  errorMessage: string;
}

export class ILeadMessageDataViewModel {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phoneNo: string;
  contactId: number;
  totalRecords: number;
  defaultValue: number;
  isError: boolean;
  messages: string;
  statusCode: boolean;
}
