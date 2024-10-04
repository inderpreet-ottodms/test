import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { uploadFileNDA } from '../../../../../../../constants/url-constant';

import { Headers, Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { FileUploader } from 'ng2-file-upload';
import { ProfileService } from '../../../../../../../app/core/services/profile/profile.service';
import { environment } from '../../../../../../../environments/environment';
import { RfqService } from '../../../../../../../app/core/services/rfq/rfq.service';
import { ProductAnalyticService } from '../../../../../../../app/shared/product-analytic/product-analytic';
import { IQuantityUnit } from '../../../../../../core/models/globalMaster';
import { AwardPartQuatityRequestModel, AwardRequestModel, AwardingModelQuoteDetailsRequestViewModel, AwardingModelQuoteDetailsViewModel, IBuyerQuotesList, IBuyerQuotesViewModel, IPartsViewModel, IRFQPartQuantityQuote, ITerritoryClassificationModel, IUploaadedFileName, IUploaadedFileNameList, LocalAwardedManufractureList, LocalAwardedPartsQuantityList, NPartArray } from '../../../../../../core/models/rfqModel';
import { MasterService } from '../../../../../../core/services/master/master.service';

const URL = '';
@Component({
  selector: 'app-award-order-managment-myquotes',
  templateUrl: './award-order-mangment.component.html',
  styleUrls: ['./award-order-mangment.component.scss'],
  providers: [ConfirmationService]
})

export class AwardOrderManagmentComponentQuoteRfqList implements OnInit ,DoCheck {
  @Input('supplierId') supplierId: any;
  @Input('rfqPartId') rfqPartId: any;
  @Input('rfqId') rfqId: any
  @Output() closeModelEventHandler = new EventEmitter < any > ();
  isAward: boolean;
  iBuyerQuotesViewModel: IBuyerQuotesViewModel;
  iFilteredRFQViewModelColl: IBuyerQuotesList[];
  NPartArrayColl: NPartArray[];
  awardRFQPartQuantityQuote: IRFQPartQuantityQuote;
  NPartQuantity: LocalAwardedPartsQuantityList;
  NPartQuantityColl: LocalAwardedPartsQuantityList[];
  dropDownID: any;
  isReqoute: boolean;
  nextBtn: boolean = false;
  myDate = new Date;
  isCsvLoader: boolean;
  minDate = new Date;
  partsRequestViewModel: { rfqId: number; rfqPartId: number; contactIds: any[]; quantityLevel: number; isRfqResubmitted: boolean; };
  NPartArray: { isAward: boolean; manId: number; manName: string; npsScore: number; partName: string; partNumber: string; quantityList: any[]; rfqPartId: number; rfqQuoteItemsId: number; noOfStars: number; price: any; unit: any; isRfqStatus: any; supplierList: any[]; };
  // rfqId: any;
  finalArray: Array<any> = [];
  newArray: void;
  supplierList: any[];
  partIdLength: number;
  quantityEnabled:boolean = false
  partData:IPartsViewModel[];
  selectedId: any;
  supplierQuantityData: any;
  rating: any;
  totalPartCount: number;
  supplierQuantityDropdown: any;
  awardingModelQuoteDetailsViewModel: AwardingModelQuoteDetailsViewModel[] = [];
  manufactureData: any;
  awardingModelQuoteDetailsRequestViewModel: AwardingModelQuoteDetailsRequestViewModel;
  awardRequestModel: AwardRequestModel;
  AwardPartQuatityRequestModel = new AwardPartQuatityRequestModel()
  checkDropDownValue: any;
  avgNoOfStars:any;
  iQuantityUnitColl: IQuantityUnit[]=[];
  iRFQPartQuantityQuoteColl: IRFQPartQuantityQuote[];
  isLoader1: boolean;
  rfqPartTotal: number;
  isRecAvailable: boolean;
  isAwardStep2: boolean = false;
  isFirstTabCompleted: boolean;
  isSecondTabCompleted: boolean;
  purchaseOrder: any;
  isSendMfgStandard: boolean = true;
  fileName: string;
  isUploadMyOwnFile: boolean;
  activeStatusFilterBtn1: string="Send MFG Standard";
  iPartUploadedFileNameList: IUploaadedFileNameList;
  partFileAddedError: boolean = false;
  hasBaseDropZoneOver = false;
  awardQuoteIds: number[];
  isAwardDone: boolean;
  LocalAwardedManufractureListColl: LocalAwardedManufractureList[];
  iPartUploadedFileName: IUploaadedFileName;
  deliveryDate: boolean;
  iPartsViewModel: IPartsViewModel;
  currentOpenContactId: number;
  activeStatusFilterBtn: string;
  partDetailUploader: FileUploader = new FileUploader({
    url: '',
    itemAlias: 'partfiles',
  });
  uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  isAttachmentsLoading: number;
  isRfqStatus: any;
  partDataItem: any;
  rfqQuoteItemList: any[];
  rfqItemID: any[];
  s3FileName: any;
  purchaseEmpty: boolean = false;
  finalQuantityData: any[];
  onlyForSupplierData: any;
  encryptedRfqID: any;
  key: any;
  iv: any;
  encrypted: string;
  unit: any;
  awardedUnitTypeId: any = 0;
  isBackButtonClicked: boolean = false;
  maxDate: Date;
  deCryptRFQIDUrl: any;
  showOthers: boolean = false;
  partIndex: any;
  indexArray: any[];
  tempIndex: any;
  awardStatus: string;
  isAwardNonMfg: boolean = false;
  selectedCompany: any;
  filteredCompany: any[];
  countries: any[];
  isAwardAnotherMfg: boolean = false;
  regionList: any;
  isAwardMfgOffline: boolean = false;
  notAwarded:boolean = false;
  regionId: any;
  companyName: any;
  reasonName: string ="";
  getCompanyName: any;
  awardPopupData:any;
  showCompanyDropdown: boolean = false;
  companyNameActive: boolean = false;
  notAwardedComment: string;
  disableUpdate: boolean = true;
  reasonUpdate:boolean = true;
  companyNameUpdate: boolean = true;
  notAwardedUpdate = true;
  constructor(private _Http: Http, private router: Router, private _router: ActivatedRoute,private _rfqService:RfqService,private _toastr: ToastrService,private _masterService: MasterService,private _profileService: ProfileService,    private productAnalyticService:ProductAnalyticService,){
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 10, 11, 31);

    this.NPartArrayColl = [];
    this.initNPartArray();
    this.initNPartQuantity();
    this.iPartUploadedFileName = {
      oFileName: '',
      CompleteFileName: ''
    };
    this.iPartUploadedFileNameList = {
      FileNameList: []
    };
    this.uploader.queue.length = 0;
    this.uploadPartImages();

    this.key = CryptoJS.enc.Utf8.parse('7061737323313233');
    this.iv = CryptoJS.enc.Utf8.parse('7061737323313233');
  }

  ngOnChanges(){
       
  }
 
ngOnInit() {
  this.companyNameUpdate = true;
  this.notAwardedComment= "";
  this.disableUpdate = true;
  this.reasonUpdate = true;
this.indexArray = [];
this.setFlowName();
this.getRegionList();
  this._router.queryParams.subscribe(params => {
  this.deCryptRFQIDUrl = params['rfqId'];
})

  this.finalQuantityData = [
    {"isRfqStatus":false,"rfqPartStatusId":null,"unit":null,"price":null,"rfqQuoteItemsId":null,"rfqPartId":null,"awardedUnitTypeId":0,"createdDate":Date}
  ]

  if(this.supplierId != undefined){
    this.dropDownID = this.supplierId;
    this.selectedId = this.supplierId;
    this.getRFQItemsId();
    if(this.supplierId > 50 ){
      this.quantityEnabled = true;
    }
  }
    
  this.purchaseOrder = "PO-"+this.rfqId;

  this.iBuyerQuotesViewModel = {
    rfqId: this.rfqId,
    contactId: this.loggedId,
    pageSize: 0,
    pageNumber: 0,
    searchText: '',
    isRfqResubmitted: false,
    totalRecords: 0,
    isOrderByDesc: true,
    orderBy: '',
    more_records: true
  };
  this.awardRequestModel = new AwardRequestModel();
    this.isAward = true;
  //  this.getBuyerQuotingList()
  //  this.getPartId()
  this.getUnit()
  this.getAwardingModelQuotePartData()
}

 ngDoCheck() {  
  if(this.notAwardedComment==""){
    this.notAwardedUpdate = true;
  }else{
    this.notAwardedUpdate = false;
  }
  if(this.companyName == ""){
    this.companyNameUpdate = true;
  }else{
    this.companyNameUpdate = false;
  }
    if(this.purchaseOrder === ""){
      this.purchaseEmpty = true;
    }else{
      this.purchaseEmpty = false;
      
    }
}

getBuyerQuotingList(){
  this._rfqService.GetBuyerQuotingList(this.iBuyerQuotesViewModel).subscribe(
    result => {
      this.iFilteredRFQViewModelColl = result['data'];

    })
}

initPartsModel() {
  this.partsRequestViewModel = {
    rfqId: this.rfqId,
    rfqPartId: 0,
    contactIds: [],
    quantityLevel: 0,
    isRfqResubmitted: false
  }
}

initNPartQuantity() {
  this.NPartQuantity = {
    quantityDetails: '',
    rfqQuoteItemsId: 0
  };
}

initNPartArray() {
  this.NPartArray = {
    isAward: false,
    manId: 0,
    manName: '',
    npsScore: 0,
    partName: '',
    partNumber: '',
    quantityList: [],
    rfqPartId: 0,
    rfqQuoteItemsId: 0,
    noOfStars: 0,
    price: null,
    unit: null,
    isRfqStatus: null,
    supplierList:[]
  };
}

getPartId(){
  this._rfqService.getRfqParts(this.rfqId).subscribe(
    result => {
      this.partData = result
      this.partIdLength = result.length
        result.forEach(element => {
        element.rfqPartId;
        this.getSupplierList(element.rfqPartId)
      });
    })
}

makeManufactureSelection(selectedId) {
  this.selectedId = selectedId
  if(selectedId >=50){
    this.quantityEnabled = true
    this.partData.forEach(element => {
      this.getQuantity(element)
    })
  }else{
    this.quantityEnabled = false
  }
}

getQuantity(data){
  this.partsRequestViewModel = {
    rfqId:data.rfqId,
    rfqPartId: data.rfqPartId,
    contactIds: [this.selectedId],
    quantityLevel: 0,
    isRfqResubmitted: false
  }

    this._rfqService.getAwardingModelQuoteQuantityData(this.partsRequestViewModel).subscribe(
    response => {
    this.supplierQuantityData = response.data
    this.rating = this.supplierQuantityData.noOfStars
    this.supplierQuantityDropdown = this.supplierQuantityData.rfqQuoteItemList;
    this.NPartQuantityColl = [];
    this.supplierQuantityDropdown.forEach(element => {
      this.NPartQuantity.quantityDetails = element.awardedQty.toString() + ' parts @ $' + element.totalPrice;
      this.NPartQuantity.rfqQuoteItemsId = element.rfqQuoteItemsId;
      this.NPartQuantityColl.push(this.NPartQuantity);
      if (this.supplierQuantityDropdown.length === 1) {
        this.NPartArray.rfqQuoteItemsId = this.supplierQuantityDropdown[0].rfqQuoteItemsId;
      }
      this.initNPartQuantity();
    });
    this.NPartArray.quantityList = this.NPartQuantityColl;
  })
}

// getSupplierList(rfqPartId) {
//     this._rfqService.getSupplierList(this.rfqId,rfqPartId).subscribe(
//       response => {
//         if (!response.isError) {
//         this.newArray = response.data
//           this.finalArray.push(this.newArray)
//           this.mergeArray()
//         }
//       }
//     )
//   }

mergeArray(){
    // const result = [...this.finalArray[0],...this.finalArray[1]] 
    let merged = this.finalArray.reduce((acc, it) => [...acc, ...it], []);
    const uniqueObjectArray = [...new Map(merged.map(item => [item.id, item])).values()]
    this.supplierList = uniqueObjectArray;
  }

makeQuantitySelection(manId, selectRfqQuoteItemsId, rfqpartid) {
    const localData = this.NPartArrayColl.find(m => m.manId === manId && m.rfqPartId === rfqpartid);
    if (localData != undefined && selectRfqQuoteItemsId !== '0') {
      localData.rfqQuoteItemsId = selectRfqQuoteItemsId;
    } else {
      localData.rfqQuoteItemsId = 0;
    }

  }
 
// ***************** New Functions Start Here***********************

get loggedId() {
  return parseInt(localStorage.getItem('LoggedId'));
}

closePopUp(){
  this.isAward = false;
  this.closeModelEventHandler.emit(true);
  this.awardingModelQuoteDetailsViewModel = []
}

setSupplierId(id){
  // debugger;
  // console.log("id--------------->",id)
  if(id && id !== 'undefined'){
    this.selectedId = id;
    this.dropDownID = id;
    this.showOthers = false;
    const ratingData = this.manufactureData.find(m => m.id == this.selectedId);
    this.rating = ratingData.noOfStars;
  } else {
    this.rating = 0;
    this.showOthers = false;
  }
  // if(id == 'undefined') {
  //   this.rating = 0;
  //   this.nextBtn = false;
  //   console.log('ratinggg')
  // }
  this.indexArray = [];
  this.finalQuantityData = [];
  this.finalQuantityData = [
    {"isRfqStatus":false,"rfqPartStatusId":null,"unit":null,"price":null,"rfqQuoteItemsId":null,"rfqPartId":null,"awardedUnitTypeId":0,"createdDate":Date}
  ]
  // this.getAwardingModelQuotePartData(); //Called for reloading the parts and quantity
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
  // debugger
      this.awardingModelQuoteDetailsViewModel = [];
      this._rfqService.getAwardingModelQuotePartData(this.rfqId).subscribe(
        response => {
          if (response.isError == false) {
            // this.isLoader = false;
            this.awardingModelQuoteDetailsViewModel = response.data;
            this.awardingModelQuoteDetailsViewModel.forEach((item) => {
              item.rfqQuoteItemList = [];
              item.isRfqStatus = false;
              item.price = '';
              item.unit = '';
              item.awardedUnitTypeId=14;
              item.supplierList=[];
             this.getSupplierList(item.rfqPartId).then(res=>{
              item.supplierList= res;
              this.manufactureData = res;
              if(this.supplierId != undefined){
                const ratingData = this.manufactureData.find(m => m.id == this.selectedId);
                 this.rating = ratingData.noOfStars;
                 this.chkExp(this.supplierId);
                 this.supplierId = undefined;
              }

             })
  
            })
            this.manipultePartId(this.awardingModelQuoteDetailsViewModel)
          } else {
            // this.isLoader = false;
          }
        }, error => {
          // this.isLoader = false;
        }
      );
      
  
}

getAwardingModelQuoteQuantityData(manufId, PartData, index) {
  // console.log("PartData",PartData)
    // console.log("manufId, PartData, index",manufId, PartData, index)
      let data = this.awardingModelQuoteDetailsViewModel[index].supplierList.find(x => x.id == manufId);
      let isRfqStatus;
      if(data){
        isRfqStatus = data.isRfqStatus;
      }
      if(this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0){
      }else{
        // this.isLoader = true;
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
              if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length != 0 &&
                this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {
                this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.forEach((item) => {
                  if(this.awardRequestModel.rfqQuoteItemList != undefined && this.awardRequestModel.rfqQuoteItemList != null){
                    if (this.awardRequestModel.rfqQuoteItemList.length != 0 ) {
                      this.awardRequestModel.rfqQuoteItemList.forEach((x, index) => {
                        this.rfqItemID.push(item.rfqQuoteItemsId)
                        if (x.rfqQuoteItemsId == item.rfqQuoteItemsId) {
                          this.awardRequestModel.rfqQuoteItemList.splice(index, 1);
                        }
                      })
                    }
                  }
                })
    
              }
              if(this.awardRequestModel.rfqQuoteItemList != undefined && this.awardRequestModel.rfqQuoteItemList != null){
                if(this.awardRequestModel.rfqQuoteItemList.length != 0){
                  let nonMfgIndex = this.awardRequestModel.rfqQuoteItemList.findIndex( x=>x.rfqPartStatusId == this.awardingModelQuoteDetailsViewModel[index].manufacturerId);
                  if(nonMfgIndex !=-1) {
                    this.awardRequestModel.rfqQuoteItemList.splice(nonMfgIndex, 1);
                  }
  
                }
              }
              this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList = res.data.rfqQuoteItemList;
              this.awardingModelQuoteDetailsViewModel[index].noOfStars = res.data.noOfStars;
              this.awardingModelQuoteDetailsViewModel[index].manufacturerId = manufId;
            
              //select quantity and price dropdown default selection

              // if (this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != undefined && this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList.length == 1 &&
              //   this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList != null) {     
              //     this.onSelectQuantity( this.awardingModelQuoteDetailsRequestViewModel.rfqPartId,this.awardingModelQuoteDetailsViewModel[index].rfqQuoteItemList[0].rfqQuoteItemsId, index);
              // }
            } else {
              // this.isLoader = false;
            }
          }, error => {
            // this.isLoader = false;
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
    
          // this.isLoader = false;
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
          // this.isLoader = false;
        }
      }
  
  
  
}

