import {
  Component,
  OnInit
} from '@angular/core';
import {
  RfqService
} from './../../../core/services/rfq/rfq.service';
import {
  IRFQViewModel
} from '../../../core/models/rfqModel';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Router
} from '@angular/router';
import {
  ConfirmationService
} from 'primeng/api';
import {
  ICountryViewModel
} from '../../../core/models/globalMaster';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  AccountService
} from '../../../core/services/account/account.service';
import {
  IcompanyCertificateViewModel
} from '../../../core/models/supplierProfileModel';
import {
  SupplierService
} from '../../../core/services/supplier/supplier.service';
import {
  LikeUnlikeManufacturerRequestModel,
  SupllierViewProfileViewModel
} from '../../../core/models/supplierModel';
import {
  IFollowContactViewModel
} from '../../../core/models/settingsModel';
import {
  IViewProfileFilterViewModel
} from '../../../core/models/accountModel';
import { BuyerService } from '../../../core/services/buyer/buyer.service';
@Component({
  selector: 'app-supplier-views',
  templateUrl: './supplier-views.component.html',
  styleUrls: ['./supplier-views.component.scss'],
  providers: [ConfirmationService]
})
export class SupplierViewsComponent implements OnInit {
  // Variable Declaration
  isRfqAvailable: boolean;
  isInProgRfqAvailable: boolean;
  public rfqId: any;
  iRFQViewModelColl: IRFQViewModel[];
  isCreateRFQBodyBtnDisabled = false;
  isRFQInProgBodyBtnDisabled = false;
  toggleNoRFQBodyBtn = true;
 
  iSupplierViewModel: SupllierViewProfileViewModel[];
  items: SupllierViewProfileViewModel[];
  iFilteredRFQViewModelColl: IRFQViewModel[];
  iCountryModel: ICountryViewModel[];
  iCertificateList: IcompanyCertificateViewModel;
  iFollowContactViewModel: IFollowContactViewModel;
  iViewProfileFilterViewModel: IViewProfileFilterViewModel;

  msgs: string;
 
  // variable Declarations

  processsettings = {};
  materialsettings = {};
  certificatesettings = {};
  countrySettings = {};
  isDelete: boolean;
  isCencel: boolean;
  searchFilterValue: string;
  manufactureFilterValue: string;
  countryFilterValue: string;

  isLoader: boolean;
  activeStatusFilterBtn: string;
  defaultAwsPath = '';
  expanded = false;
  deletedCompanyIds: number[];
  /* pagination variables start */
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  totalRow: number;
  pagesIndex: Array < number > ;
  isDatePupupShow: boolean;
  FirstDate: Date;
  SecondDate: Date;
  displayFirstDate: any;
  displySecondDate: any;
  displaydate: any;
  isTilesView: boolean;
  isGridView: boolean;
  selectSort: any;
  /* pagination variables end */

  // variable Declarations ends
  isFollowClick: boolean = false;
  likeUnlikeManufacturerRequestModel: LikeUnlikeManufacturerRequestModel;
  buyerEmail: string = '';
  rfqForm2Enabled=false;
  selectedManufacture=[];
  selectedTerritoryId={};
  constructor(private _rfqService: RfqService, private _toastr: ToastrService, private confirmationService: ConfirmationService,
    private router: Router, private mService: MasterService, private sService: SupplierService, private _accountService: AccountService, private bService: BuyerService) {
    this.isTilesView = true;
    this.isGridView = false;
    this.displaydate = 'Select Date Range';
    this.selectSort = '0';
  }
  ngOnInit() {
    this.selectedManufacture=[];
    this._rfqService.getConfigCatData().subscribe(rfqForm2Enabled=>{
      this.rfqForm2Enabled=rfqForm2Enabled;
    })
    this._rfqService.set(0, 'editRfqId');
    this._rfqService.set('', 'editRfqName');
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'rfqId');
    localStorage.setItem('detailRfqId', '0');
    this._rfqService.set(false, 'B-rfq-d-is-SupProfile');

