import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ArchiveUnArchiveMessagesViewModel, ArchiveUnArchiveMessagesViewModelList, DownloadAllFilesViewModel, IMessageListViewModel, IMessagesViewModel, ISupplierRFQViewModel, MessageReadUnreadViewModel, SupplierDashListModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import * as moment from 'moment';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../../core/services/profile/profile.service';

@Component({
  selector: 'app-common-message',
  templateUrl: './common-message.component.html',
  styleUrls: ['./common-message.component.scss',
    '../../../../../../assets/icon/icofont/css/icofont.scss'],
  providers: [ConfirmationService]
})
export class CommonMessageComponent implements OnInit {

  @Input('messageSearchText') messageSearchText: string;
  isLoader: boolean;
  //showAllMsgs: boolean = false;
  showBuyersMsgs: boolean = false;
  showRFQsMsgs: boolean = false;
  items: IMessagesViewModel[];
  userType: string = '';
  isBuyer: boolean = false;
  selectedDivIndex = null;
  selectedDivIndex2 = null;
  messageThreadList: IMessagesViewModel[];
  showChildThread: boolean = false;
  isMesssageAvailable: boolean;
  totalMessageCount: number = 0;
  totalBuyerMsgCount: number = 0;
  totalSupplierMsgCount: number = 0;
  totalRfqMsgCount: number = 0;
  childThreadData: any;
  secondchildThreadData: any;
  isChildData: boolean = false;
  chkBoxCountArr: IMessagesViewModel[];
  childchkBoxCountArr: IMessagesViewModel[];
  contactID: number;
  parentAndChildMsgIDArray: any[] = [];
  messageIdToDelete: any[];
  iMessageListViewModel: IMessageListViewModel;
  modalBtnText: string = '';
  MessageReadUnreadViewModel: MessageReadUnreadViewModel;
  currentMessageType: string = 'All';
  totalCount: number;
  iRfqMessageViewModelColl: IMessagesViewModel[];
  filteredItems: IMessagesViewModel[];
  currentIndex = 1;
  pageStart = 1;
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  searchFilterValue: string;
  sortFilterValue: string;
  pagesIndex: Array<number>;
  childArray: any[] = [];
  msgThread: any[] = [];
  isAllActiveTab: boolean = true;
  isBuyerActiveTab: boolean = false;
  isSupplierActiveTab: boolean = false;
  isRFQActiveTab: boolean = false;
  isArchiveTab: boolean = false;
  isSentTab: boolean = false;
  accountType: string = '';
  arrayLength: number = 0;
  logoPathToShow: string;
  defaultAwsPath = '';
  companyID: any;
  dataToPostToDelete: any[] = [];
  isThreadListOpen: boolean = false;
  archiveMsgListCreation: any;
  reverseMsgList1: any;
  archiveUnArchiveMessagesViewModelListModel: ArchiveUnArchiveMessagesViewModelList;
  archiveUnArchiveMessagesViewModel: ArchiveUnArchiveMessagesViewModel[];
  Downloadallfiles: DownloadAllFilesViewModel;
  temp: string[];
  isShowReplyEditor: boolean = false;
  //variable declaration ends

  constructor(private _rfqService: RfqService, private confirmationService: ConfirmationService, private _toastr: ToastrService, private router: Router, private _profileService: ProfileService) {
    this.isMesssageAvailable = true;
    this.isLoader = false;
    this.chkBoxCountArr = [];
    this.childchkBoxCountArr = [];
    this.messageIdToDelete = [];
    this.dataToPostToDelete = [];
    this.userType = localStorage.getItem('Usertype');
    this.accountType = localStorage.getItem('AccountType')
    this.logoPathToShow = localStorage.getItem('userHeaderLogo');
    this.companyID = localStorage.getItem('loggedCompanyId');
    this.contactID = this.currentContactId;
    this.filteredItems = [];
    if (this.currentMessageType === 'All') {
      this.isAllActiveTab = true;
      this.isBuyerActiveTab = false;
      this.isSupplierActiveTab = false;
      this.isRFQActiveTab = false;
      this.isArchiveTab = false;
    }
  }

  ngOnInit() {
    this.searchFilterValue = '';
    this.sortFilterValue = '1';
    this.messageThreadList = [];
    if (this.userType === 'Buyer') {
      this.isBuyer = true;
    } else {
      this.isBuyer = false;
    }
    this.initmessage();
    this.init();
    this._rfqService.events$.forEach(event => this.refreshMsgList(event))
  }

