import { Injectable } from "@angular/core";
@Injectable()
export class SupplierRFQLikeModel
{
    RfqSupplierLikesId : number
    RfqId : number
    CompanyId : number
    ContactId : number
    IsRfqLike : boolean
    IsRfqDisLike : boolean
    LikeDate : Date
}