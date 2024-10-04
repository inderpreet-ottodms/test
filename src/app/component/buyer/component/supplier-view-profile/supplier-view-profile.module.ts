import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import {SupplierViewProfileComponent} from './supplier-view-profile.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [SupplierViewProfileComponent],
  exports: [SupplierViewProfileComponent]
})
export class SupplierViewProfileModule { }
