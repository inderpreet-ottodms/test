import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml'})

export class SanitizeHtmlPipe implements PipeTransform  {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: string, args = 40): SafeHtml {
    const charactorCount = value.length;
      const appendText = '...';
      let fixStr = '';
      let oappendText = '';
      if (value.trim() !== '' ) {
        if (charactorCount > args ) {
          fixStr  =  value.slice(0, args);
          oappendText =  fixStr.concat(appendText);
       } else {
        oappendText = value;
       }
      }
    return this._sanitizer.bypassSecurityTrustHtml(oappendText);
  }
}
