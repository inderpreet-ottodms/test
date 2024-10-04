import {
  Injectable
} from '@angular/core';
import {
  DataService, DataStatusService
} from '../data.service';
import {
  IAboutUsViewModel,
  IFocusOverViewModel,
  IProcessesViewModel,
  ISpecialFilesViewModel,
  IFocusOverViewModelEdit,
  IcompanyCertificateViewModel,
  IMyAccountViewModel,
  IManufacturerDashboardViewModel
} from '../../models/supplierProfileModel';
import {
  Observable
} from 'rxjs';
import {
  ICustomProcessViewModel,
  ISupplierRFQViewModel,
  ITempNPSDataModel,
  IRfqSupplierLikesViewModel,
  IRatingResponseViewModel,
  IRfqQuoteItemsViewModel,
  IRfqQuoteSupplierQuoteViewModel,
  ISupplierNdaAcceptedViewModel,
  IsupplierRfqFilterViewModel,
  TrackBuyerActivityOnDashboardViewModel
} from '../../models/rfqModel';
import {
  IMaterialViewModel
} from '../../models/globalMaster';
import {
  ICompanyModel,
  I3dTourViewModel,
  IVideoModel
} from '../../models/accountModel';
import {
  ISupplierDetailsViewModel,
  IManufacturerContactsViewModel,
  IManufacturerContactListViewModel,
  ISupplierFilterViewModel,
  ContactSalesActivityViewModel,
  TrackBasicSupplierLandsOnRFQDetailViewModel, BuyerCompanyFeedbackViewModel
} from '../../models/supplierModel';
import {
  IFollowContactViewModel
} from '../../models/settingsModel';
import { BrowserStorageUtil } from '../../../../app/shared/browser.storage.util';

@Injectable()
export class SupplierService {
  ipAddress: any;
  moduleUrl: string;
  data: any = {
    rfqId: 0
  };
  showOneTile: boolean;
  set(data: any, key: string) {
    this.data[key] = data;
  }

  get(key: string) {
    return this.data[key];
  }

  constructor(private _dataService: DataService,private _dataStatusService:DataStatusService) {}

  getAboutUsDetails(compId: number, contId: number, isBuyer: boolean, LoggedInId: number): Observable < any > {

    this.moduleUrl = 'Supplier/GetAboutUs?CompanyId=' + compId +
    '&IsBuyer=' + isBuyer + '&ContactId=' + contId + '&LoggedInId=' + LoggedInId;
    return this._dataService.getSingle(this.moduleUrl, '');
  }
  getVideosList(compId: number): Observable < any > {
    this.moduleUrl = 'Supplier/GetVideos?CompanyId=' + compId;
    return this._dataService.add(this.moduleUrl, '');
  }
  getCapabilities(companyId: number, isRfqSearchType: boolean): Observable < ICustomProcessViewModel[] > {
    this.moduleUrl = 'Supplier/GetSuppliersProcesses?CompanyId=' + companyId + '&isRfqSearchType=' + isRfqSearchType;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  getParentMaterialofCompany(companyId: number): Observable < IMaterialViewModel[] > {
    this.moduleUrl = 'Master/GetMaterialsData?CompanyId=' + companyId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  getFocusOverview(companyId: number): Observable < IFocusOverViewModel > {
    this.moduleUrl = 'Supplier/GetFocusOver?CompanyId=' + companyId;
    return this._dataService.getAll(this.moduleUrl, '');
  }


  getFocusOverviewByUrl(CompanyURL: string): Observable < IFocusOverViewModel > {
    this.moduleUrl = 'Public/GetFocusOver?CompanyURL=' + CompanyURL;
    return this._dataService.getAll(this.moduleUrl, '');
  }

  addSupplierEquipment(iAboutUsViewModel: IAboutUsViewModel): Observable < IAboutUsViewModel > {
    this.moduleUrl = 'Supplier/UpdateCompanyEquipments';
    return this._dataService.add(this.moduleUrl, iAboutUsViewModel);
  }
  UpdateFocusOverview(iProcessesViewModel: IFocusOverViewModelEdit): Observable < IFocusOverViewModelEdit > {
    this.moduleUrl = 'Supplier/UpdateFocusOverview';
    return this._dataService.add(this.moduleUrl, iProcessesViewModel);
  }

  updateSupplierCapability(iProcessesViewModel:any): Observable < IProcessesViewModel > {
    this.moduleUrl = 'Supplier/UpdateCapabilities';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iProcessesViewModel);
  }
  updateStripeCapabilities(iProcessesViewModel: IProcessesViewModel): Observable < IProcessesViewModel > {
    this.moduleUrl = 'Supplier/UpdateStripeCapabilities';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iProcessesViewModel);
  }

