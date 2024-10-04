import { Component, OnInit, Input } from '@angular/core';
import { QmsService } from '../../../core/services/qms/qms.service';
import { IMQSViewModel } from '../../../core/models/supplierModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-my-customer-drawer',
  templateUrl: './my-customer-drawer.component.html',
  styleUrls: ['./my-customer-drawer.component.scss']
})
export class MyCustomerDrawerComponent implements OnInit {
  iContactModel: IMQSViewModel;
  isLoader:boolean;
  @Input() mqsContactIdEncrypt: string;

  constructor(private _qmsService: QmsService, private _supplierService: SupplierService) {
    this.isLoader = true;
  }

  ngOnInit() {
    this.initModels();
    this.GetMQSDetailsById();
  }
  ngOnChanges(changes) {
    this.GetMQSDetailsById();
  }


  initModels() {
    this.iContactModel = {
      qmsContactId: 0,
      supplierId: 0,
      company: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      stateId: 0,
      country: '',
      countryId: 0,
      zipCode: '',
      isActive: true,
      createdDate: '',
      mqsContactIdEncrypt: '',
      companynameWithSuppliername: '',
        stateName:'',
      countryName:''
    };
  }
  GetMQSDetailsById() {
    if(this.mqsContactIdEncrypt != undefined && this.mqsContactIdEncrypt != null) {
      this._qmsService.GetMQSDetailsById(this.mqsContactIdEncrypt).subscribe(result=>{
        if(result['result'] === true) {
        this.iContactModel = result['data'];
        this.isLoader = false;
     } else {
      this.isLoader = false;
     }
       },error=>{
        this.isLoader = false;
       });
    }

  }
  closeCompanyDrawer() {
    this._qmsService.set(false,'showSidePanel');
    this._qmsService.set(false,'isCompanyDrawer');
    this._supplierService.set(false,'isEditSide');
  }
}
