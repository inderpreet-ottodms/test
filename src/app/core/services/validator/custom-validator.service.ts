import { Injectable } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors
} from '@angular/forms';

import { IValidationModel } from '../../models/validationModel';

@Injectable()
export class CustomValidatorService {

  emailRegEx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  mobileNoPattern = /^((\\+91-?)|0)?[0-9]{15}$/;
  passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&^()])[A-Za-z\d$@$!%*?&^()#]{6,}/;
 phoneNoPattern = /^(\d{3})-?(\d{3})-?(\d{4})$/;
 numneric=/^[0-9]*$/;
 alphnumneric=/^[a-zA-Z0-9]*$/
  iValidationModel: IValidationModel;
  constructor() {
    this.iValidationModel = {
      isValid: true,
      isTouched: false,
      validationMessage: ''
    };
  }

  ageValidate(formControl: FormControl): ValidationErrors {
    const num = formControl.value;
    const numlength = num.length;
    const isValid = !isNaN(num) && num >= 18 && num <= 85;
    const message = {
      age: {
        message: 'The age must be a valid number between 18 and 85'
      }
    };
    return isValid ? null : message;
  }

  validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }

  isPasswordValid(form: FormGroup, field: string) {
    let isValid = false;
    const email = form.get(field).value;
    if (form.get(field).touched) {
      if (email.length > 0) {
        if (this.passwordRegEx.test(email)) {
          isValid = false;
        } else {
          isValid = true;
        }
      }
    }
    return isValid;
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }


  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  isCompare(form: FormGroup, confirmPwd: string, Pwd: string) {

    let isValid = false;
    const password = form.get(Pwd).value;
    const confirmPassword = form.get(confirmPwd).value;

    if (form.get(confirmPwd).touched && confirmPassword.length > 0) {

      if (password === confirmPassword) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    }
  }
  isEmailValid(form: FormGroup, field: string) {
    let isValid = false;
    if (form.get(field).touched) {
      const email = form.get(field).value;
      if (email !== null ) {
        if (email.length <= 0 ) {
          isValid = false;
        } else if (this.emailRegEx.test(email)) {
          isValid = false;
        } else {
          isValid = true;
        }
      }
      return isValid;
    }

  }
  isPincodeValid(form: FormGroup, field: string) {
     // tslint:disable-next-line:no-shadowed-variable
    let isValid = false;
    const isfieldvalid = form.get(field).valid;
    const pincode = form.get(field).value;
    if (form.get(field).touched && field.length !== 0 && isfieldvalid) {
    if (pincode.length === 10 && !isNaN(pincode)) {
      isValid = false;
    }  else {
      isValid = true;
    }
  }
    return isValid;
}

  isMobilePValid(form: FormGroup, field: string) {
 // tslint:disable-next-line:no-shadowed-variable
    let isValid = false;
    const email = form.get(field).value;
    const isfieldvalid = form.get(field).valid;

    if (
      this.mobileNoPattern.test(email) &&
      email !== '' &&
      form.get(field).touched &&
      isfieldvalid
    ) {
      isValid = false;
    } else if (form.get(field).touched && isfieldvalid) {
      isValid = true;
    }
    return isValid;
  }
  isnumericValid(form: FormGroup, field: string) {
    // tslint:disable-next-line:no-shadowed-variable
       let isValid = false;
       const email = form.get(field).value;
       const isfieldvalid = form.get(field).valid;

       if (
         this.numneric.test(email) &&
         email !== '' &&
         form.get(field).touched &&
         isfieldvalid
       ) {
         isValid = false;
       } else if (form.get(field).touched && isfieldvalid) {
         isValid = true;
       }
       return isValid;
     }
  isMobileNoValid(form: FormGroup, field: any) {
    // tslint:disable-next-line:no-shadowed-variable
    let isValid = false;
    const no = form.get(field).value;
    if (no.length <= 0) {
      isValid = false;
    } else if (no.length < 0 && no.length < 10) {
      isValid = false;
    } else if (this.mobileNoPattern.test(no)) {
      isValid = true;
    } else {
      isValid = true;
    }
    return isValid;
  }
  isDropdownValid(form: FormGroup, field: string) {
    let isValid = false;
    if (form.get(field).touched && field.length > 0) {
      const filedVal = form.get(field).value;
      if (filedVal !== '' && filedVal !== 0 ) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    }
  }
  isPhoneNoValid(form: FormGroup, field: string) {
    // let isValid = false;
    const phoneno = form.get(field).value;
    if (form.get(field).touched && phoneno !== '') {
      if (this.phoneNoPattern.test(phoneno)) {
        return false;
      } else {
        return true;
      }
    }
    // return isValid;
  }
}
