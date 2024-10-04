import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../../shared/shared.module';
import { EditorModule } from 'primeng/editor';
// import { MessageBuyerComponent } from './message-buyer.component';

@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    SharedModule
  ],
  // declarations: [MessageBuyerComponent]
})
export class MessageBuyerModule { }
