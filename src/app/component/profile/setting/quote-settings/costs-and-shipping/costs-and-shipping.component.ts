import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  SimpleChanges,
  SimpleChange,
  OnChanges,
  Input
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ApiService
} from '../../../../../__Services/api-service/api.service';
import {
  NgxSelectModel
} from '../../../../ngx-gen-select/ngxSelectModel';
import {
  ConfirmationService
} from 'primeng/api';
import {
  DecimalPoint
} from '../../../../../core/models/settingsModel';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  appConstants
} from '../../../../../core/config/constant';
enum ActionFor {
  PaymentTerms = 1,
    CustomCosts = 2,
    ShippingMethod = 3,
    LeadTime = 4
}

@Component({
  selector: 'app-costs-and-shipping',
  templateUrl: './costs-and-shipping.component.html',
  styleUrls: ['./costs-and-shipping.component.scss'],
  providers: [ApiService, ConfirmationService]
})
export class CostsAndShippingComponent implements OnInit, AfterViewInit{
  isButtonClicked: boolean = false;
  itemName: string;

  selectedDecimalValue: any;
  invoiceStartNumber: number;
  private _selectedAction: ActionFor;
  @Input()
  set selectedAction(action: ActionFor) {
    this._selectedAction = action;
  }
  get selectedAction() {
    return this._selectedAction;
  }
  // ngOnChanges(changes: SimpleChanges) {
  //     const changeInAction: SimpleChange = changes.selectedAction;
  //     //alert(changeInAction);
  //     alert('Previous value : ' + changeInAction.previousValue);
  //     alert('Current value : ' + changeInAction.currentValue);
  //     // if(changeInAction.previousValue!=undefined
  //     //     && (changeInAction.previousValue!=changeInAction.currentValue))
  //     // {

  //     // }
  // }
  ngAfterViewInit(): void {
    this.selectedDecimalValue = 104;
    this.getCustomCosts();
    this.loadPaymentTerms();
    this.loadShippingMethods();
    this.loadLeadTime();
    this.getSettingQMSDecimalPlaces();

  }
  decimalPoint: DecimalPoint[];
  constructor(public rest: ApiService, private _toastr: ToastrService, private _qmsService: QmsService,
    private confirmationService: ConfirmationService) {
    this.selectedAction = ActionFor.PaymentTerms;
  }
  ngOnInit() {
    this.customCosts = [];
    this.GetInvoiceStartingSeqNo();
  }
  modalDescription: string;
  modalHeader: string;
  modalSaveButtonText: string;
  modelInputPlaceholderText: string;
  setAction(action: ActionFor) {
    if (this.itemName != '') {
      this.itemName = '';
      this.isDuplicateValue = null;
    }

    this.selectedAction = action;
    switch (this.selectedAction) {
      case ActionFor.PaymentTerms:
        this.modalHeader = " Payment Term ";
        this.modalDescription = " payment term ";
        this.modalSaveButtonText = "Term ";
        this.modelInputPlaceholderText = "Enter payment term"
        break;
      case ActionFor.CustomCosts:
        this.modalHeader = "  Custom Costs ";
        this.modalDescription = " custom costs ";
        this.modalSaveButtonText = "Cost ";
        this.modelInputPlaceholderText = "Enter custom cost"
        break;
      case ActionFor.ShippingMethod:
        this.modalHeader = " Shipping Methods ";
        this.modalDescription = " shipping method ";
        this.modalSaveButtonText = "Method ";
        this.modelInputPlaceholderText = "Enter shipping method"
        break;
      case ActionFor.LeadTime:
        this.modalHeader = " Lead Time ";
        this.modalDescription = " lead time ";
        this.modalSaveButtonText = "Lead";
        this.modelInputPlaceholderText = "Enter lead time"
        break;
    }
  }

