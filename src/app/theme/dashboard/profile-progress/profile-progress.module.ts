import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileProgressComponent } from './profile-progress.component';
import { ProfileLogoModule } from '../profile-logo/profile-logo.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileLogoModule,
    SharedModule
  ],
  declarations: [ProfileProgressComponent],
  exports: [ProfileProgressComponent]
})
export class ProfileProgressModule { }
