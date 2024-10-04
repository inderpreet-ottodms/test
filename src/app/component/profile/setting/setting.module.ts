import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import {SharedModule} from '../../../shared/shared.module';
import { ProcessAndMatherialComponent } from './quote-settings/process-and-matherial/process-and-matherial.component';
import { CostsAndShippingComponent } from './quote-settings/costs-and-shipping/costs-and-shipping.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    FileUploadModule,
    SharedModule,
    ConfirmDialogModule,
    RfqWarningBannerModule
  ],
  declarations: [SettingComponent, ProcessAndMatherialComponent, CostsAndShippingComponent]
})
export class SettingModule { }
