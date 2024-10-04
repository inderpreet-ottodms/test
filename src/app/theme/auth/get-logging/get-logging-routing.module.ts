import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetLoggingComponent } from './get-logging.component';

const routes: Routes = [{
  path: '',
  component: GetLoggingComponent,
  data: {
    title: 'Logging Process'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetLoggingRoutingModule { }
