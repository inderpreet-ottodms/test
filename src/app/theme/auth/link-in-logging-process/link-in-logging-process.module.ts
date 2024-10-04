import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LinkInLoggingProcessComponent } from './link-in-logging-process.component';
import { LinkInLoggingProcessRoutingModule } from './link-in-logging-process-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LinkInLoggingProcessRoutingModule,
    
  ],
  declarations: [LinkInLoggingProcessComponent]
})
export class LinkInLoggingProcessModule { }
