import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  AwardingModelQuoteDetailsViewModel,
  AwardingModelQuoteDetailsRequestViewModel,
  IRFQPartQuantityQuote,
  AwardRequestModel,
  AwardPartQuatityRequestModel
} from '../../../../../core/models/rfqModel';
// import {
//   error
// } from 'util';
import {
  ToastrService
} from 'ngx-toastr';
import { IQuantityUnit } from '../../../../../core/models/globalMaster';
import { MasterService } from '../../../../../core/services/master/master.service';

@Component({
  selector: 'app-rfq-award-model',
  templateUrl: './rfq-award-model.component.html',
  styleUrls: ['./rfq-award-model.component.scss']
})
export class RfqAwardModelComponent implements OnInit {
  isAward: boolean = true;
  isLoader: boolean = true;
  @Output() closeModelEventHandler = new EventEmitter < any > ();
  @Input('rfqId') rfqId: any;
  supplierList: any = [];
  awardingModelQuoteDetailsViewModel: AwardingModelQuoteDetailsViewModel[] = [];
  awardingModelQuoteDetailsRequestViewModel: AwardingModelQuoteDetailsRequestViewModel;
  awardQuoteIds = [];
  awardRequestModel: AwardRequestModel;
  AwardPartQuatityRequestModel = new AwardPartQuatityRequestModel()
  iQuantityUnitColl: IQuantityUnit[]=[];
  isBtnDisabledAfterOneClick:boolean=false;
  constructor(private _rfqService: RfqService, private _masterService: MasterService,
     private _toastr: ToastrService) {}

  ngOnInit() {
    this.getUnit();
    this.awardRequestModel = new AwardRequestModel();
    this.getAwardingModelQuotePartData();
    // this.getSupplierList();
  }

  getUnit() {
      this._masterService.getQuantityUnit().subscribe(
        (data: IQuantityUnit[]) => {
          this.iQuantityUnitColl = data;
        })
      }
 getSupplierList(rfqPartId) {
  return new Promise((resolve, reject) => {
    this._rfqService.getSupplierList(this.rfqId,rfqPartId).subscribe(
      response => {
        if (!response.isError) {
        resolve(response.data);
        } else {
          reject([]);
        }
      }
    ),error =>{
      reject([]);
    };
    })
  }

