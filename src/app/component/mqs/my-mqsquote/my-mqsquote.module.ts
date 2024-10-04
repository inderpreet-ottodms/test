import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMqsquoteRoutingModule } from './my-mqsquote-routing.module';
import { MyMqsquoteComponent } from './my-mqsquote.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { SharedModule } from '../../../shared/shared.module';
import {SelectModule} from 'ng-select';
import { MqsModule } from '../mqs.module';
@NgModule({
  imports: [
    CommonModule,
    MyMqsquoteRoutingModule,
    ConfirmDialogModule,
    SharedModule,
    SelectModule,
    MqsModule
  ],
  declarations: [MyMqsquoteComponent]
})
export class MyMqsquoteModule { }
