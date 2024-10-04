export interface IAccountModel {
  contact_id: string;
  email: string;
  pwd: string;
  confirmPwd: string;
}
export interface ILoginAccountModel {
  Email: string;
  Password: string;
}
export interface IPostRegisterAccountModel {
  email: string;
  pwd: string;
}
export interface IForgotPasswordModel {
  Email: string;
}
export interface IEmailModel {
    externalEnquiries: number;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
    companyId: number;
    contactId: number;
    contactEmailId: string;
    messageSubject: string;
    messageBody: string;
    messageDate: Date;
    errorMessage: string;
    result: boolean;
    messageFileNames: string[];
}


export interface IResetPasswordModel {
  email: string;
  newpassword: string;
  confirmpassword: string;
}

export interface ILanguageModel {
  languageId: number;
  languageName: string;
  languageAbr: string;
  charset: string;
  localeCode: string;
  translated: boolean;
}

export interface IAddressModel {
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
  companyShippingSiteViewModelList: ICompanyShippingSiteViewModel [];
}
export interface ICompanyShippingSiteViewModel {
   siteId: number;
   compId: number;
   companyName: string;
   contId: number;
   addressId: number;
   siteLabel: string;
   defaultSite: boolean;
   siteCreationDate: string;
   addresses: IAddressModel;
}

export interface IProfileViewModel {
   contactId:  number;
   companyId:  number;
   languageId:  number;
   title:  string ;
   firstName:  string ;
   lastName:  string ;
   contactFunction:  string ;
   isBuyer: boolean;
   isAdmin: boolean;
   createdOn: string;
   modifiedOn:  string ;
   addressId:  number;
   recordOriginId:  number;
   incotermId:  number;
   comments:  string ;
   isNotifyByEmail: boolean;
   isMailInHtml: boolean;
   showDeltailedRating: boolean;
   showRfqAwardStat: boolean;
   userId:  string ;
   emailId:  string ;
   password:  string ;
   roleId:  number;
   isActive: boolean;
   errorMessage:  string ;
   result: boolean;
   phoneNo: string;
   linkedIn: string;
   tweeter: string;
   facebook: string;
   industry: string;
   industryId: number;
   employeeCountRangeId: number;
   description: string;
   name: string;
   dunsNumber: string;
   instagram: string;
}

export interface IContactViewModel {
   accountEmail: string;
   isLike: boolean;
   contactId?:  number;
   companyId:  number;
   contactIdEncrypt: string;
   languageId:  number;
   title:  string ;
   firstName:  string ;
   lastName:  string ;
   contactFunction:  string ;
   isBuyer: boolean;
   isAdmin: boolean;
   createdOn: string;
   modifiedOn:  string ;
   addressId:  number;
   recordOriginId:  number;
   incotermId:  number;
   comments:  string ;
   isNotifyByEmail: boolean;
   isMailInHtml: boolean;
   showDeltailedRating: boolean;
   showRfqAwardStat: boolean;
   userId:  string ;
   emailId:  string ;
   password:  string ;
   roleId:  number;
   isActive: boolean;
   errorMessage:  string ;
   result: boolean;
   phoneNo: string;
   linkedIn: string;
   tweeter: string;
   facebook: string;
   industryId: number;
   industry: string;
   token: string;
   contactPictureFile: string;
   logoOfCompany: string;
   language: ILanguageModel;
   address: IAddressModel;
   company: ICompanyModel;
   isVarified: boolean;
   expiration: Date;
   currentPassword: string;
   newPassword: string;
   isRFQCreated: boolean;
   grantType: string;
   refreshToken: string;
   googleImageUrl: string;
   website: string;
   isCompanyProfileFilled: boolean;
   isCapabilitiesFilled: boolean;
   npsScore: number;
   currentUserRole: string [];
   isLoginFromVision: boolean;
   originalLogoOfCompany: string;
   originalContactPictureFile: string;
   noOfStars: any;
   isVisionUserRequest:boolean;
   isDialFriendly?:any;
   preferredMethodOfCommunication?:any;
   companyFeedbacks?:any;
   buyerLocation?:string;
   communityCompanyProfileUrl?:string;
   profileDetailUrl?:string;
   isPublicProfileEnable?:boolean;
   isTestAccount?:boolean;
   userIpAddress?: string;
   instagram: string;
   accountType?:string;
   isEmailVerified?:any;
}

export interface IContactViewProfileModel {
  contactId:  number;
  companyId:  number;
  languageId:  number;
  title:  string ;
  firstName:  string ;
  lastName:  string ;
  contactFunction:  string ;
  isBuyer: boolean;
  isAdmin: boolean;
  createdOn: string;
  modifiedOn:  string ;
  addressId:  number;
  recordOriginId:  number;
  incotermId:  number;
  comments:  string ;
  isNotifyByEmail: boolean;
  isBuyerDashboard: boolean;
  isMailInHtml: boolean;
  showDeltailedRating: boolean;
  showRfqAwardStat: boolean;
  userId:  string ;
  emailId:  string ;
  password:  string ;
  roleId:  number;
  isActive: boolean;
  errorMessage:  string ;
  result: boolean;
  phoneNo: string;
  linkedIn: string;
  tweeter: string;
  facebook: string;
  industryId: number;
  industry: string;
  token: string;
  contactPictureFile: string;
  logoOfCompany: string;
  language: ILanguageModel;
  address: IAddressModel;
  company: ICompanyModel;
  isVarified: boolean;
  expiration: Date;
  currentPassword: string;
  newPassword: string;
  isRFQCreated: boolean;
  grantType: string;
  refreshToken: string;
  googleImageUrl: string;
  website: string;
  isCompanyProfileFilled: boolean;
  isCapabilitiesFilled: boolean;
  npsScore: number;
  currentUserRole: string [];
  preferredMethodOfCommunication?: string;
}


export interface ICompanyEditViewModel {
  contactId:  number;
  companyId:  number;
  countryId: number;
  stateId: any;
  streetAddress: string;
  deptAddress: string;
  postalCode: string;
  city: string;
  address5: string;
  phoneNo: string;
  linkedIn: string;
  tweeter: string;
  facebook: string;
  website: string;
  errorMessage:  string ;
  result: boolean;
}
export interface IRfqBuyerStatus {
  rfqBuyerstatusId: number;
  rfqBuyerstatusLiKey: string;
  description: string;
  position: number;
}

export interface IRFQViewModel {
  rfqId: number;
  rfqName: string;
  rfqDescription: string;
  contactId: number;
  rfqCreatedOn: string;
  rfqStatusId: number;
  isSpecialCertificationsByManufacturer: boolean;
  isSpecialInstructionToManufacturer: boolean;
  specialInstructionToManufacturer: string;
  importancePrice: number;
  importanceSpeed: number;
  importanceQuality: number;
  quotesNeededBy: string;
  awardDate: string;
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
  certificateIdList: number [];
  isActive: boolean;
  isUpdatedFromVision: boolean;
}

export interface ICompanyModel {
   companyId: number;
   name: string;
   description: string;
   dunsNumber: string;
   employeeCountRangeId: number;
   isActive: boolean;
   salesStatusId: number;
   companyToleranceId: number;
   errorMessage: string;
   companylogo: string;
   services: string;
   employeeCountRange: string;
   _3dTourUrl: string;
   supplierType: string;
   supplierTypeId: number;
  // selected: boolean;
  // ndaStatus: string;
 //  phoneNumber: string;
 //  ndaAcceptedDate: Date;
// contactId: number;

  //  companyId	integer($int32)
  //  name	string
  //  description	string
  //  dunsNumber	string
  //  employeeCountRangeId	integer($int32)
  //  isActive	boolean
  //  salesStatusId	integer($int32)
  //  companyToleranceId	integer($int32)
  //  errorMessage	string
  //  companylogo	string
  //  services	string


}
export interface I3dTourViewModel {
  company3dtourId: number;
  companyId: number;
  _3dTourUrl: string;
  title: string;
  description: string;
  isDeleted: boolean;
  errorMessage: string;
  result: boolean;
}

export interface IVideoModel {
  id?: number,
  contactId: number,
  title: string,
  videoLink: string,
  description: string,
  companyId: number,
}

export interface IResetPasswordModel {
  email: string;
  newpassword: string;
  confirmpassword: string;
}

export interface INewUserModel {
  token: string;
  errorMessage: string;
  contactViewModel: IContactViewModel;
  result: boolean;
  isCapabilitiesFilled: boolean;
  isCompanyProfileFilled: boolean;
  applicableRoles: string[ ];
  accountType: string;
  isMqsEnabled:boolean;
  manufacturingLocation: string;
}

