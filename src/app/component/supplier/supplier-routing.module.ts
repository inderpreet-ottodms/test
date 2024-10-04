import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOrdersComponent } from '../rfq/my-orders/my-orders.component';
import { UnlockedRfqComponent } from './unlocked-rfq/unlocked-rfq.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'supplier',
      status: false
    },
    children: [
      {
        path: 'profile',
         loadChildren: () => import('./supplier-profile/supplier-profile.module').then(x => x.SupplierProfileModule)
      },

      {
        path: 'followedBuyerRfq',
         loadChildren: () => import('./follwed-buyer-rfq/follwed-buyer-rfq.module').then(x => x.FollwedBuyerRfqModule)
      },
      {
        path: 'awardedRfq',
         loadChildren: () => import('./my-awarded-rfq/my-awarded-rfq.module').then(x => x.MyAwardedRfqModule)
      },
      {
        path: 'myLikedRfq',
         loadChildren: () => import('./my-liked-rfq/my-liked-rfq.module').then(x => x.MyLikedRfqModule)
      },
      {
        path: 'myQuotes',
         loadChildren: () => import('../../v2/supplier/supplier-quotes/supplier-quotes.module').then(x => x.SupplierQuotesModule)
      },
     
      {
        path: 'specialInviteRfq',
         loadChildren: () => import('./special-invite-rfq/special-invite-rfq.module').then(x => x.SpecialInviteRfqModule)
      },
      {
        path: 'supplierMyRfq',
         loadChildren: () => import('../../v2/supplier/supplier-my-rfq/supplier-my-rfq.module').then(x => x.SupplierMyRfqModule)
      },
      {
        path: 'supplierRfqDetails',
         loadChildren: () => import('./supplier-rfq-detail/supplier-rfq-detail.module').then(x => x.SupplierRfqDetailModule)
      },
      {
        path: 'myAccount',
         loadChildren: () => import('./my-account-no-contract/my-account-no-contract.module').then(x => x.MyAccountNoContractModule)
      },
      {
        path: 'quotesinprogress',
         loadChildren: () => import('./quotes-in-progres/quotes-in-progres.module').then(x => x.QuotesInProgresModule)
      },
      {
        path:'myorders',
       component: MyOrdersComponent
      },
      {
        path:'myunlockedrfq',
       component: UnlockedRfqComponent
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
