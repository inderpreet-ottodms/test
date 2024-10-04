import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import * as moment from 'moment';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductAnalyticService } from '../../../../../../app/shared/product-analytic/product-analytic';
import {
  environment
} from '../../../../../../environments/environment';
import {
  IBuyerFilteredRfqViewModel,
  IRfqFilterListModel,
  ITerritoryClassificationModel
} from '../../../../../core/models/rfqModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
declare const window;
@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.scss'],
  providers: [ConfirmationService]
})
export class RfqListComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  iRFQViewModelColl: IRfqFilterListModel[];

  public rfqId: any;
  cloneRfqId: number = 0;
  manufacturingLocId: any = 0;
  isCloneModel: boolean = false;
  isTilesView: boolean = true;
  isGridView: boolean = false;
  searchFilterValue: string = '';
  stateFilterValue: string = '1';
  sortFilterValue: string = 'Recent';
  isLoader: boolean;
  isRfqAvailable: boolean = false;
  activeStatusFilterBtn: string = 'All';
  currentRfqId: number = 0;
  iBuyerFilteredRfqViewModel: IBuyerFilteredRfqViewModel;
  pages = 4;
  pageSize = 24;
  pageNumber = 1;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  totalRow: number;
  pagesIndex: Array<number>;
  id: any;
  name: any;
  ibuyerLocationColl: ITerritoryClassificationModel[] = [];
  isArchiveSelected: boolean = false;
  selectedAll: boolean;


  constructor(private _rfqService: RfqService, 
    private _toastr: ToastrService, 
    private confirmationService: ConfirmationService, 
    private activeRouter: ActivatedRoute, private router: Router, 
    private _masterService: MasterService, 
    private _ProfileService: ProfileService,
    private productAnalyticService: ProductAnalyticService) { }

  ngOnInit() {
    this.isCloneOpen();
    this.getBuyerLocation();
    this.iBuyerFilteredRfqViewModel = {
      contactId: this.loggedId,
      companyId: this.loggedCompanyId,
      rfqType: 1,
      currentDate: moment().format(),
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: 'rfq_id',
      more_records: false,
      territoryId: 0,
      isArchived: false
    };
    this.activeRouter.queryParams.subscribe(params => {
      if (params['filter'] !== undefined && params['filter'] !== null && params['filter'] !== '') {
        if (params['filter'] === 'Closed') {
          this.iBuyerFilteredRfqViewModel.rfqType = 6;
          this.stateFilterValue = '5';
        } else if (params['filter'] === 'toAwarded') {
          this.iBuyerFilteredRfqViewModel.rfqType = 19;
          this.stateFilterValue = '7';
          this.activeStatusFilterBtn = 'All';
        }
        this.getRfqList();
      }
    });
    this.getRfqList();
  }

  getBuyerLocation() {
    this._masterService.GetTerritoryClassification().pipe(takeUntil(this.destroy$)).subscribe(
      (data2: ITerritoryClassificationModel[]) => {
        if (data2) {
          let index = data2.findIndex(x => x.territoryClassificationId == 0);
          data2.splice(index, 1);
          this.ibuyerLocationColl = data2;
        }
      });
  }

  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }

  openTilesView() {
    this.isTilesView = true;
    this.isGridView = false;
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  getRfqList() {
    this.isLoader = true;
    this.iRFQViewModelColl = [];
    this._rfqService.getRfqList(this.iBuyerFilteredRfqViewModel).pipe(takeUntil(this.destroy$)).subscribe(
      result => {
        this.iRFQViewModelColl = result.data;
        this.isArchiveSelected = false;
        window.scrollTo(0, 0);
        if (this.iRFQViewModelColl.length !== 0) {
          this.totalRow = result.totalRecords;
          this.isLoader = false;
          this.isRfqAvailable = false;
        } else {
          this.totalRow = 0;
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
      () => { }
    );
  }

  cancelRfq(id) {
    this.confirmationService.confirm({
      message: "Are you sure you want to move this RFQ to Draft? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to move this to Draft?",
      header: 'Move to Draft',
      icon: null,
      accept: () => {
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', id, this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(
          result => {
            if (result['result'] === true) {
              this.getRfqList();
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

  setStatus() {
    this.router.navigate(['/rfq/myrfq']);
    if (this.activeStatusFilterBtn === 'All') {
      this.setRfqTypeForAllAndArchived(this.stateFilterValue);
      this.iBuyerFilteredRfqViewModel.isArchived = false;
    }
    else if (this.activeStatusFilterBtn === 'Archived') {  
      this.setRfqTypeForAllAndArchived(this.stateFilterValue);  
      this.iBuyerFilteredRfqViewModel.isArchived = true;
    }
    else if (this.activeStatusFilterBtn === 'Direct') {
     this.setRfqTypeForDirect(this.stateFilterValue);
    } 
    else if (this.activeStatusFilterBtn === 'Deleted') {
      this.iBuyerFilteredRfqViewModel.rfqType = 8;
    }  
    this.filterAll();
  }

  setStatusFilter(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.stateFilterValue = '1';
    this.setStatus();
  }

  setRfqTypeForAllAndArchived(stateFilterValue){
    switch (stateFilterValue) {
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
      case '7':
          this.iBuyerFilteredRfqViewModel.rfqType = 19;
          break;
  }
  }
  setRfqTypeForDirect(stateFilterValue){
    switch (stateFilterValue) {
      case '1':
        this.iBuyerFilteredRfqViewModel.rfqType = 20; 
          break;
      case '3':
        this.iBuyerFilteredRfqViewModel.rfqType = 21;
          break;
      case '6':
        this.iBuyerFilteredRfqViewModel.rfqType = 22;
          break;
      case 'noquotes':
        this.iBuyerFilteredRfqViewModel.rfqType = 23;
          break;
      case 'withquotes':
        this.iBuyerFilteredRfqViewModel.rfqType = 24;
          break;
  }
  }
  filterAll() {
    this.router.navigate(['/rfq/myrfq']);
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
  // Pagination starts
  // Previous button code
  prevPage() {
    this.router.navigate(['/rfq/myrfq']);
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
    this.router.navigate(['/rfq/myrfq']);
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
    this.router.navigate(['/rfq/myrfq']);
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

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }

  currentRfq() {
    return this._rfqService.get('rfqId');
  }

  openPartDetails(id) {
    localStorage.setItem('isDraftPage', 'false');
    this._rfqService.set(id, 'rfqId');
    this.currentRfqId = this._rfqService.get('rfqId');
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

  detailRfq(id) {
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }
  redirectToCreateRfqPage(){
    this._ProfileService.redirectToNewBuyer("rfq/editrfq");
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
  editRfq() {
    const rfq=this.iRFQViewModelColl.find(rfq=>{
      return rfq["rfqId"]===this.id;
    });
    this.redirectToEditRfq(rfq);
  }
  setRfqDetail(id, Name) {
    this.id = id;
    this.name = Name;
  }
  // Extra Small Utility Functions End
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = '';
    }
    this.setStatus();
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.setStatus();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.setStatus();
    }
  }

  redirectToAwad(rfq) {
    localStorage.setItem('quotesTab', 'true');
    localStorage.setItem('quotesAwardedTab', 'true');
    const encryptedRfqID = this._ProfileService.encrypt(rfq.rfqId);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }

  cloneModel(id, manufacturingLocationId, deliveryDate) {
    this.isCloneModel = true;
    this.cloneRfqId = id;
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

  utcDate(date) {
    return moment.utc(date).toDate();
  }

  selectRfqToArchive(opt) {
    if (!opt) {
      this.iRFQViewModelColl.forEach(x => x.isSelected = this.selectedAll);
    }
    let filterData = this.iRFQViewModelColl.filter(x => x.isSelected === true);
    if (filterData.length) {
      this.isArchiveSelected = true;
    } else {
      this.isArchiveSelected = false;
    }
    if (opt) {
      this.selectedAll = this.iRFQViewModelColl.every(function (
        item: any
      ) {
        return item.selected === true;
      });
    }
  }

  setArchive(opt = 1) {
    let rfqIdList = [];
    if(this.id != undefined && this.id !== null && this.id !== 0){
      rfqIdList.push(this.id);
    }
    else{
      let filterData = this.iRFQViewModelColl.filter(x => x.isSelected === true);
      if (filterData.length) {
        rfqIdList = filterData.map(x => x.rfqId);
      }
    }
    if (rfqIdList.length) {
      if(opt){
      this.setArchiveStatusForRfq(rfqIdList);
      }else{
      this.setUnarchiveStatusForRfq(rfqIdList);
      }
    }
  }
  setArchiveStatusForRfq(rfqIdList){
    this._rfqService.setArchiveStatus( rfqIdList, this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(
      response => {
        if (response.result) {
          this._toastr.success(response.errorMessage, 'Success!');
          this.getRfqList();
        } else {
          this._toastr.warning(response.errorMessage, 'Warning!');
        }
        this.id = 0;
      }, error => {
        this.id = 0;
        this._toastr.error('Something went wrong please try later', 'Error!');
      }
    );
  }
  setUnarchiveStatusForRfq(rfqIdList){
    this._rfqService.setUnarchiveStatus( rfqIdList, this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(
      response => {
        if (response.result) {
          this._toastr.success(response.errorMessage, 'Success!');
          this.getRfqList();
        } else {
          this._toastr.warning(response.errorMessage, 'Warning!');
        }
        this.id = 0;
      }, error => {
        this.id = 0;
        this._toastr.error('Something went wrong please try later', 'Error!');
      }
    );
  }

ngOnDestroy() {
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
}
}
