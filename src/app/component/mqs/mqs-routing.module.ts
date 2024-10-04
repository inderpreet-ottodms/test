import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicePdfComponent } from './invoice-pdf/invoice-pdf.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'qms',
      status: false
    },
    children: [
      {
        path: 'myquotes',
         loadChildren: () => import('./my-mqsquote/my-mqsquote.module').then(x => x.MyMqsquoteModule)
      },
      {
        path: 'qmsdetail/:id',
         loadChildren: () => import('./qms-detail/qms-detail.module').then(x => x.QmsDetailModule)
      },
      {
        path: 'active',
         loadChildren: () => import('./active-quotes/active-quotes.module').then(x => x.ActiveQuotesModule)
      },
      {
        path: 'myinvoices',
         loadChildren: () => import('./my-invoices/my-invoices.module').then(x => x.MyInvoicesModule)
      },
      {
        path: 'createinvoice',
         loadChildren: () => import('./create-invoice/create-invoice.module').then(x => x.CreateInvoiceModule)
      },
      {
        path: 'updateinvoice/:id',
         loadChildren: () => import('./create-invoice/create-invoice.module').then(x => x.CreateInvoiceModule)
      },
      {
        path: 'mycompanyinvoices',
         loadChildren: () => import('./my-company-invoices/my-company-invoices.module').then(x => x.MyCompanyInvoicesModule)
      },
      {
        path: 'mycompanyquotes',
         loadChildren: () => import('./my-company-quotes/my-company-quotes.module').then(x => x.MyCompanyQuotesModule)
      },
      {
        path:'invoicePdf/:id',
        component: InvoicePdfComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MqsRoutingModule { }
