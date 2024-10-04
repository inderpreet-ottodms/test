import { Component, Input, OnInit, Output, TemplateRef, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { BuyerCompanyFeedbackViewModel } from '../../core/models/supplierModel';
import { MasterService } from '../../core/services/master/master.service';
import { SupplierService } from '../../core/services/supplier/supplier.service';


@Component({
  selector: 'app-buyer-feedback-model',
  templateUrl: './buyer-feedback-model.component.html',
  styleUrls: ['./buyer-feedback-model.component.scss']
})
export class BuyerFeedbackModelComponent implements OnInit {
  isLoader:boolean = false;
  @ViewChild('buyerFeedbackModel',{static: true}) buyerFeedbackModel: TemplateRef < any > ;
  tempModel: any;
  @Input() companyName;
  @Input() companyId;
  @Output() modelCloseChange = new EventEmitter();
  @Output() modelChangeReload = new EventEmitter();
  buyerCompanyFeedbackViewModel = new BuyerCompanyFeedbackViewModel();
  form: FormGroup;
  items = [];
  selectedIds = [];
  isResponse: boolean = false;
  // [
  //   {key: 'item1', text: 'Non-responsive'},
  //   {key: 'item2', text: 'Wrong Number'},
  //   {key: 'item3', text: 'Invalid Email'},
  //   {key: 'item4', text: 'No Longer With Company'},
  // ];

  constructor(private modalService: NgbModal,private fb: FormBuilder, private _masterService: MasterService, private _supplierService: SupplierService, private _toastr: ToastrService,) { }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  ngOnInit() {
    this.isLoader = true;
    this.openModal();
    this.getBuyerFeedbackList();
    // this.getMasterFeedbackList();
  }
  getMasterFeedbackList(){
   this._masterService.getMasterFeedbackList().subscribe(
    response=>{
      if(!response.isError){
        this.items = response.data;
        this.setModelData();
      } else{
        this.isLoader = false;
      }
    },
    error=>{
      this.isLoader = false;
    }
    );
   
  }
  getBuyerFeedbackList(){
    this._supplierService.getBuyerSetFeedback(this.companyId, this.loggedId).subscribe(
      response=>{
        if(!response.isError){
          this.selectedIds = response.data;
        }
        this.getMasterFeedbackList();
      },
      error=>{
        this.getMasterFeedbackList();
      }
    );
  }
  setModelData(){
    // create checkbox group
    let checkboxGroup = new FormArray(this.items.map(item => new FormGroup({
      id: new FormControl(item.id),
      text: new FormControl(item.value),
      checkbox: new FormControl( (this.selectedIds.includes(item.id)) ? true: false )
    })));

    // create a hidden required formControl to keep status of checkbox group
    let hiddenControl = new FormControl(this.mapItems(checkboxGroup.value), Validators.required);
    // update checkbox group's value to hidden formcontrol
    checkboxGroup.valueChanges.subscribe((v) => {
      console.log(v);
      hiddenControl.setValue(this.mapItems(v));
    });

    this.form = new FormGroup({
      items: checkboxGroup,
      selectedItems: hiddenControl
    });
    this.isLoader = false;
  }
  mapItems(items) {
    let selectedItems = items.filter((item) => item.checkbox).map((item) => item.id);
    return selectedItems.length ? selectedItems : null;
  }
  submitFeedback(){
    if(!this.isResponse){
      this.isResponse = true;  
    this.buyerCompanyFeedbackViewModel.fromCompanyId = this.loggedCompanyId;
    this.buyerCompanyFeedbackViewModel.fromContactId = this.loggedId;
    this.buyerCompanyFeedbackViewModel.toCompanyId = this.companyId;
    let selectedId = (this.form.controls.items.value).filter((item) => item.checkbox).map((item) => item.id);
    if(selectedId.length){
      this.buyerCompanyFeedbackViewModel.feedbackIds = selectedId;
    } else {
      this.buyerCompanyFeedbackViewModel.feedbackIds = [];
    }
    this._supplierService.setBuyerFeedback(this.buyerCompanyFeedbackViewModel).subscribe(
      response=>{
        if(!response.isError){
          this.isResponse = false;  
          this.modelChangeReload.emit(true);
          this.closeModel();
          this._toastr.success('Feedback set successfully','Success!');
        } else {
          this.isResponse = false;  
          this.closeModel();
          this._toastr.error(response.messages,'Error!');
        }
      },
      error => {
        this.isResponse = false;  
        this.closeModel();
        this._toastr.error('Something went wrong please try again','Error!');
      }
    )
  }
  }
  openModal() {
    this.tempModel = this.modalService.open(this.buyerFeedbackModel, {
      backdrop: 'static'
    });
  }
  closeModel(){
    this.tempModel.close();
    this.modelCloseChange.emit(false);
  }
  ngOnDestroy(){
    if(this.tempModel != null && this.tempModel != undefined){
      this.tempModel.close();
    }
  }
}
