import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  ICustomProcessViewModel,
  ICustomProcessViewModelForCapa
} from '../../../../../core/models/rfqModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  ICertificationViewModel,
  IMaterialViewModel,
  IIndustriesModel,
  IMaterialViewModelForEdit,
  IIndustryBranchesModel
} from '../../../../../core/models/globalMaster';
import {
  IProcessesViewModel,
  IFocusOverViewModel,
  IFocusOverViewModelEdit,
  IToleranceViewModel,
  IndustryFocusList
} from '../../../../../core/models/supplierProfileModel';
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
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'app-edit-capabilities',
  templateUrl: './edit-capabilities.component.html',
  styleUrls: ['./edit-capabilities.component.scss']
})
export class EditCapabilitiesComponent implements OnInit {

  focusForm: FormGroup;
  iProcessesViewModel: IProcessesViewModel;
  iContactViewModel: IContactViewModel;
  iFocusOverViewModel: IFocusOverViewModel;
  iMaterialViewModel: IMaterialViewModel;
  iIndustryBranchesModelColl: IIndustryBranchesModel[];
  iMaterialViewModelForEdit: IMaterialViewModelForEdit;
  iMaterialViewModelForEditColl1: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl2: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl10: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl3: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl4: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl5: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl6: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl7: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl8: IMaterialViewModelForEdit[];
  iMaterialViewModelForEditColl9: IMaterialViewModelForEdit[];

  iMaterialViewModelColl: IMaterialViewModel[];
  iMaterialViewModelCollById: IMaterialViewModel[];
  iIndustriesModel: IIndustriesModel[];
  iToleranceViewModelColl: IToleranceViewModel[];
  iFocusOverViewModelEdit: IFocusOverViewModelEdit;
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iCustomProcessViewModelCollExisting: ICustomProcessViewModel[];
  iCertificationViewModelColl: ICertificationViewModel[];
  iCustomProcessViewModelCollChildColl1: ICustomProcessViewModel[];
  iCustomProcessViewModelCollChildColl2: ICustomProcessViewModel[];
  iCustomProcessViewModelCollChildColl3: ICustomProcessViewModel[];
  iCustomProcessViewModelCollChildColl4: ICustomProcessViewModel[];
  iCustomProcessViewModelCollChildColl5: ICustomProcessViewModel[];
  iCustomProcessViewModelForCapa: ICustomProcessViewModelForCapa;

  iCustomProcessViewModelForCapaColl1: ICustomProcessViewModelForCapa[];
  iCustomProcessViewModelForCapaColl2: ICustomProcessViewModelForCapa[];
  iCustomProcessViewModelForCapaColl3: ICustomProcessViewModelForCapa[];
  iCustomProcessViewModelForCapaColl4: ICustomProcessViewModelForCapa[];
  iCustomProcessViewModelForCapaColl5: ICustomProcessViewModelForCapa[];

  materialsettings = {};

  parentProcess: any;processDiv1: boolean;processDiv2: boolean;processDiv3: boolean;processDiv4: boolean;
  processDiv5: boolean;industryDiv1: boolean;industryDiv2: boolean;industryDiv3: boolean;
  industryDiv4: boolean;industryDiv5: boolean;
  selectedIndustry1: number;selectedIndustry2: number;selectedIndustry3: number;selectedIndustry4: number;
  selectedIndustry5: number;tolenrance: number;
  industry1Focused: boolean;industry2Focused: boolean;industry3Focused: boolean;industry4Focused: boolean;
  industry5Focused: boolean;tolenranceFocused: boolean;
  material1Focused: boolean;material2Focused: boolean;material3Focused: boolean;material4Focused: boolean;
  material5Focused: boolean;material6Focused: boolean;material7Focused: boolean;material8Focused: boolean;
  material9Focused: boolean;material10Focused: boolean;
  parentMaterial: any;isLoader: boolean;
  selectedMaterial: any[] = [];
  materialDiv1: boolean;materialDiv2: boolean;materialDiv3: boolean;materialDiv4: boolean;
  materialDiv5: boolean;materialDiv6: boolean;materialDiv7: boolean;materialDiv8: boolean;
  materialDiv9: boolean;materialDiv10: boolean;

  selectedMaterial1: string;selectedMaterial2: string;selectedMaterial3: string;selectedMaterial4: string;
  selectedMaterial5: string;selectedMaterial6: string;selectedMaterial7: string;selectedMaterial8: string;
  selectedMaterial9: string;selectedMaterial10: string;materialselectedItems = [];

  parentCertificate1: string;parentCertificate2: string;parentCertificate3: string;parentCertificate4: string;
  parentCertificate5: string;
  industryFocusList: IndustryFocusList;
  isSaveBtnDisabled: boolean = false;
  isButtonClicked: boolean = false;

  @Output () profileChanges = new EventEmitter();

