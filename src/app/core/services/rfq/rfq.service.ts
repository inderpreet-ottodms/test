import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';
import { Http, Headers } from "@angular/http";
import {
  IRFQViewModel,
  IPartsViewModel,
  IManufacturersViewModel,
  IManufactureGroupList,
  ICustomProcessViewModel,
  IMessagesViewModel,
  IRfqNDAViewModel,
  IRFQRevisionModel,
  IGetCustomNDAFilesModel,
  IRFQPartQuantityQuote,
  ISavedSearchViewModel,
  SupplierDashListModel,
  IMessageListViewModel,
  IBuyerQuotesViewModel,
  IDeleteQuoteModel,
  PdfModel,
  DownloadAllFilesViewModel,
  DistributionPostModel,
  IBuyerFilteredRfqViewModel,
  SubscriptionReceiptPdfViewModel,
  CloneRfqViewModel,
  CreateNewRFQMessagesViewModel,
  RFQMessageAssociationViewModel,
  DownloadQuotesToExcelViewModel,
  IFeedbackBuyerViewModel,
  IFeedbackSaveViewModel,
  BuyerMyQuotesRequestViewModel,
  AwardingModelQuoteDetailsRequestViewModel,
  SupplierChildProcessViewModel,
  BuyerChildProcessViewModel,
  DistributionChildAccountsViewModel,
  MaterialsRequestViewModel,
  PostProductionProcessRequestViewModel,
  BuyerRfqSourcedInfoFilterRequest,
  MessageReadUnreadViewModel,
  ArchiveUnArchiveMessagesViewModelList,
  IUpdateRFQViewModel,
} from "../../models/rfqModel";

import { INDAViewModel } from "../../models/settingsModel";
import {
  IMaterialViewModel,
  IPostProductionViewModel,
  IBuyerListByCompanyIdModel,
} from "../../models/globalMaster";
import { DataService } from "../data.service";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { IQMSQuoteReceiptPDFViewModel } from "../../models/qmsModel";
import * as CryptoJS from 'crypto-js';
import {
  RFQFilter,
  SavedSearchDefaultFilterViewModel,
} from "../../../component/rfq/_filter/rfq-filter/rfqFilterModel";
import { ProfileModel } from "../../models/profileModel";
import { AppUtil } from "../../../../app/app.util";
import { Router } from "@angular/router";

@Injectable()
export class RfqService {
  moduleUrl: string;
  isWarningShown: boolean;
  private retryLimit = 1;


  data: any = {
    rfqId: 0,
  };

  set(data: any, key: string) {
    this.data[key] = data;
  }

  get(key: string) {
    return this.data[key];
  }
  private rfqForm2Enabled:boolean;
  // tslint:disable-next-line:member-ordering
  private currentOpenRfqId = new Subject<any>();
  // tslint:disable-next-line:member-ordering
  private cuOpenPLibId = new Subject<any>();
  // tslint:disable-next-line:member-ordering
  private isQuoteNowClicked = new Subject<any>();
  // tslint:disable-next-line:member-ordering
  private isCurrentRfqLoaded = new Subject<any>();
  // tslint:disable-next-line:member-ordering
  private isSupplierMessageThread = new Subject<any>();
  // tslint:disable-next-line:member-ordering
  private isBuyerNameClicked = new Subject<any>();
  private is3DTourDelete = new Subject<any>();
  private is3DTourDelete1 = new Subject<any>();
  private isCloneClick = new Subject<any>();
  private isCloneEditClick = new Subject<any>();
  private isRedirect = new Subject<any>();
  private rfqAwardEvent = new BehaviorSubject<boolean>(false);
  public contactModel = new BehaviorSubject<any>(null);
  public companyname = new BehaviorSubject<string>("");
  // isInValidBuyerWarningShown: boolean = false;
  private _isMsgRefreshListsubject = new Subject<any>();
  public stringSubject = new Subject<string>();
  constructor(
    private http: Http,
    private _dataService: DataService,
    private _httpClient: HttpClient,
    private _toastr: ToastrService,
    private router: Router
  ) {
    this.isWarningShown = false;
  }

  newEvent(event) {
    this._isMsgRefreshListsubject.next(event);
  }
  get events$() {
    return this._isMsgRefreshListsubject.asObservable();
  }
  setRfqAwardEvent(flag: any) {
    this.rfqAwardEvent.next(flag);
  }

  getRfqAwardEvent(): Observable<any> {
    return this.rfqAwardEvent.asObservable();
  }
  SaveFeedbackBuyer(
    iFeedbackSaveViewModel: IFeedbackSaveViewModel
  ): Observable<IFeedbackSaveViewModel> {
    this.moduleUrl = "RFQQuoteFeedbackBuyer";
    return this._dataService.add(this.moduleUrl, iFeedbackSaveViewModel);
  }
  getQuoteFeedbackBuyer(): Observable<IFeedbackBuyerViewModel> {
    this.moduleUrl = "Master/GetQuoteFeedbackBuyer";
    return this._dataService.getAll(this.moduleUrl, "");
  }
  addRFQDetails(rfqModel: IRFQViewModel): Observable<IRFQViewModel> {
    this.moduleUrl = "RFQ";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }
  AddRFQExtraDetails(rfqModel: IRFQViewModel): Observable<IRFQViewModel> {
    this.moduleUrl = "RFQ/UpdateRFQDetails";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }
  UpdateRFQNDA(rfqModel: IUpdateRFQViewModel): Observable<IRFQViewModel> {
    this.moduleUrl = "RFQ/UpdateRFQNDA";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }
  getRFQExtraDetails(
    rfqId: number,
    supplierContactId: number,
    rfqGuid: string
  ): Observable<IRFQViewModel> {
    this.moduleUrl =
      "RFQ/ShowRFQDetails?rfqId=" +
      rfqId +
      "&supplierContactId=" +
      supplierContactId +
      "&rfqGuid=" +
      rfqGuid;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  AddCustomNDAToRFQ(ndaViewModel: INDAViewModel): Observable<INDAViewModel> {
    this.moduleUrl = "RFQ/InsertCustomNDAFiles";
    return this._dataService.add(this.moduleUrl, ndaViewModel);
  }

  GetCustomNDAToRFQ(rfqId: number): Observable<INDAViewModel> {
    this.moduleUrl = "RFQ/GetCustomNDAFiles?rfqId=";
    return this._dataService.getSingle(this.moduleUrl, rfqId);
  }
  removeCustomNDAfromRFQ(
    ndaFileName: string,
    contactID: number,
    rfqID: number
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/RemoveCustomNDAFiles?FileName=" +
      ndaFileName +
      "&ContactId=" +
      contactID +
      "&RfqId=" +
      rfqID;
    return this._dataService.add(this.moduleUrl, "");
  }
  addPart(rfqModel: IPartsViewModel): Observable<IPartsViewModel> {
    this.moduleUrl = "RFQ/InsertPartDetails";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }
  addPartToRFQ(rfqModel: IPartsViewModel): Observable<IPartsViewModel> {
    this.moduleUrl = "RFQ/AddPartFromPartLibrary";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }

  uploadFile(data: any): Observable<any> {
    this.moduleUrl = "Upload/UploadFileNDA";
    return this._dataService.add(this.moduleUrl, data);
  }

  uploadFileViaURL(fileUrl: string): Observable<any> {
    this.moduleUrl = "Upload/GetFileURL?filename=" + fileUrl;
    return this._dataService.add(this.moduleUrl, "");
  }

  deletePart(id: any): Observable<IPartsViewModel> {
    this.moduleUrl = "RFQ/RemoveRFQPartFile?RfqPartId=";
    return this._dataService.delete(this.moduleUrl, id);
  }

  moveToPart(partModel: IPartsViewModel): Observable<IPartsViewModel> {
    this.moduleUrl = "RFQ/MoveToRFQPartFile";
    return this._dataService.add(this.moduleUrl, partModel);
  }

  getRfqParts(id: any): Observable<IPartsViewModel[]> {
    this.moduleUrl = "RFQ/GetPartsByRfqId?RfqId=";
    return this._dataService.getAll(this.moduleUrl, id);
  }
  getRfq(id: any, rfqtype: any): Observable<any> {
    this.moduleUrl =
      "RFQ/GetFilteredRFQList?contactId=" + id + "&RfqType=" + rfqtype;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getRfqList(
    iBuyerFilteredRfqViewModel: IBuyerFilteredRfqViewModel
  ): Observable<any> {
    this.moduleUrl = "RFQ/GetFilteredRFQListNew";
    return this._dataService.add(this.moduleUrl, iBuyerFilteredRfqViewModel);
  }

  addPartDetails(partsModel: IPartsViewModel): Observable<IPartsViewModel> {
    this.moduleUrl = "RFQ/InsertPartDetails";
    return this._dataService.add(this.moduleUrl, partsModel);
  }
  
  //*********Background Api calling to reshape*********
  sendToReshape(RfqId:any,RfqPartId:any): Observable<any> {
    this.moduleUrl = "RFQ/ProcessPartFilesReshape?rfqId=" + RfqId + "&rfqPartId=" + RfqPartId;
    return this._dataService.getAll(this.moduleUrl,"");
  }
  

  removeUnwantedPartFile(RfqPartId: any): Observable<any> {
    this.moduleUrl = "RFQ/RemoveUnwantedPartFile?" + "RfqPartId=" + RfqPartId;
    return this._dataService.add(this.moduleUrl, RfqPartId);
  }

  getPartDetails(
    partId: number,
    rfqPratd: number
  ): Observable<IPartsViewModel> {
    this.moduleUrl =
      "RFQ/GetPartDetailsById?id= " + partId + " &RfqPartId=" + rfqPratd;
    return this._dataService.getSingle(this.moduleUrl, "");
  }
  adddRfqGeneralAttachment(rfqModel: IRFQViewModel): Observable<IRFQViewModel> {
    this.moduleUrl = "RFQ/InsertRfqGeneralAttachments";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }
  addRfqGeneralAttachment(rfqModel: IRFQViewModel): Observable<IRFQViewModel> {
    this.moduleUrl = "RFQ/InsertRfqGeneralAttachments";
    return this._dataService.add(this.moduleUrl, rfqModel);
  }
  deleteRfqGeneralAttachment(
    fileName: string,
    contactId: number,
    rfqId: number
  ): Observable<IRFQViewModel> {
    this.moduleUrl =
      "RFQ/RemoveRfqGeneralAttachments?fileName=" +
      fileName +
      "&ContactId=" +
      contactId +
      "&RfqId=" +
      rfqId +
      "";
    return this._dataService.deletePost(this.moduleUrl, "");
  }
  deletePartGeneralAttachment(
    fileName: string,
    contactId: number,
    PartId: number,
    RfqPartId: number
  ): Observable<IPartsViewModel> {
    this.moduleUrl =
      "RFQ/RemovePartsGeneralAttachment?fileName=" +
      fileName +
      "&ContactId=" +
      contactId +
      "&PartId=" +
      PartId +
      "&rfqPartId=" +
      RfqPartId;
    return this._dataService.deletePost(this.moduleUrl, "");
  }

  // ******* Delet Api Reshape ********
  reshapeDeletePartGeneralAttachment(
    fileName: any,
    contactId: number,
    PartId: number,
    RfqPartId: number
  ): Observable<IPartsViewModel> {
    this.moduleUrl =
      "RFQ/DeletePartFilesReshape?fileName=" +
      fileName +
      "&ContactId=" +
      contactId +
      "&PartId=" +
      PartId +
      "&rfqPartId=" +
      RfqPartId;
    return this._dataService.deletePost(this.moduleUrl, "");
  }


  removeQuoteAttachment(
    fileName: string,
    contactId: number,
    RfqId: number
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/RemoveQuoteAttachment?FileName=" +
      fileName +
      "&ContactId=" +
      contactId +
      "&rfqId=" +
      RfqId +
      "";
    return this._dataService.deletePost(this.moduleUrl, "");
  }
  addIndividualGroupToRFQ(
    iManufacturersViewModel: IManufacturersViewModel
  ): Observable<IManufacturersViewModel> {
    this.moduleUrl = "RFQ/InsertIndividualGroupToRFQ";
    return this._dataService.add(this.moduleUrl, iManufacturersViewModel);
  }
  getManufacturesByRfq(id: any): Observable<IManufacturersViewModel> {
    this.moduleUrl = "RFQ/GetRFQIndividualGroup?rfqId=";
    return this._dataService.getAll(this.moduleUrl, id);
  }

  removedAddedContactFromRfq(id: any): Observable<IManufactureGroupList> {
    this.moduleUrl = "RFQ/RemoveIndividualGroup?rfqSupplierId=" + id;
    return this._dataService.add(this.moduleUrl, "");
  }

  getReviewRfqParts(id: any, supplierId: any, IsRfqResubmitted: any): any {
    if (supplierId === undefined) {
      supplierId = 0;
    }
    this.moduleUrl =
      "RFQ/GetPartsByRfqId?RfqId=" +
      id +
      "&LoggedInId=" +
      supplierId +
      "&IsRfqResubmitted=" +
      IsRfqResubmitted;
    return this._dataService.getAll(this.moduleUrl);
  }

  updateRFQStatus(statusKey, rfqID, contactId): Observable<any> {
    const obj = {
      rfQstatus: statusKey,
      rfqId: rfqID,
      contactId: contactId,
    };
    this.moduleUrl = "RFQ/UpdateRFQStatus";
    return this._dataService.updatePass(this.moduleUrl, obj);
  }

  cloneCurrentRFQ(cloneRfqViewModel: CloneRfqViewModel): Observable<any> {
    this.moduleUrl = "RFQ/CloneRFQ";
    return this._dataService.add(this.moduleUrl, cloneRfqViewModel);
  }

  getS3FileDownload(filename): Observable<any> {
    this.moduleUrl = "Upload/GetS3BucketFile?filename=" + filename;
    return this._dataService.add(this.moduleUrl, "");
  }

  getDownloadAllFileURL(downloadallfiles: any): Observable<any> {
    this.moduleUrl = "Contact/GetDownloadAllFile";
    return this._dataService.add(this.moduleUrl, downloadallfiles);
  }
  GenerateRFQdetailsPDF(Pdfmodel: PdfModel): Observable<ArrayBuffer> {
    this.moduleUrl = "RFQ/GenerateRFQdetailsPDF";
    return this._dataService.add(this.moduleUrl, Pdfmodel);
  }

  GenerateReportPDF(
    Pdfmodel: SubscriptionReceiptPdfViewModel
  ): Observable<ArrayBuffer> {
    this.moduleUrl = "Supplier/GenerateSubscriptionReceiptPDF";
    return this._dataService.add(this.moduleUrl, Pdfmodel);
  }
  getParentProcesses(): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl =
      "Master/GetProcesses?userType=" + localStorage.getItem("Usertype");
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getParentProcessesNew(): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl = "Master/GetPostProdProcesses";
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getParentProcesses2(): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl =
      "Master/GetProcesses?userType=" + localStorage.getItem("Usertype");
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getAllProcess(): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl = "Master/GetAllProcesses";
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getProcessByCompanyId(
    companyId: number,
    isRfqSearchType: boolean = true
  ): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl =
      "Supplier/GetSuppliersProcesses?CompanyId=" +
      companyId +
      "&isRfqSearchType=" +
      isRfqSearchType;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getParentMaterial(): Observable<IMaterialViewModel[]> {
    this.moduleUrl = "Master/GetMaterialsData";
    return this._dataService.getAll(this.moduleUrl, "");
  }
  GetPostProdProcesses(): Observable<IPostProductionViewModel[]> {
    this.moduleUrl = "Master/GetPostProductionProcessesData";
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getPartsByRfqId(rfqId: number): any {
    this.moduleUrl = "RFQ/GetPartsByRfqId?RfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl);
  }
  transferRFQ(
    rfqId: number,
    contactTo: number,
    LoggedInId: number
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/TransferRFQ?rfq_Id=" +
      rfqId +
      "&contact_To=" +
      contactTo +
      " &TransferRFQtoBuyer=" +
      LoggedInId;
    return this._dataService.add(this.moduleUrl, "");
  }

  getBuyerListByCmpnyId(
    ContactId: number
  ): Observable<IBuyerListByCompanyIdModel[]> {
    this.moduleUrl = "Contact/ContactListByCompanyId?ContactId=" + ContactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getMessagesByRfqId(
    rfqId: number,
    contactId: number,
    FromContactId: number,
    isBuyer: boolean,
    messageTypeId : number
  ): Observable<IMessagesViewModel[]> {
    this.moduleUrl =
      "Messages/GetMessagesList?rfqId=" +
      rfqId +
      "&contactId=" +
      contactId +
      "&FromContactId=" +
      FromContactId +
      "&isBuyer=" +
      isBuyer+
      "&messageTypeId=" +
      messageTypeId
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getMessageList(
    iMessagesListViewModel: IMessageListViewModel
  ): Observable<IMessagesViewModel> {
    this.moduleUrl = "Messages/GetMessagesListNew";
    return this._dataService.add(this.moduleUrl, iMessagesListViewModel);
  }

  archiveUnarchive(
    archiveUnArchiveMessagesViewModelListModel: ArchiveUnArchiveMessagesViewModelList
  ): Observable<any> {
    this.moduleUrl = "Messages/ArchiveUnArchiveMessages";
    return this._dataService.add(
      this.moduleUrl,
      archiveUnArchiveMessagesViewModelListModel
    );
  }

  deleteMessages(messageId: number[]): Observable<any> {
    this.moduleUrl = "Messages/DeleteMessages";
    return this._dataService.add(this.moduleUrl, messageId);
  }

  setMessageReadUnread(messageId: MessageReadUnreadViewModel): Observable<any> {
    this.moduleUrl = "Messages/SetMessageReadUnread";
    return this._dataService.add(this.moduleUrl, messageId);
  }
  GetManufacturer(
    rfqNDAType: string,
    rfqNDALevel: number,
    rfqNDAStatus: string,
    rfqId: number,
    conatctId: number
  ): Observable<IRfqNDAViewModel[]> {
    this.moduleUrl =
      "RFQ/GetRFQManufacturerNDA?RfqNDAType=" +
      rfqNDAType +
      "&RfqNDALevel=" +
      rfqNDALevel +
      "&RfqNDAStatus=" +
      rfqNDAStatus +
      "&RFQId=" +
      rfqId +
      "&ContactId=" +
      conatctId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  GetRevesionData(rfqId: number): Observable<IRFQRevisionModel[]> {
    this.moduleUrl = "RFQ/GetRFQRevision?RFQId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  sendMessages(
    iMessagesViewModel: IMessagesViewModel
  ): Observable<IMessagesViewModel> {
    this.moduleUrl = "Messages/SendMessage";
    return this._dataService.add(this.moduleUrl, iMessagesViewModel);
  }

  manufacturerApproveDecline(
    iMessagesViewModel: IMessagesViewModel
  ): Observable<IMessagesViewModel> {
    this.moduleUrl = "Messages/UpdateAuthorRecipientStatus";
    return this._dataService.add(this.moduleUrl, iMessagesViewModel);
  }
  changeMessageStatus(messageId: number): Observable<any> {
    this.moduleUrl = "Messages/ChangeMessageStatus?messageId=" + messageId;
    return this._dataService.add(this.moduleUrl, "");
  }
  getMessageThreadByID(
    iMessagesViewModel: IMessagesViewModel
  ): Observable<any> {
    this.moduleUrl = "Messages/GetMessagesListById";
    return this._dataService.add(this.moduleUrl, iMessagesViewModel);
  }
  getSupplierRfqCount(contactId: SupplierDashListModel): Observable<any> {
    this.moduleUrl = "RFQ/GetSupplierRFQCount";
    return this._dataService.add(this.moduleUrl, contactId);
  }
  GetBuyerRFQCount(contactId: number, companyId: number): Observable<any> {
    this.moduleUrl =
      "RFQ/GetBuyerRFQCount?contactId=" + contactId + "&companyId=" + companyId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  SendAwardDatePassedNotification(contactId: number): Observable<any> {
    this.moduleUrl =
      "Buyer/SendAwardDatePassedNotification?buyerContactId=" +
      contactId;
    return this._dataService.add(this.moduleUrl, "");
  }

  GetTermsAndConditions(emailId: string, contactId: number): Observable<any> {
    this.moduleUrl =
      "Account/GetTermsAndConditions?emailId=" +
      emailId +
      "&contactId=" +
      contactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  SetTermsAndConditions(
    emailId: string,
    contactId: number,
    isAcceptance: number
  ): Observable<any> {
    this.moduleUrl =
      "Account/SetTermsAndConditions?emailId=" +
      emailId +
      "&contactId=" +
      contactId +
      "&isAcceptance=" +
      isAcceptance;
    return this._dataService.add(this.moduleUrl, "");
  }
  ndaAcceptedorNot(rfqId: number, contactId: number): Observable<any> {
    this.moduleUrl =
      "Supplier/GetNDAAgreementAccept?RFQId=" +
      rfqId +
      "&ContactId=" +
      contactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  ndaAcceptedValues(rfqId: number): Observable<IGetCustomNDAFilesModel> {
    this.moduleUrl = "RFQ/GetCustomNDAFiles?RFQId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  GetBuyerQuotingList(
    iBuyerQuotesViewModel: IBuyerQuotesViewModel
  ): Observable<any> {
    this.moduleUrl = "Supplier/GetBuyerQuotingList";
    return this._dataService.add(this.moduleUrl, iBuyerQuotesViewModel);
  }

  GetBuyerMyQuotingList(
    iBuyerQuotesViewModel: BuyerMyQuotesRequestViewModel
  ): Observable<any> {
    this.moduleUrl = "Buyer/GetBuyerMyQuotes";
    return this._dataService.add(this.moduleUrl, iBuyerQuotesViewModel);
  }

  GetRFQPartQuantityQuoteBYRfqId(
    iRFQPartQuantityQuote: IRFQPartQuantityQuote
  ): Observable<any> {
    this.moduleUrl = "Supplier/GetRFQPartQuantityQuote";
    return this._dataService.add(this.moduleUrl, iRFQPartQuantityQuote);
  }

  SetRFQQuoteStatus(iRFQPartQuantityQuote: any): Observable<any> {
    this.moduleUrl = "rfq/SetRFQQuoteStatus";
    return this._dataService.add(this.moduleUrl, iRFQPartQuantityQuote);
  }

  SetRFQQuoteReviewedStatus(
    rfqId: number,
    contactId: number,
    IsRfqResubmitted: boolean
  ): Observable<any> {
    this.moduleUrl =
      "rfq/SetRFQQuoteReviewedStatus?rfqId=" +
      rfqId +
      "&ContactId=" +
      contactId +
      "&IsRfqResubmitted=" +
      IsRfqResubmitted;
    return this._dataService.add(this.moduleUrl, "");
  }
  deletePartFromLibray(id: any): Observable<IPartsViewModel> {
    this.moduleUrl = "RFQ/DeletePart?PartId=";
    return this._dataService.delete(this.moduleUrl, id);
  }

  deleteSavedSearchDetails(id: any): Observable<any> {
    this.moduleUrl = "RFQ/DeleteSavedSearchDetails?SavedSearchId=" + id;
    return this._dataService.add(this.moduleUrl, "");
  }

  updateSavedSearchDetails(updateData: ISavedSearchViewModel): Observable<any> {
    this.moduleUrl = "RFQ/UpdateSavedSearchDetails";
    return this._dataService.UpdateWithoutId(this.moduleUrl, updateData);
  }
  SetSavedSearches(serchFilter: any): Observable<any> {
    this.moduleUrl = "rfq/SetSavedSearches";
    return this._dataService.add(this.moduleUrl, serchFilter);
  }
  GetSavedSearchedRfqList(
    iSavedSearchViewModel: ISavedSearchViewModel
  ): Observable<any> {
    this.moduleUrl = "rfq/GetSavedSearchedRfqList";
    return this._dataService.add(this.moduleUrl, iSavedSearchViewModel);
  }
  GetSavedSearchByContact(contactId: number): Observable<any> {
    this.moduleUrl = "RFQ/GetSavedSearchByContact?contactId=" + contactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  setCurrentOpenRfqId(message: string) {
    this.currentOpenRfqId.next({
      text: message,
    });
  }

  getCurrentOpenRfqId(): Observable<any> {
    return this.currentOpenRfqId.asObservable();
  }
  setcuOpenPLibId(message: string) {
    this.currentOpenRfqId.next({
      text: message,
    });
  }

  getcuOpenPLibId(): Observable<any> {
    return this.currentOpenRfqId.asObservable();
  }

  setisQuoteNowClicked(message: string) {
    this.isQuoteNowClicked.next({
      text: message,
    });
  }

  getisQuoteNowClicked(): Observable<any> {
    return this.isQuoteNowClicked.asObservable();
  }

  getisCurrentRfqLoaded(): Observable<any> {
    return this.isCurrentRfqLoaded.asObservable();
  }
  setisCurrentRfqLoaded(message: string) {
    this.isCurrentRfqLoaded.next({
      text: message,
    });
  }

  getiisRedirect(): Observable<any> {
    return this.isRedirect.asObservable();
  }
  setisRedirect(message: any) {
    this.isRedirect.next({
      text: message,
    });
  }

  getisSupplierMessageThread(): Observable<any> {
    return this.isSupplierMessageThread.asObservable();
  }
  setisSupplierMessageThread(message: string) {
    this.isSupplierMessageThread.next({
      text: message,
    });
  }
  getisBuyerNameClicked(): Observable<any> {
    return this.isBuyerNameClicked.asObservable();
  }
  setisBuyerNameClicked(message: string) {
    this.isBuyerNameClicked.next({
      text: message,
    });
  }

  get3DtourDelete(): Observable<any> {
    return this.is3DTourDelete.asObservable();
  }
  get3DtourDelete1(): Observable<any> {
    return this.is3DTourDelete1.asObservable();
  }
  set3DtourDelete(message: any) {
    this.is3DTourDelete.next({
      text: message,
    });
  }
  set3DtourDelete1(message: any) {
    this.is3DTourDelete1.next({
      text: message,
    });
  }

  getCloneClose(): Observable<any> {
    return this.isCloneClick.asObservable();
  }
  setCloneClose(message: any) {
    this.isCloneClick.next({
      text: message,
    });
  }

  getEditCloneClose(): Observable<any> {
    return this.isCloneEditClick.asObservable();
  }
  setEditCloneClose(message: any) {
    this.isCloneEditClick.next({
      text: message,
    });
  }
  handleError(error) {
    if (!this.isWarningShown) {
      if (error.status === 0) {
        this.isWarningShown = true;
        this._toastr.warning("Please check connection", "Warning!");
      } else if (error.status === 400) {
        this.isWarningShown = true;
        if (
          error.error.errorMessage != undefined &&
          error.error.errorMessage != null
        ) {
          if (error.error.errorMessage.includes("Timeout")) {
            this._toastr.warning(
              "Something went wrong please try again.",
              "Warning!"
            );
          } else {
            this._toastr.warning(
              JSON.stringify(error.error.errorMessage),
              "Warning!"
            );
          }
        } else {
          this._toastr.warning(JSON.stringify(error.error), "Warning!");
        }
      } else if (error.status === 401) {
        this.isWarningShown = true;
        this._toastr.warning(
          "Your session is expired. Please login again to continue.",
          "Warning!"
        );
      }
    }

    //   if (error.error !== undefined) {
    //     if (error.error.errorMessage !== '' && error.error.errorMessage !== undefined) {
    //       this._toastr.error(error.error.errorMessage, 'Error!');
    //     } else {
    //       if (error.status === 0) {
    //         this._toastr.error(JSON.stringify(error.error), 'Error!');
    //       } else if (error.status === 400) {
    //         this._toastr.error(JSON.stringify(error.error), 'Error!');
    //       }
    //     }
    //    } else {
    //       if (error.status === 0) {
    //         this._toastr.error(JSON.stringify(error.error), 'Error!');
    //       } else if (error.status === 400) {
    //         this._toastr.error(JSON.stringify(error.error), 'Error!');
    //       }
    // }
  }
  // /api/Public/SendRfqPartAttachmentsByEmail?emailId=aa@gmail.com&ContactId=1&RfqID=2&PartID=3
  SendRfqPartAttachmentsByEmail(
    emailId: string,
    ContactId: number,
    RfqID: number,
    PartID: number
  ): Observable<any> {
    // tslint:disable-next-line:max-line-length
    this.moduleUrl =
      "Public/SendRfqPartAttachmentsByEmail?emailId=" +
      emailId +
      "&ContactId=" +
      ContactId +
      "&RfqID=" +
      RfqID +
      "&RfqPartID=" +
      PartID;
    return this._dataService.add(this.moduleUrl, "");
  }
  RemoveRfqPartQuote(
    iDeleteQuoteModel: IDeleteQuoteModel
  ): Observable<IDeleteQuoteModel> {
    this.moduleUrl = "RFQ/RemoveRfqPartQuote";
    return this._dataService.add(this.moduleUrl, iDeleteQuoteModel);
  }
  GetrfqShopIQInfo(rfqID: number, contactId: number): Observable<any> {
    this.moduleUrl =
      "RFQ/GetRFQShopIQ?rfqId=" + rfqID + "&ContactId=" + contactId;
    return this._dataService.add(this.moduleUrl, "");
  }

  getQuotedMyRFQList(
    contactId: number,
    IsQuoted: boolean
  ): Observable<IMessagesViewModel[]> {
    this.moduleUrl =
      "RFQ/GetQuotedMyRFQList?contactId=" + contactId + "&IsQuoted=" + IsQuoted;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  GetDistributionList(
    DistributionViewModel: DistributionPostModel
  ): Observable<any> {
    this.moduleUrl = "Buyer/GetDistributionList";
    return this._dataService.add(this.moduleUrl, DistributionViewModel);
  }

  checkIsQuotingRestricted(
    companyId: number,
    rfqId: number,
    loggedInId: any
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/CheckIsQuotingRestricted?CompanyId=" +
      companyId +
      "&RfqId=" +
      rfqId +
      "&LoggedInId=" +
      loggedInId;
    return this._dataService.add(this.moduleUrl, "");
  }
  RemoveMessageAttachment(fileName: string): Observable<any> {
    this.moduleUrl = "/Messages/RemoveMessageAttachment?fileName=" + fileName;
    return this._dataService.deletePost(this.moduleUrl, "");
  }

  isRFQDetailAccessible(
    rfqId: number,
    supplierId: number
  ): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl =
      "/IsRFQDetailAccessible?rfqId=" + rfqId + "&supplierId=" + supplierId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getProfileList(companyId: number, conatctId: number): Observable<any> {
    this.moduleUrl =
      "BasicManufacturer?CompanyId=" + companyId + "&ContactId=" + conatctId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  GetMyRfqSavedSearchByContact(contactId: number): Observable<any> {
    this.moduleUrl = "SavedSearch?contactId=" + contactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  GetMyRfqSavedSearchDetail(savedSearchId: number): Observable<any> {
    this.moduleUrl = "SavedSearchFilter?savedSearchId=" + savedSearchId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  setMyRfqSavedSearchFilter(
    savedSearchFilterModel: any
  ): Observable<any> {
    this.moduleUrl = "SavedSearch";
    return this._dataService.add(this.moduleUrl, savedSearchFilterModel);
  }
  getUpdateCompanyProfile(loggedCompanyId, loggedEncryptId): Observable<any> {
    this.moduleUrl =
      "UpdateCompanyProfile?companyId=" +
      loggedCompanyId +
      "&contactId=" +
      loggedEncryptId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  updateMyRfqSavedSearchFilter(
    savedSearchFilterModel: any
  ): Observable<any> {
    this.moduleUrl = "SavedSearch";
    return this._dataService.UpdateWithoutId(
      this.moduleUrl,
      savedSearchFilterModel
    );
  }
  setUpdateCompanyProfile(profileModel: ProfileModel): Observable<any> {
    this.moduleUrl = "UpdateCompanyProfile";
    return this._dataService.add(this.moduleUrl, profileModel);
  }
  GetSavedSearchedMyRfqList(savedSearchFilter: RFQFilter): Observable<any> {
    this.moduleUrl = "SavedSearchFilter";
    return this._dataService.add(this.moduleUrl, savedSearchFilter);
  }

  IsValidPostalCode(contactId: number): Observable<any> {
    this.moduleUrl = "IsValidPostalCode?contactId=" + contactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  removeTermCondition(companyId, conatctId): Observable<any> {
    this.moduleUrl =
      "SettingTermsConditions/DeleteQmsQuoteTermConditions?supplierCompanyId=" +
      companyId +
      "&supplierContactId=" +
      conatctId;
    return this._dataService.add(this.moduleUrl, "");
  }

  getRFQList(contactId: number, fromContactId: any): Observable<any> {
    this.moduleUrl =
      "RFQMessagesAssocation?contactId=" +
      contactId +
      "&fromContactId=" +
      fromContactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getListOfBuyersManufacturersForNewMessages(
    contactId: number,
    isBuyer: boolean
  ): Observable<any> {
    this.moduleUrl =
      "Contact/GetListOfBuyersManufacturersForNewMessages?contactId=" +
      contactId +
      "&isBuyer=" +
      isBuyer;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  addNewRfqMessage(
    messageRFQViewModel: CreateNewRFQMessagesViewModel
  ): Observable<any> {
    this.moduleUrl = "CreateRFQNewMessages";
    return this._dataService.add(this.moduleUrl, messageRFQViewModel);
  }
  copyRfqMessage(
    rFQMessageAssociationViewModel: RFQMessageAssociationViewModel
  ): Observable<any> {
    this.moduleUrl = "RFQMessagesAssocation";
    return this._dataService.add(
      this.moduleUrl,
      rFQMessageAssociationViewModel
    );
  }
  getRfqFilterList(rfqId: any): Observable<any> {
    this.moduleUrl = "BuyerRFQDistributionTabTiles?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  DownloadQuotesToExcel(
    downloadQuotesToExcelViewModel: DownloadQuotesToExcelViewModel
  ): Observable<any> {
    this.moduleUrl = "QMS/DownloadQuotesToExcel";
    return this._dataService.add(
      this.moduleUrl,
      downloadQuotesToExcelViewModel
    );
  }

  CloneRfqPart(rfqPartId: number): Observable<any> {
    this.moduleUrl = "RFQ/CloneRfqPart?rfqPartId=" + rfqPartId;
    return this._dataService.add(this.moduleUrl, "");
  }
  GetRfqStatus(rfqId: any): Observable<any> {
    this.moduleUrl = "RFQ/GetRfqStatus?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getStoreAwardDetails(rfqQuoteSupplierQuoteId: number): Observable<any> {
    this.moduleUrl =
      "RFQ/GetRfqContinueAwardingData?rfqId=" + rfqQuoteSupplierQuoteId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  setRfqContinueAwardingData(
    iRFQPartQuantityQuote: IRFQPartQuantityQuote
  ): Observable<any> {
    this.moduleUrl = "rfq/SetRfqContinueAwardingData";
    return this._dataService.add(this.moduleUrl, iRFQPartQuantityQuote);
  }
  removeSelectedAward(rfqQuoteItemsId: number): Observable<any> {
    this.moduleUrl =
      "rfq/DeleteRfqContinueAwardingData?rfqQuoteItemsId=" + rfqQuoteItemsId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getRfqImage(rfqId: number): Observable<any> {
    this.moduleUrl = "RFQImage?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  setSavedSearchDefaultFilter(
    savedSearchDefaultFilterViewModel: SavedSearchDefaultFilterViewModel
  ): Observable<any> {
    this.moduleUrl = "SavedSearchDefaultFilter";
    return this._dataService.add(
      this.moduleUrl,
      savedSearchDefaultFilterViewModel
    );
  }
  getRFQPurposeList(): Observable<any> {
    this.moduleUrl = "Master/GetRFQPurposeList";
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getBuyerList(companyId): Observable<any> {
    this.moduleUrl = "BuyerMyCompanyRfqBuyerList?companyId=" + companyId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getSupplierList(rfqId, rfqPartId): Observable<any> {
    this.moduleUrl =
      "buyer/GetAwardingModelSupplierList?rfqId=" +
      rfqId +
      "&rfqPartId=" +
      rfqPartId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getAllRfqList(iBuyerFilteredRfqViewModel: any): Observable<any> {
    this.moduleUrl = "BuyerMyCompanyRFQ";
    return this._dataService.add(this.moduleUrl, iBuyerFilteredRfqViewModel);
  }

  trackBuyerCreateRfqPageLanding(contactId: any): Observable<any> {
    this.moduleUrl =
      "RFQ/TrackBuyerCreateRfqPageLanding?contactId=" + contactId;
    return this._dataService.add(this.moduleUrl, "");
  }

  getAwardingModelQuotePartData(rfqId: any): Observable<any> {
    this.moduleUrl = "Buyer/GetAwardingModelQuotePartData?RfqId=" + rfqId;
    return this._dataService.add(this.moduleUrl, "");
  }
  getAwardingModelQuoteQuantityData(
    awardingModelQuoteDetailsRequestViewModel: any
  ): Observable<any> {
    this.moduleUrl = "Buyer/GetAwardingModelQuoteQuantityData";
    return this._dataService.add(
      this.moduleUrl,
      awardingModelQuoteDetailsRequestViewModel
    );
  }

  getSupplierParentProcesses(
    companyId: number,
    isRfqSearchType: boolean = true
  ): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl =
      "Supplier/GetSupplierParentProcesses?supplierCompanyId=" +
      companyId +
      "&isRfqSearchType=" +
      isRfqSearchType;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getSupplierChildProcesses(
    supplierChildProcessViewModel: SupplierChildProcessViewModel
  ): Observable<any> {
    this.moduleUrl = "Supplier/GetSupplierChildProcesses";
    return this._dataService.add(this.moduleUrl, supplierChildProcessViewModel);
  }

  getBuyerParentProcesses(): Observable<ICustomProcessViewModel[]> {
    this.moduleUrl = "Buyer/GetBuyerParentProcesses";
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getBuyerChildProcesses(
    buyerChildProcessViewModel: BuyerChildProcessViewModel
  ): Observable<any> {
    this.moduleUrl = "Buyer/GetBuyerChildProcesses";
    return this._dataService.add(this.moduleUrl, buyerChildProcessViewModel);
  }

  sendQuotedMarkQuotedRFQNotification(rfqId: number): Observable<any> {
    this.moduleUrl = "RFQ/SendQuotedMarkQuotedRFQNotification?rfqId=" + rfqId;
    return this._dataService.add(this.moduleUrl, "");
  }

  getCloneModelDetails(rfqId: number): Observable<any> {
    this.moduleUrl = "RFQ/GetCloneModelDetails?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getRFQLocationList(rfqId: number, territoryId: number): Observable<any> {
    this.moduleUrl =
      "BuyerRfqDetailDashboardAwardTile?rfqId=" +
      rfqId +
      "&rfqPreferredLocation=" +
      territoryId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getQuoteDetails(rfqId: number): Observable<any> {
    this.moduleUrl = "RFQ/GetOtherThanAwardedStatusTileData?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  setRetractAward(
    rfqPartId: number,
    statusId: number,
    rfqId: number
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/RetractOtherThanAwardedStatusTileData?rfqPartId=" +
      rfqPartId +
      "&statusId=" +
      statusId +
      "&rfqId=" +
      rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  getWarningSetting(contactId: any): Observable<any> {
    this.moduleUrl = "BuyerAwardWarningInfo?buyerId=" + contactId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  GetDistributionThreadList(
    DistributionViewModel: DistributionChildAccountsViewModel
  ): Observable<any> {
    this.moduleUrl = "Buyer/GetDistributionExpandedList";
    return this._dataService.add(this.moduleUrl, DistributionViewModel);
  }

  getMaterialByParentProcessId(
    materialsRequestViewModel: MaterialsRequestViewModel
  ): Observable<IMaterialViewModel[]> {
    this.moduleUrl = "Master/GetMaterialsDataByProcessIds";
    return this._dataService.add(this.moduleUrl, materialsRequestViewModel);
  }
  getPostProductionProcessesDataByProcessIds(
    postProductionProcessRequestViewModel: PostProductionProcessRequestViewModel
  ): Observable<IPostProductionViewModel[]> {
    this.moduleUrl = "Master/GetPostProductionProcessesDataByProcessIds";
    return this._dataService.add(
      this.moduleUrl,
      postProductionProcessRequestViewModel
    );
  }

  getQuestionList(processId: number): Observable<any> {
    this.moduleUrl = "RFQPartDrawerQuestions?partCategoryId=" + processId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  CheckIsValidApplyToAllParts(
    rfqId: number,
    rfqPartId: number,
    partCategoryId: number
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/CheckIsValidApplyToAllParts?rfqId=" +
      rfqId +
      "&rfqPartId=" +
      rfqPartId +
      "&partCategoryId=" +
      partCategoryId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getRefreshToken(token: string, refreshToken: string): Observable<any> {
    this.moduleUrl =
      "RefreshToken?token=" + token + "&refreshToken=" + refreshToken;
    return this._dataService.add(this.moduleUrl, "");
  }
  actionTrackerBuyerMessageDrawerSetActions(
    contactId: number,
    loggedInId: number
  ): Observable<any> {
    this.moduleUrl =
      "ActionTrackerBuyerMessageDrawerSetActions?loggedInId=" +
      loggedInId +
      "&contactId=" +
      contactId;
    return this._dataService.add(this.moduleUrl, "");
  }

  getBuyerRFQSourcedList(
    buyerRfqSourcedInfoFilterRequest: BuyerRfqSourcedInfoFilterRequest
  ): Observable<any> {
    this.moduleUrl = "BuyerRfqInfo";
    return this._dataService.add(
      this.moduleUrl,
      buyerRfqSourcedInfoFilterRequest
    );
  }
  setArchiveStatus(rfqID, contactId): Observable<any> {
    const obj = {
      rfqIdsList: rfqID,
      contactId: contactId,
    };
    this.moduleUrl = "RFQ/UpdateMultipleRFQStatus";
    return this._dataService.updatePass(this.moduleUrl, obj);
  }

  getIsProfileFilledOut(
    loggedCompanyId: number,
    loggedEmail: any,
    loggedId: number
  ): Observable<any> {
    this.moduleUrl =
      "Buyer/IsProfileFilledOut?buyerCompanyId=" +
      loggedCompanyId +
      "&buyerEmail=" +
      loggedEmail +
      "&buyerId=" +
      loggedId;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  removeRfqFromQuotesInProgressList(
    supplierId: number,
    RfqId: number
  ): Observable<any> {
    this.moduleUrl =
      "RFQ/RemoveRfqFromQuotesInProgressList?supplierId=" +
      supplierId +
      "&rfqId=" +
      RfqId;
    return this._dataService.add(this.moduleUrl, "");
  }

  captureAwardRfqEvent(iRFQPartQuantityQuote: any): Observable<any> {
    this.moduleUrl = "RFQ/CaptureAwardRfqEvent";
    return this._dataService.add(this.moduleUrl, iRFQPartQuantityQuote);
  }
  setUnarchiveStatus(rfqID, contactId): Observable<any> {
    const obj = {
      rfqIdsList: rfqID,
      contactId: contactId,
    };
    this.moduleUrl = "RFQ/UnarchiveMultipleRFQs";
    return this._dataService.updatePass(this.moduleUrl, obj);
  }

  getLeadMessageData(messageId: number): Observable<any> {
    this.moduleUrl = "Messages/GetLeadMessageData?messageId=" + messageId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  isRequestedForUpgradeToSilver(contactID: number): Observable<any> {
    this.moduleUrl =
      "Supplier/IsRequestedForUpgradeToSilver?contactId=" + contactID;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getGrowthPackage(companyId, accountType) {
    this.moduleUrl =
      "GrowthPackage/GetUserAccountType?companyId=" +
      companyId +
      "&existingAccountType=" +
      accountType;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getOrderManagementDetails(contactID: number): Observable<any> {
    this.moduleUrl =
      "OrderManagement/GetOrderManagementDetails?contactId=" + contactID;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  saveOrderManagement(contactId): Observable<any> {
    const obj = {
      contactId: contactId,
      isOrderManagementTileViewed: true,
    };
    this.moduleUrl = "OrderManagement/SaveOrderManagementDetails";
    return this._dataService.add(this.moduleUrl, obj);
  }

  saveOrderManagementChecked(
    contactId,
    isOrderManagementChecked
  ): Observable<any> {
    const obj = {
      contactId: contactId,
      isOrderManagementChecked: isOrderManagementChecked,
    };
    this.moduleUrl = "OrderManagement/SaveOrderManagementDetails";
    return this._dataService.add(this.moduleUrl, obj);
  }

  getRfqId(rfqGUID: any): Observable<IGetCustomNDAFilesModel> {
    this.moduleUrl = "RFQ/GetRFQId?rfqGUID=" + rfqGUID;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  setReQuotingInfo(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/SetReQuotingInfo";
    return this._dataService.add(this.moduleUrl, data);
  }

  setReshapeLogin(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/ReshapeLogin";
    return this._dataService.add(this.moduleUrl, data);
  }
  RedirectToReshapeBilling(supplierContactId): Observable<any> {
    this.moduleUrl = "PurchaseOrder/RedirectToReshapeBilling?supplierContactId=" + supplierContactId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  RedirectToReshapeIntegrations(supplierContactId): Observable<any> {
    this.moduleUrl = "PurchaseOrder/RedirectToReshapeIntegrations?supplierContactId=" + supplierContactId;
    return this._dataService.getAll(this.moduleUrl, '');
  }

  RedirectToReshapeRFQsInvoices(supplierContactId : any, rfqId : any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/RedirectToReshapeRFQsInvoices?supplierContactId=" + supplierContactId + "&rfqId="+ rfqId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  
  saveAwardData(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/SavePurchaseOrderDetails";
    return this._dataService.add(this.moduleUrl, data);
  }

  getPoDetails(rfqId: any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/GeneratePurchaseOrderJSON?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  UpdatePurchaseOrderForReshape(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/UpdatePurchaseOrderForReshape";
    return this._dataService.add(this.moduleUrl, data);
  }

  editPurchaseOrder(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/EditPurchaseOrderDetails";
    return this._dataService.add(this.moduleUrl, data);
  }
 
  setContactModel(contactModel: any) {
    this.contactModel.next(contactModel);
  }
  
  setcompanyname(companyname) {
    this.companyname.next(companyname);
  }
  getPoPartStatus(reshapeUniqueId: any, rfqPartId : any, supplierId:any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/GetPOPartStatuses?reshapeUniqueId=" + reshapeUniqueId +"&rfqPartId=" + rfqPartId +"&supplierId=" + supplierId;;
    return this._dataService.getAll(this.moduleUrl, "");
  }
  confirmPOPartsReceived(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/ConfirmPOPartsReceived";
    return this._dataService.UpdateWithoutId(this.moduleUrl, data);
  }
  setAwardFlow(rfqId: any, logMessage : any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/LogOrderManagementFlow?rfqId=" + rfqId +"&logMessage=" + logMessage ;
    return this._dataService.add(this.moduleUrl, "");
  }

  getOrdersList(data): Observable<any> {
    this.moduleUrl = "PurchaseOrder/GetOrdersList";
    return this._dataService.add(this.moduleUrl, data);
  }

  getCompanyUsers(conatctId: any): Observable<any> {
    this.moduleUrl = "Contact/GetCompanyUsers?contactId=" + conatctId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getPurchaseOrderDetail(rfqId: any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/GetPurchaseOrderDetails?rfqId=" + rfqId;
    return this._dataService.getAll(this.moduleUrl, "");
  }

  getInvoiceDetail(orderId: any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/GetInvoices?orderId=" + orderId;
    return this._dataService.add(this.moduleUrl, "");
  }
  sendEncryptedRfqId(data): Observable<any> {
    this.moduleUrl = "RFQ/SaveEncryptedRfqId";
    return this._dataService.add(this.moduleUrl, data);
  }
  reshapeModalViewer(supplierContactId:any,rfqId:any ): Observable<any> {
    this.moduleUrl = "RFQ/RedirectToReshapeRFQFiles?supplierContactId=" + supplierContactId + "&rfqId=" +rfqId
    return this._dataService.getAll(this.moduleUrl, "");
  }
  savingJwtToken(data){
    this.moduleUrl = "SSORedirection/SaveJwtToken";
    return this._dataService.add(this.moduleUrl,data);
  }
  cancelSubscrition(data){
    this.moduleUrl = "StripeSubscriptionCancellation";
    return this._dataService.add(this.moduleUrl,data);
  }


  mixPanelStarter(data): Observable<any> {
    this.moduleUrl = "MixPanel/NewSupplierEvents";
    data["geoCity"]="";
    data["geoCountryCode"]="";
    return this._dataService.add(this.moduleUrl, data);
  }

   // ****** getManufacturerCompanyNames ******
   getManufacturerCompanyNames(rfqId: any, rfqBuyerContactId : any, awardedRegionId:any): Observable<any> {
    this.moduleUrl = "PurchaseOrder/GetManufacturerCompanyNames?rfqId=" + rfqId +"&rfqBuyerContactId=" + rfqBuyerContactId +"&awardedRegionId=" + awardedRegionId;
    return this._dataService.getAll(this.moduleUrl, "");
  }


  passValue(data) {
    //passing the data as the next observable
    this.stringSubject.next(data);
  }

    // ****** get rfq nda status ******
    getRfqNdaStatus(rfqId: any, supplierContactId : any): Observable<any> {
      this.moduleUrl = "RFQ/RFQAccessInfo?rfqId=" + rfqId +"&supplierContactId=" + supplierContactId;
      return this._dataService.getAll(this.moduleUrl, "");
    }

    encryptJWTToken(data): Observable<any> {
      this.moduleUrl = "Account/EncryptedJWTToken";
      return this._dataService.add(this.moduleUrl,data);
    }

    redirectToNewBuyer(url, parameter="") {
      if (this.rfqForm2Enabled !== undefined) {
        if(this.rfqForm2Enabled){
          if(parameter){
            parameter="?"+parameter
          }
          url="rfq/buyer"+parameter;
        }
        this.router.navigateByUrl(url);
        return;
      }
      this._dataService.getAll("FeatureFlag?key=isNewBuyerFormEnabled&email=" + localStorage.getItem('User2')).
        subscribe(
          rfqForm2Enabled => {
            this.rfqForm2Enabled = Boolean(rfqForm2Enabled["isFeatureOn"]);
            if(this.rfqForm2Enabled){
              if(parameter){
              parameter="?"+parameter
            }
            url="rfq/buyer"+parameter;
          }
          this.router.navigateByUrl(url);
            return;
          },
          error => {
          });
    }

    addFileRedirectToRfqPage(selectedFiles): Observable<any> {
      return new Observable((observer) => {
        this._dataService.getAll("FeatureFlag?key=isNewBuyerFormEnabled&email=" + localStorage.getItem('User2')).
          subscribe(
            configCatData => {
              let rfqForm2Enabled = Boolean(configCatData["isFeatureOn"]);
            if(rfqForm2Enabled){
              let uploadedPartsFiles=[];
              let i = 0;
              for (const entry of selectedFiles) {
                const headers = new Headers();
                headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
                const headerObj = { headers: headers };
                const formData: FormData = new FormData();
                formData.append('file', entry._file);
                const url = environment.APIEndPoint + "/Upload/UploadFileNDAV2";
                 let uploadRef=this.http.post(url, formData, headerObj);
                 uploadRef.subscribe(
                  response => {
                    i++;
                    const result = JSON.parse(response['_body']);
                    if (result.result) {
                        uploadedPartsFiles.push(result['fileName']);  
                    }else{
                      this._toastr.error(result['errorMessage'], 'Error while save '+entry._file.name);
                    } 
                    if (i == selectedFiles.length) {
                      if(uploadedPartsFiles.length>0){
                        let dataToSave=this.getPartDefaultData();
                          dataToSave["rfqPartFile"] = uploadedPartsFiles[0];// this will become defailt file and can not be deleted
                          dataToSave["partsFiles"]=uploadedPartsFiles.splice(1);
                          this._dataService.add("RFQ/InsertPartDetailsV2", dataToSave).subscribe(result=>{
                            if (!result["result"]) {
                              this._toastr.error("Part could not be saved", result["errorMessage"]);
                              observer.next({continueOld:false,isFailed:true});
                              return;
                            }
                            observer.next({continueOld:false,isFailed:false,rfqId:encodeURIComponent(this.encrypt(result["rfqId"]).toString())});
                          });
                       }else{
                        // if all file upload completed but uploadedPartsFiles.length<1
                          observer.next({continueOld:false,isFailed:true}); 
                        }   
                  }
                  }, 
                  error => {
                    console.log("error occured while file upload",error);
                });
            }
            }else{
              //rfqForm2Enabled else 
              observer.next({continueOld:true,isFailed:true});
            }
            },
            error => {
              observer.next({continueOld:false,isFailed:true});
            });
      });
    }
    encrypt(input: any) {
      if (input !== null) {
       const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), 
         CryptoJS.enc.Utf8.parse('7061737323313233'), {
          keySize: 128 / 8,
          iv: CryptoJS.enc.Utf8.parse('7061737323313233'),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return encrypted;
      }
    }
    getPartDefaultData() {
      return {
        "ContactId": parseInt(localStorage.getItem('LoggedId')),
        "CompanyId": localStorage.getItem('loggedCompanyId'),
        "IsDefaultChildPartCategory": false,
        "IsDefaultParentPartCategory": false,
        "IsDefaultPostProduction": false,
        "IsDefaultMaterial": false,
        "ModifiedBy": parseInt(localStorage.getItem('LoggedId')),
        "WillDoLater": null,
        "IsDefaultDeliveryDate": false,
        "DeliveryDate": null,
        "PartSizeUnitId": 0,
        "IsChildCategorySelected": true,
        "IsChildSameAsParent": true,
        "IsLargePart": false,
        "IsRfq1stquantityChanged": false,
        "IsRfq2ndquantityChanged": false,
        "IsRfq3rdquantityChanged": false,
        "IsCommunityRfq": false,
        "IsUpdatedFromVision": false,
        "GeometryId": "0",
        "rfqPartDrawerAnswer": "",
        "rfqPartId": 0,
        "partId": 0,
        "rfqId": 0,
        "partName": "",
        "partNumber": "",
        "partQtyUnitId": 14,
        "materialId": 0,
        "postProductionProcessId": 0,
        "partDescription": "",
        "IsExistingPart": false,
        "rfqPartQuantityList": [],
    }
  }
creatRfqWithSelectedParts(partList:any):Observable<any>{
  return new Observable(observer=>{ 
    let rfqId=0;
        this.createUpdateRfqWithGivenPart(partList[0],rfqId).subscribe(result=>{
          if(result.result){
            rfqId=result["rfqId"];
            if(partList.length==1){
              observer.next({isFailed:false,
                rfqId:encodeURIComponent(this.encrypt(rfqId).toString())});
            }else{
              let successCount=1;
              for (let count=1;count<partList.length;count++){
               this.createUpdateRfqWithGivenPart(partList[count],rfqId).subscribe(innerResult=>{
                  successCount++
                  if (successCount == partList.length) {
                    observer.next({isFailed:false,rfqId:encodeURIComponent(this.encrypt(rfqId).toString())});   
                    }
                  }) 
                }
            }
          }else{
            observer.next({isFailed:true,rfqId:encodeURIComponent(this.encrypt(rfqId).toString())});
          }
        });
  });
} 
createUpdateRfqWithGivenPart(part,rfqId=0):Observable<any>{
  return new Observable(apiCallObservable=>{
    this._dataService.add("RFQ/AddPartFromPartLibrary", this.constructPartData(part,rfqId)).subscribe(
      response => {
        if (response['result'] === true) {
          apiCallObservable.next({result:true,rfqId:response['rfqId']});
        }else{
          this._toastr.error(response['errorMessage'], 'Error while adding part with name ',part['partName']);
          apiCallObservable.next({result:false,rfqId:rfqId});
        }  
      }, 
      error => {
        console.log("error occured while adding part",error);
        apiCallObservable.next({result:false,rfqId:rfqId});
    });
  });
}
initPartViewModel() {
  return {
    depth: 0,
    diameter: 0,
    height: 0,
    customPartDescription: '',
    isUpdatedFromVision: false,
    length: 0,
    partSizeUnitId: 0,
    surface: 0,
    volume: 0,
    width: 0,
    partId: 0,
    partName: '',
    partNumber: '',
    rfqPartId: 0,
    partCommodityCode: '',
    partDescription: '',
    materialId: 0,
    partQtyUnitId: 0,
    statusId: 0,
    companyId: parseInt(localStorage.getItem('loggedCompanyId')),
    contactId: parseInt(localStorage.getItem('LoggedId')),
    currencyId: 0,
    creationDate: '',
    modificationDate: '',
    rfqId: 0,
    rfqPartQuantityList: [],
    deliveryDate: null,
    partsFiles: [],
    rfqPartFile: '',
    errorMessage: '',
    result: true,
    primaryPartFile: '',
    postProductionProcessId: 0,
    moveToPartId: 0,
    categoryName: '',
    materialName: '',
    partQtyUnitName: '',
    postProductionProcessName: '',
    isRfq1stquantityChanged: false,
    isRfq2ndquantityChanged: false,
    isRfq3rdquantityChanged: false,
    createNewPart: false,
    rfqPartTotalQuotedCount: 0,
    isValidDeliveryDate: null,
    isDefaultPartCategory: false,
    isDefaultPostProduction: false,
    isDefaultMaterial: false,
    isDefaultDeliveryDate: false,
    isExistingPart: null,
    parentPartCategoryId: 0,
    childPartCategoryId: 0,
    parentCategoryName: '',
    childCategoryName: '',
    isDefaultParentPartCategory: false,
    isDefaultChildPartCategory: false,
    isChildCategorySelected: false,
    isChildSameAsParent: false,
    rfqPartDrawerAnswerList: null,
  };
}
constructPartData(partElement,rfqId){
  let iPartsViewModel: any = this.initPartViewModel();
    iPartsViewModel.partId = partElement.partId;
    iPartsViewModel.primaryPartFile = partElement.primaryPartFile;
    iPartsViewModel.rfqPartFile = partElement.primaryPartFile;
    iPartsViewModel.partName = partElement.partName;
    iPartsViewModel.partNumber = partElement.partNumber;
    iPartsViewModel.rfqId = rfqId;
    iPartsViewModel.partQtyUnitId = partElement.partQtyUnitId;
    iPartsViewModel.parentPartCategoryId = partElement.parentPartCategoryId;
    iPartsViewModel.childPartCategoryId = partElement.childPartCategoryId;
    iPartsViewModel.parentCategoryName = partElement.parentCategoryName;
    iPartsViewModel.childCategoryName = partElement.childCategoryName;
    iPartsViewModel.isChildCategorySelected = partElement.isChildCategorySelected;
    iPartsViewModel.materialId = partElement.materialId;
    iPartsViewModel.postProductionProcessId = partElement.postProductionProcessId;
    iPartsViewModel.partDescription = partElement.partDescription;
    iPartsViewModel.rfqPartQuantityList = partElement.rfqPartQuantityList;
    partElement.partsFiles = partElement.partsFiles.filter(ele => {
      return ele != "New Part";
    });
    iPartsViewModel.partsFiles = partElement.partsFiles;
    let rfqPartFile = partElement.rfqPartFile;
    if(AppUtil.isEmptyString(rfqPartFile)){
      rfqPartFile=partElement.primaryPartFile
    }
    iPartsViewModel.rfqPartFile =rfqPartFile;
    iPartsViewModel.primaryPartFile =partElement.primaryPartFile;
    iPartsViewModel.deliveryDate = null;
    iPartsViewModel.isCommunityRfq = false;
    return iPartsViewModel;
}
getConfigCatData(): Observable<any> {
  return new Observable((observer) => {
    if (this.rfqForm2Enabled !== undefined) {
      observer.next(this.rfqForm2Enabled);
      return;
    }
    this._dataService.getAll("FeatureFlag?key=isNewBuyerFormEnabled&email=" + localStorage.getItem('User2')).
      subscribe(
        configCatData => {
          this.rfqForm2Enabled = Boolean(configCatData["isFeatureOn"]);
          observer.next(this.rfqForm2Enabled);
        },
        error => {
          observer.next(this.rfqForm2Enabled);
        });
  });
}
}
