import { Injectable } from "@angular/core";
@Injectable()
export class NgxSelectModel
{
    //  The value hold the ID of data.
    value: any;
    //  The text hold the text of data.
    text: string;
    //  This property is show/hide the remove button.
    isRemovable: boolean;
    //  This propety is make the field editable.
    isEditable: boolean = false;
    //  Hold any value/object.
    object: any = null;
}