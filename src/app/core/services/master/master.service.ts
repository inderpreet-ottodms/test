import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpErrorResponse, HttpParams } from '@angular/common/http';
 import { Observable,throwError } from 'rxjs';
//  import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
 import { catchError, retry } from 'rxjs/operators';
 
 import { IEmployeesCountRangeModel, IIndustriesModel, ILanguageModel, IRegionModel, ICategory,
  IMaterial, IPostProdProcesses, IQuantityUnit, ICountryViewModel,
   ICertificationViewModel, IIndustryBranchesModel, SupplierTypeViewModel, EmployeesCountRangeViewModel, CurrencyList} from '../../models/globalMaster';
import { IPartLibraryModel, IPartFilterViewModel } from '../../models/partModel';
import { DataService } from '../data.service';
import { IManufacturersViewModel, IIndividualList, ITerritoryClassificationModel } from './../../models/rfqModel';
import { IToleranceViewModel } from '../../models/supplierProfileModel';
import { ILeadUserViewModel,IRequestDemoLinkModel, ILeadsStreamFilterViewModel, ILeadStreamDashboardRollUpViewModel } from '../../models/profileModel';

@Injectable()
export class MasterService {


  moduleUrl: string;

  constructor(private _dataService: DataService) { }




  getPartLibrary(contactId: number, searchText: string): Observable<IPartLibraryModel[]> {
    // contactId = 62;
    // contactId = 195886;
    // contactId = 195886; searchText = test;
    this.moduleUrl = 'RFQ/GetPartsList?ContactId=' + contactId;
    if (searchText !== '') {
      this.moduleUrl += '&SearchText=' + searchText;
    }
    return this._dataService.getAll(this.moduleUrl);
  }
  getPartLibraryNew(iPartFilterViewModel: IPartFilterViewModel): Observable<IPartLibraryModel[]> {
    this.moduleUrl = 'RFQ/GetPartsListNew';
    return this._dataService.add(this.moduleUrl, iPartFilterViewModel);
  }
  getIndustryType(): Observable<IIndustriesModel[]> {
    this.moduleUrl = 'Master/GetIndustryType';
    return this._dataService.getAll(this.moduleUrl);
  }

  getLanguages(): Observable<ILanguageModel[]> {
    this.moduleUrl = 'Master/GetLanguages';
    return this._dataService.getAll(this.moduleUrl);
  }

  getEmployeesCountRange(): Observable<IEmployeesCountRangeModel[]> {
    this.moduleUrl = 'Master/GetEmployeesCountRange';
    return this._dataService.getAll(this.moduleUrl);
  }

  getState(countryId: string): Observable<IRegionModel[]> {
    this.moduleUrl = 'Master/GetState?CountryId=' + countryId + '';
    return this._dataService.getAll(this.moduleUrl);
  }
  GetStateByTerritoryClassification(TerritoryId: string): Observable<IRegionModel[]> {
    this.moduleUrl = 'Master/GetStateByTerritoryClassification?TerritoryId=' + TerritoryId + '';
    return this._dataService.getAll(this.moduleUrl);
  }
  GetStateByMultiTerritoryClassification(TerritoryIds: any): Observable<IRegionModel[]> {
    this.moduleUrl = 'GetStateListByTerritoryClassification';
    return this._dataService.add(this.moduleUrl,TerritoryIds);
  }
  getQuantityUnit(): Observable<IQuantityUnit[]> {
    // console.log("inside getQuantityUnit")
    this.moduleUrl = 'Master/GetQuantityUnit';
    return this._dataService.getAll(this.moduleUrl);
  }
  getCategory(): Observable<ICategory[]> {
    this.moduleUrl = 'Master/GetCategory';
    return this._dataService.getAll(this.moduleUrl);
  }
  getPostProdProcesses(): Observable<IPostProdProcesses[]> {
    this.moduleUrl = 'Master/GetPostProdProcesses';
    return this._dataService.getAll(this.moduleUrl);
  }
  getCountry(): Observable<ICountryViewModel[]> {
    this.moduleUrl = 'Master/GetCountries';
    return this._dataService.getAll(this.moduleUrl);
  }
  getProximity(): Observable<any> {
    this.moduleUrl = 'Master/GetProximity';
    return this._dataService.getAll(this.moduleUrl);
  }

  getSupplierList(searchText: string, contactId: number): Observable<IIndividualList[]> {
    if (searchText !== '' || searchText !== undefined) {
      this.moduleUrl = 'RFQ/GetIndividual?searchParam=' + searchText + '&contactId=' + contactId;
    } else {
      this.moduleUrl = 'RFQ/GetIndividual?contactId=' + contactId;
    }
    return this._dataService.getAll(this.moduleUrl);
  }
  getManuGroupList(searchText: string, contactId: number): Observable<IManufacturersViewModel[]> {
    if (searchText !== '' || searchText !== undefined) {
      this.moduleUrl = 'RFQ/GetGroups?searchParam=' + searchText + '&contactId=' + contactId;
    } else {
      this.moduleUrl = 'RFQ/GetGroups?contactId=' + contactId;
    }
    return this._dataService.getAll(this.moduleUrl);
  }
  GetTerritoryClassification(): Observable<ITerritoryClassificationModel[]> {
    this.moduleUrl = 'Master/GetTerritoryClassification';
    return this._dataService.getAll(this.moduleUrl);
  }
  getCertificate(companyId: number): Observable<ICertificationViewModel[]> {
    if (companyId === null) {
      this.moduleUrl = 'Master/SpecialCertificateList';
    } else {
      this.moduleUrl = 'Master/SpecialCertificateList?CompanyId=' + companyId;
    }
    return this._dataService.getAll(this.moduleUrl);
  }

