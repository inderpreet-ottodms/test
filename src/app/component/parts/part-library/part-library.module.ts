import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartLibraryRoutingModule } from './part-library-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { PartLibraryComponent } from './part-library.component';
import { EditPartDrawerComponent } from '../../buyer/component/edit-part-drawer/edit-part-drawer.component';
import { PartListComponent } from './component/part-list/part-list.component';
import {FileUploadModule} from 'ng2-file-upload';
import { CalendarModule } from 'primeng/calendar';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { RfqPartQuestionsModule } from '../../rfq-part-questions/rfq-part-questions.module';
@NgModule({
  imports: [
    CommonModule,
    PartLibraryRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    FileUploadModule,
    CalendarModule,
    RfqWarningBannerModule,
    RfqPartQuestionsModule
  ],
  declarations: [PartLibraryComponent, EditPartDrawerComponent, PartListComponent]
})
export class PartLibraryModule { }
