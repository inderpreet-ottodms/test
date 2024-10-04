import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  ToastrService
} from 'ngx-toastr';
import { ProductAnalyticService } from '../../../app/shared/product-analytic/product-analytic';
import { environment } from '../../../environments/environment';
import { ContactSalesActivityViewModel } from '../../core/models/supplierModel';
import { IMyAccountViewModel } from '../../core/models/supplierProfileModel';
import { MasterService } from '../../core/services/master/master.service';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';

/**
 * Communication methods
 */
enum communicationMethods {
  call = 6 ,
  email = 7,
  schedule = 8,
}

@Component({
  selector: 'app-contact-sales-model',
  templateUrl: './contact-sales-model.component.html',
  styleUrls: ['./contact-sales-model.component.scss'],
})
export class ContactSalesModelComponent implements OnInit, OnDestroy {

  @Input() rfqId;
  @Input() hideCall;
  isLoader: boolean;
  @ViewChild('upgradeModel',{static:true}) upgradeModel: TemplateRef < any > ;
  @ViewChild('iframe',{static:false}) iframe: ElementRef;
  tempModel: any;
  isUpgradeBtn: any;
  userName: string = '';
  userEmail: string = '';
  userPhoneNo: string;
  userPhoneCode: string = "+1";
  contactMethod: number = 0;
  userSchedule: string = '';
  userComments: string = '';
  contactSalesQA: any;
  deactivate: boolean = false;
  contactMethodIcon: string[] = [
                                'fa fa-phone',
                                'fa fa-envelope-o',
                                'fa fa-calendar-o'
                                ];
  contactMethodId: any[];
  minDate: Date;
  contactSalesActivityViewModel = new ContactSalesActivityViewModel();
  @Output() modelUpdateInfoChange = new EventEmitter();
  selectedHelpAns: any = 103;
  communicationMethods = communicationMethods;
  msUrl: SafeUrl = null;
  frameLoader: boolean = false;
  countryList : any[] = [];
  iMyAccountViewModel: IMyAccountViewModel;
  dataValu: any;
  contactType: string;

  constructor(private _SupplierService: SupplierService, private _toastr: ToastrService, private modalService: NgbModal, private sanitizer: DomSanitizer, private _masterService: MasterService, public router: Router, private productAnalyticService:ProductAnalyticService) {}

