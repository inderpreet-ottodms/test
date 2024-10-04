import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { CustomValidatorService } from '../../core/services/validator/custom-validator.service';
import { MasterService } from '../../core/services/master/master.service';
import { Router } from '@angular/router';
import { QmsService } from '../../core/services/qms/qms.service';
import { ICountryViewModel, IRegionModel } from '../../core/models/globalMaster';
import { ToastrService } from 'ngx-toastr';
import { IMQSViewModel } from '../../core/models/supplierModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-qms-add-customer-model',
  templateUrl: './qms-add-customer-model.component.html',
  styleUrls: ['./qms-add-customer-model.component.scss']
})
export class QmsAddCustomerModelComponent implements OnInit {
  myContactForm: FormGroup;
  iaddContactModel: IMQSViewModel;
  iCountryColl: ICountryViewModel[];
  iRegionModel: IRegionModel[];
  @ViewChild('content',{static: true}) editModal : TemplateRef<any>;
  tempModel: any;
  isBtnClicked: boolean;
  constructor( private _masterService: MasterService,
    private _fb: FormBuilder, private _rfqService: RfqService,
    private _customValidatorsService: CustomValidatorService,
    private _toastr: ToastrService, private router: Router,private _qmsService: QmsService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.isBtnClicked = false;
    this.initModels();
    this.getCountry();
    this.createForm();
    this.openModal();
  }
  openModal() {
    // this.modalService.open(this.editModal);
    this.tempModel = this.modalService.open( this.editModal, {backdrop: 'static', size: 'lg'} );
  }
  initModels() {
    this.iaddContactModel = {
      qmsContactId: 0,
      supplierId: 0,
      company: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      country: '',
      city: '',
      state: '',
      stateId: 0,
      countryId: 0,
      zipCode: '',
      isActive: true,
      createdDate: '2018-11-15T12:42:20.060Z',
      mqsContactIdEncrypt: '',
      companynameWithSuppliername: '',
      stateName:'',
      countryName:''
    };
  }

  createForm() {
    this.myContactForm = this._fb.group({
      companyName: [this.iaddContactModel['company'], Validators.required],
      firstName: [this.iaddContactModel['firstName'] , Validators.required],
      lastName:[this.iaddContactModel['lastName'] ,Validators.required],
      countryId: [this.iaddContactModel['countryId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      stateId: [this.iaddContactModel['stateId']],
      city: [this.iaddContactModel['city']],
      phoneNo: [this.iaddContactModel['phone']],
      zipCode: [this.iaddContactModel['zipCode']],
      email: [this.iaddContactModel['email'], [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      address: [this.iaddContactModel['address'] ],
    });
    // this.isLoader = false;
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.myContactForm,
      field
    );
  }
  isEmailPValid(field: string) {
    return this._customValidatorsService.isEmailValid(
      this.myContactForm,
      field
    );
  }
  getCountry() {
    this.iCountryColl=[];
    this._masterService.getCountry().subscribe(
      (data: ICountryViewModel[]) => {
        this.iCountryColl = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  getState(event?) {
    let countryId;
    this.iRegionModel = [];
    this.myContactForm.patchValue({ stateId : 0 });
    // this.myContactForm.patchValue({countryId: });
    if (this.myContactForm.value.countryId !== undefined && this.myContactForm.value.countryId !== 0 ) {
       countryId = this.myContactForm.value.countryId;
    } else {
      countryId = 0;
    }
    if (countryId !== '0') {
      this._masterService.getState(countryId).subscribe(
        (data: IRegionModel[]) => {
          this.iRegionModel = data['stateData'];
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
    }
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }


  addMQSContact(value) {
    this.isBtnClicked = true;
    this.iaddContactModel.address = this.myContactForm.value.address;
    this.iaddContactModel.city = this.myContactForm.value.city;
    this.iaddContactModel.company = this.myContactForm.value.companyName;
    this.iaddContactModel.email = this.myContactForm.value.email;
    this.iaddContactModel.firstName = this.myContactForm.value.firstName;
    this.iaddContactModel.lastName = this.myContactForm.value.lastName;
    this.iaddContactModel.phone = this.myContactForm.value.phoneNo;
    this.iaddContactModel.stateId=(this.myContactForm.value.stateId == '0')?null:this.myContactForm.value.stateId;
    this.iaddContactModel.supplierId = this.loggedId;
    this.iaddContactModel.countryId = this.myContactForm.value.countryId;
    this.iaddContactModel.zipCode = this.myContactForm.value.zipCode;
    if( this.iaddContactModel.stateId !=null) {
      let data= this.iRegionModel.find(x=>x.regionId == this.iaddContactModel.stateId);
      if(data) {
        this.iaddContactModel.stateName=data.regionName;
      }

    }
    if( this.iaddContactModel.countryId !=null) {
      let data= this.iCountryColl.find(x=>x.countryId == this.iaddContactModel.countryId );
      if(data) {
        this.iaddContactModel.countryName=data.countryName;
      }

    }
    this._qmsService.AddMQSContact(this.iaddContactModel).subscribe(result => {

      if(result['result'] === true) {
        localStorage.setItem('myContactEncryptId', result['data'].mqsContactIdEncrypt);
        this._qmsService.set(true,'isadd');
        this._rfqService.set(false, 'showCustomModel');
        this.iRegionModel = [];
        this._toastr.success(result['errorMessage'], '');
        this.tempModel.close();
        this.isBtnClicked = false;
      } else {
        this._toastr.error(result['errorMessage'], '');
        this.isBtnClicked = false;
      }


    } , error => () => {
      this.isBtnClicked = false;
      this._rfqService.handleError(error);
    });
  }
  close() {
    this._rfqService.set(false, 'showCustomModel');
  }
  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != '') {
      // this.iProfileViewModel['phoneNo'] = number.replace(/-/g, '');
      this.myContactForm.patchValue({
        'phoneNo': number.replace(/-/g, '')
      });
    }
  }
}
