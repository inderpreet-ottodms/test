import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import {
  ICustomProcessViewModel,
  ICustomSelectionProcessViewModel,
  ISavedSearchViewModel
} from '../../core/models/rfqModel';
import {
  IProcessesViewModel,
  IManufacturerDashboardViewModel
} from '../../core/models/supplierProfileModel';
import {
  ToastrService
} from 'ngx-toastr';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  ProfileService
} from '../../core/services/profile/profile.service';
import {
  Subscription
} from 'rxjs';
import { AccountService } from '../../core/services/account/account.service';
import { RFQFilter } from '../rfq/_filter/rfq-filter/rfqFilterModel';

@Component({
  selector: 'app-rfq-capability',
  templateUrl: './rfq-capability.component.html',
  styleUrls: ['./rfq-capability.component.scss'],

})
export class RfqCapabilityComponent implements OnInit, OnDestroy {

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
  accountType: string;
  iProfileSetModel: IManufacturerDashboardViewModel;
  numberOfCategory:number;
  @Input('toSetLocalStore') toSetLocalStore: any;
  @ViewChild('rfqCapabilityModel', { static: false }) editModal: TemplateRef < any > ; // Note: TemplateRef
  @ViewChild('rfqCapabilityConfirmationModel', { static: false }) confirmModal: TemplateRef < any > ; // Note: TemplateRef


  modalSubscription: Subscription;
  modalSwitchSubscription: Subscription;
  modelConfirmRef: any;
  subHeaderText:any={};
  confirmationText:any={};
  // tslint:disable-next-line:max-line-length
  constructor(private _toastr: ToastrService, private _rfqService: RfqService, private _accountService: AccountService,
     private modalService: NgbModal, private _SupplierService: SupplierService, private _profileService: ProfileService, ) {}

  ngOnInit() {
 /**
   * Sub header text of rfq capability component
   */


    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      contactId: this.loggedId,
      isCompanyAddress: null,
      isPublishProfile: null
    };
    this.isloading = true;
    this.display = false;
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
   
    this.accountType = localStorage.getItem('AccountType');
    this.modalSwitchSubscription=this._profileService.getopenSwitchRfqCapabilityModel().subscribe(
      response => {
        // debugger;
        if(response) {
          this._profileService.setopenSwitchRfqCapabilityModel(false);
        }
      })

    this.modalSubscription = this._profileService.getOpenRfqCapabilityModel().subscribe(
      response => {
        // debugger;
        localStorage.removeItem('isSubscription');
        if (response.isOpenRfqCapabilityModel) {
          this.accountType = localStorage.getItem('AccountType');
          if (this.accountType == 'Gold' || this.accountType == 'Platinum') {
            this._profileService.setOpenRfqCapabilityModel({
              "numberOfCategory": 0,
              "isOpenRfqCapabilityModel": false
            });
          }
        }
      }
    );


    let isSubscription = JSON.parse(localStorage.getItem('isSubscription'));
    if(isSubscription == undefined || isSubscription == null || isSubscription == '' || isSubscription == false) {
    }
  }

  openModal() {
    if(this.modelRef === undefined || this.modelRef === null ){
      this.modelRef = this.modalService.open(this.editModal, {
        backdrop: 'static',
        size: 'lg',
        keyboard:false
      });
    }
  }
  openConfirmModel() {
    this.modelConfirmRef = this.modalService.open(this.confirmModal, {
      backdrop: 'static',
      windowClass: 'dark-modal',
    });
  }
  closeConfirmModel() {
    this.modelConfirmRef.close();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    if(localStorage.getItem('LoggedId') !=undefined) {
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }


  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    if(localStorage.getItem('loggedCompanyId') !=undefined) {
    return parseInt(localStorage.getItem('loggedCompanyId'));
    } else {
      return 0;
    }
  }
  disabledCapabilityBtn() {
    // let accountType = localStorage.getItem('AccountType');
    if (this.accountType != undefined && this.accountType != null && this.accountType != '') {
      if (this.accountType == 'Gold') {
        if (this.selectedProcessParent.length && this.selectedProcessParent.length == this.numberOfCategory) {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.selectedProcessParent.length) {
          return false;
        } else {
          return true;
        }
      }
    }

  }
  setCapability(status) {
    const ids = [];

    this.iCustomProcessViewModelSelectionColl.forEach(element => {
      if (element.sisSelected === true) {
        ids.push(element.schildDisciplineId);
      }
    });
    this.iSavedSearchViewModel.partCategoryIdList = ids;
    this.iSavedSearchViewModel.contactId = this.loggedId;
      this.iSavedSearchViewModel.searchFilterName= 'My Capabilities';

    this.iProcessesViewModel.companyId = this.loggedCompanyId;
    this.iProcessesViewModel.partCategoryId = ids;
    this._SupplierService.updateStripeCapabilities(this.iProcessesViewModel).subscribe(
      result => {
        this.iProcessesViewModel = result;
        if (result['result'] === true) {
          this._toastr.success(this.iProcessesViewModel.errorMessage, 'Success!');
          this.modelConfirmRef.close();
          this.modelRef.close();
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
    this.setProfileStatus();

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
        this.iCustomProcessViewModelOriColl = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');
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
            const data = this.iCustomProcessViewModelOriColl.find(m => m.childDisciplineId === partent.childDisciplineId);
            if (data !== undefined) {
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
   this.modalSubscription.unsubscribe();
   this.modalSwitchSubscription.unsubscribe();
   localStorage.removeItem('isSubscription');
    if(this.modelRef !== undefined && this.modelRef !== null && this.modelRef !== '' ){
      this.modelRef.close();
    }
  }
}
