import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rfg-insight-filter',
  templateUrl: './rfg-insight-filter.component.html',
  styleUrls: ['./rfg-insight-filter.component.scss']
})
export class RfgInsightFilterComponent implements OnInit {

  selectedBox: number;
  @Input('rfqId') rfqId: number;
  @Output() selectedFilter = new EventEmitter();
  rfqFilterObjectArray: any[] = [];
  rfqFilter: string[];
  constructor(private _rfqService: RfqService,  private _toastr: ToastrService) { }

  ngOnInit() {
    this.selectedBox = 0;
    this.rfqFilterObjectArray = [];
    this.getRfqFilterList();
  }
  getRfqFilterList() {
    this._rfqService.getRfqFilterList(this.rfqId).subscribe(
      response =>{
        if( !response.isError ){
          this.rfqFilterObjectArray = response.data;
        } else {
          this._toastr.error( response.messages, 'Error!' );
        }
      }
    );
  }
  setStatus(isActiveId, stateFilterValue) {
    // debugger;
    this.selectedBox = isActiveId;
    (stateFilterValue === 'All')? stateFilterValue = '': null;
    this.selectedFilter.emit(stateFilterValue);
  }

}
