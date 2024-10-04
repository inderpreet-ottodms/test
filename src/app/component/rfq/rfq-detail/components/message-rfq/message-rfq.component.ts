import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  Http,
  Headers
} from '@angular/http';
import {
  ToastrService
} from 'ngx-toastr';
import {
  isArray
} from 'util';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  IMessagesViewModel
} from '../../../../../core/models/rfqModel';
import {
  environment
} from '../../../../../../environments/environment';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';
import {
  ILeadUserViewModel
} from '../../../../../core/models/profileModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  BuyerService
} from '../../../../../core/services/buyer/buyer.service';
import * as moment from 'moment';
import { ProductAnalyticService } from '../../../../../../app/shared/product-analytic/product-analytic';
declare var Quill: any;
declare var window;
@Component({
  selector: 'app-message-rfq',
  templateUrl: './message-rfq.component.html',
  styleUrls: ['./message-rfq.component.scss']
})
export class MessageRfqComponent implements OnInit, OnDestroy {

  propagateChange = (_: any) => {};
  propagateTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
  public value: string;

  attachFilesUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'files'
  });
  selectedIds: any;
  messageForm: FormGroup;
  result: any;
  contactIds = [];
  contactIdCount = '';
  iRfqMessageViewModelColl: IMessagesViewModel;
  appendText: string;
  @ViewChild('messageAttachment',{static:false}) messageAttachment;
  defaultAwsPath = '';
  successOrFailureMsg = '';
  messageSuccessStatus = false;
  messageFailureStatus = false;
  // tslint:disable-next-line:radix
  from_id = parseInt(localStorage.getItem('LoggedId'));
  labelFocus: any;
  uploadingInProg: boolean;
  iLeadUserViewModel: ILeadUserViewModel;
  userType: string;
  messageViewInitModel() {
    this.iRfqMessageViewModelColl = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 5,
      pageName: '',
      toContactIdEncrypt: '',
      originalMessageSubject: '',
      fromContactIdEncrypt: '',
      messageHierarchy: 0,
      messageSubject: '',
      messageDescr: '',
      messageDate: null,
      fromCont: 0,
      toCont: 0,
      messageRead: false,
      messageSent: false,
      readDate: null,
      messageStatusIdRecipient: 0,
      messageStatusIdAuthor: 0,
      expirationDate: null,
      trash: false,
      trashDate: null,
      fromTrash: false,
      fromTrashDate: null,
      errorMessage: '',
      result: false,
      isSelected: false,
      toContactIds: [],
      messageStatus: '',
      supplierProfileUrl: '',
      buyerProfileUrl: '',
      sendEmail: false,
      messageStatusId: 0,
      messageTypeValue: 'rfqFreeMessage',
      fromContName: '',
      toContName: '',
      messageFileNames: [],
      isNDAToApproveAll: false,
      toRFQIds: [],
      companyId: 0,
      companyName: '',
      companyUrl: '',
      companylogo: '',
      toContactCompanyUrl: '',
      toContactCompanylogo: '',
      toCompanyName: '',
      nDAApproveContactsRFQsLists: [],
      toCompanyId: 0,
      isNotification: false
    };
  }
  constructor(private _Http: Http, private _rfqService: RfqService, private _toastr: ToastrService,
    private _customValidatorsService: CustomValidatorService, private _masterService: MasterService,
    private _fb: FormBuilder, private _buyerService: BuyerService,private productAnalyticService:ProductAnalyticService) {
      var fontSizeStyle = Quill.import('attributors/style/size');
      fontSizeStyle.whitelist = ['2em', '1.5em', '0.5em'];
      Quill.register(fontSizeStyle, true);
    }
    writeValue(value: any) {
      this.value = value;
    }
    errorDisMsg: string;
  changeText(e) {
    console.log(e);
    if (e.textValue.length >= 1 && e.textValue.length <= 1000) {
      this.errorDisMsg = '';
    } else if (e.textValue.length > 1000) {
      this.errorDisMsg = 'Exceed the character length.';
    }
    this.propagateChange(e.htmlValue);
  }
  getSelectedId() {
    this.contactIds = [];
    this.selectedIds = this._rfqService.get('selectContactIdsForMEessage');
    if (isArray(this.selectedIds)) {
      for (let i = 0; i < this.selectedIds.length; i++) {
        if (this._rfqService.get('messageFromMessage')) {
          this.contactIds.push(this.selectedIds[i].fromCont);
        }
        if (this._rfqService.get('messageFromNda')) {
          this.contactIds.push(this.selectedIds[i].contactId);
        }
      }
    } else {
      this.contactIds.push(this.selectedIds);
    }
  }
  isLoader:boolean=false;
  ngOnInit() {
    this.uploadingInProg = false;
    this.appendText = '...';
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
    this.messageViewInitModel();
    this.messageForm = this._fb.group({
      subject: [this.iRfqMessageViewModelColl['messageSubject'], Validators.required],
      message: [this.iRfqMessageViewModelColl['messageDescr'], Validators.required],
    });
    this.getSelectedId();
    const tempName = this._rfqService.get('nameOfBuyer');
    if (!!tempName) {
      tempName.trim();
    }
    if (this.contactIds.length === 1 && (!!tempName) && (tempName !== '')) {
      this.contactIdCount = tempName;
    } else {
      this.contactIdCount = this.contactIds.length + ' Recipients';
    }
    this.userType = localStorage.getItem('Usertype');
  }
  ngOnDestroy() {
    this.closePartDrawer();
  }
  closePartDrawer() {

    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'messageRfqForFollowedBuyer');
    this._rfqService.set('', 'selectContactIdsForMEessage');
    this._rfqService.set('', 'selectContactRFQId');
    this._rfqService.set('', 'selectedCompanyId');
    this._rfqService.set('', 'nameOfBuyer');
    this._rfqService.set(null, 'quoteContactId');
    this._rfqService.set(null, 'checkFocus');
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  onMessageSend(leadType) {
    if (this.messageForm.valid) {
      const tempSupplierId = this._rfqService.get('leadStreamSupplierCompanyId');
      if (this.userType === 'Buyer' && tempSupplierId !== null && tempSupplierId !== undefined && tempSupplierId !== '') {
        this._rfqService.set(null, 'leadStreamSupplierCompanyId');
        this.iLeadUserViewModel.leadInteractionType = leadType;
        this.iLeadUserViewModel.contactId = this.loggedId;
        this.iLeadUserViewModel.companyId = tempSupplierId;
        this._masterService.setSetLeadUser(this.iLeadUserViewModel).subscribe(
          (result) => {
            // console.log(result);
          }
        );
      }
      this.iRfqMessageViewModelColl.toContactIds = this.contactIds;
      this.iRfqMessageViewModelColl.fromCont = this.from_id;
      this.iRfqMessageViewModelColl.messageDate =  moment.utc(new Date()).toDate();
      const tempRFQId = this._rfqService.get('selectContactRFQId');
      this.iRfqMessageViewModelColl.rfqId = (!tempRFQId) ? 0 : tempRFQId;
      this.iRfqMessageViewModelColl.pageName = 'component\rfq\rfq-detail\components\message-rfq\message-rfq.component.ts';
      const tempCompId = this._rfqService.get('selectedCompanyId');
      this.iRfqMessageViewModelColl.companyId = (!tempCompId) ? 0 : tempCompId;
      this.iRfqMessageViewModelColl.messageSubject = this.messageForm.value.subject;
      this.iRfqMessageViewModelColl.messageDescr = this.messageForm.value.message;
      localStorage.setItem('pagename', 'rfq\rfq-detail\components\message-rfq\message-rfq.component.ts');
      this._rfqService.sendMessages(this.iRfqMessageViewModelColl).subscribe(
        result => {
          if (result.result === true) {
            this.iRfqMessageViewModelColl = result;
            this.messageSuccessStatus = true;
            this._rfqService.set(true, 'isdistrubtion');
            this.successOrFailureMsg = this.iRfqMessageViewModelColl.errorMessage;
            this._toastr.success(this.successOrFailureMsg, 'Success.!');
            this.resetErrorStatus('messageSuccessStatus');
            this._rfqService.set(true, 'messageSentFromRfq');
            this.closePartDrawer();
            this._buyerService.setMessageEvent(true);
          } else {
            this.messageFailureStatus = true;
            this._toastr.warning(result.errorMessage, 'Warning!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    } else {
      this._customValidatorsService.validateAllFormFields(this.messageForm);
    }
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_MESSAGE_SENT);
  }
  resetBtn() {
    const subject = this.messageForm.value.subject;
    const message = this.messageForm.value.message;
    if (subject === '' || message === '') {
      return true;
    } else {
      return false;
    }
  }
  checkMessageField(field: string) {
    return this.messageForm.value[field] === '';
  }
  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  resetErrorStatus(status: string) {
    setTimeout(() => {
      if (status === 'messageSuccessStatus') {
        this.messageSuccessStatus = false;
      } else {
        this.messageFailureStatus = false;
      }
      this.closePartDrawer();
    }, 6000);
  }

  removeSavedAttachFile(filename, index: any) {
    if (this.iRfqMessageViewModelColl.messageFileNames) {
      this.iRfqMessageViewModelColl.messageFileNames.splice(index, 1);
      this._toastr.success('File remove successfully', 'success!');
    }
  }
  onFileSelect($event) {
    this.uploadAttachFiles();
    $event.srcElement.value = '';

  }
  uploadAttachFiles() {
    const files = this.attachFilesUploader.queue;
    if ((this.attachFilesUploader.queue.length + this.iRfqMessageViewModelColl.messageFileNames.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!', 'Warning!');
      this.attachFilesUploader.queue = [];
      return;
    }
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          this.iRfqMessageViewModelColl.messageFileNames.push(
            fName
          );
        });
      }
    }
    this.attachFilesUploader.queue = [];
  }

  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + 'Upload/UploadFileNDA';
    return this._Http.post(url, input, {
      headers: headers
    });
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
  }

  getFileUrl(fileUrl: string) {
    return this.defaultAwsPath + fileUrl;
  }

  getOriginalPartName(fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        return filenNameArray[0];
      }
      return filenNameArray[1];
    }
  }

  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
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
}
