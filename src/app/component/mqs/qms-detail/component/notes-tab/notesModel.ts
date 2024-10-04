import { Injectable } from "@angular/core";
/// <summary>
/// This class is indent to hold the QMS Add Notes parameters.
/// </summary>
@Injectable()
export class QMSNotesTabViewModel {
  /// <summary>
  /// Gets or sets the qms note id.
  /// </summary>
  qmsNoteId: number;
  /// <summary>
  /// Gets or sets the supplier Contact id.
  /// </summary>
  supplierContactId: number;
  /// <summary>
  /// Gets or sets the qms quote id.
  /// </summary>
  qmsQuoteId: number;
  /// <summary>
  /// Gets or sets the qms note title.
  /// </summary>
  qmsNotesTitle: string = '';
  /// <summary>
  /// Gets or sets the qms notes.
  /// </summary>
  qmsNotes: string = '';
  /// <summary>
  /// Gets or sets the qms ishidden id.
  /// </summary>
  isHidden: boolean;
  /// <summary>
  /// Gets or sets the qms note date.
  /// </summary>
  qmsNotesDate: Date;
  /// <summary>
  /// Gets or sets the qms note modified date.
  /// </summary>
  qmsNotesModifiedDate: Date;
}

/// <summary>
/// This class is indent to hold the QMS Get Notes parameters.
/// </summary>
@Injectable()
export class QMSQuoteNotesFilterViewModel {
  /// <summary>
  /// Gets or sets the qms  quote id.
  /// </summary>
  qmsQuoteId: number = 0;
  /// <summary>
  /// Gets or sets the qms page size.
  /// </summary>
  pageSize: number = 24;
  /// <summary>
  /// Gets or sets the qms page number.
  /// </summary>
  pageNumber: number = 1;
  /// <summary>
  /// Gets or sets the qms search text.
  /// </summary>
  searchText: string = '';
  /// <summary>
  /// Gets or sets the qms total records.
  /// </summary>
  totalRecords: number = 0;
  /// <summary>
  /// Gets or sets the qms is order by dec.
  /// </summary>
  isOrderByDesc: boolean = true;
  /// <summary>
  /// Gets or sets the qms order by.
  /// </summary>
  orderBy: string = '';
  /// <summary>
  /// Gets or sets the qms more records.
  /// </summary>
  more_records: boolean = true;
  /// <summary>
  /// Gets or sets the qms filter by.
  /// </summary>
  filterBy: string = '';
}
