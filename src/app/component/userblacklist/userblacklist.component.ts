import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  IFollowContactViewModel
} from '../../core/models/settingsModel';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { appConstants } from '../../core/config/constant';

@Component({
  selector: 'app-userblacklist',
  templateUrl: './userblacklist.component.html',
  styleUrls: ['./userblacklist.component.scss']
})
export class UserblacklistComponent implements OnInit {
  iFollowContactViewModel: IFollowContactViewModel;
  isBlacklist: boolean;
  modalReference: any;
  constructor(private _SupplierService: SupplierService, private modalService: NgbModal,
    private _rfqService: RfqService, private _toastr: ToastrService, ) {}
  @Input() companyId: any;
  @Input() blackList: any;
  @ViewChild('content',{static:false}) errorCSVModal: TemplateRef < any > ;
  ngOnInit() {
    this.isBlacklist = this.blackList;
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      result: true,
      rfqId: 0,
      isFollow: null,
      bookType: ''
    };
  }
  openModal() {
    // this.modalService.open(this.editModal);
    this.modalReference = this.modalService.open(this.errorCSVModal, {
      backdrop: 'static'
    });
  }
  closeErrorCSVModel() {
    this.modalReference.close();
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedContactId() {
    // tslint:disable-next-line:radix
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
    // return parseInt(localStorage.getItem('LoggedId'));
  }
  setBlacklist() {

    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = this.companyId;
    this.iFollowContactViewModel.bookType = appConstants.blacklistedBookType;
    this.iFollowContactViewModel.isFollow = true;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          // console.log( result.errorMessage );
          this.isBlacklist = true;
          this.closeErrorCSVModel();
        }
      },
      error => {
        this.closeErrorCSVModel();
        this._rfqService.handleError(error);
      }
    );

  }

  removeBlacklistUser() {

    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = this.companyId;
    this.iFollowContactViewModel.bookType = appConstants.blacklistedBookType;
    this.iFollowContactViewModel.isFollow = false;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          this.isBlacklist = false;
          // console.log( result.errorMessage );
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );

  }
}
