import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  ElementRef
} from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  IMyAccountViewModel
} from '../../core/models/supplierProfileModel';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';
import {
  ToastrService
} from 'ngx-toastr';
import { Router } from '@angular/router';

import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { IpService } from '../../../app/v2/shared/ip.service';

@Component({
  selector: 'app-upgrade-account',
  templateUrl: './upgrade-account.component.html',
  styleUrls: ['./upgrade-account.component.scss']
})
export class UpgradeAccountComponent implements OnInit, OnDestroy {

  @Input() quoteRFQ: boolean;
  @Input() RfqId: number;
  @Input() isCustomer: boolean;
  @ViewChild('contentNew', { static: true }) editModal: TemplateRef<any>;
  @ViewChild('contentUnlockModel', { static: true }) editUnlockModal: TemplateRef<any>;
  @ViewChild('upgradeAccountModel', { static: true }) upgradeAccountModel: TemplateRef<any>;

  tempModel: any;
  tempUnlockModel: any;
  isLoader: boolean;
  accountType: string;

  @Output() modalCloseEvent = new EventEmitter();

  @Output() contactSaleModel = new EventEmitter();

  iMyAccountViewModel: IMyAccountViewModel;
  isAccountUpgradereqSent: boolean;
  isUpgradeBtn: boolean;
  accountUpgradeMessage: string;
  tempAccountModel: any;

  toShowContactModel: any;
  ipAddress: string;
  browser: string;
  os: string;
  href: any;
  _rfqService: any;
  constructor(private modalService: NgbModal, private router: Router, private http: HttpClient,
    private _SupplierService: SupplierService, private ipService: IpService,
    private _toastr: ToastrService) {
  }
  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }
  ngOnInit() {

    this.browser = window.navigator.userAgent;
    this.os = window.navigator.appVersion
    this.href = this.router.url;
    this.getIpAddress();

    this.accountType = localStorage.getItem('AccountType');
    this.toShowContactModel = false;

    this.accountUpgradeMessage = '';
    this.isUpgradeBtn = false;
    this.isAccountUpgradereqSent = false;
    this.isLoader = true;
    this.openModal();
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
  }
  openModal() {

    if (this.accountType == 'Growth Package') {
      this.tempUnlockModel = this.modalService.open(this.editUnlockModal, {
        backdrop: 'static',
        windowClass: "upgradeTemplate"
      });
      this.isLoader = false;

    } else {
      this.tempModel = this.modalService.open(this.editModal, {
        backdrop: 'static',
        windowClass: "upgradeTemplate"
      });

      this.isLoader = false;
    }
  }

  openAccountModal() {
    this.tempAccountModel = this.modalService.open(this.upgradeAccountModel, {
      backdrop: 'static',
    });
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

  /**
   * Closes upgrade modal
   * This function is used to close the upgrade modal
   */
  closeUpgradeModal() {
    this.modalCloseEvent.emit(false);
    this.mixPanelTracking("learnMoreClosed")
  }
  /**
   * Upgrades account
   * Called when click on Upgrade Now button to upgrade the account
   */
  upgradeAccount() {
    this.isLoader = true;
    this.isUpgradeBtn = true;
    // this.openAccountModal();
    this.setSupplierUpgraderequest();
  }
  isShowOneTile() {

    return this._SupplierService.set(false, 'isShowOneTile');
  }
  setSupplierUpgraderequest() {
    this.isShowOneTile();
    this.iMyAccountViewModel.contactId = this.loggedId;
    this.iMyAccountViewModel.companyId = this.loggedCompanyId;
    this.iMyAccountViewModel.rfqId = this.RfqId;
    this.iMyAccountViewModel.accountType = 'Gold';
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
            if (this.accountType == 'Growth Package') {
              this.tempUnlockModel.close()
            } else {
              this.tempModel.close();
            }
            // for now we are not showing that upgrade msg or open thank you model so for now disabled this functionality
            // this.accountUpgradeMessage = this.iMyAccountViewModel.errorMessage;
            //this.openAccountModal();

            this.isLoader = false;
          } else {
            // this.router.navigate(['upgradeThankYou']);
            this._toastr.success('status updated successfully', '');
            this.isLoader = false;
          }
        } else {
          if (this.accountType == 'Growth Package') {
            this.tempUnlockModel.close()
          } else {
            this.tempModel.close();
          }
          this.accountUpgradeMessage = result['errorMessage'];
          this.openAccountModal();

          this.isLoader = false;
          // this._toastr.error(result['errorMessage'], 'Error!');
        }
      },
      error => {

        if (this.accountType == 'Growth Package') {
          this.tempUnlockModel.close()
        } else {

          this.tempModel.close();
        }
        this.accountUpgradeMessage = 'You are already a premium member';
        this.isAccountUpgradereqSent = true;
        this.isLoader = false;
      },

      () => { }

    );
  }

  /**
   * Closes account upgrade pop up
   * Is used to close the second upgrade modal
   */
  closeAccountUpgradePopUp() {
    // this.isAccountUpgradereqSent = false;
    this.tempAccountModel.close();
    this.modalCloseEvent.emit(false);
  }
  ngOnDestroy() {
    // this.toShowContactModel = false;
    this.modalCloseEvent.emit(false);
  }
  openContactModal() {
    this.isLoader = true;
    this.tempModel.close();
    this.contactSaleModel.emit(true);
    this.isLoader = false;

  }

  mixPanelTracking(ev) {
    const submitModel = JSON.parse(localStorage.getItem("iContactViewModel"));
    var reqData = {
      "email": localStorage.getItem("User2"),
      "event": ev,
      "host": environment.AppUrl,
      "path": this.href,
      "ip": this.ipAddress,
      "browser": this.browser,
      "os": this.os,
      "supplierName": submitModel.firstName + " " + submitModel.lastName,
    }
    this._rfqService.mixPanelStarter(reqData).subscribe((result: any) => {
      console.log(result);
    });
  }

}
