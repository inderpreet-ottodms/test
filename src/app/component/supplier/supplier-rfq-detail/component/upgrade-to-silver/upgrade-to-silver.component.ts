import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IMyAccountViewModel } from '../../../../../core/models/supplierProfileModel';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-upgrade-to-silver',
  templateUrl: './upgrade-to-silver.component.html',
  styleUrls: ['./upgrade-to-silver.component.scss']
})
export class UpgradeToSilverComponent implements OnInit {
  iMyAccountViewModel: IMyAccountViewModel;
  @ViewChild('contentNewforSilver',{static:false}) upgradeToSilverModel: TemplateRef<any>;
  @Input() RfqId: number;
  @Output() modalCloseEvent = new EventEmitter();
  @Output() contactSaleModel = new EventEmitter();
  showSilverModel: any;
  isLoader: boolean;
  isUpgradeBtn: boolean;
  constructor(private modalService: NgbModal, private _SupplierService: SupplierService, private router: Router, private _toastr: ToastrService) { }

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
      pageName: 'Page Title',
      rfqId: 0,
      toAlternateEmailId: ''
    };
    this.isLoader = true;
    this.isUpgradeBtn = false;
    this.openModal();
  }
  /**
   * Opens modal
   * This function is used to open upgrade silver modal
   */
  openModal() {
    this.showSilverModel = this.modalService.open(this.upgradeToSilverModel, {
      backdrop: 'static',
    });
    this.isLoader = false;
  }
  /**
 * Closes upgrade modal
 * This function is used to close the upgrade modal
 */
  closeUpgradeModal() {
    this.modalCloseEvent.emit(false);
  }
  /**
 * Upgrades account
 * called when click on Upgrade Now button to upgrade the account
 */
  upgradeAccount() {
    this.isLoader = true;
    this.isUpgradeBtn = true;
    this.setSupplierUpgraderequest();
  }
  /**
  * Gets logged id
  * @returns logged in user id
  */
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  /**
   * Gets logged company id
   *  * @returns logged in encrypted user id
   */
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  isShowOneTile() {
    return this._SupplierService.set(true, 'isShowOneTile');
  }
  setSupplierUpgraderequest() {
    this.isShowOneTile();
    this.iMyAccountViewModel.contactId = this.loggedId;
    this.iMyAccountViewModel.companyId = this.loggedCompanyId;
    this.iMyAccountViewModel.rfqId = this.RfqId;
    this.iMyAccountViewModel.accountType = 'Silver';
    if (this.isUpgradeBtn) {
      this.iMyAccountViewModel.istrail = false;
    }
    this._SupplierService.setSupplierUpgraderequest(this.iMyAccountViewModel).subscribe(
      result => {
        if (result['result'] === true) {
          if (this.isUpgradeBtn) {
            this.iMyAccountViewModel = result.data;
            this.isUpgradeBtn = false;
            this.router.navigate(['upgradeThankYou']);
            this.showSilverModel.close();
            this.isLoader = false;
          } else {

            this._toastr.success('status updated successfully', '');
            this.isLoader = false;
          }
        } else {
          this.showSilverModel.close();
          this.isLoader = false;
        }
      },
      error => {
        this.showSilverModel.close();
      },
      () => { }
    );
  }
}
