import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishProfileRoutingModule } from './publish-profile-routing.module';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { NotPublishConfirmationPageComponent } from './not-publish-confirmation-page/not-publish-confirmation-page.component';
import { PublishDecisionModelComponent } from './publish-decision-model/publish-decision-model.component';
import { NotPublishDecisionModelComponent } from './not-publish-decision-model/not-publish-decision-model.component';

@NgModule({
  imports: [
    CommonModule,
    PublishProfileRoutingModule
  ],
  declarations: [ThankyouPageComponent, NotPublishConfirmationPageComponent, PublishDecisionModelComponent, NotPublishDecisionModelComponent],
  exports:[PublishDecisionModelComponent, NotPublishDecisionModelComponent]
})
export class PublishProfileModule { }
