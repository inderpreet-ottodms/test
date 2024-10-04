import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartLibraryComponent } from './part-library.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [PartLibraryComponent],
  exports:[PartLibraryComponent]
})
export class PartLibraryModule { }
