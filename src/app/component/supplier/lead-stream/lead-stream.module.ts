import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { LeadStreamRoutingModule } from './lead-stream-routing.module';
import { LeadStreamComponent } from './lead-stream.component';
import { BuyerViewProfileModule } from '../../buyer/component/buyer-view-profile/buyer-view-profile.module';
import { CalendarModule } from 'primeng/calendar';
import {FileUploadModule} from 'ng2-file-upload';
import { LeadMessageViewComponent } from '../lead-message-view/lead-message-view.component';
import { EditorModule } from 'primeng/editor';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    LeadStreamRoutingModule,
    SharedModule,
    BuyerViewProfileModule,
    CalendarModule,
    FileUploadModule,
    MessageSendDrawerModule
  ],
  declarations: [LeadStreamComponent, LeadMessageViewComponent],
  exports: [ LeadMessageViewComponent]
})
export class LeadStreamModule { }
