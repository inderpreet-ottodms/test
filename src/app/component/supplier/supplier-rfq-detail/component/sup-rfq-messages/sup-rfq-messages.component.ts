import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  IRFQViewModel,
  ArchiveUnArchiveMessagesViewModel,
  ArchiveUnArchiveMessagesViewModelList,
  IMessagesViewModel
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
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-sup-rfq-messages',
  templateUrl: './sup-rfq-messages.component.html',
  styleUrls: ['./sup-rfq-messages.component.scss'],
  providers: [ConfirmationService]
})
export class SupRfqMessagesComponent implements OnInit {

  // Variable Declarations
  @Input('rfqId') rfqId: number;
  @Input() rfqGuid:any;
  contactID: number;
  iRfqMessageViewModelColl: IMessagesViewModel[];
  iRfqSentMessageViewModelColl: IMessagesViewModel[];
  filteredItems: IMessagesViewModel[];
  isMesssageAvailable: boolean;
  pages = 3;
  pageSize = 15;
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
  sendOrRecived = 'From';

  chkBoxCount = 0;
  activeTopBtns = false;
  chkBoxCountArr: IMessagesViewModel[];
  totalRecordCount = 0;
  selectedRowCount = 0;
  userType: string;
  isBuyer:boolean;

  selectedDivIndex = null;
  userAccount:string='';

  archiveUnArchiveMessagesViewModelListModel: ArchiveUnArchiveMessagesViewModelList;
  archiveUnArchiveMessagesViewModel: ArchiveUnArchiveMessagesViewModel[];
  dataToPostToDelete: any[] =[];

  dataToPostToDelete2: any[] =[];
  archiveUnArchiveMessagesViewModelListModel2: ArchiveUnArchiveMessagesViewModelList;
  messageTypeId: number;
  userDetailsLocation: string;
  irfqViewModel: IRFQViewModel;
  IsAllowQuoting: boolean;

  // Variable Declarations Ends

  constructor(private _rfqService: RfqService, private confirmationService: ConfirmationService,
    private _toastr: ToastrService, private _profileService: ProfileService, private router: Router) {
    this.chkBoxCountArr = [];
    this.msgs = '';
    this.messageIdToDelete = [];
    this.isCencel2 = false;
    this.isMesssageAvailable = false;
    this.isLoader = false;
    this.activeStatusFilterBtn = 'All';
  }
  messageList(value){

    this._rfqService.getMessagesByRfqId(this.rfqId, this.contactID, 0, this.isBuyer,value).subscribe(
      result => {
      
      this.items = result['data'];
      this.isLoader = false;
      this.iRfqMessageViewModelColl = result['data'];
      this.filteredItems = this.iRfqMessageViewModelColl;

      if(this.filteredItems.length > 0){
        this.init();
      }
      
    })

  }
 
