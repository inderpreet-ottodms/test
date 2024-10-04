import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  Http
} from '@angular/http';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  IContactViewModel
} from '../../../../../core/models/accountModel';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ICustomProcessViewModel,
  ICustomSelectionProcessViewModel,
  ISavedSearchViewModel
} from '../../../../../core/models/rfqModel';
import {
  IMaterialViewModel
} from '../../../../../core/models/globalMaster';
import {
  IFocusOverViewModel,
  IProcessesViewModel,
  IManufacturerDashboardViewModel,
  IndustryFocusList
} from '../../../../../core/models/supplierProfileModel';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import { RFQFilter } from '../../../../rfq/_filter/rfq-filter/rfqFilterModel';

@Component({
  selector: 'app-capabilities',
  templateUrl: './capabilities.component.html',
  styleUrls: ['./capabilities.component.scss']
})



export class CapabilitiesComponent implements OnInit {

  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iCustomProcessViewModelOriColl: ICustomProcessViewModel[];
  iCustomProcessViewModelSelectionColl: ICustomSelectionProcessViewModel[];
  iCustomProcessViewModelSelection: ICustomSelectionProcessViewModel;
  iContactViewModel: IContactViewModel;
  iMaterialViewModelColl: IMaterialViewModel[];
  iSavedSearchViewModel = new RFQFilter();
  iFocusOverViewModel: IFocusOverViewModel;
  selectedProcessParent: any;
  isProcess: boolean;
  iProcessesViewModel: IProcessesViewModel;
  isLoader: boolean;
  iProfileSetModel: IManufacturerDashboardViewModel;
  industryFocusList: IndustryFocusList;
  isButtonClicked: boolean = false;
  @Output () profileChanges = new EventEmitter();