onSelectQuantity(partId,rfqQuoteItemsId, index) {
  // console.log("partId",partId)
  // console.log("inside change event rfqQuoteItemsId",rfqQuoteItemsId)
  this.partIndex = index 
  this.tempIndex = {"i":this.partIndex}
   if (rfqQuoteItemsId === 'null'){
    this.showOthers = true;
    this.awardingModelQuoteDetailsViewModel[index].unit = null;
    this.awardingModelQuoteDetailsViewModel[index].price = null;
    this.nextBtn = false;
    var newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == partId);
    // console.log("newcheckRfqPartId",newcheckRfqPartId)
    // console.log("newcheckRfqPartId typeof",typeof(newcheckRfqPartId))
    if(newcheckRfqPartId<0){
        this.onlyForSupplierData = {
        "isRfqStatus":true,
        "rfqPartStatusId":this.selectedId,
        "unit":null,
        "price":null,
        "rfqQuoteItemsId":null,
        "rfqPartId":partId,
        "awardedUnitTypeId":0,
        "createdDate":new Date()
      }
      this.finalQuantityData.push(this.onlyForSupplierData)
    }
   
    if(this.indexArray != undefined){
      this.indexArray.push(this.tempIndex)
    }else{
      this.indexArray = [{"i":this.partIndex}]
    }
    // console.log("this.indexArray before",this.indexArray)
   }else{
  this.indexArray = this.indexArray.filter(item => item.i !== index);
  // console.log("this.indexArray ",this.indexArray )
   if(this.indexArray.length === 0){
 this.showOthers = false
   }
 
  this.onlyForSupplierData = {
    "isRfqStatus":false,
    "rfqPartStatusId":null,
    "unit":null,
    "price":null,
    "rfqQuoteItemsId":rfqQuoteItemsId,
    "rfqPartId":partId,
    "awardedUnitTypeId":0,
    "createdDate":new Date()
    }

    // console.log(" this.finalQuantityData@@@@@@@@@@@@@@@@@@@@", this.finalQuantityData)
    let checkRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == partId);
    // console.log("checkRfqPartId",checkRfqPartId)
      if(checkRfqPartId>0){
        this.finalQuantityData.splice(checkRfqPartId, 1)
        if(rfqQuoteItemsId > 0){
          this.finalQuantityData.push(this.onlyForSupplierData)
        }

      }else{
        this.finalQuantityData.push(this.onlyForSupplierData)
      }

    
    
    // console.log("onlyForSupplierData",this.finalQuantityData.splice(0,1))
    // console.log("this.awardRequestModel.rfqQuoteItemList",this.awardRequestModel.rfqQuoteItemList)
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
  let enableNextBtn = true;
  if(this.finalQuantityData.length > 1){
   enableNextBtn = true;
  } else {
    enableNextBtn = false;
  }
  // if (rfqQuoteItemsId === 'null') {  
  //   enableNextBtn = false; 
  // }
  if(enableNextBtn && !this.isReqoute) {
    this.nextBtn = true;
  } else {
    this.nextBtn = false;
  }
}
}

