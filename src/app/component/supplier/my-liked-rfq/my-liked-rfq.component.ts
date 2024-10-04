import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { Router } from '@angular/router';
import { ISupplierRFQViewModel, IRfqSupplierLikesViewModel } from '../../../core/models/rfqModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-my-liked-rfq',
  templateUrl: './my-liked-rfq.component.html',
  styleUrls: ['./my-liked-rfq.component.scss']
})
export class MyLikedRfqComponent implements OnInit {

  // iRfqSupplierLikesViewModel: IRfqSupplierLikesViewModel;
  // iRFQViewModelColl: ISupplierRFQViewModel[];
  // iFilteredRFQViewModelColl: ISupplierRFQViewModel[];
  // items: ISupplierRFQViewModel[];
  // filteredItems: ISupplierRFQViewModel[];
  // msgs: string;
  // // Model Instance End

  // // variable Declarations
  // display: boolean;
  // isTilesView: boolean;
  // isGridView: boolean;
  // searchFilterValue: string;
  // stateFilterValue: string;
  // cloneRfqName: string;
  // sortFilterValue: string;
  // isLoader: boolean;
  // isRfqAvailable: boolean;
  // pages = 7;
  // totalRfq: number;
  // pageStart = 1;
  // activeStatusFilterBtn: string;
  // pageSize = 50;
  // pageNumber = 0;
  // currentIndex = 1;
  // inputLength = 50;
  // pagesIndex: Array<number>;

  // toggleNoRFQBodyBtn = true;
  // iRFQViewModel: ISupplierRFQViewModel;
  // defaultAwsPath = 'https://s3.us-east-2.amazonaws.com/mfg.mp2020/';

