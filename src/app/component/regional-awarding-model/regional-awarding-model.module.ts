import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionalAwardingModelComponent } from './regional-awarding-model.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [RegionalAwardingModelComponent],
  exports: [RegionalAwardingModelComponent]
})
export class RegionalAwardingModelModule { }
