import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RFQBaseComponent } from '../rfq-base.component ';
import { RequestQuoteService } from '../request-form-quote.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUtil } from '../../../../app/app.util';
@Component({
  selector: 'rfq-added-part-section',
  templateUrl: 'rfq-added-part-section.component.html',
  styleUrls: ['rfq-added-part-section.component.scss', '../rfq-common.scss']
})

export class RFQAddedPartSectionComponent extends RFQBaseComponent implements OnInit {

  rfqsAddedPartDataSubscription: Subscription;
  existingPartList:any= [];
  opendedSection:String= ''; 
  popupDataModel: any;
  disableEditCloneDelete:boolean=false;
  showAddedSection: boolean = true;
  partDrawerSearch: string = "";
  partLibraryList: any = [];

  @ViewChild('statusModel', { static: true }) rfqStatusModal: TemplateRef<any>;

  constructor(private requestQuoteService: RequestQuoteService, private modalService: NgbModal) {
    super();
    this.rfqsAddedPartDataSubscription = this.requestQuoteService.rfqsAddedPartData$.subscribe((rfqServiceData) => {
      if (rfqServiceData) {
        if (rfqServiceData["openAddFromPartLibrarySection"]) {
          this.openPartLibrarySearchSection();
        }
        if (rfqServiceData["opendedSection"]) {
          this.opendedSection=rfqServiceData["opendedSection"];
        }
        if(rfqServiceData['existingPartList']){
          this.existingPartList= rfqServiceData['existingPartList']
          this.disableEditCloneDelete=false;
          if(this.existingPartList.length==1){
            //this case is for file is uploaded from dashboard 
           let  partData=this.existingPartList[0];   
            if(AppUtil.isEmptyString(partData.partName)
            ||AppUtil.isEmptyString(partData.partNumber)
            ||AppUtil.isEmptyList(partData.rfqPartQuantityList)
            || AppUtil.isEmptyString(partData.materialId)
            ||partData.materialId===0){
              this.editPart(partData);
              return;
            }else{
              this.requestQuoteService.resetAddNewPart();
            }
          }else{
            this.requestQuoteService.resetAddNewPart();
          }
        }
      }
    });
  }
  ngOnInit(): void {
    this.resetPopupData();
  }
  ngOnDestroy(): void {
    this.rfqsAddedPartDataSubscription.unsubscribe();
  }
  resetPopupData() {
    this.popupDataModel = { 
      statusModalReference: {}, 
      partDataToCloneDelete: {}, 
      isClone: false, 
      isDelete: false,
      fileName:'',
      isDeletePartAttachment:false
    }
  }
  editPart(partData) {
    if(!this.disableEditCloneDelete){
    this.disableEditCloneDelete=true;
    this.requestQuoteService.sendNotificationToEditRFQPart(partData);
    }
  }

  closePopupAndStayOnPage() {
    this.popupDataModel.statusModalReference.close();
    this.resetPopupData();
  }
  clonePart(partData) {
    if(!this.disableEditCloneDelete){
      this.popupDataModel.partDataToCloneDelete = partData;
      this.popupDataModel.isClone = true;
      this.popupDataModel.statusModalReference = this.modalService.open(this.rfqStatusModal, {
        backdrop: 'static'
      });
  }
  }
  acceptOrReject(yesNo) {
    if (yesNo) {
      this.disableEditCloneDelete=true;
      const partData = Object.assign({},
        this.popupDataModel.partDataToCloneDelete);
      if (this.popupDataModel.isClone) {
        this.requestQuoteService.cloneRFQPart(partData, this.RFQ_PS);
      }
      if (this.popupDataModel.isDelete) {
        this.requestQuoteService.removeRFQPartFile(partData);
      }
      if (this.popupDataModel.isDeletePartAttachment) {
        this.requestQuoteService.deletePartAttachment(partData, this.popupDataModel.fileName);
      }
    }
    this.closePopupAndStayOnPage();
  }
  deletePart(partData) {
    if(!this.disableEditCloneDelete){
      this.popupDataModel.partDataToCloneDelete = partData;
      this.popupDataModel.isDelete = true;
      this.popupDataModel.statusModalReference = this.modalService.open(this.rfqStatusModal, {
        backdrop: 'static'
      });
  }
  }
  removeFile(partData, fileName) {
    if(!this.disableEditCloneDelete){
      this.popupDataModel.partDataToCloneDelete = partData;
      this.popupDataModel.fileName=fileName;
      this.popupDataModel.isDeletePartAttachment = true;
      this.popupDataModel.statusModalReference = this.modalService.open(this.rfqStatusModal, {
        backdrop: 'static'
      });
    }
  }
  getQuantityUnitById(qtyId) {
    return this.requestQuoteService.getQuantityUnitById(qtyId);
  }

  //partLibrary related method started
  closePartDetails() {
    this.showAddedSection = true;
    this.requestQuoteService.closeNotificationSection();
  }
  getText(part, key) {
    const value = part?.PartLibraryModel?.[key];
    return AppUtil.isEmptyString(value) ? 'N/A' : value;
  }
  openPartLibrarySearchSection() {
    this.partDrawerSearch = '';
    this.onSearchChange();
  }
  searchByKey($event) {
    if ($event.keyCode === 13) {
      this.onSearchChange();
    }
  }
  showHideRFQPartDrawerDetails(part) {
    part.ShowDetials = !part.ShowDetials;
  }

