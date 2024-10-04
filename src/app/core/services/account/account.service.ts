import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
, 
  Subject
} from 'rxjs';
import {
  IContactViewModel,
  IViewProfileFilterViewModel,
  IAdminUserViewModel,
  IInviteUserContactViewModel,
  IEmailModel,
  SubscriptionReceiptViewModel
} from '../../models/accountModel';
import {
  IInviteUserViewModel
} from '../../models/profileModel';
import {
  DataService, DataStatusService
} from '../data.service';
import { SSODataHandler } from '../../../component/SSO/SSODataHandler';
@Injectable()
export class AccountService {

  moduleUrl: string;
  userview: IContactViewModel;
  data: any = {
    rfqId: 0
  };
  ipAddress: any;
  private subject = new Subject < any > ();
  constructor(private _dataService: DataService, private _httpClient: HttpClient,private _paymentDataService :DataStatusService) {}

  set(data: any, key: string) {
    this.data[key] = data;
  }

  get(key: string) {
    return this.data[key];
  }
  add(jobPostingModel: IContactViewModel): Observable < any > {
    this.moduleUrl = 'account';
    return this._dataService.add(this.moduleUrl, jobPostingModel);
  }

  resetPassword(jobPostingModel: IContactViewModel): Observable < IContactViewModel > {
    this.moduleUrl = 'account';
    return this._dataService.UpdateWithoutId(this.moduleUrl, jobPostingModel);
  }

  getUser(contactmodel: IContactViewModel): Observable < any > {
    this.moduleUrl = 'account/Authenticate';
    return this._dataService.add(this.moduleUrl, contactmodel);
  }
  emailUs(iEmailModel: IEmailModel): Observable < IEmailModel > {
    this.moduleUrl = 'Contact/ExternalEnquirySendMail';
    return this._dataService.add(this.moduleUrl, iEmailModel);
  }

  emailUspublic(iEmailModel: IEmailModel): Observable < IEmailModel > {
    this.moduleUrl = 'Public/ExternalEnquirySendMail';
    return this._dataService.add(this.moduleUrl, iEmailModel);
  }

  ChangePassword(contactmodel: IContactViewModel): Observable < IContactViewModel > {
    this.moduleUrl = 'account/ChangePassword';
    return this._dataService.UpdateWithoutId(this.moduleUrl, contactmodel);
  }

  forgotPassword(contactmodel: IContactViewModel): Observable < IContactViewModel > {
    this.moduleUrl = 'Account/ForgetPasswordRequest?Email=' + contactmodel.emailId + '' + '&IsVisionUser=false';
    return this._dataService.getSingle(this.moduleUrl, '');
  }

  addConvertConatct(contactmodel: IContactViewModel): Observable < any > {
    contactmodel.userIpAddress = this.ipAddress;
    this.moduleUrl = 'Contact/ConvertContact';
    return this._dataService.add(this.moduleUrl, contactmodel);
  }

  swicthContact(userid: string, role: string, isLoginFromVision: boolean): Observable < any > {
    this.moduleUrl = 'Account/SwitchContact?userid=' + userid + '&role=' + role + '&IsLoginFromVision=' + isLoginFromVision;
    return this._dataService.add(this.moduleUrl, '');
  }

  GetContactsProfileViewList(viewProfileFilterModel: IViewProfileFilterViewModel): Observable < any > {
    this.moduleUrl = 'Contact/GetContactsProfileViewList';
    return this._dataService.add(this.moduleUrl, viewProfileFilterModel);
  }

