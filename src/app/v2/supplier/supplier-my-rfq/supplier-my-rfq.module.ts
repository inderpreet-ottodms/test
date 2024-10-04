import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { BuyerViewProfileModule } from '../../../../app/component/buyer/component/buyer-view-profile/buyer-view-profile.module';
import { CommonRfqlistModule } from '../../../../app/component/buyer/component/common-rfqlist/common-rfqlist.module';
import { SharedModule } from '../../../shared/shared.module';
import { SupplierMyRfqRoutingModule } from './supplier-my-rfq-routing.module';
import { SupplierMyRfqComponent } from './supplier-my-rfq.component';
import { SupplierRfqFilterComponent } from './filter/supplier-rfq-filter.component';
import { SupplierV2Service } from '../service/supplier.v2.service';

@NgModule({
  imports: [
    CommonModule,
    SupplierMyRfqRoutingModule,
    SharedModule,
    CommonRfqlistModule,
    BuyerViewProfileModule,
    FileUploadModule
  ],
  providers: [SupplierV2Service],
  exports: [SupplierRfqFilterComponent],
  declarations: [SupplierMyRfqComponent,SupplierRfqFilterComponent]
})
export class SupplierMyRfqModule { }
