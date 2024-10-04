import { Injectable, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'zero'
})

export class ZeroPipe {
    transform(val, args) {
       // val = val.charAt(0) != 0 ? '0' + val : '' + val;
        const newStr = 0;
        if (val !== null) {
           return val;
        } else {
          return newStr;
        }
    }
}
