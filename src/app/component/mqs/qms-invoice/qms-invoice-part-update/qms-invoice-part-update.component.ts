import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Output,
  EventEmitter
} from '@angular/core';
import {  
  trigger,
  state,
  style,
  transition,
  animate,
  group} from '@angular/animations'
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import {
  NgxSelectModel
} from '../../../ngx-gen-select/ngxSelectModel';
import {
  ApiService
} from '../../../../__Services/api-service/api.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  QMSQuotePartQuantity,
  IFeetypeList,
  InvoicePartSave,
  InvoicePartQuantities,
  InvoiceQuantitesFees
} from '../../../../core/models/qmsModel';
import {
  QmsService
} from '../../../../core/services/qms/qms.service';
import { element } from 'protractor';

@Component({
  selector: 'app-qms-invoice-part-update',
  templateUrl: './qms-invoice-part-update.component.html',
  styleUrls: ['./qms-invoice-part-update.component.scss'],
  providers: [ApiService]
})
export class QmsInvoicePartUpdateComponent implements OnInit, AfterViewInit, OnChanges {
  // New Code start
  constructor(private _fb: FormBuilder, private rest: ApiService,
    private _router: ActivatedRoute, private _qmsService: QmsService) {

    }

  public invoicePartForm1: FormGroup;
  public partQuantities: FormArray;
  public feeTypeList: FormArray;
  partChecked: any;
  isPartChecked: boolean;
  @Input() partName: string;
  @Input() partNumber: number;
  @Output() isOtherCheckChangeEventHandler = new EventEmitter < any > ();
  @Output() amountChange = new EventEmitter < number > ();
  @Input() checkAllPart: boolean;
  @Input()qmsQuoteId:number;
  @Output() isFormValidChangeEventHandler = new EventEmitter < any > ();
  partSubTotal: number = 0.0000;
  iFeetypeList: IFeetypeList[] = [];
  previousSelectedFeeTypeId: any = '';
  qmsQuotePartQuantity: QMSQuotePartQuantity[] = [];
  qmsQuotePartQuantityobj: QMSQuotePartQuantity;
  tempFeetypeList = [];
  perivousSelectedQuantityId: number = 0;
  invoicePartSave:InvoicePartSave;
  invoicePartQuantities:InvoicePartQuantities;
  invoiceQuantitesFees:InvoiceQuantitesFees;
  quantityFeesLoader:boolean=null;
  isLoader:boolean=false;
  isSpecailFeeSave:boolean=false;
  createInvoiceForm() {

    this.invoicePartForm1 = this._fb.group({
      partQuantities: this._fb.array([this.createPartQuantity()]),
      specialFeeValid: ''
    })
  }
  checkAllParts() {
    if (this.invoicePartForm1 && !this.invoicePartForm1.invalid && this.checkAllPart) {
      this.isPartChecked = true;
    } else {
      this.isPartChecked = false;
    }
    this.isCheckedPart();
  }
  isFormValid() {
    if (this.invoicePartForm1 && !this.invoicePartForm1.invalid) {
      this.partChecked.isFormValid=true;
     this.isFormValidChangeEventHandler.emit(this.partChecked);
    } else {
      this.partChecked.isFormValid=false;
      this.isFormValidChangeEventHandler.emit(this.partChecked);
    }
  }
  // ^([\d]*[1-9]+[\d]*)$
  createPartQuantity(): FormGroup {
    return this._fb.group({
      selectedQuantityId: ['', Validators.required],
      selectedUnitName: '',
      quantity:[{
        value: '',
        disabled: true
      },[Validators.required,Validators.pattern('^[1-9][0-9]*$')]],
      selectedUnitId:[''],
      feeTypeList: this._fb.array([])
    });
  }
  createQuantityFeeType(quantityInfo,feeTypeId = null): FormGroup {
    if(feeTypeId != null){
      return this._fb.group({
        feeTypeId: [feeTypeId, Validators.required],
        feeTypeCost: [{
          value: '',
          disabled: false
        }, Validators.required],
        feeTypeName: ''
      });
    } else{
      return this._fb.group({
        feeTypeId: [''],
        feeTypeCost: [{
          value: '',
          disabled: true
        }],
        feeTypeName:''
      });
    }

  }
  addQuantityFeeTypeByQuantityId(feetype, cost,feeType): FormGroup {
    return this._fb.group({
      feeTypeId: [feetype, Validators.required],
      feeTypeCost: [cost, Validators.required],
      feeTypeName: [feeType],
    });
  }


