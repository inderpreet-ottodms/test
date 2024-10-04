import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLogoComponent } from './profile-logo.component';
import { FileUploadModule } from 'ng2-file-upload';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    EditorModule,
    FormsModule
  ],
  declarations: [ProfileLogoComponent],
  exports:[ProfileLogoComponent]
})
export class ProfileLogoModule { }
