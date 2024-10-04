import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Http,
  Headers
} from '@angular/http';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { ArchiveUnArchiveMessagesViewModel, ArchiveUnArchiveMessagesViewModelList, CreateNewRFQMessagesViewModel, IMessagesViewModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { CustomValidatorService } from '../../../../../core/services/validator/custom-validator.service';
import * as moment from 'moment';
declare var Quill: any;
import { uploadFileNDA } from '../../../../../../constants/url-constant';
@Component({
  selector: 'app-send-message-editor',
  templateUrl: './send-message-editor.component.html',
  styleUrls: ['./send-message-editor.component.scss']
})
export class SendMessageEditorComponent implements OnInit {
  propagateChange = (_: any) => { };
  propagateTouched = () => { };
  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
  public value: string;
  messageToSend = '';
  messageForm: FormGroup;
  rfqSettings = {};
  RfqList: any = [];
  selectedItems = [];
  createNewRFQMessagesViewModel = new CreateNewRFQMessagesViewModel;
  sendMessageObj: IMessagesViewModel;
  @Input('associateRfqId') rfqId: number;
  @Input('rfqMessage') isRfqMessage: number;
  @Input('childThreadData') childThreadData: any;
  @Input('messageThreadList') messageThreadList: any;
  @Output() message_sent = new EventEmitter<boolean>();
  isMsgSend: boolean = true;
  isLoader: boolean = false;
  isButtonClicked: boolean = false;
  dataToPostToDelete: any[]=[];
  archiveUnArchiveMessagesViewModelListModel: ArchiveUnArchiveMessagesViewModelList;
  attachFilesUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'files'
  });

  constructor(private _fb: FormBuilder,
    private _Http: Http,
    private _rfqService: RfqService,
    private _customValidatorsService: CustomValidatorService,
    private _toastr: ToastrService) {
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
    this.messageForm = this._fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      rfqId: [
        [], Validators.required
      ],
    });
    if (this.rfqId !== 0) {
      this.messageForm.patchValue({
        'rfqId': this.rfqId
      });
      this.createNewRFQMessagesViewModel.rfqIds.push(this.rfqId);
    }
    this.getRFQList();
    this.initSendMessageObj(); 
    console.log(this.childThreadData, 'childThreadData')
    console.log(this.messageThreadList, 'messageThreadList')
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  initSendMessageObj() {
    this.sendMessageObj = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 5,
      originalMessageSubject: '',
      pageName: '',
      fromContactIdEncrypt: '',
      toContactIdEncrypt: '',
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
      isNdaRequired: false,
      quoteReferenceNumber: '',
      toCompanyId: 0,
      isNotification: false
    };
  }
  // this function is used to get rfq list for copy rfq
  getRFQList() {
    this.RfqList = [];
    this.rfqSettings = {
      singleSelection: false,
      text: 'Select RFQ',
      searchPlaceholderText: 'Select RFQ',
      enableSearchFilter: true,
      labelKey: 'rfqName',
      primaryKey: 'rfqId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 2,
      maxHeight: 200,
      showCheckbox: true,
      enableCheckAll: false,
    };

    this._rfqService.getRFQList(this.loggedId, '').subscribe(
      result => {
        if (!result.isError) {
          this.RfqList = result.data;

        } else {
          this.RfqList = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }

  inputMsgObj: IMessagesViewModel;
  isBuyerMessage(messageObj) {
    return this.inputMsgObj.toCont === messageObj.fromCont;
  }
 
  messagesent() {
    this.message_sent.emit(true);
  }
  sendReplyMessage() {
    // // debugger;
    if (this.messageForm.value.message !== null && this.messageForm.value.message.length > 0 && this.messageForm.value.message.length <= 1000) {
      // this.markMessagesLoad();
      // this.sendMessageError = false;
      // let supplierMessage: any;
      // for (let i = 0; i < this.messageThreadList.length; i++) {
      //   if (!this.isBuyerMessage(this.messageThreadList[i])) {
      //     supplierMessage = this.messageThreadList[i];
      //     i = this.messageThreadList.length - 1;
      //   }
      // }
      this.sendMessageObj.rfqId = this.childThreadData.rfqId;
      this.sendMessageObj.messageTypeId = this.childThreadData.messageTypeId;
      this.sendMessageObj.messageHierarchy = this.childThreadData.messageId;
      this.sendMessageObj.messageSubject = this.childThreadData.messageSubject;
      this.sendMessageObj.messageDescr =this.messageForm.value.message;
      this.sendMessageObj.messageId = this.childThreadData.messageId;
      this.sendMessageObj.pageName = 'component\buyer\global-message-tab\component\message-thread\message-thread.component.ts';
      this.sendMessageObj.messageDate = moment.utc(new Date()).toDate();
      localStorage.setItem('pagename', 'buyer\global-message-tab\component\message-thread\message-thread.component.ts');
     

      this.sendMessageObj.fromCont = this.loggedId;
      this.sendMessageObj.toCont = this.childThreadData.fromCont === this.loggedId ? this.childThreadData.toCont : this.childThreadData.fromCont;
      this.sendMessageObj.toContactIds = [this.childThreadData.fromCont === this.loggedId ? this.childThreadData.toCont : this.childThreadData.fromCont];

      console.log(this.sendMessageObj, 'this.sendMessageObj')
      this._rfqService.sendMessages(this.sendMessageObj).subscribe(
        result => {
          if (result.result === true) {
            console.log(result.errorMessage);
            this._toastr.success(result.errorMessage, '');
            this.messagesent();
            this.unarchiveMessages();
            // this.getMessages(false);
            // this.initSendMessageObj();
            // this.messageToSend = '';
          }  else {
            this._toastr.warning(result.errorMessage, '');
          }
        },
        error => {
        },
        () => {}
      );
    } else {
      // if (this.messageToSend === null || this.messageToSend.length === 0) {
      //   this.sendMessageError = true;
      //   this.resetSendMessageError();
      // }

    }
  }
  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'associateMessageDrawer');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }
  // onRfqDeSelect(item: any) {
  //   const index: number = this.sendMessageObj.rfqIds.indexOf(item.rfqId);
  //   if (index !== -1) {
  //     this.sendMessageObj.rfqIds.splice(index, 1);
  //   }
  // }

  // // this function is used to select rfq from the rfq list
  // onRfqSelect(item: any) {
  //   this.sendMessageObj.rfqIds.push(item.rfqId);
  // }
  onFileSelect($event) {
    this.uploadAttachFiles();
    $event.srcElement.value = '';
  }

  uploadAttachFiles() {
    this.isLoader = true;
    const files = this.attachFilesUploader.queue;
    if ((this.attachFilesUploader.queue.length + this.sendMessageObj.messageFileNames.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!', 'Warning!');
      this.attachFilesUploader.queue = [];
      this.isLoader = false;
      return;
    }
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          this.sendMessageObj.messageFileNames.push(
            fName
          );
          this.isLoader = false;
        },
          error => {
            this.isLoader = false;
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

  getOriginalPartName(fileName) {
    if (fileName) {
      const fileNameArray = fileName.split('_S3_');
      if (fileNameArray.length === 1) {
        return fileNameArray[0];
      }
      return fileNameArray[1];
    }
  }
  removeSavedAttachFile(filename, index: any) {
    if (this.sendMessageObj.messageFileNames) {
      this.sendMessageObj.messageFileNames.splice(index, 1);
      this._toastr.success('File remove successfully', 'success!');
    }
  }
  // UnArchive Functionality
  unarchiveMessages() {
    for (let i = 0; i < this.messageThreadList.length; i++) {
      // Creating Object for delete Functionality
      this.dataToPostToDelete.push({
        parentMessageId: this.messageThreadList[0].messageId,
        messageId: this.messageThreadList[i].messageId,
        archieveBy: this.messageThreadList[i].toCont,
      });     
    } 
    this.archiveUnArchiveMessagesViewModelListModel = new ArchiveUnArchiveMessagesViewModelList();
        this.archiveUnArchiveMessagesViewModelListModel = {
          archiveUnArchiveMessagesList: this.dataToPostToDelete,
          isArchive: false
    }
    this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel).subscribe(
      result => {
        this.dataToPostToDelete = [];
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
}
