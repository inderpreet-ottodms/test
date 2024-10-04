import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  RfqService
} from './../../../../core/services/rfq/rfq.service';
import {
  ArchiveUnArchiveMessagesViewModel,
  ArchiveUnArchiveMessagesViewModelList,
  IMessagesViewModel
} from './../../../../core/models/rfqModel';
import {
  IMessageHubModel
} from './../../../../core/models/globalMaster';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import {
  Router
} from '@angular/router';
import { ProfileService } from '../../../../core/services/profile/profile.service';

@Component({
  selector: 'app-dash-message',
  templateUrl: './dash-message.component.html',
  styleUrls: ['./dash-message.component.scss'],
  providers: [ConfirmationService],
})
export class DashMessageComponent implements OnInit {

  // Variable Declarations
  @Input('rfqId') rfqId: number;
  contactID: number;
  iRfqMessageViewModelColl: IMessagesViewModel[];
  productList: IMessagesViewModel[] = [];
  filteredItems: IMessagesViewModel[];
  pages = 3;
  pageSize = 15;
  pageNumber = 0;
  currentIndex = 1;
  items: IMessagesViewModel[];
  pagesIndex: Array < number > ;
  pageStart = 1;
  appendText = '...';
  oappendText = '';
  isLoader: boolean;
  activeStatusFilterBtn: string;
  selectedAll: boolean;
  isCencel2: boolean;
  msgs: string;
  messageIdToDelete: number[];
  toggle: boolean;
  userType: string;
  isBuyer: boolean;
  chkBoxCount = 0;
  activeTopBtns = false;
  chkBoxCountArr: IMessagesViewModel[];
  totalRecordCount = 0;
  selectedRowCount = 0;
  selectedDivIndex = null;

  archiveUnArchiveMessagesViewModelListModel: ArchiveUnArchiveMessagesViewModelList;
  archiveUnArchiveMessagesViewModel: ArchiveUnArchiveMessagesViewModel[];
  dataToPostToDelete: any[] =[];

  dataToPostToDelete2: any[] =[];
  archiveUnArchiveMessagesViewModelListModel2: ArchiveUnArchiveMessagesViewModelList;
  // Variable Declarations Ends

  constructor(private _rfqService: RfqService, private confirmationService: ConfirmationService,
    private _toastr: ToastrService, private router: Router, private _ProfileService: ProfileService) {
    this.chkBoxCountArr = [];
    this.msgs = '';
    this.messageIdToDelete = [];
    this.isCencel2 = false;
    this.isLoader = true;
    this.activeStatusFilterBtn = 'All';
    this.toggle = true;
    this.items = [];
    this.iRfqMessageViewModelColl = [];
    this.selectedAll = false;
  }


