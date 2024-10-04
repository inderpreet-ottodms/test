import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { IResetPasswordModel, IContactViewModel, IRFQViewModel } from '../../../core/models/accountModel';
import { ReturnModel } from '../../../core/models/returnModel';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../../core/services/account/account.service';
import { CustomValidatorService } from '../../../core/services/validator/custom-validator.service';
import { Http} from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RfqService } from '../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isValidMail = null;
  isOldPassword = false;
  iResetPasswordModel: IResetPasswordModel;
  iRFQViewModel: IRFQViewModel;
  param1: string;
  isResetPasswordFailed: boolean;
  errorResetPasswordMessage: string;
  iReturnModel: ReturnModel;
  iContactViewModel: IContactViewModel;
  isPasswordError: boolean;
  isRePasswordError: boolean;
  isError: boolean;
  token: string;

  labelFocus: any;
   isVisionUserRequest:any;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private _customValidatorsService: CustomValidatorService,
    private route: ActivatedRoute,
    private _accountService: AccountService,
    private _Http: Http,
    private _httpClient: HttpClient,
    private _rfqService: RfqService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.param1 = params['UserId'];
      this.token = params['Code'];
        this.isVisionUserRequest=params['IsVisionUserRequest']
    });
    this.initJobPostingModel();
    this.createForm();
  }

  initJobPostingModel() {
    this.iResetPasswordModel = {
      newpassword: '',
      email: this.param1,
      confirmpassword: ''
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      isLoginFromVision: false,
      originalContactPictureFile: '',
        originalLogoOfCompany: '',
      addressId: 0,
      comments: '',
      companyId: 0,
      contactIdEncrypt: '',
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
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
      token: '',
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
      npsScore: 0 ,
      currentUserRole : [],
      noOfStars: 0,
      isVisionUserRequest:false,
      instagram: ''
    };
  }

  createForm() {
    this.resetForm = this._fb.group({
      newpassword: [
        this.iResetPasswordModel['newpassword'],
        Validators.required
      ],
      confirmpassword: [
        this.iResetPasswordModel['confirmpassword'],
        Validators.required
      ],
      email: [
        this.iResetPasswordModel['email'],
        Validators.required
      ]
    });
  }

  isFieldValid(field: string) {

    return this._customValidatorsService.isFieldValid(this.resetForm, field);
  }

  validateOldPassword(confirmPwd: string, pwd: string) {
    if (this._customValidatorsService.isCompare(this.resetForm, confirmPwd,
      pwd)) {
      this.isRePasswordError = false;
    } else {
      this.isRePasswordError = true;
    }
    return this._customValidatorsService.isCompare(
      this.resetForm,
      confirmPwd,
      pwd
    );
  }

  isRegisterPasswordValid(field: string) {
    if (this._customValidatorsService.isPasswordValid(this.resetForm, field)) {
      this.isPasswordError = false;
    } else {
      this.isPasswordError = true;
    }

    return this._customValidatorsService.isPasswordValid(this.resetForm, field);
  }



  resetPassword (jobPostingModel: IContactViewModel): Observable<IContactViewModel>  {
    const tempModuleUrl = 'account';
    const tempActionURL = environment.APIEndPoint;
    return this._httpClient.put<IContactViewModel>(tempActionURL + tempModuleUrl, jobPostingModel);
  }
  onSubmit() {
    if (this.resetForm.valid && this.isPasswordError && this.isRePasswordError) {
      this.iResetPasswordModel = this.resetForm.value;
      this.iContactViewModel.userId = this.param1;
      this.iContactViewModel.password = this.resetForm.value.newpassword;
      this.iContactViewModel.token = this.token;
      this.iContactViewModel.expiration = new Date();
      this.iContactViewModel.isVisionUserRequest= Boolean(this.isVisionUserRequest);
      this.resetPassword(this.iContactViewModel).subscribe(
        result => {
          this.iContactViewModel = result;

          if (this.iContactViewModel.result === true) {
            // console.log('Login Success');
            this.router.navigate(['/auth/login/simple']);
            // console.log('Redirect');
          } else {
            this.isResetPasswordFailed = true;
            this.errorResetPasswordMessage = this.iContactViewModel.errorMessage;
          }
        },
        error => {
          this.isResetPasswordFailed = true;
          this.errorResetPasswordMessage = error.error.errorMessage;
          this._rfqService.handleError(error);
        },
        () => {
        }
      );

    } else {
      this._customValidatorsService.validateAllFormFields(this.resetForm);
    }
  }
  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  checkLoginField(field: string) {
    return this.resetForm.value[field] === '';
  }


  resetBtn() {
    const newpassword = this.resetForm.value.newpassword;
    const confirmpassword = this.resetForm.value.confirmpassword;

    if (newpassword === '' || confirmpassword === '') {

      return true;
    } else {

      return false;
    }
  }

  getNewPassword() {
    const newpassword = this.resetForm.value.newpassword;
    if (newpassword) {
      return true;
    } else {
      return false;
    }
  }
  getRePassword() {
    const confirmpassword = this.resetForm.value.confirmpassword;
    if (confirmpassword) {
      return true;
    } else {
      return false;
    }
  }
  removeTextValue(txtbox) {
    if (txtbox === 'new') {
      this.resetForm.patchValue({
        newpassword: '',
      });
    } else if (txtbox === 'con') {
      this.resetForm.patchValue({
        confirmpassword: ''
      });
    }
  }
}
