import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  ElementRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  ConfirmationService
} from 'primeng/api';
import {
  ToastrService
} from 'ngx-toastr';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  QMSQuoteInvoiceTabViewModel
} from './invoiceModel';
import {
  IQMSStatus,
  QmsQuotePartInvoice,
  QMSInvoicePDFViewModel,
  QMSMailModel,
  QMSInvoiceTrackActivityViewModel
} from '../../../../../core/models/qmsModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  ApiService
} from '../../../../../__Services/api-service/api.service';
import {
  InvoicePreviewViewModel
} from '../../../invoice-pdf/InvoicePreviewViewModel';
import {
  appConstants
} from '../../../../../core/config/constant';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-invoice-tab',
  templateUrl: './invoice-tab.component.html',
  styleUrls: ['./invoice-tab.component.scss'],
  providers: [ApiService, InvoicePreviewViewModel]
})
export class InvoiceTabComponent implements OnInit {
  @Input() qmsNumber: any;
  mqsContactIdEncrypt: string;

  @Input() qmsQuoteIdEncrypt: any;
  @Output() customerData = new EventEmitter < any > ();
  @Output() customerMailDetail = new EventEmitter < any > ();
  // @ViewChild('invoiceNo') invoiceNo: ElementRef;
  invoiceId: number;
  isInvoicesAvailable: boolean;
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  totalRow: number;
  isLoader: boolean;
  pageStart = 1;
  pagesIndex: Array < number > ;
  items: QMSQuoteInvoiceTabViewModel[];
  qmsQuoteInvoiceTabViewModel: QMSQuoteInvoiceTabViewModel[];
  invoiceStatusList: IQMSStatus[];
  qmsMailModel: QMSMailModel;
  isMailed: boolean;
  qmsInvoiceTrackActivityViewModel: QMSInvoiceTrackActivityViewModel;
  decimalValueDefault: number;
  @ViewChild('qmsBeta',{static:false}) qmsBeta: TemplateRef < any > ;
  isInvoiceCreateFlag: boolean;
  isButtonClicked: boolean = false;
  constructor(private router: Router, private _qmsService: QmsService,
    private confirmationService: ConfirmationService, private _rfqService: RfqService,
    private _toastr: ToastrService, private route: ActivatedRoute, private _masterService: MasterService,
    private _router: ActivatedRoute,
    private rest: ApiService,
    public invoicePreviewData: InvoicePreviewViewModel,
    private modalService: NgbModal) {}

