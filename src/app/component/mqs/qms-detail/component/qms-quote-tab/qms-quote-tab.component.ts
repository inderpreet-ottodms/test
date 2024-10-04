import {
  Component,
  OnInit
} from '@angular/core';
import {
  IQmsPartQuantityList,
  IQmsQuotesViewModel,
  IReviewQuoteBasicInfoViewModel,
  IQMSStatus,
  QmsSpecialFeesList,
  QMSEmailStatus
} from '../../../../../core/models/qmsModel';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  appConstants
} from '../../../../../core/config/constant';
@Component({
  selector: 'app-qms-quote-tab',
  templateUrl: './qms-quote-tab.component.html',
  styleUrls: ['./qms-quote-tab.component.scss']
})
export class QmsQuoteTabComponent implements OnInit {

  partDetailDiv1 = false;
  IQmsPartQuantityListColl: IQmsPartQuantityList[] = [];
  iQuotesViewModel: IQmsQuotesViewModel;
  iReviewQuoteBasicInfoViewModel: IReviewQuoteBasicInfoViewModel;
  totalQtyArray: any[];
  tempQMSQuoteId: number;
  acceptAllStatus: boolean;
  isloader: boolean;
  partStatusList: IQMSStatus[];
  whoPaysForShippingText:string;
  QmsSpecialFeesListViewModel:QmsSpecialFeesList[];
  feeTotal:number;
  decimalValueDefault: number;
  showZero:any;
  constructor(private _qmsService: QmsService, private router: Router,
    private route: ActivatedRoute, private _toastr: ToastrService, private _masterService: MasterService) {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isNoteDrawer');
    this._qmsService.set(false, 'isMessageDrawer');
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  ngOnInit() {
    this.decimalValueDefault = null;
    this.showZero=0.0000;
    this.feeTotal=0;
    this.partStatusList = [];
    this.partStatus();
    this.isloader = true;
    this.acceptAllStatus = false;
    if (appConstants.settingDefault.decimalValueDefault == null || appConstants.settingDefault.decimalValueDefault == undefined) {
      this._masterService.getDefaultQmsDecimalPlaces(this.loggedId).subscribe(res => {
        if (!res.isError) {
          appConstants.settingDefault.decimalValueDefault = res.data;
          this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
          this.showZero= this.showZero.toFixed(this.decimalValueDefault);
        }
      })
    } else {
      this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
      this.showZero= this.showZero.toFixed(this.decimalValueDefault);
    }
    // tslint:disable-next-line:radix
    this.tempQMSQuoteId = this.route.snapshot.params['id'];
    if (this.tempQMSQuoteId === null || this.tempQMSQuoteId === undefined || this.tempQMSQuoteId === NaN) {
      this.router.navigate(['/qms/myquotes']);
    } else {
      // localStorage.removeItem( 'qmsQuoteId');
    }
    this.iQuotesViewModel = {
      createdBy: 0,
      createdDate: '',
      isActive: true,
      qmsQuoteId: 0,
      qmsQuoteName: '',
      statusId: 0,
      qmsContactId: '',
      estimatedDeliveryDate: null,
      isNotified: true,
      paymentTermId: 0,
      quoteRefNo: '',
      paymentTerms: '',
      quoteValidUntil: '',
      shippingMethodId: 0,
      shippingMethod: '',
      notes: '',
      result: true,
      errorMessage: '',
      email: '',
      contactName: '',
      customer: '',
      phone: '',
      qMSContactIdEncrypt: '',
      isAllPartDetailsFilled: false,
      probability: 0,
      quoteId: 0,
      emailStatusId: 0,
      qmsQuoteIdEncrypt:'',
      whoPaysForShipping:0,
      qmsQuoteLeadTimeAddList:[],
      qmsCustomerContactId:0
    };
    this.iReviewQuoteBasicInfoViewModel = {
      customer: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
    };
    this.IQmsPartQuantityListColl = [];
    this.totalQtyArray = [];
    this.getQmsDetails();
  }

  getQmsDetails() {
    this.IQmsPartQuantityListColl = [];
    this._qmsService.getQmsQuantityParts(this.tempQMSQuoteId).subscribe(
      result => {
        if (result['result'] === true) {
          this.iQuotesViewModel = result['data']['reviewQuoteDetailsViewModel'];
          this.IQmsPartQuantityListColl = result['data']['reviewQuotePartQuantitiesListViewModel'];
          this.iReviewQuoteBasicInfoViewModel = result['data']['reviewQuoteBasicInfoViewModel'];
            //  this.QmsSpecialFeesListViewModel = result['data']['qmsSpecialFeesListViewModel'];
             if( this.IQmsPartQuantityListColl != undefined && this.IQmsPartQuantityListColl.length != 0) {
              this.IQmsPartQuantityListColl.forEach(element =>{
                element.subSpecialTotal=0;
                if(element.qmsSpecialFeesListViewModel !=undefined && element.qmsSpecialFeesListViewModel.length !=0) {
                element.qmsSpecialFeesListViewModel.forEach(item=>{
                 element.subSpecialTotal+=item.value;
                })
                }
                element.toShow=false;
              })

            }
           if( this.iQuotesViewModel.whoPaysForShipping !== null && this.iQuotesViewModel.whoPaysForShipping !== 0 && this.iQuotesViewModel.whoPaysForShipping !== undefined) {
            this.whoPaysForShippingText = (this.iQuotesViewModel.whoPaysForShipping  == 1)?'Buyer':'Manufacturer';
          }
          this.getTotalCost();
          // console.log( this.iQuotesViewModel, ' q ', this.IQmsPartQuantityListColl, ' r ' , this.iReviewQuoteBasicInfoViewModel );
        }
      },
      error => {
        // this.handleError(error);
      },
      () => {}
    );
  }
  getTotalCost() {
    this.acceptAllStatus = false;
    let result = this.IQmsPartQuantityListColl.reduce(function (r, a) {
      r[a.qmsQuotePartId] = r[a.qmsQuotePartId] || [];
      r[a.qmsQuotePartId].push(a);
      return r;
    }, Object.create(null));
    console.log('result', result);
    // tslint:disable-next-line:forin
    for (let key in result) {
      let value = result[key];
      for (let index = 0; index < value.length; index++) {
        this.getTotal(value[index].qtylevel,value[index].qmsQuotePartId,value[index].subSpecialTotal);
      }
      //console.log( value );
      if (value[0].isAccepted === false) {
        this.acceptAllStatus = true;
      }
    }
    console.log(this.totalQtyArray);
    this.isloader = false;
  }
  getSubTotal(level, partNo) {
    const mis = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const tol = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const ship = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const priceData = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const price = (priceData ? priceData.perunitprice : 0) * (priceData ? priceData.partqty : 0);
    const total = (mis ? mis.miscellaneousamount : 0) + (tol ? tol.toolingamount : 0) + (ship ? ship.shippingamount : 0) + price;
    (this.totalQtyArray[level]) ? (this.totalQtyArray[level] = this.totalQtyArray[level] + total) : this.totalQtyArray[level] = total;
  }
  getTotalQuantity(level, partNo) {
    const mis = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const tol = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const ship = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const priceData = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.partNo === partNo);
    const price = (priceData ? priceData.perunitprice : 0) * (priceData ? priceData.partqty : 0);
    const total = (mis ? mis.miscellaneousamount : 0) + (tol ? tol.toolingamount : 0) + (ship ? ship.shippingamount : 0) + price;
    if (total === 0) {
      return '';
    } else {
      // tslint:disable-next-line:max-line-length
      return total;
    }
  }
  getspecailValue(value) {
    return value.toFixed(this.decimalValueDefault);
  }
  getShowZero() {
    return '$' + this.showZero;
  }
  acceptPartQMS(qmsQuoteId, setAccept, isAll = false) {
    let tempQmsQbj = {
      partIdList: [],
      isAccepted: setAccept,
      result: false,
      errorMessage: ''
    };
    if (isAll) {
      const ids = [];
      JSON.stringify(this.IQmsPartQuantityListColl, (key, value) => {
        // tslint:disable-next-line:curly
        if (key === 'qmsQuotePartId') ids.push(value);
        return value;
      });
      let filteredArray = ids.filter(function (item, pos) {
        return ids.indexOf(item) === pos;
      });
      tempQmsQbj.partIdList = filteredArray;
    } else {
      tempQmsQbj.partIdList.push(qmsQuoteId);
    }

    this._qmsService.updateQMSMyQuotesPartStatus(tempQmsQbj).subscribe(
      data => {
        if (data.result) {
          this._toastr.success(data.errorMessage, 'Success !');
          for (let index = 0; index < tempQmsQbj.partIdList.length; index++) {
            const tempData = this.IQmsPartQuantityListColl.filter(m => m.qmsQuotePartId === tempQmsQbj.partIdList[index]);
            tempData.forEach(element => {
              element.isAccepted = setAccept;
            });
          }
          this.acceptAllStatus = false;
          this.IQmsPartQuantityListColl.forEach(m => {
            (m.isAccepted === null || m.isAccepted === false) ? this.acceptAllStatus = true: this.acceptAllStatus = false;
          });
          // this.getQmsDetails();
        } else {
          this._toastr.error(data.errorMessage, 'Error !');
        }
      }
    );
  }
  getFeeTypeCost(level, feedata) {
    let data = feedata.find(x => x.quantityLevel === level);
    if (data) {
      return feedata.find(x => x.quantityLevel === level).value.toFixed(this.decimalValueDefault);

    } else {
      return  '';
    }


  }
  getFeetypeTotal(level, qmsQuotePartId) {

    let data = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId);
    if (data && data.qtylevelSum) {
      return this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId) ?
        this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId).qtylevelSum.toFixed(this.decimalValueDefault) : '';
    } else {
      return '';
    }
  }

  getTotal(level, qmsQuotePartId,specialFeeTotal) {
    let data = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId === qmsQuotePartId);
      if (data && data.qtylevelSum != null) {
        let subTotal = Number(this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId === qmsQuotePartId).qtylevelSum);
      //  let specialTotal= this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId === qmsQuotePartId).subSpecialTotal;
        (this.totalQtyArray[level]) ? this.totalQtyArray[level] = (this.totalQtyArray[level] + subTotal + specialFeeTotal): this.totalQtyArray[level] = subTotal + specialFeeTotal;
      }

    }


    getDecimalTotal(value) {
      return value.toFixed(this.decimalValueDefault);
    }

    get loggedCompanyId() {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('loggedCompanyId'));
    }
  partStatus() {
    // this._qmsService.GetQMSQuoteStatus(this.loggedCompanyId,this.loggedId).subscribe(res => {
    //   if (res['isError'] === false) {
    //     this.partStatusList =res['data'].data;
    //   } else {
    //     this.partStatusList = [];
    //   }
    // })

    this._masterService.GetQMSStatus('QMS_PART_STATUS').subscribe(res => {
      if (res['result'] === true) {
        this.partStatusList = res['data'];
      } else {
        this.partStatusList = [];
      }
    })

  }
  changeQmsPartStatus(partId, $event) {
    this._qmsService.QMSQuotePartStatus(partId, $event.target.value).subscribe(res => {
      if (res['isError'] === false) {
        this._toastr.success('QMS Part Status Update Successfully.', 'Success!');
      }
    })
  }
  getStatus(partid) {
    let result = this.IQmsPartQuantityListColl.reduce(function (r, a) {
      r[a.qmsQuotePartId] = r[a.qmsQuotePartId] || [];
      r[a.qmsQuotePartId].push(a);
      return r;
    }, Object.create(null));
    console.log('result', result);
    // tslint:disable-next-line:forin
    for (let key in result) {
      let value = result[key];
      // value[index].toShow = !value[index].toShow;
      for (let index = 0; index < value.length; index++) {
        if(value[index].qmsQuotePartId == partid) {
          value[index].toShow = !value[index].toShow;
        }
        // this.getTotal(value[index].qtylevel, value[index].partNo,value[index].subSpecialTotal,index);
      }
      //console.log( value );

    }
  }
}