  getAwardingModelQuotePartData() {
    this.awardingModelQuoteDetailsViewModel = [];
    this._rfqService.getAwardingModelQuotePartData(this.rfqId).subscribe(
      response => {
        if (!response.isError) {
          this.isLoader = false;
          this.awardingModelQuoteDetailsViewModel = response.data;
          this.awardingModelQuoteDetailsViewModel.forEach((item) => {
            item.rfqQuoteItemList = [];
            item.isRfqStatus = false;
            item.price = 0;
            item.unit = '';
            item.awardedUnitTypeId=14;
            item.supplierList=[];
           this.getSupplierList(item.rfqPartId).then(res=>{
            item.supplierList=res;
           })

          })
        } else {
          this.isLoader = false;
        }
      }, error => {
        this.isLoader = false;
      }
    );

  }
  getAwardingModelQuoteQuantityData(manufId, PartData, index) {
    let data = this.awardingModelQuoteDetailsViewModel[index].supplierList.find(x => x.id == manufId);
    let isRfqStatus;
    if(data){
      isRfqStatus = data.isRfqStatus;
    }
    this.isLoader = true;
    if (manufId != null && manufId != 'null' && isRfqStatus == false) {

      this.awardingModelQuoteDetailsViewModel[index].isRfqStatus = false;
      this.awardingModelQuoteDetailsRequestViewModel = new AwardingModelQuoteDetailsRequestViewModel();
      this.awardingModelQuoteDetailsRequestViewModel.rfqId = this.rfqId;
      this.awardingModelQuoteDetailsRequestViewModel.rfqPartId = PartData.rfqPartId;
      this.awardingModelQuoteDetailsRequestViewModel.contactIds[0] = manufId;
      this.awardingModelQuoteDetailsRequestViewModel.isRfqResubmitted = false;
      this.awardingModelQuoteDetailsRequestViewModel.quantityLevel = 0;
      this._rfqService.getAwardingModelQuoteQuantityData(this.awardingModelQuoteDetailsRequestViewModel).subscribe(res => {
        if (res['result'] == true) {
          this.isLoader = false;
          if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0 &&
            this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {
            this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.forEach((item) => {
              if (this.awardRequestModel.rfqQuoteItemList.length != 0) {
                this.awardRequestModel.rfqQuoteItemList.forEach((x, index) => {
                  if (x.rfqQuoteItemsId == item.rfqQuoteItemsId) {
                    this.awardRequestModel.rfqQuoteItemList.splice(index, 1);
                  }
                })
              }

            })

          }
          let nonMfgIndex = this.awardRequestModel.rfqQuoteItemList.findIndex( x=>x.rfqPartStatusId == this.awardingModelQuoteDetailsViewModel[index].manufacturerId);
          if(nonMfgIndex !=-1) {
            this.awardRequestModel.rfqQuoteItemList.splice(nonMfgIndex, 1);
          }
          this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList = res.data.rfqQuoteItemList;
          this.awardingModelQuoteDetailsViewModel[index].noOfStars = res.data.noOfStars;
          this.awardingModelQuoteDetailsViewModel[index].manufacturerId = manufId;
          if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length == 1 &&
            this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {
            this.onSelectQuantity(this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList[0].rfqQuoteItemsId, index);
          }
        } else {
          this.isLoader = false;
        }
      }, error => {
        this.isLoader = false;
      })
    }  else  if (manufId != null && manufId != 'null' && isRfqStatus == true) {
      let nonMfgIndex = this.awardRequestModel.rfqQuoteItemList.findIndex( x=>x.rfqPartStatusId == this.awardingModelQuoteDetailsViewModel[index].manufacturerId);
      if(nonMfgIndex !=-1) {
        this.awardRequestModel.rfqQuoteItemList.splice(nonMfgIndex, 1);
      } else {
        if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0 &&
          this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {
          this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.forEach((item) => {
            if (this.awardRequestModel.rfqQuoteItemList.length != 0) {
              let i = this.awardRequestModel.rfqQuoteItemList.findIndex(x=>x.rfqQuoteItemsId == item.rfqQuoteItemsId);
              if(i !=-1) {
                this.awardRequestModel.rfqQuoteItemList.splice(i, 1);
              }
            }

          })

        }
      }
      this.awardingModelQuoteDetailsViewModel[index].isRfqStatus = true;
      this.awardingModelQuoteDetailsViewModel[index].manufacturerId = manufId;
      this.awardingModelQuoteDetailsViewModel[index].unit = null;
      this.awardingModelQuoteDetailsViewModel[index].price = null;
      if (manufId == 18) {
        this.awardingModelQuoteDetailsViewModel[index].unit = 0;
        this.awardingModelQuoteDetailsViewModel[index].price = 0;
        this.AwardPartQuatityRequestModel = new AwardPartQuatityRequestModel();
        this.AwardPartQuatityRequestModel.rfqQuoteItemsId = null;
        this.AwardPartQuatityRequestModel.rfqPartStatusId = this.awardingModelQuoteDetailsViewModel[index].manufacturerId;
        this.AwardPartQuatityRequestModel.unit = this.awardingModelQuoteDetailsViewModel[index].unit;
        this.AwardPartQuatityRequestModel.price = this.awardingModelQuoteDetailsViewModel[index].price;
        this.AwardPartQuatityRequestModel.isRfqStatus = true;
        this.AwardPartQuatityRequestModel.rfqPartId = this.awardingModelQuoteDetailsViewModel[index].rfqPartId;
        this.AwardPartQuatityRequestModel.awardedUnitTypeId=this.awardingModelQuoteDetailsViewModel[index].awardedUnitTypeId;
        this.awardRequestModel.rfqQuoteItemList.push(this.AwardPartQuatityRequestModel);
      } else {
        this.AwardPartQuatityRequestModel = new AwardPartQuatityRequestModel();
        this.AwardPartQuatityRequestModel.rfqQuoteItemsId = null;
        this.AwardPartQuatityRequestModel.rfqPartStatusId = this.awardingModelQuoteDetailsViewModel[index].manufacturerId;
        this.AwardPartQuatityRequestModel.unit = this.awardingModelQuoteDetailsViewModel[index].unit;
        this.AwardPartQuatityRequestModel.price = this.awardingModelQuoteDetailsViewModel[index].price;
        this.AwardPartQuatityRequestModel.isRfqStatus = true;
        this.AwardPartQuatityRequestModel.rfqPartId = this.awardingModelQuoteDetailsViewModel[index].rfqPartId;
        this.AwardPartQuatityRequestModel.awardedUnitTypeId=this.awardingModelQuoteDetailsViewModel[index].awardedUnitTypeId;
        this.awardRequestModel.rfqQuoteItemList.push(this.AwardPartQuatityRequestModel);
      }

      this.isLoader = false;
    } else if (manufId == null || manufId == 'null') {
      this.awardingModelQuoteDetailsViewModel[index].isRfqStatus=false;
      let nonMfgIndex = this.awardRequestModel.rfqQuoteItemList.findIndex(x=>x.rfqPartId == this.awardingModelQuoteDetailsViewModel[index].rfqPartId);
      if(nonMfgIndex !=-1) {
        this.awardRequestModel.rfqQuoteItemList.splice(nonMfgIndex, 1);
      } else {
        if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0 &&
          this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {
          this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.forEach((item) => {
            if (this.awardRequestModel.rfqQuoteItemList.length != 0) {
              let i = this.awardRequestModel.rfqQuoteItemList.findIndex(x=>x.rfqQuoteItemsId == item.rfqQuoteItemsId);
              if(i !=-1) {
                this.awardRequestModel.rfqQuoteItemList.splice(i, 1);
              }
            }

          })

        }
      }

      this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList = [];
      this.awardingModelQuoteDetailsViewModel[index].noOfStars = 0;
      this.awardingModelQuoteDetailsViewModel[index].manufacturerId = 0;
      this.isLoader = false;
    }



  }
  hidePopup() {
    this.isAward = false;
    this.closeModelEventHandler.emit(true);
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  onSelectQuantity(rfqQuoteItemsId, index) {
    let rfqQuoteItemsIdIndex = this.awardRequestModel.rfqQuoteItemList.findIndex(x => x == rfqQuoteItemsId);
    if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null &&
      this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined &&
      this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0) {
      this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.forEach((item) => {
        if (item.rfqQuoteItemsId == rfqQuoteItemsId && rfqQuoteItemsId != null && rfqQuoteItemsId != "null" &&
          rfqQuoteItemsIdIndex == -1) {
          this.AwardPartQuatityRequestModel = new AwardPartQuatityRequestModel();
          this.AwardPartQuatityRequestModel.rfqQuoteItemsId = rfqQuoteItemsId;
          this.AwardPartQuatityRequestModel.rfqPartStatusId = null;
          this.AwardPartQuatityRequestModel.rfqPartId = null;
          this.AwardPartQuatityRequestModel.unit = null;
          this.AwardPartQuatityRequestModel.price = null;
          this.AwardPartQuatityRequestModel.isRfqStatus = false;
          this.awardRequestModel.rfqQuoteItemList.push(this.AwardPartQuatityRequestModel);

        } else {
          if ((rfqQuoteItemsId == null || rfqQuoteItemsId == "null") && this.awardRequestModel.rfqQuoteItemList.length != 0) {
            this.awardRequestModel.rfqQuoteItemList.forEach((x, index) => {
              if (x.rfqQuoteItemsId == item.rfqQuoteItemsId) {
                this.awardRequestModel.rfqQuoteItemList.splice(index, 1);
              }
            })


          }





        }

      })


    } else {
      let nonMfgIndex = this.awardRequestModel.rfqQuoteItemList.findIndex( x=>x.rfqPartStatusId == this.awardingModelQuoteDetailsViewModel[index].manufacturerId);
      if(nonMfgIndex !=-1) {
        this.awardRequestModel.rfqQuoteItemList.splice(nonMfgIndex, 1);
      }
    }

  }

