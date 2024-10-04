import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { CustomValidatorService } from '../../../core/services/validator/custom-validator.service';
import {IRegUserInviteModel, IInviteUserContactViewModel,
   IAddressModel, ILanguageModel, ICompanyModel} from '../../../core/models/accountModel';
import { IInviteUserViewModel } from '../../../core/models/profileModel';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ICountryViewModel } from '../../../core/models/globalMaster';
import { MasterService } from '../../../core/services/master/master.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { IpService } from '../../../../app/v2/shared/ip.service';
@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss'] ,
  providers: [ConfirmationService]
})
export class UserInviteComponent implements OnInit {
  userInviteForm: FormGroup;
  iRegUserInviteModel: IRegUserInviteModel;
  iInviteUserViewModel: IInviteUserViewModel;
  iAddressModel: IAddressModel;
  iInviteUserContactViewModel: IInviteUserContactViewModel;
  isValidMail = null;
  isOldPassword = false;
  param1: string;
  isResetPasswordFailed: boolean;
  errorResetPasswordMessage: string;
  isPasswordError: boolean;
  isRePasswordError: boolean;
  isError: boolean;
  token: string;
  labelFocus: any;
  showInviteForm: boolean;
  message: string;
  iCountryColl: ICountryViewModel[];
  countrysettings = {};
  bCountrysettings = {};
  selectedItems = [];
  isCountryMultiSelectTouched = false;
  errorOnCountryMultiSelect = false;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  ipAddress: any;
  constructor(private _fb: FormBuilder,
    private router: Router,
    private _customValidatorsService: CustomValidatorService,
    private route: ActivatedRoute, private _toastr: ToastrService,
    private _masterService: MasterService,private _rfqService: RfqService,
    private _accountService: AccountService, private confirmationService: ConfirmationService,
    private ipService: IpService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.param1 = params['email'];
      this.token = params['token'];
    });
    this.labelFocus = 'no';
    this.selectedItems = [];
    this.initModel();
    this.validateNewUserInvitation();
    this.isCountryMultiSelectTouched = false;
    this.errorOnCountryMultiSelect = false;
    this.getIpAddress();
  }

  validateNewUserInvitation() {
    this.iInviteUserViewModel.encryptedToken =  this.token;
    this._accountService.validateNewUserInvitationLink(this.iInviteUserViewModel).subscribe(res => {
      this.iInviteUserContactViewModel = res;
      this.createForm();
      if (this.iInviteUserContactViewModel.result === true) {
            this.showInviteForm = true;      } else {
              this.showInviteForm = false;
              this.message = this.iInviteUserContactViewModel.errorMessage;
              this.validationerrormsg (this.message);
            }
    }, error => {
      this.showInviteForm = false;
      this.message = 'Your Registration Link is Invaild';
      this.validationerrormsg (this.message);
    },
    () => { });
  }


  initModel() {

    this.iInviteUserContactViewModel = {
      contactId: 0,
      companyId:  0,
      languageId:  0,
      title: '',
      firstName: '',
      lastName:  '',
      contactFunction: '',
      isBuyer: false,
      isSupplier: false,
      isAdmin: false,
      createdOn: '',
      modifiedOn:  '',
      addressId:  0,
      recordOriginId:  0,
      incotermId:  0,
      comments: '',
      isNotifyByEmail: true,
      isBuyerDashboard: true,
      isMailInHtml:true,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      userId:  '',
      emailId:  '' ,
      password:  '' ,
      roleId:  0,
      isActive: false,
      errorMessage:  '' ,
      result: false,
      phoneNo: '',
      linkedIn: '',
      tweeter: '',
      facebook: '',
      industryId: 0,
      industry: '',
      token: '',
      contactPictureFile: '',
      logoOfCompany: '',
      language: this.iLanguageModel,
      address: this.iAddressModel,
      company: this.iCompanyModel,
      isVarified: false,
      expiration:new Date,
      currentPassword: '',
      newPassword: '',
      isRFQCreated: false,
      grantType: '',
      refreshToken: '',
      googleImageUrl: '',
      website: '',
      isCompanyProfileFilled: false,
      isCapabilitiesFilled: false,
      npsScore: 0,
      currentUserRole:[],
      userIpAddress: ''
    }


    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true
    };


    this.iCompanyModel = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      _3dTourUrl: '',
      employeeCountRange: '',
      employeeCountRangeId: 1,
      errorMessage: '',
      isActive: true,
      name: '',
      companylogo: '',
      services: '',
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: '',
      supplierTypeId: 0
    };
    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 1,
      city: '',
      countryId: 0,
      deptAddress: '',
      country: '',
      errorMessage: '',
      isActive: false,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      result: false,
      streetAddress: '',
      companyShippingSiteViewModelList: []
    };
    this.iRegUserInviteModel = {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      phoneNo:'',
      email: '',
      address: this.iAddressModel
    };
    this.iInviteUserViewModel = {
      companyId: 0,
      fromContactId: 0,
      fromUserEmail: '',
      message: '',
      toEmail: '',
     isBuyer: true,
    isSupplier: true,
    IsAdmin: false,
    errorMessage: '',
    result: false,
    firstName: '',
    lastName: '' ,
    encryptedToken: ''
  };

  }
  isFieldValid(field: string) {

    return this._customValidatorsService.isFieldValid(this.userInviteForm, field);
  }

  isRegisterPasswordValid(field: string) {
    if (this._customValidatorsService.isPasswordValid(this.userInviteForm, field)) {
      this.isPasswordError = false;
    } else {
      this.isPasswordError = true;
    }

    return this._customValidatorsService.isPasswordValid(this.userInviteForm, field);
  }

  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  checkLoginField(field: string) {
    return this.userInviteForm.value[field] === '';
  }
  validateOldPassword(confirmPwd: string, pwd: string) {
    if (this._customValidatorsService.isCompare(this.userInviteForm, confirmPwd,
      pwd)) {
      this.isRePasswordError = false;
    } else {
      this.isRePasswordError = true;
    }
    return this._customValidatorsService.isCompare(
      this.userInviteForm,
      confirmPwd,
      pwd
    );
  }

  resetBtn() {
    const newpassword = this.userInviteForm.value.password;
    const confirmpassword = this.userInviteForm.value.confirmpassword;
    const lastname = this.userInviteForm.value.lastname;
    const firstname = this.userInviteForm.value.firstname;
const phoneNo = this.userInviteForm.value.phoneNo;
    if (newpassword.trim() === '' || confirmpassword.trim()  === '' || lastname.trim()  === '' ||  firstname.trim()  === ''
   || phoneNo.trim()  === '' || (newpassword.trim() !== confirmpassword.trim())) {
      return true;
    }
    else {
     return false;
  }
  }

  createForm() {
    this.userInviteForm = this._fb.group({
      password: [
        this.iRegUserInviteModel['password'],
        Validators.required
      ],
      confirmpassword: [
        this.iRegUserInviteModel['confirmPassword'],
        Validators.required
      ],
      firstname: [
        this.iRegUserInviteModel['firstName'],
        Validators.required
      ],
      lastname: [
        this.iRegUserInviteModel['lastName'],
        Validators.required
      ],

      phoneNo: [
        this.iRegUserInviteModel['phoneNo'],
        [Validators.required,Validators.pattern('^[0-9]*')]
      ],
      email: [
        this.iInviteUserContactViewModel['emailId'],
        Validators.required
      ],

    });
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  onSubmit() {
    this.iInviteUserContactViewModel.address=null;
   this.iInviteUserContactViewModel.password = this.userInviteForm.value.password;
   this.iInviteUserContactViewModel.firstName = this.userInviteForm.value.firstname;
   this.iInviteUserContactViewModel.lastName = this.userInviteForm.value.lastname;
   this.iInviteUserContactViewModel.token =  this.token;


   if (!!this.selectedItems && !!this.selectedItems[0] && !!this.selectedItems[0].codeTelephone) {
    this.iInviteUserContactViewModel.phoneNo = '' + this.selectedItems[0].codeTelephone + this.userInviteForm.value.phoneNo;
  } else {
    this.iInviteUserContactViewModel.phoneNo = this.userInviteForm.value.phoneNo;
  }
  this.iInviteUserContactViewModel.userIpAddress = this.ipAddress;

    this._accountService.submitNewUserInvitationLink(this.iInviteUserContactViewModel).subscribe( res => {
      if (res.result === true) {
        this._toastr.success(res.errorMessage, '');
   this.router.navigateByUrl('/auth/login/simple');
      }
    }, error => {
      this._toastr.warning(error.error.errorMessage, 'Warning!');
    });
  }

  validationerrormsg(msg: string) {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: msg,
      header: 'Security Token Issue',
      icon: null,
      accept: () => {
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }
  checkIfCountrySeleted() {
    return this.iRegUserInviteModel.address.countryId === 0;
  }
  getCountry() {
    this._masterService.getCountry().subscribe(
      (data2: ICountryViewModel[]) => {
        this.iCountryColl = data2;
        this.countrysettings = {
          singleSelection: true,
          text: 'Country',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Fields',
          enableSearchFilter: true,
          labelKey: 'countryName',
          primaryKey: 'countryId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 200,
          showCheckbox: false
        };
        this.bCountrysettings = {
          singleSelection: true,
          text: 'Country',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Fields',
          enableSearchFilter: true,
          labelKey: 'countryName',
          primaryKey: 'countryId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 200,
          showCheckbox: false
        };
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  setFocusCountry() {
    this.checkOnOpen();
    if (this.isCountryMultiSelectTouched) {
      document.getElementsByClassName('selected-list')[0]['style'].boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
    }
  }

  checkOnOpen() {
    this.isCountryMultiSelectTouched = true;
    this.setFocus('countryId');
  }

  checkOnClose() {
    if (this.isCountryMultiSelectTouched) {
      if (this.iRegUserInviteModel.address.countryId === 0) {
        this.errorOnCountryMultiSelect = true;
        ( < HTMLElement > document.getElementsByClassName('selected-list')[0]).style.border = '1px solid #da2020';
      } else {
        this.errorOnCountryMultiSelect = false;
        document.getElementsByClassName('selected-list')[0]['style'].border = '1px solid #cccccc';
      }
      document.getElementsByClassName('selected-list')[0]['style'].boxShadow = 'none';
    }
    if (this.labelFocus === 'countryId') {
      this.setFocus('no');
    }

  }

  onStateSelect(item: any) {
;
    this.iRegUserInviteModel.address.countryId = item.countryId;
    // this.createForm();
    this.errorOnCountryMultiSelect = false;
    if (this.iRegUserInviteModel.address.countryId === 0) {
      this.errorOnCountryMultiSelect = true;
      ( < HTMLElement > document.getElementsByClassName('selected-list')[0]).style.border = '1px solid #da2020';
    } else {
      this.errorOnCountryMultiSelect = false;
      document.getElementsByClassName('selected-list')[0]['style'].border = '1px solid #cccccc';
    }

  }
  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != '') {
        // this.iCompanyEditViewModel['phoneNo'] = number.replace(/-/g, '');
      this.userInviteForm.patchValue({
        'phoneNo': number.replace(/-/g, '')
      });


    }
  }

  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }
}
