import { Injectable } from "@angular/core";
/// <summary>
/// This class is indent to hold the Email message parameters.
/// </summary>
@Injectable()
export class qMSQuotePDFEmailMessageViewModel
{
  /// <summary>
  /// Gets or sets the qmsQuoteId.
  /// </summary>
  qmsQuoteId: number;
  /// <summary>
  /// Gets or sets the quoteId.
  /// </summary>
  quoteId: number;
  /// <summary>
  /// Gets or sets the qms quote name.
  /// </summary>
  qmsQuoteName: string;
  /// <summary>
  /// Gets or sets the supplier contact id.
  /// </summary>
  supplierContactId: number;
  /// <summary>
  /// Gets or sets the supplier company id.
  /// </summary>
  supplierCompanyId: number;
  /// <summary>
  /// Gets or sets the customer id.
  /// </summary>
  qmsContactId: number;
  /// <summary>
  /// Gets or sets the email id to whom mail is send.
  /// </summary>
  toEmailId: string;
  /// <summary>
  /// Gets or sets the email id from mail is send.
  /// </summary>
  replyToEmailId: string;
  /// <summary>
  /// Gets or sets the subject of email.
  /// </summary>
  emailSubject: string = '';
  /// <summary>
  /// Gets or sets the email body.
  /// </summary>
  emailBody: string = '';
  /// <summary>
  /// Gets or sets the html of quote pdf.
  /// </summary>
  quotePdfHtml: string;
  /// <summary>
  /// Gets or sets the terms and condition pdf file name.
  /// </summary>
  termsConditionFileName: string;
  /// <summary>
  /// Gets or sets the flag to check mail is sent to customer or manufacturer.
  /// </summary>
  isCustomer : boolean;
}

/// <summary>
/// This class is indent to hold the Terms and Condition pdf file parameters.
/// </summary>
@Injectable()
export class qMSQuoteTermsConditionViewModel {
  /// <summary>
  /// Gets or sets the supplier company id.
  /// </summary>
  supplierCompanyId: number;
  /// <summary>
  /// Gets or sets the supplier contact id.
  /// </summary>
  supplierContactId: number;
  /// <summary>
  /// Gets or sets the terms and condition pdf file name.
  /// </summary>
  termsConditionFileName : string;
}