    // list component

    this.isDelete = false;
    this.isCencel = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.manufactureFilterValue = '';
    this.searchFilterValue = '';
    this.countryFilterValue = '0';
    this.activeStatusFilterBtn = 'all';
    this.msgs = '';
    this.isCreateRFQBodyBtnDisabled = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.deletedCompanyIds = [];
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      rfqId: 0,
      result: true,
      isFollow: null,
      bookType: ''
    };
    this.iViewProfileFilterViewModel = {
      companyId: 0,
      contactId: 0,
      fromDate: null,
      toDate: null,
      pageSize: 24,
      pageNumber: 1,
    };
    // list component
    this.getManufactureList();
    this.isDatePupupShow = false;
    if (this.isRfqAvailable) {
      this.init();
    }
    this._rfqService.set(true, 'setCreateRFQFlag');
    this.buyerEmail = localStorage.getItem('User2');
  }
 
  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get LoggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  isSupplierProfileDrawer() {
    return this._rfqService.get('supplierProfileDrawer');
  }
  isMessageDrawer() {
    return this._rfqService.get('messageRfq');
  }
  checkRFQFlag() {
    return this._rfqService.get('setCreateRFQFlag');
  }
  // utility functions

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }

  // list component
  arrayColumn(array, columnName) {
    return array.map(function (value, index) {
      return value[columnName];
    });
  }
  removeContact(companyId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this contact from your list?',
      header: 'Remove Contact',
      icon: null,
      accept: () => {
        this.deletedCompanyIds.push(companyId);
        this.iSupplierViewModel = this.iSupplierViewModel.filter(x => x.companyId !== (companyId));
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }
  setStatusFilter(btnStatus) {
    this.activeStatusFilterBtn = btnStatus;
  }

  goBack() {
    this._rfqService.set(0, 'ViewSupplierProfileId');
    this._rfqService.set(' ', 'ViewSupplierProfileName');
    this._rfqService.set(false, 'B-rfq-d-is-SupProfile');
  }
  getManufactureList() {
    this.isLoader = true;
    // console.log('firstdate', this.FirstDate);
    if (!isNaN(this.loggedCompanyId) && this.loggedCompanyId !== 0) {
      this.iViewProfileFilterViewModel.companyId = this.loggedCompanyId;
      this.iViewProfileFilterViewModel.contactId = this.LoggedId;
      if (!this.FirstDate && !this.SecondDate && this.displaydate === 'Select Date Range' && this.selectSort === '0') {
        this.iViewProfileFilterViewModel.fromDate = null;
        this.iViewProfileFilterViewModel.toDate = null;
      }
      this.iSupplierViewModel = [];
      this._accountService.GetContactsProfileViewList(this.iViewProfileFilterViewModel).subscribe(
        result => {
          if (result['totalRecords'] !== 0) {
            this.iSupplierViewModel = result['data'];
            window.scrollTo(0, 0);
            this.totalRow = result['totalRecords'];
            if (this.iSupplierViewModel.length !== 0) {
              this.isLoader = false;
              this.isRfqAvailable = false;
            } else {
              this.iSupplierViewModel = null;
              this.isLoader = false;
              this.isRfqAvailable = false;
            }
            this.init();
          } else {
            this.iSupplierViewModel = [];
            this.isLoader = false;
            this.isRfqAvailable = true;
          }
        },
        error => {
          this.isLoader = false;
          this.isRfqAvailable = true;
          this._rfqService.handleError(error);
        },
        () => {}
      );
    } else {
      this.iSupplierViewModel = [];
      this.isLoader = false;
      this.isRfqAvailable = true;
    }
  }
  filterAll() {
    this.currentIndex = 1;
    this.pages = 3;
    this.iViewProfileFilterViewModel.contactId = this.loggedId;
    this.iViewProfileFilterViewModel.pageSize = this.pageSize;
    this.iViewProfileFilterViewModel.pageNumber = 1;
    this.pageStart = 1;
    this.getManufactureList();
  }
  toggleManufactureSelctionForRFQ(event, manufacture) {
    if (event.target.checked) {
      this.selectedTerritoryId[manufacture.territoryId]=true;  
      if(Object.keys(this.selectedTerritoryId).length>3){
        delete this.selectedTerritoryId[manufacture.territoryId];
        event.target.checked=false;
        this._toastr.warning("You can only select from up to three manufacturing locations when sending RFQs directly");
        return;
      }
      this.selectedManufacture.push(manufacture);
    }else{
      this.selectedManufacture=this.selectedManufacture.filter(ele=>{ 
        return ele.companyId!=manufacture.companyId;
      });
      this.selectedTerritoryId=[];
      this.selectedManufacture.forEach(manufacture=>{ 
      this.selectedTerritoryId[manufacture.territoryId]=true;   
      });
    }
  }
  createRfq(){
    let selectedSupplier=[];
    this.selectedManufacture.forEach(ele=>{
      selectedSupplier.push({
      companyId:ele.companyId,
      territoryId:ele.territoryId });
    });
    this.redirectToCreateRFQ(selectedSupplier);
  }
  redirectToCreateRFQ(selectedSupplier){
    const queryParams = {
      queryParams:{
        suppliers: this._rfqService.encrypt(JSON.stringify(selectedSupplier))}
      };
    this.router.navigate(["/rfq/buyer"], queryParams ); 
  }
  sendToCreateRFQ(companyId,companyName,territoryId) {
    if(this.rfqForm2Enabled){
      const suppliers=[{companyId:companyId,companyName:companyName,territoryId:territoryId}];
     return this.redirectToCreateRFQ(suppliers);
    } 
    localStorage.setItem('manufactureId', JSON.stringify([{id:companyId,name:companyName}]));
    this.router.navigate(['/rfq/editrfq']);
  }
  getCapability(capabilityList) {
    const tempCapabilityArray = [];
    for (let index = 0; index < 4 && index < capabilityList.length; index++) {
      if (capabilityList[index].childDisciplineName !== '' && capabilityList[index].childDisciplineName !== null && capabilityList[index].childDisciplineName !== undefined) {
        tempCapabilityArray.push(capabilityList[index].childDisciplineName);
      } else {
        tempCapabilityArray.push(capabilityList[index].parentDisciplineName);
      }
    }
    if (tempCapabilityArray.length > 0) {
      const stingLen = tempCapabilityArray.join(', ');
      if (stingLen.length > 45) {
        return tempCapabilityArray.join(', ').slice(0, 45) + '...';
      } else {
        return tempCapabilityArray.join(', ');
      }
    } else {
      return 'N/A';
    }
  }
  getCertificate(capabilityList) {
    const tempCapabilityArray = [];
    for (let index = 0; index < 4 && index < capabilityList.length; index++) {
      tempCapabilityArray.push(capabilityList[index].certificateCode);
    }
    if (tempCapabilityArray.length > 0) {
      const stingLen = tempCapabilityArray.join(', ');
      if (stingLen.length > 45) {
        return tempCapabilityArray.join(', ').slice(0, 45) + '...';
      } else {
        return tempCapabilityArray.join(', ');
      }
    } else {
      return 'N/A';
    }
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
      event.stopPropagation();
      if (!!contactId) {
        this._rfqService.set(false, 'messageRfq');
        setTimeout(() => {
          this._rfqService.set(true, 'showSidePanel');
          this._rfqService.set(true, 'messageRfq');
          this._rfqService.set(false, 'supplierProfileDrawer');
          this._rfqService.set(contactId, 'selectContactIdsForMEessage');
          this._rfqService.set(messageRFQId, 'selectContactRFQId');
          this._rfqService.set(fromContName, 'nameOfBuyer');
        }, 100);
      } else {
        this._toastr.error('Contact ID is not provided', 'Error!');
      }
      setTimeout(() => {
        const elmnt = document.getElementById(contactId);
        elmnt.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        });
      }, 2000);
    }
  }
  openMenufacturerDrawer(contactId, contactName, companyId, followcontactId, companyName) {
    this._rfqService.set(false, 'messageRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(companyName, 'quoteContactName');
      this._rfqService.set(companyId, 'supplierCompanyId');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 1000);
    setTimeout(() => {
      const elmnt = document.getElementById(followcontactId);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 2000);
  }

  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.iViewProfileFilterViewModel.pageNumber = this.currentIndex;
    this.getManufactureList();
  }
  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iViewProfileFilterViewModel.pageNumber = this.currentIndex;
    this.getManufactureList();
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
    this.iViewProfileFilterViewModel.pageNumber = this.currentIndex;
    this.getManufactureList();
  }
  ChangeinputLength() {
    this.pageSize = this.inputLength;
    this.init();
  }
  refreshItems() {
    if (this.iSupplierViewModel) {
      this.items = this.iSupplierViewModel.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
      this.pagesIndex = this.fillArray();
    }
  }
  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  // API Call Function
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
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
    this.isCreateRFQBodyBtnDisabled = true;
  }
  onRFQInProgBodyClick() {
    this.isRFQInProgBodyBtnDisabled = true;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'supplierProfileDrawer');
  }
  // API Call Function End
  // isSidePanel() {
  //   return this._rfqService.get('showSidePanel');
  // }
  openPartDetails(contactId, contactName) {
    // this._rfqService.set(id, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(contactId, 'quoteContactId');
    this._rfqService.set(contactName, 'quoteContactName');
  }
  isReadyToAward(objAwardDate: Date) {
    const tempCurrDate = (new Date()).toISOString();
    const tempAwardDate = (new Date(objAwardDate)).toISOString();
    return tempAwardDate < tempCurrDate;
  }
  detailRfq(id, Name) {

    // localStorage.setItem('detailRfqId', id);
    // localStorage.setItem('detailRfqId',  id);
    // this.router.navigate(['/rfq/rfqdetail']);
  }


  openDateRage() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageRfq');
    this.isDatePupupShow = true;
    this.selectSort = '0';
    if (this.displaydate === 'Select Date Range') {
      this.FirstDate = null;
      this.SecondDate = null;
      // console.log('firstdateopen', this.FirstDate);
    }
  }
  hidePopup() {
    this.isDatePupupShow = false;
  }
  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }
  openTilesView() {
    this.isTilesView = true;
    this.isGridView = false;
  }

  applyDates() {
    if (this.FirstDate && this.SecondDate) {
      this.displayFirstDate = this.FirstDate.getMonth() + 1 + '/' + this.FirstDate.getDate() + '/' + this.FirstDate.getFullYear();
      this.displySecondDate = this.SecondDate.getMonth() + 1 + '/' + this.SecondDate.getDate() + '/' + this.SecondDate.getFullYear();
      this.displaydate = this.displayFirstDate + '-' + this.displySecondDate;
      const firstmonth = this.FirstDate.getMonth() + 1;
      const secondmonth = this.SecondDate.getMonth() + 1;
      this.iViewProfileFilterViewModel.fromDate = this.FirstDate.getFullYear() + '-' + firstmonth + '-' +
        this.FirstDate.getDate();
      this.iViewProfileFilterViewModel.toDate = this.SecondDate.getFullYear() + '-' + secondmonth + '-' +
        this.SecondDate.getDate();
      this.getManufactureList();
      this.isDatePupupShow = false;
    } else {
      this.getManufactureList();
      this.isDatePupupShow = false;
    }
  }
  clearDate() {
    this.FirstDate = null;
    this.SecondDate = null;
    this.displaydate = 'Select Date Range';
  }
  Changesort() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageRfq');
    this.displaydate = 'Select Date Range';
    this.FirstDate = null;
    this.SecondDate = null;
    if (this.selectSort === 'Year') {
      const todayyear = new Date();
      const lastyear = todayyear.getFullYear() - 1;
      this.iViewProfileFilterViewModel.fromDate = lastyear + '-' + '01' + '-' + '01';
      this.iViewProfileFilterViewModel.toDate = lastyear + '-' + '12' + '-' + '31';
      this.getManufactureList();
    } else if (this.selectSort === 'Week') {
      const lastweekfirstday = new Date();
      const lastweeklastday = new Date();
      lastweeklastday.setTime(lastweeklastday.getTime() - (lastweeklastday.getDay() ? lastweeklastday.getDay() : 7) * 24 * 60 * 60 * 1000);
      lastweekfirstday.setTime(lastweeklastday.getTime() - 6 * 24 * 60 * 60 * 1000);
      const firstmonth = lastweekfirstday.getMonth() + 1;
      const secondmonth = lastweeklastday.getMonth() + 1;
      this.iViewProfileFilterViewModel.fromDate = lastweekfirstday.getFullYear() + '-' + firstmonth + '-' + lastweekfirstday.getDate();
      this.iViewProfileFilterViewModel.toDate = lastweeklastday.getFullYear() + '-' + secondmonth + '-' + lastweeklastday.getDate();
      this.getManufactureList();
    } else if (this.selectSort === 'Month') {
      const date = new Date();
      const month = date.getMonth() - 1;
      const firstDay = new Date(date.getFullYear(), month, 1);
      const lastDay = new Date(date.getFullYear(), month + 1, 0);
      const lastmonth = firstDay.getMonth() + 1;
      this.iViewProfileFilterViewModel.fromDate = firstDay.getFullYear() + '-' + lastmonth + '-' + firstDay.getDate();
      this.iViewProfileFilterViewModel.toDate = lastDay.getFullYear() + '-' + lastmonth + '-' + lastDay.getDate();
      this.getManufactureList();
    } else {
      this.getManufactureList();
    }
  }
  isSupplierProfileView() {
    return this._rfqService.get('B-rfq-d-is-SupProfile');
  }

  reloadPageOnContactdrawerClose() {
    if (this._rfqService.get('ManuViewDrawerDataSaved')) {
      this._rfqService.set(false, 'ManuViewDrawerDataSaved');
      this.getManufactureList();
    }
  }

  isModelShow() {
    return this._rfqService.get('isModelShow');
  }

  unLikeSupplier(companyId, supplierEmail) {
    this.likeUnlikeManufacturerRequestModel = new LikeUnlikeManufacturerRequestModel();
    this.likeUnlikeManufacturerRequestModel = {
      buyerContactId: this.loggedId,
      supplierCompanyId: companyId,
      buyerEmail: this.buyerEmail,
      supplierEmail: supplierEmail,
      isLike: false,
      buyerIpAddress: ''
    }
    this.bService.likeunLikeCommunityManufacturer(this.likeUnlikeManufacturerRequestModel).subscribe(
      result => {
       this._toastr.success('You successfully unliked the supplier', 'success!');
       this.getManufactureList();
      }, error => {
      console.log(error, 'error');
    });
  }
  likeSupplier(companyId, supplierEmail) {
    this.likeUnlikeManufacturerRequestModel = new LikeUnlikeManufacturerRequestModel();
    this.likeUnlikeManufacturerRequestModel = {
      buyerContactId: this.loggedId,
      supplierCompanyId: companyId,
      buyerEmail: this.buyerEmail,
      supplierEmail: supplierEmail,
      isLike: true,
      buyerIpAddress: ''
    }
    this.bService.likeunLikeCommunityManufacturer(this.likeUnlikeManufacturerRequestModel).subscribe(
      result => {
       this._toastr.success('You successfully liked the supplier', 'success!');
       this.getManufactureList();
      }, error => {
      console.log(error, 'error');
    });
  }
}