  getMessages() {
    this.userType = localStorage.getItem('Usertype');
    if (this.userType === 'Buyer') {
      this.isBuyer = true;
    } else {
      this.isBuyer = false;
    }
    this._rfqService.getMessagesByRfqId(0, this.contactID, 0, this.isBuyer,0).subscribe(
      result => {
        if (result['result'] === true) {
          this.iRfqMessageViewModelColl = result['data'].slice(0, 10);
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.setStatusFilter(this.activeStatusFilterBtn);
          this.isLoader = false;
        } else {
          this.iRfqMessageViewModelColl = [];
          this.isLoader = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  ngOnInit() {
    this.rfqId = this.currentRfqId;
    this.contactID = this.currentContactId;
    this.getMessages();
  }

  init() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.filteredItems.length / this.pageSize));
    if (this.filteredItems.length % this.pageSize !== 0) {
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
    for (let i = 0; i < this.iRfqMessageViewModelColl.length; i++) {
      this.iRfqMessageViewModelColl[i].isSelected = this.selectedAll;
      this.chkBoxCountArr = this.iRfqMessageViewModelColl.filter(x => x.isSelected === true);
      this.selectedRowCount = this.chkBoxCountArr.length;
    }
  }
  sortMessage() {
    if (this.toggle) {
      this.items.sort((b, a) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());
    } else {
      this.items.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());
    }
    this.toggle = !this.toggle;
    // console.log('in');
    // console.log(this.items);
  }
  checkIfAllSelected() {
    this.chkBoxCountArr = this.items.filter(x => x.isSelected === true);
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
  }

  refreshItems() {
    this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
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
    this.refreshItems();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }

    this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.refreshItems();
  }
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  get currentContactId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  shortDescription(fileName) {
    let fixStr = '';
    if (fileName.length > 60) {
      fixStr = fileName.slice(0, 60);
      this.oappendText = fixStr.concat(this.appendText);
      return this.oappendText;
    } else {
      return fileName;
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
        month: 'short'
      });
      const custDate = month + ' ' + abc.getDate();
      return custDate;
    }
  }

  openSidePanel(contactId) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
    if (this.selectedRowCount > 1) {
      if (!(contactId === '' || contactId === undefined)) {
        this.chkBoxCountArr.push(contactId);
      }
      this._rfqService.set(false, 'messageThreadDrawer');
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'messageRfq');
      this._rfqService.set(true, 'messageFromMessage');
      this._rfqService.set(false, 'messageFromNda');
      this._rfqService.set(this.chkBoxCountArr, 'selectContactIdsForMEessage');
    }
  }
  }

  openSidePanel1(event, contactId, messageRFQId, fromContName,msgId) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
      event.stopPropagation();
      this._rfqService.set(false, 'messageRfq');
      setTimeout(() => {
        this._rfqService.set(false, 'messageThreadDrawer');
        this._rfqService.set(true, 'showSidePanel');
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(fromContName, 'nameOfBuyer');
        this._rfqService.set(contactId, 'selectContactIdsForMEessage');
        this._rfqService.set(messageRFQId, 'selectContactRFQId');
        let elmnt = document.getElementById(msgId);
        elmnt.scrollIntoView();
      }, 100);
    }
  }
  removeHtmlTag(content) {
    return content.replace(/<[^>]*>/g, ' ');
  }
  bindMessage(messageObj, sub, message) {
    let tempString = sub + '-';
    if (messageObj.messageTypeId === 220 && message.quoteReferenceNumber !== '' && message.quoteReferenceNumber !== null && message.quoteReferenceNumber !== undefined) {
      tempString += 'Quote Reference Number: ' + message.quoteReferenceNumber + ' ' + message;
    } else {
      tempString += message;
    }
    return tempString.replace(/<[^>]*>/g, ' ');
  }
  openMessageThreadDrawer(message: IMessagesViewModel,) {
    if(message.isNotification != true) {
      if (localStorage.getItem('isEmailVerify') == 'false') {
        this._toastr.warning("Please verify your email.", 'Warning');
      } else {
        if (message.messageTypeValue === 'SUPPLIER_NPS_RATING' || message.messageTypeValue === 'BUYER_NPS_RATING') {
          if (message.messageRead === false) {
            this._rfqService.set(true, 'isNPSPopupReqFromMessageTab');
            let tempMsgJson: IMessageHubModel;
            tempMsgJson = {
              messageId: message.messageId,
              messageTypeId: message.messageTypeId,
              fromId: message.fromCont,
              toContactIdEncrypt: message.toContactIdEncrypt,
              fromContactIdEncrypt: message.fromContactIdEncrypt,
              toId: message.toCont,
              imageString: '',
              userName: '',
              messageSubject: '',
              messageDescr: '',
              messageDate: null,
              rfqId: 0,
              messageType: '',
              isNotification: false
            };
            if (this.activeStatusFilterBtn === 'sent') {
              this._rfqService.set(message.toContName, 'toContName');
            } else {
              this._rfqService.set(message.fromContName, 'toContName');
            }
            this._rfqService.set(tempMsgJson, 'NPSPopupReqModelFromMessageTab');
          } else {
            this._toastr.warning('This user is already rated', 'Warning!');
          }
        } else {
          this._rfqService.set(null, 'messageForThread');
          this._rfqService.set(true, 'showSidePanel');
          this._rfqService.set(true, 'messageThreadDrawer');
          this._rfqService.set(false, 'transferRfq');
          this._rfqService.set(false, 'messageRfq');
          if (this.activeStatusFilterBtn === 'sent') {
            this._rfqService.set(message.toContName, 'toContName');
          } else {
            this._rfqService.set(message.fromContName, 'toContName');
          }
          let tempMessage: IMessagesViewModel;
          tempMessage = {
            messageId: message.messageId,
            rfqId: message.rfqId,
            pageName: message.pageName,
            originalMessageSubject: message.originalMessageSubject,
            toContactIdEncrypt: message.fromContactIdEncrypt,
            messageTypeId: message.messageTypeId,
            messageHierarchy: message.messageHierarchy,
            messageSubject: message.messageSubject,
            messageDescr: message.messageDescr,
            fromContactIdEncrypt: message.fromContactIdEncrypt,
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
            quoteReferenceNumber: '',
            toCompanyId: 0,
            isNotification: message.isNotification
          };
          this._rfqService.set(message.messageId, 'messageThreadId');
          this._rfqService.set(tempMessage, 'messageForThread');
          let elmnt = document.getElementById(''+message.messageId);
          elmnt.scrollIntoView();
        }
      }
    }
  }
 
  deleteMultipleMessage() {
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
                this.selectedRowCount = 0;
                this.dataToPostToDelete2 =[];
                this.getMessages();
              } else {
                this._toastr.error(result.data.errorMessage, 'Error!');
                this.dataToPostToDelete2 =[];
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
    // console.log(msgId, 'msgId')
    this.isCencel2 = true;
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

        // this.messageIdToDelete.push(msgId);
        this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel).subscribe(
          result => {
            if (result['data']['result'] === true) {
              this._toastr.success(result.data.errorMessage, '');
              this.selectedRowCount = 0;
              this.dataToPostToDelete = [];
              this.getMessages();
            } else {
              this._toastr.error(result.data.errorMessage, 'Error!');
              this.dataToPostToDelete = [];
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
      this.selectedAll = false;
      this.getMessages();
    }
  }

  setStatusFilter(btnState: string) {
    this.selectedDivIndex = null;
    if (this.activeStatusFilterBtn !== btnState) {
      this.activeStatusFilterBtn = btnState;
      if (btnState === 'All') {
        this.filteredItems = this.iRfqMessageViewModelColl;
      } else if (btnState === 'Read') {
        // tslint:disable-next-line:radix
        this.filteredItems = this.iRfqMessageViewModelColl.filter(x => (x.messageRead));
      } else if (btnState === 'Unread') {
        // tslint:disable-next-line:radix
        this.filteredItems = this.iRfqMessageViewModelColl.filter(x => (!x.messageRead));
      }
    }
    this.init();
  }

  goToNdaApprove() {
    this.router.navigate(['/rfq/rfqnda']);
  }
  goToRfqDetails(id) {
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }
  toggleMessageThreadDiv(index) {
    if (this.selectedDivIndex !== index) {
      this.selectedDivIndex = index;
    } else {
      this.selectedDivIndex = null;
    }
  }
  moveToCreatRfq(){  
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      if(rfqForm2Enabled){
        this.router.navigateByUrl('/rfq/buyer');      
      }else{
      this.router.navigateByUrl('/rfq/editrfq');
    }
    });
  }  
}