  onKey(index) {
    if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0 &&
      this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {
      this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.forEach((item) => {
        if (this.awardRequestModel.rfqQuoteItemList.length != 0) {
          this.awardRequestModel.rfqQuoteItemList.forEach((x, index) => {
            if (x.rfqQuoteItemsId == item.rfqQuoteItemsId) {
              this.awardRequestModel.rfqQuoteItemList.splice(index, 1);
            }
          })
        }

      })

    }
    let nonMfgIndex = this.awardRequestModel.rfqQuoteItemList.findIndex(x => x.rfqPartStatusId == this.awardingModelQuoteDetailsViewModel[index].manufacturerId && x.rfqPartId == this.awardingModelQuoteDetailsViewModel[index].rfqPartId);
    if ( nonMfgIndex == -1) {
      this.AwardPartQuatityRequestModel = new AwardPartQuatityRequestModel();
      this.AwardPartQuatityRequestModel.rfqQuoteItemsId = null;
      this.AwardPartQuatityRequestModel.rfqPartStatusId = this.awardingModelQuoteDetailsViewModel[index].manufacturerId;
      this.AwardPartQuatityRequestModel.unit = this.awardingModelQuoteDetailsViewModel[index].unit;
      this.AwardPartQuatityRequestModel.price = this.awardingModelQuoteDetailsViewModel[index].price;
      this.AwardPartQuatityRequestModel.isRfqStatus = true;
      this.AwardPartQuatityRequestModel.rfqPartId = this.awardingModelQuoteDetailsViewModel[index].rfqPartId;
      this.AwardPartQuatityRequestModel.awardedUnitTypeId=this.awardingModelQuoteDetailsViewModel[index].awardedUnitTypeId;
      this.awardRequestModel.rfqQuoteItemList.push(this.AwardPartQuatityRequestModel);

    } else if (nonMfgIndex != -1) {
      let data = this.awardRequestModel.rfqQuoteItemList.find(x => x.rfqPartStatusId == this.awardingModelQuoteDetailsViewModel[index].manufacturerId && x.rfqPartId == this.awardingModelQuoteDetailsViewModel[index].rfqPartId);
      data.unit = this.awardingModelQuoteDetailsViewModel[index].unit;
      data.price = this.awardingModelQuoteDetailsViewModel[index].price;
      data.awardedUnitTypeId=this.awardingModelQuoteDetailsViewModel[index].awardedUnitTypeId;
    }
    // } else if ((this.awardingModelQuoteDetailsViewModel[index].unit == '' || this.awardingModelQuoteDetailsViewModel[index].price == '' || this.awardingModelQuoteDetailsViewModel[index].unit == null || this.awardingModelQuoteDetailsViewModel[index].price == null) &&
    //   nonMfgIndex != -1) {
    //   this.awardRequestModel.rfqQuoteItemList.splice(nonMfgIndex, 1);
    // }
  }

