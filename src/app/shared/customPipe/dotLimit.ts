import { Injectable, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'dotLimit'
})

export class DotLimit {
    transform(val, args) {
      if (val === undefined || val === null) {
        const newStr = 'N/A';
        return newStr;
      } else {
        const charactorCount = val.length;
        const appendText = '...';
        let fixStr = '';
        let oappendText = '';
        const newStr = 'N/A';
        if (val.trim() !== '' ) {
          if (charactorCount > args ) {
            fixStr  =  val.slice(0, args);
            oappendText =  fixStr.concat(appendText);
            return oappendText;
         } else {
           return val;
         }
        } else {
          return newStr;
        }
      }
    }
}
