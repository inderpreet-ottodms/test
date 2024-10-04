import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QmsAddCustomerModelComponent } from './qms-add-customer-model.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [QmsAddCustomerModelComponent],
  exports:[QmsAddCustomerModelComponent]
})
export class QmsAddCustomerModelModule { }
