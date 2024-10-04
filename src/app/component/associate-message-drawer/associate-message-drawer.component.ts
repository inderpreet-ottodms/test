import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { CreateNewRFQMessagesViewModel } from '../../core/models/rfqModel';
import { CustomValidatorService } from '../../core/services/validator/custom-validator.service';
import { environment } from '../../../environments/environment';
declare var Quill: any;
import { uploadFileNDA } from '../../../constants/url-constant';
import { ProductAnalyticService } from '../../../app/shared/product-analytic/product-analytic';
import { BrowserStorageUtil } from '../../../app/shared/browser.storage.util';

@Component({
  selector: 'app-associate-message-drawer',
  templateUrl: './associate-message-drawer.component.html',
  styleUrls: ['./associate-message-drawer.component.scss']
})
export class AssociateMessageDrawerComponent implements OnInit {

  propagateChange = (_: any) => { };
  propagateTouched = () => { };
  role: string;
  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
  public value: string;

  messageForm: FormGroup;
  rfqSettings = {};
  RfqList: any = [];
  selectedItems = [];
  createNewRFQMessagesViewModel = new CreateNewRFQMessagesViewModel;
  @Input('associateRfqId') rfqId: number;
  @Input('rfqMessage') isRfqMessage: number;
  isLoader: boolean = false;
  isButtonClicked: boolean = false;

  attachFilesUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'files'
  });
  @Output() message_sent = new EventEmitter<boolean>();
  buyerManufacList: any = [];
  buyerManufacSettings = {};
  selectedManufac = [];
  userType: string = '';
  isBuyer: boolean = false;
  fromContactId: any;
  isBuyerSelected: boolean = false;
  constructor(private _fb: FormBuilder,
    private _Http: Http,
    private _rfqService: RfqService,
    private _customValidatorsService: CustomValidatorService,
    private _toastr: ToastrService,
    private productAnalyticService: ProductAnalyticService) {
    var fontSizeStyle = Quill.import('attributors/style/size');
    fontSizeStyle.whitelist = ['2em', '1.5em', '0.5em'];
    Quill.register(fontSizeStyle, true);
    this.userType = localStorage.getItem('Usertype');
    this.rfqSettings = {
      singleSelection: false,
      text: 'Select RFQ',
      searchPlaceholderText: 'Select RFQ',
      enableSearchFilter: true,
      labelKey: 'rfqName',
      primaryKey: 'rfqId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 2,
      maxHeight: 200,
      showCheckbox: true,
      enableCheckAll: false,
      classes: "associate-msg-drawer"
    };
  }
  writeValue(value: any) {
    this.value = value;
  }
  errorDisMsg: string;
  changeText(e) {
    console.log(e);
    if (e.textValue.length >= 1 && e.textValue.length <= 1000) {
      this.errorDisMsg = '';
    } else if (e.textValue.length > 1000) {
      this.errorDisMsg = 'Exceed the character length.';
    }
    this.propagateChange(e.htmlValue);
  }
  ngOnInit() {
    //console.log(this.rfqId, 'RFQ ID VALUE')
    if (this.rfqId != 0) {
      this.messageForm = this._fb.group({
        subject: ['', Validators.required],
        message: ['', Validators.required],
        rfqId: [
          [],
        ],
        contactId: [
          [],
        ]
      });
    } else {
      this.messageForm = this._fb.group({
        subject: ['', Validators.required],
        message: ['', Validators.required],
        rfqId: [
          [],
        ],
        contactId: [
          [], Validators.required
        ]
      });
    }
    if (this.rfqId !== 0) {
      this.messageForm.patchValue({
        'rfqId': this.rfqId
      });
      this.createNewRFQMessagesViewModel.rfqIds.push(this.rfqId);
    }
    this.getListOfBuyersManufacturersForNewMessages();
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  // this function used to get manufacturer and Buyer list for dropdown
  getListOfBuyersManufacturersForNewMessages() {
    if (this.userType === 'Buyer') {
      this.fromContactId = '';
      this.getRFQList();
      this.isBuyer = true;
      this.buyerManufacList = [];
      this.buyerManufacSettings = {
        singleSelection: false,
        text: 'Select Manufacturers',
        searchPlaceholderText: 'Search Manufacturers',
        enableSearchFilter: true,
        labelKey: 'contactName',
        primaryKey: 'contactId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        badgeShowLimit: 2,
        maxHeight: 200,
        showCheckbox: true,
        enableCheckAll: false,
        classes: "associate-msg-drawer1"
      }
    } else {
      this.isBuyer = false;
      this.buyerManufacList = [];
      this.buyerManufacSettings = {
        singleSelection: true,
        text: 'Select Buyer',
        searchPlaceholderText: 'Search Buyer',
        enableSearchFilter: true,
        labelKey: 'contactName',
        primaryKey: 'contactId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        badgeShowLimit: 2,
        maxHeight: 200,
        showCheckbox: false,
        enableCheckAll: false,
        classes: "associate-msg-drawer1"
      }
    }
    this._rfqService.getListOfBuyersManufacturersForNewMessages(this.loggedId, this.isBuyer).subscribe(
      result => {
        if (!result.isError) {
          this.buyerManufacList = result.data;
        } else {
          this.buyerManufacList = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  // this function is used to get rfq list for copy rfq
  getRFQList() {
    this.RfqList = [];
    this.rfqSettings = {
      singleSelection: false,
      text: 'Select RFQ',
      searchPlaceholderText: 'Select RFQ',
      enableSearchFilter: true,
      labelKey: 'rfqName',
      primaryKey: 'rfqId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 2,
      maxHeight: 200,
      showCheckbox: true,
      enableCheckAll: false,
      classes: "associate-msg-drawer"
    };
    this._rfqService.getRFQList(this.loggedId, this.fromContactId).subscribe(
      result => {
        if (!result.isError) {
          this.RfqList = result.data;
          if (this.RfqList.length === 0 && this.userType === 'Supplier') {
            this.isBuyerSelected = true;
          } else {
            this.isBuyerSelected = false;
          }
        } else {
          this.RfqList = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }

  messagesent() {
    this._rfqService.newEvent(true);
  }

  onMessageSend() {

    this.messageSendMixpanel()
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      this.createNewRFQMessagesViewModel.fromContactId = this.loggedId;
      this.createNewRFQMessagesViewModel.messageDescription = this.messageForm.value.message;
      this.createNewRFQMessagesViewModel.messageSubject = this.messageForm.value.subject;
      this.createNewRFQMessagesViewModel.contactIds = this.createNewRFQMessagesViewModel.contactIds;
      this._rfqService.addNewRfqMessage(this.createNewRFQMessagesViewModel).subscribe(res => {
        if (!res.isError) {
          this._toastr.success('Message sent successfully.', 'Success!');
          this._rfqService.set(true, 'messageSentFromRfq');
          this.closePartDrawer();
          setTimeout(() => {
            this.messagesent();
          }, 1000);
        }
        this.isButtonClicked = false;
      },
        error => {
          this.isButtonClicked = false;
        })
    }
  }

  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'associateMessageDrawer');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }
  // this function used to catch the Deselected manufacturer data from dropdown list
  onBuyerManufacDeSelect(item: any) {
    const index: number = this.createNewRFQMessagesViewModel.contactIds.indexOf(item.contactId);
    if (index !== -1) {
      this.createNewRFQMessagesViewModel.contactIds.splice(index, 1);
    }
  }
  // this function used to catch the Selected manufacturer data from dropdown list
  onBuyerManufacSelect(item: any) {
    console.log("item@@@@@@@@@@@@@@@@@@@@", item)
    this.fromContactId = item.contactId;
    this.getRFQList();
    this.createNewRFQMessagesViewModel.contactIds.push(item.contactId);
  }

  onDeSelectAll(deselected: any) {
    if (this.userType === 'Supplier') {
      this.RfqList = [];
      this.isBuyerSelected = false;
    } else {
      this.RfqList = this.RfqList;
    }

  }
  onRfqDeSelect(item: any) {
    const index: number = this.createNewRFQMessagesViewModel.rfqIds.indexOf(item.rfqId);
    if (index !== -1) {
      this.createNewRFQMessagesViewModel.rfqIds.splice(index, 1);
    }
  }
  // this function is used to select rfq from the rfq list
  onRfqSelect(item: any) {
    this.createNewRFQMessagesViewModel.rfqIds.push(item.rfqId);
  }
  onFileSelect($event) {
    this.uploadAttachFiles();
    $event.srcElement.value = '';
  }

  uploadAttachFiles() {
    this.isLoader = true;
    const files = this.attachFilesUploader.queue;
    if ((this.attachFilesUploader.queue.length + this.createNewRFQMessagesViewModel.messageFileNames.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!', 'Warning!');
      this.attachFilesUploader.queue = [];
      this.isLoader = false;
      return;
    }
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          this.createNewRFQMessagesViewModel.messageFileNames.push(
            fName
          );
          this.isLoader = false;
        },
          error => {
            this.isLoader = false;
          });
      }
    }
    this.attachFilesUploader.queue = [];
  }
  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
  }

  getOriginalPartName(fileName) {
    if (fileName) {
      const fileNameArray = fileName.split('_S3_');
      if (fileNameArray.length === 1) {
        return fileNameArray[0];
      }
      return fileNameArray[1];
    }
  }
  removeSavedAttachFile(filename, index: any) {
    if (this.createNewRFQMessagesViewModel.messageFileNames) {
      this.createNewRFQMessagesViewModel.messageFileNames.splice(index, 1);
      this._toastr.success('File remove successfully', 'success!');
    }
  }
  messageSendMixpanel() {
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_MESSAGE_SENT, {
      manufacturer_id: this.fromContactId,
      is_loggedIn: true,
      buyer_id: BrowserStorageUtil.getLoogedUserId()
    });
  }
}