// REQUOTING

reQuote(){
  if(this.isReqoute){
  var reqData = {
      "rfqId": this.rfqId,
      "buyerContactId": this.loggedId,
      "suplierContactId": this.dropDownID, 
      "isAllowRequoting": true  
  }
    this._rfqService.setReQuotingInfo(reqData).subscribe((result: any) => {
      this._toastr.success(result, 'Success!');
      this.closePopUp();
    });
  }
}


chkExp(dropDownvalue){
  // debugger;
  if (dropDownvalue != 'undefined'){
    this.quantityEnabled = true
    this.dropDownID = dropDownvalue;
    const result = this.manufactureData.filter(x => x.id == dropDownvalue);

  var currDate = this.myDate.toISOString();
  var expDate = result[0].quoteExpiryDate;
  
  var d1 = new Date(currDate);
  var d2 = new Date(expDate);
  
  var newCurrDate = d1.getTime();
  var newExpDate = d2.getTime();
  
  var diff = newCurrDate - newExpDate;
  if(diff > 0){
    this.isReqoute = true;
    this.nextBtn= false;
  }
  else {
    this.isReqoute = false;
    this.nextBtn= true;
  }
  if(newExpDate == 0 || dropDownvalue=== "null"){
  this.isReqoute = false;
  this.nextBtn= true;
  }
  if(this.selectedId != 16 && this.selectedId  != 17 && this.selectedId  != 18 && this.selectedId  !=20) {
    this.nextBtn = false;
  }
  }else{   
  this.quantityEnabled = false;
  this.nextBtn = false;
  this.isReqoute = false;
  }


}

getUnit() {
  this._masterService.getQuantityUnit().subscribe(
    (data: IQuantityUnit[]) => {
      this.iQuantityUnitColl = data;
    })
}
getQuantityUnit(key, quantity) {
  if (this.activeStatusFilterBtn === 'Awarded') {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      if (data.isAwrded) {
        return data.awardedQty + ' ' + data.awardedQtyUnit;
      } else {
        return '';
      }
    } else {
      return '';
    }

  } else {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.awardedQty + ' ' + data.awardedQtyUnit;
    } else {
      return 'N/A';
    }
  }
}

