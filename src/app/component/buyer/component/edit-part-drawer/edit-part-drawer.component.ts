import { Component, OnInit , ViewChild, ElementRef } from '@angular/core';
import { RfqService } from '../../../../core/services/rfq/rfq.service';
import { IMaterialViewModel, IPostProductionViewModel, IQuantityUnit } from '../../../../core/models/globalMaster';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload';
import {
  ICustomProcessViewModel, IPartsViewModel, IUploaadedFileNameList,
  IRfqPartQuantityViewModel,
  IUploaadedFileName
} from '../../../../core/models/rfqModel';
import { MasterService } from '../../../../core/services/master/master.service';
import { Http,   Headers } from '@angular/http';
import { environment } from '../../../../../environments/environment';
// import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { uploadFileNDA } from '../../../../../constants/url-constant';


@Component({
  selector: 'app-edit-part-drawer',
  templateUrl: './edit-part-drawer.component.html',
  styleUrls: ['./edit-part-drawer.component.scss']
})
export class EditPartDrawerComponent implements OnInit {
  @ViewChild('secondQty',{static:false}) secondQtyField: ElementRef;
  firstQuantity: number;
  secondQuantity: number;
  thirdQuantity: number;
  PartError1: string; quantityError1: string; quantityError2: string; quantityError3: string;
  isDeliveryDateError = false; isAttachmentsLoading: number;
  is2QuantityValid: boolean; is3QuantityValid: boolean;

  partDetailUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'partfiles'
  });
  iPartUploadedFileName: IUploaadedFileName;
  firstQuantitySameError = false;
  secondQuantitySameError = false;
  thirdQuantitySameError = false;
  isSameQuantityError = false;
  numberOnlyPattern = '^(0|[1-9][0-9]*)$';
  isQuantityValid: boolean;
  minDate: Date;
  checkFile = true;
  secondQuantityDiv: boolean;
  thirdQuantityDiv: boolean;
  addsecondQuantityDiv: boolean;
  addthirdQuantityDiv: boolean;
  isMaterialTouched: boolean;
  currentImageName: string;
  processSettings = {};
  materialsettings = {};
  postProductionProcesssettings = {};
  certificatesettings = {};
  selectedItems = [];
  materialselectedItems = [];
  postProcessselectedItems = [];
  iRfqPartQuantityViewModel: IRfqPartQuantityViewModel;
  CertificationselectedItems = [];
  iMaterialViewModelColl: IMaterialViewModel[];
  iPostProductionViewModelColl: IPostProductionViewModel[];
  iQuantityUnitColl: IQuantityUnit[];
  iPartsViewModelOld: IPartsViewModel;
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iPartsViewModel: IPartsViewModel;
  isMaterialValid: boolean;
  isPartDetailsBtnClicked: boolean;
  oappendText: string;
  appendText: string;
  iPartUploadedFileNameList: IUploaadedFileNameList;
  isLoader: boolean;
  apiSuccessCount: number;
  iUploaadedFileName: IUploaadedFileName;
  currentPartId: number;
  isNewPart: boolean;
  selectFieldJSON = { 'childPostProductionProcessId': 0,
    'childPostProductionProcessName': 'Select Post Process',
    'parentPostProductionProcessId': 0,
    'parentPostProductionProcessName': ''
  };
  childProcess: ICustomProcessViewModel[];

  constructor(private _rfqService: RfqService, private _toastr: ToastrService,
    private _masterService: MasterService, private _Http: Http) {
      // this.iQuantityUnitColl = [];
      // this.iCustomProcessViewModelColl = [];
      // this.iMaterialViewModelColl = [] ;
    this.selectedItems = []; this.materialselectedItems = [];
    this.postProcessselectedItems = [ this.selectFieldJSON ]; this.CertificationselectedItems = [];
    this.currentImageName = '';
    this.isAttachmentsLoading = 0; this.is2QuantityValid = false; this.is3QuantityValid = false;
    this.quantityError1 = 'Please enter the quantity'; this.PartError1 = '';
    this.PartError1 = 'Please enter part number';
    this.quantityError2 = 'Please enter the quantity'; this.quantityError3 = 'Please enter the quantity';
  //  this.getQuantity();
    this.isNewPart = false;
    this.currentPartId = 0;
    this.apiSuccessCount = 0;
    this.initPartViewModel();
    this.resetQuantityModel();
    this.iPostProductionViewModelColl = [];
    this.iMaterialViewModelColl = [];
    this.iCustomProcessViewModelColl = [];
    this.isLoader = true;
    this.oappendText = '';
    this.appendText = '';
    this.openPartDetails();
   // this.getProcess();
   // this.getMaterial();
    this._rfqService.getcuOpenPLibId().subscribe(message => {
      if (this.currentPartId !== message.text) {
        this.isLoader = true;
        this.currentPartId =   message.text;
        this.openPartDetails();
      }
   });
    this.iPartUploadedFileNameList = {
      FileNameList: []
    };
    this.iPartUploadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iUploaadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
   // this.getPostProdProcesses();
    this.configDatePicker();
  }
  initPartViewModel() {
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
      partCommodityCode: '',
      rfqPartId: 0,
      partDescription: '',
      materialId: 0,
      modifiedBy: this.loggedId,
      partQtyUnitId: 1,
      // partCategoryId: 0,
      statusId: 0,
      companyId: 0,
      contactId: 0,
      currencyId: 0,
      creationDate: '',
      modificationDate: '',
      rfqId: 0,
      rfqPartQuantityList: [
        {
          rfqPartQuantityId: 0,
          rfqPartId: 0,
          partQty: 0,
          quantityLevel: 0
        }
      ],
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
      childPartCategoryId: 0,
      parentCategoryName: '',
      childCategoryName: ''
    };
  }
  onFileSelected($event: any) {
    this.uploadPartDetailsFiles();
    $event.srcElement.value = '';
  }
  cancelPartDetails1() {
    this._rfqService.set(false, 'rfqPartDrawer');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'currentPartOpendId');
  }
  cancelPartDetails() {
    // this._rfqService.set(this.iPartsViewModel.companyId, 'currentRfqCompanyId');
    // this._rfqService.set(this.iPartsViewModel.contactId, 'currentRfqContactId');
    // this._rfqService.set(true, 'partEditCancelConfirm');
    this._rfqService.set(false, 'rfqPartDrawer');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'currentPartOpendId');
  }
  checkConfirmResponse() {
    if (this._rfqService.get('confirmedToSave') === true) {
      this._rfqService.set(false, 'confirmedToSave');
      this.savePartDetails();
    }
    if (this._rfqService.get('confirmedToCancel') === true) {
      this._rfqService.set(false, 'confirmedToCancel');
      this.cancelPartDetails1();
    }
  }
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }
  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }
  uploadPartDetailsFiles() {
    const files = this.partDetailUploader.queue;
    for (const entry of files) {
      const file = entry._file;
      if (entry.isUploaded === false) {
        ++this.isAttachmentsLoading;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
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
        });
      }
    }
  }
  removeSavedPartDetailFile(partName, index: any,rfqPartId) {
    if (this.iPartUploadedFileNameList.FileNameList) {
      this.iPartUploadedFileNameList.FileNameList.splice(index, 1);
    }
    const currentPartId = this._rfqService.get('currentPartOpendId');
    this._rfqService.deletePartGeneralAttachment(partName.CompleteFileName, this.loggedId, currentPartId,rfqPartId).subscribe(
      (data: IPartsViewModel) => {
        if (data.result === true) {
          // this.getRfqParts('');
        } else {
          this._toastr.error(data.errorMessage, 'Error!');
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  getShortOriginalPartName(fileName) {
    this.oappendText = '';
    let fixStr: '';
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        const charactorCount = filenNameArray[0].length;
        if (charactorCount > 15) {
          fixStr = filenNameArray[0].slice(0, 15);
          this.oappendText = fixStr.concat(this.appendText);
          return this.oappendText;
        } else {
          return filenNameArray[0];
        }
      } else {
        const charactorCount = filenNameArray[1].length;
        if (charactorCount > 15) {
          fixStr = filenNameArray[1].slice(0, 15);
          this.oappendText = fixStr.concat(this.appendText);
          return this.oappendText;
        } else {
          return filenNameArray[1];
        }

      }
      // return filenNameArray[1];
    }
  }
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  getQuantity() {
    this._masterService.getQuantityUnit().subscribe(
      (data: IQuantityUnit[]) => {
        this.iQuantityUnitColl = data;
        this.apiSuccessCount = this.apiSuccessCount + 1;
        if (this.apiSuccessCount === 6) {
          this.isLoader = false;
        }
        const units = this.iQuantityUnitColl.find( m => m.value === 'Pieces');
        this.iPartsViewModel.partQtyUnitId = units.id;
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
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  materialTouch() {
    this.isMaterialTouched = true;
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  removePartImageWithoutAlert(item) {
    this._rfqService.deletePart(item).subscribe(
      (data: IPartsViewModel) => {
        if (data.result === true) {
        } else {
          // this._toastr.success(this.iContactViewModel.errorMessage, data.errorMessage);
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  getMaterial() {
    if (this.iMaterialViewModelColl === undefined) {
      this._rfqService.getParentMaterial().subscribe(
        result => {
          this.iMaterialViewModelColl = result['data'];
          this.apiSuccessCount = this.apiSuccessCount + 1;
          if (this.apiSuccessCount === 6) {
            this.isLoader = false;
          }
          if (this.iPartsViewModel.materialId === 0) {
            this.materialselectedItems = [];
          } else {
            const data = this.iMaterialViewModelColl.find(i => i.childMaterialId === this.iPartsViewModel.materialId);
            if (data !== undefined) {
              this.materialselectedItems = [
                {
                  'childMaterialId': data.childMaterialId, 'childMaterialName': data.childMaterialName,
                  'parentMaterialId': data.parentMaterialId, 'parentMaterialName': data.parentMaterialName
                }
              ];
            }
            this.materialselectedItems = [
              {
                'childMaterialId': data.childMaterialId, 'childMaterialName': data.childMaterialName,
                'parentMaterialId': data.parentMaterialId, 'parentMaterialName': data.parentMaterialName
              }
            ];
          }
          this.materialsettings = {
            singleSelection: true,
            text: 'Select Material',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Material',
            enableSearchFilter: true,
            groupBy: 'parentMaterialName',
            labelKey: 'childMaterialName',
            primaryKey: 'childMaterialId',
            noDataLabel: 'No Data Available',
            selectGroup: true,
            badgeShowLimit: 5,
            maxHeight: 200,
            showCheckbox: false
          };
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
      if (this.iPartsViewModel.materialId === 0) {
        this.materialselectedItems = [

        ];
      } else {
        const data = this.iMaterialViewModelColl.find(i => i.childMaterialId === this.iPartsViewModel.materialId);
        if (data !== undefined) {
          this.materialselectedItems = [
            {
              'childMaterialId': data.childMaterialId, 'childMaterialName': data.childMaterialName,
              'parentMaterialId': data.parentMaterialId, 'parentMaterialName': data.parentMaterialName
            }
          ];
        }

      }

      this.materialsettings = {
        singleSelection: true,
        text: 'Select Material',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Searcht Material',
        enableSearchFilter: true,
        groupBy: 'parentMaterialName',
        labelKey: 'childMaterialName',
        primaryKey: 'childMaterialId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        badgeShowLimit: 5,
        maxHeight: 200,
        showCheckbox: false
      };
    }

  }
  getProcess() {
    // if (this.iCustomProcessViewModelColl === undefined) {
      this._rfqService.getAllProcess().subscribe(
        result => {
          this.iCustomProcessViewModelColl = result['data'];
          this.apiSuccessCount = this.apiSuccessCount + 1;
          if (this.apiSuccessCount === 6) {
            this.isLoader = false;
          }
          if (this.iPartsViewModel.parentPartCategoryId != 0 && this.iPartsViewModel.parentPartCategoryId != null && this.iPartsViewModel.parentPartCategoryId != undefined) {
            this.childProcess = this.iCustomProcessViewModelColl.filter(x => x.parentDisciplineId == this.iPartsViewModel.parentPartCategoryId);
            // this.loadChildProcess(this.iPartsViewModel.parentPartCategoryId);
            if (this.childProcess && this.childProcess.length != 0) {
              this.iPartsViewModel.showPartSizingComponent = this.childProcess[0].showPartSizingComponent;
              this.iPartsViewModel.showQuestionsOnPartDrawer = this.childProcess[0].showQuestionsOnPartDrawer;
            }
          }
          // if (this.iPartsViewModel.partCategoryId === 0) {
          //   this.selectedItems = [
          //     {
          //       'childDisciplineId': '99999', 'childDisciplineName': 'Let MFG.com Pick the Best Category',
          //       'parentDisciplineId': '99998', 'parentDisciplineName': 'Let MFG.com Pick the Best Category'
          //     }
          //   ];
          // } else {
          //   const data = this.iCustomProcessViewModelColl.find(i => i.childDisciplineId === this.iPartsViewModel.partCategoryId);
          //   if (data !== undefined) {
          //     this.selectedItems = [
          //       {
          //         'childDisciplineId': data.childDisciplineId, 'childDisciplineName': data.childDisciplineName,
          //         'parentDisciplineId': data.parentDisciplineId, 'parentDisciplineName': data.parentDisciplineName
          //       }
          //     ];
          //   }
          // }
          // this.processSettings = {
          //   singleSelection: true,
          //   text: 'Select Fields',
          //   selectAllText: 'Select All',
          //   unSelectAllText: 'UnSelect All',
          //   searchPlaceholderText: 'Search Fields',
          //   enableSearchFilter: true,
          //   groupBy: 'parentDisciplineName',
          //   labelKey: 'childDisciplineName',
          //   primaryKey: 'childDisciplineId',
          //   noDataLabel: 'No Data Available',
          //   selectGroup: true,
          //   badgeShowLimit: 5,
          //   maxHeight: 200,
          //   showCheckbox: false
          // };
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    // } else {
      // if (this.iPartsViewModel.partCategoryId === 0) {
      //   this.selectedItems = [
      //     {
      //       'childDisciplineId': '99999', 'childDisciplineName': 'Let MFG.com Pick the Best Category',
      //       'parentDisciplineId': '99998', 'parentDisciplineName': 'Let MFG.com Pick the Best Category'
      //     }
      //   ];
      // } else {
      //   const data = this.iCustomProcessViewModelColl.find(i => i.childDisciplineId === this.iPartsViewModel.partCategoryId);
      //   if (data !== undefined) {
      //     this.selectedItems = [
      //       {
      //         'childDisciplineId': data.childDisciplineId, 'childDisciplineName': data.childDisciplineName,
      //         'parentDisciplineId': data.parentDisciplineId, 'parentDisciplineName': data.parentDisciplineName
      //       }
      //     ];
      //   }

      // }
      // this.processSettings = {
      //   singleSelection: true,
      //   text: 'Select Fields',
      //   selectAllText: 'Select All',
      //   unSelectAllText: 'UnSelect All',
      //   searchPlaceholderText: 'Search Fields',
      //   enableSearchFilter: true,
      //   groupBy: 'parentDisciplineName',
      //   labelKey: 'childDisciplineName',
      //   primaryKey: 'childDisciplineId',
      //   noDataLabel: 'No Data Available',
      //   selectGroup: true,
      //   badgeShowLimit: 5,
      //   maxHeight: 200,
      //   showCheckbox: false
      // };
    // }

  }
  getPostProdProcesses() {
    if (this.iPostProductionViewModelColl === undefined) {
      this._rfqService.GetPostProdProcesses().subscribe(
        result => {
          this.iPostProductionViewModelColl = result['data'];
          this.iPostProductionViewModelColl.unshift( this.selectFieldJSON );
          this.apiSuccessCount = this.apiSuccessCount + 1;
          if (this.apiSuccessCount === 6) {
            this.isLoader = false;
          }
          if (this.iPartsViewModel.postProductionProcessId === 0) {
            this.postProcessselectedItems = [ this.selectFieldJSON ];
          } else {
            // tslint:disable-next-line:max-line-length
            const data = this.iPostProductionViewModelColl.find(i => i.childPostProductionProcessId === this.iPartsViewModel.postProductionProcessId);
            if (data !== undefined) {
              this.postProcessselectedItems = [
                {
                  'childPostProductionProcessId': data.childPostProductionProcessId,
                  'childPostProductionProcessName': data.childPostProductionProcessName,
                  'parentPostProductionProcessId': data.parentPostProductionProcessId,
                  'parentPostProductionProcessName': data.parentPostProductionProcessName
                }
              ];
            }
          }
          this.postProductionProcesssettings = {
            singleSelection: true,
            text: 'Select Post Process',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Post Process',
            enableSearchFilter: true,
            groupBy: 'parentPostProductionProcessName',
            labelKey: 'childPostProductionProcessName',
            primaryKey: 'childPostProductionProcessId',
            noDataLabel: 'No Data Available',
            selectGroup: true,
            badgeShowLimit: 5,
            maxHeight: 200,
            showCheckbox: false
          };
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
      if (this.iPartsViewModel.postProductionProcessId === 0) {
        this.postProcessselectedItems = [ this.selectFieldJSON ];
      } else {
        // tslint:disable-next-line:max-line-length
        const data = this.iPostProductionViewModelColl.find(i => i.childPostProductionProcessId === this.iPartsViewModel.postProductionProcessId);
        if (data !== undefined) {
          this.postProcessselectedItems = [
            {
              'childPostProductionProcessId': data.childPostProductionProcessId,
              'childPostProductionProcessName': data.childPostProductionProcessName,
              'parentPostProductionProcessId': data.parentPostProductionProcessId,
              'parentPostProductionProcessName': data.parentPostProductionProcessName
            }
          ];
        }
      }
      this.postProductionProcesssettings = {
        singleSelection: true,
        text: 'Select Post Process',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Search Post Process',
        enableSearchFilter: true,
        groupBy: 'parentPostProductionProcessName',
        labelKey: 'childPostProductionProcessName',
        primaryKey: 'childPostProductionProcessId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        badgeShowLimit: 5,
        maxHeight: 200,
        showCheckbox: false
      };
    }

  }
  // setProperDate(d: Date) {
  //   if (d !== null) {
  //     const abc = new Date(d);
  //     return new Date(Date.UTC(abc.getFullYear(),
  //       abc.getMonth(), abc.getDate()));

  //   }
  // }
  // closePartDetails() {
  //   this._rfqService.set(false, 'showSidePanel');
  // }
firstFocus() {
  if (this.firstQuantity === null ) {
  //   this.quantityError1 = 'Please enter the quantity';
  } else if (this.firstQuantity === 0) {
    this.quantityError1 = 'Quantity cant be zero';
  } else {
    this.quantityError1 = '';
  }
}
secondFocus() {
  if (this.secondQuantity === null) {
    // this.quantityError2 = 'Please enter the quantity Focus';
   } else {
     if (this.secondQuantity === 0) {
       this.quantityError2 = 'Quantity cant be zero';
     }
   }
  // if (this.secondQuantity === 0 || this.secondQuantity * 1 === 0 || this.secondQuantity === null) {
  //   this.secondQuantity = null;
  // } else {
  // }
}
thirdFocus() {
  if (this.thirdQuantity === null) {
    // this.quantityError3 = 'Please enter the quantity';
   } else {
     if (this.thirdQuantity === 0) {
       this.quantityError3 = 'Quantity cant be zero';
     }
   }
  if (this.thirdQuantity === 0 || this.thirdQuantity * 1 === 0 || this.thirdQuantity === null) {
    this.thirdQuantity = null;
  } else {
  }
}
checkfirstQuantity() {
  const quantity = Number(this.firstQuantity);
  if (this.firstQuantity === null || this.firstQuantity.toString() === '' || isNaN(quantity)) {
    this.quantityError1 = 'Please enter the quantity';
    this.firstQuantity = null;
  } else {
    if (quantity === 0 ) {
      this.firstQuantity = null;
      this.quantityError1 = 'Quantity cant be zero';
    } else {
      this.quantityError1 = '';
    }
  }

  if (this.secondQuantityDiv) {
    if (this.secondQuantity !== null ) {
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
checksecondQuantity () {
  const quantity = Number(this.secondQuantity);
  if (this.secondQuantity === null || this.secondQuantity.toString() === '' || isNaN(quantity)) {
    this.secondQuantity = null;
    this.quantityError2 = 'Please enter the quantity';
  } else {
    if (quantity === 0 ) {
      this.secondQuantity = null;
      this.quantityError2 = 'Quantity cant be zero';
    } else {
      this.quantityError2 = '';
    }
  }

  // if (this.secondQuantity === 0 || this.firstQuantity * 1 === 0 || this.secondQuantity === null) {
  //   this.secondQuantity = null;
  //   this.secondQuantityRequiredError = true;
  //   this.secondQuantitySameError = false;
  //   this.quantityError2  = 'Quantity cant be same';
  // } else {
  //   this.secondQuantityRequiredError = false;
  // }
  if (!this.thirdQuantityDiv) {
    if (this.firstQuantity * 1 === this.secondQuantity * 1) {
      this.secondQuantity = null;
      this.secondQuantitySameError = true;
      this.isSameQuantityError = true;
      this.quantityError2  = 'Quantity cant be same';
    } else {
      this.secondQuantitySameError = false;
      this.isSameQuantityError = false;
    }
  }
  if (this.thirdQuantityDiv) {
    if (this.firstQuantity * 1 === this.secondQuantity * 1 || this.firstQuantity * 1 === this.thirdQuantity * 1 ) {
      this.secondQuantity = null;
      this.secondQuantitySameError = true;
      this.isSameQuantityError = true;
      this.quantityError2  = 'Quantity cant be same';
    } else {
      this.secondQuantitySameError = false;
      this.isSameQuantityError = false;
    }
  }
}
checkDeleveryDate () {
  setTimeout( () => {
    if (this.iPartsViewModel.deliveryDate === null) {
      this.isDeliveryDateError = true;
   } else {
    this.isDeliveryDateError = false;
    // this.maxDeliverDate = new Date( this.iPartsViewModel.deliveryDate );
   }
  }, 8000);
}
checkthirdQuantity () {
  const quantity = Number(this.thirdQuantity);
  if (this.thirdQuantity === null || this.thirdQuantity.toString() === '' ||  isNaN(quantity)) {
    this.firstQuantity = null;
    this.quantityError3 = 'Please enter the quantity';
  } else {
    if (quantity === 0 ) {
      this.thirdQuantity = null;
      this.quantityError3 = 'Quantity cant be zero';
    } else {
      this.quantityError3 = '';
    }
  }
  // if (this.thirdQuantity === 0 || this.thirdQuantity * 1 === 0 || this.thirdQuantity === null) {
  //   this.thirdQuantityRequiredError = true;
  //   this.thirdQuantity = null;
  //   this.isSameQuantityError = true;
  //   this.quantityError3 = 'Quantity cant be same';
  // } else {
  //   this.thirdQuantityRequiredError = false;
  // }
  if (this.secondQuantityDiv) {
    if (this.secondQuantity * 1 === this.thirdQuantity * 1 || this.firstQuantity * 1 === this.thirdQuantity * 1 ) {
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
    if (this.firstQuantity * 1 === this.thirdQuantity * 1 ) {
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
  configDatePicker() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }
  addSecondQuantity() {
    this.secondQuantityDiv = true;
    this.addsecondQuantityDiv = false;
    this.addthirdQuantityDiv = true;
    this.secondQtyField.nativeElement.focus();
  }
  addThirdQuantity() {
    this.thirdQuantityDiv = true;
    this.addthirdQuantityDiv = false;
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
      this.addsecondQuantityDiv =  true;
      this.addthirdQuantityDiv = false;
      this.is2QuantityValid = false;
      this.secondQuantity = null ;
      this.thirdQuantity = null;
    }
  }
  deleteThirdQuantity() {
    this.thirdQuantityDiv = false;
    this.addthirdQuantityDiv = true;
    this.is3QuantityValid = false;
    this.thirdQuantity = null;
  }
  onProcessSelect(item: any) {
    // this.iPartsViewModel.partCategoryId = item.childDisciplineId;
  }
  onPostProcessSelect(item: any) {

    this.iPartsViewModel.postProductionProcessId = item.childPostProductionProcessId;
  }
  onMaterialSelect(item: any) {
    this.iPartsViewModel.materialId = item.childMaterialId;
    this.isMaterialValid = false;
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
    if (this.iPartsViewModel.partName.trim() === '' || this.iPartsViewModel.partNumber.trim() === '' ||
      tempNum1 === 0 || this.firstQuantity * 1 === 0 || this.is2QuantityValid || this.is3QuantityValid
      || this.iPartsViewModel.partNumber === null || this.iPartsViewModel.deliveryDate === null ||
      this.iPartsViewModel.materialId === 0 ) {
      return true;
    } else {
      // if ( !isNumber(this.firstQuantity)) {
      //   return true;
      // } else {
      //   return false;
      // }
    }
  }

  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
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
  resetQuantityModel() {
    this.iRfqPartQuantityViewModel = {
      rfqPartQuantityId: 0,
      rfqPartId: 0,
      partQty: 0,
      quantityLevel: 0
    };
  }
  checkPartPropertyChange () {
    if (this.iPartsViewModelOld.partName !== this.iPartsViewModel.partName ||
      // this.iPartsViewModelOld.partCategoryId !== this.iPartsViewModel.partCategoryId ||
      this.iPartsViewModelOld.materialId !== this.iPartsViewModel.materialId ||
      this.iPartsViewModelOld.postProductionProcessId !== this.iPartsViewModel.postProductionProcessId ||
      this.iPartsViewModelOld.partDescription !== this.iPartsViewModel.partDescription ||
      this.iPartsViewModelOld.partQtyUnitId !== this.iPartsViewModel.partQtyUnitId ||
      this.iPartsViewModelOld.partNumber !== this.iPartsViewModel.partNumber ) {
        this.iPartsViewModel.createNewPart = true;
    } else {
      this.iPartsViewModel.createNewPart = false;
    }
  }
  savePartDetails() {
    if (this.materialselectedItems.length === 0) {
      this.isMaterialValid = true;
    } else {
      if (!this.isPartDetailsBtnClicked) {
        const currentPartId = this._rfqService.get('currentPartOpendId');
        const currentRFQId = this._rfqService.get('currentRFQId');
        this.isPartDetailsBtnClicked = true;
        const partsFiles = [];
        this.iPartUploadedFileNameList.FileNameList.forEach(fileInfo => {
          partsFiles.push(fileInfo.CompleteFileName);
        });
        this.checkPartPropertyChange();
        this.iPartsViewModel.rfqPartQuantityList = [];

        this.iRfqPartQuantityViewModel.partQty = this.firstQuantity;
        this.iRfqPartQuantityViewModel.rfqPartId = currentPartId;

        this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
        this.resetQuantityModel();

        if (this.secondQuantityDiv === true) {
          this.iRfqPartQuantityViewModel.partQty = this.secondQuantity;
          this.iRfqPartQuantityViewModel.rfqPartId = currentPartId;
          this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
          this.resetQuantityModel();
        }
        if (this.thirdQuantityDiv === true) {
          this.iRfqPartQuantityViewModel.partQty = this.thirdQuantity;
          this.iRfqPartQuantityViewModel.rfqPartId = currentPartId;
          this.iPartsViewModel.rfqPartQuantityList.push(this.iRfqPartQuantityViewModel);
          this.resetQuantityModel();
        }
        this.iPartsViewModel.partId = currentPartId;
        this.iPartsViewModel.partName = this.iPartsViewModel.partName;
        this.iPartsViewModel.partNumber = this.iPartsViewModel.partNumber;
        this.iPartsViewModel.partDescription = this.iPartsViewModel.partDescription;
        this.iPartsViewModel.materialId = this.iPartsViewModel.materialId;
        this.iPartsViewModel.partQtyUnitId = this.iPartsViewModel.partQtyUnitId;
        // this.iPartsViewModel.partCategoryId = this.iPartsViewModel.partCategoryId;
        // this.iPartsViewModel.companyId = this._rfqService.get('currentRfqCompanyId');
        // this.iPartsViewModel.contactId = this._rfqService.get('currentRfqContactId');
          this.iPartsViewModel.companyId = this.iPartsViewModel.companyId;
        this.iPartsViewModel.contactId = this.iPartsViewModel.contactId;
        this.iPartsViewModel.rfqId = 0;
        // this.iPartsViewModel.createNewPart = false;
        // tslint:disable-next-line:max-line-length
       // this.iPartsViewModel.deliveryDate = this.setProperDate(this.iPartsViewModel.deliveryDate); // new Date(Date.UTC(this.iPartsViewModel.deliveryDate.getFullYear(), this.iPartsViewModel.deliveryDate.getMonth(), this.iPartsViewModel.deliveryDate.getDay()));
        this.iPartsViewModel.partsFiles = partsFiles;
        this.iPartsViewModel.postProductionProcessId = this.iPartsViewModel.postProductionProcessId;
        this._rfqService.addPartDetails(this.iPartsViewModel).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          result => {
            this.iPartsViewModel = result;
            if (this.iPartsViewModel.result === true) {
              this.isPartDetailsBtnClicked = false;
              this._rfqService.set(true, 'partMOdified');
              this.selectedItems = [];
              this.materialselectedItems = [];
              this.postProcessselectedItems = [ this.selectFieldJSON ];
              this.initPartViewModel();
              this._rfqService.set(false, 'showSidePanel');
              this._rfqService.set(true, 'savePartRFQ');
              this._toastr.success('Part Details Has Been Succefully saved', 'Success!');
              this.cancelPartDetails1();
            } else {
              this._toastr.error(this.iPartsViewModel.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
    }


  }
  checkPartChange () {
    const currentPartId = this._rfqService.get('currentPartOpendId');
    if (this.currentPartId !== currentPartId) {
      this.isLoader = true;
      this.isNewPart = true;
      this.openPartDetails();
    }
  }
  openPartDetails() {
    this.initPartViewModel();
    const currentPartId = this._rfqService.get('currentPartOpendId');
    this.currentPartId =  this._rfqService.get('currentPartOpendId');
    const rfqPartId =  this._rfqService.get('currentrfqPartId');
    this.firstQuantity = 0;
    this.secondQuantityDiv = false;
    this.thirdQuantityDiv = false;
    this.isMaterialTouched = false;
    this.secondQuantity = 0;
    this.addsecondQuantityDiv = true;
    this.addthirdQuantityDiv = false;
    this.thirdQuantity = 0;
    this.selectedItems = [];
    this.materialselectedItems = [];
    this.postProcessselectedItems = [ this.selectFieldJSON ];
    if (currentPartId !== undefined && rfqPartId !== undefined) {
      this._rfqService.getPartDetails(currentPartId, rfqPartId).subscribe(
        result => {

          this.iPartsViewModel = result;
          this.iPartsViewModelOld = result;
          this.apiSuccessCount = this.apiSuccessCount + 1;
          if (this.apiSuccessCount === 6) {
            this.isLoader = false;
          }
          if (this.isNewPart) {
            this.isLoader = false;
            this.isNewPart = false;
          }
          this.iPartUploadedFileNameList.FileNameList = [];
          if (this.iPartsViewModel.partsFiles) {
            this.iPartsViewModel.partsFiles.forEach(x => {
              let oriFileName = '';
              if (x !== undefined && x !== null) {
                const fileNameArray = (x).split('_S3_');
                if (fileNameArray) {
                  oriFileName = fileNameArray[1];
                }
                this.iPartUploadedFileNameList.FileNameList.push(
                  {
                    oFileName: oriFileName,
                    CompleteFileName: x
                  }
                );
              }
            });
          }
          if (this.iPartsViewModel.deliveryDate !== null) {
          //  this.iPartsViewModel.deliveryDate = this.setProperDate(this.iPartsViewModel.deliveryDate);
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
          }
          if (this.secondQuantity !== 0) {
            this.secondQuantityDiv = true;
            this.addsecondQuantityDiv = false;
            this.addthirdQuantityDiv = true;
          }
          if (this.thirdQuantity !== 0) {
            this.thirdQuantityDiv = true;
            this.addthirdQuantityDiv = false;
          }
          if (this.iPartsViewModel.rfqPartFile) {
            // console.log('file', this.iPartsViewModel.rfqPartFile);
            const filenNameArray = (this.iPartsViewModel.rfqPartFile).split('_S3_');
            if (filenNameArray.length > 1) {
              this.currentImageName = filenNameArray[1];
            } else if (filenNameArray.length === 1) {
              this.currentImageName = filenNameArray[0];
            }
            // console.log('filec',  this.currentImageName);
          }
          this.selectedItems = [];
          this.materialselectedItems = [];
          this.postProcessselectedItems = [ this.selectFieldJSON ];
          this.getProcess();
          this.getMaterial();
          this.getPostProdProcesses();
          this.childProcess = this.iCustomProcessViewModelColl.filter(x => x.parentDisciplineId == this.iPartsViewModel.parentPartCategoryId);
          // this.loadChildProcess(this.iPartsViewModel.parentPartCategoryId);
          if (this.childProcess && this.childProcess.length != 0) {
            this.iPartsViewModel.showPartSizingComponent = this.childProcess[0].showPartSizingComponent;
            this.iPartsViewModel.showQuestionsOnPartDrawer = this.childProcess[0].showQuestionsOnPartDrawer;
          }
          if (this.iPartsViewModel.childPartCategoryId === null || this.iPartsViewModel.childPartCategoryId === undefined) {
            this.iPartsViewModel.childPartCategoryId = 0;
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }

  }

  ngOnInit() {
  }
  downloadAllFiles(fileCompArray, isDownload: boolean,  partFile) {
    fileCompArray.forEach(element => {
      this.downloadS3File(element.CompleteFileName, isDownload);
    });
    if (partFile !== '') {
      this.downloadS3File(partFile, isDownload);
    }
  }
  // partNumberFocus() {
  //   const partNum = Number(this.iPartsViewModel.partNumber);
  //   if (partNum === null ) {
  //   //   this.PartError1 = 'Please enter the quantity';
  //   } else if (partNum === 0) {
  //     this.PartError1 = 'Part Number cant be zero';
  //   } else {
  //     this.PartError1 = '';
  //   }
  // }
  checkPartNumber () {
    const quantity = Number(this.iPartsViewModel.partNumber.toString());
    if (this.iPartsViewModel.partNumber === null || this.iPartsViewModel.partNumber.toString() === '') {
      this.PartError1 = 'Please enter the part number';
      // this.iPartsViewModel.partNumber = null;
    } else {
      if (quantity === 0 ) {
        // this.iPartsViewModel.partNumber = null;
        this.PartError1 = 'Part number cant be zero';
      } else {
        this.PartError1 = '';
      }
    }
  }

  getOriginalPartName (fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
          return filenNameArray[0];
      }
      return filenNameArray[1];
    }
    // this.oappendText = '';
    // let fixStr: '';
    // if (fileName) {
    //   const filenNameArray = fileName.split('_S3_');
    //   if (filenNameArray.length === 1) {
    //     const charactorCount = filenNameArray[0].length;
    //     if (charactorCount > 60 ) {
    //        fixStr =  fileName.slice(0, 60);
    //        this.oappendText = fixStr.concat(this.appendText);
    //        return this.oappendText;
    //     } else {
    //       return filenNameArray[0];
    //     }
    //   } else {
    //     const charactorCount = filenNameArray[1].length;
    //     if (charactorCount > 60 ) {
    //        fixStr =  fileName.slice(0, 60);
    //        this.oappendText =  fixStr.concat(this.appendText);
    //        return this.oappendText;
    //     } else {
    //       return filenNameArray[1];
    //     }

    //   }
    //  // return filenNameArray[1];
    // }
  }

}
