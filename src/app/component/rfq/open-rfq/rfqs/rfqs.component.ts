import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../__Services/api-service/api.service';
import { OpenRFQFilter } from './filterModel';
import { SharedModule } from '../../../../shared/shared.module';

import { element } from 'protractor';
// import { debug } from 'util';
import { RfqService } from '../../../../core/services/rfq/rfq.service';


@Component({
  selector: 'app-rfqs',
  templateUrl: './rfqs.component.html',
  styleUrls: ['./rfqs.component.scss'],
  providers: [
    ApiService,
    OpenRFQFilter,
    SharedModule,
  ]
})
export class RfqsComponent implements OnInit, AfterViewInit
{
  ngAfterViewInit(): void {
    this.getFilterData();
    this.getProcess();
  }
  sortingValue : string = '';
  sortingOrder : string ='Recent';
  searchText : string = '';
  filterProcesses : string;
  _totalRecords?:Number;

  constructor(public rest: ApiService,
              private router:Router,
              private route: ActivatedRoute,
              private filter: OpenRFQFilter,
              private ref: ChangeDetectorRef,
              private _rfqService: RfqService)
  {
    localStorage.removeItem('isBack');
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
  //   this.router.routeReuseStrategy.shouldReuseRoute = function(){
  //     return true;
  //  }
  //  this.router.events.subscribe((evt) => {
  //     if (evt instanceof NavigationEnd) {
  //       // trick the Router into believing it's last link wasn't previously loaded
  //       this.router.navigated = true;
  //       // if you need to scroll back to top, here is the right place
  //       window.scrollTo(0, 0);
  //     }
  //   });
  }

  showingRFQDetails :boolean = false;
  message:string;
  rfqIDToShowDetail? :number = null;
  receiveSelectedRFQID($event) {
    // debugger;
    this._rfqService.set(true, 'showSidePanel');
    // this.showingRFQDetails = true;
    this._rfqService.set(true, 'rfqDetailDrawer');
    this.rfqIDToShowDetail = $event;
    this._rfqService.set(false, 'isBuyerMiniProfile');

    //alert(this.rfqIDToShowDetail);
  }
  closeRFQDrawerRequest($event:boolean)
  {
    if($event)
    {
      this.showingRFQDetails = false;
      this.rfqIDToShowDetail = null;
    }
  }

  rfqIds : any;
  buyerID : string;
  supplierId : number;
  ngOnInit() {
    this.buyerID  =  this.route.snapshot.params['id']
    this.supplierId = Number.parseInt(localStorage.getItem("LoggedId").toString());

    this.filter.PageSize = 24;
    this.filter.CurrentPage = 1;
  }


  pageSizeChange($event:number)
  {
    this.filter.PageSize = $event;
    this.filter.CurrentPage = 1;
    this.getFilterData();
  }
  pageChange($event:number)
  {
    this.filter.CurrentPage = $event;
    this.getFilterData();
  }