manipultePartId(data){
   
    if(this.rfqPartId){
      const dataRecord = data.find(m => m.rfqPartId == this.rfqPartId);
    this.awardingModelQuoteDetailsViewModel = [dataRecord]
    }
}

// Keeping this code for Refrence M2-4813 
// stepNext() {
  
//   this.setFlowNameOnNext()
//      console.log("this.finalQuantityData",this.finalQuantityData)
//     if (this.nextBtn) {
//       const checkData = this.finalQuantityData.filter(m => m.rfqQuoteItemsId === null && (m.unit === null || m.price === null) || (m.unit === "" || m.price === ""));
//       if(checkData.length > 1){
//        this._toastr.warning('Please Select Quantity and Price.', 'Warning!');
//     }else{
//       const checkData = this.finalQuantityData.filter(m => m.rfqQuoteItemsId === null && (m.unit === null || m.price === null) || (m.unit === "" || m.price === ""));
//         if(checkData.length > 1){
//          this._toastr.warning('Please Select Quantity and Price.', 'Warning!');
//       }else{
//      this.closeModelEventHandler.emit(false);
//      this.isAwardStep2 = true;
//      this.isFirstTabCompleted = true;
//      this.isSecondTabCompleted = false;  
//      this.isBackButtonClicked = false;
//      if((this.selectedId == 16 || this.selectedId == 17 || this.selectedId == 18 || this.selectedId == 20)&&this.finalQuantityData.length == 1){
//       this.awardingModelQuoteDetailsViewModel.forEach(element => {


//         this.onlyForSupplierData = {
//           "isRfqStatus":true,
//           "rfqPartStatusId":this.selectedId,
//           "unit":null,
//           "price":null,
//           "rfqQuoteItemsId":null,
//           "rfqPartId":element.rfqPartId,
//           "awardedUnitTypeId":0,
//           "createdDate":new Date()
//         }
        
//         this.finalQuantityData.push(this.onlyForSupplierData)
//       });
//     }
//     console.log(" this.finalQuantityData", this.finalQuantityData); 
//      }
//     }
//    }
// }
stepNext() {
  this.setFlowNameOnNext()
  // console.log(this.selectedId, "this.selectedId");
  if (this.selectedId == 17) {
    // console.log(" --------------inside award non-mfg--------------");
    this.companyName = "";
    this.getRegionList()
    this.isAwardNonMfg = true;
    this.isAwardMfgOffline = false;
    this.isAwardAnotherMfg = false;
  } else if (this.selectedId == 16) {
    this.selectedCompany = []
    this.getRegionList()
    this.isAwardAnotherMfg = true;
    this.isAwardNonMfg = false;
    this.isAwardMfgOffline = false;
  } else if (this.selectedId == 20) {
    // console.log(
    //   " --------------inside award offline manufacture --------------"
    // );
    this.selectedCompany = []
    this.getRegionList()
    this.isAwardMfgOffline = true;
    this.isAwardAnotherMfg = false;
    this.isAwardNonMfg = false;
  } else if(this.selectedId == 18){
    this.notAwarded = true
    this.isAwardMfgOffline = false;
    this.isAwardAnotherMfg = false;
    this.isAwardNonMfg = false;
  }
    if (this.nextBtn) {
      // debugger;
      const checkData = this.finalQuantityData.filter(
        (m) =>
          (m.rfqQuoteItemsId === null &&
            (m.unit === null || m.price === null)) ||
          m.unit === "" ||
          m.price === ""
      );
      // debugger;
      if (checkData.length > 1) {
        this._toastr.warning("Please Select Quantity and Price.", "Warning!");
      } else {
        const checkData = this.finalQuantityData.filter(
          (m) =>
            (m.rfqQuoteItemsId === null &&
              (m.unit === null || m.price === null)) ||
            m.unit === "" ||
            m.price === ""
        );
        if (checkData.length > 1) {
          this._toastr.warning(
            "Please Select Quantity and Price.",
            "Warning!"
          );
        } else {
          this.closeModelEventHandler.emit(false);
          if (this.selectedId == 17) {
            this.isAwardStep2 = false;
            // console.log(" --------------inside award non-mfg--------------");
            this.isAwardNonMfg = true;
          } else if (this.selectedId == 16) {
            this.isAwardStep2 = false;
            // console.log(
            //   " --------------inside award another mfg--------------"
            // );
          } else if (this.selectedId == 20) {
            this.isAwardStep2 = false;
            // console.log(
            //   " --------------inside award offline manufacture --------------"
            // );
          }else if(this.selectedId == 18){
            this.isAwardStep2 = false;
          } else {
            this.isAwardStep2 = true;
          }
          this.isFirstTabCompleted = true;
          this.isSecondTabCompleted = false;
          this.isBackButtonClicked = false;
          if (
            (this.selectedId == 16 ||
              this.selectedId == 17 ||
              this.selectedId == 18 ||
              this.selectedId == 20) &&
            this.finalQuantityData.length == 1
          ) {
            this.awardingModelQuoteDetailsViewModel.forEach((element) => {
              this.onlyForSupplierData = {
                isRfqStatus: true,
                rfqPartStatusId: this.selectedId,
                unit: null,
                price: null,
                rfqQuoteItemsId: null,
                rfqPartId: element.rfqPartId,
                awardedUnitTypeId: 0,
                createdDate: new Date(),
              };

              this.finalQuantityData.push(this.onlyForSupplierData);
            });
          }
        }
      }
    
  }
}

onIsAward() {
  this.closeModelEventHandler.emit(true);
  this.isAward = false;
  this.isAwardStep2 = false;
}
onIsAward1() {
  if(!this.isBackButtonClicked){
    this.closeModelEventHandler.emit(true);
  } else {
    this.closeModelEventHandler.emit(false);
  }
  
}

gotoAwardBack() {
this.isBackButtonClicked = true;
this.isAwardStep2 = false;
// this.closeModelEventHandler.emit(false);
this.isAward = true;
this.isFirstTabCompleted = false;
this.isSecondTabCompleted = false;
// this.getAwardingModelQuotePartData();
}

  
cancelAward() {
    this.isFirstTabCompleted = false;
    this.isSecondTabCompleted = false;
    this.isAward = false;
    this.closeModelEventHandler.emit(true);
    this.isAwardStep2 = false;
}
  
