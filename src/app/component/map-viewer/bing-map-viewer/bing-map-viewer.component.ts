import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
// import { SafeMapPipe } from './SafeMapPipe';


@Component({
  selector: 'app-bing-map-viewer',
  templateUrl: './bing-map-viewer.component.html',
  styleUrls: ['./bing-map-viewer.component.scss'],
  //providers: [SafeMapPipe]
})
export class BingMapViewerComponent implements OnInit, AfterViewInit
{
    private _locationAddress:string
    @Input() 
    get locationAddress():any
    {
        return this._locationAddress;
    }
    @Output() locationAddressChange = new EventEmitter();
    set locationAddress(value:any) {
         this._locationAddress = value;
         this.locationAddressChange.emit(this._locationAddress);
         this.ngAfterViewInit();
    }
    
    mapSource:string='';

    constructor() { }
    ngAfterViewInit(): void {
        this.mapSource="../../../../assets/Simple map/Geocode.html?address=" +
        this.locationAddress; 
    }
    ngOnInit() {
    }
}
