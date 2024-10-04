import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild, OnDestroy, ElementRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ConfirmationService
} from 'primeng/api';
import {
  ToastrService
} from 'ngx-toastr';
import * as moment from 'moment';
import {
  MasterService
} from '../../../../core/services/master/master.service';
import {
  ITerritoryClassificationModel,
  CloneRfqViewModel
} from '../../../../core/models/rfqModel';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';
import {
  IQuantityUnit
} from '../../../../core/models/globalMaster';

@Component({
  selector: 'app-clone-rfq',
  templateUrl: './clone-rfq.component.html',
  styleUrls: ['./clone-rfq.component.scss'],
  providers: [ CloneRfqViewModel]
})
export class CloneRfqComponent implements OnInit, OnDestroy {
  cloneDeliveryDate: string;
  minDate: Date;
  cloneForm: FormGroup;
  ITerritoryClassificationModelArray: ITerritoryClassificationModel[];
  @Input('id') rfqId: number;
  DeliveryDate: any;
  quotesNeededDate: any;
  estimationAwradDate: any;
  currentURl: any;
  awardMinDate: Date;
  minDeliveryDate:Date;
  iQuantityUnitColl: IQuantityUnit[];
  toShowUnit: boolean = false;
  isSubmit: boolean = false;
  tempModel: any;
  // @ViewChild('cloneModel',{ read: ElementRef }) cloneModel: TemplateRef < any > ;
  @ViewChild('cloneModel',{static: true}) cloneModel: TemplateRef < any > ;
  updatedRfq: any;
  updatedencryptedRfqID: any;
  encryptedRfqID: any;

  constructor(private _masterService: MasterService, private _router: ActivatedRoute, private _toastr: ToastrService, private cloneRfqViewModel: CloneRfqViewModel, private _profileService: ProfileService, private _rfqService: RfqService, private formBuilder: FormBuilder, private router: Router, private modalService: NgbModal) {
    this.currentURl = '';
    this.getTerritory();
  }

