import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, SimpleChange, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IContactViewModel } from '../../../../core/models/accountModel';
import { AccountService } from '../../../../core/services/account/account.service';
import { ProfileService } from '../../../../core/services/profile/profile.service';

@Component({
  selector: 'app-user-management-drawer',
  templateUrl: './user-management-drawer.component.html',
  styleUrls: ['./user-management-drawer.component.scss']
})
export class UserManagementDrawerComponent implements OnInit {
  @Input('userDetails') userDetails;
  @Output() changeCloseDrawer = new EventEmitter<boolean>();
  isLoader: boolean = false;
  currentUserId: number = null;
  iContactViewModel: IContactViewModel;
  @ViewChild('content',{static: true}) errorCSVModal: TemplateRef < any > ;
  modalReference:any;
  anyChanges: boolean = false;
  @Output() closeDrawer = new EventEmitter();
  visionRoleList = [];

  constructor(private _toastr: ToastrService,private modalService: NgbModal, private _accountService: AccountService, private _profileService: ProfileService) { }

  ngOnInit() {
    // this.getVisionRoleList();
    this.currentUserId = this.loggedId;
    // this.getUserDetails();
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const userId: SimpleChange = changes.userId;
    if (userId.previousValue != undefined && (userId.previousValue != userId.currentValue)) {
      this.ngOnInit();
    }
  }
  getVisionRoleList() {
    this._accountService.getVisionRoleList().subscribe(
      response => {
        if (!response.isError) {
          this.visionRoleList = response.data.filter(x=> x.name == 'User' || x.name == 'Admin');
        }
      }, error => {
        this._toastr.warning('Something when wrong please try later.', 'Warning!');
      }
    );
  }
  getUserDetails(){
    this.isLoader = true;
    this._profileService.getProfileDetails(this.userDetails,0).subscribe(
      response => {
        this.iContactViewModel = response;
        this.isLoader = false;
      },
      error => {
        this._toastr.warning('Something when wrong please try later.', 'Warning!');
        this.isLoader = false;
      }
    );
  }

  openModal() {
    // this.modalService.open(this.editModal);
    this.modalReference = this.modalService.open(this.errorCSVModal, {
      backdrop: 'static'
    });
  }

  closeModel() {
    this.modalReference.close();
  }

  closePartDrawer(){
    // this.closeDrawer.emit(this.anyChanges);
    this.changeCloseDrawer.emit(this.anyChanges);
  }
  setUserStatus(status){
    this._accountService.activeDeactiveUser(this.userDetails.contactId, status).subscribe(
      result => {
        if (result['result'] === true) {
          this._toastr.success(result['errorMessage'], 'Success!');
          this.userDetails.isActive = status;
          // this.getUserDetails();
          this.anyChanges = true;
        } else {
          this._toastr.error(result['errorMessage'], 'Error!');
        }
        this.closeModel();
      },
      error => {
        this.closeModel();
        // this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  updateRole(userId, roleId, isBuyer){
    if (roleId !== '' && userId != 0) {
      if(roleId === 'User'){
        roleId = false;
      }else{
        roleId = true;
      }
      this._accountService.setUserRole(userId, roleId,isBuyer).subscribe(
        response => {
          if (!response.isError) {
            this._toastr.success('User role updated successfully', 'Success!');
            this.anyChanges = true;
          } else {
            // this.iContactViewModel.isAdmin = JSON.parse(previousRole);
            // this.getUserDetails();
            this._toastr.error(response.messages, 'Error!');
          }
        },
        error => {
          // this.iContactViewModel.isAdmin = JSON.parse(previousRole);
          // this.getUserDetails();
          this._toastr.warning('Something when wrong please try later.', 'Warning!');
        }
      );
    }
  }
}
