import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Authentication',
      status: false
    },
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(x => x.LoginModule)
      },
      {
        path: 'forgot',
        loadChildren: () => import('./forgot/forgot.module').then(x => x.ForgotModule)
      },
      {
        path: 'resetpassword',
        loadChildren: () => import('./reset-password/reset-password.module').then(x => x.ResetPasswordModule)
      },
      {
        path: 'inviteuser',
        loadChildren: () => import('./user-invite/user-invite.module').then(x => x.UserInviteModule)
      },
      {
        path: 'verification',
        loadChildren: () => import('./verify/verify.module').then(x => x.VerifyModule)
      },
      {
        path: 'logging',
        loadChildren: () => import('./get-logging/get-logging.module').then(x => x.GetLoggingModule)
      },
      {
        path: 'linkedin',
        loadChildren: () => import('./link-in-logging-process/link-in-logging-process.module').then(x => x.LinkInLoggingProcessModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
