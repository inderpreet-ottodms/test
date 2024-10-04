import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerFeedbackModelComponent } from './buyer-feedback-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BuyerFeedbackModelComponent],
  exports:[BuyerFeedbackModelComponent],
 
})
export class BuyerFeedbackModelModule { }
