import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { IFeetypeList } from '../../../../core/models/qmsModel';
import {
  appConstants
} from '../../../../core/config/constant';
import { MasterService } from '../../../../core/services/master/master.service';
import { ToastrService } from 'ngx-toastr';
import { QmsService } from '../../../../core/services/qms/qms.service';
import { ApiService } from '../../../../__Services/api-service/api.service';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { element } from 'protractor';
@Component({
  selector: 'app-qms-invoice-special-fee',
  templateUrl: './qms-invoice-special-fee.component.html',
  styleUrls: ['./qms-invoice-special-fee.component.scss']
})
export class QmsInvoiceSpecialFeeComponent implements OnInit, OnChanges {

  FeeTypeForm: FormGroup;
  FeeTypeArray: FormArray;
  iFeetypeList: any[];
  feesItem: FormArray;
  decimalValueDefault: number;
  showZero:any;
  private _specialFeelist: any;
  previousSelectId: number = null;
  @Input() proceedToSaveSpecialFeeType:  boolean;
  @Input() partID:  number;
  @Input() qmsQuoteID:  number;
  @Input() invoiceID: number;
  @Input() partInvoiceID: number;
  @Input() isPartOfInvoice: boolean;
  @Input() partChecked:boolean;
  @Input() isSpecailFeeSave:boolean;
  @Output() partSpecialFeeUpdateInfoChange = new EventEmitter();
  invoiceFeeTemp: any;