// Calling Api for Award model step 2
awardStepTwo(){
  if (!this.isUploadMyOwnFile || this.iPartUploadedFileNameList.FileNameList.length === 1) {
  //  this._RfqDetailComponent.onOrderTab();
  const updatedArray = this.finalQuantityData
  updatedArray.splice(0,1)
  this.awardQuoteIds = [];
  let awardQuoteObj = [];
  let supplierIds = [];
  this.captureAwardRFQ();
  this.warning();
  this.rfqdetails();


  // if (this.awardQuoteIds.length !== 0) {
    const isZeroExist = this.awardQuoteIds.includes(0);
    let isSupplierNotExist = supplierIds.includes('null');
    if (isSupplierNotExist) {
      this._toastr.warning('Please select manufacturer to award', 'Warning!');
    } else {
      if (!this.isAwardDone) {
        this.isAwardDone = true;
        const data = {
          "rfqQuoteItemList":updatedArray,
          "rfqId": this.rfqId,        
          "contactId": this.loggedId,
          "isAwrded": true
        }
        this._rfqService.SetRFQQuoteStatus(data).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success('RFQ Has Been Awarded', 'Success!');
              this._rfqService.setRfqAwardEvent(true);
              this._rfqService.set(true, 'rfqLoaded');
              this.isAward = false;
              this.isAwardDone = false;
              this.getBuyerQuotingList();
              // this.expandQuotesAfterAward();
              this.captureAwardRFQ();
              this.LocalAwardedManufractureListColl = [];
              this.awardQuoteIds.forEach(element => {
                if (element !== 0) {
                  for (let i = 0; i < this.NPartArrayColl.length; i++) {
                    if (this.NPartArrayColl[i].rfqQuoteItemsId === element) {
                      this.NPartArrayColl.splice(i, 1);
                    }
                  }
                }
              });
            } else {
              this.isAwardDone = false;
              this._toastr.error(result['errorMessage'], 'Error!');
            }
          },
          error => {
            this.isAwardDone = false;
            this._rfqService.handleError(error);
          },
          () => {
            this.isAwardDone = false;
          }
        );
      }
    }
  // } else {}
  if (this.selectedId < 21) {
    this.awardStatus = "Not Awarded"
  }
  else {
    this.awardStatus = "Awarded"
  }
  // this.router.navigate(['/rfq/rfqdetail'], { queryParams: { rfqId:this.deCryptRFQIDUrl,order:"Order"}});
  const currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });

  // ----------------------------------------------------------------------
  // console.log("this.rfqId----------------->",typeof(this.rfqId))
  // this.encryptedRfqID = this._profileService.encrypt(this.rfqId);
  // console.log("const encryptedRfqID = this._profileService.encrypt(id);")
let EncryptId = this.encryptFUnction(this.rfqId)
// console.log("EncryptId@@@@@@@@@@@",EncryptId)

this.encrypted = EncryptId.toString();
  // const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.rfqId), this.key, {
  //   keySize: 128 / 8,
  //   iv: this.iv,
  //   mode: CryptoJS.mode.CBC,
  //   padding: CryptoJS.pad.Pkcs7
  // });
  // console.log("encrypted",encrypted.salt)
  // "rfqEncryptedId":this.encryptedRfqID

  var data = {}
      if(this.isSendMfgStandard === true ){
        data = { 
          "rfqId": this.rfqId,
          "purchaseOrderNumber": this.purchaseOrder,
          "isMfgStandardPurchaseOrder": true,
          "supplierContactId": this.selectedId,
          "FileName" :"", 
          "rfqEncryptedId":this.encrypted
          
      }  
    }else{
        data =	{ 
          "rfqId": this.rfqId,
          "purchaseOrderNumber": this.purchaseOrder,
          "isMfgStandardPurchaseOrder": false,
          "FileName" :this.s3FileName ,
          "supplierContactId":this.selectedId,
          "rfqEncryptedId":this.encrypted
      }     
      }
      if(this.purchaseOrder == ""){
        this.purchaseEmpty = true;
        this._toastr.warning("Please Select PO First", 'Warning.!');
      }
      else{
        this._rfqService.saveAwardData(data).subscribe(
          response => {
            this._toastr.success("PO Sent to Manufacturer", 'Success!');
            // close pop-up here
            this.isAwardStep2 = false;
          }
        ),error =>{
        };
      }


  }

}

encryptFUnction(input){
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), this.key, {
    keySize: 128 / 8,
    iv: this.iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted;
}

rfqdetails(){

JSON.stringify(localStorage.getItem('rfqGuid')) 
  this._rfqService.getRFQExtraDetails(this.rfqId,this.selectedId,JSON.stringify(localStorage.getItem('rfqGuid'))).subscribe((result: any) => {
    this.isAwardStep2 = false;
    this.isAward = false;
      });


}


getRFQItemsId(){

    let iRFQPartQuantityQuote1: IRFQPartQuantityQuote;
  iRFQPartQuantityQuote1 = {
    'rfqQuoteItemsId': 0,
    'rfqQuoteSupplierQuoteId': 0,
    'rfqPartId': 0,
    'perUnitPrice': 0,
    'isAlreadyAwrded': false,
    'rfqPartIdString': '',
    'toolingAmount': 0,
    'miscellaneousAmount': 0,
    'shippingAmount': 0,
    'rfqQuoteItemList': [],
    'rfqPartQuantityId': 0,
    'isRfqResubmitted': false,
    'isAwrded': false,
    'awardedQty': 0,
    'awardedDate': '2018-11-29T06:09:50.622Z',
    'isAwardAccepted': true,
    'awardAcceptedOrDeclineDate': '2018-11-29T06:09:50.622Z',
    'partId': 0,
    'partName': '',
    'partNumber': '',
    'rfqId': this.rfqId,
    'quantityLevel': 0,
    'contactId': 0,
    'contactIdList': [this.selectedId],
    'errorMessage': '',
    'result': false,
    'awardedQtyUnit': '',
    'isDeclineAll': false,
    'buyerFeedbackId': '',
    estLeadTimeValueRange: null,
    estLeadTimeRange: null,
    estLeadTimeValue: null
  };
  this._rfqService.GetRFQPartQuantityQuoteBYRfqId(iRFQPartQuantityQuote1).subscribe((result: any) => {

    this.partDataItem = result.data;

      });
}

warning(){


  this._rfqService.getWarningSetting(this.selectedId).subscribe((result: any) => {
    
    this.isAwardStep2 = false;
    this.isAward = false;
      });
}

captureAwardRFQ(){
var captData = {
  "isRfqStatus":this.isRfqStatus,
  // https://qaapp2api.mfg.com/api/buyer/GetAwardingModelSupplierList?rfqId=1195417&rfqPartId=93583
  "rfqPartStatusId":0,
  "unit":0,
  "price":0,
  "rfqQuoteItemsId":this.rfqItemID, //TO BE CHANGED
  "rfqPartId":this.rfqPartId,
  "awardedUnitTypeId":0
}

  this._rfqService.captureAwardRfqEvent(captData).subscribe((result: any) => {
this.cancelAward();
  });
  // this._rfqService.captureAwardRfqEvent(captData).subscribe(
  //   result => {
  //     if (result['result'] === true) {
  //     }
  //   })
}
//  expandQuotesAfterAward() {
//   this.totalPartCount = 0;
//   // tslint:disable-next-line:prefer-const
//   let iRFQPartQuantityQuote1: IRFQPartQuantityQuote;
//   iRFQPartQuantityQuote1 = {
//     'rfqQuoteItemsId': 0,
//     'rfqQuoteSupplierQuoteId': 0,
//     'rfqPartId': 0,
//     'perUnitPrice': 0,
//     'isAlreadyAwrded': false,
//     'rfqPartIdString': '',
//     'toolingAmount': 0,
//     'miscellaneousAmount': 0,
//     'shippingAmount': 0,
//     'rfqQuoteItemList': [],
//     'rfqPartQuantityId': 0,
//     'isRfqResubmitted': false,
//     'isAwrded': false,
//     'awardedQty': 0,
//     'awardedDate': '2018-11-29T06:09:50.622Z',
//     'isAwardAccepted': true,
//     'awardAcceptedOrDeclineDate': '2018-11-29T06:09:50.622Z',
//     'partId': 0,
//     'partName': '',
//     'partNumber': '',
//     'rfqId': this.rfqId,
//     'quantityLevel': 0,
//     'contactId': 0,
//     'contactIdList': [this.currentOpenContactId],
//     'errorMessage': '',
//     'result': false,
//     'awardedQtyUnit': '',
//     'isDeclineAll': false,
//     'buyerFeedbackId': '',
//     estLeadTimeValueRange: null,
//     estLeadTimeRange: null,
//     estLeadTimeValue: null
//   };
//   this.isLoader1 = true;
//   this._rfqService.GetRFQPartQuantityQuoteBYRfqId(iRFQPartQuantityQuote1).subscribe(
//     result => {
//       this.isLoader1 = false;
//       if (result.result === true) {
//         this.isRecAvailable = false;
//         this.iRFQPartQuantityQuoteColl = result['data'];
//         const Data = this.iRFQPartQuantityQuoteColl;
//         if (!this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId) {
//           this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId = '';
//         }
//         this.isLoader1 = false;
//         let miscellaneousAmount = 0;
//         let toolingAmount = 0;
//         let shippingAmount = 0;
//         let perUnitPrice = 0;
//         this.iRFQPartQuantityQuoteColl = Data.filter(m => m.rfqQuoteItemsId !== 0);
//         this.iRFQPartQuantityQuoteColl.forEach(x => miscellaneousAmount += x.miscellaneousAmount);
//         this.iRFQPartQuantityQuoteColl.forEach(x => toolingAmount += x.toolingAmount);
//         this.iRFQPartQuantityQuoteColl.forEach(x => shippingAmount += x.shippingAmount);
//         this.iRFQPartQuantityQuoteColl.forEach(x => perUnitPrice += x.perUnitPrice * x.awardedQty);
//         this.rfqPartTotal = miscellaneousAmount + toolingAmount + shippingAmount + perUnitPrice;
//       } else {
//         this.isRecAvailable = true;
//         this.iRFQPartQuantityQuoteColl = [];
//         this.rfqPartTotal = 0;
//       }
//     },
//     error => {
//       this.isLoader1 = false;
//       this._rfqService.handleError(error);
//     },
//     () => {