  sendMessage(message: string) {
    this.subject.next({
      text: message
    });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable < any > {
    return this.subject.asObservable();
  }

  sendInviteUserEmail(iInviteUserModel: IInviteUserViewModel): Observable < any > {
    this.moduleUrl = 'Account/SendInviteUserEmail';
    return this._dataService.add(this.moduleUrl, iInviteUserModel);
  }

  getUsersList(CompanyId: number, isBuyer: boolean, isSupplier: boolean, isAdmin: boolean): Observable < IAdminUserViewModel[] > {
    // tslint:disable-next-line:max-line-length
    this.moduleUrl = 'Account/GetUsersList?CompanyId=' + CompanyId + '&IsBuyer=' + isBuyer + '&IsSupplier=' + isSupplier + '&IsAdmin=' + isAdmin;
    return this._dataService.getAll(this.moduleUrl);
  }

  validateNewUserInvitationLink(iInviteUserModel: IInviteUserViewModel): Observable < IInviteUserContactViewModel > {
    this.moduleUrl = 'Account/ValidateNewUserInvitationLink';
    return this._dataService.add(this.moduleUrl, iInviteUserModel);
  }

  submitNewUserInvitationLink(contactmodel: any): Observable < any > {
    contactmodel.userIpAddress = this.ipAddress;
    this.moduleUrl = 'Account/SubmitNewUserInvitationLink';
    return this._dataService.add(this.moduleUrl, contactmodel);
  }

  activeDeactiveUser(contactId: number, isActive: boolean): Observable < any > {
    this.moduleUrl = 'Contact/UpdateActiveStatus?contactId=' + contactId + '&isActive=' + isActive;
    return this._dataService.add(this.moduleUrl, '');
  }

  updateEmail(contactId: string, userEmail: string, isActive: boolean, loginId: number): Observable < any > {
    this.moduleUrl = 'Account/UpdateUsername?userId=' + contactId + '&newUsername=' + userEmail + '&isChangeEmail=' + isActive +'&contactId='+ loginId;
    return this._dataService.updatePass(this.moduleUrl, '');
  }

  GetSubscriptionInvoiceData(CompanyId: number, ContactId: number): Observable < SubscriptionReceiptViewModel > {
    this.moduleUrl = 'Supplier/GetSubscriptionInvoiceData?CompanyId=' + CompanyId + '&ContactId=' + ContactId;
    return this._dataService.getAll(this.moduleUrl);
  }

  setEmailActivation(token: any): Observable < any > {
    this.moduleUrl = 'AccountEmailVerification?token='+token;
    return this._dataService.UpdateWithoutId(this.moduleUrl, '');
  }
  getDecryptContactLoginInfo(token: any): Observable < any > {
    this.moduleUrl = 'Account/DecryptContactLoginInfo?EncryptedContactLoginInfo='+token;
    return this._dataService.add(this.moduleUrl, '');
  }
  getSSOAuthentication(token: string): Observable < any > {
      if(SSODataHandler.IsSSOAuthentication)
      {
        SSODataHandler.IsSSOAuthentication = false;
        this.moduleUrl = 'Account/Authenticate?token=' + token + '&source=' + SSODataHandler.Source +'&memberId='+ SSODataHandler.RegistrationInfo.sSOMemberId;
        SSODataHandler.Source = null;
        return this._dataService.getAll(this.moduleUrl, '');
      }
      else
      {
        this.moduleUrl = 'Account/DecryptContactLoginInfo?EncryptedContactLoginInfo='+token;
        return this._dataService.add(this.moduleUrl, '');
      }
  }

  Login(contactmodel: IContactViewModel): Observable < any > {
    this.moduleUrl = 'account/Authenticate';
    return this._paymentDataService.add(this.moduleUrl, contactmodel);
  }

  getLoginLinkInUrl(securityKey:any, redirectionUrl:any): Observable < any > {
    let tempObj={
      'mfgInternalSecurityKey':securityKey,
      'mfgAuthorizedRedirectionUrl':redirectionUrl
    }
    this.moduleUrl = 'LinkedInAuthorizationUrl';//?mfgInternalSecurityKey='+securityKey+'&mfgAuthorizedRedirectionUrl='+ redirectionUrl;
    return this._dataService.add(this.moduleUrl, tempObj);
  }
  setUserDetails(userDetails: any): Observable < any > {
    this.moduleUrl = 'LinkedInUserRegistration';
    return this._dataService.add(this.moduleUrl, userDetails);
  }
  getSupplierValidation(userLogin: string): Observable < any > {
    // return this.rest.get('ValidateCommunitySupplier?supplierEmail=' + userLogin);
    this.moduleUrl = 'ValidateCommunitySupplier?supplierEmail='  + userLogin;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  
  setUserRole(userId: string, roleId: any, isBuyer: any): Observable < any > {
    this.moduleUrl = 'Account/SetUserRole?userId=' + userId + '&isAdmin=' + roleId+'&isBuyer='+isBuyer;
    return this._dataService.add(this.moduleUrl, '');
  }
  
  getVisionRoleList(): Observable<any> {
    this.moduleUrl = 'Master/GetVisionUserRoles';
    return this._dataService.getAll( this.moduleUrl, '');
  }
}
