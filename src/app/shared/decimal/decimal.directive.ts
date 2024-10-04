import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDecimal]'
})
export class DecimalDirective 
{
    // Allow decimal numbers and negative values
    //  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);

    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home'];
    current: string;
    next: string;
    @Input() value:number;
    regex: RegExp = new RegExp(/^\d*(\.\d{0,4})?$/g);
    constructor(private el: ElementRef) { }
    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) 
    {
        if(this.value != undefined && this.value == -1) 
        {
            this.value = Number(this.value);
            this.regex = new RegExp(/^\d{0,3}(\.\d{0,1})?$/g);
        } 
        else if(this.value != undefined && this.value != -1 && this.value != 0) 
        {
            this.value = Number(this.value);
            this.regex = new RegExp("^\\d*(\\.\\d{0,"+ this.value +"})?$","g");
        } 
        else if(this.value != undefined && this.value == 0) 
        {
            this.value = Number(this.value);
            this.regex = new RegExp(/^(\d*)?\d+$/g);
        }
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1 || 
            (event.keyCode === 17 || (event.keyCode === 86 && event.ctrlKey === true)) || 
            (event.keyCode === 17 || (event.keyCode === 67 && event.ctrlKey === true)) ||  
            (event.keyCode === 46) || 
             event.keyCode === 37 || event.keyCode === 39)  
        {
            return;
        }
        this.current = this.el.nativeElement.value;
        this.next = this.current.concat(event.key);
        if (this.next && !String(this.next).match(this.regex)) 
        {
            event.preventDefault();
        }
    }
}
