import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RFQBaseComponent } from '../rfq-base.component ';
import { RequestQuoteService } from '../request-form-quote.service';
import { AppUtil } from '../../../../app/app.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
@Component({
  selector: 'rfq-detail-section',
  templateUrl: 'rfq-detail-section.component.html',
  styleUrls: ['rfq-detail-section.component.scss', '../rfq-common.scss']
})
export class RFQDetailSectionComponent extends RFQBaseComponent implements OnInit {

  @ViewChild('showMFGNDAMessageSectionModal', { static: true }) showMFGNDAMessageSectionModal: TemplateRef<any>;
  @ViewChild('rfqDetailDeliveryDeadllineInput', { static: true }) rfqDetailDeliveryDeadllineInput: ElementRef;
  
  showMFGNDAMessageSectionRef: any;
  dragAreaClass: string;

  displayAwardDateError: boolean = false;
  displayQuotesNeededByDateError: boolean = false;
  displayDeliveryDateError: boolean = false;
  datesMinValue: any = { quotesNeededBy: new Date(), awardDate: new Date(), deliveryDate: new Date() };
  rfqDetailForm: FormGroup;
  customNDAFileFileName: any = null;
  territoryClassificationList: any = [];
  benchmarkingPurposeList: any = [];
  selectedTerritoryCode;
  irfqViewModel: any;
  isInitialized: boolean = false;
  disableDeliveryDeadline: boolean = true;
  disableAwardDate: boolean = true;;
  constructor(private formBuilder: FormBuilder,
    private requestQuoteService: RequestQuoteService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    super();
  }
  ngOnDestroy(): void {
  }
  dataLoaded = false;
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.irfqViewModel = this.requestQuoteService.getCurrentRFQData();
    if (this.irfqViewModel.rfqId > 0 && !this.isInitialized) {
      this.isInitialized = true;
      this.dragAreaClass = "dragarea";
      this.requestQuoteService.showAPIRunningLoader();
      this.requestQuoteService.getTerritoryClassification().subscribe(territoryClassificationList => {
        this.territoryClassificationList = territoryClassificationList;
        this.requestQuoteService.getRFQBenchmarkingPurposeList().subscribe(bmpList => {
          this.benchmarkingPurposeList = bmpList;
          this.selectedTerritoryCode = this.DEFULAT_TERRITORY_CLASSIFICATION_CODE;
          const rfqDetailData = this.requestQuoteService.getDetailSectionData();
          this.requestQuoteService.loadCustomNDAFile(rfqDetailData.rfqId).subscribe(ndaFile => {
            this.customNDAFileFileName = ndaFile;
            rfqDetailData.ndaFile = ndaFile;
            let ndaLevel = this.ndaSectionData.stanardNDAValue;
            if (AppUtil.isNotEmptyString(ndaFile)) {
              ndaLevel = this.ndaSectionData.customNDAValue;
            }
            rfqDetailData.ndaLevel = ndaLevel;
            let isDefaultNDAdetails = false;
            if (AppUtil.isNotEmptyString(rfqDetailData.isDefaultNDAdetails)) {
              isDefaultNDAdetails = rfqDetailData.isDefaultNDAdetails;
            }
            rfqDetailData.isDefaultNDAdetails = isDefaultNDAdetails;
            this.initilizeFormData(rfqDetailData);
            this.dataLoaded = true;
            this.scrollPageToTop();
            this.requestQuoteService.hideAPIRunningLoader();
          });
        });
      });

    }
  }

  validateDateFormat(rfqDetailData, fieldName) {
    if (AppUtil.isNotEmptyString(rfqDetailData[fieldName])) {
      return moment.utc(rfqDetailData[fieldName]).toDate();
    }
    return null;
  }
  initilizeFormData(rfqDetailData) {
    rfqDetailData['quotesNeededBy'] = this.validateDateFormat(rfqDetailData, 'quotesNeededBy');
    rfqDetailData['awardDate'] = this.validateDateFormat(rfqDetailData, 'awardDate');
    rfqDetailData['deliveryDate'] = this.validateDateFormat(rfqDetailData, 'deliveryDate');
    this.rfqDetailForm = this.formBuilder.group({
      rfqName: [rfqDetailData['rfqName'], [Validators.required, Validators.minLength(1), this.noWhitespaceValidator]],
      ndaLevel: [rfqDetailData['ndaLevel'], Validators.required],
      ndaTypekey: [rfqDetailData['ndaTypekey'], Validators.required],
      isDefaultNDAdetails: [rfqDetailData['isDefaultNDAdetails'], Validators.required],
      deliveryDate: [rfqDetailData['deliveryDate'], Validators.required],
      quotesNeededBy: [rfqDetailData['quotesNeededBy'], Validators.required],
      awardDate: [rfqDetailData['awardDate'], Validators.required],
      isPartialQuotingAllowed: [rfqDetailData['isPartialQuotingAllowed']],
      rfqPurpose: [rfqDetailData.rfqPurpose],
      isForBenchmarking: [rfqDetailData['isForBenchmarking']],
      rfqPurposeOtherComment: [rfqDetailData.rfqPurposeOtherComment],
      customNDAFile: [""],
      ndaContent: [this.NDA_CONTENT],
      ndaFile: [rfqDetailData['ndaFile']],
      ndaFileId: [rfqDetailData['ndaFileId']],
      preferredMfgLocationIds: [rfqDetailData.preferredMfgLocationIds, Validators.required]
    });

    this.disableAwardDate = this.rfqDetailForm.value.awardDate === null ? true : false;
    this.disableDeliveryDeadline = this.rfqDetailForm.value.deliveryDate === null ? true : false;

    if (!this.disableAwardDate) {
      this.datesMinValue.awardDate = new Date(this.rfqDetailForm.value['quotesNeededBy']);
      this.datesMinValue.awardDate.setDate(this.datesMinValue.awardDate.getDate() + 1)
    }
    if (!this.disableDeliveryDeadline) {
      this.datesMinValue.deliveryDate = new Date(this.rfqDetailForm.value['awardDate']);
      this.datesMinValue.deliveryDate.setDate(this.datesMinValue.deliveryDate.getDate() + 1)
    }
    this.updateSelectedTerritoryCode(rfqDetailData.preferredMfgLocationIds)
  }
  updateSelectedTerritoryCode(preferredMfgLocationIds) {
    if (AppUtil.isNotEmptyList(preferredMfgLocationIds)) {
      this.rfqDetailForm.patchValue({ preferredMfgLocationIds: preferredMfgLocationIds });
      this.selectedTerritoryCode = []
      preferredMfgLocationIds.forEach(id => {
        this.territoryClassificationList.find(obj => {
          if (obj.territoryClassificationId === id) {
            this.selectedTerritoryCode.push(obj.territoryClassificationCode);
          }
        });
      });
    }
  }
  toggleShowMFGNDAMessageSection() {
    this.showMFGNDAMessageSectionRef = this.modalService.open(this.showMFGNDAMessageSectionModal, {
      backdrop: 'static'
    });
  }
  closeShowMFGNDAMessageSection() {
    this.showMFGNDAMessageSectionRef.close();
    this.showMFGNDAMessageSectionRef = null;
  }

  onAwardDateChange() {
    this.displayAwardDateError = false;
    this.disableDeliveryDeadline = false;

    if (AppUtil.isEmptyString(this.rfqDetailForm.value.awardDate) ||
      this.requestQuoteService.validateRFQSectionsFormFields(this.rfqDetailForm, 'awardDate')) {
      this.displayAwardDateError = true;
      return;
    }
    if (this.onQuotesNeededByChange(false)) {
      this.displayQuotesNeededByDateError = true;
      this.rfqDetailForm.controls['awardDate'].setValue(null);
      return false;
    }
    this.rfqDetailForm.controls['awardDate'].setValue(this.validateAllDate('awardDate'));
    this.datesMinValue.deliveryDate = new Date(this.rfqDetailForm.value['awardDate']);
    this.datesMinValue.deliveryDate.setDate(this.datesMinValue.deliveryDate.getDate() + 1)
  }
  validateAllDate(fieldName) {
    let qnb = this.rfqDetailForm.value['quotesNeededBy'];
    let ad = this.rfqDetailForm.value['awardDate'];
    let dd = this.rfqDetailForm.value['deliveryDate'];
    if (AppUtil.isNotEmptyString(qnb)) {
      qnb = new Date(qnb).getTime();
    }
    if (AppUtil.isNotEmptyString(ad)) {
      ad = new Date(ad).getTime();
    }
    if (AppUtil.isNotEmptyString(dd)) {
      dd = new Date(dd).getTime();
    }
    if (AppUtil.isNotEmptyString(qnb) && AppUtil.isNotEmptyString(ad) && qnb >= ad) {
      this.toastr.warning("Quotes needed by date should be less then Awarded date");
      this.rfqDetailForm.patchValue({ awardDate: '' })
    }
    if (AppUtil.isNotEmptyString(ad) && AppUtil.isNotEmptyString(dd) && ad >= dd) {
      this.toastr.warning("Award date should be less then Delivery date");
      this.rfqDetailForm.patchValue({ deliveryDate: '' })
    }
    if (AppUtil.isNotEmptyString(dd) && AppUtil.isNotEmptyString(qnb) && qnb >= dd) {
      this.toastr.warning("Delivery date should be greater then Quote needed by and Award date");
      this.rfqDetailForm.patchValue({ deliveryDate: '' })
    }
    return this.rfqDetailForm.value[fieldName];
  }
  onDeliveryDateChange() {
    if (AppUtil.isEmptyString(this.rfqDetailForm.value.deliveryDate) ||
      this.requestQuoteService.validateRFQSectionsFormFields(this.rfqDetailForm, 'deliveryDate')) {
      this.displayDeliveryDateError = true;
      return;
    } else {
      this.displayDeliveryDateError = false;
    }
    this.rfqDetailForm.controls['deliveryDate'].setValue(this.validateAllDate('deliveryDate'));
  }
  saveFiles(files) {
    if (files.length > 1) {
      this.toastr.warning("Only one file at time allow.");
      return;
    }
    const file = files[0];
    if (file.type === "application/pdf") {
      this.requestQuoteService.showAPIRunningLoader();
      this.requestQuoteService.uploadNDAFile(file).subscribe(fileName => {
        this.customNDAFileFileName = fileName;
        this.rfqDetailForm.patchValue({ ndaFile: fileName,ndaContent:'', customNDAFile: "" });
        this.requestQuoteService.hideAPIRunningLoader();
      });
    } else {
      this.toastr.warning("Only PDF file allowed.");
    }
  }
  removeNDAFile() {
    this.customNDAFileFileName = null;
    this.rfqDetailForm.patchValue({ ndaFileId: "", ndaContent: this.NDA_CONTENT, ndaFile: "", customNDAFile: "" });
    this.requestQuoteService.removeCustomNDAFile();
  }
  onQuotesNeededByChange(validateAll = true) {
    this.disableAwardDate = false;
    this.displayQuotesNeededByDateError = AppUtil.isEmptyString(this.rfqDetailForm.controls.quotesNeededBy.value);
    if (validateAll) {
      this.rfqDetailForm.controls['quotesNeededBy'].setValue(this.validateAllDate('quotesNeededBy'));
      this.datesMinValue.awardDate = new Date(this.rfqDetailForm.value['quotesNeededBy']);
      this.datesMinValue.awardDate.setDate(this.datesMinValue.awardDate.getDate() + 1)
    }
    return this.displayQuotesNeededByDateError;
  }
  validateDates() {
    this.onQuotesNeededByChange();
    this.onAwardDateChange();
    this.onDeliveryDateChange();
  }

  changeTerritoryCode(tcc) {
    if (
      this.irfqViewModel.rfqStatusId === this.STATUS_VALID ||
      this.irfqViewModel.rfqStatusId === this.STATUS_TO_VALIDATE ||
      this.irfqViewModel.rfqStatusId === this.STATUS_IN_PROCESS ||
      this.irfqViewModel.rfqStatusId === this.STATUS_PARTIALY_VALID ||
      this.irfqViewModel.rfqStatusId === this.STATUS_CLOSED ||
      this.irfqViewModel.rfqStatusId === this.STATUS_NOTIFIED ||
      this.irfqViewModel.rfqStatusId === this.STATUS_SUGGESTION) {
      this.selectLocation(tcc, 1)
    }
    else {
      this.selectLocation(tcc, 3)
    }
  }
  selectLocation(tcc, maxLocation) {
    if (this.requestQuoteService.getSelectedSuppliersCount() > 0) {
      return false;
    }
    let stcList = this.selectedTerritoryCode;
    if (this.isTerritoryClassificationCodeSelected(tcc)) {
      if (stcList.length == 1) {
        this.toastr.warning("At least one Manufacturing location need to be selected.");
        return false;
      }
      this.selectedTerritoryCode = stcList.filter(value => { return value != tcc; })
      const tcId = [];
      this.selectedTerritoryCode.forEach(ele => {
        this.territoryClassificationList.forEach(territoryClassification => {
          if (territoryClassification.territoryClassificationCode == ele) {
            tcId.push(territoryClassification.territoryClassificationId);
          }
        });
      });
      this.rfqDetailForm.patchValue({ preferredMfgLocationIds: tcId });
      return;
    }
    if (stcList.length == maxLocation) {
      this.toastr.warning("You already selected to maximum location");
      return false;
    }
    this.selectedTerritoryCode.push(tcc);
    const tcId = [];
    this.selectedTerritoryCode.forEach(ele => {
      this.territoryClassificationList.forEach(territoryClassification => {
        if (territoryClassification.territoryClassificationCode == ele) {
          tcId.push(territoryClassification.territoryClassificationId);
        }
      });
    });
    this.rfqDetailForm.patchValue({ preferredMfgLocationIds: tcId });
  }
  isTerritoryClassificationCodeSelected(tcc) {
    return this.selectedTerritoryCode.indexOf(tcc) > -1;
  }
  makeRfqPurposeOtherCommentEMpty() {
    this.rfqDetailForm.patchValue({ rfqPurposeOtherComment: "" });
  }
  getGivenFieldValue(fieldName) {
    return this.rfqDetailForm.controls[fieldName]['value'];
  }
  isRFQDetailFieldValid(fieldName) {
    return this.requestQuoteService.validateRFQSectionsFormFields(this.rfqDetailForm, fieldName);
  }
  hideAllowePartialPartQuoting() {
    return this.requestQuoteService.hideAllowePartialPartQuoting()
  }

  /////////////////////
  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }
  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }
  viewRfqNdaFile(fileName: string) {
    this.requestQuoteService.getS3FileDownload(fileName).subscribe(response => { });
  }
  togglePurposeSection() {
    this.rfqDetailForm.patchValue({ rfqPurpose: "" });
    this.makeRfqPurposeOtherCommentEMpty()
  }
}
