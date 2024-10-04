import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicLoginComponent } from './basic-login.component';
import {BasicLoginRoutingModule} from './basic-login-routing.module';
import { SharedModule } from 'primeng/api';
// import { SharedModule } from 'primeng/components/common/shared';
// import { SharedModule } from 'primeng/api/shared';
SharedModule
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BasicLoginRoutingModule,
    SharedModule
  ],
  exports: [BasicLoginComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [BasicLoginComponent]
})
export class BasicLoginModule { }
