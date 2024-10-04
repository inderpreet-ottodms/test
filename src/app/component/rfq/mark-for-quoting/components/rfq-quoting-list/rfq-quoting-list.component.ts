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
  ConfirmationService
} from 'primeng/api';
import {
  IMarkSupplierRFQViewModel
} from '../../../../../core/models/rfqModel';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
@Component({
  selector: 'app-rfq-quoting-list',
  templateUrl: './rfq-quoting-list.component.html',
  styleUrls: ['./rfq-quoting-list.component.scss'],
  providers: [ConfirmationService]
})
export class RfqQuotingListComponent implements OnInit {

  // Model Instance
  iRFQViewModelColl: IMarkSupplierRFQViewModel[];
  iFilteredRFQViewModelColl: IMarkSupplierRFQViewModel[];
  items: IMarkSupplierRFQViewModel[];
  filteredItems: IMarkSupplierRFQViewModel[];
  msgs: string;
  // Model Instance End

  // variable Declarations
  public rfqId: any;
  cloneRfqId: number;
  cloneContactId: number;
  cloneDeliveryDate: string;
  display: boolean;
  isDelete: boolean;
  isClone: boolean;
  isCencel: boolean;
  isCloneModel: boolean;
  manufacturingLocId: any;
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
  // Pagination variable starts
  pages = 7;
  pageStart = 1;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  inputLength = 24;
  pagesIndex: Array < number > ;
  // Pagination variable ends
  // variable Declarations ends
  defaultAwsPath = '';
  minDate: Date;
  constructor(private _SupplierService: SupplierService, private _rfqService: RfqService,
    private _toastr: ToastrService, private confirmationService: ConfirmationService,
    private router: Router, private _ProfileService: ProfileService) {
    this.isCloneModel = false;
    this.isDelete = false;
    this.isCencel = false;
    this.isTilesView = true;
    this.isGridView = false;
    this.isRfqAvailable = false;
    this.cloneDeliveryDate = '',
      this.isRFQInProgBodyBtnDisabled = false;
    this.stateFilterValue = '';
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
    this.manufacturingLocId = 0;
  }

