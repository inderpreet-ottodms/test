import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile',
      status: false
    },
    children: [
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(x => x.SettingModule)
      },
      {
        path: 'buyerprofile',
        loadChildren: () => import('./profile/profile.module').then(x => x.ProfileModule)
      },
      {
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.module').then(x => x.UserManagementModule)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
