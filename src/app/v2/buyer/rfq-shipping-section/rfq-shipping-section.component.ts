import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RFQBaseComponent } from '../rfq-base.component ';
import { RequestQuoteService } from '../request-form-quote.service';
import { CustomValidatorService } from '../../../../app/core/services/validator/custom-validator.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserStorageUtil } from '../../../../app/shared/browser.storage.util';
import { AppUtil } from '../../../../app/app.util';

@Component({
  selector: 'rfq-shipping-section',
  templateUrl: 'rfq-shipping-section.component.html',
  styleUrls: ['rfq-shipping-section.component.scss', '../rfq-common.scss']
})
export class RFQShippingSectionComponent extends RFQBaseComponent implements OnInit {

  shippingForm: FormGroup;
  shippingFormData: FormGroup;
  countryList: any = [];
  stateList: any = [];
  existingAddressList: any = [];
  defaultCountry: any = {};
  whoPaysForShipping = this.BUYER_PAYS_FOR_SHIPPING;
  addEditModelReference: any;
  confirmationModelReference: any;
  showShipToNotSelectedError = false;
  
  addressToDelete;
  isInitialized: boolean = false;
  dataLoaded = false;
  contactId;
  @ViewChild('addEditModel', { static: true }) addEditModel: TemplateRef<any>;
  @ViewChild('confirmationModel', { static: true }) confirmationModel: TemplateRef<any>;

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private requestQuoteService: RequestQuoteService,
    private customValidatorsService: CustomValidatorService){
    super();
  }

  ngOnInit(): void {
    this.shippingFormData = this.formBuilder.group({
      shipTo: [0,[Validators.required, Validators.min(1)]],
      whoPaysForShipping: [this.whoPaysForShipping,[Validators.required, Validators.min(1)]],
      defaultAddress: null
    })
    if (this.requestQuoteService.getCurrentRFQData().rfqId > 0) {
      this.initialize();
    }
  }

  initialize() {
    this.showShipToNotSelectedError=false;
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.contactId = BrowserStorageUtil.getLoogedUserId();
      this.requestQuoteService.showAPIRunningLoader();
      this.requestQuoteService.loadAllShippingAddress(this.contactId).subscribe(saList => {
        this.existingAddressList = saList;
        this.dataLoaded = true;
       this.requestQuoteService.hideAPIRunningLoader();
      });
      let shippingSectionData = this.requestQuoteService.getShippingSectionData();
      this.whoPaysForShipping = shippingSectionData.whoPaysForShipping == null ? 1 : shippingSectionData.whoPaysForShipping;
      this.shippingFormData = this.formBuilder.group({
        shipTo: [shippingSectionData.shipTo],
        whoPaysForShipping: [this.whoPaysForShipping],
        defaultAddress: null
      })
      this.initFormData();
    }
  }

  initFormData(){
      this.shippingForm = this.formBuilder.group({
        addressId: [0],
        city: ["", Validators.required],
        deptAddress: [],
        postalCode: ["", Validators.required],
        stateId: ["0", [Validators.required, Validators.min(1)]],
        countryId: ["", [Validators.required, Validators.min(1)]],
        streetAddress: ["", Validators.required],
        siteLabel: ["", Validators.required],
        defaultSite: [false],
        siteId: [0]
      });
      this.scrollPageToTop();
  }

  setWhoPaysForShipping(whoPaysForShipping) {
    this.shippingFormData.patchValue({ whoPaysForShipping: whoPaysForShipping })
  }
  deletAaddress(address) {
    if (this.existingAddressList && this.existingAddressList.length == 1) {
      this.requestQuoteService.showTosterWarningMessage("At least one address required for shipping");
      return;
    }
    this.addressToDelete = address
    this.confirmationModelReference = this.modalService.open(this.confirmationModel, {
      backdrop: 'static'
    });
  }
  editAddress(address) {
    this.initFormData();
    this.requestQuoteService.loadCountryData().subscribe(countryList => {
      this.countryList = countryList;
      this.requestQuoteService.loadStateBYCountryId(address.countryId).subscribe(stateList => {
        this.stateList = stateList;
        this.addEditModelReference = this.modalService.open(this.addEditModel, {
          backdrop: 'static',
          windowClass: "addeditshippingmodalclass"
        });
        this.shippingForm.patchValue(address);
      });
    });
  }
  addNewAddress(countryId = 0) {
    this.initFormData();
    this.requestQuoteService.loadCountryData().subscribe(countryList => {
      this.defaultCountry = this.countryList.find(m => { return m.isoCode === 'US' });
      this.countryList = countryList;
      this.requestQuoteService.loadStateBYCountryId(countryId).subscribe(stateList => {
        this.stateList = stateList;
        const countryId = this.defaultCountry ? this.defaultCountry.countryId : 0;
        this.shippingForm.patchValue({ stateId: 0, countryId: countryId });
        this.addEditModelReference = this.modalService.open(this.addEditModel, {
          backdrop: 'static'
        });
      });
    });
  }

  changeDefaultAddress(address) {
    this.existingAddressList.forEach(element => {
      element.defaultSite = false;
    });
    address.defaultSite = true;
    this.shippingFormData.value.defaultAddress = address;
  }

  saveUpdateContinueToListing() {
    this.requestQuoteService.validateRFQSectionsFormFields(this.shippingForm);
    if (this.shippingForm.valid) {
      this.requestQuoteService.validateAndSaveShippingSectionData(this.shippingForm.value).subscribe(
        success => {
          if (success)
            this.requestQuoteService.loadAllShippingAddress(this.contactId).subscribe(saList => {
              this.existingAddressList = saList;
              if(saList.length==1){
                this.shippingFormData.patchValue({shipTo:saList[0].siteId});
                
              }
              this.closeAddEditPopup();
            });
        });
    }
  }
  acceptOrReject(response) {
    if (response) {
      this.requestQuoteService.showAPIRunningLoader();
      this.requestQuoteService.deleteShippingAddress(this.addressToDelete.addressId).subscribe(success => {
        if (success) {
          this.requestQuoteService.loadAllShippingAddress(this.contactId).subscribe(saList => {
            this.existingAddressList = saList;
            this.requestQuoteService.hideAPIRunningLoader();
          });
        }
        this.addressToDelete = null;
        this.confirmationModelReference.close();
        this.confirmationModelReference = null;
      });
    } else {
      
      this.addressToDelete = null;
      this.confirmationModelReference.close();
      this.confirmationModelReference = null;
    }
  }

  isShippingFieldValid(field: string) {
    return this.customValidatorsService.isFieldValid(this.shippingForm, field);
  }
  closeAddEditPopup() {
    if (this.addEditModelReference) {
      this.addEditModelReference.close();
      this.addEditModelReference = null;
    }
  }
  confirmationModelPopup() {
    if (this.confirmationModelReference) {
      this.confirmationModelReference.close();
      this.confirmationModelReference = null
    }
  }

  updateRFQShippingAddress(nextSection) {
    if (this.existingAddressList.length == 0 && nextSection == this.RFQ_DS) {
      this.requestQuoteService.changeSection(nextSection);
      return;
    }
    this.showShipToNotSelectedError = false;
    if (AppUtil.isEmptyString(this.shippingFormData.value.shipTo) ||
      this.shippingFormData.value.shipTo < 1) {
      this.showShipToNotSelectedError = true;
      return;
    }
    this.requestQuoteService.updateRFQShippingAddress(this.shippingFormData.value, nextSection);
    if (this.shippingFormData.value.defaultAddress != null) {
      this.requestQuoteService.validateAndSaveShippingSectionData(this.shippingFormData.value.defaultAddress).subscribe(
        success => {

        });
    }
  }

  updateStateDropdown(value) {
    this.requestQuoteService.loadStateBYCountryId(value).subscribe(stateList => {
      this.stateList = stateList;
      this.shippingForm.patchValue({ stateId: 0 });
    })
  }
}
