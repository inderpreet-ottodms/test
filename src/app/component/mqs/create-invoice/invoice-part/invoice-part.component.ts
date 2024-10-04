import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import {
  IFeetypeList,
  QMSQuotePartQuantity,
  QMSQuoteInvoiceDetailsListViewModel,
  QMSQuoteInvoicePartDetails
} from '../../../../core/models/qmsModel';
import {
  QmsService
} from '../../../../core/services/qms/qms.service';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ToastrService
} from 'ngx-toastr';

@Component({
  selector: 'app-invoice-part',
  templateUrl: './invoice-part.component.html',
  styleUrls: ['./invoice-part.component.scss']
})
export class InvoicePartComponent implements OnInit {

  iFeetypeList: IFeetypeList[];
  invoiceQunatityForm: FormGroup;
  items: FormArray;
  unitType: string;
  subTotal: number = 0;
  partChecked: any;
  isPartChecked: boolean;
  qmsQuotePartQuantity: QMSQuotePartQuantity[] = [];
  qmsQuoteInvoiceDetailsListViewModel: QMSQuoteInvoiceDetailsListViewModel;
  qmsQuoteInvoicePartDetails: QMSQuoteInvoicePartDetails;
  @Input() invoiceId: any;
  @Input() partInfo: any;
  @Input() onSavePartInvoice: any;
  @Input() checkAllPart: any;
  @Input()qmsQuoteId:number;
  @Output() isOtherCheckChangeEventHandler = new EventEmitter < any > ();
  @Output() isFormValidChangeEventHandler = new EventEmitter < any > ();
  customQtyUnit: string;
  constructor(private _qmsService: QmsService, private _toastr: ToastrService,
    private _fb: FormBuilder) {}

  ngOnInit() {
    this.customQtyUnit = '';
    this.qmsQuoteInvoicePartDetails = new QMSQuoteInvoicePartDetails();
    this.qmsQuoteInvoiceDetailsListViewModel = new QMSQuoteInvoiceDetailsListViewModel();
    this.isPartChecked = false;
    this.partChecked = {
      'qmsQuotePartId': this.partInfo.qmsQuotePartId,
      'isChecked': false,
      'form': '',
      'isFormValid':false
    }
    this.unitType = '';
    this.GetQMSFeeType();
    this.getQMSQuotePartQuantity();
    if (this.partInfo.form) {
      this.invoiceQunatityForm = this._fb.group({
        items: this._fb.array([this.createItem()])
      });
      this.invoiceQunatityForm = this.partInfo.form;
      this.isPartChecked = true;
    } else {
      this.invoiceQunatityForm = this._fb.group({
        items: this._fb.array([this.createItem()])
      });
    }

  }
  createItem(): FormGroup {
    return this._fb.group({
      quantity: ['', Validators.required],
      freeType: [{
        value: '',
        disabled: true
      }, Validators.required],
      unitPrice: [{
        value: '',
        disabled: true
      }, Validators.required],
      customQty: [null],
      otherQtyCheck: [{
        value: false,
        disabled: true
      }],
      customQtyUnit: [null]
    });
  }