  getMessages(value) {
    this._rfqService.getMessagesByRfqId(this.rfqId, this.contactID, 0,this.isBuyer,value).subscribe(
      result => {        
        if (result['result']) {
          this.iRfqMessageViewModelColl = result['data'];
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.setStatusFilter(this.activeStatusFilterBtn);
        } else {
        
          this.iRfqMessageViewModelColl = [];
          this.filteredItems = this.iRfqMessageViewModelColl;
          this.setStatusFilter(this.activeStatusFilterBtn);
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getSentMessages() {
    this.isLoader = true;
    this.messageTypeId = 0;
    this._rfqService.getMessagesByRfqId(this.rfqId, 0, this.contactID,this.isBuyer,this.messageTypeId).subscribe(
      result => {
      
        if (result['result']) {
          this.iRfqSentMessageViewModelColl = result['data'];
          this.filteredItems = this.iRfqSentMessageViewModelColl;
          this.isLoader = false;
        } else {
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
    this.userAccount = localStorage.getItem('AccountType');
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
    this._rfqService.set('All' , 'IsActiveBtn');
    this.userType = localStorage.getItem('Usertype');
    if(this.userType === 'Buyer') {
      this.isBuyer=true;
    } else {
      this.isBuyer=false;
    }
    this.contactID = this.currentContactId;
    this.getMessages(0);
    this.getRfqDetails();
  }

  init() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    if (this.filteredItems.length === 0) {
      this.isMesssageAvailable = true;
    } else {
      this.isMesssageAvailable = false;
    }
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
    if (this._rfqService.get('messageDrawer') == true) {
      this.openSidePanel('');
    }
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
    if (this._rfqService.get('messageDrawer') == true) {
      this.openSidePanel('');
    }
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
    return parseInt(localStorage.getItem('supplierRfqDetailId'));
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
    this._rfqService.set(false, 'associateMessageDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
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
    }
    else if (this.selectedRowCount == 1) {
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
    event.stopPropagation();
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(true, 'showSidePanel');
    setTimeout(() => {
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(true, 'messageDrawer');
    this._rfqService.set(false, 'associateMessageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(fromContName, 'nameOfBuyer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'selectContactRFQId');
  },100);
  }

  openMessageThreadDrawer(message: IMessagesViewModel) {
  
    // 156 === SUPPLIER_NPS_RATING
    // 157 === BUYER_NPS_RATING
//
  if(message.isNotification != true) {
    if (message.messageTypeValue === 'SUPPLIER_NPS_RATING' || message.messageTypeValue === 'BUYER_NPS_RATING') {
      if (message.messageRead === false) {
        this._rfqService.set(true, 'isNPSPopupReqFromMessageTab');
        let tempMsgJson: IMessageHubModel;
        tempMsgJson = {
          messageId: message.messageId,
          messageTypeId: message.messageTypeId,
          fromId: message.fromCont,
          toId: message.toCont,
          fromContactIdEncrypt: message.fromContactIdEncrypt,
          toContactIdEncrypt: message.toContactIdEncrypt,
          imageString: '',
          userName: '',
          messageSubject: '',
          messageDescr: '',
          messageDate: null,
          rfqId: 0,
          messageType: '',
          isNotification: false,
          isMessageThread: message.isMessageThread
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


      this._rfqService.set(false, 'messageDrawer');
      this._rfqService.set(false, 'associateMessageDrawer');
      this._rfqService.set(null, 'messageForThread');
      this._rfqService.set(null, 'messageThreadId');
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'messageThreadDrawer');
      this._rfqService.set(false, 'transferRfq');
      this._rfqService.set(false, 'isPartialQuote');
      let tempMessage: IMessagesViewModel;
      tempMessage = {
        messageId: message.messageId,
        rfqId: message.rfqId,
        originalMessageSubject: message.originalMessageSubject,
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
        nDAApproveContactsRFQsLists:[],
        quoteReferenceNumber: '',
        isMessageThread: message.isMessageThread,
        toCompanyId: message.toCompanyId,
        isNotification: message.isNotification
      };

      if (this.activeStatusFilterBtn === 'sent') {
        this._rfqService.set(message.toContName, 'toContName');
      } else {
        this._rfqService.set(message.fromContName, 'toContName');
      }
      this._rfqService.set(message.messageId, 'messageThreadId');
      this._rfqService.set(tempMessage, 'messageForThread');
      this._rfqService.setisSupplierMessageThread('true');
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
          for (let i = 0; i < this.chkBoxCountArr.length; i++) {
            this.dataToPostToDelete2.push({
              parentMessageId: this.chkBoxCountArr[i].messageId,
              messageId: this.chkBoxCountArr[i].messageId,
              archieveBy: this.currentContactId,
            });  
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
                this.dataToPostToDelete2 =[];
                this.getMessages(0);
                this.getSentMessages();
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
    this.isCencel2 = true;
    this.messageIdToDelete = [];
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to archive this Message, all data will be permanently lost. Would you like to cancel this message?',
      header: 'Archive Message',
      icon: null,
      accept: () => {
        this.msgs = 'true';

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

        this._rfqService.archiveUnarchive(this.archiveUnArchiveMessagesViewModelListModel).subscribe(
          result => {
            if (result['data']['result'] === true) {
              this._toastr.success(result.data.errorMessage, '');
              this.dataToPostToDelete = [];
              this.getMessages(0);
              this.getSentMessages();
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
      this.getMessages(0);
      this.getSentMessages();
    }
  }

  setStatusFilter(btnState: string) {
    this.selectedDivIndex = null;
    if (this.activeStatusFilterBtn !== btnState) {
      this.activeStatusFilterBtn = btnState;
      this.isLoader = true;
      if (btnState === 'All') {
        this.sendOrRecived = 'From';
        this._rfqService.set('All' , 'IsActiveBtn');
        this.messageTypeId = 0;
        this.messageList(this.messageTypeId);
      } else if (btnState === 'Read') {
        this.sendOrRecived = 'From';
        this._rfqService.set('Read' , 'IsActiveBtn');
        this.messageTypeId = 1;
        this.messageList(this.messageTypeId);
      } else if (btnState === 'Unread') {
        this.sendOrRecived = 'From';
        this._rfqService.set('Unread' , 'IsActiveBtn');
        this.messageTypeId = 2;
        this.messageList(this.messageTypeId);
      } else if (btnState === 'sent') {
        this.sendOrRecived = 'To';
        this._rfqService.set('sent' , 'IsActiveBtn');
        this.messageTypeId = 3;
        this.isLoader = true;
        this.messageList(this.messageTypeId);
      }
      this.isLoader = false;
    }
  }
  isPremium() {

    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }

  }

  isPremiumAndAllowQuoting() {   
   
    // this.IsAllowQuoting = localStorage.getItem('IsAllowQuoting');
    if (this.isPremium() === true && this.IsAllowQuoting === true) {
      return true;
    } else {
      return false;
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
  removeHtmlTag(content){
   return content.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, "");
  }
  toggleMessageThreadDiv(index){
  
    if(this.selectedDivIndex !== index){
      this.selectedDivIndex = index;
    }else{
      this.selectedDivIndex = null;
    }
  }

  showUpgradeOffer(){
    //Default false
    let responseValue = false;
    if(this.userAccount == 'Gold' || this.userAccount == 'Platinum'){
      if(this.isPremium() && this.irfqViewModel.isStripeSupplier && !this.irfqViewModel.isAllowQuoting){
        return true;
      }
    }

    if(this.userDetailsLocation == 'Asia'){
      return false;
    }

    if(this.userAccount == 'Basic'){
      responseValue = true;
    }

    if(this.userAccount == 'Starter' || this.userAccount == 'Growth Package'){

      if(this.irfqViewModel.rfqPrice == null){
        responseValue = true;
      }
      if(this.irfqViewModel.prefNdaType == 2){
        responseValue = true;
      }
      if(this.irfqViewModel.rfqAccess == true){
        responseValue = false;
      }
    }

    return responseValue;
  }
  showApacUpgrade(){
    if(!this.isPremium() && this.userDetailsLocation =='Asia'){
      return true;
    }
    //Default false
    return false;
  }

  getRfqDetails() {
    let supplierContactId = 0;
    supplierContactId = this.currentContactId;
    if ( this.rfqGuid !== undefined && this.rfqGuid !== null && this.rfqGuid !== '') {
      this._rfqService.getRFQExtraDetails(0, supplierContactId, this.rfqGuid).subscribe(
        result => {

          if (result.result === true) {
           
            this.irfqViewModel = result;
            this.IsAllowQuoting = this.irfqViewModel.isAllowQuoting;
            
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
    if (this.rfqId !== 0 && !isNaN(this.rfqId) && this.rfqId !== undefined) {
      this._rfqService.getRFQExtraDetails(this.rfqId, supplierContactId, '').subscribe(
        result => {
          if (result.result === true) {
            this.irfqViewModel = result;
            this.IsAllowQuoting = this.irfqViewModel.isAllowQuoting;
          
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
      }
    }
}