  constructor(private _SupplierService: SupplierService, private _rfqService: RfqService,
    private _masterService: MasterService, private _profileService: ProfileService,
    private _toastr: ToastrService) {
    this.isLoader = true;
    this.parentCertificate1 = 'Please select Process';
    this.parentCertificate2 = 'Please select Process';
    this.parentCertificate3 = 'Please select Process';
    this.parentCertificate4 = 'Please select Process';
    this.parentCertificate5 = 'Please select Process';
    this.tolenrance = 0;


    this.selectedIndustry1 = 0;
    this.selectedIndustry2 = 0;
    this.selectedIndustry3 = 0;
    this.selectedIndustry4 = 0;
    this.selectedIndustry5 = 0;
    this.industryDiv1 = true;
    this.industryDiv2 = false;
    this.industryDiv3 = false;
    this.industryDiv4 = false;
    this.industryDiv5 = false;
    this.industry1Focused = false;
    this.industry2Focused = false;
    this.industry3Focused = false;
    this.industry4Focused = false;
    this.industry5Focused = false;
    this.tolenranceFocused = false;
    this.material1Focused = false;
    this.material2Focused = false;
    this.material3Focused = false;
    this.material4Focused = false;
    this.material5Focused = false;
    this.material6Focused = false;
    this.material7Focused = false;
    this.material8Focused = false;
    this.material9Focused = false;
    this.material10Focused = false;

    this.materialselectedItems = [];
    this.selectedMaterial1 = '';
    this.selectedMaterial2 = '';
    this.selectedMaterial3 = '';
    this.selectedMaterial4 = '';
    this.selectedMaterial5 = '';
    this.selectedMaterial6 = '';
    this.selectedMaterial7 = '';
    this.selectedMaterial8 = '';
    this.selectedMaterial9 = '';
    this.selectedMaterial10 = '';

    this.parentProcess = [];
    this.processDiv1 = true;
    this.processDiv2 = false;
    this.processDiv3 = false;
    this.processDiv4 = false;
    this.processDiv5 = false;

    this.materialDiv1 = true;
    this.materialDiv2 = false;
    this.materialDiv3 = false;
    this.materialDiv4 = false;
    this.materialDiv5 = false;
    this.materialDiv6 = false;
    this.materialDiv7 = false;
    this.materialDiv8 = false;
    this.materialDiv9 = false;
    this.materialDiv10 = false;

    this.iCustomProcessViewModelForCapaColl1 = [];
    this.iCustomProcessViewModelForCapaColl2 = [];
    this.iCustomProcessViewModelForCapaColl3 = [];
    this.iCustomProcessViewModelForCapaColl4 = [];
    this.iCustomProcessViewModelForCapaColl5 = [];


    this.iMaterialViewModelForEditColl1 = [];
    this.iMaterialViewModelForEditColl2 = [];
    this.iMaterialViewModelForEditColl3 = [];
    this.iMaterialViewModelForEditColl4 = [];
    this.iMaterialViewModelForEditColl5 = [];
    this.iMaterialViewModelForEditColl6 = [];
    this.iMaterialViewModelForEditColl7 = [];
    this.iMaterialViewModelForEditColl8 = [];
    this.iMaterialViewModelForEditColl9 = [];
    this.iMaterialViewModelForEditColl10 = [];
    this.iMaterialViewModelCollById = [];
    this.initMaterialEditModel();
  }
  initMaterialEditModel() {
    this.iMaterialViewModelForEdit = {
      childMaterialId: 0,
      childMaterialName: '',
      parentMaterialId: 0,
      parentMaterialName: '',
      isSelected: false
    };
  }