  addSpecialFile(iSpecialFilesViewModel: ISpecialFilesViewModel): Observable < any > {
    this.moduleUrl = 'Supplier/SetPhotos';
    return this._dataService.add(this.moduleUrl, iSpecialFilesViewModel);
  }

  editCompanyDescription(iCompanyViewModel: ICompanyModel): Observable < ICompanyModel > {
    this.moduleUrl = 'Supplier/EditCompanyDescription';
    return this._dataService.add(this.moduleUrl, iCompanyViewModel);
  }
  editCompany3DTourUrl(i3dTourViewModel: I3dTourViewModel[]): Observable < any > {
    this.moduleUrl = 'Supplier/EditCompany3DTourUrl';
    return this._dataService.add(this.moduleUrl, i3dTourViewModel);
  }

  setVideos(iVideoModel: IVideoModel[]): Observable < any > {
    this.moduleUrl = 'Supplier/SetVideos';
    return this._dataService.add(this.moduleUrl, iVideoModel);
  }

  insertCertificates(icompanyCertificateViewModel: IcompanyCertificateViewModel[]): Observable < IcompanyCertificateViewModel > {
    this.moduleUrl = 'Supplier/InsertCompanyCertificates';
    return this._dataService.add(this.moduleUrl, icompanyCertificateViewModel);
  }

  updateCompanyDemographics(iAboutUsViewModel: IAboutUsViewModel): Observable < IAboutUsViewModel > {
    this.moduleUrl = 'Supplier/UpdateCompanyDemographics';
    return this._dataService.add(this.moduleUrl, iAboutUsViewModel);
  }

  getSupplierRfq(isupplierRfqFilterViewModel: IsupplierRfqFilterViewModel): Observable < ISupplierRFQViewModel[] > {
    this.moduleUrl = 'RFQ/GetSupplierRFQList';
    return this._dataService.add(this.moduleUrl, isupplierRfqFilterViewModel);
  }
  GetBuyerRFQList(contactId: number, companyId: number, rfqType: number): Observable < ISupplierRFQViewModel[] > {
    this.moduleUrl = 'RFQ/GetBuyerRFQList?contactId=' + contactId + '&companyId=' + companyId + '&RfqType=' + rfqType;
    return this._dataService.getAll(this.moduleUrl, '');
  }

