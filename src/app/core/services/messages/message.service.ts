import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

 import { DataService } from '../data.service';


 @Injectable()
 export class AppMessageService {
    moduleUrl: string;
     constructor(private _dataService: DataService) { }
     GetNotifications(): Observable<any> {
        this.moduleUrl = 'Messages/BrodcastNotifications';
        return this._dataService.getAll(this.moduleUrl);
      }

      CloseBroadcastNotification(messageId): Observable<any> {
        this.moduleUrl = 'Messages/CloseBroadcastNotification?messageId='+messageId;
        return this._dataService.addWithoutModel(this.moduleUrl,'');
      }
 }
