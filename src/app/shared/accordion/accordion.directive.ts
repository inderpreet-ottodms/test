
import {filter} from 'rxjs/operators';
import { Directive, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccordionLinkDirective } from './accordionlink.directive';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appAccordion]',
  host: {
    '(click)':'click()',   
   },   
})
export class AccordionDirective implements OnInit {
  constructor( private router: Router) {
 }
  protected accordionLinkDirective: Array<AccordionLinkDirective> = [];
  private countState = 1;
  private _router: Subscription;
  closeOtherLinks(openLink: AccordionLinkDirective): void {
      this.countState++;
    this.accordionLinkDirective.forEach((link: AccordionLinkDirective) => {
      if (link !== openLink && (link.group === 'sub-toggled' || openLink.group !== 'sub-toggled')) {
        link.open = false;
      }
    });
  }

  addLink(link: AccordionLinkDirective): void {
    this.accordionLinkDirective.push(link);
  }

  removeGroup(link: AccordionLinkDirective): void {
    const index = this.accordionLinkDirective.indexOf(link);
    if (index !== -1) {
      this.accordionLinkDirective.splice(index, 1);
    }
  }

  getUrl() {
    return this.router.url;
  }

  ngOnInit(): any {
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.countState = 0;
      this.accordionLinkDirective.forEach((link: AccordionLinkDirective) => {
        if (link.group) {
          const routeUrl = this.getUrl();
          const currentUrl = routeUrl.split('/');
          if (currentUrl.indexOf( link.group ) > 0) {
            link.open = true;
            this.closeOtherLinks(link);
          }
        }
      });
    });
  }

}