//     }
//   );
// }

//  checkToDisableAwardButton(){}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
}
 getOriginalFineName(fileName) {
  if (fileName !== null) {
    const filenNameArray = (fileName).split('_S3_');
    return filenNameArray[1];
  } else {
    return '';
  }
}

onFileSelected($event: any) {
  this.uploadPartDetailsFiles();
  $event.srcElement.value = '';
}


upload(fileToUpload: any) {
  // debugger;
  const input = new FormData();
  input.append('file', fileToUpload);
  // tslint:disable-next-line: deprecation
  const headers = new Headers();
  this.createAuthorizationHeader(headers);
  const url = environment.APIEndPoint + uploadFileNDA;
  return this._Http.post(url, input, {
    headers: headers
  });
}
fileOverBase(e: any): void {
  this.hasBaseDropZoneOver = e;
}

uploadPartDetailsFiles() {
  const files = this.partDetailUploader.queue;
  // debugger;
  this.setFlowNameUpload()
  //for (const entry of files) {
    if(this.iPartUploadedFileNameList.FileNameList.length === 0 && files[0]._file.type==="application/pdf") {
      const file = files[0]._file;
      // debugger;
      if (files[0].isUploaded === false) {
        ++this.isAttachmentsLoading;
        this.upload(file).subscribe(res => {
          const result = JSON.parse(res['_body']);
          const fName = result['fileName'];
          this.s3FileName = fName;
          files[0].isUploaded = true;
          this.partFileAddedError = false;
          const fileNameArray = fName.split('_S3_');
          this.iPartUploadedFileName.oFileName = fileNameArray[1];
          this.fileName = this.iPartUploadedFileName.oFileName
          this.iPartUploadedFileName.CompleteFileName = fName;
          --this.isAttachmentsLoading;
          this.iPartUploadedFileNameList.FileNameList.push(
            this.iPartUploadedFileName
          );
          this.iPartUploadedFileName = {
            oFileName: '',
            CompleteFileName: ''
          };
          this.partDetailUploader.queue = [];
        });
      }

      if (this.deliveryDate === false) {
        this.iPartsViewModel.createNewPart = true;
      }
    } else {
      this.partDetailUploader.queue = [];
    //  this._toastr.error('Please select PDF file only', 'Error!');
    }
    
  //}
}
// closePopUp(){
//   this.isAward = false;
// }


uploadPartImages() {
  this.uploader.onAfterAddingAll = (fileItem) => {
    // debugger;
    this.uploadPartDetailsFiles1(fileItem);
  };

}

uploadPartDetailsFiles1(fileItem) {   
  // for (const entry of fileItem) {
    this.setFlowNameUpload()
     const file = fileItem[0]._file;
     // debugger;
     if(this.iPartUploadedFileNameList.FileNameList.length === 0 && fileItem[0]._file.type==="application/pdf"){
     if (fileItem[0].isUploaded === false) {
       ++this.isAttachmentsLoading;
     //   debugger;
       this.upload(file).subscribe(res => {
         // debugger;
         const result = JSON.parse(res['_body']);
         const fName = result['fileName'];
         // debugger;
         fileItem[0].isUploaded = true;
         const fileNameArray = fName.split('_S3_');
         this.iPartUploadedFileName.oFileName = fileNameArray[1];
         this.iPartUploadedFileName.CompleteFileName = fName;
         --this.isAttachmentsLoading;
         this.iPartUploadedFileNameList.FileNameList.push(
           this.iPartUploadedFileName
         );
         this.iPartUploadedFileName = {
           oFileName: '',
           CompleteFileName: ''
         };
         // this.arr = [];
         this.partDetailUploader.queue = [];
       });
     }

     if (this.deliveryDate === false) {
       this.iPartsViewModel.createNewPart = true;
     }
 //  }
   } else {
     this.partDetailUploader.queue = [];
   //  this._toastr.error('Please select PDF file only', 'Error!');
   }
 }

removeSavedPartDetailFile(partName, index: any) {
  if (this.iPartUploadedFileNameList.FileNameList) {
    this.iPartUploadedFileNameList.FileNameList.splice(index, 1);
  }
  let partNAme = partName.CompleteFileName ? partName.CompleteFileName : this.iPartsViewModel.rfqPartFile;
  // debugger;
  this._rfqService.deletePartGeneralAttachment(partNAme, this.loggedId, 0, this.rfqId).subscribe(
    (data: IPartsViewModel) => {
      console.log('File deleted....');
    },
    error => () => {
      console.error('Error: $error');
      this._toastr.error(error, 'Error!');
    }
  );
}

uploadMyOwnFile(btnState) {
  this.uploadMyOwnStatus()
  this.isUploadMyOwnFile = true;
  this.activeStatusFilterBtn1 = btnState;
}

sendMFG(btnState) {
  this.sendMfGStandStatus()
  this.isUploadMyOwnFile = false;
  this.activeStatusFilterBtn1 = btnState;

}

sendMfGStandStatus(){
  this.isSendMfgStandard = true
}

uploadMyOwnStatus(){
  this.isSendMfgStandard = false
}
unitCheck(index,value,parId){
  let newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == parId);
  if(newcheckRfqPartId>0){
    this.onlyForSupplierData= this.finalQuantityData.find(x => x.rfqPartId == parId);
    this.onlyForSupplierData.unit = value
    this.finalQuantityData.splice(newcheckRfqPartId, 1)
  }else{
      this.onlyForSupplierData = {
      "isRfqStatus":true,
      "rfqPartStatusId":this.selectedId,
      "unit":value,
      "price":null,
      "rfqQuoteItemsId":null,
      "rfqPartId":parId,
      "awardedUnitTypeId":0,
      "createdDate":new Date()
    }
  }
  this.finalQuantityData.push(this.onlyForSupplierData)
if(this.finalQuantityData.length > 1){
  this.nextBtn = true
}else {
  this.nextBtn = false

}

  
  
}

