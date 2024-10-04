import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { QmsDetailRoutingModule } from './qms-detail-routing.module';
import { QmsDetailComponent } from './qms-detail.component';
import { QmsQuoteTabComponent } from './component/qms-quote-tab/qms-quote-tab.component';
import { SharedModule } from '../../../shared/shared.module';
import { MqsModule } from '../mqs.module';
import { NotesTabComponent } from './component/notes-tab/notes-tab.component';
import { NotesTabDrawerComponent } from './component/notes-tab-drawer/notes-tab-drawer.component';
import { TimelineTabComponent } from './component/timeline-tab/timeline-tab.component';
import { MessageTabComponent } from './component/message-tab/message-tab.component';
import { MessageViewDrawerComponent } from './component/message-view-drawer/message-view-drawer.component';
import { InvoiceTabComponent } from './component/invoice-tab/invoice-tab.component';
import { MessageSendNewDrawerComponent } from '../message-send-new-drawer/message-send-new-drawer.component';



@NgModule({
  imports: [
    CommonModule,
    QmsDetailRoutingModule,
    SharedModule,
    MqsModule,
    ConfirmDialogModule
  ],
  declarations: [QmsDetailComponent, QmsQuoteTabComponent, NotesTabComponent, NotesTabDrawerComponent, TimelineTabComponent, MessageTabComponent, MessageViewDrawerComponent, InvoiceTabComponent]
})
export class QmsDetailModule { }
