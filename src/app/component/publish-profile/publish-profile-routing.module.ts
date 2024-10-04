import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotPublishConfirmationPageComponent } from './not-publish-confirmation-page/not-publish-confirmation-page.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';

const routes: Routes = [ {
  path:'',
  children:[
    {
      path:'confirmation',
      component:ThankyouPageComponent
    },
    {
      path:'NotPublishConfirmation',
      component:NotPublishConfirmationPageComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishProfileRoutingModule { }
