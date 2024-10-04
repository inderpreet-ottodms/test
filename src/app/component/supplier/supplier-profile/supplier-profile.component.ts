import { Component, OnInit, ElementRef, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { IContactViewModel, ILanguageModel, ICompanyModel, IAddressModel } from '../../../core/models/accountModel';
import { ConfirmationService } from 'primeng/api';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.scss'],
  providers: [ConfirmationService]
})
export class SupplierProfileComponent implements OnInit {
  @ViewChild('capabilityTab',{static:false}) capabilityTab: ElementRef;
  @ViewChild('videoPlayer',{static:false}) videoplayer: ElementRef;
  @ViewChild('modal',{static:false}) modal: ElementRef;
  @ViewChild('synModal',{static:false}) synModal: TemplateRef<any>;
  tempModel: any;
  // Variable Declaration
  isAboutUsActive: boolean;
  isCabalitiesActive: boolean;
  isContactUsActive: boolean;
  isRatingActive: boolean;
  hederPath: string;
  isCencel: boolean;
  msgs: string;
  isVideo: boolean;
  supplierLogoPath: string;
  defaultAwsPath = '';
  iContactViewModel: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  prevPage = '';
  VideoUrl: string;
  is3DDelete: boolean;
  is3DDelete1: boolean;
  publishBtn = {
    isAbleToViewPublicProfile: false,
    isProfileApprovedByVision: false,
    isProfileComplete: false,
    isSubmittedForPublish: false
  };
  showNoPublishModel: boolean = false;
  showPublishModel: boolean = false;




