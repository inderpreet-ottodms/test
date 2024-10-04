import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[nxNoScroll]'
})
export class NoScrollDirective {

    @HostListener('wheel', ['$event'])
    onWheel(event: Event) {
        event.preventDefault();
    }

}