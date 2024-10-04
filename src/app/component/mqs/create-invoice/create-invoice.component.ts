import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';

import {
  animate,
  group,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import {
  CurrencyList
} from '../../../core/models/globalMaster';
import {
  IsystemParametersViewModel,
  QMSMailModel,
  QMSQuoteInvoiceDetailsViewModel,
  QmsDetail,
  QmsQuotePartInvoice
} from '../../../core/models/qmsModel';
import {
  IMQSFilterViewModel,
  IMQSViewModel
} from '../../../core/models/supplierModel';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  QmsService
} from '../../../core/services/qms/qms.service';
import {
  CustomValidatorService
} from '../../../core/services/validator/custom-validator.service';

import {
  ApiService
} from '../../../__Services/api-service/api.service';

import {
  InvoicePreviewViewModel
} from '../invoice-pdf/InvoicePreviewViewModel';


import {
  appConstants
} from '../../../core/config/constant';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers: [ConfirmationService, ApiService, InvoicePreviewViewModel],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '0px',
        opacity: 0
      })),
      state('out', style({
        height: '*',
        opacity: 1
      })),
      transition(':leave', [
        style({
          height: '*',
          opacity: 1
        }),
        group([
          animate(300, style({
            height: 0
          })),
          animate('0.80s ease-in-out', style({
            'opacity': '0'
          }))
        ])
      ]),
      transition(':enter', [
        style({
          height: '0',
          opacity: 0
        }),

        group([
          animate(300, style({
            height: '*'
          })),
          animate('0.80s ease-in-out', style({
            'opacity': '1'
          }))
        ])

      ])
    ])
  ]
})
export class CreateInvoiceComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.checkAllPart = true;
    this.checkALL_change()
  }
  companySettings = {};
  ContactModelList: IMQSViewModel[];
  iMQSFilterViewModel: IMQSFilterViewModel;
  iPaymentTermsViewModel: IsystemParametersViewModel[];
  currencyList: CurrencyList[] = [];;
  invoiceDetailForm: FormGroup;
  qmsQuotePartInvoice: QmsQuotePartInvoice[] = [];
  onSavePart: boolean;
  quoteId: any = 0;
  qmsQuoteIdEncrypt: any = 0;
  checkAllPart: boolean = false;
  invoiceId ? : number = null
  notes: string;
  isInvoicePdfPreview: Boolean;
  qmsDetail: QmsDetail;
  selectedContact: any = [];
  qmsQuoteInvoiceDetailsViewModel: QMSQuoteInvoiceDetailsViewModel;
  state: RouterStateSnapshot;
  decimalValueDefault: number;
  qmsMailModel: QMSMailModel;
  isInvoiceSaved: boolean = false;
  specialFeeData: any;
  invoiceStartNumber: number;
  onSaveDisabledBtn: boolean;
  onSaveEmailDisabledBtn: boolean = false;
  isButtonClicked: boolean = false;
  constructor(private _qmsService: QmsService, private confirmationService: ConfirmationService,
    private _masterService: MasterService, private _toastr: ToastrService, private router: Router,
    private _fb: FormBuilder, private _customValidatorsService: CustomValidatorService, private _router: ActivatedRoute,
    private rest: ApiService,
    public invoicePreviewData: InvoicePreviewViewModel) {

  }

  totalAmount: any = 0;
  calculateTotalAmount($event: number) {
  }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }


  ngOnInit() {
    this.onSaveDisabledBtn = false;
    this.specialFeeData = [];
    this._qmsService.set(false, 'isMessageDrawer');
    this._qmsService.set(false, 'showSidePanel');
    this.qmsMailModel = {
      qmsQuoteInvoicePDFHtml: '',
      qmsQuoteContactId: 0,
      qmsQuoteInvoiceId: 0,
      qmsQuoteInvoiceSubject: '',
      qmsQuoteInvoiceMessageBody: '',
      qmsQuoteSupplierEmailId: '',
      receiverName: '',
      supplierId: this.loggedId,
      qmsQuoteId: 0
    }
    if (appConstants.settingDefault.decimalValueDefault == null || appConstants.settingDefault.decimalValueDefault == undefined) {
      this._masterService.getDefaultQmsDecimalPlaces(this.loggedId).subscribe(res => {
        if (!res.isError) {
          appConstants.settingDefault.decimalValueDefault = res.data;
          this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
        }
      })
    } else {
      this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
    }
    this.isInvoicePdfPreview = false;
    this.notes = '';
    this.qmsQuoteInvoiceDetailsViewModel = new QMSQuoteInvoiceDetailsViewModel();
    this.qmsDetail = new QmsDetail();
    this.qmsQuoteIdEncrypt = this._router.snapshot.queryParams['qmsQuoteId'];
    this.invoiceId = this._router.snapshot.queryParams['invoiceId'];
    this.onSavePart = false;
    this.ContactModelList = [];
    this.iPaymentTermsViewModel = [];
    this.qmsQuoteInvoiceDetailsViewModel.partInfo = [];
    this.iMQSFilterViewModel = {
      supplierCompanyId: this.loggedCompanyId,
      countryId: 0,
      stateId: 0,
      maxPageSize: 20,
      pageSize: 0,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      filterBy: '',
    };
    this.companySettings = {
      singleSelection: true,
      text: 'Type Company Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Type Company Name',
      enableSearchFilter: true,
      labelKey: 'companynameWithSuppliername',
      primaryKey: 'mqsContactIdEncrypt',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 5,
      maxHeight: 200,
      showCheckbox: false
    };
    this.GetInvoiceStartingSeqNo();
    this.getMQSContactsList();
    if (this.invoiceId != null && this.invoiceId != undefined && this.invoiceId != 0) {
      this.getQMSQuoteInvoice();

    }
    this.getQmsQuoteDetailsById();
    this.getCurrency();
    this.getPaymentTerms();
    this.createInvoiceForm();
    this.calculateGrandTotal();
  }
  GetInvoiceStartingSeqNo() {
    this._qmsService.GetInvoiceStartingSeqNo(this.loggedCompanyId, true).subscribe(res => {
      if (!res.isError) {
        this.invoiceStartNumber = res.data;
      }
    })
  }
  getQmsQuoteDetailsById() {
    this._qmsService.getQmsQuoteDetailsById(this.qmsQuoteIdEncrypt).subscribe(res => {
      if (!res['isError']) {
        this.qmsDetail = res['data'];
        this.createInvoiceForm();
        this.getQmsQuotePartsInvoice();
      } else {
        this.createInvoiceForm();
        this.getQmsQuotePartsInvoice();
      }
    }, error => {
      this.createInvoiceForm();
    })
  }
  createInvoiceForm() {

    this.invoiceDetailForm = this._fb.group({
      invoiceFor: [null, Validators.required],
      referenceNumber: [this.qmsQuoteInvoiceDetailsViewModel.referenceNo, [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]*$")]],
      invoiceName: [this.qmsQuoteInvoiceDetailsViewModel.invoiceName],
      invoiceNumber: [this.qmsQuoteInvoiceDetailsViewModel.invoiceNo, [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")]],
      currency: [this.qmsQuoteInvoiceDetailsViewModel.currencyId, Validators.required],
      issueDate: [null, Validators.required],
      paymentTerms: [this.qmsQuoteInvoiceDetailsViewModel.paymentTermId],
      purchaseOrderNumber: [this.qmsQuoteInvoiceDetailsViewModel.purchaseOrderNumber,
        [Validators.required, Validators.pattern("^[0-9]*$")]
      ],
    });
    if (this.invoiceId) {
      this.invoiceDetailForm.get('issueDate').patchValue(new Date(this.qmsQuoteInvoiceDetailsViewModel.invoiceDate));
    } else {
      this.invoiceDetailForm.get('currency').patchValue(92);
      this.invoiceDetailForm.get('referenceNumber').patchValue(this.qmsDetail.qmsQuoteName);
      this.invoiceDetailForm.get('issueDate').patchValue(new Date());
      this.invoiceDetailForm.get('invoiceNumber').patchValue(this.invoiceStartNumber);

    }
    //// debugger;
    if (this.qmsQuoteInvoiceDetailsViewModel.qmsCustomerId) {
      this.selectedContact = this.ContactModelList.filter(x => x.qmsContactId == this.qmsQuoteInvoiceDetailsViewModel.qmsCustomerId);
    } else {
      this.selectedContact = this.ContactModelList.filter(x => x.mqsContactIdEncrypt == this.qmsDetail.qmsContactIdEncrypt);
    }

    if (this.selectedContact.length != 0) {
      this.invoiceDetailForm.get('invoiceFor').patchValue(this.selectedContact);
    }

  }

  getCurrency() {
    this._masterService.getCurrency().subscribe(res => {
      if (!res['isError']) {
        this.currencyList = res['data'];
      } else {
        this.currencyList = [];
      }
    }, error => {
      this.currencyList = [];
    })
  }
  getQmsQuotePartsInvoice() {
    this.checkAllPart = false;
    this._qmsService.qmsQuotePartsInvoice(this.qmsQuoteIdEncrypt, this.invoiceId).subscribe(res => {
      if (!res['isError']) {
        this.qmsQuotePartInvoice = res['data'];

        this.qmsQuotePartInvoice.forEach(partInfo => {
          partInfo.totalAmount = 0;
          partInfo.uniqueId = this.getUniqueNumber();
          partInfo.partDetails = null;
          if (this.invoiceId == null || this.invoiceId == 0) {
            partInfo.isPartOfInvoice = true;
          }
        });
      }
    })
  }
  getMQSContactsList() {
    this._qmsService.GetMQSContacts(this.iMQSFilterViewModel).subscribe(result => {
      if (result['result'] === true) {
        this.ContactModelList = result['data'];
        this.companySettings = {
          singleSelection: true,
          text: 'Type Company Name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Type Company Name',
          enableSearchFilter: true,
          labelKey: 'companynameWithSuppliername',
          primaryKey: 'mqsContactIdEncrypt',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 200,
          showCheckbox: false
        };
        this.createInvoiceForm();
      }
    });
  }
  getPaymentTerms() {
    this._qmsService.qmsGetPaymentTerms(this.loggedCompanyId, this.loggedId).subscribe(res => {
      if (!res.isError) {
        this.iPaymentTermsViewModel = res['data'].paymentTerms;
      }
    });
  }
  goBack() {
    this.router.navigate(['/qms/qmsdetail', this.qmsDetail.qmsQuoteId]);
  }


  cancelInvoice() {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to cancel this invoice?',
      header: 'Cancel  Invoice',
      icon: null,
      accept: () => {
        this.router.navigate(['/qms/qmsdetail', this.qmsDetail.qmsQuoteId]);
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });

  }
  isOtherCheck($event) {
    let partInfoIndex = this.qmsQuotePartInvoice.findIndex(x => x.qmsQuotePartId === $event.qmsQuotePartId);
    if (partInfoIndex != -1) {
      this.qmsQuotePartInvoice[partInfoIndex].isChecked = $event.isChecked;
    }
    if ($event.isChecked) {
      this.qmsQuotePartInvoice[partInfoIndex].form = $event.form;
    } else {
      this.qmsQuotePartInvoice[partInfoIndex].form = null;
    }
  }

  setChildFormValid($event) {
    let partInfoIndex = this.qmsQuotePartInvoice.findIndex(x => x.qmsQuotePartId === $event.qmsQuotePartId);
    if (partInfoIndex != -1) {
      this.qmsQuotePartInvoice[partInfoIndex].isFormValid = $event.isFormValid;
    }
  }
  isChildFormValid() {
    let isCheck = this.qmsQuotePartInvoice.findIndex(x => x.isFormValid === true);
    if (isCheck != -1) {
      return true;
    } else {
      this.checkAllPart = false;
      return false;

    }
  }

  isPartChecked() {
    let isCheck = this.qmsQuotePartInvoice.findIndex(x => x.isChecked === true);
    if (isCheck != -1) {
      return true;
    } else {
      this.checkAllPart = false;
      return false;

    }
  }
  isAllPartChecked() {
    let isCheck = this.qmsQuotePartInvoice.findIndex(x => x.isChecked === true);
    if (isCheck == -1) {
      this.checkAllPart = false;
    }
  }
  proceedToSaveQuoteParts: boolean = false;

  onSaveInvoice() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      this.onSavePart = false;
      this.onSaveDisabledBtn = true;
      this.qmsQuoteInvoiceDetailsViewModel.currencyId = this.invoiceDetailForm.value.currency;
      this.qmsQuoteInvoiceDetailsViewModel.invoiceDate = this.invoiceDetailForm.value.issueDate;
      this.qmsQuoteInvoiceDetailsViewModel.invoiceName = this.invoiceDetailForm.value.invoiceName;
      this.qmsQuoteInvoiceDetailsViewModel.paymentTermId = this.invoiceDetailForm.value.paymentTerms;
      this.qmsQuoteInvoiceDetailsViewModel.qmsCustomerId = this.invoiceDetailForm.value.invoiceFor[0].qmsContactId;
      this.qmsQuoteInvoiceDetailsViewModel.qmsQuoteIdEncrypt = this.qmsQuoteIdEncrypt;
      this.qmsQuoteInvoiceDetailsViewModel.referenceNo = this.invoiceDetailForm.value.referenceNumber;
      this.qmsQuoteInvoiceDetailsViewModel.invoiceNo = this.invoiceDetailForm.value.invoiceNumber;
      this.qmsQuoteInvoiceDetailsViewModel.purchaseOrderNumber = this.invoiceDetailForm.value.purchaseOrderNumber;
      this.qmsQuoteInvoiceDetailsViewModel.notes = this.notes;
      this.qmsQuoteInvoiceDetailsViewModel.createdBy = this.loggedId;
      this.qmsQuoteInvoiceDetailsViewModel.qmsQuoteInvoiceId = this.invoiceId;
      this.qmsQuoteInvoiceDetailsViewModel.invoiceId = this.invoiceId;

      this.proceedToSaveQuoteParts = false;



      this.rest.post('QMSQuoteInvoice', this.qmsQuoteInvoiceDetailsViewModel)
        .subscribe(
          (response: {
            data: any,
            isError: boolean,
            messages: any,
            totalRecords ? : number
          }) => {
            if (!response.isError) {
              this.invoiceId = response.data;

              this.proceedToSaveQuoteParts = true;
              setTimeout(() => {
                this.onSaveDisabledBtn = false;
                this._toastr.success('Invoice Created Successfully!', 'Success!');
                window.history.back();
              }, 3000);
            } else {
              this.onSaveDisabledBtn = false;
              this._toastr.warning(response.messages[0], 'Warning!');
              this.invoiceDetailForm.get('invoiceNumber').patchValue(null);
            }
            this.isButtonClicked = false;
          }, error => {
            this.isButtonClicked = false;
            this.onSaveDisabledBtn = false;
          });
    }
  }

  saveInvoicePriorToSendToCustomer() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
    this.onSavePart = false;
    this.isInvoiceSaved = true;
    this.qmsQuoteInvoiceDetailsViewModel.currencyId = this.invoiceDetailForm.value.currency;
    this.qmsQuoteInvoiceDetailsViewModel.invoiceDate = this.invoiceDetailForm.value.issueDate;
    this.qmsQuoteInvoiceDetailsViewModel.invoiceName = this.invoiceDetailForm.value.invoiceName;
    this.qmsQuoteInvoiceDetailsViewModel.paymentTermId = this.invoiceDetailForm.value.paymentTerms;
    this.qmsQuoteInvoiceDetailsViewModel.qmsCustomerId = this.invoiceDetailForm.value.invoiceFor[0].qmsContactId;
    this.qmsQuoteInvoiceDetailsViewModel.qmsQuoteIdEncrypt = this.qmsQuoteIdEncrypt;
    this.qmsQuoteInvoiceDetailsViewModel.referenceNo = this.invoiceDetailForm.value.referenceNumber;
    this.qmsQuoteInvoiceDetailsViewModel.invoiceNo = this.invoiceDetailForm.value.invoiceNumber;
    this.qmsQuoteInvoiceDetailsViewModel.purchaseOrderNumber = this.invoiceDetailForm.value.purchaseOrderNumber;
    this.qmsQuoteInvoiceDetailsViewModel.notes = this.notes;
    this.qmsQuoteInvoiceDetailsViewModel.createdBy = this.loggedId;
    this.qmsQuoteInvoiceDetailsViewModel.qmsQuoteInvoiceId = this.invoiceId;
    this.qmsQuoteInvoiceDetailsViewModel.invoiceId = this.invoiceId;

    this.proceedToSaveQuoteParts = false;


    this.rest.post('QMSQuoteInvoice', this.qmsQuoteInvoiceDetailsViewModel)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          messages: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.invoiceId = response.data;
            this.proceedToSaveQuoteParts = true;
            this.showPdfInvoicePreview(0);
          }
          this.isButtonClicked = false;
        });

    setTimeout(() => {
      this._qmsService.set(true, 'isMessageDrawer');
      this._qmsService.set(true, 'showSidePanel');
      this.isInvoiceSaved = false;
      window.scroll(0, 0);
      const data = document.getElementById('contentToConvertPDF').innerHTML;
      const newdata = data.substring(1, data.length - 1);
      this.qmsMailModel.qmsQuoteInvoicePDFHtml = newdata;
      this.qmsMailModel.qmsQuoteInvoiceId = this.invoiceId;
      this.qmsMailModel.qmsQuoteContactId = this.qmsDetail.qmsContactId;
      this.qmsMailModel.qmsQuoteInvoiceSubject = "";
      this.qmsMailModel.qmsQuoteInvoiceMessageBody = "";
      this.qmsMailModel.receiverName = this.invoiceDetailForm.value.invoiceFor[0].firstName +
        ' ' + this.invoiceDetailForm.value.invoiceFor[0].lastName;
      this.qmsMailModel.qmsQuoteSupplierEmailId = localStorage.getItem('User2');
      this.qmsMailModel.qmsQuoteId = this.qmsDetail.qmsQuoteId;
      this._toastr.success('Invoice Created Successfully!', 'Success!');
    }, 3000);
  }
  }

  getQMSQuoteInvoice() {
    this._qmsService.getQMSQuoteInvoice(this.invoiceId, this.qmsQuoteIdEncrypt).subscribe(res => {
      if (!res['isError']) {
        this.qmsQuoteInvoiceDetailsViewModel = res['data'];
        this.notes = this.qmsQuoteInvoiceDetailsViewModel.notes;
        if (this.qmsQuoteInvoiceDetailsViewModel.paymentTermId == null) {
          this.qmsQuoteInvoiceDetailsViewModel.paymentTermId = "";
        }
        this.createInvoiceForm();
      }


    })
  }

  checkAllPartSelection() {
    let allPartsChecked = true;
    this.qmsQuotePartInvoice.forEach(partInfo => {
      if (!partInfo.isPartOfInvoice) {
        allPartsChecked = false;
      }
    });
    this.checkAllPart = allPartsChecked;
  }

  showPdfPreview = 'out';
  proceedToGenerateThePdf: boolean = false;
  isPDFViewed = 'in'
  goBackTo($event) {
    this.proceedToGenerateThePdf = false;
    this.showPdfPreview = 'out';
    this.isPDFViewed = 'in'

    this.qmsQuotePartInvoice.forEach(partInfo => {
      partInfo.partDetails = null;
    });

  }
  showPdfInvoicePreview(ShowPdf = 1) {
    this.proceedToGenerateThePdf = true;
    if (ShowPdf === 1) {
      this.showPdfPreview = 'in';
      this.isPDFViewed = 'out'
    }


    this.invoicePreviewData.quoteReferenceNo = this.invoiceDetailForm.value.referenceNumber;
    this.invoicePreviewData.invoiceName = this.invoiceDetailForm.value.invoiceName;
    this.invoicePreviewData.customerId = this.invoiceDetailForm.value.invoiceFor[0].qmsContactId;
    this.invoicePreviewData.invoiceNumber = this.invoiceDetailForm.value.invoiceNumber;
    this.invoicePreviewData.issueDate = this.invoiceDetailForm.value.issueDate;
    this.invoicePreviewData.ordernumber = this.invoiceDetailForm.value.purchaseOrderNumber
    this.invoicePreviewData.notes = this.notes;

    this.invoicePreviewData.invoiceItems = [];
    this.qmsQuotePartInvoice.forEach(previewPartInfo => {
      if (previewPartInfo.isChecked) {
        this.invoicePreviewData.invoiceItems.push(previewPartInfo);
      }
    });
  }


  getUniqueNumber(min = 1, max = 99999) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  grandTotal: number = 0;
  calculateGrandTotal() {
    this.grandTotal = 0;
    var removeChar = /  |,/gi;
    for (let idx = 0; idx <= document.getElementsByClassName("dummyClass").length - 1; idx++) {
      this.grandTotal = this.grandTotal +
        parseFloat(document.getElementsByClassName("dummyClass")[idx].innerHTML.toString().replace(removeChar, '').replace('$', ''));
    }
    setTimeout(() => {
      this.calculateGrandTotal();
    }, 1000);
  }

  checkALL_change() {
    this.qmsQuotePartInvoice.forEach(partInfo => {
      partInfo.isPartOfInvoice = this.checkAllPart;
    });
  }
  isSidePanel() {
    return this._qmsService.get('showSidePanel');
  }
  isMessageDrawer() {
    return this._qmsService.get('isMessageDrawer');
  }
  onMessageDrawerClose(event) {
    window.history.back();
  }
  partSpecialFeeUpdateChange(event) {
    if (this.specialFeeData.length) {
      this.specialFeeData.push(event);
    } else {
      this.specialFeeData.push(event);
    }

  }
  isInvoiceNoRepeated() {
    let invoiceNumber = this.invoiceDetailForm.value.invoiceNumber;
    if (this.invoiceId == undefined || this.invoiceId == null) {
      this.invoiceId = 0;
    }
    this._qmsService.isInvoiceNoRepeated(this.loggedId, this.loggedCompanyId, invoiceNumber, this.invoiceId).subscribe(res => {
      if (res['isError'] == false) {
        if (res['data'] == true) {
          this._toastr.warning('Please enter different invoice number.', 'Warning!');
          this.invoiceDetailForm.get('invoiceNumber').patchValue(null);
        }
      }
    })
  }
}
