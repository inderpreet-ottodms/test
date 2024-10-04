import { Component, OnInit, ElementRef, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgxSelectModel } from './ngxSelectModel';


@Component({
  selector: 'app-ngx-gen-select',
  templateUrl: './ngx-gen-select.component.html',
  styleUrls: ['./ngx-gen-select.component.scss'],
  providers: [NgxSelectModel],
  host: {
    '(document:click)': 'closeNgxSelect($event)',
  },
})
export class NgxGenSelectComponent implements OnInit, AfterViewInit
{
    @Output() 
    selectedValueChange = new EventEmitter<number>();

    @Input() itemCollection:NgxSelectModel[];
    _selectedValue?: number = null;
    @Input() 
    get selectedValue()
    {
        return this._selectedValue;
    }
    set selectedValue(value: number)
    {
        this._selectedValue = value;
        this.selectedValueChange.emit(value);
        this.ngOnInit();
    }

    @Input() emptyMessage:string;
    @Output() itemRemove = new EventEmitter<NgxSelectModel>();
    @Output() selectionRemove = new EventEmitter<NgxSelectModel>();
    @Output() selectionChange = new EventEmitter<NgxSelectModel>();

    selectedItem : NgxSelectModel = null;

    removeSelectedItem(item: NgxSelectModel, event:any)
    {
        this.itemRemove.emit(item);
        event.stopPropagation();
    }
    clearSelection()
    {
        this.selectionRemove.emit(this.selectedItem);
        this.selectedValue = null;
        this.selectedItem = null;
        ///this.selectedText = null;
    }

    @ViewChild('ngxEditableSelection',{static:false}) evc: ElementRef;
    itemClick(_selectedItem:NgxSelectModel)
    {
        if(this.selectedItem==_selectedItem)
        {
            return;
        }
        this.selectedItem = _selectedItem;
        this.selectedValue = this.selectedItem.value;
        this._showItems = false;
        if(!this.selectedItem.isEditable)
        {
            this.selectionChange.emit(_selectedItem);
        }
        else
        {
            setTimeout(() => this.evc.nativeElement.focus(), 0);
        }
    }
    constructor(private _eref: ElementRef) { }
    searchText: string;
    ngOnInit() {
        if(this.selectedValue!=null && this.selectedValue!=undefined)
        {
            this.selectedItem = this.itemCollection.find(x=>x.value==this.selectedValue);
            if(this.selectedItem!=null && this.selectedItem!=undefined)
            {
                this.itemClick(this.selectedItem);
            }
            else
            {
                this.selectedItem = null;
                this.selectedValue = null;
            }
        }
    }
    ngAfterViewInit(): void 
    {
        this._showItems = false;
    }
    // loadItems(items: NgxSelectModel[])
    // {
    //     if(items.length!=0)
    //     {
    //         this.itemCollection = items;
    //     }
    // }

    _showItems : boolean;
    closeNgxSelect($event)
    {
        if (!this._eref.nativeElement.contains(event.target))
        {
            this._showItems = false;
            //this.searchText = null;
        }
    }
    
    @ViewChild('ngxSearchText',{static:false}) vc: ElementRef;
    showItems() : void
    {
        this._showItems=!this._showItems;
        if(this._showItems)
        {
            setTimeout(() => this.vc.nativeElement.focus(), 0);
            //this.vc.nativeElement.focus();
        }
    }
    
}
