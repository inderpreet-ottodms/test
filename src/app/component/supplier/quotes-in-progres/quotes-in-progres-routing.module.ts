import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotesInProgresComponent } from './quotes-in-progres.component';

const routes: Routes = [
  {
    path: '',
    component: QuotesInProgresComponent,
    data: {
      title: 'Quotes In-Progress RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesInProgresRoutingModule { }
