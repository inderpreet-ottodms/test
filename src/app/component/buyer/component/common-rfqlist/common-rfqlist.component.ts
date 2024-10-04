import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import * as moment from 'moment';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import {
  ISupplierRFQViewModel,
  IRfqSupplierLikesViewModel,
  ICustomProcessViewModel,
  ICustomSelectionProcessViewModel,
  IsupplierRfqFilterViewModel
} from '../../../../core/models/rfqModel';
import {
  SupplierService
} from '../../../../core/services/supplier/supplier.service';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';
@Component({
  selector: 'app-common-rfqlist',
  templateUrl: './common-rfqlist.component.html',
  styleUrls: ['./common-rfqlist.component.scss']
})
export class CommonRfqlistComponent implements OnInit, OnDestroy {
  @Input() RfqStatus: any;
  rfdIdToSet: any;
  iRfqSupplierLikesViewModel: IRfqSupplierLikesViewModel;
  iRFQViewModelColl: ISupplierRFQViewModel[];
  iFilteredRFQViewModelColl: ISupplierRFQViewModel[];
  items: ISupplierRFQViewModel[];
  filteredItems: ISupplierRFQViewModel[];
  msgs: string;
  // Model Instance End
  isupplierRfqFilterViewModel: IsupplierRfqFilterViewModel;
  totalRow: number;
  // variable Declarations
  display: boolean;
  isTilesView: boolean;
  isGridView: boolean;
  searchFilterValue: string;
  stateFilterValue: string;
  cloneRfqName: string;
  sortFilterValue: string;
  isLoader: boolean;
  isRfqAvailable: boolean;
  pages = 7;
  totalRfq: number;
  pageStart = 1;
  activeStatusFilterBtn: string;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  inputLength = 50;
  pagesIndex: Array<number>;
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iCustomProcessViewModelSelectionColl: ICustomSelectionProcessViewModel[];
  iCustomProcessViewModelSelection: ICustomSelectionProcessViewModel;
  selectedParent: any;
  toggleNoRFQBodyBtn = true;
  iRFQViewModel: ISupplierRFQViewModel;
  defaultAwsPath = '';
  isShowPagination: boolean;
  toggle: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  selectedProcessName: string;
  sortByFilterValue: string;
  Issortby: boolean;
  rfqIdQuote:number=0;
  accountType: string;
  duration: moment.Duration;
  constructor(private _rfqService: RfqService, private _toastr: ToastrService,
    private router: Router,  private _ProfileService: ProfileService,
    private _SupplierService: SupplierService) {
    this.toggle = false;
    this.toggle2 = false;
    this.toggle3 = false;
    this.toggle4 = false;
    this.toggle5 = false;
    this._rfqService.set(0, 'rfqType');
    this.isLoader = true;
    this.Issortby = false;
    localStorage.removeItem('supplierRfqDetailId');
    this._rfqService.set(0, 'currentSupRfqDetailId');
    localStorage.setItem('suppCurrentRfqStatusId', '0');
    localStorage.removeItem('currentiContactViewModel');
    localStorage.removeItem('CurrentRfqAddress');
    this.isRfqAvailable = false;
    this.selectedParent = [];
    this.iCustomProcessViewModelColl = [];
    this.iCustomProcessViewModelSelectionColl = [];
    this.isShowPagination = false;
    this.stateFilterValue = '0';
    this.searchFilterValue = '';
    this.sortFilterValue = 'Recent';
    this.sortByFilterValue = '';
    this.activeStatusFilterBtn = 'All';
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(0, 'rfqId');
    this.iRfqSupplierLikesViewModel = {
      rfqSupplierLikesId: 0,
      rfqId: 0,
      contactId: 0,
      companyId: 0,
      isRfqDisLike: null,
      isRfqLike: null,
      likeDate: null,
      errorMessage: '',
      result: false,
    };
    this.iRFQViewModelColl = [];
    this.initiCustomProcessViewModelSelection();
    this.isupplierRfqFilterViewModel = {
      contactId: this.loggedId,
      companyId: this.loggedCompanyId,
      rfqType: 0,
      processIdList: [],
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      currentDate: moment().format(),
    };
    this.selectedProcessName = 'Select Process';
  }
  initiCustomProcessViewModelSelection() {
    this.iCustomProcessViewModelSelection = {
      schildDisciplineId: 0,
      schildDisciplineName: '',
      sisSelected: false,
      sparentDisciplineId: 0,
      sparentDisciplineName: ''
    };
  }
  ngOnInit() {
    this.accountType = localStorage.getItem('AccountType');
    if (Number(this.RfqStatus) == 8) {
      this.isTilesView = false;
      this.isGridView = true;
    } else {
      this.isTilesView = true;
      this.isGridView = false;
    }
    this.getRfqList();
    this.getProcess();
  }
  utcDate(date) {
    return moment.utc(date).toDate();
  }
  /**
   * @param  {} id
   * @param  {} isRfqLike
   * @param  {} isRfqDisLike
   * This function is used for open rfq detail drawer and also check  capabilities and Region is match or not.
   */
  openSidePanel(id, isRfqLike, isRfqDisLike, rfqStatusId) {
    // for go back button;
    if (rfqStatusId != 2) {
      if (this.RfqStatus == 4) {
        let loggedId = this.loggedId;
        this._rfqService.isRFQDetailAccessible(id, loggedId).subscribe(res => {
          if (res['isError'] === false) {
            let capability = res['data'].isCapabilitiesMatched;
            let region = res['data'].isRegionMatched;
            if (!capability && region) {
              this._toastr.warning('Please update your capabilities to see details', 'Warning!');
            } else if (capability && !region) {
              this._toastr.warning('RFQ#' + id + ' is not another region.', 'Warning!');
            } else if (!capability && !region) {
              this._toastr.warning('Your capabilities and Region do not match with this RFQ!', 'Warning!');
            } else {
              this.opensideDrawerData(id, isRfqLike, isRfqDisLike);
            }

          } else {
            this._rfqService.handleError(res['messages']);
          }
        }, error => {
          this._rfqService.handleError(error);
        });
      } else {
        this.opensideDrawerData(id, isRfqLike, isRfqDisLike);
      }
    } else {
      this._toastr.warning("We're sorry, the RFQ you are trying to view is in 'Draft' status. Please try again later.", "Warning!");
    }
  }

