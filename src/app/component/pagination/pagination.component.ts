import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, AfterViewInit {
  theam : string = 'compact';
  firstPage : string = '<< First';
  previousPage : string = '< Previous';
  nextPage : string = 'Next >';
  lastPage : string = 'Last >>';
  separator : string = ' | ';
  totalPages : number = 0;
  currentPageSize = 24;
  currentPage = 1;

  pages : number[] = null;
  ngAfterViewInit(): void {
    this.calculateNumberOfPages();
  }
  @Input() totalRecords :number;
  @Output() pageSize_Change = new EventEmitter<number>();
  pageSize_OnChange()
  {
    this.currentPage = 1;
    this.pageSize_Change.emit(this.currentPageSize);
    this.calculateNumberOfPages();
  }
  @Output() page_Change = new EventEmitter<number>();
  page_OnChange()
  {
    this.page_Change.emit(this.currentPage);
  }
  compact_page_OnChange(value:any)
  {
    switch(value)
    {
      case 'PREVIOUS':
        if(this.currentPage==1)
        {
          return;
        }
        this.currentPage--;
      break;
      case 'NEXT':
        if(this.currentPage==this.totalPages)
        {
          return;
        }
        this.currentPage++;
      break;
    }
    this.page_Change.emit(this.currentPage);
  }

  constructor() { }

  
  ngOnInit() {
    
  }

  calculateNumberOfPages() 
  {
    this.totalPages =  parseInt(Math.ceil(((this.totalRecords/this.currentPageSize))).toString());
    this.pages =[];
    for(let page=0; page<=this.totalPages-1; page++)
    {
      this.pages.push(page+1);
    }
  }

  navigateAction(nativateOption:string)
  {
    switch(nativateOption)
    {
      case 'FIRST':
        this.currentPage=1;
      break;
      case 'PREVIOUS':
        if(this.currentPage!=1){
          this.currentPage--;
        }
      break;
      case 'NEXT':
        if(this.currentPage!=this.totalPages){
          this.currentPage++;
        }
      break;
      case 'LAST':
        this.currentPage = this.totalPages;
      break;
    }
    this.page_OnChange();
  }

}
