import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerViewProfileComponent } from './buyer-view-profile.component';
import { SharedModule } from '../../../../shared/shared.module';


import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library
import * as FusionCharts from 'fusioncharts';
import { ChartsModule } from 'ng2-charts';
// Load FusionCharts Individual Charts
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { EditorModule } from 'primeng/editor';
import { BuyerFeedbackModelModule } from '../../../buyer-feedback-model/buyer-feedback-model.module';
// Use fcRoot function to inject FusionCharts library, and the modules you want to use
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);
@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    SharedModule,
    FusionChartsModule,
    ChartsModule,
    BuyerFeedbackModelModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [BuyerViewProfileComponent],
  exports: [BuyerViewProfileComponent]
})
export class BuyerViewProfileModule { }
