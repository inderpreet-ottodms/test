import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RfqsComponent } from './open-rfq/rfqs/rfqs.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'rfq',
      status: false
    },
    children: [
      {
        path: 'draftrfqs',
        loadChildren: () => import( './inprogress-rfq/inprogress-rfq.module').then(x => x.InprogressRfqModule)
      },
      {
        path: 'myrfq',
        loadChildren: () => import( './my-rfq/my-rfq.module').then(x => x.MyRfqModule)
      },
      {
        path: 'mycompanyrfq',
        loadChildren: () => import( './my-company-rfq/my-company-rfq.module').then(x => x.MyCompanyRfqModule)
      },
      {
        path: 'myqoutes',
        loadChildren: () => import( './my-quotes/my-quote.module').then(x => x.MyQuoteModule)
      },
      {
        path: 'editrfq',
        loadChildren: () => import( './edit-rfq/edit-rfq.module').then(x => x.EditRfqModule),

      },
      {
        path: 'buyer',
        loadChildren: () => import( '../../v2/buyer/request-form-quote.module').then(x => x.RequestFormQuoteModule),

      },
      {
        path: 'rfqdetail',
        loadChildren: () => import( './rfq-detail/rfq-detail.module').then(x => x.RfqDetailModule)
      },
      {
        path: 'markforquoting',
        loadChildren: () => import( './mark-for-quoting/mark-for-quoting.module').then(x => x.MarkForQuotingModule)
      },
      {
        path: 'rfqnda',
        loadChildren: () => import( './nda-to-approve/nda-to-approve.module').then(x => x.NdaToApproveModule)
      },
      {
        path:'openrfq/:id',
        component: RfqsComponent
      },
      {
         path:'myorders',
        component: MyOrdersComponent
       },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfqRoutingModule { }
