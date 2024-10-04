import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
import { appConstants } from './../../core/config/constant';

@Component({
  selector: 'app-show-errors',
  template: `<ul *ngIf="shouldShowErrors()">
     <li style="color: red" *ngFor="let error of listOfErrors()">{{error}}</li>
   </ul>`,
})

export class ShowErrorsComponent {
  constructor() { }

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The maximum allowed number of characters is ' + params.requiredLength,
    'pattern': (params) =>  params.requiredPattern,
    'years': (params) => params.message,
    'countryCity': (params) => params.message,
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    if (type === 'pattern') {
      switch (params.requiredPattern) {
        case '^[0-9]*$':
             params.requiredPattern = ' only number allowed';
             break;
        case '^[a-zA-Z ]*$':
             params.requiredPattern = ' only characters allowed';
             break;
        case appConstants.pattern.DECIMAL_VALID:
             params.requiredPattern = 'Please enter valid number';
             break;
      }
    }

    return ShowErrorsComponent.errorMessages[type](params);
  }

}
