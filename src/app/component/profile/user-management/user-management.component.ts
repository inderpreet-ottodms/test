import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { IAdminUserViewModel } from '../../../core/models/accountModel';
import { IInviteUserViewModel } from '../../../core/models/profileModel';
import { CustomValidatorService } from '../../../core/services/validator/custom-validator.service';
import { AccountService } from '../../../core/services/account/account.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  providers: [ConfirmationService]
})

export class UserManagementComponent implements OnInit {

  // Model Instance
  iAdminUserViewModel: IAdminUserViewModel[];
  iFilteredUserlist: IAdminUserViewModel[];
  items: IAdminUserViewModel[];
  filteredItems: IAdminUserViewModel[];
  iInviteUserModel: IInviteUserViewModel;

  // variable Declarations
  isLoader: boolean;
  isUserAvailable: boolean;
  togglebutton: boolean;
  totalUsers: number;
  msgs: string;
  userType: string;
  isBuyer: boolean;
  isSupplier: boolean;
  isAdmin: boolean;
  inviteuser: boolean;
  inviteuserForm: FormGroup;
  isRoleName: any;
  isRoleCount: any;
  applicableRoles: string[];
  isAdminPermission: boolean;
  currentUserId: number;
  isSideDrawerOpen: boolean = false;
  userDetails: any= null;
  status: any = null;
  /* pagination variables start */
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  pagesIndex: Array<number>;
  isSaveBtnDisabled: boolean = false;
  /* pagination variables end */

  constructor(private _toastr: ToastrService, 
    private _fb: FormBuilder,
    private _customValidatorsService: CustomValidatorService, 
    private _accountService: AccountService,
    private confirmationService: ConfirmationService, 
    private router: Router, 
    private _rfqService: RfqService) {

    this.isLoader = false;
    this.isUserAvailable = true;
    this.togglebutton = true;
    this.inviteuser = false;
    this.msgs = '';
    this.isBuyer = false;
    this.isSupplier = false;
    this.isAdmin = false;
    this.isAdminPermission = false;

    this.inintInviteModel();
    this.isRoleCount = JSON.parse(localStorage.getItem('applicableRoles'));
    this.isRoleName = localStorage.getItem('Usertype');

    this.applicableRoles = JSON.parse(localStorage.getItem('applicableRoles'));
    if (this.applicableRoles) {
      for (let index = 0; index < this.applicableRoles.length; index++) {
        if (this.applicableRoles[index] === 'Seller') {
          this.isSupplier = true;
        } else if (this.applicableRoles[index] === 'Buyer') {
          this.isBuyer = true;
        } else if ((this.applicableRoles[index] === 'Seller Admin') || (this.applicableRoles[index] === 'Buyer Admin')
          || (this.applicableRoles[index] === 'SellerAdmin') || (this.applicableRoles[index] === 'BuyerAdmin')) {
          this.isAdmin = true;
        }
      }
    }
  }

  ngOnInit() {
    this.currentUserId = this.loggedId;
    this.getUsersList();
  }

