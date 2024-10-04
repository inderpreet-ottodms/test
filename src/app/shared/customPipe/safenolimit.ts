import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeNolimit'})

export class SanitizeNolImtHtmlPipe implements PipeTransform  {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: string, args): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
