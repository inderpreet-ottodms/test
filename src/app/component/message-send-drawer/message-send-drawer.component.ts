import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Headers,
  Http
} from '@angular/http';
import * as moment from 'moment';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  ToastrService
} from 'ngx-toastr';
import {
  isArray
} from 'util';
import { uploadFileNDA } from '../../../constants/url-constant';
import {
  environment
} from '../../../environments/environment';
import {
  IMessagesViewModel
} from '../../core/models/rfqModel';
import { BuyerService } from '../../core/services/buyer/buyer.service';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  CustomValidatorService
} from '../../core/services/validator/custom-validator.service';
import { ProductAnalyticService } from './../../../app/shared/product-analytic/product-analytic';
declare var window;
declare var Quill: any;
@Component({
  selector: 'app-message-send-drawer',
  templateUrl: './message-send-drawer.component.html',
  styleUrls: ['./message-send-drawer.component.scss']
})
export class MessageSendDrawerComponent implements OnInit {

  propagateChange = (_: any) => {};
  propagateTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
  public value: string;
  @Output() drawer_OnClose = new EventEmitter < boolean > ();

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
  from_id: number;
  labelFocus: any;
  uploadingInProg: boolean;
  isLoader: boolean = false;
  isResponse: boolean = false;
  messageViewInitModel() {
    this.iRfqMessageViewModelColl = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 5,
      messageHierarchy: 0,
      pageName: '',
      originalMessageSubject: '',
      toContactIdEncrypt: '',
      fromContactIdEncrypt: '',
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
      companylogo: '',
      companyName: '',
      companyUrl: '',
      toContactCompanyUrl: '',
      toContactCompanylogo: '',
      toCompanyName: '',
      nDAApproveContactsRFQsLists: [],
      toCompanyId: 0,
      isNotification: false
    };
  }
  constructor(private _Http: Http, private _rfqService: RfqService, private _toastr: ToastrService,
    private _customValidatorsService: CustomValidatorService,
    private _fb: FormBuilder,
    private _buyerService: BuyerService,
  private productAnalyticService:ProductAnalyticService) {
    // tslint:disable-next-line:radix
    this.from_id = parseInt(localStorage.getItem('LoggedId'));
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
        if(this._rfqService.get('messageSentMessage')){
          this.contactIds.push(this.selectedIds[i].toCont);
        }
        if (this._rfqService.get('messageFromNda')) {
          this.contactIds.push(this.selectedIds[i].contactId);
        }
      }
    } else {
      this.contactIds.push(this.selectedIds);
    }
  }
  ngOnInit() {
    this.messageViewInitModel();
    this.uploadingInProg = false;
    this.appendText = '...';
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
  }
  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(true, 'messageSentFromRfq');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set('', 'selectContactIdsForMEessage');
    this._rfqService.set('', 'selectContactRFQId');
    this._rfqService.set('', 'nameOfBuyer');
    this.drawer_OnClose.emit(true);
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }

  onMessageSend() {
    if (this.messageForm.valid && this.isResponse === false) {
      this.isResponse = true;
      this.iRfqMessageViewModelColl.toContactIds = this.contactIds;
      this.iRfqMessageViewModelColl.fromCont = this.from_id;
      this.iRfqMessageViewModelColl.messageDate = moment.utc(new Date()).toDate();
      const tempRFQId = this._rfqService.get('selectContactRFQId');
      this.iRfqMessageViewModelColl.rfqId = (!tempRFQId) ? 0 : tempRFQId;
      this.iRfqMessageViewModelColl.pageName = 'component\buyer\global-message-tab\component\supplier-message\supplier-message.component.ts';
      this.iRfqMessageViewModelColl.messageSubject = this.messageForm.value.subject;
      this.iRfqMessageViewModelColl.messageDescr = this.messageForm.value.message;
      localStorage.setItem('pagename', 'buyer\global-message-tab\component\supplier-message\supplier-message.component.ts');
      this._rfqService.sendMessages(this.iRfqMessageViewModelColl).subscribe(
        result => {

          // this.iRfqMessageViewModelColl = result;
          if (result.result === true) {
            this.iRfqMessageViewModelColl = result;
            this.messageSuccessStatus = true;
            this.successOrFailureMsg = this.iRfqMessageViewModelColl.errorMessage;
            this._toastr.success(this.successOrFailureMsg, '');
            this.resetErrorStatus('messageSuccessStatus');
            this._rfqService.set(true, 'messageSentFromRfq');
            this._buyerService.setMessageEvent(true);
            this.closePartDrawer();
          } else {
            this.messageFailureStatus = true;
            this._toastr.warning(result.errorMessage, 'Warning!');
          }
          this.isResponse = false;
        },
        error => {
          this.isResponse = false;
          this._rfqService.handleError(error);
        },
        () => {
          this.isResponse = false;
        }
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
        // this.isLoader = true;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
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
    const url = environment.APIEndPoint + uploadFileNDA;
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
