import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  qMSEmailMessagesViewModel
} from '../../../../../core/models/qmsModel';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  ToastrService
} from 'ngx-toastr';

@Component({
  selector: 'app-message-view-drawer',
  templateUrl: './message-view-drawer.component.html',
  styleUrls: ['./message-view-drawer.component.scss'],
  providers: [qMSEmailMessagesViewModel],
})
export class MessageViewDrawerComponent implements OnInit, OnDestroy {

  @Input() messageId: number;
  isFileDownloaded: number;
  constructor(public qmsEmailMessagesViewModel: qMSEmailMessagesViewModel,
    private _qmsService: QmsService, private _rfqService: RfqService,
    private _toastr: ToastrService) {
    this.isFileDownloaded = 0;
  }

  ngOnInit() {
    this.getQmsQuoteEmailMessageById();
  }
  /* This function is used to get the message by Id */
  getQmsQuoteEmailMessageById() {
    this._qmsService.getQmsQuoteEmailMessageById(this.messageId).subscribe(
      result => {
        if (!result.isError) {
          this.qmsEmailMessagesViewModel = result.data;
          // if (!this.qmsEmailMessagesViewModel.emailRead) {
          this.setReadUnreadMessage();
          // }
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
  /* This function is used to set the message as Read  */
  setReadUnreadMessage() {
    this.qmsEmailMessagesViewModel.emailRead = true;
    this._qmsService.setReadUnreadMessage(this.qmsEmailMessagesViewModel).subscribe(
      result => {
        if (!result.isError) {} else {
          // this.termsConditionViewModel = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  /* This function is used to download the all pdf file */
  downloadAllPDFFile(fileCompArray: string[], qmsQuoteName) {

    ++this.isFileDownloaded;

    let Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0,
      quote_Name: ''
    }
    let temp = [];
    fileCompArray.forEach(element => {
      temp.push(element['fileName']);
    });
    Downloadallfiles.filename = temp;
    Downloadallfiles.quote_Name = qmsQuoteName;
    this._rfqService.getDownloadAllFileURL(Downloadallfiles).subscribe(response => {

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

          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
        --this.isFileDownloaded;

      } else {
        --this.isFileDownloaded;
      }
    }, error => {
      --this.isFileDownloaded;
    })
  }
  /* This function is used to download the single pdf file */
  downloadS3File(fileName: string, isDownload: boolean) {
    ++this.isFileDownloaded;
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      --this.isFileDownloaded;
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        // this.downLoadFile(resData, this.type);
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
  /* This function is used to get the original file name */
  getOriginalFileName(fileName) {
    if (fileName !== null) {
      // debugger;
      const filenNameArray = fileName.split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }
  /* This function is used to close the message drawer */
  closeMessageDrawer() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
    this._rfqService.set(true, 'isMessageRead');
  }
  ngOnChanges(changes) {
    this.getQmsQuoteEmailMessageById();
  }
  /* This function is used to close the drawer when component is destroyed. */
  ngOnDestroy() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
  }
}
