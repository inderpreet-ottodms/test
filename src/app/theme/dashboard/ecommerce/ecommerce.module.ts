import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PublishProfileModule } from '../../../../app/component/publish-profile/publish-profile.module';
import { BuyerFeedbackModelModule } from '../../../component/buyer-feedback-model/buyer-feedback-model.module';
import { BuyerViewProfileModule } from '../../../component/buyer/component/buyer-view-profile/buyer-view-profile.module';
import { GrowthPackageModule } from '../../../component/growth-package/growth-package.module';
import { MessageSendDrawerModule } from '../../../component/message-send-drawer/message-send-drawer.module';
import { FollowedbuyerRfqComponent } from '../../../component/supplier/supplier-rfq/component/followedbuyer-rfq/followedbuyer-rfq.component';
import { LikedRfqComponent } from '../../../component/supplier/supplier-rfq/component/liked-rfq/liked-rfq.component';
import { MyRfqComponent } from '../../../component/supplier/supplier-rfq/component/my-rfq/my-rfq.component';
import { QuotedRfqComponent } from '../../../component/supplier/supplier-rfq/component/quoted-rfq/quoted-rfq.component';
import { SpecialinviteRfqComponent } from '../../../component/supplier/supplier-rfq/component/specialinvite-rfq/specialinvite-rfq.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProfileLogoModule } from '../profile-logo/profile-logo.module';
import { ProfileProgressModule } from '../profile-progress/profile-progress.module';
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { EcommerceComponent } from './ecommerce.component';
import { MaterialQuoteRequestRoutingModule } from '../material/material.quoterequest.routing.module';

@NgModule({
  imports: [
    CommonModule,
    EcommerceRoutingModule,
    SharedModule,
    ProfileProgressModule,
    ProfileLogoModule,
    BuyerViewProfileModule,
    MessageSendDrawerModule,
    BuyerFeedbackModelModule,
    GrowthPackageModule,
    MaterialQuoteRequestRoutingModule,
    PublishProfileModule,
  ],
  declarations: [
    EcommerceComponent, 
    LikedRfqComponent, 
    QuotedRfqComponent,
    FollowedbuyerRfqComponent, 
    SpecialinviteRfqComponent, 
    MyRfqComponent,
  ]
})
export class EcommerceModule {}