  initModel() {
    this.iCustomProcessViewModelForCapa = {
      childDisciplineId: 0,
      childDisciplineName: '',
      isSelected: false,
      parentDisciplineId: 0,
      parentDisciplineName: ''
    };
    this.iFocusOverViewModel = {
      industryFocusList: null,
      tolerance: ''
    };
    this.industryFocusList = {
      industryFocus: '',
      industryFocusId: 0
    }
    this.iMaterialViewModel = {
      childMaterialId: 0,
      childMaterialName: '',
      parentMaterialId: 0,
      parentMaterialName: ''
    };
    this.iFocusOverViewModelEdit = {
      industryFocus: [],
      industryFocusId: [],
      materialId: [],
      tolerance: '',
      companyId: 0,
      errorMessage: '',
      result: false,
      toleranceId: 0
    };
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
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      comments: '',
      isLoginFromVision: false,
      contactIdEncrypt: '',
      companyId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      token: '',
      incotermId: 0,
      industry: '',
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: true,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: '',
      linkedIn: '',
      modifiedOn: '',
      password: '',
      phoneNo: '',
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: '',
      tweeter: '',
      userId: '',
      contactPictureFile: '',
      logoOfCompany: '',
      language: null,
      address: null,
      company: null,
      isVarified: false,
      expiration: null,
      currentPassword: '',
      newPassword: '',
      isRFQCreated: false,
      grantType: '',
      refreshToken: '',
      googleImageUrl: '',
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };
  }
  ngOnInit() {
    this.initModel();
    this.initProcessViewModel();
    this.GetProfileDetailsLocally();
    this.getIndustryType();
    this.getTolerance();
    this.getMaterial();
    this.getFocusOverview();
  }
  onMaterialSelect(item: any) {
    this.selectedMaterial1 = item.childMaterialId;
  }
  get loggedcompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  getFocusOverview() {
    this._SupplierService.getFocusOverview(this.loggedcompanyId).subscribe(
      result => {
        this.iFocusOverViewModelEdit = result['data'];
        if (result['data'].materialId == null) {
          this.iFocusOverViewModelEdit.materialId = [];
        }
        this.iFocusOverViewModelEdit.industryFocusId = [];
        if (result['data'].industryFocusList != null && result['data'].industryFocusList.length != 0) {
          result['data'].industryFocusList.forEach((element, index) => {
            if (index == 0) {
              this.selectedIndustry1 = element.industryFocusId;
            } else if (index == 1) {
              this.selectedIndustry2 = element.industryFocusId;
              this.industryDiv2 = true;
            } else if (index == 2) {
              this.selectedIndustry3 = element.industryFocusId;
              this.industryDiv3 = true;
            } else if (index == 3) {
              this.selectedIndustry4 = element.industryFocusId;
              this.industryDiv4 = true;
            } else if (index == 4) {
              this.selectedIndustry5 = element.industryFocusId;
              this.industryDiv5 = true;
            }

          })
        }
        this.tolenrance = this.iFocusOverViewModelEdit.toleranceId;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );

  }
  getParentMaterial() {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!this.iMaterialViewModelColl) {
      return null;
    }
    const property = 'parentMaterialName';
    const groupedCollection = this.iMaterialViewModelColl.reduce((previous, current) => {
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
  getMaterial() {
    this._rfqService.getParentMaterial().subscribe(
      result => {
        this.iMaterialViewModelColl = result['data'];
        this.getParentMaterialofCompany();

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getParentMaterialofCompany() {

    this._SupplierService.getParentMaterialofCompany(this.loggedcompanyId).subscribe(
      result => {
        this.iMaterialViewModelCollById = result['data'];
        if (this.iMaterialViewModelCollById != null && this.iMaterialViewModelCollById.length != 0) {
          this.selectedMaterial1 = this.iMaterialViewModelCollById[0].parentMaterialName;
          this.iMaterialViewModelCollById.forEach(element => {
            this.selectedMaterial.push(element);
          })
          this.getChildMaterial1();
          this.addChildMaterial1();
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  getChildMaterial1() {
    this.iMaterialViewModelForEditColl1 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial1) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl1.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });

    this.materialsettings = {
      singleSelection: false,
      text: 'All Processes',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      labelKey: 'childMaterialName',
      primaryKey: 'childMaterialId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 1,
      maxHeight: 200,
      showCheckbox: true,
      classes: 'myBoldClass',
      enableCheckAll: false
    };
  }
  getChildMaterial2() {
    this.iMaterialViewModelForEditColl2 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial2) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl2.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial3() {
    this.iMaterialViewModelForEditColl3 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial3) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl3.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial4() {
    this.iMaterialViewModelForEditColl4 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial4) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl4.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial5() {
    this.iMaterialViewModelForEditColl5 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial5) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl5.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial6() {
    this.iMaterialViewModelForEditColl6 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial6) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl6.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial7() {
    this.iMaterialViewModelForEditColl7 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial7) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl7.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial8() {
    this.iMaterialViewModelForEditColl8 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial8) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl8.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial9() {
    this.iMaterialViewModelForEditColl9 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial9) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl9.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }
  getChildMaterial10() {
    this.iMaterialViewModelForEditColl10 = [];
    this.iMaterialViewModelColl.forEach(element => {
      if (element.parentMaterialName === this.selectedMaterial10) {
        this.iMaterialViewModelForEdit.childMaterialId = element.childMaterialId;
        this.iMaterialViewModelForEdit.childMaterialName = element.childMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialName = element.parentMaterialName;
        this.iMaterialViewModelForEdit.parentMaterialId = element.parentMaterialId;
        this.iMaterialViewModelForEdit.isSelected = false;
        this.iMaterialViewModelForEditColl10.push(this.iMaterialViewModelForEdit);
        this.initMaterialEditModel();
      }
    });
  }



  addIndustry2() {
    this.industryDiv2 = true;
  }
  addIndustry3() {
    this.industryDiv3 = true;
  }
  addIndustry4() {
    this.industryDiv4 = true;
  }
  addIndustry5() {
    this.industryDiv5 = true;
  }

  removeIndustry2() {
    this.industryDiv2 = false;
    this.selectedIndustry2 = 0;
  }
  removeIndustry3() {
    this.industryDiv3 = false;
    this.selectedIndustry3 = 0;
  }
  removeIndustry4() {
    this.industryDiv4 = false;
    this.selectedIndustry4 = 0;
  }
  removeIndustry5() {
    this.industryDiv5 = false;
    this.selectedIndustry5 = 0;
  }





  addProcess2() {
    this.processDiv2 = true;
  }
  addProcess3() {
    this.processDiv3 = true;
  }
  addProcess4() {
    this.processDiv4 = true;
  }
  addProcess5() {
    this.processDiv5 = true;
  }

  addMaterial2() {
    this.materialDiv2 = true;
  }
  addMaterial3() {
    this.materialDiv3 = true;
  }
  addMaterial4() {
    this.materialDiv4 = true;
  }
  addMaterial5() {
    this.materialDiv5 = true;
  }
  addMaterial6() {
    this.materialDiv6 = true;
  }
  addMaterial7() {
    this.materialDiv7 = true;
  }
  addMaterial8() {
    this.materialDiv8 = true;
  }
  addMaterial9() {
    this.materialDiv9 = true;
  }
  addMaterial10() {
    this.materialDiv10 = true;
  }
  removeProcess2() {
    this.iCustomProcessViewModelForCapaColl2 = [];
    this.processDiv2 = false;
    this.parentCertificate2 = '';
  }
  removeProcess3() {
    this.iCustomProcessViewModelForCapaColl3 = [];
    this.processDiv3 = false;
    this.parentCertificate3 = '';
  }
  removeProcess4() {
    this.iCustomProcessViewModelForCapaColl4 = [];
    this.processDiv4 = false;
    this.parentCertificate4 = '';
  }
  removeProcess5() {
    this.iCustomProcessViewModelForCapaColl5 = [];
    this.processDiv5 = false;
    this.parentCertificate5 = '';
  }

  removeMaterial2() {
    this.iMaterialViewModelForEditColl2 = [];
    this.materialDiv2 = false;
    this.selectedMaterial2 = '';
  }
  removeMaterial3() {
    this.iMaterialViewModelForEditColl3 = [];
    this.materialDiv3 = false;
    this.selectedMaterial3 = '';
  }
  removeMaterial4() {
    this.iMaterialViewModelForEditColl3 = [];
    this.materialDiv4 = false;
    this.selectedMaterial4 = '';
  }
  removeMaterial5() {
    this.iMaterialViewModelForEditColl5 = [];
    this.materialDiv5 = false;
    this.selectedMaterial5 = '';
  }
  removeMaterial6() {
    this.iMaterialViewModelForEditColl6 = [];
    this.materialDiv6 = false;
    this.selectedMaterial6 = '';
  }
  removeMaterial7() {
    this.iMaterialViewModelForEditColl7 = [];
    this.materialDiv7 = false;
    this.selectedMaterial8 = '';
  }
  removeMaterial8() {
    this.iMaterialViewModelForEditColl8 = [];
    this.materialDiv8 = false;
    this.selectedMaterial8 = '';
  }
  removeMaterial9() {
    this.iMaterialViewModelForEditColl9 = [];
    this.materialDiv9 = false;
    this.selectedMaterial9 = '';
  }
  removeMaterial10() {
    this.iMaterialViewModelForEditColl10 = [];
    this.materialDiv10 = false;
    this.selectedMaterial10 = '';
  }
  isCompanyFocus() {
    return this._SupplierService.get('companyFocus');
  }
  isCompanyCatagories() {
    return this._SupplierService.get('companyCatagories');
  }
  closePartDrawer(isCancled ? ) {
    if (isCancled) {
      this._SupplierService.set(true, 'editHeaderCancelWarning');
    } else {
      this._SupplierService.set(false, 'supplierSidePanel');
      this._SupplierService.set(false, 'contactUsEdit');
      this._SupplierService.set(false, 'aboutUsEdit');
      this._SupplierService.set(false, 'capabilitiesEdit');

      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
  }
  getCertificateList() {
    this._masterService.getCertificate(null).subscribe(
      result => {
        this.iCertificationViewModelColl = result['data'];
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  getProcess() {
    this.isLoader = true;
    if (this.iCustomProcessViewModelColl === undefined) {
      this._rfqService.getParentProcesses2().subscribe(
        result => {
          const data = result['data'];
          this.iCustomProcessViewModelColl = data.filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');
          // this.iCustomProcessViewModelColl = result['data'];
          if (this.iCustomProcessViewModelColl.length > 0) {
            this.getCapabilities();
          }
          // this.getChildProcess1();
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }

  }
  getIndustryType() {
    this._masterService.GetIndustryBranches().subscribe(
      (data: IIndustryBranchesModel[]) => {
        this.iIndustryBranchesModelColl = data['data'];
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getTolerance() {
    this._masterService.getTolerance().subscribe(
      (data: IToleranceViewModel[]) => {
        this.iToleranceViewModelColl = data['data'];
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getChildProcess1() {
    this.iCustomProcessViewModelForCapaColl1 = [];
    this.iCustomProcessViewModelColl.forEach(element => {
      if (element.parentDisciplineName === this.parentCertificate1) {
        this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
        this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
        this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
        this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
        this.iCustomProcessViewModelForCapa.isSelected = false;
        this.iCustomProcessViewModelForCapaColl1.push(this.iCustomProcessViewModelForCapa);
        this.initModel();
      }
    });
  }
  getChildProcess2(parentCertificate) {
    this.iCustomProcessViewModelForCapaColl2 = [];
    this.iCustomProcessViewModelColl.forEach(element => {
      if (element.parentDisciplineName === this.parentCertificate2) {
        this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
        this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
        this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
        this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
        this.iCustomProcessViewModelForCapa.isSelected = false;
        this.iCustomProcessViewModelForCapaColl2.push(this.iCustomProcessViewModelForCapa);
        this.initModel();
      }
    });
  }
  getChildProcess3(parentCertificate) {
    this.iCustomProcessViewModelForCapaColl3 = [];
    this.iCustomProcessViewModelColl.forEach(element => {
      if (element.parentDisciplineName === this.parentCertificate3) {
        this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
        this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
        this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
        this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
        this.iCustomProcessViewModelForCapa.isSelected = false;
        this.iCustomProcessViewModelForCapaColl3.push(this.iCustomProcessViewModelForCapa);
        this.initModel();
      }
    });
  }
  getChildProcess4(parentCertificate) {
    this.iCustomProcessViewModelForCapaColl4 = [];
    this.iCustomProcessViewModelColl.forEach(element => {
      if (element.parentDisciplineName === this.parentCertificate4) {
        this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
        this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
        this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
        this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
        this.iCustomProcessViewModelForCapa.isSelected = false;
        this.iCustomProcessViewModelForCapaColl4.push(this.iCustomProcessViewModelForCapa);
        this.initModel();
      }
    });
  }
  getChildProcess5(parentCertificate) {
    this.iCustomProcessViewModelForCapaColl5 = [];
    this.iCustomProcessViewModelColl.forEach(element => {
      if (element.parentDisciplineName === this.parentCertificate5) {
        this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
        this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
        this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
        this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
        this.iCustomProcessViewModelForCapa.isSelected = false;
        this.iCustomProcessViewModelForCapaColl5.push(this.iCustomProcessViewModelForCapa);
        this.initModel();
      }
    });
  }
  checkForProcess1() {
    if (this.parentCertificate1) {
      const count = this.iCustomProcessViewModelForCapaColl1.filter(m => m.isSelected === true).length;
      if (count === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkForProcess2() {
    if (this.parentCertificate2) {
      const count = this.iCustomProcessViewModelForCapaColl2.filter(m => m.isSelected === true).length;
      if (count === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkForProcess3() {
    if (this.parentCertificate3) {
      const count = this.iCustomProcessViewModelForCapaColl3.filter(m => m.isSelected === true).length;
      if (count === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkForProcess4() {
    if (this.parentCertificate4) {
      const count = this.iCustomProcessViewModelForCapaColl4.filter(m => m.isSelected === true).length;
      if (count === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkForProcess5() {
    if (this.parentCertificate5) {
      const count = this.iCustomProcessViewModelForCapaColl5.filter(m => m.isSelected === true).length;
      if (count === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  addChildProcess1(childId) {
    const oro = this.iCustomProcessViewModelForCapaColl1.find(m => m.childDisciplineId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildProcess2(childId) {
    const oro = this.iCustomProcessViewModelForCapaColl2.find(m => m.childDisciplineId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildProcess3(childId) {
    const oro = this.iCustomProcessViewModelForCapaColl3.find(m => m.childDisciplineId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildProcess4(childId) {
    const oro = this.iCustomProcessViewModelForCapaColl4.find(m => m.childDisciplineId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildProcess5(childId) {
    const oro = this.iCustomProcessViewModelForCapaColl5.find(m => m.childDisciplineId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }

  addChildMaterial1() {

    for (let i = 0; i < this.iMaterialViewModelForEditColl1.length; i++) {
      if (this.selectedMaterial.length) {
        const oro = this.selectedMaterial.find(m => m['childMaterialId'] === this.iMaterialViewModelForEditColl1[i]['childMaterialId']);
        // for (let  i = 0; i < this.selectedMaterial.length; i++) {
        //   const oro = this.iMaterialViewModelForEditColl1.find(m => m.childMaterialId ===  this.selectedMaterial[i]['childMaterialId']);
        if (oro) {
          this.iMaterialViewModelForEditColl1[i].isSelected = true;
        } else {
          this.iMaterialViewModelForEditColl1[i].isSelected = false;
        }
      } else {
        this.iMaterialViewModelForEditColl1[i].isSelected = false;
      }
    }

  }
  addChildMaterial2(childId) {
    const oro = this.iMaterialViewModelForEditColl2.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial3(childId) {
    const oro = this.iMaterialViewModelForEditColl3.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial4(childId) {
    const oro = this.iMaterialViewModelForEditColl4.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial5(childId) {
    const oro = this.iMaterialViewModelForEditColl5.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial6(childId) {
    const oro = this.iMaterialViewModelForEditColl6.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial7(childId) {
    const oro = this.iMaterialViewModelForEditColl7.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial9(childId) {
    const oro = this.iMaterialViewModelForEditColl9.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial8(childId) {
    const oro = this.iMaterialViewModelForEditColl8.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }
  addChildMaterial10(childId) {
    const oro = this.iMaterialViewModelForEditColl10.find(m => m.childMaterialId === childId);
    if (oro.isSelected) {
      oro.isSelected = false;
    } else {
      oro.isSelected = true;
    }
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  getCapabilities() {
    this._SupplierService.getCapabilities(this.iContactViewModel.companyId, false).subscribe(
      result => {
        if (result['result'] === true) {
          this.iCustomProcessViewModelCollExisting = result['data'];
          if (this.iCustomProcessViewModelCollExisting.length > 0) {
            this.parentProcess = this.getParents();
            this.getExistingParentProcess();
          }
        } else {
          this.iCustomProcessViewModelCollExisting = [];
          this.isLoader = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {

      }
    );
  }

  getExistingParentProcess() {
    if (this.parentProcess[0]) {
      this.parentCertificate1 = this.iCustomProcessViewModelCollExisting.find(m => m.parentDisciplineName ===
        this.parentProcess[0].key).parentDisciplineName;
      const childProcess1 = this.iCustomProcessViewModelCollExisting.filter(m => m.parentDisciplineName ===
        this.parentProcess[0].key);
      this.iCustomProcessViewModelForCapaColl1 = [];
      const aa = this.iCustomProcessViewModelColl.filter(m => m.parentDisciplineName ===
        this.parentProcess[0].key);
      this.iCustomProcessViewModelColl.forEach(element => {
        if (element.parentDisciplineName === this.parentCertificate1) {
          this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
          this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
          this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
          this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
          const Isexist = childProcess1.filter(m => m.childDisciplineId === element.childDisciplineId).length;
          // this.iCustomProcessViewModelForCapa.isSelected = false;
          if (Isexist === 0) {
            this.iCustomProcessViewModelForCapa.isSelected = false;
          } else {
            this.iCustomProcessViewModelForCapa.isSelected = true;
          }
          this.iCustomProcessViewModelForCapaColl1.push(this.iCustomProcessViewModelForCapa);
          this.isLoader = false;
          this.initModel();
        }
      });
    }

    if (this.parentProcess[1]) {
      this.parentCertificate2 = this.iCustomProcessViewModelCollExisting.find(m => m.parentDisciplineName ===
        this.parentProcess[1].key).parentDisciplineName;
      const childProcess2 = this.iCustomProcessViewModelCollExisting.filter(m => m.parentDisciplineName ===
        this.parentProcess[1].key);
      if (this.parentCertificate2 !== '') {
        this.processDiv2 = true;
      }
      this.iCustomProcessViewModelForCapaColl2 = [];
      this.iCustomProcessViewModelColl.forEach(element => {
        if (element.parentDisciplineName === this.parentCertificate2) {
          this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
          this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
          this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
          this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
          const Isexist = childProcess2.filter(m => m.childDisciplineId === element.childDisciplineId).length;
          // this.iCustomProcessViewModelForCapa.isSelected = false;
          if (Isexist === 0) {
            this.iCustomProcessViewModelForCapa.isSelected = false;
          } else {
            this.iCustomProcessViewModelForCapa.isSelected = true;
          }
          this.iCustomProcessViewModelForCapaColl2.push(this.iCustomProcessViewModelForCapa);
          this.initModel();
        }
      });
    }

    if (this.parentProcess[2]) {
      this.parentCertificate3 = this.iCustomProcessViewModelCollExisting.find(m => m.parentDisciplineName ===
        this.parentProcess[2].key).parentDisciplineName;
      const childProcess3 = this.iCustomProcessViewModelCollExisting.filter(m => m.parentDisciplineName ===
        this.parentProcess[2].key);
      if (this.parentCertificate3 !== '') {
        this.processDiv3 = true;
      }
      this.iCustomProcessViewModelForCapaColl3 = [];
      this.iCustomProcessViewModelColl.forEach(element => {
        if (element.parentDisciplineName === this.parentCertificate3) {
          this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
          this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
          this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
          this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
          const Isexist = childProcess3.filter(m => m.childDisciplineId === element.childDisciplineId).length;
          // this.iCustomProcessViewModelForCapa.isSelected = false;
          if (Isexist === 0) {
            this.iCustomProcessViewModelForCapa.isSelected = false;
          } else {
            this.iCustomProcessViewModelForCapa.isSelected = true;
          }
          this.iCustomProcessViewModelForCapaColl3.push(this.iCustomProcessViewModelForCapa);
          this.initModel();
        }
      });
    }
    if (this.parentProcess[3]) {
      this.parentCertificate4 = this.iCustomProcessViewModelCollExisting.find(m => m.parentDisciplineName ===
        this.parentProcess[3].key).parentDisciplineName;
      const childProcess4 = this.iCustomProcessViewModelCollExisting.filter(m => m.parentDisciplineName ===
        this.parentProcess[3].key);
      if (this.parentCertificate4 !== '') {
        this.processDiv4 = true;
      }
      this.iCustomProcessViewModelForCapaColl4 = [];
      this.iCustomProcessViewModelColl.forEach(element => {
        if (element.parentDisciplineName === this.parentCertificate4) {
          this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
          this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
          this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
          this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
          const Isexist = childProcess4.filter(m => m.childDisciplineId === element.childDisciplineId).length;
          // this.iCustomProcessViewModelForCapa.isSelected = false;
          if (Isexist === 0) {
            this.iCustomProcessViewModelForCapa.isSelected = false;
          } else {
            this.iCustomProcessViewModelForCapa.isSelected = true;
          }
          this.iCustomProcessViewModelForCapaColl4.push(this.iCustomProcessViewModelForCapa);
          this.initModel();
        }
      });
    }

    if (this.parentProcess[4]) {
      this.parentCertificate5 = this.iCustomProcessViewModelCollExisting.find(m => m.parentDisciplineName ===
        this.parentProcess[4].key).parentDisciplineName;
      const childProcess5 = this.iCustomProcessViewModelCollExisting.filter(m => m.parentDisciplineName ===
        this.parentProcess[4].key);
      if (this.parentCertificate5 !== '') {
        this.processDiv5 = true;
      }
      this.iCustomProcessViewModelForCapaColl5 = [];
      this.iCustomProcessViewModelColl.forEach(element => {
        if (element.parentDisciplineName === this.parentCertificate5) {
          this.iCustomProcessViewModelForCapa.childDisciplineId = element.childDisciplineId;
          this.iCustomProcessViewModelForCapa.childDisciplineName = element.childDisciplineName;
          this.iCustomProcessViewModelForCapa.parentDisciplineId = element.parentDisciplineId;
          this.iCustomProcessViewModelForCapa.parentDisciplineName = element.parentDisciplineName;
          const Isexist = childProcess5.filter(m => m.childDisciplineId === element.childDisciplineId).length;
          // this.iCustomProcessViewModelForCapa.isSelected = false;
          if (Isexist === 0) {
            this.iCustomProcessViewModelForCapa.isSelected = false;
          } else {
            this.iCustomProcessViewModelForCapa.isSelected = true;
          }
          this.iCustomProcessViewModelForCapaColl5.push(this.iCustomProcessViewModelForCapa);
          this.initModel();
        }
      });
    }
  }

  getParents() {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!this.iCustomProcessViewModelCollExisting) {
      return null;
    }
    const property = 'parentDisciplineName';
    const groupedCollection = this.iCustomProcessViewModelCollExisting.reduce((previous, current) => {
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
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  GetProfileDetailsLocally() {
    const id = this.loggedEncryptId;
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          this.getProcess();
          // this.getCapabilities();
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );

  }
  GetProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this.getProcess();
        // this.getCapabilities();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  submitCapabilitis() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      this.isSaveBtnDisabled = true;
      this.iProcessesViewModel.companyId = this.iContactViewModel.companyId;
      this.iProcessesViewModel.contactId =  this.iContactViewModel.contactId;
      this.iCustomProcessViewModelForCapaColl1.forEach(element => {
        if (element.isSelected === true) {
          this.iProcessesViewModel.partCategoryId.push(element.childDisciplineId);
        }
      });
      this.iCustomProcessViewModelForCapaColl2.forEach(element => {
        if (element.isSelected === true) {
          this.iProcessesViewModel.partCategoryId.push(element.childDisciplineId);
        }
      });
      this.iCustomProcessViewModelForCapaColl3.forEach(element => {
        if (element.isSelected === true) {
          this.iProcessesViewModel.partCategoryId.push(element.childDisciplineId);
        }
      });
      this.iCustomProcessViewModelForCapaColl4.forEach(element => {
        if (element.isSelected === true) {
          this.iProcessesViewModel.partCategoryId.push(element.childDisciplineId);
        }
      });
      this.iCustomProcessViewModelForCapaColl5.forEach(element => {
        if (element.isSelected === true) {
          this.iProcessesViewModel.partCategoryId.push(element.childDisciplineId);
        }
      });

      this._SupplierService.updateSupplierCapability(this.iProcessesViewModel).subscribe(
        result => {
          this.iProcessesViewModel = result;
          if (this.iProcessesViewModel.result === true) {
            this._toastr.success(this.iProcessesViewModel.errorMessage, '');
            this._SupplierService.set(true, 'capabilitiesDrawerDataSaved');
            localStorage.setItem('isCapabilitiesFilled', 'true');
            this.isSaveBtnDisabled = false;
            this.closePartDrawer();
            this.profileChanges.emit(true);
          } else {
            this.isSaveBtnDisabled = false;
            this._toastr.error(this.iProcessesViewModel.errorMessage, 'Error!');
          }
          this.isButtonClicked = false;
        },
        error => {
          this.isButtonClicked = false;
          this.isSaveBtnDisabled = false;
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  submitFocus() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      this.iFocusOverViewModelEdit.companyId = this.iContactViewModel.companyId;
      this.iFocusOverViewModelEdit.toleranceId = this.tolenrance;

      this.iIndustryBranchesModelColl.forEach(element => {
        if (element.industryBranchesId.toString() === this.selectedIndustry1.toString()) {
          this.iFocusOverViewModelEdit.industryFocusId.push(element.industryBranchesId);
        }
      });

      if (this.selectedIndustry2 !== 0) {
        this.iIndustryBranchesModelColl.forEach(element => {
          if (element.industryBranchesId.toString() === this.selectedIndustry2.toString()) {
            this.iFocusOverViewModelEdit.industryFocusId.push(element.industryBranchesId);
          }
        });

      }
      if (this.selectedIndustry3 !== 0) {
        this.iIndustryBranchesModelColl.forEach(element => {
          if (element.industryBranchesId.toString() === this.selectedIndustry3.toString()) {
            this.iFocusOverViewModelEdit.industryFocusId.push(element.industryBranchesId);
          }
        });
      }
      if (this.selectedIndustry4 !== 0) {
        this.iIndustryBranchesModelColl.forEach(element => {
          if (element.industryBranchesId.toString() === this.selectedIndustry4.toString()) {
            this.iFocusOverViewModelEdit.industryFocusId.push(element.industryBranchesId);
          }
        });
      }
      if (this.selectedIndustry5 !== 0) {
        this.iIndustryBranchesModelColl.forEach(element => {
          if (element.industryBranchesId.toString() === this.selectedIndustry5.toString()) {
            this.iFocusOverViewModelEdit.industryFocusId.push(element.industryBranchesId);
          }
        });
      }

      this.iMaterialViewModelForEditColl1.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl2.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl3.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl4.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl5.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl6.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl7.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl8.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl9.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this.iMaterialViewModelForEditColl10.forEach(element => {
        if (element.isSelected === true) {
          this.iFocusOverViewModelEdit.materialId.push(element.childMaterialId);
        }
      });
      this._SupplierService.UpdateFocusOverview(this.iFocusOverViewModelEdit).subscribe(
        result => {

          if (result.result === true) {
            this.iFocusOverViewModelEdit = result;
            this._toastr.success(this.iFocusOverViewModelEdit.errorMessage, '');
            this._SupplierService.set(true, 'capabilitiesDrawerDataSaved');
            this.closePartDrawer();
            this.profileChanges.emit(true);
          } else {
            this._toastr.error(this.iFocusOverViewModelEdit.errorMessage, 'Error!');
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
  checkForProcessValidation() {
    let isValid = false;

    if (this.processDiv1 && !this.checkForProcess1()) {
      isValid = true;
    } else {
      isValid = false;
    }
    if (this.processDiv2) {
      if (!this.checkForProcess2()) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    if (this.processDiv3) {
      if (!this.checkForProcess3()) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    if (this.processDiv4) {
      if (!this.checkForProcess4()) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    if (this.processDiv5) {
      if (!this.checkForProcess5()) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    return isValid;

  }

  checkIndustry1Selected() {
    if (this.industry1Focused) {
      return this.selectedIndustry1 !== 0;
    } else {
      return true;
    }
  }
  checkIndustry2Selected() {
    if (this.industry2Focused && this.industryDiv2) {
      return this.selectedIndustry2 !== 0;
    } else {
      return true;
    }
  }
  checkIndustry3Selected() {
    if (this.industry3Focused && this.industryDiv3) {
      return this.selectedIndustry3 !== 0;
    } else {
      return true;
    }
  }
  checkIndustry4Selected() {
    if (this.industry4Focused && this.industryDiv4) {
      return this.selectedIndustry4 !== 0;
    } else {
      return true;
    }
  }
  checkIndustry5Selected() {
    if (this.industry5Focused && this.industryDiv5) {
      return this.selectedIndustry5 !== 0;
    } else {
      return true;
    }
  }
  checkToleranceSelected() {
    if (this.tolenranceFocused) {
      return this.tolenrance !== 0;
    } else {
      return true;
    }
  }

  checkmaterial1Selected() {
    if (this.material1Focused) {
      return this.selectedMaterial1 !== '';
    } else {
      return true;
    }
  }
  checkmaterial2Selected() {
    if (this.material2Focused && this.materialDiv2) {
      return this.selectedMaterial2 !== '';
    } else {
      return true;
    }
  }
  checkmaterial3Selected() {
    if (this.material3Focused && this.materialDiv3) {
      return this.selectedMaterial3 !== '';
    } else {
      return true;
    }
  }
  checkmaterial4Selected() {
    if (this.material4Focused && this.materialDiv4) {
      return this.selectedMaterial4 !== '';
    } else {
      return true;
    }
  }
  checkmaterial5Selected() {
    if (this.material5Focused && this.materialDiv5) {
      return this.selectedMaterial5 !== '';
    } else {
      return true;
    }
  }
  checkmaterial6Selected() {
    if (this.material6Focused && this.materialDiv6) {
      return this.selectedMaterial6 !== '';
    } else {
      return true;
    }
  }
  checkmaterial7Selected() {
    if (this.material7Focused && this.materialDiv7) {
      return this.selectedMaterial7 !== '';
    } else {
      return true;
    }
  }
  checkmaterial8Selected() {
    if (this.material8Focused && this.materialDiv8) {
      return this.selectedMaterial8 !== '';
    } else {
      return true;
    }
  }
  checkmaterial9Selected() {
    if (this.material9Focused && this.materialDiv9) {
      return this.selectedMaterial9 !== '';
    } else {
      return true;
    }
  }
  checkmaterial10Selected() {
    if (this.material10Focused && this.materialDiv10) {
      return this.selectedMaterial10 !== '';
    } else {
      return true;
    }
  }

  checkIndustry(index) {
    if (!this['industryDiv' + index]) {
      return false;
    } else {
      return this['industry' + index + 'Focused'] === false;
    }
  }
  checkMaterial(index) {
    if (!this['materialDiv' + index]) {
      return false;
    } else {
      return this['material' + index + 'Focused'] === false;
    }
  }

  isfirstValid() {
    if ((this.selectedIndustry1 !== 0 && this.selectedIndustry1.toString() !== '0') ||
      (this.industryDiv2 && this.selectedIndustry2 !== 0 && this.selectedIndustry2.toString() !== '0') ||
      (this.industryDiv3 && this.selectedIndustry3 !== 0 && this.selectedIndustry3.toString() !== '0') ||
      (this.industryDiv4 && this.selectedIndustry4 !== 0 && this.selectedIndustry4.toString() !== '0') ||
      (this.industryDiv5 && this.selectedIndustry5 !== 0 && this.selectedIndustry5.toString() !== '0')) {
      return true;
    } else {
      return false;
    }
  }
  isFocusPageValid() {
    const oro = this.iMaterialViewModelForEditColl1.find(m => m.isSelected === true);
    if (this.isfirstValid() || (this.tolenrance !== 0 && this.tolenrance.toString() !== '0') || (oro)) {
      return true;
    } else {
      if (this.industry1Focused === false || this.checkIndustry('2') || this.checkIndustry('3') || this.checkIndustry('4') ||
        this.checkIndustry('5') || this.tolenranceFocused === false) {
        return false;
      } else {
        return false;
      }
    }
  }





}
