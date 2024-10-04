import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierQuotesRoutingModule } from './supplier-quotes-routing.module';
import { SharedModule } from '../../../../app/shared/shared.module';
import { SupplierQuotesComponent } from './supplier-quotes.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupplierQuotesRoutingModule,
    SharedModule 
  ],
  declarations: [SupplierQuotesComponent]
})
export class SupplierQuotesModule { }
