import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileUploadModule} from 'ng2-file-upload';
import { CalendarModule } from 'primeng/calendar';
import { ProfileRoutingModule } from './profile-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ProfileComponent } from './profile.component';
import { BuyerProfileComponent } from './components/buyer-profile/buyer-profile.component';
import { BuyerMailingComponent } from './components/buyer-mailing/buyer-mailing.component';
import { BuyerShippingComponent } from './components/buyer-shipping/buyer-shipping.component';
import { BuyerRaitingComponent } from './components/buyer-raiting/buyer-raiting.component';
import { BuyerAboutUsComponent } from './components/buyer-about-us/buyer-about-us.component';
import { EditBuyerAboutUsComponent } from './components/edit-buyer-about-us/edit-buyer-about-us.component';
import { EditHeaderComponent } from './components/edit-header/edit-header.component';
import { EditBuyerProfileComponent } from './components/edit-buyer-profile/edit-buyer-profile.component';
import { EditBuyerMailingComponent } from './components/edit-buyer-mailing/edit-buyer-mailing.component';
import { EditBuyerShippingComponent } from './components/edit-buyer-shipping/edit-buyer-shipping.component';
import { EditBuyerContactUsComponent } from './components/edit-buyer-contact-us/edit-buyer-contact-us.component';
import { BuyerContactUsComponent } from './components/buyer-contact-us/buyer-contact-us.component';
import { BuyerRaitingReplyComponent } from './components/buyer-raiting-reply/buyer-raiting-reply.component';

import { FusionChartsModule } from 'angular-fusioncharts';
// Import FusionCharts library
import * as FusionCharts from 'fusioncharts';
import { ChartsModule } from 'ng2-charts';
// Load FusionCharts Individual Charts
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { EditorModule } from 'primeng/editor';
import { EditBuyerPersonalInformationComponent } from './components/edit-buyer-personal-information/edit-buyer-personal-information.component';
// Use fcRoot function to inject FusionCharts library, and the modules you want to use
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);
@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    FileUploadModule,
    ConfirmDialogModule,
    CalendarModule,
    FusionChartsModule,
    ChartsModule,
    EditorModule,
    RfqWarningBannerModule,
  ],
  declarations: [ProfileComponent, BuyerProfileComponent, BuyerMailingComponent, BuyerShippingComponent, BuyerRaitingComponent,
    EditHeaderComponent, BuyerAboutUsComponent, EditBuyerAboutUsComponent, EditBuyerMailingComponent,
    EditBuyerShippingComponent, EditBuyerProfileComponent, EditBuyerContactUsComponent, BuyerContactUsComponent, BuyerRaitingReplyComponent, EditBuyerPersonalInformationComponent]
})
export class ProfileModule { }
