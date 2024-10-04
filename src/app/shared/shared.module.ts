import {CUSTOM_ELEMENTS_SCHEMA,  NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {  RouterModule} from '@angular/router';
import {  CommonModule} from '@angular/common';
import {  NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {  AccordionAnchorDirective} from './accordion/accordionanchor.directive';
import {  AccordionLinkDirective} from './accordion/accordionlink.directive';
import {  AccordionDirective} from './accordion/accordion.directive';
import {  HttpClientModule,  HttpClient} from '@angular/common/http';
import {  FormsModule,  ReactiveFormsModule} from '@angular/forms';
import {  TranslateModule,  TranslateLoader} from '@ngx-translate/core';
import {  TranslateHttpLoader} from '@ngx-translate/http-loader';
import {  AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {  TitleComponent} from '../layout/admin/title/title.component';
import {  ModalBasicComponent} from './modal-basic/modal-basic.component';
import {  ModalAnimationComponent} from './modal-animation/modal-animation.component';
import {  SpinnerComponent} from './spinner/spinner.component';
import {  FieldErrorDisplayComponent} from '../component/field-error-display/field-error-display.component';
import {  ClickOutsideModule} from 'ng-click-outside';
import {  ShowErrorsComponent} from './reusable-components/error-display.component';
import {  GroupByPipe} from './customPipe/group';
import {  dateFormatPipe} from './customPipe/dateFormat';
import {  NaPipe} from './customPipe/NA';
import {  ZeroPipe} from './customPipe/zero';
import {  DialogModule} from 'primeng/dialog';
import {  NPSColorStates} from './customPipe/npsColorStates';
import {  MiniBuyerProfileComponent} from '../component/buyer/component/mini-buyer-profile/mini-buyer-profile.component';
import {  RfqCountViewerComponent} from '../component/buyer/rfq-count-viewer/rfq-count-viewer.component';
import {  SanitizeHtmlPipe} from './customPipe/safe.pipe';
import {
  DecimalDirective
} from './decimal/decimal.directive';
import {
  DotLimit
} from './customPipe/dotLimit';
import {
  OriginalFileName
} from './customPipe/orginalFileName';
import {
  OriginalFileShortName
} from './customPipe/originalShortFileName';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import {  SanitizeWithoutLimit
} from './customPipe/safewithlimit';
import {  PagetitleQuotebtnComponent} from '../component/supplier/pagetitle-quotebtn/pagetitle-quotebtn.component';
import {  AutofocusDirective
} from './autofocus/autofocus.directive';
import {
  AwsFileName
} from './customPipe/awsFileName';
import {
  SanitizeNolImtHtmlPipe
} from './customPipe/safenolimit';
import {
  RatingModelComponent
} from './rating-model/rating-model.component';
import {
  SafePipe
} from './customPipe/UrlPiep';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import {
  OrderByPipe
} from './customPipe/order-by.pipe';
import {
  CloneRfqModule
} from '../component/buyer/component/clone-rfq/clone-rfq.module';

import {
  PaginationComponent
} from '../component/pagination/pagination.component';

import {
  SupplierRfqDetailSidepanelComponent
} from '../component/buyer/component/common-rfqlist/components/rfq-detail-sidepanel/rfq-detail-sidepanel.component';
import {
  CapabilityComponent
} from '../component/supplier/capability/capability.component';
import {
  NgxGenSelectComponent
} from '../component/ngx-gen-select/ngx-gen-select.component';
import {
  NgxGenSelectPipe
} from '../component/ngx-gen-select/ngx-gen-select-filter.pipe';
import {
  MultiselectRfqsComponent
} from '../component/multiselect-rfqs/multiselect-rfqs.component';
import {
  UpgradeAccountComponent
} from '../component/upgrade-account/upgrade-account.component';
import {
  RfqQuotePdfComponent
} from '../component/supplier/rfq-quote-pdf/rfq-quote-pdf.component';
import {
  BingMapViewerComponent
} from '../component/map-viewer/bing-map-viewer/bing-map-viewer.component';
import {
  SafeMapPipe
} from '../component/map-viewer/bing-map-viewer/SafeMapPipe';
import {
  RemoveDashDirective
} from './remove-dash/remove-dash.directive';
import {
  UserblacklistComponent
} from '../component/userblacklist/userblacklist.component';
import {
  UpgradeAccountBtnComponent
} from '../component/upgrade-account-btn/upgrade-account-btn.component';
import {
  ContactSalesModelComponent
} from '../component/contact-sales-model/contact-sales-model.component';
import {
  RfqCapabilityComponent
} from '../component/rfq-capability/rfq-capability.component';
import {
  InputMaskModule
} from 'primeng/inputmask';
import {
  CalendarModule
} from 'primeng/calendar';
import {
  RfqImageComponent
} from '../component/rfq-image/rfq-image.component';
import {
  ImageCropComponent
} from '../component/image-crop/image-crop.component';
import {
  ImageCropperModule
} from 'ngx-image-cropper';
import {
  FileUploadModule
} from 'ng2-file-upload';
import {
  NdaModelComponent
} from '../component/nda-model/nda-model.component';
import {
  IndustryModelComponent
} from '../component/industry-model/industry-model.component';
import { SessionExpireModelComponent } from '../component/session-expire-model/session-expire-model.component';
import { BuyerFeedbackModelModule } from '../component/buyer-feedback-model/buyer-feedback-model.module';

import { SourceComponent } from './../component/SSO/source/source.component';
import { RfqSourcedTypeComponent } from '../component/buyer/rfq-sourced-type/rfq-sourced-type.component';
import { UpgradeToSilverComponent } from '../component/supplier/supplier-rfq-detail/component/upgrade-to-silver/upgrade-to-silver.component';
import { TermsAndConditionsModelComponent } from './terms-and-conditions-model/terms-and-conditions-model.component';
import { ProductAnalyticService } from './product-analytic/product-analytic';
import { NewMiniBuyerProfileComponent } from '../component/buyer/component/new-mini-buyer-profile/new-mini-buyer-profile.component';
import { NewSupplierRfqDetailSidepanelComponent } from '../component/buyer/component/common-rfqlist/components/new-rfq-detail-sidepanel/new-rfq-detail-sidepanel.component';
import { FullPageOverlayComponent } from './spinner/full.page.overlay.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    PerfectScrollbarModule,
    DialogModule,
    ClickOutsideModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ConfirmDialogModule,
    InputMaskModule,
    AngularMultiSelectModule,
    RouterModule,
    CloneRfqModule,
    CalendarModule,
    ImageCropperModule,
    FileUploadModule,
    BuyerFeedbackModelModule
  ],

  exports: [
    NgbModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    DialogModule,
    AccordionDirective,
    HttpClientModule,
    PerfectScrollbarModule,
    TitleComponent,
    ModalBasicComponent,
    ModalAnimationComponent,
    SpinnerComponent,
    FullPageOverlayComponent,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    FieldErrorDisplayComponent,
    FieldErrorDisplayComponent,
    ShowErrorsComponent,
    GroupByPipe,
    OrderByPipe,
    dateFormatPipe,
    NaPipe,
    NPSColorStates,
    ZeroPipe,
    SafePipe,
    AwsFileName,
    SanitizeNolImtHtmlPipe,
    DotLimit,
    SanitizeWithoutLimit,
    OriginalFileName,
    OriginalFileShortName,
    SanitizeHtmlPipe,
    MiniBuyerProfileComponent,
    NewMiniBuyerProfileComponent,
    RfqCountViewerComponent,
    UserblacklistComponent,
    DecimalDirective,
    PagetitleQuotebtnComponent,
    AutofocusDirective,
    RatingModelComponent,
    TermsAndConditionsModelComponent,
    CloneRfqModule,
    SupplierRfqDetailSidepanelComponent,
    NewSupplierRfqDetailSidepanelComponent,
    PaginationComponent,
    CapabilityComponent,
    NgxGenSelectComponent,
    NgxGenSelectPipe,
    MultiselectRfqsComponent,
    UpgradeAccountComponent,
    RfqQuotePdfComponent,
    BingMapViewerComponent,
    UpgradeAccountBtnComponent,
    ContactSalesModelComponent,
    RfqCapabilityComponent,
    RfqImageComponent,
    ImageCropComponent,
    NdaModelComponent,
    IndustryModelComponent,
    SessionExpireModelComponent,
    RfqSourcedTypeComponent,
    BuyerFeedbackModelModule,
    UpgradeToSilverComponent
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TitleComponent,
    ModalBasicComponent,
    ModalAnimationComponent,
    SpinnerComponent,
    FullPageOverlayComponent,
    FieldErrorDisplayComponent,
    ShowErrorsComponent,
    GroupByPipe,
    dateFormatPipe,
    NaPipe,
    DotLimit,
    AwsFileName,
    SanitizeWithoutLimit,
    NPSColorStates,
    ZeroPipe,
    SafePipe,
    SafeMapPipe,
    SanitizeNolImtHtmlPipe,
    OriginalFileName,
    OriginalFileShortName,
    SanitizeHtmlPipe,
    MiniBuyerProfileComponent,
    NewMiniBuyerProfileComponent,
    RfqCountViewerComponent,
    DecimalDirective,
    PagetitleQuotebtnComponent,
    AutofocusDirective,
    RatingModelComponent,
    OrderByPipe,
    SupplierRfqDetailSidepanelComponent,
    NewSupplierRfqDetailSidepanelComponent,
    PaginationComponent,
    CapabilityComponent,
    NgxGenSelectComponent,
    NgxGenSelectPipe,
    MultiselectRfqsComponent,
    UpgradeAccountComponent,
    RfqQuotePdfComponent,
    BingMapViewerComponent,
    RemoveDashDirective,
    UserblacklistComponent,
    UpgradeAccountBtnComponent,
    ContactSalesModelComponent,
    RfqCapabilityComponent,
    RfqImageComponent,
    ImageCropComponent,
    NdaModelComponent,
    IndustryModelComponent,
    SessionExpireModelComponent,
    
    SourceComponent,
    RfqSourcedTypeComponent,
    UpgradeToSilverComponent,
    TermsAndConditionsModelComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },ProductAnalyticService],
})
export class SharedModule {}
