import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { GrowthPackageRoutingModule } from './growth-package-routing.module';
import { GrowthPackageComponent } from './growth-package.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    GrowthPackageRoutingModule,
  ],
  declarations: [ 
    GrowthPackageComponent
  ],
  exports: [ GrowthPackageComponent ]
})

export class GrowthPackageModule { }