  opensideDrawerData(id, isRfqLike, isRfqDisLike) {
    const data = this.items.find(m => m.rfqId === id);
    localStorage.setItem('suppCurrentRfqName', data.rfqName);
    this._rfqService.set(data.isRfqLike, 'isRfqLike');
    this._rfqService.set(id, 'currentSupRfqDetailId');
    this._rfqService.set(data.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('isRFQDatacommonBack', JSON.stringify(this.isupplierRfqFilterViewModel));
    localStorage.setItem('iCustomProcessViewModelSelectionColl', JSON.stringify(this.iCustomProcessViewModelSelectionColl));
    localStorage.setItem('selectedParent', JSON.stringify(this.selectedParent));
    localStorage.setItem('selectedProcessName', JSON.stringify(this.selectedProcessName));
    if (this.isTilesView === true) {
      localStorage.setItem('isTilesView ', JSON.stringify(this.isTilesView));
    } else {
      localStorage.setItem('isTilesView ', 'false');
    }
    localStorage.setItem('suppCurrentRfqStatusId', '3');

    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(id, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'rfqDetailDrawer');
    this._rfqService.setCurrentOpenRfqId(id);
    this._rfqService.set(isRfqLike, 'isRfqLike');
    this._rfqService.set(isRfqDisLike, 'isRfqDisLike');
    this.scrollElementIntoView(id);
  }
  goBack() {

    let isManufSelectType = localStorage.getItem('isManufSelectType');
    let backToPreviousPage = localStorage.getItem('urlToRedirect');
    localStorage.removeItem('pageName1');
    if ((backToPreviousPage != null && backToPreviousPage.includes("/supplier/supplierRfqDetails")) && isManufSelectType == 'true') {
      localStorage.setItem('isManufSelectType', 'false');
      localStorage.setItem('isNotificationPage', 'false');
      localStorage.setItem('isDashboard', 'false');
      localStorage.setItem('isBack', 'false');
      this.router.navigate(['/supplier/supplierMyRfq']);
    } else {
      localStorage.setItem('isNotificationPage', 'false');
      localStorage.setItem('isBack', 'true');
      // window.history.back();
    }

    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
  }


  /**
   * this all function return true and false based on result it hind the page using angular service
   */
  isMessageRfqPanel() {
    return this._rfqService.get('isBuyerMessage');
  }
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }
  isRfqDrawer() {
    return this._rfqService.get('rfqDetailDrawer');
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }
  isBuyerMiniProfile() {
    return this._rfqService.get('isBuyerMiniProfile');
  }


