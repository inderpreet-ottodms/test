import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {
  ApiService
} from '../../../../__Services/api-service/api.service';

@Component({
  selector: 'app-qmscontact-info-viewer',
  templateUrl: './qmscontact-info-viewer.component.html',
  styleUrls: ['./qmscontact-info-viewer.component.scss'],
  providers: [ApiService]
})
export class QmscontactInfoViewerComponent implements OnInit, AfterViewInit {
  private _contactId: number;
  @Input()
  get contactId(): number {
    return this._contactId;
  }
  @Output() contactIdChange = new EventEmitter();
  set contactId(value) {
    this._contactId = value;
    this.contactIdChange.emit(this._contactId);
    // this.ngAfterViewInit();
  }
  @Output() companyName = new EventEmitter < string > ();

  constructor(private rest: ApiService) {}

  contactInfo: any;
  // this function is remove because it get  call every time with undefined value.

  ngAfterViewInit(): void {

    // this.rest.get('/QMS/GetMQSDetailsById?MqsContactIdEncrypt='
    //                     + this.contactId)
    // .subscribe(
    // (response: { data: any, isError:boolean, message:any, totalRecords?:number }) => {
    //     if(!response.isError) {
    //         this.contactInfo = response.data;
    //         this.companyName.emit(this.contactInfo.company);
    //     }
    // });
  }
  ngOnChanges(changes: SimpleChanges) {
    const contactEncryptId: SimpleChange = changes.contactId;
    if (contactEncryptId.currentValue != undefined && contactEncryptId.currentValue != null) {
      this.rest.get('/QMS/GetMQSDetailsById?MqsContactIdEncrypt=' +
          this.contactId)
        .subscribe(
          (response: {
            data: any,
            isError: boolean,
            message: any,
            totalRecords ? : number
          }) => {
            if (!response.isError) {
              this.contactInfo = response.data;
              this.companyName.emit(this.contactInfo.company);
            }
          });
    }
  }


  ngOnInit() {

  }

}
