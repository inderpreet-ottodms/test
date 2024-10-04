import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable ,  Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IQmsQuotesViewModel, IQmsQuotePartsViewModel, IQmsPartListModel, IQmsPartQuantityList,
  IQMSQuoteListFilterViewModel, IQMSQuoteListViewModel, IQMSQuoteReceiptPDFViewModel, IQmsQuoteGAViewModel, IFeetypeList, QmsEmailMessagesFilterViewModel, qMSEmailMessagesViewModel, QMSQuoteInvoiceDetailsViewModel, QMSQuoteInvoiceDetailsListViewModel, InvoiceViewModel, QMSInvoicePDFViewModel, QMSActivityStatusModel, QMSMailModel, QMSInvoiceTrackActivityViewModel, QMSQuotePartQuantity } from '../../models/qmsModel';
import { IMQSFilterViewModel, IMQSViewModel } from '../../models/supplierModel';
import { qMSQuoteTermsConditionViewModel, qMSQuotePDFEmailMessageViewModel } from '../../../component/mqs/message-tab-drawer/qmsMessageModel';
import { QMSNotesTabViewModel, QMSQuoteNotesFilterViewModel } from '../../../component/mqs/qms-detail/component/notes-tab/notesModel';
import { RoutesRecognized, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable()
export class QmsService {
  moduleUrl: string;
  data: any = {
    rfqId: 0
  };

  set(data: any, key: string) {
    this.data[key] = data;
  }

  get(key: string) {
    return this.data[key];
  }

  // tslint:disable-next-line:member-ordering
  private currentQmsCompanyId = new Subject<any>();
  private currentQmsQuoteId = new Subject<any>();
  private previousUrl: string = undefined;
  constructor(private _dataService: DataService, private _httpClient: HttpClient, private router: Router,
    private _toastr: ToastrService) {
      this.router.events
    .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
      //console.log('previous url', events[0].urlAfterRedirects,events[0].urlAfterRedirects.includes('/qms/createinvoice?qmsQuoteId='));
     this.previousUrl=events[0].urlAfterRedirects;
      // console.log('current url', events[1].urlAfterRedirects);
    });

    }

    public getPreviousUrl(){
      return this.previousUrl;
    }

    sendQmsMessages(iQMSEmailMessagesViewModel : qMSEmailMessagesViewModel ): Observable<qMSEmailMessagesViewModel> {
      this.moduleUrl = 'QmsQuoteEmailMessage/SendQmsEmailMessageToBuyerQmsCustomer';
      return this._dataService.deletePost(this.moduleUrl, iQMSEmailMessagesViewModel );
    }

    addQmsName(iQmsQuotesViewModel: IQmsQuotesViewModel): Observable<IQmsQuotesViewModel> {
      this.moduleUrl = 'QMS/QMSCreateQuote';
      return this._dataService.add(this.moduleUrl, iQmsQuotesViewModel);
    }


    addQmsQuoteDetails(iQmsQuotesViewModel: IQmsQuotesViewModel): Observable<any> {
      this.moduleUrl = 'QMS/AddQmsQuoteDetails';
      return this._dataService.add(this.moduleUrl, iQmsQuotesViewModel);
    }


    addQmsPart(iQmsQuotePartsViewModel: IQmsQuotePartsViewModel): Observable<IQmsQuotePartsViewModel> {
      this.moduleUrl = 'QMS/InsertQMSPartDetails';
      return this._dataService.add(this.moduleUrl, iQmsQuotePartsViewModel);
    }
    getQmsPart(partId: number): Observable<IQmsQuotePartsViewModel> {
      this.moduleUrl = 'QMS/GetQMSPartDetailsById?partId=' + partId;
      return this._dataService.getSingle(this.moduleUrl, '');
    }
    // deleteQmsPart(id: any): Observable<IQmsQuotePartsViewModel> {
    //   this.moduleUrl = 'QMS/RemoveRFQPartFile?RfqPartId=';
    //   return this._dataService.delete( this.moduleUrl, id);
    // }
    deletePartAttachment(fileName: string,QmsQuotePartId:number): Observable<IQmsQuotePartsViewModel> {
      this.moduleUrl = 'QMS/DeleteQMSQuotePartFile?QmsQuotePartFile=' + fileName + '&QmsQuotePartId='+QmsQuotePartId;
      return this._dataService.deleteCusomer(this.moduleUrl);
    }
    getQmsQuantityParts(qmsQuoteId: number): Observable<IQmsPartQuantityList[]> {
      this.moduleUrl = 'QMS/GetQmsReviewQuoteDetails?qmsQuoteId=' + qmsQuoteId;
      return this._dataService.getAll(this.moduleUrl);
    }
    getQmsParts(qmsQuoteId: number): Observable<IQmsPartListModel[]> {
      this.moduleUrl = 'QMS/GetQMSPartsList?QuoteId=' + qmsQuoteId;
      return this._dataService.getAll(this.moduleUrl);
    }

    FinishQmsQuote(QmsQuoteId: number): Observable<IQmsQuotePartsViewModel> {
      this.moduleUrl = 'QMS/FinishQmsQuote?QmsQuoteId=' + QmsQuoteId;
      return this._dataService.add(this.moduleUrl, '');
    }

    getQMSQuoteList(iQMSQuoteListFilterViewModel: IQMSQuoteListFilterViewModel): Observable<IQMSQuoteListViewModel[]> {
      this.moduleUrl = 'QMS/GetQMSQuoteList';
      return this._dataService.add(this.moduleUrl, iQMSQuoteListFilterViewModel);
    }
    QmsQuoteEmail(Pdfmodel: IQMSQuoteReceiptPDFViewModel): Observable<any> {
      this.moduleUrl = 'QMS/QmsQuoteEmail  ';
      return this._dataService.add(this.moduleUrl, Pdfmodel);
    }
    GenerateQuotedetailsPDF(Pdfmodel: IQMSQuoteReceiptPDFViewModel): Observable<any> {
      this.moduleUrl = 'QMS/GenerateQuoteReceiptPDF  ';
      return this._dataService.add(this.moduleUrl, Pdfmodel);
    }
    GetMQSContacts(iMQSFilterViewModel: IMQSFilterViewModel): Observable<any> {
      this.moduleUrl = 'QMS/GetMQSContacts';
      return this._dataService.add(this.moduleUrl, iMQSFilterViewModel);
    }

    AddMQSContact(iMQSViewModel: IMQSViewModel): Observable<any> {
      this.moduleUrl = 'QMS/AddMQSContact';
      return this._dataService.add(this.moduleUrl, iMQSViewModel);
    }
    GetMQSDetailsById(mqsContactIdEncrypt: string): Observable<any> {
      this.moduleUrl = 'QMS/GetMQSDetailsById?MqsContactIdEncrypt=' + mqsContactIdEncrypt;
      return this._dataService.getAll(this.moduleUrl);
    }

    DeleteMQSContact(mqsContactId: any): Observable<any> {
      this.moduleUrl = 'QMS/DeleteMQSContact?MqsContactIdEncrypt=' + mqsContactId;
      return this._dataService.deleteCusomer(this.moduleUrl);
    }
    deleteQMSPart(qmsPartNo: any): Observable<any> {
      this.moduleUrl = 'QMS/DeleteQMSPart?QmsQuotePartId=';
      return this._dataService.delete( this.moduleUrl, qmsPartNo);
    }
    moveToPart(partModel: any ): Observable<any> {
      this.moduleUrl = 'QMS/MoveToQMSPartFile';
      return this._dataService.add( this.moduleUrl, partModel);
    }
    GetQMSCustomer(mqsSupplierContactId: any): Observable<any> {
      this.moduleUrl = 'QMS/GetQMSCustomer?supplierId=' + mqsSupplierContactId;
      return this._dataService.getAll(this.moduleUrl);
    }
    getGeneralActtachment( qmsQuoteId ): Observable<any> {
      this.moduleUrl = 'QMS/GetQMSQuoteGeneralAttachment?QmsQuoteId=' + qmsQuoteId ;
      return this._dataService.deletePost(this.moduleUrl, '');
    }
    moveToGeneralAttachment( iQmsQuoteGAViewModel: IQmsQuoteGAViewModel ): Observable<any> {
      this.moduleUrl = 'QMS/MoveToQMSGeneralAttachments';
      return this._dataService.add(this.moduleUrl, iQmsQuoteGAViewModel);
    }
    deletePartGeneralAttachment(fileName: string, contactId: number, qmsQuoteId: number): Observable<IQmsQuotePartsViewModel> {
      this.moduleUrl = 'QMS/RemoveQMSGeneralAttachments?fileName=' + fileName + '&LoggedInId=' + contactId + '&QmsQuoteId=' + qmsQuoteId;
      return this._dataService.deletePost(this.moduleUrl,'');
    }
    setqmsCompanyIdEncrypt(message: string) {
      this.currentQmsCompanyId.next({ text: message });
    }
    getqmsCompanyIdEncrypt(): Observable<any> {
      return this.currentQmsCompanyId.asObservable();
    }
    setqmsQuoteId(message: string) {
      this.currentQmsQuoteId.next({ text: message });
    }
    getqmsQuoteId(): Observable<any> {
      return this.currentQmsQuoteId.asObservable();
    }
    DeleteQMSQuote(id: any): Observable<any> {
      this.moduleUrl = 'QMS/DeleteQMSQuote?QmsQuoteId=';
      return this._dataService.delete( this.moduleUrl, id);
    }
    updateQMSMyQuotesPartStatus(qmsQuoteObj: any ): Observable<any>{
      this.moduleUrl = 'QMS/UpdateQMSMyQuotesPartStatus';
      return this._dataService.add(this.moduleUrl, qmsQuoteObj);
    }

    GetQMSFeeType(supplierCompanyId: number,QmsQuoteId:number): Observable<any> {
      this.moduleUrl = '/QMSFeeType?supplierCompanyId=' + supplierCompanyId+ '&qmsQuoteId='+ QmsQuoteId;
      return this._dataService.getAll(this.moduleUrl);
    }
    GetQMSFeeTypeByQuantityId(supplierCompanyId: number,partID:number,qmsQuoteIdEncrypt:string,quantityLevel:number): Observable<any> {
      this.moduleUrl = '/QMSFeeType/GetFeeTypes?supplierCompanyId=' + supplierCompanyId +
      '&qmsQuoteEncryptId=' + qmsQuoteIdEncrypt + '&partId=' +partID + '&quantityLevel='+quantityLevel;
      return this._dataService.getAll(this.moduleUrl);
    }
    setQMSFeeType( ifeeList: IFeetypeList ): Observable<any> {
      this.moduleUrl = '/QMSFeeType';
      return this._dataService.add(this.moduleUrl, ifeeList);
    }
  GetQMSProcessesData(supplierCompanyId: number,supplierId:number): Observable<any> {
    this.moduleUrl = 'Master/GetQMSProcessesData?supplierCompanyId=' + supplierCompanyId + '&supplierId=' +supplierId;
    return this._dataService.getAll(this.moduleUrl);
  }
  clearProcessSelection(supplierId:number): Observable<any> {
    this.moduleUrl ='ProcessSelection?id=';
    return this._dataService.delete(this.moduleUrl, supplierId);
  }
  setProcessSelection(obj: any): Observable<any> {
    this.moduleUrl ='ProcessSelection?id='+obj.id+'&processSelectedValue=' + obj.processSelectedValue;
    return this._dataService.add(this.moduleUrl, '');
  }
  GetQMSMaterialsData(supplierCompanyId: number,supplierId:number): Observable<any> {
    this.moduleUrl ='Master/GetQMSMaterialsData?supplierCompanyId='  + supplierCompanyId + '&supplierId=' +supplierId;
    return this._dataService.getAll(this.moduleUrl);
  }
  clearMaterialSelection(supplierId:number): Observable<any> {
    this.moduleUrl ='MaterialSelection?id='
    return this._dataService.delete(this.moduleUrl, supplierId);
  }
  setMaterialSelection(obj: any): Observable<any> {
    this.moduleUrl ='MaterialSelection?id='+obj.id+'&materialSelectedValue=' + obj.materialSelectedValue;
    return this._dataService.add(this.moduleUrl, '');
  }
  GetQMSPostProductionData(supplierCompanyId: number,supplierId:number): Observable<any> {
    this.moduleUrl = 'Master/GetQMSPostProductionData?supplierCompanyId='  + supplierCompanyId + '&supplierId=' +supplierId;
    return this._dataService.getAll(this.moduleUrl);
  }
  clearPostSelection(supplierId:number): Observable<any> {
    this.moduleUrl ='PostProdProcessSelection?id=';
    return this._dataService.delete(this.moduleUrl, supplierId);
  }
  setPostSelection(obj: any): Observable<any> {
    this.moduleUrl ='PostProdProcessSelection?id='+obj.id+'&postprodprocessSelectedValue=' + obj.postprodprocessSelectedValue;
    return this._dataService.add(this.moduleUrl, '');
  }
  setQMSQuoteStatus(qMSQuoteId:number,isClosed:number): Observable<any> {
    this.moduleUrl = '/QMS/SetQMSQuoteStatus?QMSQuoteId=' +qMSQuoteId+ '&IsClosed=' +isClosed ;
    return this._dataService.add(this.moduleUrl, '');
  }
  sendEmailCustomer(iMQSFilterViewModel: qMSQuotePDFEmailMessageViewModel): Observable<any> {
    this.moduleUrl = 'QmsQuoteEmailMessage';
    return this._dataService.add(this.moduleUrl, iMQSFilterViewModel);
  }
  GetQmsQuoteEmailMessages(qmsEmailMessagesFilterViewModel:QmsEmailMessagesFilterViewModel): Observable<any> {
    this.moduleUrl = '/QmsQuoteEmailMessage/GetQmsQuoteEmailMessages';
    return this._dataService.add(this.moduleUrl, qmsEmailMessagesFilterViewModel);
  }
  getTermsConditionFile(companyId:number, contactId:number): Observable<any> {
    this.moduleUrl = 'QmsQuoteEmailMessage?SupplierCompanyId=' +companyId+ '&SupplierContactId=' +contactId;
    return this._dataService.getAll(this.moduleUrl);
  }
  getQmsQuoteEmailMessageById(messageId: number): Observable<any> {
    this.moduleUrl = '/QmsQuoteEmailMessage/getQmsQuoteEmailMessageById?QmsEmailMessageId='  + messageId;
    return this._dataService.getAll(this.moduleUrl);
  }
  deleteQmsQuoteEmailMessages(messageList: any): Observable<any> {
    this.moduleUrl = 'QmsQuoteEmailMessage/DeleteQmsQuoteEmailMessages';
    return this._dataService.add( this.moduleUrl, messageList);
  }
  setReadUnreadMessage(updateData: qMSEmailMessagesViewModel): Observable<any> {
    this.moduleUrl = '/QmsQuoteEmailMessage';
    return this._dataService.UpdateWithoutId(this.moduleUrl, updateData);
  }
  setSettingQMSProcess(obj: any): Observable<any> {
    this.moduleUrl = 'SettingQMSProcess';
    return this._dataService.add( this.moduleUrl, obj );
  }
  setSettingQMSMaterial(obj: any): Observable<any> {
    this.moduleUrl = 'SettingQMSMaterial';
    return this._dataService.add( this.moduleUrl, obj );
  }
  setSettingQMSPostProd(obj: any): Observable<any> {
    this.moduleUrl = 'SettingQMSPostProd';
    return this._dataService.add( this.moduleUrl, obj );
  }
  removeProcess(id: number): Observable<any> {
    this.moduleUrl = 'SettingQMSProcess/DeleteQmsQuoteProcess?qmsProcessId=' + id;
    return this._dataService.add( this.moduleUrl, '' );
  }
  removeMaterial(id: number): Observable<any> {
    this.moduleUrl = 'SettingQMSMaterial/DeleteQmsQuoteMaterial?qmsMaterialId=' + id;
    return this._dataService.add( this.moduleUrl, '' );
  }
  removePostProcess(id: number): Observable<any> {
    this.moduleUrl = 'SettingQMSPostProd/DeleteQMSQuotePostProdProcess?qmsQuotePostProdProcessId=' + id;
    return this._dataService.add( this.moduleUrl, '' );
  }
  // this api is used to get notes detail by notes id
  GetQmsQuoteNotesById(qmsQuoteNotesId: number): Observable<any> {
    this.moduleUrl = 'QMSQuoteNotes?QMSQuoteNotesId=' + qmsQuoteNotesId;
    return this._dataService.getAll(this.moduleUrl);
  }

  // this api  is used to add new notes and also update the notes
  QMSQuoteAddNotes(qmsNotesTabViewModel: QMSNotesTabViewModel): Observable<any> {
    this.moduleUrl = 'QMSQuoteNotes';
    return this._dataService.add(this.moduleUrl, qmsNotesTabViewModel);
  }

  // this api is used to get list of notes
  GetQmsQuoteNotes(qmsQuoteNotesFilterViewModel: QMSQuoteNotesFilterViewModel): Observable<any> {
    this.moduleUrl = 'QMSQuoteNotes/GetQmsQuoteNotes';
    return this._dataService.add(this.moduleUrl, qmsQuoteNotesFilterViewModel);
  }

  // this api is used to delete the notes
  deleteQmsQuoteNotes(noteList: any): Observable<any> {
    this.moduleUrl = 'QMSQuoteNotes/DeleteQmsQuoteNotes';
    return this._dataService.add( this.moduleUrl, noteList);
  }


  QMSQuotePartStatus(qmsQuotePartId: number,statusId:number): Observable<any> {
    this.moduleUrl = 'QMSQuotePartStatus?qmsQuotePartId=' +qmsQuotePartId + '&StatusId=' +statusId;
    return this._dataService.UpdateWithoutId( this.moduleUrl, '');
  }

  QMSQuoteStatus(qmsQuoteId: number,statusId:number): Observable<any> {
    this.moduleUrl = 'QMSQuoteStatus?QmsQuoteId=' +qmsQuoteId + '&StatusId=' +statusId;
    return this._dataService.UpdateWithoutId( this.moduleUrl, '');
  }
  qmsGetPaymentTerms(companyId:number,supplierId):Observable<any> {
    this.moduleUrl = 'PaymentTerms?id=' +companyId+ '&supplierId=' + supplierId;
    return this._dataService.getAll( this.moduleUrl, '');
  }
  qmsGetShippingMethods(companyId:number, supplierId):Observable<any> {
    this.moduleUrl = 'ShippingMethod?id=' +companyId+'&supplierId=' + supplierId;
    return this._dataService.getAll( this.moduleUrl, '');
  }

  // Invoice Apis

   qmsQuotePartsInvoice(qmsQuoteIdEncrypt:string,qmsQuoteInvoiceId:number):Observable<any> {
    if(qmsQuoteInvoiceId==undefined || qmsQuoteInvoiceId==null){
        qmsQuoteInvoiceId = 0;
    }
    this.moduleUrl = 'QMSQuoteParts?qmsQuoteIdEncrypt=' +qmsQuoteIdEncrypt + '&qmsQuoteInvoiceId='+qmsQuoteInvoiceId;
    return this._dataService.getAll( this.moduleUrl, '');
  }
  QMSQuotePartQuantity(qmsQuotePartId:number):Observable<QMSQuotePartQuantity> {
    this.moduleUrl = 'QMSQuotePartQuantity?qmsQuotePartId=' +qmsQuotePartId;
    return this._dataService.getAll( this.moduleUrl, '');
  }
  GetQmsQuoteInvoiceUnitPrice(qmsQuotePartQuantityId:number ,qmsFeeTypeId:number):Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoice/GetQmsQuoteInvoiceUnitPrice?qmsQuotePartQuantityId=' + qmsQuotePartQuantityId +
    '&qmsFeeTypeId=' +qmsFeeTypeId;
    return this._dataService.getAll( this.moduleUrl, '');
  }
  addQMSQuoteInvoice(qmsQuoteInvoiceDetailsViewModel: QMSQuoteInvoiceDetailsViewModel): Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoice';
    return this._dataService.add( this.moduleUrl, qmsQuoteInvoiceDetailsViewModel);
  }
  addQMSQuoteInvoicePartDetails(qmsQuoteInvoiceDetailsListViewModel: QMSQuoteInvoiceDetailsListViewModel): Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoicePartDetails';
    return this._dataService.add( this.moduleUrl, qmsQuoteInvoiceDetailsListViewModel);
  }
  getInvoiceList(invoiceViewModel: InvoiceViewModel): Observable<any> {
    this.moduleUrl = 'Invoice';
    return this._dataService.add(this.moduleUrl, invoiceViewModel);
  }
  getInvoiceCompanyList(invoiceViewModel: any): Observable<any> {
    this.moduleUrl = 'CompanyInvoice';
    return this._dataService.add(this.moduleUrl, invoiceViewModel);
  }

  getQmsQuoteDetailsById(QmsQuoteIdEncrypt:string):Observable<any> {
    this.moduleUrl = 'QMS/GetQmsQuoteDetailsById?QmsQuoteIdEncrypt=' + QmsQuoteIdEncrypt;
    return this._dataService.getAll( this.moduleUrl, '');
  }

  /* this api is used to get list of Invoices. */
  getQmsQuoteInvoiceList(supplierId:number, qmsQuoteId:number):Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoice/GetQmsQuoteInvoiceList?supplierId=' + supplierId + '&qmsQuoteId=' + qmsQuoteId;
    return this._dataService.getAll( this.moduleUrl, '');
  }
  /* this api is used to delete invoce. */
  deleteQmsQuoteInvoice(qmsQuoteInvoiceId: any): Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoice/DeleteQmsQuoteInvoice?qmsQuoteInvoiceId='  + qmsQuoteInvoiceId;
    return this._dataService.add( this.moduleUrl, '');
  }
  setQmsQuoteInvoiceStatus(QmsQuoteInvoiceId: number,statusId:number): Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoice/SetQmsQuoteInvoiceStatus?QmsQuoteInvoiceId=' +QmsQuoteInvoiceId + '&statusId=' +statusId;
    return this._dataService.add( this.moduleUrl, '');
  }
  /* This api is used to generate invoice pdf. */
  generateInvoicePDF(Pdfmodel: QMSInvoicePDFViewModel): Observable<any> {
    this.moduleUrl = 'GenerateQMSInvoicePDF/GenerateInvoicePDF';
    return this._dataService.add(this.moduleUrl, Pdfmodel);
  }
  getQMSQuoteInvoice(qmsQuoteInvoiceId:number, quoteIdEncrypt:string):Observable<any> {
    this.moduleUrl = 'QMSQuoteInvoice?qmsQuoteInvoiceId=' + qmsQuoteInvoiceId
                    +"&encryptedQuoteId="+quoteIdEncrypt;
    return this._dataService.getAll( this.moduleUrl, '');
  }
  savePaymentTerm(loggedCompanyId: number,itemName:string): Observable<any> {
    this.moduleUrl = 'PaymentTerms?id='+ loggedCompanyId + "&paymentTerm=" + itemName;
    return this._dataService.add( this.moduleUrl, '');
  }
  saveShippingMethod(loggedCompanyId: number,itemName:string): Observable<any> {
    this.moduleUrl = 'ShippingMethod?id='+ loggedCompanyId + "&shippingMethod=" + itemName;
    return this._dataService.add( this.moduleUrl, '');
  }

  CloneQmsQuotePart(qmsQuotePartId: number): Observable<any> {
      this.moduleUrl = 'QMSQuoteParts/CloneQmsQuotePart?qmsQuotePartId=' + qmsQuotePartId;
      return this._dataService.add(this.moduleUrl, '');
    }

    getQMSSettingLeadTime(loggedId:number, CompanyId:number):Observable<any> {
      this.moduleUrl = 'SaveQMSSettingLeadTime?id='+ loggedId + '&supplierId=' + CompanyId;
      return this._dataService.getAll( this.moduleUrl, '');
    }
    setQMSActivityStatus(qmsActivityStatusModel:QMSActivityStatusModel):Observable<any> {
      this.moduleUrl = 'QMSQuoteActivity';
      return this._dataService.add( this.moduleUrl, qmsActivityStatusModel);
    }
    sendQmsMail(qmsMailModel:QMSMailModel):Observable<any>{
      this.moduleUrl = 'QMSInvoiceEmailMessage';
      return this._dataService.add( this.moduleUrl,qmsMailModel);
    }
    setQMSInvoiceActivity(qmsInvoiceTrackActivityViewModel:QMSInvoiceTrackActivityViewModel):Observable<any> {
      this.moduleUrl = 'QMSInvoiceTrackActivity';
      return this._dataService.add( this.moduleUrl, qmsInvoiceTrackActivityViewModel);
    }

    getSettingQMSDecimalPlaces(supplierCompanyId: number,supplierId:number): Observable<any> {
      this.moduleUrl = 'SettingQMSDecimalPlaces?SupplierCompanyId=' + supplierCompanyId + '&SupplierId=' +supplierId;
      return this._dataService.getAll(this.moduleUrl);
    }

    setSettingQMSDecimalPlaces(ContactId: number ,Id:number): Observable<any> {
    this.moduleUrl = 'SettingQMSDecimalPlaces?ContactId=' + ContactId+ '&defaultId=' +Id;
    return this._dataService.add(this.moduleUrl, '');
  }
    setTailBetaFlag(contactId: number):Observable<any> {
      this.moduleUrl = 'TrackLiveQuote?contactId=' + contactId;
      return this._dataService.add( this.moduleUrl, '');
    }
    getQuoterList(supplierCompanyId: number):Observable<any> {
      this.moduleUrl = 'QMSQuoterList?supplierCompanyId=' + supplierCompanyId;
      return this._dataService.getAll( this.moduleUrl);
    }
    getFiledMappedDropDownList():Observable<any> {
      this.moduleUrl = 'Master/GetQmsContactFields';
      return this._dataService.getAll( this.moduleUrl);
    }
    insertMappedQmsContact(obj:any):Observable<any> {
      this.moduleUrl = 'InsertMappedQmsContacts';
      return this._dataService.add( this.moduleUrl, obj);
    }

    GetQMSProbability(supplierCompanyId: number,supplierId:number): Observable<any> {
      this.moduleUrl = 'Master/GetQMSProbability?supplierCompanyId='  + supplierCompanyId + '&supplierId=' +supplierId;
      return this._dataService.getAll(this.moduleUrl);
    }

    clearQMSProbabilitySelection(supplierId:number): Observable<any> {
      this.moduleUrl ='ProbabilitySelection?id=';
      return this._dataService.delete(this.moduleUrl, supplierId);
    }


    setProbabilitySelection(obj: any): Observable<any> {
      this.moduleUrl ='ProbabilitySelection?id='+obj.id+'&probabilitySelectedValue=' + obj.probabilitySelectedValue;
      return this._dataService.add(this.moduleUrl, '');
    }

    setSettingQMSProbability(obj: any): Observable<any> {
    this.moduleUrl = 'SettingQMSProbability';
    return this._dataService.add( this.moduleUrl, obj );
  }
  removeProbability(id: number): Observable<any> {
    this.moduleUrl = 'SettingQMSProbability/DeleteQmsQuoteProbability?qmsProbabilityId=' + id;
    return this._dataService.add( this.moduleUrl, '' );
  }
    GetQMSQuoteStatus(supplierCompanyId: number,supplierId:number): Observable<any> {
      this.moduleUrl = 'Master/GetQMSQuoteStatus?supplierCompanyId='  + supplierCompanyId + '&supplierId=' +supplierId;
      return this._dataService.getAll(this.moduleUrl);
    }
    clearQMSStatusSelection(supplierId:number): Observable<any> {
      this.moduleUrl ='StatusSelection?id=';
      return this._dataService.delete(this.moduleUrl, supplierId);
    }
    setStatusSelection(obj: any): Observable<any> {
      this.moduleUrl ='StatusSelection?id='+obj.id+'&statusSelectedValue=' + obj.statusSelectionSelectedValue;
      return this._dataService.add(this.moduleUrl, '');
    }
    setSSettingQMSStatus(obj: any): Observable<any> {
      this.moduleUrl = 'SettingQMSStatus';
      return this._dataService.add( this.moduleUrl, obj );
    }
    removeQMSStatus(id: number): Observable<any> {
      this.moduleUrl = 'SettingQMSStatus/DeleteQmsQuoteStatus?qmsStatusId=' + id;
      return this._dataService.add( this.moduleUrl, '' );
    }

    GetInvoiceStartingSeqNo(supplierCompanyId: number,isCreatingInvoice:boolean): Observable<any>{
      this.moduleUrl = 'InvoiceStartingSeqNo?supplierCompanyId='+supplierCompanyId+ '&isCreatingInvoice=' +isCreatingInvoice;
      return this._dataService.getAll(this.moduleUrl, '');
    }
   setInvoiceStartingSeqNo(supplierCompanyId:number,startingSeqNo:number): Observable<any> {
      this.moduleUrl = 'InvoiceStartingSeqNo?companyId=' +supplierCompanyId+ '&startingSeqNo=' +startingSeqNo;
      return this._dataService.add(this.moduleUrl,'');
    }
    getCheckIsInvoiceExist(supplierCompanyId: number): Observable<any>{
      this.moduleUrl = 'CompanyInvoice/IsInvoiceExistForCompany?companyId='+supplierCompanyId;
      return this._dataService.getAll(this.moduleUrl, '');
    }
    isInvoiceNoRepeated(supplierContactId:number, supplierCompanyId:number,invoiceNo:number,qmsQuoteInvoiceId:number):Observable<any> {
      this.moduleUrl = 'CompanyInvoice/IsInvoiceNoRepeated?supplierContactId='+supplierContactId + '&supplierCompanyId='+supplierCompanyId +'&invoiceNo='+invoiceNo+'&qmsQuoteInvoiceId='+qmsQuoteInvoiceId;
      return this._dataService.getAll( this.moduleUrl, '');
    }
    invoicePartQuantityInfo(obj:any):Observable<any> {
      this.moduleUrl = 'InvoicePartQuantityInfo';
      return this._dataService.add( this.moduleUrl, obj);
    }
    getInvoicePartQuantityInfo(invoiceId: number,qmsPartId:number): Observable<any> {
      this.moduleUrl = 'InvoicePartQuantityInfo?invoiceId='  + invoiceId + '&qmsPartId=' +qmsPartId;
      return this._dataService.getAll(this.moduleUrl);
    }

    getQmsPartQtyFeeTypeCost(qmsQuotePartQtyId: number,feeTypeId:number,invoiceId:number): Observable<any> {
      this.moduleUrl = 'QMSFeeType/GetQmsPartQtyFeeTypeCost?qmsQuotePartQtyId=' + qmsQuotePartQtyId +
      '&feeTypeId=' + feeTypeId + '&invoiceId=' +invoiceId;
      return this._dataService.getAll(this.moduleUrl);
    }

    getQmsPartSpecialFeeTypeCost(qmsQuotePartId: number,feeTypeId:number,invoiceId:number): Observable<any> {
      this.moduleUrl = 'QMSFeeType/GetQmsPartSpecialFeeTypeCost?qmsQuotePartId=' + qmsQuotePartId +
      '&feeTypeId=' + feeTypeId + '&invoiceId=' +invoiceId;
      return this._dataService.getAll(this.moduleUrl);
    }
}



