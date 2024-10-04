import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IMessagesViewModel,
  IRfqNDAViewModel,
  NDAApproveContactsRFQsList
} from '../../../../../core/models/rfqModel';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-nda-list',
  templateUrl: './nda-list.component.html',
  styleUrls: ['./nda-list.component.scss']
})
export class NdaListComponent implements OnInit {

  // Model Instance
  iRfqNDAViewModelColl: IRfqNDAViewModel[];
  iFilteredRfqNDAViewModelColl: IRfqNDAViewModel[];
  chkBoxCountArr: IRfqNDAViewModel[];
  msgs: string;
  // Model Instance End

  // variable Declarations
  public rfqId: any;
  cloneRfqId: number;
  cloneContactId: number;
  display: boolean;
  isDelete: boolean;
  isClone: boolean;
  isCencel: boolean;
  isTilesView: boolean;
  isGridView: boolean;
  searchFilterValue: string;
  stateFilterValue: string;
  cloneRfqName: string;
  sortFilterValue: string;
  isLoader: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  activeStatusFilterBtn: string;
  isCreateRFQBodyBtnDisabled: boolean;
  isRFQInProgBodyBtnDisabled: boolean;
  toggleNoRFQBodyBtn = true;
  toggleManufacturer: boolean;


  tabBtnStatus = 'all';
  selectedRowCount = 0;
  selectedRowCountTxt = '';
  p = 1;
  selectedAll: any;
  chkBoxCount = 0;
  activeTopBtns = false;
  totalRecordCount = 0;
  iCompanyViewFilteredModelColl: IRfqNDAViewModel[];

  productList: IRfqNDAViewModel[] = [];
  filteredItems: IRfqNDAViewModel[];
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  items: IRfqNDAViewModel[];
  pagesIndex: Array < number > ;
  pageStart = 1;
  appendText = '...';
  oappendText = '';
  selectedIds: any[];
  contactIdsArr: number[];
  IMessagesViewModel: IMessagesViewModel;
  contactIdArr: number[];
  rfqIdsArr: number[];
  ndaApproveContactsRFQsList: NDAApproveContactsRFQsList;
  selectedRFQMsgId = 0;

  isSubmitted: boolean = false;

