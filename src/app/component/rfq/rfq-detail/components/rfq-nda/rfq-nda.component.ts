import { Component, OnInit, Input } from '@angular/core';
import { RfqService } from './../../../../../core/services/rfq/rfq.service';
import { IRfqNDAViewModel, IMessagesViewModel, NDAApproveContactsRFQsList} from '../../../../../core/models/rfqModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rfq-nda',
  templateUrl: './rfq-nda.component.html',
  styleUrls: ['./rfq-nda.component.scss']
})
export class RfqNdaComponent implements OnInit {
  // Variable Declarations
  @Input('rfqId') rfqId: number;

  iCompanyViewModelColl: IRfqNDAViewModel[];

  iManifacturerAvailable: boolean;
  // Variable Declarations
  tabBtnStatus = 'All';
  selectedRowCount = 0;
  selectedRowCountTxt = '';
  p = 1;
  selectedAll: any;
  chkBoxCount = 0;
  activeTopBtns = false;
  chkBoxCountArr: IRfqNDAViewModel[];
  totalRecordCount = 0;
  iCompanyViewFilteredModelColl: IRfqNDAViewModel[];

  productList: IRfqNDAViewModel[] = [];
  filteredItems: IRfqNDAViewModel[];
  pages = 3;
  pageSize = 15;
  pageNumber = 0;
  currentIndex = 1;
  items: IRfqNDAViewModel[];
  pagesIndex: Array<number>;
  pageStart = 1;
  appendText = '...';
  oappendText = '';
  selectedIds: any[];
  contactIdsArr: number[];
  IMessagesViewModel: IMessagesViewModel;
  contactIdArr: number[];
  toggleManufacturer: boolean;
  selectedRFQMsgId = 0;
  ndaApproveContactsRFQsList:NDAApproveContactsRFQsList;
  iRfqMessageViewModelFun() {
    this.IMessagesViewModel = {
      messageId: 0,
      toContactIdEncrypt: '',
      rfqId: 0,
      messageTypeId: 0,
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

  // Variable Declarations Ends
  constructor(
    private _rfqService: RfqService,
    private _toastr: ToastrService
  ) {
    this.toggleManufacturer = false;
    this._rfqService.set(false, 'messageFromMessage');
    this._rfqService.set(false, 'messageFromNda');
  }

  ngOnInit() {
    // this.rfqId = this.currentRfqId;
    
    this.getManufacturer();
  }
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }

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
      let index = this.pageStart;
      index < this.pageStart + this.pages;
      index++
    ) {
      obj.push(index);
    }
    return obj;
  }
  getNDAListAsPerTab(rfqNDAType: any, rfqNDALevel: any,rfqNDAStatus: any, rfqId: any, contactId: any) {
    this._rfqService.GetManufacturer(rfqNDAType, rfqNDALevel,rfqNDAStatus, rfqId, contactId).subscribe(
      result => {
        ;
        if (result['result'] === true) {
          // this.iCompanyViewModelColl = result;
        this.iCompanyViewModelColl = result['data'];
        this.iCompanyViewFilteredModelColl = this.iCompanyViewModelColl;
        this.totalRecordCount = this.iCompanyViewFilteredModelColl.length;
        this.productList = this.iCompanyViewModelColl;
        this.filteredItems = this.productList;
        this.init();
        if (this.iCompanyViewModelColl.length !== 0) {
          this.iManifacturerAvailable = false;
        } else {
          this.iManifacturerAvailable = true;
        }
        //this.sortedManifacturerList(this.tabBtnStatus);
      } else {
        this.iCompanyViewModelColl = [];
        this.iCompanyViewFilteredModelColl = this.iCompanyViewModelColl;
        this.totalRecordCount = this.iCompanyViewFilteredModelColl.length;
        this.productList = this.iCompanyViewModelColl;
        this.filteredItems = this.productList;
        this.init();
        if (this.iCompanyViewModelColl.length !== 0) {
          this.iManifacturerAvailable = false;
        } else {
          this.iManifacturerAvailable = true;
        }
      //  this.sortedManifacturerList(this.tabBtnStatus);
      }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getManufacturer() {
    // this.isLoader = true;
    // this.isRfqAvailable = false;
    //console.log(this.rfqId, 'this.rfqId')
    if(this.tabBtnStatus === 'All') {
      let rfqId = this.rfqId;
      let contactId= 0;
      let rfqNDAType = 'All'; 
      let rfqNDALevel = '2' ;
      let rfqNDAStatus = 'All' ;
      this.getNDAListAsPerTab(rfqNDAType, rfqNDALevel,rfqNDAStatus, rfqId, contactId);  
    } else if (this.tabBtnStatus === 'Standard') {
      let rfqId = this.rfqId;
      let contactId= 0;
      let rfqNDAType = 'Standard'; 
      let rfqNDALevel = '3' ;
      let rfqNDAStatus = 'All' ;
      this.getNDAListAsPerTab(rfqNDAType, rfqNDALevel,rfqNDAStatus, rfqId, contactId);  
    }  else if (this.tabBtnStatus === 'Custom') {
      let rfqId = this.rfqId;
      let contactId= 0;
      let rfqNDAType = 'Custom'; 
      let rfqNDALevel = '3' ;
      let rfqNDAStatus = 'All' ;
      this.getNDAListAsPerTab(rfqNDAType, rfqNDALevel,rfqNDAStatus, rfqId, contactId);  
    }  else if (this.tabBtnStatus === 'Declined') {
      let rfqId = this.rfqId;
      let contactId= 0;
      let rfqNDAType = 'Declined'; 
      let rfqNDALevel = '3' ;
      let rfqNDAStatus = 'Declined' ;
      this.getNDAListAsPerTab(rfqNDAType, rfqNDALevel,rfqNDAStatus, rfqId, contactId);  
    }
  }

  selectAll() {
    this.chkBoxCountArr = [];
    this.selectedRowCount = 0;
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].selected = this.selectedAll;
      this.chkBoxCountArr = this.items.filter(x => x.selected === true);
      this.selectedRowCount = this.chkBoxCountArr.length;
      if (this.selectedRowCount > 0) {
        this.activeTopBtns = true;
      } else {
        this.activeTopBtns = false;
      }
      this.selectedRowCountTxt = this.selectedRowCount + ' selected';
    }
  }
  sortOnContactName() {
    if ( this.toggleManufacturer ) {
      this.items.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else {
      this.items.sort((a, b) => b.companyName.localeCompare(a.companyName));
    }
    this.toggleManufacturer = !this.toggleManufacturer;
  }
  checkIfAllSelected() {
    this.chkBoxCountArr = this.items.filter(x => x.selected === true);
    this.selectedRowCount = this.chkBoxCountArr.length;

    if (this.chkBoxCountArr.length >= 2) {
      this.activeTopBtns = true;
      this.selectedRowCountTxt = this.selectedRowCount + ' selected';
    } else {
      this.activeTopBtns = false;
      this.selectedRowCountTxt = '';
    }
    this.selectedAll = this.items.every(function(item: any) {
      return item.selected === true;
    });
  }

  sortedManifacturerList(status: string) {
    this.tabBtnStatus = status;
    // console.log(status);
   // this.iCompanyViewFilteredModelColl = [];
    // if (status === 'all') {
    //   this.iCompanyViewFilteredModelColl = this.iCompanyViewModelColl;
    // }
    // if (status === 'approved') {
    //   this.iCompanyViewFilteredModelColl = this.iCompanyViewModelColl.filter(
    //     x => x.messageStatusToken === 'ACCEPTED'
    //   );
    // }
    // if (status === 'denied') {
    //   this.iCompanyViewFilteredModelColl = this.iCompanyViewModelColl.filter(
    //     x => x.messageStatusToken === 'DECLINED'
    //   );
    // }
    this.getManufacturer();
    this.items = this.iCompanyViewFilteredModelColl;
    this.totalRecordCount = this.items.length;
    if (this.totalRecordCount === 0) {
      this.iManifacturerAvailable = true;
    } else {
      this.iManifacturerAvailable = false;
    }
  }
  openSidePanel(contactId, fromContName, messageRFQId, messageId?) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
      return;
    } 
    this.selectedRFQMsgId = messageId;
    if (this.activeTopBtns === true && contactId === '' || contactId === undefined ) {
      this._rfqService.set(false, 'supplierProfileDrawer');
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'messageRfq');
      this._rfqService.set(this.chkBoxCountArr, 'selectContactIdsForMEessage');
      this._rfqService.set(false, 'messageFromMessage');
      this._rfqService.set(true, 'messageFromNda');
      this._rfqService.set(this.rfqId, 'selectContactRFQId');
     }
     if (this.activeTopBtns === false && (contactId !== '' || contactId !== undefined)) {
        this._rfqService.set(false, 'supplierProfileDrawer');
        this._rfqService.set(true, 'showSidePanel');
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(false, 'messageFromMessage');
        this._rfqService.set(contactId, 'selectContactIdsForMEessage');
        this._rfqService.set(true, 'messageFromNda');
        this._rfqService.set(messageRFQId, 'selectContactRFQId');
        this._rfqService.set(fromContName, 'nameOfBuyer');
      }
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  approveDeclineAction(status: string, contactIdData, isNDAToApproveAll) {
    this.contactIdsArr = [];
    this.iRfqMessageViewModelFun();
    if(contactIdData === 0) {
      for (let i = 0; i < this.chkBoxCountArr.length; i++) {

        this.ndaApproveContactsRFQsList ={
          contactId:0,
           rfqId:0
          }

          this.ndaApproveContactsRFQsList.contactId=this.chkBoxCountArr[i].contactId;
          this.ndaApproveContactsRFQsList.rfqId=this.rfqId;
          this.IMessagesViewModel.nDAApproveContactsRFQsLists.push(this.ndaApproveContactsRFQsList)
      }

    } else {
      this.ndaApproveContactsRFQsList ={
        contactId:contactIdData,
         rfqId:this.rfqId
        }
        this.IMessagesViewModel.nDAApproveContactsRFQsLists.push(this.ndaApproveContactsRFQsList)

    }
    // if (contactIdData === 0) {
    //   for (let i = 0; i < this.chkBoxCountArr.length; i++) {
    //     let isPresent = this.contactIdsArr.find(x=>x == this.chkBoxCountArr[i].contactId);
    //     if(isPresent) {
    //      console.log('tocontact' ,isPresent);
    //     } else {
    //       this.contactIdsArr.push(this.chkBoxCountArr[i].contactId);
    //     }
    //   }
    // } else {
    //   this.contactIdsArr.push(contactIdData);
    // }

    this.IMessagesViewModel.rfqId = this.rfqId;
    this.IMessagesViewModel.toContactIds = this.contactIdsArr;
    this.IMessagesViewModel.messageStatus = status;
    this.IMessagesViewModel.fromCont = this.loggedId;
    this.IMessagesViewModel.toCont = contactIdData;
    this.IMessagesViewModel.pageName = 'component\rfq\rfq-detail\components\rfq-nda\rfq-nda.component.ts';
    this.IMessagesViewModel.messageTypeId = 2 ;
    this.IMessagesViewModel.messageDate = new Date();
    this.IMessagesViewModel.isNDAToApproveAll = isNDAToApproveAll;
    this.IMessagesViewModel.toRFQIds.push(this.rfqId);

    this._rfqService
      .manufacturerApproveDecline(this.IMessagesViewModel)
      .subscribe(
        result => {
          if (result.result === true) {
            this._toastr.success(result.errorMessage);
            this.getManufacturer();
            this.activeTopBtns = false;
            this.selectedAll = false;
            this.selectedRowCountTxt = '';
          } else {
            this._toastr.error(result.errorMessage);
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
  }
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  isMessageRfqPanel () {
    return this._rfqService.get('messageRfq');
  }
  openMenufacturerDrawer(contactId, contactName, companyName) {
    this._rfqService.set(false, 'messageRfq');
    // this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'transferRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(contactName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 100);
   }


  //  isModelShow() {
  //   return this._rfqService.get('isModelShow');
  //   }
    IsNpsdataback() {
      if(this._rfqService.get('ismyrfqdataback') === true) {
        // this.isApiRes = true;
        this._rfqService.set(false,'ismyrfqdataback');
        this.getManufacturer();
      }
    }
    /* This function is used to reload page after message sent */
    reloadMessages() {
      if (this._rfqService.get('messageSentFromRfq')) {
        this._rfqService.set(false, 'messageSentFromRfq');
        this.selectedRowCount = 0;
        this.selectedRowCountTxt = '';
        this.selectedAll = false;
        this.activeTopBtns = false;
        this.getManufacturer();
      }
    }
}
