import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import * as moment from 'moment';
import {
  ToastrService
} from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ConfirmationService
} from 'primeng/api';
import {
  BuyerMyCompanyRFQRequestViewModel
} from '../../../core/models/rfqModel';
import { ProfileService } from '../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';


@Component({
  selector: 'app-my-company-rfq',
  templateUrl: './my-company-rfq.component.html',
  styleUrls: ['./my-company-rfq.component.scss'],
  providers: [ConfirmationService]
})
export class MyCompanyRfqComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  isRfqAvailable: boolean = false;
  activeStatusFilterBtn: string;
  stateFilterValue: string;
  sortFilterValue: string;
  iBuyerFilteredRfqViewModel: BuyerMyCompanyRFQRequestViewModel = new BuyerMyCompanyRFQRequestViewModel();
  searchFilterValue: string;
  pageSize: number;
  currentIndex: number;
  pagesIndex: number[];
  pageNumber: number;
  pageStart: number;
  pages: number;
  totalRow: number;
  currentRfqId: number;
  isCloneModel: boolean;
  cloneRfqId: number;
  cloneDeliveryDate: any;
  manufacturingLocId: any;
  name: any;
  id: any;
  isCencel: boolean;
  isDelete: boolean;
  isCancleMsg: boolean;
  isConfirmEdit: boolean;
  display: boolean;
  buyerList: any = [];
  buyerFilterValue: any = null;
  iFilteredRFQViewModel: any[];
  iRFQViewModelCol: any;
  isLoader: boolean;
  toggleRFQName: boolean;
  toggleRFQProcess: boolean;
  toggleRFQLocation: boolean;
  toggleBuyerName: boolean;
  toggleRFQCreateDate: boolean;
  toggleRFQCloseDate: boolean;
  toggleRFQStatus: boolean;


  constructor(private _rfqService: RfqService, private router: Router, private confirmationService: ConfirmationService, private _toastr: ToastrService, private _ProfileService: ProfileService ) {}

  ngOnInit() {
    this.isLoader = false;
    this.pageSize = 24;
    this.currentIndex = 1;
    this.pageNumber = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.totalRow = 0;

    this.cloneRfqId = 0;
    this.cloneDeliveryDate = '';
    this.isCloneModel = false;

    this.activeStatusFilterBtn = 'All';
    this.stateFilterValue = '1';
    this.sortFilterValue = 'Recent';
    this.iBuyerFilteredRfqViewModel = {
      contactId: this.loggedId,
      companyId: this.loggedCompanyId,
      rfqType: 1,
      currentDate: moment().format(),
      selectedBuyerId: null,
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: 'rfq_id',
      more_records: false,
      filterBy: ''
    }

    this.toggleRFQName = false;
    this.toggleRFQProcess = false;
    this.toggleRFQLocation = false;
    this.toggleBuyerName = false;
    this.toggleRFQCreateDate = false;
    this.toggleRFQCloseDate = false;
    this.toggleRFQStatus = false;

    this.isCloneOpen();
    this.getBuyerList();
    this.getRfqList();
  }
  getRfqList() {
    this.isLoader = true;
    this.iFilteredRFQViewModel = [];
    this._rfqService.getAllRfqList(this.iBuyerFilteredRfqViewModel).pipe(takeUntil(this.destroy$)).subscribe(
      result => {
        if (result.data !== null) {
          this.iRFQViewModelCol = result.data;
          window.scrollTo(0, 0);
          if (this.iRFQViewModelCol.length !== 0) {
            this.totalRow = result.totalRecords;
            this.iFilteredRFQViewModel = this.iRFQViewModelCol;
            this.isLoader = false;
            this.isRfqAvailable = false;
          } else {
            this.totalRow = 0;
            this.iFilteredRFQViewModel = [];
            this.isLoader = false;
            this.isRfqAvailable = true;
          }
        } else {
          this.totalRow = 0;
          this.iFilteredRFQViewModel = [];
          this.isLoader = false;
          this.isRfqAvailable = true;
        }
        this.init();
      },
      error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
        this.isRfqAvailable = true;
        this.totalRow = 0;
      },
      () => {}
    );
  }
  getBuyerList() {
    this._rfqService.getBuyerList(this.loggedCompanyId).pipe(takeUntil(this.destroy$)).subscribe(
      response => {
        if (!response.isError) {
          this.buyerList = response.data;
        }
      }
    );
  }
  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }
  openPartDetails(id) {
    localStorage.setItem('isDraftPage', 'false');
    this._rfqService.set(id, 'rfqId');
    this.currentRfqId = id;
    this._rfqService.set(true, 'showSidePanel');
    setTimeout(() => {
      const elmnt = document.getElementById(id);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 1000);
  }
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  detailRfq(id) {
    console.log(id, 'id that need to be encrypt')
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.setStatus();
    }
  }
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = '';
    }
    this.setStatus();
  }
  checkSearch(val) {
    if (!val) {
      this.setStatus();
    }
  }
  setStatusFilter(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.stateFilterValue = '1';
    if (btnState === 'All') { 
      this.iBuyerFilteredRfqViewModel.rfqType = 1;   
    } else if (btnState === 'Active') {
      this.iBuyerFilteredRfqViewModel.rfqType = 7;
    } else if (btnState === 'Archived') {
      this.iBuyerFilteredRfqViewModel.rfqType = 8;
    }
    this.filterAll();
  }
  setStatus() {
    if (this.activeStatusFilterBtn === 'All') {
        this.setBuyerRfqTypeForAll();
    } else if (this.activeStatusFilterBtn === 'Active') {
        this.setBuyerRfqTypeForActive();
    } else if (this.activeStatusFilterBtn === 'Archived') {
      this.iBuyerFilteredRfqViewModel.rfqType = 8;
    }
    if (this.buyerFilterValue !== 'null') {
      this.iBuyerFilteredRfqViewModel.selectedBuyerId = parseInt(this.buyerFilterValue);
    } else {
      this.iBuyerFilteredRfqViewModel.selectedBuyerId = null;
    }
    this.filterAll();
  }
  setBuyerRfqTypeForAll(){
    switch (this.stateFilterValue) {
      case '1':
          this.iBuyerFilteredRfqViewModel.rfqType = 1;   
          break;
      case '3':
          this.iBuyerFilteredRfqViewModel.rfqType = 2;
          break;
      case '6':
          this.iBuyerFilteredRfqViewModel.rfqType = 4;
          break;
      case '2':
          this.iBuyerFilteredRfqViewModel.rfqType = 5;
          break;
      case '5':
          this.iBuyerFilteredRfqViewModel.rfqType = 6;
          break;
      case 'noquotes':
          this.iBuyerFilteredRfqViewModel.rfqType = 13;
          break;
      case 'withquotes':
          this.iBuyerFilteredRfqViewModel.rfqType = 14;
          break;
  }
  }
  setBuyerRfqTypeForActive(){
    switch (this.stateFilterValue) {
      case '1':
          this.iBuyerFilteredRfqViewModel.rfqType = 7;
          break;
      case '3':
          this.iBuyerFilteredRfqViewModel.rfqType = 15;
          break;
      case '6':
          this.iBuyerFilteredRfqViewModel.rfqType = 16;
          break;
      case 'noquotes':
          this.iBuyerFilteredRfqViewModel.rfqType = 17;
          break;
      case 'withquotes':
          this.iBuyerFilteredRfqViewModel.rfqType = 18;
          break;
    }
  }
  filterAll() {
    this.currentIndex = 1;
    this.pages = 3;
    this.iBuyerFilteredRfqViewModel.pageNumber = 1;
    this.iBuyerFilteredRfqViewModel.pageSize = this.pageSize;
    this.iBuyerFilteredRfqViewModel.searchText = this.searchFilterValue;
    if (this.sortFilterValue === 'Recent') {
      this.iBuyerFilteredRfqViewModel.isOrderByDesc = true;
      this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_id';
    }
    else if (this.sortFilterValue === 'Oldest') {
      this.iBuyerFilteredRfqViewModel.isOrderByDesc = false;
      this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_id';
    }
    else if (this.sortFilterValue === 'A-Z') {
      this.iBuyerFilteredRfqViewModel.isOrderByDesc = false;
      this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_name';
    }
    else if (this.sortFilterValue === 'Z-A') {
      this.iBuyerFilteredRfqViewModel.isOrderByDesc = true;
      this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_name';
    }
    this.getRfqList();
  }
  cloneModel(id, manufacturingLocationId, deliveryDate) {
    this.isCloneModel = true;
    this.cloneRfqId = id;
    this.cloneDeliveryDate = deliveryDate;
    this.manufacturingLocId = manufacturingLocationId;
  }
  isCloneOpen() {
    this._rfqService.getCloneClose().subscribe(res => {
      if (res['text'] === true) {
        this.isCloneModel = false;
        if (localStorage.getItem('EditRfqId') === '0') {
          this.filterAll();
        }
        this._rfqService.setCloneClose(false);
      } else {
        this.isCloneModel = false;
      }
    })
  }

  editRfq() {
    const rfq=this.iFilteredRFQViewModel.find(rfq=>{
      return rfq["rfqId"]===this.id;
    });
    this.redirectToEditRfq(rfq);

  }
  setRfqDetail(id, Name) {
    this.id = id;
    this.name = Name;
  }
  cancelRfq(id) {
    this.display = false;
    this.confirmationService.confirm({
      message: "Are you sure you want to cancel this RFQ? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to cancel this RFQ?",
      header: 'Move to Draft',
      icon: null,
      accept: () => {
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', id, this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], '');
            } else {
              this._toastr.error(result.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          }
        );
      },
      reject: () => {
      }
    });
  }
  // Pagination starts
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.iBuyerFilteredRfqViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iBuyerFilteredRfqViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }
  init() {
    this.pageNumber = parseInt('' + (this.totalRow / this.pageSize));
    if (this.totalRow % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.iBuyerFilteredRfqViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }

  refreshItems() {
    this.pagesIndex = this.fillArray();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  toggleColumn(tab) {
    switch (tab) {

      case 'rfq_name': {
        this.toggleRFQProcess = false;
        this.toggleRFQLocation = false;
        this.toggleBuyerName = false;
        this.toggleRFQCreateDate = false;
        this.toggleRFQCloseDate = false;
        this.toggleRFQStatus = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleRFQName?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_name';
        this.toggleRFQName = !this.toggleRFQName;
        break;
      }
      case 'rfq_process': {
        this.toggleRFQName = false;
        this.toggleRFQLocation = false;
        this.toggleBuyerName = false;
        this.toggleRFQCreateDate = false;
        this.toggleRFQCloseDate = false;
        this.toggleRFQStatus = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleRFQProcess?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'process';
        this.toggleRFQProcess = !this.toggleRFQProcess;
        break;
      }
      case 'rfq_location': {
        this.toggleRFQName = false;
        this.toggleRFQProcess = false;
        this.toggleBuyerName = false;
        this.toggleRFQCreateDate = false;
        this.toggleRFQCloseDate = false;
        this.toggleRFQStatus = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleRFQLocation?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'location';
        this.toggleRFQLocation = !this.toggleRFQLocation;
        break;
      }
      case 'buyer_name': {
        this.toggleRFQName = false;
        this.toggleRFQProcess = false;
        this.toggleRFQLocation = false;
        this.toggleRFQCreateDate = false;
        this.toggleRFQCloseDate = false;
        this.toggleRFQStatus = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleBuyerName?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'buyer';
        this.toggleBuyerName = !this.toggleBuyerName;
        break;
      }
      case 'rfq_created_date': {
        this.toggleRFQName = false;
        this.toggleRFQProcess = false;
        this.toggleRFQLocation = false;
        this.toggleBuyerName = false;
        this.toggleRFQCloseDate = false;
        this.toggleRFQStatus = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleRFQCreateDate?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_created';
        this.toggleRFQCreateDate = !this.toggleRFQCreateDate;
        break;
      }
      case 'rfq_close_date': {
        this.toggleRFQName = false;
        this.toggleRFQProcess = false;
        this.toggleRFQLocation = false;
        this.toggleBuyerName = false;
        this.toggleRFQCreateDate = false;
        this.toggleRFQStatus = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleRFQCloseDate?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_closed_date';
        this.toggleRFQCloseDate = !this.toggleRFQCloseDate;
        break;
      }
      case 'rfq_status': {
        this.toggleRFQName = false;
        this.toggleRFQProcess = false;
        this.toggleRFQLocation = false;
        this.toggleBuyerName = false;
        this.toggleRFQCreateDate = false;
        this.toggleRFQCloseDate = false;
        this.iBuyerFilteredRfqViewModel.isOrderByDesc=this.toggleRFQStatus?false:true;
        this.iBuyerFilteredRfqViewModel.orderBy = 'status';
        this.toggleRFQStatus = !this.toggleRFQStatus;
        break;
      }
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.iBuyerFilteredRfqViewModel.pageNumber = 1;
    this.getRfqList();
  }
  drawerClose(val) {
    if (val) {
      let rfq = this._rfqService.get('rfqId');
      if (rfq !== null && rfq !== undefined && rfq !== '' && rfq !== 0) {
        setTimeout(() => {
        const elmnt = document.getElementById(rfq);
        elmnt.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        });
      },1000);
      }
    }
  }
  redirectToCreateRfqPage(){
    this._ProfileService.redirectToNewBuyer("/rfq/editrfq");
  }

  redirectToEditRfq(rfqToEdit) {
    const encryptedRfqID = this._ProfileService.encrypt(rfqToEdit.rfqId);
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      if (rfqForm2Enabled && rfqToEdit.rfqFormVersion === 2) {
        this.router.navigate(["/rfq/buyer"], { queryParams: { rfqId: encryptedRfqID }}); 
      }else{
        localStorage.setItem('EditRfqId', rfqToEdit.rfqId);
      localStorage.setItem('EditRfqName', rfqToEdit.rfqName);
      this._rfqService.set(rfqToEdit.rfqId, 'editRfqId');
      this._rfqService.set(rfqToEdit.rfqName, 'editRfqName');
        this.router.navigate(['/rfq/editrfq'], { queryParams: { rfqId: encryptedRfqID }}); 
      }
    });
  }  
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
