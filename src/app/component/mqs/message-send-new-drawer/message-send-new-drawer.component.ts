import {
  Component,
  OnInit,
  ViewChild,
  Input
} from '@angular/core';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  IMessagesViewModel,
  CreateNewRFQMessagesViewModel
} from '../../../core/models/rfqModel';
import {
  ToastrService
} from 'ngx-toastr';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  Http,
  Headers
} from '@angular/http';
import {
  environment
} from '../../../../environments/environment';
import {
  CustomValidatorService
} from '../../../core/services/validator/custom-validator.service';
import {
  QmsService
} from '../../../core/services/qms/qms.service';
import {
  qMSEmailMessagesViewModel,
  qmsEmailMessageFilesViewModel
} from '../../../core/models/qmsModel';

import { uploadFileNDA } from '../../../../constants/url-constant';
@Component({
  selector: 'app-message-send-new-drawer',
  templateUrl: './message-send-new-drawer.component.html',
  styleUrls: ['./message-send-new-drawer.component.scss']
})
export class MessageSendNewDrawerComponent implements OnInit {
  attachFilesUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'files'
  });
  @ViewChild('messageAttachment',{static:false}) messageAttachment;
  uploadingInProg: boolean;
  messageForm: FormGroup;
  iqmsEmailMessagesViewModel: qMSEmailMessagesViewModel;
  iRfqMessageViewModelColl: IMessagesViewModel;
  createNewRFQMessagesViewModel = new CreateNewRFQMessagesViewModel;
  successOrFailureMsg = '';
  messageSuccessStatus = false;
  messageFailureStatus = false;
  from_id: number;
  result: any;
  @Input() email: any;
  @Input() contactID: any;
  @Input() qmsQuoteID: any;

  isButtonClicked: boolean = false;

  qMSEmailMessagesViewInitModel() {
    this.iqmsEmailMessagesViewModel = {
      qmsEmailMessageId: 0,
      qmsQuoteId: 0,
      emailSubject: '',
      emailBody: '',
      emailDate: null,
      fromCont: 0,
      fromContName: '',
      toCont: 0,
      contactEncryptId: '',
      toContName: '',
      toEmail: '',
      emailSent: true,
      emailRead: false,
      isTrash: false,
      isSelected: false,
      qmsEmailMessageFilesList: [],
      result: false,
      errorMessage: ''
    }
  }

  // tslint:disable-next-line:max-line-length
  constructor(private _Http: Http, private _fb: FormBuilder, private _rfqService: RfqService, private _customValidatorsService: CustomValidatorService,
    private _toastr: ToastrService, private _qmsService: QmsService) {}

  ngOnInit() {
    this.qMSEmailMessagesViewInitModel();
    this._qmsService.set(false, 'isMessageSendDrawer');
    // this._qmsService.set(false, 'isSidePanel');
    // this._qmsService.set(false, 'isSidePanel');
    this.uploadingInProg = false;
    this.messageForm = this._fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      rfqId: [
        0, Validators.required
      ],
    });
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  onMessageSend() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      if (this.messageForm.valid) {
        this.iqmsEmailMessagesViewModel.qmsQuoteId = this.qmsQuoteID;
        this.iqmsEmailMessagesViewModel.toCont = this.contactID;
        this.iqmsEmailMessagesViewModel.fromCont = this.loggedId;
        this.iqmsEmailMessagesViewModel.toEmail = this.email;
        this.iqmsEmailMessagesViewModel.emailDate = new Date();
        this.iqmsEmailMessagesViewModel.emailBody = this.messageForm.value.message;
        this.iqmsEmailMessagesViewModel.emailSubject = this.messageForm.value.subject;
        this._qmsService.sendQmsMessages(this.iqmsEmailMessagesViewModel).subscribe(
          result => {
            if (result['isError'] == false) {
              this.iqmsEmailMessagesViewModel = result;
              this.messageSuccessStatus = true;
              this.successOrFailureMsg = this.iqmsEmailMessagesViewModel.errorMessage;
              this._toastr.success('Message Send SuccessFully', 'Success!');
              this.resetErrorStatus('messageSuccessStatus');
              this._rfqService.set(true, 'isMessageRead');
              this.closePartDrawer();
            } else {
              this.messageFailureStatus = true;
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
      } else {
        this.isButtonClicked = false;
        this._customValidatorsService.validateAllFormFields(this.messageForm);
      }
    }
  }

  closePartDrawer() {
    this._qmsService.set(false, 'isMessageQmsDrawer');
    this._qmsService.set(false, 'showSidePanel');

  }
  resetErrorStatus(status: string) {
    setTimeout(() => {
      if (status === 'messageSuccessStatus') {
        this.messageSuccessStatus = false;
      } else {
        this.messageFailureStatus = false;
      }
      this.closePartDrawer();
    }, 6000);
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }
  // File upload Functions
  getOriginalPartName(fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        return filenNameArray[0];
      }
      return filenNameArray[1];
    }
  }

  removeSavedAttachFile(filename, index: any) {
    if (this.iqmsEmailMessagesViewModel.qmsEmailMessageFilesList) {
      this.iqmsEmailMessagesViewModel.qmsEmailMessageFilesList.splice(index, 1);
      this._toastr.success('File remove successfully', 'success!');
    }
  }

  onFileSelect($event) {
    this.uploadAttachFiles();
    $event.srcElement.value = '';

  }

  uploadAttachFiles() {
    // this.sendMessageObj.messageFileNames =[];
    const files = this.attachFilesUploader.queue;
    if ((this.attachFilesUploader.queue.length + this.iqmsEmailMessagesViewModel.qmsEmailMessageFilesList.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!', 'Warning!');
      this.attachFilesUploader.queue = [];
      return;
    }
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        // ++this.isAttachmentsLoading;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          // this.iAttachUploadedFileName.oFileName = fileNameArray[1];
          // this.iAttachUploadedFileName.CompleteFileName = fName;
          this.iqmsEmailMessagesViewModel.qmsEmailMessageFilesList.push(
            fName
          );
          //   this.iAttachUploadedFileName = {
          //     oFileName: '',
          //     CompleteFileName: ''
          //   };
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

  resetBtn() {
    const subject = this.messageForm.value.subject;
    const message = this.messageForm.value.message;
    if (subject === '' || message === '') {
      return true;
    } else {
      return false;
    }
  }
}
