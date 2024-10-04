import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartLibraryComponent } from './part-library.component';

const routes: Routes = [
  {
    path: '',
    component: PartLibraryComponent,
    data: {
      title: 'Part Library'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartLibraryRoutingModule { }
