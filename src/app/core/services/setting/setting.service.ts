import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { DataService } from '../data.service';
import { IPreferrenceModel, INDAViewModel, ISettingsNotificationModel} from '../../models/settingsModel';
import { Observable } from 'rxjs';
@Injectable()
export class SettingService {
  moduleUrl: string;


  constructor(private _dataService: DataService, private _httpClient: HttpClient) {

  }

  add(jobPostingModel: IPreferrenceModel): Observable<IPreferrenceModel> {
    this.moduleUrl = 'account';
    return this._dataService.add(this.moduleUrl, jobPostingModel);
  }

  addSettingPreferrence(preferrenceModel: IPreferrenceModel): Observable<IPreferrenceModel> {


    this.moduleUrl = 'Setting';
    return this._dataService.UpdateWithoutId(this.moduleUrl, preferrenceModel);
  }
  public getCustomNda() {
    this.moduleUrl = 'Master/GetDictionaryKeyValue?key=MFGSITE_DEFAULT_NDA_TEXT';
    return this._dataService.getSingle(this.moduleUrl, '');
  }
  /* Method to get Setting Info for Contact*/
  getSetting(id: any): Observable<IPreferrenceModel> {
    this.moduleUrl = 'Setting/GetPreferencesById?ContactId=';
    return this._dataService.getSingle(this.moduleUrl, id);
  }

  getNdaInfo (id: number): Observable<INDAViewModel> {
    this.moduleUrl = 'Setting/GetNDAById?Cont_Id=';
    return this._dataService.getSingle(this.moduleUrl, id);
  }
  getNotificationSettings(id: any): Observable<ISettingsNotificationModel> {
    this.moduleUrl = 'Setting/GetNotification?id=';
    return this._dataService.getSingle(this.moduleUrl, id);
  }

  addNotificationSettings(iSettingsNotificationModel: ISettingsNotificationModel): Observable<ISettingsNotificationModel> {
    this.moduleUrl = 'Setting';
    return this._dataService.add(this.moduleUrl, iSettingsNotificationModel);
  }
  addNdaSettings(iSettingsNotificationModel: INDAViewModel): Observable<INDAViewModel> {
    this.moduleUrl = 'Setting/PutNDA';
    return this._dataService.updatePass(this.moduleUrl, iSettingsNotificationModel);
  }

  removeCustomNDAfromRFQ(ndaFileName: string, contactID: number, rfqID: number): Observable<any> {
    this.moduleUrl = 'RFQ/RemoveCustomNDAFiles?FileName=' + ndaFileName + '&ContactId=' + contactID + '&RfqId=' + rfqID;
    return this._dataService.add(this.moduleUrl, '');
  }
  setQmsTeamCondition( fileObj: any ): Observable<any> {
    this.moduleUrl = 'SettingTermsConditions';
    return this._dataService.add(this.moduleUrl, fileObj);
  }
  getTermCondition( companyId: number, contactId: number ): Observable<any> {
    this.moduleUrl = 'QmsQuoteEmailMessage?SupplierCompanyId=' + companyId + '&SupplierContactId=' + contactId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
}
