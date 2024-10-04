import { Component, OnInit, OnDestroy } from '@angular/core';
import {IMarkSupplierRFQViewModel } from '../../../../core/models/rfqModel';
import { SupplierService } from '../../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../../../core/services/rfq/rfq.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ProfileService } from '../../../../core/services/profile/profile.service';

@Component({
  selector: 'app-dash-active-rfq',
  templateUrl: './dash-active-rfq.component.html',
  styleUrls: ['./dash-active-rfq.component.scss']
})
export class DashActiveRfqComponent implements OnInit, OnDestroy {
  iRFQViewModelColl: IMarkSupplierRFQViewModel[];
  isLoader: boolean;
  totalRfq: number;
  isRfqAvailable: boolean;
  cloneRfqId: number;
  cloneContactId: number;
  cloneDeliveryDate: string;
  display: boolean;
  cloneRfqName: string;
  defaultAwsPath = '';
  toggle: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  toggle6: boolean;
  minDate: Date;
  id:any;
  name:any;
  manufacturingLocId:any;
  isCloneModel:boolean;
  constructor( private _SupplierService: SupplierService , private _toastr: ToastrService ,
    private _rfqService: RfqService , private router: Router, private _ProfileService: ProfileService) {
      this.isRfqAvailable = true;
    this.totalRfq = 0;
    this.cloneRfqId = 0;
    this.cloneContactId = 0;
    this.cloneDeliveryDate= '',
    this.display = false;
    this.isLoader =  true;
    this.iRFQViewModelColl = [];
    this.toggle = false;
    this.toggle2 = false;
    this.toggle3= false;
    this.toggle4 = false;
    this.toggle5 = false;
    this.toggle6 = false;
    this.isCloneModel=false;
    this.manufacturingLocId=0;
   }

