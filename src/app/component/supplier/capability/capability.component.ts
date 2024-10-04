import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  ICustomProcessViewModel,
  ICustomSelectionProcessViewModel,
  ISavedSearchViewModel
} from '../../../core/models/rfqModel';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  SupplierService
} from '../../../core/services/supplier/supplier.service';
import {
  IProcessesViewModel,
  IManufacturerDashboardViewModel
} from '../../../core/models/supplierProfileModel';
import { RFQFilter } from '../../rfq/_filter/rfq-filter/rfqFilterModel';
import { Router } from '@angular/router';
@Component({
  selector: 'app-capability',
  templateUrl: './capability.component.html',
  styleUrls: ['./capability.component.scss'],
})
export class CapabilityComponent implements OnInit, OnDestroy {
  iCustomProcessViewModelOriColl: ICustomProcessViewModel[];
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iCustomProcessViewModelSelectionColl: ICustomSelectionProcessViewModel[];
  iCustomProcessViewModelSelection: ICustomSelectionProcessViewModel;
  selectedProcessParent: any;
  display: boolean;
  closeResult: string;
  iProcessesViewModel: IProcessesViewModel;
  iSavedSearchViewModel = new RFQFilter();
  isloading: boolean;
  modelRef: any;
  iProfileSetModel: IManufacturerDashboardViewModel;
  @Input('toSetLocalStore') toSetLocalStore: any;
  @ViewChild('content',{static: true}) editModal: TemplateRef < any > ; // Note: TemplateRef
  @Output() changeCapabilityEvent = new EventEmitter<boolean>();

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router,private _toastr: ToastrService, private _rfqService: RfqService, private modalService: NgbModal, private _SupplierService: SupplierService, ) {}

  ngOnInit() {
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      contactId: this.loggedId,
      isPublishProfile: null,
      isCompanyAddress: null
    };
    this.isloading = true;
    this.display = true;
    this.iCustomProcessViewModelSelectionColl = [];
    this.selectedProcessParent = [];
    this.iProcessesViewModel = {
      childDisciplineId: 0,
      childDisciplineName: '',
      companyId: 0,
      errorMessage: '',
      parentDisciplineId: 0,
      parentDisciplineName: '',
      partCategoryId: [],
      result: false
    };
    // this.iSavedSearchViewModel = {
    //   savedSearchId: 0,
    //   contactId: this.loggedId,
    //   searchFilterName: 'My Capabilities',
    //   keyword: '',
    //   partCategoryIdList: [],
    //   postProcessIdList: [],
    //   materialIdList: [],
    //   buyerLocationIdList: [],
    //   buyerIndustryIdList: [],
    //   countryIdList: [],
    //   regionIdList: [],
    //   proximityIdList: [],
    //   geometryId: 0,
    //   unitOfMeasureId: 0,
    //   toleranceIdList: [],
    //   widthMin: -1,
    //   widthMax: -1,
    //   heightMin: -1,
    //   heightMax: -1,
    //   depthMin: -1,
    //   depthMax: -1,
    //   lengthMin: -1,
    //   lengthMax: -1,
    //   diameterMin: -1,
    //   diameterMax: -1,
    //   isDailyNotification: true,
    //   createdOn: '2018-12-09T09:28:24.670Z',
    //   modifiedOn: '2018-12-09T09:28:24.670Z',
    //   result: false,
    //   errorMessage: '',
    //   pageSize: 0,
    //   pageNumber: 0,
    //   searchText: '',
    //   totalRecord: 0,
    //   isOrderByDesc: true,
    //   orderBy: '',
    //   more_records: true,
    // };
    this.getProcess();
    this.openModal();
  }
  openModal() {
    // this.modalService.open(this.editModal);
    this.modelRef = this.modalService.open(this.editModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  setCapability(status) {
    const ids = [];

    if (status === 2) {
      this.iCustomProcessViewModelSelectionColl.forEach(element => {
        if (element.sisSelected === true) {
          ids.push(element.schildDisciplineId);
        }
      });
      this.iSavedSearchViewModel.partCategoryIdList = ids;
      this.iSavedSearchViewModel.contactId = this.loggedId;
      this.iSavedSearchViewModel.searchFilterName= 'My Capabilities';
      this.iProcessesViewModel.companyId = this.loggedCompanyId;
      this.iProcessesViewModel.contactId = this.loggedId;
      this.iProcessesViewModel.partCategoryId = ids;
      this._SupplierService.updateSupplierCapability(this.iProcessesViewModel).subscribe(
        result => {
          this.iProcessesViewModel = result;
          if (result['result'] === true) {
            this._toastr.success(this.iProcessesViewModel.errorMessage, 'Success!');
            // this.router.navigate(['dashboard/supplier/ecommerce']);
            this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
              this.router.navigate(['dashboard/supplier/ecommerce']);
          }); 
            // window.location.reload()
            // if (result['isSavedSearchCapabilityCreated'] === false) {
            this.createFilter();
            // }
            // this.changeCapabilityEvent.emit(true);
          }
          this._rfqService.set(true, 'ismyrfqdataback');
          this._rfqService.set(false, 'showCapabilityModel');
          setTimeout(() => {
            this._rfqService.set(true, 'isSavedSerachdataFilterData');
          }, 1000)

          // if ( ! this.checkEmpty(this.editModal) ) {
          localStorage.setItem('isCapabilitySetToNotNow', 'true');
          // }
          // this.modelRef.close();
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
      this.setProfileStatus();
    } else if (status === 1) {
      // if ( ! this.checkEmpty(this.editModal) ) {
      this._rfqService.set(true, 'ismyrfqdataback');
      localStorage.setItem('isCapabilitySetToNotNow', 'true');
      this._rfqService.set(false, 'showCapabilityModel');
      // this._rfqService.set(false,'isSavedSerachdataFilterData');
      // }
      // this.modelRef.close();
    }

  }
  setProfileStatus() {
    this.iProfileSetModel.isCompanyCapabilities = true;
    this._SupplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }
  createFilter() {

    this._rfqService.SetSavedSearches(this.iSavedSearchViewModel).subscribe(
      result => {
        console.log(result.result);
      },
      error => {},
      () => {}
    );
  }

  processAddToSelection(id) {
    const data = this.iCustomProcessViewModelOriColl.find(m => m.childDisciplineId === id);
    this.iCustomProcessViewModelSelection = {
      schildDisciplineId: data.childDisciplineId,
      schildDisciplineName: data.childDisciplineName,
      sisSelected: true,
      sparentDisciplineId: data.parentDisciplineId,
      sparentDisciplineName: data.parentDisciplineName
    };
    const isPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId ===
      this.iCustomProcessViewModelSelection.schildDisciplineId && m.sisSelected === true).length;
    if (isPresent === 0) {
      this.iCustomProcessViewModelSelectionColl.push(this.iCustomProcessViewModelSelection);
      this.selectedProcessParent = [];
      const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
      this.selectedProcessParent = this.transform(filteredData, 'sparentDisciplineName');
      this.initiCustomProcessViewModelSelection();
    }
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
  processAddAllToSelection(key) {
    const data = this.iCustomProcessViewModelOriColl.filter(m => m.parentDisciplineName === key);
    data.forEach(element => {
      this.iCustomProcessViewModelSelection = {
        schildDisciplineId: element.childDisciplineId,
        schildDisciplineName: element.childDisciplineName,
        sisSelected: true,
        sparentDisciplineId: element.parentDisciplineId,
        sparentDisciplineName: element.parentDisciplineName
      };
      const isPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId ===
        this.iCustomProcessViewModelSelection.schildDisciplineId && m.sisSelected === true).length;
      if (isPresent === 0) {
        this.iCustomProcessViewModelSelectionColl.push(this.iCustomProcessViewModelSelection);
        this.selectedProcessParent = [];
        const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
        this.selectedProcessParent = this.transform(filteredData, 'sparentDisciplineName');
        this.initiCustomProcessViewModelSelection();
      }
    });
  }
  getProcess() {
    this._rfqService.getParentProcesses2().subscribe(
      result => {
        this.iCustomProcessViewModelOriColl = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');;
        this.isloading = false;
        this.getCapabilities();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getChildProcess(Key) {
    const data = this.iCustomProcessViewModelOriColl.filter(m => m.parentDisciplineName === Key);
    return data;
  }
  processDeSelectAll() {
    this.iCustomProcessViewModelSelectionColl = [];
    this.selectedProcessParent = [];
    //  this.selectedProcessName = 'Select Process';
  }
  getSelectedChildProcess(Key) {
    const data = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineName === Key && m.sisSelected === true);
    return data;
  }
  processRemoveALLFromSelection(key) {
    const data = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineName === key);
    data.forEach(element => {
      element.sisSelected = false;
    });
    this.selectedProcessParent = [];
    const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
    this.selectedProcessParent = this.transform(filteredData, 'sparentDisciplineName');
  }
  processRemoveFromSelection(id) {
    const data = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId === id);
    data.forEach(element => {
      element.sisSelected = false;
    });
    this.selectedProcessParent = [];
    const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
    this.selectedProcessParent = this.transform(filteredData, 'sparentDisciplineName');
  }
  transform(collection: Array < any > , property: string): Array < any > {
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
    return Object.keys(groupedCollection).map(key => ({
      key,
      value: groupedCollection[key]
    }));
  }
  checkEmpty(val) {
    return (val !== undefined && val !== null && val !== '') ? true : false;
  }
  getCapabilities() {

    this._SupplierService.getCapabilities(this.loggedCompanyId, false).subscribe(
      result => {
        ;
        if (result['result'] === true) {
          this.iCustomProcessViewModelColl = result['data'];
          this.iCustomProcessViewModelColl.forEach(partent => {
            const childData = this.iCustomProcessViewModelOriColl.find(m => m.childDisciplineId === partent.childDisciplineId);
            const parentData = this.iCustomProcessViewModelOriColl.find(m => m.parentDisciplineId === partent.parentDisciplineId);
            let data = null;
            if(childData !== undefined || data !== null){
              data = childData;
            } else if( parentData !== undefined ){
              data = parentData;
            }
            if (data !== undefined) {
              this.iCustomProcessViewModelSelection = {
                schildDisciplineId: data.childDisciplineId,
                schildDisciplineName: data.childDisciplineName,
                sisSelected: true,
                sparentDisciplineId: data.parentDisciplineId,
                sparentDisciplineName: data.parentDisciplineName
              };
              const isPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId === this.iCustomProcessViewModelSelection.schildDisciplineId && m.sisSelected === true).length;

              if (isPresent === 0) {
                this.iCustomProcessViewModelSelectionColl.push(this.iCustomProcessViewModelSelection);
                this.selectedProcessParent = [];
                const filteredData = this.iCustomProcessViewModelSelectionColl.filter(m => m.sisSelected === true);
                this.selectedProcessParent = this.transform(filteredData, 'sparentDisciplineName');
                this.initiCustomProcessViewModelSelection();
              }
            } else {
              console.log('catagory not found' + partent);
            }

          });
        }
      },
      error => {
        this._rfqService.handleError(error);

      },
      () => {}
    );
  }

  ngOnDestroy() {
    localStorage.removeItem('isSubscription');
    if (this.modelRef !== undefined && this.modelRef !== null && this.modelRef !== '') {
      this.modelRef.close();
    }
  }
  selectedChildProcess(key) {
    let index = this.iCustomProcessViewModelSelectionColl.findIndex(x => x.schildDisciplineId == key && x.sisSelected == true);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  }
  selectedProcess(key) {
    let index = this.selectedProcessParent.findIndex(x => x.key == key);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  }
}