  iRfqMessageViewModelFun() {
    this.IMessagesViewModel = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 0,
      toContactIdEncrypt: '',
      originalMessageSubject: '',
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
      trash: true,
      trashDate: null,
      fromTrash: false,
      fromTrashDate: null,
      errorMessage: '',
      result: false,
      toContactIds: [],
      messageStatus: '',
      isSelected: false,
      supplierProfileUrl: '',
      buyerProfileUrl: '',
      sendEmail: false,
      messageStatusId: 0,
      messageTypeValue: '',
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
      toCompanyId: 0,
      isNotification: false
    };
    this.ndaApproveContactsRFQsList = {
      contactId: 0,
      rfqId: 0
    }

  }
  // variable Declarations ends


  constructor(private _rfqService: RfqService, private _toastr: ToastrService,

    private router: Router, private _ProfileService: ProfileService) {
    this._rfqService.set(false, 'showSidePanel');
    this.isDelete = false;
    this.isCencel = false;
    this.iRfqNDAViewModelColl = [];
    this.isGridView = true;
    this.isRfqAvailable = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.stateFilterValue = '';
    this.searchFilterValue = '';
    this.sortFilterValue = 'Recent';
    this.activeStatusFilterBtn = 'All';
    this.toggleManufacturer = false;
    this.msgs = '';
    this.isCreateRFQBodyBtnDisabled = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.display = false;
    this.isClone = false;
    this.cloneRfqId = 0;
    this.cloneContactId = 0;
  }

  ngOnInit() {
    this.getRfqList();

  }

  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }
  openTilesView() {
    this.isTilesView = true;
    this.isGridView = false;
  }

  showDialog() {
    this.display = true;
  }

  // API Call Function

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  isAcceptBtnDisable: boolean = false;
  isDeclineBtnDisable: boolean = false;
  getNDAListAsPerTab(rfqNDAType: any, rfqNDALevel: any,rfqNDAStatus: any, rfqId: any, contactId: any) {
    this._rfqService.GetManufacturer(rfqNDAType, rfqNDALevel,rfqNDAStatus, rfqId, contactId).subscribe(
      result => {    
        if (result['result'] === true) {
          this.iRfqNDAViewModelColl = result['data'];
          this.totalRfq = this.iRfqNDAViewModelColl.length;
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl;
          if (this.iRfqNDAViewModelColl.length !== 0) {           
            this.totalRecordCount = this.iFilteredRfqNDAViewModelColl.length;
            this.isLoader = false;
            this.filteredItems = this.iFilteredRfqNDAViewModelColl;
            this.init();
          } else {            
            this.isLoader = false;
            this.isRfqAvailable = true;
          }
        } else {
          this.totalRfq = this.iRfqNDAViewModelColl.length;
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl;
          this.isLoader = false;
          this.isRfqAvailable = true;
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
 
  getRfqList() {
    this.isLoader = true;
    this.isRfqAvailable = false;
    if(this.activeStatusFilterBtn === 'All') {
      //Parameter for getNDAListAsPerTab (rfqNDAType,rfqNDALevel,rfqNDAStatus,rfqId,contactId)
      this.getNDAListAsPerTab('All', '2','All', 0, this.loggedId);  
    } else if (this.activeStatusFilterBtn === 'Standard') {
      this.getNDAListAsPerTab('Standard', '3','All', 0, this.loggedId);  
    }  else if (this.activeStatusFilterBtn === 'Custom') {
      this.getNDAListAsPerTab('Custom', '3','All', 0, this.loggedId);  
    }  else if (this.activeStatusFilterBtn === 'Declined') {
      this.getNDAListAsPerTab('Declined', '3','Declined', 0, this.loggedId);  
    }
  }
  sortOnContactName() {
    if (this.toggleManufacturer) {
      this.items.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else {
      this.items.sort((a, b) => b.companyName.localeCompare(a.companyName));
    }
    this.toggleManufacturer = !this.toggleManufacturer;
  }
  selectAll() {
    this.chkBoxCountArr = [];
    this.selectedRowCount = 0;
    for (let i = 0; i < this.iFilteredRfqNDAViewModelColl.length; i++) {
      this.iFilteredRfqNDAViewModelColl[i].selected = this.selectedAll;
      this.chkBoxCountArr = this.iFilteredRfqNDAViewModelColl.filter(x => x.selected === true);
      this.selectedRowCount = this.chkBoxCountArr.length;
      if (this.selectedRowCount > 0) {
        this.activeTopBtns = true;
      } else {
        this.activeTopBtns = false;
      }
      this.selectedRowCountTxt = this.selectedRowCount + ' selected';
    }
  }
  approveDeclineAction(status: string, contactIdData, rfqIdData, isNDAToApproveAll) {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.contactIdsArr = [];
      this.rfqIdsArr = [];
      this.iRfqMessageViewModelFun();
      if (contactIdData === 0 && rfqIdData === 0) {
        for (let i = 0; i < this.chkBoxCountArr.length; i++) {
          this.ndaApproveContactsRFQsList = {
            contactId: 0,
            rfqId: 0
          }

          this.ndaApproveContactsRFQsList.contactId = this.chkBoxCountArr[i].contactId;
          this.ndaApproveContactsRFQsList.rfqId = this.chkBoxCountArr[i].rfqId;
          this.IMessagesViewModel.nDAApproveContactsRFQsLists.push(this.ndaApproveContactsRFQsList)
        }

      } else {
        this.ndaApproveContactsRFQsList = {
          contactId: contactIdData,
          rfqId: rfqIdData
        }
        this.IMessagesViewModel.nDAApproveContactsRFQsLists.push(this.ndaApproveContactsRFQsList)
      }

      this.IMessagesViewModel.rfqId = rfqIdData;
      this.IMessagesViewModel.toRFQIds = this.rfqIdsArr;
      this.IMessagesViewModel.toContactIds = this.contactIdsArr;
      this.IMessagesViewModel.messageStatus = status;
      this.IMessagesViewModel.fromCont = this.loggedId;
      this.IMessagesViewModel.pageName = 'component\rfq\nda-to-approve\component\nda-list\nda-list.component.ts';
      this.IMessagesViewModel.toCont = contactIdData;
      this.IMessagesViewModel.messageTypeId = 2;
      this.IMessagesViewModel.messageDate = new Date();
      this.IMessagesViewModel.isNDAToApproveAll = isNDAToApproveAll;

      this._rfqService
        .manufacturerApproveDecline(this.IMessagesViewModel)
        .subscribe(
          result => {
            if (result.result === true) {
              this._toastr.success(result.errorMessage);
              this.IMessagesViewModel.toRFQIds.forEach(element => {
                this.IMessagesViewModel.toContactIds.forEach(contactIds => {
                  const rfqdata = this.iRfqNDAViewModelColl.find(m => m.rfqId === element &&
                    m.contactId === contactIds);
                  if (rfqdata) {
                    rfqdata.messageStatusToken = status;
                  }
                });
              });
              this.activeTopBtns = false;
              this.getRfqList();
            } else {
              this._toastr.error(result.errorMessage);
            }
            this.isSubmitted = false;
          },
          error => {
            this.isSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );

    }
  }
  checkIfAllSelected() {
    ;
    this.chkBoxCountArr = this.iFilteredRfqNDAViewModelColl.filter(x => x.selected === true);
    this.selectedRowCount = this.chkBoxCountArr.length;

    if (this.chkBoxCountArr.length >= 2) {
      this.activeTopBtns = true;
      this.selectedRowCountTxt = this.selectedRowCount + ' selected';
    } else {
      this.activeTopBtns = false;
      this.selectedRowCountTxt = '';
    }
    this.selectedAll = this.iFilteredRfqNDAViewModelColl.every(function (item: any) {
      return item.selected === true;
    });
  }
  openSidePanel(event, contactId, fromContName, messageRFQId, messageId ? ) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
      return;
    }
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(messageRFQId, 'rfqId');
    this.selectedRFQMsgId = messageId;
    setTimeout(() => {
      event.stopPropagation();
      if (this.activeTopBtns === true && (contactId === '' || contactId === undefined)) {
        this._rfqService.set(false, 'supplierProfileDrawer');
        this._rfqService.set(true, 'showSidePanel');
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(false, 'messageFromMessage');
        this._rfqService.set(true, 'messageFromNda');
        this._rfqService.set(this.chkBoxCountArr, 'selectContactIdsForMEessage');
        this._rfqService.set(this.selectedRowCount, 'selectContactIdsCount');
      }
      if (this.activeTopBtns === false && (contactId !== '' || contactId !== undefined)) {
        this._rfqService.set(false, 'supplierProfileDrawer');
        this._rfqService.set(true, 'showSidePanel');
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(true, 'messageFromMessage');
        this._rfqService.set(false, 'messageFromNda');
        this._rfqService.set(contactId, 'selectContactIdsForMEessage');
        this._rfqService.set(messageRFQId, 'selectContactRFQId');
        this._rfqService.set(fromContName, 'nameOfBuyer');
      }
    }, 100);
  }


  // API Call Function End

  // List functions

  setStatusFilter(btnState: string) {
    this.activeTopBtns = false;
    this.selectedRowCountTxt = '';
    this.selectedAll = 0;
    this.activeStatusFilterBtn = btnState;
    this.getRfqList();
  }

  filterNDA() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this.isLoader = true;
console.log( this.iFilteredRfqNDAViewModelColl);
    if (this.searchFilterValue !== '') {
      this.iFilteredRfqNDAViewModelColl = this.iFilteredRfqNDAViewModelColl.filter(x => x.companyName.toLowerCase()
        // tslint:disable-next-line:max-line-length
        .includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()));
    }
    if (this.iFilteredRfqNDAViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
      this.isRFQInProgBodyBtnDisabled = false;
      switch (this.sortFilterValue) {
        case 'Recent': {
          this.iFilteredRfqNDAViewModelColl = this.iFilteredRfqNDAViewModelColl.sort((a, b) =>
            b.ndaAcceptedDate.localeCompare(a.ndaAcceptedDate));
          break;
        }
        case 'Oldest': {
          this.iFilteredRfqNDAViewModelColl = this.iFilteredRfqNDAViewModelColl.sort((a, b) =>
            a.ndaAcceptedDate.localeCompare(b.ndaAcceptedDate));
          break;
        }
        case 'A - Z': {
          this.iFilteredRfqNDAViewModelColl = this.iFilteredRfqNDAViewModelColl.sort((a, b) => a.companyName.localeCompare(b.companyName));
          break;
        }
        case 'Z - A': {
          this.iFilteredRfqNDAViewModelColl = this.iFilteredRfqNDAViewModelColl.sort((a, b) => b.companyName.localeCompare(a.companyName));
          break;
        }
        default: {
          break;
        }
      }
    }
    this.items = this.iFilteredRfqNDAViewModelColl;
    this.filteredItems = this.iFilteredRfqNDAViewModelColl;
    this.totalRecordCount = this.iFilteredRfqNDAViewModelColl.length;
    this.init();
  }
  sortFilter() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this.iFilteredRfqNDAViewModelColl = [];
    switch (this.sortFilterValue) {
      case 'Recent': {
        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.filter(x => x.companyName
              .toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => b.ndaAcceptedDate.localeCompare(a.ndaAcceptedDate));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.sort((a, b) => b.ndaAcceptedDate.localeCompare(a.ndaAcceptedDate));
        }
        break;
      }
      case 'Oldest': {
        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.filter(x => x.companyName
              .toLowerCase().startsWith(this.searchFilterValue.toLowerCase()) ||
              x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => a.ndaAcceptedDate.localeCompare(b.ndaAcceptedDate));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.sort((a, b) => a.ndaAcceptedDate.localeCompare(b.ndaAcceptedDate));
        } 
        break;
      }
      case 'A - Z': {
        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.filter(x => x.companyName
              .toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => a.companyName.localeCompare(b.companyName));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.sort((a, b) => a.companyName.localeCompare(b.companyName));
        } 
        break;
      }
      case 'Z - A': {
        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.filter(x => x.companyName
              .toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => b.companyName.localeCompare(a.companyName));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRfqNDAViewModelColl = this.iRfqNDAViewModelColl.sort((a, b) => b.companyName.localeCompare(a.companyName));
        } 
        break;
      }
      default: {
        break;
      }
    }
    if (this.iFilteredRfqNDAViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
      this.isRFQInProgBodyBtnDisabled = false;
    }

  }

  // List Functions Ends

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  // Pagination starts
  init() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + this.filteredItems.length / this.pageSize);
    if (this.filteredItems.length % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }
  refreshItems() {
    this.items = this.filteredItems.slice(
      (this.currentIndex - 1) * this.pageSize,
      this.currentIndex * this.pageSize
    );
    this.pagesIndex = this.fillArray();
    window.scrollTo(0, 0);
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
    if (this.currentIndex >= this.pageStart + this.pages) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }

    this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.refreshItems();
  }

  fillArray(): any {
    const obj = new Array();
    for (
      let index = this.pageStart; index < this.pageStart + this.pages; index++
    ) {
      obj.push(index);
    }
    return obj;
  }
  // Pagination ends
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = '';
    }
    this.getRfqList();
  }
  onSearch() {
    if (this.searchFilterValue) {
      this.filterNDA();
    }
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.filterNDA();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.filterNDA();
    }
  }
  isMessageRfqPanel() {
    return this._rfqService.get('messageRfq');
  }
  openMenufacturerDrawer(contactId, contactName, companyName, rfqId) {
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(rfqId, 'rfqId');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(contactName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 100);
  }
  /* This function is used to reload page after message sent */
  reloadMessages() {
    if (this._rfqService.get('messageSentFromRfq')) {
      this._rfqService.set(false, 'messageSentFromRfq');
      this.selectedRowCount = 0;
      this.selectedRowCountTxt = '';
      this.selectedAll = false;
      this.activeTopBtns = false;
      this.getRfqList();
    }
  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }
}
