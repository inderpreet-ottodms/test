import { Injectable } from "@angular/core";
@Injectable()
export class OpenRFQFilter 
{
        /// <summary>
        /// Gets or sets the sort by value.
        /// </summary>
        SortBy:string;
        /// <summary>
        /// Gets or sets the sorting order value.
        /// </summary>
        SortingOrder : string;
        /// <summary>
        /// Gets or sets the searching text.
        /// </summary>
        SearchText : string;
        /// <summary>
        /// Gets or sets the list of processes
        /// </summary>
        Processes : number[];
        /// <summary>
        /// Gets or sets the page size.
        /// </summary>
        PageSize :number;
        /// <summary>
        /// Gets or sets the current page.
        /// </summary>
        CurrentPage :number;
}