  getQMSQuotePartQuantity() {
    this._qmsService.QMSQuotePartQuantity(this.partInfo.qmsQuotePartId).subscribe(res => {
      if (!res['isError']) {
        this.qmsQuotePartQuantity = res['data'];
      }
    })
  }
  enabledFreetype(controls, i) {
    let isPresent = false;
    this.invoiceQunatityForm.get('items')['controls'].forEach((element, index) => {
      if (index !== i) {
        if (element.get('quantity').value === controls.get('quantity').value) {
          isPresent = true;
          controls.patchValue({
            'quantity': ''
          });
          return;
        }
      }

    });
    if (isPresent) {
      this._toastr.warning('This quantity is already selected', 'Warning!');
    } else {

      if (controls.get('quantity').value != "") {
        if (controls.get('quantity').value != "" && controls.get('freeType').value != "") {
          this.enabledUnitPrice(controls);
        }
        controls.get('freeType').enable();
        controls.get('otherQtyCheck').enable();

      } else {
        controls.get('freeType').disable();
        controls.get('otherQtyCheck').disable();
        controls.get('unitPrice').disable();
        controls.patchValue({
          'unitPrice': ''
        });
        controls.patchValue({
          'freeType': ''
        });
        controls.patchValue({
          'customQty': ''
        });
        controls.patchValue({
          'otherQtyCheck': false
        });
      }
      this.calculateSubTotal(controls);

    }
  }
  enabledUnitPrice(controls) {
    if (controls.get('quantity').value != "" && controls.get('freeType').value != "") {
      let qmsQuotePartQuantityId = parseInt(controls.get('quantity').value);
      let qmsFeeTypeId = parseInt(controls.get('freeType').value);
      // controls.get('unitPrice').enable();
      if (controls.get('otherQtyCheck').value) {
        controls.patchValue({
          'unitPrice': ''
        });
        controls.get('unitPrice').enable();
      } else {
        this._qmsService.GetQmsQuoteInvoiceUnitPrice(qmsQuotePartQuantityId, qmsFeeTypeId).subscribe(res => {
          if (!res['isError']) {
            let price = res['data'];
            controls.patchValue({
              'unitPrice': price
            });
            this.calculateSubTotal();
            controls.get('unitPrice').enable();
          } else {
            this.calculateSubTotal();
            controls.get('unitPrice').enable();
          }

        }, error => {
          this.calculateSubTotal();
          controls.get('unitPrice').enable();
        })
      }

    } else {
      controls.get('unitPrice').disable();
      controls.patchValue({
        'unitPrice': ''
      });
    }
    this.calculateSubTotal(controls);

  }
  addItem() {
    this.items = this.invoiceQunatityForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  removeItem(index) {
    this.items = this.invoiceQunatityForm.get('items') as FormArray;
    this.items.removeAt(index);
    this.calculateSubTotal();
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  GetQMSFeeType() {
    this._qmsService.GetQMSFeeType(this.loggedCompanyId, this.qmsQuoteId).subscribe(res => {
      console.log('units', res);
      this.iFeetypeList = res['data'];
    });
  }
  setValidator(controls) {
    if (controls.get('otherQtyCheck').value === true) {
      controls.get('customQty').setValidators([Validators.required,Validators.pattern("^[0-9]*$"), Validators.min(1)]);
      controls.get('customQty').updateValueAndValidity();

      if (this.isPartChecked) {
        this.isPartChecked = false;
        this.isCheckedPart();
      }
      let partQtyUnit = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId === parseInt(controls.get('quantity').value)).partQtyUnit;
      controls.patchValue({
        'customQtyUnit': partQtyUnit
      });
    } else {
      controls.get('customQty').setValidators([]);
      controls.get('customQty').updateValueAndValidity();
      controls.patchValue({
        'customQty': ''
      });
      controls.patchValue({
        'customQtyUnit': ''
      });

    }
    controls.patchValue({
      'unitPrice': ''
    });
    this.calculateSubTotal(controls);
  }
  isCheckedPart() {
    if (this.partChecked) {
      this.partChecked.isChecked = this.isPartChecked;
      this.partChecked.form = this.invoiceQunatityForm;
      this.isOtherCheckChangeEventHandler.emit(this.partChecked);
    }

  }

  @Output() amountChange = new EventEmitter < number > ();
  calculateSubTotal(controls ? ) {
    this.subTotal = 0;
    let quantity = 0;

    if (controls && (controls.get('unitPrice').value == null || controls.get('unitPrice').value == '' || controls.get('customQty').value == '')) {
      this.isPartChecked = false;
      this.isCheckedPart();
    }
    this.invoiceQunatityForm.get('items')['controls'].forEach(element => {
      let unitPrice = (element.get('unitPrice').value != null && element.get('unitPrice').value != '') ? element.get('unitPrice').value : 0;
      let custCost = (element.get('customQty').value != null && element.get('customQty').value != '') ? element.get('customQty').value : 0;
      let data = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId === parseInt(element.get('quantity').value));
      if (data) {
        quantity = (element.get('quantity').value != null && element.get('quantity').value != '') ? data.partQty : 0;
      }

      if (element.get('freeType').value == 1) {
        if (element.get('otherQtyCheck').value == true) {
          this.subTotal += (parseFloat(custCost) * parseFloat(unitPrice));
        } else {
          this.subTotal += quantity * parseFloat(unitPrice);
        }
      } else {
        this.subTotal += parseFloat(unitPrice);
      }
    });
    this.partInfo.totalAmount = this.subTotal;
    this.amountChange.emit(this.partInfo.totalAmount);
    this.isFormValid();
  }