  @ViewChild('newItemEntry', {static: true}) vc: ElementRef;
  saveCustomCostPaymentTermAndShippingMethod(addMore: boolean) {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      switch (this.selectedAction) {
        case ActionFor.CustomCosts:
          this.saveCustomCost(addMore);
          break;
        case ActionFor.PaymentTerms:
          this.savePaymentTerm(addMore);
          break;
        case ActionFor.ShippingMethod:
          this.saveShippingMethod(addMore);
          break;
        case ActionFor.LeadTime:
          this.saveLeadTime(addMore);
          break;
      }
      if (addMore) {
        setTimeout(() => this.vc.nativeElement.focus(), 0);
      }
    }
  }

  //#region [ Payment terms ]
  paymentTermsItemCollection: NgxSelectModel[];
  selectedPaymentTermId ? : number;
  _paymentTermsLoadingCompleted: boolean = null;
  loadPaymentTerms() {
    this.paymentTermsItemCollection = [];
    this.rest.get('PaymentTerms?id=' + localStorage.getItem('loggedCompanyId') +
        '&supplierId=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.selectedPaymentTermId = response.data.selectedValue;

            response.data.paymentTerms.forEach(item => {
              this.paymentTermsItemCollection.push({
                'value': item.qmsPaymentTermId,
                'text': item.qmsPaymentTerms,
                'isRemovable': !item.isDefault,
                'isEditable': false,
                'object': null
              })
            });

            this._paymentTermsLoadingCompleted = true;
          }
        });
  }
  requestToPaymentTermRemove($event: NgxSelectModel) {
    this.confirmationService.confirm({
      message: "Are you sure?\nDo you want to remove this payment term?",
      header: 'Remove',
      icon: null,
      accept: () => {
        this.rest.delete('PaymentTerms?id=' + localStorage.getItem('loggedCompanyId') +
            "&paymentTermId=" + $event.value)
          .subscribe(
            (response: {
              data: any,
              isError: boolean,
              message: any,
              totalRecords ? : number
            }) => {
              if (!response.isError) {
                if (response.data != null) {
                  //this.loadPaymentTerms();
                  let index = this.paymentTermsItemCollection.indexOf($event);
                  this.paymentTermsItemCollection.splice(index, 1);
                  this._toastr.success('Payment term has been removed successfully.', 'Success!');
                }
              }
            });
      },
      reject: () => {}
    });



  }
  savePaymentTerm(addMore: boolean) {
    // let termData =
    // {
    //     'id': localStorage.getItem('loggedCompanyId'),
    //     'name': this.itemName
    // };
    this.rest.post('PaymentTerms?id=' + localStorage.getItem('loggedCompanyId') +
        "&paymentTerm=" + encodeURIComponent(this.itemName.trim()))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              this._toastr.success('Payment term has been saved successfully.', 'Success!');
              this.loadPaymentTerms();
              this.itemName = '';
              if (!addMore) {
                this.closeMe();
              }
            }
          }
          this.isButtonClicked = false;
        }, error => {
          this.isButtonClicked = false;
        });
  }
  clearPaymentTermSelection($event: NgxSelectModel) {
    this.rest.delete('PaymentTermSelection?id=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Payment term default selection has been removed successfully.', 'Success!');
              }
            }
          }
        });
  }
  setPaymentTermSelection($event: NgxSelectModel) {
    this.rest.post('PaymentTermSelection?id=' + localStorage.getItem('LoggedId') +
        "&paymentTermSelectedValue=" + $event.value)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Payment term default selection has been saved successfully.', 'Success!');
              }
            }
          }
        });
  }
  //#endregion

  //#region [ Custom Costs ]
  customCosts: any[];
  @ViewChild('customCostContainer', {static: true}) customCostContainer: ElementRef;
  selectedCustomCostId ? : number;
  _customCostsLoadingCompleted: boolean = null;
  getCustomCosts() {
    this.customCosts = [];
    this.rest.get('CustomCost?id=' + localStorage.getItem('loggedCompanyId') +
        '&supplierId=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.selectedCustomCostId = response.data.selectedValue;

            response.data.customCosts.forEach(item => {
              this.customCosts.push({
                'value': item.id,
                'text': item.costname,
                'isRemovable': !item.isDefault,
                'isEditable': false
              })
            });
            this._customCostsLoadingCompleted = true;
          }
        });
  }
  saveCustomCost(addMore: boolean) {
    this.rest.post('CustomCost?id=' + localStorage.getItem('loggedCompanyId') +
        '&customeCostname=' + encodeURIComponent(this.itemName.trim()))
      .subscribe((response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              this.getCustomCosts();
              this.itemName = '';
              if (!addMore) {
                this.closeMe();
              }
              this._toastr.success('Custom cost has been saved successfully.', 'Success!');
            }
          }
          this.isButtonClicked = false;
        },
        error => {
          this.isButtonClicked = false;
        });
  }
  removeCustomCost(customCost: NgxSelectModel) {
    this.confirmationService.confirm({
      message: "Are you sure?\nDo you want to remove this cost?",
      header: 'Remove',
      icon: null,
      accept: () => {
        this.rest.delete('CustomCost?id=' + localStorage.getItem('loggedCompanyId') +
            '&customCostId=' + customCost.value)
          .subscribe((response: {
            data: any,
            isError: boolean,
            message: any,
            totalRecords ? : number
          }) => {
            if (!response.isError) {
              if (response.data != null) {
                this.getCustomCosts();
              }
              this._toastr.success('Custom cost has been removed successfully.', 'Success!');
            }
          });
      },
      reject: () => {}
    });
  }
  clearCustomCostSelection($event: NgxSelectModel) {
    this.rest.delete('CustomCostSelelction?id=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Custom cost default selection has been removed successfully.', 'Success!');
              }
            }
          }
        });
  }
  setCustomCostSelection($event: NgxSelectModel) {
    this.rest.post('CustomCostSelelction?id=' + localStorage.getItem('LoggedId') +
        "&customCostSelectedValue=" + $event.value)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Custom cost default selection has been saved successfully.', 'Success!');
              }
            }
          }
        });
  }
  //#endregion

  //#region [ Shipping methods ]
  shippingMethodItemCollection: NgxSelectModel[];
  selectedShippingMethodId ? : number;
  _shippingMethodLoadingCompleted: boolean = null;
  loadShippingMethods() {
    this.shippingMethodItemCollection = [];
    this.rest.get('ShippingMethod?id=' + localStorage.getItem('loggedCompanyId') +
        '&supplierId=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.selectedShippingMethodId = response.data.selectedValue;

            response.data.shippingMethods.forEach(item => {
              this.shippingMethodItemCollection.push({
                'value': item.qmsShippingMethodId,
                'text': item.qmsPaymentTerms,
                'isRemovable': !item.isDefault,
                'isEditable': false,
                'object': null
              })
            });
            this._shippingMethodLoadingCompleted = true;
          }
        });
  }
  saveShippingMethod(addMore: boolean) {
    // let termData =
    // {
    //     'id': localStorage.getItem('loggedCompanyId'),
    //     'name': this.itemName
    // };
    this.rest.post('ShippingMethod?id=' + localStorage.getItem('loggedCompanyId') +
        "&shippingMethod=" + encodeURIComponent(this.itemName.trim()))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              this._toastr.success('Shipping method has been saved successfully.', 'Success!');
              this.loadShippingMethods();
              this.itemName = '';
              if (!addMore) {
                this.closeMe();
              }
            }
          }
          this.isButtonClicked = false;
        }, error => {
          this.isButtonClicked = false;
        });
  }
  requestToShippingMethodRemove($event: NgxSelectModel) {
    this.confirmationService.confirm({
      message: "Are you sure?\nDo you want to remove this shipping method?",
      header: 'Remove',
      icon: null,
      accept: () => {
        this.rest.delete('ShippingMethod?id=' + localStorage.getItem('loggedCompanyId') +
            "&shippingMethodId=" + $event.value)
          .subscribe(
            (response: {
              data: any,
              isError: boolean,
              message: any,
              totalRecords ? : number
            }) => {
              if (!response.isError) {
                if (response.data != null) {
                  //this.loadPaymentTerms();
                  let index = this.shippingMethodItemCollection.indexOf($event);
                  this.shippingMethodItemCollection.splice(index, 1);
                  this._toastr.success('Shipping method has been removed successfully.', 'Success!');
                }
              }
            });
      },
      reject: () => {}
    });
  }
  clearShippingMethodSelection($event: NgxSelectModel) {
    this.rest.delete('ShippingMethodSelection?id=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Shipping method default selection has been removed successfully.', 'Success!');
              }
            }
          }
        });
  }
  setShippingMethodSelection($event: NgxSelectModel) {
    this.rest.post('ShippingMethodSelection?id=' + localStorage.getItem('LoggedId') +
        "&shippingMethodSelectedValue=" + $event.value)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Shipping method default selection has been saved successfully.', 'Success!');
              }
            }
          }
        });
  }
  //#endregion

  //#region [ Lead Time ]
  leadTimeItemCollection: NgxSelectModel[];
  selectedLeadTimeId ? : number;
  _leadTimeLoadingCompleted: boolean = null;
  loadLeadTime() {
    this.leadTimeItemCollection = [];
    this.rest.get('SaveQMSSettingLeadTime?id=' + localStorage.getItem('loggedCompanyId') +
        '&supplierId=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.selectedLeadTimeId = response.data.selectedValue;

            response.data.leadTimeList.forEach(item => {
              this.leadTimeItemCollection.push({
                'value': item.qmsLeadTimeId,
                'text': item.qmsLeadTime,
                'isRemovable': item.isRemovable,
                'isEditable': false,
                'object': null
              })
            });
            this._leadTimeLoadingCompleted = true;
          }
        });
  }
  saveLeadTime(addMore: boolean) {
    // let termData =
    // {
    //     'id': localStorage.getItem('loggedCompanyId'),
    //     'name': this.itemName
    // };
    this.rest.post('SaveQMSSettingLeadTime?id=' + localStorage.getItem('loggedCompanyId') +
        "&paymentTerm=" + encodeURIComponent(this.itemName.trim()))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              this._toastr.success('Lead time has been saved successfully.', 'Success!');
              this.loadLeadTime();
              this.itemName = '';
              if (!addMore) {
                this.closeMe();
              }
            }
          }
          this.isButtonClicked = false;
        }, error => {
          this.isButtonClicked = false;
        });
  }
  requestToLeadTimeRemove($event: NgxSelectModel) {
    this.confirmationService.confirm({
      message: "Are you sure?\nDo you want to remove this lead time?",
      header: 'Remove',
      icon: null,
      accept: () => {
        this.rest.delete('SaveQMSSettingLeadTime?id=' + localStorage.getItem('loggedCompanyId') +
            "&paymentTermId=" + $event.value)
          .subscribe(
            (response: {
              data: any,
              isError: boolean,
              message: any,
              totalRecords ? : number
            }) => {
              if (!response.isError) {
                if (response.data != null) {
                  //this.loadPaymentTerms();
                  let index = this.leadTimeItemCollection.indexOf($event);
                  this.leadTimeItemCollection.splice(index, 1);
                  this._toastr.success('Lead time has been removed successfully.', 'Success!');
                }
              }
            });
      },
      reject: () => {}
    });
  }
  clearLeadTimeSelection($event: NgxSelectModel) {
    this.rest.delete('LeadTimeSelection?id=' + localStorage.getItem('LoggedId'))
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Lead time default selection has been removed successfully.', 'Success!');
              }
            }
          }
        });
  }
  setLeadTimeSelection($event: NgxSelectModel) {
    this.rest.post('LeadTimeSelection?id=' + localStorage.getItem('LoggedId') +
        "&leadTimeSelectedValue=" + $event.value)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            if (response.data != null) {
              if (response.data.transactionStatus == 'Success') {
                this._toastr.success('Lead time default selection has been saved successfully.', 'Success!');
              }
            }
          }
        });
  }
  //#endregion

  isDuplicateValue = false;
  checkDuplicateEntry() {
    switch (this.selectedAction) {
      case ActionFor.PaymentTerms:
        this.isDuplicateValue = this.paymentTermsItemCollection.find(x => (x.text.toLowerCase() === this.itemName.trim().toLowerCase())) != undefined ?
          true : false;
        break;
      case ActionFor.CustomCosts:
        this.isDuplicateValue = this.customCosts.find(x => (x.text.toLowerCase() === this.itemName.trim().toLowerCase())) != undefined ?
          true : false;
        break;
      case ActionFor.ShippingMethod:
        this.isDuplicateValue = this.shippingMethodItemCollection.find(x => (x.text.toLowerCase() === this.itemName.trim().toLowerCase())) != undefined ?
          true : false;
        break;
      case ActionFor.LeadTime:
        this.isDuplicateValue = this.leadTimeItemCollection.find(x => (x.text.toLowerCase() === this.itemName.trim().toLowerCase())) != undefined ?
          true : false;
        break;
    }
  }

  closeMe() {
    this.customCostContainer.nativeElement.click();
  }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  _getDecialLoadingCompleted: boolean = null;
  getSettingQMSDecimalPlaces() {
    this._qmsService.getSettingQMSDecimalPlaces(this.loggedCompanyId, this.loggedId).subscribe(res => {
      if (!res.isError && res.data != null && res.data.length != 0) {
        this.decimalPoint = res.data;
        if (res.defaultValue != null) {
          this.selectedDecimalValue = res.defaultValue;
        }

        this._getDecialLoadingCompleted = true;
      } else {
        this._getDecialLoadingCompleted = null;
      }
    })
  }
  setDefaultDecimalValue() {
    this._qmsService.setSettingQMSDecimalPlaces(this.loggedId, this.selectedDecimalValue).subscribe(res => {
      if (!res.isError) {
        appConstants.settingDefault.decimalValueDefault = res.data;
        this._toastr.success('Add Decimal Places to Display  default selection has been saved successfully.', 'Success!');
      }
    })
  }

  GetInvoiceStartingSeqNo() {
    this._qmsService.GetInvoiceStartingSeqNo(this.loggedCompanyId, false).subscribe(res => {
      if (!res.isError) {
        if (res.data != null && res.data != undefined && res.data != '') {
          this.invoiceStartNumber = res.data;
        }
        //   else{
        //     this.invoiceStartNumber= 1001;
        //   }

      } else {
        // this.invoiceStartNumber= 1001;
      }
    })
  }
  onSaveInvoiceNumber() {
    this._qmsService.setInvoiceStartingSeqNo(this.loggedCompanyId, this.invoiceStartNumber).subscribe(res => {
      if (!res.isError) {
        this._toastr.success('Qms invoice start number has been saved successfully.', 'Success!');
      }

    })
  }
  close() {}
}
