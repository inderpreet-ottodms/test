import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MaterialsRedirectComponent } from './materials-redirect.component';
import { BasicLoginModule } from '../../../app/theme/auth/login/basic-login/basic-login.module';

@NgModule({
  imports: [BasicLoginModule, CommonModule],
  declarations: [MaterialsRedirectComponent],
  exports: [MaterialsRedirectComponent]
})
export class MaterialsRedirectModule { }
