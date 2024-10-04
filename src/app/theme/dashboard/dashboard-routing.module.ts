import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dashboard',
      status: false
    },
    children: [
      {
        path: 'buyer/default',
        loadChildren: () => import('./default/default.module').then(x => x.DefaultModule)
      },
      {
        path: 'supplier/ecommerce',
        loadChildren: () => import('./ecommerce/ecommerce.module').then(x => x.EcommerceModule)
      },
      {
        path: 'welcome',
        loadChildren: () => import('./welcome/welcome.module').then(x => x.WelcomeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