  constructor(private _Http: Http,
    private _SupplierService: SupplierService,
    public router: Router, private _profileService: ProfileService,
    private _toastr: ToastrService, private _rfqService: RfqService) {
    this.iCustomProcessViewModelColl = [];
    this.iCustomProcessViewModelOriColl = [];

    this.isProcess = false;
    this.selectedProcessParent = [];
    this.initiCustomProcessViewModelSelection();
    this.iCustomProcessViewModelSelectionColl = [];
    this.getProcess();
    this.initProcessViewModel();
    this.isLoader = true;
  }
  onProcess() {
    this.isProcess = true;
  }
  initProcessViewModel() {
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
  }
  closeProcess() {
    this.isProcess = false;
  }
  submitCapabilitis() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      const ids = [];
      this.iCustomProcessViewModelSelectionColl.forEach(element => {
        if (element.sisSelected === true) {
          ids.push(element.schildDisciplineId);
        }
      });
      this.iSavedSearchViewModel.contactId = this.loggedId();
      this.iSavedSearchViewModel.searchFilterName= 'My Capabilities';
      if (ids.length) {
        this.iSavedSearchViewModel.partCategoryIdList = ids;
      } else {
        this.iSavedSearchViewModel.partCategoryIdList = [];
      }
      this.iProcessesViewModel.companyId = this.iContactViewModel.companyId;
      this.iProcessesViewModel.contactId =  this.iContactViewModel.contactId;
      this.iProcessesViewModel.partCategoryId = ids;
      this._SupplierService.updateSupplierCapability(this.iProcessesViewModel).subscribe(
        result => {
          this.iProcessesViewModel = result;
          if (result['result'] === true) {
            debugger;
            this._toastr.success(this.iProcessesViewModel.errorMessage, 'Success!');
            this.profileChanges.emit(true);
            this.createFilter();
            this.getCapabilities();
            // this.profileChanges.emit(true);
          }
          if (!ids.length) {
            this.deleteProfileStatus();
          } else {
            this.setProfileStatus();
          }
          this.isButtonClicked = false;
        },
        error => {
          this.isButtonClicked = false;
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  deleteProfileStatus() {
    this.iProfileSetModel.isCompanyCapabilities = true;
    this._SupplierService.deleteProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }
  setProfileStatus() {
    localStorage.setItem('isCapabilitiesFilled', 'true');
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
  getProcess() {
    this._rfqService.getParentProcesses2().subscribe(
      result => {
        this.iCustomProcessViewModelOriColl = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');;
        this.getCapabilities();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  initIFocusOverViewModel() {
    this.iFocusOverViewModel = {
      industryFocusList: null,
      tolerance: ''
    };
    this.industryFocusList = {
      industryFocus: '',
      industryFocusId: 0
    }
  }
  initializeModel() {
    this.initIFocusOverViewModel();
  }
  loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  ngOnInit() {
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      isPublishProfile: null,
      isCompanyAddress: null,
      contactId: parseInt(localStorage.getItem('LoggedId'))
    };
    // this.iSavedSearchViewModel = {
    //   savedSearchId: 0,
    //   contactId: 0,
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
    this.getProfileDetailsLocal();
  }
  getCapabilities() {
    this.isLoader = true;
    this._SupplierService.getCapabilities(this.iContactViewModel.companyId, false).subscribe(
      result => {
        ;
        if (result['result'] === true) {
          this.iCustomProcessViewModelColl = result['data'];
          this.isLoader = false;
          this.iCustomProcessViewModelColl.forEach(partent => {
            const childData = this.iCustomProcessViewModelOriColl.find(m => m.childDisciplineId === partent.childDisciplineId);
            const parentData = this.iCustomProcessViewModelOriColl.find(m => m.parentDisciplineId === partent.parentDisciplineId);
            let data = null;
            if (childData !== undefined) {
              data = childData;
            } else if (parentData !== undefined) {
              data = parentData;
            }
            if (data !== undefined || data !== null) {
              this.iCustomProcessViewModelSelection = {
                schildDisciplineId: data.childDisciplineId,
                schildDisciplineName: data.childDisciplineName,
                sisSelected: true,
                sparentDisciplineId: data.parentDisciplineId,
                sparentDisciplineName: data.parentDisciplineName
              };
              const isPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.schildDisciplineId ===
                this.iCustomProcessViewModelSelection.schildDisciplineId && m.sisSelected === true).length;
              const isParentPresent = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineName === this.iCustomProcessViewModelSelection.sparentDisciplineName && m.sisSelected === true).length;
              if (isPresent === 0 || isParentPresent === 0) {
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
        } else {
          this.iCustomProcessViewModelColl = [];
          this.isLoader = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
      },
      () => {}
    );
  }
  get loggedEncryptId() {
    // tslint:disaabale-next-line:radix
    return localStorage.getItem('LoggedIdEncript');
  }
  getProfileDetailsLocal() {
    const id = this.loggedEncryptId;;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
      this.getParentMaterialofCompany();

      this.getFocusOverview();
    } else {
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          this.getParentMaterialofCompany();
          // this.getCapabilities();
          this.getFocusOverview();
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  getProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this.getParentMaterialofCompany();
        // this.getCapabilities();
        this.getFocusOverview();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  getParentMaterialofCompany() {
    this._SupplierService.getParentMaterialofCompany(this.iContactViewModel.companyId).subscribe(
      result => {
        this.iMaterialViewModelColl = result['data'];
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getFocusOverview() {
    this._SupplierService.getFocusOverview(this.iContactViewModel.companyId).subscribe(
      result => {
        this.iFocusOverViewModel = result['data'];
        // this.iFocusOverViewModel.tolerance = 'Loose (+/- .00)';
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );

  }

  isSidePanelOpen() {
    const isOpen = this._SupplierService.get('supplierSidePanel');
    if (isOpen !== null && isOpen !== undefined) {
      return this._SupplierService.get('supplierSidePanel');
    } else {
      return false;
    }
  }
  reloadPageOndrawerClose() {
    if (this._SupplierService.get('capabilitiesDrawerDataSaved')) {
      this._SupplierService.set(false, 'capabilitiesDrawerDataSaved');
      this.getProfileDetails();
    }
  }

  openSidePanel(page) {
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(true, 'supplierSidePanel');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(true, 'capabilitiesEdit');
    this._SupplierService.set(false, 'ratingReply');
    if (page === 'companyDescription') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(true, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyEquipment') {
      this._SupplierService.set(true, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyPhotos') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(true, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyDemographics') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(true, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyCertifications') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(true, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyCatagories') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(true, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyFocus') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(true, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
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
  // Process Area
  getChildProcess(Key) {
    const data = this.iCustomProcessViewModelOriColl.filter(m => m.parentDisciplineName === Key);
    return data;
  }
  getSelectedChildProcess(Key) {
    const data = this.iCustomProcessViewModelSelectionColl.filter(m => m.sparentDisciplineName === Key && m.sisSelected === true);
    return data;
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
  processDeSelectAll() {
    this.iCustomProcessViewModelSelectionColl = [];
    this.selectedProcessParent = [];
    //  this.selectedProcessName = 'Select Process';
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
  // Process Area Ends
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

  disabledCapabilityBtn() {
    // let isStripUserFlag = false;
    // let accountType = localStorage.getItem('AccountType');
    // let isStripUser = localStorage.getItem('isStripUser');
    // if( isStripUser != undefined && isStripUser != null && isStripUser != ''){
    //   if(isStripUser == 'true'){
    //     isStripUserFlag = true;
    //   }
    // }
    // if( accountType != undefined && accountType != null && accountType != ''){
    //   if(accountType == 'Gold' && isStripUserFlag){
    //     if (this.selectedProcessParent.length && this.selectedProcessParent.length <= 2) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   } else{
    if (this.selectedProcessParent.length) {
      return false;
    } else {
      return true;
    }
    //   }
    // }

  }
  selectedProcess(key) {
    let index = this.selectedProcessParent.findIndex(x => x.key == key);
    if (index != -1) {
      return true;
    } else {
      return false;
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
}