  setDeaultFilters()
  {
    if(this.sortingValue == 'quantity')
    {
      this.sortingOrder ='High';
    }
    else if(this.sortingValue == 'material' ||
            this.sortingValue == 'process' ||
            this.sortingValue == 'postprocess')
    {
      this.sortingOrder = 'A - Z';
    }
    else if(this.sortingValue=='quoteby' || this.sortingValue=='')
    {
      this.sortingOrder = 'Recent';
    }
    this.getFilterData();
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  getFilterData()
  {
    //Array.prototype.map.call(this.selectedProcesses, s => s.parentDisciplineName).toString();
    this.filter.SortBy = this.sortingValue;
    this.filter.SortingOrder = this.sortingOrder;
    //alert(this.filter.SortingOrder);
    this.filter.SearchText = this.searchText;
    this.filter.Processes = [];

    if(this.selectedProcesses!=null && this.selectedProcesses!=undefined)
    {
      this.selectedProcesses.forEach(x=>{
        let values = x.value;
        values.forEach(y => {
          this.filter.Processes.push(y["childDisciplineId"]);
        });
      });
      this.filterProcesses = Array.prototype.map.call(this.selectedProcesses, s => s.key).toString();
      this.selectedProcesses.forEach(ele=>{
        //ele.value.foreach(n=>{
          this.filterProcesses+=',' + Array.prototype.map.call(ele.value, s => s.childDisciplineName).toString();
        //})

      });
    }

    this.rest.post('OpenRFQs?id='+this.buyerID + '&supplierId=' + this.loggedId, this.filter)
    .subscribe(
      (response: { data: any, isError:boolean, message:any, totalRecords?:number }) => {
        if(!response.isError){
          this.rfqIds = response.data;
          if(response.totalRecords != null && response.totalRecords !=0) {
            this._totalRecords = response.totalRecords;
          } else {
            this._totalRecords = 0;
          }

        }
      });
  }


   get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  selectedKey:string;
  selectedParentKey: string;

  masterProcesses : any;
  selectedProcesses: any[];

  getProcess() {

    this._rfqService.getProcessByCompanyId(this.loggedCompanyId).subscribe(
      result => {
        if (result['result'] !== false) {
        this.masterProcesses = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');;
      } else {
        // this.iCustomProcessViewModelColl = [];
        this.getAllProcess();
      }
        // if (this.iCustomProcessViewModelColl.length !== 0) {

        // } else {
        //     this.getAllProcess();
        // }
      },
      error => {

        this._rfqService.handleError(error);
      },
      () => { }
    );
  }




  getAllProcess()
  {
    // this.rest.get('Master/GetProcesses')
    this.rest.get('Master/GetProcesses?userType=' + localStorage.getItem('Usertype'))
    .subscribe(
      (response: { data: any, result:boolean, message:any }) => {
        if(response.result){
          this.masterProcesses = response.data.filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');
          let mfgEle = this.masterProcesses;
          if(mfgEle!=null)
          {
            mfgEle.forEach(ele=>{
              let index = this.masterProcesses.indexOf(ele);
              this.masterProcesses.splice(index,1);
            });
          }
        }
      });
  }
  getChildProcess(key:string) {
    let data = this.masterProcesses.filter(m => m.parentDisciplineName === key);
    return data;
  }
  getSelelctedChildProcess(key:string)
  {
    let data = this.selectedProcesses.filter(m => m.key === key);
    return data;
    // if(this.selectedKey!=null && this.selectedKey!=undefined){
    //   //let data = this.masterProcesses.filter(m => m.parentDisciplineId === this.priorSelection['parentDisciplineId']);
    //   let data = this.masterProcesses.filter(m => m.parentDisciplineId === this.selectedParentKey && m.childDisciplineId===this.selectedKey);
    //   let xData = [];
    //   data.forEach(element => {
    //     xData.push(element);
    //   });

    //   let xData001 = this.transform(xData, 'parentDisciplineName');
    //   //this.selectedKey =null;
    //   return xData001;
    // }
    // return this.getChildProcess(key);
  }
  selectTheChildKey(key:string)
  {
    this.selectedKey = key;
    this.selectedParentKey = this.masterProcesses.filter(m => m.childDisciplineId===this.selectedKey)[0].parentDisciplineId;
    let myData = this.getSelelctedChildProcess(key);
    //this.selectedKey = null;
    //this.selectedParentKey= null;
    myData.forEach(e=>{
      this.selectedProcesses.push(e);
    })
  }

  priorSelection : any[];
  includeAllProcess(key:string, childKey: string)
  {
    let processData = this.masterProcesses.filter(x=>(x.parentDisciplineName == key.trim() && (childKey==undefined || x.childDisciplineId==childKey)));
    if(this.selectedProcesses==null || this.selectedProcesses==undefined)
    {
      this.selectedProcesses = [];
    }
    if(this.priorSelection==null || this.priorSelection==undefined)
    {
      this.priorSelection = [];
    }

    processData.forEach(element => {
      if(this.priorSelection.find(x=>x==element)==null || this.priorSelection.find(x=>x==element)==undefined) {
        this.priorSelection.push(element);
      }
    });
    this.selectedProcesses = this.transform(this.priorSelection, 'parentDisciplineName');
  }
  includeChildProcess(key:string, childKey: string)
  {
    //alert(this.selectedKey);

    let childObject = this.masterProcesses.find(x=>(x.parentDisciplineName == key.trim() && (childKey==undefined || x.childDisciplineId==childKey)));
    if(childObject!=null && childObject!=undefined)
    {
      if(this.selectedProcesses==null || this.selectedProcesses==undefined)
      {
        this.selectedProcesses = [];
      }
      if(this.priorSelection==null || this.priorSelection==undefined)
      {
        this.priorSelection = [];
      }

      let parentObject = this.masterProcesses.find(m=>m.parentDisciplineId == childObject.parentDisciplineId);
      this.priorSelection.push(parentObject);
      this.priorSelection.push(childObject);

      this.selectedProcesses = this.transform(this.priorSelection, 'parentDisciplineName');
    }
  }
  removeAllChildProcess(key)
  {
    let existItem = this.selectedProcesses.find(x=>x.key===key);
    if(existItem!=null)
    {
      var index = this.selectedProcesses.indexOf(existItem);
      this.selectedProcesses.splice(index, 1);
      //this.priorSelection.splice(index, 1);

      existItem = this.priorSelection.filter(x=>x.parentDisciplineName===key);
      if(existItem!=null)
      {
        existItem.forEach(ele=>{
          index = this.priorSelection.indexOf(ele);
          this.priorSelection.splice(index,1);
        })

      }


    }
    //this.priorSelection=[];
  }
  removeSelectedChildProcess(key)
  {
    this.selectedProcesses.forEach(ele=>{
      let existItem = ele.value.find(x=>x.childDisciplineId===key);
      if(existItem!=null)
      {
        var index = ele.value.indexOf(existItem);
        ele.value.splice(index, 1);
        if(ele.value.length===0)
        {
          index = this.selectedProcesses.indexOf(ele);
          this.selectedProcesses.splice(index, 1);
        }
        let priorSelectionChildKey = this.priorSelection.find(x=>x.childDisciplineId===existItem.childDisciplineId)
          if(priorSelectionChildKey!=null)
          {
            index = this.priorSelection.indexOf(priorSelectionChildKey);
            this.priorSelection.splice(index, 1);
          }
      }
    });



    // this.priorSelection.forEach(ele=>{
    //   let existItem = ele.value.find(x=>x.childDisciplineId===key);
    //   if(existItem!=null)
    //   {
    //     var index = ele.value.indexOf(existItem);
    //     ele.value.splice(index, 1);
    //     if(ele.value.length===0)
    //     {
    //       index = this.priorSelection.indexOf(ele);
    //       this.priorSelection.splice(index, 1);
    //     }
    //     return;
    //   }
    // });


  }
  clearSelectedProcess()
  {
    this.selectedProcesses =[];
    this.priorSelection = [];
  }

  searchByKey(event) {
    // console.log(event, event.keyCode);
    if (event.keyCode === 13) {
      this.getFilterData();
    }
  }

  transform(collection: Array <any> , property: string): Array <any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({
      key,
      value: groupedCollection[key]
    }));
  }

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  isRfqDrawer() {
    return this._rfqService.get('rfqDetailDrawer');
  }
  isBuyerMiniProfile() {
    // this.showingRFQDetails = false;
    return this._rfqService.get('isBuyerMiniProfile');
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }
  isMessageRfqPanel() {
    return this._rfqService.get('isBuyerMessage');
  }
  isModelShow() {
    return this._rfqService.get('isModelShow');
    }
  goBack() {
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
  }
  // showProfileDrawer(val){
  //   if( val ){
  //     this._rfqService.set( this.buyerID, 'buyerProfileId');
  //     this._rfqService.set(true, 'showSidePanel');
  //     // this._rfqService.set(false, 'rfqDetailDrawer');
  //     this._rfqService.set(true, 'isBuyerMiniProfile');
  //   }
  // }


}