  ngOnInit() {

    this.invoiceId = 1001;
    this.isInvoiceCreateFlag = false;
    this.decimalValueDefault = null;
    if (appConstants.settingDefault.decimalValueDefault == null || appConstants.settingDefault.decimalValueDefault == undefined) {
      this._masterService.getDefaultQmsDecimalPlaces(this.loggedId).subscribe(res => {
        if (!res.isError) {
          appConstants.settingDefault.decimalValueDefault = res.data;
          this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;

        }
      })
    } else {
      this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;

    }
    this.mqsContactIdEncrypt = '';
    this.isInvoicesAvailable = false;
    this.invoiceStatusList = [];
    this.isMailed = false;
    this.qmsMailModel = {
      qmsQuoteInvoicePDFHtml: '',
      qmsQuoteContactId: 0,
      qmsQuoteInvoiceId: 0,
      qmsQuoteInvoiceSubject: '',
      qmsQuoteInvoiceMessageBody: '',
      qmsQuoteSupplierEmailId: '',
      receiverName: '',
      supplierId: this.loggedId,
      qmsQuoteId: 0
    }
    this.qmsInvoiceTrackActivityViewModel = {
      qmsQuoteId: 0,
      qmsQuoteInvoiceId: 0,
      qmsQuoteActivityId: 0,
      // activityDate : '',
      createdBy: 0
    }
    this.getInvoiceStatus();
    this.getInvoiceList();
    this.getInvoiceNumber();

    this._router.snapshot.queryParams['qmsQuoteId'];
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  isSidePanel() {
    return this._qmsService.get('showSidePanel');
  }
  /* This function is used to open customer drawer. */
  openCompanyDrawer(qmsCompanyIdEncrypt, event) {
    event.stopPropagation();
    this.mqsContactIdEncrypt = qmsCompanyIdEncrypt;
    this._qmsService.set(false, 'isQuoteReviewDrawer');
    this._qmsService.set(true, 'showSidePanel');
    setTimeout(() => {
      this._qmsService.set(true, 'showSidePanel');
      this._qmsService.set(true, 'isCompanyDrawer');
      this.customerData.emit(qmsCompanyIdEncrypt);
    }, 100);
  }
  /* This function is used to delete invoice. */
  deleteInvoice(qmsQuoteInvoiceId) {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this Invoice?.',
      header: 'Delete Invoice',
      icon: null,
      accept: () => {
        this._qmsService.deleteQmsQuoteInvoice(qmsQuoteInvoiceId).subscribe(
          result => {
            if (!result['isError']) {
              this._toastr.success('Invoice is deleted successfully.', 'Success!');
              this.getInvoiceList();
            } else {
              // this._toastr.error(result.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          }
        );
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }
  /* This function is used to navigate to create invoice list */
  onNavigate(invId) {
    this.checkIsInvoiceExist(invId);
    // if(this.isInvoiceCreateFlag){
    //   this.router.navigate(['/qms/createinvoice'], {
    //     queryParams: {
    //       qmsQuoteId: this.qmsQuoteIdEncrypt,
    //       invoiceId: invId
    //     }
    //   });
    // } else{
    //   this.modalService.open( this.qmsBeta, {backdrop:'static'} );
    // }
  }
  get LoggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  /* This function is uded to get the invoice list. */
  getInvoiceList() {
    this.items = [];
    this.isLoader = true;
    const qmsQuoteId = Number(this.route.snapshot.params['id']);
    this._qmsService.getQmsQuoteInvoiceList(this.LoggedId, qmsQuoteId).subscribe(
      result => {
        if (!result['isError']) {
          this.qmsQuoteInvoiceTabViewModel = result.data;
          if (this.qmsQuoteInvoiceTabViewModel.length !== 0) {
            this.totalRow = result.totalRecords;
            this.items = this.qmsQuoteInvoiceTabViewModel;
            this.isLoader = false;
            this.isInvoicesAvailable = true;
          } else {
            this.totalRow = 0;
            this.isLoader = false;
            this.items = [];
            this.isInvoicesAvailable = false;
          }
        } else {
          this.totalRow = 0;
          this.isLoader = false;
          this.items = [];
          this.isInvoicesAvailable = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
        this.isInvoicesAvailable = false;
        this.items = [];
        this.totalRow = 0;
      },
      () => {}
    );
  }
  getInvoiceStatus() {
    this._masterService.getQmsQuoteInvoiceStatus().subscribe(res => {
      if (res['isError'] === false) {
        this.invoiceStatusList = res['data'];
      } else {
        this.invoiceStatusList = [];
      }
    });
  }
  changeQmsInvoiceStatus(statusId, $event) {
    this._qmsService.setQmsQuoteInvoiceStatus(statusId, $event.target.value).subscribe(res => {
      if (res['isError'] === false) {
        this._toastr.success('QMS Invoice Status Updated Successfully.', 'Success!');
      }
    })
  }

  quoteParts: QmsQuotePartInvoice[] = [];
  qtysCollection: any[];
  qtyUnitCollction: any[];

  showInvoicePreview(quoteId, invoiceId, isMail, qmsContactId, customerName, qmsQuoteId) {
    this.quoteParts = [];
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteId = qmsQuoteId;
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteInvoiceId = invoiceId;
    this.rest.get('QMSQuoteInvoice?qmsQuoteInvoiceId=' + invoiceId)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.invoicePreviewData.customerId = response.data.qmsCustomerId;
            this.invoicePreviewData.quoteReferenceNo = response.data.referenceNo;
            this.invoicePreviewData.invoiceName = response.data.invoiceName;
            this.invoicePreviewData.invoiceNumber = response.data.invoiceNo;
            this.invoicePreviewData.issueDate = response.data.invoiceDate;
            this.invoicePreviewData.ordernumber = response.data.purchaseOrderNumber;
            this.invoicePreviewData.notes = response.data.notes;
            this.invoicePreviewData.invoiceItems = [];

            this.rest.get('QMSQuoteParts?qmsQuoteIdEncrypt=' + quoteId +
                '&qmsQuoteInvoiceId=' + invoiceId +
                '&includeExcludedPart=false')
              .subscribe(
                (quoteResponse: {
                  data: any,
                  isError: boolean,
                  message: any,
                  totalRecords ? : number
                }) => {
                  if (!quoteResponse.isError) {
                    quoteResponse.data.forEach(qData => {
                      let invoiceItem = {
                        "qmsQuoteInvoicePartId": qData.qmsQuoteInvoicePartId,
                        "qmsQuotePartId": qData.qmsQuotePartId,
                        "partName": qData.partName,
                        "partNumber": qData.partNumber,
                        "partDetails": {
                          "partQuantities": [],
                          "specialFee": {}
                        }
                      }


                      this.rest.get('InvoicePartSpecialFeesInfo?invoiceId=' + invoiceId + '&qmsPartId=' + qData.qmsQuotePartId + '&qmsQuoteInvoicePartId=' + qData.qmsQuoteInvoicePartId)
                        .subscribe(
                          (response) => {
                            // debugger;
                            if (!response.isError) {
                              if (response.data.specialFeesList != null && response.data.specialFeesList != undefined && response.data.specialFeesList.length) {
                                let tempObj = {
                                  partID: qData.qmsQuotePartId,
                                  feeTypeArray: [],
                                  sum: 0,
                                }
                                response.data.specialFeesList.forEach(element => {
                                  let feeObject = {
                                    feeId: element.feeTypeId,
                                    cost: element.value,
                                    feeName: element.feeType,
                                  }
                                  tempObj.sum += element.value;
                                  tempObj.feeTypeArray.push(feeObject);
                                });
                                invoiceItem.partDetails.specialFee = tempObj;
                              }
                            }
                          });


                      this.rest.get('InvoicePartQuantityInfo/GetInvoicePartQtyInfo?invoiceId=' + invoiceId +
                          '&qmsPartId=' + qData.qmsQuotePartId)
                        .subscribe(
                          (qtyResponse: {
                            data: any,
                            isError: boolean,
                            message: any,
                            totalRecords ? : number
                          }) => {
                            if (!qtyResponse.isError) {
                              console.log('pdf', qtyResponse);
                              // qtyResponse.data.partQuantities.forEach((partQty: {selectedQuantityId:number, selectedUnitId: number, qmsQuotePartId:number, selectedUnitname:string, selectedQuantityLevel:any, fees: any[]; })=>{
                              //alert(partQty.selectedQuantityLevel);
                              // this.rest.get('/QMSFeeType/GetFeeTypes?supplierCompanyId=' + localStorage.getItem('loggedCompanyId')
                              // + '&qmsQuoteEncryptId=' + this.qmsQuoteIdEncrypt
                              // + '&partId='+ qData.qmsQuotePartId
                              // + '&quantityLevel=' + partQty.selectedQuantityLevel)
                              // .subscribe(
                              // (feesResponse: { data: any, isError:boolean, message:any, totalRecords?:number }) => {
                              //     if(!feesResponse.isError)
                              //     {
                              //         this.rest.get('QMSQuotePartQuantity?qmsQuotePartId='+ qData.qmsQuotePartId)
                              //         .subscribe(
                              //         (qtyUnitResponse: { data: any, isError:boolean, message:any, totalRecords?:number }) => {
                              //             if(!qtyUnitResponse.isError)
                              //             {
                              //               // debugger;
                              //                 this.qtyUnitCollction = [];
                              //                 qtyUnitResponse.data.forEach(qtyUnit => {
                              //                     let existUnit =  this.qtyUnitCollction.find(x=>x.value==qtyUnit.partQtyUnitId);
                              //                     if(existUnit==null || this.qtyUnitCollction.length==0)
                              //                     {
                              //                         //alert(partQty.selectedQuantityLevel);
                              //                         //alert(partQty.selectedUnitId)
                              //                         this.qtyUnitCollction.push(
                              //                             {
                              //                                 value: qtyUnit.partQtyUnitId,
                              //                                 text: qtyUnit.partQtyUnit,
                              //                                 isRemovable: false,
                              //                                 isEditable: false,
                              //                                 level: qtyUnit.qtyLevel,
                              //                                 quantity: qtyUnit.partQty
                              //                             }
                              //                         )

                              //                     }
                              //                 });
                              //                 let _selectedQtyId = partQty.selectedQuantityLevel;
                              //                 if(partQty.selectedQuantityLevel==-1)
                              //                 {
                              //                     partQty.selectedQuantityId = partQty.selectedQuantityLevel;
                              //                     let _selectedUnitInfo = this.qtyUnitCollction.find(x=>x.value==partQty.selectedUnitId);
                              //                     partQty.selectedUnitname = _selectedUnitInfo.text;
                              //                 }
                              //                 else
                              //                 {
                              //                     let _selectedQty = this.qtyUnitCollction.find(x=>x.level==partQty.selectedQuantityLevel);
                              //                     _selectedQtyId = _selectedQty.value;
                              //                     partQty.selectedQuantityId = _selectedQtyId;
                              //                     partQty.selectedUnitname = _selectedQty.text;
                              //                 }
                              //                 //alert(partQty.selectedUnitname);


                              //                 // if(partQty.selectedQuantityLevel==-1)
                              //                 // {
                              //                 //     partQty.selectedQuantityId = qtyValue.selectedQuantityLevel;
                              //                 //     let _selectedUnitInfo = this.qtyUnitCollction.find(x=>x.value==qtyValue.selectedUnitId);
                              //                 //     qtyValue.selectedUnitname = _selectedUnitInfo.text;

                              //                 // }
                              //                 // else
                              //                 // {
                              //                 //     let _selectedQty = this.qtysCollection.find(x=>x.level==qtyValue.selectedQuantityLevel);
                              //                 //     _selectedQtyId = _selectedQty.value;
                              //                 //     qtyValue.selectedQuantityId = _selectedQtyId;
                              //                 //     qtyValue.selectedUnitname = _selectedQty.text.split(' ')[1];
                              //                 // }




                              //                 let qtyUnitInfo = this.qtyUnitCollction.find(x=>x.value==partQty.qmsQuotePartId);
                              //                 if(qtyUnitInfo != undefined && qtyUnitInfo != null){
                              //                   partQty.selectedUnitname = qtyUnitInfo.text;
                              //                 }

                              //             }
                              //         });



                              //         //partQty.selectedUnitname = feesResponse.data.find(x=>x.qmsFeeTypeId==)
                              //         partQty.fees.forEach((fee: {selectedFeeTypeId:number, amount:number, feeTypes:any[]}) => {
                              //             fee.selectedFeeTypeId = fee.selectedFeeTypeId;
                              //             fee.amount = fee.amount;
                              //             fee.feeTypes=[];
                              //             feesResponse.data.forEach(feeType => {
                              //                 fee.feeTypes.push({
                              //                     'value': feeType.qmsFeeTypeId,
                              //                     'text': feeType.feeType
                              //                 })
                              //             });

                              //             // fee.feeTypes.push({
                              //             //     'value' : feesResponse.data.qmsFeeTypeId,
                              //             //     'text' : feesResponse.data.feeType
                              //             // });

                              //             if(isMail){
                              //               this.isLoader = true;
                              //               setTimeout(()=>{
                              //                 this.sendMail(invoiceId, qmsContactId, customerName, qmsQuoteId);
                              //               },4000);

                              //             }
                              //         });
                              //     }
                              // });
                              // });
                              if (isMail) {
                                this.isLoader = true;
                                setTimeout(() => {
                                  this.sendMail(invoiceId, qmsContactId, customerName, qmsQuoteId);
                                }, 4000);

                              }
                              invoiceItem.partDetails.partQuantities = qtyResponse.data.partQuantities;
                              this.invoicePreviewData.invoiceItems.push(invoiceItem);
                            }
                          });



                    });
                  }
                });
          }
        })
    this._qmsService.set(false, 'isMessageQmsDrawer');
  }

  pdfButtonTitle: string = "Generate PDF";

  PdfModel: QMSInvoicePDFViewModel;
  generateInvoicePDF() {
    this.pdfButtonTitle = "Please wait!!!";
    this.PdfModel = new QMSInvoicePDFViewModel();
    const data = document.getElementById('contentToConvertPDF').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlInvoicePDF = newdata;
    this.PdfModel.invoiceId = this.invoicePreviewData.invoiceNumber;
    this._qmsService.generateInvoicePDF(this.PdfModel).subscribe(
      result => {
        if (!result['isError']) {
          this.setQMSInvoiceActivity();
          window.open(result['data']['privateFileFileName'], '_blank');
          //this.isPdfModel = false;
          this._toastr.success(result['data']['errorMessage'], 'Success!');
          // this.isInvoicePdfDownload.emit(true);
        } else {
          //this.isPdfModel = false;
          this._toastr.error(result['data']['errorMessage'], 'Error!');
        }
        this.pdfButtonTitle = "Generate PDF";
      },
      error => {
        this.pdfButtonTitle = "Generate PDF";
        //this.isPdfModel = false;
      },
      () => {}
    );
  }
  sendMail(invoiceId, qmsContactId, customerName, qmsQuoteId) {
    this.isMailed = true;
    // debugger;
    const data = document.getElementById('contentToConvertPDF').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.isMailed = false;
    this.qmsMailModel.qmsQuoteInvoicePDFHtml = newdata;
    this.qmsMailModel.qmsQuoteInvoiceId = invoiceId;
    this.qmsMailModel.qmsQuoteContactId = qmsContactId;
    this.qmsMailModel.qmsQuoteInvoiceSubject = "";
    this.qmsMailModel.qmsQuoteInvoiceMessageBody = "";
    this.qmsMailModel.receiverName = customerName;
    this.qmsMailModel.qmsQuoteId = qmsQuoteId;
    this.qmsMailModel.qmsQuoteSupplierEmailId = localStorage.getItem('User2');
    this.customerMailDetail.emit(this.qmsMailModel);
    this.isLoader = false;
    this._qmsService.set(true, 'showSidePanel');
    this._qmsService.set(true, 'isMessageSendDrawer');
    this._qmsService.set(false, 'isMessageDrawer');
    // this._qmsService.sendQmsMail(this.qmsMailModel).subscribe(
    //   response=>{
    //     if(!response.isError){
    //       this.isLoader = false;
    //       this._toastr.success('Email send', 'Success!');
    //     }
    //   }
    // );
  }
  setQMSInvoiceActivity() {
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteActivityId = 104;
    this.qmsInvoiceTrackActivityViewModel.createdBy = this.loggedId;
    this._qmsService.setQMSInvoiceActivity(this.qmsInvoiceTrackActivityViewModel).subscribe(
      response => {
        // // debugger;
      },
      error => {}
    );
  }
  getInvoiceNumber() {
    this._qmsService.GetInvoiceStartingSeqNo(this.loggedCompanyId, false).subscribe(
      res => {
        if (!res.error) {
          if (res.data != null && res.data != undefined && res.data != '') {
            this.invoiceId = res.data;
          } else {
            this.invoiceId = 1001;
          }

        } else {
          this.invoiceId = 1001;
        }
      }
    );
  }
  saveInvoiceNumber() {
    this._qmsService.setInvoiceStartingSeqNo(this.loggedCompanyId, this.invoiceId).subscribe(
      res => {
        if (!res.error) {
          this._toastr.success('QMS Invoice start number added successfully.', 'Success!');
          this.router.navigate(['/qms/createinvoice'], {
            queryParams: {
              qmsQuoteId: this.qmsQuoteIdEncrypt,
              invoiceId: null
            }
          });
        }
      }
    );
  }
  checkIsInvoiceExist(invId) {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      this._qmsService.getCheckIsInvoiceExist(this.loggedCompanyId).subscribe(
        res => {
          if (!res.error) {
            this.isInvoiceCreateFlag = res.data;
            if (this.isInvoiceCreateFlag) {
              this.router.navigate(['/qms/createinvoice'], {
                queryParams: {
                  qmsQuoteId: this.qmsQuoteIdEncrypt,
                  invoiceId: invId
                }
              });
            } else {
              this.modalService.open(this.qmsBeta, {
                backdrop: 'static'
              });
            }
          }
          this.isButtonClicked = false;
        }, error => {
          this.isButtonClicked = false;
        }
      );
    }
  }
}