  awardPart() {
     this.isBtnDisabledAfterOneClick=true;
    // this.awardRFQPartQuantityQuote.rfqQuoteItemsIdList = this.awardQuoteIds;
    // this.awardRFQPartQuantityQuote.isAwrded = true;
    this.awardRequestModel.rfqId = this.rfqId;
    this.awardRequestModel.contactId = this.loggedId;
    this.awardRequestModel.isAwrded = true;
    this._rfqService.SetRFQQuoteStatus(this.awardRequestModel).subscribe(
      result => {
        if (result['result'] === true) {
          this._toastr.success('RFQ has been awarded', 'Success!');
          this._rfqService.setRfqAwardEvent(true);
          this._rfqService.set(true,'ismyrfqdataback');
          sessionStorage.setItem('isDetailAward','true');
          this.isAward = false;
          this.captureAwardRFQ();
          this.closeModelEventHandler.emit(true);
        } else {
          this.isAward = false;
          this.closeModelEventHandler.emit(true);
        }
      }, error => {
        this.isAward = false;
        this.closeModelEventHandler.emit(true);
      })

  }
  captureAwardRFQ(){
    this._rfqService.captureAwardRfqEvent(this.awardRequestModel).subscribe(
      result => {
        if (result['result'] === true) {
        }
      })
    }


  removePart(index) {
    this.onSelectQuantity(null, index);
    this.awardingModelQuoteDetailsViewModel.splice(index, 1);
    this._toastr.success('Part has been remove successfully', 'Success!');
  }
}
