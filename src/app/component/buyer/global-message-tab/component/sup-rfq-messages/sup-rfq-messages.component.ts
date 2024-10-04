import {
  Component,
  OnInit
} from '@angular/core';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  IMessagesViewModel,
  IMessageListViewModel,
  ArchiveUnArchiveMessagesViewModelList,
  ArchiveUnArchiveMessagesViewModel
} from './../../../../../core/models/rfqModel';
import {
  IMessageHubModel
} from './../../../../../core/models/globalMaster';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';


@Component({
  selector: 'app-sup-rfq-messages',
  templateUrl: './sup-rfq-messages.component.html',
  styleUrls: ['./sup-rfq-messages.component.scss'],
  providers: [ConfirmationService]
})
export class SupRfqMessagesComponent implements OnInit {

  // Variable Declarations
  // @Input('rfqId') rfqId: number;
  contactID: number;
  iMessageListViewModel: IMessageListViewModel;
  iRfqMessageViewModelColl: IMessagesViewModel[];
  iRfqSentMessageViewModelColl: IMessagesViewModel[];
  filteredItems: IMessagesViewModel[];
  isMesssageAvailable: boolean;
  userType: string;
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  isLoader: boolean;
  activeStatusFilterBtn: string;
  items: IMessagesViewModel[];
  pagesIndex: Array < number > ;
  pageStart = 1;
  appendText = '...';
  oappendText = '';
  selectedAll: boolean;
  isCencel2: boolean;
  msgs: string;
  messageIdToDelete: number[];
  totalMsg = 0;
  messageId: number;
  chkBoxCount = 0;
  activeTopBtns = false;
  chkBoxCountArr: IMessagesViewModel[];
  totalRecordCount = 0;
  selectedRowCount = 0;
  isMagicleadMsgSelected: boolean;
  defaultAwsPath = '';
  defaultPath = 'assets/';
  sendOrRecived = 'From';
  totalCount: number;
  unreadMessageCount: number;
  msgId: string;
  formToContactId: any;
  userAccount: string;
  selectedDivIndex = null;

  archiveUnArchiveMessagesViewModelListModel: ArchiveUnArchiveMessagesViewModelList;
  archiveUnArchiveMessagesViewModel: ArchiveUnArchiveMessagesViewModel[];
  dataToPostToDelete: any[] =[];

