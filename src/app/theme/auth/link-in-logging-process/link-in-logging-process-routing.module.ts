import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinkInLoggingProcessComponent } from './link-in-logging-process.component';

const routes: Routes = [{
  path: '',
  component: LinkInLoggingProcessComponent,
  data: {
    title: 'Verification'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkInLoggingProcessRoutingModule { }