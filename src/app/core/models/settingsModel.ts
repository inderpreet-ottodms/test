export interface ISettingsNotificationModel {
    contactId: number;
    isNotifyByEmail: boolean;
    awardConfirmations: string;
    newMessages: string;
    newQuotes: string;
    ndAsToApprove: string;
    orderStatusUpdates: string;
    ratingsToPerformReceived: string;
    isSendDailySummary: boolean;
    isSystemMaintenanceAnnouncements: boolean;
    isNewsletter: boolean;
    isSpecialInvitations: boolean;
    isSendNotificationsAsHTML: boolean;
    errorMessage: string;
    result: boolean;
}

export interface INDAViewModel {
  contactId: number;
  ndaLevel: number;
  ndaFile: string;
  ndaContent: string;
  errorMessage: string;
  result: boolean;
  fileId:	number;
  ndaId: number;
  companyId:	number;
  rfqId:	number;
  fileType:	string;
  isDefaultNDAdetails: boolean;
}
export interface IPreferrenceModel {
  contactId: Number;
  isBuyerDashboard: boolean;
  timeFormat: string;
  prereredLocationIds: string;
  paymentTermId: string;
  result: boolean;
  errorMessage: string;
  isbuyerPayshipping: boolean;
  prefRfqCommunicationMethod: number;
  companyRatingPreferencesEmailList?:any;
}

export interface IPreferredLocationModel {
  isUSManufacturing: boolean;
  isMexicoManufacturing: boolean;
  isCanadaManufacturing: boolean;
  isAsPacManufacturing: boolean;
  isEMEAManufacturing: boolean;
  isUsaCanadaManufacturing: boolean;
  isEarthAll: boolean;
  buyerDashboard: string;
}


export interface IPaymentTermModel {
   paymenOptionId: number;
   paymentOptionName: string;
}

export interface IFollowContactViewModel {
  contactId: number;
  companyIdList:	number[];
  errorMessage:	string;
  result: boolean;
  bookType: string;
  isFollow: boolean;
  rfqId: number;
}

export class DecimalPoint {
  qmsCurrencyDecimalId:number=0;
  qmsCurrencyDecimal: string='';
}