  getUsersList() {
    this.isLoader = true;
    if (this.loggedCompanyId !== null && this.loggedCompanyId !== undefined && !Number.isNaN(this.loggedCompanyId)) {
      this._accountService.getUsersList(this.loggedCompanyId, this.isBuyer, this.isSupplier, this.isAdmin).subscribe(
        result => {
          this.iAdminUserViewModel = result;
          if (this.iAdminUserViewModel.length !== 0) {
            this.totalUsers = this.iAdminUserViewModel.length;
            this.iFilteredUserlist = this.iAdminUserViewModel;
            this.isLoader = false;
            this.init();
          } else {
            this.totalUsers = this.iAdminUserViewModel.length;
            this.iFilteredUserlist = this.iAdminUserViewModel;
            this.isLoader = false;
            this.isUserAvailable = false;
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
      this.isLoader = false;
      this.isUserAvailable = false;
    }
  }
  
  deactivateUser(userStatus, contactId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate this user? They will not be able to log into the site.',
      header: 'Deactivate User',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this._accountService.activeDeactiveUser(contactId, !userStatus).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], 'Success!');
              this.getUsersList();
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      },
      reject: () => {
      }
    });
  }

  activateUser(userStatus, contactId) {
    this._accountService.activeDeactiveUser(contactId, !userStatus).subscribe(
      result => {
        if (result['result'] === true) {
          this._toastr.success(result['errorMessage'], 'Success!');
          this.getUsersList();
        } else {
          this._toastr.error(result['errorMessage'], 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
    );
  }

  // Pagination Function Starts
  init() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.pageNumber = parseInt('' + (this.iFilteredUserlist.length / this.pageSize));
    if (this.iFilteredUserlist.length % this.pageSize !== 0) {
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

  refreshItems() { 
    this.filteredItems = this.iFilteredUserlist;
    this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    this.pagesIndex = this.fillArray();
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

  Invite() {
    if (this.loggedCompanyId !== 0 && this.loggedCompanyId !== null) {
      this.inintInviteModel();
      this.createForm();
      this.inviteuser = true;
    } else {
      this.checkCompanyIdForInvite();
    }
  }

  hideInvite() {
    this.inviteuser = false;
  }

  createForm() {
    this.inviteuserForm = this._fb.group({
      companyId: [this.iInviteUserModel['companyId']],
      fromContactId: [this.iInviteUserModel['fromContactId']],
      fromUserEmail: [this.iInviteUserModel['fromUserEmail']],
      message: [this.iInviteUserModel['message']],
      toEmail: [this.iInviteUserModel['toEmail'], [Validators.required, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)]],
      firstName: [this.iInviteUserModel['firstName'], Validators.required],
      lastName: [this.iInviteUserModel['lastName']],
      isRole: [this.isRoleName],
      isAdmin: [this.isAdminPermission]
    });
  }

  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.inviteuserForm,
      field
    );
  }

  inintInviteModel() {
    this.iInviteUserModel = {
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
      lastName: '',
      encryptedToken: ''
    };
  }

  get loggedEmailId() {
    return (localStorage.getItem('User2'));
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  get loggedCompanyId() {
    const companyId = localStorage.getItem('loggedCompanyId');
    if (companyId) {
      return parseInt(localStorage.getItem('loggedCompanyId'));
    } else {
      return 0;
    }
  }

  onSaveInviteUser() {
    this.isSaveBtnDisabled = true;
    this.iInviteUserModel.companyId = this.loggedCompanyId;
    this.iInviteUserModel.fromContactId = this.loggedId;
    this.iInviteUserModel.fromUserEmail = this.loggedEmailId;
    this.iInviteUserModel.message = this.inviteuserForm.value.message;
    this.iInviteUserModel.toEmail = this.inviteuserForm.value.toEmail;
    this.iInviteUserModel.firstName = this.inviteuserForm.value.firstName;
    this.iInviteUserModel.lastName = this.inviteuserForm.value.lastName;
    this.iInviteUserModel.IsAdmin = this.inviteuserForm.value.isAdmin;
    if (this.inviteuserForm.value.isRole === 'Buyer') {
      this.iInviteUserModel.isBuyer = true;
      this.iInviteUserModel.isSupplier = false;
    } else {
      this.iInviteUserModel.isBuyer = false;
      this.iInviteUserModel.isSupplier = true;
    }
    this._accountService.sendInviteUserEmail(this.iInviteUserModel).subscribe(res => {
      if (res.result === true) {
        this._toastr.success(res.errorMessage, '');
        this.isSaveBtnDisabled = false;
        this.inviteuser = false;
        this.getUsersList();
      } else {
        this._toastr.warning(res.errorMessage, 'Warning!');
        this.isSaveBtnDisabled = false;
      }
    }, error => {
      this._rfqService.handleError(error);
    });

  }

  checkInviteUserForms() {
    const toEmail = this.inviteuserForm.value.toEmail;
    const message = this.inviteuserForm.value.message;
    const firstname = this.inviteuserForm.value.firstName;
    const lastname = this.inviteuserForm.value.lastName;
    if (toEmail === '' || firstname === '' || lastname === '') {
      return true;
    } else {
      return false;
    }
  }

  checkCompanyIdForInvite() {
    this.confirmationService.confirm({
      message: 'Please Update Company Detail first.',
      header: '',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        const userType = localStorage.getItem('Usertype');
        if (userType === 'Buyer') {
          this.router.navigateByUrl('/profile/buyerprofile');
        } else {
          this.router.navigateByUrl('/supplier/profile');
        }
      },
      reject: () => {
      }
    });
  }

  openDrawer(user){
    this.userDetails = user;
    // this.status = user.status;
    this.isSideDrawerOpen = true;
  }
  closeDrawer(evt){
    if(evt){
      this.getUsersList();
    }
    this.isSideDrawerOpen = false;
  }

}
