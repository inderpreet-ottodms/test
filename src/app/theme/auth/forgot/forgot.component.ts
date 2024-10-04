import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { IContactViewModel, IRFQViewModel } from '../../../core/models/accountModel';
import { AccountService } from '../../../core/services/account/account.service';
import { CustomValidatorService } from '../../../core/services/validator/custom-validator.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  iContactViewModel: IContactViewModel;
  errorForgotMessage: string;
  isResponse = false;
  successMessage: string;
  iRFQViewModel: IRFQViewModel;
  isError: boolean;
  isForgotFailed: boolean;
  isForgotSuccess: boolean;
  forgotForm: FormGroup;
  showLogin: any;
  labelFocus: any;
  constructor(
    private _fb: FormBuilder,
    private _customValidatorsService: CustomValidatorService,
    private _accountService: AccountService, private _rfqService: RfqService
  ) {

    this.initJobPostingModel();
    this.createForm();
  }
  initJobPostingModel() {
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      originalContactPictureFile: '',
        originalLogoOfCompany: '',
      isLoginFromVision: false,
      comments: '',
      contactIdEncrypt: '',
      companyId: 0,
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
      token: '',
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
      npsScore: 0 ,
      currentUserRole : [],
      noOfStars: 0,
      isVisionUserRequest:false,
      instagram: ''
    };

  }

  createForm() {
    this.forgotForm = this._fb.group({
      emailId: [this.iContactViewModel['emailId'], Validators.required]
    });
  }

  ngOnInit() {
  }
  onSubmit() {
    if (this.forgotForm.valid && this.isError) {
      this.isResponse = true;
      this.iContactViewModel = this.forgotForm.value;
      this._accountService.forgotPassword(this.iContactViewModel).subscribe(
        result => {
          this.iContactViewModel = result;
          this.isResponse = false;
          if (this.iContactViewModel.result === true) {
            this.successMessage = 'An email has been sent to ' + this.forgotForm.value.emailId + ' ';
            this.isForgotFailed = false;
            this.isForgotSuccess = true;
          // this.resetForgotSuccess(false);

          } else {
            this.isForgotFailed = true;
            this.errorForgotMessage = this.iContactViewModel.errorMessage;
          // this.resetForgotError(false);
          }
        },
        error => {
          this.isForgotFailed = true;
          this.isResponse = false;
          this.errorForgotMessage = error.error.errorMessage;
          this._rfqService.handleError(error);
        },
        () => {
        }
      );
    } else {
      this.isResponse = false;
      this._customValidatorsService.validateAllFormFields(this.forgotForm);
    }
  }

  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.forgotForm, field);
  }
  isEmailValid(field: string) {
    if (this._customValidatorsService.isEmailValid(this.forgotForm, field)) {
      this.isError = false;
    } else {
      this.isError = true;
    }
    return this._customValidatorsService.isEmailValid(this.forgotForm, field);
  }

  setDiv(flag: boolean) {
    this.showLogin = flag;
  }
  setFocus(flag: string) {
    this.labelFocus = flag;
    this.isForgotFailed = false;
    this.isForgotSuccess = false;
  }

  checkLoginField(field: string) {
    return this.forgotForm.value[field] === '';
  }
  checkLoginForms() {
    const emailId = this.forgotForm.value.emailId;


    if (emailId === '') {
      return true;
    } else {
      return false;
    }
  }
  resetBtn() {
    const emailId = this.forgotForm.value.emailId;


    if (emailId === '') {

      return true;
    } else {

      return false;
    }
  }

  // resetForgotError(flag: boolean) {
  //   setTimeout(() => {
  //     this.isForgotFailed = flag;
  //   }, 5000);
  // }
  // resetForgotSuccess(flag: boolean) {
  //   setTimeout(() => {
  //     this.isForgotSuccess = flag;
  //   }, 5000);
  // }
}
