import {
  Directive, HostBinding, Inject, Input, OnInit, OnDestroy
} from '@angular/core';

import { AccordionDirective } from './accordion.directive';

@Directive({
  selector: '[appAccordionLink]'
})
export class AccordionLinkDirective implements OnInit, OnDestroy {

  @Input() public group: any;

  @HostBinding('class.pcoded-trigger')
  @Input()
  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    /*for slimscroll on and off*/
    document.querySelector('.pcoded-inner-navbar').classList.toggle('scroll-sidebar');
    if (value) {
        this.accordionDirective.closeOtherLinks(this);
    }
  }

  protected _open: boolean;
  protected accordionDirective: AccordionDirective;

  constructor(@Inject(AccordionDirective) nav: AccordionDirective) {
    this.accordionDirective = nav;
  }

  ngOnInit(): any {
    this.accordionDirective.addLink(this);
  }

  ngOnDestroy(): any {
    this.accordionDirective.removeGroup(this);
  }

  toggle(): any {
    /*for slimscroll on and off*/
    document.querySelector('.pcoded-inner-navbar').classList.add('scroll-sidebar');

    this.open = !this.open;
  }
}