  dataToPostToDelete2: any[] =[];
  archiveUnArchiveMessagesViewModelListModel2: ArchiveUnArchiveMessagesViewModelList;
  // Variable Declarations Ends
  constructor(private _rfqService: RfqService, private confirmationService: ConfirmationService,
    private _toastr: ToastrService, private router: Router, private _router: ActivatedRoute, private _profileService: ProfileService) {
    this.chkBoxCountArr = [];
    this.iRfqSentMessageViewModelColl = [];
    this.items = [];
    this.filteredItems = [];
    this.msgs = '';
    this.messageIdToDelete = [];
    this.isCencel2 = false;
    this.isMesssageAvailable = false;
    this.isLoader = true;
    this.activeStatusFilterBtn = 'All';
    this.selectedRowCount = 0;
    this.isMagicleadMsgSelected = false;

    this.messageId = 0;
    this.formToContactId = 0;
    this.initmessage();
    this._router.queryParams.subscribe(params => {
      // console.log('param', params['id']);
      this.msgId = params['msgid'];
    });
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
      isNotificationOrMessage:0,
      IsBuyerSupplierOrRfq:0,
      IsArchiveMessages: false,
      IsSentMessages: false
    };
  }
  openRfqDetails(id) {}
  getMessages() {
    this.isLoader = true;
    // this.initmessage();
    // this._rfqService.getMessagesByRfqId( 0, this.contactID , 0 ).subscribe(
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(null, 'messageForThread');
    this._rfqService.set(null, 'messageThreadId');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'associateMessageDrawer');
    if (this.userType === 'Buyer') {
      this.iMessageListViewModel.isBuyer = true;
    } else {
      this.iMessageListViewModel.isBuyer = false;
    }
    this._rfqService.getMessageList(this.iMessageListViewModel).subscribe(
      result => {
        if (result['result']) {
          window.scrollTo(0, 0);
          this.items = [];
          this.iRfqMessageViewModelColl = [];
          this.iRfqMessageViewModelColl = result['data'];
          this.unreadMessageCount = result['unreadMessageCount'];
          this.totalCount = result['totalRecords'];
          // console.log('list' ,   this.iRfqMessageViewModelColl );
          this.filteredItems = this.iRfqMessageViewModelColl;
          if (this.msgId && this.msgId !== '') {
            // tslint:disable-next-line:radix
            let msgData = this.filteredItems.find(x => x.messageId === parseInt(this.msgId));
            if (msgData && msgData !== undefined) {
              this.openMessageThreadDrawer(msgData);
            }

          }

          // this.items.forEach(message => {

          // });
          this.init();
          this.isLoader = false;
        } else {
          window.scrollTo(0, 0);
          this.iRfqMessageViewModelColl = [];
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.totalCount = 0;
          this.init();
          // this.setStatusFilter(this.activeStatusFilterBtn);
          this.isLoader = false;
        }

      },
      error => {
        console.log(error);
      },
      () => {}
    );
  }

  getSentMessages() {
    this.isLoader = true;
    this.iMessageListViewModel.fromContactId = this.contactID;
    this.iMessageListViewModel.contactId = 0;
    this.iMessageListViewModel.rfqId = 0;
    this._rfqService.getMessageList(this.iMessageListViewModel).subscribe(
      result => {
        if (result['result']) {
          window.scrollTo(0, 0);
          this.iRfqSentMessageViewModelColl = [];
          this.iRfqSentMessageViewModelColl = result['data'];
          this.filteredItems = this.iRfqSentMessageViewModelColl;
          this.totalMsg = this.filteredItems.length;
          this.isLoader = false;
          this.init();
          this.isLoader = false;
        } else {
          window.scrollTo(0, 0);
          this.iRfqSentMessageViewModelColl = [];
          this.isLoader = false;
        }
      },
      error => {
        console.log(error);
      },
      () => {}
    );
  }
  ngOnInit() {
    this.userType = localStorage.getItem('Usertype');
    this.userAccount = localStorage.getItem('AccountType');
    this.contactID = this.currentContactId;
    this.setStatusFilter(this.activeStatusFilterBtn);
    // this.getMessages();
    // this.getSentMessages();
  }

  init() {
    // this.currentIndex = 1;
    // this.pageStart = 1;
    // this.pages = 3;
    if (this.totalCount === 0) {
      this.isMesssageAvailable = true;
    } else {
      this.isMesssageAvailable = false;
    }
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.totalCount / this.pageSize));
    if (this.totalCount % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;

  }
  selectAll() {
    this.chkBoxCountArr = [];
    this.selectedRowCount = 0;
    this.isMagicleadMsgSelected = false;
    for (let i = 0; i < this.filteredItems.length; i++) {
      if (this.filteredItems[i].messageTypeId != 221 && this.filteredItems[i].messageTypeId != 225 && this.filteredItems[i].messageTypeId != 230  && this.filteredItems[i].messageTypeId != 232) {
        this.filteredItems[i].isSelected = this.selectedAll;
      }
    }
    this.chkBoxCountArr = this.filteredItems.filter(x => x.isSelected === true);
    this.selectedRowCount = this.chkBoxCountArr.length;
    /* flag to check any selected msg is related to magic lead list or not */
    this.isMagicleadMsgSelected = false; //((this.filteredItems.filter(x => x.messageTypeId == 221 || x.messageTypeId == 225|| x.messageTypeId == 230)).length > 0) ? true : false;
    if (this._rfqService.get('messageDrawer') == true) {
      this.openSidePanel('');
    }
  }
  checkIfAllSelected() {
    // // debugger;
    this.chkBoxCountArr = this.items.filter(x => x.isSelected === true);
    /* flag to check selected msg is related to magic lead list or not */
    this.isMagicleadMsgSelected = ((this.chkBoxCountArr.filter(x => x.messageTypeId == 221 || x.messageTypeId == 225 || x.messageTypeId == 230)).length > 0) ? true : false;
    this.selectedRowCount = this.chkBoxCountArr.length;
    if (this.chkBoxCountArr.length >= 2) {
      this.activeTopBtns = true;
    } else {
      this.activeTopBtns = false;
    }
    this.selectedAll = this.items.every(function (
      item: any
    ) {
      return item.selected === true;
    });
    if (this._rfqService.get('messageDrawer') == true) {
      this.openSidePanel('');
    }
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

  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.iMessageListViewModel.pageNumber = this.currentIndex;
    if (this._rfqService.get('IsActiveBtn') === 'sent') {
      // this.setStatusFilter ('sent') ;
      this.iMessageListViewModel.contactId = 0;
      this.iMessageListViewModel.fromContactId = this.contactID;
    } else {
      this.iMessageListViewModel.contactId = this.contactID;
      this.iMessageListViewModel.fromContactId = 0;
    }
    this.getMessages();
    // this.getMessages();
    // this.refreshItems();
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
    if (this._rfqService.get('IsActiveBtn') === 'sent') {
      // this.setStatusFilter ('sent') ;
      this.iMessageListViewModel.contactId = 0;
      this.iMessageListViewModel.fromContactId = this.contactID;
    } else {
      this.iMessageListViewModel.contactId = this.contactID;
      this.iMessageListViewModel.fromContactId = 0;
    }
    this.getMessages();
    // this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.iMessageListViewModel.pageNumber = this.currentIndex;
    if (this._rfqService.get('IsActiveBtn') === 'sent') {
      // this.setStatusFilter ('sent') ;
      this.iMessageListViewModel.contactId = 0;
      this.iMessageListViewModel.fromContactId = this.contactID;
    } else {
      this.iMessageListViewModel.contactId = this.contactID;
      this.iMessageListViewModel.fromContactId = 0;
    }
    this.getMessages();
    // this.refreshItems();
  }
  get currentContactId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  shortDescription(fileName) {
    let fixStr = '';
    if (!fileName) {
      if (fileName.length > 60) {
        fixStr = fileName.slice(0, 60);
        this.oappendText = fixStr.concat(this.appendText);
        return this.oappendText;
      } else {
        return fileName;
      }
    } else {
      return fixStr;
    }
  }
  formateMessageDate(date: Date) {
    const now = new Date();
    const abc = new Date(date);
    if (abc === now) {
      const currentTime = abc.getTime();
      return currentTime;
    } else {
      const locale = 'en-us';
      const month = abc.toLocaleString(locale, {
        month: 'long'
      });
      const custDate = month + ' - ' + abc.getDate();

      return custDate;
    }

  }

  openSidePanel(contactId) {
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
    this._rfqService.set(false, 'associateMessageDrawer');
    this._rfqService.set(false, 'messageSentMessage');
    this._rfqService.set(false, 'messageFromMessage');
    if (this.selectedRowCount > 1) {
      if (!(contactId === '' || contactId === undefined)) {
        this.chkBoxCountArr.push(contactId);
      }

      setTimeout(() => {
        this._rfqService.set(true, 'messageDrawer');
        if (this.activeStatusFilterBtn === 'sent') {
          this._rfqService.set(true, 'messageSentMessage');
        } else {
          this._rfqService.set(true, 'messageFromMessage');
        }
        this._rfqService.set(this.chkBoxCountArr, 'selectContactIdsForMEessage');

      }, 100);

    } else if (this.selectedRowCount == 1) {
      setTimeout(() => {
        this._rfqService.set(true, 'messageDrawer');
        if (this.activeStatusFilterBtn === 'sent') {
          this._rfqService.set(true, 'messageSentMessage');
          this._rfqService.set(this.chkBoxCountArr[0].toContName, 'nameOfBuyer');
          this._rfqService.set(this.chkBoxCountArr[0].toCont, 'selectContactIdsForMEessage');
        } else {
          this._rfqService.set(true, 'messageFromMessage');
          this._rfqService.set(this.chkBoxCountArr[0].fromContName, 'nameOfBuyer');
          this._rfqService.set(this.chkBoxCountArr[0].fromCont, 'selectContactIdsForMEessage');
        }
        this._rfqService.set(this.chkBoxCountArr[0].rfqId, 'selectContactRFQId');
      }, 100);
    } else {
      this._rfqService.set(false, 'messageDrawer');
      this._rfqService.set(false, 'showSidePanel');
    }
  }

  openSidePanel1(event, contactId, messageRFQId, fromContName) {
    if (localStorage.getItem('isEmailVerify') == 'false' && localStorage.getItem('Usertype') === 'Buyer') {
      this._toastr.warning("Please verify your email.", 'Warning');
      return;
    }

    event.stopPropagation();
    // this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'associateMessageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'messageDrawer');
      this._rfqService.set(fromContName, 'nameOfBuyer');
      this._rfqService.set(contactId, 'selectContactIdsForMEessage');
      this._rfqService.set(messageRFQId, 'selectContactRFQId');
    }, 100);
  }
  openMessageThreadDrawer(message: IMessagesViewModel) {
    if(message.isNotification != true) {
      if (localStorage.getItem('isEmailVerify') == 'false' && localStorage.getItem('Usertype') === 'Buyer') {
        this._toastr.warning("Please verify your email.", 'Warning');
        return;
      }
        // 232 - notification not filed buyer information
      if (message.messageTypeValue === 'SUPPLIER_NPS_RATING' || message.messageTypeValue === 'BUYER_NPS_RATING') {
        if (message.messageRead === false) {
          this._rfqService.set(true, 'isNPSPopupReqFromMessageTab');
          let tempMsgJson: IMessageHubModel;
          tempMsgJson = {
            messageId: message.messageId,
            messageTypeId: message.messageTypeId,
            fromId: message.fromCont,
            fromContactIdEncrypt: message.fromContactIdEncrypt,
            toContactIdEncrypt: message.toContactIdEncrypt,
            toId: message.toCont,
            imageString: '',
            userName: '',
            messageSubject: '',
            messageDescr: '',
            messageDate: null,
            rfqId: 0,
            messageType: '',
            isMessageThread : message.isMessageThread,
            isNotification: false,
          };
          if (this.activeStatusFilterBtn === 'sent') {
            this._rfqService.set(message.toContName, 'toContName');
          } else {
            this._rfqService.set(message.fromContName, 'toContName');
          }
          // this._rfqService.set(message.fromContName, 'toContName');
          this._rfqService.set(tempMsgJson, 'NPSPopupReqModelFromMessageTab');
        } else {
          this._toastr.warning('This user is already rated', 'Warning!');
        }
      } else {
        // simple message drawer
  
        if (message.messageTypeId !== 230) {
  
  
          const data = this.items.findIndex(x => x.messageId === message.messageId);
          if (data && data !== -1) {
            if (this.items[data].messageRead === false) {
              this.unreadMessageCount = this.unreadMessageCount - 1;
            }
          }
          if (this.activeStatusFilterBtn === 'sent') {
            this._rfqService.set(message.toContName, 'toContName');
          } else {
            this._rfqService.set(message.fromContName, 'toContName');
          }
  
          this._rfqService.set(false, 'messageDrawer');
          this._rfqService.set(false, 'associateMessageDrawer');
          this._rfqService.set(null, 'messageForThread');
          this._rfqService.set(null, 'messageThreadId');
          this._rfqService.set(true, 'showSidePanel');
          this._rfqService.set(true, 'messageThreadDrawer');
          this._rfqService.set(false, 'transferRfq');
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
            isMessageThread : message.isMessageThread,
            toCompanyId: message.toCompanyId,
            isNotification: message.isNotification
          };
          // console.log('Test: ', tempMessage);
          if(this.activeStatusFilterBtn == 'sent'){
            this._rfqService.set(message.toCompanyId,'supplierCompanyId');
          }else{
            this._rfqService.set(message.companyId,'supplierCompanyId');
          }
          this._rfqService.set(message.messageId, 'messageThreadId');
          this._rfqService.set(tempMessage, 'messageForThread');
          this._rfqService.setisSupplierMessageThread('true');
  
        } 
      }
    }
  }

  deleteMultipleMessage() {
    this.messageIdToDelete = [];
    if (this.selectedRowCount > 1) {
      this.isCencel2 = true;
      this.confirmationService.confirm({
        // tslint:disable-next-line:max-line-length
        message: 'Are you sure you want to archive all selected Message, all data will be permanently lost. Would you like to cancel this message?',
        header: 'Archive Message',
        icon: null,
        accept: () => {
          this.msgs = 'true';
          // console.log('Test accept');
          for (let i = 0; i < this.chkBoxCountArr.length; i++) {
            this.dataToPostToDelete2.push({
              parentMessageId: this.chkBoxCountArr[i].messageId,
              messageId: this.chkBoxCountArr[i].messageId,
              archieveBy: this.currentContactId,
            });  
            //this.messageIdToDelete.push(this.iRfqMessageViewModelColl[i].messageId);
          }

          this.archiveUnArchiveMessagesViewModelListModel2 = new ArchiveUnArchiveMessagesViewModelList();
          this.archiveUnArchiveMessagesViewModelListModel2 = {
            archiveUnArchiveMessagesList: this.dataToPostToDelete2,
            isArchive: true
          }
          this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel2).subscribe(
            result => {
              if (result['data']['result'] === true) {
                this._toastr.success(result.data.errorMessage, '');
                // this.getMessages();
                // this.getSentMessages();
                sessionStorage.setItem('isGlbMsgDelete', 'true');
                this.setStatusFilter(this.activeStatusFilterBtn);
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
  }

  deleteMessage(msgId) {
    this.isCencel2 = true;
    this.messageIdToDelete = [];
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to archive this Message, all data will be permanently lost. Would you like to cancel this message?',
      header: 'Archive Message',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        // console.log('Test accept');
          // Creating Object for delete Functionality
          this.dataToPostToDelete.push({
            parentMessageId: msgId.messageId,
            messageId: msgId.messageId,
            archieveBy: this.currentContactId,
          }); 
          this.archiveUnArchiveMessagesViewModel =  this.dataToPostToDelete;
          this.archiveUnArchiveMessagesViewModelListModel = new ArchiveUnArchiveMessagesViewModelList();
          this.archiveUnArchiveMessagesViewModelListModel = {
            archiveUnArchiveMessagesList: this.archiveUnArchiveMessagesViewModel,
            isArchive: true
          }
        //this.messageIdToDelete.push(msgId);
        this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel).subscribe(
          result => {
            if (result['data']['result'] === true) {
              this._toastr.success(result.data.errorMessage, '');
              this.dataToPostToDelete = [];
              // this.getMessages();
              // this.getSentMessages();
              this.setStatusFilter(this.activeStatusFilterBtn);
              sessionStorage.setItem('isGlbMsgDelete', 'true');

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

  reloadMessages() {
    if (this._rfqService.get('messageSentFromRfq')) {
      this._rfqService.set(false, 'messageSentFromRfq');
      this.selectedRowCount = 0;
      this.isMagicleadMsgSelected = false;
      this.msgId = '';
      // this.getMessages();
      // this.getSentMessages();
      this.setStatusFilter(this.activeStatusFilterBtn);
    }
  }
  isGlobalMsgRaiting() {
    if (sessionStorage.getItem('isGlobalMsgRaiting') == 'true') {
      this.isLoader = true;
      sessionStorage.removeItem('isGlobalMsgRaiting');
      this.getMessages();
    }
  }

  setStatusFilter(btnState: string) {
    this.selectedDivIndex = null;
    this._rfqService.set(this.activeStatusFilterBtn, 'activeStatusFilterBtn');
    this.chkBoxCountArr = [];
    this.selectedRowCount = 0;
    this.isMagicleadMsgSelected = false;
    this.selectedAll = false;
    this.currentIndex = 1;
    this.pages = 3;
    this.pageStart = 1;
    for (let i = 0; i < this.filteredItems.length; i++) {
      this.filteredItems[i].isSelected = this.selectedAll;
    }

    this.activeStatusFilterBtn = btnState;
    this.isLoader = true;
    this.filteredItems = [];
    this.pageNumber = 1;
    this.iMessageListViewModel.pageNumber = 1;
    if (btnState === 'All') {
      this.iMessageListViewModel.contactId = this.contactID;
      this.iMessageListViewModel.fromContactId = 0;
      this.iMessageListViewModel.rfqId = 0;
      this.iMessageListViewModel.IsMessageRead = null;
      // this.filteredItems = this.iRfqMessageViewModelColl;
      this.sendOrRecived = 'From';
      this._rfqService.set('From', 'IsActiveBtn');
    } else if (btnState === 'Read') {
      this.sendOrRecived = 'From';
      this._rfqService.set('From', 'IsActiveBtn');
      // tslint:disable-next-line:radix
      // this.filteredItems = this.iRfqMessageViewModelColl.filter(x => (x.messageRead));
      this.iMessageListViewModel.contactId = this.contactID;
      this.iMessageListViewModel.fromContactId = 0;
      this.iMessageListViewModel.rfqId = 0;
      this.iMessageListViewModel.IsMessageRead = true;
      // this.getMessages();
    } else if (btnState === 'Unread') {
      this.sendOrRecived = 'From';
      this._rfqService.set('From', 'IsActiveBtn');
      this.iMessageListViewModel.contactId = this.contactID;
      this.iMessageListViewModel.fromContactId = 0;
      this.iMessageListViewModel.rfqId = 0;
      this.iMessageListViewModel.IsMessageRead = false;
    } else if (btnState === 'sent') {
      this.sendOrRecived = 'To';
      this._rfqService.set('sent', 'IsActiveBtn');
      this.isLoader = true;
      this.iMessageListViewModel.fromContactId = this.contactID;
      this.iMessageListViewModel.contactId = 0;
      this.iMessageListViewModel.rfqId = 0;
      this.iMessageListViewModel.IsMessageRead = null;
    }
    this.getMessages();
    if (this.filteredItems.length > 0) {
      this.totalMsg = this.filteredItems.length;
      this.isLoader = false;
      // }
      this.init();
    } else {
      this.filteredItems = [];
    }

  }
  isPremium() {
    this.userType = localStorage.getItem('Usertype');
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false' && this.userType !== 'Buyer') {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if ((IsPremiumDecrypt === 'true') || (this.userType === 'Buyer')) {
      return true;
    } else {
      return false;
    }

  }
  getReadMessages() {
    if (this._rfqService.get('ismessageRead')) {
      this._rfqService.set(false, 'ismessageRead');
      this.getMessages();
    }
  }
  goToRfqDetails(message, redirect = 1) {
    if (!message.messageRead) {
      this._rfqService.changeMessageStatus(message.messageId).subscribe(
        result => {
          if (result.result === true) {} else {
            this._toastr.error(result.errorMessage, 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
    // localStorage.setItem('detailRfqId', message.rfqId);
    if (redirect == 1) {
      localStorage.setItem('ndaTab', 'true');
      const encryptedRfqID = this._profileService.encrypt(message.rfqId);
      this.router.navigate(['/rfq/rfqdetail'], {
        queryParams: {
          rfqId: encryptedRfqID
        }
      });
    }

  }
  replaceMessage(subject, des) {
    return subject + '-' + des;
  }
  removeHtmlTag(content) {
    return content.replace(/<[^>]*>/g, ' ');
  }
  moveRfq(value) {
    this.messageId = 0;
    if (value) {
      this.setStatusFilter(this.activeStatusFilterBtn);
    }

  }
  getmessageId(id, formToId) {
    this.messageId = id;
    if (this.userType === 'Supplier') {
      this.formToContactId = formToId;
    } else {
      this.formToContactId = '';
    }

  }
  openAssociateMessageDrawer() {
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'associateMessageDrawer');
    }, 200);

    this._rfqService.set(false, 'messageDrawer'); //
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
  }
  toggleMessageThreadDiv(index) {
    if (this.selectedDivIndex !== index) {
      this.selectedDivIndex = index;
    } else {
      this.selectedDivIndex = null;
    }
  }
 
}
