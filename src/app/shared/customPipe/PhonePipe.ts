import { Injectable, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'phone'
})

export class PhonePipe {
    transform(val, args) {
       // val = val.charAt(0) != 0 ? '0' + val : '' + val;
        let newStr = '';

        // tslint:disable-next-line:no-var-keyword
        for (var i = 0; i < (Math.floor(val.length / 3) - 1); i++ ) {
           newStr = newStr + val.substr(i * 3, 3) + '-';
        }
        return newStr + val.substr(i * 3);
    }
}
