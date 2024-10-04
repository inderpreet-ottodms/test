import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRfqRoutingModule } from './edit-rfq-routing.module';
import { EditRfqComponent } from './edit-rfq.component';
import {SharedModule} from '../../../shared/shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import { CalendarModule } from 'primeng/calendar';
import {SelectModule} from 'ng-select';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { RfqPartQuestionsModule } from '../../rfq-part-questions/rfq-part-questions.module';
import { DragulaModule } from 'ng2-dragula';
@NgModule({
  imports: [
    CommonModule,
    EditRfqRoutingModule,
    SharedModule,
    FileUploadModule,
    CalendarModule,
    ConfirmDialogModule,
    SelectModule,
    RfqWarningBannerModule,
    RfqPartQuestionsModule,
    DragulaModule.forRoot()
  ],
  declarations: [EditRfqComponent]
})
export class EditRfqModule { }