  // Variable Declaration Ends
  constructor(private router: Router,private _SupplierService: SupplierService,
    private _toastr: ToastrService, private _RfqService: RfqService, private location: Location,
    private _profileService: ProfileService, private confirmationService: ConfirmationService, private modalService: NgbModal) {

    if (this._RfqService.get('dashboard')) {
      this.isAboutUsActive = false;
      this.isCabalitiesActive = false;
      this.isContactUsActive = false;
      this.isRatingActive = true;
      this._RfqService.set(false, 'dashboard');
    } else {
      this.isAboutUsActive = true;
      this.isCabalitiesActive = false;
      this.isContactUsActive = false;
      this.isRatingActive = false;
    }
    ;
    this.isVideo = false;
    this.closePartDrawer();
    this.hederPath = '';
    this.supplierLogoPath = 'assets/company/avatar-manu-basic.svg';
    this.initContactViewModel();
    this.is3DDelete = false;
    this.is3DDelete1 = false;
  }
  stopVideo() {
    this.isVideo = false;
    this.VideoUrl = '';
  }
  openVideo() {
    this.isVideo = true;
    this.VideoUrl = this._SupplierService.get('company_3dTourUrl');
  }
  getVideoUrl() {
    return this._SupplierService.get('is3dtour');
  }
  get ioggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  ngOnInit() {
    this.getSupplierPublishProfileStatus();
    this.getSupplierProfile();
    const isFromDash = this._RfqService.get('isfromDashboad');
    if (isFromDash === true) {
      const el: HTMLElement = this.capabilityTab.nativeElement as HTMLElement;
      el.click();
      this.openCapabilities();
    }
  }
  getSupplierPublishProfileStatus() {
    this._SupplierService.getSupplierPublishProfileStatus(this.ioggedCompanyId).subscribe(res => {
      if (res['isError'] == false) {
        this.publishBtn = res.data;
      }
    })
  }
  getMap() {
  }
  openAboutUs() {
    this.isAboutUsActive = true;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = false;
    this.closePartDrawer();
  }
  openCapabilities() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = true;
    this.isContactUsActive = false;
    this.isRatingActive = false;
    this.closePartDrawer();
  }
  proceedToLoadMap: boolean = false;
  openContactUs() {
    this.proceedToLoadMap = true;
    this.getMap();
    this._SupplierService.set(true, 'contactUsDrawerDataSaved');
    this.isAboutUsActive = false;
    this.isCabalitiesActive = false;
    this.isContactUsActive = true;
    this.isRatingActive = false;
    this.closePartDrawer();
  }
  openRatings() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = true;
    this.closePartDrawer();
  }

  closePartDrawer() {
    this._SupplierService.set(false, 'supplierSidePanel');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');

    this._SupplierService.set(false, 'companyEquipment');
    this._SupplierService.set(false, 'companyDescription');
    this._SupplierService.set(false, 'companyPhotos');
    this._SupplierService.set(false, 'companyDemographics');
    this._SupplierService.set(false, 'companyCertifications');
    this._SupplierService.set(false, 'companyFocus');
    this._SupplierService.set(false, 'companyGetInTouch');
    this._SupplierService.set(false, 'companyGetInTouch');
  }

  isSidePanel() {
    return this._SupplierService.get('supplierSidePanel');
  }
  isAboutUsEdit() {
    return this._SupplierService.get('aboutUsEdit');
  }

  isContactUsEdit() {
    return this._SupplierService.get('contactUsEdit');
  }
  isCapabilitiesEdit() {
    return this._SupplierService.get('capabilitiesEdit');
  }
  isRatingReply() {
    return this._SupplierService.get('ratingReply');
  }
  isHeaderEdit() {
    return this._SupplierService.get('headerEdit');
  }

  initContactViewModel() {
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactIdEncrypt: '',
      isLoginFromVision: false,
      comments: '',
      token: '',
      companyId: 0,
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      incotermId: 0,
      industry: '',
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: true,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: '',
      linkedIn: '',
      modifiedOn: '',
      password: '',
      phoneNo: '',
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: '',
      tweeter: '',
      userId: '',
      contactPictureFile: '',
      logoOfCompany: '',
      language: this.iLanguageModel,
      address: this.iAddressModel,
      company: this.iCompanyModel,
      isVarified: false,
      expiration: null,
      currentPassword: '',
      newPassword: '',
      isRFQCreated: false,
      grantType: '',
      refreshToken: '',
      googleImageUrl: '',
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      communityCompanyProfileUrl: '',
      profileDetailUrl: '',
      instagram: ''
    };
    this.iCompanyModel = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      _3dTourUrl: '',
      employeeCountRange: '',
      employeeCountRangeId: 1,
      errorMessage: '',
      isActive: true,
      name: '',
      companylogo: '',
      services: '',
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: '',
      supplierTypeId: 0
    };
    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      deptAddress: '',
      country: '',
      errorMessage: '',
      isActive: false,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true
    };
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  openSidePanel(page) {
    this._SupplierService.set(true, 'supplierSidePanel');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');
    this._SupplierService.set(false, 'ratingReply');
    this._SupplierService.set(true, 'headerEdit');
    this._SupplierService.set(false, 'headerUpdated');
    if (this.prevPage === 'companyPhotos') {
      this._SupplierService.set(true, 'companyPhotosClosedFromInside');
      this.prevPage = '';
    }
    this._SupplierService.set(false, 'companyEquipment');
    this._SupplierService.set(false, 'companyDescription');
    this._SupplierService.set(false, 'companyPhotos');
    this._SupplierService.set(false, 'companyDemographics');
    this._SupplierService.set(false, 'companyCertifications');
    this._SupplierService.set(false, 'companyCatagories');
    this._SupplierService.set(false, 'companyFocus');
    this._SupplierService.set(false, 'companyGetInTouch');
  }
  isHeaderUpdated() {
    if (this._SupplierService.get('headerUpdated') === true) {
      this._SupplierService.set(false, 'headerUpdated');
      this.getSupplierProfileOriginal();
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  getSupplierProfileOriginal() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
          this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
        }
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          this.supplierLogoPath = '';
          this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
          if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
            localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
          }
        }
        const isFromDash = this._RfqService.get('isfromDashboad');
        if (isFromDash === true) {
          const el: HTMLElement = this.capabilityTab.nativeElement as HTMLElement;
          el.click();
          this.openCapabilities();
        }
      },
      error => {
        this._RfqService.handleError(error);
      },
      () => { }
    );
  }

  getSupplierProfile() {
    ;
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));

    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
          this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
        }
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          this.supplierLogoPath = '';
          this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
          if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
            localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
          }
        }
        const isFromDash = this._RfqService.get('isfromDashboad');
        if (isFromDash === true) {
          const el: HTMLElement = this.capabilityTab.nativeElement as HTMLElement;
          el.click();
          this.openCapabilities();
        }
      },
      error => {
        this._RfqService.handleError(error);
      },
      () => { }
    );
  }

  openEditHeaderWarning() {
    this.isCencel = this._SupplierService.get('editHeaderCancelWarning');
    if (this.isCencel === true) {
      this.closeEditHeader();
    }
  }

  open3DDeleteWarning() {
    this.is3DDelete = this._SupplierService.get('is3DDelete');
    if (this.is3DDelete === true) {
      this.is3DDeleteHeader();
    }
  }
  open3DDeleteWarning1() {
    this.is3DDelete1 = this._SupplierService.get('is3DDelete1');
    if (this.is3DDelete1 === true) {
      this.is3DDeleteHeader1();
    }
  }
  closeHeaderDrawer() {
    this._SupplierService.set(false, 'supplierSidePanel');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');
    this._SupplierService.set(false, 'headerEdit');

    this._SupplierService.set(false, 'companyEquipment');
    this._SupplierService.set(false, 'companyDescription');
    this._SupplierService.set(false, 'companyPhotos');
    this._SupplierService.set(false, 'companyDemographics');
    this._SupplierService.set(false, 'companyCertifications');
    this._SupplierService.set(false, 'companyFocus');
    this._SupplierService.set(false, 'companyGetInTouch');
    this._SupplierService.set(false, 'companyGetInTouch');
    this._SupplierService.set(false, 'editHeaderCancelWarning');
  }

  closeEditHeader() {
    this.confirmationService.confirm({
      message: 'You have unsaved information. Are you sure you want to Cancel?',
      header: 'Cancel Changes',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        this.closeHeaderDrawer();
      },
      reject: () => {
        this.msgs = 'false';
        this._SupplierService.set(false, 'editHeaderCancelWarning');
      }
    });
  }

  is3DDeleteHeader() {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this 3D tour?',
      header: 'Delete 3D Tour',
      icon: null,
      accept: () => {
        this._RfqService.set3DtourDelete(true);
        this.openSynModal(true);
      },
      reject: () => {
        this._SupplierService.set(false, 'is3DDelete');
      }
    });
  }

  is3DDeleteHeader1() {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this Video Link?',
      header: 'Delete Video Link',
      icon: null,
      accept: () => {
        this._RfqService.set3DtourDelete1(true);
        this.openSynModal(true);
      },
      reject: () => {
        this._SupplierService.set(false, 'is3DDelete1');
      }
    });
  }

  publicView() {
    localStorage.setItem('ViewSupplierProfileId', this.iContactViewModel.contactId.toString());
    localStorage.setItem('ViewSupplierProfileName', this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName);
    // window.open('#/Public/profile/' + localStorage.getItem('publicCompanyUrl'), '_blank');

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/source'], { queryParams: {page: this.iContactViewModel.profileDetailUrl }})
    );
     
    window.open("#"+ url, '_blank');
    
    //window.open(this.iContactViewModel.communityCompanyProfileUrl, '_blank');
  }

  viewMyFacilities() {
    window.open('https://www.w3schools.com/html/mov_bbb.mp4', '_blank');
  }

  isPremium() {
    return this._profileService.getAccountType();
  }
  openSynModal(evt) {
    console.log('openModel')
    let isModelOpened = localStorage.getItem('_ccprofile');
    if ((isModelOpened == undefined || isModelOpened == null || isModelOpened == '') && this.publishBtn.isProfileApprovedByVision ) {
      localStorage.setItem('_ccprofile', 'set');
      this.tempModel = this.modalService.open(this.synModal, {
        backdrop: 'static',
      });
    }


  }
  publishProfileModel() {
    this.showPublishModel = true;
  }
  showNoPublishModelChange(val) {
    if (val) {
      this.showNoPublishModel = true;
    }
    this.showPublishModel = false;
  }
  showPublishModelChange(val) {
    if (val) {
      this.showPublishModel = true;
    }
    this.showNoPublishModel = false;
  }
}
