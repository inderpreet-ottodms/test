import {
  Component,
  OnInit, OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  QmsEmailMessagesFilterViewModel,
  qMSEmailMessagesViewModel
} from '../../../../../core/models/qmsModel';
import {
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-message-tab',
  templateUrl: './message-tab.component.html',
  styleUrls: ['./message-tab.component.scss'],
  providers: [ConfirmationService, QmsEmailMessagesFilterViewModel, qMSEmailMessagesViewModel],
})
export class MessageTabComponent implements OnInit, OnDestroy {

  isMesssageAvailable: boolean;
  pages = 3;
  pageSize = 24;
  pageNumber = 1;
  currentIndex = 1;
  totalRow: number;
  isLoader: boolean;
  activeStatusFilterBtn: string;
  items: qMSEmailMessagesViewModel[];
  qmsEmailMessagesViewModel: qMSEmailMessagesViewModel[];
  pagesIndex: Array < number > ;
  pageStart = 1;
  appendText = '...';
  oappendText = '';
  selectedAll: boolean;
  msgs: string;
  messageIdToDelete: number[];
  selectedMsgArr: qMSEmailMessagesViewModel[];
  selectedRowCount = 0;

  @Output() messageData = new EventEmitter < number > ();
  viewMessage(msgId) {
    setTimeout(() => {

      this._qmsService.set(true, 'showSidePanel');
      // this._qmsService.set(false, 'isMessageSendDrawer');
      this._qmsService.set(false, 'isMessageQmsDrawer');
      this._qmsService.set(true, 'isMessageDrawer');
    }, 1000);
    this.messageData.emit(msgId);
  }

  constructor(private _qmsService: QmsService, private route: ActivatedRoute,
    private qmsEmailMessagesFilterViewModel: QmsEmailMessagesFilterViewModel,
    private _rfqService: RfqService, private confirmationService: ConfirmationService,
    private _toastr: ToastrService) {
    this.selectedMsgArr = [];
    this.msgs = '';
    this.messageIdToDelete = [];
    this.isMesssageAvailable = true;
    this.isLoader = false;
    this.activeStatusFilterBtn = 'all';
    // this._qmsService.set(false, 'showSidePanel');
    // this._qmsService.set(false, 'isNoteDrawer');
    // this._qmsService.set(false, 'isMessageDrawer');
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.items = [];
    this.isLoader = true;
    this.qmsEmailMessagesFilterViewModel.qmsQuoteId = Number(this.route.snapshot.params['id']);
    this._qmsService.GetQmsQuoteEmailMessages(this.qmsEmailMessagesFilterViewModel).subscribe(
      result => {
        this.qmsEmailMessagesViewModel = result.data;
        if (this.qmsEmailMessagesViewModel.length !== 0) {
          this.totalRow = result.totalRecords;
          this.items = this.qmsEmailMessagesViewModel;
          this.isLoader = false;
          this.isMesssageAvailable = true;
        } else {
          this.totalRow = 0;
          this.isLoader = false;
          this.items = [];
          this.isMesssageAvailable = false;
        }
        this.init();
      },
      error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
        this.isMesssageAvailable = false;
        this.items = [];
        this.totalRow = 0;
      },
      () => {}
    );
  }

  // Pagination starts
  /* Pagination */
  fillArray(): any {
    const obj = new Array();
    // tslint:disable-next-line:radix
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  refreshItems() {
    this.pagesIndex = this.fillArray();
  }
  init() {
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.totalRow / this.pageSize));
    if (this.totalRow % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.qmsEmailMessagesFilterViewModel.pageNumber = this.currentIndex;
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
    this.qmsEmailMessagesFilterViewModel.pageNumber = this.currentIndex;
    this.getMessages();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.qmsEmailMessagesFilterViewModel.pageNumber = this.currentIndex;
    this.getMessages();
  }

  selectAll() {
    this.selectedMsgArr = [];
    this.selectedRowCount = 0;
    for (let i = 0; i < this.qmsEmailMessagesViewModel.length; i++) {
      this.qmsEmailMessagesViewModel[i].isSelected = this.selectedAll;
      this.selectedMsgArr = this.qmsEmailMessagesViewModel.filter(x => x.isSelected === true);
      this.selectedRowCount = this.selectedMsgArr.length;
    }
  }
  checkIfAllSelected() {
    this.selectedMsgArr = this.items.filter(x => x.isSelected === true);
    this.selectedRowCount = this.selectedMsgArr.length;
    this.selectedAll = this.items.every(function (item: any) {
      return item.selected === true;
    });
  }

  deleteMultipleMessage() {
    const messageToDelete = {
      qmsEmailMessageIds: []
    }
    if (this.selectedRowCount > 1) {
      this.confirmationService.confirm({
        // tslint:disable-next-line:max-line-length
        message: 'Are you sure you want to delete all selected Message, all data will be permanently lost. Would you like to cancel this message?',
        header: 'Delete Messages',
        icon: null,
        accept: () => {
          this.msgs = 'true';
          for (let i = 0; i < this.selectedMsgArr.length; i++) {
            messageToDelete.qmsEmailMessageIds.push(this.selectedMsgArr[i].qmsEmailMessageId);
          }
          this._qmsService.deleteQmsQuoteEmailMessages(messageToDelete).subscribe(
            result => {
              if (!result.isError) {
                this._toastr.success('Messages are deleted', 'Success!');
                this.setStatusFilter(this.activeStatusFilterBtn);
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
  }

  deleteMessage(msgId) {
    const messageToDelete = {
      qmsEmailMessageIds: []
    }
    this.messageIdToDelete = [];
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this Message, all data will be permanently lost. Would you like to cancel this message?',
      header: 'Delete Message',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        messageToDelete.qmsEmailMessageIds.push(msgId);
        this._qmsService.deleteQmsQuoteEmailMessages(messageToDelete).subscribe(
          result => {
            if (!result.isError) {
              this._toastr.success('Message is deleted', 'Success!');
              this.setStatusFilter(this.activeStatusFilterBtn);
            } else {
              // this._toastr.error(result.errorMessage, 'Error!');
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

  setStatusFilter(btnState: string) {
    this.selectedMsgArr = [];
    this.selectedRowCount = 0;
    this.selectedAll = false;
    if (this.activeStatusFilterBtn !== btnState) {
      this.activeStatusFilterBtn = btnState;
      if (btnState === 'all') {
        this.qmsEmailMessagesFilterViewModel.isRead = null;
      } else if (btnState === 'read') {
        // tslint:disable-next-line:radix
        this.qmsEmailMessagesFilterViewModel.isRead = true;
      } else if (btnState === 'unread') {
        // tslint:disable-next-line:radix
        this.qmsEmailMessagesFilterViewModel.isRead = false;
      }
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.qmsEmailMessagesFilterViewModel.pageNumber = 1;
    this.qmsEmailMessagesFilterViewModel.pageSize = this.pageSize;
    this.getMessages();
  }
  getReadMessages() {
    if (this._rfqService.get('isMessageRead')) {
      this._rfqService.set(false, 'isMessageRead');
      this.getMessages();
    }
  }

  openSendMsgDrawer() {
    setTimeout(() => {
    this._qmsService.set(true, 'showSidePanel');
    this._qmsService.set(true, 'isMessageQmsDrawer');
    }, 10);
    this._qmsService.set(false, 'isMessageDrawer');
    this._qmsService.set(false, 'isMessageSendDrawer');
  }
  ngOnDestroy() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
    this._qmsService.set(false, 'isNoteDrawer');
  }
}
