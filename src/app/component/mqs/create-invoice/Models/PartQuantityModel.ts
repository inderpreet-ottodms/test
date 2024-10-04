import { NgxSelectModel } from "../../../ngx-gen-select/ngxSelectModel";

export class PartQuantityModel
{
   selectedQuantityID: number
   otherQuantityValue: number
   selectedFeeTypeAndAmount: FeeTypeAndAmountModel
}
export class FeeTypeAndAmountModel
{
    selectedFeeTypeIDs: number
    amount: number
}
