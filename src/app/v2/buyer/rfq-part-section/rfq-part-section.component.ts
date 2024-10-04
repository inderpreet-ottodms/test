import { Component, ElementRef, AfterViewInit, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RFQBaseComponent } from '../rfq-base.component ';
import { RequestQuoteService } from '../request-form-quote.service';
import { Subscription } from 'rxjs';
import { AppUtil } from '../../../../app/app.util';

@Component({
  selector: 'rfq-part-section',
  templateUrl: 'rfq-part-section.component.html',
  styleUrls: ['rfq-part-section.component.scss', '../rfq-common.scss']
})
export class RFQPartSectionComponent extends RFQBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('rfqDetailDeliveryDeadllineInput', { static: true }) rfqDetailDeliveryDeadllineInput: ElementRef;
  rfqPartForm: FormGroup;
  isInitialized: boolean = false;

  private rfqServiceDataSubscription: Subscription;
  private selectedParentPartCategoryId = 0;
  private uploadedFileNameList = [];
  private techniqueList = [];
  private materialList = [];
  private postProductionProcessList: any = []
  private drawerParentPartCategoryIdList: any = [];

  private rfqPartFile: string = '';
  private showAddFromPartLibrary: boolean = false;
  private disableEditCloneDelete: boolean = false;
  private showQuestionsOnPartDrawer: boolean = false;
  private manufacturingProcessList: any = [];
  private quantityUnitList: any = [];
  private irfqViewModel: any;
  private dragAreaClass: string;

  private disabledDropDownFieldNames = ['childPartCategoryId', 'materialId', 'postProductionProcessId'];

  constructor(private formBuilder: FormBuilder, private requestQuoteService: RequestQuoteService) {
    super();
    this.rfqServiceDataSubscription = this.requestQuoteService.rfqsPartData$.subscribe((rfqServiceData) => {
      if (rfqServiceData) {
        if (rfqServiceData["RESET_ADD_NEW_PART"]) {
          this.addNewPart();
        }
        if (AppUtil.isNotEmptyString(rfqServiceData["EDIT_EXISTING_PART"])) {
          this.editExistingPart(rfqServiceData["partData"]);
        }
      }
      this.initFormData();
    });
  }
  ngOnInit(): void {
    this.initialize()
  }

  initialize() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.dragAreaClass = "dragarea";
      this.requestQuoteService.showAPIRunningLoader();
      this.requestQuoteService.getAllProcessesV2().subscribe(manufacturingProcess => {
        this.manufacturingProcessList = manufacturingProcess.manufacturingProcessList;
        this.requestQuoteService.getQuantityUnitList().subscribe(quantityUnitList => {
          this.selectedParentPartCategoryId = manufacturingProcess.parentPartCategoryId;
          this.drawerParentPartCategoryIdList = manufacturingProcess.drawerParentPartCategoryIdList;
          this.quantityUnitList = quantityUnitList;
          this.addNewPart();
          this.requestQuoteService.loadRfqCount().subscribe(success => {
            this.showAddFromPartLibrary = success;
          });
          this.requestQuoteService.hideAPIRunningLoader();
        });
      });
    }
    else {
      this.initFormData();
    }
  }

  initFormData() {
    this.rfqPartForm = this.formBuilder.group({
      rfqPartFile: [""],
      rfqPartId: [0],
      partId: [0],
      rfqId: [0],
      partFile: [""],
      partName: ["", [Validators.required, this.noWhitespaceValidator]],
      partNumber: ["", [Validators.required, this.noWhitespaceValidator]],
      firstQuantity: ["", [Validators.required, Validators.min(1)]],
      secondQuantity: [""],
      thirdQuantity: [""],
      partQtyUnitId: [],
      parentPartCategoryId: [this.selectedParentPartCategoryId, Validators.min(1)],
      childPartCategoryId: [0],
      materialId: [0, Validators.min(1)],
      postProductionProcessId: [0],
      partDescription: [""],
      IsChildSameAsParent: [],
      disabledChildPartCategoryId: [],
      rfqPartDrawerAnswer: [""],
    });
  }

  addNewPart() {
    this.disableEditCloneDelete = false;
    this.showQuestionsOnPartDrawer = false;
    this.initFormData();
    this.uploadedFileNameList = [];
    this.rfqPartFile = '';
    this.requestQuoteService.removeUploadedPartFiles();
    this.requestQuoteService.showAPIRunningLoader();
    this.techniqueList = this.requestQuoteService.getTechniqueByParentDisciplineId(this.selectedParentPartCategoryId);
    this.requestQuoteService.
      loadPPPProcessAndMaterialByPDId(this.selectedParentPartCategoryId).subscribe(success => {
        this.materialList = success.materialList;
        this.postProductionProcessList = success.postProductionProcessList;
        let materialId = 0;
        if (this.materialList.length == 1) {
          materialId = this.materialList[0]["childMaterialId"];
        }
        let techniqueId = 0;
        let patchingvalue = {
          rfqPartId: 0,
          partId: 0,
          rfqId: 0,
          parentPartCategoryId: this.selectedParentPartCategoryId,
          childPartCategoryId: techniqueId,
          materialId: materialId,
          postProductionProcessId: 0,
          partQtyUnitId: this.PART_QTY_UNIT_DEFAULT_ID.pieces,
          IsChildSameAsParent: false,
          disabledChildPartCategoryId: 0
        }

        if (this.techniqueList.length == 1) {
          techniqueId = this.techniqueList[0]["childDisciplineId"];
          patchingvalue["IsChildSameAsParent"] = true;
          patchingvalue["childPartCategoryId"] = techniqueId;
          patchingvalue["disabledChildPartCategoryId"] = techniqueId;
        }
        this.rfqPartForm?.patchValue(patchingvalue);
        this.rfqPartForm?.controls.childPartCategoryId.disable();
        this.scrollPageToTop();
        this.requestQuoteService.hideAPIRunningLoader();
      });
  }
  editExistingPart(partObj) {
    this.disableEditCloneDelete = true;
    partObj = JSON.parse(JSON.stringify(partObj));
    this.initFormData();
    this.rfqPartForm.controls.childPartCategoryId.enable();
    this.requestQuoteService.removeUploadedPartFiles();
    this.requestQuoteService.addUploadedPartFiles(partObj.partsFiles);
    this.uploadedFileNameList = partObj.partsFiles;
    this.rfqPartFile = partObj.rfqPartFile;
    let parentPartCategoryId = partObj.parentPartCategoryId;
    if (AppUtil.isEmptyString(parentPartCategoryId) || parentPartCategoryId === 0) {
      //this if will help to set data when only file will be uploaded frm dashboard
      parentPartCategoryId = this.selectedParentPartCategoryId;
      partObj.parentPartCategoryId = parentPartCategoryId;
      partObj.materialId = 0;
    }
    this.requestQuoteService.showAPIRunningLoader();
    this.requestQuoteService.
      loadPPPProcessAndMaterialByPDId(parentPartCategoryId).subscribe(success =>
         {
        this.techniqueList = this.requestQuoteService.getTechniqueByParentDisciplineId(parentPartCategoryId);
        this.materialList = success.materialList;
        this.postProductionProcessList = success.postProductionProcessList;
        const patchValue = {
          rfqPartFile: partObj.rfqPartFile,
          rfqPartId: partObj.rfqPartId,
          partId: partObj.partId,
          rfqId: partObj.rfqId,
          partFile: [],
          partName: partObj.partName,
          partNumber: partObj.partNumber,
          partQtyUnitId: partObj.partQtyUnitId,
          parentPartCategoryId: partObj.parentPartCategoryId,
          childPartCategoryId: partObj.childPartCategoryId,
          materialId: parseInt(partObj.materialId.toString()),
          postProductionProcessId: partObj.postProductionProcessId,
          partDescription: partObj.partDescription,
          rfqPartDrawerAnswer: partObj.rfqPartDrawerAnswer
        }
        let techniqueId = partObj.childPartCategoryId;
        if (this.techniqueList.length == 1) {
          techniqueId = this.techniqueList[0]["childDisciplineId"];
          patchValue["IsChildSameAsParent"]=true;
          patchValue["childPartCategoryId"]=techniqueId;
          patchValue["disabledChildPartCategoryId"]=techniqueId;
        }
       
        partObj.rfqPartQuantityList.forEach(ele => {
          if (ele.quantityLevel == 0) {
            patchValue["firstQuantity"] = ele.partQty;
          }
          if (ele.quantityLevel == 1) {
            patchValue["secondQuantity"] = ele.partQty;
          }
          if (ele.quantityLevel == 2) {
            patchValue["thirdQuantity"] = ele.partQty;
          }
        });
        if (this.techniqueList.length <= 1) {
          this.rfqPartForm.controls.childPartCategoryId.disable();
        } else {
          this.rfqPartForm.controls.childPartCategoryId.enable();
        }
        this.rfqPartForm.patchValue(patchValue);
        this.showQuestionsOnPartDrawer = this.drawerParentPartCategoryIdList.indexOf(partObj.parentPartCategoryId.toString()) > -1;
        this.scrollPageToTop();
        this.requestQuoteService.hideAPIRunningLoader();
      });

  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.rfqServiceDataSubscription.unsubscribe();
  }

  ///////////////////////////////
  enableDisableTechniqueDropDown(parentPartCategoryId) {
    this.rfqPartForm.controls.childPartCategoryId.enable();
    this.techniqueList = this.requestQuoteService.getTechniqueByParentDisciplineId(parentPartCategoryId);
    let techniqueId = 0;
    if (this.techniqueList.length == 1) {
      techniqueId = this.techniqueList[0]["childDisciplineId"];
      this.rfqPartForm.patchValue({
        "IsChildSameAsParent": true,
        childPartCategoryId: techniqueId,
        disabledChildPartCategoryId: techniqueId
      });
    }
    if (this.techniqueList.length <= 1) {
      this.rfqPartForm.controls.childPartCategoryId.disable();
    }
    if (this.techniqueList.length > 1) {
      this.rfqPartForm.patchValue({
        "IsChildSameAsParent": false,
        disabledChildPartCategoryId: 0
      });
    }
    return techniqueId;
  }
  enableDisableMaterialDropDown(materialList) {
    this.rfqPartForm.controls.materialId.enable();
    let materialId = 0;
    if (materialList.length == 1) {
      materialId = materialList[0]["childMaterialId"];
    }
    if (materialList.length == 0) {
      this.rfqPartForm.controls.materialId.disable();
    }
    return materialId;
  }
  enableDisablePPPDropDown(postProductionProcessIdList) {
    this.rfqPartForm.controls.postProductionProcessId.enable();
    let postProductionProcessId = 0;
    if (postProductionProcessIdList.length == 1) {
      postProductionProcessId = postProductionProcessIdList[0]["postProductionProcessId"];
    }
    if (postProductionProcessIdList.length == 0) {
      this.rfqPartForm.controls.postProductionProcessId.disable();
    }
    return postProductionProcessId;
  }
  manufacturingProcessChangeHandler(parentPartCategoryId) {
    const techniqueId = this.enableDisableTechniqueDropDown(parentPartCategoryId);
    this.requestQuoteService.showAPIRunningLoader();
    this.requestQuoteService.
      loadPPPProcessAndMaterialByPDId(parentPartCategoryId).subscribe(success => {
        this.materialList = success.materialList;
        this.postProductionProcessList = success.postProductionProcessList;
        const materialId = this.enableDisableMaterialDropDown(this.materialList);
        const postProductionProcessId = this.enableDisablePPPDropDown(this.postProductionProcessList);
        const patchingValue = {
          childPartCategoryId: techniqueId,
          materialId: materialId,
          postProductionProcessId: postProductionProcessId
        }
        this.rfqPartForm.patchValue(patchingValue);
        this.requestQuoteService.hideAPIRunningLoader();
      });
    this.showQuestionsOnPartDrawer = this.drawerParentPartCategoryIdList.indexOf(parentPartCategoryId.toString()) > -1;
    let rfqPartDrawerAnswer = "";
    if (this.showQuestionsOnPartDrawer) {
      if (AppUtil.isEmptyString(this.rfqPartForm.value.rfqPartDrawerAnswer)) {
        rfqPartDrawerAnswer = this.MOLDING_REQUIRED_QUESTION_ANSWER.YES;
      }
    } else {
      rfqPartDrawerAnswer = this.MOLDING_REQUIRED_QUESTION_ANSWER.NO;
    }
    this.rfqPartForm.patchValue({ rfqPartDrawerAnswer: this.MOLDING_REQUIRED_QUESTION_ANSWER.YES });

  }
  removeFile(fileName) {
    this.uploadedFileNameList = this.uploadedFileNameList.filter(item => fileName != item);
    this.requestQuoteService.showAPIRunningLoader();
    this.requestQuoteService.removeFromPartFile(fileName, this.rfqPartForm.value.rfqId,
      this.rfqPartForm.value.rfqPartId).subscribe(deleted => {
      });
    this.requestQuoteService.hideAPIRunningLoader();
  }
  saveFiles(files) {
    this.requestQuoteService.uploadPartFiles(files).subscribe(uploadedFileList => {
      //need to see if all file was uploaded
      this.uploadedFileNameList = uploadedFileList;
      this.rfqPartForm.patchValue({ partFile: "" });
    });
  }

  getFormValueByFieldName(fieldName) {
    return this.rfqPartForm.value[fieldName];
  }
  isPartFieldValid(fieldName) {
    return this.requestQuoteService.validateRFQSectionsFormFields(this.rfqPartForm, fieldName);
  }

  /////////////////////
  onFileChange($event: any) {
    let files: FileList = $event.target.files;
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
  openAddFromPartLibrarySection() {
    this.requestQuoteService.sendNotificationToShowOpenAddFromPartLibrarySection();
  }
  partSectionNextPreviousHandler(nextSectionName = null) {
    this.requestQuoteService.validatePartDataSaveUpdateRequestFormComponents(this.rfqPartForm, nextSectionName);
  }
}
