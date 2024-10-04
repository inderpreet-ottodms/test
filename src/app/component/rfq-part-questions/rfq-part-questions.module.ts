import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  RfqPartQuestionsComponent
} from './rfq-part-questions.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [RfqPartQuestionsComponent],
  exports: [RfqPartQuestionsComponent]
})
export class RfqPartQuestionsModule {}
