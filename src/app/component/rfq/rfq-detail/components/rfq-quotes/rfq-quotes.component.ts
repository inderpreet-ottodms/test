import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  IBuyerQuotesList,
  IRFQPartQuantityQuote,
  IRFQPartQuantityQuoteContainer,
  ICustomRFQPartQuantityQuote,
  IQuotePartList,
  LocalAwardedManufractureList,
  LocalAwardedParts,
  LocalAwardedPartsQuantityList,
  IBuyerQuotesViewModel,
  NPartArray,
  DownloadAllFilesViewModel,
  DownloadQuotesToExcelViewModel,
  IFeedbackBuyerViewModel,
  IFeedbackSaveViewModel,
  RfqContinueAwardingViewModel,
  ContinueAwardingPriceData,
  AwardingModelQuoteDetailsRequestViewModel,
  IUploaadedFileNameList,
  IUploaadedFileName,
  IPartsViewModel
} from '../../../../../core/models/rfqModel';
import {
  ILeadUserViewModel
} from '../../../../../core/models/profileModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  dateFormatPipe
} from '../../../../../shared/customPipe/dateFormat';
import {
  IQuantityUnit
} from '../../../../../core/models/globalMaster';
import { FileUploader } from 'ng2-file-upload';
import {
  environment
} from '../../../../../../environments/environment';
import { Http, Headers } from '@angular/http';
import { uploadFileNDA } from '../../../../../../constants/url-constant';
const URL = '';
@Component({
  selector: 'app-rfq-quotes',
  templateUrl: './rfq-quotes.component.html',
  styleUrls: ['./rfq-quotes.component.scss',
    '../../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [ConfirmationService]
})
export class RfqQuotesComponent implements OnInit {
  @Output() closeModelEventHandler = new EventEmitter < any > ();
  // Variable Declarations
  @Input('rfqId') rfqId: number;
  @Input('createDate') createDate: any;
  @Input('isDashQuote') isDashQuote: any;
  @Input('rfqStatus') rfqStatus: any;
  @Input('withOrderManagement') withOrderManagement:any
  avgNoOfStars:any;
  hasBaseDropZoneOver = false;
  saveFeedbackValue: IFeedbackSaveViewModel[];
  feedbackQuantity: IFeedbackBuyerViewModel[];
  searchFilterValue: string;
  totalPartCount: number;
  isAward: boolean;
  isAwardStep2: boolean;
  iPartUploadedFileNameList: IUploaadedFileNameList;
  rfqPartTotal: number;
  cloneRfqName: string;
  sortFilterValue: string;
  dropDownID: any;
  isAwardDone: boolean;
  isReqoute:boolean;
  LocalAwardedManufractureList: LocalAwardedManufractureList;
  LocalAwardedManufractureListColl: LocalAwardedManufractureList[];
  OriginalLocalAwardedManufractureListColl: LocalAwardedManufractureList[];
  LocalAwardedParts: LocalAwardedParts;
  LocalAwardedPartsQuantity: LocalAwardedPartsQuantityList;
  LocalAwardedPartsQuantityColl: LocalAwardedPartsQuantityList[];
  LocalAwardedPartsColl: LocalAwardedParts[];
  isLoader: boolean;
  isLoader1: boolean;
  isRecAvailable: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  activeStatusFilterBtn: string;
  isCreateRFQBodyBtnDisabled: boolean;
  isRFQInProgBodyBtnDisabled: boolean;
  toggleNoRFQBodyBtn = true;
  selectedAll: boolean;
  iQuotePartList: IQuotePartList[];
  iQuotePart: IQuotePartList;
  iRFQPartQuantityQuoteContainerColl: IRFQPartQuantityQuoteContainer[];
  iRFQPartQuantityQuoteColl: IRFQPartQuantityQuote[];
  iCustomRFQPartQuantityQuoteColl: ICustomRFQPartQuantityQuote[];
  iBuyerQuotesListColl: IBuyerQuotesList[];
  chkBoxCountArr: IBuyerQuotesList[];
  selectedRowCount: number;
  activeTopBtns: boolean;
  currentOpenQuoteId: number;
  currentOpenQuoteisRfqResubmitted: boolean;
  currentOpenContactId: number;
  highestQtyPresent: number;
  toggleManufacturer: boolean;
  awardQuoteIds: number[];
  newAwardQuoteIds: number[];
  awardRFQPartQuantityQuote: IRFQPartQuantityQuote;
  iFilteredRFQViewModelColl: IBuyerQuotesList[];
  iBuyerQuotesViewModel: IBuyerQuotesViewModel;
  Downloadallfiles: DownloadAllFilesViewModel;
  items: IBuyerQuotesList[];
  isCencel2: boolean;
  isAwardBtn: boolean;
  isDeclineBtn: boolean;
  // Variable Declarations Ends
  toggle1: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  message: string;
  messageAttachment: string[];
  iLeadUserViewModel: ILeadUserViewModel;
  activeStatusFilterBtn1: string ="Upload My Own";
  // new award flow
  nextBtn: boolean;
  NPartArrayColl: NPartArray[];
  NPartArray: NPartArray;
  NPartQuantity: LocalAwardedPartsQuantityList;
  NPartQuantityColl: LocalAwardedPartsQuantityList[];
  temp: string[];
  csvModel = new DownloadQuotesToExcelViewModel();
  isCsvLoader = false;
  continueAwardingPriceData: ContinueAwardingPriceData;
  rfqContinueAwardingViewModel: RfqContinueAwardingViewModel[];
  isAwardedButtonClicked = false;
  isDeclienModel: boolean = false;
  isRetractModel: boolean = false;
  btnConfirmationHeading: string = '';
  currentrfqPartIdString: any;
  modalReference: any;
  isAwardSupplierDrawerOpen: boolean = false;
  supplierList: any = [];
  @ViewChild('content',{static:false}) errorCSVModal: TemplateRef < any > ;
  partsRequestViewModel: AwardingModelQuoteDetailsRequestViewModel;
  quoteReferenceNumber: any;
  supplierPaymentTerm: string = '';
  iQuantityUnitColl: IQuantityUnit[] = [];
  isAwardSubmitted: boolean = false
  isAwardedStatusTileData: boolean = false;
  isFirstTabCompleted: boolean = false;
  isSecondTabCompleted: boolean = false;
  isUploadMyOwnFile:boolean = false;
  partDetailUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'partfiles',
  });
  uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  isAttachmentsLoading: number;
  partFileAddedError: boolean = false;
  iPartUploadedFileName: IUploaadedFileName;
  deliveryDate: boolean;
  iPartsViewModel: IPartsViewModel;
  isFileDownloaded: number;
  myDate = new Date;
  // tslint:disable-next-line:max-line-length
  isSendMfgStandard:boolean = true
  purchaseOrder: any;
  fileName: string;
  showAwardAllPopup: boolean = false;
  singleAwardModal: boolean = false;
  partId: any;
  filterOneSup: IBuyerQuotesList[];
 
  constructor(private _Http: Http,private _rfqService: RfqService, private modalService: NgbModal,
    private confirmationService: ConfirmationService, private _toastr: ToastrService, private _masterService: MasterService) {
    this.csvModel = new DownloadQuotesToExcelViewModel();
    this.isCsvLoader = false;
    this.chkBoxCountArr = [];
    this.NPartArrayColl = [];
    this.NPartQuantityColl = [];
    this.selectedRowCount = 0;
    this.message = '';
    this.messageAttachment = [];
    this.isDeclineBtn = false;
    this.isAwardDone = false;
    this._rfqService.set([], 'awardQuoteIds');
    this.isAwardBtn = false;
    this.currentOpenQuoteId = 0;
    this.currentOpenQuoteisRfqResubmitted = false;
    this.currentOpenContactId = 0;
    this.LocalAwardedManufractureListColl = [];
    this.activeTopBtns = false;
    this.iRFQPartQuantityQuoteContainerColl = [];
    this.OriginalLocalAwardedManufractureListColl = [];
    this.iRFQPartQuantityQuoteColl = [];
    this.iQuotePartList = [];
    this.iCustomRFQPartQuantityQuoteColl = [];
    this.isRecAvailable = false;
    this.iBuyerQuotesListColl = [];
    this.LocalAwardedPartsColl = [];
    this.isAward = false;
    this.isLoader = false;
    this.isLoader1 = false;
    this.highestQtyPresent = 1;
    this.toggleManufacturer = false;
    this.awardQuoteIds = [];
    this.sortFilterValue = '1';
    this.activeStatusFilterBtn = 'All';
    this.isCencel2 = false;
    this.totalPartCount = 0;
    this.isFileDownloaded = 0;
    this.newAwardQuoteIds = [];
    this.LocalAwardedPartsQuantityColl = [];
    this.initLocalAwardedParts();
    this.initLocalAwardedManufractureList();
    this.initLocalAwardedParts();
    this.initLocalAwardpartQuantity();
    this.uploadPartImages();
    this.toggle1 = false;
    this.toggle2 = false;
    this.toggle3 = false;
    this.toggle4 = false;
    this.toggle5 = false;

    this.temp = [];
    this.initNPartArray();
    this.initNPartQuantity();
    this.iPartUploadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iPartUploadedFileNameList = {
      FileNameList: []
    };
    this.uploader.queue.length = 0;
  }
  uploadPartImages() {
    this.uploader.onAfterAddingAll = (fileItem) => {
      // debugger;
      console.log('uploadPartImages', fileItem); 
      this.uploadPartDetailsFiles1(fileItem);
    }; 
  }
  uploadPartDetailsFiles1(fileItem) {   
   // for (const entry of fileItem) {

      const file = fileItem[0]._file;
      // debugger;
      if(this.iPartUploadedFileNameList.FileNameList.length === 0 && fileItem[0]._file.type==="application/pdf"){
      if (fileItem[0].isUploaded === false) {
        ++this.isAttachmentsLoading;
      //   debugger;
      console.log(file, 'file')
        this.upload(file).subscribe(res => {
          // debugger;
          const result = JSON.parse(res['_body']);
          console.log(result, 'result')
          const fName = result['fileName'];
          console.log(fName, 'fName')
          // debugger;
          fileItem[0].isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.iPartUploadedFileName.CompleteFileName = fName;
          --this.isAttachmentsLoading;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          this.iPartUploadedFileName = {
            oFileName: '',
            CompleteFileName: ''
          };
          // this.arr = [];
          this.partDetailUploader.queue = [];
        });
      }

      if (this.deliveryDate === false) {
        this.iPartsViewModel.createNewPart = true;
      }
  //  }
    } else {
      this.partDetailUploader.queue = [];
    //  this._toastr.error('Please select PDF file only', 'Error!');
    }
  }

  sendMfGStandStatus(){
    this.isSendMfgStandard = true
  }
  uploadMyOwnStatus(){
    this.isSendMfgStandard = false
  }

  initNPartArray() {
    this.NPartArray = {
      isAward: false,
      manId: 0,
      manName: '',
      npsScore: 0,
      partName: '',
      partNumber: '',
      quantityList: [],
      rfqPartId: 0,
      rfqQuoteItemsId: 0,
      noOfStars: 0,
      price: null,
      unit: null,
      isRfqStatus: null,
      supplierList:[]
    };
  }
  initNPartQuantity() {
    this.NPartQuantity = {
      quantityDetails: '',
      rfqQuoteItemsId: 0
    };
  }
  initLocalAwardedParts() {
    this.LocalAwardedParts = {
      rfqPartName: '',
      rfqPartNumber: '',
      rfqQuoteItemsId: 0,
      rfqPartId: 0,
      isAward: true,
      quantityList: []
    };
  }
  initLocalAwardpartQuantity() {
    this.LocalAwardedPartsQuantity = {
      quantityDetails: '',
      rfqQuoteItemsId: 0
    };
  }
  initLocalAwardedManufractureList() {
    this.LocalAwardedManufractureList = {
      awardedPart: [],
      manName: '',
      manId: 0,
      isPartPresent: true,
      npsScore: null
    };
  }

  initpartQuote() {
    this.iQuotePart = {
      partId: 0,
      partName: '',
      partNumber: '',
      rfqPartId: 0
    };
  }
  isAwartdBtnStatus() {
    if (this.LocalAwardedManufractureListColl.filter(m => m.isPartPresent === true).length === 0) {
      return true;
    } else {
      return false;
    }

  }

  awardQuote() {
    this.isAward = true;
    this._rfqService.set(this.chkBoxCountArr, 'contactListForCompare');
    this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');

  }
  photoIds:any [];
  private onDropModel(args: any): void {
    let [el, target, source] = args;
    let elem = target.children;
    this.photoIds = [];
    for (let index = 0; index < elem.length; index++) {
      this.photoIds.push(elem[index].dataset.messageId);
    }
    // this.setPhotoSequence();
    console.log(target);

  }
  ngOnInit() {
    this.purchaseOrder = "PO-"+this.rfqId;
    // this.rfqId = this.currentRfqId;
    this.iBuyerQuotesViewModel = {
      rfqId: this.rfqId,
      contactId: this.loggedId,
      pageSize: 0,
      pageNumber: 0,
      searchText: '',
      isRfqResubmitted: false,
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true
    };
    this.iLeadUserViewModel = {
      leadInteractionType: 0,
      contactId: 0,
      companyId: 0,
      ipAddress: '',
      errorMessage: '',
      result: false,
      leadId: 0,
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      emailSubject: "",
      emailMessage: "",
      companyName: ""
    };
    // this.getSupplierList();
    this.initAwardModel();
    this.getBuyerQuotingList();
    this.selectedFeedback();
    this.getQuantity();
  }
  initPartsModel() {
    this.partsRequestViewModel = {
      rfqId: 0,
      rfqPartId: 0,
      contactIds: [],
      quantityLevel: 0,
      isRfqResubmitted: false
    }
  }
  getSupplierList(rfqPartId) {
    return new Promise((resolve, reject) => {
      this._rfqService.getSupplierList(this.rfqId,rfqPartId).subscribe(
        response => {
          if (!response.isError) {
          resolve(response.data);
          } else {
            reject([]);
          }
        }
      ),error =>{
        reject([]);
      };
      })
    }
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }

  downloadAllFiles(fileCompArray: string[], rfqId) {

    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    };
    this.temp = [];
    let data = JSON.stringify(fileCompArray);
    this.temp = JSON.parse(data);
    this.Downloadallfiles.filename = this.temp;
    this.Downloadallfiles.rfQ_Id = rfqId;

    this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response => {
      // console.log('data' , privateFileFileName);
      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;

          link.setAttribute('target', '_blank');
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }

      }
    }, error => {

    })
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }
  getPartCount() {
    this.totalPartCount = this.totalPartCount + 1;
  }
  selectedFeedback() {
    this._rfqService.getQuoteFeedbackBuyer().subscribe((result: any) => {
      this.feedbackQuantity = result.data;
    });
  }

  OnsaveFeedback(id, contactId, rfqQuoteSupplierQuoteId) {
    if (this.rfqStatus != 1 && this.rfqStatus != 2) {
      let iFeedbackSaveViewModel: IFeedbackSaveViewModel;
      iFeedbackSaveViewModel = {
        rfqQuoteSupplierquoteId: rfqQuoteSupplierQuoteId,
        buyerFeedbackId: 0,
        rfqId: this.rfqId,
        fromCont: this.loggedId,
        toCont: contactId
      };
      iFeedbackSaveViewModel.buyerFeedbackId = id;
      this._rfqService.SaveFeedbackBuyer(iFeedbackSaveViewModel).subscribe((result: any) => {
        this.saveFeedbackValue = result.data;
        if (!result.isError) {
          this._toastr.success('Feedback Submitted Successfully', 'Success!');
        }

      });
    }
  }
  expandQuotes(rfqId, contactId, indexNo, isRfqResubmitted, companyId, leadType, isOpen) {
    this.totalPartCount = 0;
    this.currentOpenQuoteisRfqResubmitted = isRfqResubmitted;

    // tslint:disable-next-line:prefer-const
    let iRFQPartQuantityQuote1: IRFQPartQuantityQuote;
    iRFQPartQuantityQuote1 = {
      'rfqQuoteItemsId': 0,
      'rfqQuoteSupplierQuoteId': 0,
      'rfqPartId': 0,
      'perUnitPrice': 0,
      'rfqPartIdString': '',
      'toolingAmount': 0,
      'miscellaneousAmount': 0,
      'isRfqResubmitted': isRfqResubmitted,
      'shippingAmount': 0,
      'rfqQuoteItemList': [],
      'rfqPartQuantityId': 0,
      'isAlreadyAwrded': false,
      'isAwrded': false,
      'awardedQty': 0,
      'awardedDate': '2018-11-29T06:09:50.622Z',
      'isAwardAccepted': true,
      'awardAcceptedOrDeclineDate': '2018-11-29T06:09:50.622Z',
      'partId': 0,
      'partName': '',
      'partNumber': '',
      'rfqId': rfqId,
      'quantityLevel': 0,
      'contactId': 0,
      'contactIdList': [contactId],
      'errorMessage': '',
      'result': false,
      'awardedQtyUnit': '',
      'isDeclineAll': false,
      'buyerFeedbackId': '',
      estLeadTimeValueRange: null,
      estLeadTimeRange: null,
      estLeadTimeValue: null
    };
    if (rfqId !== this.currentOpenQuoteId || contactId !== this.currentOpenContactId) {
      this.currentOpenQuoteId = rfqId;
      this.currentOpenContactId = contactId;
      this.isLoader1 = true;
      this.iBuyerQuotesListColl[indexNo].isDrawerOpen = true;
      this._rfqService.GetRFQPartQuantityQuoteBYRfqId(iRFQPartQuantityQuote1).subscribe(
        result => {
          this.isLoader1 = false;
          this.quoteReferenceNumber = 0;
          if (result.result === true) {
            this.isRecAvailable = false;
            this.message = result.messageDesc;
            this.quoteReferenceNumber = result.quoteReferenceNumber;
            this.supplierPaymentTerm = result.supplierPaymentTerms;
            this.messageAttachment = result.attachmentFileName;
            this.iRFQPartQuantityQuoteColl = result['data'];
            // console.log('data' ,   this.iRFQPartQuantityQuoteColl);
            this.iRFQPartQuantityQuoteColl[0].result = true;
            const Data = this.iRFQPartQuantityQuoteColl;
            this.iRFQPartQuantityQuoteColl = [];
            this.iRFQPartQuantityQuoteColl = Data.filter(m => m.rfqQuoteItemsId !== 0);
            this.isLoader1 = false;
            let miscellaneousAmount = 0;
            let toolingAmount = 0;
            let shippingAmount = 0;
            let perUnitPrice = 0;
            this.iRFQPartQuantityQuoteColl.forEach(x => miscellaneousAmount += x.miscellaneousAmount);
            this.iRFQPartQuantityQuoteColl.forEach(x => toolingAmount += x.toolingAmount);
            this.iRFQPartQuantityQuoteColl.forEach(x => shippingAmount += x.shippingAmount);
            this.iRFQPartQuantityQuoteColl.forEach(x => perUnitPrice += x.perUnitPrice * x.awardedQty);
            this.rfqPartTotal = miscellaneousAmount + toolingAmount + shippingAmount + perUnitPrice;
            if (!this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId) {
              this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId = '';
            }
          } else {
            this.isRecAvailable = true;
            this.iRFQPartQuantityQuoteColl = [];
            this.rfqPartTotal = 0;
          }
        },
        error => {
          this.isLoader1 = false;
          this._rfqService.handleError(error);
        },
        () => {
          if (this.iBuyerQuotesListColl[indexNo].isReviewed !== true) {
            this.isLoader1 = true;
            this._rfqService.SetRFQQuoteReviewedStatus(rfqId, contactId, isRfqResubmitted).subscribe(
              result => {
                this.isLoader1 = false;
                if (result.result === true) {
                  this.isLoader1 = false;
                  this.iBuyerQuotesListColl[indexNo].isReviewed = true;
                } else {
                  this._toastr.error(result.errorMessage, '');
                }
              },
              error => {
                this.isLoader1 = false;
                this._rfqService.handleError(error);
              },
              () => {}
            );
          }
        }
      );
    } else {
      this.currentOpenQuoteId = 0;
      this.currentOpenContactId = 0;
      this.iBuyerQuotesListColl[indexNo].isDrawerOpen = false;
    }
    if (!isOpen) {
      this.iLeadUserViewModel.leadInteractionType = leadType;
      this.iLeadUserViewModel.contactId = this.loggedId;
      this.iLeadUserViewModel.companyId = companyId;
      this._masterService.setSetLeadUser(this.iLeadUserViewModel).subscribe(
        (result) => {
          console.log(result);
        }
      );
    }
  }

  expandQuotesAfterAward() {
    this.totalPartCount = 0;
    // tslint:disable-next-line:prefer-const
    let iRFQPartQuantityQuote1: IRFQPartQuantityQuote;
    iRFQPartQuantityQuote1 = {
      'rfqQuoteItemsId': 0,
      'rfqQuoteSupplierQuoteId': 0,
      'rfqPartId': 0,
      'perUnitPrice': 0,
      'isAlreadyAwrded': false,
      'rfqPartIdString': '',
      'toolingAmount': 0,
      'miscellaneousAmount': 0,
      'shippingAmount': 0,
      'rfqQuoteItemList': [],
      'rfqPartQuantityId': 0,
      'isRfqResubmitted': false,
      'isAwrded': false,
      'awardedQty': 0,
      'awardedDate': '2018-11-29T06:09:50.622Z',
      'isAwardAccepted': true,
      'awardAcceptedOrDeclineDate': '2018-11-29T06:09:50.622Z',
      'partId': 0,
      'partName': '',
      'partNumber': '',
      'rfqId': this.rfqId,
      'quantityLevel': 0,
      'contactId': 0,
      'contactIdList': [this.currentOpenContactId],
      'errorMessage': '',
      'result': false,
      'awardedQtyUnit': '',
      'isDeclineAll': false,
      'buyerFeedbackId': '',
      estLeadTimeValueRange: null,
      estLeadTimeRange: null,
      estLeadTimeValue: null
    };
    this.isLoader1 = true;
    this._rfqService.GetRFQPartQuantityQuoteBYRfqId(iRFQPartQuantityQuote1).subscribe(
      result => {
        this.isLoader1 = false;
        if (result.result === true) {
          this.isRecAvailable = false;
          this.iRFQPartQuantityQuoteColl = result['data'];
          const Data = this.iRFQPartQuantityQuoteColl;
          if (!this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId) {
            this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId = '';
          }
          this.isLoader1 = false;
          let miscellaneousAmount = 0;
          let toolingAmount = 0;
          let shippingAmount = 0;
          let perUnitPrice = 0;
          this.iRFQPartQuantityQuoteColl = Data.filter(m => m.rfqQuoteItemsId !== 0);
          this.iRFQPartQuantityQuoteColl.forEach(x => miscellaneousAmount += x.miscellaneousAmount);
          this.iRFQPartQuantityQuoteColl.forEach(x => toolingAmount += x.toolingAmount);
          this.iRFQPartQuantityQuoteColl.forEach(x => shippingAmount += x.shippingAmount);
          this.iRFQPartQuantityQuoteColl.forEach(x => perUnitPrice += x.perUnitPrice * x.awardedQty);
          this.rfqPartTotal = miscellaneousAmount + toolingAmount + shippingAmount + perUnitPrice;
        } else {
          this.isRecAvailable = true;
          this.iRFQPartQuantityQuoteColl = [];
          this.rfqPartTotal = 0;
        }
      },
      error => {
        this.isLoader1 = false;
        this._rfqService.handleError(error);
      },
      () => {

      }
    );
  }

  initAwardModel() {
    this.awardRFQPartQuantityQuote = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      awardedQty: 0,
      rfqPartIdString: '',
      isAlreadyAwrded: false,
      contactId: 0,
      isRfqResubmitted: false,
      contactIdList: [],
      rfqQuoteItemList: [],
      errorMessage: '',
      isAwardAccepted: false,
      isAwrded: false,
      miscellaneousAmount: 0,
      partId: 0,
      partName: '',
      partNumber: '',
      perUnitPrice: 0,
      quantityLevel: 0,
      result: false,
      rfqId: 0,
      rfqPartId: 0,
      rfqPartQuantityId: 0,
      rfqQuoteItemsId: 0,
      rfqQuoteSupplierQuoteId: 0,
      shippingAmount: 0,
      toolingAmount: 0,
      awardedQtyUnit: '',
      isDeclineAll: false,
      buyerFeedbackId: '',
      estLeadTimeValueRange: null,
      estLeadTimeRange: null,
      estLeadTimeValue: null

    };
  }
  getAwardStatus(key) {
    if (this.activeStatusFilterBtn === 'Awarded') {
      const data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === true);
      if (data.length !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  getAwardbyQStatus(key, quantity) {
    if (this.activeStatusFilterBtn === 'Awarded') {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
      if (data !== undefined) {
        if (data.isAwrded) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  getQuantityUnit(key, quantity) {
    if (this.activeStatusFilterBtn === 'Awarded') {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
      if (data !== undefined) {
        if (data.isAwrded) {
          return data.awardedQty + ' ' + data.awardedQtyUnit;
        } else {
          return '';
        }
      } else {
        return '';
      }

    } else {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
      if (data !== undefined) {
        return data.awardedQty + ' ' + data.awardedQtyUnit;
      } else {
        return 'N/A';
      }
    }
  }

  getLeadTime(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.estLeadTimeValueRange;
    } else {
      return '';
    }
  }
  getQuantity1Total(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice * data.awardedQty + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }
  }
  getQuantity2Total(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice * data.awardedQty + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }
  }
  getQuantity3Total(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice * data.awardedQty + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }
  }
  getQuantityPerPrice(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice;
    } else {
      return 0;
    }

  }
  getPartCollapseStatus(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.result;
  }
  getpartName(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partName;
  }
  getpartNumber(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partNumber;
  }
  getpartId(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partId;
  }
  getRfqPartAwardedStatus(key, statusId ? ) {
    let data;
    if (statusId == 6) {
      data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === true && m.rfqPartStatusId == statusId).length;
    } else {
      data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === true).length;
    }
    if (data === 0) {
      return false;
    } else {
      return true;
    }
  }

  getRfqPartNotAwardedStatus(key, statusId ? ) {
    let data;
    data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === false && m.rfqPartStatusId == statusId && m.isContinueAwarding != true && m.isContinueAwarding != null).length;

    if (data === 0) {
      return false;
    } else {
      return true;
    }
  }

  getRfqPartAwardedStatusByOther(key, statusId ? ) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    if (data.isAlreadyAwrded) {
      return data.isAlreadyAwrded;
    } else {
      return false;
    }
  }
  getRfqPartNumber(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partNumber;
  }
  setPartCollapseStatus(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    data.result = !data.result;
  }
  getShippingAmount(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.shippingAmount;
    } else {
      return 0;
    }

  }
  getShippingAmountTotal(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }

  }
  getToolingAmount(key, quantity) {

    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.toolingAmount;
    } else {
      return 0;
    }

  }
  getMisleniousAmount(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.miscellaneousAmount;
    } else {
      return 0;
    }
  }

  compare(id) {
    this._rfqService.set(id, 'currentRfqIdForCompare');
    this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');
    this._rfqService.set(true, 'isCompare');
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  getBuyerQuotingList() {
    this.isLoader = true;
    this._rfqService.GetBuyerQuotingList(this.iBuyerQuotesViewModel).subscribe(
      result => {
        if (result.result) {
          // tslint:disable-next-line:no-
          this.iBuyerQuotesListColl = result['data'];
          this.isLoader = false;
          for (let i = 0; i < this.iBuyerQuotesListColl.length; i++) {
            // tslint:disable-next-line:prefer-const
            let iRFQPartQuantityQuoteContainer: IRFQPartQuantityQuoteContainer;
            iRFQPartQuantityQuoteContainer = {
              iRFQPartQuantityQuoteColl: [],
              index: 0
            };
            this.iRFQPartQuantityQuoteContainerColl.push(iRFQPartQuantityQuoteContainer);
            if (!!this.iBuyerQuotesListColl[i].qty2) {
              if (this.highestQtyPresent < 2) {
                this.highestQtyPresent = 2;
              }
            }
            if (!!this.iBuyerQuotesListColl[i].qty3) {
              if (this.highestQtyPresent < 3) {
                this.highestQtyPresent = 3;
              }
            }
            //this.iBuyerQuotesListColl[i].isDrawerOpen=false;

            if (!this.iBuyerQuotesListColl[i].isRfqResubmitted && !this.iBuyerQuotesListColl[i].isAwrded &&
              !this.isAwardSupplierDrawerOpen && this.isDashQuote) {
              this.isAwardSupplierDrawerOpen = true;
              this.expandQuotes(this.iBuyerQuotesListColl[i].rfqId, this.iBuyerQuotesListColl[i].contactId, i, this.iBuyerQuotesListColl[i].isRfqResubmitted, this.iBuyerQuotesListColl[i].companyId,
                'ViewedQuote', (this.iBuyerQuotesListColl[i].contactId === this.currentOpenContactId && this.iBuyerQuotesListColl[i].rfqId === this.currentOpenQuoteId));
            }
          }
          this.iFilteredRFQViewModelColl = this.iBuyerQuotesListColl;
          // this.init();
          if (localStorage.getItem('quotesAwardedTab') === 'true') {
            this.setStatusFilter('Awarded');
            localStorage.removeItem('quotesAwardedTab');
          }
        } else {
          this.iBuyerQuotesListColl = [];
          // this.iRFQPartQuantityQuoteContainerColl = []
          this.isLoader = false;
          this.isRfqAvailable = true;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  sortFilter() {
    this.isLoader = true;
    this.iFilteredRFQViewModelColl = [];
    if (this.activeStatusFilterBtn === 'All') {
      this.iFilteredRFQViewModelColl = this.iBuyerQuotesListColl;
    } else if (this.activeStatusFilterBtn === 'Preparing') {
      this.iFilteredRFQViewModelColl = this.iBuyerQuotesListColl.filter(x => (x.isQuoteSubmitted === false));
    } else if (this.activeStatusFilterBtn === 'Quoted') {
      this.iFilteredRFQViewModelColl = this.iBuyerQuotesListColl.filter(x => (x.isQuoteSubmitted === true));
    } else if (this.activeStatusFilterBtn === 'Awarded') {
      this.iFilteredRFQViewModelColl = this.iBuyerQuotesListColl.filter(x => (x.isAwrded === true));
    }
    switch (this.sortFilterValue) {
      case '1': {
        this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.quoteDate.localeCompare(a.quoteDate));
        break;
      }
      case '2': {
        this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.quoteDate.localeCompare(b.quoteDate));
        break;
      }
      default: {
        break;
      }
    }
    if (this.iFilteredRFQViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
    }
  }

  setStatusFilter(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.sortFilter();
  }

  checkIfAllSelected() {
    // tslint:disable-next-line:no-
    this.chkBoxCountArr = this.iBuyerQuotesListColl.filter(x => x.isSelected === true);
    this.selectedRowCount = this.chkBoxCountArr.length;
    if (this.chkBoxCountArr.length >= 2 && this.chkBoxCountArr.length < 4) {
      this.activeTopBtns = true;
    } else {
      this.activeTopBtns = false;
    }
    // if (this.chkBoxCountArr.length > 3) {
      // this.iBuyerQuotesListColl.forEach(element => {
      //   element.isSelected = false;
      // });
      // this._toastr.warning('You can select only three quotes to compare', 'Warning.!');
    // }
    // else {
      this.selectedAll = this.iBuyerQuotesListColl.every(function (
        item: any
      ) {
        return item.selected === true;
      });
    // }
    if (this._rfqService.get('messageRfq') == true) {
      this.openMessageDrawerMultiple('');
    }
  }

  openSidePanel(contactId, contactName, companyName) {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(0, 'quoteContactId');
    this._rfqService.set(0, 'quoteContactName');
    this._rfqService.set(false, 'messageThreadDrawer');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(contactName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 300);
  }

  compareQuotes() {
    this.chkBoxCountArr = this.iBuyerQuotesListColl.filter(x => x.isSelected === true);
    if (this.chkBoxCountArr.length >= 2 && this.chkBoxCountArr.length < 4) {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(this.chkBoxCountArr, 'contactListForCompare');
      this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');
      this._rfqService.set(true, 'isCompare');
    } else {
      // this.activeTopBtns = false;
    }

  }
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }

  sortOnContactName() {
    if (this.toggleManufacturer) {
      this.iBuyerQuotesListColl.sort((a, b) => a.contactName.localeCompare(b.contactName));
      this.iFilteredRFQViewModelColl.sort((a, b) => a.contactName.localeCompare(b.contactName));
    } else {
      this.iBuyerQuotesListColl.sort((a, b) => b.contactName.localeCompare(a.contactName));
      this.iFilteredRFQViewModelColl.sort((a, b) => b.contactName.localeCompare(a.contactName));
    }
    this.toggleManufacturer = !this.toggleManufacturer;
  }

  getAwardRecords() {
    return this.LocalAwardedManufractureListColl.filter(m => m.isPartPresent === true);
  }
  getAwardPartRecords(manId) {
    const data = this.LocalAwardedManufractureListColl.filter(m => m.isPartPresent === true);
    data.forEach(element => {
      const isPartAwarded = element.awardedPart.filter(m => m.isAward === true);
    });
    return this.LocalAwardedManufractureListColl.filter(m => m.isPartPresent === true);
  }

  awardSingle(key, manId, manName, npsScore, noOfStars) {   
    console.log("key---------->",key)
    this.filterOneSup = this.iFilteredRFQViewModelColl.filter(m => m.contactId == manId);
    if(this.withOrderManagement){
      this.isAward = false;
      this.singleAwardModal = true;
    }
    this.partId = key;
    if (this.rfqStatus != 1 && this.rfqStatus != 2) {
      if (this.isAwardedButtonClicked === false) {
        this.isAwardedButtonClicked = true;
        this.getStoreAwardDetails(key, manId, manName, npsScore, noOfStars);
      } else {
        const currentPart = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
        if (currentPart !== undefined) {
          const isManPartCount = this.NPartArrayColl.filter(m => m.rfqPartId === currentPart.rfqPartId);
          if (isManPartCount.length != 0) {
            const isManPartIndex = this.NPartArrayColl.findIndex(m => m.rfqPartId === currentPart.rfqPartId);
            if (isManPartIndex !== -1) {
              this.NPartArrayColl.splice(isManPartIndex, 1);
            }
          }


            this.getSupplierList(currentPart.rfqPartId).then(res=>{
              this.NPartArray.supplierList=res;
              this.NPartArray.manId = manId;
              this.NPartArray.manName = manName;
              this.NPartArray.npsScore = npsScore;
              this.NPartArray.noOfStars = noOfStars;
              this.NPartArray.partName = currentPart.partName;
              this.NPartArray.partNumber = currentPart.partNumber;
              this.NPartArray.rfqPartId = currentPart.rfqPartId;



          const partDetails = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.awardedQty !== null);
          this.NPartQuantityColl = [];
          partDetails.forEach(element => {
            const priceSum = ((element.awardedQty * element.perUnitPrice) + element.toolingAmount +
              element.shippingAmount + element.miscellaneousAmount).toFixed(4);
            this.NPartQuantity.quantityDetails = element.awardedQty.toString() + ' parts @ $' + priceSum;
            this.NPartQuantity.rfqQuoteItemsId = element.rfqQuoteItemsId;
            this.NPartQuantityColl.push(this.NPartQuantity);
            this.initNPartQuantity();
          });
          if (partDetails.length === 1) {
            this.NPartArray.rfqQuoteItemsId = partDetails[0].rfqQuoteItemsId;
          }
          this.NPartArray.quantityList = this.NPartQuantityColl;
          // this.NPartArrayColl.push(this.NPartArray);
          let checkDuplicate = this.NPartArrayColl.findIndex(x=>x.rfqPartId == this.NPartArray.rfqPartId);
          if(checkDuplicate == -1){
            this.NPartArrayColl.push(this.NPartArray);
          }
          this.initNPartArray();
          this.isAward = true;
          this._rfqService.set(this.chkBoxCountArr, 'contactListForCompare');
          this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');
        })
        }
      }

    }
  }

  awardAll(manId, manName, npsScore, noOfStars) {

    this.filterOneSup = this.iFilteredRFQViewModelColl.filter(m => m.contactId == manId);

    // this.filterOneSup = this.iFilteredRFQViewModelColl

console.log(this.filterOneSup,"this.filterOneSup");
if(this.withOrderManagement){

  this.showAwardAllPopup = true
}
else{
  this.isAward=true;

    if (this.rfqStatus != 1 && this.rfqStatus != 2) {
      if (this.isAwardedButtonClicked === false) {
        this.isAwardedButtonClicked = true;
        this.getStoreAwardDetails(null, manId, manName, npsScore, noOfStars);
      } else {
        const currentPart = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.isAlreadyAwrded !== true);
        currentPart.forEach(element => {
          const isManPartCount = this.NPartArrayColl.filter(m => m.rfqPartId === element.rfqPartId);
          if (isManPartCount.length != 0) {
            const isManPartIndex = this.NPartArrayColl.findIndex(m => m.rfqPartId === element.rfqPartId);
            if (isManPartIndex !== -1) {
              this.NPartArrayColl.splice(isManPartIndex, 1);
            }
          }

          this.getSupplierList(element.rfqPartId).then(res=>{
            this.NPartArray.supplierList=res;
            this.NPartArray.manId = manId;
            this.NPartArray.manName = manName;
            this.NPartArray.npsScore = npsScore;
            this.NPartArray.noOfStars = noOfStars;
            this.NPartArray.partName = element.partName;
            this.NPartArray.partNumber = element.partNumber;
            this.NPartArray.rfqPartId = element.rfqPartId;
          const partDetails = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.rfqPartId === element.rfqPartId);
          this.NPartQuantityColl = [];
          partDetails.forEach(element => {
            const priceSum = ((element.awardedQty * element.perUnitPrice) + element.toolingAmount +
              element.shippingAmount + element.miscellaneousAmount).toFixed(4);
            this.NPartQuantity.quantityDetails = element.awardedQty.toString() + ' parts @ $' + priceSum;
            this.NPartQuantity.rfqQuoteItemsId = element.rfqQuoteItemsId;
            this.NPartQuantityColl.push(this.NPartQuantity);
            this.initNPartQuantity();
          });
          if (partDetails.length === 1) {
            this.NPartArray.rfqQuoteItemsId = partDetails[0].rfqQuoteItemsId;
          }
          this.NPartArray.quantityList = this.NPartQuantityColl;
          // this.NPartArrayColl.push(this.NPartArray);
          let checkDuplicate = this.NPartArrayColl.findIndex(x=>x.rfqPartId == this.NPartArray.rfqPartId);
          if(checkDuplicate == -1){
            this.NPartArrayColl.push(this.NPartArray);
          }
          this.initNPartArray();
          this.isAward = true;
          this._rfqService.set(this.chkBoxCountArr, 'contactListForCompare');
          this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');
        });
        });
      }
    }
  }
  }

  getStoreAwardDetails(key, manId, manName, npsScore, noOfStars) {
    // const currentPart = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    let isDuplicateAward = false;
    this._rfqService.getStoreAwardDetails(this.rfqId).subscribe(res => {
      console.log(res);
      // debugger;
      if (!res.isError) {
        res.data.forEach(element => {
          this.setAwardSingle(element.rfqPartId, element.supplierId, element.supplier, 0, element.supplierRating, element.continueAwardingPriceDataList, element.unit, element.price, element.awardedUnitTypeId, manId, noOfStars);
          if (key != null && key == element.rfqPartId && manId == element.supplierId) { /*&& manId == element.supplierId*/
            isDuplicateAward = true;
          }
        });
        setTimeout(()=>{

        if (!isDuplicateAward && key != null) {
          this.setAwardSingle(key, manId, manName, npsScore, noOfStars, null, 0, 0, 14);
        }
        if (key == null) {
          const currentPart = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.isAlreadyAwrded !== true);
          currentPart.forEach(element => {
            const isManPartCount = this.NPartArrayColl.filter(m => m.rfqPartId === element.rfqPartId);
            if (isManPartCount.length === 0 ) {
              this.setAwardSingle(element.rfqPartId, manId, manName, npsScore, noOfStars, null, 0, 0, 14);
            }
          });
        }
      },1000)
      }
    });
  }

  removeSelectedAward(index) {
    if (index != null) {
      if (this.NPartArrayColl[index].rfqQuoteItemsId != null && this.NPartArrayColl[index].rfqQuoteItemsId != undefined) {
        this._rfqService.removeSelectedAward(this.NPartArrayColl[index].rfqQuoteItemsId).subscribe(response => {
          console.log(response);
        });
      }
      this.NPartArrayColl.splice(index, 1);
    }
  }

  setAwardSingle(key, manId, manName, npsScore, noOfStars, partListId, unit ? , price ? , unitTypeId ? , selectedSupplierId ? , selectedSupplierNoOfStar ? ) {
    const currentPart = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString == key);
    if (currentPart !== undefined && currentPart.rfqPartId !== undefined && currentPart.rfqPartId !== 0) {
      const isManPartCount = this.NPartArrayColl.filter(m => m.rfqPartId === currentPart.rfqPartId);

      if (isManPartCount.length != 0) {
        const isManPartIndex = this.NPartArrayColl.findIndex(m => m.rfqPartId === currentPart.rfqPartId);
        if (isManPartIndex !== -1) {
          this.NPartArrayColl.splice(isManPartIndex, 1);
        };
      }



      this.getSupplierList(currentPart.rfqPartId).then(res=>{
          this.NPartArray.supplierList=res;
          this.NPartArray.manId = manId;
          this.NPartArray.manName = manName;
          this.NPartArray.npsScore = npsScore;
          this.NPartArray.noOfStars = noOfStars;
          this.NPartArray.partName = currentPart.partName;
          this.NPartArray.partNumber = currentPart.partNumber;
          this.NPartArray.rfqPartId = currentPart.rfqPartId;


      if (manId === 16 || manId === 17 || manId === 18 || manId === 20) {
        this.NPartArray.unit = unit;
        this.NPartArray.price = price;
        this.NPartArray.awardedUnitTypeId = unitTypeId;
      }

      const partDetails = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString == key && m.awardedQty !== null);

      this.NPartQuantityColl = [];
      partDetails.forEach(element => {
        const priceSum = ((element.awardedQty * element.perUnitPrice) + element.toolingAmount +
          element.shippingAmount + element.miscellaneousAmount).toFixed(4);
        this.NPartQuantity.quantityDetails = element.awardedQty.toString() + ' parts @ $' + priceSum;
        this.NPartQuantity.rfqQuoteItemsId = element.rfqQuoteItemsId;
        if (partListId != null && partListId.length != 0) {
          this.NPartArray.rfqQuoteItemsId = partListId[0].rfqQuoteItemsId;
        }
        this.NPartQuantityColl.push(this.NPartQuantity);
        this.initNPartQuantity();
      });
      if (partDetails.length === 1) {
        this.NPartArray.rfqQuoteItemsId = partDetails[0].rfqQuoteItemsId;
      };

      let tempRfqData = null;
      if (partListId !== null && partListId !== undefined) {
        tempRfqData = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqQuoteItemsId == partListId[0].rfqQuoteItemsId);
      }


      if (tempRfqData !== null && tempRfqData.length === 0) {
        let tempSupplier = this.supplierList.filter(x => x.id === selectedSupplierId);
        if (tempSupplier.length) {
          this.NPartArray.manName = tempSupplier[0].name;
          this.NPartArray.manId = tempSupplier[0].id;
          // this.NPartArray.rfqQuoteItemsId = 0;
          if (partDetails.length === 1) {
            this.NPartArray.rfqQuoteItemsId = partDetails[0].rfqQuoteItemsId;
          } else {
            this.NPartArray.rfqQuoteItemsId = 0;
          }
          this.NPartArray.noOfStars = selectedSupplierNoOfStar;
        }
      }
      this.NPartArray.quantityList = this.NPartQuantityColl;
      let checkDuplicate = this.NPartArrayColl.findIndex(x=>x.rfqPartId == this.NPartArray.rfqPartId);
          if(checkDuplicate == -1){
            this.NPartArrayColl.push(this.NPartArray);
          }
      // this.NPartArrayColl.push(this.NPartArray);
      this.initNPartArray();
      this._rfqService.set(this.chkBoxCountArr, 'contactListForCompare');
      this._rfqService.set(this.rfqId, 'currentRfqIdForCompare');
      this._rfqService.set(true, 'rfqLoaded');
      this.isAward = true;
    })
    }
  }

  isAwardAllStatus(manId) {
    const currentPart = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.isAlreadyAwrded !== true);
    if (currentPart.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  declineQuote(contactId, rfqQuoteSupplierQuoteId) {
    // this.isDeclienModel = true;
    this.btnConfirmationHeading = 'Decline quote';
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to decline the quote?',
      header: 'Decline quote',
      icon: null,
      accept: () => {
        this.declineAllByManufracture(contactId, rfqQuoteSupplierQuoteId);
      },
      reject: () => {}
    });
  }

  closeErrorCSVModel() {
    this.modalReference.close();
  }
  setPriceUnit(e, index, isPriceUnit) {
    if (isPriceUnit === 1) {
      this.NPartArrayColl[index].unit = e.target.value;
    } else {
      this.NPartArrayColl[index].price = e.target.value;
    }
  }
  retractQuotes(key) {
    if (this.rfqStatus != 1 && this.rfqStatus != 2) {
      this.currentrfqPartIdString = key;
      this.modalReference = this.modalService.open(this.errorCSVModal, {
        backdrop: 'static'
      });
    }
  }
  singleDecline() {
    this.declineSingle(this.currentrfqPartIdString);
  }

  declineSingle(key) {
    // debugger;
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.isAwrded === true);
    if (data !== undefined || data !== null) {
      if (!this.isDeclineBtn) {
        this.isDeclineBtn = true;
        this.awardQuoteIds = [];
        this.awardQuoteIds.push(data.rfqQuoteItemsId);
        let tempObj = {
          rfqQuoteItemsId: data.rfqQuoteItemsId,
          isAwarded: false,
          rfqPartId: data.rfqPartId,
          isRfqStatus: false,
          rfqPartStatusId: 0,
          unit: null,
          price: null,
          awardedUnitTypeId: null
        };
        this.awardRFQPartQuantityQuote.rfqQuoteItemList = [tempObj];
        this.awardRFQPartQuantityQuote.isAwrded = false;
        this.awardRFQPartQuantityQuote.rfqQuoteSupplierQuoteId = data.rfqQuoteSupplierQuoteId;
        this.awardRFQPartQuantityQuote.rfqId = this.rfqId;
        this.awardRFQPartQuantityQuote.contactId = data.contactId;
        this.awardRFQPartQuantityQuote.isDeclineAll = false;
        this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success('Your award has been retracted', 'Success!');
              this._rfqService.setRfqAwardEvent(true);
              this.getBuyerQuotingList();
              this.isDeclineBtn = false;
              this.expandQuotesAfterAward();
              this.LocalAwardedManufractureListColl = [];
              this.NPartArrayColl = [];
              this._rfqService.set(true, 'rfqLoaded');
              this.modalReference.close();
            } else {
              this.modalReference.close();
              this._toastr.error(result['errorMessage'], 'Error!');
            }
          },
          error => {
            this.modalReference.close();
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }

    } else {

    }

  }
  declineAllByManufracture(manuId, rfqQuoteSupplierQuoteId) {
    // debugger;
    if (!this.isDeclineBtn) {
      this.isDeclineBtn = true;
      const data = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manuId);
      this.awardQuoteIds = [];
      let awardQuoteObj = [];
      data.forEach(part => {
        if (part.rfqQuoteItemsId !== 0) {
          this.awardQuoteIds.push(part.rfqQuoteItemsId);
          let tempObj = {
            rfqQuoteItemsId: part.rfqQuoteItemsId,
            isAwarded: false,
            rfqPartId: part.rfqPartId,
            isRfqStatus: false,
            rfqPartStatusId: 0,
            unit: null,
            price: null,
            awardedUnitTypeId: null
          };
          awardQuoteObj.push(tempObj);
        }
      });
      this.awardRFQPartQuantityQuote.rfqQuoteItemList = awardQuoteObj;
      this.awardRFQPartQuantityQuote.isAwrded = false;
      this.awardRFQPartQuantityQuote.rfqQuoteSupplierQuoteId = rfqQuoteSupplierQuoteId;
      this.awardRFQPartQuantityQuote.rfqId = this.rfqId;
      this.awardRFQPartQuantityQuote.contactId = manuId;
      this.awardRFQPartQuantityQuote.isDeclineAll = true;
      this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
        result => {
          if (result['result'] === true) {
            this._toastr.success('Your award has been decline', 'Success!');
            this._rfqService.setRfqAwardEvent(true);
            this.getBuyerQuotingList();
            this.isDeclineBtn = false;
            this.expandQuotesAfterAward();
            this.LocalAwardedManufractureListColl = [];
            this.NPartArrayColl = [];
            this._rfqService.set(true, 'rfqLoaded');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  transform(collection: Array < any > , property: string): Array < any > {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({
      key,
      value: groupedCollection[key]
    }));
  }

  makeManufactureSelection(index, selectedId, rfqPartId) {
    // debugger;
    this.isCsvLoader = true;
    if (selectedId != null && selectedId != 'null') {
      this.initPartsModel();
      this.NPartArrayColl[index].manId = selectedId;
      this.NPartArrayColl[index].awardedUnitTypeId = 14;
      this.NPartArrayColl[index].unit = null;
      this.NPartArrayColl[index].price = null;
      if (selectedId == 18) {
        this.NPartArrayColl[index].unit = '0';
        this.NPartArrayColl[index].price = 0;
      }
      this.partsRequestViewModel.rfqId = this.rfqId;
      this.partsRequestViewModel.contactIds[0] = selectedId;
      this.partsRequestViewModel.rfqPartId = rfqPartId;
      if (selectedId != 16 && selectedId != 17 && selectedId != 18 && selectedId != 20) {
        this._rfqService.getAwardingModelQuoteQuantityData(this.partsRequestViewModel).subscribe(
          response => {
            if (response.data !== null && response.data !== undefined && response.data.rfqQuoteItemList !== null && response.data.rfqQuoteItemList !== undefined) {
              this.NPartQuantityColl = [];
              this.NPartArrayColl[index].noOfStars = response.data.noOfStars;
              response.data.rfqQuoteItemList.forEach(
                x => {
                  this.NPartQuantity.quantityDetails = x.awardedQty + ' parts @ $' + (x.totalPrice).toFixed(4);
                  this.NPartQuantity.rfqQuoteItemsId = x.rfqQuoteItemsId;
                  this.NPartQuantityColl.push(this.NPartQuantity);
                  this.initNPartQuantity();
                });
              if (response.data.rfqQuoteItemList.length === 1) {
                this.NPartArrayColl[index].rfqQuoteItemsId = response.data.rfqQuoteItemList[0].rfqQuoteItemsId;
              }
              this.NPartArrayColl[index].quantityList = this.NPartQuantityColl;
              this.initNPartArray();
            }
            this.isCsvLoader = false;
          },
          error => {
            this.isCsvLoader = true;
          }
        );
      } else {
        this.NPartArrayColl[index].manId = parseInt(selectedId);
        this.NPartArrayColl[index].rfqQuoteItemsId = -99;
        this.NPartArrayColl[index].quantityList = [];
        this.NPartArrayColl[index].noOfStars = 0;
        this.NPartArrayColl[index].unit = null;
        this.NPartArrayColl[index].price = null;
        if (selectedId == 18) {
          this.NPartArrayColl[index].unit = '0';
          this.NPartArrayColl[index].price = 0;
        }
        this.NPartArrayColl[index].isRfqStatus = true;
        this.NPartArrayColl[index].awardedUnitTypeId = 14;
        this.isCsvLoader = false;
      }
    } else {
      this.isCsvLoader = false;
      this.NPartArrayColl[index].quantityList = [];
      this.NPartArrayColl[index].rfqQuoteItemsId = 0;
      this.NPartArrayColl[index].manId = null;
    }
  }

  checkToDisableAwardButton() {
    let awardQuoteIds = [];
    let supplierIds = [];
    let units = [];
    let prices = [];

    let checkZeroQty = false;
    this.NPartArrayColl.forEach(element => {
      supplierIds.push(element.manId);
      if (element.manId == 16 || element.manId == 17 || element.manId == 20) {
        units.push(element.unit);
        prices.push(element.price);

        if (element.unit !== null && element.unit !== '' && Number.isNaN(Number(element.unit))) {
          console.log('string');
          checkZeroQty = true;
        } else {
          awardQuoteIds.push(1);
        }

      } else if (element.manId == 18) {
        awardQuoteIds.push(1);
      } else {
        awardQuoteIds.push(element.rfqQuoteItemsId);
      }
    });

    if (awardQuoteIds.length !== 0 || units.length !== 0) {
      const isZeroExist = awardQuoteIds.filter(x => x !== 0);
      let isSupplierNotExist = supplierIds.includes('null');
      if (isSupplierNotExist) {
        return true;
      } else if (!isZeroExist.length) {
        return true;
      } else if (checkZeroQty) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }

  }
  makeQuantitySelection1(partNumber, manId, selectRfqQuoteItemsId) {

    const localData = this.LocalAwardedManufractureListColl.filter(m => m.manId === manId);
    localData.forEach(element => {
      const data = element.awardedPart.filter(m => m.isAward === true && m.rfqPartNumber === partNumber);
      data.forEach(part => {
        part.rfqQuoteItemsId = selectRfqQuoteItemsId;
      });

    });
  }
  makeQuantitySelection(manId, selectRfqQuoteItemsId, rfqpartid) {
    const localData = this.NPartArrayColl.find(m => m.manId === manId && m.rfqPartId === rfqpartid);
    if (localData != undefined && selectRfqQuoteItemsId !== '0') {
      localData.rfqQuoteItemsId = selectRfqQuoteItemsId;
    } else {
      localData.rfqQuoteItemsId = 0;
    }

  }
  awardActualContinue() {
    this.awardQuoteIds = [];
    let awardQuoteObj = [];
    this.NPartArrayColl.forEach(element => {
      this.awardQuoteIds.push(element.rfqQuoteItemsId);
      let tempObj = {
        rfqQuoteItemsId: element.rfqQuoteItemsId,
        // isAwarded: true,
        rfqPartId: element.rfqPartId,
        isRfqStatus: false,
        rfqPartStatusId: 0,
        unit: null,
        price: null,
        awardedUnitTypeId: null
      };
      if (element.manId == 16 || element.manId == 17 || element.manId == 20) {
        tempObj.unit = element.unit;
        tempObj.price = element.price;
        tempObj.isRfqStatus = true;
        tempObj.rfqPartStatusId = element.manId;
        tempObj.rfqQuoteItemsId = null;
        tempObj.awardedUnitTypeId = element.awardedUnitTypeId;
      }
      if (element.manId == 18) {
        tempObj.unit = null;
        tempObj.price = null;
        tempObj.isRfqStatus = true;
        tempObj.rfqPartStatusId = element.manId;
        tempObj.rfqQuoteItemsId = null;
      }
      awardQuoteObj.push(tempObj);
    });
    if (this.awardQuoteIds.length !== 0) {
      this.awardRFQPartQuantityQuote.rfqQuoteItemList = awardQuoteObj;
      this.awardRFQPartQuantityQuote.isAwrded = true;
      this.awardRFQPartQuantityQuote.rfqId = this.rfqId;
      this.awardRFQPartQuantityQuote.contactId = this.loggedId;
      console.log(this.awardRFQPartQuantityQuote, 'awardRFQPartQuantityQuote');
      this._rfqService.setRfqContinueAwardingData(this.awardRFQPartQuantityQuote).subscribe(
        result => {
          if (!result.isError) {
            this.isAward = false;
            this.getBuyerQuotingList();
            this.expandQuotesAfterAward();
            this.isAwardedButtonClicked = false;
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    } else {}
  }
  awardActual() {
    // debugger;

    this.awardQuoteIds = [];
    let awardQuoteObj = [];
    let supplierIds = [];
    this.NPartArrayColl.forEach(element => {
//loop TBD
      if (element.rfqQuoteItemsId != null && element.rfqQuoteItemsId != 0) {
        this.awardQuoteIds.push(element.rfqQuoteItemsId);
        supplierIds.push(element.manId);
        let tempObj = {
          rfqQuoteItemsId: element.rfqQuoteItemsId,
          // isAwarded: true,
          rfqPartId: element.rfqPartId,
          isRfqStatus: false,
          rfqPartStatusId: 0,
          unit: null,
          price: null,
          awardedUnitTypeId: null
        };
        if (element.manId == 16 || element.manId == 17 || element.manId == 20) {
          tempObj.unit = element.unit;
          tempObj.price = element.price;
          tempObj.isRfqStatus = true;
          tempObj.rfqPartStatusId = element.manId;
          tempObj.rfqQuoteItemsId = null;
          tempObj.awardedUnitTypeId = element.awardedUnitTypeId
        }
        if (element.manId == 18) {
          tempObj.unit = null;
          tempObj.price = null;
          tempObj.isRfqStatus = true;
          tempObj.rfqPartStatusId = 18;
          tempObj.rfqQuoteItemsId = null;
        }
        awardQuoteObj.push(tempObj);
      }
    });

    if (this.awardQuoteIds.length !== 0) {
      const isZeroExist = this.awardQuoteIds.includes(0);

      let isSupplierNotExist = supplierIds.includes('null');
      if (isSupplierNotExist) {
        this._toastr.warning('Please select manufacturer to award', 'Warning!');
      } else {
        if (!this.isAwardDone) {
          this.isAwardDone = true;
          this.awardRFQPartQuantityQuote.rfqQuoteItemList = awardQuoteObj;
          this.awardRFQPartQuantityQuote.isAwrded = true;
          this.awardRFQPartQuantityQuote.rfqId = this.rfqId;
          this.awardRFQPartQuantityQuote.contactId = this.loggedId;
          this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
            result => {
              if (result['result'] === true) {
                this._toastr.success('RFQ Has Been Awarded', 'Success!');
                this._rfqService.setRfqAwardEvent(true);
                this._rfqService.set(true, 'rfqLoaded');
                this.isAward = false;
                this.isAwardDone = false;
                this.getBuyerQuotingList();
                this.expandQuotesAfterAward();
                this.captureAwardRFQ();
                this.LocalAwardedManufractureListColl = [];
                this.awardQuoteIds.forEach(element => {
                  if (element !== 0) {
                    for (let i = 0; i < this.NPartArrayColl.length; i++) {
                      if (this.NPartArrayColl[i].rfqQuoteItemsId === element) {
                        this.NPartArrayColl.splice(i, 1);
                      }
                    }
                  }
                });
              } else {
                this.isAwardDone = false;
                this._toastr.error(result['errorMessage'], 'Error!');
              }
            },
            error => {
              this.isAwardDone = false;
              this._rfqService.handleError(error);
            },
            () => {
              this.isAwardDone = false;
            }
          );
        }
      }
    } else {}
  }
  captureAwardRFQ(){
    this._rfqService.captureAwardRfqEvent(this.awardRFQPartQuantityQuote).subscribe(
      result => {
        if (result['result'] === true) {
        }
      })
    }
  hidePopup() {
    this.isAward = false;
  }
  isLocallyAwarded(no, contactId, key) {
    let isexist = false;
    const mandata = this.LocalAwardedManufractureListColl.filter(m => m.manId === contactId);
    mandata.forEach(element => {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === no);
      const isExist = element.awardedPart.filter(m => m.rfqPartNumber === data.partNumber && m.isAward === true).length;
      if (isExist !== 0) {
        isexist = true;
      } else {
        isexist = false;
      }
    });
    return isexist;
  }


  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    event.stopPropagation();
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'messageRfq');
    this._rfqService.set(fromContName, 'nameOfBuyer');
    this._rfqService.set(contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'selectContactRFQId');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageThreadDrawer');
  }

  sortMessage(tab) {
    switch (tab) {
      case 'Qty1': {
        if (this.toggle2) {
          this.iBuyerQuotesListColl.sort((b, a) => a.qty1 - b.qty1);
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => b.qty1 - a.qty1);
        }
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Qty2': {
        if (this.toggle3) {
          this.iBuyerQuotesListColl.sort((b, a) => a.qty2 - b.qty2);
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => b.qty2 - a.qty2);
        }
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Qty3': {
        if (this.toggle4) {
          this.iBuyerQuotesListColl.sort((b, a) => a.qty3 - b.qty3);
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => b.qty3 - a.qty3);
        }
        this.toggle4 = !this.toggle4;
        break;
      }

      case 'Date': {
        if (this.toggle1) {
          this.iBuyerQuotesListColl.sort((b, a) => new Date(a.quoteDate).getTime() - new Date(b.quoteDate).getTime());
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime());
        }

        this.toggle1 = !this.toggle1;
        break;
      }

      case 'Status': {
        if (this.toggle5) {
          this.iBuyerQuotesListColl.sort((b, a) => Number(a.isReviewed) - Number(b.isReviewed));
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => Number(b.isReviewed) - Number(a.isReviewed));
        }
        this.toggle5 = !this.toggle5;
        break;
      }

    }
  }

  IsNpsdataback() {
    if (this._rfqService.get('ismyrfqdataback') === true) {
      // this.isApiRes = true;
      this._rfqService.set(false, 'ismyrfqdataback');
      this.getBuyerQuotingList();
      if ((sessionStorage.getItem('isDetailAward')) == 'true') {
        sessionStorage.removeItem('isDetailAward');
        this.currentOpenQuoteId = 0;
        this.currentOpenContactId = 0;
      }

    }
  }

  downloadQuotesCsv() {
    // debugger;
    this.isCsvLoader = true;
    this.csvModel = new DownloadQuotesToExcelViewModel();
    this.iBuyerQuotesListColl.forEach(element => {
      if (!element.isRfqResubmitted) {
        this.csvModel.contactIdList.push(element.contactId);
        this.csvModel.supplierList.push(element.contactName);
        this.csvModel.supplierCompanyList.push(element.companyName);
        this.csvModel.supplierNoOfStarsList.push(element.noOfStars);
      }
    });
    this.csvModel.quantityLevelList = [1, 2, 3];
    this.csvModel.rfqId = this.rfqId;
    this.csvModel.isRfqResubmitted = false;
    this.csvModel.rfqName = this.iBuyerQuotesListColl[0].rfqName;
    this.csvModel.rfqCreationDate = this.createDate;
    this._rfqService.DownloadQuotesToExcel(this.csvModel).subscribe(res => {
      if (!res['isError']) {
        this.setRFQReviewStatus();
        this.isCsvLoader = false;
        window.open(res['data'].privateFileFileName, '_blank');
      } else {
        this.isCsvLoader = false;
      }
    }, error => {
      this.isCsvLoader = false;
    });
  }

  setRFQReviewStatus() {
    this.iBuyerQuotesListColl.forEach(element => {
      if (element.isReviewed !== true) {
        this._rfqService.SetRFQQuoteReviewedStatus(element.rfqId, element.contactId, element.isRfqResubmitted).subscribe(
          result => {
            if (result.result === true) {
              element.isReviewed = true;
              // this.iBuyerQuotesListColl[indexNo].isReviewed = true;
            } else {
              this._toastr.error(result.errorMessage, '');
            }
          },
          error => {
            this.isLoader1 = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }
    });
  }
  retractEvent(val) {
    if (val) {
      this.getBuyerQuotingList();
      this.isDeclineBtn = false;
      this.expandQuotesAfterAward();
      this.LocalAwardedManufractureListColl = [];
      this.NPartArrayColl = [];
      this._rfqService.set(true, 'rfqLoaded');
      if (this.modalReference !== undefined && this.modalReference !== null) {
        this.modalReference.close();
      }
    }
  }
  getQuantity() {
    if (this.iQuantityUnitColl.length === 0) {
      this._masterService.getQuantityUnit().subscribe(
        (data: IQuantityUnit[]) => {
          this.iQuantityUnitColl = data;
          this.iQuantityUnitColl.sort((a, b) => {
            const textA = a.value.toUpperCase();
            const textB = b.value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.iQuantityUnitColl.unshift(
            (this.iQuantityUnitColl).splice(
              (this.iQuantityUnitColl).findIndex(
                elt => elt.id === 92),
              1)[0]);
          // this.initPartDetailsForm();
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }

  }
  checkZero(val) {
    if (val !== null && val !== '' && Number.isNaN(Number(val))) {
      return true;
    } else {
      return false;
    }
  }
  AwardedStatusTileData(data) {
    (data > 0) ? this.isAwardedStatusTileData = true: this.isAwardedStatusTileData = false;

  }
  selectAll() {
    this.chkBoxCountArr = [];
    this.selectedRowCount = 0;;
    for (let i = 0; i < this.iFilteredRFQViewModelColl.length; i++) {
      this.iFilteredRFQViewModelColl[i].isSelected = this.selectedAll;
      this.chkBoxCountArr = this.iFilteredRFQViewModelColl.filter(x => x.isSelected === true);
      this.selectedRowCount = this.chkBoxCountArr.length;
    }
    if (this._rfqService.get('messageRfq') == true) {
      this.openMessageDrawerMultiple('');
    }
  }
  openMessageDrawerMultiple(contactId) {
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(true, 'messageFromNda');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'messageFromMessage');
    if (this.selectedRowCount > 1) {
      if (!(contactId === '' || contactId === undefined)) {
        this.chkBoxCountArr.push(contactId);
      }
      setTimeout(() => {
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(true, 'messageFromNda');
        this._rfqService.set(this.rfqId, 'selectContactRFQId');
        this._rfqService.set(this.chkBoxCountArr, 'selectContactIdsForMEessage');
      }, 300);
    } else if (this.selectedRowCount == 1 && this.chkBoxCountArr.length == 1) {
      setTimeout(() => {
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(true, 'messageFromNda');
        this._rfqService.set(this.chkBoxCountArr[0].companyName, 'nameOfBuyer');
        this._rfqService.set(this.chkBoxCountArr[0].contactId, 'selectContactIdsForMEessage');
        this._rfqService.set(this.rfqId, 'selectContactRFQId');
        this._rfqService.set(this.chkBoxCountArr[0].companyId, 'selectedCompanyId');
      }, 300);
    } else{
      this._rfqService.set(false, 'messageRfq');
      this._rfqService.set(false, 'showSidePanel');
    }
  }
   stepNext() {
    this.isAward = false;
    this.isAwardStep2 = true;
    this.isFirstTabCompleted = true;
    this.isSecondTabCompleted = false;
  }
  gotoAwardBack() {
    this.isAwardStep2 = false;
   this.isAward = true;
   this.isFirstTabCompleted = false;
   this.isSecondTabCompleted = false;
  }
  uploadMyOwnFile(btnState) {
    this.uploadMyOwnStatus()
    this.isUploadMyOwnFile = true;
    this.activeStatusFilterBtn1 = btnState;
  }
  sendMFG(btnState) {
    this.sendMfGStandStatus()
    this.isUploadMyOwnFile = false;
    this.activeStatusFilterBtn1 = btnState;

  }
  // cancelAward() {
  //   this.isFirstTabCompleted = false;
  //   this.isSecondTabCompleted = false;
  //   this.isAward = false;
  //   this.isAwardStep2 = false;
  // }
  
  downloadAllFilesForPart(fileCompArray: string[], isDownload: boolean) {
    // debugger;
    console.log(fileCompArray, 'fileCompArray')
    fileCompArray.forEach(element => {
      this.downloadS3File(element['CompleteFileName'], isDownload);
    });
  }
  patchPartDetails() {
    this.iPartUploadedFileNameList.FileNameList = [];
    if (this.iPartsViewModel.partsFiles) {
      console.log(this.iPartsViewModel.partsFiles, 'this.iPartsViewModel.partsFiles')
      this.iPartsViewModel.partsFiles.forEach(x => {
        let oriFileName = '';
        if (x !== null) {
          const fileNameArray = (x).split('_S3_');
          if (fileNameArray) {
            oriFileName = fileNameArray[1];
          }
          this.iPartUploadedFileNameList.FileNameList.push({
            oFileName: oriFileName,
            CompleteFileName: x
          });
        }
      });
    }
  }
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }
  getOriginalFineName(fileName) {
    if (fileName !== null) {
      const filenNameArray = (fileName).split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }
  onFileSelected($event: any) {
    this.uploadPartDetailsFiles();
    $event.srcElement.value = '';
  }
  upload(fileToUpload: any) {
    // debugger;
    const input = new FormData();
    input.append('file', fileToUpload);
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  
  uploadPartDetailsFiles() {
    const files = this.partDetailUploader.queue;
    // debugger;
    console.log(files, 'files')
    //for (const entry of files) {
      if(this.iPartUploadedFileNameList.FileNameList.length === 0 && files[0]._file.type==="application/pdf") {
        const file = files[0]._file;
        // debugger;
        if (files[0].isUploaded === false) {
          ++this.isAttachmentsLoading;
          this.upload(file).subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fName = result['fileName'];
            files[0].isUploaded = true;
            this.partFileAddedError = false;
            const fileNameArray = fName.split('_S3_');
            console.log("fileNameArray",fileNameArray)
            this.iPartUploadedFileName.oFileName = fileNameArray[1];
            this.fileName = this.iPartUploadedFileName.oFileName
            console.log("this.iPartUploadedFileName.oFileName",this.iPartUploadedFileName.oFileName);
            this.iPartUploadedFileName.CompleteFileName = fName;
            --this.isAttachmentsLoading;
            this.iPartUploadedFileNameList.FileNameList.push(
              this.iPartUploadedFileName
            );
            this.iPartUploadedFileName = {
              oFileName: '',
              CompleteFileName: ''
            };
            this.partDetailUploader.queue = [];
          });
        }
  
        if (this.deliveryDate === false) {
          this.iPartsViewModel.createNewPart = true;
        }
      } else {
        this.partDetailUploader.queue = [];
      //  this._toastr.error('Please select PDF file only', 'Error!');
      }
      
    //}
  }
  closePopUp(){
    this.isAward = false;
  }

  removeSavedPartDetailFile(partName, index: any) {
    if (this.iPartUploadedFileNameList.FileNameList) {
      this.iPartUploadedFileNameList.FileNameList.splice(index, 1);
    }
    let partNAme = partName.CompleteFileName ? partName.CompleteFileName : this.iPartsViewModel.rfqPartFile;
    console.log(partNAme, 'partNAme')
    // debugger;
    this._rfqService.deletePartGeneralAttachment(partNAme, this.loggedId, 0, this.rfqId).subscribe(
      (data: IPartsViewModel) => {
        console.log('File deleted....');
      },
      error => () => {
        console.error('Error: $error');
        this._toastr.error(error, 'Error!');
      }
    );
  }

  chkExp(dropDownvalue){
    console.log(dropDownvalue,"@@dropDownvalue");
    
    this.dropDownID = dropDownvalue;
    const result = this.NPartArrayColl[0].supplierList.filter(x => x.id == dropDownvalue);
    // if(dropDownvalue == "null") {
    //   console.log("NULLLLLLLL");
    //   result[0].quoteExpiryDate = 0
    // }
  var currDate = this.myDate.toISOString();
  var expDate = result[0].quoteExpiryDate;
  
  var d1 = new Date(currDate);
  var d2 = new Date(expDate);
  
  var newCurrDate = d1.getTime();
  var newExpDate = d2.getTime();
  console.log(newCurrDate,"CUrr date");
  console.log(newExpDate,"Exp Date");
  
  var diff = newCurrDate - newExpDate;
  if(diff > 0){
    this.isReqoute = true;
    this.nextBtn= false;
    console.log("TRUE");
  }
  else {
    console.log("FALSE");
    this.isReqoute = false;
    this.nextBtn= true;
  }
if(newExpDate == 0 || dropDownvalue=== "null"){
  this.isReqoute = false;
  this.nextBtn= true;
}

}


reQuote(){
  var reqData = {
      "rfqId": this.rfqId,
      "buyerContactId": this.loggedId,
      "suplierContactId": this.dropDownID, 
      "isAllowRequoting": true  
  }
    this._rfqService.setReQuotingInfo(reqData).subscribe((result: any) => {
      this._toastr.success(result, 'Success!');
      this.closePopUp();
    });
   }
// Calling Api for Award model step 2
   awardStepTwo(){
    var data = {}
        if(this.isSendMfgStandard === true ){
          data = { 
            "rfqId": this.rfqId,
            "purchaseOrderNumber": this.purchaseOrder,
            "isMfgStandardPurchaseOrder": true,
            "supplierContactId": this.loggedId
        }  
      }else{
          data =	{ 
            "rfqId": this.rfqId,
            "purchaseOrderNumber": this.purchaseOrder,
            "isMfgStandardPurchaseOrder": false,
            "FileName" :this.fileName ,
            "supplierContactId":this.loggedId
        }     
        }
        if(this.purchaseOrder == ""){
          this._toastr.warning("Please Select PO First", 'Warning.!');
        }else{
          this._rfqService.saveAwardData(data).subscribe(
            response => {
              this._toastr.success("PO Sent to Manufacturer", 'Success!');
              // close pop-up here
              this.isAwardStep2 = false;
            }
          ),error =>{
          };
        }
      

   }

   closeAwardModelAward(isOpened) {
    // this.closeModelEventHandler.emit(false);
        this.isFirstTabCompleted = false;
    this.isSecondTabCompleted = false;
    this.isAward = false;
    this.isAwardStep2 = false;
    // console.log("inside cancel", isOpened);
    // if(isOpened) {
    //   console.log("CLICKED CLOSE AWARD");
      
    //   this.showAwardAllPopup = false
    //   this.singleAwardModal = false
    // }
    if(isOpened === true) {
      this.singleAwardModal=false;

    } else {
      this.singleAwardModal=true;
    }
    }
    closeAwardAllModelAward(isOpened){
      if(isOpened === true) {
        this.showAwardAllPopup = false;
      } else {
        this.showAwardAllPopup = true;
      }
    }
}
