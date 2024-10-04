import { Pipe, PipeTransform } from '@angular/core';
import { NgxSelectModel } from './ngxSelectModel';

@Pipe({
    name: 'selectFilter'
  })
  export class NgxGenSelectPipe implements PipeTransform {
    transform(list: NgxSelectModel[], filterText: string): NgxSelectModel[] 
    {
        if(!list || !filterText)
        {
            return list;
        }
        return list.filter(item => 
            item.text.toLowerCase().indexOf(filterText.toLowerCase())!==-1); 
    }
  }