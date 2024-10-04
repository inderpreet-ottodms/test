import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { IBuyerCompanyTypeViewModel, IBuyerIndustryModalAnswers, IIndustryBranchesModel } from '../../core/models/globalMaster';
import { MasterService } from '../../core/services/master/master.service';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { BuyerService } from '../../core/services/buyer/buyer.service';
import { AccountService } from '../../core/services/account/account.service';
import { ICustomProcessViewModel } from '../../core/models/rfqModel';
import { RFQFilter } from '../rfq/_filter/rfq-filter/rfqFilterModel';

@Component({
  selector: 'app-industry-model',
  templateUrl: './industry-model.component.html',
  styleUrls: ['./industry-model.component.scss']
})
export class IndustryModelComponent implements OnInit, OnDestroy {
  modelRef: any;
  @ViewChild('industryModel',{static:false}) industryModel: TemplateRef < any > ; // Note: TemplateRef
  isLoading: boolean = false;
  typeId: any = '0';
  subscribeRef: any;
  buyerTypeViewModel: IIndustryBranchesModel[];
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  selectedProcessItems = [];
  processSettings = {};
  ibuyerIndustryModalAnswers : IBuyerIndustryModalAnswers;
  loggedContactId: number;
  answers: string;
  iBuyerCompanyTypeViewModel: IBuyerCompanyTypeViewModel;
  
   
  constructor(private _toastr: ToastrService, private modalService: NgbModal, private _masterService: MasterService, private _rfqService: RfqService, private _buyerService: BuyerService, private _accountService: AccountService) {}

  ngOnInit() {
    // this.getIndustriesList();
    // this.openModel();
    this.checkBuyerCompanyType();
    this.getProcess();
    this.loggedContactId = parseInt(localStorage.getItem('LoggedId'));
    this.subscribeRef = this._accountService.getMessage().subscribe(
      response => {
        // // debugger;
        if(response.text === 'Buyer'){
          this.checkBuyerCompanyType();
        } else {
          if(this.modelRef !== undefined && this.modelRef !== null && this.modelRef !== '' ){
            this.modelRef.close();
          }
        }
      }
    );
  }

  getProcess() {
    this.processSettings = {
      singleSelection: false,
      text: 'Select  Manufacturing Process',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      labelKey: 'parentDisciplineName',
      primaryKey: 'parentDisciplineId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 5,
      maxHeight: 150,
      showCheckbox: true,
    };
    this.iCustomProcessViewModelColl = [];
    this._rfqService.getAllProcess().subscribe(
      // this._rfqService.getParentProcesses2().subscribe(
      result => {
        if (result['result'] !== false) {
          this.iCustomProcessViewModelColl = result['data'];    
          this.iCustomProcessViewModelColl = this.removeDuplicates(this.iCustomProcessViewModelColl, 'parentDisciplineId');      
          this.selectedProcessItems = [];
           
          
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  checkBuyerCompanyType(){
    // // debugger;
    let userType =  localStorage.getItem('Usertype');
   let isLoginFromVision = sessionStorage.getItem('isLoginFromVision');
    if(userType  === 'Buyer'){
      this._buyerService.checkBuyerCompanyType(this.loggedCompanyId).subscribe(
        response=>{
          if(!response.isError){
            if(response.data.buyerTypeId === 0 && isLoginFromVision !== 'true'){
              this.getIndustriesList();
              this.openModel();
            } 
          }
        }
      );
    }
  }
  getIndustriesList(){
    this._masterService.GetCompanyTypesForBuyers().subscribe(
      (data: IIndustryBranchesModel[]) => {
        this.buyerTypeViewModel = data['data'];
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  openModel(){
    if(this.modelRef === undefined || this.modelRef === null){
      this.modelRef = this.modalService.open(this.industryModel, {
        backdrop: 'static',
        keyboard:false
      });
    }
  }
  saveCompanyType(){
    this.answers = "";
    this.selectedProcessItems.forEach(x => {

        if (this.answers == null || this.answers == "")
        {
          this.answers =  x.parentDisciplineName;
        }
        else  
        {
          this.answers =  this.answers + "," + x.parentDisciplineName;
        }
    });

    //console.log(this.answers);

    this.ibuyerIndustryModalAnswers = {
    buyeId : this.loggedContactId,
    questions: "What manufacturing technologies are you interested in?",
    answers: this.answers
   }
   //console.log(this.ibuyerIndustryModalAnswers);
    this.iBuyerCompanyTypeViewModel = {
      companyId: this.loggedCompanyId,
      companyTypeId: this.typeId,
      isBuyer: true,
      buyerIndustryModalAnswersData: this.ibuyerIndustryModalAnswers

    };

    console.log(this.iBuyerCompanyTypeViewModel);
    this._buyerService.setBuyerCompanyType(this.iBuyerCompanyTypeViewModel).subscribe(
      response => {
        if(!response.isError){
          this._toastr.success('Industry has been updated.','Success!');
        } else {
          this._toastr.error('Something went wrong please try later.','Error!');
        }
      },
      error=> {
        this._toastr.error('Something went wrong please try later.','Error!');
      }

    );
    this.modelRef.close();
  }
  ngOnDestroy() {
     if(this.modelRef !== undefined && this.modelRef !== null && this.modelRef !== '' ){
       this.modelRef.close();
     }
     this.subscribeRef.unsubscribe();
   }

   // This method is used to select single process from list
  onProcessSelect(item: any) {
    //console.log(item)   
    
    
  }

  //This method is used to select all process from list
  onProcessSelectAll(item: any) {
     
  }

  onProcessDeSelect(item: any) {
    //this.selectedProcessItems.push(item.parentDisciplineId);
  }

  onProcessDeSelectAll(item: any) {
    
  }

  handleError(error) {
    if (error.status === 0) {
      this._toastr.warning('Please check connection', 'Warning!');
    } else if (error.status === 400) {
      this._toastr.warning(JSON.stringify(error.error), 'Warning!');
    } else if (error.status === 401) {
      this._toastr.warning('Your session is expired. Please login again to continue.', 'Warning!');
    }
  }

  

}