  constructor(private _masterService: MasterService, private _fb: FormBuilder, private _toastr: ToastrService, private _qmsService: QmsService, private rest: ApiService,) { }
  @Input()
  get specialFee(): any {
    return this._specialFeelist;
  }
  @Output() specialFeeChange = new EventEmitter();
  set specialFee(value: any) {
    this._specialFeelist = value;
    console.log(' fee value -',value);
    this.specialFeeChange.emit(this._specialFeelist);
  }
  ngOnInit() {
    this.invoiceFeeTemp={
      partID: 0,
      feeTypeArray: [],
      sum: 0
    }
    this.showZero=0.0000;
    if (appConstants.settingDefault.decimalValueDefault == null || appConstants.settingDefault.decimalValueDefault == undefined) {
      this._masterService.getDefaultQmsDecimalPlaces(this.loggedId).subscribe(res => {
        if (!res.isError) {
          appConstants.settingDefault.decimalValueDefault = res.data;
          this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
          this.showZero= this.showZero.toFixed(this.decimalValueDefault);
        }
      })
    } else {
      this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
      this.showZero= this.showZero.toFixed(this.decimalValueDefault);
    }
    this.GetQMSFeeType();
    this.FeeTypeForm = this._fb.group({
      FeeTypeArray: this._fb.array([this.createFeeType()])
    });
    // this.FeeTypeForm.controls["FeeTypeArray"].valueChanges.subscribe(data => {
    //    console.log(data);
    //  });
     let item =  this.FeeTypeForm.get('FeeTypeArray') as FormArray;
    let itemList = item.controls[0].valueChanges.subscribe(data => {
      console.log('data change' ,data);
      this.invoiceFeeTemp.partID = this.partID;
      this.invoiceFeeTemp.feeTypeArray = [];
      this.invoiceFeeTemp.sum = data.subTotal;
      data.feesItem.forEach(element => {
        let feeObject = {
            feeId : element.name,
            cost: element.cost,
            feeName: '',
        }
        if(this.iFeetypeList.filter( x => (x.qmsFeeTypeId == element.name))[0] != undefined || this.iFeetypeList.filter( x => (x.qmsFeeTypeId == element.name))[0] != null ){
          feeObject.feeName = this.iFeetypeList.filter( x => (x.qmsFeeTypeId == element.name))[0].feeType;
        }
        this.invoiceFeeTemp.feeTypeArray.push(feeObject);

      });
      // console.log('data change 1' , this.invoiceFeeTemp);
      // this.partSpecialFeeUpdateInfoChange.emit(this.invoiceFeeTemp);
      this.specialFee = this.invoiceFeeTemp;
    });
    setTimeout(()=>{
      if( this.specialFee!=null &&  this.specialFee !=undefined) {
      if(this.FeeTypeForm.valid){
        this.specialFee.isValid = true;
      } else{
        this.specialFee.isValid = false;
      }
    }
    },1000);

  }
  GetQMSFeeType() {
    this._qmsService.GetQMSFeeType(this.loggedCompanyId, this.qmsQuoteID).subscribe(res => {
      // console.log('units', res);
      this.iFeetypeList = res['data'];
      this.iFeetypeList.forEach((element)=>{
        element.isDisabled = false;
      });
      this.getSpecialFeeType();
    });
  }
  getSpecialFeeType(){
    let newInvoiceID;
    let newPartId;
    if( this.invoiceID == null || this.invoiceID == undefined){
      // this.invoiceID = 0;
      newInvoiceID = 0;
    } else{
      newInvoiceID = this.invoiceID;
    }
    if(this.partInvoiceID == null && this.partInvoiceID == undefined){
      newPartId = 0;
    } else{
      newPartId = this.partInvoiceID
    }
    this.rest.get('InvoicePartSpecialFeesInfo?invoiceId=' + newInvoiceID + '&qmsPartId=' + this.partID+'&qmsQuoteInvoicePartId='+ newPartId)
              .subscribe(
                ( response ) => {
                  if (!response.isError) {
                    if(response.data.specialFeesList != null && response.data.specialFeesList != undefined && response.data.specialFeesList.length){
                      let data = this.FeeTypeForm.get('FeeTypeArray')['controls'][0];
                      this.feesItem = data.get('feesItem') as FormArray;
                      this.feesItem.removeAt(0);
                      response.data.specialFeesList.forEach(element => {
                        this.feesItem.push(this.setFeeTypeItem(element.feeTypeId, element.value.toFixed(this.decimalValueDefault)));
                        this.iFeetypeList.forEach(ele=>{
                          if(ele.qmsFeeTypeId == element.feeTypeId){
                            ele.isDisabled = true;
                          }
                        });
                      });
                      this.blurSpecial(this.FeeTypeForm.get('FeeTypeArray')['controls'][0]);
                    }
                  }
                });
  }
  setFeeTypeItem(name, value): FormGroup {
    return this._fb.group({
      name: [name],
      cost: [value, [Validators.required]],
    });
  }
  getFeesDetails(forQuantity) {
    return forQuantity.get('feesItem') as FormArray;
  }
  createFeeType(): FormGroup {
    return this._fb.group({
      'feesItem': this._fb.array([this.createFeeTypeItem()]),
      'subTotal': 0
    });

  }
  getSpecialTotal() {
    let item =  this.FeeTypeForm.get('FeeTypeArray') as FormArray;
    // console.log(item.controls[0].get('subTotal').value);
    return (item.controls[0].get('subTotal').value).toFixed(this.decimalValueDefault);
    // return 0;
  }
  addFeeQuantityItem(item) {
    this.feesItem = item.get('feesItem') as FormArray;
    this.feesItem.push(this.createFeeTypeItem());
  }
  createFeeTypeItem(): FormGroup {
    return this._fb.group({
      name: ['0'],
      cost: [null],
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
  removeFeeQuantityItem(item, index, controls) {
    this.feesItem = item.get('feesItem') as FormArray;
    this.feesItem.removeAt(index);
    let selectedFeeId = controls.get('name').value;
        this.iFeetypeList.forEach(element=>{
          if(element.qmsFeeTypeId == selectedFeeId){
            element.isDisabled = false;
          }
        });
    controls.get('cost').setValidators([]);
    controls.get('cost').updateValueAndValidity();
    this.blurSpecial(item);
  }
  blurSpecial(item) {
    // tslint:disable-next-line:radix
    //  const sum = item.get('price').value as number * item.get('feeQuantity').value;
    let sum2 = 0;
    for (let i = 0; item.get('feesItem').controls.length > i; i++) {
      sum2 += Number(item.get('feesItem').controls[i].get('cost').value);
    }
    // this.part1Total = sum + sum2;
    item.patchValue({
      'subTotal': sum2
    });
    console.log("formvalid",this.FeeTypeForm.valid);
    setTimeout(()=>{
      if(this.FeeTypeForm.valid){
        this.specialFee.isValid = true;
      } else{
        this.specialFee.isValid = false;
      }
      this.specialFeeChange.emit(this.specialFee);
    },1000)

  }
  validateChangeFeeQuantityFeeType(controls, item, index) {
    if (controls.get('name').value === '-1') {
      // this.tempControl = controls;
      // this.openModal();

    } else {
      if (controls.get('name').value === '0') {
        controls.patchValue({
          'cost': null
        });
        controls.patchValue({
          'name': '0'
        });
        controls.get('cost').setValidators([]);
        controls.get('cost').updateValueAndValidity();
        this.blurSpecial(item);
      } else {
        controls.patchValue({
          'cost': null
        });
        controls.get('cost').setValidators([Validators.required]);
        controls.get('cost').updateValueAndValidity();
        this.blurSpecial(item);
      }
      let selectedFeeId = controls.get('name').value;
        this.iFeetypeList.forEach(element=>{
          if(element.qmsFeeTypeId == selectedFeeId){
            element.isDisabled = true;
          }
          if( element.qmsFeeTypeId == this.previousSelectId){
            element.isDisabled = false;
          }
        });
      if(selectedFeeId != null && selectedFeeId != 0 ){
        controls.patchValue({
          'cost': null
        });
        controls.get('cost').setValidators([Validators.required]);
        controls.get('cost').updateValueAndValidity();
        this.blurSpecial(item);
        let partInvoiceId;
        if(this.invoiceID == undefined || this.invoiceID == null || this.invoiceID == 0) {
          this.invoiceID=0;
          partInvoiceId=this.partID;
        }
        if(this.partInvoiceID !== undefined && this.partInvoiceID !== null && this.partInvoiceID !== 0) {
          partInvoiceId= this.partInvoiceID;
        }
        this._qmsService.getQmsPartSpecialFeeTypeCost(partInvoiceId,selectedFeeId,this.invoiceID).subscribe(res=>{
          if(res.isError == false) {
            if(res.data.unitPrice !=null) {
              controls.patchValue({
                'cost': res.data.unitPrice
              });
              controls.get('cost').setValidators([Validators.required]);
              controls.get('cost').updateValueAndValidity();
              this.blurSpecial(item)

            } else {
              controls.patchValue({
                'cost': null
              });
              controls.get('cost').setValidators([Validators.required]);
              controls.get('cost').updateValueAndValidity();

              this.blurSpecial(item)
            }
          } else {
            controls.patchValue({
              'cost':null
            });
            controls.get('cost').setValidators([Validators.required]);
            controls.get('cost').updateValueAndValidity();

            this.blurSpecial(item)
          }
        },error =>{
          controls.patchValue({
            'cost': null
          });
          controls.get('cost').setValidators([Validators.required]);
          controls.get('cost').updateValueAndValidity();

          this.blurSpecial(item)
        })


      } else{
        controls.get('cost').setValidators([]);
        controls.get('cost').updateValueAndValidity();
        controls.patchValue({
          'cost': null
        });
        this.blurSpecial(item);
      }
      // if(this.FeeTypeForm.valid){
      //   this.specialFee.isValid = true;
      // } else{
      //   this.specialFee.isValid = false;
      // }
      // for (let i = 0; item.get('feesItem').controls.length > i; i++) {
      //   if (i != index) {
      //     if (item.get('feesItem').controls[i].get('name').value == controls.get('name').value) {
      //       this._toastr.warning('This fee type is already selected', 'Warning!');
      //       controls.patchValue({
      //         'cost': null
      //       });
      //       controls.patchValue({
      //         'name': '0'
      //       });
      //       break;
      //     }
      //     controls.get('cost').setValidators([]);
      //     controls.get('cost').updateValueAndValidity();
      //   } else {
      //     if (item.get('feesItem').controls[i].get('name').value != 0) {
      //       controls.get('cost').setValidators([Validators.required]);
      //       controls.get('cost').updateValueAndValidity();
      //     }

      //   }
      // }
    }
    // console.log('ddd', this.FeeTypeForm);
  }
  ngOnChanges(changes: SimpleChanges) {
    // const proceedToSaveInAction: SimpleChange = changes.proceedToSaveSpecialFeeType;
    const proceedToSaveInAction: SimpleChange = changes.isSpecailFeeSave;
    if (proceedToSaveInAction != undefined &&
      proceedToSaveInAction.currentValue != undefined &&
      proceedToSaveInAction.currentValue != null &&
      proceedToSaveInAction.currentValue == true && this.partChecked && this.isSpecailFeeSave) {
        const tempObj= {
          qmsQuoteInvoiceId: this.invoiceID,
          qmsQuotePartId: this.partID,
          specialFeesList: []
        }
        let item =  this.FeeTypeForm.get('FeeTypeArray') as FormArray;
        let itemList = item.controls[0].get('feesItem').value;
        // console.log('list ',itemList);
        let tempListArray = [];
        itemList.forEach(element => {
          let tempData = {
            feeTypeId: element.name,
            value: element.cost
          }
          tempListArray.push(tempData);
        });
        // console.log('list array',tempListArray);
        console.log('list array', tempObj);
        tempObj.specialFeesList = tempListArray;
        this.rest.post('InvoicePartSpecialFeesInfo', tempObj)
        .subscribe(
          ( response ) => {
            if (!response.isError) { }
          });

      }
  }
  setPreviousVal(controls){
    this.previousSelectId = controls.get('name').value;
    console.log("prve", this.previousSelectId );
  }
  // check(){
  //   let item =  this.FeeTypeForm.get('FeeTypeArray') as FormArray;
  //   let itemList = item.controls[0].get('feesItem').value;
  //   console.log('list ',itemList);
  //   let tempListArray = [];
  //   itemList.forEach(element => {
  //     let tempData = {
  //       feeTypeId: element.name,
  //       value: element.cost
  //     }
  //     tempListArray.push(tempData);
  //   });
  //   console.log('list array',tempListArray);
  // }
}