  removeTextValuePart() {
    if (this.partDrawerSearch) {
      this.partDrawerSearch = '';
    }
    this.onSearchChange();
  }
  getImageForPart(partFile: any) {
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
  onSearchChange() {
    let textToSearch = '';
    if (AppUtil.isNotEmptyString(this.partDrawerSearch)) {
      textToSearch = this.partDrawerSearch;
    }
    this.requestQuoteService.showAPIRunningLoader();
    this.requestQuoteService.getPartLibrary(textToSearch).subscribe(
      (data: any) => {
        this.partLibraryList = [];
        for (const entry of data) {
          let partLibraryModel: any = {
            PartLibraryModel: entry,
            ShowDetials: false
          };
          this.partLibraryList.push(partLibraryModel);
        }
        this.showAddedSection = false;
        this.requestQuoteService.hideAPIRunningLoader();
      },
      error => () => {
        this.requestQuoteService.hideAPIRunningLoader();
        this.requestQuoteService.showTosterErrorMessage(error, 'Error!');
      }
    );
  }
  addPartToRFQ(partElement: any) {
    let iPartsViewModel: any = this.initPartViewModel();
    iPartsViewModel.partId = partElement.partId;
    iPartsViewModel.primaryPartFile = partElement.primaryPartFile;
    iPartsViewModel.rfqPartFile = partElement.primaryPartFile;
    iPartsViewModel.contactId = this.requestQuoteService.getLoogedUserId();
    iPartsViewModel.companyId = parseInt(localStorage.getItem('loggedCompanyId'));
    iPartsViewModel.partName = partElement.partName;
    iPartsViewModel.partNumber = partElement.partNumber;
    iPartsViewModel.rfqId = this.requestQuoteService.getRFQId();
    iPartsViewModel.partQtyUnitId = partElement.partQtyUnitId;
    iPartsViewModel.parentPartCategoryId = partElement.parentPartCategoryId;
    iPartsViewModel.childPartCategoryId = partElement.childPartCategoryId;
    iPartsViewModel.parentCategoryName = partElement.parentCategoryName;
    iPartsViewModel.childCategoryName = partElement.childCategoryName;
    iPartsViewModel.isChildCategorySelected = partElement.isChildCategorySelected;
    iPartsViewModel.materialId = partElement.materialId;
    iPartsViewModel.postProductionProcessId = partElement.postProductionProcessId;
    iPartsViewModel.partDescription = partElement.partDescription;
    iPartsViewModel.rfqPartQuantityList = partElement.rfqPartQuantityList;
    partElement.partsFiles = partElement.partsFiles.filter(ele => {
      return ele != "New Part";
    });
    iPartsViewModel.partsFiles = partElement.partsFiles;
    let rfqPartFile = partElement.rfqPartFile;
    if(AppUtil.isEmptyString(rfqPartFile)){
      rfqPartFile=partElement.primaryPartFile
    }
    iPartsViewModel.rfqPartFile =rfqPartFile;
    iPartsViewModel.primaryPartFile =partElement.primaryPartFile;
    iPartsViewModel.deliveryDate = null;
    iPartsViewModel.isCommunityRfq = false;
    this.requestQuoteService.showAPIRunningLoader();
    this.requestQuoteService.addPartToRFQ(iPartsViewModel).subscribe(
      response => {
        if (response['result'] === true) {
          this.requestQuoteService.showTosterSuccessMessage("Successfully added");
          this.requestQuoteService.sendNotificationFormoveToNextSection(this.RFQ_PS);
         this.showAddedSection = true;
          this.requestQuoteService.closeNotificationSection();
          this.disableEditCloneDelete=false;
          this.closePartDetails();
          this.partDrawerSearch = '';
          this.opendedSection = 'partDetailSectionOpened' + response.partId;
          response.rfqPartQuantityList = [];
          this.requestQuoteService.hideAPIRunningLoader();
          this.requestQuoteService.reloadPartSection(response.rfqId);          
        } else {
        this.requestQuoteService.hideAPIRunningLoader();
          this.requestQuoteService.showTosterErrorMessage(response['errorMessage'], 'Error!');
        }
      },
      error => {
        this.requestQuoteService.hideAPIRunningLoader();
        this.requestQuoteService.showTosterErrorMessage(error, 'Error!');
      },
      () => { }
    );
  }
  initPartViewModel() {
    return {
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
      parentCategoryName: '',
      childCategoryName: '',
      isDefaultParentPartCategory: false,
      isDefaultChildPartCategory: false,
      isChildCategorySelected: false,
      isChildSameAsParent: false,
      rfqPartDrawerAnswerList: null,
    };
  }
  //partLibrary  related method ends
  downloadAllFilesForPart(rfqPartFile, partsFiles){
    partsFiles.forEach(fileName => {
      this.requestQuoteService.getS3FileDownload(fileName).subscribe(response => { });
    });
    if (rfqPartFile !== '') {
      this.requestQuoteService.getS3FileDownload(rfqPartFile).subscribe(response => { });
    }
  }


}
