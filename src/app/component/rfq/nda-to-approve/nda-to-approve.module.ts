import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdaToApproveRoutingModule } from './nda-to-approve-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { NdaToApproveComponent } from './nda-to-approve.component';
import { NdaListComponent } from './component/nda-list/nda-list.component';
import { QuoteSupplierProfileComponent } from './component/quote-supplier-profile/quote-supplier-profile.component';
import {FileUploadModule} from 'ng2-file-upload';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
@NgModule({
  imports: [
    CommonModule,
    NdaToApproveRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    FileUploadModule,
    MessageSendDrawerModule,
    RfqWarningBannerModule
  ],
  declarations: [NdaToApproveComponent, NdaListComponent, QuoteSupplierProfileComponent]
})
export class NdaToApproveModule { }
