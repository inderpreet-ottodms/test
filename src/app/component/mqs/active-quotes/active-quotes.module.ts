import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { SharedModule } from '../../../shared/shared.module';
import {SelectModule} from 'ng-select';
import { MqsModule } from '../mqs.module';

import { ActiveQuotesRoutingModule } from './active-quotes-routing.module';
import { ActiveQuotesComponent } from './active-quotes.component';

@NgModule({
  imports: [
    CommonModule,
    ActiveQuotesRoutingModule,
    ConfirmDialogModule,
    SharedModule,
    SelectModule,
    MqsModule
  ],
  declarations: [ActiveQuotesComponent]
})
export class ActiveQuotesModule { }
