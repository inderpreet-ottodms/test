import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonMfgQuoteComponent } from './non-mfg-quote.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [NonMfgQuoteComponent],
  exports:[NonMfgQuoteComponent]
})
export class NonMfgQuoteModule { }