  ngOnInit() {
    this.isCloneOpen();
    this.configDatePicker();
    this.getRfqList();
  }
  configDatePicker() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    // this.awardMinDate = new Date();
    // this.awardMinDate.setDate(this.awardMinDate.getDate());
  }
  // API Call Function
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }


  getRfqList() {
    if (!isNaN(this.loggedCompanyId)) {
      this._SupplierService.GetBuyerRFQList(this.loggedId, this.loggedCompanyId, 7).subscribe(
        result => {
          if (result['result'] === true ) {
            this.iRFQViewModelColl = result['data'].slice(0, 10);
            if (this.iRFQViewModelColl.length !== 0) {
              this.totalRfq = this.iRFQViewModelColl.length;
              this.isLoader = false;
              this.isRfqAvailable = true;
            } else {
              this.totalRfq = 0;
              this.isRfqAvailable = false;
              this.isLoader = false;
            }
          } else {
              this.totalRfq = 0;
              this.isLoader = false;
              this.isRfqAvailable = false;
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
    }
  }
  redirectToEditRfq(rfqToEdit) {
    const encryptedRfqID = this._ProfileService.encrypt(rfqToEdit.rfqId);
    this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
      if (rfqForm2Enabled && rfqToEdit.rfqFormVersion === 2) {
        this.router.navigate(["/rfq/buyer"], { queryParams: { rfqId: encryptedRfqID }}); 
      }else{
        localStorage.setItem('EditRfqId', rfqToEdit.rfqId);
      localStorage.setItem('EditRfqName', rfqToEdit.rfqName);
      this._rfqService.set(rfqToEdit.rfqId, 'editRfqId');
      this._rfqService.set(rfqToEdit.rfqName, 'editRfqName');
        this.router.navigate(['/rfq/editrfq'], { queryParams: { rfqId: encryptedRfqID }}); 
      }
    });
  }
  editRfq() {
    const rfq=this.iRFQViewModelColl.find(rfq=>{
      return rfq["rfqId"]===this.id;
    });
    this.redirectToEditRfq(rfq);
  }
  cloneRfq (RfqIdT, contactIdT) {
    this.cloneRfqName= '';
    this.cloneDeliveryDate = '';
    this.cloneRfqId = RfqIdT;
    this.cloneContactId = contactIdT;
    this.display = true;
  }
  isvalid() {
    if(this.cloneRfqName!== '' && this.cloneDeliveryDate!=='') {
      return false;
    } else {
      return true;
    }
  }
  // submitClone() {
  //   this.cloneDeliveryDate = moment.utc(this.cloneDeliveryDate).format('YYYY-MM-DD HH:mm:ss');
  //   this._rfqService.cloneCurrentRFQ(this.cloneRfqName, this.cloneRfqId, this.loggedId ,this.cloneDeliveryDate).subscribe(
  //     result => {
  //       if (result['result'] === true ) {
  //         this.display = false;
  //         this.getRfqList();
  //         this._toastr.success(result['errorMessage'], '');
  //       } else {
  //         this._toastr.error(result.errorMessage, 'Error!');
  //         // console.log(result.errorMessage);
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     }
  //   );
  // }
  detailRfq(id) {
    // localStorage.setItem('detailRfqId', id);
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], { queryParams: { rfqId: encryptedRfqID }});
  }
  rfqDetailDrawer(id) {
    // console.log('id', id);
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'rfqDetailDrawer');
    this._rfqService.set(id, 'rfqId');
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'showSidePanel');
  }
  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }

  sortMessage(tab) {
    switch (tab) {
      case 'Material': {
        if ( this.toggle) {
        this.iRFQViewModelColl.sort((b, a) => a.partsMaterialName.localeCompare(b.partsMaterialName));
        } else {
          this.iRFQViewModelColl.sort((b, a) =>  b.partsMaterialName.localeCompare(a.partsMaterialName));
        }
        this.toggle = !this.toggle;
        break;
      }

      case 'Post Process': {
        if ( this.toggle2) {
        this.iRFQViewModelColl.sort((b, a) => a.postProductionProcessName.localeCompare(b.postProductionProcessName));
        } else {
          this.iRFQViewModelColl.sort((b, a) => b.postProductionProcessName.localeCompare(a.postProductionProcessName));
        }
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Process': {
        if ( this.toggle3) {
        this.iRFQViewModelColl.sort((b, a) => a.partCategoryName.localeCompare(b.partCategoryName));
        } else {
          this.iRFQViewModelColl.sort((b, a) => b.partCategoryName.localeCompare(a.partCategoryName));
        }
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Closes': {
        if ( this.toggle4) {
        this.iRFQViewModelColl.sort((b, a) => new Date(a.quotesNeededBy).getTime() - new Date(b.quotesNeededBy).getTime());
        } else {
          this.iRFQViewModelColl.sort((b, a) => new Date(b.quotesNeededBy).getTime() - new Date(a.quotesNeededBy).getTime());
        }

        this.toggle4 = !this.toggle4;
        break;
      }

      case 'Quantity': {
        if ( this.toggle5) {
        this.iRFQViewModelColl.sort((b, a) => a.partQty - b.partQty);
        } else {
          this.iRFQViewModelColl.sort((b, a) =>b.partQty - a.partQty);
        }
        this.toggle5 = !this.toggle5;
        break;
      }

      case 'Status': {
        if ( this.toggle6) {
          this.iRFQViewModelColl.sort((b, a) => a.rfqStatus.localeCompare(b.rfqStatus));
          } else {
            this.iRFQViewModelColl.sort((b, a) => b.rfqStatus.localeCompare(a.rfqStatus));
          }
          this.toggle6 = !this.toggle6;
          break;
      }
    }
}
setRfqDetail(id, Name) {
  this.id = id;
  this.name = Name;

}
cloneModel(id,manufacturingLocationId,deliveryDate){
  this.isCloneModel=true;
  this.manufacturingLocId=manufacturingLocationId;
  this.cloneRfqId=id;
  this.cloneDeliveryDate=deliveryDate;
}

isCloneOpen() {
this._rfqService.getCloneClose().subscribe(res=>{
  if(res['text']===true){
     this.isCloneModel=false;
     this._rfqService.setCloneClose(false);
  } else {
    this.isCloneModel=false;
  }
})

}
moveToCreatRfq(){  
  this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
    if(rfqForm2Enabled){
      this.router.navigateByUrl('/rfq/buyer');      
    }else{
    this.router.navigateByUrl('/rfq/editrfq');
  }
  });
}  
}
