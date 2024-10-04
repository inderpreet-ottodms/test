import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { SupplierRoutingModule } from './supplier-routing.module';
import {FileUploadModule} from 'ng2-file-upload';
import { UnlockedRfqModule } from './unlocked-rfq/unlocked-rfq.module';
//import { MyrfqSavedFiltersComponent } from './myrfq-saved-filters/myrfq-saved-filters.component';


// import { CommonRfqlistModule } from './common-rfqlist/common-rfqlist.module';



@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    SharedModule,
    FileUploadModule ,
    // CommonRfqlistModule
    UnlockedRfqModule
  ],
  declarations: [],
  exports: []
})
export class SupplierModule { }