  getNPSRatings(contactId: number): Observable < ITempNPSDataModel > {
    this.moduleUrl = 'Rating/GetNPSDetail?ContactId=' + contactId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  getRatingStar(contactId: number): Observable < any > {
    this.moduleUrl = 'Rating/GetStarDetailsByCompanyId?CompanyId=' + contactId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  getNPSRatingsByCompanyId(CompanyId: number): Observable < ITempNPSDataModel > {
    this.moduleUrl = 'Rating/GetNPSDetailByCompanyId?CompanyId=' + CompanyId;
    return this._dataService.getAll(this.moduleUrl, '');
  }

  getNPSRatingsByCompanyUrl(CompanyURL: string): Observable < ITempNPSDataModel > {
    this.moduleUrl = 'Public/GetNPSDetailByCompanyUrl?CompanyURL=' + CompanyURL;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  GetNPSResponses(CompanyId: number): Observable < any > {
    this.moduleUrl = 'Rating/GetNPSResponsesByCompanyId?CompanyId=' + CompanyId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  GetNPSResponsesByCompanyUrl(CompanyURL: string): Observable < any > {
    this.moduleUrl = 'Public/GetNPSResponsesByCompanyUrl?CompanyURL=' + CompanyURL;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  rfqLikeOrDislike(iRfqSupplierLikesViewModel: IRfqSupplierLikesViewModel): Observable < IRfqSupplierLikesViewModel > {
    this.moduleUrl = 'RFQ/SetSupplierRFQLike';
    return this._dataService.add(this.moduleUrl, iRfqSupplierLikesViewModel);
  }

  SetNPSReply(iRatingResponseViewModel: IRatingResponseViewModel): Observable < any > {
    this.moduleUrl = 'Rating/SetNPSReply';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iRatingResponseViewModel);
  }
  
 GrowthPackageUnlockRFQsInfo(data): Observable < any > {
    this.moduleUrl = 'GrowthPackage/SetGrowthPackageUnlockRFQsInfo';
    return this._dataService.add(this.moduleUrl, data);
  }

  StripeCustomerInfo(dataCustomer): Observable < any > {
    this.moduleUrl = 'StripeCustomerPortal';
    return this._dataService.add(this.moduleUrl, dataCustomer);
  }

  RemoveCertificatesforCompany(companyId: number, certificateId: number): Observable < IRfqSupplierLikesViewModel > {
    this.moduleUrl = 'Supplier/RemoveCertificatesforCompany?CompanyId=' + companyId + '&CertificateId=' + certificateId;
    return this._dataService.deletePost(this.moduleUrl, '');
  }
  addQuoting(iRfqQuoteItemsViewModelColl: IRfqQuoteItemsViewModel[]): Observable < IRfqQuoteItemsViewModel > {
    this.moduleUrl = 'Supplier/SetRFQPartQuantity';
    return this._dataService.add(this.moduleUrl, iRfqQuoteItemsViewModelColl);
  }
  GetSupplierRFQQuoteDetails(rfqId: number, contactId: number, IsRfqResubmitted: any, rfqPartId: number = 0): Observable < IRfqQuoteSupplierQuoteViewModel > {
    this.moduleUrl = 'RFQ/GetSupplierRFQQuoteDetails?RfqId=' + rfqId + '&contactId=' + contactId + '&IsRfqResubmitted=' + IsRfqResubmitted + '&RfqPartId=' + rfqPartId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  // tslint:disable-next-line:max-line-length
  SetSupplierRFQQuoteDetails(iRfqQuoteSupplierQuoteViewModel: IRfqQuoteSupplierQuoteViewModel): Observable < IRfqQuoteSupplierQuoteViewModel > {
    this.moduleUrl = 'RFQ/SetSupplierRFQQuoteDetails';
    return this._dataService.add(this.moduleUrl, iRfqQuoteSupplierQuoteViewModel);
  }
  ndaAccepted(iSupplierNdaAcceptedViewModel: ISupplierNdaAcceptedViewModel): Observable < ISupplierNdaAcceptedViewModel > {
    this.moduleUrl = 'Supplier/SetNDAAgreementAccept';
    return this._dataService.add(this.moduleUrl, iSupplierNdaAcceptedViewModel);
  }
  getManufactureList(iSupplierFilterViewModel: ISupplierFilterViewModel): Observable < ISupplierDetailsViewModel > {
    this.moduleUrl = 'Buyer/GetSupplierDetailsListNew';
    return this._dataService.add(this.moduleUrl, iSupplierFilterViewModel);
  }
  setFollowBlacklistContact(iFollowContactViewModel: IFollowContactViewModel): Observable < IFollowContactViewModel > {
    this.moduleUrl = 'Contact/SetFollowBlackListContact';
    return this._dataService.add(this.moduleUrl, iFollowContactViewModel);
  }
  GetRFQPartQuantity(quoteId: number, rfqId: number): Observable < ISupplierDetailsViewModel > {
    this.moduleUrl = 'Supplier/GetRFQPartQuantity?RfqQuoteSupplierQuoteId=' + quoteId + '&RfqPartId=' + rfqId;
    return this._dataService.getAll(this.moduleUrl);
  }

  getManufacturerContactsList(iManufacturerContactListViewModel: IManufacturerContactListViewModel): Observable < IManufacturerContactListViewModel > {
    this.moduleUrl = 'Contact/ManufacturerContactsList';
    return this._dataService.add(this.moduleUrl,iManufacturerContactListViewModel);
  }
  getMagicLeadList(companyId: number, contactId: number): Observable < IManufacturerContactsViewModel > {
    this.moduleUrl = 'MagicLead/GetMagicLeadByCompany?SupplierCompanyId=' + companyId + '&LoggedInId=' + contactId;
    return this._dataService.getAll(this.moduleUrl);
  }
  removeManufacturerContacts(companyId: number, bookId: number): Observable < IManufacturerContactsViewModel > {
    this.moduleUrl = 'Contact/RemoveManufacturerContacts?CompanyId=' + companyId + '&bookId=' + bookId;
    return this._dataService.deletePost(this.moduleUrl, '');
  }

  // tslint:disable-next-line:max-line-length
  SetRFQQuoteSupplierStatus(rfqId: number, contactId: number, IsMarkforQuoting: boolean, IsDeleted: boolean): Observable < ISupplierNdaAcceptedViewModel > {
    this.moduleUrl = 'Supplier/SetRFQQuoteSupplierStatus?RfqId=' + rfqId + '&ContactId=' + contactId +
    '&IsMarkforQuoting=' + IsMarkforQuoting + '&IsDeleted=' + IsDeleted;
    return this._dataService.add(this.moduleUrl, '');
  }

  AddNPSResponse(iRatingResponseViewModel: IRatingResponseViewModel): Observable < any > {
    this.moduleUrl = 'Rating/AddNPSResponse';
    return this._dataService.add(this.moduleUrl, iRatingResponseViewModel);
  }

  AddAnyTimeNPSResponse(iRatingResponseViewModel: IRatingResponseViewModel): Observable < any > {
    this.moduleUrl = 'Rating/AddAnyTimeNPSResponse';
    return this._dataService.add(this.moduleUrl, iRatingResponseViewModel);
  }
  getSupplierAccount(companyId: number): Observable < any > {
    this.moduleUrl = 'Supplier/GetSupplierAccount?CompanyId=' + companyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  setSupplierUpgraderequest(iMyAccountViewModel: IMyAccountViewModel): Observable < any > {
    this.moduleUrl = 'Supplier/SetSupplierUpgraderequest';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iMyAccountViewModel);
  }
  getSupplierRFQCount(isupplierRfqFilterViewModel: IsupplierRfqFilterViewModel): Observable < any > {
    this.moduleUrl = 'RFQ/GetSupplierRFQCount';
    return this._dataService.add(this.moduleUrl, isupplierRfqFilterViewModel);
  }
  getSupplierAwardedParts(rfqId, contactId): Observable < any > {
    this.moduleUrl = 'Supplier/GetSupplierAwardedParts?SupplierContactId=' + contactId + '&RfqId=' + rfqId;
    return this._dataService.add(this.moduleUrl, '');
  }
  deleteVideos(videoLinkId): Observable < any > {
    this.moduleUrl = 'Supplier/DeleteVideos?videoLinkId=' + videoLinkId;
    return this._dataService.add(this.moduleUrl, '');
  }
  delete3DTour(company3dTourId): Observable < any > {
    this.moduleUrl = 'Supplier/Delete3DTour?company3dTourId=' + company3dTourId;
    return this._dataService.add(this.moduleUrl, '');
  }

  getPastBillStatus(companyId: number): Observable < any > {
    this.moduleUrl = 'Supplier/GetPastDueBillBannerMessage?CompanyId=' + companyId;
    return this._dataService.getAll(this.moduleUrl);
  }


  ClosePastDueBillBanner(companyId: number): Observable < any > {
    this.moduleUrl = 'Supplier/ClosePastDueBillBanner?companyId=' + companyId;
    return this._dataService.add(this.moduleUrl, '');
  }

  setProfileDashBoard(iProfileSetModel: any): Observable < any > {
    this.moduleUrl = 'BasicManufacturer';
    return this._dataService.add(this.moduleUrl, iProfileSetModel);
  }
  deleteProfileDashBoard(iProfileSetModel: IManufacturerDashboardViewModel): Observable < any > {
    this.moduleUrl = 'BasicManufacturer/DeleteQmsGuide';
    return this._dataService.add(this.moduleUrl, iProfileSetModel);
  }

  setPhotoSequence(photoId: any): Observable < any > {
    this.moduleUrl = 'SupplierProfileOrganizePhotoOrder';
    return this._dataService.add(this.moduleUrl, photoId);
  }
  getSubscriptionPlanExists(loggedInId: number): Observable < any > {
    this.moduleUrl = 'BillingInfoActiveSubscriptionPlan?companyId=' + loggedInId;
    return this._dataService.getAll(this.moduleUrl);
  }
  buyerActivityOnDashboard(trackBuyerActivityOnDashboardViewModel: TrackBuyerActivityOnDashboardViewModel): Observable < any > {
    this.moduleUrl = 'BuyerActivityOnDashboard';
    return this._dataService.add(this.moduleUrl, trackBuyerActivityOnDashboardViewModel);
  }

  getBillingInfoActiveSubscriptionPlan(obj: any): Observable < any > {
    this.moduleUrl = 'BillingInfoActiveSubscriptionPlan';
    return this._dataService.add(this.moduleUrl, obj);
  }

  getBillingInfoSubscriptionInvoices(obj: any): Observable < any > {
    this.moduleUrl = 'BillingInfoSubscriptionInvoices';
    return this._dataService.add(this.moduleUrl, obj);
  }
  /*  Author: Kamlesh Ganar */
  getNextInvoicePaymentDate(supplierId: string): Observable < any > {
    this.moduleUrl = 'UpcomingInvoice?supplierId=' + supplierId;
    return this._dataService.getAll(this.moduleUrl);
  }

  setSupplierCancelRequest(iMyAccountViewModel: IMyAccountViewModel): Observable < any > {
    this.moduleUrl = 'Supplier/SetSupplierCancelRequest';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iMyAccountViewModel);
  }
  getContactSaleDetails(): Observable < any > {
    this.moduleUrl = 'ContactSalesModel?qId=0';
    return this._dataService.getAll(this.moduleUrl);
  }
  sendContactSaleDetails(contactSalesActivityViewModel: ContactSalesActivityViewModel): Observable < any > {
    this.moduleUrl = 'ContactSalesActivity';
    return this._dataService.add(this.moduleUrl, contactSalesActivityViewModel);
  }
  getSuppliersSubscriptionProcesses(loggedInCompanyId: number): Observable < any > {
    this.moduleUrl = 'Supplier/GetSuppliersSubscriptionProcesses?companyId=' + loggedInCompanyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  // Bug Fix Prod
  getGetParentCapability(loggedInCompanyId: number): Observable < any > {
    this.moduleUrl = 'Supplier/GetParentCapabilityDetail?companyId=' + loggedInCompanyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  getMsBookingUrl(supplierId): Observable < any > {
    this.moduleUrl = 'MSBookingsUrl?supplierId=' + supplierId;
    return this._dataService.getAll(this.moduleUrl);
  }

  setNdaAccept(messageSupplierNdaAcceptedViewModel: any,): Observable < any > {
    this.moduleUrl = 'supplier/SetMessageNDAAgreementAccept';
    return this._dataService.add(this.moduleUrl,messageSupplierNdaAcceptedViewModel);
  }

  trackBasicSupplierLandsOnRFQDetail(trackBasicSupplierLandsOnRFQDetailViewModel:TrackBasicSupplierLandsOnRFQDetailViewModel):Observable<any> {
    this.moduleUrl = 'TrackBasicSupplierLandsOnRFQDetail';
    return this._dataService.add(this.moduleUrl,trackBasicSupplierLandsOnRFQDetailViewModel);
  }

  getSupplierMyCompanyRfqSupplierList(loggedInCompanyId: number): Observable < any > {
    this.moduleUrl = 'SupplierMyCompanyRfqSupplierList?companyId=' + loggedInCompanyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  getManufacturerMyCompanyQuotesList(isupplierRfqFilterViewModel: IsupplierRfqFilterViewModel): Observable < ISupplierRFQViewModel[] > {
    this.moduleUrl = 'GetManufacturerMyCompanyQuotesList';
    return this._dataService.add(this.moduleUrl, isupplierRfqFilterViewModel);
  }
  getNewIconStatus(loggedInCompanyId: number): Observable < any > {
    this.moduleUrl = 'MagicLeadNewIcon?companyId=' + loggedInCompanyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  setNewIconStatus(loggedInCompanyId: number): Observable < any > {
    this.moduleUrl = 'MagicLeadNewIcon?companyId=' + loggedInCompanyId;
    return this._dataService.add(this.moduleUrl,'');
  }

  getSupplierMyCompanyRFQList(isupplierRfqFilterViewModel: IsupplierRfqFilterViewModel): Observable < ISupplierRFQViewModel[] > {
    this.moduleUrl = 'SupplierMyCompanyRFQ';
    return this._dataService.add(this.moduleUrl, isupplierRfqFilterViewModel);
  }

  getBuyerSetFeedback(companyId: number, loggedId: number): Observable < any > {
    this.moduleUrl = 'BuyerCompanyFeedback?fromContactId=' + loggedId+'&toCompanyId='+companyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  setBuyerFeedback(feedbackModel: BuyerCompanyFeedbackViewModel): Observable < any > {
    this.moduleUrl = 'BuyerCompanyFeedback';
    return this._dataService.add(this.moduleUrl,feedbackModel);
  }

  //claim apis

  validateCommunityUser(token:any): Observable < any > {
    this.moduleUrl = 'Supplier/ValidateCommunityUser?token='+token;
    return this._dataStatusService.getAll(this.moduleUrl);
  }

  UserRegistration(userInfo: any): Observable < any > {
    // userInfo.userIpAddress = this.ipAddress;
    this.moduleUrl = 'UserRegistration';
    return this._dataStatusService.add(this.moduleUrl,userInfo);
  }


  GetUnregisteredSupplierSolrDetails(source: any): Observable < any > {
    this.moduleUrl = 'Supplier/GetUnregisteredSupplierSolrDetails?token='+source;
    return this._dataStatusService.add(this.moduleUrl,'');
  }

  getAuthentication(token:any,source:any): Observable < any > {
    this.moduleUrl = 'Account/Authenticate?token=' + token + '&source=' +source;
    return this._dataStatusService.getAll(this.moduleUrl);
  }
  getPaymentTerms(): Observable < any > {
    this.moduleUrl = 'RFQSupplierQuotePaymentTerm';
    return this._dataService.getAll(this.moduleUrl);
  }

  getSupplierPublishProfileStatus(companyId:number): Observable < any > {
    this.moduleUrl = 'SupplierPublishProfileStatus?companyId=' +companyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  setSupplierPublishProfileStatus(obj): Observable < any > {
    this.moduleUrl = 'SupplierPublishProfileStatus';
    return this._dataService.add(this.moduleUrl,obj);
  }
  search(term:string): Observable < any > {
    this.moduleUrl = 'Contact/GetAddressLookUpData?Address=' +term;
    return this._dataService.add(this.moduleUrl,'');
  }
  // growth package get api for tile

  getTileAvailability(contactId: number, companyId: number): Observable < any > {
    this.moduleUrl = 'GrowthPackage/GetSupplierPackageInfo?contactId=' + contactId+'&companyId='+companyId;
    return this._dataService.getAll(this.moduleUrl);
  }
  getChurnkeyCredentials(subscriptionCustomerId) {
    return  this._dataService.getAll("Churnkey/GetChurnkeyCredentials?subscriptionCustomerId=" + subscriptionCustomerId)
  }
  resumeCanceledSubscrition(data){
    return this._dataService.add("StripeSubscriptionCancellation",data);
  }
  loadAllActiveRFQForSupplier() {
    let data={
      "supplierCompanyId": BrowserStorageUtil.getCommpanyId(),
      "savedSearchId": 0,
      "contactId": BrowserStorageUtil.getLoogedUserId()};
      return this._dataService.add("AdvanceSearch",data);
    }

    SupplierQuotedRFQ(): Observable <any> {
      let data = {
        "contactId":BrowserStorageUtil.getLoogedUserId(),
        "supplierCompanyId": JSON.parse(BrowserStorageUtil.getCommpanyId())
      }
      return this._dataService.add("SupplierQuotedRFQ", data);
    }
}
