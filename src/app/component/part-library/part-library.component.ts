import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  MasterService
} from '../../core/services/master/master.service';
import {
  IPartLibraryModelDetails,
  IPartLibraryModel
} from '../../core/models/partModel';
import {
  IPartsViewModel,
  IRfqPartQuantityViewModel
} from '../../core/models/rfqModel';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';


@Component({
  selector: 'app-part-library',
  templateUrl: './part-library.component.html',
  styleUrls: ['./part-library.component.scss']
})
export class PartLibraryComponent implements OnInit {

  partDrawerSearch: string;
  isPartDrawerFilledWithoutSearch: boolean;
  iPartLibraryModelDetailsColl: IPartLibraryModelDetails[];
  iRfqPartQuantityViewModel: IRfqPartQuantityViewModel;
  iPartsViewModel: IPartsViewModel;
  constructor(private _rfqService: RfqService, private _masterService: MasterService, private _toastr: ToastrService, public router: Router) {
  }


  ngOnInit() {
    this.partDrawerSearch = '';
    this.isPartDrawerFilledWithoutSearch = false;
    this.onSearchChange();
  }

  initPartViewModel() {
    this.iRfqPartQuantityViewModel = {
      rfqPartQuantityId: 0,
      rfqPartId: 0,
      partQty: 0,
      quantityLevel: 0
    };
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
      parentPartCategoryId:0,
      childPartCategoryId: 0
    };


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
  closePartDetails() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'showPartLibrary');
    this._rfqService.set(false, 'showPartAttachment');
    this._rfqService.set(false, 'rfqPartDrawer');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'activePartId');
  }
  showHideRFQPartDetails(part: IPartLibraryModelDetails) {
    part.ShowDetials = !part.ShowDetials;
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
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return 0;
  }

  onSearchChange() {
    // && (this.partDrawerSearch.length > 2)
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
          }
        },
        error => () => {
          // this._toastr.error(error, 'Error!');
          this._rfqService.handleError(error);
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
          this._rfqService.handleError(error);
        }
      );
    }
  }



  addPartToRFQ(partElement: IPartLibraryModel) {
    // tslint:disable-next-line:prefer-const
    // console.log('partdetails', partElement);
    this.initPartViewModel();
    this.iPartsViewModel.partId = partElement.partId;
    this.iPartsViewModel.primaryPartFile = partElement.primaryPartFile;
    this.iPartsViewModel.rfqPartFile = partElement.primaryPartFile;
    // tslint:disable-next-line:radix
    this.iPartsViewModel.contactId = this.loggedId;
    this.iPartsViewModel.companyId = this.loggedCompanyId;
    this.iPartsViewModel.partName = partElement.partName;
    this.iPartsViewModel.partNumber = partElement.partNumber;
    this.iPartsViewModel.rfqId = this.currentRfqId;
    this.iPartsViewModel.partId = partElement.partId;
    this.iPartsViewModel.partsFiles.push(partElement.primaryPartFile);
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
    const partsFiles = [];
    partElement.partsFiles.forEach(fileInfo => {
      partsFiles.push(fileInfo);
    });
    this.iPartsViewModel.partsFiles = partsFiles;

    this.iPartsViewModel.deliveryDate = null;

    this._rfqService.addPartToRFQ(this.iPartsViewModel).subscribe(
      result2 => {
        // debugger;
        if (result2['result'] === true) {
          this.router.navigateByUrl('/rfq/buyer?rfqId=' + encodeURIComponent(this._rfqService.encrypt(result2.rfqId).toString()));
                                   
          /* 
          this._rfqService.set(true, 'partMOdified');
          this._rfqService.set(false, 'showSidePanel');
          this._rfqService.set(false, 'showPartLibrary');
          this._rfqService.set(false, 'showPartAttachment');
          this._rfqService.set(false, 'rfqPartDrawer');
          this._rfqService.set(false, 'showSidePanel');
          this._rfqService.set(0, 'activePartId');
          localStorage.setItem('EditRfqName', (result2.rfqId).toString());
          localStorage.setItem('EditRfqId', (result2.rfqId).toString());
          this.router.navigateByUrl('/rfq/editrfq'); */
        } else {
          this._toastr.error(result2['errorMessage'], 'Error!');
        }
      },
      error => {
        // this._toastr.error(error, 'Error!');
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  removeTextValue() {
    if (this.partDrawerSearch !== '') {
      this.partDrawerSearch = '';
    }
    this.onSearchChange();
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.onSearchChange();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.onSearchChange();
    }
  }

  showHideRFQPartDrawerDetails(id) {
    id.ShowDetials = !id.ShowDetials;
  }
  downloadAllFiles(fileCompArray: string[], isDownload: boolean, partfile) {
    fileCompArray.forEach(element => {
      this.downloadS3File(element, isDownload);
    });

    if (partfile !== '') {
      this.downloadS3File(partfile, isDownload);
    }
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      //  const herader = response.headers.get('Content-Disposition');
      // this.downLoadFile(response.body, '');
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

  removePartAttachment(partName, partId, rfqPartId) {
      this._rfqService.deletePartGeneralAttachment(partName, this.loggedId, partId, rfqPartId).subscribe(
        (data: IPartsViewModel) => {
          if (data.result === true) {
         this.onSearchChange();

          } else {
            // this._toastr.success(this.iContactViewModel.errorMessage, data.errorMessage);
          }
        },
        error => () => {
          console.error('Error: $error');
          this._toastr.error(error, 'Error!');
        }
      );


  }
}
