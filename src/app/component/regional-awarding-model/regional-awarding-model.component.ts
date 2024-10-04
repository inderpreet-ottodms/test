import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MasterService } from '../../core/services/master/master.service';
import { ITerritoryClassificationModel, BuyerRegionalAwardingRfqViewModel } from '../../core/models/rfqModel';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { ProfileService } from '../../core/services/profile/profile.service';

@Component({
  selector: 'app-regional-awarding-model',
  templateUrl: './regional-awarding-model.component.html',
  styleUrls: ['./regional-awarding-model.component.scss']
})
export class RegionalAwardingModelComponent implements OnInit, OnDestroy {
  @ViewChild('regionModel',{static: true}) editModal: TemplateRef < any > ;
  @Input('rfqIdList') rfqIdList;
  @Output('closeEvent') closeEvent = new EventEmitter < boolean > ();
  modelRef: any;
  locationId:any;
  rfqList: BuyerRegionalAwardingRfqViewModel[];
  isLoader: boolean = false;
  iTerritoryClassificationModel: any[];
  selectedRfqId: number = 0;
  constructor( private modalService: NgbModal, private _masterService: MasterService, private _rfqService: RfqService,private router: Router, private _profileService: ProfileService) { }

  ngOnInit() {
    // console.log('id',this.rfqIdList);
    this.locationId = 0;
    this.isLoader = true;
    this.rfqList = [];
    this.openModal();
    this.getTerritoryClassification();
  }
  getTerritoryClassification(){
    this._masterService.getRfqTerritory(this.rfqIdList).subscribe(
      response => {
        // console.log(response);
        if(!response.isError){
          this.iTerritoryClassificationModel = response.data;
          this.iTerritoryClassificationModel.forEach( x=> {
            this.getRfqList(x.rfqId,x.territoryClassificationId)
          });
        }
        this.isLoader = false;
      },
      error => {
        this.isLoader = false;
      },
    );
  }
  getRfqList(rfqId, locationId){
    // this.isLoader = true;
    this.locationId = locationId;
    this._rfqService.getRFQLocationList(rfqId,locationId).subscribe(
      response=>{
        if(!response.isError){
          this.rfqList.push(response.data);
          this.rfqList.sort((a,b) => (a.rfqId > b.rfqId) ? 1 : ((b.rfqId > a.rfqId) ? -1 : 0)); 
          // this.isLoader = false;
        } else{
          // this.isLoader = false;
        }
      },
      error => {
        // this.isLoader = false;
      }
    );
  }
  redirectToRfqQuote()
  {
    this.closeModel()
    let isQuoteEncypt = this._profileService.encrypt(JSON.stringify(true));
    sessionStorage.setItem('isRedirectFromRegionalModel' ,'true');
    const encryptedRfqID = this._profileService.encrypt(this.selectedRfqId);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID,
        qt: isQuoteEncypt
      }
    });
  }
  openModal() {
    if(this.modelRef === undefined || this.modelRef === null ){
      this.modelRef = this.modalService.open(this.editModal, {
        backdrop: 'static',
        size: 'lg',
        keyboard:false
      });
    }
  }
  closeModel(){
    this.modelRef.close();
    this.closeEvent.emit(false);
  }
  ngOnDestroy() {
    if(this.modelRef !== undefined && this.modelRef !== null && this.modelRef !== '' ){
      this.modelRef.close();
    }
  }

}