  addPartQuantityItem() {
    this.partQuantities = this.invoicePartForm1.get('partQuantities') as FormArray;
    this.partQuantities.push(this.createPartQuantity());
    this.tempFeetypeList.push(JSON.parse(JSON.stringify(this.iFeetypeList)));

  }
  removePartQuantityItem(index) {
    this.partQuantities = this.invoicePartForm1.get('partQuantities') as FormArray;
    let selectedQuantity=this.partQuantities.value[index];
    if(selectedQuantity && selectedQuantity.selectedQuantityId != '' && selectedQuantity.selectedQuantityId != -1) {
      let isDisabledSelecetdQuantity = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == selectedQuantity.selectedQuantityId);
      isDisabledSelecetdQuantity.isDisabled = !isDisabledSelecetdQuantity.isDisabled;
    }
    this.partQuantities.removeAt(index);
     this.calculatePartSubTotal();
  }
  addQuantityFeeType(quantityInfo, feeTypeId) {
    this.feeTypeList = quantityInfo.get('feeTypeList') as FormArray;
    this.feeTypeList.push(this.createQuantityFeeType(quantityInfo,feeTypeId));
  }
  addPartQuantityByInvoiceId(data): FormGroup {
    return this._fb.group({
      selectedQuantityId: [data.selectedQuantityId, Validators.required],
      selectedUnitName: '',
      quantity:[data.quantity,Validators.required],
      selectedUnitId:[data.selectedUnitId],
      feeTypeList: this._fb.array([])
    });
  }
  onChangeLoadFeeType(quantityInfo, quantityId, feeIndex) {

     this.isLoader=true;
    setTimeout(() => {
    this.calculatePartSubTotal();
  }, 2000);
    let tempQuotePartQty = this.qmsQuotePartQuantity.filter(x=> x.qmsQuotePartQtyId ==  quantityId);
    if(tempQuotePartQty.length > 0){
      quantityInfo.get('quantity').enable();
      quantityInfo.patchValue({
        selectedUnitName: tempQuotePartQty[0].partQtyUnit,
        quantity: tempQuotePartQty[0].partQty,
      });
      // quantityInfo.value.selectedUnitname = tempQuotePartQty[0].partQtyUnit;
      // quantityInfo.value.quantity = tempQuotePartQty[0].partQty;
    }
    this.feeTypeList = quantityInfo.get('feeTypeList') as FormArray;
    let dataArry = quantityInfo.get('feeTypeList')['controls'];
    while (dataArry.length) {
      dataArry.forEach((element, index) => {
        this.feeTypeList.removeAt(index);
      });
    }
    this.tempFeetypeList[feeIndex].forEach( ele=>{
      ele.isDisabled = false;
    });

    if (this.perivousSelectedQuantityId != 0) {
      let isDisabledSelecetdQuantity = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == this.perivousSelectedQuantityId);
     if(isDisabledSelecetdQuantity != undefined && isDisabledSelecetdQuantity != null) {
            isDisabledSelecetdQuantity.isDisabled = !isDisabledSelecetdQuantity.isDisabled;
           }
      // isDisabledSelecetdQuantity.isDisabled = !isDisabledSelecetdQuantity.isDisabled;
    }
    if (quantityId != '' &&  quantityId != -1) {
      let isDisabledSelecetdQuantity = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == quantityId);
      isDisabledSelecetdQuantity.isDisabled = !isDisabledSelecetdQuantity.isDisabled;
      let level = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == quantityId).qtyLevel;
      this._qmsService.GetQMSFeeTypeByQuantityId(this.loggedCompanyId, this.partID, this.qmsQuoteIdEncrypt, level).subscribe(res => {
        if (res['isError'] == false) {
          if (res['data'].length != 0 && res['data'] != null) {
            res['data'].forEach(element => {
              if (element.unitPrice != null) {
                let tempIndex = this.tempFeetypeList[feeIndex].findIndex(ele=> ele.qmsFeeTypeId == element.qmsFeeTypeId);
                if(tempIndex != -1){
                  this.feeTypeList.push(this.addQuantityFeeTypeByQuantityId(element.qmsFeeTypeId, element.unitPrice, this.tempFeetypeList[feeIndex][tempIndex].feeType));
                  this.tempFeetypeList[feeIndex][tempIndex].isDisabled = true;

                } else {
                  this.feeTypeList.push(this.addQuantityFeeTypeByQuantityId(element.qmsFeeTypeId, element.unitPrice,'Price per unit'));
                }

              }

            });
            setTimeout(() => {
              this.calculatePartSubTotal();
            }, 1000);
          }
          this.isLoader=false;
        } else {
          this.isLoader=false;
        }
      },error=>{
        this.isLoader=false;
      })

    quantityInfo.patchValue({
      'quantity': '',
      'selectedUnitId': ''
    });
    quantityInfo.controls['quantity'].disable();
    quantityInfo.get('quantity').clearValidators();
    quantityInfo.get('selectedUnitId').clearValidators();

    } else if(quantityId == -1) {
      this.isLoader=false;
        this.isPartChecked = false;
        quantityInfo.patchValue({
          'quantity': '',
          'selectedUnitId': ''
        });
        quantityInfo.controls['quantity'].disable();
        quantityInfo.get('selectedUnitId').setValidators([Validators.required]);
        quantityInfo.get('selectedUnitId').updateValueAndValidity();

        this.isCheckedPart();
         setTimeout(() => {
              this.calculatePartSubTotal();
            }, 1000);

    } else if(quantityId == '') {
      this.isLoader=false;
      quantityInfo.patchValue({
        'selectedQuantityId': '',
        'quantity': '',
        'selectedUnitId': ''
      });
      quantityInfo.controls['quantity'].disable();
      quantityInfo.get('quantity').clearValidators();
      quantityInfo.get('selectedUnitId').clearValidators();
        this.isPartChecked = false;
          this.isCheckedPart();

    }
  }


  onChangeSelectFeeType(controls, selectedFeeTypeId, index,selectedQuantityId) {
    let quantityId=selectedQuantityId;
    if(this.invoiceID == undefined || this.invoiceID == null || this.invoiceID == 0) {
      this.invoiceID=0;
    } else {
      quantityId= this.partInvoiceID;
    }
    // if(this.partInvoiceID !== undefined && this.partInvoiceID !== null && this.partInvoiceID !== 0) {
    //   quantityId= this.partInvoiceID;
    // }
     if (selectedFeeTypeId != '') {
    this._qmsService.getQmsPartQtyFeeTypeCost( quantityId,selectedFeeTypeId,this.invoiceID).subscribe(res=>{
   if(res.isError == false) {
     if(res.data.unitPrice !=null) {
      controls.get('feeTypeCost').setValidators([Validators.required]);
      controls.updateValueAndValidity();
      controls.get('feeTypeCost').enable();
      controls.patchValue({
        'feeTypeCost': res.data.unitPrice
      })
      this.calculatePartSubTotal();


     } else {
      controls.get('feeTypeCost').setValidators([Validators.required]);
      controls.updateValueAndValidity();
      controls.get('feeTypeCost').enable();
      controls.patchValue({
        'feeTypeCost': ''
      })
      this.calculatePartSubTotal();

     }
   }  else {
    controls.get('feeTypeCost').setValidators([Validators.required]);
    controls.updateValueAndValidity();
    controls.get('feeTypeCost').enable();
    controls.patchValue({
      'feeTypeCost': ''
    })
    this.calculatePartSubTotal();

   }
    },error =>{
      controls.get('feeTypeCost').setValidators([Validators.required]);
      controls.updateValueAndValidity();
      controls.get('feeTypeCost').enable();
      controls.patchValue({
        'feeTypeCost': ''
      })
      this.calculatePartSubTotal();

    })

    } else {
      controls.get('feeTypeCost').setValidators(null);
      controls.get('feeTypeId').setValidators(null);
      controls.get('feeTypeCost').clearValidators();
      controls.get('feeTypeId').clearValidators();
      controls.updateValueAndValidity();
      controls.patchValue({
        'feeTypeCost': '',
        'feeTypeId':''
      })

      controls.get('feeTypeCost').disable();




      this.calculatePartSubTotal();

    }

    let tempIndex = this.tempFeetypeList[index].findIndex(ele=> ele.qmsFeeTypeId == selectedFeeTypeId);
    if(tempIndex != -1){
      this.tempFeetypeList[index][tempIndex].isDisabled = true;
      controls.patchValue({
        'feeTypeName':  this.tempFeetypeList[index][tempIndex].feeType
      })
    } else {
      controls.patchValue({
        'feeTypeName': ' Price per unit'
      })
    }
    tempIndex = this.tempFeetypeList[index].findIndex(ele=> ele.qmsFeeTypeId == this.previousSelectedFeeTypeId);
    if(tempIndex != -1){
      this.tempFeetypeList[index][tempIndex].isDisabled = false;
    }
  }
  removeQuantityFeeType(quantityInfo, index, feeIndex) {
    this.feeTypeList = quantityInfo.get('feeTypeList') as FormArray;
    if(this.feeTypeList.value[index].feeTypeId != ''){
      let tempIndex = this.tempFeetypeList[feeIndex].findIndex(ele=> ele.qmsFeeTypeId == this.feeTypeList.value[index].feeTypeId);
      if(tempIndex != -1){
        this.tempFeetypeList[feeIndex][tempIndex].isDisabled = false;
      }
    }
    this.feeTypeList.removeAt(index);
    this.calculatePartSubTotal();
  }


  getQMSQuotePartQuantity() {
    this._qmsService.QMSQuotePartQuantity(this.partID).subscribe(res => {
      if (!res['isError']) {
        this.qmsQuotePartQuantity = res['data'];
        this.qtyUnitCollction=[];
        this.qmsQuotePartQuantity.forEach(d=>{
          let existUnit = this.qtyUnitCollction.find(x => x.value == d.partQtyUnitId);
          if (existUnit == null || this.qtyUnitCollction.length == 0 || existUnit == undefined) {
            this.qtyUnitCollction.push({
              value: d.partQtyUnitId,
              text: d.partQtyUnit,
              isRemovable: false,
              isEditable: false,
              level: null
            })
          }
        })
        if(this.invoiceID != null && this.invoiceID !=undefined && this.invoiceID !=0) {
          this.getInvoiceDataByInvoiceId();
        }
      }
    })
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  setSelectedFeeType(selectedFeeTypeId){
    this.previousSelectedFeeTypeId = selectedFeeTypeId;
  }
  GetQMSFeeType() {
    this._qmsService.GetQMSFeeType(this.loggedCompanyId, this.qmsQuoteID).subscribe(res => {
      console.log('units', res);
      this.iFeetypeList = res['data'];
      this.iFeetypeList.forEach(element => {
        element.isSelected = false;
      });
      this.tempFeetypeList.push( JSON.parse(JSON.stringify(res['data'])));
    });
  }


  onChangeUnitSelection(event, quantityInfo) {
    // console.log(event.target.value, ' - ' ,quantityInfo,' - ',this.qtyUnitCollction);
    if (event.target.value == '') {
      // quantityInfo.patchValue({
      //   selectedUnitname: ''
      // });

      quantityInfo.controls['quantity'].disable();
      quantityInfo.get('quantity').clearValidators();
      this.feeTypeList = quantityInfo.get('feeTypeList') as FormArray;
      let dataArry = quantityInfo.get('feeTypeList')['controls'];
      while (dataArry.length) {
        dataArry.forEach((element, index) => {
          this.feeTypeList.removeAt(index);
        });
      }
    } else {
      this.isPartChecked = false;
      this.isCheckedPart();
      quantityInfo.controls['quantity'].enable();
      quantityInfo.get('quantity').setValidators([Validators.required,Validators.pattern('^[1-9][0-9]*$')]);
      this.addQuantityFeeType(quantityInfo, 1);
      let index = this.qtyUnitCollction.findIndex(x => x.value == event.target.value);
    }
  }

  discardQuantityOther(forQuantity) {
    forQuantity.patchValue({
      'selectedQuantityId': '',
      'quantity': '',
      'selectedUnitId': ''
    });
    forQuantity.controls['quantity'].disable();
    forQuantity.get('selectedUnitId').clearValidators();
    forQuantity.get('quantity').clearValidators();
    this.feeTypeList = forQuantity.get('feeTypeList') as FormArray;
    let dataArry = forQuantity.get('feeTypeList')['controls'];
    while (dataArry.length) {
      dataArry.forEach((element, index) => {
        this.feeTypeList.removeAt(index);
      });
    }
  }

  isCheckedPart() {
    if (this.partChecked) {
      this.partChecked.isChecked = this.isPartChecked;
      this.partChecked.form = this.invoicePartForm1;
      this.isOtherCheckChangeEventHandler.emit(this.partChecked);
    }

  }

  getPartSubTotal() {
    return this.partSubTotal.toFixed(this.decimalValueDefault);
  }
  getFeesDetails(forQuantity) {
    return forQuantity.get('feeTypeList') as FormArray;
  }
  get partDetails() {
    return this.invoicePartForm1.get('partQuantities') as FormArray;
  }

  calculateSubTotal(forQuantity, controls ?) {
    let subTotal = 0;

    if (controls && (controls.get('feeTypeCost').value == null || controls.get('feeTypeCost').value == '' || controls.get('feeTypeCost').value == undefined)) {
      this.isPartChecked = false;
      this.isCheckedPart();
    }
    if(forQuantity.controls.quantity.value == '' || forQuantity.controls.quantity.value == undefined || forQuantity.controls.quantity.value == null) {
      this.isPartChecked = false;
      this.isCheckedPart();
    }
    this.getFeesDetails(forQuantity).controls.forEach(element => {
      if (element == undefined || element == null || element.get('feeTypeCost').value == '') {
        element.value.amount = 0;
        element.patchValue({
          'feeTypeCost': ''
        });
      }
      if(forQuantity.controls.selectedQuantityId.value !=-1) {
        if (element.get('feeTypeId').value == 1) {
          let qty= this.qmsQuotePartQuantity.find(x=>x.qmsQuotePartQtyId == forQuantity.controls.selectedQuantityId.value).partQty;
          subTotal += qty * (element.get('feeTypeCost').value == '' ? 0 : parseFloat(element.get('feeTypeCost').value))
        } else {
          subTotal += (element.get('feeTypeCost').value == '' ? 0 : parseFloat(element.get('feeTypeCost').value));
        }
      } else {
        if (element.get('feeTypeId').value == 1) {
          subTotal += (forQuantity.controls.quantity.value == '' ? 0 :parseFloat(forQuantity.controls.quantity.value)) * (element.get('feeTypeCost').value == '' ? 0 : parseFloat(element.get('feeTypeCost').value))
        } else {
          subTotal += (element.get('feeTypeCost').value == '' ? 0 : parseFloat(element.get('feeTypeCost').value));
        }
      }

    });
    forQuantity.patchValue({
      'subTotal': subTotal
    });

    return subTotal;
  }

  calculatePartSubTotal(controls ?) {
    this.partSubTotal = 0.0000;
    this.partDetails.controls.forEach(element => {
      this.partSubTotal += this.calculateSubTotal(element,controls);
    });

    this.amountChange.emit(this.partSubTotal);
    this.isFormValid();
    //alert(partSubTotal);
  }

  //New Code End



  specialFee: any;
  @Input() partID: number
  @Input() invoiceID: number
  @Input() qmsQuoteID: number
  @Input() partIndex: number;
  @Input() decimalValueDefault: any;
  @Input() partInvoiceID: number;
  private _partUpdateInfo: any;
  @Input()
  get partUpdateInfo(): any {
    return this._partUpdateInfo;
  }
  @Output() partUpdateInfoChange = new EventEmitter();
  set partUpdateInfo(value: any) {
    this._partUpdateInfo = value;
    console.log(' change value -', value);
    this.partUpdateInfoChange.emit(this._partUpdateInfo);
  }

  private _isPartOfInvoice: boolean;
  @Input()
  get isPartOfInvoice(): boolean {
    return this._isPartOfInvoice;
  }
  @Output() isPartOfInvoiceChange = new EventEmitter();
  set isPartOfInvoice(value: boolean) {
    this._isPartOfInvoice = value;
    this.isPartOfInvoiceChange.emit(this._isPartOfInvoice);
    //this.calculatePartSubTotal();
  }

  private _proceedToSave: boolean = false;
  @Input() proceedToSave: boolean
  @Input() proceedToPreview: boolean
  loadingCompleted: boolean = false;
  public invoicePartForm: FormGroup;
  ngOnChanges(changes: SimpleChanges) {
    const checkAllPart:SimpleChange=changes.checkAllPart;
    if (checkAllPart != undefined && (
      checkAllPart.currentValue != undefined &&
      checkAllPart.currentValue != null &&
      checkAllPart.currentValue == true || checkAllPart.currentValue == false)) {
        this.checkAllParts();
      }
    const proceedToGeneratePreview: SimpleChange = changes.proceedToPreview;
    if (proceedToGeneratePreview != undefined &&
      proceedToGeneratePreview.currentValue != undefined &&
      proceedToGeneratePreview.currentValue != null &&
      proceedToGeneratePreview.currentValue == true) {
      this.partUpdateInfo = null;
      if (this.isPartChecked) {
      this.invoicePartForm1.value.partQuantities.forEach(ele => {
        let isSelecetdQuantity = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == ele.selectedQuantityId);
        if(isSelecetdQuantity != undefined) {
          ele.quantity=isSelecetdQuantity.partQty;
          ele.selectedUnitName=isSelecetdQuantity.partQtyUnit;
        } else {
          let isSelecetdQuantityUnit = this.qmsQuotePartQuantity.find(x => x.partQtyUnitId == ele.selectedUnitId);
          ele.selectedUnitName=isSelecetdQuantityUnit.partQtyUnit;
        }
            ele.feeTypeList.forEach(fee => {
              fee.feeTypeCost = (fee.feeTypeCost == '' || fee.feeTypeCost == isNaN || fee.feeTypeCost == undefined || fee.feeTypeCost == null) ? 0 : parseFloat(fee.feeTypeCost).toFixed(this.decimalValueDefault);
              fee.isDisabled = true;
              if(fee.feeTypeId == 1) {
                fee.feeTypeName="Price per unit";
              }
            })
          });
      let partInfoTemp = JSON.stringify(this.invoicePartForm1.value);
        this.partUpdateInfo = JSON.parse(partInfoTemp);
        this.partUpdateInfo.specialFee = this.specialFee;
        this.partUpdateInfo.partQuantities.forEach(ele => {
          // restartLoop: while (true) {
          for (let idx = 0; idx <= ele.feeTypeList.length - 1; idx++) {
            if (ele.feeTypeList[idx].selectedFeeTypeId == 0) {
              const index = ele.feeTypeList.indexOf(ele.feeTypeList[idx], 0);
              if (index > -1) {
                ele.feeTypeList.splice(index, 1);
                // continue restartLoop;
              }
            }
          }
          // break;
          // }
        });
        let tempPartDetail = [];
        this.partUpdateInfo.partQuantities.forEach((ele, index) => {
          // restartLoopQty: while (true) {
          if ((ele.selectedQuantityId == -1 && ele.selectedUnitId == 0) || (ele.selectedQuantityId == -1 && ele.quantity == 0) || (ele.selectedQuantityId == -1 && ele.feeTypeList.length == 0)) {

          } else {
            tempPartDetail.push(this.partUpdateInfo.partQuantities[index])
          }
        });
        this.partUpdateInfo.partQuantities = tempPartDetail;
      }
    }

    const proceedToSaveInAction: SimpleChange = changes.proceedToSave;
    if (proceedToSaveInAction != undefined &&
      proceedToSaveInAction.currentValue != undefined &&
      proceedToSaveInAction.currentValue != null &&
      proceedToSaveInAction.currentValue == true && this.isPartChecked) {
        this.invoicePartSave= new InvoicePartSave();
         this.invoicePartSave.invoiceId= this.invoiceID;
         this.invoicePartSave.partId= this.partID;
         this.invoicePartSave.quoteId= this.qmsQuoteID;
         this.invoicePartSave.isPartOfInvoice=true;

      this.invoicePartForm1.value.partQuantities.forEach(ele => {
        this.invoicePartQuantities= new InvoicePartQuantities();
        // invoiceQuantitesFees:InvoiceQuantitesFees;
        this.invoicePartQuantities.selectedQuantityId = parseInt(ele.selectedQuantityId);

        if(ele.selectedQuantityId == -1){
          this.invoicePartQuantities.selectedUnitId = parseInt(ele.selectedUnitId);
          this.invoicePartQuantities.quantity = parseInt(ele.quantity);
          this.invoicePartQuantities.selectedQuantityLevel
           this.invoicePartQuantities.selectedQuantityLevel=-1;
        } else {
          let partQtyUnitId = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == this.invoicePartQuantities.selectedQuantityId).partQtyUnitId;
          let partQty = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == this.invoicePartQuantities.selectedQuantityId).partQty;
          this.invoicePartQuantities.selectedUnitId  = partQtyUnitId;
          this.invoicePartQuantities.quantity=partQty;
          let partQtyLevel = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == this.invoicePartQuantities.selectedQuantityId).qtyLevel;
          this.invoicePartQuantities.selectedQuantityLevel  = partQtyLevel;
        }

        ele.feeTypeList.forEach(fee => {
          this.invoiceQuantitesFees= new InvoiceQuantitesFees();
          this.invoiceQuantitesFees.selectedFeeTypeId = parseInt(fee.feeTypeId);
          this.invoiceQuantitesFees.amount = (fee.feeTypeCost == '' || fee.feeTypeCost == isNaN || fee.feeTypeCost == undefined || fee.feeTypeCost == null) ? 0 : parseFloat(fee.feeTypeCost).toFixed(this.decimalValueDefault);
          // fee.isDisabled = true
          this.invoicePartQuantities.fees.push(this.invoiceQuantitesFees);
        })
        this.invoicePartSave.partQuantities.push(this.invoicePartQuantities);
      });
   this._qmsService.invoicePartQuantityInfo(this.invoicePartSave)
        .subscribe(
          (response: {
            data: any,
            isError: boolean,
            message: any,
            totalRecords ? : number
          }) => {
            if (!response.isError) {
              this.isSpecailFeeSave=true;
            }
          });
    }

    const specialFeeValidate: SimpleChange = changes.specialFee;

    console.log("specialFeeValidate", specialFeeValidate);
  }



  qmsQuoteIdEncrypt = this._router.snapshot.queryParams['qmsQuoteId'];


  myTempData: any;
  ngOnInit() {
    //New Code start
    console.log('proceedToSave',this.proceedToSave);
    console.log('qmsQuoteID', this.qmsQuoteID);
    this.GetQMSFeeType();
    this.getQMSQuotePartQuantity();
    this.createInvoiceForm();

    this.isPartChecked = false;
    this.partChecked = {
      'qmsQuotePartId': this.partID,
      'isChecked': false,
      'form': '',
      'isFormValid':false
    }

    //end new code
    this.specialFee = null;
    this.invoicePartForm = this._fb.group({
      partQuantities: this._fb.array(
        []),
    });


    //this.loadFeeTypes();
  }
  getInvoiceDataByInvoiceId() {
    this._qmsService.getInvoicePartQuantityInfo(this.invoiceID,this.partID).subscribe(res=>{
      console.log('invoicedata',res);
      if(res['isError'] == false) {
        this.partQuantities = this.invoicePartForm1.get('partQuantities') as FormArray;
        let dataArry = this.invoicePartForm1.get('partQuantities')['controls'];
        while (dataArry.length) {
          dataArry.forEach((element, index) => {
            this.partQuantities.removeAt(index);
          });
        }
        this.tempFeetypeList=[];
        res['data'].partQuantities.forEach((element ,index)=> {
          let quantites=this.addPartQuantityByInvoiceId(element);
          this.feeTypeList = quantites.get('feeTypeList') as FormArray;
          element.fees.forEach((fee)=>{
            this.tempFeetypeList.push(JSON.parse(JSON.stringify(this.iFeetypeList)));
            let tempIndex = this.tempFeetypeList[index].findIndex(ele=> ele.qmsFeeTypeId == fee.selectedFeeTypeId);
            if(tempIndex != -1){
              this.feeTypeList.push(this.addQuantityFeeTypeByQuantityId(fee.selectedFeeTypeId, fee.amount,this.tempFeetypeList[index][tempIndex].feeType));
              this.tempFeetypeList[index][tempIndex].isDisabled = true;
            } else {
              this.feeTypeList.push(this.addQuantityFeeTypeByQuantityId(fee.selectedFeeTypeId, fee.amount,'Price per unit'));

            }

          })
            this.partQuantities.push(quantites);
            let isDisabledSelecetdQuantity = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId == element.selectedQuantityId);
           if(isDisabledSelecetdQuantity != undefined && isDisabledSelecetdQuantity != null) {
            isDisabledSelecetdQuantity.isDisabled = !isDisabledSelecetdQuantity.isDisabled;
           }


        })
        this.calculatePartSubTotal();
        console.log('forminvoiceqnuairtes',this.partQuantities);
        if(this.invoicePartForm1 && !this.invoicePartForm1.invalid ) {
          this.isPartChecked = true;
          this.isCheckedPart();
        }

      } else {
        if(this.invoicePartForm1 && this.invoicePartForm1.invalid ) {
          this.isPartChecked = false;
          this.isCheckedPart();
        }
        this.calculatePartSubTotal();
      }
    })

  }
  createQuantityForm(newItems = null): FormGroup {
    return this._fb.group({
      'selectedQuantityId': 0,
      'selectedQuantityLevel': 0,
      'selectedUnitId': 0,
      'selectedUnitName': '',
      'quantity': [0, [Validators.required,Validators.pattern('^[1-9][0-9]*$')]],
      'items': [
        newItems == null ? [] : newItems
      ],
      'fees': this._fb.array([this.createFeesForm()]),
      'subTotal': 0
    });
  }
  createFeesForm(forQuantity ? : any, feeTypeId ? : number, savedFeeTypes ? : any, amount ? : any): FormGroup {
    if (savedFeeTypes == null) {
      savedFeeTypes = [];
      // savedFeeTypes.push(
      // {
      //     'value':0,
      //     'text':'Select Fee Type'
      // });
    }
    let tempForm = this._fb.group({
      'feeTypes': [
        savedFeeTypes
      ],
      'selectedFeeTypeId': [{
        value: feeTypeId == null ? 0 : feeTypeId,
        disabled: forQuantity == undefined ||
          forQuantity.controls.selectedQuantityId.value == 0 ||
          forQuantity.controls.selectedQuantityId.value == '0'
      }, Validators.required],
      'amount': [{
        value: amount == null ? '' : amount,
        disabled: amount == null || amount == undefined //false //feeTypeId==null || feeTypeId==0 //amount==null
      }]
    });
    if (amount) {
      tempForm.controls['amount'].setValidators([Validators.required]);
      tempForm.updateValueAndValidity();
    }
    return tempForm;
  }

  feeTypeClearDisables(forQuantity) {
    forQuantity.value.fees.forEach(fee => {
      fee.feeTypes.forEach(oFeeType => {
        oFeeType.isDisabled = false;
      })
    });
    //if(forQuantity.value.fees[0]!=undefined){
    //this.updateFeeTypeSelectionAccess(null, forQuantity.value.fees[forQuantity.value.fees.length-1],  forQuantity);
    //}
  }
  updateFeeTypeSelectionAccess($event, selectedFeeType, forQuantity) {
    let _selectedFeeType = selectedFeeType.value;
    if (_selectedFeeType == null || _selectedFeeType == undefined) {
      _selectedFeeType = selectedFeeType;
    }
    forQuantity.value.fees.forEach(fee => {
      _selectedFeeType.feeTypes.forEach(feeType => {
        if (fee != _selectedFeeType) {
          // fee.feeTypes.forEach(oFeeType=>
          // {
          if (fee.selectedFeeTypeId != 0 && feeType.value == fee.selectedFeeTypeId) {
            feeType.isDisabled = true;
          }
          //})
        }
      })
    });

  }
  quantityClearDisables(forQuantity) {
    if (this.partDetails != null) {
      this.partDetails.value.forEach(qty => {
        qty.items.forEach(item => {
          item.isRemovable = false;
        });
      });
    }
  }
  updateQtySelectionAccess($event, forQuantity) {
    if (forQuantity != null && forQuantity != undefined) {
      forQuantity.value.items.forEach(selectedQtyItem => {
        this.partDetails.value.forEach(qty => {
          if (forQuantity != qty) {
            if (qty.selectedQuantityId != -1 && qty.selectedQuantityId == selectedQtyItem.value) {
              selectedQtyItem.isRemovable = true;
            }

          }
        });
      });
      forQuantity.value.items.find(x => x.value == forQuantity.value.selectedQuantityId).isRemovable = false;
    }
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.loadingCompleted = true;
    }, 5000);

  }
  qtysCollection: any[];
  qtyUnitCollction: any[];
  dbDataLoading: boolean = false;

  feeTypeCollection: NgxSelectModel[];
  showHideFeeSection = true;
  onAnimationEvent($event) {
    return true;
  }

  getUnitPrice(forQuantity, forFeeType, selectedValue) {
    this.rest.get('QMSQuoteInvoice/GetQmsQuoteInvoiceUnitPrice?qmsQuotePartQuantityId=' +
        forQuantity.controls.selectedQuantityId.value +
        '&qmsFeeTypeId=' + forFeeType.controls.selectedFeeTypeId.value)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            forFeeType.patchValue({
              'amount': response.data
            });
            if (selectedValue != 0 && selectedValue != null && selectedValue != undefined) {
              forFeeType.get('amount').enable();
              forFeeType.controls['amount'].setValidators([Validators.required]);
            } else {
              forFeeType.get('amount').disable();
              forFeeType.patchValue({
                'amount': ''
              });
              forFeeType.controls['amount'].clearValidators();
            }
            forFeeType.updateValueAndValidity();
          }
          this.calculatePartSubTotal();
        });
  }


  addQuantity() {
    let newQtysCollection = [];
    this.qtysCollection.forEach(ele => {
      newQtysCollection.push({
        value: ele.value,
        text: ele.text,
        isRemovable: false,
        isEditable: false,
        level: ele.qtyLevel == null ? null : ele.qtyLevel,
        quantity: ele.partQty
      });
    });

    for (let i = 0; i <= this.partDetails.controls.length - 1; i++) {
      let selectedQtyId = this.partDetails.controls[i].value.selectedQuantityId;

      if (selectedQtyId != -1 && newQtysCollection.find(x => x.value == selectedQtyId)) {
        newQtysCollection.find(x => x.value == selectedQtyId).isRemovable = true
      }
    }
    this.partDetails.push(this.createQuantityForm(newQtysCollection))
  }

  addFeeTypeWithFeeTypeId(forQuantity, feeTypeId) {
    this.getFeesDetails(forQuantity).push(this.createFeesForm(forQuantity, feeTypeId));
  }
  removeFeeType(forQuantity, ctrlIndex) {
    this.getFeesDetails(forQuantity).removeAt(ctrlIndex);
    //this.calculateSubTotal(forQuantity);
    this.calculatePartSubTotal();
  }
  removeQuantity(ctrIndex, forQuantity) {
    if (forQuantity != null) {
      forQuantity.controls.selectedQuantityId = 0;
      //this.updateQtyAccessibiliy(forQuantity);
    }
    this.partDetails.removeAt(ctrIndex);
    this.calculatePartSubTotal();
  }
  discardOtherQuantity(forQuantity) {
    forQuantity.patchValue({
      'selectedQuantityId': 0,
      'quantity': 0,
      'selectedUnitId': 0
    });
  }

  setUnitLabel(event, quantityInfo) {
    // console.log(event.target.value, ' - ' ,quantityInfo,' - ',this.qtyUnitCollction);
    if (event.target.value == 0) {
      quantityInfo.patchValue({
        selectedUnitName: ''
      });
      quantityInfo.controls['quantity'].disable();
    } else {
      quantityInfo.controls['quantity'].enable();
      let index = this.qtyUnitCollction.findIndex(x => x.value == event.target.value);
      if (index != -1) {
        quantityInfo.patchValue({
          selectedUnitName: this.qtyUnitCollction[index].text
        });
      }
    }
  }
  changeSpecialFee(event){
    if(event != null && event.isValid !=undefined){
      if(event.isValid == true){
        console.log("invoiceform1",event.isValid);
        this.invoicePartForm1.controls['specialFeeValid'].setErrors(null);
        this.isFormValid();
      } else{
        console.log("invoiceform",event.isValid);
        this.isPartChecked = false;
        this.isFormValid();
        this.isCheckedPart();
        this.invoicePartForm1.controls['specialFeeValid'].setErrors({'incorrect': true});
      }
    }

  }
}
