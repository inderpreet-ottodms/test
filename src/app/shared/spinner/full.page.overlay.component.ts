import {Component, Input, OnDestroy, Inject, ViewEncapsulation, OnInit} from '@angular/core';
import {Spinkit} from './spinkits';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-full-page-overlay',
    templateUrl: './full.page.overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FullPageOverlayComponent implements OnDestroy {

    @Input()isLoader:boolean = false;
   
    ngOnDestroy(): void {
        this.isLoader = false;
    }
}