  ngOnChanges(changes: any) {
    if (changes.messageSearchText.currentValue === '') {
      this.initmessage();
    }
    else {
      this.iMessageListViewModel.pageNumber = 1;
      this.getMessages();
    }

  }

  initmessage() {
    this.iMessageListViewModel = {
      rfqId: 0,
      contactId: 0,
      fromContactId: 0,
      maxPageSize: 0,
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      IsMessageRead: null,
      isBuyer: null,
      isNotificationOrMessage: 0,
      IsBuyerSupplierOrRfq: 0,
      IsArchiveMessages: false,
      IsSentMessages: false
    };
    this.getMessages();
  }


  filterAll() {
    if (this.searchFilterValue) {
      this.iMessageListViewModel.searchText = this.searchFilterValue;
    } else {
      this.iMessageListViewModel.searchText = '';
    }
    if (this.sortFilterValue === '2') {
      this.iMessageListViewModel.isOrderByDesc = false;
    } else {
      this.iMessageListViewModel.isOrderByDesc = true;
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.iMessageListViewModel.pageNumber = 1;
    this.iMessageListViewModel.pageSize = this.pageSize;
    this.getMessages();
  }

  setCurrentMessageType(messageType) {
    this.currentMessageType = messageType;
    if (this.currentMessageType === 'Buyer') {
      this.isAllActiveTab = false;
      this.isBuyerActiveTab = true;
      this.isSupplierActiveTab = false;
      this.isRFQActiveTab = false;
      this.isArchiveTab = false;
      this.isSentTab = false;
    } else if (this.currentMessageType === 'Supplier') {
      this.isAllActiveTab = false;
      this.isBuyerActiveTab = false;
      this.isSupplierActiveTab = true;
      this.isRFQActiveTab = false;
      this.isArchiveTab = false;
      this.isSentTab = false;
    } else if (this.currentMessageType === 'RFQ') {
      this.isAllActiveTab = false;
      this.isBuyerActiveTab = false;
      this.isSupplierActiveTab = false;
      this.isRFQActiveTab = true;
      this.isArchiveTab = false;
      this.isSentTab = false;
    } else if (this.currentMessageType === 'All') {
      this.isAllActiveTab = true;
      this.isBuyerActiveTab = false;
      this.isSupplierActiveTab = false;
      this.isRFQActiveTab = false;
      this.isArchiveTab = false;
      this.isSentTab = false;
    } else if (this.currentMessageType === 'Archive') {
      this.isAllActiveTab = false;
      this.isBuyerActiveTab = false;
      this.isSupplierActiveTab = false;
      this.isRFQActiveTab = false;
      this.isArchiveTab = true;
      this.isSentTab = false;
    } else if (this.currentMessageType === 'Sent') {
      this.isAllActiveTab = false;
      this.isBuyerActiveTab = false;
      this.isSupplierActiveTab = false;
      this.isRFQActiveTab = false;
      this.isArchiveTab = false;
      this.isSentTab = true;
    }
    this.refreshMsgList(true);
  }

  get currentContactId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  getDate(val) {
    if (val !== undefined && val !== null && val !== '') {
      if (moment(val).isValid()) {
        return moment(moment.utc(val).toDate()).format('MMM-DD-YYYY h:mm a');
      } else {
        return val;
      }
    } else {
      return '';
    }
  }
  removeHtmlTag(content) {
    return content.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, "");
  }
  toggleMessageThreadDiv(index) {
    this.isShowReplyEditor = false;
    if (this.selectedDivIndex !== index) {
      this.selectedDivIndex = index;
    } else {
      this.selectedDivIndex = null;
    }
  }
  toggleMessageThreadDiv2(index) {
    if (this.selectedDivIndex2 !== index) {
      this.selectedDivIndex2 = index;
    } else {
      this.selectedDivIndex2 = null;
    }
  }

