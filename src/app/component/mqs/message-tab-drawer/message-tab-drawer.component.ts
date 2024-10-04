import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import {
  QmsService
} from '../../../core/services/qms/qms.service';
import {
  qMSQuotePDFEmailMessageViewModel,
  qMSQuoteTermsConditionViewModel
} from './qmsMessageModel';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  CustomValidatorService
} from '../../../core/services/validator/custom-validator.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Router
} from '@angular/router';
import {
  QMSActivityStatusModel, QMSInvoiceTrackActivityViewModel
} from '../../../core/models/qmsModel';

@Component({
  selector: 'app-message-tab-drawer',
  templateUrl: './message-tab-drawer.component.html',
  styleUrls: ['./message-tab-drawer.component.scss'],
  providers: [qMSQuotePDFEmailMessageViewModel, qMSQuoteTermsConditionViewModel]
})
export class MessageTabDrawerComponent implements OnInit, OnDestroy {

  @Input() customerMsgModel: any;
  @Input() isInvoiceMail: number;

  @Output() isMsgDrawerClosed = new EventEmitter < boolean > ();
  closeMessageDrawer() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
    this.isMsgDrawerClosed.emit(false);
  }
  messageForm: FormGroup;
  labelFocus: any;
  termsConditionFile: string;
  qmsPDFFilename: string;
  qmsPartName: string;
  isMailSend: boolean;
  qmsActivityStatusModel: QMSActivityStatusModel;
  qmsInvoiceTrackActivityViewModel: QMSInvoiceTrackActivityViewModel;
  isButtonClicked: boolean = false;
  constructor(private _qmsService: QmsService,
    private _customValidatorsService: CustomValidatorService,
    private _fb: FormBuilder,
    private termsConditionViewModel: qMSQuoteTermsConditionViewModel,
    private pdfEmailMessageViewModel: qMSQuotePDFEmailMessageViewModel,
    private _rfqService: RfqService,
    private _toastr: ToastrService,
    private router: Router) {
    this.termsConditionFile = '';
    this.qmsPDFFilename = '';
    this.qmsPartName = '';
    this.isMailSend = false;
  }

  ngOnInit() {
    this.qmsActivityStatusModel = {
      "qmsQuoteId": 0,
      "qmsQuoteActivityid": 0,
      "supplierId": this.loggedId
    }
    this.qmsInvoiceTrackActivityViewModel = {
      qmsQuoteId : 0,
      qmsQuoteInvoiceId : 0,
      qmsQuoteActivityId : 0,
      // activityDate : '',
      createdBy :this.loggedId
    }
    if (this.isInvoiceMail == 1) {
      this.messageForm = this._fb.group({
        subject: [null, Validators.required],
        message: [null, Validators.required],
      })
      this.qmsPDFFilename = 'quotepdf_invoice' + this.customerMsgModel.qmsQuoteInvoiceId + '.pdf';
      this.qmsInvoiceTrackActivityViewModel.qmsQuoteInvoiceId = this.customerMsgModel.qmsQuoteInvoiceId;
      this.qmsInvoiceTrackActivityViewModel.qmsQuoteId = this.customerMsgModel.qmsQuoteId;
    } else {
      this.messageForm = this._fb.group({
        subject: [this.pdfEmailMessageViewModel['emailSubject'], Validators.required],
        message: [this.pdfEmailMessageViewModel['emailBody'], Validators.required],
      })
      this.getTermsConditionFile();
      this.qmsPDFFilename = 'QuotePDF_' + this.customerMsgModel.quoteId + '_' + this.customerMsgModel.qmsQuoteId + '.pdf';
      this.qmsPartName = 'Parts_' + this.customerMsgModel.quoteId + '_' + this.customerMsgModel.qmsQuoteId + '.zip';
    }

  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  /* This function is used to get the terms and condition file uploaded by Manufacturer. */
  getTermsConditionFile() {
    this._qmsService.getTermsConditionFile(this.customerMsgModel.supplierCompanyId, this.customerMsgModel.supplierContactId).subscribe(
      result => {
        if (!result.isError) {
          this.termsConditionViewModel = result.data;
          const filename = this.termsConditionViewModel.termsConditionFileName;
          if (filename) {
            const filenNameArray = filename.split('_S3_');
            if (filenNameArray.length === 1) {
              this.termsConditionFile = filenNameArray[0];
            }
            this.termsConditionFile = filenNameArray[1];
          }
        } else {
          // this.termsConditionViewModel = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  /* This function is used to send email to Customer or Manufacturer. */
  onMessageSend() {
    if(!this.isButtonClicked){
      this.isButtonClicked = true;

    if (this.messageForm.valid) {

      if (this.isInvoiceMail == 1) {
        this.isMailSend = true;
        this.customerMsgModel.qmsQuoteInvoiceSubject = this.messageForm.value.subject;
        this.customerMsgModel.qmsQuoteInvoiceMessageBody = this.messageForm.value.message;
        this._qmsService.sendQmsMail(this.customerMsgModel).subscribe(
          response => {
            if (!response.isError) {
              this.isMailSend = false;
              this.isMsgDrawerClosed.emit(true);
              this.setQMSInvoiceActivity();
            }
            this.isButtonClicked = false;
          },
          error => {
            this.isButtonClicked = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this.isMailSend = true;
        this.pdfEmailMessageViewModel.qmsQuoteId = this.customerMsgModel.qmsQuoteId;
        this.pdfEmailMessageViewModel.quoteId = this.customerMsgModel.quoteId;
        this.pdfEmailMessageViewModel.qmsQuoteName = this.customerMsgModel.qmsQuoteName;
        this.pdfEmailMessageViewModel.supplierContactId = this.customerMsgModel.supplierContactId;
        this.pdfEmailMessageViewModel.supplierCompanyId = this.customerMsgModel.supplierCompanyId;
        this.pdfEmailMessageViewModel.qmsContactId = this.customerMsgModel.qmsContactId;
        this.pdfEmailMessageViewModel.toEmailId = this.customerMsgModel.toEmailId;
        this.pdfEmailMessageViewModel.replyToEmailId = this.customerMsgModel.replyToEmailId;
        this.pdfEmailMessageViewModel.quotePdfHtml = this.customerMsgModel.quotePdfHtml;
        this.pdfEmailMessageViewModel.emailSubject = this.messageForm.value.subject;
        this.pdfEmailMessageViewModel.emailBody = this.messageForm.value.message;
        this.pdfEmailMessageViewModel.isCustomer = this.customerMsgModel.isCustomer;
        this.pdfEmailMessageViewModel.termsConditionFileName = this.termsConditionViewModel.termsConditionFileName;
        this.qmsActivityStatusModel.qmsQuoteId = this.customerMsgModel.qmsQuoteId;
        if (this.customerMsgModel.isCustomer) {
          this.qmsActivityStatusModel.qmsQuoteActivityid = 103;
        } else {
          this.qmsActivityStatusModel.qmsQuoteActivityid = 102;
        }
        this._qmsService.sendEmailCustomer(this.pdfEmailMessageViewModel).subscribe(
          result => {
            if (result.isError === false) {
              this.isMailSend = false;
              this.setQMSActivity();
            } else {
              //  this._toastr.error(result.errorMessage, 'Error!');
            }
            this.isButtonClicked = false;
          },
          error => {
            this.isButtonClicked = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }


    } else {
      this.isButtonClicked = false;
      this._customValidatorsService.validateAllFormFields(this.messageForm);
    }
  }
  }
  setQMSInvoiceActivity() {
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteActivityId = 105;
    this._qmsService.setQMSInvoiceActivity(this.qmsInvoiceTrackActivityViewModel).subscribe(
      response => {
        // // debugger;
        // console.log(response);
        this._toastr.success('Email send successfully!', '');
        this._qmsService.set(false, 'isMessageDrawer');
        this._qmsService.set(false, 'showSidePanel');
        this._qmsService.set(true, 'quoteReviewDrawerClosed');
      },
      error => {
        this._toastr.success('Email send successfully!', '');
        this._qmsService.set(false, 'isMessageDrawer');
        this._qmsService.set(false, 'showSidePanel');
        this._qmsService.set(true, 'quoteReviewDrawerClosed');
      }
    );
  }
  setQMSActivity() {
    this._qmsService.setQMSActivityStatus(this.qmsActivityStatusModel).subscribe(
      response => {
        // // debugger;
        // console.log(response);
        this._toastr.success('Email send successfully!', '');
        this._qmsService.set(false, 'isMessageDrawer');
        this._qmsService.set(false, 'showSidePanel');
        this._qmsService.set(true, 'quoteReviewDrawerClosed');
        if (this.isInvoiceMail == 1) {} else{
          this.router.navigate(['/qms/myquotes']);
        }
        
      },
      error => {
        this._toastr.success('Email send successfully!', '');
        this._qmsService.set(false, 'isMessageDrawer');
        this._qmsService.set(false, 'showSidePanel');
        this._qmsService.set(true, 'quoteReviewDrawerClosed');
        if (this.isInvoiceMail == 1) {} else{
          this.router.navigate(['/qms/myquotes']);
        }
      }
    );
  }
  /* This function is used to validate the form field. */
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }
  /* This function is used to enable or disable send button on validation. */
  validateBtn() {
    const subject = this.messageForm.value.subject;
    const message = this.messageForm.value.message;
    if (subject === '' || message === '') {
      return true;
    } else {
      return false;
    }
  }
  /* This function is used to check form field empty or not. */
  checkMessageField(field: string) {
    return this.messageForm.value[field] === '';
  }
  /* This function is used to set the label(blue or black). */
  setLabel(label: string) {
    this.labelFocus = label;
  }
  /* This function is used to close the drawer on component destroyed. */
  ngOnDestroy() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
  }
}
