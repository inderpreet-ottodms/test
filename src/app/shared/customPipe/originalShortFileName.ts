import { Injectable, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'originalShortName'
})

export class OriginalFileShortName {
    transform(val, args) {
      let oappendText = '';
      const appendText = '..';
      let fixStr: '';
      if (val) {
        const filenNameArray = val.split('_S3_');
        if (filenNameArray.length === 1) {
          const charactorCount = filenNameArray[0].length;
          if (charactorCount > args ) {
            fixStr =  filenNameArray[0].slice(0, args);
            oappendText = fixStr.concat(appendText);
            return oappendText;
          } else {
            return filenNameArray[0];
          }
        } else {
          const charactorCount = filenNameArray[1].length;
          if (charactorCount > args ) {
            fixStr =  filenNameArray[1].slice(0, args);
            oappendText =  fixStr.concat(appendText);
            return oappendText;
          } else {
            return filenNameArray[1];
          }
        }
      }
    }
}
