import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageThreadsComponent } from './message-threads.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [MessageThreadsComponent],
  exports: [MessageThreadsComponent]
})
export class MessageThreadsModule { }
