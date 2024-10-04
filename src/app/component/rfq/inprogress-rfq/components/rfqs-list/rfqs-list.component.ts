import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { IBuyerFilteredRfqViewModel, IPartsViewModel, IRfqFilterListModel } from '../../../../../core/models/rfqModel';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { RfqService } from './../../../../../core/services/rfq/rfq.service';
import { ProductAnalyticService } from './../../../../../../app/shared/product-analytic/product-analytic';

@Component({
  selector: 'app-rfqs-list',
  templateUrl: './rfqs-list.component.html',
  styleUrls: ['./rfqs-list.component.scss'],
  providers: [ConfirmationService]
})
export class RfqsListComponent implements OnInit {

  iRFQViewModelColl: IRfqFilterListModel[];
  iFilteredRFQViewModelColl: IRfqFilterListModel[];

  iPartsViewModelColl: IPartsViewModel[];
  totalPartArray: any;
  msgs: string;
  currentRfqId: number;

  // variable Declarations
  public rfqId: any;
  cloneRfqId: number;
  cloneContactId: number;
  display: boolean;
  isDelete: boolean;
  btnCancelText: string;
  btnSaveText: string;
  isClone: boolean;
  isCencel: boolean;
  showSidePanel = false;
  isTilesView: boolean;
  isGridView: boolean;
  searchFilterValue: string;
  stateFilterValue: number;
  cloneRfqName: string;
  sortFilterValue: string;
  isLoader: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  totalPartAdded: number;
  defaultAwsPath = '';
  loggedId: number;

  // variable Declarations ends
  iBuyerFilteredRfqViewModel: IBuyerFilteredRfqViewModel;
  pageSize: number;
  currentIndex: number;
  pagesIndex: number[];
  pageNumber: number;
  pageStart: number;
  pages: number;
  totalRow: number;

  constructor(private _ProfileService: ProfileService, private _rfqService: RfqService, private _toastr: ToastrService, private confirmationService: ConfirmationService, private router: Router,
    private productAnalyticService: ProductAnalyticService) {
    this.isTilesView = true;
    this.isRfqAvailable = false;
    this.msgs = '';
    this.searchFilterValue = '';
    this.stateFilterValue = 0;
    this.totalPartArray = [];
    this.totalPartAdded = 0;
    this.isDelete = false;
    this.display = false;
    this.isClone = false;
    this.isCencel = false;
    this.cloneRfqId = 0;
    this.setloggedId();
    this.cloneContactId = 0;
    this.currentRfqId = 0;
  }

  ngOnInit() {
    this.productAnalyticService.initializPendo(this.productAnalyticService.QUOTES_RFQ_LIST);
    this.sortFilterValue = '1';
    this.stateFilterValue = 9;
    this.iBuyerFilteredRfqViewModel = {
      contactId: this.loggedId,
      companyId: this.loggedCompanyId,
      rfqType: this.stateFilterValue,
      currentDate: moment().format(),
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: 'rfq_id',
      more_records: false,
      isArchived: false,
    };
    this.pageSize = 24;
    this.currentIndex = 1;
    this.pageNumber = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.totalRow = 0;
    this.getRfqList();
  }

  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
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
  getRfqList() {
    this.isLoader = true;
    this.iFilteredRFQViewModelColl = [];
    this._rfqService.getRfqList(this.iBuyerFilteredRfqViewModel).subscribe(
      result => {
        this.iRFQViewModelColl = result.data;
        window.scrollTo(0, 0);
        if (this.iRFQViewModelColl.length !== 0) {      
          this.isRfqAvailable = false;   
        } else {
          this.isRfqAvailable = true;
        }    
        this.totalRow = result.totalRecords;
        this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;   
        for (let rfq in  this.iRFQViewModelColl) { 
          this.iFilteredRFQViewModelColl[rfq].rfqPercent=this.getRfqPercentageNo(this.iRFQViewModelColl[rfq].rfqId)
        }
       this.isLoader = false; 
       this.init();
      },
      error => {
        window.scrollTo(0, 0);
        this._rfqService.handleError(error);
        this.isRfqAvailable = true;
      },
      () => { }
    );
  }

