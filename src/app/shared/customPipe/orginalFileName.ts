import { Injectable, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'originalName'
})

export class OriginalFileName {
    transform(val, args) {
      if (val) {
        const filenNameArray = val.split('_S3_');
        if (filenNameArray.length === 1) {
          return filenNameArray[0];
        } else {
          return filenNameArray[1];
        }
      }
    }
}
