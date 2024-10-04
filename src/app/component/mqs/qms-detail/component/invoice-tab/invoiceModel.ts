/// <summary>
/// This class is indent to hold the QMS Invoice tab parameters.
/// </summary>
export class QMSQuoteInvoiceTabViewModel {
  /// <summary>
  /// Gets or sets the qms invoice id.
  /// </summary>
  qmsQuoteInvoiceId: number;
  /// <summary>
  /// Gets or sets the QMSQuoteId.
  /// </summary>
  qmsQuoteId: number;
  /// <summary>
  /// Gets or sets the InvoiceId.
  /// </summary>
  invoiceNo: number;
  /// <summary>
  /// Gets or sets the qms invoice name.
  /// </summary>
  invoiceName: string = '';
  /// <summary>
  /// Gets or sets the qms invoice created date.
  /// </summary>
  invoiceCreated: Date;
  /// <summary>
  /// Gets or sets the Reference No.
  /// </summary>
  quoteReferenceNo: string = '';
  /// <summary>
  /// Gets or sets the due amount.
  /// </summary>
  amountDue: number;
  /// <summary>
  /// Gets or sets the qms status id.
  /// </summary>
  statusId: number;
   /// <summary>
  /// Gets or sets the customer name.
  /// </summary>
  customer: number;
   /// <summary>
  /// Gets or sets the qms status id.
  /// </summary>
  qmsContactId: number;
   /// <summary>
  /// Gets or sets the customer name.
  /// </summary>
  qmsContactIdEncrypt : string;
}
