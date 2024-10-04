import { Component, OnInit } from '@angular/core';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-part-library',
  templateUrl: './part-library.component.html',
  styleUrls: ['./part-library.component.scss'],
  providers: [ConfirmationService]
})
export class PartLibraryComponent implements OnInit {

   constructor(private _rfqService: RfqService, private _toastr: ToastrService,
      private confirmationService: ConfirmationService, private router: Router) {
      this._rfqService.set(false, 'showSidePanel');
   }
   ngOnInit() {

   }
   get loggedId() {
     // tslint:disable-next-line:radix
     return parseInt(localStorage.getItem('LoggedId'));
   }
   isSidePanel() {
     return this._rfqService.get('showSidePanel');
   }
  checkForPartEditCancelConfirm() {
    this._rfqService.set(true, 'confirmedToSave');
    this._rfqService.set(false, 'confirmedToCancel');
    // if (this._rfqService.get('partEditCancelConfirm') === true) {
    //   this._rfqService.set(false, 'partEditCancelConfirm');
    //   this.confirmationService.confirm({
    //     message: 'Would you like to save your part details?',
    //     header: 'Save Part Details',
    //     icon: 'pi pi-exclamation-triangle',
    //     accept: () => {
    //       this._rfqService.set(true, 'confirmedToSave');
    //       this._rfqService.set(false, 'confirmedToCancel');
    //     },
    //     reject: () => {
    //       this._rfqService.set(false, 'confirmedToSave');
    //       this._rfqService.set(true, 'confirmedToCancel');
    //     }
    //   });
    // }
  }
}
