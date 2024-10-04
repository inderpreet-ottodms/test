import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RfqService } from './../../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { IMessagesViewModel, DownloadAllFilesViewModel } from '../../../../../core/models/rfqModel';
import { environment } from '../../../../../../environments/environment';
import { HttpModule, Http, Response, RequestOptions, Headers } from '@angular/http';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { FileUploader } from 'ng2-file-upload';
import * as moment from 'moment';
declare var Quill: any;
import { uploadFileNDA } from '../../../../../../constants/url-constant';
@Component({
  selector: 'app-message-thread',
  templateUrl: './message-thread.component.html',
  styleUrls: ['./message-thread.component.scss']
})
export class MessageThreadComponent implements OnInit {

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
  @Input('messageThreadId') messageThreadId: number;
  messageThreadList: IMessagesViewModel[];
  inputMsgObj: IMessagesViewModel;
  sendMessageObj: IMessagesViewModel;
  Downloadallfiles : DownloadAllFilesViewModel;
  defaultSupplierLogo = 'assets/company/avatar-manu-basic.svg';
  defaultBuyerLogo = 'assets/company/avatar-manu-basic.svg';
  defaultAwsPath = '';
  @ViewChild('messageAttachment',{static:false}) messageAttachment;
  appendText: string;
  messageToSend = '';
  sendMessageError = false;
  userType: string;
  temp: string[];
  IsactiveBtn: string;
  OpenContactName: string;
  compName: string = null;
  userAccount:string='';
  toShowContactModel:boolean=false;
  constructor(private _Http: Http, private _rfqService: RfqService,
    private _toastr: ToastrService,private _profileService:ProfileService) {
    this.messageThreadList = [];
    this.userType = localStorage.getItem('Usertype');
    this._rfqService.getisSupplierMessageThread().subscribe(message => {

      if (message.text === 'true') {
        this.messageThreadList = [];
        this.inputMsgObj = this._rfqService.get('messageForThread');
        this.messageThreadId = this.inputMsgObj.messageId;
        this.appendText = '...';
        this.getMessages();
        this.initSendMessageObj();
      }
    });
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
  ngOnInit() {
    this.userAccount = localStorage.getItem('AccountType');
    this.IsactiveBtn =  this._rfqService.get('IsActiveBtn');
    this.inputMsgObj = this._rfqService.get('messageForThread');
    this.messageThreadId = this.inputMsgObj.messageId;
    this.appendText = '...';
    this.getMessages();
    this.initSendMessageObj();
    this.OpenContactName = this._rfqService.get('toContName');
    // this.compName = this._rfqService.get('compName');
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes) {
    this.inputMsgObj = this._rfqService.get('messageForThread');
    this.getMessages();
    this.initSendMessageObj();
  }

  initSendMessageObj() {
    this.sendMessageObj = {
      messageId: 0,
      rfqId: 0,
      pageName: '',
      messageTypeId: 5,
      originalMessageSubject: '',
      toContactIdEncrypt: '',
      messageHierarchy: 0,
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
      companyName: '',
      companyUrl: '',
      companylogo: '' ,
      toContactCompanyUrl: '' ,
      toContactCompanylogo: '',
      toCompanyName:'',
      nDAApproveContactsRFQsLists:[],
      quoteReferenceNumber:'',
      toCompanyId: 0,
      isNotification: false
    };
  }
  closeMessageThreadDrawer () {
    // this.markMessagesAsRead();
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
  }

  getMessages() {
    this._rfqService.getMessageThreadByID(this.inputMsgObj).subscribe(
      result => {
        if (result.result) {
          this.compName = result['data'][0].companyName;
          this.messageThreadList = result['data'].reverse();
          this.markMessagesAsRead();
        } else {
          // console.log(result.errorMessage);
          this._toastr.error(result.errorMessage, 'Error!');
          this.closeMessageThreadDrawer();
        }
      },
      error => {
        this._rfqService.handleError(error);
        this.closeMessageThreadDrawer();
      },
      () => { }
    );
  }

  isBuyerMessage(messageObj) {
    return this.inputMsgObj.toCont === messageObj.fromCont;
  }
  isNextBuyerMessage(i) {
    return this.inputMsgObj.toCont === this.messageThreadList[i].fromCont;
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  // getProfilePic(messageObj) {
  //     if (!!messageObj.companylogo && messageObj.companylogo !== '') {
  //       return this.defaultAwsPath + messageObj.companylogo;
  //     } else if (this.isBuyerMessage(messageObj)) {
  //       return '';
  //     } else {
  //       return '';
  //     }

  // }

  getProfilePic(messageObj) {
    const IsactiveBtn = this._rfqService.get('IsActiveBtn');
    if (IsactiveBtn === 'sent') {
      if (!!messageObj.companylogo && messageObj.companylogo !== '') {
        return this.defaultAwsPath + messageObj.companylogo;
      } else if (this.isBuyerMessage(messageObj)) {
        return '';
      } else {
        return '';
      }
    } else {
      if (!!messageObj.companylogo && messageObj.companylogo !== '') {
        return this.defaultAwsPath + messageObj.companylogo;
      } else if (this.isBuyerMessage(messageObj)) {
        return '';
      } else {
        return '';
      }
    }
  }
  markMessagesAsRead() {
    this.messageThreadList.forEach(singleMessage => {
      if (!singleMessage.messageRead && singleMessage.toCont == this.loggedId) {
        this._rfqService.changeMessageStatus(singleMessage.messageId).subscribe(
          result => {
            if (result.result === true) {
              // console.log(result.errorMessage);
              // this._toastr.success(result.errorMessage, '');
            } else {
              // console.log(result.errorMessage);
              this._toastr.error(result.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {
          }
        );
      }
    });
  }
  getDate(val){
    if (val !== undefined && val !== null && val !== '') {
      if(moment(val).isValid()) {
        return moment(moment.utc(val).toDate()).format('MMM-DD-YYYY h:mm a');
      } else {
        return val;
      }
    } else {
      return '';
    }
  }
  sendReplyMessage() {
    if (this.messageToSend !== null && this.messageToSend.length > 0 && this.messageToSend.length <= 1000) {

      // this.markMessagesAsRead();

      this.sendMessageError = false;
      let supplierMessage: any;
      for (let i = 0; i < this.messageThreadList.length; i++) {
        if (!this.isBuyerMessage(this.messageThreadList[i])) {
          supplierMessage = this.messageThreadList[i];
          i = this.messageThreadList.length - 1;
        }
      }
      this.sendMessageObj.rfqId = supplierMessage.rfqId;
      this.sendMessageObj.pageName = 'component\supplier\supplier-rfq-detail\component\message-thread\message-thread.component.ts';
      this.sendMessageObj.messageTypeId = supplierMessage.messageTypeId;
      this.sendMessageObj.messageHierarchy = supplierMessage.messageId;
      this.sendMessageObj.messageSubject = supplierMessage.messageSubject;
      this.sendMessageObj.messageDescr = this.messageToSend;
      this.sendMessageObj.messageDate = moment.utc(new Date()).toDate();
      // this.sendMessageObj.fromCont = supplierMessage.toCont;
      // this.sendMessageObj.toCont = supplierMessage.fromCont;
      // this.sendMessageObj.toContactIds = [supplierMessage.fromCont];


      if (this.IsactiveBtn === 'sent') {
        this.sendMessageObj.fromCont = supplierMessage.fromCont;
        this.sendMessageObj.toCont = supplierMessage.toCont;
        this.sendMessageObj.toContactIds = [supplierMessage.toCont];
      } else {
        this.sendMessageObj.fromCont = supplierMessage.toCont;
        this.sendMessageObj.toCont = supplierMessage.fromCont;
        this.sendMessageObj.toContactIds = [supplierMessage.fromCont];
      }
      localStorage.setItem('pagename', 'supplier\supplier-rfq-detail\component\message-thread\message-thread.component.ts');
      this._rfqService.sendMessages( this.sendMessageObj ).subscribe(
        result => {

          if (result.result === true) {
            // console.log(result.errorMessage);
            this._toastr.success(result.errorMessage, '');
            // this.getMessages();
            this._rfqService.set(true, 'messageSentFromRfq');
            this.initSendMessageObj();
            this.messageToSend = '';
            this._rfqService.set(false, 'showSidePanel');
            this._rfqService.set(false, 'messageThreadDrawer');
            this._rfqService.set(false, 'transferRfq');
            this._rfqService.set(false, 'messageRfq');
          } else {
            // console.log(result.errorMessage);
            this._toastr.error(result.errorMessage, 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {
        }
      );
    } else if(this.messageToSend === null || this.messageToSend.length === 0){
      this.sendMessageError = true;
      this.resetSendMessageError();
    }
  }

  resetSendMessageError() {
    setTimeout(() => {
      this.sendMessageError = false;
    }, 5000);
  }
  isReadFlagAllowed (i) {
    if (i === (this.messageThreadList.length - 1)) {
      return false;
    } else if (this.messageThreadList[i].messageRead && this.messageThreadList[i + 1].messageRead) {
      return true;
    } else {
      return false;
    }
  }


  removeSavedAttachFile(filename, index: any) {
    if (this.sendMessageObj.messageFileNames) {
       this.sendMessageObj.messageFileNames.splice(index, 1);
       this._toastr.success('File remove successfully', 'success!');
    }

  }

  onFileSelect($event) {
    this.uploadAttachFiles();
    $event.srcElement.value = '';

  }
  uploadAttachFiles() {
    // this.sendMessageObj.messageFileNames =[];
    const files = this.attachFilesUploader.queue;
    if ((this.attachFilesUploader.queue.length +     this.sendMessageObj.messageFileNames.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!','Warning!');
      this.attachFilesUploader.queue=[];
      return;
    }
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        // ++this.isAttachmentsLoading;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          // this.iAttachUploadedFileName.oFileName = fileNameArray[1];
          // this.iAttachUploadedFileName.CompleteFileName = fName;

          this.sendMessageObj.messageFileNames .push(
            fName
          );
        //   this.iAttachUploadedFileName = {
        //     oFileName: '',
        //     CompleteFileName: ''
        //   };
       });
      }
    }
    this.attachFilesUploader.queue=[];
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
  downloadAllFiles(fileCompArray: string[]) {
    // fileCompArray.forEach(element => {
    //   this.downloadS3File(element, isDownload);
    // });

    // if (partfile !== '') {
    //   this.downloadS3File(partfile, isDownload);
    // }

    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    };
    this.temp = [];
   let data = JSON.stringify(fileCompArray);
   this.temp = JSON.parse(data);
    // if (partfile !== '') {
    //   // this.downloadS3File(partfile, isDownload);
    //   this.temp.push(partfile);
    // }
   this.Downloadallfiles.filename = this.temp;

    this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response=>{
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
    }, error =>{

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

          if (link.download !== undefined && isDownload ) {
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

  getOriginalPartName (fileName) {
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
    //     if (charactorCount > 29 ) {
    //        fixStr =  fileName.slice(0, 29);
    //        oappendText = fixStr.concat(this.appendText);
    //     } else {
    //       return filenNameArray[0];
    //     }
    //   } else {
    //     const charactorCount = filenNameArray[1].length;
    //     if (charactorCount > 29 ) {
    //        fixStr =  fileName.slice(0, 29);
    //        oappendText =  fixStr.concat(this.appendText);
    //        return oappendText;
    //     } else {
    //       return filenNameArray[1];
    //     }
    //   }
    // }
  }
  isPremium() {
    let IsPremiumEncrypt= localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    this.userType = localStorage.getItem('Usertype');
    if ((IsPremiumDecrypt === 'true') || (this.userType === 'Buyer' )) {
      return true;
    } else {
      return false;
    }

  }


  isUserAccountType() {
 const type = localStorage.getItem('AccountType');
    if (type === 'Silver') {
      return true;
    } else {
      return false;
    }

  }
  upgradeClick() {
    this._rfqService.set(true,'UpgradeReqFlag');
  }
  removeHtmlTag(content){
    return content.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, "");
   }

   openContactModal() {
    this.toShowContactModel = true;
  }
}
