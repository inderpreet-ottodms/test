import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  AngularMultiSelectModule
} from 'angular2-multiselect-dropdown';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  RFQMessageAssociationViewModel
} from '../../core/models/rfqModel';
import {
  ToastrService
} from 'ngx-toastr';
@Component({
  selector: 'app-multiselect-rfqs',
  templateUrl: './multiselect-rfqs.component.html',
  styleUrls: ['./multiselect-rfqs.component.scss'],
  providers: [AngularMultiSelectModule]
})
export class MultiselectRfqsComponent implements OnInit {
  rfqSettings = {};
  RfqList: any = [];
  selectedItems = [];
  rfqMessageAssociationViewModel = new RFQMessageAssociationViewModel;
  @ViewChild('rfqContainer', {static: true}) rfqContainer: ElementRef;
  @Input() messageId: number;
  @Input() formToContactId: number;
  @Output() moveRfqEventHandler = new EventEmitter < any > ();
  constructor(private _rfqService: RfqService, private _toastr: ToastrService) {

  }

  ngOnInit() {

    this.getRFQList();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  ngOnChange() {
    this.selectedItems = [];
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
      maxHeight: 150,
      showCheckbox: true,
      enableCheckAll: false,
    };
    this._rfqService.getRFQList(this.loggedId,this.formToContactId).subscribe(
      result => {
        if (!result.isError) {
          this.RfqList = result.data;
        } else {
          this.RfqList = [];
        }
      },
      error => {
        this._rfqService.handleError(error);

      },
      () => {}
    );

  }

  // this function is used to de select rfq from the selected list
  onRfqDeSelect(item: any) {
    const index: number = this.rfqMessageAssociationViewModel.rfqIds.indexOf(item.rfqId);
    if (index !== -1) {
      this.rfqMessageAssociationViewModel.rfqIds.splice(index, 1);
    }

  }

  // this function is used to select rfq from the rfq list
  onRfqSelect(item: any) {
    this.rfqMessageAssociationViewModel.rfqIds.push(item.rfqId);

  }
  close() {
    this.selectedItems = [];
    this.rfqMessageAssociationViewModel.rfqIds = [];
    this.rfqContainer.nativeElement.click();
    this.moveRfqEventHandler.emit(false);
  }

  // this function is used to copy the rfq message
  onCopyRfq() {
    this.rfqMessageAssociationViewModel.messageId = this.messageId;
    this._rfqService.copyRfqMessage(this.rfqMessageAssociationViewModel).subscribe(res => {
      if (!res.isError) {
        this._toastr.success('Rfq message move to successfully!', 'Success!');
        this.moveRfqEventHandler.emit(true);
        this.rfqContainer.nativeElement.click();
      }
    });

  }
}
