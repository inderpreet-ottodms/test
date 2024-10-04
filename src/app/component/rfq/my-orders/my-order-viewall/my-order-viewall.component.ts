import { Component, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { RfqService } from "./../../../../core/services/rfq/rfq.service";
@Component({
  selector: "app-my-order-view-all",
  templateUrl: "./my-order-viewall.component.html",
  styleUrls: ["./my-order-viewall.component.scss"],
  providers: [ConfirmationService],
})
export class myOrderViewAllComponent implements OnInit {
  partTrackingStatus: any;
  partTracking1: any;
  reshapeUniqueId: any;
  rfqPartId: any;
  SupplierId: any;
  constructor(
    private _rfqService: RfqService,
    ) { 
    }

  ngOnInit() {  
    this.rfqPartId =  this._rfqService.get('rfqPartId');
    this.reshapeUniqueId = this._rfqService.get( 'reshapeUniqueId');
    this.SupplierId = this._rfqService.get( 'SupplierId');
    this._rfqService.getPoPartStatus(this.reshapeUniqueId,this.rfqPartId,this.SupplierId).subscribe((result: any) => {
      this.partTracking1 = result.details;
      });
  }


  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  isMyOrder() {
    return this._rfqService.get('rfqViewAllDrawer');
  }
  closeContactDrawer(){
    this._rfqService.set(false, "showSidePanel");
    this._rfqService.set(false, "rfqViewAllDrawer");
  }
}
