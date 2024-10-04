import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  SharedModule
} from '../../shared/shared.module';
import {
  AssociateMessageDrawerComponent
} from './associate-message-drawer.component';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    FileUploadModule,
    SharedModule
  ],
  declarations: [
    AssociateMessageDrawerComponent
  ],
  exports: [AssociateMessageDrawerComponent]
})
export class AssociateMessageDrawerModule {}
