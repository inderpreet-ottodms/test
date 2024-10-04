import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtmlLimt'})

export class SanitizeWithoutLimit implements PipeTransform  {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: string, args): SafeHtml {
    const charactorCount = value.length;
      const appendText = '...';
      let oappendText = '';
      if (value.trim() !== '' ) {
        oappendText = value;
      }
    return this._sanitizer.bypassSecurityTrustHtml(oappendText);
  }
}
