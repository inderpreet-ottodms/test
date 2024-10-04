import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalMessageTabComponent } from './global-message-tab.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalMessageTabComponent,
    data: {
      title: 'My Messages'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalMessageTabRoutingModule { }
