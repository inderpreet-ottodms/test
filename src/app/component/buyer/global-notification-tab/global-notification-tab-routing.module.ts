import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalNotificationTabComponent } from './global-notification-tab.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalNotificationTabComponent,
    data: {
      title: 'My Notification'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalNotificationTabRoutingModule {}
