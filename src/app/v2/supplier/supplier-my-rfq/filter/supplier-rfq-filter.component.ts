import {
  Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef,
  Input, ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { RFQFilter, SavedSearchDefaultFilterViewModel } from './supplier-rfqFilterModel';
import { MasterService } from '../../../../../app/core/services/master/master.service';
import { AppUtil } from '../../../../../app/app.util';
import { BrowserStorageUtil } from '../../../../../app/shared/browser.storage.util';
import { SupplierChildProcessViewModel } from '../../../../../app/core/models/rfqModel';
import { SupplierV2Service } from '../../service/supplier.v2.service';

@Component({
  selector: 'app-supplier-rfq-filter',
  templateUrl: './supplier-rfq-filter.component.html',
  styleUrls: ['./supplier-rfq-filter.component.scss'],
  providers: [RFQFilter, AngularMultiSelectModule],
  encapsulation: ViewEncapsulation.None
})
export class SupplierRfqFilterComponent implements OnInit, OnDestroy {

  @ViewChild('content', { static: false }) editModal: TemplateRef<any>;
  @ViewChild('showHideDeleteConfirmationModel', { static: false }) showHideDeleteConfirmationModel: TemplateRef<any>;
  selectedSavedSearchIdToDelete=0;
  showHideDeleteConfirmationModelReference: any = "";

  partCategoryIdList: any = [];
  defaultFilterByList = [];
  defaultFilterChipsOpened = false;
  sortByList = [];
  selectedSortBy = { "key": "NewestRFQ", "value": "Newest RFQ" };
  selectedDefaultFilterBy: any = {};
  selectedItems: number = -1;
  searchText: string = ''
  //row 1
  processSettings = {};
  childProcessSettings = {};
  certificatesettings = {};
  iCustomProcessViewModelColl: any = [];
  iCustomChildProcessViewModelColl: any = [];
  iCertificationViewModelColl: any = [];
  selectedProcessItems = [];
  selectedChildProcessItems = [];
  selectedCertificationItems = [];

  //row 2
  materialsettings = {};
  postProductionProcesssettings = {};
  buyerIndustrySettings = {};
  iMaterialViewModelColl: any = [];
  iPostProductionViewModelColl: any = [];
  buyerTypeViewModelColl: any = [];
  materialselectedItems = [];
  postProcessselectedItems = [];
  selectedBuyerIndustry: any = [];
  //row 3
  proximitysettings = {};
  iProximityColl: any[] = [];
  partSizeList: any = [];
  iToleranceColl: any = [];
  proximityselectedItems = [];
  selectedTolerance: any = -1;
  selectedPartSize = -1;
  showTechnique: boolean = true;
  selectedFilterBy = [];
  selectedSearchCriteriaData: any = {};
  isOpenFilterDropdown = false;
  isOpenShortDropdown = false;
  isShowAdvance: boolean = false;
  isLoader: boolean = false;
  activeRFQListLoaded = false;
  activeRFQResult: any = {data: [], totalRecords: 0, isError: false};
  commonSettings = {
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    noDataLabel: 'No Data Available',
    enableSearchFilter: true,
    badgeShowLimit: 2,
    maxHeight: 150,
    showCheckbox: true,
    singleSelection: false,
    selectGroup: true
  }
  searchFilterName: string = '';
  sortByFilterValue;
  sortFilterValue;

  iSavedSearchViewModelColl: RFQFilter[];
  disableSaveFilterButton: boolean = true;
  selectSaveSearchClicked = false;
  isValidPostCode: boolean = true;
  isDisabledBtn: boolean = false;
  modelRef: any;
  savedSearchDefaultFilterViewModel: SavedSearchDefaultFilterViewModel;
  isDefaultSaveSearch: boolean = false;
  isDailyNotification: boolean = false;
  @Input() goBackFilter: any;
  @Output() filterChangeEventHandler = new EventEmitter<any>();
  constructor(
    private supplierService: SupplierV2Service,
    private toastr: ToastrService, 
    private _masterService: MasterService,
    private modalService: NgbModal) {
  }
  ngOnInit() {
    this.isValidPostalCode();
    this.allDropDownSetting();
   this.filterRFQData(false);
    this.sortByFilterValue = "";
    this.isLoader = true;
    let loading = {};
    loading["loadAllActiveRFQForSupplier"] = true;
    this.supplierService.loadAllActiveRFQForSupplier().subscribe(supplierActiveRFQResponse => {
      delete loading["loadAllActiveRFQForSupplier"];
      if (!supplierActiveRFQResponse["isError"] && supplierActiveRFQResponse["data"].length > 0) {
        this.activeRFQResult = supplierActiveRFQResponse;
        this.activeRFQListLoaded = true;
      }
    }, error => {
      this.isLoader = false;
    });

    loading["getSupplierParentProcesses"] = true;
    this.supplierService.getSupplierParentProcesses(this.loggedCompanyId, true).subscribe(
      result => {
        delete loading["getSupplierParentProcesses"];
        if (result['result']) {
          this.iCustomProcessViewModelColl = result['data'];
          return;
        }
        console.log("TODO");
      }, this.handleError);
    loading["getCertificate"] = true;
    this._masterService.getCertificate(null).subscribe(
      result => {
        delete loading["getCertificate"];
        if (result['result']) {
          this.iCertificationViewModelColl = result['data'];
          return;
        }
        console.log("TODO");
      }, this.handleError);
    loading["getParentMaterial"] = true;
    this.supplierService.getParentMaterial().subscribe(
      result => {
        delete loading["getParentMaterial"];
        if (result['result']) {
          this.iMaterialViewModelColl = result['data'];
          return;
        }
        console.log("TODO");
      }, this.handleError);
    loading["GetPostProdProcesses"] = true;
    this.supplierService.getPostProdProcesses().subscribe(
      result => {
        delete loading["GetPostProdProcesses"];
        if (result['result']) {
          this.iPostProductionViewModelColl = result['data'];
          return;
        }
        console.log("TODO");
      }, this.handleError);
    loading["GetCompanyTypesForBuyers"] = true;
    this._masterService.GetCompanyTypesForBuyers().subscribe(
      (data: any) => {
        delete loading["GetCompanyTypesForBuyers"];
        if (data['result']) {
          this.buyerTypeViewModelColl = data['data'];
          return;
        }
        console.log("TODO");
      }, this.handleError);
    loading["getProximity"] = true;
    this._masterService.getProximity().subscribe(
      (data) => {
        delete loading["getProximity"];
        if (data['result']) {
          const newItem = {
            active: true,
            actualIdFromSourceDb: null,
            description: "Select Proximity",
            id: null,
            parent: null,
            sortOrder: 0,
            sysKey: "",
            value: "",
          };
          this.iProximityColl = data['data'];
          this.iProximityColl.unshift(newItem);
          return;
        }
        console.log("TODO");
      }, this.handleError);
    loading["getTolerance"] = true;
    this._masterService.getTolerance().subscribe(
      (data) => {
        delete loading["getTolerance"];
        if (data['result']) {
          this.iToleranceColl = data['data'];
          return;
        }
        console.log("TODO");
      }, this.handleError);

    let myInterval = setInterval(() => {
      this.isLoader=true;
      if (Object.keys(loading).length == 0) {
        clearInterval(myInterval);
        this.loadSavedSearch();
      }
    }, 1000);
  }
 
  closeHideDeleteConfirmationModel(){
    this.selectedSavedSearchIdToDelete=0;
    if (AppUtil.isNotEmptyString(this.showHideDeleteConfirmationModelReference)) {
      this.showHideDeleteConfirmationModelReference.close();
      this.showHideDeleteConfirmationModelReference = null;
    }
  }
  deleteSavedSearchFilterDetails(savedSearchId,isNotConfirmed=true) {
    if(isNotConfirmed){
      this.selectedSavedSearchIdToDelete=savedSearchId;
      this.showHideDeleteConfirmationModelReference = this.modalService.open(this.showHideDeleteConfirmationModel,
        {}
      );
      return ;
    }

    this.supplierService.deleteSavedSearchDetails(savedSearchId).subscribe(res => {
      this.toastr.success(res.errorMessage);
      if(savedSearchId===this.selectedItems){
       this.defaultFilterByChanged({savedSearchId:savedSearchId});
      }
      this.closeHideDeleteConfirmationModel()
      this.loadSavedSearch();
    });
  }
  loadSavedSearch(selectDefault={isDefault:true,data:{}}) {
    this.isLoader = true;
    this.supplierService.getMyRfqSavedSearchByContact(this.loggedId).subscribe(
      result => {
        this.isLoader = false;
        if (!result.isError) {
          this.iSavedSearchViewModelColl = result.data;
          if(selectDefault.isDefault){
            const defaultData = this.iSavedSearchViewModelColl.find(savedSearchObj => savedSearchObj["isDefault"]);
              if (defaultData) {
                this.selectSaveSearch(defaultData);
                return;
              } 
            }
            this.filterRFQData();
          return;
        }
        console.log("TODO");
      }, this.handleError);
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  //This function is check loggedIn user zipcode is valid or not for proximetric drop down enable or not
  isValidPostalCode() {
    this.supplierService.isValidPostalCode(this.loggedId).subscribe(res => {
      if (res['isError'] === false) {
        this.isValidPostCode = res['data'].isvalidPostalCode;
        if (!this.isValidPostCode) {
          this.proximityselectedItems = [];
        }
      }
    })
  }
  handleError(error) {
    this.isLoader = false;
    if (error.status === 0) {
      this.toastr.warning('Please check connection', 'Warning!');
    } else if (error.status === 400) {
      this.toastr.warning(JSON.stringify(error.error), 'Warning!');
    } else if (error.status === 401) {
      this.toastr.warning('Your session is expired. Please login again to continue.', 'Warning!');
    }
  }

  clearAll() {
    this.searchText = '';
    this.isOpenFilterDropdown = false;
    this.selectedPartSize = -1;
    this.isOpenShortDropdown = false;
    this.selectedSortBy = { "key": "NewestRFQ", "value": "Newest RFQ" }
    this.showTechnique = true;
    this.selectedFilterBy = []
    this.selectedDefaultFilterBy = {};
    this.defaultFilterChipsOpened = false;
    this.searchFilterName = '';
    this.selectedItems = -1;

    this.selectedProcessItems = [];
    this.materialselectedItems = [];
    this.postProcessselectedItems = [];
    this.selectedTolerance = -1
    this.proximityselectedItems = [];
    this.selectedChildProcessItems = [];
    this.iCustomChildProcessViewModelColl = [];
    this.selectedBuyerIndustry = [];
    this.selectedCertificationItems = [];
    this.filterRFQData();
  }


  profileCapabilitySave() {
    let iProcessesViewModel = {
      companyId: this.loggedCompanyId,
      contactId: this.loggedId,
      partCategoryId: this.partCategoryIdList
    }
    this.supplierService.updateSupplierCapability(iProcessesViewModel).subscribe(
      result => {
      })
  }
  //this function is used to show and hide save button
  isCheckDisabledSavebtn() {
    this.disableSaveFilterButton = true;
    if (this.selectedItems == -1) {
      if (
        AppUtil.isNotEmptyList(this.selectedProcessItems) ||
        AppUtil.isNotEmptyList(this.selectedChildProcessItems) ||
        AppUtil.isNotEmptyList(this.selectedCertificationItems) ||

        AppUtil.isNotEmptyList(this.materialselectedItems) ||
        AppUtil.isNotEmptyList(this.postProcessselectedItems) ||
        AppUtil.isNotEmptyList(this.selectedBuyerIndustry) ||

        AppUtil.isNotEmptyList(this.proximityselectedItems) ||
        this.selectedTolerance != -1 ||
        this.selectedPartSize != -1) {
        this.disableSaveFilterButton = false;
      }
    } else {
      if (this.selectSaveSearchClicked) {
        this.selectSaveSearchClicked = false;
        return;
      }
      const selectedProcessIdList = this.getIdFromKey(this.selectedProcessItems, "parentDisciplineId");
      const selectedChildProcessIdList = this.getIdFromKey(this.selectedChildProcessItems, "childDisciplineId");
      const selectedCertificateIdList = this.getIdFromKey(this.selectedCertificationItems, "certificateId");

      const selectedMaterialsIdList = this.getIdFromKey(this.materialselectedItems, "childMaterialId");
      const selectedPostProcessIdList = this.getIdFromKey(this.postProcessselectedItems, "childPostProductionProcessId");
      const selectedBuyerIndustryIdList = this.getIdFromKey(this.selectedBuyerIndustry, "industryBranchesId");;

      const selectedProximityIdList = this.getIdFromKey(this.proximityselectedItems, "id");
      const temp = this.selectedSearchCriteriaData;
      const tempToleranceId = temp.toleranceIdList && temp.toleranceIdList.length > 0 ? temp.toleranceIdList[0] : -1;

      let selectedPartSize = this.selectedPartSize == -1 ? null : (this.selectedPartSize === 0 ? false : true);

      if (
        AppUtil.areArraysNotIdentical(selectedProcessIdList, temp.parentPartCategoryIdList) ||
        AppUtil.areArraysNotIdentical(selectedChildProcessIdList, temp.childPartCategoryIdList) ||
        AppUtil.areArraysNotIdentical(selectedCertificateIdList, temp.certificateIdList) ||

        AppUtil.areArraysNotIdentical(selectedMaterialsIdList, temp.materialIdList) ||
        AppUtil.areArraysNotIdentical(selectedPostProcessIdList, temp.postProcessIdList) ||
        AppUtil.areArraysNotIdentical(selectedBuyerIndustryIdList, temp.buyerIndustryIdList) ||

        AppUtil.areArraysNotIdentical(selectedProximityIdList, temp.proximityIdList) ||
        temp.isLargePart != selectedPartSize ||
        tempToleranceId != this.selectedTolerance) {
        this.disableSaveFilterButton = false;
      }
    }
  }

  closeModel() {
    this.isDisabledBtn = false;
    this.modelRef && this.modelRef.close();
  }

  IsNpsdataback() {
    /* if (this.supplierService.get('isSavedSerachdataFilterData') === true) {
      this.supplierService.set(false, 'isSavedSerachdataFilterData');
    } */
  }
  getSavedSearchCollDefaultList() {
    this.iSavedSearchViewModelColl = [];
    let logId = this.loggedId;
    this.supplierService.getMyRfqSavedSearchByContact(logId).subscribe(
      result => {
        if (!result.isError) {
          this.iSavedSearchViewModelColl = result.data;
        }
      })
  }

  getBuyerIndustryList() {
    this._masterService.GetCompanyTypesForBuyers().subscribe(
      (data: any) => {
        this.buyerTypeViewModelColl = data['data'];
      }, this.handleError);
  }
  getIdFromKey(list, key) {
    let data = [];
    if (list)
      list.forEach(element => {
        data.push(element[key]);
      });
    return data;
  }

  //new changes started
  setSavedSearchDefaultFilter(option) {
    let savedSearchDefaultFilterViewModel = new SavedSearchDefaultFilterViewModel();
    savedSearchDefaultFilterViewModel.contactId = this.loggedId;
    savedSearchDefaultFilterViewModel.savedSearchId = option.savedSearchId;
    savedSearchDefaultFilterViewModel.isDefault = option.isDefaultSaveSearch;
    this.supplierService.setSavedSearchDefaultFilter(savedSearchDefaultFilterViewModel).subscribe(res => {
      this.loadSavedSearch();
    }, this.handleError)
  }
  onSaveFilter(dataToSave) {
    this.isLoader = true;
    dataToSave.parentPartCategoryIdList = this.getIdFromKey(this.selectedProcessItems, "parentDisciplineId");
    dataToSave.childPartCategoryIdList = this.getIdFromKey(this.selectedChildProcessItems, "childDisciplineId");
    dataToSave.certificateIdList = this.getIdFromKey(this.selectedCertificationItems, "certificateId");

    dataToSave.materialIdList = this.getIdFromKey(this.materialselectedItems, "childMaterialId");
    dataToSave.postProcessIdList = this.getIdFromKey(this.postProcessselectedItems, "childPostProductionProcessId");
    dataToSave.buyerIndustryIdList = this.getIdFromKey(this.selectedBuyerIndustry, "industryBranchesId");;
    dataToSave.proximityIdList = this.getIdFromKey(this.proximityselectedItems, "id");
   
    dataToSave.isLargePart = this.selectedPartSize === -1 ? null : this.selectedPartSize == 1 ? true : false;
    dataToSave.toleranceIdList = this.selectedTolerance != -1 ? [this.selectedTolerance] : [];
    dataToSave["contactId"] = BrowserStorageUtil.getLoogedUserId();
    if (this.selectedItems != -1) {
      dataToSave.savedSearchId = this.selectedItems;
      dataToSave.searchFilterName = this.searchFilterName;
    } else {
      dataToSave.savedSearchId = 0;
    }

    this.partCategoryIdList = [];
    dataToSave.parentPartCategoryIdList.forEach(x => {
      this.partCategoryIdList.push(x);
    });
    dataToSave.childPartCategoryIdList.forEach(x => {
      this.partCategoryIdList.push(x);
    })
    dataToSave.partCategoryIdList = this.partCategoryIdList;
    this.supplierService.setMyRfqSavedSearchFilter(dataToSave).subscribe(res => {
      this.isLoader = false;
      if (!res.isError) {
        this.closeModel();
        let text = 'New  Saved Search Filter Is Created Successfully';
        if (this.selectedItems != -1) {
          text = 'Advance filter "' + dataToSave.searchFilterName + '" successfully updated.';
        }else  {
          let option = { savedSearchId: res.data.savedSearchId, searchFilterName: dataToSave.searchFilterName, isDefaultSaveSearch: dataToSave.isDefaultSaveSearch };
           
          if(dataToSave.isDefaultSaveSearch){
            this.setSavedSearchDefaultFilter(option);//this API in this method could be merged in to one
           }else{
            this.loadSavedSearch({isDefault:false,data:option});
           }
        }        
        this.toastr.success(text, 'Success!')
      }      
    },
      error => {
        this.isLoader = false;
      });

  }
  // this function is used to checked duplicate filter name
  isPresent() {
    if (this.searchFilterName && this.searchFilterName.trim().length == 0) {
      this.searchFilterName = "";
      return;
    }
    let data = this.iSavedSearchViewModelColl.find(x => x.searchFilterName.toLowerCase().trim() === this.searchFilterName.toLowerCase().trim());
    if (data) {
      this.isDisabledBtn = true;
    } else {
      this.isDisabledBtn = false;
    }
  }
  openModal() {
    if (this.selectedItems != -1) {
      this.onSaveFilter({});
    } else {
      this.searchFilterName = "";
      this.isDailyNotification = false;
      this.isDefaultSaveSearch = false
      this.modelRef = this.modalService.open(this.editModal, {
        backdrop: 'static'
      });
    }
  }
  //row 1
  processDataChangedHandler(item = null) {
    this.getSupplierChildProcesses();
    this.filterRFQData();
  }
  enableDisableChildProcessItems(selectedChildProcessItems) {
    let setting = { disabled: this.iCustomChildProcessViewModelColl.length ? false : true };
    setting = Object.assign(this.childProcessSettings, setting);
    this.showTechnique = false;
    this.childProcessSettings = setting;
    setTimeout(() => {
      this.showTechnique = true;
      setTimeout(() => {
        if (this.selectedItems != -1) {
          if (selectedChildProcessItems) {
            selectedChildProcessItems = this.populateDropdownSelection(selectedChildProcessItems, 'childPartCategoryIdList', 'iCustomChildProcessViewModelColl', 'childDisciplineId');
            this.selectedChildProcessItems = selectedChildProcessItems;
          }
        } else {
          const tempSelectedChildProcessItems = this.selectedChildProcessItems
          if (AppUtil.isNotEmptyList(tempSelectedChildProcessItems)) {
            this.selectedChildProcessItems = [];
            tempSelectedChildProcessItems.forEach(element => {
              let data = this.iCustomChildProcessViewModelColl.find(x => x.childDisciplineId === element.childDisciplineId);
              if (data) {
                this.selectedChildProcessItems.push(data);
              }
            });
          }
        }
      }, 5);
    }, 5);
  }
  getSupplierChildProcesses(savedData?) {
    let supplierChildProcessViewModel = new SupplierChildProcessViewModel();
    supplierChildProcessViewModel.supplierCompanyId = this.loggedCompanyId;
    supplierChildProcessViewModel.isRfqSearchType = true;
    supplierChildProcessViewModel.parentCategoryIdList = [];
    if (this.selectedProcessItems.length > 0) {
      this.selectedProcessItems.forEach(x => {
        if (x.parentDisciplineId != 0) {
          supplierChildProcessViewModel.parentCategoryIdList.push(x.parentDisciplineId);
        }
      })
    }
    if (supplierChildProcessViewModel.parentCategoryIdList.length < 1) {
      this.showTechnique = true;
      this.selectedChildProcessItems = [];
      this.iCustomChildProcessViewModelColl = [];
      this.enableDisableChildProcessItems([]);
      return;
    }
    this.supplierService.getSupplierChildProcesses(supplierChildProcessViewModel).subscribe(res => {
      this.iCustomChildProcessViewModelColl = [];
      if (res['result'] == true) {
        this.iCustomChildProcessViewModelColl = res['data'];
      }
      this.enableDisableChildProcessItems(savedData);
    }, error => {
      this.showTechnique = true;
      this.selectedChildProcessItems = [];
      this.iCustomChildProcessViewModelColl = [];
    })
  }
  onChildProcessChanged(item: any) {
    this.filterRFQData();
  }
  onCertificateChanged(item: any) {
    this.filterRFQData();
  }
  //row 1 end
  //row 2 start
  onMaterialChange(item: any) {
    this.filterRFQData();
  }
  onPostProcessChange(item: any) {
    this.filterRFQData();
  }
  buyerIndustryChangedHandler(item: any) {
    this.filterRFQData();
  }
  //row 2 ends
  //row 3 starts
  onProximityChange(item: any) {
    if(AppUtil.isEmptyString(item.id)){
      this.proximityselectedItems=[];
    }
    this.filterRFQData();
  }
  //row 3 ends
  setDefaultFilter() {
    if (this.sortByFilterValue === "quantity") {
      this.sortFilterValue = "high";
    }
    if (this.sortByFilterValue === "quoteby" || this.sortByFilterValue === "") {
      this.sortFilterValue = "Recent";
    }
    if (
      this.sortByFilterValue === "material" ||
      this.sortByFilterValue === "process" ||
      this.sortByFilterValue === "postprocess"
    ) {
      this.sortFilterValue = "A - Z";
    }
    this.filterRFQData();
  }
  filterSearchTextChange(e, isChanged = false) {
    if (e.which == 13 || isChanged) {
      this.filterRFQData();
    }
  }


  allDropDownSetting() {
    this.defaultFilterByList = [{ "key": "liked", "value": "Liked" },
    { "key": "followedBuyers", "value": "Followed Buyers" },
    { "key": "specialInvites", "value": "Special Invites" },
    { "key": "withoutQuotes", "value": "RFQ with No Quotes" },
    { "key": "withQuotes", "value": "RFQ with <3 Quotes" },
    { "key": "hidden", "value": "Hidden" }];
    this.defaultFilterByList.forEach(ele => {
      this.selectedDefaultFilterBy[ele["key"]] = false;
    })
    this.sortByList = [
      { "key": "NewestRFQ", "value": "Newest RFQ" },
      { "key": "OldestRFQ", "value": "Oldest RFQ" },
      { "key": "HighestQuantity", "value": "Highest Quantity" },
      { "key": "LowestQuantity", "value": "Lowest Quantity" },
      { "key": "EarliestQuoteDate", "value": "Earliest Quote Date" },
      { "key": "LatestQuoteDate", "value": "Latest Quote Date" },
      { "key": "EarliestDeliveryDate", "value": "Earliest Delivery Date" },
      { "key": "LatestDeliveryDate", "value": "Latest Delivery Date" }];

    this.processSettings = Object.assign({
      text: 'Select Process',
      searchPlaceholderText: 'Search Fields',
      labelKey: 'parentDisciplineName',
      primaryKey: 'parentDisciplineId'
    }, this.commonSettings);

    this.childProcessSettings = Object.assign({
      text: 'Select Technique',
      searchPlaceholderText: 'Search Fields',
      labelKey: 'childDisciplineName',
      primaryKey: 'childDisciplineId',
      disabled: true,
    }, this.commonSettings);

    this.materialsettings = Object.assign({
      text: 'Select Material',
      searchPlaceholderText: 'Search Material',
      labelKey: 'childMaterialName',
      primaryKey: 'childMaterialId'
    }, this.commonSettings);

    this.postProductionProcesssettings = Object.assign({
      text: 'Select Post Process',
      searchPlaceholderText: 'Search Post Process',
      labelKey: 'childPostProductionProcessName',
      primaryKey: 'childPostProductionProcessId',
    }, this.commonSettings);

    this.buyerIndustrySettings = Object.assign({
      text: 'Select Buyer Industry',
      searchPlaceholderText: 'Search Fields',
      labelKey: 'industryBranchesNameEn',
      primaryKey: 'industryBranchesId'
    }, this.commonSettings);
    this.certificatesettings = Object.assign({
      text: ' Select Certification',
      searchPlaceholderText: 'Search certification',
      labelKey: 'certificateCode',
      primaryKey: 'certificateId',

    }, this.commonSettings);

    this.proximitysettings = Object.assign(this.commonSettings, {
      enableCheckAll: false,
      text: 'Select Proximity',
      searchPlaceholderText: 'Search Proximity',
      labelKey: 'description',
      primaryKey: 'id',
      showCheckbox: false,
      singleSelection: true,
    });
    this.partSizeList = [
      { key: -1, value: "Select part Size" },
      { key: 0, value: "Small (< 10 inches or < 254 mm)" },
      { key: 1, value: "Large (> 10 inches or > 254 mm)" }];
  }

  toggleFilterDropdown() {
    this.isOpenFilterDropdown = !this.isOpenFilterDropdown;
  }

  toggleShortDropdown() {
    this.isOpenShortDropdown = !this.isOpenShortDropdown;
  }
  filterRFQData(displayActiveRFQListLoaded=true) {
    if (this.activeRFQListLoaded) {
      this.applyFilterCriteriaToList();
      return;
    }
    this.isLoader = true;
    const noData={data: [], totalRecords: 0, isError: false};;
    this.supplierService.loadAllActiveRFQForSupplier().subscribe(supplierActiveRFQResponse => {
     if(supplierActiveRFQResponse==null || supplierActiveRFQResponse["isError"]){
      this.toastr.error("Some unknown issue occuered");
      supplierActiveRFQResponse= noData
     }
     this.activeRFQResult = supplierActiveRFQResponse;
     this.activeRFQListLoaded = true;
     if(displayActiveRFQListLoaded){
      this.applyFilterCriteriaToList();
     }
     
      this.isLoader = false;
    }, error => {
      this.toastr.error("We are unable to provide respective reuslt at this moment");
      this.isLoader = false;
      this.activeRFQResult = noData;
    });
  }

  applyFilterCriteriaToList() {
    this.isLoader = true;
    let data = [];
    //row 1 started

    let selectedProcessIdList = []
    let selectedChildProcessIdList = []
    let selectedCertificateIdList = []
    if (AppUtil.isNotEmptyList(this.selectedProcessItems)) {
      this.selectedProcessItems.forEach(process => { selectedProcessIdList.push(process.parentDisciplineId.toString()) });
    }
    if (AppUtil.isNotEmptyList(this.selectedChildProcessItems)) {
      this.selectedChildProcessItems.forEach(childProcess => { selectedChildProcessIdList.push(childProcess.childDisciplineId.toString()) });
    }
    if (AppUtil.isNotEmptyList(this.selectedCertificationItems)) {
      this.selectedCertificationItems.forEach(certification => { selectedCertificateIdList.push(certification.certificateId.toString()) });
    }
    //row 1 ended
    //row 2 started
    let selectedMaterialsIdList = []
    let selectedPostProcessIdList = []
    let selectedBuyerIndustryIdList = []
    if (AppUtil.isNotEmptyList(this.materialselectedItems)) {
      this.materialselectedItems.forEach(childMaterial => { selectedMaterialsIdList.push(childMaterial.childMaterialId.toString()) });
    }
    if (AppUtil.isNotEmptyList(this.postProcessselectedItems)) {
      this.postProcessselectedItems.forEach(postProcess => { selectedPostProcessIdList.push(postProcess.childPostProductionProcessId.toString()) });
    }
    if (AppUtil.isNotEmptyList(this.selectedBuyerIndustry)) {
      this.selectedBuyerIndustry.forEach(industry => { selectedBuyerIndustryIdList.push(industry.industryBranchesId) });
    }
    //row 2 ends
    //row 3 started
    let selectedProximityIdList = []
    if (AppUtil.isNotEmptyList(this.proximityselectedItems)) {
      this.proximityselectedItems.forEach(proximity => { selectedProximityIdList.push(parseFloat(proximity.value)) });
    }
    let noneDefaultSelected = true;
    if (this.selectedDefaultFilterBy.liked ||
      this.selectedDefaultFilterBy.followedBuyers ||
      this.selectedDefaultFilterBy.specialInvites ||
      this.selectedDefaultFilterBy.withoutQuotes ||
      this.selectedDefaultFilterBy.withQuotes) {
      noneDefaultSelected = false;
    }
   
    data = this.activeRFQResult.data.filter(element => {
      //default filter match
      let isLikeFilterByMatched = false;
      let isFollowedBuyersFilterByMatched = false;
      let isSpecialInvitesFilterByMatched = false;
      let isWithoutQuotesFilterByMatched = false;
      let isWithQuotesFilterByMatched = false;


      let isSearchTextMatched = true;
      let searchTextMatcherArray = [];

      //row 1
      let isSelectedProcessItemsMatched = true;
      let isSelectedChildProcessItemsMatched = true;
      let isSelectedCertificationItemsMatched = true;
      let rfqPartProcessIdList = [];
      let rfqPartChildProcessIdList = [];

      //row 2
      let isSelectedMaterialItemsMatched = true;
      let isSelectedPostProcessItemsMatched = true;
      let isBuyerIndustryMatched = true;
      let rfqPartMaterialIdList = [];
      let rfqPartPostProcessIdList = [];
      //row 3
      let isProximityselectedItemsMatched = true;
      let isLargePartMatched = true;
      let isSelectedToleranceMatched = true;

      let rfqPartToleranceIdList = [];
      let rfqPartIsLargePartList = [];
      //sort by
      let totalQty1 = 0;
      let totalQty2 = 0;
      let totalQty3 = 0;
      let higherQuantity = 0;
      let lowerQuantity = 0;

      searchTextMatcherArray.push(element.rfqName.toLowerCase());
      searchTextMatcherArray.push(element.rfqId.toString());
      if (AppUtil.isNotEmptyString(element.rfqDescription)) {
        searchTextMatcherArray.push(element.rfqDescription.toString());
      }
      element.advancedRfqFilters.forEach(partObj => {
        /*search text like from parts start*/
        if (AppUtil.isNotEmptyString(partObj.parentPartCategoryName)) {
          searchTextMatcherArray.push(partObj.parentPartCategoryName.toString());
        }
        if (AppUtil.isNotEmptyString(partObj.partName)) {
          searchTextMatcherArray.push(partObj.partName.toString());
        }
        /*search text like from parts ends*/
        //row 1 started
        if (AppUtil.isNotEmptyNumber(partObj.processId)) {
          rfqPartProcessIdList.push(partObj.processId.toString());
        }
        if (AppUtil.isNotEmptyNumber(partObj.techniqueId)) {
          rfqPartChildProcessIdList.push(partObj.techniqueId);
        }
        //row 1 ended
        //row 2 started
        if (AppUtil.isNotEmptyNumber(partObj.materialId)) {
          rfqPartMaterialIdList.push(partObj.materialId.toString());
        }
        if (AppUtil.isNotEmptyNumber(partObj.postProcessId)) {
          rfqPartPostProcessIdList.push(partObj.postProcessId);
        }
        //row 2 ended
        rfqPartToleranceIdList.push(partObj.toleranceId);
        rfqPartIsLargePartList.push(partObj.isLargePartSize.toString());

        if (AppUtil.isNotEmptyNumber(partObj.qty1)) {
          totalQty1 += Number(partObj.qty1);
        }
        if (AppUtil.isNotEmptyNumber(partObj.qty2)) {
          totalQty2 += Number(partObj.qty2);
        }
        if (AppUtil.isNotEmptyNumber(partObj.qty3)) {
          totalQty3 += Number(partObj.qty3);
        }
      });
      if (totalQty1 > totalQty2 && totalQty1 > totalQty3) {
        higherQuantity = totalQty1;
        lowerQuantity = totalQty2 > totalQty3 ? totalQty2 : totalQty3
      } else if (totalQty2 > totalQty1 && totalQty2 > totalQty3) {
        higherQuantity = totalQty2;
        lowerQuantity = totalQty1 > totalQty3 ? totalQty1 : totalQty3
      } else {
        higherQuantity = totalQty3;
        lowerQuantity = totalQty1 > totalQty2 ? totalQty1 : totalQty1
      }
      if (lowerQuantity == 0) {
        lowerQuantity = higherQuantity;
      }
      element["higherQuantity"] = higherQuantity;
      element["lowerQuantity"] = lowerQuantity;

      //data matching main logic started

      if (this.selectedDefaultFilterBy.liked) {
        isLikeFilterByMatched = element.isRfqLike;
      }
      if (this.selectedDefaultFilterBy.followedBuyers) {
        isSpecialInvitesFilterByMatched = element.isFollowedBuyer;
      }
      if (this.selectedDefaultFilterBy.specialInvites) {
        isWithoutQuotesFilterByMatched = element.isSpecialInvite;
      }

      if (this.selectedDefaultFilterBy.withoutQuotes) {
        isWithoutQuotesFilterByMatched = element.noOfQuotes === 0;
      }
      if (this.selectedDefaultFilterBy.withQuotes) {
        isWithQuotesFilterByMatched = element.noOfQuotes < 3;
      }
      if (AppUtil.isNotEmptyString(this.searchText)) {
        isSearchTextMatched = false;
        const searchText = this.searchText.toLowerCase();
        searchTextMatcherArray.forEach(text => {
          if (text.includes(searchText)) {
            isSearchTextMatched = true;
          }
        });
      }

      //row 1 started
      if (AppUtil.isNotEmptyList(selectedProcessIdList)) {
        isSelectedProcessItemsMatched = rfqPartProcessIdList.filter(value => selectedProcessIdList.includes(value)).length > 0;
      }
      if (AppUtil.isNotEmptyList(selectedChildProcessIdList)) {
        isSelectedChildProcessItemsMatched = rfqPartChildProcessIdList.filter(value => selectedChildProcessIdList.includes(value.toString())).length > 0;
      }

      if (AppUtil.isNotEmptyList(selectedCertificateIdList)) {
        isSelectedCertificationItemsMatched = element.rfqCertifcateFilter.filter(value => selectedCertificateIdList.includes(value.certificateId.toString())).length > 0;
      }
      //row 1 ended

      //row 2 started
      if (AppUtil.isNotEmptyList(selectedMaterialsIdList)) {
        isSelectedMaterialItemsMatched = rfqPartMaterialIdList.filter(value => selectedMaterialsIdList.includes(value)).length > 0;
      }
      if (AppUtil.isNotEmptyList(selectedPostProcessIdList)) {
        isSelectedPostProcessItemsMatched = rfqPartPostProcessIdList.filter(value => selectedPostProcessIdList.includes(value.toString())).length > 0;
      }
      if (AppUtil.isNotEmptyList(selectedBuyerIndustryIdList)) {
        isBuyerIndustryMatched = selectedBuyerIndustryIdList.filter(value => value === element.buyerIndustryId).length > 0;
      }
      //row 2 ended

      //row 3 started
      if (AppUtil.isNotEmptyList(selectedProximityIdList)) {
        isProximityselectedItemsMatched = selectedProximityIdList.filter(value => element.distance == null ? false : value > element.distance).length > 0;
      }
      if (this.selectedPartSize != -1) {
        isLargePartMatched = rfqPartIsLargePartList.includes(this.selectedPartSize.toString());
      }
      if (this.selectedTolerance != -1) {
        isSelectedToleranceMatched = rfqPartToleranceIdList.filter(value => this.selectedTolerance === value.toString()).length > 0;
      }
      //row 3 ended
      let mactched = false;
      if (
        (
          isLikeFilterByMatched ||
          isFollowedBuyersFilterByMatched ||
          isSpecialInvitesFilterByMatched ||
          isWithoutQuotesFilterByMatched ||
          isWithQuotesFilterByMatched ||
          noneDefaultSelected) &&

        isSearchTextMatched &&

        isSelectedProcessItemsMatched &&
        isSelectedChildProcessItemsMatched &&
        isSelectedCertificationItemsMatched &&

        isSelectedMaterialItemsMatched &&
        isSelectedPostProcessItemsMatched &&
        isBuyerIndustryMatched &&

        isProximityselectedItemsMatched &&
        isLargePartMatched &&
        isSelectedToleranceMatched) {
        mactched = true;
      }
      if (this.selectedDefaultFilterBy.hidden) {
        if (noneDefaultSelected) {
          return mactched && element.isRfqDisLike === true
        } else {
          return mactched || element.isRfqDisLike === true
        }
      }
      return mactched && element.isRfqDisLike === false
    });
    data = data.sort((a, b) => { return this.sortRFQDisplayData(a, b) });
    const dataToSend = {
      "data": data,
      "totalRecords": data.length,
      "isError": false,
    };
    this.filterChangeEventHandler.emit(dataToSend);

    this.isCheckDisabledSavebtn();
    this.isLoader = false;
  }
  sortRFQDisplayData(a: any, b: any): number {

    switch (this.selectedSortBy.key) {
      case "NewestRFQ": {
        return new Date(b["releaseDate"]).getTime() - new Date(a["releaseDate"]).getTime();
      }
      case "OldestRFQ": {
        return new Date(a["releaseDate"]).getTime() - new Date(b["releaseDate"]).getTime();
      }
      case "HighestQuantity": {
        return b.higherQuantity - a.higherQuantity;
      }
      case "LowestQuantity": {
        return a.lowerQuantity - b.lowerQuantity;
      }
      case "EarliestQuoteDate": {
        return new Date(a["quotesNeededBy"]).getTime() - new Date(b["quotesNeededBy"]).getTime();
      }
      case "LatestQuoteDate": {
        return new Date(b["quotesNeededBy"]).getTime() - new Date(a["quotesNeededBy"]).getTime();
      }
      case "EarliestDeliveryDate": {
        return new Date(a["deliveryDate"]).getTime() - new Date(b["deliveryDate"]).getTime();
      }
      case "LatestDeliveryDate": {
        return new Date(b["deliveryDate"]).getTime() - new Date(a["deliveryDate"]).getTime();
      }
    }
    return 0;
  }

  sortByClickHandler(sortBy) {
    this.selectedSortBy = sortBy;
    this.toggleShortDropdown();
    this.filterRFQData();
  }

  defaultFilterByChanged(defaultFilterBy) {

    if (defaultFilterBy.savedSearchId) {
      const tempSelectedDefaultFilterBy = this.selectedDefaultFilterBy;
      const tempSelectedFilterBy = this.selectedFilterBy;
      const searchText = this.searchText
      this.clearAll();
      this.selectedFilterBy = tempSelectedFilterBy
      this.selectedDefaultFilterBy = tempSelectedDefaultFilterBy;
      this.searchText = searchText;
      this.applyFilterCriteriaToList();
      this.openDefaultFilterChips(false)
      return;
    }
    const key = defaultFilterBy["key"];
    this.selectedDefaultFilterBy[key] = !this.selectedDefaultFilterBy[key];
    this.applyFilterCriteriaToList();
    this.openDefaultFilterChips(false)
  }

  openDefaultFilterChips(isNotFromToggleDropdown = true) {
    this.selectedFilterBy = [];
    if (AppUtil.isNotEmptyString(this.searchFilterName)) {
      this.selectedFilterBy.push({ savedSearchId: this.selectedItems, value: this.searchFilterName });
    }
    this.defaultFilterByList.forEach(defaultFilter => {
      if (this.selectedDefaultFilterBy[defaultFilter.key]) {
        this.selectedFilterBy.push(defaultFilter);
      }
    });

    if (this.selectedFilterBy.length > 0) {
      this.defaultFilterChipsOpened = true;
      return;
    } else {
      this.defaultFilterChipsOpened = false;
    }
    if (isNotFromToggleDropdown) {
      this.toggleFilterDropdown();
    }
  }
  advancedFiltersClicked() {
    this.isShowAdvance = !this.isShowAdvance;
    this.isOpenFilterDropdown = false;
    this.isOpenShortDropdown = false;
  }

  hideFilterBySection() {
    this.isOpenFilterDropdown = false;
  }
  hideSortBySection() {
    this.isOpenShortDropdown = false;
  }

  selectSaveSearch(option) {
    if (this.selectedItems !== option.savedSearchId) {
      this.selectSaveSearchClicked = true;
      this.selectedItems = option.savedSearchId;
      this.searchFilterName = option.searchFilterName;
      this.isLoader = true;
      this.supplierService.getMyRfqSavedSearchDetail(this.selectedItems).subscribe(
        result => {
          this.isLoader = false;
          if (!result.isError) {
            this.openDefaultFilterChips();
            this.updateAdvanceFilterSection(result.data);
          }
        }, this.handleError
      );

    }
  }
  updateAdvanceFilterSection(savedData) {
    this.selectedSearchCriteriaData = savedData;
    this.selectedProcessItems = this.populateDropdownSelection(savedData, 'parentPartCategoryIdList', 'iCustomProcessViewModelColl', 'parentDisciplineId');
    this.selectedChildProcessItems = [];
    if (AppUtil.isNotEmptyList(this.selectedProcessItems)) {
      this.getSupplierChildProcesses(savedData);
    }
    this.selectedCertificationItems = this.populateDropdownSelection(savedData, 'certificateIdList', 'iCertificationViewModelColl', 'certificateId');

    this.materialselectedItems = this.populateDropdownSelection(savedData, 'materialIdList', 'iMaterialViewModelColl', 'childMaterialId');
    this.postProcessselectedItems = this.populateDropdownSelection(savedData, 'postProcessIdList', 'iPostProductionViewModelColl', 'childPostProductionProcessId');
    this.selectedBuyerIndustry = this.populateDropdownSelection(savedData, 'buyerIndustryIdList', 'buyerTypeViewModelColl', 'industryBranchesId');

    this.proximityselectedItems = this.populateDropdownSelection(savedData, 'proximityIdList', 'iProximityColl', 'id');
    this.selectedPartSize = savedData.isLargePart == null ? -1 : savedData.isLargePart ? 1 : 0;

    const selectedToleranceList = this.populateDropdownSelection(savedData, 'toleranceIdList', 'iToleranceColl', 'id');
    let selectedTolerance = -1;
    if (selectedToleranceList.length > 0) {
      selectedTolerance = selectedToleranceList[0]["id"];
    }
    this.selectedTolerance = selectedTolerance;
    this.applyFilterCriteriaToList();

  }
  populateDropdownSelection(savedData, savedDataKey, modelData, modelDataIdKey) {
    let temp = []
    if (AppUtil.isEmptyList(savedData[savedDataKey])) {
      savedData[savedDataKey] = [];
    }
    savedData[savedDataKey].forEach(element => {
      let data = this[modelData].find(x => x[modelDataIdKey] === element);
      if (data) {
        temp.push(data);
      }
    })
    return temp;
  }
  updateFilterData(data?){
    this.activeRFQListLoaded = false;
    this.filterRFQData();
  }
  ngOnDestroy(): void {
    localStorage.setItem('isBack', 'false');
  }
}