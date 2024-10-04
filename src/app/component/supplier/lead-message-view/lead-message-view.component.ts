import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Subscription
} from 'rxjs';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  MasterService
} from '../../../core/services/master/master.service';


@Component({
  selector: 'app-lead-message-view',
  templateUrl: './lead-message-view.component.html',
  styleUrls: ['./lead-message-view.component.scss']
})
export class LeadMessageViewComponent implements OnInit, OnDestroy {

  isLoader: boolean = false;
  messageDetails: any;
  userAccount: string;
  showNdaModel: boolean;
  leadMsgSubscription: Subscription;
  msgId: number = null;
  toShowContactModel:boolean=false
  constructor(private _rfqService: RfqService, private masterService: MasterService, private _toastr: ToastrService) { }

  ngOnInit() {
    this.messageDetails = {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phoneNo: null,
      emailSubject: '',
      emailMessage: '',
      isNdaRequired: false,
      isNdaAccepted: false,
      messageFileNames: [],
      messageId: 0,
    };
    this.userAccount = localStorage.getItem('AccountType');
    this.getLeadMessageDetails();
  }
  getLeadMessageDetails() {
    this.messageDetails = {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phoneNo: null,
      emailSubject: '',
      emailMessage: '',
      isNdaRequired: false,
      isNdaAccepted: false,
      messageFileNames: [],
      messageId: 0
    };
    let leadStreamId = this._rfqService.get('leadStreamId');
    this.isLoader = true;
    this.leadMsgSubscription = this.masterService.getLeadStreamMessage(leadStreamId).subscribe(response => {
      console.log(response);
      // debugger;
      if (!response.isError) {
        this.messageDetails = response.data;
      } else {
        this._toastr.error(response.message, 'Error!');
      }
      this.isLoader = false;
    });
  }
  closePartDrawer() {
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(false, 'isBuyerMessageView');
    this._rfqService.set('', 'selectContactIdsForMEessage');
    this._rfqService.set('', 'selectContactRFQId');
    this._rfqService.set('', 'selectedCompanyId');
    this._rfqService.set('', 'nameOfBuyer');
    this._rfqService.set(0, 'rfqId');
  }
  checkMessageChange() {
    if (this._rfqService.get('showLeadMessage') == true) {
      this._rfqService.set(false, 'showLeadMessage');
      this.getLeadMessageDetails();
    }
  }
  openNdaModel() {
    this.msgId = this.messageDetails.messageId;
    this.showNdaModel = true;
  }
  closeNDAModelEvent(val) {
    if (val.accepted) {
      this.messageDetails.isNdaRequired = false;
    }
    this.showNdaModel = false;
  }
  downloadAllFiles(fileCompArray: string[]) {

    let downloadAllFiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    };
    let temp = [];
    let data = JSON.stringify(fileCompArray);
    temp = JSON.parse(data);

    downloadAllFiles.filename = temp;

    this._rfqService.getDownloadAllFileURL(downloadAllFiles).subscribe(response => {
      // console.log('data' , privateFileFileName);
      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
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
  ngOnDestroy() {
    this.leadMsgSubscription.unsubscribe();
  }
  openContactModal() {
    this.toShowContactModel=true;
  }
}
