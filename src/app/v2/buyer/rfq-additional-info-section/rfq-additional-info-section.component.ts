import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RFQBaseComponent } from '../rfq-base.component ';
import { RequestQuoteService } from '../request-form-quote.service';
import { CustomValidatorService } from '../../../../app/core/services/validator/custom-validator.service';
import { AppUtil } from '../../../../app/app.util';
@Component({
  selector: 'rfq-additional-info-section',
  templateUrl: 'rfq-additional-info-section.component.html',
  styleUrls: ['rfq-additional-info-section.component.scss', '../rfq-common.scss']
})
export class RFQAdditionalInfoSectionComponent extends RFQBaseComponent implements OnInit {

  rfqAdditionalInfoForm: FormGroup;
  isInitialized: boolean = false;
  dataLoaded = false;
  private dragAreaClass: string;
  private mgAttachment: any = null;
  private showMFGNDAMessageSection: boolean = false;
   
  private manufacturerContactsList: any = [];
  private paymentTermList: any = [];
  private specialCertificateList = [];
  private selectedItems = [];
  private dropdownSettings = {};

  constructor(private formBuilder: FormBuilder,
    private requestQuoteService: RequestQuoteService,
    private customValidatorsService: CustomValidatorService) {
    super();
  }
  ngOnInit(): void {
    if (this.requestQuoteService.getCurrentRFQData().rfqId > 0) {
      this.initialize();
    }
  }
  ngOnDestroy(): void {
  }
  initialize() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.dragAreaClass = "dragarea";
      this.requestQuoteService.showAPIRunningLoader();
      this.requestQuoteService.loadSpecialCertificateListData().subscribe(specialCertificateList => {
        this.paymentTermList = this.requestQuoteService.getPaymentTermList();
        const rfqAdditionalInfoData = this.requestQuoteService.getAdditionalSectionData();
        console.log("rfqAdditionalInfoData",rfqAdditionalInfoData)
        let existingCertificateIdList = rfqAdditionalInfoData.certificateIdList;
        if (AppUtil.isEmptyList(existingCertificateIdList)) {
          existingCertificateIdList = [];
        }
        let certificateIdList = [];
        this.createCertificateSettings();
        let scl = [];
        specialCertificateList.forEach(ele => {
          let obj = { id: ele.certificateId, itemName: ele.certificateCode };
          scl.push(obj);
          if (existingCertificateIdList.indexOf(ele.certificateId) > -1) {
            certificateIdList.push(obj)
          }
        });
        this.specialCertificateList = scl
        rfqAdditionalInfoData.certificateIdList = certificateIdList;
        this.rfqAdditionalInfoForm = this.formBuilder.group({
          manufacturersGeneralAttachment: [],//for ui only
          payment_term_id: [rfqAdditionalInfoData.payment_term_id, Validators.required],
          withOrderManagement: [rfqAdditionalInfoData.withOrderManagement],
          isMFGPay: [rfqAdditionalInfoData.isMFGPay, Validators.required],

          IsSpecialCertificationsByManufacturer: [rfqAdditionalInfoData.IsSpecialCertificationsByManufacturer],//true if certifcate id list count selected
          certificateIdList: [rfqAdditionalInfoData.certificateIdList],//selected certifcate 

          IsSpecialInstructionToManufacturer: [rfqAdditionalInfoData.IsSpecialInstructionToManufacturer],
          SpecialInstructionToManufacturer: [rfqAdditionalInfoData.specialInstructionToManufacturer],

          isRegisterSupplierQuoteTheRfq: [rfqAdditionalInfoData.isRegisterSupplierQuoteTheRfq, Validators.required],
          rfqGeneralAttachmentsList: [rfqAdditionalInfoData.rfqGeneralAttachmentsList],
          selectedSuppliers:[rfqAdditionalInfoData.selectedSuppliers]
        });
        this.dataLoaded = true;
        this.scrollPageToTop();
        this.requestQuoteService.hideAPIRunningLoader();
      });
    }
  }

  paymentTermRadioClicked(paymentTerm) {
    this.rfqAdditionalInfoForm.controls.payment_term_id.setValue(paymentTerm.id);
  }
  saveFiles(files) {
    let rfqGeneralAttachmentsList = this.rfqAdditionalInfoForm.value.rfqGeneralAttachmentsList;
    if (AppUtil.isEmptyList(rfqGeneralAttachmentsList)) {
      rfqGeneralAttachmentsList = [];
    }
    for (let count = 0; count < files.length; count++) {
      this.requestQuoteService.uploadAdditionalInfoFiles(files[count]).subscribe(fileName => {
        if (fileName)
          rfqGeneralAttachmentsList.push(fileName);
      });
      this.rfqAdditionalInfoForm.patchValue({ rfqGeneralAttachmentsList: rfqGeneralAttachmentsList });
    }
    this.rfqAdditionalInfoForm.patchValue({ manufacturersGeneralAttachment: "" });
  }
  removeFile(fileName) {
    let rfqGeneralAttachmentsList = this.rfqAdditionalInfoForm.value.rfqGeneralAttachmentsList;
    if (AppUtil.isEmptyList(rfqGeneralAttachmentsList)) {
      rfqGeneralAttachmentsList = [];
    }
    this.requestQuoteService.removeAdditionalInfoFile(fileName).subscribe(success => {
      if (success) {
        rfqGeneralAttachmentsList = rfqGeneralAttachmentsList.filter(fName => { return fName != fileName })
        this.rfqAdditionalInfoForm.patchValue({ rfqGeneralAttachmentsList: rfqGeneralAttachmentsList });
      }
    });
    rfqGeneralAttachmentsList = rfqGeneralAttachmentsList.filter(fName => { return fName != fileName })
    this.rfqAdditionalInfoForm.patchValue({ rfqGeneralAttachmentsList: rfqGeneralAttachmentsList });
  }
  isAdditionalInfoValid(field: string) {
    return this.customValidatorsService.isFieldValid(this.rfqAdditionalInfoForm, field);
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
  createCertificateSettings() {
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Certificates',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
  }
  deleteSelectedSuppliers(supplier){
   let selectedSuppliers= this.rfqAdditionalInfoForm.value.selectedSuppliers;
   if(selectedSuppliers.length==1){
    this.requestQuoteService.showTosterWarningMessage("At least one manufacturing location required");
    return; 
  }
    let preferredMfgLocationIds={};
    let remainingSelectedSuppliers=[]
    selectedSuppliers.forEach(ele=>{
      if(ele.companyId!==supplier.companyId){
        preferredMfgLocationIds[ele.territoryId]=true;
        remainingSelectedSuppliers.push(ele);
      }
  });
    this.requestQuoteService.updatePreferredMfgLocationIds(Object.keys(preferredMfgLocationIds));
    this.rfqAdditionalInfoForm.patchValue({selectedSuppliers:remainingSelectedSuppliers});
    
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
