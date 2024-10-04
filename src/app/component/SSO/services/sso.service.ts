import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ApiService } from '../../../__Services/api-service/api.service';
@Injectable()
export class SSOService {

  constructor(private _dataService: DataService, 
    private rest: ApiService) { }

  validateSSOUser(userInfo) : Observable<any>
  {
      return this.rest.post('SSOUserInfo', userInfo)
  }
  ssoSignUp(userInfo) : Observable<any>
  {
    return this.rest.post('UserRegistration', userInfo)
  }
  saveAuthInfo(authInfo:any)
  {
      return this.rest.post('SaveSSOAuthInfo', authInfo);
  }
  getRedirection(userInfo)
  {
    return this.rest.post('SSORedirection', userInfo)
  }

  validateCommunityUser()
  {
    return this.rest.post('memberinfo?source=MFG Community');
  }

  activateCommunityUser(userEmail: string)
  {
    return this.rest.post('ActivateMemberAccount?userEmail=' + userEmail);
  }
  getSupplierValidation(userLogin: string)
  {
    return this.rest.get('ValidateCommunitySupplier?supplierEmail=' + userLogin);
  }
}