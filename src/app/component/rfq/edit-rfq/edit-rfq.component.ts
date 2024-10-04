import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  TemplateRef,
} from '@angular/core';
import {
  Router,
  NavigationStart,
  ActivatedRoute
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  Form,
  FormControl
} from '@angular/forms';
import {
  FileUploader
} from 'ng2-file-upload';

import {
  Http,
  Headers
} from '@angular/http';
// import {
//   isNumber
// } from '@ng-bootstrap/ng-bootstrap/util/util';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IOption
} from 'ng-select';
import {
  ConfirmationService
} from 'primeng/api';
import * as moment from 'moment';
import {
  Observable, Subscription
} from 'rxjs';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

import {
  regiserEvent2
} from '../../../../assets/javascript/demo';
import {
  IPartsViewModel,
  IRfqPartQuantityViewModel,
  IUploaadedFileName,
  IUploaadedFileNameList,
  IRFQViewModel,
  IRfqBuyerStatus,
  IUploadedGenAttachFileNmList,
  IManufacturersViewModel,
  IIndividualList,
  ITerritoryClassificationNames,
  ICustomProcessViewModel,
  ITerritoryClassificationModel,
  SpecialInvitedModel,
  SpecialInvitedNameModel,
  ITempUploadedFiles,
  MaterialsRequestViewModel,
  PostProductionProcessRequestViewModel,
  IUpdateRFQViewModel,
} from '../../../core/models/rfqModel';
import {
  ICategory,
  IPostProdProcesses,
  IMaterial,
  IQuantityUnit,
  ILanguageModel,
  ICountryViewModel,
  IRegionModel,
  IMaterialViewModel,
  IPostProductionViewModel,
  ICertificationViewModel
} from '../../../core/models/globalMaster';
import {
  IPartLibraryModel,
  IPartLibraryModelDetails
} from '../../../core/models/partModel';
import {
  INDAViewModel,
  IPreferrenceModel
} from '../../../core/models/settingsModel';
import {
  ICompanyModel,
  IAddressModel,
  IContactViewModel,
  ICompanyShippingSiteViewModel,
  DicoverIdForRfq
} from '../../../core/models/accountModel';
import {
  IShippingAddressesModel
} from '../../../core/models/profileModel';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  SettingService
} from '../../../core/services/setting/setting.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  CustomValidatorService
} from '../../../core/services/validator/custom-validator.service';
import {
  ProfileService
} from '../../../core/services/profile/profile.service';
import {
  appConstants
} from './../../../core/config/constant';
import {
  environment
} from '../../../../environments/environment';
import {
  CanComponentDeactivate
} from '../../../shared/decativeguard/deactivate-guard.guard';
import {
  dragula,
  DragulaService
} from 'ng2-dragula';
import { BuyerService } from '../../../core/services/buyer/buyer.service';
import * as _ from 'lodash';
import { AnyRecordWithTtl } from 'dns';
declare var window;
const URL = '';
import { uploadFileNDA } from '../../../../constants/url-constant';
import { ProductAnalyticService } from '../../../shared/product-analytic/product-analytic';
@Component({
  selector: 'app-edit-rfq',
  templateUrl: './edit-rfq.component.html',
  styleUrls: ['./edit-rfq.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [ConfirmationService]
})
export class EditRfqComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  @ViewChild('SecondQty', {static: true}) SecondQty: ElementRef;
  @ViewChild('quotesDateInput', {static: true}) quotesDateInput: ElementRef;
  @ViewChild('statusModel', {static: true}) rfqStatusModal: TemplateRef < any > ;
  @ViewChild('cancelModel', {static: true}) cancelModel: TemplateRef < any > ;
  @ViewChild('sidePanleDrawer') sidePanleDrawerEl: any;
  subscription: Subscription;
  // uploader declaration
  uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  uploaderGeneralAttach: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  uploaderGeneralAttachDetail: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  compLogoCYFUploader: FileUploader = new FileUploader({
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
  // uploader declaration end
  // subscription:Subscription;
  DicoverIdForRfqColl: DicoverIdForRfq[];
  // varibale declaration
  @ViewChild('fileprice') private fileprice: any;
  @ViewChild('file') file;
  @ViewChild('logoFileCYP', {static: true}) logoFileCYP;
  @ViewChild('filespeed') filespeed;
  @ViewChild('filequality') filequality;

  isCloneModel: boolean;

  isRfqName: boolean;
  isAddPart: boolean;
  isRfqDetails: boolean;
  isRfqReview: boolean;

  ITempUploadedFiles: ITempUploadedFiles;
  ITempUploadedFilesColl: ITempUploadedFiles[];
  isRfqNameStatus: boolean;
  isAddPartStatus: boolean;
  isRfqDetailsStatus: boolean;
  isRfqReviewStatus: boolean;
  isRfqNameActive: boolean;
  isAddPartActive: boolean;
  isRfqDetailsActive: boolean;
  isRfqReviewActive: boolean;
  editRfqId: number;
  isEditMode: boolean;
  editRfqName: string;
  isRfqNameBtnClicked: boolean;
  isPartDetailsBtnClicked: boolean;
  isAddShippingBtnClicked: boolean;
  isSaveRfqDetailsBtnClicked: boolean;
  isDecideToShow: boolean;
  isMaterialTouched: boolean;
  isTilesView: boolean;
  isGridView: boolean;
  isFileUpladed: boolean;
  isSidePanel: boolean;
  partUplodcount = 0;
  uplocount = 0;
  appendText: string;
  oappendText: string;
  currentActivePartId: number;
  currentActiveRfqPartId: number;
  partFileDownloadLink: string;
  isPartClicked: boolean;
  isPartsLibrarayClicked: boolean;
  dispalyIndividualGrps: boolean;
  dispalyIndividualGrpsAttachment: boolean;
  addShippingform: boolean;
  addGenAttachementDiv: boolean;
  addressList: boolean;
  isDragRegister = false;
  isViewStandardNdaClicked: boolean;
  isNdaClicked: boolean;
  rfqGeneralAttachments: any;
  partDrawerSearch: string;
  minDate: Date;
  awardMinDate: Date;
  deliveryMinDate: Date
  isPartDrawerFilledWithoutSearch = false;
  isDeletePart: boolean;
  isCertificationError: boolean;
  isAwardDateError: boolean;
  isQuotedByDateError: boolean;
  isSpecialInstructionError: boolean;
  isShip2To: boolean;
  msgs: string;
  showLetMeChooseValidationMsg = false;
  activeTab:number = 1;
  isCustomNdTab = 0;
  isMaterialValid: boolean;
  isFileDownloaded: number;
  individualSearchText: string;
  groupSearchText: string;
  isAddIndiActive = false;
  isAddGroupActive = false;
  activeTabNdaVerbiage: number;
  defaultNdaMessage: string;
  CustomNdaFileName: string;
  showCustomNdaDiv: boolean;
  customNDAFile: string;
  isUploadFileDropped = false;
  isUploadFileBrowsed = false;
  setInputUpload = false;
  droppedFile;
  isFileNotPDF = false;
  checkFile = true;
  fileDropName: string;
  fileBrowseName: string;
  importanceOrder: string;
  preferredMfgLocText: string;
  whoPaysForShippingText: string;
  deliveryDate: boolean;
  shippingAddress: any = {
    companyName: '',
    streetAddress: '',
    deptAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };
  checkAddress: boolean;
  prefNDATypeText: string;
  isStandardNda = true;
  shippingReviewData: any;
  hasBaseDropZoneOver = false;
  public fileNum = 0;
  isFileDropped: boolean;
  tempUploadProfileLogoName = '';
  isCYPSubmitEnabled = false;
  defaultAwsPath = '';
  uploadedFileName: any;
  isGroupWithoutSearch = false;
  isIndivitualWithoutSearch = false;
  firstQuantityRequiredError = false;
  secondQuantityRequiredError = false;
  thirdQuantityRequiredError = false;
  firstQuantitySameError = false;
  secondQuantitySameError = false;
  thirdQuantitySameError = false;
  isSameQuantityError = false;
  isDeliveryDateError = false;
  rfqnameError: boolean = false;
  regionError: boolean = false;
  maxDeliverDate: Date;
  is2QuantityValid: boolean;
  is3QuantityValid: boolean;
  firstQuantity: number;
  secondQuantity: number;
  thirdQuantity: number;
  firstOQuantity: number;
  oDeliveryDate: Date;
  secondOQuantity: number;
  thirdOQuantity: number;
  secondQuantityDiv: boolean;
  certificateList: number[];
  thirdQuantityDiv: boolean;
  addsecondQuantityDiv: boolean;
  addthirdQuantityDiv: boolean;
  currentImageName: string;
  shippingAddressData: any;
  mailingAddressData: any;
  isCompanyPresent = true;
  CompanyName: string;
  isShiiping5: boolean;
  cuSiteId: number;
  isStateValid: boolean;
  isCountryValid: boolean;
  isCancel1stStep: boolean;
  isCancel2ndStep: boolean;
  isCancel3rdStep: boolean;
  isCYPSubmitted = false;
  uploadProfileLogoName = '';
  isPhoto: boolean;
  isGoogleSerched: boolean;
  isRFQSubmitted = false;
  googlePlacePhototUrl: string;
  donNotShowOrderManagment: boolean;
  numberOnlyPattern = '^(0|[1-9][0-9]*)$';
  public address: any;
  public typesOptions: string[];
  public options = {
    type: 'address'
  };
  manufractureTab = 1;
  isPartActive: boolean;
  activePart: number;
  iReviewPartsViewModel: IPartsViewModel;
  standardNDAText: string;
  isAttachmentsLoading: number;
  openCYPModel = false;
  manufactureLoc: any;
  selectFieldJSON = {
    'childPostProductionProcessId': 0,
    'childPostProductionProcessName': 'Select Post Process',
    'parentPostProductionProcessId': 0,
    'parentPostProductionProcessName': ''
  };
  selectMaterialJSON = {
    'childMaterialId': 0,
    'childMaterialName': 'Select Material',
    'parentMaterialId': 0,
    'parentMaterialName': ''
  }
  // variable declaration ends

  // form declarations
  irfqForm: FormGroup;
  partDetailsForm: FormGroup;
  shippingForm: FormGroup;
  // form declaration ends

  // Model instance creation
  irfqViewModel: IRFQViewModel;
  iUpdateRFQViewModel: IUpdateRFQViewModel;
  iRfqBuyerStatus: IRfqBuyerStatus;
  iContactViewModel: IContactViewModel;
  iContactViewModel3: IContactViewModel;
  latestAddressId: number;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  iDefaultAddressModel: IAddressModel;
  iTerritoryClassificationNames: ITerritoryClassificationNames;
  iPartUploadedFileName: IUploaadedFileName;
  iPartUploadedFileNameList: IUploaadedFileNameList;

  iShippingAddressesModel: IShippingAddressesModel;
  iCompanyShippingSiteViewModel: ICompanyShippingSiteViewModel;
  iReviewPartsViewModelColl: IPartsViewModel[];
  iPartFromLibraryColl: IPartLibraryModel[];
  iPartFromLibraryTempColl: IPartLibraryModel[];
  iPostProdProcessesColl: IPostProdProcesses[];
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iMaterialColl: IMaterial[];
  iQuantityUnitColl: IQuantityUnit[];
  iCategoryColl: ICategory[];
  idForPartGotFromLibraryColl: number[];
  partGotFromLibraryColl: any[];
  ITerritoryClassificationModelColl: ITerritoryClassificationModel[];

  iPartsViewModel: IPartsViewModel;
  iPartsViewModelOld: any;
  iPartsViewModelColl: IPartsViewModel[];
  iPartsViewModelColTemp: IPartsViewModel[];
  iPartLibraryModelDetailsColl: IPartLibraryModelDetails[];

  iCategoryCollShow: Array<IOption> = [];
  iMaterialCollShow: Array<IOption> = [];
  iMaterialCategory: any;

  partCategoryIdColl: number[];
  manufactureList: IManufacturersViewModel;
  iSupplierGroupViewModelShow: Array<any> = [];
  indiContactList: Array<any> = [];
  iNDAViewModel: INDAViewModel;
  iContactViewModel2: IContactViewModel;
  iShippingAddressModelCYP: IContactViewModel;
  iRegionModel: IRegionModel[];
  iRegionModelAll: IRegionModel[];
  iCountryColl: ICountryViewModel[];
  defaultCountry: any;
  iCountryProfileColl: ICountryViewModel[];
  iInfoModelCYP: IContactViewModel;
  iRfqPartQuantityViewModel: IRfqPartQuantityViewModel;
  iUploaadedFileName: IUploaadedFileName;
  iUploaadedFileNameList: IUploaadedFileNameList;
  iUploadedGenAttachFileNmList: IUploadedGenAttachFileNmList;
  genAttachementData: IUploaadedFileName[];
  iShppingForCYP: ICompanyShippingSiteViewModel;
  iAddressModelCYP: IAddressModel;
  iAddressModelCYP1: IAddressModel;
  iAddressModel1: IAddressModel;
  iManufacturersViewModel: IManufacturersViewModel;
  iCompanyShippingSiteViewModel1: ICompanyShippingSiteViewModel;
  iMaterialViewModelColl: IMaterialViewModel[];
  iPostProductionViewModelColl: IPostProductionViewModel[];
  iCertificationViewModelColl: ICertificationViewModel[];
  processSettings = {};
  materialsettings = {};
  postProductionProcesssettings = {};
  certificatesettings = {};
  selectedItems = [];
  materialselectedItems = [this.selectMaterialJSON];
  postProcessselectedItems = [this.selectFieldJSON];
  CertificationselectedItems = [];
  _ipreferenceForm: IPreferrenceModel;
  isFirstTabCompleted: boolean;
  isSecondTabCompleted: boolean;
  isThirdTabCompleted: boolean;
  isFourthTabCompleted: boolean;
  isFromPartLibrary: boolean;
  isWhoPaysSetByEdit: boolean;

  manufactureId: string;
  PartError1: string;
  quantityError1: string;
  quantityError2: string;
  quantityError3: string;

  isSaveRfqName: boolean;
  isSaveRfqDetails: boolean;
  isReviewRfq: boolean;
  isSubmitRfq: boolean;
  isSavePart: boolean;
  isSaveAddress: boolean;
  isSaveNda: boolean;

  loggedContactId: number;
  // Model instance creation ends
  SpecialInvitedNameModel: SpecialInvitedNameModel;
  SpecialInvitedNameModelColl: SpecialInvitedNameModel[];
  SpecialInvitedModel: SpecialInvitedModel;
  SpecialInvitedModelColl: SpecialInvitedModel[];
  isPaymentNotFromEditMode = false;
  isOpenPartDetails: boolean;
  isPartLibraryApiCall: boolean;
  isPartUploadApiCall: boolean;
  totalProcessed: number;
  totalUpPartProcessed: number;
  OldQuoteDate: string;
  OldAwardDate: string;
  isPartDeliveryChange: boolean;
  cloneDelivaryDate: any;
  activePartId: number;
  routeSub: any;
  preferredCommunicationArray: string[] = [];
  statusModalReference: any;
  cancelModalReference: any;
  redirectURL: string;

  rfqPurposeModelList: any = [];
  rfqPurposeError: boolean = false;

  parentProcessPriority: any;
  parentProcessLessPriority: any;

  childProcess: any;
  isCancelBtn: boolean = false;
  toShowQuantityUnit: boolean = false;

  questionOptionList: any = [];

  processError: boolean = false;
  materialError: boolean = false;
  newExistError: boolean = false;
  partNameError: boolean = false;
  partNumberError: boolean = false;
  partFirstQuantityError: boolean = false;
  partSecondQuantityError: boolean = false;
  partThirdQuantityError: boolean = false;
  partFileAddedError: boolean = false
  moveToDiv: boolean = false;

  isCommunityRfq: boolean = false;
  firstTimePartAdded: boolean = true;

  isRfqPartSubmitted: boolean = false;
  isPartFileSelectedinFlowOrNot: string = '';
  fromGetStartedFlow: string = 'false'
  sharedData: any;
  activeNextButton: boolean = false;
  showOrder: any;
  manuFacturingProcessMixPanel: any;
  materialNameMixpanel: any;
  manuFacturingTechniqueMixPanel: any;
  partSelectionMIxPanel: string;
  manufactureLocationMixpanel: string = "United States";
  rfqPurposeMixpanel: any;
  partData: IPartsViewModel[];
  rfq_payer: number;
  rfq_payment_method: number;
  communication_method: number;
  nda_type: number;
  resRfqId: number;
  updatedRfq: any;
  updatedencryptedRfqID: any;
  encryptedRfqID: any;
  rfqCountdata: any;
  constructor(private _Http: Http,
    private _fb: FormBuilder,
    private _masterService: MasterService,
    private _customValidatorsService: CustomValidatorService,
    private _rfqService: RfqService,
    private _profileService: ProfileService,
    private _settingService: SettingService,
    private _toastr: ToastrService,
    private confirmationService: ConfirmationService,
    public router: Router,
    private modalService: NgbModal,
    private _router: ActivatedRoute,
    private dragulaService: DragulaService,
    private _buyerService: BuyerService,
    private productAnalyticService:ProductAnalyticService
  ) {
    this.iCertificationViewModelColl = [];
    this.cloneDelivaryDate = '';
    this.manufactureLoc = 0;
    this.isCloneModel = false;
    this.OldQuoteDate = '';
    this.OldAwardDate = '';
    this.isAttachmentsLoading = 0;
    this.isPartLibraryApiCall = false;
    this.totalProcessed = 0;
    this.isSaveRfqName = false;
    this.isSaveRfqDetails = false;
    this.isReviewRfq = false;
    this.isSavePart = false;
    this.isSaveAddress = false;
    this.isSaveNda = false;
    this.isSubmitRfq = false;
    this.totalUpPartProcessed = 0;
    this.editRfqId = 0;
    this.isOpenPartDetails = false;
    this.isPartUploadApiCall = false;
    this.activePart = 0;
    this.shippingAddressData = [];
    this.ITempUploadedFilesColl = [];
    this.editRfqName = '';
    this.oDeliveryDate = null;
    this.iPartFromLibraryTempColl = [];
    this.quantityError1 = 'Please enter the quantity';
    // this.PartError1 = 'Please enter part number';
    this.PartError1 = '';
    this.quantityError2 = 'Please enter the quantity';
    this.iRegionModelAll = [];
    this.quantityError3 = 'Please enter the quantity';
    this.firstOQuantity = 0;
    this.secondOQuantity = 0;
    this.thirdOQuantity = 0;
    this.DicoverIdForRfqColl = [];
    this.checkAddress = false;
    this.is2QuantityValid = false;
    this.is3QuantityValid = false;
    this.isMaterialValid = false;
    this.iPartFromLibraryColl = [];
    this.certificateList = [];
    this.latestAddressId = 0;
    this.currentActiveRfqPartId = 0;
    this.isCertificationError = false;
    this.isSpecialInstructionError = false;
    this.isFromPartLibrary = false;
    this.isWhoPaysSetByEdit = false;
    // tslint:disable-next-line:radix
    this.loggedContactId = parseInt(localStorage.getItem('LoggedId'));
    this._router.queryParams.subscribe(params => {
      const deCryptRFQID = params['rfqId'];
      if (deCryptRFQID !== undefined && deCryptRFQID !== null) {
        let idRfq = this._profileService.decrypt(deCryptRFQID);
        // console.log(idRfq, 'idRfq')
        this.editRfqId = parseInt(idRfq);
        this.editRfqName = idRfq;
      }
    })
    if (localStorage.getItem('EditRfqName') !== null) {
      // tslint:disable-next-line:radix
      this.editRfqId = parseInt(localStorage.getItem('EditRfqId'));
      this.editRfqName = localStorage.getItem('EditRfqName');
    }
    if (this.editRfqId !== 0 && this.editRfqId !== undefined) {
      this.isEditMode = true;
      this.initRfqModel();
      this.forEditMode();
      this.isDecideToShow = true;
    } else {
      this.isEditMode = false;
      this.isDecideToShow = false;
      this.getNdaInfo();
    }
    this.isFirstTabCompleted = false;
    this.iPostProductionViewModelColl = [];
    this.isSecondTabCompleted = false;
    this.iMaterialViewModelColl = [];
    this.isThirdTabCompleted = false;
    this.iCustomProcessViewModelColl = [];
    this.isFourthTabCompleted = false;
    this.iCountryColl = [];
    this.iQuantityUnitColl = [];

    this.isRfqName = true;
    this.isAddPart = false;
    this.isRfqDetails = false;
    this.isRfqReview = false;

    // this.isRfqNameStatus = false;
    this.isAddPartStatus = false;
    this.isRfqDetailsStatus = false;
    this.isRfqReviewStatus = false;
    this.isRfqNameActive = true;
    this.isAddPartActive = false;
    this.isRfqDetailsActive = false;
    this.isRfqReviewActive = false;
    this.isSidePanel = false;

    this.oappendText = '';
    this.appendText = '';
    this.isMaterialTouched = false;
    this.isPartClicked = false;
    this.isPartsLibrarayClicked = false;
    this.dispalyIndividualGrps = false;
    this.dispalyIndividualGrpsAttachment = false;
    this.addShippingform = false;
    this.addGenAttachementDiv = false;
    this.addressList = false;
    this.isViewStandardNdaClicked = false;
    this.isNdaClicked = false;
    this.isTilesView = false;
    this.isGridView = true;
    this.isFileUpladed = false;
    this.idForPartGotFromLibraryColl = [];
    this.checkForEditMode();
    this.uploadPartImages();
    this.uploadGeneralAttach();
    this.uploadGeneralAttachDetail();
    this.uploadNda();
    this.msgs = '';
    this.uploadedFileName = [];
    this.iPartsViewModelColl = [];
    this.iPartsViewModelColTemp = [];
    this.secondQuantityDiv = false;
    this.thirdQuantityDiv = false;
    this.addsecondQuantityDiv = true;
    this.addthirdQuantityDiv = false;
    this.isRfqNameBtnClicked = false;
    this.isPartDetailsBtnClicked = false;
    this.isAddShippingBtnClicked = false;
    this.isSaveRfqDetailsBtnClicked = false;
    this.isFileDownloaded = 0;
    this.uploadcompLogoCYF();
    this.initSpecialFileModel();
    this.SpecialInvitedModelColl = [];
    this.SpecialInvitedNameModelColl = [];
    this.initSpecialInvitedNameModel();
    this.iReviewPartsViewModelColl = [];
    this.defaultNdaMessage = '';
    this.iniITempUploadedFiles();
    // tslint:disable-next-line:max-line-length
    this.defaultNdaMessage = 'All data and attachments related to this RFQ are the property of the BUYER.  The BUYER is the person or company that created and posted this RFQ.<BR><BR>The information in this document is furnished to enable preparation of quotes, engineering review, evaluation, design, quality control and/or receiving inspection only, and represents proprietary information of the BUYER and shall be restricted to those persons having a need to know and neither it nor this document shall be used or disclosed in whole or in part, for any other purpose, without the written permission of the BUYER.<BR><BR>By clicking the ACCEPT button below, you are digitally signing and agreeing to this Non-Disclosure Agreement.';
    this.standardNDAText = 'MFG’s Standard NDA states that you retain explicit proprietary ownership of the information contained within the RFQ, including all related data, and files. It also details the restrictions of their use as it pertains to the fulfillment of this request.<BR><BR><b>What does it say?</b><BR><BR> <i style="color:gray;">All data and attachments related to this RFQ are the property of the BUYER. The BUYER is the person or company that created and posted this RFQ.The information in this document is furnished to enable preparation of quotes, engineering review, evaluation, design, quality control and/or receiving inspection only, and represents proprietary information of the BUYER and shall be restricted to those persons having a need to know and neither it nor this document shall be used or disclosed in whole or in part, for any other purpose, without the written permission of the BUYER. By clicking the ACCEPT button below, you are digitally signing and agreeing to this Non-Disclosure Agreement.</i><BR><BR><b>Single Confirm</b><BR><BR>The Single Confirm option means that manufacturers only need to accept the NDA agreement before they can access your files.<BR><BR><b>Double Confirm</b><BR><BR>Double Confirm option means that manufacturers need to accept the NDA agreement and request to see your files.You must then approve the manufacturer’s request before they can access your files.'
    
    // dragulaService.drop.subscribe((value: any[]) => {
    //   this.onDropModel(value.slice(1));
    // });

    

    this.subscription = this._buyerService.getMessage().subscribe(data => {
      if (data) {
        // console.log("data@@@@@",data) 

      } else {
        // clear messages when empty message received    
        console.log("errrr")
      }
    });

    this.isPartFileSelectedinFlowOrNot = JSON.parse(localStorage.getItem('isPartFileSelectedinFlowOrNot'));
    // ******Fetching the local-storage value to open part drawer on only get-started flow******
    if (JSON.parse(localStorage.getItem('fromGetStartedFlow')) != null) {
      this.fromGetStartedFlow = JSON.parse(localStorage.getItem('fromGetStartedFlow')) ? 'true' : 'false'

    }
  }
  photoIds: any[];
  private onDropModel(args: any): void {
    let [el, target, source] = args;
    let elem = target.children;
    this.photoIds = [];
    for (let index = 0; index < elem.length; index++) {
      this.photoIds.push(elem[index].dataset.messageId);
    }
    // this.setPhotoSequence();
    // console.log(target);

  }
  ngOnInit() {
    this.activeTab = 1;
    this._rfqService.getOrderManagementDetails(this.loggedId).subscribe(
      result => {
        if (result.isOrderManagementChecked === true) {
          this.showOrder = true
        } else {
          this.showOrder = false
        }
      },
      error => {

        this._rfqService.handleError(error);
      },
      () => { }
    );
    /*
         Register to Angular navigation events to detect navigating away (so we can save changed settings for example)
      */
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // save your data  !=''
        if (this.irfqViewModel.rfqId != null && this.irfqViewModel.rfqId != 0) {
          let islogin = event.url.includes('/auth/login/simple');
          let isEdit = event.url.includes('/rfq/editrfq');
          if (islogin == false && isEdit == false && this.isCancelBtn == false) {
            this._rfqService.GetRfqStatus(this.irfqViewModel.rfqId).subscribe(res => {
              if (res.rfqStatusId != null && res.rfqStatusId == 1) {
                this.redirectURL = event.url;
                this.openModal();
              }
            }, error => {
              this.closeSessionModel();
              this.handleError(error);
            })
          }
        }
      }
    })

    this.isRfqName = true;

    this.isAddPart = true;
    this.isRfqDetails = false;
    this.isRfqReview = false;

    this.preferredCommunicationArray[117] = 'Call';
    this.preferredCommunicationArray[118] = 'Message';
    this.preferredCommunicationArray[119] = 'Email';
    this.preferredCommunicationArray[120] = 'Call or Email';
    this.activePartId = null;
    this.isCloneOpen();
    this.initializeModel();
    // this.createRFQForm();
    this.configDatePicker();
    // this.getBuyerLocation();
    this.getSettingPreference();
    this.fillDropDown();
    this.selectedItems = [];
    this.materialselectedItems = [this.selectMaterialJSON];
    this.postProcessselectedItems = [this.selectFieldJSON];
    this.CertificationselectedItems = [];
    this.resetNDAViewModel();
    window.scrollTo(0, 0);
    this.appendText = '...';
    if (localStorage.getItem('cmrfq')) {
      this.isCommunityRfq = true;
    } else {
      this.isCommunityRfq = false;
    }
    /* code is to check when the user is redirect from discover supplier page to create rfq */
    // if (localStorage.getItem('manufactureId')) {
    //   // tslint:disable-next-line:radix
    //   this.DicoverIdForRfqColl = JSON.parse(localStorage.getItem('manufactureId'));
    //   //  localStorage.removeItem('manufactureId');
    //   this.onSearchChange();
    //   this.irfqViewModel.companyId = this.loggedCompanyId;
    //   if (localStorage.getItem('cmrfq')) {
    //     this.isCommunityRfq = true;
    //     this.irfqViewModel.preferredMfgLocationIds.push(localStorage.getItem('territoryId'));
    //   } else {
    //     this.isCommunityRfq = false;
    //   }
    // }
    this.isFromPartLibrary = this._rfqService.get('isPartFromLibrary');
    if (this.isFromPartLibrary && this.isFromPartLibrary !== undefined) {
      this.getAddedPartFromLibrary();
    }

    this.getRFQPurposeList();
    this.trackBuyerCreateRfqPageLanding();
    this.getCountsOfRfqs()
  }

  trackBuyerCreateRfqPageLanding() {
    this._rfqService.trackBuyerCreateRfqPageLanding(this.loggedContactId).subscribe(res => {

    })
  }
  getRFQPurposeList() {
    this._rfqService.getRFQPurposeList().subscribe(
      response => {
        if (!response.isError) {
          this.rfqPurposeModelList = response.data;
        }
      }
    );
  }
  iniITempUploadedFiles() {
    this.ITempUploadedFiles = {
      fileName: '',
      isProcessed: false
    };
  }
  initSpecialFileModel() {
    this.SpecialInvitedModel = {
      inviteId: 0,
      type: ''
    };
  }
  initSpecialInvitedNameModel() {
    this.SpecialInvitedNameModel = {
      inviteId: 0,
      type: '',
      isDelete: false,
      name: ''
    };
  }
  getAddedPartFromLibrary() {
    this.isFromPartLibrary = this._rfqService.get('isPartFromLibrary');
    if (this.isFromPartLibrary && this.isFromPartLibrary !== undefined) {
      this._rfqService.set(false, 'isPartFromLibrary');
      this.iPartFromLibraryColl = this._rfqService.get('selectedPartForRfq');
      this.iPartFromLibraryTempColl = this._rfqService.get('selectedPartForRfq');

      if (this.iPartFromLibraryColl.length !== 0) {
        const fristPart = this.iPartFromLibraryColl[0];
        this.addPartLibraryToRFQ(fristPart);
        this.iPartFromLibraryColl[0].result = false;
        this.totalProcessed = 1;
      }
    }
  }
  addRemaining() {
    if (this.totalProcessed !== this.iPartFromLibraryColl.length) {
      this.iPartFromLibraryColl.forEach(element => {
        if (!this.isPartLibraryApiCall && element.result) {
          this.addPartLibraryToRFQ(element);
          element.result = false;
          this.totalProcessed = this.totalProcessed + 1;
        }
      });
    }
  }
  addFirstPartUploaded() {
    // debugger;
    // console.log('Strat addFirstPartUploaded');
    // console.log(this.activePartId, 'activePartId')
    this.iPartsViewModelColl = [];
    // console.log(this.ITempUploadedFilesColl[0], 'ITempUploadedFilesColl')
    // const firstPart = this.ITempUploadedFilesColl[0];
    // this.ITempUploadedFilesColl[0].isProcessed = true;
    this.addUpPart('New Part');
    // if(this.ITempUploadedFilesColl[0] !== null || this.ITempUploadedFilesColl[0] !== undefined) {  
    //    const firstPart = this.ITempUploadedFilesColl[0];
    //   // this.ITempUploadedFilesColl[0].isProcessed = true;
    //   this.addUpPart(this.ITempUploadedFilesColl[0]);
    // } else {
    //   debugger;
    //   this.addUpPart('Your First Part'); 
    // }
    this.totalUpPartProcessed = 1;
  }
  addPartUploaded() {
    // debugger;
    // console.log('Strat addPartUploaded');
    // console.log(this.totalUpPartProcessed + "-" + this.ITempUploadedFilesColl.length);
    if (this.totalUpPartProcessed !== this.ITempUploadedFilesColl.length) {
      // console.log('addPartUploaded If block');
      this.ITempUploadedFilesColl.forEach(element => {
        if (!this.isPartUploadApiCall && !element.isProcessed) {
          // console.log('if  true');
          this.addUpPart(element.fileName);
          element.isProcessed = true;
          this.totalUpPartProcessed = this.totalUpPartProcessed + 1;
        }
      });
    } else {
      // console.log('addPartUploaded Else block');
      this.getRfqParts('partFileDropped');
      this.totalUpPartProcessed = 0;
      this.ITempUploadedFilesColl = [];
      this.iniITempUploadedFiles();
      // this.partUplodcount = 0;
    }
  }
  addUpPart(fNmae) {
    this.initPartViewModel();
    if (!this.isPartUploadApiCall) {
      // console.log('Strat addUpPart');
      this.isPartUploadApiCall = true;
      this.iPartsViewModel.rfqPartFile = fNmae;
      this.iPartsViewModel.primaryPartFile = fNmae;
      // tslint:disable-next-line:radix
      this.iPartsViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
      this.iPartsViewModel.companyId = this.iContactViewModel.companyId;
      this.iPartsViewModel.rfqId = this.irfqViewModel.rfqId;
      const filenNameArray = fNmae.split('_S3_');
      this.iUploaadedFileName.oFileName = filenNameArray[1];
      this.iUploaadedFileName.CompleteFileName = fNmae;
      this.iPartsViewModel.partsFiles = [];
      if (this.isCommunityRfq) {
        this.iPartsViewModel.isCommunityRfq = true;
      } else {
        this.iPartsViewModel.isCommunityRfq = false;
      }
      this._rfqService.addPart(this.iPartsViewModel).subscribe(
        result2 => {
          // if (this.irfqViewModel.result === true) {
          // debugger;
          if (result2.result === true) {
            // this.partUplodcount =  this.partUplodcount + 1;
            this.irfqViewModel.rfqId = result2.rfqId;
            if (this.irfqViewModel.rfqName == null || this.irfqViewModel.rfqName == undefined || this.irfqViewModel.rfqName == '') {
              this.irfqViewModel.rfqName = result2.rfqId.toString();
            }
            this.isPartUploadApiCall = false;
            this.iPartsViewModel = result2;
            if (this.iPartsViewModel.parentPartCategoryId == null || this.iPartsViewModel.parentPartCategoryId == undefined) {
              this.iPartsViewModel.parentPartCategoryId = 0;
            }
            if (this.iPartsViewModel.childPartCategoryId == null || this.iPartsViewModel.childPartCategoryId == undefined) {
              this.iPartsViewModel.childPartCategoryId = 0;
            }
            localStorage.setItem('isNewUser', 'false');
            console.log('Strat addUpPart success');

            this.addPartUploaded();
            this.setCommunitySuppplier();
            this.getRfqParts('partFileDropped');
          } else {
            this._toastr.error(result2.errorMessage, 'Error!');
          }
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );

    }

  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    this.routeSub.unsubscribe();
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    localStorage.removeItem('manufactureId');
    localStorage.removeItem('cmrfq');
    localStorage.removeItem('territoryId');
    this._rfqService.setCloneClose(false);
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

  inintShippingAddress() {
    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      country: '',
      city: '',
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
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
      modifiedBy: this.loggedContactId,
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

  initUpdateRFQViewModel() {
    this.iUpdateRFQViewModel = {
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
      modifiedBy: this.loggedContactId,
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
      isDefaultPrefRfqCommunicationMethod: false,
      prefRfqCommunicationMethod: null,
      isStripeSupplier: false,
      isAllowQuoting: false,
      isAwardingEnabled: false,
      rfqPurpose: null,

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
      modifiedBy: this.loggedContactId,
      partCommodityCode: '',
      partDescription: '',
      materialId: 0,
      partQtyUnitId: 0,
      // partCategoryId: 0,
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
      parentCategoryName: '',
      childCategoryName: '',
      isDefaultParentPartCategory: false,
      isDefaultChildPartCategory: false,
      isChildCategorySelected: false,
      isChildSameAsParent: false,
      rfqPartDrawerAnswerList: null,
    };
  }
  initContactViewModel() {
    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true,
      ihde: false
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
      country: '',
      city: '',
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iDefaultAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      country: '',
      city: '',
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iCompanyShippingSiteViewModel = {
      addressId: 0,
      companyName: '',
      compId: 0,
      contId: 0,
      defaultSite: true,
      siteCreationDate: '',
      siteId: 0,
      siteLabel: '',
      addresses: this.iAddressModel
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      originalContactPictureFile: '',
      contactIdEncrypt: '',
      originalLogoOfCompany: '',
      companyId: 0,
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      isLoginFromVision: false,
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      token: '',
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
      website: '',
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };
    this.GetProfileDetails();

  }
  initRfqPartQuantityViewModel() {
    this.iRfqPartQuantityViewModel = {
      rfqPartQuantityId: 0,
      rfqPartId: 0,
      partQty: 0,
      quantityLevel: 0
    };
    this.iPartUploadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iUploaadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iUploaadedFileNameList = {
      FileNameList: []
    };
    this.iUploadedGenAttachFileNmList = {
      GenAttachFileNmList: []
    };
    this.resetShppingForCYP();
    this.resetSubmittingForCYP();
    this.iInfoModelCYP = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      companyId: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      isLoginFromVision: false,
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      token: '',
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
      address: this.iAddressModelCYP,
      company: this.iCompanyModel,
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
      instagram: ''
    };
    this.iShippingAddressModelCYP = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      contactIdEncrypt: '',
      companyId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactFunction: '',
      isLoginFromVision: false,
      contactId: 0,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      token: '',
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
      address: this.iAddressModelCYP,
      company: this.iCompanyModel,
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
      instagram: ''
    };
    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true,
      ihde: false
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
      country: '',
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iDefaultAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      country: '',
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iCompanyShippingSiteViewModel = {
      addressId: 0,
      companyName: '',
      compId: 0,
      contId: 0,
      defaultSite: true,
      siteCreationDate: '',
      siteId: 0,
      siteLabel: '',
      addresses: this.iAddressModel
    };
    this.iPartUploadedFileNameList = {
      FileNameList: []
    };

    this.iUploaadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iManufacturersViewModel = {
      bookId: 0,
      bkType: 0,
      bkName: '',
      contId: 0,
      parentBookId: 0,
      statusId: 0,
      rfqId: 0,
      errorMessage: '',
      result: true,
      companyId: 0,
      individualList: [],
      groupList: []
    };
  }
  resetSubmittingForCYP() {
    this.iAddressModel1 = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      country: '',
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iCompanyShippingSiteViewModel1 = {
      addressId: 0,
      companyName: '',
      compId: 0,
      contId: 0,
      defaultSite: true,
      siteCreationDate: '',
      siteId: 0,
      siteLabel: '',
      addresses: this.iAddressModel
    };
  }
  resetShppingForCYP() {
    this.iAddressModelCYP = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      country: '',
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.iShppingForCYP = {
      addressId: 0,
      companyName: '',
      compId: 0,
      contId: 0,
      defaultSite: true,
      siteCreationDate: '',
      siteId: 0,
      siteLabel: '',
      addresses: this.iAddressModelCYP1
    };
    this.iAddressModelCYP1 = {
      address5: '',
      addressId: 0,
      addressType: 2,
      city: '',
      countryId: 0,
      country: '',
      deptAddress: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
  }
  resetNDAViewModel() {
    this.iNDAViewModel = {
      contactId: 0,
      ndaLevel: 0,
      ndaFile: '',
      ndaContent: '',
      result: false,
      errorMessage: '',
      fileId: 0,
      ndaId: 0,
      companyId: 0,
      rfqId: 0,
      fileType: '',
      isDefaultNDAdetails: false,
    };
  }

  initShippingAddress() {
    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      deptAddress: '',
      country: '',
      errorMessage: '',
      isActive: true,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
    this.partGotFromLibraryColl = [];
    this.idForPartGotFromLibraryColl = [];
    this.iPartLibraryModelDetailsColl = [];
  }
  resetQuantityModel() {
    this.iRfqPartQuantityViewModel = {
      rfqPartQuantityId: 0,
      rfqPartId: 0,
      partQty: 0,
      quantityLevel: 0
    };
  }
  getMaxdateFromPart() {

    if (this.irfqViewModel.deliveryDate !== null) {
      this.iPartsViewModel.deliveryDate = moment.utc(this.irfqViewModel.deliveryDate).toDate();
    }
    const totPartLen = this.iPartsViewModelColTemp.length;
    if (totPartLen > 0) {
      const tempPartsviewModelColl = JSON.stringify(this.iPartsViewModelColTemp);
      const tempPartsviewModelColl1: IPartsViewModel[] = JSON.parse(tempPartsviewModelColl);
      tempPartsviewModelColl1.sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
      this.maxDeliverDate = new Date(tempPartsviewModelColl1[0].deliveryDate);
    }
  }

  resetPartViewModel() {
    this.iPartsViewModel = {
      depth: 0,
      diameter: 0,
      customPartDescription: '',
      height: 0,
      isUpdatedFromVision: false,
      length: 0,
      partSizeUnitId: 0,
      surface: 0,
      volume: 0,
      width: 0,
      partId: 0,
      partName: '',
      partNumber: '',
      modifiedBy: this.loggedContactId,
      partCommodityCode: '',
      rfqPartId: 0,
      partDescription: '',
      materialId: 0,
      partQtyUnitId: 1,
      // partCategoryId: 0,
      statusId: 0,
      companyId: 0,
      contactId: 0,
      currencyId: 0,
      creationDate: '',
      modificationDate: '',
      rfqId: 0,
      rfqPartQuantityList: [{
        rfqPartQuantityId: 0,
        rfqPartId: 0,
        partQty: 0,
        quantityLevel: 0
      }],
      deliveryDate: null,
      partsFiles: [],
      rfqPartFile: '',
      errorMessage: '',
      result: false,
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
      childPartCategoryId: 0
    };
  }
  resetFileNameModel() {
    this.iUploaadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
  }





  // Model Initialization Ends

  // Extra Functions

  forEditMode() {
    if (this.isEditMode) {
      this.irfqViewModel.rfqId = this.editRfqId;
      this.irfqViewModel.rfqName = this.editRfqName;
      this.getSavedRFQDetails();
      this.getCertificateList();
      this.getCustomNda();
      this.getManufacturesByRfq();

      this.isFileDropped = true;
    } else {
      this.isDecideToShow = false;
    }
  }
  isPartsAdded1: boolean = false;
  decideTabToShow() {
    const RFq = this.irfqViewModel;
    if (this.iPartsViewModelColl.length !== 0 && this.isPartsAdded() == false) {
      this.isSecondTabCompleted = true;
      this.isThirdTabCompleted = true;
    } else {
      this.isSecondTabCompleted = false;
    }
    if (this.toShowQuantityUnit) {
      return;
    }
    if (this.isSecondTabCompleted && !this.isThirdTabCompleted) {

      this.onSearchChange();
      window.scrollTo(0, 0);
      this.isDecideToShow = false;
    }
    if (this.isSecondTabCompleted && this.isThirdTabCompleted) {

      this.isAddPart = false;
      this.isRfqDetails = true;
      this.isSidePanel = false;
      this.addShippingform = false;
      this.isPartClicked = false;
      this.addressList = false;
      this.isPartsLibrarayClicked = false;
      this.loadAddress();
      this.isDecideToShow = false;
      this.getCertificateList();
      window.scrollTo(0, 0);
      setTimeout(() => {
        regiserEvent2();
      }, 3000);
    }

  }


  checkDeleveryDate() {
    if (this.iPartsViewModel.deliveryDate === null) {
      this.isDeliveryDateError = true;
    } else {
      this.isDeliveryDateError = false;
      // this.iPartsViewModelColTemp[0].deliveryDate = this.iPartsViewModel.deliveryDate
      // this.getMaxdateFromPart()

    }
  }
  firstFocus() {
    if (this.firstQuantity === null) {

    } else if (this.firstQuantity === 0) {
      this.quantityError1 = 'Quantity cant be zero';
    } else {
      this.quantityError1 = '';
    }
  }
  secondFocus() {
    if (this.secondQuantity === null) {

    } else {
      if (this.secondQuantity === 0) {
        this.quantityError2 = 'Quantity cant be zero';
      }
    }
  }
  thirdFocus() {
    if (this.thirdQuantity === null) {

    } else {
      if (this.thirdQuantity === 0) {
        this.quantityError3 = 'Quantity cant be zero';
      }
    }
    if (this.thirdQuantity === 0 || this.thirdQuantity * 1 === 0 || this.thirdQuantity === null) {
      this.thirdQuantity = null;
    } else { }
  }


  checkfirstQuantity() {
    const quantity = Number(this.firstQuantity);
    if (this.firstQuantity === null || this.firstQuantity.toString() === '' || isNaN(quantity)) {
      this.quantityError1 = 'Please enter the quantity';
      this.firstQuantity = null;
    } else {
      if (quantity === 0) {
        this.firstQuantity = null;
        this.quantityError1 = 'Quantity cant be zero';
      } else {
        this.quantityError1 = '';
      }
    }

    if (this.firstQuantity === 0 || this.firstQuantity * 1 === 0 || this.firstQuantity === null) {

      this.firstQuantityRequiredError = true;

    } else {
      this.firstQuantityRequiredError = false;
    }

    if (this.secondQuantityDiv) {
      if (this.secondQuantity !== null) {
        if (this.secondQuantity * 1 === this.firstQuantity * 1) {
          this.firstQuantity = null;
          this.firstQuantitySameError = true;
          this.quantityError1 = 'Quantity cant be same';
          this.isSameQuantityError = true;
          return true;
        } else {
          this.firstQuantitySameError = false;
          this.isSameQuantityError = false;
          return false;
        }
      } else {
        this.firstQuantitySameError = false;
        this.isSameQuantityError = false;
        return false;
      }

    }
    if (this.thirdQuantity) {
      if (this.thirdQuantity * 1 === this.firstQuantity * 1) {
        this.firstQuantity = null;
        this.firstQuantitySameError = true;
        this.quantityError1 = 'Quantity cant be same';
        this.isSameQuantityError = true;

      } else {
        this.firstQuantitySameError = false;
        this.isSameQuantityError = false;

      }
    }
  }
  checksecondQuantity() {
    const quantity = Number(this.secondQuantity);
    if (this.secondQuantity === null || this.secondQuantity.toString() === '' || isNaN(quantity)) {
      this.secondQuantity = null;
      this.quantityError2 = 'Please enter the quantity';
    } else {
      if (quantity === 0) {
        this.secondQuantity = null;
        this.quantityError2 = 'Quantity cant be zero';
      } else {
        this.quantityError2 = '';
      }
    }
    if (!this.secondQuantityRequiredError) {
      if (!this.thirdQuantityDiv) {
        if (this.firstQuantity * 1 === this.secondQuantity * 1) {
          this.secondQuantity = null;
          this.secondQuantitySameError = true;
          this.isSameQuantityError = true;
          this.quantityError2 = 'Quantity cant be same';

        } else {
          this.secondQuantitySameError = false;
          this.isSameQuantityError = false;

        }
      }
      if (this.thirdQuantityDiv) {
        if (this.firstQuantity * 1 === this.secondQuantity * 1 || this.firstQuantity * 1 === this.thirdQuantity * 1) {
          this.secondQuantity = null;
          this.secondQuantitySameError = true;
          this.isSameQuantityError = true;
          this.quantityError2 = 'Quantity cant be same';

        } else {
          this.secondQuantitySameError = false;
          this.isSameQuantityError = false;

        }
      }
    }


  }
  checkthirdQuantity() {
    const quantity = Number(this.thirdQuantity);
    if (this.thirdQuantity === null || this.thirdQuantity.toString() === '' || isNaN(quantity)) {
      this.firstQuantity = null;
      this.quantityError3 = 'Please enter the quantity';
    } else {
      if (quantity === 0) {
        this.thirdQuantity = null;
        this.quantityError3 = 'Quantity cant be zero';
      } else {
        this.quantityError3 = '';
      }
    }
    if (!this.thirdQuantityRequiredError) {
      if (this.secondQuantityDiv) {
        if (this.secondQuantity * 1 === this.thirdQuantity * 1 || this.firstQuantity * 1 === this.thirdQuantity * 1) {
          this.thirdQuantity = null;
          this.thirdQuantitySameError = true;
          this.isSameQuantityError = true;
          this.quantityError3 = 'Quantity cant be same';
          return true;
        } else {
          this.thirdQuantitySameError = false;
          this.isSameQuantityError = false;
          return false;
        }
      } else {
        if (this.firstQuantity * 1 === this.thirdQuantity * 1) {
          this.thirdQuantity = null;
          this.thirdQuantitySameError = true;
          this.isSameQuantityError = true;
          this.quantityError3 = 'Quantity cant be same';
          return true;
        } else {
          this.thirdQuantitySameError = false;
          this.isSameQuantityError = false;
          return false;
        }
      }
    }
  }
  configDatePicker() {
    if (this.irfqViewModel.quotesNeededBy !== null) {
      this.deliveryMinDate = new Date(this.irfqViewModel.awardDate);
      this.deliveryMinDate.setDate(this.deliveryMinDate.getDate());
    } else {
      this.minDate = new Date();
      this.minDate.setDate(this.minDate.getDate());
      this.awardMinDate = new Date();
      this.awardMinDate.setDate(this.awardMinDate.getDate());
      // deliveryMIndate
      this.deliveryMinDate = new Date();
      this.deliveryMinDate.setDate(this.deliveryMinDate.getDate());
    }
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  initializeModel() {
    this.iTerritoryClassificationNames = {
      territoryClassificationName2: '',
      territoryClassificationName3: '',
      territoryClassificationName4: '',
      territoryClassificationName5: '',
      territoryClassificationName6: '',
      territoryClassificationName7: ''
    };
    this.initRfqBuyerStatus();
    this.initRfqModel();
    this.initUpdateRFQViewModel();
    this.initPartViewModel();
    this.initContactViewModel();
    this.initRfqPartQuantityViewModel();
    this.getBuyerLocation();
    this.getSettingPreference();
  }
  checkForEditMode() {
    if (this.editRfqId !== 0 && this.editRfqId !== undefined) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }
  checkRFQName() {
    const formValue = this.irfqForm.value.rfqName;
    if (formValue.trim().length > 0) {
      return true;
    } else {
      return false;
    }
  }
  // getOriginalPartName (fileName) {
  //   this.oappendText = '';
  //   let fixStr: '';
  //   if (fileName) {
  //     const filenNameArray = fileName.split('_S3_');
  //     if (filenNameArray.length === 1) {
  //       const charactorCount = filenNameArray[0].length;
  //       if (charactorCount > 60 ) {
  //          fixStr =  fileName.slice(0, 60);
  //          this.oappendText = fixStr.concat(this.appendText);
  //       } else {
  //         return filenNameArray[0];
  //       }
  //     } else {
  //       const charactorCount = filenNameArray[1].length;
  //       if (charactorCount > 60 ) {
  //          fixStr =  fileName.slice(0, 60);
  //          this.oappendText =  fixStr.concat(this.appendText);
  //          return this.oappendText;
  //       } else {
  //         return filenNameArray[1];
  //       }
  //     }
  //   }
  // }
  // getShortOriginalPartName (fileName) {
  //   this.oappendText = '';
  //   this.appendText = '..';
  //   let fixStr: '';
  //   if (fileName) {
  //     const filenNameArray = fileName.split('_S3_');
  //     if (filenNameArray.length === 1) {
  //       const charactorCount = filenNameArray[0].length;
  //       if (charactorCount > 15 ) {
  //          fixStr =  filenNameArray[0].slice(0, 15);
  //          this.oappendText = fixStr.concat(this.appendText);
  //       } else {
  //         return filenNameArray[0];
  //       }
  //     } else {
  //       const charactorCount = filenNameArray[1].length;
  //       if (charactorCount > 15 ) {
  //          fixStr =  filenNameArray[1].slice(0, 15);
  //          this.oappendText =  fixStr.concat(this.appendText);
  //          return this.oappendText;
  //       } else {
  //         return filenNameArray[1];
  //       }
  //     }
  //   }
  // }
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }
  patchPartDetails() {
    this.iPartUploadedFileNameList.FileNameList = [];
    if (this.iPartsViewModel.partsFiles) {
      // console.log(this.iPartsViewModel.partsFiles, 'this.iPartsViewModel.partsFiles')
      this.iPartsViewModel.partsFiles.forEach(x => {
        let oriFileName = '';
        if (x !== null) {
          const fileNameArray = (x).split('_S3_');
          if (fileNameArray) {
            oriFileName = fileNameArray[1];
          }
          this.iPartUploadedFileNameList.FileNameList.push({
            oFileName: oriFileName,
            CompleteFileName: x
          });
        }
      });
    }
  }
  redirectToMyRFQ() {
    // this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
    this.router.navigateByUrl('/rfq/myrfq');
    // });

  }

  patchQuantities(RfqPartQuantityId, RfqPartId, PartQty, QuantityLevel) {
    return this._fb.group({
      rfqPartQuantityId: [RfqPartQuantityId],
      rfqPartId: [RfqPartId],
      partQty: [PartQty, [Validators.pattern(appConstants.pattern.DECIMAL_VALID)]],
      quantityLevel: [QuantityLevel]
    });
  }
  onFileSelected($event: any) {
    this.uploadPartDetailsFiles();
    $event.srcElement.value = '';
  }
  showHideRFQPartDrawerDetails(id) {
    id.ShowDetials = !id.ShowDetials;
  }
  showHideRFQPartDetails(id) {
    this.activePart = id;
    const data = this.iReviewPartsViewModelColl.find(m => m.rfqPartId === id);
    this.iReviewPartsViewModel = data;
    data.result = !data.result;
    this.isPartActive = !this.isPartActive;
    // id.ShowDetials = !id.ShowDetials;
  }
  getImageForPart(partFile: IPartLibraryModel) {
    let imageURLToSet = 'assets/rfq/group-3.png';
    if (!!partFile.primaryPartFile) {
      const fileExt = partFile.primaryPartFile.split('.')[1];
      if (!fileExt || (fileExt !== '')) {
        if (fileExt === 'png') {
          imageURLToSet = 'assets/filetype/png.png';
        } else if (fileExt === 'jpeg') {
          imageURLToSet = 'assets/filetype/jpg.png';
        } else if (fileExt === 'jpg') {
          imageURLToSet = 'assets/filetype/jpg.png';
        } else if (fileExt === 'pdf') {
          imageURLToSet = 'assets/filetype/pdf.png';
        } else if (fileExt === 'mp4') {
          imageURLToSet = 'assets/filetype/mp4.png';
        } else if (fileExt === 'zip') {
          imageURLToSet = 'assets/filetype/zip.png';
        }
      }
    }
    return imageURLToSet;
  }

  getOriginalFineName(fileName) {
    if (fileName !== null) {
      const filenNameArray = (fileName).split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }

  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }
  openTilesView() {
    this.isTilesView = false;
    this.isGridView = true;
  }

  gotoRFQDetails() {
    this.fromGetStartedFlow = 'false';
    localStorage.setItem('fromGetStartedFlow', this.fromGetStartedFlow)
    //  debugger;
    this.isSidePanel = false;
    if (!this.toShowQuantityUnit) {
      if (!this.isSecondTabCompleted) {
        // debugger;
        this.isRfqName = false;
        // this.isRfqNameStatus = true;
        this.isAddPartStatus = true;
        this.isAddPartActive = true;
        this.isAddPart = false;
        this.isSaveRfqDetailsBtnClicked = false;
        this.isRfqDetails = true;
        this.isRfqDetailsActive = true;
        this.isRfqDetailsStatus = false;
        this.isSidePanel = false;
        this.addShippingform = false;
        this.isPartClicked = false;
        this.addressList = false;
        this.isPartsLibrarayClicked = false;
        this.getCustomNda();
        this.getCertificateList();
        this.getRfqParts('');
        // this.getMaxdateFromPart();
        this.getManufacturesByRfq();
        this.loadAddress();
        this.updateRFQdetails();
        if (this.DicoverIdForRfqColl.length !== 0) {
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
          this.dispalyIndividualGrpsAttachment = true;
        }
      } else if (!this.isThirdTabCompleted) {
        // debugger;
        this.loadAddress();
        this.isRfqName = false;
        // this.isRfqNameStatus = true;
        this.isAddPartStatus = true;
        this.isAddPartActive = true;
        this.isAddPart = false;
        this.isSaveRfqDetailsBtnClicked = false;
        this.isRfqDetails = true;
        this.isRfqDetailsActive = true;
        this.isRfqDetailsStatus = false;
        if (this.DicoverIdForRfqColl.length !== 0) {
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
          this.dispalyIndividualGrpsAttachment = true;
        }
        this.isSidePanel = false;
        this.addShippingform = false;
        this.isPartClicked = false;
        this.addressList = false;
        this.isPartsLibrarayClicked = false;
        this.getCertificateList();
        this.getManufacturesByRfq();
        this.getMaxdateFromPart();
      } else if (this.isSecondTabCompleted && this.isThirdTabCompleted) {
        // debugger;
        this.isRfqName = false;
        this.isAddPart = false;
        if (this.DicoverIdForRfqColl.length !== 0) {
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
          this.dispalyIndividualGrpsAttachment = true;
        }
        this.isRfqDetails = true;
        this.isSidePanel = false;
        this.addShippingform = false;
        this.isPartClicked = false;
        this.addressList = false;
        this.isPartsLibrarayClicked = false;
        this.getCustomNda();
        this.getCertificateList();
        this.loadAddress();
        this.getManufacturesByRfq();
        this.updateRFQdetails();
      }
      if (this.DicoverIdForRfqColl.length !== 0) {
        this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
        this.dispalyIndividualGrpsAttachment = true;
        this.checkMufacture();
      }
      this.isSecondTabCompleted = true;
      this.partCategoryIdColl = [];
      for (const partObj of this.iPartsViewModelColl) {
        if (partObj.childPartCategoryId !== 0) {
          if (this.partCategoryIdColl.length < 2) {
            if (!this.partCategoryIdColl.includes(partObj.childPartCategoryId)) {
              this.partCategoryIdColl.push(partObj.childPartCategoryId);
            }
          }
        }
      }
      window.scrollTo(0, 0);
      setTimeout(() => {
        regiserEvent2();
      }, 3000);
      this.getMaxdateFromPart();
    } else {
      this._toastr.warning('Please select quantity unit', 'Warning')
    }
    this.triggerPendo(this.rfqCountdata,"Step 2")
  }
  isDisableNextBtn: boolean = false;
  updateRFQdetails() {
    this.irfqViewModel.isDefaultNDAdetails = this.irfqViewModel.isDefaultNDAdetails;
    // if (this.irfqViewModel.isDefaultNDAdetails) {
    //   this.irfqViewModel.isProfileNDA = true;
    // }
    if (this.activeTab === 0) {
      this.irfqViewModel.ndaTypekey = 'RFX_SECURITYTYPE_NO_SECURE';
    } else if (this.activeTab === 1) {
      this.irfqViewModel.ndaTypekey = 'RFX_SECURITYTYPE_TOTALY_SECURE';
    } else if (this.activeTab === 2) {
      this.irfqViewModel.ndaTypekey = 'RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR';
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
    } else {
      if (this.CustomNdaFileName !== '') {
        this.irfqViewModel.ndaFile = this.CustomNdaFileName;
        // this.isDisableNextBtn =  true;
      } else {
        this.irfqViewModel.ndaContent = this.defaultNdaMessage;
      }
    }
    this.irfqViewModel.contactId = this.loggedId;
    this.UpdateRFQNDA();
    // if(this.irfqViewModel.ndaFile != null) {
    //   this.isDisableNextBtn =  true;
    //   this.UpdateRFQNDA();
    // } else {
    //   this.isDisableNextBtn =  false;
    //   this.UpdateRFQNDA();
    // }


  }
  UpdateRFQNDA() {
    console.log(this.irfqViewModel, 'this.irfqViewModel')
    this._rfqService.UpdateRFQNDA(this.irfqViewModel).subscribe(
      result => {
        this.irfqViewModel.rfqId = result['rfqId'];
        this.irfqViewModel.result = result['result'];
        this.irfqViewModel.errorMessage = result['errorMessage'];
        if (this.irfqViewModel.result === true) {
          this.isRfqName = false;
          this.isRfqDetails = false;
          this.isRfqReview = false;
          this.isSidePanel = false;
          this.isFirstTabCompleted = true;
          this.isSecondTabCompleted = true;
          this.isAddPart = true;
          this.isRfqNameBtnClicked = false;
          this._toastr.success(this.irfqViewModel.errorMessage, '');
          this.goToStepThree();
          this.isDisableNextBtn = false;
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
  registerDragEvent() {
    if (this.isDragRegister === false) {
      this.isDragRegister = true;
      regiserEvent2();
    }
  }

  materialTouch() {
    this.isMaterialTouched = true;
  }
  isGoodToHide() {
    if (this.iPartsViewModelColl != null && this.iPartsViewModelColl != undefined &&
      this.iPartsViewModelColl.length != 0 && this.iPartsViewModelColl.length > 1) {
      return false;
    } else {
      return true;
    }
  }
  setSpecialCertificationsTrue() {
    this.irfqViewModel.isSpecialCertificationsByManufacturer = true;
  }
  setSpecialCertificationsFalse() {
    this.irfqViewModel.isSpecialCertificationsByManufacturer = false;
    this.isCertificationError = false;
    this.isSaveRfqDetailsBtnClicked = false;
  }
  setSpecialInstructionTrue() {
    this.irfqViewModel.isSpecialInstructionToManufacturer = true;
  }
  setSpecialInstructionFalse() {
    this.irfqViewModel.isSpecialInstructionToManufacturer = false;
    this.isSaveRfqDetailsBtnClicked = false;
    this.isSpecialInstructionError = false;
  }
  setAllowPartialTrue() {
    this.irfqViewModel.isPartialQuotingAllowed = true;
  }
  setAllowPartialFalse() {
    this.irfqViewModel.isPartialQuotingAllowed = false;
  }
  setPaidByBuyer() {
    this.irfqViewModel.whoPaysForShipping = 1;
    this.irfqViewModel.userType = 1;
  }
  setPaidBySupplier() {
    this.irfqViewModel.whoPaysForShipping = 13;
    this.irfqViewModel.userType = 2;
  }

  isLocationSet(locId) {
    if (this.irfqViewModel.preferredMfgLocationIds !== undefined) {
      return this.irfqViewModel.preferredMfgLocationIds.includes(locId) ? 'Preferred-Manufacturing-active' :
        'Preferred-Manufacturing-deactive';
    }
  }
  /*
  RFQ status:
  1 - Inprogress
  2 - Pending approved
  3 - Quoting
  5 - Closed
  6 - Awaded
  14 - In-compelete
  */
  setResetManufacturingLocation(manfLoc: string) {
    // console.log("manfLoc@@@@",manfLoc)
    if (manfLoc == "2") {
      this.manufactureLocationMixpanel = "Europe"

    } else if (manfLoc == "3") {
      this.manufactureLocationMixpanel = "Asia"

    } else if (manfLoc == "4") {
      this.manufactureLocationMixpanel = "United States"

    } else if (manfLoc == "5") {
      this.manufactureLocationMixpanel = "Canada"

    } else if (manfLoc == "6") {
      this.manufactureLocationMixpanel = "Mexico / South America"

    } else if (manfLoc == "7") {
      this.manufactureLocationMixpanel = "USA & Canada"

    }
    // tslint:disable-next-line:max-line-length
    if (this.irfqViewModel.rfqStatusId === 2 || this.irfqViewModel.rfqStatusId === 3 || this.irfqViewModel.rfqStatusId === 6 ||
      this.irfqViewModel.rfqStatusId === 5 || this.irfqViewModel.rfqStatusId === 16 || this.irfqViewModel.rfqStatusId === 17 || this.irfqViewModel.rfqStatusId === 18) {
      this.irfqViewModel.preferredMfgLocationIds = [];
      if (this.irfqViewModel.preferredMfgLocationIds.includes(manfLoc)) {
        this.irfqViewModel.preferredMfgLocationIds.splice(this.irfqViewModel.preferredMfgLocationIds.indexOf(manfLoc), 1);
      } else {
        this.irfqViewModel.preferredMfgLocationIds.push(manfLoc);
      }
    } else {
      if (this.irfqViewModel.preferredMfgLocationIds.includes(manfLoc)) {
        if (this.irfqViewModel.preferredMfgLocationIds.length > 1) {
          this.irfqViewModel.preferredMfgLocationIds.splice(this.irfqViewModel.preferredMfgLocationIds.indexOf(manfLoc), 1);
        }
      } else {
        if (this.irfqViewModel.preferredMfgLocationIds.length < 3) {
          this.irfqViewModel.preferredMfgLocationIds.push(manfLoc);
          this.irfqViewModel.isDefaultPrefferedManufacturingLocation = false;
        } else {
          this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');
        }
      }
    }
    this.regionError = false;
  }


  onDateChange(date) {

    if (date === 'quotes') {
      if (this.irfqViewModel.quotesNeededBy === null) {
        this.isQuotedByDateError = true;
      } else {
        this.isQuotedByDateError = false;
      }
      this.awardMinDate = new Date(this.irfqViewModel.quotesNeededBy);
      this.awardMinDate.setDate(this.awardMinDate.getDate());
      this.irfqViewModel.awardDate = null;
    }
    if (date === 'edit') {
      // this.awardMinDate.setDate(this.awardMinDate.getDate());
      this.awardMinDate = new Date(this.irfqViewModel.quotesNeededBy);
      this.awardMinDate.setDate(this.awardMinDate.getDate());
    }
    if (date === 'Award') {
      if (this.irfqViewModel.quotesNeededBy === null) {
        this._toastr.warning('Please select Quotes needed by Date first', 'Warning!');
        this.awardMinDate.setDate(this.awardMinDate.getDate());
      } else {
        if (this.irfqViewModel.awardDate === null) {
          this.isAwardDateError = true;
        } else {
          this.isAwardDateError = false;
        }
        // this.awardMinDate = this.irfqViewModel.quotesNeededBy;
        // this.awardMinDate.setDate(this.awardMinDate.getDate());
        this.awardMinDate = new Date(this.irfqViewModel.quotesNeededBy);
        this.awardMinDate.setDate(this.awardMinDate.getDate());
        this.deliveryMinDate = new Date(this.irfqViewModel.awardDate);
        this.deliveryMinDate.setDate(this.deliveryMinDate.getDate());
        this.iPartsViewModel.deliveryDate = null;
      }
    }
    if (date === 'delivery') {
      if (this.iPartsViewModel.deliveryDate === null) {
        this._toastr.warning('Please select Delivery Date', 'Warning!');
        this.deliveryMinDate.setDate(this.deliveryMinDate.getDate());
      } else {
        this.deliveryMinDate = new Date(this.iPartsViewModel.deliveryDate);
        this.deliveryMinDate.setDate(this.deliveryMinDate.getDate());
      }

    }
  }
  toggleRfqQuoteType() {
    // this.irfqViewModel.isRegisterSupplierQuoteTheRfq = !this.irfqViewModel.isRegisterSupplierQuoteTheRfq;
    this.irfqViewModel.isRegisterSupplierQuoteTheRfq = true;
    this.isSidePanel = false;
    this.dispalyIndividualGrps = false;
    this.dispalyIndividualGrpsAttachment = false;
    this.showLetMeChooseValidationMsg = false;
  }
  AddPaymentMode(mode) {
    this.irfqViewModel.payment_term_id = mode;
  }
  reBindGroupList() {
    this.iSupplierGroupViewModelShow.map((obj) => {
      obj.showInListing = true;
      return obj;
    });
    if (this.manufactureList && this.manufactureList.groupList) {
      if (this.manufactureList.groupList.length > 0) {
        (this.manufactureList.groupList).forEach((addedItem) => {
          (this.iSupplierGroupViewModelShow).forEach((item, index) => {
            if (addedItem.supplierGroupId === item.bookId) {
              item.showInListing = false;
            }
          });
        });
      }
    }
    this.checkIfAnyGroup();
  }

  reBindIndivitualList() {
    this.indiContactList.map((obj) => {
      obj.showInListing = true;
      return obj;
    });
    if (this.manufactureList && this.manufactureList.individualList) {
      if (this.manufactureList.individualList.length > 0) {
        (this.manufactureList.individualList).forEach((addedItem) => {
          (this.indiContactList).forEach((item, index) => {
            if (addedItem.companyId === item.companyId) {
              item.showInListing = false;
            }
          });
        });
      }
    }
    this.checkIfAnyGroup();
  }

  checkIfAnyGroup() {
    const count = (this.iSupplierGroupViewModelShow).filter((obj) => obj.showInListing === false).length;
    if (this.iSupplierGroupViewModelShow.length === 1 && count === 1) {
      return true;
    } else {
      return false;
    }
  }

  checkIfAnyIndivitual() {
    const count = (this.indiContactList).filter((obj) => obj.showInListing === false).length;
    if (this.indiContactList.length === 1 && count === 1) {
      return true;
    } else {
      return false;
    }
  }
  closecustomNda() {

    this.isSidePanel = false;
    this.isNdaClicked = false;
    this.removeSelectedFile();
  }
  removeSelectedFile() {

    // this.file.nativeElement.value = '';
    this.ndaUploader.queue.length = 0;
    this.isUploadFileDropped = false;
    this.isUploadFileBrowsed = false;
    this.checkFile = true;
    this.fileDropName = '';
    this.fileBrowseName = '';
  }

  initReviewPage() {

    this.importanceOrder = this.getSortedOrderOfImportance();
    this.preferredMfgLocText = this.getPreferredMfgLoc();
    this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();
    this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
    this.irfqViewModel.deliveryDate = moment.utc(this.irfqViewModel.deliveryDate).toDate();
    this.whoPaysForShippingText = this.keyByValue(this.irfqViewModel.whoPaysForShipping, appConstants.paysForShippingCode);
    this.prefNDATypeText = this.keyByValue(this.irfqViewModel.ndaTypekey, appConstants.NDAType);
    this.getPartsList();
    this.getSavedCustomeNdaFiles();

  }
  getSortedOrderOfImportance() {

    if (this.irfqViewModel) {
      const obj = {
        Speed: this.irfqViewModel.importanceSpeed,
        Price: this.irfqViewModel.importancePrice,
        Quality: this.irfqViewModel.importanceQuality,
      };
      return (Object.keys(obj).sort(function (a, b) {
        return obj[a] - obj[b];
      })).join(', ');
    }
  }
  getPreferredMfgLoc() {
    if (this.irfqViewModel) {
      const obj = [];
      (this.irfqViewModel.preferredMfgLocationIds).forEach(element => {
        if (!!element && (element !== '') && (element !== '0')) {
          const locationNumber = Number(element);
          const data = this.ITerritoryClassificationModelColl.find(m => m.territoryClassificationId === locationNumber)
            .territoryClassificationName;
          obj.push(data);
        }
      });
      return obj.join(', ');
    }
  }
  keyByValue(value, arr) {
    const kArray = Object.keys(arr);
    const vArray = Object.values(arr);
    const vIndex = vArray.indexOf(value);
    return kArray[vIndex];
  }
  addClass(id) {
    console.log("id",id)
    this.activeTab = id;
  }
  addClassNdaVerbiage(id) {
    console.log("id",id)
    this.activeTabNdaVerbiage = id;
    (this.activeTabNdaVerbiage === 1) ? (this.showCustomNdaDiv = false) : (this.showCustomNdaDiv = true);
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
  canShowCustomNdaDiv() {
    if (this.showCustomNdaDiv) {
      if (!!this.CustomNdaFileName && (this.CustomNdaFileName !== '')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  onFileChange(file) {
    this.setInputUpload = true;
    this.isFileNotPDF = false;
    // console.log(file, 'file')
    if (file.target.files[0].type === 'application/pdf') {
      this.isUploadFileBrowsed = true;
      this.isUploadFileDropped = false;
      this.checkFile = false;
      this.ndaUploader.queue.length = 0;
      this.fileBrowseName = file.target.files[0].name;
    } else {
      this.checkFile = true;
      this.setInputUpload = false;
      this.isFileNotPDF = true;
    }
  }
  setDraggableOrderImportance() {
    if (this.irfqViewModel.importancePrice === 2) {
      this.fileprice.nativeElement.src = 'assets/rfq/button-price.png';
    }
    if (this.irfqViewModel.importanceSpeed === 2) {
      this.fileprice.nativeElement.src = 'assets/rfq/button-speed.png';
    }
    if (this.irfqViewModel.importanceQuality === 2) {
      this.fileprice.nativeElement.src = 'assets/rfq/button-quantity.png';
    }

    if (this.irfqViewModel.importancePrice === 3) {
      this.filespeed.nativeElement.src = 'assets/rfq/button-price.png';
    }
    if (this.irfqViewModel.importanceSpeed === 3) {
      // this.filespeed.nativeElement.src = 'assets/rfq/button-speed.png';
    }
    if (this.irfqViewModel.importanceQuality === 3) {
      this.filespeed.nativeElement.src = 'assets/rfq/button-quantity.png';
    }

    if (this.irfqViewModel.importancePrice === 1) {
      this.filequality.nativeElement.src = 'assets/rfq/button-price.png';
    }
    if (this.irfqViewModel.importanceSpeed === 1) {
      this.filequality.nativeElement.src = 'assets/rfq/button-speed.png';
    }
    if (this.irfqViewModel.importanceQuality === 1) {
      // this.filequality.nativeElement.src = 'assets/rfq/button-quantity.png';
    }
  }

  addSecondQuantity() {
    this.secondQuantityDiv = true;
    this.addsecondQuantityDiv = false;
    this.addthirdQuantityDiv = true;
    this.secondQuantity = null;
  }
  addThirdQuantity() {
    this.thirdQuantityDiv = true;
    this.addthirdQuantityDiv = false;
    this.thirdQuantity = null;
  }
  deleteSecondQuantity() {
    if (this.thirdQuantityDiv) {
      this.secondQuantity = this.thirdQuantity;
      this.thirdQuantityDiv = false;
      this.addthirdQuantityDiv = true;
      this.thirdQuantity = null;
    } else {
      this.secondQuantityDiv = false;
      this.thirdQuantityDiv = false;
      this.addsecondQuantityDiv = true;
      this.addthirdQuantityDiv = false;
      this.is2QuantityValid = false;
      this.secondQuantity = null;
      this.thirdQuantity = null;
    }
  }
  deleteThirdQuantity() {
    this.thirdQuantityDiv = false;
    this.addthirdQuantityDiv = true;
    this.is3QuantityValid = false;
    this.thirdQuantity = null;
  }
  // onProcessSelect(item: any) {
  //   this.iPartsViewModel.partCategoryId = item.childDisciplineId;
  //   if (this.selectedItems.length == 0 || this.selectedItems[0].childDisciplineId == 0 || this.selectedItems == null || this.selectedItems == undefined) {
  //     this.iPartsViewModel.isDefaultPartCategory = false;

  //   }
  // }
  // onProcessDeSelect(item: any) {
  //   this.iPartsViewModel.partCategoryId = 0;
  //   if (this.selectedItems.length == 0 || this.selectedItems[0].childDisciplineId == 0 || this.selectedItems == null || this.selectedItems == undefined) {
  //     this.iPartsViewModel.isDefaultPartCategory = false;
  //   }
  // }

  onPostProcessSelect(item: any) {
    this.iPartsViewModel.isDefaultPostProduction = false;
    if (item.childPostProductionProcessId == 0) {
      this.iPartsViewModel.postProductionProcessId = 0;
    } else {
      this.iPartsViewModel.postProductionProcessId = item.childPostProductionProcessId;
    }

    if (this.postProcessselectedItems.length == 0 || this.postProcessselectedItems[0].childPostProductionProcessId == 0 || this.postProcessselectedItems == null || this.postProcessselectedItems == undefined) {
      this.iPartsViewModel.isDefaultPostProduction = false;

    }
  }
  onPostProcessDeSelect(item: any) {
    this.iPartsViewModel.postProductionProcessId = 0;
    this.iPartsViewModel.isDefaultPostProduction = false;
    if (this.postProcessselectedItems.length == 0 || this.postProcessselectedItems[0].childPostProductionProcessId == 0 || this.postProcessselectedItems == null || this.postProcessselectedItems == undefined) {
      this.iPartsViewModel.isDefaultPostProduction = false;

    }
  }
  onMaterialSelect(item: any) {
    // console.log("item@@@@@@@@@",item)
    this.materialNameMixpanel = item.childMaterialName
    // console.log("this.materialNameMixpanel",this.materialNameMixpanel)
    this.materialError = false;
    if (item.childMaterialId == 0) {
      this.iPartsViewModel.materialId = 0;
    } else {
      this.iPartsViewModel.materialId = item.childMaterialId;
    }

    this.iPartsViewModel.isDefaultMaterial = false;
    this.isMaterialValid = false;
    if (this.materialselectedItems.length == 0 || this.materialselectedItems[0].childMaterialId == 0 || this.materialselectedItems == null ||
      this.materialselectedItems == undefined) {
      this.iPartsViewModel.isDefaultMaterial = false;

    }
  }
  onMaterialDeSelect(item: any) {
    this.materialError = false;
    this.iPartsViewModel.materialId = 0;
    this.iPartsViewModel.isDefaultMaterial = false;
    if (this.materialselectedItems.length == 0 || this.materialselectedItems[0].childMaterialId == 0 || this.materialselectedItems == null ||
      this.materialselectedItems == undefined) {
      this.iPartsViewModel.isDefaultMaterial = false;

    }

  }
  onDeSelectAll(event) {
    this.materialError = false;
    this.iPartsViewModel.materialId = 0;
    this.iPartsViewModel.isDefaultMaterial = false;
  }
  onDePostProcessSelectAll() {
    this.iPartsViewModel.postProductionProcessId = 0;
    this.iPartsViewModel.isDefaultPostProduction = false;
  }
  onCertificateSelect(item: any) {
    this.irfqViewModel.certificationsByManufacturer = item.certificateId;
    this.isCertificationError = false;
    this.isSaveRfqDetailsBtnClicked = false;
  }
  isPartSaveSubmit() {
    if (this.secondQuantityDiv === true && this.secondQuantity * 1 === 0) {
      this.is2QuantityValid = true;
    } else {
      this.is2QuantityValid = false;
    }
    if (this.thirdQuantityDiv === true && this.thirdQuantity * 1 === 0) {
      this.is3QuantityValid = true;
    } else {
      this.is3QuantityValid = false;
    }

    const tempNum1 = Number(this.iPartsViewModel.partNumber);
    if (this.iPartsViewModel.rfqPartFile != 'New Part' && this.iPartsViewModel.rfqPartFile != 'Your First Part' && this.iPartsViewModel.partsFiles.length == 0) {
      this.iPartUploadedFileNameList.FileNameList.length = 1;
    }
    if (this.iPartsViewModel.partName.trim() === '' || this.iPartsViewModel.partNumber.trim() === '' ||
      tempNum1 === 0 || this.firstQuantity * 1 === 0 || this.is2QuantityValid || this.is3QuantityValid ||
      this.iPartUploadedFileNameList.FileNameList.length == 0 ||
      this.iPartsViewModel.partNumber === null ||
      // this.iPartsViewModel.deliveryDate === null ||
      this.iPartsViewModel.materialId == 0 || this.iPartsViewModel.materialId == null ||
      this.iPartsViewModel.isExistingPart === null || this.iPartsViewModel.isExistingPart === undefined ||
      this.iPartsViewModel.parentPartCategoryId == 0 || this.iPartsViewModel.parentPartCategoryId === undefined || this.iPartsViewModel.parentPartCategoryId === null ||
      this.iPartsViewModel.rfqPartFile === null || this.iPartUploadedFileNameList.FileNameList.length == 0
    ) {
      // debugger;
      console.log('In isPartSaveSubmit func')
      return true;
    } else {
      console.log("TO BE CHECKED isNumber");

      // if (!isNumber(this.firstQuantity)) {
      //   return true;
      // } else {
      //   return false;
      // }
    }
  }


  addDefaultShipping() {
    if (this.iContactViewModel2 !== undefined) {
      if (this.irfqViewModel.shipTo !== 0 && this.irfqViewModel.shipTo !== null) {
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        for (const entry of this.shippingAddressData) {
          if (this.latestAddressId !== 0) {
            if (entry.siteId === this.latestAddressId) {
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.iDefaultAddressModel.result = true;
              this.irfqViewModel.shipTo = entry.siteId;
              this.isSidePanel = false;
              this.addShippingform = false;
              this.isPartClicked = false;
              this.addressList = false;
              this.isPartsLibrarayClicked = false;
              this.isShip2To = false;
            }
          } else {
            if (entry.siteId === this.irfqViewModel.shipTo) {
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.iDefaultAddressModel.result = true;
              this.irfqViewModel.shipTo = entry.siteId;
              this.isSidePanel = false;
              this.addShippingform = false;
              this.isPartClicked = false;
              this.addressList = false;
              this.isPartsLibrarayClicked = false;
              this.isShip2To = false;
            }
          }

        }
      } else {
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        for (const entry of this.shippingAddressData) {
          if (entry.defaultSite === true) {
            this.iDefaultAddressModel.city = entry.addresses.city;
            this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
            this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
            this.iDefaultAddressModel.country = entry.addresses.country;
            this.iDefaultAddressModel.state = entry.addresses.state;
            this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
            this.iDefaultAddressModel.address5 = entry.siteLabel;
            this.iDefaultAddressModel.addressType = entry.siteId;
            this.iDefaultAddressModel.result = true;
            this.irfqViewModel.shipTo = entry.siteId;
            this.isSidePanel = false;
            this.addShippingform = false;
            this.isPartClicked = false;
            this.addressList = false;
            this.isPartsLibrarayClicked = false;
            this.isShip2To = false;
          }
        }
      }
    }
  }

  makeShippingDefault(id, e) {
    this.checkAddress = e;
    this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
    for (const entry of this.shippingAddressData) {
      if (entry.siteId === id) {
        entry.city = entry.addresses.city;
        entry.deptAddress = entry.addresses.deptAddress;
        entry.postalCode = entry.addresses.postalCode;
        entry.state = entry.addresses.state;
        entry.streetAddress = entry.addresses.streetAddress;
        entry.address5 = entry.siteLabel;
        entry.addressType = entry.siteId;
        entry.defaultSite = true;
        this.irfqViewModel.shipTo = id;
      } else {
        entry.city = entry.addresses.city;
        entry.deptAddress = entry.addresses.deptAddress;
        entry.postalCode = entry.addresses.postalCode;
        entry.state = entry.addresses.state;
        entry.streetAddress = entry.addresses.streetAddress;
        entry.address5 = entry.siteLabel;
        entry.addressType = entry.siteId;
        entry.defaultSite = false;
      }
    }
  }
  editShippingAddress(id: number) {
    this.isSaveAddress = false;
    const data = this.shippingAddressData;
    this.getCountry();
    if (id) {
      for (const entry of this.shippingAddressData) {
        if (entry.siteId === id) {
          this.iShippingAddressesModel = entry;
          this.iAddressModel.city = entry.addresses.city;
          this.iAddressModel.stateId = entry.addresses.stateId;
          this.iAddressModel.countryId = entry.addresses.countryId;
          this.iAddressModel.postalCode = entry.addresses.postalCode;
          this.iAddressModel.deptAddress = entry.addresses.deptAddress;
          this.iAddressModel.addressId = entry.addresses.addressId;
          this.iAddressModel.streetAddress = entry.addresses.streetAddress;
          this.iAddressModel.isActive = entry.defaultSite;
          this.iAddressModel.state = entry.companyName;
          this.cuSiteId = entry.siteId;
          this.iAddressModel.address5 = entry.siteLabel;
          this.createShippingForm();
          this.isSidePanel = true;
          this.isShiiping5 = false;
          this.addShippingform = true;
          this.isPartClicked = false;
          this.addressList = false;
          this.isPartsLibrarayClicked = false;
          this.onCountryChange(id);
        }
      }
    }
  }
  isShippingLimit() {
    return this.isShiiping5;
  }

  isCityStateValid() {
    if (this.shippingForm.value.stateId === 0 || this.shippingForm.value.countryId === 0) {
      return true;
    } else {
      return false;
    }
  }
  changeManuListPanelTab(id) {
    this.manufractureTab = id;
    this.groupSearchText = '';
    this.individualSearchText = '';
    this.onManuGroupSearchChange();
    this.onManuIndividualSearchChange();
  }

  showHideRFQPartInReview(part: IPartLibraryModel) {
    part.result = !part.result;
  }
  isEnableCYPSubmit() {
    if (!this.iInfoModelCYP.firstName || !this.iInfoModelCYP.lastName || !this.iInfoModelCYP.company.name ||
      !this.iShppingForCYP.addresses.streetAddress || !this.iShppingForCYP.addresses.city || !this.iShppingForCYP.addresses.stateId ||
      !this.iShppingForCYP.addresses.postalCode || !this.iShppingForCYP.addresses.countryId) {
      this.isCYPSubmitEnabled = false;
      return false;
    } else {
      this.isCYPSubmitEnabled = true;
      return true;
    }
  }
  confCompanyDetails(flag: boolean) {
    if (flag === false) {
      this.uploadProfileLogoName = '';
      this.tempUploadProfileLogoName = '';
      this.isPhoto = false;
      this.isGoogleSerched = false;
      this.openCYPModel = false;
    }
  }
  handleImageBox() {
    if (this.isPhoto) {
      return 'logoFromPlaceAPI';
    } else {
      if (this.uploadProfileLogoName && (this.uploadProfileLogoName !== '')) {
        return 'pastLogo';
      } else if (this.tempUploadProfileLogoName && (this.tempUploadProfileLogoName !== '')) {
        return 'temporaryUploded';
      } else {
        return 'readyToUpload';
      }
    }
  }


  onCYPLogoChange(file) {
    if ((file.target.files[0].type === 'image/jpeg') || (file.target.files[0].type === 'image/jpg') ||
      (file.target.files[0].type === 'image/png')) {
      this.uploadCYPLogo(this.logoFileCYP.nativeElement.files[0]);
    } else {
      this._toastr.error('Please JPG or PNG file only', 'Error!');
    }
  }
  redirectToNavigationStep(destinaltionStepIndex) {
    this.isRfqNameBtnClicked = false;
    // write logic for going to setp 1
    // if (destinaltionStepIndex === 1) {
    //   this.isRfqName = true;
    //   this.isAddPart = false;
    //   this.isRfqDetails = false;
    //   this.isRfqReview = false;
    //   this.isSidePanel = false;
    // }
    if (destinaltionStepIndex === 2) {
      // if (this.isFirstTabCompleted) {
      // this.isRfqName = false;
      this.isAddPart = true;
      this.isRfqDetails = false;
      this.isRfqReview = false;
      this.isSidePanel = false;
      // }
    }
    if (destinaltionStepIndex === 3) {
      if (this.isSecondTabCompleted) {
        // this.isRfqName = false;
        this.isAddPart = false;
        this.isRfqDetails = true;
        this.isRfqReview = false;
        this.isSidePanel = false;
        this.loadAddress();
        this.addDefaultShipping();
        setTimeout(() => {
          this.setDraggableOrderImportance();
          this.registerDragEvent();
        }, 2000);
      }
    }
  }

  goToStepOne() {
    this.isRfqName = true;
    this.isRfqNameBtnClicked = false;
    this.isAddPart = false;
    this.isRfqDetails = false;
    this.isRfqReview = false;
    this.isSidePanel = false;
  }
  goToStepTwo() {
    this.trackBuyerCreateRfqPageLanding();
    // if (this.isFirstTabCompleted) {
    // this.isRfqName = false;
    this.isAddPart = true;
    this.isRfqDetails = false;
    this.isRfqReview = false;
    this.isSidePanel = false;
    // }

  }
  goToStepThree() {
    if (!this.toShowQuantityUnit) {
      if (this.isSecondTabCompleted) {
        // this.isRfqName = false;
        this.isAddPart = false;
        this.isRfqDetails = true;
        this.isRfqReview = false;
        this.isSidePanel = false;
        this.getRfqParts('');
        // this.onDateChange('edit');
        setTimeout(() => {
          this.setDraggableOrderImportance();
          this.registerDragEvent();
        }, 2000);

      }
    } else {
      this._toastr.warning('Please select quantity unit', 'Warning');
    }

  }
  goToStepFour() {
    if (!this.toShowQuantityUnit) {
      if (this.isSecondTabCompleted && this.isThirdTabCompleted && this.checkSecondStepIsValid() &&
        (this.irfqViewModel.isRegisterSupplierQuoteTheRfq === true || (this.irfqViewModel.isRegisterSupplierQuoteTheRfq === false && this.isIndiOrGroupSelected()))) {
        // this.isRfqName = false;
        this.isAddPart = false;
        this.isRfqDetails = false;
        this.isRfqReview = true;
        this.isSidePanel = false;
      }
    } else {
      this.goToStepTwo();
      this._toastr.warning('Please select quantity unit', 'Warning');
    }
  }

  checkMufacture() {

    if (this.DicoverIdForRfqColl.length !== 0) {
      this.showIndividualGrpsFromSupplier();

      this.DicoverIdForRfqColl.forEach(element => {
        this.SpecialInvitedNameModel.inviteId = element.id;
        this.SpecialInvitedNameModel.isDelete = false;
        this.SpecialInvitedNameModel.name = element.Name;
        this.SpecialInvitedNameModel.type = 'individual';
        this.SpecialInvitedNameModelColl.push(this.SpecialInvitedNameModel);
        this.initSpecialInvitedNameModel();
      });
      this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
      this.dispalyIndividualGrpsAttachment = true;
    }

  }

  isPartsAdded() {
    // debugger;
    const totPart = this.iPartsViewModelColl.length;
    let partDetailCount = 0;
    // debugger;
    for (const entry of this.iPartsViewModelColl) {
      if (entry.isValidDeliveryDate != null && entry.isValidDeliveryDate != undefined && entry.isValidDeliveryDate != false &&
        entry.partName != null && entry.partName != '' && entry.partName != undefined &&
        entry.partNumber != null && entry.partNumber != '' && entry.partNumber != undefined &&
        entry.rfqPartQuantityList != null && entry.rfqPartQuantityList != undefined && entry.rfqPartQuantityList.length != 0 &&
        entry.partQtyUnitId != null && entry.partQtyUnitId != undefined && entry.partQtyUnitId != 0 &&
        entry.materialId != null && entry.materialId != undefined && entry.materialId != 0 &&
        entry.parentPartCategoryId != null && entry.parentPartCategoryId != undefined && entry.parentPartCategoryId != 0) {
        partDetailCount = partDetailCount + 1;
        // partDetailCount = partDetailCount;
      }
      // debugger;
    }
    if (totPart === partDetailCount && totPart !== 0) {
      this.isPartsAdded1 = true;
      return false;
    } else {
      this.isPartsAdded1 = false;
      return true;
    }
  }










  // Extra Functions Ends

  // Form Creation Function
  // createRFQForm() {
  //   this.irfqForm = this._fb.group({
  //     rfqName: [this.irfqViewModel['rfqName'], Validators.required]
  //   });
  // }

  initPartDetailsForm() {
    if (this.iPartsViewModel.partQtyUnitId === 0 || this.iPartsViewModel.partQtyUnitId === null) {
      const data = this.iQuantityUnitColl.find(m => m.value === 'Pieces');
      if (data !== undefined && data !== null) {
        this.iPartsViewModel.partQtyUnitId = data.id;
      }

    }
    if (this.iPartsViewModel.deliveryDate !== null) {
      const deliveryDate = this.iPartsViewModel.deliveryDate;
      this.iPartsViewModel.deliveryDate = new Date(deliveryDate);
    }


    this.patchPartDetails();


  }

  createShippingForm() {

    if (this.CompanyName !== '' && this.CompanyName !== undefined) {
      this.iAddressModel.state = this.CompanyName;
    }

    this.shippingForm = this._fb.group({
      city: [this.iAddressModel['city'], Validators.required],
      deptAddress: [this.iAddressModel['deptAddress']],
      postalCode: [this.iAddressModel['postalCode'], Validators.required],
      stateId: [this.iAddressModel['stateId'], Validators.required],
      countryId: [this.iAddressModel['countryId'], Validators.required],
      streetAddress: [this.iAddressModel['streetAddress'], Validators.required],
      siteLabel: [this.iAddressModel['address5'], Validators.required],
      defaultSite: [this.iAddressModel['isActive']],
      addressId: [this.iAddressModel['addressId']],
      companyName: [this.iAddressModel['state'], Validators.required],
    });
  }

  // Form Creation Function Ends
  getUploadedFiles(files) {
    console.log('My uploaded files', files)
  }
  // Uploader Function
  uploadPartImages() {
    this.uploader.onAfterAddingAll = (fileItem) => {
      // debugger;
      console.log('uploadPartImages', fileItem);
      this.uploadPartDetailsFiles1(fileItem);
    };
  }
  uploadGeneralAttach() {
    this.uploaderGeneralAttach.onAfterAddingFile = (fileItem) => {
      this.fileNum = this.fileNum + 1;
      if (this.fileNum > 100) {
        this._toastr.error('Can not upload more than 100 files.', 'Error!');
      } else {
        this.uploadGenAttachementFile(fileItem);
        fileItem.withCredentials = false;
      }
    };
  }
  uploadGeneralAttachDetail() {
    this.uploaderGeneralAttachDetail.onAfterAddingFile = (fileItem) => {
      this.fileNum = this.fileNum + 1;
      if (this.fileNum > 100) {
        this._toastr.error('Can not upload more than 100 files.', 'Error!');
      } else {
        this.uploadGenAttachementFile(fileItem);
        fileItem.withCredentials = false;
        this.isFileDropped = false;
      }
    };
  }
  uploadcompLogoCYF() {
    this.compLogoCYFUploader.onAfterAddingFile = (fileItem) => {

      if (this.compLogoCYFUploader.queue.length > 1) {
        this.compLogoCYFUploader.queue.length = 0;
      }

      if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg') ||
        (fileItem.file.type === 'image/png')) {
        this.uploadCYPLogo(this.compLogoCYFUploader.queue[0].file.rawFile);
      } else {
        this._toastr.error('Please JPG or PNG file only', 'Error!');
      }
    };
  }
  uploadCYPLogo(fileToUpload: any) {
    this.uploadLogo(fileToUpload).subscribe(
      (res) => {
        const result1 = JSON.parse(res['_body']);
        this.tempUploadProfileLogoName = this.defaultAwsPath + result1['privateFileFileName'];
        // this.iInfoModelCYP.contactPictureFile = result1['fileName'];
        this.iInfoModelCYP.originalContactPictureFile = result1['fileName'];
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
    let fileToUpload = '';
    this.isSaveNda = true;
    if (this.setInputUpload === true) {
      const fi = this.file.nativeElement;
      fileToUpload = fi.files[0];
    } else {
      fileToUpload = this.droppedFile.file.rawFile;
    }
    console.log(fileToUpload, 'fileToUpload')
    this.upload(fileToUpload).subscribe(
      (res) => {

        const result1 = JSON.parse(res['_body']);
        // this.bindFileToRFQ(result1.fileName);
        this.irfqViewModel.isProfileNDA = false;
        this.irfqViewModel.ndaFile = result1.fileName;
        this.irfqViewModel.ndaFileId = 0;
        this.isSaveNda = false;
        this.CustomNdaFileName = result1.fileName;
        this.closecustomNda();
      },
      error => {
        this.isSaveNda = false;
        this.handleError(error);
      },
      () => { }
    );
  }

  // Uploader Function Ends

  // API call Functions
  getQuantity() {
    if (this.iQuantityUnitColl.length === 0) {
      this._masterService.getQuantityUnit().subscribe(
        (data: IQuantityUnit[]) => {
          this.iQuantityUnitColl = data; //.filter(x => [14, 23, 24].includes(x.id));
          this.iQuantityUnitColl.sort((a, b) => {
            const textA = a.value.toUpperCase();
            const textB = b.value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.iQuantityUnitColl.unshift(
            (this.iQuantityUnitColl).splice(
              (this.iQuantityUnitColl).findIndex(
                elt => elt.id === 92),
              1)[0]);
          this.initPartDetailsForm();
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }

  }
  fillDropDown() {
    this.getState();
    this.getCountry();
  }

  getState() {
    if (this.iRegionModelAll.length === 0) {
      this._masterService.getState('0').subscribe(
        (data2: IRegionModel[]) => {
          this.iRegionModelAll = data2['stateData'];
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }
  }
  getCountry() {
    if (this.iCountryColl.length === 0) {
      this._masterService.getCountry().subscribe(
        (data2: ICountryViewModel[]) => {
          this.iCountryColl = data2;
          this.defaultCountry = this.iCountryColl.find(m => m.countryName === 'USA');
          this.iCountryProfileColl = data2;
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }
  }
  onManuIndividualSearchChange() {

    if (this.individualSearchText) {
      this.isIndivitualWithoutSearch = false;
      this._masterService.getSupplierList(this.individualSearchText.trim(), this.loggedId).subscribe(
        (data: IIndividualList[]) => {
          this.indiContactList = data;
          this.indiContactList.sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.indiContactList.map((obj) => {
            obj.showInListing = true;
            return obj;
          });
          this.reBindIndivitualList();
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    } else {
      if (!this.isIndivitualWithoutSearch) {
        this.isIndivitualWithoutSearch = true;
        this._masterService.getSupplierList('', this.loggedId).subscribe(
          (data: IIndividualList[]) => {
            this.indiContactList = data;
            this.indiContactList.sort((a, b) => {
              const textA = a.name.toUpperCase();
              const textB = b.name.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            this.indiContactList.map((obj) => {
              obj.showInListing = true;
              return obj;
            });
            this.reBindIndivitualList();
          },
          error => () => {
            this._toastr.error(error, 'Error!');
          }
        );
      }
    }
  }


  onManuGroupSearchChange() {
    if (this.groupSearchText) {
      this.isGroupWithoutSearch = false;
      // tslint:disable-next-line:radix
      this._masterService.getManuGroupList(this.groupSearchText.trim(), this.loggedId).subscribe(
        (data: IManufacturersViewModel[]) => {
          this.iSupplierGroupViewModelShow = data;
          this.iSupplierGroupViewModelShow.sort((a, b) => {
            const textA = a.bkName.toUpperCase();
            const textB = b.bkName.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.iSupplierGroupViewModelShow.map((obj) => {
            obj.showInListing = true;
            return obj;
          });
          this.reBindGroupList();
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    } else {

      //
      if (!this.isGroupWithoutSearch) {
        this.isGroupWithoutSearch = true;
        // tslint:disable-next-line:radix
        this._masterService.getManuGroupList('', this.loggedId).subscribe(
          (data: IManufacturersViewModel[]) => {
            this.iSupplierGroupViewModelShow = data;
            this.iSupplierGroupViewModelShow.sort((a, b) => {
              const textA = a.bkName.toUpperCase();
              const textB = b.bkName.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            this.iSupplierGroupViewModelShow.map((obj) => {
              obj.showInListing = true;
              return obj;
            });
            this.reBindGroupList();
          },
          error => () => {
            this._toastr.error(error, 'Error!');
          }
        );
      }
    }
  }
  upload(fileToUpload: any) {
    // debugger;
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
  uploadLogo(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + '/Upload/UploadFileLogo';
    return this._Http.post(url, input, {
      headers: headers
    });
  }
  saveRfq() {
    console.log("Save RFQ Function", this.donNotShowOrderManagment)
    if (!this.isRfqNameBtnClicked) {
      this.isRfqNameBtnClicked = true;
      if (this.irfqViewModel.rfqId === 0) {
        if (this.irfqForm.valid) {
          this.isSaveRfqName = true;
          this.irfqViewModel.contactId = this.loggedId;
          this.irfqViewModel.rfqName = this.irfqForm.value.rfqName;
          this._rfqService.addRFQDetails(this.irfqViewModel).subscribe(
            result => {
              this.irfqViewModel.rfqId = result['rfqId'];
              this.irfqViewModel.result = result['result'];
              this.irfqViewModel.errorMessage = result['errorMessage'];
              if (this.irfqViewModel.result === true) {
                this.isSaveRfqName = false;
                this.getAddedPartFromLibrary();
                this.checkMufacture();
                localStorage.setItem('isNewUser', 'false');
                if (!this.isFirstTabCompleted) {
                  this.isRfqNameBtnClicked = false;
                  this.isRfqName = false;
                  this.isFirstTabCompleted = true;
                  // this.isRfqNameStatus = true;
                  this.isAddPartStatus = false;
                  this.isAddPartActive = true;
                  this.isAddPart = true;
                  this.getProcess();
                  this.getMaterial();
                  this.getPostProdProcesses();
                  this.onSearchChange();
                  this.getQuantity();

                }

                this._toastr.success(this.irfqViewModel.errorMessage, 'Success!');
              } else {
                this._toastr.error(this.irfqViewModel.errorMessage, 'Error!');
              }
            },
            error => {
              this.handleError(error);
            },
            () => { }
          );
        } else {
          this._customValidatorsService.validateAllFormFields(this.irfqForm);
        }
      } else {
        // tslint:disable-next-line:radix
        this.irfqViewModel.contactId = this.loggedId;
        if (this.irfqViewModel.rfqName !== this.irfqForm.value.rfqName.trim()) {
          this.irfqViewModel.rfqName = this.irfqForm.value.rfqName;
          this.irfqViewModel.SpecialinviteList = this.SpecialInvitedNameModelColl;

          this._rfqService.AddRFQExtraDetails(this.irfqViewModel).subscribe(
            result => {
              // debugger;
              console.log(result, "result3711");

              this.irfqViewModel.rfqId = result['rfqId'];
              this.irfqViewModel.result = result['result'];
              this.irfqViewModel.errorMessage = result['errorMessage'];
              if (this.irfqViewModel.result === true) {
                this.isRfqName = false;
                this.isRfqDetails = false;
                this.isRfqReview = false;
                this.isSidePanel = false;
                this.isFirstTabCompleted = true;
                this.isSecondTabCompleted = true;
                this.isAddPart = true;
                this.isRfqNameBtnClicked = false;
                this._toastr.success(this.irfqViewModel.errorMessage, '');
              } else {
                this._toastr.error(this.irfqViewModel.errorMessage, 'Error!');
              }
            },
            error => {
              this.handleError(error);
            },
            () => { }
          );
        } else {
          this.isRfqNameBtnClicked = false;
          this.isRfqName = false;
          this.isFirstTabCompleted = true;
          // this.isRfqNameStatus = true;
          if (this.isSecondTabCompleted) {
            this.isAddPartStatus = true;
          }
          this.isAddPartActive = true;
          this.isAddPart = true;
          this.getProcess();
          this.getMaterial();
          this.getPostProdProcesses();
          this.onSearchChange();
          this.getNdaInfo();
        }
      }
    }
  }
  handleError(error) {
    if (error.status === 0) {
      this._toastr.warning('Please check connection', 'Warning!');
    } else if (error.status === 400) {
      this._toastr.warning(JSON.stringify(error.error), 'Warning!');
    } else if (error.status === 401) {
      if (this.statusModalReference !== null && this.statusModalReference !== undefined) {
        this.statusModalReference.close();
      }
      this._toastr.warning('Your session is expired. Please login again to continue.', 'Warning!');
    }
  }
  resetTopButton() {
    // this.isRfqName = true;
    this.isAddPart = true;
    this.isRfqDetails = false;
    this.isRfqReview = false;
    // this.isRfqNameStatus = false;
    this.isAddPartStatus = false;
    this.isRfqDetailsStatus = false;
    this.isRfqReviewStatus = false;
    this.isRfqNameActive = true;
    this.isAddPartActive = false;
    this.isRfqDetailsActive = false;
    this.isRfqReviewActive = false;
    this.isRfqName = false;
    this.isFirstTabCompleted = true;
    this.isRfqNameStatus = true;
    this.isAddPartStatus = false;
    this.isAddPartActive = true;
    this.isAddPart = true;
    this.isSecondTabCompleted = false;
    this.isThirdTabCompleted = false;
  }


  uploadAllPartFiles(fileItem) {
    console.log(fileItem, 'fileItem')
    console.log('uploadAllPartFiles');
    const file = fileItem._file;
    this.upload(file)
      .subscribe(res => {
        this.resetTopButton();
        const result = JSON.parse(res['_body']);
        if (result.result) {
          const fNmae = result['fileName'];
          this.initPartViewModel();
          this.iniITempUploadedFiles();
          this.ITempUploadedFiles.fileName = fNmae;
          this.ITempUploadedFiles.isProcessed = false;
          this.ITempUploadedFilesColl.push(this.ITempUploadedFiles);
          this.partUplodcount = this.partUplodcount + 1;
          localStorage.setItem('isNewUser', 'false');

          if (this.uploader.queue.length === this.partUplodcount) {
            console.log('this.addFirstPartUploaded();');
            // this.getRfqParts('partFileDropped');
            this.addFirstPartUploaded();
          } else {

          }

          // this.iPartsViewModel.rfqPartFile = fNmae;
          // this.iPartsViewModel.primaryPartFile = fNmae;
          // // tslint:disable-next-line:radix
          // this.iPartsViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
          // this.iPartsViewModel.companyId = this.iContactViewModel.companyId;
          // this.iPartsViewModel.rfqId = this.irfqViewModel.rfqId;
          // const filenNameArray = fNmae.split('_S3_');
          // this.iUploaadedFileName.oFileName = filenNameArray[1];
          // this.iUploaadedFileName.CompleteFileName = fNmae;
          // this.iPartsViewModel.partsFiles = [];
          // this._rfqService.addPart(this.iPartsViewModel).subscribe(
          //   result2 => {
          //     this.partUplodcount =  this.partUplodcount + 1;
          //     if (this.irfqViewModel.result === true) {
          //       this.iPartsViewModel = result2;
          //       if (this.uploader.queue.length ===  this.partUplodcount ) {
          //         this.getRfqParts('partFileDropped');
          //       }
          //     } else {
          //       this._toastr.error(this.irfqViewModel.errorMessage, 'Error!');
          //     }
          //   },
          //   error => {
          //     this.handleError(error);
          //   },
          //   () => {}
          // );
          //  this.initPartViewModel();
          this.resetFileNameModel();
        } else {
          this.handleError(result.errorMessage);
        }
      },
        error => {
          this.handleError(error);
        },
        () => { }
      );
  }

  getRfqParts(from) {
    this._rfqService.getRfqParts(this.irfqViewModel.rfqId).subscribe(
      result => {
        this.iPartsViewModelColl = result;
        this.iPartsViewModelColTemp = result;
        console.log("this.iPartsViewModelColTemp Inside", this.iPartsViewModelColTemp)
        if (this.iPartsViewModelColTemp) {
          if (this.iPartsViewModelColTemp.length == 1) {
            if (this.iPartsViewModelColTemp[0].isValidDeliveryDate && this.iPartsViewModelColTemp[0].partName !== '' && this.iPartsViewModelColTemp[0].partNumber !== '' && this.iPartsViewModelColTemp[0].rfqPartQuantityList != null && this.iPartsViewModelColTemp[0].rfqPartQuantityList.length != 0) {
              this.activeNextButton = true
            } else {
              this.activeNextButton = false
            }
          } else {

            let checkCondition = _.find(this.iPartsViewModelColTemp, ['partName', ""]);
            if (checkCondition === undefined) {
              this.activeNextButton = true
            } else {
              this.activeNextButton = false
            }
            // checking the 1Quantity validation
            this.iPartsViewModelColTemp.forEach(element => {
              if (element.rfqPartQuantityList != null && element.rfqPartQuantityList.length != 0) {
                this.activeNextButton = true
              } else {
                this.activeNextButton = false
              }
            });




          }
        }
        // if(this.iPartsViewModelColTemp){
        //   if(this.iPartsViewModelColTemp[0].isValidDeliveryDate && this.iPartsViewModelColTemp[0].partName !== '' && this.iPartsViewModelColTemp[0].partNumber !=='' && this.iPartsViewModelColTemp[0].rfqPartQuantityList !=null && this.iPartsViewModelColTemp[0].rfqPartQuantityList.length !=0){
        //     this.activeNextButton = true
        //   }else{
        //     this.activeNextButton = false
        //   }
        // }
        this.loadAddress();
        this.getCertificateList();
        this.getMaxdateFromPart();
        this.addDefaultShipping();
        this.isDecideToShow = false;
        // Drawer will open in get Started flow and when data is empty 
        // if(from==='partFileDropped' && this.activeNextButton === false) {
        //    this.openPartDetails(this.iPartsViewModelColl[this.iPartsViewModelColl.length - 1].partId, this.iPartsViewModelColl[this.iPartsViewModelColl.length - 1].rfqPartId);
        //    this.isOpenPartDetails = true
        //   }else{
        //   this.isOpenPartDetails = false
        // }
        // **** Remove commented code once condition is checked
        // if(from==='partFileDropped') {
        //   this.openPartDetails(this.iPartsViewModelColl[this.iPartsViewModelColl.length - 1].partId, this.iPartsViewModelColl[this.iPartsViewModelColl.length - 1].rfqPartId);
        // }
        if (this.fromGetStartedFlow === 'true') {
          this.openPartDetails(this.iPartsViewModelColl[this.iPartsViewModelColl.length - 1].partId, this.iPartsViewModelColl[this.iPartsViewModelColl.length - 1].rfqPartId);
        }
        if (from === 'editModeCall') {
          if (this.isEditMode) {
            // this.isSidePanel = false;
            // debugger;
            this.decideTabToShow();
            this.partCategoryIdColl = [];
            for (const partObj of this.iPartsViewModelColl) {
              if (partObj.childPartCategoryId !== 0) {
                if (this.partCategoryIdColl.length < 2) {
                  if (!this.partCategoryIdColl.includes(partObj.childPartCategoryId)) {
                    this.partCategoryIdColl.push(partObj.childPartCategoryId);
                  }
                }
              }
            }
            this.getMaxdateFromPart();
          }
        }
        this.isFileUpladed = false;
      },
      error => {
        this.isDecideToShow = false;
        this.handleError(error);
      },
      () => { }
    );
  }
  getPartsList() {
    this._rfqService.getReviewRfqParts(this.irfqViewModel.rfqId, 0, false).subscribe(
      result => {

        this.iReviewPartsViewModelColl = result;
        this.iPartsViewModelColl = result;
        const tempPartsviewModelColl = JSON.stringify(this.iPartsViewModelColTemp);
        const tempPartsviewModelColl1: IPartsViewModel[] = JSON.parse(tempPartsviewModelColl);
        this.iPartsViewModelColTemp = tempPartsviewModelColl1;
        if (this.iReviewPartsViewModelColl) {
          this.iReviewPartsViewModelColl.forEach(part => {
            if (part.deliveryDate !== null) {
              part.deliveryDate = moment.utc(part.deliveryDate).toDate();
            }
          });
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }
  getQuantityByLeval(partid, leval) {
    const part = this.iReviewPartsViewModelColl.find(m => m.partId === partid);
    const quantity = part.rfqPartQuantityList.find(m => m.quantityLevel === leval);
    return quantity.partQty;
  }
  openPartDetails(partId, rfqPartId, el?: HTMLElement) {
    if (!this.isOpenPartDetails) {
      this.isOpenPartDetails = true;
      window.scrollTo(0, 0);
      this.resetPartViewModel();
      this.firstQuantity = null;
      this.firstQuantityRequiredError = false;
      this.secondQuantityRequiredError = false;
      this.thirdQuantityRequiredError = false;
      this.firstQuantitySameError = false;
      this.secondQuantitySameError = false;
      this.thirdQuantitySameError = false;
      this.secondQuantityDiv = false;
      this.thirdQuantityDiv = false;
      this.isMaterialTouched = false;
      this.secondQuantity = null;
      this.addsecondQuantityDiv = true;
      this.addthirdQuantityDiv = false;
      this.thirdQuantity = null;
      this.newExistError = false;
      this.partFileAddedError = false;
      this.partNameError = false;
      this.partNumberError = false;
      this.isDeliveryDateError = false;
      this.partFirstQuantityError = false;
      this.partSecondQuantityError = false;
      this.partThirdQuantityError = false;
      this.processError = false;
      this.materialError = false;
      this.selectedItems = [];
      this.materialselectedItems = [];
      this.postProcessselectedItems = [this.selectFieldJSON];
      this._rfqService.getPartDetails(partId, rfqPartId).subscribe(
        result => {
          // window.scrollTo(0,0);
          this.isOpenPartDetails = false;
          this.iPartsViewModel = result;
          // const newArray = result.partsFiles
          // newArray.push(result.primaryPartFile)
          // console.log("newArray---------------->",newArray)
          console.log(result,'In openPartDetails');
          if(result.partName == ""){
            this.partSelectionMIxPanel = "add_new"
          } else {
            this.partSelectionMIxPanel = "library"
          }
          this.iPartsViewModelOld = JSON.parse(JSON.stringify(result));
          this.currentActivePartId = partId;
          this.oDeliveryDate = this.iPartsViewModel.deliveryDate;
          this.currentActiveRfqPartId = this.iPartsViewModel.rfqPartId;
          if (this.iPartsViewModel.partsFiles.length > 0) {
            console.log('IN IF CONDI')
            this.removeUnwantedPartFile(rfqPartId);
          }
          // if (this.iPartsViewModel.isLargePart == null) {
          //   this.iPartsViewModel.isLargePart = null;
          //   this.iPartsViewModel.geometryId = 0;
          //   this.iPartsViewModel.partSizeUnitId = 0;
          // }


          if (this.iPartsViewModel.deliveryDate !== null) {
            this.deliveryDate = true;
            this.iPartsViewModel.deliveryDate = moment.utc(this.iPartsViewModel.deliveryDate).toDate();
          } else {
            this.deliveryDate = false;
          }
          if (this.iPartsViewModel.rfqPartQuantityList.length !== 0) {
            this.firstQuantity = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 0).partQty;
            // this.firstOQuantity = this.firstQuantity;
            // if (this.iPartsViewModel.rfqPartQuantityList[1] !== undefined) {
            let secondData = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 1);
            let ThirdData = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 2);
            if (secondData != undefined && ThirdData != undefined) {
              this.secondQuantity = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 1).partQty;
              // this.secondOQuantity = this.secondQuantity;
              this.thirdQuantity = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 2).partQty;
              // this.thirdOQuantity = this.thirdQuantity;
            } else if (secondData == undefined && ThirdData != undefined) {
              this.secondQuantity = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 2).partQty;
              // this.secondQuantity = this.secondQuantity;
            } else if (secondData != undefined && ThirdData == undefined) {
              this.secondQuantity = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 1).partQty;
              // this.secondOQuantity = this.secondQuantity;
            }

            // if(ThirdData != undefined) {
            //   this.thirdQuantity = this.iPartsViewModel.rfqPartQuantityList.find(m => m.quantityLevel === 2).partQty;
            //   this.thirdOQuantity = this.thirdQuantity;
            // }

            // }
            // if (this.iPartsViewModel.rfqPartQuantityList[2] !== undefined) {

            // }
          }
          if (this.secondQuantity !== null) {
            this.secondQuantityDiv = true;
            this.addsecondQuantityDiv = false;
            this.addthirdQuantityDiv = true;
          }
          if (this.thirdQuantity !== null) {
            this.thirdQuantityDiv = true;
            this.addthirdQuantityDiv = false;
          }
          if (this.iPartsViewModel.rfqPartFile) {
            const filenNameArray = (this.iPartsViewModel.rfqPartFile).split('_S3_');
            if (filenNameArray.length > 1) {
              this.currentImageName = filenNameArray[1];
            } else if (filenNameArray.length === 1) {
              this.currentImageName = filenNameArray[0];
            }
          }
          this.selectedItems = [];
          this.materialselectedItems = [this.selectMaterialJSON];
          this.postProcessselectedItems = [this.selectFieldJSON];
          this.getProcess();
          if (this.iPartsViewModel.parentPartCategoryId != 0 && this.iPartsViewModel.parentPartCategoryId !== null) {
            this.CheckIsValidApplyToAllParts();
            this.getMaterial(this.iPartsViewModel.parentPartCategoryId);
            this.getPostProdProcesses(this.iPartsViewModel.parentPartCategoryId);
          } else {
            this.materialsettings = {
              singleSelection: true,
              text: 'Select Material',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              searchPlaceholderText: 'Search Material',
              enableSearchFilter: false,
              // groupBy: 'parentMaterialName',
              labelKey: 'childMaterialName',
              primaryKey: 'childMaterialId',
              noDataLabel: 'No Data Available',
              selectGroup: true,
              maxHeight: 200,
              showCheckbox: false,
              disabled: true,
              classes: "custom-material"
            };

            this.postProductionProcesssettings = {
              singleSelection: true,
              text: 'Select Post Process',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              searchPlaceholderText: 'Search Post Process',
              enableSearchFilter: false,
              // groupBy: 'parentPostProductionProcessName',
              labelKey: 'childPostProductionProcessName',
              primaryKey: 'childPostProductionProcessId',
              noDataLabel: 'No Data Available',
              selectGroup: true,
              badgeShowLimit: 5,
              maxHeight: 200,
              showCheckbox: false,
              disabled: true,
              classes: "custom-material"
            };
          }

          this.getQuantity();
          // debugger;
          this.isSidePanel = true;
          this.isPartClicked = true;
          this.partFileDownloadLink = appConstants.defaultAwsPath + this.iPartsViewModel.rfqPartFile;
          this.isPartsLibrarayClicked = false;
          this.dispalyIndividualGrps = false;
          this.addGenAttachementDiv = false;
          this.addShippingform = false;
          this.addressList = false;
          if (this.DicoverIdForRfqColl.length !== 0) {
            this.dispalyIndividualGrpsAttachment = true;
          } else {
            this.dispalyIndividualGrpsAttachment = false;
          }
          this.isViewStandardNdaClicked = false;
          this.isNdaClicked = false;
          this.initPartDetailsForm();
          this.isDeliveryDateError = false;
          // debugger;
          this.childProcess = this.iCustomProcessViewModelColl.filter(x => x.parentDisciplineId == this.iPartsViewModel.parentPartCategoryId);
          // this.loadChildProcess(this.iPartsViewModel.parentPartCategoryId);
          if (this.childProcess && this.childProcess.length != 0) {
            this.iPartsViewModel.showPartSizingComponent = this.childProcess[0].showPartSizingComponent;
            this.iPartsViewModel.showQuestionsOnPartDrawer = this.childProcess[0].showQuestionsOnPartDrawer;
          }
          if (this.iPartsViewModel.childPartCategoryId === null || this.iPartsViewModel.childPartCategoryId === undefined) {
            this.iPartsViewModel.childPartCategoryId = 0;
          }
          if (this.iPartsViewModel.rfqPartDrawerAnswerList !== null && this.iPartsViewModel.rfqPartDrawerAnswerList !== undefined && this.iPartsViewModel.rfqPartDrawerAnswerList !== '') {
            this.questionOptionList = this.iPartsViewModel.rfqPartDrawerAnswerList;
          } else {
            this.questionOptionList = [];
          }

        },
        error => {
          this.handleError(error);
          this.isOpenPartDetails = false;

        },
        () => { }
      );
      window.scrollTo(3, 0);
      let _self = this;
      setTimeout(() => {

        let panelDrawer = this.sidePanleDrawerEl.nativeElement;
        let focusedElementQ = this.sidePanleDrawerEl.nativeElement.querySelector('.dash-border button.addMoreFiles');
        if (panelDrawer) {
          panelDrawer.scroll({ top: 0 });
        }

        if (focusedElementQ) {
          focusedElementQ.focus();
        }

        // window.scrollTo(3,0);
        // const elmnt = document.getElementById(rfqPartId);  
        // elmnt.scrollIntoView({ 
        //   behavior: 'auto',  
        //   block: 'center', 
        //   inline: 'nearest'  
        // }); 
      }, 1000);
    }

  }
  removePartAttachment(partName, partId, rfqPartId) {
    console.log("#############removePartAttachment")
    const Partdata = this.iPartsViewModelColl.find(m => m.partId === partId);
    if (Partdata.rfqPartFile !== partName) {
      this._rfqService.deletePartGeneralAttachment(partName, this.loggedId, partId, rfqPartId).subscribe(
        (data: IPartsViewModel) => {
          if (data.result === true) {
            // this.getRfqParts('removePart');
            // this.getPartsList();
          } else {
            this._toastr.success(this.iContactViewModel.errorMessage, data.errorMessage);
          }
        },
        error => () => {
          console.error('Error: $error');
          this._toastr.error(error, 'Error!');
        }
      );
    } else {
      this._toastr.error('Part Image can', 'Error!');
    }

  }
  removeSavedPartDetailFile(partName, index: any, rfqPartId) {
    console.log("***********removeSavedPartDetailFile")
    if (this.iPartUploadedFileNameList.FileNameList) {
      this.iPartUploadedFileNameList.FileNameList.splice(index, 1);
    }
    let partNAme = partName.CompleteFileName ? partName.CompleteFileName : this.iPartsViewModel.rfqPartFile;
    console.log(partNAme, 'partNAme')
    // debugger;
    this._rfqService.deletePartGeneralAttachment(partNAme, this.loggedId, this.currentActivePartId, rfqPartId).subscribe(
      (data: IPartsViewModel) => {
        if (data.result === true) {
          // this.getRfqParts('');
          // *********** Need to call reshape api in background ***********
          this._rfqService.reshapeDeletePartGeneralAttachment([partNAme], this.loggedId, this.currentActivePartId, rfqPartId).subscribe(
            (data: IPartsViewModel) => {
               console.log("data",data)              
            },
            error => () => {
              console.error('Error: $error');
              this._toastr.error(error, 'Error!');
            }
          );
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
  removePartImageReview(item) {
    console.log("111111111111111")
    if (this.iReviewPartsViewModelColl.length === 1) {
      this._toastr.warning('Atleast one part should be present', 'Warning!');
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove this part?',
        header: 'Remove Part',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._rfqService.deletePart(item).subscribe(
            (data: IPartsViewModel) => {
              if (data.result === true) {
                this.getPartsList();
                this._toastr.success(data.errorMessage, 'Success!');
              } else {
                this._toastr.error(data.errorMessage, 'Error!');
              }
            },
            error => () => {
              console.error('Error: $error');
              this._toastr.error(error, 'Error!');
            }
          );
        },
        reject: () => { }
      });
    }
  }
  removePartImage(item) {
    console.log("22222222222222222222222",item, this.iPartsViewModel)
    console.log("++++++++++++++++++++++",item, this.iPartsViewModelColTemp)
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this part?',
      header: 'Remove Part',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var newArray = this.iPartsViewModelColTemp.find(newArray => newArray.rfqPartId === item);
        console.log("bird@@@@@",newArray)
        const updArray = newArray.partsFiles
        updArray.push(newArray.rfqPartFile)
        console.log("updArray----------->",updArray)
        this._rfqService.deletePart(item).subscribe(
          (data: IPartsViewModel) => {
            if (data.result === true) {
             
              if (this.currentActivePartId === item) {
                this.currentActivePartId = 0;
                this.isSidePanel = false;
                this.isPartClicked = false;
                this.addressList = false;
                this.isPartsLibrarayClicked = false;
                this.addGenAttachementDiv = false;
                this.dispalyIndividualGrps = false;
                this.resetPartDetailsPanel();
                this.isViewStandardNdaClicked = false;
              }

              for (let index = 0; index < this.iReviewPartsViewModelColl.length; index++) {
                if (this.iReviewPartsViewModelColl[index].rfqPartId === item) {
                  this.iReviewPartsViewModelColl.splice(index, 1);
                }
              }
              for (let index = 0; index < this.iPartsViewModelColl.length; index++) {
                if (this.iPartsViewModelColl[index].rfqPartId === item) {
                  this.iPartsViewModelColl.splice(index, 1);
                }
              }
              this.irfqViewModel.quotesNeededBy = null;
              this.irfqViewModel.awardDate = null;
              this._toastr.success(data.errorMessage, 'Success!');
               // ********* call reshape *******
               this._rfqService.reshapeDeletePartGeneralAttachment(updArray, this.loggedId, this.currentActivePartId, item).subscribe(
                (data: IPartsViewModel) => {
                   console.log("data",data)              
                },
                error => () => {
                  console.error('Error: $error');
                  this._toastr.error(error, 'Error!');
                }
              );
              this.refreshRfqParts()
              this.closePartDetails();
            } else {
              this._toastr.error(data.errorMessage, 'Error!');
            }
          },
          error => () => {
            console.error('Error: $error');
            this._toastr.error(error, 'Error!');
          }
        );
      },
      reject: () => { }
    });
  }
  removePartImageWithoutAlert(item) {
    console.log("3333333333333333333333")
    this._rfqService.deletePart(item).subscribe(
      (data: IPartsViewModel) => {
        if (data.result === true) {
          this.getRfqParts('removePart');

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

  getSavedRFQDetailsForAttachment() {
    debugger;
    let supplierContactId = 0;
    // if (localStorage.getItem('Usertype') === 'Buyer') {
    //   supplierContactId = 0;
    // } else {
    //   supplierContactId = this.loggedId;
    // }
    supplierContactId = this.loggedId;
    this._rfqService.getRFQExtraDetails(this.irfqViewModel.rfqId, supplierContactId, '').subscribe(
      result => {
        console.log(result,"result1");
        
        if (result.result === true) {

          if (result.isCommunityRfq) {
            this.isCommunityRfq = true;
          } else {
            this.isCommunityRfq = false;
          }
          result.preferredMfgLocationIds = this.locationIdsIntToString(result.preferredMfgLocationIds);
          this.rfqGeneralAttachments = result['rfqGeneralAttachmentsList'];
          this.irfqViewModel.rfqGeneralAttachmentsList = result['rfqGeneralAttachmentsList'];

        } else if (result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
          this._toastr.warning('Please login with valid buyer', 'Warning!');
          this.router.navigate(['dashboard/buyer/default']);
          // } 
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  locationIdsIntToString(localColl) {
    const obj = [];
    (localColl).forEach(element => {
      if (!!element && (element !== 0)) {
        obj.push('' + element);
      }
    });
    if (obj.length === 0) {
      return ['4'];
    } else {
      return obj;
    }
  }
  moveTo(currentItem, moveToId) {
    this.iPartsViewModel = currentItem;
    this.iPartsViewModel.moveToPartId = moveToId;
    this._rfqService.moveToPart(this.iPartsViewModel).subscribe(
      (data: IPartsViewModel) => {
        if (data.result === true) {
          if (this.currentActivePartId === currentItem.partId) {
            this.currentActivePartId = 0;
            this.isSidePanel = false;
            this.isPartClicked = false;
            this.addressList = false;
            this.isPartsLibrarayClicked = false;
            this.addGenAttachementDiv = false;
            this.dispalyIndividualGrps = false;
            this.resetPartDetailsPanel();
            this.isViewStandardNdaClicked = false;
            this.rfqDraftMixPanel();
          }
          this.isSidePanel = false;
          this.currentActivePartId = 0;
          this.getRfqParts('moveTo');

          this._toastr.success(data.errorMessage, '');
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
  moveToGeneralAttach(partName, deletePartId, part) {

    if (this.irfqViewModel.rfqGeneralAttachmentsList.length > 101) {
      this._toastr.error('Can not upload more than 100 files', 'Error!');
    } else {
      this.irfqViewModel.rfqGeneralAttachmentsList = [];
      this.irfqViewModel.contactId = this.loggedId;
      this.irfqViewModel.rfqGeneralAttachmentsList.push(part.rfqPartFile);
      this._rfqService.addRfqGeneralAttachment(this.irfqViewModel).subscribe(
        result => {

          this.uplocount = this.uplocount + 1;
          if (result.result === true) {
            if (this.currentActivePartId === deletePartId) {
              this.currentActivePartId = 0;
              this.isSidePanel = false;
              this.isPartClicked = false;
              this.addressList = false;
              this.isPartsLibrarayClicked = false;
              this.addGenAttachementDiv = false;
              this.dispalyIndividualGrps = false;
              this.resetPartDetailsPanel();
              this.isViewStandardNdaClicked = false;
            }
            this._toastr.success(result.errorMessage, 'Success!');
            this.removePartImageWithoutAlert(deletePartId);
            this.getSavedRFQDetailsForAttachment();
          } else {
            this._toastr.error(result.errorMessage, 'Error!');
          }
        },
        error => {


          this.handleError(error);
        },
        () => { }
      );
    }

  }

  GetProfileDetails() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    } else {
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    }
  }
  downLoadFile(data: any, type: string) {
    type = 'application/octet-stream';
    // tslint:disable-next-line:no-var-keyword
    var blob = new Blob([data], {
      type: type.toString()
    });
    // tslint:disable-next-line:prefer-const
    var url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    ++this.isFileDownloaded;
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      //  const herader = response.headers.get('Content-Disposition');
      // this.downLoadFile(response.body, '');
      --this.isFileDownloaded;
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        // this.downLoadFile(resData, this.type);
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
            // if (fileName) {
            //   const filenNameArray = fileName.split('_S3_');
            //   if (filenNameArray.length === 1) {
            //     fileName = filenNameArray[0];
            //   } else {
            //     fileName = filenNameArray[1];
            //   }
            // }
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

  uploadPartDetailsFiles() {
    const files = this.partDetailUploader.queue;
    // debugger;
    console.log(files, 'files')
    for (const entry of files) {
      const file = entry._file;
      // debugger;
      if (entry.isUploaded === false) {
        ++this.isAttachmentsLoading;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          entry.isUploaded = true;
          this.partFileAddedError = false;
          const fileNameArray = fName.split('_S3_');
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.iPartUploadedFileName.CompleteFileName = fName;
          --this.isAttachmentsLoading;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          this.iPartUploadedFileName = {
            oFileName: '',
            CompleteFileName: ''
          };
        });
      }

      if (this.deliveryDate === false) {
        this.iPartsViewModel.createNewPart = true;
      }
    }
  }
  arr: any[] = [];
  uploadPartDetailsFiles1(fileItem) {
    // let arr = [];

    console.log(fileItem, ' fileItem')
    console.log(this.partDetailUploader.queue, 'this.partDetailUploader.queue;')
    //  const files = this.partDetailUploader.queue ||  this.arr ;
    const files = fileItem;
    const index = this.partDetailUploader.getIndexOfItem || this.uploader.getIndexOfItem;
    // debugger;


    for (const entry of fileItem) {
      const file = entry._file;
      // debugger;
      if (entry.isUploaded === false) {
        ++this.isAttachmentsLoading;
        //   debugger;
        console.log(file, 'file')
        this.upload(file).subscribe(res => {
          // debugger;
          const result = JSON.parse(res['_body']);
          console.log(result, 'result')
          const fName = result['fileName'];
          console.log(fName, 'fName')
          // debugger;
          entry.isUploaded = true;
          const fileNameArray = fName.split('_S3_');
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.iPartUploadedFileName.CompleteFileName = fName;
          --this.isAttachmentsLoading;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          
          this.iPartUploadedFileName = {
            oFileName: '',
            CompleteFileName: ''
          };
          // this.arr = [];
        });
      }

      if (this.deliveryDate === false) {
        this.iPartsViewModel.createNewPart = true;
      }
    }
  }
  removeUnwantedPartFile(getPartID) {
    this._rfqService.removeUnwantedPartFile(getPartID).subscribe(
      result => {
        console.log(result, 'result')
        this.refreshRfqParts();
      },
      error => {
        this.isRfqPartSubmitted = false;
        this.handleError(error);
      },
      () => { }
    );
  }
  savePartDetails() {

    if (!this.isRfqPartSubmitted) {
      this.isRfqPartSubmitted = true;
      if (!this.isPartSaveSubmit() && this.isAttachmentsLoading === 0) {
        const partsFiles = [];
        this.isPartsAdded1 = true;
        if (this.iPartsViewModel.partName !== '') {
          if (!this.isPartDetailsBtnClicked) {
            this.isSavePart = true;
            this.isPartDetailsBtnClicked = true;
            this.iPartUploadedFileNameList.FileNameList.forEach(fileInfo => {
              partsFiles.push(fileInfo.CompleteFileName);
            });
            this.iPartsViewModel.rfqPartQuantityList = [];
            this.iRfqPartQuantityViewModel.partQty = this.firstQuantity;
            this.iRfqPartQuantityViewModel.quantityLevel = 0;

            this.iRfqPartQuantityViewModel.rfqPartId = this.currentActiveRfqPartId;
            this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
            this.resetQuantityModel();
          }
          if (this.secondQuantityDiv === true && this.secondQuantity * 1 !== 0 && this.thirdQuantityDiv === true && this.thirdQuantity * 1 !== 0) {
            this.iRfqPartQuantityViewModel.quantityLevel = 1;
            this.iRfqPartQuantityViewModel.partQty = this.secondQuantity;
            this.iRfqPartQuantityViewModel.rfqPartId = this.currentActiveRfqPartId;
            this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
            this.resetQuantityModel();
            this.iRfqPartQuantityViewModel.quantityLevel = 2;
            this.iRfqPartQuantityViewModel.partQty = this.thirdQuantity;
            this.iRfqPartQuantityViewModel.rfqPartId = this.currentActiveRfqPartId;
            this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
            this.resetQuantityModel();
          } else if (this.secondQuantityDiv === true && this.secondQuantity * 1 !== 0 && this.thirdQuantityDiv === false) {
            this.iRfqPartQuantityViewModel.quantityLevel = 1;
            this.iRfqPartQuantityViewModel.partQty = this.secondQuantity;
            this.iRfqPartQuantityViewModel.rfqPartId = this.currentActiveRfqPartId;
            this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
            this.resetQuantityModel();
          } else if (this.secondQuantityDiv === false && this.thirdQuantityDiv === true && this.thirdQuantity * 1 !== 0) {
            this.iRfqPartQuantityViewModel.quantityLevel = 1;
            this.iRfqPartQuantityViewModel.partQty = this.thirdQuantity;
            this.iRfqPartQuantityViewModel.rfqPartId = this.currentActiveRfqPartId;
            this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
            this.resetQuantityModel();
          }
          if (this.firstOQuantity !== this.firstQuantity) {
            this.iPartsViewModel.isRfq1stquantityChanged = true;
          }
          if (this.secondOQuantity !== this.secondQuantity) {
            this.iPartsViewModel.isRfq2ndquantityChanged = true;
          }
          if (this.thirdOQuantity !== this.thirdQuantity) {
            this.iPartsViewModel.isRfq3rdquantityChanged = true;
          }
          this.iPartsViewModel.modifiedBy = this.loggedId;
          this.iPartsViewModel.partId = this.currentActivePartId;
          this.iPartsViewModel.partName = this.iPartsViewModel.partName;
          this.iPartsViewModel.partNumber = this.iPartsViewModel.partNumber;
          this.iPartsViewModel.partDescription = this.iPartsViewModel.partDescription;
          this.iPartsViewModel.materialId = this.iPartsViewModel.materialId;
          this.iPartsViewModel.partQtyUnitId = this.iPartsViewModel.partQtyUnitId;
          // if (this.iPartsViewModel.partCategoryId === 0) {
          //   this.iPartsViewModel.partCategoryId = 99999;
          // }
          this.iPartsViewModel.companyId = this.iContactViewModel.companyId;
          this.iPartsViewModel.contactId = this.loggedId;
          this.iPartsViewModel.rfqId = this.irfqViewModel.rfqId;
          let tempDeliveryDate = moment(this.iPartsViewModel.deliveryDate).hours(23).minutes(59).seconds(59);
          this.iPartsViewModel.deliveryDate = moment.utc(tempDeliveryDate).format('YYYY-MM-DD HH:mm:ss');
          this.iPartsViewModel.partsFiles = partsFiles;
          // if(this.iPartsViewModel.rfqPartFile != 'New Part' && this.iPartsViewModel.rfqPartFile != 'Your First Part' && this.iPartsViewModel.partsFiles.length ==0) {
          //   this.iPartsViewModel.partsFiles.push(this.iPartsViewModel.rfqPartFile);
          // }
          this.iPartsViewModel.postProductionProcessId = this.iPartsViewModel.postProductionProcessId;

          if (this.iPartsViewModel.childPartCategoryId == 0 || this.iPartsViewModel.childPartCategoryId == null || this.iPartsViewModel.childPartCategoryId == undefined) {
            this.iPartsViewModel.isChildCategorySelected = false;
          }
          if (this.iPartsViewModel.childPartCategoryId != 0 && this.iPartsViewModel.childPartCategoryId !== null && this.iPartsViewModel.childPartCategoryId !== undefined) {
            this.iPartsViewModel.isChildCategorySelected = true;
          }

          // if (this.iPartsViewModel.parentPartCategoryId != 0 && this.iPartsViewModel.parentPartCategoryId !== null && this.iPartsViewModel.parentPartCategoryId !== undefined) {
          //   this.childProcess=[];
          //   this.childProcess = this.iCustomProcessViewModelColl.filter(x => x.parentDisciplineId == this.iPartsViewModel.parentPartCategoryId);
          //   if (this.childProcess && this.childProcess.length == 1) {
          //     this.iPartsViewModel.childPartCategoryId = this.childProcess[0].childDisciplineId;
          //     this.iPartsViewModel.isChildSameAsParent=true;
          //     this.iPartsViewModel.isChildCategorySelected=true;
          //   }
          // }
          if (this.iPartsViewModel.showQuestionsOnPartDrawer == true) {
            this.iPartsViewModel.rfqPartDrawerAnswerList = (this.questionOptionList != null && this.questionOptionList != undefined && this.questionOptionList.length) ? this.questionOptionList : null;
          } else {
            this.iPartsViewModel.rfqPartDrawerAnswerList = null;
          }
          //  debugger;
          // this.patchPartDetails();
          this.iPartsViewModel.deliveryDate = null;
      
          this._rfqService.addPartDetails(this.iPartsViewModel).subscribe(
            result => {
              this.activePartId = null;
              this.iPartsViewModel = result;
                //*********** Calling Background api of rehape ***********/  
                    this._rfqService.sendToReshape(this.iPartsViewModel.rfqId,this.iPartsViewModel.rfqPartId).subscribe(
                      result => {
                        console.log("result",result)
                      },
                      error => {
                    console.log("error---------",error)
                      },
                      () => {}
                  );
              if (this.iPartsViewModel.result === true) {
                localStorage.setItem('isManufacturingProcessSaved', 'true');
                // this.getRfqParts("from")
                // this.checkNextButton()
                if (result.isValidDeliveryDate) {
                  // this.irfqViewModel.quotesNeededBy = null;
                  // this.irfqViewModel.awardDate = null;
                }

                this.isPartDetailsBtnClicked = false;
                this.isSavePart = false;
                // this.activeNextButton = true
                if (this.iPartsViewModel.partsFiles.length != 0) {
                  this.removeUnwantedPartFile(this.iPartsViewModel.rfqPartId)
                }
                // this.refreshRfqParts();
                this.currentActivePartId = 0;
                this.isSidePanel = false;
                this.isPartClicked = false;
                this.addressList = false;
                this.isPartsLibrarayClicked = false;
                this.addGenAttachementDiv = false;
                this.dispalyIndividualGrps = false;
                this.selectedItems = [];
                this.materialselectedItems = [this.selectMaterialJSON];
                this.postProcessselectedItems = [this.selectFieldJSON];

                this.resetPartDetailsPanel();
                this._toastr.success(this.iPartsViewModel.errorMessage, '');
                window.scrollTo(0, document.body.scrollHeight);
                this.isRfqPartSubmitted = false;
                this.checkNextButton()
              } else {
                this._toastr.error(this.iPartsViewModel.errorMessage, 'Error!');
                this.isSavePart = false;
                this.isRfqPartSubmitted = false;
              }
            },
            error => {
              this.isRfqPartSubmitted = false;
              this.handleError(error);
            },
            () => { }
          );

        }

      } else {
        this.isRfqPartSubmitted = false;
        this.moveToDiv = false;
        if (this.iPartsViewModel.isExistingPart == null || this.iPartsViewModel.isExistingPart == undefined) {
          this.newExistError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("newExistPart");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        console.log(this.iPartsViewModel, 'this.iPartsViewModel.partsFile111')
        if (this.iPartsViewModel.rfqPartFile == null || this.iPartUploadedFileNameList.FileNameList.length == 0) {
          // console.log(this.iPartsViewModel, 'this.iPartsViewModel.partsFile')
          this.partFileAddedError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("partFileAddedError");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if (this.iPartsViewModel.parentPartCategoryId == null || this.iPartsViewModel.parentPartCategoryId == undefined || this.iPartsViewModel.parentPartCategoryId == 0) {
          this.processError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("manufacturerProcess");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if ((this.iPartsViewModel.parentPartCategoryId !== null && this.iPartsViewModel.parentPartCategoryId !== undefined && this.iPartsViewModel.parentPartCategoryId !== 0) && (this.materialselectedItems.length != 0 && this.materialselectedItems[0].childMaterialId == 0)) {
          this.materialError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("manufacturerMaterial");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if (this.iPartsViewModel.partName == null || this.iPartsViewModel.partName == undefined || this.iPartsViewModel.partName == '') {
          this.partNameError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("partNamediv");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if (this.iPartsViewModel.partNumber == null || this.iPartsViewModel.partNumber == undefined || this.iPartsViewModel.partNumber == '') {
          this.PartError1 = 'Please enter the part number';
          this.partNumberError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("partNumberDiv");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if (this.firstQuantity == null || this.firstQuantity == undefined) {
          this.partFirstQuantityError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("partFirstQuantity");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if (this.secondQuantityDiv && (this.secondQuantity == null || this.secondQuantity == undefined)) {
          this.partSecondQuantityError = true;

          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("partSecondQuantity");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        if (this.thirdQuantityDiv && (this.thirdQuantity == null || this.thirdQuantity == undefined)) {
          this.partThirdQuantityError = true;
          if (!this.moveToDiv) {
            let htmlElement = document.getElementById("partthirdQuantity");
            htmlElement.scrollIntoView();
            this.moveToDiv = true;
          }
        }
        // Commenting this code for now Delivery Date
        // if (this.iPartsViewModel.deliveryDate == null || this.iPartsViewModel.deliveryDate == undefined || this.iPartsViewModel.deliveryDate == '') {
        //   this.isDeliveryDateError = true;
        //   if (!this.moveToDiv) {
        //     let htmlElement = document.getElementById("partDeliveryDate");
        //     htmlElement.scrollIntoView();
        //     this.moveToDiv = true;
        //   }
        // }
      }
    }
    this.trackRfqPartMixpanel()
  }
  setErrorFlag(val) {
    switch (val) {
      case 1:
        this.newExistError = false;
        break;
      case 2:
        this.partNameError = false;
        break;
      case 3:
        this.partNumberError = false;
        break;
      case 4:
        this.isDeliveryDateError = false;
        break;
      case 5:
        this.partFirstQuantityError = false;
        break;
      case 6:
        this.partFileAddedError = false;
        break;
    }
    this.moveToDiv = false;
  }
  getProcess() {
    if (this.iCustomProcessViewModelColl.length === 0) {
      this.childProcess = [];
      this._rfqService.getAllProcess().subscribe(
        result => {
          this.iCustomProcessViewModelColl = result['data'];
          this.parentProcessPriority = this.removeDuplicates(this.iCustomProcessViewModelColl, 'parentDisciplineId');

          this.parentProcessLessPriority = this.parentProcessPriority.splice(6);
          //if(!this.isPartFileSelectedinFlowOrNot){
          if (localStorage.getItem('isManufacturingProcessSaved') == "false") {
            this.iPartsViewModel.parentPartCategoryId = 101026;
            this.getMaterial(this.iPartsViewModel.parentPartCategoryId);
            this.getPostProdProcesses(this.iPartsViewModel.parentPartCategoryId);
          }
          // .sort((a, b) => {
          //   const textA = a.parentDisciplineName.toUpperCase();
          //   const textB = b.parentDisciplineName.toUpperCase();
          //   return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          // });
          this.parentProcessPriority = this.parentProcessPriority.splice(0, 6);
          if (this.iPartsViewModel.parentPartCategoryId != 0 && this.iPartsViewModel.parentPartCategoryId != null && this.iPartsViewModel.parentPartCategoryId != undefined) {
            this.childProcess = this.iCustomProcessViewModelColl.filter(x => x.parentDisciplineId == this.iPartsViewModel.parentPartCategoryId);
            // this.loadChildProcess(this.iPartsViewModel.parentPartCategoryId);
            if (this.childProcess && this.childProcess.length != 0) {
              this.iPartsViewModel.showPartSizingComponent = this.childProcess[0].showPartSizingComponent;
              this.iPartsViewModel.showQuestionsOnPartDrawer = this.childProcess[0].showQuestionsOnPartDrawer;
            }
          }
          console.log(this.parentProcessPriority);
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    }
  }
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  loadChildProcess(id) {
    debugger;
    this.processError = false;
    // console.log("id",id)
    // console.log("this.parentProcessPriority@@@@@@",this.parentProcessPriority);
    const data = this.parentProcessPriority.find(i => i.parentDisciplineId == id);
    const data1 = this.parentProcessLessPriority.find(i => i.parentDisciplineId == id);
    if (data === undefined) {
      this.manuFacturingProcessMixPanel = data1.parentDisciplineName
    } else {
      this.manuFacturingProcessMixPanel = data.parentDisciplineName
    }

    if (data1 === undefined) {
      this.manuFacturingProcessMixPanel = data.parentDisciplineName
    } else {
      this.manuFacturingProcessMixPanel = data1.parentDisciplineName
    }
    this.iPartsViewModel.materialId = 0;
    this.iPartsViewModel.postProductionProcessId = 0;
    this.iPartsViewModel.parentPartCategoryId = id;
    this.iPartsViewModel.childPartCategoryId = 0;
    this.iPartsViewModel.isDefaultChildPartCategory = false;
    this.iPartsViewModel.isDefaultParentPartCategory = false;
    this.iPartsViewModel.isChildSameAsParent = false;
    this.iPartsViewModel.isChildCategorySelected = false;
    this.childProcess = this.iCustomProcessViewModelColl.filter(x => x.parentDisciplineId == id);
    if (this.childProcess && this.childProcess.length == 1) {
      this.iPartsViewModel.childPartCategoryId = this.childProcess[0].childDisciplineId;
      this.iPartsViewModel.isChildSameAsParent = true;
      this.iPartsViewModel.isChildCategorySelected = true;

    }

    if (this.childProcess && this.childProcess.length != 0) {
      this.iPartsViewModel.showPartSizingComponent = this.childProcess[0].showPartSizingComponent;
      this.iPartsViewModel.showQuestionsOnPartDrawer = this.childProcess[0].showQuestionsOnPartDrawer;
      if (this.iPartsViewModel.showPartSizingComponent == false) {
        this.iPartsViewModel.isLargePart = null;
        this.iPartsViewModel.geometryId = 0;
        this.iPartsViewModel.partSizeUnitId = 0;
      }
    }

    if (this.iPartsViewModel.parentPartCategoryId != 0 && this.iPartsViewModel.parentPartCategoryId !== null) {
      this.CheckIsValidApplyToAllParts();
      this.getMaterial(this.iPartsViewModel.parentPartCategoryId);
      this.getPostProdProcesses(this.iPartsViewModel.parentPartCategoryId);
    } else {
      this.materialselectedItems = [];
      this.postProcessselectedItems = [];
      this.materialsettings = {
        singleSelection: true,
        text: 'Select Material',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Search Material',
        enableSearchFilter: false,
        // groupBy: 'parentMaterialName',
        labelKey: 'childMaterialName',
        primaryKey: 'childMaterialId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        maxHeight: 200,
        showCheckbox: false,
        disabled: true,
        classes: "custom-material"
      };

      this.postProductionProcesssettings = {
        singleSelection: true,
        text: 'Select Post Process',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Search Post Process',
        enableSearchFilter: false,
        // groupBy: 'parentPostProductionProcessName',
        labelKey: 'childPostProductionProcessName',
        primaryKey: 'childPostProductionProcessId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        badgeShowLimit: 5,
        maxHeight: 200,
        showCheckbox: false,
        disabled: true,
        classes: "custom-material"
      };
    }
  }
  setChildProcess(val) {
    //  console.log("this.childProcess@@@@@@@@@@@@",this.childProcess)
    const data = this.childProcess.find(i => i.childDisciplineId == val)
    this.manuFacturingTechniqueMixPanel = data.childDisciplineName
    // console.log("this.manuFacturingTechniqueMixPanel--------->",this.manuFacturingTechniqueMixPanel)
    this.iPartsViewModel.childPartCategoryId = val;
    this.iPartsViewModel.isChildCategorySelected = true;
    this.iPartsViewModel.isChildSameAsParent = false;
    this.iPartsViewModel.isDefaultChildPartCategory = false;
    if (val == 0) {
      this.iPartsViewModel.isChildCategorySelected = false;
    }
  }

  getCertificateList() {
    this._masterService.getCertificate(null).subscribe(
      result => {
        this.iCertificationViewModelColl = result['data'];
        this.certificateList = [];
        this.CertificationselectedItems = [];
        if (this.irfqViewModel.certificateIdList.length !== 0) {
          this.irfqViewModel.certificateIdList.forEach(element => {
            this.certificateList.push(element);
            if (this.iCertificationViewModelColl !== undefined) {
              const data = this.iCertificationViewModelColl.find(i => i.certificateId === element);
              if (data !== undefined && data !== null) {
                const dta = {
                  'certificateId': data.certificateId,
                  'certificateTypeId': data.certificateTypeId,
                  'description': data.description,
                  'certificateCode': data.certificateCode
                };
                this.CertificationselectedItems.push(dta);
              }

            } else {
              this.CertificationselectedItems = [];
            }
          });
        }
        this.certificatesettings = {
          singleSelection: false,
          text: 'Select Fields',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Fields',
          enableSearchFilter: true,
          groupBy: 'description',
          labelKey: 'certificateCode',
          primaryKey: 'certificateId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 200,
          limitSelection: 5,
          showCheckbox: true,
          classes: 'hideCheckBox'
        };
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );

  }



  getMaterial(parentPartCategoryId?) {
    let materialsRequestViewModel = new MaterialsRequestViewModel();
    materialsRequestViewModel.companyId = 0;
    materialsRequestViewModel.processIds.push(parentPartCategoryId);
    this.iMaterialViewModelColl = [];
    this.materialselectedItems = [];
    // if (this.iMaterialViewModelColl.length === 0) {
    this._rfqService.getMaterialByParentProcessId(materialsRequestViewModel).subscribe(
      result => {
        if (result['result'] == true) {
          if (result['data'].length > 0) {
            this.iMaterialViewModelColl = result['data'];
            // this.iMaterialViewModelColl.unshift(this.selectMaterialJSON);


            // if (this.iPartsViewModel.materialId === 0 || this.iPartsViewModel.materialId === null) {
            //   this.materialselectedItems = [this.selectMaterialJSON];
            //   }  else {
            //   const data = this.iMaterialViewModelColl.find(i => i.childMaterialId === this.iPartsViewModel.materialId);
            //   if (data !== undefined && data !== null) {
            //     this.materialselectedItems = [{
            //       'childMaterialId': data.childMaterialId,
            //       'childMaterialName': data.childMaterialName,
            //       'parentMaterialId': data.parentMaterialId,
            //       'parentMaterialName': data.parentMaterialName
            //     }];
            //   }
            // }





            if ((this.iPartsViewModel.materialId === 0 || this.iPartsViewModel.materialId === null) && this.iMaterialViewModelColl.length > 1) {
              this.materialselectedItems = [this.selectMaterialJSON];
            } else if ((this.iPartsViewModel.materialId === 0 || this.iPartsViewModel.materialId === null) && this.iMaterialViewModelColl.length == 1) {
              this.materialselectedItems = [{
                'childMaterialId': this.iMaterialViewModelColl[0].childMaterialId,
                'childMaterialName': this.iMaterialViewModelColl[0].childMaterialName,
                'parentMaterialId': this.iMaterialViewModelColl[0].parentMaterialId,
                'parentMaterialName': this.iMaterialViewModelColl[0].parentMaterialName
              }];
              this.iPartsViewModel.materialId = this.iMaterialViewModelColl[0].childMaterialId;
            } else {
              const data = this.iMaterialViewModelColl.find(i => i.childMaterialId === this.iPartsViewModel.materialId);
              if (data !== undefined && data !== null) {
                this.materialselectedItems = [{
                  'childMaterialId': data.childMaterialId,
                  'childMaterialName': data.childMaterialName,
                  'parentMaterialId': data.parentMaterialId,
                  'parentMaterialName': data.parentMaterialName
                }];
              }
            }
            this.materialsettings = {
              singleSelection: true,
              text: 'Select Material',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              searchPlaceholderText: 'Search Material',
              enableSearchFilter: false,
              // groupBy: 'parentMaterialName',
              labelKey: 'childMaterialName',
              primaryKey: 'childMaterialId',
              noDataLabel: 'No Data Available',
              selectGroup: true,
              maxHeight: 200,
              showCheckbox: false,
              disabled: false,
              classes: "custom-material"
            };
          } else {
            this.iMaterialViewModelColl = [];
            this.materialselectedItems = [];
            this.materialsettings = {
              singleSelection: true,
              text: 'Select Material',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              searchPlaceholderText: 'Search Material',
              enableSearchFilter: false,
              // groupBy: 'parentMaterialName',
              labelKey: 'childMaterialName',
              primaryKey: 'childMaterialId',
              noDataLabel: 'No Data Available',
              selectGroup: true,
              maxHeight: 200,
              showCheckbox: false,
              disabled: true,
              classes: "custom-material"
            };
          }
        } else {
          this.iMaterialViewModelColl = [];
          this.materialselectedItems = [];
          this.materialsettings = {
            singleSelection: true,
            text: 'Select Material',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Material',
            enableSearchFilter: false,
            // groupBy: 'parentMaterialName',
            labelKey: 'childMaterialName',
            primaryKey: 'childMaterialId',
            noDataLabel: 'No Data Available',
            selectGroup: true,
            maxHeight: 200,
            showCheckbox: false,
            disabled: true,
            classes: "custom-material"
          };
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
    // } else {
    //   if (this.iPartsViewModel.materialId === 0 || this.iPartsViewModel.materialId === null) {
    //     this.materialselectedItems = [

    //     ];
    //   } else {
    //     const data = this.iMaterialViewModelColl.find(i => i.childMaterialId === this.iPartsViewModel.materialId);
    //     if (data !== undefined && data !== null) {
    //       this.materialselectedItems = [{
    //         'childMaterialId': data.childMaterialId,
    //         'childMaterialName': data.childMaterialName,
    //         'parentMaterialId': data.parentMaterialId,
    //         'parentMaterialName': data.parentMaterialName
    //       }];
    //     }
    //   }

    //   this.materialsettings = {
    //     singleSelection: true,
    //     text: 'Select Material',
    //     selectAllText: 'Select All',
    //     unSelectAllText: 'UnSelect All',
    //     searchPlaceholderText: 'Search Material',
    //     enableSearchFilter: true,
    //     groupBy: 'parentMaterialName',
    //     labelKey: 'childMaterialName',
    //     primaryKey: 'childMaterialId',
    //     noDataLabel: 'No Data Available',
    //     selectGroup: true,
    //     badgeShowLimit: 5,
    //     maxHeight: 200,
    //     showCheckbox: false
    //   };
    // }

  }


  getPostProdProcesses(parentPartCategoryId?) {
    // if (this.iPostProductionViewModelColl.length === 0) {
    let postProductionProcessRequestViewModel = new PostProductionProcessRequestViewModel();
    postProductionProcessRequestViewModel.processIds.push(parentPartCategoryId);
    this.iPostProductionViewModelColl = [];
    this.postProcessselectedItems = [];
    this._rfqService.getPostProductionProcessesDataByProcessIds(postProductionProcessRequestViewModel).subscribe(
      result => {
        if (result['result'] == true) {
          if (result['data'].length > 0) {
            this.iPostProductionViewModelColl = result['data'];
            // this.iPostProductionViewModelColl.unshift(this.selectFieldJSON);

            if ((this.iPartsViewModel.postProductionProcessId === 0 || this.iPartsViewModel.postProductionProcessId === null) && this.iPostProductionViewModelColl.length > 1) {
              this.postProcessselectedItems = [this.selectFieldJSON];
            } else if ((this.iPartsViewModel.postProductionProcessId === 0 || this.iPartsViewModel.postProductionProcessId === null) && this.iPostProductionViewModelColl.length == 1) {
              this.postProcessselectedItems = [{
                'childPostProductionProcessId': this.iPostProductionViewModelColl[0].childPostProductionProcessId,
                'childPostProductionProcessName': this.iPostProductionViewModelColl[0].childPostProductionProcessName,
                'parentPostProductionProcessId': this.iPostProductionViewModelColl[0].parentPostProductionProcessId,
                'parentPostProductionProcessName': this.iPostProductionViewModelColl[0].parentPostProductionProcessName
              }];
              this.iPartsViewModel.postProductionProcessId = this.iPostProductionViewModelColl[0].childPostProductionProcessId;
            } else {
              // tslint:disable-next-line:max-line-length
              const data = this.iPostProductionViewModelColl.find(i => i.childPostProductionProcessId === this.iPartsViewModel.postProductionProcessId);
              if (data !== undefined && data !== null) {
                this.postProcessselectedItems = [{
                  'childPostProductionProcessId': data.childPostProductionProcessId,
                  'childPostProductionProcessName': data.childPostProductionProcessName,
                  'parentPostProductionProcessId': data.parentPostProductionProcessId,
                  'parentPostProductionProcessName': data.parentPostProductionProcessName
                }];
              }
            }
            this.postProductionProcesssettings = {
              singleSelection: true,
              text: 'Select Post Process',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              searchPlaceholderText: 'Search Post Process',
              enableSearchFilter: false,
              // groupBy: 'parentPostProductionProcessName',
              labelKey: 'childPostProductionProcessName',
              primaryKey: 'childPostProductionProcessId',
              noDataLabel: 'No Data Available',
              selectGroup: true,
              badgeShowLimit: 5,
              maxHeight: 200,
              showCheckbox: false,
              disabled: false,
              classes: "custom-material"
            };
          } else {
            this.iPostProductionViewModelColl = [];
            this.postProcessselectedItems = [];
            this.postProductionProcesssettings = {
              singleSelection: true,
              text: 'Select Post Process',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              searchPlaceholderText: 'Search Post Process',
              enableSearchFilter: false,
              // groupBy: 'parentPostProductionProcessName',
              labelKey: 'childPostProductionProcessName',
              primaryKey: 'childPostProductionProcessId',
              noDataLabel: 'No Data Available',
              selectGroup: true,
              badgeShowLimit: 5,
              maxHeight: 200,
              showCheckbox: false,
              disabled: true,
              classes: "custom-material"
            };
          }
        } else {
          this.iPostProductionViewModelColl = [];
          this.postProcessselectedItems = [];
          this.postProductionProcesssettings = {
            singleSelection: true,
            text: 'Select Post Process',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Post Process',
            enableSearchFilter: false,
            // groupBy: 'parentPostProductionProcessName',
            labelKey: 'childPostProductionProcessName',
            primaryKey: 'childPostProductionProcessId',
            noDataLabel: 'No Data Available',
            selectGroup: true,
            badgeShowLimit: 5,
            maxHeight: 200,
            showCheckbox: false,
            disabled: true,
            classes: "custom-material"
          };
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
    // }
    // } else {
    //   if (this.iPartsViewModel.postProductionProcessId === 0 || this.iPartsViewModel.postProductionProcessId === null) {
    //     this.postProcessselectedItems = [this.selectFieldJSON];
    //   } else {
    //     // tslint:disable-next-line:max-line-length
    //     const data = this.iPostProductionViewModelColl.find(i => i.childPostProductionProcessId === this.iPartsViewModel.postProductionProcessId);
    //     if (data !== undefined && data !== null) {
    //       this.postProcessselectedItems = [{
    //         'childPostProductionProcessId': data.childPostProductionProcessId,
    //         'childPostProductionProcessName': data.childPostProductionProcessName,
    //         'parentPostProductionProcessId': data.parentPostProductionProcessId,
    //         'parentPostProductionProcessName': data.parentPostProductionProcessName
    //       }];
    //     }
    //   }
    //   this.postProductionProcesssettings = {

    //     singleSelection: true,
    //     text: 'Select Post Process',
    //     selectAllText: 'Select All',
    //     unSelectAllText: 'UnSelect All',
    //     searchPlaceholderText: 'Search Post Process',
    //     enableSearchFilter: true,
    //     groupBy: 'parentPostProductionProcessName',
    //     labelKey: 'childPostProductionProcessName',
    //     primaryKey: 'childPostProductionProcessId',
    //     noDataLabel: 'No Data Available',
    //     selectGroup: true,
    //     badgeShowLimit: 5,
    //     maxHeight: 200,
    //     showCheckbox: false
    //   };
    // }

  }


  onSearchChange() {
    if (!!this.partDrawerSearch) {
      this.isPartDrawerFilledWithoutSearch = false;
      this._masterService.getPartLibrary(this.loggedId, this.partDrawerSearch).subscribe(
        (data: IPartLibraryModel[]) => {
          this.iPartLibraryModelDetailsColl = [];
          for (const entry of data) {
            // tslint:disable-next-line:prefer-const
            let partLibraryModel: IPartLibraryModelDetails = {
              PartLibraryModel: entry,
              ShowDetials: false,
              isMouseOver: false
            };
            this.iPartLibraryModelDetailsColl.push(partLibraryModel);
            console.log(this.iPartLibraryModelDetailsColl, 'this.iPartLibraryModelDetailsColl')
          }
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    } else {
      this.isPartDrawerFilledWithoutSearch = true;
      this._masterService.getPartLibrary(this.loggedId, '').subscribe(
        (data: IPartLibraryModel[]) => {
          this.iPartLibraryModelDetailsColl = [];
          for (const entry of data) {
            // tslint:disable-next-line:prefer-const
            let partLibraryModel: IPartLibraryModelDetails = {
              PartLibraryModel: entry,
              ShowDetials: false,
              isMouseOver: false
            };
            this.iPartLibraryModelDetailsColl.push(partLibraryModel);
          }
        },
        error => () => {
          this._toastr.error(error.error.errorMessage, 'Error!');
        }
      );
    }
  }
  addPartLibraryToRFQ(partElement: IPartLibraryModel) {
    if (!this.isPartLibraryApiCall) {
      this.isPartLibraryApiCall = true;
      this.resetTopButton();
      this.isFileUpladed = true;
      if (this.idForPartGotFromLibraryColl.includes(partElement.partId)) { } else {
        // tslint:disable-next-line:prefer-const
        let tempPart = {
          iPartLibraryModel: partElement,
          fileType: 'not-known'
        };
        this.initPartViewModel();
        this.iPartsViewModel.partId = partElement.partId;
        this.iPartsViewModel.primaryPartFile = partElement.primaryPartFile;
        this.iPartsViewModel.rfqPartFile = partElement.primaryPartFile;
        // tslint:disable-next-line:radix
        this.iPartsViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
        if (this.iContactViewModel != undefined && this.iContactViewModel.companyId != null &&
          this.iContactViewModel.companyId != undefined && this.iContactViewModel.companyId != 0) {
          this.iPartsViewModel.companyId = this.iContactViewModel.companyId;
        } else {
          this.iPartsViewModel.companyId = this.loggedCompanyId;
        }

        this.iPartsViewModel.partName = partElement.partName;
        this.iPartsViewModel.partNumber = partElement.partNumber;
        this.iPartsViewModel.rfqId = this.irfqViewModel.rfqId;
        this.iPartsViewModel.partQtyUnitId = partElement.partQtyUnitId;
        // this.iPartsViewModel.partCategoryId = partElement.partCategoryId;
        this.iPartsViewModel.parentPartCategoryId = partElement.parentPartCategoryId;
        this.iPartsViewModel.childPartCategoryId = partElement.childPartCategoryId;
        this.iPartsViewModel.parentCategoryName = partElement.parentCategoryName;
        this.iPartsViewModel.childCategoryName = partElement.childCategoryName;
        this.iPartsViewModel.isChildCategorySelected = partElement.isChildCategorySelected;
        this.iPartsViewModel.materialId = partElement.materialId;
        this.iPartsViewModel.postProductionProcessId = partElement.postProductionProcessId;
        this.iPartsViewModel.partDescription = partElement.partDescription;
        this.iPartsViewModel.rfqPartQuantityList = partElement.rfqPartQuantityList;
        const partsFiles = [];
        partElement.partsFiles.forEach(fileInfo => {
          partsFiles.push(fileInfo);
        });
        this.iPartsViewModel.partsFiles = partsFiles
        // debugger;
        // this.iPartsViewModel.partsFiles.push(partElement.primaryPartFile);
        this.iPartsViewModel.deliveryDate = null;
        if (this.isCommunityRfq) {
          this.iPartsViewModel.isCommunityRfq = true;
        } else {
          this.iPartsViewModel.isCommunityRfq = false;
        }
        this._rfqService.addPartToRFQ(this.iPartsViewModel).subscribe(
          result2 => {
            if (result2['result'] === true) {
              this.irfqViewModel.rfqId = result2.rfqId;
              if (this.irfqViewModel.rfqName == null || this.irfqViewModel.rfqName == undefined || this.irfqViewModel.rfqName == '') {
                this.irfqViewModel.rfqName = result2.rfqId.toString();
              }
              localStorage.setItem('isNewUser', 'false');
              this.getRfqParts('partFileDropped');
              this.isPartLibraryApiCall = false;
              this.addRemaining();
              this.setCommunitySuppplier();
            } else {
              this._toastr.error(result2['errorMessage'], 'Error!');
            }
          },
          error => {
            this.handleError(error);
          },
          () => { }
        );
      }
    }

  }
  addPartToRFQ(partElement: IPartLibraryModel) {
    this.resetTopButton();
    this.isFileUpladed = true;
    if (this.idForPartGotFromLibraryColl.includes(partElement.partId)) { } else {
      // tslint:disable-next-line:prefer-const
      let tempPart = {
        iPartLibraryModel: partElement,
        fileType: 'not-known'
      };
      this.initPartViewModel();
      this.iPartsViewModel.partId = partElement.partId;
      this.iPartsViewModel.primaryPartFile = partElement.primaryPartFile;
      this.iPartsViewModel.rfqPartFile = partElement.primaryPartFile;
      // tslint:disable-next-line:radix
      this.iPartsViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
      this.iPartsViewModel.companyId = this.iContactViewModel.companyId;
      this.iPartsViewModel.partName = partElement.partName;
      this.iPartsViewModel.partNumber = partElement.partNumber;
      this.iPartsViewModel.rfqId = this.irfqViewModel.rfqId;
      this.iPartsViewModel.partQtyUnitId = partElement.partQtyUnitId;
      // this.iPartsViewModel.partCategoryId = partElement.partCategoryId;
      this.iPartsViewModel.parentPartCategoryId = partElement.parentPartCategoryId;
      this.iPartsViewModel.childPartCategoryId = partElement.childPartCategoryId;
      this.iPartsViewModel.parentCategoryName = partElement.parentCategoryName;
      this.iPartsViewModel.childCategoryName = partElement.childCategoryName;
      this.iPartsViewModel.materialId = partElement.materialId;
      this.iPartsViewModel.postProductionProcessId = partElement.postProductionProcessId;
      this.iPartsViewModel.partDescription = partElement.partDescription;
      this.iPartsViewModel.rfqPartQuantityList = partElement.rfqPartQuantityList;
      // this.iPartsViewModel.isChildCategorySelected = partElement.isChildCategorySelected;
      // this.iPartsViewModel.isChildSameAsParent = partElement.isChildSameAsParent;

      const partsFiles = [];
      partElement.partsFiles.forEach(fileInfo => {
        partsFiles.push(fileInfo);
      });
      this.iPartsViewModel.partsFiles = partsFiles
      //  debugger;
      // this.iPartsViewModel.partsFiles.push(partElement.primaryPartFile);

      this.iPartsViewModel.deliveryDate = null;
      if (this.isCommunityRfq) {
        this.iPartsViewModel.isCommunityRfq = true;
      } else {
        this.iPartsViewModel.isCommunityRfq = false;
      }
      this._rfqService.addPartToRFQ(this.iPartsViewModel).subscribe(
        result2 => {
          if (result2['result'] === true) {
            this.irfqViewModel.rfqId = result2.rfqId;
            if (this.irfqViewModel.rfqName == null || this.irfqViewModel.rfqName == undefined || this.irfqViewModel.rfqName == '') {
              this.irfqViewModel.rfqName = result2.rfqId.toString();
            }
            localStorage.setItem('isNewUser', 'false');
            this.getRfqParts('partFileDropped');
            this.setCommunitySuppplier();
          } else {
            this._toastr.error(result2['errorMessage'], 'Error!');
          }
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    }
  }
  removeFileFromQueue(fileItem: any) {
    this._rfqService.deleteRfqGeneralAttachment(fileItem, this.irfqViewModel.contactId, this.irfqViewModel.rfqId).subscribe(
      result => {
        this.getSavedRFQDetailsForAttachment();
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }
  addContactToRfq(contact: any, type: string) {

    this.iManufacturersViewModel.rfqId = this.irfqViewModel.rfqId;
    this.iManufacturersViewModel.companyId = 0;
    this.iManufacturersViewModel.bookId = 0;

    if (type === 'individual') {

      const isExist = this.SpecialInvitedNameModelColl.filter(m => m.inviteId === contact.companyId && m.isDelete === false).length;
      if (isExist === 0) {
        if (this.showLetMeChooseValidationMsg = true) {
          this.showLetMeChooseValidationMsg = false;
        }
        this.iManufacturersViewModel.companyId = contact.companyId;
        this.SpecialInvitedNameModel.inviteId = contact.companyId;
        this.SpecialInvitedNameModel.type = 'individual';
        this.SpecialInvitedNameModel.name = contact.name;
        this.SpecialInvitedNameModel.isDelete = false;
        this.SpecialInvitedNameModelColl.push(this.SpecialInvitedNameModel);
        this.initSpecialInvitedNameModel();
      } else {
        this._toastr.warning('Contact Already Added');
      }
    } else {
      const isExist = this.SpecialInvitedNameModelColl.filter(m => m.inviteId === contact.bookId && m.isDelete === false).length;
      if (isExist === 0) {
        this.SpecialInvitedNameModel.inviteId = contact.bookId;
        this.SpecialInvitedNameModel.type = 'group';
        this.iManufacturersViewModel.bookId = contact.bookId;
        this.SpecialInvitedNameModel.name = contact.bkName;
        this.SpecialInvitedNameModel.isDelete = false;
        this.SpecialInvitedNameModelColl.push(this.SpecialInvitedNameModel);
        this.initSpecialInvitedNameModel();
      } else {
        this._toastr.warning('Group Already Added');
      }
    }
  }
  getIndividualList() {
    return this.SpecialInvitedNameModelColl.filter(m => m.type === 'individual' && m.isDelete === false);
  }
  getGroupList() {
    return this.SpecialInvitedNameModelColl.filter(m => m.type === 'group' && m.isDelete === false);
  }
  removedAddedContactToRfq(contact: any, type: string) {
    this.SpecialInvitedNameModelColl.forEach(element => {
      if (element.inviteId === contact.inviteId) {
        element.isDelete = true;
      }
    });
  }
  getManufacturesByRfq() {

    this._rfqService.getManufacturesByRfq(this.irfqViewModel.rfqId).subscribe(
      result => {
        this.manufactureList = result;
        if (localStorage.getItem('manufactureId')) {
          localStorage.removeItem('manufactureId');
        } else {

          this.SpecialInvitedNameModelColl = [];
        }
        this.manufactureList.individualList.forEach(element => {
          this.SpecialInvitedNameModel.inviteId = element.companyId;
          this.SpecialInvitedNameModel.isDelete = false;
          this.SpecialInvitedNameModel.name = element.companyName;
          this.SpecialInvitedNameModel.type = 'individual';
          this.SpecialInvitedNameModelColl.push(this.SpecialInvitedNameModel);
          this.initSpecialInvitedNameModel();
        });
        this.manufactureList.groupList.forEach(element => {
          this.SpecialInvitedNameModel.inviteId = element.supplierGroupId;
          this.SpecialInvitedNameModel.isDelete = false;
          this.SpecialInvitedNameModel.name = element.booksName;
          this.SpecialInvitedNameModel.type = 'group';
          this.SpecialInvitedNameModelColl.push(this.SpecialInvitedNameModel);
          this.initSpecialInvitedNameModel();
        });
        if (this.SpecialInvitedNameModelColl.length !== 0) {
          this.dispalyIndividualGrpsAttachment = true;
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
          this.irfqViewModel.SpecialinviteList = this.SpecialInvitedNameModelColl;
        } else {
          this.dispalyIndividualGrpsAttachment = false;
          this.irfqViewModel.isRegisterSupplierQuoteTheRfq = true;
        }
        this.isAddIndiActive = false;
        this.isAddGroupActive = false;
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }


  isIndiOrGroupSelected() {
    let data = this.getIndividualList();
    if (data.length > 0 && data != undefined && data != null) {
      return true;
    } else {
      return false;
    }
  }

  getCustomNda() {
    if (this.defaultNdaMessage === '') {
      this._settingService.getCustomNda().subscribe(
        (data) => {
          this.defaultNdaMessage = data.toString();
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }
  }

  removeCustomNdaFile() {
    if (!!this.CustomNdaFileName && (this.CustomNdaFileName !== '')) {

      this.CustomNdaFileName = '';
      this.customNDAFile = '';
      //  this.closecustomNda();
      this.addClassNdaVerbiage(1);
      this._toastr.success('File Removed', 'Success');

    }
  }
  bindFileToRFQ(fileName: string) {
    this.iNDAViewModel.contactId = this.irfqViewModel.contactId;
    this.iNDAViewModel.rfqId = this.irfqViewModel.rfqId;
    this.iNDAViewModel.companyId = (this.iContactViewModel.companyId) ? this.iContactViewModel.companyId : 0;
    if (this.activeTabNdaVerbiage === 1) {
      this.iNDAViewModel.ndaFile = '';
      this.iNDAViewModel.ndaContent = this.defaultNdaMessage;
      this._rfqService.AddCustomNDAToRFQ(this.iNDAViewModel).subscribe(
        (res) => {
          if (res.result) {

            this.CustomNdaFileName = res.ndaFile;
            this.closecustomNda();
          }
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    } else if (this.activeTabNdaVerbiage === 2) {
      if (fileName !== '') {
        this.iNDAViewModel.ndaFile = fileName;
        this.iNDAViewModel.ndaContent = '';
        this._rfqService.AddCustomNDAToRFQ(this.iNDAViewModel).subscribe(
          (res) => {
            if (res.result) {

              this.CustomNdaFileName = res.ndaFile;
              this.closecustomNda();
            }
          },
          error => {
            this.handleError(error);
          },
          () => { }
        );
      }
    }
  }
  bindFileToRFQSubmit(fileName: string) {
    this.iNDAViewModel.contactId = this.irfqViewModel.contactId;
    this.iNDAViewModel.rfqId = this.irfqViewModel.rfqId;
    this.iNDAViewModel.companyId = (this.iContactViewModel.companyId) ? this.iContactViewModel.companyId : 0;
    if (this.activeTabNdaVerbiage === 1) {
      this.iNDAViewModel.ndaFile = '';
      this.iNDAViewModel.ndaLevel = 1;
      this.iNDAViewModel.ndaContent = this.defaultNdaMessage;
      if (this.irfqViewModel.isDefaultNDAdetails) {
        this.iNDAViewModel.isDefaultNDAdetails = true;
      } else {
        this.iNDAViewModel.isDefaultNDAdetails = false;
      }
      this._rfqService.AddCustomNDAToRFQ(this.iNDAViewModel).subscribe(
        (res) => {
          if (res.result) {
            this.CustomNdaFileName = res.ndaFile;
            this.closecustomNda();
          }
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    } else if (this.activeTabNdaVerbiage === 2) {
      if (fileName !== '') {
        this.iNDAViewModel.ndaFile = fileName;
        this.iNDAViewModel.ndaContent = '';
        this.iNDAViewModel.ndaLevel = 2;
        if (this.irfqViewModel.isDefaultNDAdetails) {
          this.iNDAViewModel.isDefaultNDAdetails = true;
        } else {
          this.iNDAViewModel.isDefaultNDAdetails = false;
        }
        this._rfqService.AddCustomNDAToRFQ(this.iNDAViewModel).subscribe(
          (res) => {
            if (res.result) {
              this.CustomNdaFileName = res.ndaFile;
              this.closecustomNda();
            }
          },
          error => {
            this.handleError(error);
          },
          () => { }
        );
      }
    }
  }
  getAddress() {
    const id = this.loggedId;
    this._profileService.getAddress(id).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        this.iShippingAddressModelCYP = data;
        if (this.iContactViewModel2 && this.iContactViewModel2.address &&
          this.iContactViewModel2.address.companyShippingSiteViewModelList) {
          this.shippingReviewData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
          for (const entry of this.shippingReviewData) {
            if (entry.siteId === this.irfqViewModel.shipTo) {
              this.shippingAddress.siteLabel = entry.siteLabel;
              this.shippingAddress.companyName = entry.companyName;
              this.shippingAddress.streetAddress = entry.addresses.streetAddress;
              this.shippingAddress.deptAddress = entry.addresses.deptAddress;
              this.shippingAddress.city = entry.addresses.city;
              this.shippingAddress.postalCode = entry.addresses.postalCode;
              this.shippingAddress.state = entry.addresses.state;
              this.shippingAddress.country = entry.addresses.country;
            }
          }
        }
      },
      error => () => {
        console.error('Error: $error');
        this._toastr.error(error, 'Error!');
      }
    );
  }
  getSavedCustomeNdaFiles() {

    this._rfqService.GetCustomNDAToRFQ(this.irfqViewModel.rfqId).subscribe(
      (res) => {
        if (res.result === true) {

          if (!!res.ndaContent && res.ndaContent !== '') {
            this.isStandardNda = true;
          } else {
            if (!res.ndaFile || (res.ndaFile.length === 0)) {
              this.isStandardNda = true;
            } else {
              this.irfqViewModel.ndaFile = res.ndaFile;
              this.activeTabNdaVerbiage = 2;
              this.isStandardNda = false;
              this.customNDAFile = res.ndaFile;
              this.isCustomNdTab = 1;
              this.showCustomNdaDiv = true;
              this.CustomNdaFileName = res.ndaFile;
            }
          }
          if (res.fileId !== 0 && res.fileId !== undefined && res.fileId !== null) {
            this.irfqViewModel.ndaFileId = res.fileId;
          }
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  checkIsLetMeChoose() {
    if (this.dispalyIndividualGrpsAttachment) {
      if (this.SpecialInvitedNameModelColl !== undefined) {
        // tslint:disable-next-line:max-line-length
        if (this.SpecialInvitedNameModelColl.length > 0 && (this.SpecialInvitedNameModelColl.filter(x => (x.isDelete === false))).length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  checkRfqValidation() {
    // tslint:disable-next-line:max-line-length
    if (this.irfqViewModel.awardDate !== null && this.irfqViewModel.quotesNeededBy !== null &&
      this.irfqViewModel.shipTo !== 0 && this.iDefaultAddressModel.result === true &&
      this.irfqViewModel.awardDate !== undefined && this.irfqViewModel.quotesNeededBy !== undefined &&
      this.irfqViewModel.preferredMfgLocationIds.length !== 0 &&
      this.checkIsLetMeChoose()) {
      return this.isNdaClicked;
    } else {
      return true;
    }
  }
  SpecialInstructionChanged() {
    if (this.irfqViewModel.isSpecialInstructionToManufacturer) {
      // tslint:disable-next-line:max-line-length
      if (this.irfqViewModel.specialInstructionToManufacturer !== null && this.irfqViewModel.specialInstructionToManufacturer !== '' && this.irfqViewModel.specialInstructionToManufacturer !== undefined) {
        if (this.irfqViewModel.specialInstructionToManufacturer.trim() === '') {
          this.isSpecialInstructionError = true;
        } else {
          this.isSpecialInstructionError = false;
          this.isSaveRfqDetailsBtnClicked = false;
        }
      }
    } else {
      this.isSpecialInstructionError = false;
      this.isSaveRfqDetailsBtnClicked = false;
    }
  }

  checkSecondStepIsValid() {
    if (this.irfqViewModel.awardDate === null) {
      this.isAwardDateError = true;
      window.scrollTo(0, 0);
      this.isReviewRfq = false;
    } else {
      this.isAwardDateError = false;
    }
    if (this.irfqViewModel.isSpecialInstructionToManufacturer) {
      if (this.irfqViewModel.specialInstructionToManufacturer !== null) {
        if (this.irfqViewModel.specialInstructionToManufacturer === '') {
          this.isSpecialInstructionError = true;
          // window.scrollTo(0, 0);
          this.isReviewRfq = false;
        } else {
          this.isSpecialInstructionError = false;
        }
      } else {
        this.isSpecialInstructionError = true;
        // window.scrollTo(0, 0);
        this.isReviewRfq = false;
      }
    } else {
      this.isSpecialInstructionError = false;
    }
    if (this.irfqViewModel.isSpecialCertificationsByManufacturer) {
      if (this.CertificationselectedItems.length === 0) {
        this.isCertificationError = true;
        this.isReviewRfq = false;
        // window.scrollTo(0, 0);
      } else {
        this.isCertificationError = false;
      }
    } else {
      this.isCertificationError = false;
    }
    if (this.irfqViewModel.quotesNeededBy === null) {
      this.isQuotedByDateError = true;
      window.scrollTo(0, 0);
    } else {
      this.isQuotedByDateError = false;
    }
    if (this.irfqViewModel.shipTo === 0 || this.irfqViewModel.shipTo === null || this.irfqViewModel.shipTo == undefined) {
      this.isShip2To = true;
      window.scrollTo(0, 720);
    } else {
      this.isShip2To = false;
    }
    if (this.irfqViewModel.rfqName == null || this.irfqViewModel.rfqName == undefined || this.irfqViewModel.rfqName.trim() == '') {
      this.rfqnameError = true;
      window.scrollTo(0, 0);
    } else {
      this.rfqnameError = false;
    }
    if (this.irfqViewModel.preferredMfgLocationIds.length == 0) {
      this.regionError = true;
      window.scrollTo(0, 0);
    } else {
      this.regionError = false;
    }
    if (this.irfqViewModel.rfqPurpose == null || this.irfqViewModel.rfqPurpose == undefined || this.irfqViewModel.rfqPurpose == 0 || this.irfqViewModel.rfqPurpose == 'null') {
      this.rfqPurposeError = true;
      window.scrollTo(0, 10);
    } else {
      this.rfqPurposeError = false;
    }
    if (!this.isAwardDateError && !this.isQuotedByDateError && !this.isSpecialInstructionError && !this.isCertificationError && !this.isShip2To && !this.rfqnameError && !this.regionError && !this.rfqPurposeError) {
      this.saveRfqDetails(false);
      return true;
    } else {
      return false;
    }

  }

  saveRfqDetails(toShowToster = true) {

    if (!this.isSaveRfqDetailsBtnClicked) {
      this.isSaveRfqDetailsBtnClicked = true;
      this.isReviewRfq = true;

      if (this.checkSecondStepIsValid()) {
        if ((this.irfqViewModel.isRegisterSupplierQuoteTheRfq === true) || (this.irfqViewModel.isRegisterSupplierQuoteTheRfq === false && this.isIndiOrGroupSelected()) && this.irfqViewModel.rfqName != null && this.irfqViewModel.rfqName != undefined && this.irfqViewModel.rfqName.trim() != '') {
          this.rfqPurposeError = false;
          if (this.irfqViewModel.rfqPurpose !== null && this.irfqViewModel.rfqPurpose !== undefined && this.irfqViewModel.rfqPurpose !== 0 || this.irfqViewModel.rfqPurpose == 'null') {

            this.irfqViewModel.rfqName = this.irfqViewModel.rfqName.trim();
            const price = this.fileprice.nativeElement.src.split('/');
            const speed = this.filespeed.nativeElement.src.split('/');
            const quality = this.filequality.nativeElement.src.split('/');

            const draggablePrice = price[price.length - 1];
            const draggableSpeed = speed[speed.length - 1];
            const draggableQuality = quality[quality.length - 1];
            if (draggablePrice === 'button-price.png') {
              this.irfqViewModel.importancePrice = 2;
            }
            if (draggablePrice === 'button-quantity.png') {
              this.irfqViewModel.importanceQuality = 2;
            }
            if (draggablePrice === 'button-speed.png') {
              this.irfqViewModel.importanceSpeed = 2;
            }

            if (draggableQuality === 'button-price.png') {
              this.irfqViewModel.importancePrice = 1;
            }
            if (draggableQuality === 'button-quantity.png') {
              this.irfqViewModel.importanceQuality = 1;
            }
            if (draggableQuality === 'button-speed.png') {
              this.irfqViewModel.importanceSpeed = 1;
            }
            if (draggableSpeed === 'button-price.png') {
              this.irfqViewModel.importancePrice = 3;
            }
            if (draggableSpeed === 'button-quantity.png') {
              this.irfqViewModel.importanceQuality = 3;
            }
            if (draggableSpeed === 'button-speed.png') {
              this.irfqViewModel.importanceSpeed = 3;
            }
            this.irfqViewModel.isSpecialCertificationsByManufacturer = this.irfqViewModel.isSpecialCertificationsByManufacturer;
            this.irfqViewModel.isSpecialInstructionToManufacturer = this.irfqViewModel.isSpecialInstructionToManufacturer;
            if (!this.irfqViewModel.isSpecialCertificationsByManufacturer) {
              this.irfqViewModel.certificationsByManufacturer = '';
            }
            if (!this.irfqViewModel.isSpecialInstructionToManufacturer) {
              this.irfqViewModel.specialInstructionToManufacturer = '';
            }
            if (this.irfqViewModel.whoPaysForShipping === 1) {
              this.irfqViewModel.userType = 1;
            } else {
              this.irfqViewModel.userType = 2;
            }
            this.irfqViewModel.modifiedBy = this.loggedId;
            this.irfqViewModel.whoPaysForShipping = this.irfqViewModel.whoPaysForShipping;
            this.irfqViewModel.isPartialQuotingAllowed = this.irfqViewModel.isPartialQuotingAllowed;

            let tempQuoteNeedBy = moment(this.irfqViewModel.quotesNeededBy).hours(23).minutes(59).seconds(59);
            this.irfqViewModel.quotesNeededBy = moment.utc(tempQuoteNeedBy).format('YYYY-MM-DD HH:mm:ss');

            let tempAwardDate = moment(this.irfqViewModel.awardDate).hours(23).minutes(59).seconds(59);
            this.irfqViewModel.awardDate = moment.utc(tempAwardDate).format('YYYY-MM-DD HH:mm:ss');
            // add delivery date in the irfq model
            let deliveryDate = moment(this.iPartsViewModel.deliveryDate).hours(23).minutes(59).seconds(59);
            this.irfqViewModel.deliveryDate = moment.utc(deliveryDate).format('YYYY-MM-DD HH:mm:ss');
            this.irfqViewModel.preferredMfgLocationIds = this.irfqViewModel.preferredMfgLocationIds;
            this.certificateList = [];


            this.CertificationselectedItems.forEach(element => {
              this.certificateList.push(element.certificateId);
            });
            if (this.irfqViewModel.ndaFile !== '') {
              this.irfqViewModel.ndaContent = '';
            }

            this.irfqViewModel.certificateIdList = this.certificateList;
            this.irfqViewModel.isDefaultNDAdetails = this.irfqViewModel.isDefaultNDAdetails;
            // if (this.irfqViewModel.isDefaultNDAdetails) {
            //   this.irfqViewModel.isProfileNDA = true;
            // }
            if (this.activeTab === 0) {
              this.irfqViewModel.ndaTypekey = 'RFX_SECURITYTYPE_NO_SECURE';
            } else if (this.activeTab === 1) {
              this.irfqViewModel.ndaTypekey = 'RFX_SECURITYTYPE_TOTALY_SECURE';
            } else if (this.activeTab === 2) {
              this.irfqViewModel.ndaTypekey = 'RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR';
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
            } else {
              if (this.CustomNdaFileName !== '') {
                this.irfqViewModel.ndaFile = this.CustomNdaFileName;
              } else {
                this.irfqViewModel.ndaContent = this.defaultNdaMessage;
              }
            }
            for (let entry of this.irfqViewModel.preferredMfgLocationIds) {
              if (entry == null) {
                entry = '';
              }
            }
            if (!this.irfqViewModel.isRegisterSupplierQuoteTheRfq) {
              this.SpecialInvitedModelColl = [];
              this.SpecialInvitedNameModelColl.forEach(element => {
                if (element.isDelete === false) {
                  this.SpecialInvitedModel.inviteId = element.inviteId;
                  this.SpecialInvitedModel.type = element.type;
                  this.SpecialInvitedModelColl.push(this.SpecialInvitedModel);
                  this.initSpecialFileModel();
                }
              });
            }

            let FullQuoteDate = '';
            let FullAwardDate = '';
            if (this.irfqViewModel.quotesNeededBy !== null) {
              const Quoteday = new Date(this.irfqViewModel.quotesNeededBy).getDate();
              const Quotemonth = new Date(this.irfqViewModel.quotesNeededBy).getMonth();
              const Quoteyear = new Date(this.irfqViewModel.quotesNeededBy).getFullYear();
              FullQuoteDate = Quoteday.toString() + Quotemonth.toString() + Quoteyear.toString();
            }
            if (this.irfqViewModel.awardDate !== null) {
              const Awardday = new Date(this.irfqViewModel.awardDate).getDate();
              const Awardmonth = new Date(this.irfqViewModel.awardDate).getMonth();
              const Awardyear = new Date(this.irfqViewModel.awardDate).getFullYear();
              FullAwardDate = Awardday.toString() + Awardmonth.toString() + Awardyear.toString();
            }
            if (this.OldQuoteDate !== FullQuoteDate || this.OldAwardDate !== FullAwardDate) {
              this.irfqViewModel.isOnlyDateChanged = true;
            } else {
              this.irfqViewModel.isOnlyDateChanged = false;
            }
            this.irfqViewModel.SpecialinviteList = this.SpecialInvitedModelColl;
            this.irfqViewModel.contactId = this.loggedId;
            this.irfqViewModel.rfqCreatedOn = this.irfqViewModel.rfqCreatedOn;
            this.irfqViewModel.rfqStatusId = this.irfqViewModel.rfqStatusId;
            this.iRfqBuyerStatus.rfqBuyerstatusLiKey = 'RFX_BUYERSTATUS_PENDING_RELEASE';
            this.irfqViewModel.rfqBuyerStatus = this.iRfqBuyerStatus;

            this.irfqViewModel.isDefaultPrefferedManufacturingLocation = this.irfqViewModel.isDefaultPrefferedManufacturingLocation;
            this.irfqViewModel.isRegisterSupplierQuoteTheRfq = this.irfqViewModel.isRegisterSupplierQuoteTheRfq;
            this._rfqService.AddRFQExtraDetails(this.irfqViewModel).subscribe(
              result => {
          
                console.log(result,"result");
                this.updatedRfq = result.rfqId;
                this.configDatePicker();
                this.irfqViewModel.result = result['result'];
                this.rfq_payer = result.whoPaysForShipping;
                this.rfq_payment_method = result.payment_term_id;
                this.communication_method = result.prefRfqCommunicationMethod;
                this.nda_type = result.prefNdaType;
                this.resRfqId = result.rfqId
                this.cloneDelivaryDate = result.maxDeliveryDate;
                this.manufactureLoc = result.preferredMfgLocationIds;
                this.irfqViewModel.errorMessage = result['errorMessage'];
                this.rfqDetailsMixPanel();
                this.triggerPendo(this.rfqCountdata,"Review")
                if (this.irfqViewModel.result === true) {
                  this.isSaveRfqDetailsBtnClicked = false;
                  this.isReviewRfq = false;
                  this.isThirdTabCompleted = true;
                  this.isRfqName = false;
                  this.isAddPartStatus = true;
                  this.isAddPartActive = true;
                  this.isAddPart = false;

                  this.isRfqDetails = false;
                  this.isRfqDetailsActive = true;
                  this.isRfqDetailsStatus = true;

                  this.isRfqReview = true;
                  this.isRfqReviewActive = true;
                  this.isRfqReviewStatus = false;

                  this.isSidePanel = false;
                  this.addShippingform = false;
                  this.isPartClicked = false;
                  this.addressList = false;
                  this.isPartsLibrarayClicked = false;
                  // this.loadAddress();
                  this.getCustomNda();
                  window.scrollTo(0, 0);
                  if (toShowToster) {
                    this._toastr.success(this.irfqViewModel.errorMessage, 'Success!');
                  }
                  this.closeAttachementDiv();
                  this.initReviewPage();
                } else {

                  this.isSaveRfqDetailsBtnClicked = false;
                  this._toastr.warning(this.irfqViewModel.errorMessage, 'Warring!');
                  this.isReviewRfq = false;
                  this.initReviewPage();
                  this.irfqViewModel.quotesNeededBy = null;
                  this.irfqViewModel.awardDate = null;
                  window.scrollTo(0, 100);
                }
                this.encryptedRfqID = this._profileService.encrypt(this.irfqViewModel.rfqId);
                localStorage.setItem('encryptedRfqID', this.encryptedRfqID)
                this.sendEncryptedId();
              },
              error => {
                this.isSaveRfqDetailsBtnClicked = false;
                this.handleError(error);
                this.isReviewRfq = false;
              },
              () => { }
            );
          } else {
            this.rfqPurposeError = true;
            this.isReviewRfq = false;
            this.isSaveRfqDetailsBtnClicked = false;
            window.scrollTo(0, 20);
          }
        } else {
          if (this.irfqViewModel.isRegisterSupplierQuoteTheRfq === false && !this.isIndiOrGroupSelected()) {
            this._toastr.warning('Manufacturer section cannot be blank, Select atleast one manufacture for create rfq', 'Warning!')
          }
          this.showLetMeChooseValidationMsg = true;
          this.isSaveRfqDetailsBtnClicked = false;
          window.scrollTo(0, 0);
          this.isReviewRfq = false;
        }
      } else {
        this.isReviewRfq = false;
        this.isSaveRfqDetailsBtnClicked = false;
      }
    }

  }

  sendEncryptedId(){
    this.updatedencryptedRfqID = localStorage.getItem('encryptedRfqID')

    var reqData = {
        "rfqId": this.updatedRfq,
        "encryptedRfqId" : this.updatedencryptedRfqID
    }
      this._rfqService.sendEncryptedRfqId(reqData).subscribe((result: any) => {
        console.log(result ,"Called Sended Encrypted ID");
        
      });
    
  }

  uploadGenAttachementFile(fileItem: any) {
    const files = this.uploaderGeneralAttach.queue;
    const index = this.uploaderGeneralAttach.getIndexOfItem;
    const file = fileItem._file;
    this.upload(file).subscribe(res => {
      const resultData = JSON.parse(res['_body']);
      const fNmae = resultData['fileName'];
      // debugger;
      this.irfqViewModel.rfqGeneralAttachmentsList = [];
      this.irfqViewModel.rfqGeneralAttachmentsList.push(fNmae);
      this.irfqViewModel.contactId = this.loggedId;
      this._rfqService.addRfqGeneralAttachment(this.irfqViewModel).subscribe(
        result => {
          this.uplocount = this.uplocount + 1;
          if (result.result === true) {
            this.getSavedRFQDetailsForAttachment();
          } else {
            this._toastr.error(this.irfqViewModel.errorMessage, 'Error!');
          }
        },
        error => {
          this.handleError(error);
        },
        () => { }
      );
    });
  }
  getNdaInfo() {
    this._settingService.getNdaInfo(this.loggedId).subscribe(
      (data) => {
        if (this.irfqViewModel.ndaTypekey === '') {
          if (data.ndaContent === null || data.ndaContent === undefined) {
            this.activeTabNdaVerbiage = 1;
            this.showCustomNdaDiv = false;

          } else if (data.ndaContent === '') {
            this.activeTabNdaVerbiage = 2;
            this.showCustomNdaDiv = true;
            this.CustomNdaFileName = data.ndaFile;
            this.irfqViewModel.ndaFile = data.ndaFile;
          } else {
            this.activeTabNdaVerbiage = 1;
            this.showCustomNdaDiv = false;
          }
          if (data.fileId !== 0 && data.fileId !== undefined && data.fileId !== null) {
            this.irfqViewModel.ndaFileId = data.fileId;
            this.irfqViewModel.ndaFile = data.ndaFile;
          }
          // data.ndaLevel === 0 ||
          if ( data.ndaLevel === 1 || data.ndaLevel === 2) {
            this.activeTab = data.ndaLevel;
          } else {
            // this.activeTab = 0;
          }
        }
      }
    );
  }


  refreshRfqParts() {
    this._rfqService.getRfqParts(this.irfqViewModel.rfqId).subscribe(
      result => {
        if (result.length === 0) {
          this.activeNextButton = false
        }
        if (result.length >= 1) {

          this.iPartsViewModelColl = result;
          this.iPartsViewModelColTemp = result;
          this.iReviewPartsViewModelColl = result;
          let checkCondition = _.find(this.iPartsViewModelColTemp, ['partName', ""]);
          if (checkCondition === undefined) {
            this.activeNextButton = true
          } else {
            this.activeNextButton = false
          }
          // checking the 1Quantity validation
          this.iPartsViewModelColTemp.forEach(element => {
            if (element.rfqPartQuantityList != null && element.rfqPartQuantityList.length != 0) {
              // debugger
              // this.activeNextButton = true
            } else {
              this.activeNextButton = false
            }
          });
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  loadAddress() {
    const id = this.loggedId;
    this._profileService.getAddress(id).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        localStorage.setItem('addressModel', JSON.stringify(this.iContactViewModel2));
        this.iShippingAddressModelCYP = data;
        this.addDefaultShipping();
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        for (const entry of this.shippingAddressData) {
          // remove Commented
          // const shippingStateName = this.iRegionModelAll.find(i => i.regionId ===  entry['addresses'].stateId).regionName;
          // entry.state = shippingStateName;
          if (this.irfqViewModel.shipTo !== 0) {
            if (entry.companyName !== '') {
              this.isCompanyPresent = false;
              this.CompanyName = entry.companyName;
            }
            if (this.latestAddressId !== 0) {
              if (entry.addressId === this.latestAddressId) {
                this.iDefaultAddressModel.result = true;
                this.iDefaultAddressModel.city = entry.addresses.city;
                this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
                this.iDefaultAddressModel.country = entry.addresses.country;
                this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
                this.iDefaultAddressModel.state = entry.addresses.state;
                this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
                this.iDefaultAddressModel.address5 = entry.siteLabel;
                this.iDefaultAddressModel.addressType = entry.siteId;
                this.irfqViewModel.shipTo = this.latestAddressId;
                this.isShip2To = false;
              }
            } else {
              if (entry.siteId === this.irfqViewModel.shipTo) {
                this.iDefaultAddressModel.result = true;
                this.iDefaultAddressModel.city = entry.addresses.city;
                this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
                this.iDefaultAddressModel.country = entry.addresses.country;
                this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
                this.iDefaultAddressModel.state = entry.addresses.state;
                this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
                this.iDefaultAddressModel.address5 = entry.siteLabel;
                this.iDefaultAddressModel.addressType = entry.siteId;
                this.isShip2To = false;
              }
            }

          } else {
            if (entry.companyName !== '') {
              this.isCompanyPresent = false;
              this.CompanyName = entry.companyName;
            }
            if (entry.defaultSite === true) {
              if (entry.companyName !== '') {
                this.isCompanyPresent = false;
                this.CompanyName = entry.companyName;
              }
              this.iDefaultAddressModel.result = true;
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.isShip2To = false;
            }
          }
          if (entry.defaultSite) {
            this.checkAddress = true;
          }
        }
        if (this.shippingAddressData.length >= 5) {
          this.isShiiping5 = true;
        } else {
          this.isShiiping5 = false;
        }
      },
      error => () => {
        this._toastr.error(error, 'Error!');
      }
    );
  }

  onSaveShippingInfo() {
    this.inintShippingAddress();

    if (!this.isAddShippingBtnClicked) {
      this.isSaveAddress = true;
      this.isAddShippingBtnClicked = true;
      if (this.shippingForm.valid && this.isStateValid && this.isCountryValid) {
        if (this.isShiiping5) {
          this._toastr.error('You have added 5 shipping address', 'Error!');
        } else {

          if (this.shippingForm.value.addressId === null) {
            this.shippingForm.value.addressId = 0;
          }
          this.iAddressModel.addressId = this.shippingForm.value.addressId;
          this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
          this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
          this.iAddressModel.city = this.shippingForm.value.city;
          this.iAddressModel.stateId = this.shippingForm.value.stateId;
          this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
          this.iAddressModel.addressType = 2;
          this.iAddressModel.countryId = this.shippingForm.value.countryId;
          this.iAddressModel.addressType = 2;
          this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
          this.iCompanyShippingSiteViewModel.siteLabel = this.shippingForm.value.siteLabel;
          this.iCompanyShippingSiteViewModel.companyName = this.shippingForm.value.companyName;
          if (this.shippingForm.value.defaultSite === null) {
            this.shippingForm.value.defaultSite = false;
          }
          this._profileService.getAddress(this.loggedId).subscribe(
            (data: IContactViewModel) => {
              this.iContactViewModel3 = data;
              this.mailingAddressData = this.iContactViewModel3.address;
              this.iAddressModel.addressId = this.shippingForm.value.addressId;
              this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
              this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
              this.iAddressModel.city = this.shippingForm.value.city;
              this.iAddressModel.stateId = this.shippingForm.value.stateId;
              this.iAddressModel.countryId = this.shippingForm.value.countryId;
              this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
              this.iAddressModel.addressType = 1;
              this.iContactViewModel.contactId = this.loggedId;
              this.iContactViewModel.address = this.iAddressModel;
              this.iAddressModel.showOnlyStateCity = false;
              this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
                result => {
                  this.iContactViewModel = result;
                  if (this.iContactViewModel.result === true) {
                    if (this.mailingAddressData.city === null) {
                      this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                        result => {
                          this.iContactViewModel = result;
                          if (this.iContactViewModel.result === true) {
                            this.loadAddress();
                            // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                            // this.closePartDrawer();
                          } else {
                            this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                          }
                        })
                    }
                  }
                })
            })
          this.iCompanyShippingSiteViewModel.defaultSite = this.shippingForm.value.defaultSite;
          this.iCompanyShippingSiteViewModel.siteCreationDate =
            '2018-07-26T11:29:23.616Z';
          this.iAddressModel.companyShippingSiteViewModelList.push(
            this.iCompanyShippingSiteViewModel
          );
          this.iContactViewModel.contactId = this.loggedId;
          this.iContactViewModel.address = this.iAddressModel;
          this.irfqViewModel.rfqId = this.irfqViewModel.rfqId;
          if (this.iAddressModel.addressId === 0) {
            this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
              result => {

                this.iContactViewModel = result;
                this.iInfoModelCYP = result;
                if (this.iContactViewModel.result === true) {

                  this.latestAddressId = this.iContactViewModel.address.companyShippingSiteViewModelList[0].siteId;
                  this.isAddShippingBtnClicked = false;
                  this.isSaveAddress = false;
                  this.shippingForm.reset();
                  this.loadAddress();
                  this.addShippingform = false;
                  this.addressList = true;
                  this._toastr.success(this.iContactViewModel.errorMessage, '');
                } else {
                  this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                  this.isSaveAddress = false;
                }
              },
              error => {
                this.handleError(error);
              },
              () => { }
            );
          } else {
            this.iAddressModel.addressId = this.shippingForm.value.addressId;
            this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
            this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
            this.iAddressModel.city = this.shippingForm.value.city;
            this.iAddressModel.stateId = this.shippingForm.value.stateId;
            this.iAddressModel.countryId = this.shippingForm.value.countryId;
            this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
            this.iAddressModel.addressType = 2;
            this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
            this.iCompanyShippingSiteViewModel.siteLabel = this.shippingForm.value.siteLabel;
            this.iCompanyShippingSiteViewModel.companyName = this.shippingForm.value.companyName;
            this.iCompanyShippingSiteViewModel.siteId = this.cuSiteId;
            this.iCompanyShippingSiteViewModel.defaultSite = this.shippingForm.value.defaultSite;
            this.iCompanyShippingSiteViewModel.siteCreationDate =
              '2018-07-26T11:29:23.616Z';
            this.iAddressModel.companyShippingSiteViewModelList.push(
              this.iCompanyShippingSiteViewModel
            );
            this.iContactViewModel.contactId = this.loggedId;
            this.iContactViewModel.address = this.iAddressModel;
            this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
              result => {
                this.iContactViewModel = result;
                this.iInfoModelCYP = result;
                if (this.iContactViewModel.result === true) {
                  //  this.latestAddressId  = this.iContactViewModel.address.addressId;
                  this.isAddShippingBtnClicked = false;
                  this.shippingForm.reset();
                  this.addShippingform = false;
                  this.addressList = true;
                  this.loadAddress();
                  this._toastr.success(this.iContactViewModel.errorMessage, '');
                } else {
                  this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                }
              },
              error => {
                this.handleError(error);
              },
              () => { }
            );
          }
        }
      } else {
        this._customValidatorsService.validateAllFormFields(this.shippingForm);
      }
    }

  }
  removeGeneralAttachement(fileItem: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove attachment?',
      header: 'Remove Attachment',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._rfqService.deleteRfqGeneralAttachment(fileItem, this.irfqViewModel.contactId, this.irfqViewModel.rfqId).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (result) => {
            if (result.result === true) {
              this.getSavedRFQDetailsForAttachment();
              this._toastr.success(result.errorMessage, '');
            } else {
              this._toastr.success(this.iContactViewModel.errorMessage, result.errorMessage);
            }
          },
          error => () => {
            console.error('Error: $error');
            this._toastr.error(error, 'Error!');
          }
        );
      },
      reject: () => { }
    });
  }


  cancelRfq() {
    // ******Setting the local-storage value false to restricting part drawer******
    this.fromGetStartedFlow = 'false';
    localStorage.setItem('fromGetStartedFlow', this.fromGetStartedFlow)
    this.cancelModalReference.close();
    this._rfqService.updateRFQStatus('RFX_BUYERSTATUS_DRAFT', this.irfqViewModel.rfqId, this.loggedId).subscribe(
      result => {
        if (result['result'] === true) {
          this._toastr.success(result['errorMessage'], '');
        } else {
          this._toastr.error(result.errorMessage, 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
    // this.router.navigate(['/rfq/draftrfqs']);
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/rfq/draftrfqs']);
    });
    this.initRfqModel();
    // this.createRFQForm();
    // this.isRfqName = true;
    this.isAddPart = true;
    this.isRfqDetails = false;
    this.isRfqReview = false;
    // this.isRfqNameStatus = false;
    this.isAddPartStatus = false;
    this.isRfqDetailsStatus = false;
    this.isRfqReviewStatus = false;
    this.isRfqNameActive = true;
    this.isAddPartActive = false;
    this.isRfqDetailsActive = false;
    this.isRfqReviewActive = false;
    this.isSidePanel = false;
    this.uploader.queue.length = 0;
    this.isFileDropped = false;
    this.isFirstTabCompleted = false;
    this.isSecondTabCompleted = false;
    this.isThirdTabCompleted = false;
    this.isFourthTabCompleted = false;
    this.partUplodcount = 0;
    this.isSidePanel = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.iPartsViewModelColl = [];
    this.inintShippingAddress();
    this.initializeModel();
    this.initPartViewModel();
  }

  closeCancelModel() {
    this.isCancelBtn = false;
    this.cancelModalReference.close();
  }
  cancelRFQon2ndStep(message) {
    this.fromGetStartedFlow = 'false';
    localStorage.setItem('fromGetStartedFlow', this.fromGetStartedFlow)
    this.isCancelBtn = true;
    this.cancelModalReference = this.modalService.open(this.cancelModel, {
      backdrop: 'static'
    });
    // return confirm('?');

    // let MessageToDisplay = '';
    // if (message === '2ndStep') {
    //   MessageToDisplay = 'Are you sure you want to quit this RFQ? RFQs details and parts will be saved for later in your Draft RFQs page.';
    // } else if (message === '1stStep') {
    //   MessageToDisplay = 'Are you sure you want to cancel and not save?';
    // }

    // this.confirmationService.confirm({
    //   message: "Are you sure you want to cancel this RFQ? <br>This RFQ will be moved to Draft RFQs, you will have to edit and re-submit in the future to continue. Would you like to cancel this RFQ?",
    //   header: 'Cancel RFQ',
    //   icon: null,
    //   accept: () => {
    //     this.router.navigate(['/rfq/draftrfqs']);
    //     this.initRfqModel();
    //     // this.createRFQForm();
    //     // this.isRfqName = true;
    //     this.isAddPart = true;
    //     this.isRfqDetails = false;
    //     this.isRfqReview = false;
    //     // this.isRfqNameStatus = false;
    //     this.isAddPartStatus = false;
    //     this.isRfqDetailsStatus = false;
    //     this.isRfqReviewStatus = false;
    //     this.isRfqNameActive = true;
    //     this.isAddPartActive = false;
    //     this.isRfqDetailsActive = false;
    //     this.isRfqReviewActive = false;
    //     this.isSidePanel = false;
    //     this.uploader.queue.length = 0;
    //     this.isFileDropped = false;
    //     this.isFirstTabCompleted = false;
    //     this.isSecondTabCompleted = false;
    //     this.isThirdTabCompleted = false;
    //     this.isFourthTabCompleted = false;
    //     this.partUplodcount = 0;
    //     this.isSidePanel = false;
    //     this.isPartClicked = false;
    //     this.addressList = false;
    //     this.isPartsLibrarayClicked = false;
    //     this.addGenAttachementDiv = false;
    //     this.dispalyIndividualGrps = false;
    //     this.iPartsViewModelColl = [];
    //     this.inintShippingAddress();
    //     this.initializeModel();
    //     this.initPartViewModel();
    //   },
    //   reject: () => {}
    // });
  }
  onProfileCountryChange() {

    let tempCountryId: string;
    // if (isNumber(this.iShppingForCYP.addresses.countryId)) {
    //   tempCountryId = this.iShppingForCYP.addresses.countryId.toString();
    // } else {
    //   tempCountryId = this.iShppingForCYP.addresses.countryId;
    // }
    this._masterService.getState(tempCountryId).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      (data2: IRegionModel[]) => {
        this.iRegionModel = [];
        this.iRegionModelAll = data2['stateData'];
      },
      error => () => {
        this._toastr.error(error, 'Error!');
      }
    );
  }
  onCYPOpenRegionModelAll() {
    this._masterService.getState('0').subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      (data2: IRegionModel[]) => {
        this.iRegionModelAll = data2['stateData'];
      },
      error => () => {
        this._toastr.error(error, 'Error!');
      }
    );
  }
  onCountryChange(id) {
    if (id === 0) {
      this._masterService.getState(this.shippingForm.value.countryId).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModel = data2['stateData'];
          this.shippingForm.controls['stateId'].setValue('');
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    } else {
      this._masterService.getState(this.shippingForm.value.countryId).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModel = data2['stateData'];
          // this.shippingForm.controls['stateId'].setValue('');
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }
  }
  onCypCountryChange() {
    const countryId = this.iShppingForCYP.addresses.countryId;
    this._masterService.getState(countryId.toString()).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      (data2: IRegionModel[]) => {
        this.iRegionModel = [];
        this.iRegionModel = data2['stateData'];
      },
      error => () => {
        this._toastr.error(error, 'Error!');
      }
    );

  }
  submitRFQ(modalDefault) {
    // debugger;
    // console.log("this.donNotShowOrderManagment@@@",this.donNotShowOrderManagment)
    // call set api to set the value
    this._rfqService.saveOrderManagementChecked(this.loggedId, this.donNotShowOrderManagment).subscribe(
      result => {
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
    this.fromGetStartedFlow = 'false';
    localStorage.setItem('fromGetStartedFlow', this.fromGetStartedFlow)
    this.confCompanyDetails(false);
    const id = this.loggedId;
    this._profileService.getProfileDetails(this.loggedEncryptId, this.loggedId).subscribe(
      result => {
        ;
        this.iInfoModelCYP = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iInfoModelCYP));

        if (this.iInfoModelCYP.originalContactPictureFile === '' || !this.iInfoModelCYP.originalContactPictureFile) {
          this.uploadProfileLogoName = '';
        } else {
          this.uploadProfileLogoName = this.defaultAwsPath + this.iInfoModelCYP.originalContactPictureFile;
        }
        if (this.iShippingAddressModelCYP !== undefined) {
          if (!!this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList) {
            if (this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList.length !== 0) {
              if (this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList.length === 1) {
                this.iShppingForCYP = this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList[0];
              } else {
                for (const addrObj of this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList) {
                  if (addrObj.defaultSite === true) {
                    this.iShppingForCYP = addrObj;
                  }
                }
                if (this.iInfoModelCYP.address.companyShippingSiteViewModelList !== null &&
                  this.iInfoModelCYP.address.companyShippingSiteViewModelList !== undefined) {
                  if (this.iInfoModelCYP.address.companyShippingSiteViewModelList.length === 0) {
                    this.iShppingForCYP = this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList[0];
                  }
                } else {
                  this.iShppingForCYP = this.iShippingAddressModelCYP.address.companyShippingSiteViewModelList[0];
                }
              }
            }
          }

          this.onProfileCountryChange();
          if (!this.iInfoModelCYP) {
            this.isCYPSubmitted = false;
            this.openCYPModel = true;
            modalDefault.show();
          } else if (!this.iInfoModelCYP.isVarified) {
            this.isCYPSubmitted = false;
            this.openCYPModel = true;
            modalDefault.show();
          } else if (!this.iShppingForCYP.addresses) {
            this.isCYPSubmitted = false;
            this.openCYPModel = true;
            modalDefault.show();
          } else if (!this.iShppingForCYP.addresses.streetAddress ||
            !this.iShppingForCYP.addresses.city ||
            !this.iShppingForCYP.addresses.stateId ||
            !this.iShppingForCYP.addresses.postalCode ||
            !this.iShppingForCYP.addresses.countryId) {
            this.isCYPSubmitted = false;
            this.openCYPModel = true;
            modalDefault.show();
          } else {
            this.afterProfileCompleted();
          }
        } else {
          this._profileService.getAddress(id).subscribe(
            resultAddr => {
              if (!!resultAddr) {
                this.iShippingAddressModelCYP = resultAddr;
                this.resetShppingForCYP();
                if (!!resultAddr.address) {
                  if (!!resultAddr.address.companyShippingSiteViewModelList) {
                    if (resultAddr.address.companyShippingSiteViewModelList.length !== 0) {
                      if (resultAddr.address.companyShippingSiteViewModelList.length === 1) {
                        this.iShppingForCYP = resultAddr.address.companyShippingSiteViewModelList[0];
                      } else {
                        for (const addrObj of resultAddr.address.companyShippingSiteViewModelList) {
                          if (addrObj.defaultSite === true) {
                            this.iShppingForCYP = addrObj;
                          }
                        }
                        if (this.iInfoModelCYP.address === null) {
                          if (this.iInfoModelCYP.address.companyShippingSiteViewModelList.length === 0) {
                            this.iShppingForCYP = resultAddr.address.companyShippingSiteViewModelList[0];
                          }
                        }
                      }
                    }
                  }
                }
              }
              this.onProfileCountryChange();
              if (!this.iInfoModelCYP) {
                this.isCYPSubmitted = false;
                this.openCYPModel = true;
                modalDefault.show();
              } else if (!this.iInfoModelCYP.isVarified) {
                this.isCYPSubmitted = false;
                this.openCYPModel = true;
                modalDefault.show();
              } else if (!this.iShppingForCYP.addresses) {
                this.isCYPSubmitted = false;
                this.openCYPModel = true;
                modalDefault.show();
              } else if (!this.iShppingForCYP.addresses.streetAddress ||
                !this.iShppingForCYP.addresses.city ||
                !this.iShppingForCYP.addresses.stateId ||
                !this.iShppingForCYP.addresses.postalCode ||
                !this.iShppingForCYP.addresses.countryId) {
                this.isCYPSubmitted = false;
                this.openCYPModel = true;
                modalDefault.show();
              } else {
                this.afterProfileCompleted();
              }
            },
            error => {
              this.handleError(error);
              this.isCYPSubmitted = false;
              this.openCYPModel = true;
              modalDefault.show();
            },
            () => { }
          );
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
    this.rfqSubmitMixpannel();
  }
  confirmProfileToSave(modalDefault, photoURL) {
    this.iInfoModelCYP.googleImageUrl = photoURL;
    this.iInfoModelCYP.company.name = document.getElementById('txtgplace')['value'];
    this._profileService.updateProfileInfo(this.iInfoModelCYP).subscribe(
      profileResult => {

        this.iInfoModelCYP = profileResult;

        if (this.iInfoModelCYP.result === true) {
          this._profileService.getProfileForLoginDetails(this.loggedEncryptId).subscribe(
            result => {
              if (!!result.contactPictureFile && (result.contactPictureFile !== '')) {
                if (localStorage.getItem('userHeaderLogo') !== result.contactPictureFile) {
                  localStorage.setItem('userHeaderLogo', result.contactPictureFile);
                }
              }
              // localStorage.setItem('userId', result.userId);
              // localStorage.setItem('iContactViewModel' , JSON.stringify(result));
            }
          );

          localStorage.setItem('iContactViewModel', JSON.stringify(this.iInfoModelCYP));
          this._rfqService.set(this.iInfoModelCYP.companyId, 'companyId');
          this._rfqService.set(this.iInfoModelCYP.company.name, 'CompanyName');
          this.resetSubmittingForCYP();
          this.iAddressModel1.addressId = this.iShppingForCYP.addresses.addressId;
          this.iAddressModel1.countryId = this.iShppingForCYP.addresses.countryId;
          this.iAddressModel1.stateId = this.iShppingForCYP.addresses.stateId;
          this.iAddressModel1.state = this.iShppingForCYP.addresses.state;
          this.iAddressModel1.streetAddress = this.iShppingForCYP.addresses.streetAddress;
          this.iAddressModel1.deptAddress = this.iShppingForCYP.addresses.deptAddress;
          this.iAddressModel1.postalCode = this.iShppingForCYP.addresses.postalCode;
          this.iAddressModel1.city = this.iShppingForCYP.addresses.city;
          this.iAddressModel1.address5 = this.iShppingForCYP.addresses.address5;
          this.iAddressModel1.showInProfile = this.iShppingForCYP.addresses.showInProfile;
          this.iAddressModel1.showOnlyStateCity = this.iShppingForCYP.addresses.showOnlyStateCity;
          this.iAddressModel1.isActive = this.iShppingForCYP.addresses.isActive;
          this.iAddressModel1.errorMessage = this.iShppingForCYP.addresses.errorMessage;
          this.iAddressModel1.result = this.iShppingForCYP.addresses.result;
          this.iAddressModel1.companyShippingSiteViewModelList = [];
          this.iAddressModel1.addressType = 2;
          this.iCompanyShippingSiteViewModel1.addresses = null;
          this.iCompanyShippingSiteViewModel1.siteCreationDate = '2018-07-26T11:29:23.616Z';
          this.iCompanyShippingSiteViewModel1.siteId = this.iShppingForCYP.siteId;
          this.iCompanyShippingSiteViewModel1.compId = this.iShppingForCYP.compId;
          this.iCompanyShippingSiteViewModel1.companyName = this.iShppingForCYP.companyName;
          this.iCompanyShippingSiteViewModel1.contId = this.iShppingForCYP.contId;
          this.iCompanyShippingSiteViewModel1.addressId = this.iShppingForCYP.addressId;
          this.iCompanyShippingSiteViewModel1.siteLabel = this.iShppingForCYP.siteLabel;
          this.iCompanyShippingSiteViewModel1.defaultSite = this.iShppingForCYP.defaultSite;
          this.iAddressModel1.companyShippingSiteViewModelList.push(
            this.iCompanyShippingSiteViewModel1
          );
          this.iShippingAddressModelCYP.contactId = this.loggedId;
          this.iShippingAddressModelCYP.address = this.iAddressModel1;
          this._profileService.UpdateAddress(this.iShippingAddressModelCYP).subscribe(
            addressRes => {
              if (addressRes.result === true) {
                // this._toastr.success(addressRes.errorMessage, '');
                modalDefault.hide();
                localStorage.removeItem('iContactViewModel');
                this.GetProfileDetails();
                this.afterProfileCompleted();
                this.resetSubmittingForCYP();
              } else {
                this._toastr.error(addressRes.errorMessage, 'Error!');
                modalDefault.hide();
                this.confCompanyDetails(false);
                this.resetSubmittingForCYP();
              }
            },
            error => {
              this.handleError(error);
              modalDefault.hide();
              this.confCompanyDetails(false);
              this.resetSubmittingForCYP();
            },
            () => { }
          );
        } else {
          this._toastr.error(this.iInfoModelCYP.errorMessage, 'Error!');
          modalDefault.hide();
          this.confCompanyDetails(false);
        }
      },
      error => {
        this.handleError(error);
        modalDefault.hide();
        this.confCompanyDetails(false);
      },
      () => { }
    );
  }
  submitRFQofCYP(modalDefault) {

    this.isCYPSubmitted = true;
    const profilePicState = this.handleImageBox();
    if (profilePicState === 'logoFromPlaceAPI') { // Needed to work with url
      this.confirmProfileToSave(modalDefault, '');
    } else if (profilePicState === 'pastLogo') {
      // File name is already in json. No need to take any action.
      this.confirmProfileToSave(modalDefault, '');
    } else if (profilePicState === 'temporaryUploded') {
      // const filenNameArray = this.tempUploadProfileLogoName.split('_S3_');
      //   this.iUploaadedFileName.oFileName = filenNameArray[1];
      //  this.iInfoModelCYP.contactPictureFile = filenNameArray[1];
      this.confirmProfileToSave(modalDefault, '');
    } else if (profilePicState === 'readyToUpload') {
      // this._toastr.error('Please upload file or choose by company name at top', 'Error!');
      this.confirmProfileToSave(modalDefault, '');
    }
    this.rfqSubmitMixpannel();
  }
  afterProfileCompleted() {
    if (!this.isSubmitRfq) {
      this.isSubmitRfq = true;
      this._rfqService.updateRFQStatus(
        appConstants.RFQStatusKey.RFX_BUYERSTATUS_PENDING_RELEASE,
        this.irfqViewModel.rfqId, this.loggedId).subscribe(
          result => {
            this._toastr.success(result.errorMessage, '');
            this.isRFQSubmitted = true;
            this.isSubmitRfq = false;
          },
          error => {
            this.handleError(error);
          }
        );
    }
  }

  getSettingPreference() {
    // tslint:disable-next-line:radix
    const id = parseInt(localStorage.getItem('LoggedId'));
    this._settingService.getSetting(id).subscribe(
      result => {
        this._ipreferenceForm = result;
        // debugger;
        if (result.prefRfqCommunicationMethod !== null && result.prefRfqCommunicationMethod !== undefined && result.prefRfqCommunicationMethod !== 0) {
          if (this.irfqViewModel.prefRfqCommunicationMethod != null) {
            this.irfqViewModel.prefRfqCommunicationMethod = this.irfqViewModel.prefRfqCommunicationMethod;
          } else {
            this.irfqViewModel.prefRfqCommunicationMethod = result.prefRfqCommunicationMethod;
          }

        } else {
          this.irfqViewModel.prefRfqCommunicationMethod = 120;
        }
        if (this._ipreferenceForm.paymentTermId !== '' && this._ipreferenceForm.paymentTermId !== null &&
          this._ipreferenceForm.paymentTermId !== undefined) {
          if (this._ipreferenceForm.paymentTermId === 'Net15') {
            this.irfqViewModel.payment_term_id = 1;
          } else if (this._ipreferenceForm.paymentTermId === 'Net30') {
            this.irfqViewModel.payment_term_id = 2;
          } else if (this._ipreferenceForm.paymentTermId === 'Net45') {
            this.irfqViewModel.payment_term_id = 3;
          } else if (this._ipreferenceForm.paymentTermId === 'Net60') {
            this.irfqViewModel.payment_term_id = 4;
          } else {
            this.irfqViewModel.payment_term_id = 2;
          }
        } else {
          this.irfqViewModel.payment_term_id = 2;
        }

        if (!this.isPaymentNotFromEditMode) {
          let locationId = this._ipreferenceForm.prereredLocationIds;
          if (!(locationId === null || locationId === undefined || locationId === '')) {
            if (locationId.endsWith(',')) {
              locationId = locationId.substring(0, locationId.length - 1);
            }
            const array = locationId.split(',');

            if (!this.isEditMode && this.isCommunityRfq == false) {
              this.irfqViewModel.preferredMfgLocationIds = array;
            }
          }
          if (!this.isWhoPaysSetByEdit) {
            if (this._ipreferenceForm.isbuyerPayshipping === true) {
              this.setPaidByBuyer();
            } else if (this._ipreferenceForm.isbuyerPayshipping === false) {
              this.setPaidBySupplier();
            }
          }
        }
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  getSavedRFQDetails() {
    let supplierContactId = 0;
    // if (localStorage.getItem('Usertype') === 'Buyer') {
    //   supplierContactId = 0;
    // } else {
    //   supplierContactId = this.loggedId;
    // }
    supplierContactId = this.loggedId;
    this._rfqService.getRFQExtraDetails(this.irfqViewModel.rfqId, supplierContactId, '').subscribe(
      result => {
        if (result.result === true) {
          result.preferredMfgLocationIds = this.locationIdsIntToString(result.preferredMfgLocationIds);
          if (result.whoPaysForShipping === 1) {
            this.isWhoPaysSetByEdit = true;
            this.setPaidByBuyer();
          } else if (result.whoPaysForShipping === 13) {
            this.isWhoPaysSetByEdit = true;
            this.setPaidBySupplier();
          } else {
            result.whoPaysForShipping = this.irfqViewModel.whoPaysForShipping;
          }
        
          this.irfqViewModel = result;
          this.configDatePicker();

          if (result.isCommunityRfq) {
            this.isCommunityRfq = true;
          } else {
            this.isCommunityRfq = false;
          }

          const quotesday = new Date(this.irfqViewModel.quotesNeededBy).getDate();
          const quotesmonth = new Date(this.irfqViewModel.quotesNeededBy).getMonth();
          const quotesyear = new Date(this.irfqViewModel.quotesNeededBy).getFullYear();
          const newdate = quotesday.toString() + quotesmonth.toString() + quotesyear.toString();
          this.OldQuoteDate = newdate;


          const awardday = new Date(this.irfqViewModel.awardDate).getDate();
          const awardmonth = new Date(this.irfqViewModel.awardDate).getMonth();
          const awardyear = new Date(this.irfqViewModel.awardDate).getFullYear();
          const newawarddate = awardday.toString() + awardmonth.toString() + awardyear.toString();
          this.OldAwardDate = newawarddate;
          if (this.irfqViewModel.quotesNeededBy !== null) {
            this.irfqViewModel.quotesNeededBy = moment.utc(this.irfqViewModel.quotesNeededBy).toDate();
          }
          if (this.irfqViewModel.quotesNeededBy !== null && this.irfqViewModel.awardDate !== null) {
            this.onDateChange('edit');
          }
          if (this.irfqViewModel.deliveryDate !== null) {
            this.iPartsViewModel.deliveryDate = moment.utc(this.irfqViewModel.deliveryDate).toDate();
          }
          if (!this.irfqViewModel.payment_term_id || this.irfqViewModel.payment_term_id.toString() === '') {
            this.isPaymentNotFromEditMode = true;
            this.getSettingPreference();
            // this.irfqViewModel.payment_term_id = 2;
          } else {
            this.isPaymentNotFromEditMode = false;
          }
          const aeard = this.irfqViewModel.awardDate;
          if (this.irfqViewModel.awardDate !== null) {
            this.irfqViewModel.awardDate = moment.utc(this.irfqViewModel.awardDate).toDate();

          }
          if (!this.irfqViewModel.isRegisterSupplierQuoteTheRfq) {
            this.dispalyIndividualGrpsAttachment = true;
          }
          if (this.irfqViewModel.certificateIdList.length !== 0) {
            this.irfqViewModel.certificateIdList.forEach(element => {
              this.certificateList.push(element);
              if (this.iCertificationViewModelColl !== undefined && this.iCertificationViewModelColl != null && this.iCertificationViewModelColl.length != 0) {
                const data = this.iCertificationViewModelColl.find(i => i.certificateId === element);
                const dta = {
                  'certificateId': data.certificateId,
                  'certificateTypeId': data.certificateTypeId,
                  'description': data.description,
                  'certificateCode': data.certificateCode
                };
                this.CertificationselectedItems.push(dta);
              } else {
                this.CertificationselectedItems = [];
              }
            });
          }
          if (this.irfqViewModel.ndaTypekey === 'RFX_SECURITYTYPE_NO_SECURE') {
            // this.activeTab = 0;
          } else if (this.irfqViewModel.ndaTypekey === 'RFX_SECURITYTYPE_TOTALY_SECURE') {
            this.activeTab = 1;
          } else if (this.irfqViewModel.ndaTypekey === 'RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR') {
            this.activeTab = 2;
          }
          this.activeTabNdaVerbiage = this.irfqViewModel.prefNdaType;
          if (this.irfqViewModel.ndaContent === null || this.irfqViewModel.ndaContent === undefined) {
            this.activeTabNdaVerbiage = 1;
            this.showCustomNdaDiv = false;
          } else if (this.irfqViewModel.ndaContent === '') {
            this.activeTabNdaVerbiage = 2;
            this.showCustomNdaDiv = true;
            // this.CustomNdaFileName = this.irfqViewModel.ndaFile;
          } else {
            this.activeTabNdaVerbiage = 1;
            this.showCustomNdaDiv = false;
          }
          if (this.irfqViewModel.rfqName == null || this.irfqViewModel.rfqName == undefined || this.irfqViewModel.rfqName == '') {
            this.irfqViewModel.rfqName = this.irfqViewModel.rfqId.toString();
          }
          this.setDraggableOrderImportance();
          this.getSavedCustomeNdaFiles();
          this.rfqGeneralAttachments = this.irfqViewModel.rfqGeneralAttachmentsList;
          // this.createRFQForm();
          this.addDefaultShipping();
          // this.getRfqParts('editModeCall');
          this.getRfqParts('partFileDropped');
          this.partCategoryIdColl = [];
        } else if (result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
          this._toastr.warning('Please login with valid buyer', 'Warning!');
          this.router.navigate(['dashboard/buyer/default']);
          // } 
        }
        if (this.isEditMode) {
          if (this.irfqViewModel.preferredMfgLocationIds.includes('7') && this.irfqViewModel.rfqStatusId !== 1 && this.irfqViewModel.rfqStatusId !== 0 &&
            this.irfqViewModel.rfqStatusId !== 14) {
            this.irfqViewModel.preferredMfgLocationIds = [];
          }



          if (!moment().isSameOrBefore(this.irfqViewModel.quotesNeededBy)) {
            // console.log( ' Quote Date ', moment().isSameOrBefore(this.irfqViewModel.quotesNeededBy) , this.irfqViewModel.quotesNeededBy );
            this.irfqViewModel.quotesNeededBy = null;
          }
          if (!moment().isSameOrBefore(this.irfqViewModel.awardDate)) {
            // console.log( ' Quote Date ', moment().isSameOrBefore(this.irfqViewModel.awardDate) , this.irfqViewModel.awardDate );
            this.irfqViewModel.awardDate = null;
          }
        }
      },
      error => {
        this.isDecideToShow = false;
        this.handleError(error);
      },
      () => { }
    );
  }







  // API call Functions Ends

  // Validations Functions

  // isfrqNAmeValid(field: string) {
  //   return this._customValidatorsService.isFieldValid(this.irfqForm, field);
  // }
  isMaterialFielValid() {
    if (this.materialselectedItems.length === 0) {
      this.isMaterialValid = true;
    } else {
      this.isMaterialValid = false;
    }
  }

  isShippingStateValid(field: string) {
    if (this._customValidatorsService.isDropdownValid(this.shippingForm, field)) {
      if (field === 'countryId') {
        this.isCountryValid = false;
      }
      if (field === 'stateId') {
        this.isStateValid = false;
      }
    } else {
      if (field === 'countryId') {
        this.isCountryValid = true;
      }
      if (field === 'stateId') {
        this.isStateValid = true;
      }
    }
    return this._customValidatorsService.isDropdownValid(this.shippingForm, field);
  }
  // isShippingCountryValid(field: string) {
  //   if (this._customValidatorsService.isDropdownValid( this.shippingForm, field)) {
  //     this.isStateValid = false;
  //   } else {
  //     this.isStateValid = true;
  //   }
  //   return this._customValidatorsService.isDropdownValid(this.shippingForm, field);
  // }
  isShippingFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.shippingForm, field);
  }
  // Validations Functions Ends

  // alert function

  cancelPartDetails() {
    this.currentActivePartId = 0;
    this.isSidePanel = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.resetPartDetailsPanel();
    this.isViewStandardNdaClicked = false;
    this.activePartId = null;
    this.newExistError = false;
    this.partFileAddedError = false;
    this.partNameError = false;
    this.partNumberError = false;
    this.isDeliveryDateError = false;
    this.partFirstQuantityError = false;
    this.partSecondQuantityError = false;
    this.partThirdQuantityError = false;
    this.processError = false;
    this.materialError = false;
    // this.confirmationService.confirm({
    //   message: 'Would you like to save your part details?',
    //   header: 'Save Part Details',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.savePartDetails();
    //     this.currentActivePartId = 0;
    //     this.isSidePanel = false;
    //     this.isPartClicked = false;
    //     this.addressList = false;
    //     this.isPartsLibrarayClicked = false;
    //     this.addGenAttachementDiv = false;
    //     this.dispalyIndividualGrps = false;
    //     this.resetPartDetailsPanel();
    //     this.isViewStandardNdaClicked = false;
    //     this.activePartId = null;
    //   },
    //   reject: () => {
    //     this.currentActivePartId = 0;
    //     this.isSidePanel = false;
    //     this.isPartClicked = false;
    //     this.addressList = false;
    //     this.isPartsLibrarayClicked = false;
    //     this.addGenAttachementDiv = false;
    //     this.dispalyIndividualGrps = false;
    //     this.resetPartDetailsPanel();
    //     this.isViewStandardNdaClicked = false;
    //     this.activePartId = null;
    //   }
    // });
  }
  // alert functions end
  // Side drawer closing functions
  resetPartDetailsPanel() {
    this.isPartClicked = false;
    this.isSidePanel = false;
  }

  closePartDetails() {
    this.currentActivePartId = 0;
    this.isSidePanel = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.resetPartDetailsPanel();
    this.isViewStandardNdaClicked = false;
    this.activePartId = null;
    this.newExistError = false;
    this.partFileAddedError = false;
    this.partNameError = false;
    this.partNumberError = false;
    this.isDeliveryDateError = false;
    this.partFirstQuantityError = false;
    this.partSecondQuantityError = false;
    this.partThirdQuantityError = false;
    this.processError = false;
    this.materialError = false;
  }

  openPartLibrary() {
    this.isSidePanel = true;
    this.isPartsLibrarayClicked = true;
    this.isPartClicked = false;
    this.addressList = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.partDrawerSearch = '';
    this.addShippingform = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isViewStandardNdaClicked = false;
    this.onSearchChange();
  }

  showGenAttachemntFiles() {
    this.isSidePanel = true;
    this.addGenAttachementDiv = true;
    this.addShippingform = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.dispalyIndividualGrps = false;
    this.partDrawerSearch = '';
    this.isViewStandardNdaClicked = false;
  }
  closeAttachementDiv() {
    this.isSidePanel = false;
    this.addGenAttachementDiv = false;
    this.addShippingform = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.dispalyIndividualGrps = false;
    this.isViewStandardNdaClicked = false;
    if (this.SpecialInvitedNameModelColl.length === 0) {
      this.irfqViewModel.isRegisterSupplierQuoteTheRfq = true;
      this.dispalyIndividualGrps = false;
      this.dispalyIndividualGrpsAttachment = false;
      this.showLetMeChooseValidationMsg = false;
    }
    // if (this.manufactureList.individualList.length === 0 || this.manufactureList.groupList.length === 0) {

    // }
  }

  changeShippingAddress() {
    this.latestAddressId = 0;
    if (this.shippingAddressData.length === 0) {
      this.createShippingForm();
      this.isSidePanel = true;
      this.addShippingform = true;
      this.isPartClicked = false;
      this.addressList = false;
      this.addGenAttachementDiv = false;
      this.isPartsLibrarayClicked = false;
      this.addGenAttachementDiv = false;
      this.dispalyIndividualGrps = false;
      this.isViewStandardNdaClicked = false;
      this.isNdaClicked = false;
      this.getState();
      this.getCountry();

    } else {
      this.isSidePanel = true;
      this.addShippingform = false;
      this.isPartClicked = false;
      this.isNdaClicked = false;
      this.addressList = true;
      this.addGenAttachementDiv = false;
      this.isPartsLibrarayClicked = false;
      this.addGenAttachementDiv = false;
      this.dispalyIndividualGrps = false;
      this.isViewStandardNdaClicked = false;
    }
  }
  closeShippingList() {
    this.isSidePanel = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.addGenAttachementDiv = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.isViewStandardNdaClicked = false;
  }
  openShippingAddressForm() {
    this.isSidePanel = true;
    this.addShippingform = true;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.initShippingAddress();
    this.createShippingForm();
    this.isViewStandardNdaClicked = false;
    this.isSaveAddress = false;
    this.getState();
    this.getCountry();

  }
  closeAddShippingForm() {
    this.isSaveAddress = false;
    this.isSidePanel = true;
    this.addShippingform = false;
    this.isPartClicked = false;
    this.addressList = true;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.initShippingAddress();
    this.createShippingForm();
    this.isViewStandardNdaClicked = false;
  }

  showIndividualGrps() {

    this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
    this.isSidePanel = true;
    this.dispalyIndividualGrps = true;
    this.dispalyIndividualGrpsAttachment = true;
    this.addShippingform = false;
    this.addGenAttachementDiv = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.individualSearchText = '';
    this.groupSearchText = '';
    this.isViewStandardNdaClicked = false;
    this.onManuIndividualSearchChange();
    this.onManuGroupSearchChange();
  }
  showIndividualGrpsFromSupplier() {
    this.dispalyIndividualGrpsAttachment = true;
  }

  showStandardNda() {
    this.isViewStandardNdaClicked = true;
    this.isNdaClicked = false;
    this.isSidePanel = true;
    this.addShippingform = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.dispalyIndividualGrps = false;
    this.dispalyIndividualGrpsAttachment = false;
  }

  closeStandardNda() {
    this.isSidePanel = false;
    this.isViewStandardNdaClicked = false;
  }

  downloadAllFiles(fileCompArray: string[], isDownload: boolean, partfile) {
    // debugger;
    fileCompArray.forEach(element => {
      this.downloadS3File(element, isDownload);
    });

    if (partfile !== '') {
      this.downloadS3File(partfile, isDownload);
    }
  }
  downloadAllFilesForPart(fileCompArray: string[], isDownload: boolean, partfile) {
    // debugger;
    console.log(fileCompArray, 'fileCompArray')
    fileCompArray.forEach(element => {
      this.downloadS3File(element['CompleteFileName'], isDownload);
    });

    if (partfile !== '') {
      this.downloadS3File(partfile, isDownload);
    }
  }
  getBuyerLocation() {
    const datacount = this._rfqService.get('ITerritoryClassificationModelColl');
    // console.log("datacount@@@------>",datacount)
    if (datacount !== undefined) {
      this.ITerritoryClassificationModelColl = this._rfqService.get('ITerritoryClassificationModelColl');
      this.iTerritoryClassificationNames.territoryClassificationName2 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 2).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName3 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 3).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName4 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 4).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName5 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 5).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName6 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 6).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName7 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 7).territoryClassificationName;
    } else {
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          this._rfqService.set(data2, 'ITerritoryClassificationModelColl');
          this.getBuyerLocation();
        },
        error => () => { },
        () => { }
      );
    }
  }


  checkPartNumber() {
    const quantity = Number(this.iPartsViewModel.partNumber.toString());
    if (this.iPartsViewModel.partNumber === null || this.iPartsViewModel.partNumber.toString() === '') {
      this.PartError1 = 'Please enter the part number';
      // this.iPartsViewModel.partNumber = null;
    } else {
      if (quantity === 0) {
        // this.iPartsViewModel.partNumber = null;
        this.PartError1 = 'Part number cant be zero';
      } else {
        this.PartError1 = '';
      }
    }
  }

  // Side drawer closing functions Ends
  getCapability(capabilityList) {
    const tempCapabilityArray = [];
    if (capabilityList !== null && capabilityList.length !== 0) {
      for (let index = 0; index < capabilityList.length; index++) {
        tempCapabilityArray.push(capabilityList[index].childDisciplineName);
      }
      if (tempCapabilityArray.length > 0) {
        const stingLen = tempCapabilityArray.join(', ');
        if (stingLen.length > 50) {
          return tempCapabilityArray.join(', ').slice(0, 50) + '...';
        } else {
          return tempCapabilityArray.join(', ');
        }
      } else {
        return 'N/A';
      }
    }
  }

  removeTextValue() {
    if (this.groupSearchText) {
      this.groupSearchText = '';
    }
    this.onManuGroupSearchChange();
  }
  removeTextValueIndividual() {
    if (this.individualSearchText) {
      this.individualSearchText = '';
    }
    this.onManuIndividualSearchChange();
  }
  removeTextValuePart() {
    if (this.partDrawerSearch) {
      this.partDrawerSearch = '';
    }
    this.onSearchChange();
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.onSearchChange();
    }
  }
  searchByKeyIndividual(event) {
    if (event.keyCode === 13) {
      this.onManuIndividualSearchChange();
    }
  }
  searchByKeyGroup(event) {
    if (event.keyCode === 13) {
      this.onManuGroupSearchChange();
    }
  }
  checkSearch(val, opt) {
    if (!val) {
      switch (opt) {
        case 1: {
          this.onSearchChange();
          break;
        }
        case 2: {
          this.onManuIndividualSearchChange();
          break;
        }
        case 3: {
          this.onManuGroupSearchChange();
          break;
        }
      }
    }
  }

  // Extra Functions Ends
  getAddressFormat(mailingAddressData) {
    let tempAdd: string;
    tempAdd = '';
    if (this.checkEmpty(mailingAddressData.address5)) {
      tempAdd += mailingAddressData.address5 + ', ';
    }

    if (this.checkEmpty(mailingAddressData.address5)) {
      tempAdd += '<br />';
    }
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += '<br />';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state)) {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country)) {
      tempAdd += '<br />' + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      return true;
    } else {
      return false;
    }
  }

  cloneModel() {
    this.isCloneModel = true;
  }

  isCloneOpen() {
    this._rfqService.getEditCloneClose().subscribe(res => {
      if (res['text'] === true) {
        this.isCloneModel = false;
        this.editRfqId = parseInt(localStorage.getItem('EditRfqId'));
        this.editRfqName = localStorage.getItem('EditRfqName');
        if (this.editRfqId !== 0 && this.editRfqId !== undefined) {
          this.isRFQSubmitted = false;
          this.isEditMode = true;
          this.isRfqDetails = true;
          this.isRfqDetailsActive = true;
          this.isRfqDetailsStatus = false;

          this.isRfqReview = false;
          this.isRfqReviewStatus = false;
          this.isRfqReviewActive = false;
          this.initRfqModel();
          this.forEditMode();
          this.isDecideToShow = true;

        }
        //  this.getSavedRFQDetails();
        this._rfqService.setEditCloneClose(false);
      } else {
        this.isCloneModel = false;
      }

    })

  }


  clonePart(rfqPartId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clone this part?',
      header: 'Clone Part',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this._rfqService.CloneRfqPart(rfqPartId).subscribe(res => {
          if (!res.isError) {
            this.isFileUpladed = true;
            this._toastr.success('Rfq Part Clone Successfully!', 'Success!');
            this.getRfqParts('cloneTo');
          } else {
            this.isFileUpladed = true;
            this.getRfqParts('cloneTo');
          }
        }, error => {
          this.isFileUpladed = true;
          this.getRfqParts('cloneTo');
        })

      },
      reject: () => { }
    });

  }

  openModal() {
    // this.modalService.open(this.editModal);
    this.statusModalReference = this.modalService.open(this.rfqStatusModal, {
      backdrop: 'static'
    });
    // return confirm('?');

  }

  closeSessionModel() {
    this.statusModalReference.close();
  }

  closeModel() {
    localStorage.setItem('EditRfqId', JSON.stringify(this.irfqViewModel.rfqId));
    localStorage.setItem('EditRfqName', this.irfqViewModel.rfqName);
    //  this._rfqService.set(id, 'editRfqId');
    //  this._rfqService.set(Name, 'editRfqName');
    this.statusModalReference.close();
    //this.router.navigate(['/rfq/editrfq']);
    const encryptedRfqID = this._profileService.encrypt(this.irfqViewModel.rfqId);
    this.router.navigate(['/rfq/editrfq'], { queryParams: { rfqId: encryptedRfqID } });

  }
  moveto() {
    // ******Setting the local-storage value false to restricting part drawer******
    this.fromGetStartedFlow = 'false';
    localStorage.setItem('fromGetStartedFlow', this.fromGetStartedFlow)
    this.statusModalReference.close();
    this._rfqService.sendQuotedMarkQuotedRFQNotification(this.irfqViewModel.rfqId).subscribe(res => {
      if (res['isError'] == false) {
        this.router.navigate([this.redirectURL]);
      } else {
        this.router.navigate([this.redirectURL]);
      }
    }, error => {
      this.router.navigate([this.redirectURL]);
    })
this.rfqDraftMixPanel();
    // console.log('move to rfq')
  }

  canDeactivate(): Observable<any> | boolean {
    if (this.irfqViewModel.rfqId != null && this.irfqViewModel.rfqId != 0) {
      this._rfqService.GetRfqStatus(this.irfqViewModel.rfqId).subscribe(res => {
        if (res.rfqStatusId != null && res.rfqStatusId == 1) {
          this.confirmationService.confirm({
            message: 'Are you sure you want to clone this part?',
            header: 'Clone Part',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this._rfqService.setisRedirect(true);

            },
            reject: () => {
              this._rfqService.setisRedirect(false);

            }
          });

        } else {
          this._rfqService.setisRedirect(true);
        }
      }, error => {
        this._rfqService.setisRedirect(true);
      })
    } else {
      return false;
    }
  }
  getRfqPurposeName() {
    let temp = this.rfqPurposeModelList.filter((x) => x.id == this.irfqViewModel.rfqPurpose);

    if (temp.length) {
      return temp[0].value;
    } else {
      return 'N/a';
    }
  }
  checkRfqWarning() {
    let isRestrictRfqEncrypt = localStorage.getItem('restrictRfq');
    let isRestrictRfqDecrypt = this._profileService.decrypt(isRestrictRfqEncrypt);
    if (isRestrictRfqDecrypt == 'true') {
      return true;
    } else {
      return false;
    }
  }

  submitRFQToTop() {
    this.rfqSubmitMixpannel();
    window.scrollTo(0, 0);
  }


  setGeometryId(id) {

    if (this.iPartsViewModel.geometryId != id) {
      this.iPartsViewModel.geometryId = id;
      // this.iPartsViewModel.partSizeUnitId = 0;
    } else {
      this.iPartsViewModel.geometryId = 0;
    }

  }
  setUnitOfMeasureId(id) {
    if (this.iPartsViewModel.partSizeUnitId != id) {
      this.iPartsViewModel.partSizeUnitId = id;
    } else {
      this.iPartsViewModel.partSizeUnitId = 0;
    }
  }
  setOptions(evt) {
    let index = this.questionOptionList.findIndex(x => x.questionId == evt.questionId);
    if (index !== -1) {
      this.questionOptionList[index].answer = evt.value
    } else {
      let temp = {
        rfqPartId: this.iPartsViewModel.rfqPartId,
        questionId: evt.questionId,
        answer: evt.value
      }
      this.questionOptionList.push(temp);
    }
    console.log(this.questionOptionList);
  }
  CheckIsValidApplyToAllParts() {
    this._rfqService.CheckIsValidApplyToAllParts(this.iPartsViewModel.rfqId, this.iPartsViewModel.rfqPartId,
      this.iPartsViewModel.parentPartCategoryId).subscribe(res => {
        if (!res['isError']) {
          this.iPartsViewModel.isPartCheckBoxEnabled = res['data'];
        }
      })

  }

  setCommunitySuppplier() {
    console.log("setCommunitySuppplier", this.donNotShowOrderManagment)
    if (this.firstTimePartAdded) {
      this.firstTimePartAdded = false;
      let supplierCompanyDetails = localStorage.getItem('manufactureId');
      if (supplierCompanyDetails != undefined && supplierCompanyDetails != null && supplierCompanyDetails != '') {
        let tempSupplierCompanyDetails = JSON.parse(localStorage.getItem('manufactureId'));

        // if(tempSupplierCompanyDetails.length != null && tempSupplierCompanyDetails.id != undefined && tempSupplierCompanyDetails.id != ''){
        this.irfqViewModel.isRegisterSupplierQuoteTheRfq = false;
        tempSupplierCompanyDetails.forEach(element => {
          if (element.id != null && element.id != undefined && element.id != '') {
            let tempObj = {
              inviteId: element.id,
              type: "individual"
            }
            this.irfqViewModel.SpecialinviteList.push(tempObj);
          }
        });
        let tempLocation = localStorage.getItem('territoryId');
        if (tempLocation != null && tempLocation != undefined && tempLocation != '') {
          this.irfqViewModel.preferredMfgLocationIds[0] = tempLocation;
        }
        this._rfqService.AddRFQExtraDetails(this.irfqViewModel).subscribe(
          result => {
            // this.configDatePicker();
            // this.irfqViewModel.result = result['result'];
          });
        // }

      }
    }
  }

  onClickofAddNewPart() {
    this.fromGetStartedFlow = 'true';
    localStorage.setItem('fromGetStartedFlow', this.fromGetStartedFlow)
    this.trackMixpanelCreateRfq()
    this.addFirstPartUploaded();
    // console.log(this.iPartsViewModelColl, 'iPartsViewModelColl')
    // if(this.iPartsViewModelColl.length > 0) {
    //    this.openPartDetails(0,0);
    //   // this.reset
    // } else {
    //   this.addFirstPartUploaded();
    // }
  }

  NdaRadioBtnValue(btnText) {
    console.log('btnText', btnText)
  }
  setOrderMangFlag() {
    console.log("this.this.donNotShowOrderManagment", this.donNotShowOrderManagment)
  }

  checkPurpose() {
    let temp = this.rfqPurposeModelList.filter((x) => x.id == this.irfqViewModel.rfqPurpose);
    this.rfqPurposeMixpanel = temp[0].description
  }
// mixPannel Create Rfq
trackMixpanelCreateRfq() {
  this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_RFQ_FORM_START,{
    rfq_id: this.irfqViewModel.rfqId,
    date: this.minDate,
    rfq_count: localStorage.getItem('submitRfqCount'),
    validated_buyer: localStorage.getItem('isEmailVerify'),
  });
}
// mixpanel Add rfq part
trackRfqPartMixpanel() {
  const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_RFQ_PARTS,{
    part_selection: this.partSelectionMIxPanel,
    validated_buyer: submitModel.isValidatedBuyer,
    date: new Date,
    rfq_count: localStorage.getItem('submitRfqCount'),
    rfq_id: this.iPartsViewModelColTemp[0].rfqId
  });
}
  // mixpanel Rfq Detail
  rfqDetailsMixPanel() {
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    let temp = this.rfqPurposeModelList.filter((x) => x.id == this.irfqViewModel.rfqPurpose);
    this.rfqPurposeMixpanel = temp[0].description;
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_RFQ_DETAILS,{
      manufacturer_location: this.manufactureLocationMixpanel,
      rfq_purpose: this.rfqPurposeMixpanel,
      rfq_payer: this.rfq_payer,
      rfq_payment_method: this.rfq_payment_method,
      communication_method: submitModel.preferredMethodOfCommunication,
      rfq_id: this.iPartsViewModelColTemp[0].rfqId,
      rfq_count: localStorage.getItem('submitRfqCount'),
      qualified_buyer: submitModel.isValidatedBuyer,
      date: this.minDate,
      nda_type: this.nda_type,
    });
  }
  // mixpanel Rfq Draft
  rfqDraftMixPanel() {
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    let temp = this.rfqPurposeModelList.filter((x) => x.id == this.irfqViewModel.rfqPurpose);
    this.rfqPurposeMixpanel = temp[0].description;
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_RFQ_DRAFT,{
      rfq_id: this.iPartsViewModelColTemp[0].rfqId,
      date: this.minDate,
      validated_buyer: submitModel.isValidatedBuyer,
      role: localStorage.getItem('Usertype'),
      rfq_purpose: this.rfqPurposeMixpanel,

    });
  }
  // mipanel Submit rfq
  rfqSubmitMixpannel() {
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_RFQ_FORM_SUBMIT,{
      country: submitModel.address.country,
      close_date: this.irfqViewModel.quotesNeededBy,
      date: this.minDate,
      validated_buyer: submitModel.isValidatedBuyer,
      rfq_count: localStorage.getItem('submitRfqCount'),
      rfq_id: this.irfqViewModel.rfqId,
      is_loggedIn: true,
      manufacturer_process: this.manuFacturingProcessMixPanel,   
      manufacturer_material: this.materialNameMixpanel,          
    });
  }

  
  checkNextButton() {
    this._rfqService.getRfqParts(this.irfqViewModel.rfqId).subscribe(
      result => {
        this.partData = result
        if (this.partData) {
          let checkCondition = _.find(this.partData, ['partName', ""]);
          console.log("checkCondition", checkCondition)
          if (checkCondition === undefined) {
            this.activeNextButton = true
          } else {
            this.activeNextButton = false
          }
        }


      },
      error => {
        this.isDecideToShow = false;
        this.handleError(error);
      },
      () => { }
    );
  }
// ********** get Buyer count details
  getCountsOfRfqs() {
    const data = this.loggedCompanyId;
    if (!Number.isNaN(this.loggedCompanyId)) {
      this._rfqService
        .GetBuyerRFQCount(this.loggedId, this.loggedCompanyId)
        .subscribe(
          (result) => {
            this.rfqCountdata = result;
           console.log("  this.rfqCountdata",  this.rfqCountdata)
          },
          (error) => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
    }
  }
  // ******* Triger Pendo******
  triggerPendo(data, step) {
    const visitor = {
      event: step,
      noOfRfqCreated: data.myRFQCount,
      draftRFQCreated: data.draftRFQCreatedCount,
      releasedRFQMp: data.rfqToReleaseCount,
      RFQToBeAwarded: data.rfqToAwardCount,
      NDAToApprove: data.ndaToApproveCount
    }
    this.productAnalyticService.initializPendo(this.productAnalyticService.EDIT_RFQ, visitor);

  }

}