  ngOnInit() {
    this.isCloneOpen();
    this.configDatePicker();
    this.getRfqList();
  }
  configDatePicker() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }
  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }
  openTilesView() {
    this.isTilesView = true;
    this.isGridView = false;
  }
  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }
  showDialog() {
    this.display = true;
  }

  // API Call Function
  get loggedCompanyId() {
    const Id = localStorage.getItem('loggedCompanyId');
    if (Id) {
      return parseInt(localStorage.getItem('loggedCompanyId'));
    } else {
      return 0;
    }
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  getRfqList() {
    this.isLoader = true;
    if (this.loggedCompanyId !== undefined && this.loggedCompanyId !== null &&
      this.loggedCompanyId !== 0 && !isNaN(this.loggedCompanyId)) {
      this._SupplierService.GetBuyerRFQList(this.loggedId, this.loggedCompanyId, 12).subscribe(
        result => {
          if (result['result'] === true) {
            this.iRFQViewModelColl = result['data'];
            if (this.iRFQViewModelColl.length !== 0) {
              this.totalRfq = this.iRFQViewModelColl.length;
              this.iFilteredRFQViewModelColl=[];
              this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(m => m.rfqStatusId !== 13);
              this.isLoader = false;
              this.setStatusFilter(this.activeStatusFilterBtn);
              this.init();
            } else {
              this.totalRfq = this.iRFQViewModelColl.length;
              this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
              this.init();
              this.isLoader = false;
              this.isRfqAvailable = true;
            }
          } else {
            this.totalRfq = 0;
            this.isLoader = false;
            this.isRfqAvailable = true;
            this.iRFQViewModelColl=[];
            this.iFilteredRFQViewModelColl = [];
            this.init();
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    } else {
      this.iRFQViewModelColl = [];
      this.totalRfq = this.iRFQViewModelColl.length;
      this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
      this.isLoader = false;
      this.isRfqAvailable = true;
    }

  }

  changeInProg(flag) {
    if (flag === true) {
      this.toggleNoRFQBodyBtn = false;
    } else {
      this.toggleNoRFQBodyBtn = true;
    }
  }
  changeCrRFQ(flag) {
    if (flag === true) {
      this.toggleNoRFQBodyBtn = true;
    } else {
      this.toggleNoRFQBodyBtn = true;
    }
  }
  onCreateRFQBodyClick() {
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      if(rfqForm2Enabled){
        this.router.navigateByUrl('/rfq/buyer');      
      }else{
      this.isCreateRFQBodyBtnDisabled = true;
      this.router.navigateByUrl('/rfq/editrfq');
    }
    });

  }
  onRFQInProgBodyClick() {
    this.isRFQInProgBodyBtnDisabled = true;
  }

  cancelRfq(id) {
    this.isCencel = true;
    this.isDelete = false;
    this.confirmationService.confirm({
      message: "Are you sure you want to cancel this RFQ? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to cancel this RFQ?",
      header: 'Move to Draft',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', id, this.loggedId).subscribe(
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
  deleteRfq(id) {
    this.isDelete = true;
    this.isCencel = false;
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
  isvalid() {
    if (this.cloneRfqName !== '' && this.cloneDeliveryDate !== '') {
      return false;
    } else {
      return true;
    }
  }
  cloneRfq(RfqIdT, contactIdT) {
    this.cloneRfqName = '';
    this.cloneDeliveryDate = '';
    this.cloneRfqId = RfqIdT;
    this.cloneContactId = contactIdT;
    this.display = true;
  }

  awardRfq(id) {
    this._toastr.success('Coming soon...', '');
  }


  // API Call Function End

  // List functions
  setStatusFilterTemp(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.getRfqList();
  }

  setStatusFilter(btnState: string) {
    this._rfqService.set(false, 'showSidePanel');
    this.activeStatusFilterBtn = btnState;
    this.iFilteredRFQViewModelColl = [];
    if (this.iRFQViewModelColl.length) {
      this.isLoader = true;
      if (btnState === 'All') {
        this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
      } else if (btnState === 'Active') {
        this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => (x.rfqStatusId === 3) || (x.rfqStatusId === 15));
      } else if (btnState === 'Archived') {
        this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === 13);
      }
    }

    if (this.iFilteredRFQViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
      this.isRFQInProgBodyBtnDisabled = false;
      if (this.stateFilterValue !== '') {
        this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue));
      }
      if (this.stateFilterValue === '') {
        this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl;
      }
      if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
        this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
          x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()));
      }
      if (this.searchFilterValue !== '' && this.stateFilterValue !== '') {
        this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
          x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()));
      }   
      if (this.iFilteredRFQViewModelColl.length === 0) {
        this.isLoader = false;
        this.isRfqAvailable = true;
      } else {
        this.isLoader = false;
        this.isRfqAvailable = false;
        this.isRFQInProgBodyBtnDisabled = false;
        switch (this.sortFilterValue) {
          case 'Recent': {
            this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
            break;
          }
          case 'Oldest': {
            this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
            break;
          }
          case 'A - Z': {
            this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
            break;
          }
          case 'Z - A': {
            this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
            break;
          }
          default: {
            break;
          }
        }
      }
    }
    this.init();
  }

  searchFilter(searchValue: string) {
    this._rfqService.set(false, 'showSidePanel');
    this.isLoader = true;
    this.iFilteredRFQViewModelColl = [];
    if (this.stateFilterValue !== '') {
      this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(
        x => x.rfqName.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        x.rfqId.toString().startsWith(searchValue) &&
        x.rfqStatusId === parseInt(this.stateFilterValue)
      );
    } else {
      this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
        x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()));
    }
    if (this.iFilteredRFQViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
      this.isRFQInProgBodyBtnDisabled = false;
      switch (this.sortFilterValue) {
        case 'Recent': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
          break;
        }
        case 'Oldest': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
          break;
        }
        case 'A - Z': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
          break;
        }
        case 'Z - A': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
          break;
        }
        default: {
          break;
        }
      }
    }
    this.init();
  }

  stateFilter() {
    this._rfqService.set(false, 'showSidePanel');
    this.isLoader = true;
    this.iFilteredRFQViewModelColl = [];
    if (this.stateFilterValue !== '') {
      this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue));
    }
    if (this.stateFilterValue === '') {
      this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
    }
    if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
      this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase()
        .includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()));
    }
    if (this.searchFilterValue !== '' && this.stateFilterValue !== '') {
      this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.filter(x => x.rfqName.toLowerCase()
        .includes(this.searchFilterValue.toLowerCase().trim()) || x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()));
    }
    if (this.iFilteredRFQViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
      this.isRFQInProgBodyBtnDisabled = false;
      switch (this.sortFilterValue) {
        case 'Recent': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
          break;
        }
        case 'Oldest': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
          break;
        }
        case 'A - Z': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
          break;
        }
        case 'Z - A': {
          this.iFilteredRFQViewModelColl = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
          break;
        }
        default: {
          break;
        }
      }
    }
    this.init();
  }
  sortFilter() {
    this._rfqService.set(false, 'showSidePanel');
    this.iFilteredRFQViewModelColl = [];
    switch (this.sortFilterValue) {
      case 'Recent': {
        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
            .sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue) &&
              x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.sort((a, b) => b.rfqCreatedOn.localeCompare(a.rfqCreatedOn));
        } else {

        }
        break;
      }
      case 'Oldest': {

        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
            .sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue) &&
              x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.sort((a, b) => a.rfqCreatedOn.localeCompare(b.rfqCreatedOn));
        } else {

        }
        break;
      }
      case 'A - Z': {
        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => a.rfqName.localeCompare(b.rfqName));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
            .sort((a, b) => a.rfqName.localeCompare(b.rfqName));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue) &&
              x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => a.rfqName.localeCompare(b.rfqName));
        }
        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
        } else {

        }
        break;
      }
      case 'Z - A': {

        if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => b.rfqName.localeCompare(a.rfqName));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
            .sort((a, b) => b.rfqName.localeCompare(a.rfqName));
        }
        if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue) &&
              x.rfqName.toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()) ||
              x.rfqId.toString().toLowerCase().includes(this.searchFilterValue.toLowerCase().trim()))
            .sort((a, b) => b.rfqName.localeCompare(a.rfqName));
        }

        if (this.searchFilterValue === '' && this.stateFilterValue === '') {
          this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
        } else {

        }
        break;
      }
      default: {
        break;
      }
    }
    if (this.iFilteredRFQViewModelColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
      this.isRFQInProgBodyBtnDisabled = false;
    }
    this.init();
  }

  // List Functions Ends

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }

  //   // Extra Small Utility Functions
  openPartDetails(id) {
    localStorage.setItem('isDraftPage', 'false');
    this._rfqService.set(id, 'rfqId');
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
  isReadyToAward(objAwardDate: Date) {
    const tempCurrDate = (new Date()).toISOString();
    const tempAwardDate = (new Date(objAwardDate)).toISOString();
    return tempAwardDate < tempCurrDate;
  }
  detailRfq(id, Name) {
    localStorage.setItem('detailRfqId', id);
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }
  editRfq(id, Name) {
    localStorage.setItem('EditRfqId', id);
    localStorage.setItem('EditRfqName', Name);
    this._rfqService.set(id, 'editRfqId');
    this._rfqService.set(Name, 'editRfqName');
    this.router.navigate(['/rfq/editrfq']);
  }
  // Extra Small Utility Functions End
  // Pagination Function Starts
  init() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.pageNumber = parseInt('' + (this.iFilteredRFQViewModelColl.length / this.pageSize));
    if (this.iFilteredRFQViewModelColl.length % this.pageSize !== 0) {
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
  ChangeinputLength() {
    this.pageSize = this.inputLength;
    this.init();
  }
  refreshItems() { // iFilteredRFQViewModelColl
    this.filteredItems = this.iFilteredRFQViewModelColl;
    this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
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
  // Pagination Function ends
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

  cloneModel(id, manfactureLocationId, deliveryDate) {
    this.isCloneModel = true;
    this.cloneRfqId = id;
    this.cloneDeliveryDate = deliveryDate;
    this.manufacturingLocId = manfactureLocationId;
  }

  isCloneOpen() {
    this._rfqService.getCloneClose().subscribe(res => {

      if (res['text'] === true) {
        this.isCloneModel = false;
        this._rfqService.setCloneClose(false);
      } else {
        this.isCloneModel = false;
      }

    })

  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }
  
}