awardedUnitTypeCheck(index,value,parId){
  let newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == parId);
      if(newcheckRfqPartId>0){
        this.onlyForSupplierData= this.finalQuantityData.find(x => x.rfqPartId == parId);
        this.onlyForSupplierData.awardedUnitTypeId = value
        this.finalQuantityData.splice(newcheckRfqPartId, 1)
      }else{
          this.onlyForSupplierData = {
          "isRfqStatus":true,
          "rfqPartStatusId":this.selectedId,
          "unit":null,
          "price":null,
          "rfqQuoteItemsId":null,
          "rfqPartId":parId,
          "awardedUnitTypeId":value,
          "createdDate":new Date()
        }
      }
      this.finalQuantityData.push(this.onlyForSupplierData)
}


priceCheck(index,value,parId){
  let newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == parId);
      if(newcheckRfqPartId>0){
        this.onlyForSupplierData= this.finalQuantityData.find(x => x.rfqPartId == parId);
        this.onlyForSupplierData.price = value
        this.finalQuantityData.splice(newcheckRfqPartId, 1)
      }else{
          this.onlyForSupplierData = {
          "isRfqStatus":true,
          "rfqPartStatusId":this.selectedId,
          "unit":null,
          "price":value,
          "rfqQuoteItemsId":null,
          "rfqPartId":parId,
          "awardedUnitTypeId":0,
          "createdDate":new Date()
        }
      }
      this.finalQuantityData.push(this.onlyForSupplierData)
 if(this.finalQuantityData.length > 1){
  this.nextBtn = true
}else {
  this.nextBtn = false

}
}

// ***************** New Functions End Here***********************

setFlowName(){
  let logMessage = "My quotes award modal 1 - open";
   this._rfqService.setAwardFlow(this.rfqId,logMessage).subscribe(
            response => {
              console.log("response",response)
              // this._toastr.success("PO Sent to Manufacturer", 'Success!');
             
            }
          ),error =>{
          };
  }
  setFlowNameOnNext(){
    let logMessage = "My quotes award modal 2 - open";
     this._rfqService.setAwardFlow(this.rfqId,logMessage).subscribe(
              response => {
                console.log("response",response)
                // this._toastr.success("PO Sent to Manufacturer", 'Success!');
               
              }
            ),error =>{
            };
    }

setFlowNameUpload(){
  let logMessage = "My quotes award modal 2 - File Uploaded";
   this._rfqService.setAwardFlow(this.rfqId,logMessage).subscribe(
            response => {
              console.log("response",response)
              // this._toastr.success("PO Sent to Manufacturer", 'Success!');
             
            }
          ),error =>{
          };
}
showOthersUnitCheck(index,value,parId){
  // debugger
  let newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == parId);
  if(newcheckRfqPartId>0){
    this.onlyForSupplierData= this.finalQuantityData.find(x => x.rfqPartId == parId);
    this.onlyForSupplierData.unit = value;
    this.onlyForSupplierData.rfqQuoteItemsId = null;
    this.onlyForSupplierData.rfqPartStatusId = this.selectedId

    this.finalQuantityData.splice(newcheckRfqPartId, 1)
  }else{
      this.onlyForSupplierData = {
      "isRfqStatus":true,
      "rfqPartStatusId":this.selectedId,
      "unit":value,
      "price":null,
      "rfqQuoteItemsId":null,
      "rfqPartId":parId,
      "awardedUnitTypeId":0,
      "createdDate":new Date()
    }
  }
  this.finalQuantityData.push(this.onlyForSupplierData)
  if(this.finalQuantityData.length > 1){
    this.nextBtn = true
  }else {
    this.nextBtn = false

  }
// console.log(" this.finalQuantityData", this.finalQuantityData); 

  
  
}
showOthersPriceCheck(index,value,parId){
  
  let newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == parId);
      if(newcheckRfqPartId>0){
        this.onlyForSupplierData= this.finalQuantityData.find(x => x.rfqPartId == parId);
        this.onlyForSupplierData.price = value
        this.onlyForSupplierData.rfqQuoteItemsId = null;
        this.onlyForSupplierData.rfqPartStatusId = this.selectedId
        this.finalQuantityData.splice(newcheckRfqPartId, 1)
      }else{
          this.onlyForSupplierData = {
          "isRfqStatus":true,
          "rfqPartStatusId":this.selectedId,
          "unit":null,
          "price":value,
          "rfqQuoteItemsId":null,
          "rfqPartId":parId,
          "awardedUnitTypeId":0,
          "createdDate":new Date()
        }
      }
      this.finalQuantityData.push(this.onlyForSupplierData)
