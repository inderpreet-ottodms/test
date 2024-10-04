import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  SharedModule
} from '../../../../shared/shared.module';
import {
  CommonRfqlistComponent
} from './common-rfqlist.component';
import {
  BuyerViewProfileModule
} from '../buyer-view-profile/buyer-view-profile.module';
import {
  FileUploadModule
} from 'ng2-file-upload';
import { EditorModule } from 'primeng/editor';
import { MessageSendDrawerModule } from '../../../message-send-drawer/message-send-drawer.module';
import { CountdownModule } from '@ciri/ngx-countdown'


@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    SharedModule,
    BuyerViewProfileModule,
    FileUploadModule,
    MessageSendDrawerModule,
    CountdownModule
  ],
  declarations: [
    CommonRfqlistComponent
  ],
  exports: [
    CommonRfqlistComponent
  ]
})
export class CommonRfqlistModule {}
