import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageRfqComponent } from './message-rfq.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {
  EditorModule
} from 'primeng/editor';
import { SharedModule } from '../../../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule
  ],
  declarations: [MessageRfqComponent],
  exports:[MessageRfqComponent]
})
export class MessageRfqModule { }