  ngOnChanges() {
    this.onSaveInvoice();
    this.checkAllParts();
  }
  onSaveInvoice() {
    if (this.isPartChecked && this.onSavePartInvoice) {
      this.qmsQuoteInvoiceDetailsListViewModel.qmsQuoteInvoiceId = this.invoiceId;
      this.qmsQuoteInvoiceDetailsListViewModel.qmsQuotePartId = this.partInfo.qmsQuotePartId;
      this.invoiceQunatityForm.get('items')['controls'].forEach(element => {
        this.qmsQuoteInvoicePartDetails = new QMSQuoteInvoicePartDetails();

        if (element.get('otherQtyCheck').value == true) {
          this.qmsQuoteInvoicePartDetails.partQty = element.get('customQty').value;
        } else {
          let partQty = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId === parseInt(element.get('quantity').value)).partQty;
          this.qmsQuoteInvoicePartDetails.partQty = partQty;
        }
        let partQtyUnit = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId === parseInt(element.get('quantity').value)).partQtyUnit;
        this.qmsQuoteInvoicePartDetails.partQtyUnit = partQtyUnit;
        let partQtyUnitId = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId === parseInt(element.get('quantity').value)).partQtyUnitId;
        this.qmsQuoteInvoicePartDetails.partQtyUnitId = partQtyUnitId;

        let partQtyLevel = this.qmsQuotePartQuantity.find(x => x.qmsQuotePartQtyId === parseInt(element.get('quantity').value)).qtyLevel;
        this.qmsQuoteInvoicePartDetails.qtyLevel = partQtyLevel;

        this.qmsQuoteInvoicePartDetails.isChkOtherQty = element.get('otherQtyCheck').value;
        this.qmsQuoteInvoicePartDetails.feeTypeId = element.get('freeType').value;
        this.qmsQuoteInvoicePartDetails.unitPrice = element.get('unitPrice').value;
        this.qmsQuoteInvoiceDetailsListViewModel.qmsQuoteInvoicePartDetailsList.push(this.qmsQuoteInvoicePartDetails);

      });
      this._qmsService.addQMSQuoteInvoicePartDetails(this.qmsQuoteInvoiceDetailsListViewModel).subscribe(res => {

      })
    }
  }
  checkAllParts() {
    if (this.invoiceQunatityForm && !this.invoiceQunatityForm.invalid && this.checkAllPart) {
      this.isPartChecked = true;
    } else {
      this.isPartChecked = false;
    }
    this.isCheckedPart();
  }

  isFormValid() {
    if (this.invoiceQunatityForm && !this.invoiceQunatityForm.invalid) {
      this.partChecked.isFormValid=true;
     this.isFormValidChangeEventHandler.emit(this.partChecked);
    } else {
      this.partChecked.isFormValid=false;
      this.isFormValidChangeEventHandler.emit(this.partChecked);
    }
  }
}