  ngOnInit() {
    this.iQuantityUnitColl = [];
    this.currentURl = this.router.url;
    this.openModal();
    this.initModel();
    this.getQuantity();
    this.getCloneModelDetails();
    this.configDatePicker();

  }
  openModal() {
    this.tempModel = this.modalService.open(this.cloneModel, {
      backdrop: 'static',
    });
  }
  getQuantity() {
    if (this.iQuantityUnitColl.length === 0) {
      this._masterService.getQuantityUnit().subscribe(
        (data: IQuantityUnit[]) => {
          this.iQuantityUnitColl = data;
          this.iQuantityUnitColl.sort((a, b) => {
            const textA = a.value.toUpperCase();
            const textB = b.value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.iQuantityUnitColl.unshift(
            (this.iQuantityUnitColl).splice(
              (this.iQuantityUnitColl).findIndex(
                elt => elt.id === 92),
              1)[0]);
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }
  }

  getCloneModelDetails() {
    this._rfqService.getCloneModelDetails(this.rfqId).subscribe(res => {
      if (res['isError'] == false) {
        this.DeliveryDate = res['data'].deliveryDate;
        this.quotesNeededDate = res['data'].quotesNeededBy;
        this.estimationAwradDate = res['data'].awardDate;
        this.configDatePicker()
        if (!res['data'].isValidAllPartUnit) {
          this.toShowUnit = true;
        } else {
          this.toShowUnit = false;
        }
        this.initModel();
        if (res['data'].manufacturingLocationId != null) {
          this.cloneForm.patchValue({
            'region': res['data'].manufacturingLocationId
          });
        }
        if (this.DeliveryDate !== null) {
          this.DeliveryDate = moment.utc(this.DeliveryDate).toDate();
          this.cloneForm.patchValue({
            'partDeliveryDate': this.DeliveryDate
          });
        }
        if (this.quotesNeededDate !== null) {
          this.quotesNeededDate = moment.utc(this.quotesNeededDate).toDate();
          this.awardMinDate = this.quotesNeededDate;
          this.awardMinDate.setDate(this.awardMinDate.getDate());
          this.cloneForm.patchValue({
            'quotesNeededByDate': this.quotesNeededDate
          });
        }
        if (this.estimationAwradDate !== null) {
          this.estimationAwradDate = moment.utc(this.estimationAwradDate).toDate();
          this.cloneForm.patchValue({
            'estimatedAwardDate': this.estimationAwradDate
          });
        }
      }
    }, error => {})
  }

  initModel() {
    if (this.toShowUnit === true) {
      this.cloneForm = this.formBuilder.group({
        rfqName: ['', Validators.required],
        partDeliveryDate: ['', Validators.required],
        quotesNeededByDate: ['', Validators.required],
        estimatedAwardDate: ['', Validators.required],
        region: ['', [Validators.required]],
        unit: ['', [Validators.required]],
      });
    } else {
      this.cloneForm = this.formBuilder.group({
        rfqName: ['', Validators.required],
        partDeliveryDate: ['', Validators.required],
        quotesNeededByDate: ['', Validators.required],
        estimatedAwardDate: ['', Validators.required],
        region: ['', [Validators.required]],
        unit: [''],
      });
    }
  }

  onDeliveryDateChange() {
    this.DeliveryDate = this.cloneForm.value.partDeliveryDate;
  }

  onDateChange(date) {
    if (date === 'quotes') {
      this.awardMinDate = new Date(this.cloneForm.value.quotesNeededByDate);
      this.awardMinDate.setDate(this.awardMinDate.getDate());
      this.cloneForm.patchValue({
        'estimatedAwardDate': ''
      });
    }
    if (date === 'Award') {
      if (this.cloneForm.value.quotesNeededByDate === null) {
        this._toastr.warning('Please select Quotes needed by Date first', 'Warning!');
        this.cloneForm.patchValue({
          'estimatedAwardDate': ''
        });
      } else {
        this.awardMinDate = new Date(this.cloneForm.value.quotesNeededByDate);
        this.awardMinDate.setDate(this.awardMinDate.getDate());
        this.minDeliveryDate =  new Date(this.cloneForm.value.estimatedAwardDate);
        this.minDeliveryDate.setDate(this.minDeliveryDate.getDate());
        this.cloneForm.patchValue({
          'partDeliveryDate': ''
        });
      }
    }
    if (date === 'Delivery') {
      if (this.cloneForm.value.partDeliveryDate === null) {
        this._toastr.warning('Please select Delivery Date', 'Warning!');
      } else {
        this.minDeliveryDate =  new Date(this.cloneForm.value.estimatedAwardDate);
        this.minDeliveryDate.setDate(this.minDeliveryDate.getDate());
      }
    }
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  onSubmit(isEdit) {
    if (!this.isSubmit) {
      this.isSubmit = true;
      this.cloneRfqViewModel.rfqId = this.rfqId;
      this.cloneRfqViewModel.contactId = this.loggedId;
      this.cloneRfqViewModel.rfqName = this.cloneForm.value.rfqName.trim();

      let temDeliveryDate = moment(this.cloneForm.value.partDeliveryDate).hours(23).minutes(59).seconds(59);
      this.cloneDeliveryDate = moment.utc(temDeliveryDate).format('YYYY-MM-DD HH:mm:ss');
      this.cloneRfqViewModel.deliveryDate = this.cloneDeliveryDate;

      let temQuotesNeededByDate = moment(this.cloneForm.value.quotesNeededByDate).hours(23).minutes(59).seconds(59);
      let cloneQuotesNeededDate = moment.utc(temQuotesNeededByDate).format('YYYY-MM-DD HH:mm:ss');
      this.cloneRfqViewModel.quotesNeededBy = cloneQuotesNeededDate;

      let temEstimatedAwardDate = moment(this.cloneForm.value.estimatedAwardDate).hours(23).minutes(59).seconds(59);
      let cloneAwardedDate = moment.utc(temEstimatedAwardDate).format('YYYY-MM-DD HH:mm:ss');
      this.cloneRfqViewModel.awardDate = cloneAwardedDate;

      this.cloneRfqViewModel.manufacturingLocationId = this.cloneForm.value.region;
      (isEdit === 'yes') ? this.cloneRfqViewModel.isEdit = true : this.cloneRfqViewModel.isEdit = false;

      if (this.toShowUnit) {
        this.cloneRfqViewModel.quantityUnitId = this.cloneForm.value.unit;
      } else {
        this.cloneRfqViewModel.quantityUnitId = 0;
      }

      this._rfqService.cloneCurrentRFQ(this.cloneRfqViewModel).subscribe(
        result => {
          if (result['result'] === true) {
            this._toastr.success(result['errorMessage'], 'Success!');
            this.updatedRfq = result.rfqId;
            this.encryptedRfqID = this._profileService.encrypt(this.updatedRfq);
            localStorage.setItem('encryptedRfqID', this.encryptedRfqID)
            this.sendEncryptedId();
            if (isEdit === 'yes') {
              this._profileService.getConfigCatData().subscribe(rfqForm2Enabled=>{
                if(rfqForm2Enabled && result["rfqFormVersion"]===2){
                  this._rfqService.redirectToNewBuyer("rfq/buyer" , "rfqId="+encodeURIComponent(this._profileService.encrypt(result['rfqId']).toString()));
                  }else{
                    localStorage.setItem('EditRfqId', result.rfqId);
                    this.router.navigate(['/rfq/editrfq']);
                    if (this.currentURl !== '/rfq/editrfq') {
                      this._rfqService.setCloneClose(true);
                    } else {
                      this._rfqService.setEditCloneClose(true);
                    }
                  }
              });
             
            } else {
              this._rfqService.setCloneClose(true);
              this.router.navigateByUrl('/rfq/myrfq');
            }
            this.isSubmit = false;
          } else {
            this._rfqService.setCloneClose(true);
            this.isSubmit = false;
            this._toastr.error(result.errorMessage, 'Error!');
          }
        },
        error => {
          this.isSubmit = false;
          this._rfqService.handleError(error);
        }
      );
    }
  }
  sendEncryptedId(){
    this.updatedencryptedRfqID = localStorage.getItem('encryptedRfqID')
    var reqData = {
        "rfqId": this.updatedRfq,
        "encryptedRfqId" : this.updatedencryptedRfqID
    }
      this._rfqService.sendEncryptedRfqId(reqData).subscribe((result: any) => {
        console.log(result ,"Called Sended Encrypted ID");
        
      });
    
  }
  onClose() {
    if (this.currentURl !== '/rfq/editrfq') {
      this._rfqService.setCloneClose(false);
    } else {
      this._rfqService.setEditCloneClose(false);
    }
  }

  ngOnDestroy(){
    if(this.tempModel != null && this.tempModel != undefined){
      this.tempModel.close();
    }
  }

  configDatePicker() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.awardMinDate = new Date();
    this.awardMinDate.setDate(this.awardMinDate.getDate());
    // deliveryMIndate
    this.minDeliveryDate = new Date();
    this.minDeliveryDate.setDate(this.minDeliveryDate.getDate());
    if(this.DeliveryDate!== null){
    this.minDeliveryDate = new Date(this.estimationAwradDate);
    this.minDeliveryDate.setDate(this.minDeliveryDate.getDate());
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.cloneForm.controls;
  }

  getTerritory() {
    this._masterService.GetTerritoryClassification().subscribe(
      (data2: ITerritoryClassificationModel[]) => {
        this.ITerritoryClassificationModelArray = data2.filter(x => x.territoryClassificationId !== 0 && x.territoryClassificationId !== 7 );
      },
      error => () => {
      },
    );
  }

  checkRfqWarning() {
    let isRestrictRfqEncrypt = localStorage.getItem('restrictRfq');
    let isRestrictRfqDecrypt = this._profileService.decrypt(isRestrictRfqEncrypt);
    if (isRestrictRfqDecrypt == 'true') {
      return true;
    } else {
      return false;
    }
  }

}
