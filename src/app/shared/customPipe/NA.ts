import { Injectable, Pipe } from '@angular/core';
@Pipe({
    name: 'Na'
})
export class NaPipe {
    transform(val, args) {
        let newStr = '';
        if (val !== null && val !== undefined && val !== '') {
          console.log("CHECKING FOR isNumber");
        } else {
          newStr = 'N/A';
          return newStr;
        }
    }
}
