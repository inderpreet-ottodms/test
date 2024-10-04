import {
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Router
} from '@angular/router';
import {
  Http,
  Headers
} from '@angular/http';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  Subscription
} from 'rxjs';
import * as moment from 'moment';
import {
  environment
} from '../../../environments/environment';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { MasterService } from '../../core/services/master/master.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { IviewedProfileViewModel, ILeadUserViewModel, ILeadMessageDataViewModel } from '../../core/models/profileModel';
import { IMyAccountViewModel } from '../../core/models/supplierProfileModel';
import { IMessagesViewModel, DownloadAllFilesViewModel } from '../../core/models/rfqModel';
import { ProductAnalyticService } from '../../../app/shared/product-analytic/product-analytic';
declare var window;
declare var Quill: any;
import { uploadFileNDA } from '../../../constants/url-constant';
@Component({
  selector: 'app-message-thread-drawer',
  templateUrl: './message-thread-drawer.component.html',
  styleUrls: ['./message-thread-drawer.component.scss']
})
export class MessageThreadDrawerComponent implements OnInit {


  propagateChange = (_: any) => {};
  propagateTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
  public value: string;

  /*
    messageTypeId = 225 - external message from public profile,
  */

  @Input('messageThreadId') messageThreadId: number;
  attachFilesUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'files'
  });
  iMyAccountViewModel: IMyAccountViewModel;
  messageThreadList: IMessagesViewModel[];
  inputMsgObj: IMessagesViewModel;
  sendMessageObj: IMessagesViewModel;
  Downloadallfiles: DownloadAllFilesViewModel;
  defaultSupplierLogo = 'assets/company/avatar-manu-basic.svg';
  defaultBuyerLogo = 'assets/company/avatar-manu-basic.svg';
  defaultAwsPath = '';
  @ViewChild('messageAttachment',{static:false}) messageAttachment;
  appendText: string;
  messageToSend = '';
  sendMessageError = false;
  defaultPath = 'assets/';
  userType: string;
  OpenContactName: string;
  phoneNo: any = null;
  email: any = null;
  compName: string = null;
  IsactiveBtn: any;
  isApi: boolean;
  isUpgradeModelVisible: boolean;
  isLoader: boolean;
  isUpgradeBtn: boolean;
  isAccountUpgradereqSent: boolean;
  isPaidContract: string;
  accountUpgradeMessage: string;
  totalCount: number;
  iLeadUserViewModel: ILeadUserViewModel;
  companyId: number = 0;
  isView: boolean;
  temp: string[];
  userAccount: string;
  messageThreadSubscription: Subscription;
  showNdaModel: boolean = false;
  msgId: number;
  toShowContactModel: boolean = false;
  activeStatusFilterBtn: string = '';
  iviewedProfileViewModel: IviewedProfileViewModel;
  iLeadMessageDataViewModel: ILeadMessageDataViewModel;
  messageId: number;
  communityUrl: string;
  communityProfileUrl: string;
  constructor(private _Http: Http, private _rfqService: RfqService, private _toastr: ToastrService,private router: Router,
     private _masterService: MasterService, private _profileService: ProfileService,private productAnalyticService:ProductAnalyticService) {
    this.messageThreadList = [];
    this.userType = localStorage.getItem('Usertype');
    this.OpenContactName = this._rfqService.get('toContName');
    this.IsactiveBtn = this._rfqService.get('IsActiveBtn');
    this.isApi = true;
    this.isUpgradeModelVisible = false;
    this.temp = [];
    this.messageThreadSubscription = this._rfqService.getisSupplierMessageThread().subscribe(res => {
      if (res.text === 'true') {
        this.messageThreadList = [];
        this.isApi = true;
        this.userType = localStorage.getItem('Usertype');
        this.OpenContactName = this._rfqService.get('toContName');
        this.inputMsgObj = this._rfqService.get('messageForThread');
        this.messageThreadId = this.inputMsgObj.messageId;
        // this.companyId = this.inputMsgObj.companyId;
        this.appendText = '...';
        this.getMessages(true);
        this.initSendMessageObj();
      }
    });
    var fontSizeStyle = Quill.import('attributors/style/size');
    fontSizeStyle.whitelist = ['2em', '1.5em', '0.5em'];
    Quill.register(fontSizeStyle, true);
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
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: '',
      membership: '',
      price: 0,
      paymentMethod: '',
      paymentFrequency: '',
      paymentAmount: 0,
      startDate: '0001-01-01T00:00:00',
      endDate: '0001-01-01T00:00:00',
      autoRenewal: false,
      errorMessage: '',
      result: false,
      pageName: 'Global message thread',
      rfqId: 0,
      toAlternateEmailId: ''
    };
    this.iLeadUserViewModel = {
      leadInteractionType: 0,
      contactId: 0,
      companyId: 0,
      ipAddress: '',
      errorMessage: '',
      result: false,
      leadId: 0,
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      emailSubject: "",
      emailMessage: "",
      companyName: "",
    };
    this.iLeadMessageDataViewModel = {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phoneNo: '',
      contactId: 0,
      totalRecords: 0,
      defaultValue: 0,
      isError: false,
      messages: '',
      statusCode: false,
    }
    this.inputMsgObj = this._rfqService.get('messageForThread');
    this.messageThreadId = this.inputMsgObj.messageId;
    // this.companyId = this.inputMsgObj.companyId;
    this.appendText = '...';
    this.userType = localStorage.getItem('Usertype');
    this.userAccount = localStorage.getItem('AccountType');
    this.getMessages(true);
    this.initSendMessageObj();
  }

  readMore() {
    this.isViewProfile(this.inputMsgObj.companyId);
    const IsactiveBtn = this._rfqService.get('IsActiveBtn');
    if (this.userType === 'Supplier') {

      this._rfqService.set(true, 'isBuyerCommpleteProfile');
      this._rfqService.set(this.inputMsgObj.companyId, 'buyerCurrentProfileCompanyId');
      if (IsactiveBtn === 'sent') {
        this._rfqService.set(this.inputMsgObj.toContactIdEncrypt, 'buyerCurrentProfileContactId');
        this._rfqService.set(this.inputMsgObj.toCont, 'buyerProfileId');
        this._rfqService.set(this.inputMsgObj.toContName, 'nameOfBuyer');
      } else {
        this._rfqService.set(this.inputMsgObj.fromContactIdEncrypt, 'buyerCurrentProfileContactId');
        this._rfqService.set(this.inputMsgObj.fromCont, 'buyerProfileId');
        this._rfqService.set(this.inputMsgObj.fromContName, 'nameOfBuyer');
      }
    } else {

      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/source'], { queryParams: {page: this.communityProfileUrl}})
      );
      window.open("#"+ url, '_blank');
    }
  }

  isViewProfile(companyId) {
    this.iviewedProfileViewModel.contactId = this.loggedId;
    this.iviewedProfileViewModel.companyIdProfile = companyId;
    this._profileService.setViewProfile(this.iviewedProfileViewModel).subscribe(
      result => {
        // console.log('resultview', result);
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  initSendMessageObj() {
    this.iviewedProfileViewModel = {
      viewProfileId: 0,
      contactId: 0,
      companyIdProfile: 0,
      profileViewedDate: null,
      contactIdProfile: 0,
      errorMessage: '',
      result: false
    };
    this.sendMessageObj = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 5,
      originalMessageSubject: '',
      pageName: '',
      fromContactIdEncrypt: '',
      toContactIdEncrypt: '',
      messageHierarchy: 0,
      messageSubject: '',
      messageDescr: '',
      messageDate: null,
      fromCont: 0,
      toCont: 0,
      messageRead: false,
      messageSent: false,
      readDate: null,
      messageStatusIdRecipient: 0,
      messageStatusIdAuthor: 0,
      expirationDate: null,
      trash: false,
      trashDate: null,
      fromTrash: false,
      fromTrashDate: null,
      errorMessage: '',
      result: false,
      isSelected: false,
      toContactIds: [],
      messageStatus: '',
      supplierProfileUrl: '',
      buyerProfileUrl: '',
      sendEmail: false,
      messageStatusId: 0,
      messageTypeValue: 'rfqFreeMessage',
      fromContName: '',
      toContName: '',
      messageFileNames: [],
      isNDAToApproveAll: false,
      toRFQIds: [],
      companyId: 0,
      companyName: '',
      companyUrl: '',
      companylogo: '',
      toContactCompanyUrl: '',
      toContactCompanylogo: '',
      toCompanyName: '',
      nDAApproveContactsRFQsLists: [],
      isNdaRequired: false,
      quoteReferenceNumber: '',
      toCompanyId: 0,
      isNotification: false
    };
  }
  closeMessageThreadDrawer(leadType) {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
    for (let i = 0; i < this.messageThreadList.length; i++) {
      if (!this.messageThreadList[i].messageRead && this.userType === 'Buyer' && this.IsactiveBtn !== 'sent') {
        this.iLeadUserViewModel.leadInteractionType = leadType;
        this.iLeadUserViewModel.contactId = this.loggedId;
        this.iLeadUserViewModel.companyId = this.inputMsgObj.companyId;//this.companyId;
        this._masterService.setSetLeadUser(this.iLeadUserViewModel).subscribe(
          (result) => {
            console.log(result);
          }
        );
      }
    }
  }
 isExternalFlag: boolean = false;
  getMessages(toReadMsg) {
    this._rfqService.getMessageThreadByID(this.inputMsgObj).subscribe(
      result => {
        if (result.result) {
          this.isApi = false;
           this.companyId = result['data'][0].companyId;
          this.messageThreadList = result['data'].reverse();
          this.phoneNo = result['data'][0].phoneNo;
          this.email = result['data'][0].toMailId;
          this.compName = result['data'][0].companyName;
          this.messageId = result['data'][0].messageId;
          this.iLeadMessageDataViewModel.contactId = 0;
          this.isExternalFlag = false;
          if (this.userType !== 'Supplier') {
            this.getCommunityUrl();
          }
          if (this.IsactiveBtn === 'sent') {
            if (!!this.messageThreadList && this.messageThreadList[this.messageThreadList.length - 1].toContactCompanylogo !== '') {
              this.messageThreadList[this.messageThreadList.length - 1].toContactCompanylogo = this.messageThreadList[this.messageThreadList.length - 1].toContactCompanylogo;
            } else {
              this.messageThreadList[this.messageThreadList.length - 1].toContactCompanylogo = this.defaultPath + 'user.png';
            }
          } else {
            if (!!this.messageThreadList && this.messageThreadList[this.messageThreadList.length - 1].companylogo !== '') {
              this.messageThreadList[this.messageThreadList.length - 1].companylogo = this.messageThreadList[this.messageThreadList.length - 1].companylogo;
            } else {
              this.messageThreadList[this.messageThreadList.length - 1].companylogo = this.defaultPath + 'user.png';
            }
          }
          if (toReadMsg) {
            this.markMessagesAsRead();
          }
          if(this.messageThreadList[0].messageTypeId === 225) {
            this.isExternalFlag = true;
            this.getLeadMessageData(this.messageId);
          }

        } else {
          this._toastr.error(result.errorMessage, 'Error!');
          this.closeMessageThreadDrawer('ReadMessage');
        }
      },
      error => {
        this._rfqService.handleError(error);
        this.closeMessageThreadDrawer('ReadMessage');
      },
      () => {}
    );
  }


  getLeadMessageData(msgID) {
    this._rfqService.getLeadMessageData(msgID).subscribe(
      result => {
        this.iLeadMessageDataViewModel = result;
        this.iLeadMessageDataViewModel.contactId = result['data'].contactId;
        this.phoneNo = result['data'].phoneNo;
        this.email = result['data'].email;
      }, error => {
        this._rfqService.handleError(error);
      }
    )
  }

  isBuyerMessage(messageObj) {
    return this.inputMsgObj.toCont === messageObj.fromCont;
  }
  isNextBuyerMessage(i) {
    return this.inputMsgObj.toCont === this.messageThreadList[i].fromCont;
  }

  getProfilePic(messageObj) {
    return this.defaultAwsPath + messageObj.companylogo;
  }

  markMessagesLoad() {
    this._rfqService.set(true, 'ismessageRead');
  }

  markMessagesAsRead() {
    debugger;
    this.messageThreadList.forEach(singleMessage => {
      if (!singleMessage.messageRead && singleMessage.toCont == this.loggedId) {
        this._rfqService.changeMessageStatus(singleMessage.messageId).subscribe(
          result => {
            if (result.result === true) {
              // console.log(result.errorMessage);
            } else {
              // console.log(result.errorMessage);
              this._toastr.error(result.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }
    });

  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  getDate(val) {
    if (val !== undefined && val !== null && val !== '') {
      if (moment(val).isValid()) {
        return moment(moment.utc(val).toDate()).format('MMM-DD-YYYY h:mm a');
      } else {
        return val;
      }
    } else {
      return '';
    }
  }


  sendReplyMessage() {
    // // debugger;
    if (this.messageToSend !== null && this.messageToSend.length > 0 && this.messageToSend.length <= 1000) {
      this.markMessagesLoad();
      this.sendMessageError = false;
      let supplierMessage: any;
      for (let i = 0; i < this.messageThreadList.length; i++) {
        if (!this.isBuyerMessage(this.messageThreadList[i])) {
          supplierMessage = this.messageThreadList[i];
          i = this.messageThreadList.length - 1;
        }
      }
      this.sendMessageObj.rfqId = supplierMessage.rfqId;
      this.sendMessageObj.messageTypeId = supplierMessage.messageTypeId;
      this.sendMessageObj.messageHierarchy = supplierMessage.messageId;
      this.sendMessageObj.messageSubject = supplierMessage.messageSubject;
      this.sendMessageObj.messageDescr = this.messageToSend;
      this.sendMessageObj.pageName = 'component\buyer\global-message-tab\component\message-thread\message-thread.component.ts';
      this.sendMessageObj.messageDate = moment.utc(new Date()).toDate();
      if (this.IsactiveBtn === 'sent') {
        if(this.messageThreadList[0].messageTypeId === 225 && supplierMessage.fromCont == null) {
          this.sendMessageObj.fromCont = this.iLeadMessageDataViewModel.contactId;
          this.sendMessageObj.toCont = supplierMessage.toCont;
          this.sendMessageObj.toContactIds = [supplierMessage.toCont];
        } else {
          this.sendMessageObj.fromCont = supplierMessage.fromCont;
          this.sendMessageObj.toCont = supplierMessage.toCont;
          this.sendMessageObj.toContactIds = [supplierMessage.toCont];
        }
      } else {
        if(this.messageThreadList[0].messageTypeId === 225 && supplierMessage.fromCont == null) {
          this.sendMessageObj.fromCont = supplierMessage.toCont;
          this.sendMessageObj.toCont = this.iLeadMessageDataViewModel.contactId;
          this.sendMessageObj.toContactIds = [this.iLeadMessageDataViewModel.contactId];
        } else {
          this.sendMessageObj.fromCont = supplierMessage.toCont;
          this.sendMessageObj.toCont = supplierMessage.fromCont;
          this.sendMessageObj.toContactIds = [supplierMessage.fromCont];
        }
      }
      localStorage.setItem('pagename', 'buyer\global-message-tab\component\message-thread\message-thread.component.ts');
      this._rfqService.sendMessages(this.sendMessageObj).subscribe(
        result => {

          if (result.result === true) {
            // console.log(result.errorMessage);
            this._toastr.success(result.errorMessage, '');

            this.getMessages(false);
            this.initSendMessageObj();
            this.messageToSend = '';
          } else {
            // console.log(result.errorMessage);
            this._toastr.warning(result.errorMessage, 'Warning!');
          }
          this._rfqService.set(false, 'showSidePanel');
          this._rfqService.set(false, 'messageThreadDrawer');
          this._rfqService.set(false, 'transferRfq');
          this._rfqService.set(false, 'messageRfq');
        },
        error => {
          this._rfqService.set(false, 'showSidePanel');
          this._rfqService.set(false, 'messageThreadDrawer');
          this._rfqService.set(false, 'transferRfq');
          this._rfqService.set(false, 'messageRfq');
          this._rfqService.handleError(error);
        },
        () => {}
      );
    } else {
      if (this.messageToSend === null || this.messageToSend.length === 0) {
        this.sendMessageError = true;
        this.resetSendMessageError();
      }
    }
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_MESSAGE_SENT);
  }

  resetSendMessageError() {
    setTimeout(() => {
      this.sendMessageError = false;
    }, 5000);
  }
  isReadFlagAllowed(i) {
    if (i === (this.messageThreadList.length - 1)) {
      return false;
    } else if (this.messageThreadList[i].messageRead && this.messageThreadList[i + 1].messageRead) {
      return true;
    } else {
      return false;
    }
  }
  removeSavedAttachFile(filename, index: any, messageId: number) {
    if (this.sendMessageObj.messageFileNames) {
      this.sendMessageObj.messageFileNames.splice(index, 1);
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
    if ((this.attachFilesUploader.queue.length + this.sendMessageObj.messageFileNames.length) > 10) {
      this._toastr.warning('Maximum 10 files can be attached!', 'Warning!');
      this.attachFilesUploader.queue = [];
      return;
    }
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          this.sendMessageObj.messageFileNames.push(
            fName
          );

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

  getFileUrl(fileUrl: string) {
    return this.defaultAwsPath + fileUrl;
  }

  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);

            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }
  downloadAllFiles(fileCompArray: string[]) {


    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    };
    this.temp = [];
    let data = JSON.stringify(fileCompArray);
    this.temp = JSON.parse(data);

    this.Downloadallfiles.filename = this.temp;

    this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response => {
      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    }, error => {

    })
  }
  getOriginalPartName(fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        return filenNameArray[0];
      }
      return filenNameArray[1];
    }
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
    this.messageThreadSubscription.unsubscribe();
  }

  upgradeClick() {
    this.isUpgradeBtn = true;
    this._rfqService.set(true, 'UpgradeReqFlag');
  }
  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if ((IsPremiumDecrypt === 'true') || (this.userType === 'Buyer')) {
      return true;
    } 
    return false;
  }
  isUserAccountType() {
    const type = localStorage.getItem('AccountType');
    if (type === 'Silver') {
      return true;
    } 
    return false;
  }

  openNdaModel(id) {
    this.msgId = id;
    this.showNdaModel = true;
  }
  closeNDAModelEvent(val) {
    if (val.accepted) {
      let index = this.messageThreadList.findIndex(x => x.messageId === this.msgId);
      if (index !== -1) {
        this.messageThreadList[index].isNdaRequired = false;
      }
    }
    this.showNdaModel = false;
  }
  openContactModal() {
    this.toShowContactModel = true;
  }

  getReceiverLogo(messageDetails) {
    if (messageDetails.toCont !== this.loggedId) {
      return messageDetails.toContactCompanylogo;
    } else {
      return messageDetails.companylogo;
    }
  }
  removeHtmlTag(content){
    return content.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, "");
   }
   getCommunityUrl(){
     let supplierCompanyId = this._rfqService.get('supplierCompanyId')
     this._masterService.getCommunityUrl(supplierCompanyId).subscribe(
       response=>{
         if(!response.result){
           this.communityUrl = response.communityCompanyProfileUrl;
           this.communityProfileUrl = response.profileDetailUrl;
         }
       }
     );
   }
}
