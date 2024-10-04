import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { IPartFilterViewModel, IPartLibraryModel } from '../../../../../core/models/partModel';
import { MasterService } from '../../../../../core/services/master/master.service';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.scss'],
  providers: [ConfirmationService]
})
export class PartListComponent implements OnInit {
  showPageDataLoding="hide"
  // Model Instance

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
  iPartLibraryModelColl: IPartLibraryModel[];
  iFilteredPartLibraryModelColl: IPartLibraryModel[];
  items: IPartLibraryModel[];
  chkBoxCountArr: IPartLibraryModel[];
  iPartLibraryModel: IPartLibraryModel;
  selectedRowCount: number;
  selectedAll: boolean;
  activeTopBtns: boolean;
  iPartFilterViewModel: IPartFilterViewModel;
  // variable Declarations ends
  /* pagination variables start */
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  totalRow: number;
  pagesIndex: Array<number>;
  /* pagination variables end */

  constructor(private _rfqService: RfqService, private _toastr: ToastrService,
    private confirmationService: ConfirmationService, private _masterService: MasterService,
    private router: Router) {
    this.isDelete = false;
    this.selectedRowCount = 0;
    this.isCencel = false;
    this.isTilesView = true;
    this.isGridView = false;
    this.isRfqAvailable = false;
    this.activeTopBtns = false;
    this.chkBoxCountArr = [];
    this.isRFQInProgBodyBtnDisabled = false;
    this.stateFilterValue = 'All';
    this.searchFilterValue = '';
    this.sortFilterValue = 'Recent';
    this.activeStatusFilterBtn = 'All';
    this.msgs = '';
    this.isCreateRFQBodyBtnDisabled = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.display = false;
    this.isClone = false;
    this.cloneRfqId = 0;
    this.cloneContactId = 0;
    this.isLoader = true;
    this.totalRow = 50;
    this.iPartFilterViewModel = {
      contactId: 0,
      partType: 'All',
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true
    };
  }
  ngOnInit() {
    this.getPartList();
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
  removeTextValue() {
    if (this.searchFilterValue !== '') {
      this.searchFilterValue = '';
    }
    this.filterAll();
  }
checkSaveRFQ() {
  if ( this._rfqService.get('savePartRFQ') === true ) {
    this._rfqService.set(false, 'savePartRFQ');
    this.filterAll();
  }
}
  setStatusFilter(btnStatus) {
    this.iPartFilterViewModel.partType = btnStatus;
    this.activeStatusFilterBtn = btnStatus;
    this.filterAll();
  }
  filterAll2() {
    this.iPartFilterViewModel.partType = this.stateFilterValue;
    this.filterAll();
  }
  filterAll () {
    this.isLoader = true;
    this.currentIndex = 1;
    this.pages = 3;
    this.iPartFilterViewModel.contactId = this.loggedId;
    if (this.sortFilterValue === 'Recent') {
      this.iPartFilterViewModel.isOrderByDesc = true;
    } else {
      this.iPartFilterViewModel.isOrderByDesc = false;
    }
    if (this.searchFilterValue) {
      this.iPartFilterViewModel.searchText = this.searchFilterValue;
    } else {
      this.iPartFilterViewModel.searchText = '';
    }
    this.iPartFilterViewModel.pageSize = this.pageSize;
    this.iPartFilterViewModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.getPartList();
  }


  getPartList() {
    this.iPartFilterViewModel.contactId =  this.loggedId;
    this.activeTopBtns = false;
    this.isLoader = true;
    this.iFilteredPartLibraryModelColl = [];
    this._masterService.getPartLibraryNew(this.iPartFilterViewModel).subscribe(
      (data: IPartLibraryModel[]) => {
        this.iPartLibraryModelColl = data['data'];
        if (this.iPartLibraryModelColl.length !== 0) {
          this.totalRow = data['totalRecords'];
          ;
          this.iFilteredPartLibraryModelColl = this.iPartLibraryModelColl;
          this.isLoader = false;
          this.isRfqAvailable = false;
          this.init();
        } else {
          this.totalRfq = this.iPartLibraryModelColl.length;
          this.iFilteredPartLibraryModelColl = null;
          this.isLoader = false;
          this.isRfqAvailable = true;
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  checkIfAllSelected() {
    this.chkBoxCountArr = this.iFilteredPartLibraryModelColl.filter(x => x.result === true);
    this.selectedRowCount = this.chkBoxCountArr.length;
    if ( this.chkBoxCountArr.length >= 1 ) {
      this.activeTopBtns = true;
    } else {
      this.activeTopBtns = false;
    }
    this.selectedAll = this.iFilteredPartLibraryModelColl.every(function (
      item: any
    ) {
      return item.selected === true;
    });
  }
  
  createRfq(iPartLibraryModel: IPartLibraryModel=null) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to create an RFQ from the selected parts?',
      header: 'Create RFQ',
      icon: null,
      accept: () => {
        if(iPartLibraryModel!==null){
          this.chkBoxCountArr = [];
          this.chkBoxCountArr.push(iPartLibraryModel);
        }
        this.showPageDataLoding='show';
        this._rfqService.getConfigCatData().subscribe(rfqForm2Enabled=>{
          if(rfqForm2Enabled){
            this._rfqService.creatRfqWithSelectedParts(this.chkBoxCountArr).subscribe(
              result=>{
                this.showPageDataLoding='hide';
                if(!result.isFailed){
                  this.router.navigateByUrl("rfq/buyer?rfqId="+result.rfqId);
                }
            });
          }else{
            this.showPageDataLoding='hide';
            this._rfqService.set(this.chkBoxCountArr, 'selectedPartForRfq');
            this._rfqService.set(true, 'isPartFromLibrary');
            this.router.navigate(['/rfq/editrfq']);
          }
        })
       
      },
      reject: () => {
      }
    });
  }
  deletePart(id) {
    this.isCencel = true;
    this.isDelete = false;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this part?',
      header: 'Delete Part',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._rfqService.deletePartFromLibray(id).subscribe(
          result => {
            if (result['result'] === true) {
              this.isLoader = true;
              this.getPartList();
              this._toastr.success(result['errorMessage'], '');
            } else {
              this._toastr.warning(result.errorMessage, 'Warning!');
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
  openPartDetails(partId , rfqId, rfqPartId) {
    this._rfqService.set(partId, 'currentPartOpendId');
    this._rfqService.set(0, 'currentrfqPartId');
    this._rfqService.set(rfqId, 'currentRFQId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'rfqdetailCalls');
    this._rfqService.setcuOpenPLibId(partId);
    setTimeout(() => {
      const elmnt = document.getElementById( 'R' + partId );
      elmnt.scrollIntoView({behavior: 'auto', block: 'center', inline: 'nearest'});
    }, 1000);
  }

  cloneRfq(RfqIdT, contactIdT) {
    this.cloneRfqId = RfqIdT;
    this.cloneContactId = contactIdT;
    this.display = true;
  }


  // API Call Function End


// Previous button code
prevPage() {
  if (this.currentIndex > 1) {
    this.currentIndex--;
  }
  if (this.currentIndex < this.pageStart) {
    this.pageStart = this.currentIndex;
  }
  this.iPartFilterViewModel.pageNumber = this.currentIndex;
  this.getPartList();
}

// Next Button Code
nextPage() {
  if (this.currentIndex < this.pageNumber) {
    this.currentIndex++;
  }
  if (this.currentIndex >= (this.pageStart + this.pages)) {
    this.pageStart = this.currentIndex - this.pages + 1;
  }
  this.iPartFilterViewModel.pageNumber = this.currentIndex;
  this.getPartList();
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
// periticluar page no selection function
setPage(index: number) {
  this.currentIndex = index;
  this.iPartFilterViewModel.pageNumber = this.currentIndex;
  this.getPartList();
}

refreshItems() {
  this.items = this.iFilteredPartLibraryModelColl.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
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

  onSearch() {
    if ( this.searchFilterValue ) {
      this.filterAll();
    }
  }
  searchByKey(event) {
    if ( event.keyCode === 13) {
      this.filterAll();
    }
  }
  // Extra Small Utility Functions End
  checkSearch(val)  {
    if (!val) {
      this.filterAll();
    }
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

  downloadAllFiles(fileCompArray: string[], isDownload: boolean, partFile) {
    fileCompArray.forEach(element => {
      this.downloadS3File(element, isDownload);
    });
    if (partFile !== '') {
      this.downloadS3File(partFile, isDownload);
    }

  }
}
