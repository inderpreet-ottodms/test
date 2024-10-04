import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';

import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-terms-and-conditions-model',
  templateUrl: './terms-and-conditions-model.component.html',
  styleUrls: ['./terms-and-conditions-model.component.scss']
})
export class TermsAndConditionsModelComponent implements OnInit, OnDestroy {
  @Input() hideTCModal: any;
  // @Input() hideTConDestroy: any;
  
  @ViewChild('expireModel',{static: true}) ndaModel: TemplateRef < any > ;
  @ViewChild('confirmationModal',{static: true}) confirmationModal: TemplateRef < any > ;
  sessionExpireModel: any;
  confirmationModal1: any;
  countTime: any = '';
  startCountDate: any;
  timer:any;
  isVisionUser: any;
  constructor( private _toastr: ToastrService, private modalService: NgbModal, private _rfqService: RfqService, private router: Router) {
    this.isVisionUser = localStorage.getItem('isLoginFromVision');
    // console.log( this.isVisionUser, ' this.isVisionUser')
  }

  ngOnInit() {
   // console.log(this.hideTConDestroy, 'this.hideTConDestroy');
    // console.log(this.hideTCModal, 'this.hideTCModal from basic comp')
    // if(this.hideTConDestroy == false) {
    //   this.sessionExpireModel.close();
    //   this.confirmationModal1.close();
    // }
  
  //   if(this.router.url !== '/auth/login/simple') {
  //     this.openModal1();
  //    // this._rfqService.set(false, 'isTermsModelShow');
  //   }  else if (this.router.url === '/auth/login/simple') {
  //     this.sessionExpireModel.close();
  //     this.confirmationModal1.close();
  //   }

  if(this.isVisionUser !== 'true') {
      this.openModal1();
      this.timer= setInterval(() => {
      this.showTermsAndConditionModal2();

      if (localStorage.getItem('IsTermsAndConditionsAccepted') === "True") {
        clearInterval(this.timer);
          console.log('Timer cleared!');
        }
      }, 60000)         
    } 
  }

  name: boolean;
  
  @Input() 
  get hideTConDestroy() { return this.name };
  set hideTConDestroy(val: boolean) {
    console.log(val, 'VALUE FROM TC COMP')
    if(val == false) {
      this.logMeOut();
    }
  };
  showTermsAndConditionModal2() {
    let email = localStorage.getItem('User2');
    let conatctId = this.loggedId;
    if (email !== null && email !== undefined && conatctId !== null && conatctId !== undefined) {
      this._rfqService.GetTermsAndConditions(email, conatctId).subscribe(
        result => {
        console.log(result, 'result from showTermsAndConditionModal modal function ')
        console.log(result.data.isAcceptance, 'result.data.isAcceptance')
          if(result.data.isAcceptance === null) {
            //show T&C modal
            console.log('show T&C modal')
            localStorage.setItem('IsTermsAndConditionsAccepted', "False");
            this._rfqService.set(true, 'isTermsModelShow');
            this.openModal1();
          } else {
            //don't show T&C modal
            console.log('dont show TC modal')
            localStorage.setItem('IsTermsAndConditionsAccepted', "True");
            this._rfqService.set(false, 'isTermsModelShow');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }
  openModal1() {
    if (this.sessionExpireModel) {
      this.sessionExpireModel.close();
    }
    if (this.confirmationModal1) {
      this.confirmationModal1.close();
    }
    this.sessionExpireModel = this.modalService.open(this.ndaModel, {
      backdrop: 'static',
      keyboard: false
    });
  }

  openConfirmationModal() {   
    this.sessionExpireModel.close();
    this.confirmationModal1 = this.modalService.open(this.confirmationModal, {
      backdrop: 'static',
      keyboard: false
    });
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  setTermsAndConditionsforAccept() {
    let email = localStorage.getItem('User2').toString();
    let conatctId = this.loggedId;
    let isAcceptance = 1;
    this._rfqService.SetTermsAndConditions(email, conatctId, isAcceptance).subscribe(
      result => {
      this.sessionExpireModel.close();
      console.log(result, 'result from setTermsAndConditions modal function ')
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  setTermsAndConditionsforDecline() {  
    this.openConfirmationModal();
  }

  logoutAndDeactivateAccount() {
    if (this.sessionExpireModel) {
      this.sessionExpireModel.close();
    }
    if (this.confirmationModal1) {
      this.confirmationModal1.close();
    }
    let email = localStorage.getItem('User2').toString();
    let conatctId = this.loggedId;
    let isAcceptance = 0;
    this._rfqService.SetTermsAndConditions(email, conatctId, isAcceptance).subscribe(
      result => {
      console.log(result, 'result from setTermsAndConditions modal function ')
      this._rfqService.set(false, 'isTermsModelShow');
      this.logMeOut();
        // if(result.IsAcceptance == null) {
        //   //show T&C modal
        //   console.log('show T&C modal')
        //   this._rfqService.set(true, 'isTermsModelShow');
        // } else {
        //   //don't show T&C modal
        //   console.log('dont show TC modal')
        //   this._rfqService.set(false, 'isTermsModelShow');
        // }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  logMeOut() {
    if (this.sessionExpireModel) {
      this.sessionExpireModel.close();
    }
    if (this.confirmationModal1) {
      this.confirmationModal1.close();
    }
    clearInterval(this.timer);
    this._rfqService.set(0, 'companyId');
    this._rfqService.set(null, 'CompanyName');
    this._rfqService.set(false, 'isBack');
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['auth/login/simple']);
    //this._toastr.warning('Your account has been deactivated. Please contact customer support for assistance!', 'Warning!');
  }

  showTermsAndConditionModal() {
    this.confirmationModal1.close();
    this.openModal1();
  }

  reDirectToTermsPage() {
    let url = 'https://www.mfg.com/terms-of-use/';
    window.open(url, '_blank');     
  }

  reDirectToPrivacyPage() {
    let url = 'https://www.mfg.com/privacy-and-security-policy/';
    window.open(url, '_blank');     
  }

  ngOnDestroy() {
    console.log('IN TC DESTROY')
    if (this.sessionExpireModel) {
      this.sessionExpireModel.close();
    }
    if (this.confirmationModal1) {
      this.confirmationModal1.close();
    }
  }
}
