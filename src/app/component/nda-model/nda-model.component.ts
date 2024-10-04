import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';
import {
  ToastrService
} from 'ngx-toastr';

@Component({
  selector: 'app-nda-model',
  templateUrl: './nda-model.component.html',
  styleUrls: ['./nda-model.component.scss']
})
export class NdaModelComponent implements OnInit, OnDestroy {
  @Input() msgId: number;
  @Output() modalCloseEvent = new EventEmitter();
  @ViewChild('ndaModel',{static: true}) ndaModel: TemplateRef < any > ;
  tempAccountModel: any;

  ndaContent: string = "<p>All data and attachments related to this message are the property of the BUYER. The BUYER is the person or company that created and posted this information. The information in this document is furnished to enable preparation of quotes, engineering review, evaluation, design, quality control and/or receiving inspection only, and represents proprietary information of the BUYER and shall be restricted to those persons having a need to know and neither it nor this document shall be used or disclosed in whole or in part, for any other purpose, without the written permission of the BUYER.<br><br> By clicking the ACCEPT button below, you are digitally agreeing and acceptance to this Non-Disclosure Agreement.</p>";

  isNDAContent: boolean;
  isNDAFile: boolean;

  constructor(private modalService: NgbModal, private _supplierService: SupplierService, private _toastr: ToastrService) {}

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  ngOnInit() {
    this.isNDAContent = false;
    this.isNDAFile = false;
    this.openModal();
  }
  openModal() {
    this.tempAccountModel = this.modalService.open(this.ndaModel, {
      backdrop: 'static',
    });
  }
  onClickNda() {
    this.isNDAContent = !this.isNDAContent;
    this.isNDAFile = true;
  }
  closeAccountUpgradePopUp(accepted) {
    if (this.isNDAFile === false && accepted) {
      this._toastr.warning('Please go through NDA document', 'Warning!');
    } else {
      this.tempAccountModel.close();
      if(accepted){
        this.setAcceptNda();
      }
      this.modalCloseEvent.emit({
        close: true,
        accepted: accepted
      });
    }
  }
  setAcceptNda() {
    let tempObj ={
      messageId: this.msgId,
      isNDAAccepted: true,
      result:false,
      errorMessage:''
    }
    this._supplierService.setNdaAccept(tempObj).subscribe(
      response => {
        console.log(response);
      }
    );
  }
  ngOnDestroy() {
    this.modalCloseEvent.emit({
      close: true,
      accepted: false
    });
  }

}
