import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import {
  FileUploader
} from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { uploadFileNDA } from '../../../../constants/url-constant';
import {
  environment
} from '../../../../environments/environment';
import { IContactViewModel, IRfqBuyerStatus } from '../../../core/models/accountModel';
import { IBuyerCompanyTypeViewModel, IBuyerIndustryModalAnswers, IIndustryBranchesModel } from '../../../core/models/globalMaster';
import { ICustomProcessViewModel, IPartsViewModel, IRFQViewModel, IUploaadedFileName, IUploaadedFileNameList } from '../../../core/models/rfqModel';
import { BuyerService } from '../../../core/services/buyer/buyer.service';
import { MasterService } from '../../../core/services/master/master.service';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { appConstants } from './../../../core/config/constant';
import { ProductAnalyticService } from '../../../../app/shared/product-analytic/product-analytic';
declare const window;
const URL = '';
@Component({
  selector: 'app-buyer-engagement-flow',
  templateUrl: './buyer-engagement-flow.component.html',
  styleUrls: ['./buyer-engagement-flow.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})

export class BuyerEngagementFlowComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  standardNDAText: string;
  CustomNdaFileName: string;
  iPartUploadedFileNameList: IUploaadedFileNameList;
  iPartUploadedFileName: IUploaadedFileName;
  isSidePanel: boolean;
  isViewStandardNdaClicked: boolean;
  showCustomNdaDiv: boolean;
  activeTabNdaVerbiage: number = 1;
  activeTab = 1;
  defaultNdaMessage: string;
  irfqViewModel: IRFQViewModel;
  isNdaClicked: boolean;

  isUploadFileDropped = false;
  isUploadFileBrowsed = false;
  checkFile = true;
  fileDropName: string;
  fileBrowseName: string;
  customNDAFile: string;

  partFileDownloadLink: string;
  isPartClicked: boolean;
  isPartsLibrarayClicked: boolean;
  dispalyIndividualGrps: boolean;
  addShippingform: boolean;
  addGenAttachementDiv: boolean;
  addressList: boolean;
  @ViewChild('file',{static:false}) file;
  setInputUpload = false;
  isFileNotPDF = false;

  companyProfileStep1: boolean = true;
  companyProfileStep2: boolean = false;
  companyProfileStep3: boolean = false;
  profileUploadLogoError = '';
  buyerTypeViewModel: IIndustryBranchesModel[];
  iRfqBuyerStatus: IRfqBuyerStatus;
  typeId: any = '0';
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  selectedProcessItems = [];

  answers: string;
  ibuyerIndustryModalAnswers: IBuyerIndustryModalAnswers;
  iBuyerCompanyTypeViewModel: IBuyerCompanyTypeViewModel;
  iContactViewModel: any
  droppedFile;
  isSaveNda: boolean = false;
  uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  partDetailUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'partfiles',
  });

  ndaUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  hasBaseDropZoneOver = false;
  selectedIndustry1: number;
  isFileUpladed: boolean;
  supplierLogoPath = '';

  profileLogoUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  websiteUrl: any;
  cmpDescription: any;
  step2: string = "option1";
  isVisibleStep2: boolean;
  isVisibleStep4: boolean;
  cmpPrStep2ButtonDisable: boolean = true;
  toShowContactModel: boolean = false;
  isHelpDrawingText:string = 'Yes';
  willDoLaterPath: boolean= false;
  isPartFileSelectedinFlowOrNot: boolean = true;
  iContactViewModel1: IContactViewModel;
  defaultAwsPath = '';
  createSelectedArrayList: any[] = [];
  updatedField: any[] = [];
  processErrorIndustry: boolean = false;
  processErrorManufacturingprocess: boolean = false;
  isFileDropped: boolean;
  isdisable: boolean = false;
  isWillDolaterdisable: boolean = false;
  startedStepId: any;
  firstRadioData: any;
  secondRadioData: any;
  partUploadedFileName: any;
  stepThirdData: any;
  singleConfirm: number = 1;
  standardNda: number = 1;
  selectedOptionPartFiles: string;
  ndaType: string = "Standard Nda _ Single Confirm";
  createRfqString: string;

  constructor(private router: Router, private _profileService: ProfileService, private _buyerService: BuyerService, private _rfqService: RfqService, private _Http: Http, private _toastr: ToastrService, private _masterService: MasterService,private productAnalyticService :ProductAnalyticService) {
    this.isViewStandardNdaClicked = false;
    this.uploadProfileLogo();
    this.getSupplierProfileOriginal();
    this.isFileUpladed = false;
    this.standardNDAText = 'MFG’s Standard NDA states that you retain explicit proprietary ownership of the information contained within the RFQ, including all related data, and files. It also details the restrictions of their use as it pertains to the fulfillment of this request.<BR><BR><b>What does it say?</b><BR><BR> <i style="color:gray;">All data and attachments related to this RFQ are the property of the BUYER. The BUYER is the person or company that created and posted this RFQ.The information in this document is furnished to enable preparation of quotes, engineering review, evaluation, design, quality control and/or receiving inspection only, and represents proprietary information of the BUYER and shall be restricted to those persons having a need to know and neither it nor this document shall be used or disclosed in whole or in part, for any other purpose, without the written permission of the BUYER. By clicking the ACCEPT button below, you are digitally signing and agreeing to this Non-Disclosure Agreement.</i><BR><BR><b>Single Confirm</b><BR><BR>The Single Confirm option means that manufacturers only need to accept the NDA agreement before they can access your files.<BR><BR><b>Double Confirm</b><BR><BR>Double Confirm option means that manufacturers need to accept the NDA agreement and request to see your files.You must then approve the manufacturer’s request before they can access your files.'
    this.iPartUploadedFileNameList = {
      FileNameList: []
    };

    this.iPartUploadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.uploadPartImages();
    this.uploadNda()
  }
  showLoader=true;
  ngOnInit() {
    this._profileService.getConfigCatData().subscribe(result=>{
      if (result) {
        this.router.navigate(['/rfq/buyer']);
        return;
      } else {
        this.showLoader=false;
        console.log('inside byer compoment');
        // **** Adding identity event ****
        this.defaultNdaMessage = 'All data and attachments related to this RFQ are the property of the BUYER.  The BUYER is the person or company that created and posted this RFQ.<BR><BR>The information in this document is furnished to enable preparation of quotes, engineering review, evaluation, design, quality control and/or receiving inspection only, and represents proprietary information of the BUYER and shall be restricted to those persons having a need to know and neither it nor this document shall be used or disclosed in whole or in part, for any other purpose, without the written permission of the BUYER.<BR><BR>By clicking the ACCEPT button below, you are digitally signing and agreeing to this Non-Disclosure Agreement.';
        this.getIndustriesList();
        setTimeout(() => {
          this.getProcess();
        }, 1000);
        this.initRfqModel();
        this.initRfqBuyerStatus();
        this.initPartViewModel();
        this.websiteUrl = '';
        this.cmpDescription = '';
        this.iContactViewModel = {
          isLike: false,
          accountEmail: '',
          addressId: 0,
          comments: '',
          contactIdEncrypt: '',
          originalContactPictureFile: '',
          originalLogoOfCompany: '',
          isLoginFromVision: false,
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

          isVarified: false,
          expiration: null,
          currentPassword: '',
          newPassword: '',
          isRFQCreated: false,
          grantType: '',
          refreshToken: '',
          googleImageUrl: '',
          website: '',
          isCapabilitiesFilled: false,
          isCompanyProfileFilled: false,
          npsScore: 0,
          currentUserRole: [],
          noOfStars: 0,
          isVisionUserRequest: false,
          instagram: '',
          cmpDescription: this.cmpDescription
        };
        this.getStepId();
      }
    },error => {console.error('buyer form error'); });
  }

  initRfqModel() {
    this.irfqViewModel = {
      rfqId: 0,
      rfqName: '',
      payment_term_id: null,
      contactIdEncrypt: '',
      rfqDescription: '',
      certificateIdList: [],
      certificateList: [],
      rfqStatus: '',
      contactId: 0,
      rfqCreatedOn: '',
      rfqStatusId: 0,
      isSpecialCertificationsByManufacturer: false,
      isSpecialInstructionToManufacturer: false,
      specialInstructionToManufacturer: '',
      importancePrice: 1,
      importanceSpeed: 2,
      importanceQuality: 3,
      quotesNeededBy: null,
      awardDate: null,
      preferredManufacturingLocation: 0,
      isPartialQuotingAllowed: false,
      whoPaysForShipping: 1,
      shipTo: 0,
      isRegisterSupplierQuoteTheRfq: true,
      prefNdaType: 0,
      postProductionProcessId: 0,
      errorMessage: '',
      result: false,
      rfqBuyerStatus: this.iRfqBuyerStatus,
      userType: 0,
      isDefaultPrefferedManufacturingLocation: false,
      rfqGeneralAttachmentsList: [],
      certificationsByManufacturer: '',
      isDefaultNDAdetails: false,
      ndaContent: '',
      ndaTypekey: '',
      preferredMfgLocationIds: [],
      partCount: 0,
      isProfileNDA: false,
      isDefaultWhoPaysForShipping: false,
      rfqThumbnail: '',
      isActive: false,
      isUpdatedFromVision: false,
      isAllPartDetailsFilled: false,
      modifiedBy: this.loggedId,
      is_Default_payment_term_id: false,
      SpecialinviteList: [],
      companyId: null,
      ndaFile: '',
      ndaFileId: 0,
      isRfqLike: false,
      isRfqDisLike: false,
      isOnlyDateChanged: false,
      isAwarded: false,
      isShopIQAvailable: false,
      maxDeliveryDate: null,
      deliveryDate: null,
      isDefaultPrefRfqCommunicationMethod: false,
      prefRfqCommunicationMethod: null,
      isStripeSupplier: false,
      isAllowQuoting: false,
      isAwardingEnabled: false,
      rfqPurpose: null,
    };
  }
  // Model Initialization
  initRfqBuyerStatus() {
    this.iRfqBuyerStatus = {
      description: '',
      position: 0,
      rfqBuyerstatusId: 0,
      rfqBuyerstatusLiKey: ''
    };
  }

  initPartViewModel() {
    this.iPartsViewModel = {
      depth: 0,
      diameter: 0,
      height: 0,
      customPartDescription: '',
      isUpdatedFromVision: false,
      length: 0,
      partSizeUnitId: 0,
      surface: 0,
      volume: 0,
      width: 0,
      partId: 0,
      partName: '',
      partNumber: '',
      rfqPartId: 0,
      modifiedBy: this.loggedId,
      partCommodityCode: '',
      partDescription: '',
      materialId: 0,
      partQtyUnitId: 0,
      statusId: 0,
      companyId: 0,
      contactId: 0,
      currencyId: 0,
      creationDate: '',
      modificationDate: '',
      rfqId: 0,
      rfqPartQuantityList: [],
      deliveryDate: null,
      partsFiles: [],
      rfqPartFile: '',
      errorMessage: '',
      result: true,
      primaryPartFile: '',
      postProductionProcessId: 0,
      moveToPartId: 0,
      categoryName: '',
      materialName: '',
      partQtyUnitName: '',
      postProductionProcessName: '',
      isRfq1stquantityChanged: false,
      isRfq2ndquantityChanged: false,
      isRfq3rdquantityChanged: false,
      createNewPart: false,
      rfqPartTotalQuotedCount: 0,
      isValidDeliveryDate: null,
      isDefaultPartCategory: false,
      isDefaultPostProduction: false,
      isDefaultMaterial: false,
      isDefaultDeliveryDate: false,
      isExistingPart: null,
      parentPartCategoryId: 0,
      childPartCategoryId: 0,
      isChildCategorySelected: false,
      isChildSameAsParent: false
    };
  }
  closeStandardNda() {
    this.isSidePanel = false;
    this.isViewStandardNdaClicked = false;
  }

  onNavClick(stepId) {
    const arr = Array.from(document.querySelectorAll('li[class*="tab-"]'))
    arr.forEach(function (element, index) {
      if (index < stepId) {
        element.className = "tab-" + index + " complete";
      } else if (index === stepId) {
        element.className = "tab-" + index + " active";
      } else {
        element.className = "tab-" + index + " disabled";
      }
    })
    const tabContentArray = Array.from(document.querySelectorAll('div[id*="step"]'))
    tabContentArray.forEach(function (element, index) {
      element.className = "tab-pane";
      if (index === stepId) {
        element.className += 'active';
      }
    })
    const anchors = Array.from(document.querySelectorAll('a[href*="step"]'))
    anchors.forEach(function (element, index) {
      element.className = "";
    })
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  // Uploader Function
  uploadPartImages() {
    this.uploader.onAfterAddingAll = (fileItem) => {
      this.uploadPartDetailsFiles1(fileItem);
    };
  }

  uploadPartDetailsFiles1(fileItem) {
   for (const entry of fileItem) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.iPartUploadedFileName.CompleteFileName = fName;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          this.iPartUploadedFileName = {
            oFileName: '',
            CompleteFileName: ''
          };
        });
      }
    }
  }

  onFileSelected($event: any) {
    this.uploadPartDetailsFiles();
  }
  totalFileArr = [];
  uploadPartDetailsFiles() {
    const files = this.partDetailUploader.queue;
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          this.totalFileArr.push(fName);
          const fileNameArray = fName.split('_S3_');
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.iPartUploadedFileName.CompleteFileName = fName;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          const newArray = []
          newArray.push(this.iPartUploadedFileNameList)
          this.iPartUploadedFileName = {
            oFileName: '',
            CompleteFileName: ''
          };

          const upArray = []
          const finalArary = []
          newArray.forEach(element => {
            upArray.push(element.FileNameList)
            upArray.forEach(x => {
              x.forEach(z => {
                finalArary.push(z.oFileName)
              })
            })
          });
          this.partUploadedFileName = finalArary.toString()
          this.saveThirdStepFileonChange(this.partUploadedFileName)
        });

      }
    }
  }

  getOriginalFineName(fileName) {
    if (fileName !== null) {
      const filenNameArray = (fileName).split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }

  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  showStandardNda() {
    this.isViewStandardNdaClicked = true;
    this.isNdaClicked = false;
    this.isSidePanel = true;
  }

  addClassNdaVerbiage(id) {
    this.activeTabNdaVerbiage = id;
    (this.activeTabNdaVerbiage === 1) ? (this.showCustomNdaDiv = false) : (this.showCustomNdaDiv = true);
    if (this.activeTabNdaVerbiage == 2) {
      this.ndaType = " Custom NDA _ Single Confirm"
    }

  }

  canShowCustomNdaDiv() {
    return  (!!this.CustomNdaFileName && (this.CustomNdaFileName !== ''))?true:false;
  }

  closecustomNda() {
    this.isSidePanel = false;
    this.isNdaClicked = false;
    this.removeSelectedFile();
  }

  removeSelectedFile() {
    this.selectedCustomFile = {};
    this.ndaUploader.queue.length = 0;
    this.isUploadFileDropped = false;
    this.isUploadFileBrowsed = false;
    this.checkFile = true;
    this.fileDropName = '';
    this.fileBrowseName = '';
  }

  removeCustomNdaFile() {
    if (!!this.CustomNdaFileName && (this.CustomNdaFileName !== '')) {

      this.CustomNdaFileName = '';
      this.customNDAFile = '';
      this.addClassNdaVerbiage(1);
      this._toastr.success('File Removed', 'Success');

    }
  }

  addCustomNda() {
    if (this.CustomNdaFileName === '' || !this.CustomNdaFileName) {
      this.isNdaClicked = true;
      this.isSidePanel = true;
    }
    this.dispalyIndividualGrps = false;
    this.addShippingform = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.isViewStandardNdaClicked = false;
  }

  addClass(id) {
    this.activeTab = id;
    if (id == 2) {
      this.ndaType = "Custom NDA _ Double Confirm"
    } else {
      this.ndaType = "Custom NDA _ Single Confirm"
    }

  }
  selectedCustomFile: any;
  onFileChange(file) {
    this.setInputUpload = true;
    this.isFileNotPDF = false;

    if (file.target.files[0]) {

      this.selectedCustomFile = file.target.files[0];
    }
    if (file.target.files[0].type === 'application/pdf') {
      this.isUploadFileBrowsed = true;
      this.isUploadFileDropped = false;
      this.checkFile = false;
      this.ndaUploader.queue.length = 0;
      this.fileBrowseName = file.target.files[0].name;


      this.stepThirdData = {
        "stepId": 3,
        "subStepId": 1,
        "isPartFilesReady": 1,
        "isHelpNeeded": null,
        "partFiles": this.partUploadedFileName ? this.partUploadedFileName : null,
        "isStandardNDA": this.standardNda,
        "isSingleConfirm": this.singleConfirm,
        "customNDAFile": this.fileBrowseName


      }
      this.saveAllStepsInfo(this.stepThirdData)
    } else {
      this.checkFile = true;
      this.setInputUpload = false;
      this.isFileNotPDF = true;
    }
  }

  activeCmpStep1() {
    this.companyProfileStep1 = true;
    this.companyProfileStep2 = false;
    this.companyProfileStep3 = false;
    if (this.step2 === "option1") {
      this.selectedOptionPartFiles = "Yes, I have part files ready."
      this.onNavClick(2);
    } else {
      this.selectedOptionPartFiles = "No, do not have part files ready."
      this.isVisibleStep2 = !this.isVisibleStep2;
    }
    this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_ONBOARD_WELCOME);
  }
  activeCmpStep2() {

    this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_ONBOARD_FIRST_PART)

    this.companyProfileStep1 = false;
    this.companyProfileStep2 = true;
    this.companyProfileStep3 = false;
  }
  activeCmpStep3() {
    this.companyProfileStep1 = false;
    this.companyProfileStep2 = false;
    this.companyProfileStep3 = true;
    this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_ONBOARD_NO_PART)
  }

  goToNextStep() {
    if (this.step2 === "option1") {
      this.onNavClick(3);
      this.isVisibleStep4 = false;
    } else {
      this.activeCmpStep2();
    }
  }
  goToPreviousStep() {
    if (this.step2 === "option2") {
      this.onNavClick(1);
      this.isVisibleStep2 = true;
    } else {
      this.activeCmpStep2();
    }
  }
  goToPreviousStepFromStep2() {
    this.processErrorIndustry = false;
    this.processErrorManufacturingprocess = false;

    if (this.step2 === "option2") {
      this.activeCmpStep3();
    } else {
      this.activeCmpStep1();
    }
  }
  goToNextStepFromStep2() {
    if (this.step2 === "option1") {
      this.activeCmpStep3();
    } else {
      this.onNavClick(3);
      this.isVisibleStep4 = true;
    }
  }

  getIndustriesList() {
    this._masterService.GetCompanyTypesForBuyers().subscribe(
      (data: IIndustryBranchesModel[]) => {
        this.buyerTypeViewModel = data['data'];
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  processSettings = {};
  getProcess() {
    this.processSettings = {
      singleSelection: false,
      text: 'Select  Manufacturing Process',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      labelKey: 'parentDisciplineName',
      primaryKey: 'parentDisciplineId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 5,
      maxHeight: 150,
      showCheckbox: true,
    };
    this.iCustomProcessViewModelColl = [];
    this._rfqService.getAllProcess().pipe(takeUntil(this.destroy$)).subscribe(   
      result => {
        if (result['result'] !== false) {
          this.iCustomProcessViewModelColl = result['data'];
          this.iCustomProcessViewModelColl = this.removeDuplicates(this.iCustomProcessViewModelColl, 'parentDisciplineId');
          this.selectedProcessItems = [];
          this.getManufacTechnologiesDropDownValue();
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }


  // This method is used to select single process from list
  onProcessSelect(item: any) {
    this.processErrorManufacturingprocess = false;
    if (item) {
      this.cmpPrStep2ButtonDisable = false

    }
  }

  //This method is used to select all process from list
  onProcessSelectAll(item: any) {
    this.processErrorManufacturingprocess = false;
  }

  onProcessDeSelect(item: any) {
    if (this.selectedProcessItems == null || this.selectedProcessItems == undefined || this.selectedProcessItems.length == 0) {
      this.processErrorManufacturingprocess = true;
    }
    else {
      this.processErrorManufacturingprocess = false;
    }
  }

  onProcessDeSelectAll(item: any) {
    this.selectedProcessItems = []
    this.processErrorManufacturingprocess = true;
  }

  handleError(error) {
    if (error.status === 0) {
      this._toastr.warning('Please check connection', 'Warning!');
    } else if (error.status === 400) {
      this._toastr.warning(JSON.stringify(error.error), 'Warning!');
    } else if (error.status === 401) {
      this._toastr.warning('Your session is expired. Please login again to continue.', 'Warning!');
    }
  }
  // Company Profile Step 1 save data
  cmpPrStep1() {
    this.answers = "";
    this.selectedProcessItems.forEach(x => {

      if (this.answers == null || this.answers == "") {
        this.answers = x.parentDisciplineName;
      }
      else {
        this.answers = this.answers + "," + x.parentDisciplineName;
      }
    });
    this.ibuyerIndustryModalAnswers = {
      buyeId: this.loggedId,
      questions: "What manufacturing technologies are you interested in?",
      answers: this.answers
    }
    this.iBuyerCompanyTypeViewModel = {
      companyId: this.loggedCompanyId,
      companyTypeId: this.typeId,
      isBuyer: true,
      buyerIndustryModalAnswersData: this.ibuyerIndustryModalAnswers

    };



  }
  UploadFileLogo(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + '/Upload/UploadFileLogo';
    return this._Http.post(url, input, {
      headers: headers
    });
  }

  uploadProfileLogo() {
    this.profileLogoUploader.onAfterAddingFile = (fileItem) => {
      if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg')
        || (fileItem.file.type === 'image/png')) {
        const file = fileItem._file;
        this.UploadFileLogo(file)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
            const result = JSON.parse(res['_body']);
            this.iContactViewModel.contactPictureFile = result.fileName;
            this.iContactViewModel.originalContactPictureFile = result['fileName'];
            if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
              this.supplierLogoPath = result['privateFileFileName'];
              this.isFileUpladed = false;
            }
          }, error => {
            this._rfqService.handleError(error);
            this.isFileUpladed = false;
          }, () => {
          });
        fileItem.withCredentials = false;
        this.isFileUpladed = true;
        this.profileUploadLogoError = '';
      } else {
        this.profileUploadLogoError = 'Your image must be 150x150 pixels, and a PNG or JPG file only.';
      }
    };
  }

  cmpPrStep3() {
    this.iContactViewModel.contactPictureFile = this.iContactViewModel.originalContactPictureFile;
    this.iContactViewModel.website = this.websiteUrl
    this.iContactViewModel.cmpDescription = this.cmpDescription
  }

  UpdateRFQNDA() {
    this.irfqViewModel.rfqId = this.iPartsViewModel.rfqId;
    this.irfqViewModel.prefRfqCommunicationMethod = 120;
    this._rfqService.UpdateRFQNDA(this.irfqViewModel).subscribe(
      result => {
        this.irfqViewModel.rfqId = result['rfqId'];
        this.irfqViewModel.result = result['result'];
        this.irfqViewModel.errorMessage = result['errorMessage'];
        if (this.irfqViewModel.result === true) {
          this.getSubmittedRFQCount();
        } else {
          this._toastr.error(this.irfqViewModel.errorMessage, 'Error!');
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  uploadNda() {
    this.ndaUploader.onAfterAddingFile = (fileItem) => {
      this.isFileNotPDF = false;
      if (this.ndaUploader.queue.length > 1) {
        this.ndaUploader.queue.length = 0;
      } else {
        this.fileDropName = this.ndaUploader.queue[0].file.name;
      }
      if (fileItem.file.type === 'application/pdf') {
        fileItem.withCredentials = false;
        this.isFileDropped = true;
        this.isUploadFileDropped = true;
        this.isUploadFileBrowsed = false;
        this.droppedFile = fileItem;
        this.checkFile = false;
      } else {
        this.checkFile = true;
        this.fileDropName = '';
        this.isFileNotPDF = true;
      }
    };
  }
  saveCustomNdaFile() {
    if (this.setInputUpload === false) {
      this.selectedCustomFile = this.droppedFile.file.rawFile;
    }


    this.upload(this.selectedCustomFile).subscribe(
      (res) => {
        const result1 = JSON.parse(res['_body']);
        this.irfqViewModel.isProfileNDA = false;
        this.irfqViewModel.ndaFile = result1.fileName;
        this.irfqViewModel.ndaFileId = 0;
        this.isSaveNda = false;
        this.CustomNdaFileName = result1.fileName;
        if (this.CustomNdaFileName) {
          this.isCustomNda = false;
        }
        this.selectedCustomFile = {};
        this.closecustomNda();
        this.setInputUpload = false;

      },
      error => {
        this.isSaveNda = false;
        this.handleError(error);
        this.setInputUpload = false;
      },
      () => { }
    );
  }

  buyerPrStep2() {
    if (this.activeTab === 0) {
      this.irfqViewModel.ndaTypekey = appConstants.NDAType['No NDA Needed'];
    } else if (this.activeTab === 1) {
      this.irfqViewModel.ndaTypekey = appConstants.NDAType['Single Confirm'];
    } else if (this.activeTab === 2) {
      this.irfqViewModel.ndaTypekey = appConstants.NDAType['Double Confirm'];
  }

    if (this.activeTabNdaVerbiage === 1) {
      this.irfqViewModel.ndaContent = this.defaultNdaMessage;
      this.irfqViewModel.ndaFile = '';
      this.irfqViewModel.ndaFileId = 0;
      this.removeCustomNdaFile();
    } else {
      this.irfqViewModel.ndaContent = '';
    }
    if (this.activeTab === 0) {
      this.irfqViewModel.ndaContent = '';
      this.irfqViewModel.ndaFile = '';
      this.irfqViewModel.ndaFileId = 0;
    } else if (this.CustomNdaFileName !== '') {
        this.irfqViewModel.ndaFile = this.CustomNdaFileName;
      } else {
        this.irfqViewModel.ndaContent = this.defaultNdaMessage;
      }
    this.irfqViewModel.contactId = this.loggedId;


  }

  createRFQData(isPartFileSelectedinFlowOrNot: boolean, checkType: string) {
    // Saving file and creating RFQ
    this.createRfqString = "Create RFQ"
    this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_COMPANY_PROFILE);
    if (checkType === "createRFQDataHit") {
      this.isdisable = true

    }

    localStorage.setItem('isPartFileSelectedinFlowOrNot', this.isPartFileSelectedinFlowOrNot.toString());
    // ******Setting the local-storage value to open part drawer on only get-started flow******
    localStorage.setItem('fromGetStartedFlow', true.toString())

    this.addUpPart('New Part');
    this.setStepsInfo()
    const finalData = Object.assign({}, this.irfqViewModel, { iContactViewModel: this.iContactViewModel, iBuyerCompanyTypeViewModel: this.iBuyerCompanyTypeViewModel });
    this._buyerService.setData(finalData);
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  iPartsViewModel: IPartsViewModel;
  addUpPart(fNmae) {
    this.initPartViewModel();
    this.iPartsViewModel.rfqPartFile = 'New Part';
    this.iPartsViewModel.primaryPartFile = 'New Part';
    // tslint:disable-next-line:radix
    this.iPartsViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
    this.iPartsViewModel.companyId = this.loggedCompanyId;
    this.iPartsViewModel.rfqId = 0;
    this.iPartsViewModel.partsFiles = [];
    if (this.willDoLaterPath) {
      this.iPartsViewModel.willDoLater = true

    }
    if (this.iPartsViewModel.partsFiles.length == 0) {
      this._rfqService.addPart(this.iPartsViewModel).subscribe(
        result2 => {
          if (result2.result === true) {
            this.iPartsViewModel = result2;
            localStorage.setItem('isNewUser', 'false');
            this.iPartsViewModel.rfqPartId = result2.rfqPartId;
            this.iPartsViewModel.rfqId = result2.rfqId;
            setTimeout(() => {
              this.getRfqParts();
            }, 1000);
          }
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    }

  }

  getRfqParts() {
    this._rfqService.getRfqParts(this.iPartsViewModel.rfqId).subscribe(
      (result: any) => {
        this.iPartsViewModel.rfqPartId = result[0].rfqPartId;
        this.addUpPart1();
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  addUpPart1() {
    this.iPartsViewModel.partsFiles = this.totalFileArr;
    this._rfqService.addPart(this.iPartsViewModel).subscribe(
      result2 => {
        this.iPartsViewModel = result2;
        this.iPartsViewModel.partId = result2.partId;
        this.iPartsViewModel.rfqId = result2.rfqId;
        localStorage.setItem('isNewUser', 'false');
        localStorage.setItem('EditRfqName', (result2.rfqId).toString());
        localStorage.setItem('EditRfqId', (result2.rfqId).toString());
        //Saving NDA details
        this.UpdateRFQNDA();
      },
      error => {

        this.handleError(error);
      },
      () => { }
    );
  }


  submitRfqCount: number = 0;

  getSubmittedRFQCount() {
    localStorage.setItem('firstRFQId', this.irfqViewModel.rfqId.toString());
    this._profileService.GetSubmittedRFQCount(this.loggedId, this.irfqViewModel.rfqId).pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result.result) {

        this.submitRfqCount = result.data.rfqCount;
        this.startedStepId = result.data.getStartedStepId;

        this.reloadAdminComp();

      }
    }, error => {
    })
  }

  reloadAdminComp() {

    if (this.willDoLaterPath) {
      this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
        this.router.navigate(['dashboard/buyer/default']);
      });
    } else {

      this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('/rfq/editrfq');
      });
    }
  }

  removeSavedPartDetailFile(partName, index: any, rfqPartId) {


    if (this.iPartUploadedFileNameList.FileNameList) {
      this.iPartUploadedFileNameList.FileNameList.splice(index, 1);
    }
    let partNAme = partName.CompleteFileName ? partName.CompleteFileName : this.iPartsViewModel.rfqPartFile;

    this._rfqService.deletePartGeneralAttachment(partNAme, this.loggedId, this.iPartsViewModel.partId, rfqPartId).pipe(takeUntil(this.destroy$)).subscribe(
      (data: IPartsViewModel) => {
        if (data.result === true) {
          this.totalFileArr = [];

          this.iPartUploadedFileNameList.FileNameList.forEach((newArr: any) => {
            this.totalFileArr.push(newArr.CompleteFileName);
          })

        } else {
          this._toastr.success(this.iContactViewModel.errorMessage, data.errorMessage);
        }
      },
      error => () => {
        console.error('Error: $error');
        this._toastr.error(error, 'Error!');
      }
    );
  }

  downloadAllFilesForPart(totalFileArr: string[], isDownload: boolean) {
    totalFileArr.forEach(element => {
      this.downloadS3File(element, isDownload);
    });
  }

  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).pipe(takeUntil(this.destroy$)).subscribe(response => {
      if (response?.result?.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
           window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }



  openContactModal() {
    this.toShowContactModel = true;
    this.setStepsInfo()
  }


  isHelpNeededForDrawing(isHelpText: string) {
    this.isHelpDrawingText = isHelpText;
  }

  onClickOfRFQ(isPartFileSelectedinFlowOrNot: boolean) {
    localStorage.setItem('isPartFileSelectedinFlowOrNot', isPartFileSelectedinFlowOrNot.toString());
    localStorage.setItem('isManufacturingProcessSaved', isPartFileSelectedinFlowOrNot.toString());
    // ******Setting the local-storage value to open part drawer on only get-started flow******

    localStorage.setItem('fromGetStartedFlow', true.toString())
    // Saving file and creating RFQ
    this.addUpPart('New Part');
    this.setStepsInfo()

  }

  reDirectToSearchManufacturer(redirect) {
    if (redirect) {
      const url = this.router.serializeUrl(

        this.router.createUrlTree(['/source'], { queryParams: { page: 'manufacturer-directory/' } })

      );
      window.open("#" + url, '_blank');
    }
  }

  saveIndustry() {
  this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_BUYER_ONBOARD_INDUSTRY);
    if (this.typeId == null || this.typeId == undefined || this.typeId == 0) {
      this.processErrorIndustry = true;
      return;
    }
    else {

      this.processErrorIndustry = false;
    }
    if (this.selectedProcessItems == null || this.selectedProcessItems == undefined || this.selectedProcessItems.length == 0) {
      this.processErrorManufacturingprocess = true;
      return;
    }

    else {
      this.processErrorManufacturingprocess = false;
    }
    this.ibuyerIndustryModalAnswers = {
      buyeId: this.loggedId,
      questions: "What manufacturing technologies are you interested in?",
      answers: this.answers
    }
    // Saving Data of the Industry Dropdown
    this.iBuyerCompanyTypeViewModel = {
      companyId: this.loggedCompanyId,
      companyTypeId: this.typeId,
      isBuyer: true,
      buyerIndustryModalAnswersData: this.ibuyerIndustryModalAnswers

    };
    this._buyerService.setBuyerCompanyType(this.iBuyerCompanyTypeViewModel).pipe(takeUntil(this.destroy$)).subscribe(
      response => {
        if (!response.isError) {
          this._toastr.success('Industry has been updated.', 'Success!');
        } else {
          this._toastr.error('Something went wrong please try later.', 'Error!');
        }
      },
      error => {
        this._toastr.error('Something went wrong please try later.', 'Error!');
      }
    );


  }

  // Saving company Profile Data
  saveCompanyProfileData() {
    this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_COMPANY_PROFILE);
    this.iContactViewModel.contactPictureFile = this.iContactViewModel.originalContactPictureFile;
    this.iContactViewModel.website = this.websiteUrl;
    this.iContactViewModel.company.description = this.cmpDescription;
    this.iContactViewModel.totalLoginCount = 2;

    this.iContactViewModel.company.supplierTypeId = this.typeId;

    this._profileService.updateProfileInfo(this.iContactViewModel).pipe(takeUntil(this.destroy$)).subscribe(
      result => {
        if (result.result === true) {
          this.iContactViewModel = result;
          this.getSupplierProfileOriginal();
        } else {
          this._toastr.error(result.errorMessage, 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  // This function will redirect it to dashboard

  willDoLater(isPartFileSelectedinFlowOrNot: boolean, checkType: string) {
    this.isWillDolaterdisable = true
    this.createRfqString = "I will do it later"
    this.buyerOnBoardNoPartMixpannel(this.productAnalyticService.MPE_BUYER_COMPANY_PROFILE);
    if (!this.willDoLaterPath) {
      this.willDoLaterPath = true;
      this.createRFQData(isPartFileSelectedinFlowOrNot, "willDOLater");
    };

  }

  get loggedEncryptId() {
    // tslint:disaabale-next-line:radix
    return localStorage.getItem('LoggedIdEncript');
  }

  //fetching user-profile data
  getSupplierProfileOriginal() {
    const id = this.loggedEncryptId;

    this._profileService.getProfileDetails(id, this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(
      result => {
        this.iContactViewModel = result;
        this.typeId = this.iContactViewModel.company.supplierTypeId;
        if (this.typeId !== '0') {
          this.cmpPrStep2ButtonDisable = false
        }
        this.websiteUrl = this.iContactViewModel.website;
        if(this.iContactViewModel.company.description != null){
          this.cmpDescription = this.iContactViewModel.company.description.replace(/<[^>]*>/g, '');;
        }
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
        this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
            localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
          }
        }
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );


  }

  // to get manufacturing technologies values
  getManufacTechnologiesDropDownValue() {

    if (this.iContactViewModel.company.buyerIndustryModalAnswersDataAnswers != null && this.iContactViewModel.company.buyerIndustryModalAnswersDataAnswers != undefined) {
      const buyerIndustryModalAnswers = this.iContactViewModel.company.buyerIndustryModalAnswersDataAnswers;
      const buyerIndustryModalAnsArr = buyerIndustryModalAnswers.split(",");
      buyerIndustryModalAnsArr.forEach((buyerIndustryValue: any) => {
        this.createSelectedArrayList.push(this.iCustomProcessViewModelColl.filter(data => data.parentDisciplineName === buyerIndustryValue));
      });
      this.createSelectedArrayList.forEach((newArr: any) => {
        this.updatedField.push({ parentDisciplineId: newArr[0].parentDisciplineId, parentDisciplineName: newArr[0].parentDisciplineName });
      })
      this.selectedProcessItems = this.updatedField;
    }
  }

  // Set the steps Info

  setStepsInfo() {
    const setValue =
    {
      "contactId": this.loggedId,
      "stepId": 5,
      "subStepId": 0,
      "isPartFilesReady": null,
      "isHelpNeeded": null,
      "partFiles": null,
      "isStandardNDA": null,
      "isSingleConfirm": null,
      "customNDAFile": null
    }
    this._buyerService.setStepsInformation(setValue).pipe(takeUntil(this.destroy$)).subscribe(
      result => {


      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );

  }
  skipActiveCmpStep2() {
    this.totalFileArr = [];
    this.activeCmpStep2();
  }
  // click will do later without part file
  withoutPartLater() {
    this.setStepsInfo()
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/buyer/default']);
    })
  }

  // Validate to the next step button

  validateFields() {
    let isValid = true;
    if (this.typeId == null || this.typeId == undefined || this.typeId == 0) {
      this.processErrorIndustry = true;
      isValid = false;
    }
    if (this.selectedProcessItems == null || this.selectedProcessItems == undefined || this.selectedProcessItems.length == 0) {
      this.processErrorManufacturingprocess = true;
      isValid = false;
    }
    return isValid;
  }
  // ****Get the StepId on the initial component load****
  getStepId() {
    this._profileService.GetStepId(this.loggedId).pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result.result) {
        this.startedStepId = result.data.getStartedStepId;
      }
    }, error => {
    })
    if (this.startedStepId === 3) {
      this.onNavClick(2);
    } else if (this.startedStepId === 2) {
      this.onNavClick(1);
    } else if (this.startedStepId === 4) {
      this.onNavClick(3);
    }
  }

  // ****Calling the api to set the data and stepid on FirstRadio button change****
  checkStepOneRadio(event: string) {
    this.firstRadioData = {
      "stepId": 2,
      "subStepId": 0,
      "isPartFilesReady": 1,
      "isHelpNeeded": null,
      "partFiles": null,
      "isStandardNDA": null,
      "isSingleConfirm": null,
      "customNDAFile": null
    }
    if (event === 'option1') {
      this.saveAllStepsInfo(this.firstRadioData)
    } else {
      this.firstRadioData.isPartFilesReady = 0
      this.saveAllStepsInfo(this.firstRadioData)
    }
  }
  // ****Save the saveFirstStepId on First Next button****
  saveFirstStepId(stepValue: number) {
    if (typeof (this.firstRadioData) === "undefined") {
      const initialData = {
        "stepId": 3,
        "subStepId": 0,
        "isPartFilesReady": 1,
      }
      this.saveAllStepsInfo(initialData)
    } else {
      if (this.firstRadioData.isPartFilesReady === 0) {
        this.firstRadioData.stepId = 2;
        this.firstRadioData.subStepId = 2
      } else {
        this.firstRadioData.stepId = 3
      }
      this.saveAllStepsInfo(this.firstRadioData)
    }
  }
  // ****Calling the api to set the data and stepid on Second Radio button change****
  checkStepTwoRadio(event: string) {
    this.isHelpDrawingText = event;
    this.secondRadioData = {
      "stepId": 2,
      "subStepId": 2,
      "isPartFilesReady": this.firstRadioData.isPartFilesReady,
      "isHelpNeeded": 1,
      "partFiles": null,
      "isStandardNDA": null,
      "isSingleConfirm": null,
      "customNDAFile": null
    }

    if (event === 'Yes') {
      this.selectedOptionPartFiles = "Yes, I would like help getting drawings made"
      this.saveAllStepsInfo(this.secondRadioData)
    } else {
      this.selectedOptionPartFiles = "No, I will handle having drawings made"
      this.secondRadioData.isHelpNeeded = 0
      this.saveAllStepsInfo(this.secondRadioData)
    }
  }
  // ****Save the savesubStepId on First Next button****
  saveSubStepId(stepValue: number) {
    if (typeof (this.secondRadioData) === "undefined") {
      const initialData = {
        "stepId": 3,
        "subStepId": 0,
        "isPartFilesReady": 0,
        "isHelpNeeded": 1,
      }
      this.saveAllStepsInfo(initialData)

    } else {
      this.secondRadioData.stepId = 3;
      this.secondRadioData.subStepId = 0;
      this.saveAllStepsInfo(this.secondRadioData)
    }
  }
  // ****Save the Third step of yes part file****
  saveThirdStepFileonChange(fileName: string[]) {
    this.stepThirdData = {
      "stepId": 3,
      "subStepId": 1,
      "isPartFilesReady": 1,
      "isHelpNeeded": null,
      "partFiles": fileName,
      "isStandardNDA": this.standardNda,
      "isSingleConfirm": this.singleConfirm,
      "customNDAFile": this.fileBrowseName ? this.fileBrowseName : null

    }
    this.saveAllStepsInfo(this.stepThirdData)
  }
  // ****Save the Third step Single/Double confirm on radio change****
  checkConfirmRadio(event: any) {
    this.stepThirdData = {
      "stepId": 3,
      "subStepId": 1,
      "isPartFilesReady": 1,
      "isHelpNeeded": null,
      "partFiles": this.partUploadedFileName ? this.partUploadedFileName : null,
      "isStandardNDA": this.standardNda,
      "isSingleConfirm": 1,
      "customNDAFile": this.fileBrowseName ? this.fileBrowseName : null
    }
    if (event === 'Single Confirm') {
      this.singleConfirm = 1
      this.stepThirdData.isSingleConfirm = 1
      this.saveAllStepsInfo(this.stepThirdData)
    } else {
      this.stepThirdData.isSingleConfirm = 0
      this.singleConfirm = 0
      this.saveAllStepsInfo(this.stepThirdData)
    }
  }
  isCustomNda: boolean = false;
  // *****Custom NDA Radio button function
  NdaRadioBtnValue(btnText) {

      this.stepThirdData = {
      "stepId": 3,
      "subStepId": 1,
      "isPartFilesReady": 1,
      "isHelpNeeded": null,

      "partFiles": this.partUploadedFileName ? this.partUploadedFileName : null,
      "isStandardNDA": 1,
      "isSingleConfirm": this.singleConfirm,
      "customNDAFile": this.fileBrowseName ? this.fileBrowseName : null

    }
    if (btnText === "Custom NDA") {
      this.isCustomNda = true
      this.stepThirdData.isStandardNDA = 0
      this.standardNda = 0
      this.saveAllStepsInfo(this.stepThirdData)
    } else {
      this.isCustomNda = false
      this.standardNda = 1
      this.saveAllStepsInfo(this.stepThirdData)
    }
  }
  // First part started next Button
  firsPartStartedNext() {
    const stepIdData = {
      "stepId": 3,
      "subStepId": 2,
    }
    this.saveAllStepsInfo(stepIdData)
  }
  // What are you looking for Next Button
  whatAreYouLookingNext() {
    const stepIdData = {
      "stepId": 3,
      "subStepId": 3,
    }
    this.saveAllStepsInfo(stepIdData)
  }
  // Company profile next Button
  companyProfileNext() {
    this.saveStep4Info();
  }
  // Save Buyer Process StepId on Tab click
  saveBuyerTab() {
    const stepIdData = {
      "stepId": 2,
    }
    this.saveAllStepsInfo(stepIdData)
  }
  // Save Comapny Profile StepId on Tab click
  saveCompanyProfile() {
    const stepIdData = {
      "stepId": 3,
    }
    this.saveAllStepsInfo(stepIdData)
  }
  // Save Engage Manufacture StepId on Tab click
  saveEngageMenu() {
    this.saveStep4Info();
  }
  saveStep4Info()
  {
    const stepIdData = {
      "stepId": 4,
    }
    this.saveAllStepsInfo(stepIdData)
  }
  // ***** Saving Steps Data common function
  saveAllStepsInfo(StepsData: any) {
    StepsData.contactId = this.loggedId
    this._buyerService.setStepsInformation(StepsData).pipe(takeUntil(this.destroy$)).subscribe(
      response => {
      },
      error => {
      }
    );
  }
  // mipanel buyer onboard no-part
  buyerOnBoardNoPartMixpannel(eventName) {
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    this.productAnalyticService.mixpanelTracking(eventName,{
      buyer_location: submitModel.buyerLocation,
      validated_buyer: submitModel.isValidatedBuyer,
      buyer_process_welcome: this.selectedOptionPartFiles,
      nda_type: this.ndaType,
      buyer_industry: this.typeId,
      buyer_manufacturing_technologies: this.answers
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
