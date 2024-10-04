import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { EditorModule } from 'primeng/editor';
import { SharedModule } from '../../shared/shared.module';
import { MessageThreadDrawerComponent } from './message-thread-drawer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    EditorModule,
    SharedModule
  ],
  declarations: [MessageThreadDrawerComponent],
  exports: [MessageThreadDrawerComponent]
})
export class MessageThreadDrawerModule { }
