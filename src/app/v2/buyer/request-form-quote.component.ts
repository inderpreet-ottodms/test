import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RFQBaseComponent } from './rfq-base.component ';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestQuoteService } from './request-form-quote.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUtil } from '../../../app/app.util';
import { RFQPartSectionComponent } from './rfq-part-section/rfq-part-section.component';
import { RFQDetailSectionComponent } from './rfq-detail-section/rfq-detail-section.component';
import { RFQShippingSectionComponent } from './rfq-shipping-section/rfq-shipping-section.component';
import { RFQAdditionalInfoSectionComponent } from './rfq-additional-info-section/rfq-additional-info-section.component';
import { ProductAnalyticService } from '../../../app/shared/product-analytic/product-analytic';

@Component({
  selector: 'request-form-quote',
  templateUrl: 'request-form-quote.component.html',
  styleUrls: ['request-form-quote.component.scss', 'rfq-common.scss']
})

export class RequestFormQuoteComponent extends RFQBaseComponent implements OnInit, OnDestroy {
  encruptedEditRfqId;
  navigationManual = true;
  destroyedModelReference: any;
  showPageDataLoding: string = "hide";
  partLibraryOpened = false;
  @ViewChild('destroyedModel', { static: true }) rfqDestroyedModel: TemplateRef<any>;
  editRfqId: number;
  currentSectionName: string;
  lastEmittedData: any;
  rfqServiceDataSubscription: Subscription;
  autoSaveDraftCompleted = false
  submitEvent = false
  @ViewChild('rfqPartSectionComponentRef') rfqPartSectionComponentRef: RFQPartSectionComponent;
  @ViewChild('rfqDetailRef') rfqDetailRef: RFQDetailSectionComponent;
  @ViewChild('rfqShippingSectionfoRef') rfqShippingSectionComponentRef: RFQShippingSectionComponent;
  @ViewChild('rfqAdditionalInfoRef') rfqAdditionalInfoSectionComponentRef: RFQAdditionalInfoSectionComponent;
  constructor(private activatedRoute: ActivatedRoute,
    private productAnalyticService: ProductAnalyticService,
    private modalService: NgbModal,
    private requestQuoteService: RequestQuoteService, private router: Router) {
    super();
    this.currentSectionName = this.RFQ_PS;
    this.rfqServiceDataSubscription = this.requestQuoteService.rfqServiceData$.subscribe((rfqComponentData) => {
      if (rfqComponentData) {
        this.requestFormComponentsDataHandler(rfqComponentData);
      }
    });
  }
  ngOnInit(): void {  
   this.requestQuoteService.getBuyerRFQCount()
    .subscribe(
      buyerRfqResult => {
        if(buyerRfqResult.success){
          let buyerRfQCountResult = buyerRfqResult.currentBuyerRfqsCount;
          this.productAnalyticService.initializPendo(this.productAnalyticService.EDIT_RFQ, undefined, undefined, buyerRfQCountResult.myRFQCount);
        }else{
          console.log('buyerRfQCountResult fetch faild, pendo initilized without that value');
          this.productAnalyticService.initializPendo(this.productAnalyticService.EDIT_RFQ);
        }
        });
    this.editRfqId = 0;
    this.navigationManual = true;
    this.submitEvent = false;
    this.autoSaveDraftCompleted = false;
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.requestQuoteService.resetCurrentRFQData();
      const enCryptRFQID = params['rfqId'];
      const enCrypSelectedSuppliers = params['suppliers'];
      if (AppUtil.isNotEmptyString(enCryptRFQID)) {
        this.encruptedEditRfqId = enCryptRFQID
        let idRfq = AppUtil.decrypt(enCryptRFQID);
        this.editRfqId = parseInt(idRfq);
        this.requestQuoteService.loadRFQDataToAndEdit(this.editRfqId).subscribe(() => {
          this.reInitializeComponents()
        });
      }
      else {
        if (AppUtil.isNotEmptyString(enCrypSelectedSuppliers)) {
          const data=JSON.parse(AppUtil.decrypt(enCrypSelectedSuppliers).toString());
          this.requestQuoteService.setSelectedSuppliers(data);
        }
        this.reInitializeComponents()
        this.switchAccordionSectionOld(this.RFQ_PS);
      }
    });
    this.requestQuoteService.loadCountryData().subscribe(loaded => { });
  }

  reInitializeComponents() {
    if (this.rfqPartSectionComponentRef) {
      this.rfqPartSectionComponentRef.isInitialized = false;
      this.rfqPartSectionComponentRef.initialize()
    }
    if (this.rfqDetailRef) {
      this.rfqDetailRef.isInitialized = false
      this.rfqDetailRef.initializeForm()
    }
    if (this.rfqShippingSectionComponentRef) {
      this.rfqShippingSectionComponentRef.isInitialized = false;
      this.rfqShippingSectionComponentRef.initialize()
    }
    if (this.rfqAdditionalInfoSectionComponentRef) {
      this.rfqAdditionalInfoSectionComponentRef.isInitialized = false;
      this.rfqAdditionalInfoSectionComponentRef.initialize()
    }
  }

  getRFQPartsCount() {
    return this.requestQuoteService.getRFQPartsCount();
  }
  stayToCurrentPage() {
    this.navigationManual = true;
    this.destroyedModelReference.close();
    this.destroyedModelReference = null;
    this.showPageDataLoding = 'hide';
  }
  autoSaveAsDraft() {
    this.autoSaveDraftCompleted = true
    this.navigationManual = true;
    this.destroyedModelReference.close();
    this.destroyedModelReference = null;
    this.requestQuoteService.saveAsDraftRequestFormComponents(
      this.rfqPartSectionComponentRef.rfqPartForm, this.rfqDetailRef.rfqDetailForm,
       this.rfqShippingSectionComponentRef.shippingFormData,
       this.rfqAdditionalInfoSectionComponentRef.rfqAdditionalInfoForm,
       this.rfqShippingSectionComponentRef.shippingFormData, ).
       subscribe(result=>{
        if(result){
          // Handle error in future for save draft
        }
        this.autoSaveDraftCompleted = true
        this.router.navigateByUrl(this.nextUrl, { replaceUrl: true }).then(() => {
          window.location.reload();
        });
       });
  }

  requestFormComponentsDataHandler(requestFormComponentsData) {
    if (AppUtil.isNotEmptyString(requestFormComponentsData.rfqId)) {
      this.editRfqId = requestFormComponentsData.rfqId;
      return;
    }
    if (AppUtil.isNotEmptyList(requestFormComponentsData.preferredMfgLocationIds)) {
      let temp=[];
      requestFormComponentsData.preferredMfgLocationIds.forEach(id=>{
        temp.push(parseInt(id));
      })
      this.rfqDetailRef.updateSelectedTerritoryCode(temp);
      return;
    }
    if (AppUtil.isNotEmptyString(requestFormComponentsData.openAddFromPartLibrarySection)) {
      this.partLibraryOpened = true;
      return;
    }

    if (AppUtil.isNotEmptyString(requestFormComponentsData.closeAddFromPartLibrarySection)) {
      this.partLibraryOpened = false;
      return;
    }

    if (AppUtil.isNotEmptyString(requestFormComponentsData.moveToNextSection)) {
      this.switchAccordionSectionOld(requestFormComponentsData.moveToNextSection);
      return;
    }
    if (!requestFormComponentsData.showPageDataLoding) {
      if (this.showPageDataLoding === 'show') {
        this.showPageDataLoding = 'hide';
      } else {
        this.showPageDataLoding = 'show'
      }
      return
    }
    this.showPageDataLoding = requestFormComponentsData.showPageDataLoding
  }
  saveRFQAsDraft() {
    this.router.navigateByUrl("rfq/draftrfqs");
  }

  submitRFQ() {
    this.submitEvent = true;
    this.navigationManual = true;
    this.requestQuoteService.
      validateAndSaveAdditionalSectionData(this.rfqAdditionalInfoSectionComponentRef.rfqAdditionalInfoForm,
        this.RFQ_STATUS_CODE.SUBMITTED, null);
  }


  ngOnDestroy(): void {
    this.switchAccordionSectionOld(this.RFQ_PS);
    this.requestQuoteService.resetCurrentRFQData();
    this.rfqServiceDataSubscription.unsubscribe();
  }

  nextUrl = ""

  destroy(nextUrl, currentUrl) {
    const nextURLIsRFQEdit = nextUrl.indexOf("rfq/buyer?rfqId=") > -1
    const nextURLIsNewRFQ = nextUrl.indexOf("rfq/buyer") > -1
    let shouldShowDraftPopup = (currentUrl !== nextUrl) && !nextURLIsRFQEdit && !nextURLIsNewRFQ && ((this.editRfqId && this.editRfqId > 0) ||
    !(AppUtil.isEmptyList(this.requestQuoteService.getUploadedPartsFiles())
      && AppUtil.isEmptyString(this.rfqPartSectionComponentRef.rfqPartForm.value.rfqPartFile)))
    if (shouldShowDraftPopup && !this.autoSaveDraftCompleted && !this.submitEvent && !this.destroyedModelReference) {
        this.encruptedEditRfqId = null;
        this.navigationManual = false;
        this.nextUrl = nextUrl;
        this.encruptedEditRfqId = AppUtil.encrypt(this.editRfqId);
        this.destroyedModelReference = this.modalService.open(this.rfqDestroyedModel,
          { backdrop: 'static' }
        );
    }
    return this.navigationManual;
  }

  switchAccordionSectionOld(requiredSectionName) {
    if (requiredSectionName === this.currentSectionName) {
      return;
    }
    if (requiredSectionName === this.RFQ_DS) {
      this.rfqDetailRef.initializeForm();
    }
    else if (requiredSectionName == this.RFQ_SS) {
      this.rfqShippingSectionComponentRef.initialize();
    }
    else if (requiredSectionName == this.RFQ_AIS) {
      this.rfqAdditionalInfoSectionComponentRef.initialize();
    }
    const key = "_ACCORDION_DATA";
    this[this.currentSectionName + key]['currentSectionName'] = '';
    this[requiredSectionName + key]['currentSectionName'] = requiredSectionName;
    this.currentSectionName = requiredSectionName;
  }

  switchAccordionSection(requiredSectionDetail) {
    if (this.requestQuoteService.isRFQIdExist()) {
      if (this.rfqPartSectionComponentRef && !this.requestQuoteService.isValidPartSection(this.rfqPartSectionComponentRef.rfqPartForm)) {
        this.requestQuoteService.showTosterWarningMessage("Please create at least one part to continue.");
        return;
      }
      if (requiredSectionDetail.sectionName == this.RFQ_DS) {
        if (this.isRFQDetailSectionValid()) {
          this.switchAccrodion(requiredSectionDetail)
        }
        return;
      } else if (requiredSectionDetail.sectionName == this.RFQ_SS || requiredSectionDetail.sectionName == this.RFQ_AIS) {
        if (this.isRFQDetailSectionValid() && this.isRFQShippingSectionValid()) {
          this.switchAccrodion(requiredSectionDetail)
        }
        return;
      }
      this.switchAccrodion(requiredSectionDetail)
    }
  }

  isRFQDetailSectionValid() {
    return this.rfqDetailRef.rfqDetailForm?.valid && AppUtil.isNotEmptyString(this.rfqDetailRef.rfqDetailForm.value['quotesNeededBy'])
  }

  isRFQShippingSectionValid() {
    return this.rfqShippingSectionComponentRef.shippingFormData.valid && this.rfqShippingSectionComponentRef.shippingFormData.value.shipTo > 0
  }

  switchAccrodion(requiredSectionDetail) {
    const requiredSectionName = requiredSectionDetail.sectionName;
    if (requiredSectionName === this.currentSectionName) {
      return;
    }
    this.currentSectionName = requiredSectionName;
    return;
  }
  partSectionNextPreviousHandler(nextSectionName = null) {
    this.rfqPartSectionComponentRef.partSectionNextPreviousHandler(nextSectionName);
  }
  detailSectionNextPreviousHandler(nextSectionName, previousSection) {
    if (previousSection != null) {
      this.switchAccordionSection({ "sectionName": previousSection });
      return;
    }
    this.rfqDetailRef.validateDates();
    this.requestQuoteService.validateAndSaveDetailSectionData(this.rfqDetailRef.rfqDetailForm, nextSectionName, previousSection);
  }
  updateRFQShippingAddress(nextSectionName, previousSection) {
    if (previousSection != null) {
      this.switchAccordionSection({ "sectionName": previousSection });
      return;
    }
    this.rfqShippingSectionComponentRef.updateRFQShippingAddress(nextSectionName);
  }

  additionalInfoPreviousMover() {
    this.switchAccordionSection({ "sectionName": this.RFQ_SS });
  }
}
