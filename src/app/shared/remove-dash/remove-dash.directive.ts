import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRemoveDash]'
})
export class RemoveDashDirective {

  constructor(private el: ElementRef) { }
  @HostListener('paste', ['$event']) onEvent($event) {
    if(this.el.nativeElement.value !=undefined && this.el.nativeElement.value !=null) {

      return  (this.el.nativeElement.value).replaceAll("\\D", "");
    } else {
      return;
    }

  }
}
