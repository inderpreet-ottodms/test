import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMessagesViewModel } from '../../core/models/rfqModel';
import { RfqService } from '../../core/services/rfq/rfq.service';
import * as moment from 'moment';
@Component({
  selector: 'app-message-threads',
  templateUrl: './message-threads.component.html',
  styleUrls: ['./message-threads.component.scss']
})
export class MessageThreadsComponent implements OnInit {

  @Input() message;
  @Output() changeToReply = new EventEmitter();
  messageThreadList: IMessagesViewModel[];
  userAccount:string;
  msgId: any;
  showNdaModel: boolean;
  replyBtn:boolean = true;

  constructor(private _rfqService: RfqService) { }

  ngOnInit() {
    if(this.message.fromCont == null){
      this.replyBtn = false;
    }
    this.userAccount = localStorage.getItem('AccountType');
    this.messageThreadList = [];
    let tempMessage: IMessagesViewModel;
      tempMessage = {
        messageId: this.message.messageId,
        originalMessageSubject: this.message.originalMessageSubject,
        rfqId: this.message.rfqId,
        pageName: this.message.pageName,
        toContactIdEncrypt: this.message.toContactIdEncrypt,
        fromContactIdEncrypt: this.message.fromContactIdEncrypt,
        messageTypeId: this.message.messageTypeId,
        messageHierarchy: this.message.messageHierarchy,
        messageSubject: this.message.messageSubject,
        messageDescr: this.message.messageDescr,
        messageDate: this.message.messageDate,
        fromCont: this.message.fromCont,
        toCont: this.message.toCont,
        messageRead: this.message.messageRead,
        messageSent: this.message.messageSent,
        readDate: this.message.readDate,
        messageStatusIdRecipient: this.message.messageStatusIdRecipient,
        messageStatusIdAuthor: this.message.messageStatusIdAuthor,
        expirationDate: this.message.expirationDate,
        trash: this.message.trash,
        trashDate: this.message.trashDate,
        fromTrash: this.message.fromTrash,
        fromTrashDate: this.message.fromTrashDate,
        errorMessage: this.message.errorMessage,
        result: this.message.result,
        isSelected: this.message.isSelected,
        toContactIds: this.message.toContactIds,
        messageStatus: this.message.messageStatus,
        supplierProfileUrl: this.message.supplierProfileUrl,
        buyerProfileUrl: this.message.buyerProfileUrl,
        sendEmail: this.message.sendEmail,
        messageStatusId: this.message.messageStatusId,
        messageTypeValue: this.message.messageTypeValue,
        fromContName: this.message.fromContName,
        toContName: this.message.toContName,
        messageFileNames: this.message.messageFileNames,
        isNDAToApproveAll: this.message.isNDAToApproveAll,
        toRFQIds: this.message.toRFQIds,
        companyId: this.message.companyId,
        companyName: this.message.companyName,
        companyUrl: this.message.companyUrl,
        companylogo: this.message.companylogo,
        toContactCompanyUrl: this.message.toContactCompanyUrl,
        toContactCompanylogo: this.message.toContactCompanylogo,
        toCompanyName: this.message.toCompanyName,
        nDAApproveContactsRFQsLists:[],
        isNdaRequired: false,
        quoteReferenceNumber: '',
        isMessageThread : this.message.isMessageThread,
        toCompanyId: this.message.toCompanyId,
        isNotification: this.message.isNotification
      };
      this.getMessages(tempMessage);
  }

  getMessages(messageObj) {
    this._rfqService.getMessageThreadByID(messageObj).subscribe(
      result => {
        if (result.result) {
          this.messageThreadList = result['data'].reverse();
          // this.markMessagesAsRead();
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  isBuyerMessage(messageObj) {
    return this.message.toCont === messageObj.fromCont;
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
  openMessageDrawer(){
    this.changeToReply.emit(this.message);
  }

  getProfilePic(messageObj) {
    const IsactiveBtn = this._rfqService.get('IsActiveBtn');
    if (IsactiveBtn === 'sent') {
      if (!!messageObj.toContactCompanylogo && messageObj.toContactCompanylogo !== '') {
        return messageObj.toContactCompanylogo;
      } 
    } else {
      if (!!messageObj.companylogo && messageObj.companylogo !== '') {
        return messageObj.companylogo;
      } 
    }
  }
  getUserName(messageObj){
    const IsactiveBtn = this._rfqService.get('IsActiveBtn');
    if (IsactiveBtn === 'sent') {
      let userName = JSON.parse(localStorage.getItem("iContactViewModel"));
      return userName.firstName+' '+userName.lastName;
        // return messageObj.toContactCompanylogo;
    } else {
        return messageObj.fromContName;
    }
  }

  downloadAllFiles(fileCompArray: string[]) {
    let downloadAllFiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0
    };
    let temp = [];
    let data = JSON.stringify(fileCompArray);
    temp = JSON.parse(data);
    downloadAllFiles.filename = temp;
    this._rfqService.getDownloadAllFileURL(downloadAllFiles).subscribe(response => {
      // console.log('data' , privateFileFileName);
      if (response.result === true) {
        const resData = response.data;
        const fileLink = resData.privateFileFileName;
        if (fileLink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(fileLink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = fileLink;
          link.setAttribute('target', '_blank');
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    }, error => {}
    )
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const fileLink = resData.fileName;
        if (fileLink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(fileLink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = fileLink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = fileLink.substring(fileLink.lastIndexOf('/') + 1, fileLink.length);
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
  openNdaModel(id){
    this.msgId = id;
    this.showNdaModel = true;
  }
  closeNDAModelEvent(val){
    if(val.accepted){
      let index = this.messageThreadList.findIndex(x=> x.messageId === this.msgId);
      if(index !== -1){
        this.messageThreadList[index].isNdaRequired = false;
      }
    }
    this.showNdaModel = false;
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  markMessagesAsRead() {
    this.messageThreadList.forEach(singleMessage => {
      if (!singleMessage.messageRead && singleMessage.toCont == this.loggedId) {
        this._rfqService.changeMessageStatus(singleMessage.messageId).subscribe(
          result => {
            if (result.result === true) {
              // console.log(result.errorMessage);
            } else {
              // console.log(result.errorMessage);
              // this._toastr.error(result.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }
    });

  }
}
