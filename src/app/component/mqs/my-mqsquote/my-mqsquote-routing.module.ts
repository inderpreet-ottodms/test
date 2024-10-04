import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMqsquoteComponent } from './my-mqsquote.component';


const routes: Routes = [
  {
    path: '',
    component: MyMqsquoteComponent,
    data: {
      title: 'My Quotes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMqsquoteRoutingModule { }
