import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { RfqService } from '../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { IMessagesViewModel, NDAApproveContactsRFQsList } from '../../../../core/models/rfqModel';
import { environment } from '../../../../../environments/environment';
import { Http,  Headers } from '@angular/http';
import { CustomValidatorService } from '../../../../core/services/validator/custom-validator.service';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { isArray } from 'util';
import * as moment from 'moment';
declare var Quill: any;
import { uploadFileNDA } from '../../../../../constants/url-constant';
@Component({
  selector: 'app-message-buyer',
  templateUrl: './message-buyer.component.html',
  styleUrls: ['./message-buyer.component.scss']
})
export class MessageBuyerComponent implements OnInit, OnDestroy {

  propagateChange = (_: any) => {};
  propagateTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
  public value: string;

  @Input('rfqId') rfqId: number;
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
  ndaApproveContactsRFQsList:NDAApproveContactsRFQsList;
  messageViewInitModel() {
    this.iRfqMessageViewModelColl = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 5,
      originalMessageSubject: '',
      toContactIdEncrypt: '',
      pageName: '',
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
      toCompanyName:'',
      nDAApproveContactsRFQsLists:[],
      toCompanyId: 0,
      isNotification: false
    };

    this.ndaApproveContactsRFQsList ={
      contactId:0,
       rfqId:0
      }
  }
  constructor(private _Http: Http, private _rfqService: RfqService, private _toastr: ToastrService,
    private _customValidatorsService: CustomValidatorService,
    private _fb: FormBuilder) {
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
        this.contactIds.push(this.selectedIds[i].fromCont);
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
  ngOnDestroy() {
    this.closePartDrawer();
  }
  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set('', 'selectContactIdsForMEessage');
    this._rfqService.set('', 'selectContactRFQId');
    this._rfqService.set('', 'nameOfBuyer');
    this._rfqService.set(0, 'rfqId');
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }

  onMessageSend() {
    if (this.messageForm.valid) {
      this.iRfqMessageViewModelColl.toContactIds = this.contactIds;
      this.iRfqMessageViewModelColl.fromCont = this.from_id;
      this.iRfqMessageViewModelColl.messageDate = moment.utc(new Date()).toDate();
      this.iRfqMessageViewModelColl.pageName = 'component\buyer\component\message-buyer\message-buyer.component.ts';
      const tempRFQId = this._rfqService.get('selectContactRFQId');
      this.iRfqMessageViewModelColl.rfqId = this.rfqId;
      this.iRfqMessageViewModelColl.messageSubject = this.messageForm.value.subject;
      this.iRfqMessageViewModelColl.messageDescr = this.messageForm.value.message;
      localStorage.setItem('pagename', 'buyer\component\message-buyer\message-buyer.component.ts');
      this._rfqService.sendMessages(this.iRfqMessageViewModelColl).subscribe(
        result => {


          if (result.result === true) {
            this.iRfqMessageViewModelColl = result;
            this.messageSuccessStatus = true;
            this.successOrFailureMsg = this.iRfqMessageViewModelColl.errorMessage;
            this._toastr.success(this.successOrFailureMsg, '');
            this.resetErrorStatus('messageSuccessStatus');
            this._rfqService.set(true, 'messageSentFromRfq');
            this.closePartDrawer();
          } else {
            this.messageFailureStatus = true;
         //   this.successOrFailureMsg = result.errorMessage;
           // this.resetErrorStatus('messageFailureStatus');
            this._toastr.warning(result.errorMessage, 'Warning!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {
        }
      );
    } else {
      this._customValidatorsService.validateAllFormFields(this.messageForm);
    }
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

  onFileSelect(file) {
    this.uploadingInProg = true;
    this.upload(this.messageAttachment.nativeElement.files[0]).subscribe(
      (res) => {
        this.uploadingInProg = false;
        const result1 = JSON.parse(res['_body']);
        this.iRfqMessageViewModelColl.messageFileNames = [result1['fileName']];
      },
      error => {
        this.uploadingInProg = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
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
    // let oappendText = '';
    // let fixStr: '';
    // if (fileName) {
    //   const filenNameArray = fileName.split('_S3_');
    //   if (filenNameArray.length === 1) {
    //     const charactorCount = filenNameArray[0].length;
    //     if (charactorCount > 29) {
    //       fixStr = fileName.slice(0, 29);
    //       oappendText = fixStr.concat(this.appendText);
    //     } else {
    //       return filenNameArray[0];
    //     }
    //   } else {
    //     const charactorCount = filenNameArray[1].length;
    //     if (charactorCount > 29) {
    //       fixStr = fileName.slice(0, 29);
    //       oappendText = fixStr.concat(this.appendText);
    //       return oappendText;
    //     } else {
    //       return filenNameArray[1];
    //     }

    //   }
    //   // return filenNameArray[1];
    // }
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
            // if (fileName) {
            //   const filenNameArray = fileName.split('_S3_');
            //   if (filenNameArray.length === 1) {
            //     fileName = filenNameArray[0];
            //   } else {
            //     fileName = filenNameArray[1];
            //   }
            // }
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