  constructor(private _rfqService: RfqService, private _toastr: ToastrService,
    private router: Router,
    private _SupplierService: SupplierService) {
      this._rfqService.set(false, 'isBuyerCommpleteProfile');
    // this.isTilesView = true;
    // this.isGridView = false;
    // this.isRfqAvailable = false;
    // this.stateFilterValue = '';
    // this.searchFilterValue = '';
    // this.sortFilterValue = 'Recent';
    // this.activeStatusFilterBtn = 'All';
    // this.iRfqSupplierLikesViewModel = {
    //   rfqSupplierLikesId: 0,
    //   rfqId: 0,
    //   contactId: 0,
    //   companyId: 0,
    //   isRfqDisLike: null,
    //   isRfqLike: null,
    //   likeDate: null,
    //   errorMessage: '',
    //   result: false,
    // };
    // this.iRFQViewModelColl = [];
   }
   isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }
  ngOnInit() {
    localStorage.setItem('pageName', "My Liked RFQs");
    // this.getRfqList();
  }
  // openGridView() {
  //   this.isTilesView = false;
  //   this.isGridView = true;
  // }
  // openTilesView() {
  //   this.isTilesView = true;
  //   this.isGridView = false;
  // }
  // // API Call Function
  // get loggedCompanyId() {
  //   // tslint:disable-next-line:radix
  //   return parseInt(localStorage.getItem('loggedCompanyId'));
  // }
  // get loggedId() {
  //   // tslint:disable-next-line:radix
  //   return parseInt(localStorage.getItem('LoggedId'));
  // }
  // goToRfqDdetails (id) {
  //   localStorage.setItem('supplierRfqDetailId', id);
  //   const data = this.items.find(m => m.rfqId === id);
  //   localStorage.setItem('suppCurrentRfqName', data.rfqName);
  //   localStorage.setItem('suppCurrentRfqDate', data.rfqCreatedOn);
  // //  localStorage.setItem('suppCurrentRfqStatusId', data.rfqStatusId.toString());
  //   localStorage.setItem('suppCurrentRfqStatusId', '3');
  //   this.router.navigate(['/supplier/supplerRfqDetails']);
  // }
  // getRfqList() {
  //   this.isLoader = true;
  //   this._SupplierService.getSupplierRfq(this.loggedId, this.loggedCompanyId, 4).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this.iRFQViewModelColl =  result['data'];
  //       if (this.iRFQViewModelColl.length !== 0) {
  //         this.totalRfq = this.iRFQViewModelColl.length;
  //         this.isLoader = false;
  //         this.setStatusFilter(this.activeStatusFilterBtn);
  //         this.filteredItems = this.iRFQViewModelColl.sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //         this.init();
  //       } else {
  //         this.totalRfq = this.iRFQViewModelColl.length;
  //         this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
  //         this.isLoader = false;
  //         this.isRfqAvailable = true;
  //         this.items = [];
  //       }
  //       } else {
  //         this.totalRfq = this.iRFQViewModelColl.length;
  //         this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
  //         this.isLoader = false;
  //         this.isRfqAvailable = true;
  //         this.items = [];
  //       }

  //     },
  //     error => {
  //       this._toastr.error(error, 'Error!');
  //     },
  //     () => { }
  //   );
  // }
  // getCountsOfRfqs() {
  //   // this.isLoader = true;
  //   this._rfqService.getSupplierRfqCount(this.loggedId, this.loggedCompanyId).subscribe(
  //     result => {
  //       this.iRFQViewModel = result;
  //       const abc = JSON.stringify(this.iRFQViewModel);
  //       this._rfqService.set(abc, 'rfqCount');
  //     },
  //     error => {
  //       this._toastr.error(error, 'Error!');
  //     },
  //     () => { }
  //   );
  // }
  // initiRfqSupplierLikesViewModel () {
  //   this.iRfqSupplierLikesViewModel = {
  //     rfqSupplierLikesId: 0,
  //     rfqId: 0,
  //     contactId: 0,
  //     companyId: 0,
  //     isRfqLike: null,
  //     isRfqDisLike: null,
  //     likeDate: null,
  //     errorMessage: '',
  //     result: false,
  //   };
  // }
  // removeDisLikeRfq(rfqId, isLike, isDislike) {
  //   this.initiRfqSupplierLikesViewModel();
  //   const currentDate = new Date();
  //   const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
  //   if (!currentRfq.result) {
  //     currentRfq.result = true;
  //     this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
  //     this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
  //     this.iRfqSupplierLikesViewModel.rfqId = rfqId;
  //     this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
  //     this.iRfqSupplierLikesViewModel.isRfqLike = isLike;
  //     this.iRfqSupplierLikesViewModel.likeDate = currentDate;
  //     this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
  //       result => {
  //         this.iRfqSupplierLikesViewModel = result['data'];
  //         if (result['result'] === true) {
  //           let data = this._rfqService.get('likedRfqCount');
  //           if (data !== 0) {
  //             data = data - 1;
  //             this._rfqService.set(data, 'likedRfqCount');
  //           }
  //            this.getRfqList();
  //           this.initiRfqSupplierLikesViewModel();
  //           currentRfq.result = false;
  //           this._toastr.success(result['errorMessage'], 'Success!');
  //         } else {
  //           this._toastr.error(result['errorMessage'], 'Error!');
  //         }
  //       },
  //       error => {
  //         this._toastr.error(error, 'Error!');
  //         console.log(error);
  //       },
  //       () => { }
  //     );
  //   }
  // }
  // disLikeRfq(rfqId, isLike, isDislike) {
  //   this.initiRfqSupplierLikesViewModel();
  //   const currentDate = new Date();
  //   const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
  //   if (!currentRfq.result) {
  //     currentRfq.result = true;
  //     this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
  //     this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
  //     this.iRfqSupplierLikesViewModel.rfqId = rfqId;
  //     this.iRfqSupplierLikesViewModel.isRfqLike = false;
  //     this.iRfqSupplierLikesViewModel.isRfqDisLike = true;
  //     this.iRfqSupplierLikesViewModel.likeDate = currentDate;

  //     this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
  //       result => {
  //         this.iRfqSupplierLikesViewModel = result['data'];
  //         if (result['result'] === true) {
  //           let data = this._rfqService.get('likedRfqCount');
  //           if (data !== 0) {
  //             data = data - 1;
  //             this._rfqService.set(data, 'likedRfqCount');
  //           }
  //           // this.getCountsOfRfqs();
  //            this.getRfqList();
  //           this.initiRfqSupplierLikesViewModel();
  //           currentRfq.result = false;
  //           this._toastr.success(result['errorMessage'], 'Success!');
  //         } else {
  //           this._toastr.error(result['errorMessage'], 'Error!');
  //         }
  //       },
  //       error => {
  //         this._toastr.error(error, 'Error!');
  //         console.log(error);
  //       },
  //       () => { }
  //     );
  //   }
  // }
  // removelikeRfq(rfqId, isLike, isDislike) {
  //   this.initiRfqSupplierLikesViewModel();
  //   const currentDate = new Date();
  //   const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
  //   if (!currentRfq.result) {
  //     currentRfq.result = true;
  //     this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
  //     this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
  //     this.iRfqSupplierLikesViewModel.rfqId = rfqId;
  //     this.iRfqSupplierLikesViewModel.isRfqLike = false;
  //     this.iRfqSupplierLikesViewModel.isRfqDisLike = isDislike;
  //     this.iRfqSupplierLikesViewModel.likeDate = currentDate;
  //     this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
  //       result => {
  //         this.iRfqSupplierLikesViewModel = result['data'];
  //         if (result['result'] === true) {
  //           let data = this._rfqService.get('likedRfqCount');
  //           data = data - 1;
  //           this._rfqService.set(data, 'likedRfqCount');
  //           // this.getCountsOfRfqs();
  //           this.initiRfqSupplierLikesViewModel();
  //            this.getRfqList();
  //           currentRfq.result = false;
  //           this._toastr.success(result['errorMessage'], 'Success!');
  //         } else {
  //           this._toastr.error(result['errorMessage'], 'Error!');
  //         }
  //       },
  //       error => {
  //         this._toastr.error(error, 'Error!');
  //         console.log(error);
  //       },
  //       () => { }
  //     );
  //   }
  // }
  // init() {
  //   this.currentIndex = 1;
  //   this.pageStart = 1;
  //   this.pages = 3;
  //   // tslint:disable-next-line:radix
  //   this.pageNumber = parseInt('' + (this.filteredItems.length / this.pageSize));
  //   if (this.filteredItems.length % this.pageSize !== 0) {
  //     this.pageNumber++;
  //   }
  //   if (this.pageNumber < this.pages) {
  //     this.pages = this.pageNumber;
  //   }
  //   this.refreshItems();
  // }

  // fillArray(): any {
  //   const obj = new Array();
  //   for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
  //     obj.push(index);
  //   }
  //   return obj;
  // }
  // ChangeinputLength() {
  //   this.pageSize = this.inputLength;
  //   this.init();
  // }
  // refreshItems() {
  //   this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
  //   this.pagesIndex = this.fillArray();
  //   this.sortFilter();
  // }
  // // Previous button code
  // prevPage() {
  //   if (this.currentIndex > 1) {
  //     this.currentIndex--;
  //   }
  //   if (this.currentIndex < this.pageStart) {
  //     this.pageStart = this.currentIndex;
  //   }
  //   this.refreshItems();
  // }

  // // Next Button Code
  // nextPage() {
  //   if (this.currentIndex < this.pageNumber) {
  //     this.currentIndex++;
  //   }
  //   if (this.currentIndex >= (this.pageStart + this.pages)) {
  //     this.pageStart = this.currentIndex - this.pages + 1;
  //   }

  //   this.refreshItems();
  // }
  //  // periticluar page no selection function
  //  setPage(index: number) {
  //   this.currentIndex = index;
  //   this.refreshItems();
  // }

  // // API Call Function Ends
  // // List functions

  // setStatusFilter(btnState: string) {
  //   this.activeStatusFilterBtn = btnState;
  //   this.isLoader = true;
  //   this.iFilteredRFQViewModelColl = [];
  //   if (btnState === 'All') {
  //     this.items = this.iRFQViewModelColl;
  //   } else if (btnState === 'Active') {
  //     // tslint:disable-next-line:radix
  //     this.items = this.iRFQViewModelColl.filter(x => (x.rfqStatusId === 3) || (x.rfqStatusId === 15));
  //   } else if (btnState === 'Archived') {
  //     // tslint:disable-next-line:radix
  //     this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === 13);
  //   }
  //   if (this.items.length === 0) {
  //     this.isLoader = false;
  //     this.isRfqAvailable = true;
  //     this.items = [];
  //   } else {
  //     this.isLoader = false;
  //     this.isRfqAvailable = false;
  //     if (this.stateFilterValue !== '') {
  //       // tslint:disable-next-line:radix
  //       this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue));
  //     }
  //     if (this.stateFilterValue === '') {
  //       // tslint:disable-next-line:radix
  //       this.items = this.items;
  //     }
  //     if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
  //       this.items = this.iFilteredRFQViewModelColl.filter(x => x.rfqName.startsWith(this.searchFilterValue));
  //     }
  //     if (this.searchFilterValue !== '' && this.stateFilterValue !== '') {
  //       this.items = this.iFilteredRFQViewModelColl.filter(x => x.rfqName.startsWith(this.searchFilterValue));
  //     }
  //     if (this.items.length === 0) {
  //       this.isLoader = false;
  //       this.isRfqAvailable = true;
  //       this.items = [];
  //     } else {
  //       this.isLoader = false;
  //       this.isRfqAvailable = false;
  //       switch (this.sortFilterValue) {
  //         case 'Recent': {
  //           this.items = this.iFilteredRFQViewModelColl.sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //           break;
  //         }
  //         case 'Oldest': {
  //           this.items = this.iFilteredRFQViewModelColl.sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //           break;
  //         }
  //         case 'A - Z': {
  //           this.items = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //           break;
  //         }
  //         case 'Z - A': {
  //           this.items = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //           break;
  //         }
  //         default: {
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }

  // searchFilter(searchValue: string) {
  //   this.isLoader = true;
  //   this.iFilteredRFQViewModelColl = [];
  //   if (this.stateFilterValue !== '') {
  //     this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(
  //       x => x.rfqName.toLowerCase().startsWith(searchValue.toLowerCase()) ||
  //         x.rfqId.toString().startsWith(searchValue) &&
  //         // tslint:disable-next-line:radix
  //         x.rfqStatusId === parseInt(this.stateFilterValue)
  //     );
  //   } else {
  //     this.iFilteredRFQViewModelColl = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase().startsWith(searchValue.toLowerCase())
  //       || x.rfqId.toString().startsWith(searchValue));
  //   }
  //   if (this.iFilteredRFQViewModelColl.length === 0) {
  //     this.isLoader = false;
  //     this.isRfqAvailable = true;
  //     this.items = [];
  //   } else {
  //     this.isLoader = false;
  //     this.isRfqAvailable = false;
  //     switch (this.sortFilterValue) {
  //       case 'Recent': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //         break;
  //       }
  //       case 'Oldest': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //         break;
  //       }
  //       case 'A - Z': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //         break;
  //       }
  //       case 'Z - A': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   }
  // }

  // stateFilter() {
  //   this.isLoader = true;
  //   this.iFilteredRFQViewModelColl = [];
  //   if (this.stateFilterValue !== '') {
  //     // tslint:disable-next-line:radix
  //     this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue));
  //   }
  //   if (this.stateFilterValue === '') {
  //     // tslint:disable-next-line:radix
  //     this.iFilteredRFQViewModelColl = this.iRFQViewModelColl;
  //   }
  //   if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
  //     this.items = this.iRFQViewModelColl.filter(x => x.rfqName.toLowerCase()
  //       .startsWith(this.searchFilterValue.toLowerCase()));
  //   }
  //   if (this.searchFilterValue !== '' && this.stateFilterValue !== '') {
  //     this.items = this.iFilteredRFQViewModelColl.filter(x => x.rfqName.toLowerCase()
  //       .startsWith(this.searchFilterValue.toLowerCase()));
  //   }
  //   if (this.items.length === 0) {
  //     this.isLoader = false;
  //     this.isRfqAvailable = true;
  //     this.items = [];
  //   } else {
  //     this.isLoader = false;
  //     this.isRfqAvailable = false;
  //     switch (this.sortFilterValue) {
  //       case 'Recent': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //         break;
  //       }
  //       case 'Oldest': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //         break;
  //       }
  //       case 'A - Z': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //         break;
  //       }
  //       case 'Z - A': {
  //         this.items = this.iFilteredRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   }
  // }
  // sortFilter() {
  //   this.iFilteredRFQViewModelColl = [];
  //   switch (this.sortFilterValue) {
  //     case 'Recent': {
  //       if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqName
  //           .toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
  //           .sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue)
  //           && x.rfqName.toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //       }
  //       if (this.searchFilterValue === '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.sort((a, b) => b.quotesNeededBy.localeCompare(a.quotesNeededBy));
  //       } else {

  //       }
  //       break;
  //     }
  //     case 'Oldest': {

  //       if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqName
  //           .toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
  //           .sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue)
  //           && x.rfqName.toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //       }
  //       if (this.searchFilterValue === '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.sort((a, b) => a.quotesNeededBy.localeCompare(b.quotesNeededBy));
  //       } else {

  //       }
  //       break;
  //     }
  //     case 'A - Z': {
  //       if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqName
  //           .toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
  //           .sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue)
  //           && x.rfqName.toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //       }
  //       if (this.searchFilterValue === '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.sort((a, b) => a.rfqName.localeCompare(b.rfqName));
  //       } else {

  //       }
  //       break;
  //     }
  //     case 'Z - A': {

  //       if (this.searchFilterValue !== '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqName
  //           .toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue === '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue))
  //           .sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //       }
  //       if (this.stateFilterValue !== '' && this.searchFilterValue !== '') {
  //         // tslint:disable-next-line:radix
  //         this.items = this.iRFQViewModelColl.filter(x => x.rfqStatusId === parseInt(this.stateFilterValue)
  //           && x.rfqName.toLowerCase().startsWith(this.searchFilterValue.toLowerCase()))
  //           .sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //       }

  //       if (this.searchFilterValue === '' && this.stateFilterValue === '') {
  //         this.items = this.iRFQViewModelColl.sort((a, b) => b.rfqName.localeCompare(a.rfqName));
  //       } else {

  //       }
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  //   if (this.items.length === 0) {
  //     this.isLoader = false;
  //     this.isRfqAvailable = true;
  //     this.items = [];
  //   } else {
  //     this.isLoader = false;
  //     this.isRfqAvailable = false;
  //   }

  // }
  // getLoadableImg(originalFileName: string) {
  //   return this.defaultAwsPath + originalFileName;
  // }

  // List Functions Ends

}