export interface ILoginNewUserModel {
  token: string;
  errorMessage: string;
  contactId: number;
  user: Iuser;
  result: boolean;
  isRFQCreated: boolean;
  isBuyer: boolean;
  isBuyerDashboard: boolean;
  isCapabilitiesFilled: boolean;
  isCompanyProfileFilled: boolean;
  applicableRoles: string[ ];
  isPremium: boolean;
  contactIdEncrypt: string;
  accountType: string;
  isMqsEnabled:boolean;
  manufacturingLocation: string;
  refreshToken?:string;
}

export interface Iuser {
   firstName: string;
   lastName: string;
   importedCont_id: number;
   id: string;
   userName: string;
   normalizedUserName: string;
   email: string;
   normalizedEmail: string;
   emailConfirmed: boolean;
   passwordHash: string;
   securityStamp: string;
   concurrencyStamp: string;
   phoneNumber: string;
   phoneNumberConfirmed: boolean;
   twoFactorEnabled: boolean;
   lockoutEnd: string;
   lockoutEnabled: boolean;
   accessFailedCount: number;
}

export interface IViewProfileFilterViewModel {
 contactId: number ;
 companyId: number;
 fromDate: any;
 toDate: any;
 pageSize: number;
 pageNumber: number;
//  AllRanges: string;
}
export interface IAdminUserViewModel {
  adminUserId: number;
  contactId: number;
  userPhone: string;
  title: string;
  isSalesManager: boolean;
  isProdManager: boolean;
  isForBuyer: boolean;
  isForSupplier: boolean;
  parentAdminUserId: number;
  isActive: boolean;
  creationDate: Date;
  modificationDate: Date;
  id: string;
  errorMessage: string;
  result: boolean;
  isBuyer: boolean;
  emailId: string;
  password: string;
  firstName: string;
  lastName: string;
  aspNetUserRoleIds: string[ ];
  aspNetUserRoleNames: string;
  role: string;
  permission: string;
  status: string;
  contactIdEncrypt:string;
}


// tslint:disable-next-line:no-empty-interface
export interface IRegUserInviteModel {
firstName: string;
lastName: string;
password: string;
confirmPassword: string;
phoneNo: string;
email: string;
address: IAddressModel;
}


export interface IInviteUserContactViewModel {
  contactId:  number;
  companyId:  number;
  languageId:  number;
  title:  string ;
  firstName:  string ;
  lastName:  string ;
  contactFunction:  string ;
  isBuyer: boolean;
  isSupplier: boolean;
  isAdmin: boolean;
  createdOn: string;
  modifiedOn:  string ;
  addressId:  number;
  recordOriginId:  number;
  incotermId:  number;
  comments:  string ;
  isNotifyByEmail: boolean;
  isBuyerDashboard: boolean;
  isMailInHtml: boolean;
  showDeltailedRating: boolean;
  showRfqAwardStat: boolean;
  userId:  string ;
  emailId:  string ;
  password:  string ;
  roleId:  number;
  isActive: boolean;
  errorMessage:  string ;
  result: boolean;
  phoneNo: string;
  linkedIn: string;
  tweeter: string;
  facebook: string;
  industryId: number;
  industry: string;
  token: string;
  contactPictureFile: string;
  logoOfCompany: string;
  language: ILanguageModel;
  address: IAddressModel;
  company: ICompanyModel;
  isVarified: boolean;
  expiration: Date;
  currentPassword: string;
  newPassword: string;
  isRFQCreated: boolean;
  grantType: string;
  refreshToken: string;
  googleImageUrl: string;
  website: string;
  isCompanyProfileFilled: boolean;
  isCapabilitiesFilled: boolean;
  npsScore: number;
  currentUserRole: string [];
  userIpAddress: string;
}
export interface IViewProfileGetPriceAwardPatterView {
companyId: number;
  days: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}

export interface EncryptedContactViewModel {
 id: string;
 loggedInId: number;
}
export interface DicoverIdForRfq {
  id: number;
  Name: string;
}
export interface SubscriptionReceiptViewModel {
    companyId: number;
    contactId: number;
    companyName: string;
    contactName: string;
    contactTitle: string;
    phone: string;
    fax: string;
    streetAddress: string;
    email: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    geographies: string;
    startDate: Date;
    renewalDate: Date;
    numberOfUsers: number;
    categories: string [];
    membershipTotal: number;
    salesTax: number;
    totalUSD: number;
    upFrontPayment: number;
    paymentDate: Date;
    invoiceNo: string;
    referanceNo: string;
    amount: number;
    status: string;
    result: boolean;
    errorMessage: string;
    count: number;
    agreementNumber: string;
    customerRepresentative: string;
}



