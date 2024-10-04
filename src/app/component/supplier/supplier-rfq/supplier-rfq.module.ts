import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { SupplierRfqRoutingModule } from './supplier-rfq-routing.module';
import { SupplierRfqComponent } from './supplier-rfq.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRfqRoutingModule,
    SharedModule,
  ],
  declarations: [SupplierRfqComponent]
})
export class SupplierRfqModule { }