  ngOnInit() {
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: 'Basic',
      membership: '',
      price: 0,
      paymentMethod: '',
      paymentFrequency: '',
      paymentAmount: 0,
      startDate: '0001-01-01T00:00:00',
      endDate: '0001-01-01T00:00:00',
      autoRenewal: false,
      errorMessage: '',
      result: false,
      pageName: 'Page Title',
      rfqId: 0,
      toAlternateEmailId: ''
    };
    this.isLoader = true;
    this.openModal();
    if(localStorage.getItem('iContactViewModel') != null && localStorage.getItem('iContactViewModel') != undefined && localStorage.getItem('iContactViewModel') != ''){
      let contactDetails = JSON.parse(localStorage.getItem('iContactViewModel'));
      this.userName = contactDetails.firstName +' '+ contactDetails.lastName;
      this.userEmail = contactDetails.emailId;
    }
    this.minDate = moment().add(1, 'days').toDate();
    this.getCountryList();
    this.getContactSaleDetails();
    this.getMsBookingUrl();
    // this.msUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://outlook.office365.com/owa/calendar/TestBusiness@mfg.com/bookings/');
  }
  
  getCountryList(){
    this._masterService.getCountry().subscribe(
      response => {
        this.countryList = response;
      }
    );
  }

  getContactSaleDetails(){
    this._SupplierService.getContactSaleDetails().subscribe(
      response => {
        if(!response.isError){
          this.contactSalesQA = response.data;
          this.contactMethodId  = this.contactSalesQA[1].contactSalesAnswerResponseViewModel;

          this.isLoader=false;
        }else{
          this.isLoader=false;
          this._toastr.error(response.messages,'Error!');
        }
      }
    );
  }
  openModal() {
    this.tempModel = this.modalService.open(this.upgradeModel, {
      backdrop: 'static',
      size:"lg"
    });
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  /**
   * Sends contact
   * send the contact details to api.
   */
  sendContact(){
    this.deactivate = true;
    this.contactSalesActivityViewModel.supplierId = this.loggedId;
    this.contactSalesActivityViewModel.activityId = this.contactMethod;
    this.contactSalesActivityViewModel.comment = this.contactSalesQA[0].contactSalesAnswerResponseViewModel.find(x => x.aId == this.selectedHelpAns).aDesc;
    this.contactSalesActivityViewModel.errorMessage = "";
    this.contactSalesActivityViewModel.result = false;
    if(this.contactMethod == this.communicationMethods.schedule){
      this.contactSalesActivityViewModel.scheduleDateTime = moment.utc(this.userSchedule).toDate();
      this.contactSalesActivityViewModel.value = '';
    } else if(this.contactMethod == this.communicationMethods.email){
      this.contactSalesActivityViewModel.emailComment = (this.userComments)? this.userComments: '';
      this.contactSalesActivityViewModel.value =  this.userEmail;
      this.contactSalesActivityViewModel.scheduleDateTime = null;
      this.contactType = "Email" 
    } else{
      this.contactSalesActivityViewModel.emailComment =  '';
      this.contactSalesActivityViewModel.value =  this.userPhoneCode + this.userPhoneNo;
      this.contactSalesActivityViewModel.scheduleDateTime = null;
      this.contactType = "Call" 
    }
    if(this.hideCall === null || this.hideCall === undefined){
      this.setSupplierUpgraderequest();
    }
    
    this._SupplierService.sendContactSaleDetails(this.contactSalesActivityViewModel).subscribe(
      response => {
        this.dataValu = response.data.value;
        this.trackMixpaneRfqCompleted();
  
        if(!response.isError){
          if(this.contactMethod == this.communicationMethods.schedule){
            this._toastr.success('An email has been sent to the sales team and they will get back to on '+ moment(this.userSchedule).format('L') +' at '+ moment(this.userSchedule).format('LT'), 'Success!');
          } else {
            this._toastr.success('An email has been sent to the sales team and they will get back to you shortly.', 'Success!');
          }
        } else {
          this._toastr.error(response.messages, 'Error!');
        }
        this.modelUpdateInfoChange.emit(false);
        this.deactivate = false;
      },
      error=>{
        this.modelUpdateInfoChange.emit(false);
        this.deactivate = false;
      }
    );
  }
  ngOnDestroy(){
    if(this.tempModel != null && this.tempModel != undefined){
      this.tempModel.close();
      this.modelUpdateInfoChange.emit(false);
    }
  }
  change(val){
    this.userPhoneNo = val;
  }
  closeModel(option){
    if(option && (this.hideCall === null || this.hideCall === undefined)){
      this.setSupplierUpgraderequest();
    }
    this.tempModel.close();
    this.modelUpdateInfoChange.emit(false);
  }
  commentChange(){
    if(this.userComments != ''){
      if(this.userComments.trim().length == 0 ){
        this.userComments = this.userComments.trim();
      }
    }
  }
  uploadDone(){
    setTimeout(()=>{
      this.frameLoader = false;
    },1000);

  }
  getMsBookingUrl(){
    this._SupplierService.getMsBookingUrl(this.loggedId).subscribe(
      response =>{
        if(!response.isError && response.data.msBookingUrl !== null && response.data.msBookingUrl !== undefined && response.data.msBookingUrl !== ''){
          this.msUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.data.msBookingUrl);
        } else{
          this.frameLoader = false;
        }
      },
      error => {
        this.frameLoader = false;
      }
    );
  }
  setContactMethod(method){
    this.contactMethod = method;
    if(method === this.communicationMethods.schedule &&  this.msUrl !== null){
      this.frameLoader = true;
    } else {
      this.frameLoader = false;
    }
  }
  setSupplierUpgraderequest() {
    this.iMyAccountViewModel.contactId = this.loggedId;
    this.iMyAccountViewModel.companyId = this.loggedCompanyId;
    this.iMyAccountViewModel.rfqId = (this.rfqId !== null && this.rfqId !== undefined)? this.rfqId: 0;
    this._SupplierService.setSupplierUpgraderequest(this.iMyAccountViewModel).subscribe(
      result => {
      },
      error => {

      },
      () => {}
    );
  }

   trackMixpaneRfqCompleted(){
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_BUYER_BUYER_RFQ_COMPLETED,{
      page_url: environment.AppUrl + this.router.url,
      contact_type:this.contactType
    });
  }
}