  cancelRfq(id) {
    this.isCencel = true;
    this.isDelete = false;
    this.btnCancelText = 'Ignore Cancellation';
    this.btnSaveText = ' Cancel RFQ';
    this.confirmationService.confirm({
      message: "Are you sure you want to cancel this RFQ? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to cancel this RFQ?",
      header: 'Cancel RFQ',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', id, this.loggedId).subscribe(
          result => {
            if (result['result'] === true) {
              this.getRfqList();
              this._toastr.success(result['errorMessage'], '');
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
  deleteRfq(id) {
    this.isDelete = true;
    this.isCencel = false;
    this.btnCancelText = 'Cancel';
    this.btnSaveText = ' Delete RFQ';
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this RFQ, all data will be permanently removed. Would you like to delete this RFQ?',
      header: 'Delete RFQ',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DELETED', id, this.loggedId).subscribe(
          result => {
            if (result['result'] === true) {
              this.getRfqList();
              this._toastr.success(result['errorMessage'], '');
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
  cloneRfq(RfqIdT, contactIdT) {
    this.cloneRfqId = RfqIdT;
    this.display = true;
    this.cloneContactId = contactIdT;
  }


  // List functions

  stateFilter() {
    this.currentIndex = 1;
    this.pages = 3;
    this.iBuyerFilteredRfqViewModel.searchText = this.searchFilterValue;
    this.iBuyerFilteredRfqViewModel.rfqType = this.stateFilterValue;
    this.iBuyerFilteredRfqViewModel.pageNumber = 1;
    this.iBuyerFilteredRfqViewModel.pageSize = this.pageSize;

    this.getRfqList();
  }

  filterAll() {
    this.currentIndex = 1;
    this.pages = 3;
    this.iBuyerFilteredRfqViewModel.rfqType = this.stateFilterValue;
    this.iBuyerFilteredRfqViewModel.pageNumber = 1;
    this.iBuyerFilteredRfqViewModel.pageSize = this.pageSize;
    this.iBuyerFilteredRfqViewModel.searchText = this.searchFilterValue;
    switch (this.sortFilterValue) {
      case '1': {
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_id';
        this.iBuyerFilteredRfqViewModel.isOrderByDesc = true;
        break;
      }
      case '2': {
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_id';
        this.iBuyerFilteredRfqViewModel.isOrderByDesc = false;
        break;
      }
      case '3': {
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_name';
        this.iBuyerFilteredRfqViewModel.isOrderByDesc = false;
        break;
      }
      case '4': {
        this.iBuyerFilteredRfqViewModel.orderBy = 'rfq_name';
        this.iBuyerFilteredRfqViewModel.isOrderByDesc = true;
        break;
      }
    }
    this.getRfqList();
  }

  // List Functions Ends

  // Extra Small Utility Functions
  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.msgs = 'true';
      },
      reject: () => {
        this.msgs = 'false';
      }
    });
  }
  openSidePanel() {
    this.rfqId = this._rfqService.get('rfqId');
    this.showSidePanel = true;
  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }
  openPartDetails(id) {
    this.currentRfqId = id;
    localStorage.setItem('isDraftPage', 'true');
    this._rfqService.set(id, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'rfqDetailDrawer');
    setTimeout(() => {
      const elmnt = document.getElementById(id);
      elmnt.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    }, 1000);
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
  editRfq(rfqObj) {
    localStorage.setItem('EditRfqId', rfqObj.rfqId);
    localStorage.setItem('EditRfqName', rfqObj.rfqName);
    //this.router.navigate(['/rfq/editrfq']);
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      const encryptedRfqID = this._ProfileService.encrypt(rfqObj.rfqId);
      if(rfqObj.rfqFormVersion==2 && rfqForm2Enabled){
        this.router.navigate(['/rfq/buyer'], { queryParams: { rfqId: encryptedRfqID } });      
        return;
      }
      this.router.navigate(['/rfq/editrfq'], { queryParams: { rfqId: encryptedRfqID } });
    });
  }
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }

  setloggedId() {
    this.loggedId = parseInt(localStorage.getItem('LoggedId'));
  }

  getRfqPercentageNo(rfqId: number) {
    const RFq = this.iRFQViewModelColl.find(x => x.rfqId === rfqId);
    const RfqName = RFq.rfqName;

    const PartsAdded = RFq.partCount;
    const RfqDetails = RFq.awardDate;
    let totalPersentage = 0;
    if (RfqName !== '') {
      totalPersentage = totalPersentage + 25;
    }
    if (PartsAdded !== 0) {
      totalPersentage = totalPersentage + 25;
    }
    if (RfqDetails !== null && RfqDetails !== undefined) {
      totalPersentage = totalPersentage + 25;
    }
    return totalPersentage
  }
  // Extra Small Utility Functions End
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = '';
    }
    this.stateFilter();
  }
  onSearch() {
    if (this.searchFilterValue) {
      this.stateFilter();
    }
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.stateFilter();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.stateFilter();
    }
  }

  /* Pagination */
  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  refreshItems() {
    this.pagesIndex = this.fillArray();
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
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.iBuyerFilteredRfqViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }
}
