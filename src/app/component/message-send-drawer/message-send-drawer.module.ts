import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageSendDrawerComponent } from './message-send-drawer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { EditorModule } from 'primeng/editor';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    EditorModule,
    SharedModule
  ],
  declarations: [MessageSendDrawerComponent],
  exports: [MessageSendDrawerComponent]
})
export class MessageSendDrawerModule { }