  /**
   * @param  {} id
   * @param  {} rfqId
   * this function is used to open buyer mini profile drawer.
   */
  showBuyerProfile(id, rfqId) {

    const data = this.items.find(m => m.rfqId === rfqId);
    localStorage.setItem('suppCurrentRfqName', data.rfqName);
    this._rfqService.set(data.isRfqLike, 'isRfqLike');
    this._rfqService.set(id, 'currentSupRfqDetailId');
    this._rfqService.set(data.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('isRFQDatacommonBack', JSON.stringify(this.isupplierRfqFilterViewModel));
    localStorage.setItem('iCustomProcessViewModelSelectionColl', JSON.stringify(this.iCustomProcessViewModelSelectionColl));
    localStorage.setItem('selectedParent', JSON.stringify(this.selectedParent));
    localStorage.setItem('selectedProcessName', JSON.stringify(this.selectedProcessName));
    if (this.isTilesView === true) {
      localStorage.setItem('isTilesView ', JSON.stringify(this.isTilesView));
    } else {
      localStorage.setItem('isTilesView ', 'false');
    }



    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(rfqId, 'rfqId');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMiniProfile');
      this._rfqService.set(id, 'buyerProfileId');
      this._rfqService.setisBuyerNameClicked('true');
    }, 100);
    this.scrollElementIntoView(rfqId);
  }

  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }
  openTilesView() {
    this.isTilesView = true;
    this.isGridView = false;
  }
  // API Call Function
  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  checkIfFollowUnFollowChange() {
    if (this.RfqStatus.toString() === '8') {
      if (this._rfqService.get('followUnFollowChange')) {
        this._rfqService.set(false, 'followUnFollowChange');
        this.getRfqList();
      }
    }
  }

  transform(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({
      key,
      value: groupedCollection[key]
    }));
  }

  addAllToSelection(key) {
    const data = this.iCustomProcessViewModelColl.filter(m => m.parentDisciplineName === key);
    data.forEach(element => {
      this.iCustomProcessViewModelSelection = {
        schildDisciplineId: element.childDisciplineId,
        schildDisciplineName: element.childDisciplineName,
        sisSelected: true,
        sparentDisciplineId: element.parentDisciplineId,
        sparentDisciplineName: element.parentDisciplineName
      };
      const isPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId === this.iCustomProcessViewModelSelection.schildDisciplineId && m.sisSelected === true).length;

      const isParentPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineName === this.iCustomProcessViewModelSelection.sparentDisciplineName && m.sisSelected === true).length;

      if (isPresent === 0 || isParentPresent === 0) {
        this.iCustomProcessViewModelSelectionColl.push(this.iCustomProcessViewModelSelection);
        this.selectedParent = [];
        const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
        this.selectedParent = this.transform(filteredData, 'sparentDisciplineName');
        this.initiCustomProcessViewModelSelection();
      }
    });
    this.selectedProcessName = '';
    this.iCustomProcessViewModelSelectionColl.forEach(element => {
      if (element.sisSelected) {
        if (this.selectedProcessName !== '') {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = this.selectedProcessName + ',' + element.schildDisciplineName;
          } else {
            this.selectedProcessName = this.selectedProcessName + ',' + element.sparentDisciplineName;
          }


        } else {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = element.schildDisciplineName;
          } else {
            this.selectedProcessName = element.sparentDisciplineName;
          }

        }
      }
    });
  }
  addToSelection(id) {
    const data = this.iCustomProcessViewModelColl.find(m => m.childDisciplineId === id);
    this.iCustomProcessViewModelSelection = {
      schildDisciplineId: data.childDisciplineId,
      schildDisciplineName: data.childDisciplineName,
      sisSelected: true,
      sparentDisciplineId: data.parentDisciplineId,
      sparentDisciplineName: data.parentDisciplineName
    };
    const isChildPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId === this.iCustomProcessViewModelSelection.schildDisciplineId && m.sisSelected === true).length;

    if (isChildPresent === 0) {
      this.iCustomProcessViewModelSelectionColl.push(this.iCustomProcessViewModelSelection);
      this.selectedParent = [];
      const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
      this.selectedParent = this.transform(filteredData, 'sparentDisciplineName');
      this.initiCustomProcessViewModelSelection();
    }
    this.selectedProcessName = '';
    this.iCustomProcessViewModelSelectionColl.forEach(element => {
      if (element.sisSelected) {
        if (this.selectedProcessName !== '') {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = this.selectedProcessName + ',' + element.schildDisciplineName;
          } else {
            this.selectedProcessName = this.selectedProcessName + ',' + element.sparentDisciplineName;
          }
        } else {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = element.schildDisciplineName;
          } else {
            this.selectedProcessName = element.sparentDisciplineName;
          }
        }
      }
    });
  }
  deSelectAll() {
    this.iCustomProcessViewModelSelectionColl = [];
    this.selectedParent = [];
    this.selectedProcessName = 'Select Process';
  }

  removeALLFromSelection(key: any) {
    const data = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineId === key);
    if (data) {
      data.forEach(x => {
        let index = this.iCustomProcessViewModelSelectionColl.findIndex(y => y.schildDisciplineId == x.schildDisciplineId);
        if (index != -1) {
          this.iCustomProcessViewModelSelectionColl.splice(index, 1);
        }
      })
    }
    this.selectedParent = [];
    const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
    this.selectedParent = this.transform(filteredData, 'sparentDisciplineName');
    this.selectedProcessName = '';
    this.iCustomProcessViewModelSelectionColl.forEach(element => {
      if (element.sisSelected) {
        if (this.selectedProcessName !== '') {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = this.selectedProcessName + ',' + element.schildDisciplineName;
          } else {
            this.selectedProcessName = this.selectedProcessName + ',' + element.sparentDisciplineName;
          }
        } else {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = element.schildDisciplineName;
          } else {
            this.selectedProcessName = element.sparentDisciplineName;
          }
        }
      }
    });
    if (!this.selectedProcessName) {
      this.selectedProcessName = 'Select Process';
    }
  }



  removeFromSelection(id) {
    const data = this.iCustomProcessViewModelSelectionColl.findIndex(m => m.schildDisciplineId === id);
    if (data !== -1) {
      this.iCustomProcessViewModelSelectionColl.splice(data, 1);
    }
    // data.sisSelected = false;
    this.selectedParent = [];
    const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
    this.selectedParent = this.transform(filteredData, 'sparentDisciplineName');
    this.selectedProcessName = '';
    this.iCustomProcessViewModelSelectionColl.forEach(element => {
      if (element.sisSelected) {
        if (this.selectedProcessName !== '') {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = this.selectedProcessName + ',' + element.schildDisciplineName;
          } else {
            this.selectedProcessName = this.selectedProcessName + ',' + element.sparentDisciplineName;
          }
        } else {
          if (element.schildDisciplineName !== null && element.schildDisciplineName !== '') {
            this.selectedProcessName = element.schildDisciplineName;
          } else {
            this.selectedProcessName = element.sparentDisciplineName;
          }
        }
      }
    });
    if (!this.selectedProcessName) {
      this.selectedProcessName = 'Select Process';
    }
  }
  getChildProcess(Key) {
    const data = this.iCustomProcessViewModelColl.filter(m => m.parentDisciplineName === Key);
    return data;
  }
  getSelectedChildProcess(Key) {
    const data = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineName === Key &&
      m.sisSelected === true);
    return data;
  }
  getAllProcess() {
    this._rfqService.getParentProcesses2().subscribe(
      result => {
        this.iCustomProcessViewModelColl = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  getProcess() {

    this._rfqService.getProcessByCompanyId(this.loggedCompanyId).subscribe(
      result => {
        if (result['result'] !== false) {
          this.iCustomProcessViewModelColl = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');;
        } else {
          this.getAllProcess();
        }
      },
      error => {

        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  goToRfqDdetails(id) {
    if (this.RfqStatus == 4) {
      let loggedId = this.loggedId;
      this._rfqService.isRFQDetailAccessible(id, loggedId).subscribe(res => {
        if (res['isError'] === false) {
          let capability = res['data'].isCapabilitiesMatched;
          let region = res['data'].isRegionMatched;
          if (!capability && region) {
            this._toastr.warning('Please update your capabilities to see details', 'Warning!');
          } else if (capability && !region) {
            this._toastr.warning('RFQ#' + id + ' is not another region.', 'Warning!');
          } else if (!capability && !region) {
            this._toastr.warning('Your Capabilites and Region do not match with this RFQ!', 'Warning!');
          } else {
            this.goToRfqDetailData(id);
          }
        } else {
          this._rfqService.handleError(res['messages']);
        }
      }, error => {
        this._rfqService.handleError(error);
      });
    } else {
      this.goToRfqDetailData(id);
    }



  }

  goToRfqDetailData(id) {
    const data = this.items.find(m => m.rfqId === id);
    localStorage.setItem('suppCurrentRfqName', data.rfqName);
    this._rfqService.set(data.isRfqLike, 'isRfqLike');
    this._rfqService.set(id, 'currentSupRfqDetailId');
    this._rfqService.set(data.isRfqDisLike, 'isRfqDisLike');
    localStorage.setItem('isRFQDatacommonBack', JSON.stringify(this.isupplierRfqFilterViewModel));
    localStorage.setItem('iCustomProcessViewModelSelectionColl', JSON.stringify(this.iCustomProcessViewModelSelectionColl));
    localStorage.setItem('selectedParent', JSON.stringify(this.selectedParent));
    localStorage.setItem('selectedProcessName', JSON.stringify(this.selectedProcessName));
    if (this.isTilesView === true) {
      localStorage.setItem('isTilesView ', JSON.stringify(this.isTilesView));
    } else {
      localStorage.setItem('isTilesView ', 'false');
    }

    localStorage.setItem('suppCurrentRfqStatusId', '3');
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/supplier/supplierRfqDetails'], {
      queryParams: {
        rfqId: encryptedRfqID
      }
    });
  }
  getRfqList() {
    this.items = [];
    this.isLoader = true;
    this.isRfqAvailable = false;
    this.isShowPagination = false;
    if (this.stateFilterValue === '0') {
      this.isupplierRfqFilterViewModel.rfqType = Number(this.RfqStatus);
    } else {
      this.isupplierRfqFilterViewModel.rfqType = parseInt(this.stateFilterValue);
    }

    localStorage.setItem('CurrentRfqType', this.RfqStatus.toString());
    this._rfqService.set(this.RfqStatus, 'RfqStatus');
    if (localStorage.getItem('isBack') === 'true') {
      this.isupplierRfqFilterViewModel = JSON.parse(localStorage.getItem('isRFQDatacommonBack'));
      this.currentIndex = this.isupplierRfqFilterViewModel.pageNumber;
      this.pageSize = this.isupplierRfqFilterViewModel.pageSize;
      if (JSON.parse(localStorage.getItem('isTilesView '))) {
        this.isTilesView = true;
        this.isGridView = false;
      } else {
        this.isTilesView = false;
        this.isGridView = true;
      }

      if (JSON.parse(localStorage.getItem('iCustomProcessViewModelSelectionColl')) !== null) {
        this.iCustomProcessViewModelSelectionColl = JSON.parse(localStorage.getItem('iCustomProcessViewModelSelectionColl'));
      }
      if (JSON.parse(localStorage.getItem('selectedParent')) !== null) {
        this.selectedParent = JSON.parse(localStorage.getItem('selectedParent'));
      }
      if (JSON.parse(localStorage.getItem('selectedProcessName')) !== null) {
        this.selectedProcessName = JSON.parse(localStorage.getItem('selectedProcessName'));
      }
      if (this.isupplierRfqFilterViewModel.rfqType === 13 || this.isupplierRfqFilterViewModel.rfqType === 7 ||
        this.isupplierRfqFilterViewModel.rfqType === 4 || this.isupplierRfqFilterViewModel.rfqType === 6 ||
        this.isupplierRfqFilterViewModel.rfqType === 8 || this.isupplierRfqFilterViewModel.rfqType === 5) {
        this.stateFilterValue = '0';
      } else {
        this.stateFilterValue = this.isupplierRfqFilterViewModel.rfqType.toString();
      }

      this.searchFilterValue = this.isupplierRfqFilterViewModel.searchText;
      this.sortByFilterValue = this.isupplierRfqFilterViewModel.orderBy;
      if (this.sortByFilterValue === 'quoteby' || this.sortByFilterValue === '') {
        (this.isupplierRfqFilterViewModel.isOrderByDesc === true) ? this.sortFilterValue = 'Recent' : this.sortFilterValue = 'Oldest';
      }

      if (this.sortByFilterValue === 'buyer' || this.sortByFilterValue === 'material' || this.sortByFilterValue === 'process' || this.sortByFilterValue === 'postprocess') {
        (this.isupplierRfqFilterViewModel.isOrderByDesc === true) ? this.sortFilterValue = 'Z - A' : this.sortFilterValue = 'A - Z';
      }

      if (this.sortByFilterValue === 'quantity') {
        (this.isupplierRfqFilterViewModel.isOrderByDesc === true) ? this.sortFilterValue = 'high' : this.sortFilterValue = 'low';
      }

      localStorage.setItem('isBack', 'false');
      localStorage.setItem('isRFQDatacommonBack', null);
      localStorage.setItem('iCustomProcessViewModelSelectionColl', null);
      localStorage.setItem('selectedParent', null);
      localStorage.setItem('selectedProcessName', null);

    }
    this._SupplierService.getSupplierRfq(this.isupplierRfqFilterViewModel).subscribe(
      result => {
        if (result['result'] === true) {
          this.iRFQViewModelColl = result['data'];
          window.scrollTo(0, 0);
          this.totalRow = result['totalRecords'];
          this.items = result['data'];
          if (this.iRFQViewModelColl.length !== 0) {
            this.isLoader = false;
            this.isRfqAvailable = false;
            this._rfqService.set(this.totalRow, 'totalRFQCount');
          } else {
            this.items = this.iRFQViewModelColl;
            this.isLoader = false;
            this.isRfqAvailable = true;
            this.items = [];
            this._rfqService.set(0, 'totalRFQCount');
          }

          this.init();
        } else {
          window.scrollTo(0, 0);
          this.isLoader = false;
          this.isRfqAvailable = true;
          this.items = [];
          this._rfqService.set(0, 'totalRFQCount');
        }

      },
      error => {
        this.items = [];
        this._rfqService.set(0, 'totalRFQCount');
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  getCountsOfRfqs() {
    this._SupplierService.getSupplierRFQCount(this.isupplierRfqFilterViewModel).subscribe(
      result => {
        if (result['totalRecords'] !== 0 && result['totalRecords'] !== '') {
          this.totalRow = result['totalRecords'];
          this._rfqService.set(this.totalRow, 'totalRFQCount');
        } else {
          this.totalRow = 0;
          this._rfqService.set(this.totalRow, 'totalRFQCount');
        }
        this.init();
      }
    );
  }

  initiRfqSupplierLikesViewModel() {
    this.iRfqSupplierLikesViewModel = {
      rfqSupplierLikesId: 0,
      rfqId: 0,
      contactId: 0,
      companyId: 0,
      isRfqLike: null,
      isRfqDisLike: null,
      likeDate: null,
      errorMessage: '',
      result: false,
    };
  }

  /**
   * this function is used to remove the like rfq
   * @param rfqId (this parameter used for RFQ ID have data type number)
   * @param isLike (this parameter used for Islike have data type boolean)
   * @param isDislike (this parameter used for IsDislike have data type boolean)
   */
  removelikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    const index = this.iRFQViewModelColl.findIndex(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = isDislike;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            data = data - 1;
            this._rfqService.set(data, 'likedRfqCount');
            const rfqdata = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            rfqdata.isRfqLike = false;
            rfqdata.isRfqDisLike = isDislike;
            this.initiRfqSupplierLikesViewModel();
            if (this.RfqStatus !== 4 && this.RfqStatus !== '4') {
              this.getRfqList();
            } else {
              this.items.splice(index, 1);
            }
            //
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }

  removeDisLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.isRfqLike = isLike;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            const data = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            data.isRfqDisLike = false;
            data.isRfqLike = isLike;
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }
  disLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = true;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;

      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            if (isLike && !isDislike) {
              let data = this._rfqService.get('likedRfqCount');
              if (data !== 0) {
                data = data - 1;
                this._rfqService.set(data, 'likedRfqCount');
                const rfqData = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
                rfqData.isRfqDisLike = true;
                rfqData.isRfqLike = false;
              }
            } else {
              const rfqData = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
              rfqData.isRfqDisLike = true;
              rfqData.isRfqLike = isLike;
            }

            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }

  disLikeMyLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    const index = this.iRFQViewModelColl.findIndex(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = true;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            if (data !== 0) {
              data = data - 1;
              this._rfqService.set(data, 'likedRfqCount');
            }
            this.items.splice(index, 1);
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }
  likeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = true;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            data = data + 1;
            this._rfqService.set(data, 'likedRfqCount');
            this.initiRfqSupplierLikesViewModel();
            const rfqdata = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            rfqdata.isRfqLike = true;
            rfqdata.isRfqDisLike = false;
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }

  ChangeinputLength() {
    this.pageSize = this.inputLength;
    this.init();
  }


  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }

  // List Functions Ends
  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._ProfileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }
  }


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
    this.isupplierRfqFilterViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }

  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.isupplierRfqFilterViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }
  setPage(index: number) {
    this.currentIndex = index;
    this.isupplierRfqFilterViewModel.pageNumber = this.currentIndex;
    this.getRfqList();
  }

  filterAll() {
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(0, 'rfqId');
    this.currentIndex = 1;
    this.pages = 3;
    this.isupplierRfqFilterViewModel.contactId = this.loggedId;
    if (this.sortByFilterValue !== '' && this.sortByFilterValue !== null) {
      this.isupplierRfqFilterViewModel.orderBy = this.sortByFilterValue;
    } else {
      this.isupplierRfqFilterViewModel.orderBy = '';
    }
    if (this.stateFilterValue === '0') {
      this.isupplierRfqFilterViewModel.rfqType = this.RfqStatus;
    } else {
      this.isupplierRfqFilterViewModel.rfqType = parseInt(this.stateFilterValue);
    }
    const selectedProcessesTemp = [];
    const selectedProcessesTemp2 = [];
    for (let index = 0; index < this.selectedParent.length; index++) {

      if (this.selectedParent[index].value[0].schildDisciplineId !== null) {
        selectedProcessesTemp.push(this.arrayColumn(this.selectedParent[index].value, 'schildDisciplineId'));
      } else {
        selectedProcessesTemp.push(this.arrayColumn(this.selectedParent[index].value, 'sparentDisciplineId'));
      }

    }
    for (let index = 0; index < selectedProcessesTemp.length; index++) {
      for (let subIndex = 0; subIndex < selectedProcessesTemp[index].length; subIndex++) {
        selectedProcessesTemp2.push(selectedProcessesTemp[index][subIndex]);
      }
    }
    this.isupplierRfqFilterViewModel.processIdList = selectedProcessesTemp2;
    if (this.searchFilterValue) {
      this.isupplierRfqFilterViewModel.searchText = this.searchFilterValue;
    } else {
      this.isupplierRfqFilterViewModel.searchText = '';
    }
    if (this.sortFilterValue === 'Oldest' || this.sortFilterValue === 'A - Z' || this.sortFilterValue === 'low') {
      this.isupplierRfqFilterViewModel.isOrderByDesc = false;
    } else {
      this.isupplierRfqFilterViewModel.isOrderByDesc = true;
    }
    this.isupplierRfqFilterViewModel.pageSize = this.pageSize;
    this.isupplierRfqFilterViewModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.getRfqList();
  }

  setDefaultFilter() {
    if (this.sortByFilterValue === 'quantity') {
      this.sortFilterValue = 'high';
    }
    if (this.sortByFilterValue === 'quoteby' || this.sortByFilterValue === '') {
      this.sortFilterValue = 'Recent';
    }
    if (this.sortByFilterValue === 'buyer' || this.sortByFilterValue === 'material' || this.sortByFilterValue === 'process' || this.sortByFilterValue === 'postprocess') {
      this.sortFilterValue = 'A - Z';
    }
    this.filterAll();
  }
  arrayColumn(array, columnName) {
    return array.map(function (value, index) {
      return value[columnName];
    });
  }
  removeTextValue() {
    if (this.searchFilterValue !== '') {
      this.searchFilterValue = '';
    }
    this.filterAll();
  }
  ngOnDestroy() {
    this._rfqService.set(0, 'totalRFQCount');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(null, 'buyerProfileId');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'isBuyerMessage');
  }
  onSearch() {
    if (this.searchFilterValue) {
      this.filterAll();
    }
  }
  /**
   * @param  {} val
   * This function is used to when user press backspace then it return data based on search value
   */
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.filterAll();
    }
  }

  /**
   * @param  {} val
   * This function is used to when user click on search button then it return data based on search value
   */
  checkSearch(val) {
    if (!val) {
      this.filterAll();
    }
  }

  /**
   * @param  {} tab
   * This function is used to sorting data based on keys (like material,post process etc)
   */
  sortMessage(tab) {
    switch (tab) {
      case 'Material': {
        if (this.toggle) {
          this.items.sort((b, a) => a.partsMaterialName.localeCompare(b.partsMaterialName));
        } else {
          this.items.sort((b, a) => b.partsMaterialName.localeCompare(a.partsMaterialName));
        }
        this.toggle = !this.toggle;
        break;
      }

      case 'Post Process': {
        if (this.toggle2) {
          this.items.sort((b, a) => a.postProductionProcessName.localeCompare(b.postProductionProcessName));
        } else {
          this.items.sort((b, a) => b.postProductionProcessName.localeCompare(a.postProductionProcessName));
        }
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Process': {
        if (this.toggle3) {
          this.items.sort((b, a) => a.partCategoryName.localeCompare(b.partCategoryName));
        } else {
          this.items.sort((b, a) => b.partCategoryName.localeCompare(a.partCategoryName));
        }
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Closes': {
        if (this.toggle4) {
          this.items.sort((b, a) => new Date(a.quotesNeededBy).getTime() - new Date(b.quotesNeededBy).getTime());
        } else {
          this.items.sort((b, a) => new Date(b.quotesNeededBy).getTime() - new Date(a.quotesNeededBy).getTime());
        }

        this.toggle4 = !this.toggle4;
        break;
      }

      case 'Quantity': {
        if (this.toggle5) {
          this.items.sort((b, a) => a.partQty - b.partQty);
        } else {
          this.items.sort((b, a) => b.partQty - a.partQty);
        }
        this.toggle5 = !this.toggle5;
        break;
      }
    }
  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }

  /**
   * This function is used to load all data when we come back from any page.
   */
  IsNpsdataback() {
    if (this._rfqService.get('ismyrfqdataback') === true) {
      // this.isApiRes = true;
      this._rfqService.set(false, 'ismyrfqdataback');
      this.filterAll();
    }
  }

  /**
   * This function is get model is show or not using angular services it return true or false.
   */

  isModelShow() {
    return this._rfqService.get('isModelShow');
  }

  /**
   * @param  {} rfq
   * This function is get  number of quantities tool tip data in single function
   */
  getQuantityToolTip(rfq) {
    let toolTip = ' Qty 1 - ' + rfq.qty1;
    if (rfq.qty2 !== null) {
      toolTip += ' Qty 2 - ' + rfq.qty2;
    }
    if (rfq.qty3 !== null) {
      toolTip += ' Qty 3 - ' + rfq.qty3;
    }
    return toolTip;
  }
  checkForDay(closing_date) {
    const currentDate = moment();
    const closeDate = moment.utc(closing_date).local();
    this.duration = moment.duration(closeDate.diff(currentDate));
    const minutes = this.duration.asMinutes();

    if (minutes <= 1440 && minutes > 0 && this.isupplierRfqFilterViewModel.rfqType !== 7 && this.isupplierRfqFilterViewModel.rfqType !== 6) {
      return true;
    } else {
      return false;
    }
  }
  drawerClose(val) {
    if (val) {
      let rfq = this._rfqService.get('rfqId');
      if (rfq !== null && rfq !== undefined && rfq !== '' && rfq !== 0) {
        this.scrollElementIntoView(rfq);
      }
    }
  }
  selectedProcess(key) {
    let index = this.selectedParent.findIndex(x => x.key == key);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  }
  selectedChildProcess(key) {
    let index = this.iCustomProcessViewModelSelectionColl.findIndex(x => x.schildDisciplineId == key);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  }

   getRfqId(RfqId) {
  this.rfqIdQuote=RfqId;
   }
  removeRfqFromQuotesInProgressList() {
    this._rfqService.removeRfqFromQuotesInProgressList(this.loggedId,this.rfqIdQuote).subscribe(res=>{
      if(res.isError == false){
        this._toastr.success('Remove this RFQ successfully!', 'Success!');
        this.rfqIdQuote=0;
        this.getRfqList();
      }

    })
  }
  
 
  setRfdId(rfdId) {
    this.rfdIdToSet = rfdId;
  }
  goRfqDetailsPage() { 
    localStorage.setItem('isRFQDatacommonBack', JSON.stringify(this.isupplierRfqFilterViewModel));
    if(this.rfdIdToSet === undefined){
      this.rfdIdToSet = localStorage.getItem('rfqid');
    } 
    const data = {
      "companyId": this.loggedCompanyId,
      "rfqId": parseInt(this.rfdIdToSet),
      "unlockBy": this.loggedId
    }
    this._SupplierService.GrowthPackageUnlockRFQsInfo(data).subscribe(
      result => {
        console.log('result--->', result);
        console.log(this.rfdIdToSet,"rfqIdToSet");
        const encryptedRfqID = this._ProfileService.encrypt(this.rfdIdToSet);
        this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }}); 
      }
    );
    
  }

  goBackbutton() {
    this.router.navigate(['/supplier/supplierMyRfq']);
  }

  scrollElementIntoView(elemId: string) {
    setTimeout(() => {
      const elmnt = document.getElementById(elemId);
      if (elmnt) {
        elmnt.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 1000);
  }
}
