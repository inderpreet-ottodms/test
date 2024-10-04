import { Injectable } from "@angular/core";
@Injectable()
export class InvoicePreviewViewModel
{
    customerId:string
    quoteReferenceNo:string
    invoiceName:string
    invoiceNumber:string
    issueDate:string
    ordernumber:string
    notes:string
    invoiceItems:any;
}

// export class InvoicePartDetails
// {
//     invoiceParts: partInfo[]
// }

// export class partInfo
// {
//     selectedQuantityId:number
//     selectedQuantityLevel:number
//     selectedUnitId:number
//     quantity:number
//     fees:FeesInfo[]
// }
// export class FeesInfo
// {
//     selectedFeeTypeId:number
//     amount:number
// }


export class InvoicePartInfo
{
    partname:string
    feeTypes: FeeType[]
}
export class FeeType
{
    selectedFeeTypeId:number
    feeTypename: string
    quantityInfo:QtyInfo[]
}
export class QtyInfo
{
    quantity:number
    unit:string
    amount:number
}