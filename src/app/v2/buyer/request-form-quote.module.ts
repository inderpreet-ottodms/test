
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RequestFormQuoteRoutingModule } from './request-form-quote.routing.module';
import { RequestFormQuoteComponent } from './request-form-quote.component';
import { RFQAdditionalInfoSectionComponent } from './rfq-additional-info-section/rfq-additional-info-section.component';
import { RFQPartSectionComponent } from './rfq-part-section/rfq-part-section.component';
import { RFQShippingSectionComponent } from './rfq-shipping-section/rfq-shipping-section.component';
import { RFQDetailSectionComponent } from './rfq-detail-section/rfq-detail-section.component';
import { RFQAddedPartSectionComponent } from './rfq-added-part-section/rfq-added-part-section.component';
import { RequestQuoteService } from './request-form-quote.service';
import { InlineErrorDisplayComponent } from '../shared/inline-error-display.component';
import { CalendarModule } from 'primeng/calendar';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NoScrollDirective } from '../directive/no.scroll.directive';
import { AutocompleteOffDirective } from '../directive/autocomplete-off.directive';
@NgModule({
    imports: [
        RequestFormQuoteRoutingModule,
        AngularMultiSelectModule,
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        NgbTooltipModule
    ],
    exports:[NoScrollDirective, AutocompleteOffDirective],
    declarations: [
        RequestFormQuoteComponent, RFQAdditionalInfoSectionComponent,
        RFQPartSectionComponent, RFQShippingSectionComponent,
        RFQDetailSectionComponent, RFQAddedPartSectionComponent,
        InlineErrorDisplayComponent,NoScrollDirective, AutocompleteOffDirective
    ],
    providers: [RequestQuoteService]
})
export class RequestFormQuoteModule { }