  getTolerance(): Observable<IToleranceViewModel[]> {
    this.moduleUrl = 'Master/GetTolerance';
    return this._dataService.getAll(this.moduleUrl);
  }
  GetIndustryBranches(): Observable<IIndustryBranchesModel[]> {
    this.moduleUrl = 'Master/GetIndustryBranches';
    return this._dataService.getAll(this.moduleUrl);
  }

  getCompanyTypes(): Observable<SupplierTypeViewModel[]> {
    this.moduleUrl = 'Master/GetAllCompanyTypes';
    return this._dataService.getAll(this.moduleUrl);
  }
  GetCompanyTypesForBuyers(): Observable<IIndustryBranchesModel[]> {
    this.moduleUrl = 'Master/GetCompanyTypesForBuyers';
    return this._dataService.getAll(this.moduleUrl);
  }

  getEmployeeRange(): Observable<EmployeesCountRangeViewModel[]> {
    this.moduleUrl = 'Master/GetEmployeesCountRange';
    return this._dataService.getAll(this.moduleUrl);
  }
  setSetLeadUser(iLeadUserViewModel: ILeadUserViewModel): Observable<any> {
    this.moduleUrl = 'Leads/SetLeadUser';
    return this._dataService.add(this.moduleUrl, iLeadUserViewModel);
  }
  requestDemoLink(iRequestDemoLinkModel: IRequestDemoLinkModel): Observable<any> {
    this.moduleUrl = 'GetStarted/ContactMFG';
    return this._dataService.add(this.moduleUrl, iRequestDemoLinkModel);
  }
  getLeadRecords(iLeadsStreamFilterViewModel: ILeadsStreamFilterViewModel): Observable<any> {
    this.moduleUrl = 'Leads/GetLeadRecords';
    return this._dataService.add(this.moduleUrl, iLeadsStreamFilterViewModel);
  }
  GetQMSPaymentTerm(): Observable<any> {
    this.moduleUrl = 'Master/GetQMSPaymentTerm';
    return this._dataService.getAll(this.moduleUrl);
  }

  GetQMSShippingMethod(): Observable<any> {
    this.moduleUrl = 'Master/GetQMSShippingMethod';
    return this._dataService.getAll(this.moduleUrl);
  }

  GetQMSStatus(key : string): Observable<any> {
    this.moduleUrl = 'Master/GetQMSStatus?key=' + key ;
    return this._dataService.getAll(this.moduleUrl);
  }
  getLeadStreamCount(iLeadStreamDashboardRollUpViewModel: ILeadStreamDashboardRollUpViewModel): Observable<any> {
    this.moduleUrl = 'Leads/GetLeadStreamDashboardRollUp';
    return this._dataService.add(this.moduleUrl, iLeadStreamDashboardRollUpViewModel);
  }
  getCurrency(): Observable<CurrencyList[]> {
    this.moduleUrl = 'Master/GetCurrencyData';
    return this._dataService.getAll(this.moduleUrl);
  }
  getQmsQuoteInvoiceStatus(): Observable<any> {
    this.moduleUrl = 'Master/getQmsQuoteInvoiceStatus';
    return this._dataService.getAll(this.moduleUrl);
  }
  getDefaultQmsDecimalPlaces(contactId:number): Observable<any> {
    this.moduleUrl = 'Master/GetDefaultQmsDecimalPlaces?contactId='+ contactId;
    return this._dataService.getAll(this.moduleUrl);
  }
  getLeadStreamMessage(leadId:number): Observable<any> {
    this.moduleUrl = 'LeadsEmailInfo?leadId='+ leadId;
    return this._dataService.getAll(this.moduleUrl);
  }
  getEmailVerificationStatus(buyerLoginId: number): Observable<any> {
    this.moduleUrl = 'AccountEmailVerification?buyerContactId='+buyerLoginId;
    return this._dataService.getAll(this.moduleUrl);
  }
  sendVerificationLink(buyerLoginId:number): Observable<any> {
    this.moduleUrl = 'AccountEmailVerification?buyerContactId='+buyerLoginId;
    return this._dataService.add(this.moduleUrl,'');
  }
  getRfqTerritory(rfqId: number[]): Observable<any> {
    this.moduleUrl = 'BuyerRFQAwardTileManfufactureLoaction';
    let obj = {'rfqId': rfqId};
    return this._dataService.add(this.moduleUrl,obj);
  }
  getMasterFeedbackList(): Observable<any> {
    this.moduleUrl = 'Master/GetBuyerFeedback';
    return this._dataService.getAll(this.moduleUrl);
  }





  getAuthentication(authorizationCode: string,uniqueStateString: string = "", mfgAuthorizedRedirectionUrl: string= "" ): Observable<any> {
    this.moduleUrl = 'AuthenticateLinkedInUser';
    let obj = {
                'authorizationCode': authorizationCode,
                'mfgAuthorizedRedirectionUrl':mfgAuthorizedRedirectionUrl,
                'uniqueStateString':uniqueStateString
              };
    return this._dataService.add(this.moduleUrl,obj);
  }

  ssoSignUp(userInfo): Observable<any> {
    // userInfo.userIpAddress = this.ipAddress;
    this.moduleUrl = 'UserRegistration';
    return this._dataService.add(this.moduleUrl,userInfo);
  }
  getCommunityUrl(companyId:number): Observable<any> {
    this.moduleUrl = 'Public/GetCommunityPublicProfileUrl?companyId='+companyId;
    return this._dataService.getAll(this.moduleUrl,'');
  }

}
