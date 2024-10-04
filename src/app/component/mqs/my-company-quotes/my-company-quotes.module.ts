import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCompanyQuotesRoutingModule } from './my-company-quotes-routing.module';
import { MyCompanyQuotesComponent } from './my-company-quotes.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SelectModule} from 'ng-select';
import { MqsModule } from '../mqs.module';
@NgModule({
  imports: [
    CommonModule,
    MyCompanyQuotesRoutingModule,
    ConfirmDialogModule,
    SelectModule,
    MqsModule
  ],
  declarations: [MyCompanyQuotesComponent]
})
export class MyCompanyQuotesModule { }