//  console.log(" this.finalQuantityData", this.finalQuantityData); 
if(this.finalQuantityData.length > 1){
  this.nextBtn = true
}else {
  this.nextBtn = false

}
}
showOthersawardedUnitTypeCheck(index,value,parId){
  let newcheckRfqPartId = this.finalQuantityData.findIndex(x => x.rfqPartId == parId);
  if(newcheckRfqPartId>0){
    this.onlyForSupplierData= this.finalQuantityData.find(x => x.rfqPartId == parId);
    this.onlyForSupplierData.awardedUnitTypeId = value
    this.onlyForSupplierData.rfqQuoteItemsId = null;
    this.onlyForSupplierData.rfqPartStatusId = this.selectedId
    this.finalQuantityData.splice(newcheckRfqPartId, 1)
  }else{
      this.onlyForSupplierData = {
      "isRfqStatus":true,
      "rfqPartStatusId":this.selectedId,
      "unit":null,
      "price":null,
      "rfqQuoteItemsId":null,
      "rfqPartId":parId,
      "awardedUnitTypeId":value,
      "createdDate":new Date()
    }
  }
  this.finalQuantityData.push(this.onlyForSupplierData)
//  console.log(" this.finalQuantityData", this.finalQuantityData); 
}
  // mixPannel Buyer Rfq Awarded
  trackMixpaneRfqAwarded() {
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_BUYER_RFQ_AWARDED,{
      rfq_id: localStorage.getItem('RfqId'),
      date: submitModel.createdOn,   //when rfq started
      validated_buyer: submitModel.isValidatedBuyer,
      award_status: this.awardStatus,
      rfq_count: localStorage.getItem('submitRfqCount'),
      rfq_awarded: this.isAwardDone,
      rfq_purpose: localStorage.getItem('rfqPurposeAnswer'),
      manufacturer_id: localStorage.getItem('supplier_company_id'),
      manufaturer_name: localStorage.getItem('supplier_company'),
    });
  }
     // ********** Closing Non-mfg pop up modal **********
     closeNonMfgPopUp() {
      this.companyNameActive = false;
      this.regionList = []
      this.isAwardNonMfg = false;
      this.isAward = true;
    }
  
    onIsAwardNonMfg() {
      this.companyNameActive = false;
      this.regionList = []
      this.isAwardNonMfg = false;
      this.isAward = true;
    }
  
    // ********** This function will filter the manufacturer company name **********
    filterCompany(event) {
      let filtered: any[] = [];
      let query = event.query;
      let length = query.length;
      if (length > 2) {
        for (let i = 0; i < this.getCompanyName.length; i++) {
          let country = this.getCompanyName[i];
          if (country.awardedCompanyName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
          }
        }
        this.filteredCompany = filtered;
        if(this.filteredCompany){
          if(this.filteredCompany.length == 0){
            this.disableUpdate = true;
          }else{
            this.disableUpdate = false;
          }
        }
      } else{
        this.disableUpdate = true;
      }
    }
  
    // ********** Region list ************
    getRegionList() {
      // const dataCount = this._rfqService.get("ITerritoryClassificationModelColl");
      // console.log("datacount-->", dataCount);
      // this.regionList = dataCount.slice(0, -1);
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          if(data2){
            this.regionList = data2.filter(x => x.territoryClassificationId !== 0 && x.territoryClassificationId !== 7);
          }
        },)
    }
  
    // ********** Closing Another mfg pop up modal **********
    closeAnotherMfgPopUp() {
      this.showCompanyDropdown = false
      this.regionList = []
      this.isAwardNonMfg = false;
      this.isAward = true;
      this.isAwardAnotherMfg = false;
      this.disableUpdate = true;
  
    }
  
    onIsAwardMfgHide() {
      this.disableUpdate = true;
      this.showCompanyDropdown = false
      this.regionList = []
      this.isAwardNonMfg = false;
      this.isAward = true;
      this.isAwardAnotherMfg = false;
    }
  
    // ********** Closing Another mfg pop up modal **********
  
    closeOfflineMfgPopUp() {
      this.reasonName = ""
      this.showCompanyDropdown = false
      this.regionList = []
      this.isAwardNonMfg = false;
      this.isAwardAnotherMfg = false;
      this.isAwardMfgOffline = false;
      this.isAward = true;
      this.disableUpdate = true;
    }
  
    onIsOfflineHide() {
      this.disableUpdate = true;
      this.reasonName = ""
      this.showCompanyDropdown = false
      this.regionList = []
      this.isAwardNonMfg = false;
      this.isAwardAnotherMfg = false;
      this.isAwardMfgOffline = false;
      this.isAward = true;
    }
  
    // ****** Set Region ID ******
    setRegionId(event) {
      this.regionId = event;
      if(this.regionId != "undefined"){
        this._rfqService
          .getManufacturerCompanyNames( this.rfqId,this.loggedId,this.regionId)
          .subscribe((result) => {
            if(result.data.length >0){
    
              this.showCompanyDropdown = true;
              this.companyNameActive = true
            }
            this.getCompanyName = result["data"];
          });
      }else{
        this.showCompanyDropdown = false;
        this.companyNameActive = false
        this.getCompanyName =[];
        this.selectedCompany = ""
        this.disableUpdate = true;
        this.companyName = "";
        this.companyNameUpdate = true;
      }
      
  
    }
  
    // ******** Saving data for another modal **********
    saveAnotherPopData(popUPname) {
      this._rfqService.passValue(popUPname);
      const updatedArray = this.finalQuantityData;
      updatedArray.splice(0, 1);
      this.awardQuoteIds = [];
      let awardQuoteObj = [];
      let supplierIds = [];
      this.captureAwardRFQ();
      this.warning();
      this.rfqdetails();
      if (popUPname == "Non-MFG") {
        this.awardPopupData = {
          rfqQuoteItemList: updatedArray,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          awardedRegionId:this.regionId,
          isAwrded:true,
          awardedCompanyName:this.companyName
        };
      } else if (popUPname == "Another") {
        this.awardPopupData = {
          rfqQuoteItemList: updatedArray,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          awardedRegionId:this.regionId,
          isAwrded:true,
          awardedCompanyId: this.selectedCompany.awardedCompanyId
        };
      } else if (popUPname == "Offline") {
        this.awardPopupData = {
          rfqQuoteItemList: updatedArray,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          awardedRegionId:this.regionId,
          awardedCompanyId: this.selectedCompany.awardedCompanyId,  
          isAwrded:true,
          awardedWhyOfflineReason:this.reasonName
        };
      }else if(popUPname == "notAwarded"){
        this.awardPopupData = {
          rfqQuoteItemList: updatedArray,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          isAwrded:false,
          notAwardedReason:this.notAwardedComment
        };
      }
      this._rfqService.SetRFQQuoteStatus(this.awardPopupData).subscribe(
        (result) => {
          if (result["result"] === true) {
            this._toastr.success("RFQ Has Been Awarded", "Success!");
            this.isAwardAnotherMfg = false;
            this.isAwardNonMfg = false;
            this.isAwardMfgOffline = false;
            this._rfqService.setRfqAwardEvent(true);
            this._rfqService.set(true, "rfqLoaded");
            this.isAward = false;
            this.isAwardDone = false;
            this.getBuyerQuotingList();
            // this.expandQuotesAfterAward();
            this.captureAwardRFQ();
            this.LocalAwardedManufractureListColl = [];
            this.awardQuoteIds.forEach((element) => {
              if (element !== 0) {
                for (let i = 0; i < this.NPartArrayColl.length; i++) {
                  if (this.NPartArrayColl[i].rfqQuoteItemsId === element) {
                    this.NPartArrayColl.splice(i, 1);
                  }
                }
              }
            });
          } else {
            this.isAwardDone = false;
            this._toastr.error(result["errorMessage"], "Error!");
          }
        },
        (error) => {
          this.isAwardDone = false;
          this._rfqService.handleError(error);
        },
        () => {
          this.isAwardDone = false;
        }
      );
    }
  
      // ********** Closing Not Awarded  pop up modal **********
  
      closeNotAwardedPopUp() {
        this.notAwardedComment = ""
        this.isAwardNonMfg = false;
        this.isAwardAnotherMfg = false;
        this.isAwardMfgOffline = false;
        this.notAwarded = false
        this.isAward = true;
      }
    
      onNotAwardedHide() {
        this.notAwardedComment = ""
        this.isAwardNonMfg = false;
        this.isAwardAnotherMfg = false;
        this.isAwardMfgOffline = false;
        this.notAwarded = false
        this.isAward = true;
      }

      // ******** Saving data for Offline modal **********
    saveOfflinePopData(popUPname) {
      this._rfqService.passValue(popUPname);
      const updatedArray = this.finalQuantityData;
      updatedArray.splice(0, 1);
      this.awardQuoteIds = [];
        this.awardPopupData = {
          rfqQuoteItemList: updatedArray,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          awardedRegionId:this.regionId,
          awardedCompanyId: this.selectedCompany.awardedCompanyId,  
          isAwrded:true,
          awardedWhyOfflineReason:this.reasonName
        };

        if(this.reasonName.length !== 0 && !this.disableUpdate){
          this._rfqService.SetRFQQuoteStatus(this.awardPopupData).subscribe(
        (result) => {
          if (result["result"] === true) {
            this._toastr.success("RFQ Has Been Awarded", "Success!");
            this.isAwardAnotherMfg = false;
            this.isAwardNonMfg = false;
            this.isAwardMfgOffline = false;
            this._rfqService.setRfqAwardEvent(true);
            this._rfqService.set(true, "rfqLoaded");
            this.isAward = false;
            this.isAwardDone = false;
            this.getBuyerQuotingList();
            this.rfqdetails();
            // this.expandQuotesAfterAward();
            this.captureAwardRFQ();
            this.LocalAwardedManufractureListColl = [];
            this.awardQuoteIds.forEach((element) => {
              if (element !== 0) {
                for (let i = 0; i < this.NPartArrayColl.length; i++) {
                  if (this.NPartArrayColl[i].rfqQuoteItemsId === element) {
                    this.NPartArrayColl.splice(i, 1);
                  }
                }
              }
            });
          } else {
            this.isAwardDone = false;
            this._toastr.error(result["errorMessage"], "Error!");
          }
        },
        (error) => {
          this.isAwardDone = false;
          this._rfqService.handleError(error);
        },
        () => {
          this.isAwardDone = false;
        }
      );
        }else{
          this._toastr.warning('Please Fill All Fields', 'Warning!');
        }
      
     
    }
}