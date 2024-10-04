import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CloneRfqComponent } from './clone-rfq.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CloneRfqComponent],
  exports: [CloneRfqComponent]
})
export class CloneRfqModule { }