  refreshMsgList(ismsgSend) {
    if (ismsgSend === true) {
      this.arrayLength = 0;
      this.isShowReplyEditor = false;
      this.messageThreadList = [];
      this.selectedDivIndex = null;
      this.dataToPostToDelete = [];
      this.childArray = [];
      this.getMessages();
    }
  }
  getMessages() {
    this.isLoader = true;
    this.iMessageListViewModel.contactId = this.contactID;
    if (this.userType === 'Buyer') {
      this.iMessageListViewModel.isBuyer = true;
    } else {
      this.iMessageListViewModel.isBuyer = false;
    }
    if (this.currentMessageType === 'All') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 0;
      this.iMessageListViewModel.IsArchiveMessages = false;
      this.iMessageListViewModel.IsSentMessages  = false;
    } else if (this.currentMessageType === 'Buyer') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 1;
      this.iMessageListViewModel.IsArchiveMessages = false;
      this.iMessageListViewModel.IsSentMessages  = false;
    } else if (this.currentMessageType === 'Supplier') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 3;
      this.iMessageListViewModel.IsArchiveMessages = false;
      this.iMessageListViewModel.IsSentMessages  = false;
    } else if (this.currentMessageType === 'RFQ') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 2;
      this.iMessageListViewModel.IsArchiveMessages = false;
      this.iMessageListViewModel.IsSentMessages  = false;
    }
    else if (this.currentMessageType === 'Archive') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 0;
      this.iMessageListViewModel.IsArchiveMessages = true;
      this.iMessageListViewModel.IsSentMessages  = false;
    }
    else if (this.currentMessageType === 'Sent') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 0;
      this.iMessageListViewModel.IsArchiveMessages = false;
      this.iMessageListViewModel.IsSentMessages  = true;
    }
    this.iMessageListViewModel.searchText = this.messageSearchText;

    this.items = [];
    this._rfqService.getMessageList(this.iMessageListViewModel).subscribe(
      result => {
        if (result['result']) {
          window.scrollTo(0, 0);
          this.isMesssageAvailable = true;
          this.isThreadListOpen = false;
          this.items = result['data'];
          var unreadMessageCount = result['unreadMessageCount'];
          var unreadBuyerSupplierMessageCount = result['unreadBuyerSupplierMessageCount'];
          var unreadRfqMessageCount = result['unreadRfqMessageCount'];
          this.totalCount = result['totalRecords'];
          this.iRfqMessageViewModelColl = result['data'];
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.AssignMessageCount(unreadMessageCount, unreadBuyerSupplierMessageCount, unreadRfqMessageCount);
          this.init();
          this.isLoader = false;
        } else {
          window.scrollTo(0, 0);
          this.items = [];
          this.iRfqMessageViewModelColl = [];
          this.isMesssageAvailable = false;
          this.totalCount = 0;
          this.init();
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.isLoader = false;
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  getMessages2() {
    this.iMessageListViewModel.contactId = this.contactID;
    if (this.userType === 'Buyer') {
      this.iMessageListViewModel.isBuyer = true;
    } else {
      this.iMessageListViewModel.isBuyer = false;
    }
    if (this.currentMessageType === 'All') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 0;

    } else if (this.currentMessageType === 'Buyer') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 1;

    } else if (this.currentMessageType === 'Supplier') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 3;

    } else if (this.currentMessageType === 'RFQ') {
      this.iMessageListViewModel.isNotificationOrMessage = 2;
      this.iMessageListViewModel.IsBuyerSupplierOrRfq = 2;

    }
    this.iMessageListViewModel.searchText = this.messageSearchText;

    this.items = [];
    this._rfqService.getMessageList(this.iMessageListViewModel).subscribe(
      result => {
        if (result['result']) {
          window.scrollTo(0, 0);
          this.isMesssageAvailable = true;
          this.isThreadListOpen = false;
          this.items = result['data'];
          var unreadMessageCount = result['unreadMessageCount'];
          var unreadBuyerSupplierMessageCount = result['unreadBuyerSupplierMessageCount'];
          var unreadRfqMessageCount = result['unreadRfqMessageCount'];
          this.totalCount = result['totalRecords'];
          this.iRfqMessageViewModelColl = result['data'];
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.AssignMessageCount(unreadMessageCount, unreadBuyerSupplierMessageCount, unreadRfqMessageCount);
          this.init();
        } else {
          window.scrollTo(0, 0);
          this.items = [];
          this.iRfqMessageViewModelColl = [];
          this.isMesssageAvailable = false;
          this.totalCount = 0;
          this.init();
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.isLoader = false;
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  AssignMessageCount(unreadMessageCount, unreadBuyerSupplierMessageCount, unreadRfqMessageCount) {
    this.totalMessageCount = unreadMessageCount > 0 ? unreadMessageCount : 0;
    this.totalBuyerMsgCount = unreadBuyerSupplierMessageCount > 0 ? unreadBuyerSupplierMessageCount : 0;
    this.totalSupplierMsgCount = unreadBuyerSupplierMessageCount > 0 ? unreadBuyerSupplierMessageCount : 0;
    this.totalRfqMsgCount = unreadRfqMessageCount> 0 ? unreadRfqMessageCount : 0;
  }

  getThreadData(message) {
    this.selectedDivIndex2 = null;
    let tempMessage: IMessagesViewModel;
    tempMessage = {
      messageId: message.messageId,
      originalMessageSubject: message.originalMessageSubject,
      rfqId: message.rfqId,
      pageName: message.pageName,
      toContactIdEncrypt: message.toContactIdEncrypt,
      fromContactIdEncrypt: message.fromContactIdEncrypt,
      messageTypeId: message.messageTypeId,
      messageHierarchy: message.messageHierarchy,
      messageSubject: message.messageSubject,
      messageDescr: message.messageDescr,
      messageDate: message.messageDate,
      fromCont: message.fromCont,
      toCont: message.toCont,
      messageRead: message.messageRead,
      messageSent: message.messageSent,
      readDate: message.readDate,
      messageStatusIdRecipient: message.messageStatusIdRecipient,
      messageStatusIdAuthor: message.messageStatusIdAuthor,
      expirationDate: message.expirationDate,
      trash: message.trash,
      trashDate: message.trashDate,
      fromTrash: message.fromTrash,
      fromTrashDate: message.fromTrashDate,
      errorMessage: message.errorMessage,
      result: message.result,
      isSelected: message.isSelected,
      toContactIds: message.toContactIds,
      messageStatus: message.messageStatus,
      supplierProfileUrl: message.supplierProfileUrl,
      buyerProfileUrl: message.buyerProfileUrl,
      sendEmail: message.sendEmail,
      messageStatusId: message.messageStatusId,
      messageTypeValue: message.messageTypeValue,
      fromContName: message.fromContName,
      toContName: message.toContName,
      messageFileNames: message.messageFileNames,
      isNDAToApproveAll: message.isNDAToApproveAll,
      toRFQIds: message.toRFQIds,
      companyId: message.companyId,
      companyName: message.companyName,
      companyUrl: message.companyUrl,
      companylogo: message.companylogo,
      toContactCompanyUrl: message.toContactCompanyUrl,
      toContactCompanylogo: message.toContactCompanylogo,
      toCompanyName: message.toCompanyName,
      nDAApproveContactsRFQsLists: [],
      isNdaRequired: false,
      quoteReferenceNumber: '',
      isMessageThread: message.isMessageThread,
      toCompanyId: message.toCompanyId,
      isNotification: message.isNotification
    };
    this.getMessagesThreadList(tempMessage);
  }

  changeToMsgRead(changeMsg) {
    // console.log(changeMsg, 'changeMsg');
    setTimeout(() => {
      // console.log(this.childThreadData, 'this.childThreadData')
      if (this.childThreadData != null && this.childThreadData.isMessageThread === false) {
        this.markMsgAsUnreadAsSoonasMsgOpened();
      }
    }, 4000);   
    let filteredData = this.items.filter(x => x.messageId === changeMsg.messageId)
    filteredData[0].messageRead = true;
  }

  getMessagesThreadList(messageObj) {
    if (messageObj !== null || messageObj !== undefined) {
      this._rfqService.getMessageThreadByID(messageObj).subscribe(
        result => {
          if (result.result) {
            this.isThreadListOpen = true;
            this.messageThreadList = result['data'];
            if (messageObj.isSelected === true) {
              this.messageThreadList = this.messageThreadList.filter(x => x.isSelected = true);
              for (let i = 0; i < this.messageThreadList.length; i++) {
                this.childArray.push(this.messageThreadList[i]);
                // Creating Object for delete Functionality
                this.dataToPostToDelete.push({
                  parentMessageId: this.messageThreadList[this.messageThreadList.length - 1].messageId,
                  messageId: this.messageThreadList[i].messageId,
                  archieveBy: this.loggedId,
                });
              }
              for (var i = 0; i < this.childchkBoxCountArr.length; i++) {
                this.dataToPostToDelete = this.dataToPostToDelete.filter(val => val.messageId !== this.childchkBoxCountArr[i].messageId);
              }
            } else if (messageObj.isSelected === false) {
              this.messageThreadList = result['data'];
              this.msgThread = this.messageThreadList;
              for (var i = 0; i < this.msgThread.length; i++) {
                this.childArray = this.childArray.filter(val => val.messageId !== this.msgThread[i].messageId);
                // Creating Object for delete Functionality
                this.dataToPostToDelete = this.dataToPostToDelete.filter(val => val.messageId !== this.msgThread[i].messageId);
              }
            }
            this.childThreadData = this.messageThreadList[0];
            // console.log(this.childThreadData, 'this.childThreadData')
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
      this.messageThreadList = [];
    }
  }
  getchildSelectedData(message) {
    this.selectedDivIndex2 = null;
    let tempMessage2: IMessagesViewModel;
    tempMessage2 = {
      messageId: message.messageId,
      originalMessageSubject: message.originalMessageSubject,
      rfqId: message.rfqId,
      pageName: message.pageName,
      toContactIdEncrypt: message.toContactIdEncrypt,
      fromContactIdEncrypt: message.fromContactIdEncrypt,
      messageTypeId: message.messageTypeId,
      messageHierarchy: message.messageHierarchy,
      messageSubject: message.messageSubject,
      messageDescr: message.messageDescr,
      messageDate: message.messageDate,
      fromCont: message.fromCont,
      toCont: message.toCont,
      messageRead: message.messageRead,
      messageSent: message.messageSent,
      readDate: message.readDate,
      messageStatusIdRecipient: message.messageStatusIdRecipient,
      messageStatusIdAuthor: message.messageStatusIdAuthor,
      expirationDate: message.expirationDate,
      trash: message.trash,
      trashDate: message.trashDate,
      fromTrash: message.fromTrash,
      fromTrashDate: message.fromTrashDate,
      errorMessage: message.errorMessage,
      result: message.result,
      isSelected: message.isSelected,
      toContactIds: message.toContactIds,
      messageStatus: message.messageStatus,
      supplierProfileUrl: message.supplierProfileUrl,
      buyerProfileUrl: message.buyerProfileUrl,
      sendEmail: message.sendEmail,
      messageStatusId: message.messageStatusId,
      messageTypeValue: message.messageTypeValue,
      fromContName: message.fromContName,
      toContName: message.toContName,
      messageFileNames: message.messageFileNames,
      isNDAToApproveAll: message.isNDAToApproveAll,
      toRFQIds: message.toRFQIds,
      companyId: message.companyId,
      companyName: message.companyName,
      companyUrl: message.companyUrl,
      companylogo: message.companylogo,
      toContactCompanyUrl: message.toContactCompanyUrl,
      toContactCompanylogo: message.toContactCompanylogo,
      toCompanyName: message.toCompanyName,
      nDAApproveContactsRFQsLists: [],
      isNdaRequired: false,
      quoteReferenceNumber: '',
      isMessageThread: message.isMessageThread,
      toCompanyId: message.toCompanyId,
      isNotification: message.isNotification
    };
    this.getMessagesThreadList(tempMessage2);
  }

  downloadAllFiles(fileCompArray: string[]) {
    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0
    };
    this.temp = [];
    let data = JSON.stringify(fileCompArray);
    this.temp = JSON.parse(data);

    this.Downloadallfiles.filename = this.temp;

    this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response => {
      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
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

  getChildThreadData(childData) {
    if (childData !== null) {
      this.isChildData = true;
      this.secondchildThreadData = childData;
    }
  }
  onCheckBoxSelected(selectedMsg, i) {
    this.chkBoxCountArr = this.items.filter(x => x.isSelected === true);
    this.getchildSelectedData(selectedMsg);
    this.arrayLength = this.chkBoxCountArr.length + this.childchkBoxCountArr.length;
  }

  onChildCheckBoxSelected(messageThread) {
    this.childchkBoxCountArr = this.messageThreadList.filter(x => x.isSelected === true);
    this.arrayLength = this.chkBoxCountArr.length + this.childchkBoxCountArr.length;

    if (messageThread.isSelected === true) {
      for (let i = 0; i < this.childchkBoxCountArr.length; i++) {
        // Creating Object for delete Functionality
        this.dataToPostToDelete.push({
          parentMessageId: this.messageThreadList[this.messageThreadList.length - 1].messageId,
          messageId: this.childchkBoxCountArr[i].messageId,
          archieveBy: this.loggedId,
        });
      }
    } else if (messageThread.isSelected === false) {
      this.msgThread = this.messageThreadList;
      for (var i = 0; i < this.msgThread.length; i++) {
        this.dataToPostToDelete = this.dataToPostToDelete.filter(val => val.messageId !== this.msgThread[i].messageId);
      }
    }
  }
  // Archive Functionality
  archiveMessages() {
    this.modalBtnText = 'Archive'
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to archive all selected Message, all data will be permanently lost. Would you like to cancel this message?',
      header: 'Archive Message',
      icon: null,
      accept: () => {
        var flags = [], output = [], l = this.dataToPostToDelete.length, i;
        for (i = 0; i < l; i++) {
          if (flags[this.dataToPostToDelete[i].messageId]) continue;
          flags[this.dataToPostToDelete[i].messageId] = true;
          output.push(this.dataToPostToDelete[i]);
        }
        this.archiveUnArchiveMessagesViewModel = output;
        this.archiveUnArchiveMessagesViewModelListModel = new ArchiveUnArchiveMessagesViewModelList();
        this.archiveUnArchiveMessagesViewModelListModel = {
          archiveUnArchiveMessagesList: this.archiveUnArchiveMessagesViewModel,
          isArchive: true
        }
        this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel).subscribe(
          result => {
            if (result['data']['result'] === true) {
              this._toastr.success(result.data.errorMessage, '');
              this.refreshMsgList(true);
            } else {
              this._toastr.error(result.data.errorMessage, 'Error!');
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
  // UnArchive Functionality
  unarchiveMessages() {
    this.modalBtnText = 'Unarchive'
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to unarchive all selected Message?',
      header: 'Unarchive Message',
      icon: null,
      accept: () => {
        var flags = [], output = [], l = this.dataToPostToDelete.length, i;
        for (i = 0; i < l; i++) {
          if (flags[this.dataToPostToDelete[i].messageId]) continue;
          flags[this.dataToPostToDelete[i].messageId] = true;
          output.push(this.dataToPostToDelete[i]);
        }
        this.archiveUnArchiveMessagesViewModel = output;
        this.archiveUnArchiveMessagesViewModelListModel = new ArchiveUnArchiveMessagesViewModelList();
        this.archiveUnArchiveMessagesViewModelListModel = {
          archiveUnArchiveMessagesList: this.archiveUnArchiveMessagesViewModel,
          isArchive: false
        }
        this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel).subscribe(
          result => {
            if (result['data']['result'] === true) {
              this._toastr.success(result.data.errorMessage, '');
              this.refreshMsgList(true);
            } else {
              this._toastr.error(result.data.errorMessage, 'Error!');
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

  // Read Functionality
  markAsReadMessages() {
    this.modalBtnText = 'Mark as Read';
    this.parentAndChildMsgIDArray = [];
    this.messageIdToDelete = [];
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to mark all selected Messages as Read?',
      header: 'Mark as Read Messages',
      icon: null,
      accept: () => {
        // this.msgs = 'true';
        // console.log('Test accept'); 
        if (this.childchkBoxCountArr) {
          this.parentAndChildMsgIDArray = this.childArray.concat(this.childchkBoxCountArr);
        } else {
          this.parentAndChildMsgIDArray = this.childArray;
        }
        this.parentAndChildMsgIDArray = this.parentAndChildMsgIDArray.filter(x => x.fromCont !== this.loggedId);
        for (let i = 0; i < this.parentAndChildMsgIDArray.length; i++) {
          this.messageIdToDelete.push(this.parentAndChildMsgIDArray[i].messageId);
        }
        const unique = (value, index, self) => {
          return self.indexOf(value) === index
        }
        const uniqueIds = this.messageIdToDelete.filter(unique);

        this.MessageReadUnreadViewModel = new MessageReadUnreadViewModel();
        this.MessageReadUnreadViewModel = {
          messageIdList: uniqueIds,
          isRead: true
        }
        this._rfqService.setMessageReadUnread(this.MessageReadUnreadViewModel).subscribe(
          result => {
            if (result['data'] === true) {
              // console.log('Mark as read success')              
              this._toastr.success('All selected messages marked as read', '');
              this.refreshMsgList(true);
            } else {
              // this._toastr.error(result.data.errorMessage, 'Error!');
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
  // UnRead Functionality
  markAsunReadMessages() {
    this.modalBtnText = 'Mark as Unread';
    this.parentAndChildMsgIDArray = [];
    this.messageIdToDelete = [];
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to mark all selected Messages as Unread?',
      header: 'Mark as Unread Messages',
      icon: null,
      accept: () => {
        if (this.childchkBoxCountArr) {
          this.parentAndChildMsgIDArray = this.childArray.concat(this.childchkBoxCountArr);
        } else {
          this.parentAndChildMsgIDArray = this.childArray;
        }
        this.parentAndChildMsgIDArray = this.parentAndChildMsgIDArray.filter(x => x.fromCont !== this.loggedId);
        for (let i = 0; i < this.parentAndChildMsgIDArray.length; i++) {
          this.messageIdToDelete.push(this.parentAndChildMsgIDArray[i].messageId);
        }
        const unique = (value, index, self) => {
          return self.indexOf(value) === index
        }
        const uniqueIds = this.messageIdToDelete.filter(unique);
        this.MessageReadUnreadViewModel = new MessageReadUnreadViewModel();
        this.MessageReadUnreadViewModel = {
          messageIdList: uniqueIds,
          isRead: false
        }
        this._rfqService.setMessageReadUnread(this.MessageReadUnreadViewModel).subscribe(
          result => {
            if (result['data'] === true) {
              this._toastr.success('All selected messages marked as unread', '');
              this.refreshMsgList(true);
            } else {
              //this._toastr.error(result.data.errorMessage, 'Error!');
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

  showEditor(event: Event) {
    if (event.isTrusted) {
      this.isShowReplyEditor = true;
    }
  }

  /* This function is used to open the drawer on click */
  openAssociateMessageDrawer() {
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'associateMessageDrawer');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  openSideDetailDrawer(msgDtails) {
    //  console.log(msgDtails, 'msgDtails');
    this._rfqService.set(false, 'isBuyerMessage');
    if (msgDtails.fromCont !== this.loggedId) {
      if (this.userType === 'Buyer') {
        this.openMenufacturerDrawer(msgDtails.fromContactIdEncrypt, msgDtails.fromContName, msgDtails.companyId, msgDtails.fromCont, msgDtails.fromContName)
      } else {
        if(this.isPremium())
        {
          if(msgDtails.companyId == 0) {
            this.openRfqDrawer(msgDtails.leadId, msgDtails.messageRead, msgDtails.messageId, msgDtails.messageTypeId, msgDtails.toCont, msgDtails.fromCont, msgDtails)
          } else {
            this.showBuyerProfile(msgDtails.fromContactIdEncrypt, msgDtails.rfqId)
          }
        
        }
      }
    } else if(msgDtails.toCont !== this.loggedId) {
      if (this.userType === 'Buyer') {
        this.openMenufacturerDrawer(msgDtails.toContactIdEncrypt, msgDtails.toContName, msgDtails.toCompanyId, msgDtails.toCont, msgDtails.toContName)
      } else {
        if(this.isPremium())
        {
          this.showBuyerProfile(msgDtails.toContactIdEncrypt, msgDtails.rfqId)
        }
      }
    }
  }

  isPremium() {
    let IsPremiumEncrypt= localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false' ) {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['auth/login/simple']);
    return;
   }
     if (IsPremiumDecrypt === 'true') {
       return true;
     } else {
       return false;
     }
  }

  showBuyerProfile(id, rfqId) {
    //console.log('In showBuyerProfile Func')
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(rfqId, 'rfqId');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMiniProfile');
      this._rfqService.set(id, 'buyerProfileId');
      this._rfqService.setisBuyerNameClicked('true');
    }, 100);
    // setTimeout(() => {
    //   const elmnt = document.getElementById(rfqId);
    //   elmnt.scrollIntoView({
    //     behavior: 'auto',
    //     block: 'center',
    //     inline: 'nearest'
    //   });
    // }, 1000);
  }

  openMenufacturerDrawer(contactId, contactName, companyId, followcontactId, companyName) {
    this._rfqService.set(false, 'messageRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(companyName, 'quoteContactName');
      this._rfqService.set(companyId, 'supplierCompanyId');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 1000);
    // setTimeout(() => {
    //   const elmnt = document.getElementById(followcontactId);
    //   elmnt.scrollIntoView({
    //     behavior: 'auto',
    //     block: 'center',
    //     inline: 'nearest'
    //   });
    // }, 2000);
  }


  markMsgAsUnreadAsSoonasMsgOpened() {
    const markAllChildArrAsRead = this.messageThreadList.filter(x => x.fromCont !== this.loggedId && x.messageRead === false);
    // console.log(markAllChildArrAsRead, 'markAllChildArrAsRead')
    const msgIDArr = [];
    for (let i = 0; i < markAllChildArrAsRead.length; i++) {
      msgIDArr.push(markAllChildArrAsRead[i].messageId);
    }
    const unique = (value, index, self) => {
      return self.indexOf(value) === index
    }
    const uniqueIds = msgIDArr.filter(unique);
    this.MessageReadUnreadViewModel = new MessageReadUnreadViewModel();
    this.MessageReadUnreadViewModel = {
      messageIdList: uniqueIds,
      isRead: true
    }
    this._rfqService.setMessageReadUnread(this.MessageReadUnreadViewModel).subscribe(
      result => {
        if (result['data'] === true) {
          // console.log('Mark as read success', result['data'])
          var markAsReadCount = uniqueIds.length;
          if (this.isAllActiveTab === true) {
            this.totalMessageCount = this.totalMessageCount - markAsReadCount > 0 ? this.totalMessageCount - markAsReadCount : 0;
            if (this.childThreadData.rfqId != null) {
              this.totalRfqMsgCount = this.totalRfqMsgCount - markAsReadCount > 0 ? this.totalRfqMsgCount - markAsReadCount : 0;
            }

            if (this.userType === "Supplier") {
              this.totalBuyerMsgCount = this.totalBuyerMsgCount - markAsReadCount > 0 ? this.totalBuyerMsgCount - markAsReadCount : 0;
            }
            else {
              this.totalSupplierMsgCount = this.totalSupplierMsgCount - markAsReadCount > 0 ? this.totalSupplierMsgCount - markAsReadCount : 0;
            }

          }
          else if (this.isSupplierActiveTab === true) {
            this.totalSupplierMsgCount = this.totalSupplierMsgCount - markAsReadCount > 0 ? this.totalSupplierMsgCount - markAsReadCount : 0;
            this.totalMessageCount = this.totalMessageCount - markAsReadCount > 0 ? this.totalMessageCount - markAsReadCount : 0;
          }
          else if (this.isBuyerActiveTab === true) {
            this.totalBuyerMsgCount = this.totalBuyerMsgCount - markAsReadCount > 0 ? this.totalBuyerMsgCount - markAsReadCount : 0;
            this.totalMessageCount = this.totalMessageCount - markAsReadCount > 0 ? this.totalMessageCount - markAsReadCount : 0;
          }
          else if (this.isRFQActiveTab === true) {
            this.totalRfqMsgCount = this.totalRfqMsgCount - markAsReadCount > 0 ? this.totalRfqMsgCount - markAsReadCount : 0;
            this.totalMessageCount = this.totalMessageCount - markAsReadCount > 0 ? this.totalMessageCount - markAsReadCount : 0;
            if (this.userType === "Supplier") {
              this.totalBuyerMsgCount = this.totalBuyerMsgCount - markAsReadCount > 0 ? this.totalBuyerMsgCount - markAsReadCount : 0;
            }
            else {
              this.totalSupplierMsgCount = this.totalSupplierMsgCount - markAsReadCount > 0 ? this.totalSupplierMsgCount - markAsReadCount : 0;
            }
          }
        } else {
          // this._toastr.error(result.data.errorMessage, 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  //Pagination Functions

  init() {
    // this.currentIndex = 1;
    // this.pageStart = 1;
    // this.pages = 3;
    if (this.totalCount === 0) {
      this.isMesssageAvailable = false;
    } else {
      this.isMesssageAvailable = true;
    }
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.totalCount / this.pageSize));
    //console.log(this.pageNumber,'this.pageNumber');
    if (this.totalCount % this.pageSize !== 0) {
      this.pageNumber++;
    }
    //console.log(this.pageNumber,'this.pageNumber');
    // if (this.pageNumber < this.pages) {
    this.pages = this.pageNumber;
    //}
    //console.log(this.pages,'this.pages');
    this.refreshItems();
  }
  refreshItems() {
    for (let i = 0; i < this.filteredItems.length; i++) {
      if (this.filteredItems[i].fromContName != null) {
        this.filteredItems[i].fromContName = this.filteredItems[i].fromContName.trim();
      }
    }
    this.items = this.filteredItems;
    this.pagesIndex = this.fillArray();
  }

  fillArray(): any {
    const obj = new Array();
    this.pages = (this.pages > 3) ? 3 : this.pages;
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;

  }
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.iMessageListViewModel.pageNumber = this.currentIndex;
    this.getMessages();
  }

  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.iMessageListViewModel.pageNumber = this.currentIndex;
    this.getMessages();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iMessageListViewModel.pageNumber = this.currentIndex;
    this.getMessages();
  }
  openRfqDrawer(rfqId, rfqReadStatus, messageId, messageTypeId, toCont, fromCont, message) {
    // messageTypeId == 5
    if (messageTypeId == 225) {
      if( this.userType ==='Buyer' || ( this.userType ==='Supplier' && (this.accountType !== 'Basic' &&  this.accountType !== 'Silver'))) {
        this._rfqService.set(true, 'showSidePanel');
        this._rfqService.set(false, 'isBuyerMiniProfile');
        this._rfqService.set(false, 'rfqDetailDrawer');
        this._rfqService.set(false, 'isBuyerMessage');
        this._rfqService.set(rfqId, 'leadStreamId');
        setTimeout(() => {
          debugger;
          this._rfqService.set(true, 'isBuyerMessageView')
          this._rfqService.set(toCont, 'toCont');
          this._rfqService.set(fromCont, 'fromCont');
          this._rfqService.set(message, 'message');
          const elmnt = document.getElementById(messageTypeId);
          elmnt.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'nearest'
          });
        }, 200);
      }
    }
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'isBuyerMessage');
  }
}


