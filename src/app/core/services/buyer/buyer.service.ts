import { Injectable } from '@angular/core';
import {Observable,  BehaviorSubject, Subject } from 'rxjs';

import { DataService } from '../data.service';
import { IBuyerCompanyTypeViewModel } from '../../models/globalMaster';

@Injectable()
export class BuyerService {
  moduleUrl: string;
  private ratingCloseEvent = new BehaviorSubject<any>(false);
  private viewProfileEvent = new BehaviorSubject<any>(false);
  private sendMessageEvent = new BehaviorSubject<any>(false);
  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();
  constructor(private _dataService: DataService) { }


   setData(updatedData) {
     console.log(updatedData , 'updatedData')
    this.sharedData.next(updatedData);
  }

  getMessage(): Observable<any> {
    return this.sharedData.asObservable();
  }

  setRatingEvent(flag: any) {
    this.ratingCloseEvent.next( flag );
  }
  getRatingEvent(): Observable<any> {
    return this.ratingCloseEvent.asObservable();
  }
  setProfileEvent(flag: any) {
    this.viewProfileEvent.next( flag );
  }
  getProfileEvent(): Observable<any> {
    return this.viewProfileEvent.asObservable();
  }
  setMessageEvent(flag: any) {
    this.sendMessageEvent.next( flag );
  }
  getMessageEvent(): Observable<any> {
    return this.sendMessageEvent.asObservable();
  }

  getDashAwardModule(buyerId: number): Observable<any> {
    this.moduleUrl = 'AwardingModule?buyerId=' + buyerId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  getRatingsList(buyerId: number): Observable<any> {
    this.moduleUrl = 'RatingModule?buyerId=' + buyerId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  getManufactureList(buyerId: number): Observable<any> {
    this.moduleUrl = 'NewManufacturerModule?buyerId=' + buyerId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  noThanksDashAwardModule(rfqId: number): Observable<any> {
    this.moduleUrl = 'AwardingModule?rfqId=' + rfqId;
    return this._dataService.add(this.moduleUrl, '');
  }
  setViewStatus(obj:any): Observable<any>{
    this.moduleUrl = 'NewManufacturerModule';
    return this._dataService.add(this.moduleUrl, obj);
  }
  setNoThanksStatus(obj:any): Observable<any>{
    this.moduleUrl = 'RatingModule';
    return this._dataService.add(this.moduleUrl, obj);
  }
  checkBuyerCompanyType(buyerCompanyId: number): Observable<any> {
    this.moduleUrl = 'BuyerIndustrySelectionModel?buyerCompanyId=' + buyerCompanyId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  setBuyerCompanyType(iBuyerCompanyTypeViewModel:IBuyerCompanyTypeViewModel): Observable<any>{
    this.moduleUrl = 'BuyerIndustrySelectionModel';
    return this._dataService.add(this.moduleUrl, iBuyerCompanyTypeViewModel);
  }

  likeunLikeCommunityManufacturer(likeUnlikeManufacturerRequestModel: any): Observable<any> {
    this.moduleUrl = 'Buyer/LikeUnLikeCommunityManufacturer';
    return this._dataService.add(this.moduleUrl, likeUnlikeManufacturerRequestModel);
  }

  // set Steps Info Service
  setStepsInformation(stepsInfo:any): Observable<any>{
    this.moduleUrl = 'GetStarted/SaveBuyerEngagementStepInfo';
    return this._dataService.add(this.moduleUrl, stepsInfo);
  }
 

}
