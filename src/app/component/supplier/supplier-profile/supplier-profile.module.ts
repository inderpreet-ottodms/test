import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import { CalendarModule } from 'primeng/calendar';
import {SelectModule} from 'ng-select';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { SupplierProfileRoutingModule } from './supplier-profile-routing.module';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CapabilitiesComponent } from './components/capabilities/capabilities.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { RaitingsComponent } from './components/raitings/raitings.component';
import { SupplierProfileComponent } from './supplier-profile.component';
import { EditAboutUsComponent } from './components/edit-about-us/edit-about-us.component';
import { EditCapabilitiesComponent } from './components/edit-capabilities/edit-capabilities.component';
import { EditContactUsComponent } from './components/edit-contact-us/edit-contact-us.component';
import { EditHeaderComponent } from './components/edit-header/edit-header.component';
import { RatingReplyComponent } from './components/rating-reply/rating-reply.component';
import { FusionChartsModule } from 'angular-fusioncharts';
// Import FusionCharts library
import * as FusionCharts from 'fusioncharts';

// Load FusionCharts Individual Charts
import * as Charts from 'fusioncharts/fusioncharts.charts';
import {EditorModule} from 'primeng/editor';
// import { DragulaModule } from 'ng2-dragula';
import { AutoScrollDirective } from './auto-scroll.directive';
import { DragulaModule } from 'ng2-dragula';
// Use fcRoot function to inject FusionCharts library, and the modules you want to use
FusionChartsModule.fcRoot(FusionCharts, Charts);

@NgModule({
  imports: [
    CommonModule,
    SupplierProfileRoutingModule,
    SharedModule,
    FileUploadModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    SelectModule,
    FusionChartsModule,
    EditorModule,
    DragulaModule.forRoot()
  ],
  declarations: [SupplierProfileComponent, AboutUsComponent, CapabilitiesComponent, ContactUsComponent, RaitingsComponent,
     EditAboutUsComponent, EditHeaderComponent,
     EditCapabilitiesComponent,
     EditContactUsComponent,
     RatingReplyComponent,
     AutoScrollDirective
  ]
})
export class SupplierProfileModule { }
