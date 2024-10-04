import { Injectable, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'npsState'
})

export class NPSColorStates {
    transform(val, args) {
      let colorClass = '';
      if (val > 0) {
        colorClass = 'badge badge-green';
      }
      if (val < 0) {
        colorClass = 'badge badge-red';
      }
      if (val === 0) {
        colorClass = 'badge badge-yellow';
      }
      if (val === undefined || val === null) {
        colorClass = 'badge badge-gray';
      }
      return colorClass;
    // old code
     // return ((val < 56) ? 'badge badge-danger' : (val > 55  && val < 86) ? 'badge badge-warning' : 'badge badge-success');
    }
}
